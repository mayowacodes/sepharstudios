import { r as requireAdmin } from './admin-auth-C5lShqv4.js';
import { j as json } from './index.js-CxPEndTa.js';
import './drizzle-C3SH12nS.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import 'drizzle-orm';

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
//# sourceMappingURL=_server.ts-CgCQC-U1.js.map
