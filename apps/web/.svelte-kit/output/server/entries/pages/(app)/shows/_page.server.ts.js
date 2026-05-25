import { d as db, m as mediaLibrary } from "../../../../chunks/drizzle.js";
import { f as faithTVShows } from "../../../../chunks/shows.js";
import { and, eq } from "drizzle-orm";
const load = async () => {
  try {
    const shows = await db.select().from(mediaLibrary).where(
      and(
        eq(mediaLibrary.mediaType, "show"),
        eq(mediaLibrary.isActive, true)
      )
    );
    return {
      shows
    };
  } catch (error) {
    console.error("Shows load failed, using fallback data:", error);
    return {
      shows: faithTVShows
    };
  }
};
export {
  load
};
