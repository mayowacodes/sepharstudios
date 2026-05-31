import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { contentThumbnailVariants, mediaLibrary } from '$lib/db/schema/sepharstudios';
import { and, desc, eq } from 'drizzle-orm';
import { Role } from '$lib/constants';

/**
 * GET  /api/creator/content/[id]/thumbnails — list variants for own content
 * POST /api/creator/content/[id]/thumbnails — add a new variant
 *   body: { url, label? }
 */

async function ownerCheck(contentId: string, ownerId: string) {
	const [row] = await db.select({ id: mediaLibrary.id, creatorId: mediaLibrary.creatorId })
		.from(mediaLibrary)
		.where(eq(mediaLibrary.id, contentId))
		.limit(1);
	if (!row) return { ok: false, status: 404 as const };
	if (row.creatorId !== ownerId) return { ok: false, status: 403 as const };
	return { ok: true, status: 200 as const };
}

export const GET: RequestHandler = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role as Role)) {
		return json({ error: 'Forbidden' }, { status: 403 });
	}

	const check = await ownerCheck(params.id!, session.user.id);
	if (!check.ok) return json({ error: check.status === 404 ? 'Not found' : 'Forbidden' }, { status: check.status });

	const variants = await db.select()
		.from(contentThumbnailVariants)
		.where(eq(contentThumbnailVariants.contentId, params.id!))
		.orderBy(desc(contentThumbnailVariants.createdAt));

	const enriched = variants.map((v) => ({
		...v,
		ctr: v.impressions > 0 ? Math.round((v.clicks / v.impressions) * 1000) / 10 : 0
	}));
	return json({ variants: enriched });
};

export const POST: RequestHandler = async ({ params, locals, request }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role as Role)) {
		return json({ error: 'Forbidden' }, { status: 403 });
	}

	const body = await request.json().catch(() => ({})) as { url?: string; label?: string };
	const url = body.url?.trim();
	if (!url) return json({ error: 'url is required' }, { status: 400 });

	const check = await ownerCheck(params.id!, session.user.id);
	if (!check.ok) return json({ error: check.status === 404 ? 'Not found' : 'Forbidden' }, { status: check.status });

	// Cap variants at 5 per content row — A/B testing benefits diminish past this.
	const existing = await db.select({ id: contentThumbnailVariants.id })
		.from(contentThumbnailVariants)
		.where(eq(contentThumbnailVariants.contentId, params.id!));
	if (existing.length >= 5) {
		return json({ error: 'Max 5 variants per content row' }, { status: 400 });
	}

	const [inserted] = await db.insert(contentThumbnailVariants).values({
		contentId: params.id!,
		url: url.slice(0, 500),
		label: body.label?.trim().slice(0, 40) || null
	}).returning();

	return json({ success: true, variant: inserted });
};
