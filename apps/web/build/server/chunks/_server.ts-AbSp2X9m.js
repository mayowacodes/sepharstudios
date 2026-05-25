import { j as json } from './index-BcOZ6EV9.js';
import { and, isNotNull, ne } from 'drizzle-orm';
import { d as db, m as mediaLibrary } from './drizzle-CW7hPjGG.js';
import { i as isValidInternalRequest } from './internal-auth-dNpkMrP_.js';
import './utils-FiC4zhrQ.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import './shared-server-BeisX7n9.js';
import 'drizzle-orm/pg-core';

const GET = async ({ request }) => {
  if (!isValidInternalRequest(request)) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }
  const rows = await db.select({
    contentId: mediaLibrary.id,
    jobId: mediaLibrary.encoderJobId,
    status: mediaLibrary.processingStatus
  }).from(mediaLibrary).where(
    and(
      isNotNull(mediaLibrary.encoderJobId),
      ne(mediaLibrary.processingStatus, "ready"),
      ne(mediaLibrary.processingStatus, "failed")
    )
  ).limit(100);
  return json({
    jobs: rows.filter((row) => Boolean(row.jobId))
  });
};

export { GET };
//# sourceMappingURL=_server.ts-AbSp2X9m.js.map
