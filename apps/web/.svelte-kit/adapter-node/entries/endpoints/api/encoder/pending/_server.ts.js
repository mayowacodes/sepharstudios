import { json } from "@sveltejs/kit";
import { and, isNotNull, ne } from "drizzle-orm";
import { d as db, m as mediaLibrary } from "../../../../../chunks/drizzle.js";
import { i as isValidInternalRequest } from "../../../../../chunks/internal-auth.js";
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
export {
  GET
};
