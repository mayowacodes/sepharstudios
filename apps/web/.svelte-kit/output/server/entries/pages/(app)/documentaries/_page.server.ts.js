import { d as db, m as mediaLibrary } from "../../../../chunks/drizzle.js";
import { f as faithDocumentaries } from "../../../../chunks/documentaries.js";
import { and, eq } from "drizzle-orm";
const load = async () => {
  try {
    const documentaries = await db.select().from(mediaLibrary).where(
      and(
        eq(mediaLibrary.mediaType, "documentary"),
        eq(mediaLibrary.isActive, true)
      )
    );
    return {
      documentaries
    };
  } catch (error) {
    console.error("Documentaries load failed, using fallback data:", error);
    return {
      documentaries: faithDocumentaries
    };
  }
};
export {
  load
};
