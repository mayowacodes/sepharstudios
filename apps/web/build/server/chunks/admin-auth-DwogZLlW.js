import { w as db, ag as user } from './drizzle-CKUH7ukq.js';
import { j as json } from './index-Cv5VcsYq.js';
import { eq } from 'drizzle-orm';

//#region src/lib/server/admin-auth.ts
async function getAdminActor(locals) {
	const session = await locals.auth.getSession();
	if (!session) return null;
	const [account] = await db.select({
		id: user.id,
		role: user.role,
		name: user.name,
		email: user.email
	}).from(user).where(eq(user.id, session.user.id)).limit(1);
	if (!account || account.role !== "admin") return null;
	return {
		id: account.id,
		name: account.name ?? session.user.name ?? "Admin",
		email: account.email ?? session.user.email
	};
}
/**
* Shared admin-only API gate. Used by every `routes/api/admin/*` endpoint to
* avoid copy-pasting the auth check. Returns `{ error: null, session }` when
* the caller is an admin; returns `{ error: Response, session: null }` with a
* pre-built 401/403 JSON response otherwise.
*
* Usage pattern:
*   export const POST: RequestHandler = async ({ locals, request }) => {
*     const { error, session } = await requireAdmin(locals);
*     if (error || !session) return error!;
*     // ...handler body, has session available...
*   };
*
* This duplicates the role check that `(admin)/+layout.server.ts` already does
* for *page* routes — admin API routes don't go through the layout chain, so
* they still need their own guard. The hook in `hooks.server.ts` blocks
* non-admin requests on the admin subdomain, but admin API routes are also
* reachable on the apex domain.
*/
async function requireAdmin(locals) {
	const session = await locals.auth.getSession();
	if (!session) return {
		error: json({ error: "Unauthorized" }, { status: 401 }),
		session: null
	};
	const [account] = await db.select({ role: user.role }).from(user).where(eq(user.id, session.user.id)).limit(1);
	if (account?.role !== "admin") return {
		error: json({ error: "Forbidden" }, { status: 403 }),
		session: null
	};
	return {
		error: null,
		session
	};
}

export { getAdminActor as g, requireAdmin as r };
//# sourceMappingURL=admin-auth-DwogZLlW.js.map
