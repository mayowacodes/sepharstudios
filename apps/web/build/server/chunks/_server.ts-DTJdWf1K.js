import { j as json } from './index-BcOZ6EV9.js';
import { eq } from 'drizzle-orm';
import { d as db, m as mediaLibrary } from './drizzle-CW7hPjGG.js';
import { i as isValidInternalRequest } from './internal-auth-dNpkMrP_.js';
import './utils-FiC4zhrQ.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import './shared-server-BeisX7n9.js';
import 'drizzle-orm/pg-core';

const POST = async ({ request }) => {
  if (!isValidInternalRequest(request)) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const { contentId, jobId, playback, errorMessage } = body;
  if (!jobId) return json({ error: "jobId is required" }, { status: 400 });
  if (errorMessage) {
    await db.update(mediaLibrary).set({
      processingStatus: "failed",
      processingError: String(errorMessage),
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(mediaLibrary.encoderJobId, jobId));
    return json({ success: true, jobId, status: "failed" });
  }
  const where = contentId ? eq(mediaLibrary.id, contentId) : eq(mediaLibrary.encoderJobId, jobId);
  await db.update(mediaLibrary).set({
    processingStatus: "ready",
    processingError: null,
    processedAt: /* @__PURE__ */ new Date(),
    updatedAt: /* @__PURE__ */ new Date()
  }).where(where);
  return json({ success: true, contentId, jobId, status: "ready" });
};

export { POST };
//# sourceMappingURL=_server.ts-DTJdWf1K.js.map
