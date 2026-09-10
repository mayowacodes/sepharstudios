import { json, error, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { mediaCardColumns } from '$lib/db/projections';
import { eq, and, desc } from 'drizzle-orm';

/**
 * GET /api/catalog/audience/:category  →  { content }
 *
 * Backs the /kids/kiddies and /kids/teens portal feeds, which selected on
 * `category` rather than `mediaType` and were otherwise identical.
 *
 * The card projection and the LIMIT are load-bearing, not cosmetic: these
 * queries once selected full rows with no cap, serialising every chapters /
 * cast / crew JSON blob for the whole kids library into the page payload on
 * every single load.
 */
const AUDIENCES = ['kids', 'teens'] as const;
type Audience = (typeof AUDIENCES)[number];

export const GET: RequestHandler = async ({ params }) => {
	const category = params.category ?? '';
	if (!AUDIENCES.includes(category as Audience)) throw error(404, 'Unknown audience');

	const content = await db
		.select(mediaCardColumns)
		.from(mediaLibrary)
		.where(and(eq(mediaLibrary.category, category), eq(mediaLibrary.isActive, true)))
		.orderBy(desc(mediaLibrary.createdAt))
		.limit(60);

	return json({ content });
};
