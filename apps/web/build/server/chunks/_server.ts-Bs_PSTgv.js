import { j as json } from './index-BcOZ6EV9.js';
import { eq } from 'drizzle-orm';
import { d as db, m as mediaLibrary } from './drizzle-CW7hPjGG.js';
import { g as getEncoderJob } from './encoder-orchestrator-BjJh_NPv.js';
import './utils-FiC4zhrQ.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import './shared-server-BeisX7n9.js';
import 'drizzle-orm/pg-core';

const GET = async ({ params, locals }) => {
  const session = await locals.auth.validate();
  if (!session) return json({ error: "Unauthorized" }, { status: 401 });
  const jobId = params.jobId;
  if (!jobId) return json({ error: "jobId is required" }, { status: 400 });
  const [content] = await db.select({ id: mediaLibrary.id, creatorId: mediaLibrary.creatorId }).from(mediaLibrary).where(eq(mediaLibrary.encoderJobId, jobId)).limit(1);
  if (!content) return json({ error: "Content not found for job" }, { status: 404 });
  if (content.creatorId && content.creatorId !== session.user.id) {
    return json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const status = await getEncoderJob(jobId);
    return json({ contentId: content.id, ...status });
  } catch (error) {
    console.error(`Failed to fetch encoder job ${jobId}:`, error);
    return json({ error: "Failed to fetch encoder job" }, { status: 500 });
  }
};

export { GET };
//# sourceMappingURL=_server.ts-Bs_PSTgv.js.map
