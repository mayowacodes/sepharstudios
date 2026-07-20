import { a as isMeiliConfigured, o as searchMedia } from "../../../../chunks/meilisearch2.js";
import { t as attachCatalogProgress } from "../../../../chunks/catalog-progress.js";
import { json } from "@sveltejs/kit";
//#region src/routes/api/search/+server.ts
/**
* GET /api/search?q=&limit=&offset=&genre=&mediaType=&ageRating=
*
* Fast lexical search backed by Meilisearch. Returns results in the same
* shape as /api/ai/search so the frontend can fall back transparently.
*
* When Meilisearch isn't configured, returns 503 with `skipped:true`. The
* search page handles that by routing the query to /api/ai/search.
*/
var GET = async ({ url, locals }) => {
	const q = url.searchParams.get("q")?.trim() ?? "";
	if (!q) return json({
		results: [],
		q: "",
		source: "meili"
	});
	if (!isMeiliConfigured()) return json({
		skipped: true,
		reason: "Meilisearch is not configured."
	}, { status: 503 });
	const limit = Math.min(60, Math.max(1, parseInt(url.searchParams.get("limit") ?? "24", 10)));
	const offset = Math.max(0, parseInt(url.searchParams.get("offset") ?? "0", 10));
	const filters = [];
	const genre = url.searchParams.get("genre");
	if (genre) filters.push(`genres = "${genre.replace(/"/g, "\\\"")}"`);
	const mediaType = url.searchParams.get("mediaType");
	if (mediaType) filters.push(`mediaType = "${mediaType.replace(/"/g, "\\\"")}"`);
	const ageRating = url.searchParams.get("ageRating");
	if (ageRating) filters.push(`ageRating = "${ageRating.replace(/"/g, "\\\"")}"`);
	try {
		const enriched = await attachCatalogProgress((await searchMedia(q, {
			limit,
			offset,
			filter: filters.length > 0 ? filters : void 0
		})).map((h) => {
			const slugOrId = h.slug || h.id;
			const mediaType = h.mediaType ?? null;
			const category = h.category ?? null;
			let detailLink;
			if (category === "kids") detailLink = `/kids/kiddies/${slugOrId}`;
			else if (category === "teens") detailLink = `/kids/teens/${slugOrId}`;
			else if (mediaType === "tv" || mediaType === "series") detailLink = `/shows/${slugOrId}`;
			else if (mediaType === "documentary") detailLink = `/documentaries/${slugOrId}`;
			else detailLink = `/movies/${slugOrId}`;
			return {
				id: h.id,
				title: h.title,
				description: h.description ?? "",
				thumbnail: h.thumbnail ?? h.posterUrl ?? null,
				posterUrl: h.posterUrl ?? h.thumbnail ?? null,
				genres: h.genres ?? [],
				topics: h.topics ?? [],
				ageRating: h.ageRating ?? null,
				mediaType,
				category,
				year: h.year ?? null,
				link: detailLink
			};
		}), (await locals.auth.getSession())?.user.id);
		return json({
			results: enriched,
			q,
			source: "meili",
			count: enriched.length
		});
	} catch (err) {
		console.error("[search] meili query failed:", err);
		return json({ error: "Search service is temporarily unavailable." }, { status: 502 });
	}
};
//#endregion
export { GET };
