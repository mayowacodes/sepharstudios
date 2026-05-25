import { e as error, j as json } from './index-BcOZ6EV9.js';
import { g as generateContentMetadata } from './ai-tagging-BQ3HJZC1.js';
import { d as db, m as mediaLibrary } from './drizzle-CW7hPjGG.js';
import { eq } from 'drizzle-orm';
import './utils-FiC4zhrQ.js';
import './ai-provider-BckqNG7d.js';
import './shared-server-BeisX7n9.js';
import './ai-settings-DGaRpVWA.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';

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

export { POST };
//# sourceMappingURL=_server.ts-C_L-KSLV.js.map
