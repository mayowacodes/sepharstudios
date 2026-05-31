import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import {
	mediaLibrary,
	mediaWatchProgress,
	contentShares,
	watchSessionMeta
} from '$lib/db/schema/sepharstudios';
import { user } from '$lib/db/schema';
import { and, eq, sql, gte, isNotNull } from 'drizzle-orm';
import { Role } from '$lib/constants';
import { notify, notifyAdmins } from '$lib/server/notify';

/**
 * GET    /api/creator/content/[id] — single content row + per-content analytics
 * PATCH  /api/creator/content/[id] — partial update (allow-listed fields)
 * DELETE /api/creator/content/[id] — soft-delete (status='archived')
 *
 * Ownership: the row's `creator_id` must match the signed-in creator. Admins
 * are NOT auto-trusted here on purpose — admin edits go through
 * /api/admin/content/[id] which has its own audit trail.
 */

const ALLOWED_PATCH_FIELDS = new Set([
	// Basic Info — PPV pricing lives in the `ppv_content` table, NOT on
	// media_library. Creator-suggested PPV happens via the admin PPV modal.
	'title', 'description', 'contentType', 'ageRating',
	// Metadata
	'genres', 'topics', 'keywords', 'bibleReference', 'language', 'duration',
	'ministryAffiliation', 'hasSubtitles', 'hasClosedCaptions',
	// Asset URLs (one per slot)
	'thumbnail', 'posterUrl', 'posterLandscapeUrl', 'posterSquareUrl',
	'logoTitleUrl', 'backdropUrl', 'trailerUrl',
	// Visibility + scheduling (creator-controlled)
	'visibility', 'scheduledPublishAt',
	// Catalog completion round: chapters, cast, crew, region restrictions
	'chapters', 'cast', 'crew', 'geoMode', 'geoRegions',
	// Curated end-screen next-up
	'nextUpContentIds'
]);

const ALLOWED_VISIBILITY = new Set(['public', 'unlisted', 'private']);
const ALLOWED_CONTENT_TYPES = new Set(['movie', 'show', 'documentary']);
const ALLOWED_GEO_MODES = new Set(['all', 'allow', 'block']);

async function loadOwned(contentId: string, ownerId: string) {
	const [row] = await db.select()
		.from(mediaLibrary)
		.where(eq(mediaLibrary.id, contentId))
		.limit(1);
	if (!row) return { row: null as null, status: 404 as const };
	if (row.creatorId !== ownerId) return { row: null as null, status: 403 as const };
	return { row, status: 200 as const };
}

async function perContentAnalytics(contentId: string) {
	const [watchAgg] = await db
		.select({
			views: sql<number>`count(*)::int`,
			completed: sql<number>`sum(case when ${mediaWatchProgress.isCompleted} then 1 else 0 end)::int`,
			watchSeconds: sql<number>`coalesce(sum(${mediaWatchProgress.positionSeconds}), 0)`,
			avgCompletion: sql<number>`coalesce(avg(${mediaWatchProgress.completionPercent}), 0)`
		})
		.from(mediaWatchProgress)
		.where(eq(mediaWatchProgress.contentId, contentId));

	const [shareAgg] = await db
		.select({ total: sql<number>`count(*)::int` })
		.from(contentShares)
		.where(eq(contentShares.contentId, contentId));

	const since = new Date(Date.now() - 30 * 86_400_000);
	const deviceRows = await db
		.select({
			deviceType: watchSessionMeta.deviceType,
			count: sql<number>`count(*)::int`
		})
		.from(watchSessionMeta)
		.where(and(
			eq(watchSessionMeta.contentId, contentId),
			gte(watchSessionMeta.createdAt, since),
			isNotNull(watchSessionMeta.deviceType)
		))
		.groupBy(watchSessionMeta.deviceType);

	const countryRows = await db
		.select({
			country: watchSessionMeta.country,
			count: sql<number>`count(*)::int`
		})
		.from(watchSessionMeta)
		.where(and(
			eq(watchSessionMeta.contentId, contentId),
			gte(watchSessionMeta.createdAt, since),
			isNotNull(watchSessionMeta.country)
		))
		.groupBy(watchSessionMeta.country)
		.orderBy(sql`count(*) desc`)
		.limit(5);

	const views = Number(watchAgg?.views ?? 0);
	const watchSeconds = Number(watchAgg?.watchSeconds ?? 0);
	return {
		views,
		completedWatches: Number(watchAgg?.completed ?? 0),
		watchTimeMinutes: Math.round(watchSeconds / 60),
		avgWatchMinutes: views > 0 ? Math.round((watchSeconds / views) / 60 * 10) / 10 : 0,
		completionRate: Math.round(Number(watchAgg?.avgCompletion ?? 0)),
		totalShares: Number(shareAgg?.total ?? 0),
		viewsByDevice: deviceRows.map((r) => ({ device: r.deviceType ?? 'unknown', count: Number(r.count) })),
		topCountries: countryRows.map((r) => ({ country: r.country ?? 'XX', count: Number(r.count) }))
	};
}

export const GET: RequestHandler = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role as Role)) {
		return json({ error: 'Forbidden' }, { status: 403 });
	}

	const { row, status } = await loadOwned(params.id!, session.user.id);
	if (status !== 200) return json({ error: status === 404 ? 'Not found' : 'Forbidden' }, { status });

	const analytics = await perContentAnalytics(row.id);
	return json({ content: row, analytics });
};

export const PATCH: RequestHandler = async ({ params, locals, request }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role as Role)) {
		return json({ error: 'Forbidden' }, { status: 403 });
	}

	const { row, status } = await loadOwned(params.id!, session.user.id);
	if (status !== 200) return json({ error: status === 404 ? 'Not found' : 'Forbidden' }, { status });

	const body = await request.json().catch(() => ({})) as Record<string, unknown>;
	const updates: Record<string, unknown> = { updatedAt: new Date() };

	for (const [key, value] of Object.entries(body)) {
		if (!ALLOWED_PATCH_FIELDS.has(key)) continue;
		// Field-specific normalization + validation.
		if (key === 'visibility') {
			if (typeof value !== 'string' || !ALLOWED_VISIBILITY.has(value)) {
				return json({ error: 'Invalid visibility' }, { status: 400 });
			}
			updates.visibility = value;
			continue;
		}
		if (key === 'contentType') {
			if (typeof value !== 'string' || !ALLOWED_CONTENT_TYPES.has(value)) {
				return json({ error: 'Invalid content type' }, { status: 400 });
			}
			// Map wizard field name to schema column name.
			updates.mediaType = value;
			continue;
		}
		if (key === 'scheduledPublishAt') {
			if (value === null || value === '') {
				updates.scheduledPublishAt = null;
			} else if (typeof value === 'string') {
				const parsed = new Date(value);
				if (isNaN(parsed.getTime())) {
					return json({ error: 'Invalid scheduledPublishAt' }, { status: 400 });
				}
				updates.scheduledPublishAt = parsed;
			}
			continue;
		}
		if (key === 'title') {
			const t = String(value ?? '').trim();
			if (!t) return json({ error: 'Title cannot be empty' }, { status: 400 });
			updates.title = t.slice(0, 255);
			continue;
		}
		if (key === 'genres' || key === 'topics' || key === 'keywords') {
			updates[key] = Array.isArray(value) ? value.filter((v) => typeof v === 'string') : [];
			continue;
		}
		if (key === 'chapters') {
			if (value === null) { updates.chapters = null; continue; }
			if (!Array.isArray(value)) {
				return json({ error: 'chapters must be an array' }, { status: 400 });
			}
			if (value.length > 50) {
				return json({ error: 'Max 50 chapters' }, { status: 400 });
			}
			const cleaned: Array<{ start: number; title: string }> = [];
			let lastStart = -1;
			for (const v of value) {
				if (!v || typeof v !== 'object') {
					return json({ error: 'Each chapter must be an object' }, { status: 400 });
				}
				const start = Number((v as { start: unknown }).start);
				const title = String((v as { title: unknown }).title ?? '').trim();
				if (!Number.isFinite(start) || start < 0) {
					return json({ error: 'chapter.start must be a non-negative number' }, { status: 400 });
				}
				if (!title) {
					return json({ error: 'chapter.title is required' }, { status: 400 });
				}
				if (start <= lastStart) {
					return json({ error: 'chapter starts must be strictly increasing' }, { status: 400 });
				}
				lastStart = start;
				cleaned.push({ start, title: title.slice(0, 80) });
			}
			updates.chapters = cleaned;
			continue;
		}
		if (key === 'cast' || key === 'crew') {
			if (!Array.isArray(value)) {
				return json({ error: `${key} must be an array` }, { status: 400 });
			}
			if (value.length > 50) {
				return json({ error: `Max 50 ${key} entries` }, { status: 400 });
			}
			const cleaned = value.map((v) => {
				if (!v || typeof v !== 'object') return null;
				const name = String((v as { name: unknown }).name ?? '').trim();
				const role = String((v as { role: unknown }).role ?? '').trim();
				if (!name || !role) return null;
				const photoUrl = (v as { photoUrl?: unknown }).photoUrl;
				const out: Record<string, unknown> = {
					name: name.slice(0, 120),
					role: role.slice(0, 80)
				};
				if (typeof photoUrl === 'string' && photoUrl) out.photoUrl = photoUrl.slice(0, 500);
				if (key === 'cast') {
					const characterName = (v as { characterName?: unknown }).characterName;
					if (typeof characterName === 'string' && characterName) {
						out.characterName = characterName.trim().slice(0, 120);
					}
				}
				return out;
			}).filter((v): v is Record<string, unknown> => v !== null);
			updates[key] = cleaned;
			continue;
		}
		if (key === 'geoMode') {
			if (typeof value !== 'string' || !ALLOWED_GEO_MODES.has(value)) {
				return json({ error: 'Invalid geoMode' }, { status: 400 });
			}
			updates.geoMode = value;
			continue;
		}
		if (key === 'geoRegions') {
			if (!Array.isArray(value)) {
				return json({ error: 'geoRegions must be an array' }, { status: 400 });
			}
			const cleaned = value
				.filter((v): v is string => typeof v === 'string')
				.map((v) => v.trim().toUpperCase())
				.filter((v) => /^[A-Z]{2}$/.test(v));
			updates.geoRegions = cleaned;
			continue;
		}
		if (key === 'nextUpContentIds') {
			if (!Array.isArray(value)) {
				return json({ error: 'nextUpContentIds must be an array' }, { status: 400 });
			}
			const cleaned = value
				.filter((v): v is string => typeof v === 'string' && v.length > 0)
				.filter((v) => v !== row.id)
				.slice(0, 12);
			updates.nextUpContentIds = Array.from(new Set(cleaned));
			continue;
		}
		// Catch-all for the remaining text / boolean / nullable fields.
		updates[key] = value as never;
	}

	if (Object.keys(updates).length === 1) {
		return json({ error: 'No updatable fields supplied' }, { status: 400 });
	}

	const [updated] = await db.update(mediaLibrary)
		.set(updates as Parameters<typeof db.update>[0] extends never ? never : Record<string, unknown>)
		.where(eq(mediaLibrary.id, row.id))
		.returning();

	// Side-effect: re-index in Meilisearch when discoverable fields change.
	const reindexFields = ['title', 'description', 'genres', 'topics', 'keywords', 'bibleReference', 'cast', 'crew'];
	if (updated.status === 'published' && reindexFields.some((f) => f in updates)) {
		try {
			const { indexMedia, isMeiliConfigured } = await import('$lib/server/meilisearch');
			if (isMeiliConfigured()) {
				await indexMedia([{
					id: updated.id,
					title: updated.title,
					description: updated.description,
					genres: updated.genres ?? [],
					topics: updated.topics ?? [],
					keywords: updated.keywords ?? [],
					bibleReference: updated.bibleReference,
					mediaType: updated.mediaType,
					category: updated.category,
					year: updated.year,
					ageRating: updated.ageRating,
					thumbnail: updated.thumbnail,
					posterUrl: updated.posterUrl,
					viewCount: Number(updated.viewCount ?? 0),
					createdAt: updated.createdAt.getTime(),
					castNames: Array.isArray(updated.cast) ? updated.cast.map((c) => c.name).filter(Boolean) : [],
					crewNames: Array.isArray(updated.crew) ? updated.crew.map((c) => c.name).filter(Boolean) : []
				}]);
			}
		} catch (err) {
			console.warn('[creator/content PATCH] Meili reindex failed:', err);
		}
	}

	// Side-effect: if contentType changes, ping every admin so the catalog
	// team can re-review (the row may have shifted into a different review
	// bucket — movie vs show vs documentary).
	if ('mediaType' in updates && row.mediaType !== updates.mediaType) {
		console.info(`[creator/content PATCH] mediaType change ${row.mediaType} → ${updates.mediaType} on ${row.id}`);
		notifyAdmins({
			kind: 'system',
			title: `Content type changed: "${updated.title.slice(0, 50)}"`,
			message: `Creator changed mediaType from ${row.mediaType} to ${updates.mediaType}. Re-review may be needed.`,
			actionUrl: `/admin/review/${updated.id}`
		}).catch(() => undefined);
	}

	return json({ success: true, content: updated });
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role as Role)) {
		return json({ error: 'Forbidden' }, { status: 403 });
	}

	const { row, status } = await loadOwned(params.id!, session.user.id);
	if (status !== 200) return json({ error: status === 404 ? 'Not found' : 'Forbidden' }, { status });

	await db.update(mediaLibrary)
		.set({ status: 'archived', isActive: false, updatedAt: new Date() })
		.where(eq(mediaLibrary.id, row.id));

	if (session.user.id) {
		notify({
			userId: session.user.id,
			kind: 'system',
			title: 'Content archived',
			message: `"${row.title}" has been archived and is no longer visible to viewers.`,
			actionUrl: '/creator/content'
		}).catch(() => undefined);
	}

	return json({ success: true });
};
