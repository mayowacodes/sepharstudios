import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { sql } from 'drizzle-orm';

/**
 * GET /api/creator/people/lookup?name=<name>
 *
 * Cast/crew smart photo reuse. When a creator types a person's name in
 * the upload wizard, the frontend (debounced) hits this endpoint to find
 * a photo from a prior upload's `cast` or `crew` JSONB array. The first
 * match wins — order isn't meaningful for now since the platform is
 * small. Returns `{ photoUrl: string | null }` always (404-less). The
 * client only fills the avatar if `photoUrl` is non-null and the row
 * doesn't already have a creator-uploaded photo.
 *
 * Why no `people` table yet — for low-thousand-row scale a JSONB
 * unnest + LIMIT 1 is fine. When the index becomes hot, denormalize to
 * a dedicated table (tracked in TECHDEBT under "watch-page modernization
 * follow-ups").
 *
 * Auth: must be signed in. We don't restrict by role beyond that — the
 * platform's cast/crew arrays are stored on public content rows, so
 * leaking a photo URL through this endpoint can't expose anything
 * non-public anyway. Rate-limit at the gateway level if a future abuse
 * pattern emerges.
 */
export const GET: RequestHandler = async ({ url, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'unauthorized' }, { status: 401 });

	const name = (url.searchParams.get('name') ?? '').trim();
	if (!name) return json({ photoUrl: null });
	// Cap length so a hostile caller can't burn an index scan on a 10 MB string.
	if (name.length > 120) return json({ photoUrl: null });

	try {
		// jsonb_array_elements unwraps both arrays into a single SELECT;
		// we pick the first row that has a photoUrl AND matches the
		// (case-insensitive) name. The query is parameterized to prevent
		// SQL injection through the `name` value.
		const rows = await db.execute(sql`
			SELECT photo_url FROM (
				SELECT (jsonb_array_elements(cast)->>'photoUrl') AS photo_url,
				       (jsonb_array_elements(cast)->>'name')      AS person_name
				  FROM media_library
				UNION ALL
				SELECT (jsonb_array_elements(crew)->>'photoUrl') AS photo_url,
				       (jsonb_array_elements(crew)->>'name')      AS person_name
				  FROM media_library
			) AS people
			WHERE LOWER(person_name) = LOWER(${name})
			  AND photo_url IS NOT NULL
			  AND photo_url <> ''
			LIMIT 1
		`);

		// The execute() result shape is driver-specific; both pg-postgres
		// (`{ rows: [...] }`) and the array-style result are handled here.
		const first = Array.isArray(rows) ? rows[0] : (rows as { rows?: unknown[] }).rows?.[0];
		const photoUrl =
			first && typeof first === 'object' && 'photo_url' in first
				? ((first as { photo_url: string | null }).photo_url ?? null)
				: null;

		return json({ photoUrl });
	} catch (err) {
		console.error('[people/lookup] query failed:', err);
		return json({ photoUrl: null });
	}
};
