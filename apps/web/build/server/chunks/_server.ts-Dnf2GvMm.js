import { r as requireAdmin } from './admin-auth-DwogZLlW.js';
import { j as json } from './index-Cv5VcsYq.js';
import './drizzle-CKUH7ukq.js';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import 'drizzle-orm';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/routes/api/admin/settings/test-email/+server.ts
var POST = async ({ locals }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;
	return json({
		success: true,
		message: "Test email queued"
	});
};

export { POST };
//# sourceMappingURL=_server.ts-Dnf2GvMm.js.map
