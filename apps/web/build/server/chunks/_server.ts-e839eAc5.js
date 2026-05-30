import { n as db, a0 as user } from './drizzle-BjmsPAPl.js';
import { r as requireAdmin } from './admin-auth-Cru3g_J0.js';
import { j as json } from './index-5kYmxIr9.js';
import { eq } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './index-DBqjc0Yf.js';

//#region src/routes/api/admin/admins/+server.ts
/**
* GET /api/admin/admins
*
* Lists users with role='admin'. Used to populate the review-queue assignment
* modal. Admin only.
*/
var GET = async ({ locals }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;
	return json({ admins: await db.select({
		id: user.id,
		name: user.name,
		email: user.email,
		image: user.image
	}).from(user).where(eq(user.role, "admin")).orderBy(user.name) });
};

export { GET };
//# sourceMappingURL=_server.ts-e839eAc5.js.map
