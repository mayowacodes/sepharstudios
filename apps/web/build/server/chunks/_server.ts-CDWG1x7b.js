import { n as db, a0 as user } from './drizzle-BjmsPAPl.js';
import { R as Role } from './constants-ChVx7CIu.js';
import { j as json } from './index-5kYmxIr9.js';
import { eq } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './ui-libs-TtGtWAGI.js';
import './Icon-CGEdwVFL.js';
import './file-text-CODLMeLI.js';
import './layout-dashboard-B00hq5k6.js';
import './user-BR-ZR5dM.js';
import './users-Bb_ynahW.js';
import './index-DBqjc0Yf.js';

//#region src/routes/api/users/[id]/+server.ts
var requireAdmin = async (locals) => {
	const session = await locals.auth.getSession();
	if (!session) return {
		error: json({
			status: "error",
			message: "Unauthorized"
		}, { status: 401 }),
		session: null
	};
	if (session.user.role !== Role.ADMIN) return {
		error: json({
			status: "error",
			message: "Forbidden"
		}, { status: 403 }),
		session: null
	};
	return {
		error: null,
		session
	};
};
var PATCH = async ({ locals, params, request }) => {
	const { error, session } = await requireAdmin(locals);
	if (error || !session) return error;
	const { data } = await request.json();
	if (!data) return json({
		status: "error",
		message: "Missing payload"
	}, { status: 400 });
	const updatePayload = {};
	if (typeof data.name === "string") updatePayload.name = data.name.trim();
	if (typeof data.role === "string") {
		if (![
			Role.ADMIN,
			Role.EDITOR,
			Role.CREATOR,
			Role.USER
		].includes(data.role)) return json({
			status: "error",
			message: "Invalid role"
		}, { status: 400 });
		if (params.id === session.user.id && data.role !== Role.ADMIN) return json({
			status: "error",
			message: "You cannot change your own role. Ask another admin to do it."
		}, { status: 400 });
		updatePayload.role = data.role;
	}
	if (Object.keys(updatePayload).length === 0) return json({
		status: "error",
		message: "No changes provided"
	}, { status: 400 });
	const [updated] = await db.update(user).set({
		...updatePayload,
		updatedAt: /* @__PURE__ */ new Date()
	}).where(eq(user.id, params.id)).returning();
	return json({
		status: "success",
		data: updated
	});
};
var DELETE = async ({ locals, params }) => {
	const { error, session } = await requireAdmin(locals);
	if (error || !session) return error;
	if (params.id === session.user.id) return json({
		status: "error",
		message: "You cannot delete your own account. Ask another admin to do it."
	}, { status: 400 });
	await db.delete(user).where(eq(user.id, params.id));
	return json({
		status: "success",
		message: "User deleted"
	});
};

export { DELETE, PATCH };
//# sourceMappingURL=_server.ts-CDWG1x7b.js.map
