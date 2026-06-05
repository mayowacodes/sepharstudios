import { b as contentThumbnailVariants, t as db } from "./drizzle.js";
import { eq, sql } from "drizzle-orm";
//#region src/lib/server/thumbnail-rotation.ts
/**
* Record an impression for a thumbnail variant. Fire-and-forget from the
* browse cards; rate-limit / batching can come later if write rate matters.
*/
async function recordImpression(variantId) {
	await db.update(contentThumbnailVariants).set({ impressions: sql`${contentThumbnailVariants.impressions} + 1` }).where(eq(contentThumbnailVariants.id, variantId));
}
/**
* Record a click for a thumbnail variant. Same shape as impression.
*/
async function recordClick(variantId) {
	await db.update(contentThumbnailVariants).set({ clicks: sql`${contentThumbnailVariants.clicks} + 1` }).where(eq(contentThumbnailVariants.id, variantId));
}
//#endregion
export { recordImpression as n, recordClick as t };
