import { error, json } from "@sveltejs/kit";
import { g as generateContentMetadata } from "../../../../../chunks/ai-tagging.js";
import { d as db, m as mediaLibrary } from "../../../../../chunks/drizzle.js";
import { eq } from "drizzle-orm";
const POST = async ({ request, locals }) => {
  if (!locals.user) throw error(401, "Unauthorized");
  const body = await request.json();
  const { contentId, title, description, contentType = "movie" } = body;
  let resolvedTitle = title;
  let resolvedDescription = description;
  let resolvedType = contentType;
  if (contentId) {
    const [content] = await db.select({
      title: mediaLibrary.title,
      description: mediaLibrary.description,
      mediaType: mediaLibrary.mediaType
    }).from(mediaLibrary).where(eq(mediaLibrary.id, contentId)).limit(1);
    if (!content) throw error(404, "Content not found");
    resolvedTitle = content.title;
    resolvedDescription = content.description ?? "";
    resolvedType = content.mediaType;
  }
  if (!resolvedTitle) throw error(400, "title is required");
  const metadata = await generateContentMetadata(resolvedTitle, resolvedDescription ?? "", resolvedType);
  if (!metadata) throw error(503, "AI tagging service unavailable");
  if (contentId) {
    await db.update(mediaLibrary).set({
      genres: metadata.genres,
      topics: metadata.topics,
      keywords: metadata.keywords,
      bibleReference: metadata.bibleReference || void 0,
      ageRating: metadata.ageRating,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(mediaLibrary.id, contentId));
  }
  return json({ metadata, saved: !!contentId });
};
export {
  POST
};
