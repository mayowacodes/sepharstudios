import { n as db, B as mediaLibrary } from './drizzle-BjmsPAPl.js';
import { i as isValidInternalRequest } from './internal-auth-Cv48yfCz.js';
import { j as json } from './index-5kYmxIr9.js';
import { and, isNotNull, ne } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './index-DBqjc0Yf.js';

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
//# sourceMappingURL=_server.ts-Dbdx7DL5.js.map
