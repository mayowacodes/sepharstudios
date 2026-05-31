import { error } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { mediaLibrary, contentSubtitleTracks, ppvContent, ppvPurchases } from '$lib/db/schema/sepharstudios';
import { and, desc, eq, ne, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { getEncoderPlayback } from '$lib/server/encoder-orchestrator';
import { fingerprintFromHeaders } from '$lib/server/ua-country';
import { isRegionAllowed } from '$lib/server/region-gate';
import { normalizeLocale } from '$lib/i18n/role-labels';

export const load: PageServerLoad = async ({ params, locals, request }) => {
	const session = await locals.auth.getSession();
	if (!session) {
		error(401, 'Please sign in to watch content');
	}

	const content = await db
		.select({
			id: mediaLibrary.id,
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
		.where(eq(mediaLibrary.id, params.id))
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

	let playbackUrl = content.videoUrl;
	if (!playbackUrl && content.encoderJobId && content.processingStatus === 'ready') {
		try {
			const playback = await getEncoderPlayback(content.encoderJobId);
			playbackUrl = playback.playback.master;
		} catch (err) {
			console.error(`Failed to sign playback URL for ${content.id}:`, err);
		}
	}

	// Next-up cards for the VideoPlayer end-screen overlay. If the creator
	// curated a list (nextUpContentIds), it ALWAYS wins (in the order they
	// chose). Otherwise: same-creator first, then same-genre fillers. Cap
	// at 3 (overlay slots).
	const nextUp: Array<{ id: string; title: string; thumbnail: string | null; duration: string | null }> = [];
	const curatedIds = Array.isArray(content.nextUpContentIds) ? content.nextUpContentIds : [];
	if (curatedIds.length > 0) {
		const curatedRows = await db.select({
			id: mediaLibrary.id,
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
			nextUp.push({ id: r.id, title: r.title, thumbnail: r.thumbnail ?? null, duration: r.duration ?? null });
			if (nextUp.length >= 3) break;
		}
	}
	if (nextUp.length === 0 && content.creatorId) {
		const sameCreator = await db.select({
			id: mediaLibrary.id,
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
			.limit(3);
		for (const r of sameCreator) {
			nextUp.push({
				id: r.id,
				title: r.title,
				thumbnail: r.thumbnail ?? null,
				duration: r.duration ?? null
			});
		}
	}
	if (nextUp.length < 3 && Array.isArray(content.genres) && content.genres.length > 0) {
		const genres = content.genres;
		const sameGenre = await db.select({
			id: mediaLibrary.id,
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
		subtitles,
		descriptions,
		nextUp,
		viewerLocale,
		paywall,
		activeProfileId: locals.activeProfileId
	};
};
