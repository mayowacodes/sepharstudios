import { M as mediaLibrary, w as db } from './drizzle-CKUH7ukq.js';
import { j as json } from './index-Cv5VcsYq.js';
import { eq, sql, isNotNull, and } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/routes/api/content/kids/+server.ts
var GET = async ({ url }) => {
	try {
		const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "20"), 50);
		const hasBibleRef = url.searchParams.get("hasBibleRef") === "true";
		const mediaType = url.searchParams.get("type");
		const conditions = [
			eq(mediaLibrary.isActive, true),
			eq(mediaLibrary.visibility, "public"),
			sql`(${mediaLibrary.ageRating} IN ('G', 'PG', 'ALL_AGES') OR ${mediaLibrary.ageRating} ILIKE '%kids%' OR ${mediaLibrary.ageRating} ILIKE '%children%')`
		];
		if (hasBibleRef) conditions.push(isNotNull(mediaLibrary.bibleReference));
		if (mediaType) conditions.push(eq(mediaLibrary.mediaType, mediaType));
		return json(await db.select({
			id: mediaLibrary.id,
			title: mediaLibrary.title,
			thumbnail: mediaLibrary.thumbnail,
			posterUrl: mediaLibrary.posterUrl,
			mediaType: mediaLibrary.mediaType,
			bibleReference: mediaLibrary.bibleReference,
			genres: mediaLibrary.genres,
			description: mediaLibrary.description
		}).from(mediaLibrary).where(and(...conditions)).limit(limit));
	} catch (e) {
		console.error("GET /api/content/kids failed", e);
		return json({ error: "Failed to load kids content" }, { status: 500 });
	}
};

export { GET };
//# sourceMappingURL=_server.ts-D1Rxp1dW.js.map
