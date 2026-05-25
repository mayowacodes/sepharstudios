import { d as db, m as mediaLibrary } from "../../../chunks/drizzle.js";
import { and, eq, desc } from "drizzle-orm";
const load = async () => {
  try {
    const trendingShows = await db.select().from(mediaLibrary).where(
      and(
        eq(mediaLibrary.mediaType, "show"),
        eq(mediaLibrary.isActive, true)
      )
    ).orderBy(desc(mediaLibrary.createdAt)).limit(10);
    const trendingMovies = await db.select().from(mediaLibrary).where(
      and(
        eq(mediaLibrary.mediaType, "movie"),
        eq(mediaLibrary.isActive, true)
      )
    ).orderBy(desc(mediaLibrary.createdAt)).limit(10);
    return {
      shows: trendingShows,
      movies: trendingMovies,
      documentaries: []
    };
  } catch (error) {
    console.error("Homepage load failed, using fallback data:", error);
    return {
      shows: [],
      movies: [],
      documentaries: []
    };
  }
};
export {
  load
};
