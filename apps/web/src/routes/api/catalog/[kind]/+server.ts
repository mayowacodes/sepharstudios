import { json, error, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { mediaCardColumns } from '$lib/db/projections';
import { eq, and, or, isNull, notInArray, inArray, asc, type SQL } from 'drizzle-orm';
import { attachCatalogProgress } from '$lib/server/catalog-progress';

/**
 * GET /api/catalog/:kind  →  { items, comingSoon }
 *
 * Backs the /movies, /shows and /documentaries catalog pages. Those three used
 * to run identical Drizzle queries inside their own `+page.server.ts` loads,
 * differing only in the media-type filter and whether kids/teens rows are
 * excluded. They now share this endpoint, because a server load cannot run in
 * the Capacitor/Tauri bundle — there is no server there to answer it.
 *
 * The response shape is deliberately generic (`items`, not `movies`/`shows`).
 * Each page's `+page.ts` renames it to the key its component already reads, so
 * no component had to change.
 */

type CatalogKind = 'movies' | 'shows' | 'documentaries';

/**
 * `mediaType` values per catalog, and whether the kids/teens portals own them.
 *
 * - movies: short films ride along, because /movies is the only public catalog
 *   that makes sense for them.
 * - shows: the upload wizard writes 'series' but legacy rows and the tv-aliased
 *   detail loader use 'show'. Accept both or creators' uploads go missing.
 * - documentaries: never excluded by category — there is no kids documentary
 *   portal, so the general catalog is the only home for them.
 */
const CATALOGS: Record<CatalogKind, { mediaTypes: string[]; excludeKids: boolean }> = {
	movies: { mediaTypes: ['movie', 'short'], excludeKids: true },
	shows: { mediaTypes: ['show', 'series'], excludeKids: true },
	documentaries: { mediaTypes: ['documentary'], excludeKids: false }
};

function isCatalogKind(v: string): v is CatalogKind {
	return v === 'movies' || v === 'shows' || v === 'documentaries';
}

export const GET: RequestHandler = async ({ params, locals }) => {
	const kind = params.kind ?? '';
	if (!isCatalogKind(kind)) throw error(404, 'Unknown catalog');

	const { mediaTypes, excludeKids } = CATALOGS[kind];
	const session = await locals.auth.getSession();

	// NULL `category` is the new-creator default — the upload wizard doesn't ask
	// for it yet — so it MUST count as general audience. `ne(category, 'kids')`
	// evaluates to NULL for NULL columns, and NULL in a WHERE clause drops the
	// row, which is how freshly-published movies became invisible despite being
	// isActive=true in the DB. `OR (IS NULL, NOT IN (...))` makes NULL pass.
	const audienceFilter: SQL | undefined = excludeKids
		? or(isNull(mediaLibrary.category), notInArray(mediaLibrary.category, ['kids', 'teens']))
		: undefined;

	const [items, comingSoon] = await Promise.all([
		db
			.select(mediaCardColumns)
			.from(mediaLibrary)
			.where(
				and(
					inArray(mediaLibrary.mediaType, mediaTypes),
					eq(mediaLibrary.isActive, true),
					audienceFilter
				)
			),
		// Rows an admin has approved into the coming_soon state, next-up first.
		// Capped because the carousel scrolls and visibility tails off past ~20.
		db
			.select(mediaCardColumns)
			.from(mediaLibrary)
			.where(and(inArray(mediaLibrary.mediaType, mediaTypes), eq(mediaLibrary.status, 'coming_soon')))
			.orderBy(asc(mediaLibrary.scheduledPublishAt))
			.limit(20)
	]);

	// Overlay the viewer's in-progress position. Anonymous viewers get the rows
	// unchanged — the helper short-circuits on a null user id.
	return json({
		items: await attachCatalogProgress(items, session?.user.id),
		comingSoon
	});
};
