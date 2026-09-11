import { d as db, m as mediaLibrary } from './drizzle-CsnNxG5m.js';
import { i as isValidInternalRequest } from './internal-auth-C5XULMjH.js';
import { j as json } from './index.js-BP8aAXBX.js';
import { and, isNotNull, ne } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import 'node:crypto';

//#region src/routes/api/encoder/pending/+server.ts
var GET = async ({ request }) => {
	if (!isValidInternalRequest(request)) return json({ error: "Unauthorized" }, { status: 401 });
	return json({ jobs: (await db.select({
		contentId: mediaLibrary.id,
		jobId: mediaLibrary.encoderJobId,
		status: mediaLibrary.processingStatus
	}).from(mediaLibrary).where(and(isNotNull(mediaLibrary.encoderJobId), ne(mediaLibrary.processingStatus, "ready"), ne(mediaLibrary.processingStatus, "failed"))).limit(100)).filter((row) => Boolean(row.jobId)) });
};

export { GET };
//# sourceMappingURL=_server.ts-CdcHsei4.js.map
