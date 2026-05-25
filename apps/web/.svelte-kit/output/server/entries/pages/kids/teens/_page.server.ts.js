import { d as db, m as mediaLibrary } from "../../../../chunks/drizzle.js";
import { and, eq } from "drizzle-orm";
const load = async () => {
  const content = await db.select().from(mediaLibrary).where(
    and(
      eq(mediaLibrary.category, "teens"),
      eq(mediaLibrary.isActive, true)
    )
  );
  return {
    content
  };
};
export {
  load
};
