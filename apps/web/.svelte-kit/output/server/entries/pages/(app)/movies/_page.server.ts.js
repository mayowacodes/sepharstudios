import { d as db, m as mediaLibrary } from "../../../../chunks/drizzle.js";
import { and, eq, ne } from "drizzle-orm";
const load = async () => {
  const movies = await db.select().from(mediaLibrary).where(
    and(
      eq(mediaLibrary.mediaType, "movie"),
      eq(mediaLibrary.isActive, true),
      ne(mediaLibrary.category, "kids"),
      ne(mediaLibrary.category, "teens")
    )
  );
  return {
    movies
  };
};
export {
  load
};
