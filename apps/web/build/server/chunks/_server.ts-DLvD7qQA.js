import { d as db, c as user } from './drizzle-DlGuU73K.js';
import { r as requireAdmin } from './admin-auth-i1sA9-vE.js';
import { j as json } from './index.js-DwRgOKlO.js';
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
//# sourceMappingURL=_server.ts-DLvD7qQA.js.map
