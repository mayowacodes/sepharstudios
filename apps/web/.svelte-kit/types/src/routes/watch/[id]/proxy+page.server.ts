// @ts-nocheck
import { error } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { mediaLibrary, contentSubtitleTracks, ppvContent, ppvPurchases, episodes, mediaWatchProgress } from '$lib/db/schema/sepharstudios';
import { and, desc, eq, ne, or, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { resolvePlaybackUrl } from '$lib/server/encoder-playback';
import { fingerprintFromHeaders } from '$lib/server/ua-country';
import { isRegionAllowed } from '$lib/server/region-gate';
import { normalizeLocale } from '$lib/i18n/role-labels';

export const load = async ({ params, locals, request, url }: Parameters<PageServerLoad>[0]) => {
	const session = await locals.auth.getSession();
	if (!session) {
		error(401, 'Please sign in to watch content');
	}

	// `?episode=<id>` lets the TV-series detail page deep-link into a
	// specific episode's video. The episode's own videoUrl overrides the
	// show row's playback source; the page title gets augmented with the
	// season/episode label so the user knows what they're watching.
	const requestedEpisodeId = url.searchParams.get('episode');

	// The [id] param accepts either the raw UUID (legacy + server-internal
	// links from notifications/cron/etc.) OR the human-readable slug
	// (`title-kebab-case-xxxxx`). Slugs and UUIDs can't collide — slugs are
	// ascii-lowercased with hyphens, UUIDs are hex with dashes at fixed
	// positions — so a single `OR` lookup is safe and lets old URLs keep
	// working while new outbound links use the slug.
	const content = await db
		.select({
			id: mediaLibrary.id,
			slug: mediaLibrary.slug,
			title: mediaLibrary.title,
			description: mediaLibrary.description,
			thumbnail: mediaLibrary.thumbnail,
			posterUrl: mediaLibrary.posterUrl,
			backdropUrl: mediaLibrary.backdropUrl,
			videoUrl: mediaLibrary.videoUrl,
			videoId: mediaLibrary.videoId,
			encoderJobId: mediaLibrary.encoderJobId,
			processingStatus: mediaLibrary.processingStatus,
			mediaType: mediaLibrary.mediaType,
			genres: mediaLibrary.genres,
			topics: mediaLibrary.topics,
			duration: mediaLibrary.duration,
			year: mediaLibrary.year,
			rating: mediaLibrary.rating,
			ageRating: mediaLibrary.ageRating,
			bibleReference: mediaLibrary.bibleReference,
			language: mediaLibrary.language,
			category: mediaLibrary.category,
			trailerUrl: mediaLibrary.trailerUrl,
			createdAt: mediaLibrary.createdAt,
			isActive: mediaLibrary.isActive,
			visibility: mediaLibrary.visibility,
			creatorId: mediaLibrary.creatorId,
			chapters: mediaLibrary.chapters,
			cast: mediaLibrary.cast,
			crew: mediaLibrary.crew,
			geoMode: mediaLibrary.geoMode,
			geoRegions: mediaLibrary.geoRegions,
			nextUpContentIds: mediaLibrary.nextUpContentIds,
			previewThumbnailsVtt: mediaLibrary.previewThumbnailsVtt,
			previewSpriteUrls: mediaLibrary.previewSpriteUrls,
			posterAutoUrl: mediaLibrary.posterAutoUrl
		})
		.from(mediaLibrary)
		.where(or(eq(mediaLibrary.id, params.id), eq(mediaLibrary.slug, params.id)))
		.then((r) => r[0]);

	if (!content || !content.isActive) {
		error(404, 'Content not found');
	}

	// Visibility gate. `private` content is owner-only; `unlisted` works for
	// anyone holding the direct link; `public` is universal.
	const isOwner = content.creatorId === session.user.id;
	if (content.visibility === 'private' && !isOwner) {
		error(404, 'Content not found');
	}

	// Region gate. Creator owner always bypasses; viewers without a country
	// header always pass (we don't want to misfire on shaky geo headers).
	const fingerprint = fingerprintFromHeaders(request.headers);
	const regionAllowed = isRegionAllowed({
		mode: content.geoMode ?? 'all',
		regions: Array.isArray(content.geoRegions) ? content.geoRegions : [],
		viewerCountry: fingerprint.country,
		isOwner
	});
	if (!regionAllowed) {
		error(451, 'This title isn’t available in your region.');
	}

	// PPV gate. Owners + admins bypass. Otherwise: when active ppv_content
	// row exists, viewer must have an entry in ppv_purchases. If they
	// don't, we still load the page (so meta + paywall renders) but flag
	// `paywall.required` so the client renders PPVPaywall instead of the
	// VideoPlayer.
	let paywall: { required: boolean; priceCents: number; currency: string } | null = null;
	if (!isOwner) {
		const [ppvRow] = await db.select({
			priceCents: ppvContent.finalPriceCents,
			currency: ppvContent.currency
		})
			.from(ppvContent)
			.where(and(eq(ppvContent.contentId, content.id), eq(ppvContent.isActive, true)))
			.limit(1);
		if (ppvRow) {
			const [purchase] = await db.select({ id: ppvPurchases.id })
				.from(ppvPurchases)
				.where(and(eq(ppvPurchases.userId, session.user.id), eq(ppvPurchases.contentId, content.id)))
				.limit(1);
			paywall = {
				required: !purchase,
				priceCents: ppvRow.priceCents,
				currency: (ppvRow.currency ?? 'USD').toUpperCase()
			};
		}
	}

	// Subtitle / caption / audio-description tracks attached to this row.
	// Split by kind so VideoPlayer can render them in the right tracks.
	const tracks = await db
		.select()
		.from(contentSubtitleTracks)
		.where(eq(contentSubtitleTracks.contentId, content.id));
	const subtitles = tracks
		.filter((t) => t.kind !== 'descriptions')
		.map((t) => ({ label: t.label, src: t.fileUrl, srclang: t.language }));
	const descriptions = tracks
		.filter((t) => t.kind === 'descriptions')
		.map((t) => ({ label: t.label, src: t.fileUrl, srclang: t.language }));

	// Single source of truth for picking the playback URL — see
	// $lib/server/encoder-playback.ts for the resolution order. Used to
	// call the orchestrator's /playback endpoint here, but that signs
	// Bunny-CDN URLs and prod isn't fronted by Bunny yet. The helper
	// composes the direct encoder-MinIO URL instead — the same path the
	// trailer pipeline already uses successfully.
	let playbackUrl = resolvePlaybackUrl({
		videoUrl: content.videoUrl,
		encoderJobId: content.encoderJobId,
		processingStatus: content.processingStatus
	});

	// Episode-deep-link path. We fetch the requested episode, confirm it
	// belongs to this show (defence against guessable IDs from a sibling
	// row), then override the playback URL + title with the episode's
	// values. If the episode has its own encoder job we'd resolve through
	// `resolvePlaybackUrl` for it too — for now episodes carry a direct
	// `videoUrl`, mirroring how the legacy upload form set them.
	let activeEpisode: {
		id: string;
		seasonNumber: number;
		episodeNumber: number;
		title: string;
		description: string | null;
		thumbnail: string | null;
		duration: string | null;
		videoUrl: string | null;
	} | null = null;
	if (requestedEpisodeId) {
		const [ep] = await db
			.select({
				id: episodes.id,
				showId: episodes.showId,
				seasonNumber: episodes.seasonNumber,
				episodeNumber: episodes.episodeNumber,
				title: episodes.title,
				description: episodes.description,
				thumbnail: episodes.thumbnail,
				duration: episodes.duration,
				videoUrl: episodes.videoUrl
			})
			.from(episodes)
			.where(eq(episodes.id, requestedEpisodeId))
			.limit(1);
		// Silently fall through to the show's main URL if the episode
		// doesn't belong to this show — surface as a soft demotion
		// rather than a 404 so a stale link still plays *something*.
		if (ep && ep.showId === content.id) {
			activeEpisode = {
				id: ep.id,
				seasonNumber: ep.seasonNumber,
				episodeNumber: ep.episodeNumber,
				title: ep.title,
				description: ep.description,
				thumbnail: ep.thumbnail,
				duration: ep.duration,
				videoUrl: ep.videoUrl
			};
			if (ep.videoUrl) playbackUrl = ep.videoUrl;
		}
	}

	// Watch-progress fetch — drives the detail-page Resume CTA and a
	// "resume here" affordance the player can pick up via the `?t=` URL
	// param. We pull both the show-level and (when episode is active) the
	// episode-level row so the player can decide which one to resume.
	let watchProgress: { positionSeconds: number; durationSeconds: number | null; completionPercent: number } | null = null;
	if (session.user.id) {
		const [row] = await db
			.select({
				positionSeconds: mediaWatchProgress.positionSeconds,
				durationSeconds: mediaWatchProgress.durationSeconds,
				completionPercent: mediaWatchProgress.completionPercent
			})
			.from(mediaWatchProgress)
			.where(and(
				eq(mediaWatchProgress.userId, session.user.id),
				eq(mediaWatchProgress.contentId, content.id),
				activeEpisode
					? eq(mediaWatchProgress.episodeId, activeEpisode.id)
					: sql`${mediaWatchProgress.episodeId} IS NULL`
			))
			.orderBy(desc(mediaWatchProgress.updatedAt))
			.limit(1);
		if (row) {
			watchProgress = {
				positionSeconds: row.positionSeconds ?? 0,
				durationSeconds: row.durationSeconds,
				completionPercent: row.completionPercent ?? 0
			};
		}
	}

	// Next-up cards for the VideoPlayer end-screen overlay. Order:
	//   1. For TV titles with an active episode, the NEXT episode in
	//      (season, number) order — wins the first slot so the
	//      "auto-play next" countdown takes the viewer straight into
	//      it. Carries an explicit `href` with `?episode=<id>` so the
	//      watch route deep-links correctly, and a `kind: "Next
	//      episode"` chip so the card is self-explanatory.
	//   2. Creator-curated nextUpContentIds (if any).
	//   3. Same-creator + same-genre fillers up to 3 total.
	const nextUp: Array<{
		id: string;
		slug: string | null;
		title: string;
		thumbnail: string | null;
		duration: string | null;
		href?: string;
		kind?: string;
	}> = [];

	// `endOfSeries` becomes true when this is a TV title AND the active
	// episode is the very last one in (season, number) order — i.e.
	// there's no "next episode" to advance into. The player shows a
	// finale-style "You've reached the end" banner above the genre
	// filler cards so viewers know the journey is done.
	let endOfSeries = false;
	// Direct URL to the next episode (when it exists). Surfaced to
	// VideoPlayer so the inline "Next Episode" button + the keyboard
	// `n` shortcut + the 95% auto-advance can all use the same href.
	let nextEpisodeHref: string | null = null;

	// Path 1 — next episode for TV titles. We need both `activeEpisode`
	// (the one currently playing) AND the show's full episode list. We
	// fetch episodes only for TV titles to avoid the extra query for
	// movies + docs.
	const isTvLike = content.mediaType === 'tv' || content.mediaType === 'series';
	if (isTvLike) {
		const allEpisodes = await db
			.select({
				id: episodes.id,
				seasonNumber: episodes.seasonNumber,
				episodeNumber: episodes.episodeNumber,
				title: episodes.title,
				thumbnail: episodes.thumbnail,
				duration: episodes.duration
			})
			.from(episodes)
			.where(eq(episodes.showId, content.id))
			.orderBy(episodes.seasonNumber, episodes.episodeNumber);

		if (allEpisodes.length > 0) {
			// If we know which episode is active, the "next" is the row
			// after it. If no episode is active (e.g. viewer hit the
			// show URL without an ?episode=), default to the FIRST
			// episode so the auto-advance still does something useful.
			let nextEp: typeof allEpisodes[number] | undefined = allEpisodes[0];
			if (activeEpisode) {
				const idx = allEpisodes.findIndex((e) =>
					e.seasonNumber === activeEpisode!.seasonNumber
						&& e.episodeNumber === activeEpisode!.episodeNumber
				);
				nextEp = idx >= 0 ? allEpisodes[idx + 1] : undefined;
				// Active episode was found but there's no next row →
				// last episode of the series. Filler cards still render
				// (the genre/creator picks below) but the end-screen
				// header switches to a finale message.
				if (idx >= 0 && !nextEp) endOfSeries = true;
			}
			if (nextEp) {
				const showSlug = content.slug || content.id;
				const href = `/watch/${showSlug}?episode=${nextEp.id}`;
				nextEpisodeHref = href;
				nextUp.push({
					id: nextEp.id,
					slug: null,
					title: `S${nextEp.seasonNumber} E${nextEp.episodeNumber}: ${nextEp.title}`,
					thumbnail: nextEp.thumbnail,
					duration: nextEp.duration,
					href,
					kind: 'Next episode'
				});
			}
		}
	}
	const curatedIds = Array.isArray(content.nextUpContentIds) ? content.nextUpContentIds : [];
	if (curatedIds.length > 0) {
		const curatedRows = await db.select({
			id: mediaLibrary.id,
			slug: mediaLibrary.slug,
			title: mediaLibrary.title,
			thumbnail: mediaLibrary.thumbnail,
			duration: mediaLibrary.duration
		})
			.from(mediaLibrary)
			.where(and(
				sql`${mediaLibrary.id} = ANY(${curatedIds})`,
				eq(mediaLibrary.isActive, true)
			))
			.limit(3);
		// Preserve creator's chosen order rather than DB order.
		const byId = new Map(curatedRows.map((r) => [r.id, r]));
		for (const cid of curatedIds) {
			const r = byId.get(cid);
			if (!r) continue;
			nextUp.push({ id: r.id, slug: r.slug ?? null, title: r.title, thumbnail: r.thumbnail ?? null, duration: r.duration ?? null });
			if (nextUp.length >= 3) break;
		}
	}
	// Fill any remaining slots (after next-episode + curated) with
	// same-creator picks. The `< 3` gate lets the next-episode card
	// keep slot 0 while creator content fills 1 + 2.
	if (nextUp.length < 3 && content.creatorId) {
		const sameCreator = await db.select({
			id: mediaLibrary.id,
			slug: mediaLibrary.slug,
			title: mediaLibrary.title,
			thumbnail: mediaLibrary.thumbnail,
			duration: mediaLibrary.duration
		})
			.from(mediaLibrary)
			.where(and(
				eq(mediaLibrary.creatorId, content.creatorId),
				ne(mediaLibrary.id, content.id),
				eq(mediaLibrary.isActive, true),
				eq(mediaLibrary.visibility, 'public')
			))
			.orderBy(desc(mediaLibrary.viewCount))
			.limit(3 - nextUp.length);
		for (const r of sameCreator) {
			if (nextUp.find((x) => x.id === r.id)) continue;
			nextUp.push({
				id: r.id,
				slug: r.slug ?? null,
				title: r.title,
				thumbnail: r.thumbnail ?? null,
				duration: r.duration ?? null
			});
			if (nextUp.length >= 3) break;
		}
	}
	if (nextUp.length < 3 && Array.isArray(content.genres) && content.genres.length > 0) {
		const genres = content.genres;
		const sameGenre = await db.select({
			id: mediaLibrary.id,
			slug: mediaLibrary.slug,
			title: mediaLibrary.title,
			thumbnail: mediaLibrary.thumbnail,
			duration: mediaLibrary.duration
		})
			.from(mediaLibrary)
			.where(and(
				ne(mediaLibrary.id, content.id),
				eq(mediaLibrary.isActive, true),
				eq(mediaLibrary.visibility, 'public'),
				sql`${mediaLibrary.genres} ?| array[${sql.join(genres.map((g) => sql`${g}`), sql`, `)}]`
			))
			.orderBy(desc(mediaLibrary.viewCount))
			.limit(3 - nextUp.length);
		for (const r of sameGenre) {
			if (!nextUp.find((x) => x.id === r.id)) {
				nextUp.push({
					id: r.id,
					slug: r.slug ?? null,
					title: r.title,
					thumbnail: r.thumbnail ?? null,
					duration: r.duration ?? null
				});
			}
		}
	}

	// Viewer locale for role-label translation on the Cast & crew accordion.
	// Accept-Language wins; ?locale=fr override for testing.
	const localeOverride = (new URL(request.url)).searchParams.get('locale');
	const acceptLang = request.headers.get('accept-language')?.split(',')[0]?.trim();
	const viewerLocale = normalizeLocale(localeOverride || acceptLang);

	return {
		content: { ...content, playbackUrl },
		activeEpisode,
		watchProgress,
		subtitles,
		descriptions,
		nextUp,
		endOfSeries,
		nextEpisodeHref,
		viewerLocale,
		paywall,
		activeProfileId: locals.activeProfileId
	};
};
