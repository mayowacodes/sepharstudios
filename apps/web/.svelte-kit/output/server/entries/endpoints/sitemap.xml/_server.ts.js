import { H as mediaLibrary, T as creators, t as db } from "../../../chunks/drizzle.js";
import { i as SiteMeta } from "../../../chunks/constants.js";
import { eq } from "drizzle-orm";
//#region src/routes/sitemap.xml/+server.ts
/**
* GET /sitemap.xml
*
* Dynamic sitemap covering:
*   - Static marketing/info pages (about, plans, help, terms, privacy)
*   - Every published media item under /watch/<id> + /watch/<slug>
*   - Every public creator profile
*
* Excluded by design:
*   - Auth pages (/auth/*)
*   - Authenticated app shell (/dashboard, /settings, /profiles)
*   - Admin (/admin/*) and creator portal (/creator/*)
*   - PPV-gated content (the page is public, the playback isn't — fine to index)
*
* Refresh cadence: serves a fresh sitemap on each request. For a large
* catalogue this becomes expensive; consider caching via Bunny edge or
* regenerating every N minutes.
*/
var STATIC_ROUTES = [
	{
		path: "/",
		changefreq: "daily",
		priority: "1.0"
	},
	{
		path: "/browse",
		changefreq: "daily",
		priority: "0.9"
	},
	{
		path: "/movies",
		changefreq: "daily",
		priority: "0.9"
	},
	{
		path: "/shows",
		changefreq: "daily",
		priority: "0.9"
	},
	{
		path: "/documentaries",
		changefreq: "daily",
		priority: "0.9"
	},
	{
		path: "/kids",
		changefreq: "weekly",
		priority: "0.8"
	},
	{
		path: "/plans",
		changefreq: "weekly",
		priority: "0.9"
	},
	{
		path: "/about",
		changefreq: "monthly",
		priority: "0.6"
	},
	{
		path: "/help",
		changefreq: "monthly",
		priority: "0.5"
	},
	{
		path: "/terms",
		changefreq: "monthly",
		priority: "0.3"
	},
	{
		path: "/privacy",
		changefreq: "monthly",
		priority: "0.3"
	},
	{
		path: "/guidelines",
		changefreq: "monthly",
		priority: "0.4"
	},
	{
		path: "/device-support",
		changefreq: "monthly",
		priority: "0.4"
	}
];
function escape(str) {
	return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
function urlEntry(loc, lastmod, changefreq, priority) {
	const parts = [`  <url>`, `    <loc>${escape(loc)}</loc>`];
	if (lastmod) {
		const iso = lastmod instanceof Date ? lastmod.toISOString() : lastmod;
		parts.push(`    <lastmod>${iso.slice(0, 10)}</lastmod>`);
	}
	if (changefreq) parts.push(`    <changefreq>${changefreq}</changefreq>`);
	if (priority) parts.push(`    <priority>${priority}</priority>`);
	parts.push(`  </url>`);
	return parts.join("\n");
}
var GET = async () => {
	const base = SiteMeta.link.replace(/\/$/, "");
	const mediaRows = await db.select({
		id: mediaLibrary.id,
		slug: mediaLibrary.slug,
		updatedAt: mediaLibrary.updatedAt
	}).from(mediaLibrary).where(eq(mediaLibrary.isActive, true));
	const creatorRows = await db.select({
		id: creators.id,
		displayName: creators.displayName,
		updatedAt: creators.updatedAt
	}).from(creators).where(eq(creators.isVerified, true));
	const entries = [];
	for (const r of STATIC_ROUTES) entries.push(urlEntry(`${base}${r.path}`, void 0, r.changefreq, r.priority));
	for (const m of mediaRows) {
		entries.push(urlEntry(`${base}/watch/${m.id}`, m.updatedAt, "weekly", "0.8"));
		if (m.slug) entries.push(urlEntry(`${base}/watch/${m.slug}`, m.updatedAt, "weekly", "0.8"));
	}
	for (const c of creatorRows) entries.push(urlEntry(`${base}/creators/${c.id}`, c.updatedAt, "weekly", "0.6"));
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>`;
	return new Response(body, { headers: {
		"Content-Type": "application/xml; charset=utf-8",
		"Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=300"
	} });
};
//#endregion
export { GET };
