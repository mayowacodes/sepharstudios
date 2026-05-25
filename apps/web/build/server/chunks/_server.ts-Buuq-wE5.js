import { j as json } from './index-BcOZ6EV9.js';
import { eq } from 'drizzle-orm';
import { d as db, m as mediaLibrary } from './drizzle-CW7hPjGG.js';
import { c as createEncoderJob } from './encoder-orchestrator-BjJh_NPv.js';
import './utils-FiC4zhrQ.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import './shared-server-BeisX7n9.js';
import 'drizzle-orm/pg-core';

const POST = async ({ request, locals }) => {
  const session = await locals.auth.validate();
  if (!session) return json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const { contentId, filename, profile = "vod-multi", durationHint } = body;
  if (!contentId || !filename) {
    return json({ error: "contentId and filename are required" }, { status: 400 });
  }
  const [content] = await db.select({ id: mediaLibrary.id, creatorId: mediaLibrary.creatorId }).from(mediaLibrary).where(eq(mediaLibrary.id, contentId)).limit(1);
  if (!content) return json({ error: "Content not found" }, { status: 404 });
  if (content.creatorId && content.creatorId !== session.user.id) {
    return json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const encoderJob = await createEncoderJob({ filename, profile, durationHint });
    await db.update(mediaLibrary).set({
      encoderJobId: encoderJob.jobId,
      processingStatus: "created",
      processingError: null,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(mediaLibrary.id, contentId));
    return json(
      {
        contentId,
        jobId: encoderJob.jobId,
        upload: encoderJob.upload
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create encoder job:", error);
    return json({ error: "Failed to create encoder job" }, { status: 500 });
  }
};

export { POST };
//# sourceMappingURL=_server.ts-Buuq-wE5.js.map
