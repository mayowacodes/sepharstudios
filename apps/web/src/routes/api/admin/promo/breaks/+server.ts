import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { adBreaks, mediaLibrary } from '$lib/db/schema/sepharstudios';
import { and, asc, eq } from 'drizzle-orm';
import { requireAdmin } from '$lib/server/admin-auth';
import {
	MAX_BREAKS_PER_TITLE,
	MIN_BREAK_GAP_SECONDS,
	NO_BREAKS_AFTER_PCT
} from '$lib/server/ads/decision';

/** GET /api/admin/promo/breaks?contentId= → { breaks } */
export const GET: RequestHandler = async ({ locals, url }) => {
	const { error: authError } = await requireAdmin(locals);
	if (authError) return authError;

	const contentId = url.searchParams.get('contentId');
	if (!contentId) return json({ error: 'contentId is required' }, { status: 400 });

	const breaks = await db
		.select()
		.from(adBreaks)
		.where(eq(adBreaks.contentId, contentId))
		.orderBy(asc(adBreaks.positionSeconds));

	return json({ breaks, policy: { MAX_BREAKS_PER_TITLE, MIN_BREAK_GAP_SECONDS, NO_BREAKS_AFTER_PCT } });
};

/**
 * POST /api/admin/promo/breaks
 *
 * Body: { contentId, positionSeconds, kind?, format?, runtimeSeconds? }
 *
 * Placement policy is enforced here AND re-checked at decision time. Both,
 * because breaks reach the table by three different paths (this endpoint, the
 * chapter generator, the interval generator) and only the decision path runs on
 * every playback — but an admin deserves the error at creation, not silence
 * followed by an ad that never fires.
 *
 * `runtimeSeconds` must be supplied to enforce the 90% cutoff: mediaLibrary
 * stores duration as a DISPLAY STRING ('2h 7m'), not seconds, so the server
 * cannot derive it.
 */
export const POST: RequestHandler = async ({ locals, request }) => {
	const { error: authError } = await requireAdmin(locals);
	if (authError) return authError;

	const body = (await request.json().catch(() => null)) as {
		contentId?: string;
		positionSeconds?: number;
		kind?: string;
		format?: string;
		runtimeSeconds?: number;
	} | null;

	const contentId = body?.contentId;
	const position = Number(body?.positionSeconds);
	if (!contentId) return json({ error: 'contentId is required' }, { status: 400 });
	if (!Number.isFinite(position) || position < 0) {
		return json({ error: 'positionSeconds must be a non-negative number' }, { status: 400 });
	}

	const [content] = await db
		.select({ id: mediaLibrary.id, category: mediaLibrary.category })
		.from(mediaLibrary)
		.where(eq(mediaLibrary.id, contentId))
		.limit(1);
	if (!content) return json({ error: 'Content not found' }, { status: 404 });

	// Kids and teens titles are ad-free platform-wide. Refuse at creation
	// rather than accepting a break that can never serve.
	if (content.category === 'kids' || content.category === 'teens') {
		return json(
			{ error: 'Kids and Teens titles are ad-free — a break here would never serve' },
			{ status: 400 }
		);
	}

	const kind = position === 0 ? 'preroll' : 'midroll';
	if (body?.kind && body.kind !== kind) {
		// The DB CHECK enforces (kind='preroll') = (position=0) in both
		// directions; explain it rather than surfacing a constraint violation.
		return json(
			{ error: `A break at ${position}s must be kind "${kind}"` },
			{ status: 400 }
		);
	}

	const existing = await db
		.select({ positionSeconds: adBreaks.positionSeconds })
		.from(adBreaks)
		.where(and(eq(adBreaks.contentId, contentId), eq(adBreaks.isActive, true)))
		.orderBy(asc(adBreaks.positionSeconds));

	if (existing.length >= MAX_BREAKS_PER_TITLE) {
		return json(
			{ error: `This title already has the maximum of ${MAX_BREAKS_PER_TITLE} breaks` },
			{ status: 409 }
		);
	}

	if (kind === 'midroll') {
		const tooClose = existing.find(
			(b) => b.positionSeconds !== 0 && Math.abs(b.positionSeconds - position) < MIN_BREAK_GAP_SECONDS
		);
		if (tooClose) {
			return json(
				{
					error: `Breaks must be at least ${MIN_BREAK_GAP_SECONDS}s apart; there is already one at ${tooClose.positionSeconds}s`
				},
				{ status: 409 }
			);
		}

		const runtime = Number(body?.runtimeSeconds);
		if (Number.isFinite(runtime) && runtime > 0) {
			const cutoff = runtime * NO_BREAKS_AFTER_PCT;
			if (position > cutoff) {
				return json(
					{
						error: `Breaks cannot be placed after ${Math.floor(cutoff)}s (${NO_BREAKS_AFTER_PCT * 100}% of runtime) — the end screen appears at 90% and auto-advance fires at 95%`
					},
					{ status: 400 }
				);
			}
		}
	}

	try {
		const [row] = await db
			.insert(adBreaks)
			.values({
				contentId,
				positionSeconds: Math.floor(position),
				kind,
				format: body?.format ?? null
			})
			.returning();
		return json({ break: row }, { status: 201 });
	} catch (err) {
		const msg = err instanceof Error ? err.message : '';
		if (msg.includes('ad_breaks_position_uq') || msg.includes('duplicate key')) {
			return json({ error: `A break already exists at ${position}s` }, { status: 409 });
		}
		throw err;
	}
};
