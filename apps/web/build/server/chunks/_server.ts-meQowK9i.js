import { j as json } from './index-BcOZ6EV9.js';
import { m as mediaLibrary, d as db } from './drizzle-CW7hPjGG.js';
import { eq, sql, isNotNull, and } from 'drizzle-orm';
import './utils-FiC4zhrQ.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import './shared-server-BeisX7n9.js';
import 'drizzle-orm/pg-core';

const GET = async ({ url }) => {
  const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "20"), 50);
  const hasBibleRef = url.searchParams.get("hasBibleRef") === "true";
  const mediaType = url.searchParams.get("type");
  const conditions = [
    eq(mediaLibrary.isActive, true),
    // Kids content: age ratings G, PG, or ageRating contains 'kids'/'children'
    sql`(${mediaLibrary.ageRating} IN ('G', 'PG', 'ALL_AGES') OR ${mediaLibrary.ageRating} ILIKE '%kids%' OR ${mediaLibrary.ageRating} ILIKE '%children%')`
  ];
  if (hasBibleRef) {
    conditions.push(isNotNull(mediaLibrary.bibleReference));
  }
  if (mediaType) {
    conditions.push(eq(mediaLibrary.mediaType, mediaType));
  }
  const items = await db.select({
    id: mediaLibrary.id,
    title: mediaLibrary.title,
    thumbnail: mediaLibrary.thumbnail,
    posterUrl: mediaLibrary.posterUrl,
    mediaType: mediaLibrary.mediaType,
    bibleReference: mediaLibrary.bibleReference,
    genres: mediaLibrary.genres,
    description: mediaLibrary.description
  }).from(mediaLibrary).where(and(...conditions)).limit(limit);
  return json(items);
};

export { GET };
//# sourceMappingURL=_server.ts-meQowK9i.js.map
