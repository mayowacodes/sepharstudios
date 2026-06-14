import { error } from '@sveltejs/kit';
import { and, desc, eq, or, sql } from 'drizzle-orm';
import { db } from '$lib/db/drizzle';
import { mediaLibrary, episodes, mediaWatchProgress, playlists, playlistItems } from '$lib/db/schema/sepharstudios';
import { resolvePlaybackUrl } from '$lib/server/encoder-playback';

/**
 * Shared load function for the audience-specific detail pages
 * (movies / shows / documentaries / kids / teens). The route's own
 * +page.server.ts passes the URL param and the expected `mediaType`
 * filter so a `/movies/<slug>` request can't resolve a TV-series row,
 * and an optional `category` filter so the kids / teens routes only
 * resolve content marked for those audiences.
 *
 * The `slug | uuid` lookup matches the watch route's behaviour — both
 * shapes work, slug is preferred for user-visible URLs.
 *
 * Episodes are fetched only when the row is `tv` (or `series`); for
 * movies + documentaries the array stays empty and the detail page
 * skips its episodes section.
 */
export async function loadMediaDetail(params: {
	slug: string;
	mediaType?: 'movie' | 'tv' | 'documentary' | 'series';
	/** Optional audience filter (`kids` / `teens`). When omitted, only
	 *  general-audience rows resolve (`category IS NULL` OR not in the
	 *  audience-restricted list). Mirrors the /movies catalog rule. */
	category?: 'kids' | 'teens';
	/** Signed-in user's id when available. Drives the "Continue
	 *  watching" CTA — when present we fetch the show-level (no
	 *  episode) watch-progress row so the detail page can surface a
	 *  Resume button. Anonymous viewers always get the standard Watch
	 *  button. */
	userId?: string;
}) {
	const { slug, mediaType, category, userId } = params;

	// mediaType filter — allow both `tv` and `series` as TV identifiers
	// (schema drift over time). The kids routes don't restrict mediaType
	// since a single slug should resolve regardless of whether it's a
	// movie, show, or doc — kids detail pages don't have sub-routes.
	const typeMatches = mediaType
		? mediaType === 'tv'
			? or(eq(mediaLibrary.mediaType, 'tv'), eq(mediaLibrary.mediaType, 'series'))
			: eq(mediaLibrary.mediaType, mediaType)
		: undefined;

	// Category filter — kids and teens routes require category to match
	// so a /kids/kiddies/<slug> request can't resolve a general-audience
	// row that happens to share a slug.
	const categoryMatches = category ? eq(mediaLibrary.category, category) : undefined;

	const [row] = await db
		.select({
			id: mediaLibrary.id,
			slug: mediaLibrary.slug,
			title: mediaLibrary.title,
			description: mediaLibrary.description,
			thumbnail: mediaLibrary.thumbnail,
			backdropUrl: mediaLibrary.backdropUrl,
			posterUrl: mediaLibrary.posterUrl,
			trailerUrl: mediaLibrary.trailerUrl,
			videoUrl: mediaLibrary.videoUrl,
			encoderJobId: mediaLibrary.encoderJobId,
			processingStatus: mediaLibrary.processingStatus,
			ageRating: mediaLibrary.ageRating,
			genres: mediaLibrary.genres,
			topics: mediaLibrary.topics,
			year: mediaLibrary.year,
			duration: mediaLibrary.duration,
			language: mediaLibrary.language,
			bibleReference: mediaLibrary.bibleReference,
			cast: mediaLibrary.cast,
			crew: mediaLibrary.crew,
			mediaType: mediaLibrary.mediaType,
			isActive: mediaLibrary.isActive,
			visibility: mediaLibrary.visibility
		})
		.from(mediaLibrary)
		.where(
			and(
				or(eq(mediaLibrary.id, slug), eq(mediaLibrary.slug, slug)),
				...(typeMatches ? [typeMatches] : []),
				...(categoryMatches ? [categoryMatches] : [])
			)
		)
		.limit(1);

	if (!row || !row.isActive) {
		error(404, 'Content not found');
	}
	if (row.visibility === 'private') {
		// Owners get to see private rows via the watch route; the
		// catalog-style detail pages stay public-facing only.
		error(404, 'Content not found');
	}

	// Resolve playback URL via the same helper the watch + admin GET use,
	// so the preview source matches what playback will actually serve.
	const playbackUrl = resolvePlaybackUrl({
		videoUrl: row.videoUrl,
		encoderJobId: row.encoderJobId,
		processingStatus: row.processingStatus
	});

	// Episodes — only fetched when the row is TV-shaped. Movies + docs
	// always get an empty list (the detail-page section short-circuits).
	let episodeRows: typeof episodes.$inferSelect[] = [];
	if (mediaType === 'tv' || mediaType === 'series' || row.mediaType === 'tv' || row.mediaType === 'series') {
		episodeRows = await db
			.select()
			.from(episodes)
			.where(eq(episodes.showId, row.id));
	}

	// Watch-progress lookup. Most-recent row WINS for the "currently
	// watching" case (positionSeconds >= 15, completion < 95) — that's
	// the Resume button.
	//
	// For TV titles there's also a separate "watch next" path: if the
	// most-recent row is COMPLETE (>=95%), we look up the next episode
	// in (season, number) order and surface IT as the primary CTA at
	// position 0. That's how Netflix/Disney+ handle the "you finished
	// the episode, here's the next one" moment.
	//
	// Movies (and TV titles with no progress yet) just fall through to
	// the standard Watch button.
	let watchProgress: {
		positionSeconds: number;
		durationSeconds: number | null;
		completionPercent: number;
		episodeId: string | null;
		episodeSeason: number | null;
		episodeNumber: number | null;
		episodeTitle: string | null;
		/** True when this row points at the "next unwatched episode"
		 *  rather than a mid-episode resume — drives a different CTA
		 *  label ("Watch Next · S2 E5" instead of "Resume · S2 E5 · 12:34"). */
		isNextEpisode?: boolean;
	} | null = null;

	if (userId) {
		const [wp] = await db
			.select({
				positionSeconds: mediaWatchProgress.positionSeconds,
				durationSeconds: mediaWatchProgress.durationSeconds,
				completionPercent: mediaWatchProgress.completionPercent,
				episodeId: mediaWatchProgress.episodeId
			})
			.from(mediaWatchProgress)
			.where(and(
				eq(mediaWatchProgress.userId, userId),
				eq(mediaWatchProgress.contentId, row.id)
			))
			.orderBy(desc(mediaWatchProgress.updatedAt))
			.limit(1);

		if (wp) {
			const lastWasComplete = (wp.completionPercent ?? 0) >= 95;
			const lastEp = wp.episodeId
				? episodeRows.find((e) => e.id === wp.episodeId)
				: undefined;

			// Path A — "watch next episode" when the most recent episode is
			// fully watched AND there's a successor in the season/episode
			// order. We compute the next episode by sorting all episodes
			// and picking the first one after the completed (season, ep).
			if (lastWasComplete && lastEp && episodeRows.length > 0) {
				const sorted = [...episodeRows].sort((a, b) =>
					a.seasonNumber - b.seasonNumber || a.episodeNumber - b.episodeNumber
				);
				const idx = sorted.findIndex((e) =>
					e.seasonNumber === lastEp.seasonNumber && e.episodeNumber === lastEp.episodeNumber
				);
				const next = idx >= 0 ? sorted[idx + 1] : undefined;
				if (next) {
					watchProgress = {
						positionSeconds: 0,
						durationSeconds: null,
						completionPercent: 0,
						episodeId: next.id,
						episodeSeason: next.seasonNumber,
						episodeNumber: next.episodeNumber,
						episodeTitle: next.title,
						isNextEpisode: true
					};
				}
			}

			// Path B — standard Resume mid-watch. Only if path A didn't
			// fire (i.e. last episode is still in progress, or this is a
			// movie). Same threshold as before: 15s minimum to dodge
			// trivial scrubbing, <95% so we don't replay near-finished
			// titles by mistake.
			if (!watchProgress && (wp.positionSeconds ?? 0) >= 15 && (wp.completionPercent ?? 0) < 95) {
				watchProgress = {
					positionSeconds: wp.positionSeconds ?? 0,
					durationSeconds: wp.durationSeconds,
					completionPercent: wp.completionPercent ?? 0,
					episodeId: wp.episodeId,
					episodeSeason: lastEp?.seasonNumber ?? null,
					episodeNumber: lastEp?.episodeNumber ?? null,
					episodeTitle: lastEp?.title ?? null
				};
			}
		}
	}

	// "My List" membership — quick JOIN through the default playlist so
	// the detail page can render the bookmark button in the correct
	// state on first paint (no flash of "+ Add" before the toggle
	// snaps to "In My List"). Anonymous viewers always get false.
	let isInMyList = false;
	if (userId) {
		const [hit] = await db
			.select({ id: playlistItems.id })
			.from(playlistItems)
			.innerJoin(playlists, eq(playlistItems.playlistId, playlists.id))
			.where(and(
				eq(playlists.userId, userId),
				eq(playlists.isDefault, true),
				eq(playlistItems.contentId, row.id)
			))
			.limit(1);
		isInMyList = !!hit;
	}

	return {
		content: {
			...row,
			playbackUrl
		},
		episodes: episodeRows.map((ep) => ({
			id: ep.id,
			seasonNumber: ep.seasonNumber,
			episodeNumber: ep.episodeNumber,
			title: ep.title,
			description: ep.description,
			thumbnail: ep.thumbnail,
			duration: ep.duration
		})),
		watchProgress,
		isInMyList
	};
}
