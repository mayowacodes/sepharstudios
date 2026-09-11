import { d as db, c as user } from './drizzle-C3SH12nS.js';
import { r as requireAdmin } from './admin-auth-C5lShqv4.js';
import { j as json } from './index.js-CxPEndTa.js';
import { eq } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';

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
//# sourceMappingURL=_server.ts-BUmy_8Rg.js.map
