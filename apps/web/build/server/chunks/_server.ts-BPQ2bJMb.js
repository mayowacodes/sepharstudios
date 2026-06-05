import { w as db, ag as user } from './drizzle-CKUH7ukq.js';
import { R as Role } from './constants-BEpeHz1K.js';
import { j as json } from './index-Cv5VcsYq.js';
import { eq } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './ui-libs-BjzLDLAh.js';
import './file-text-C_v9vOk2.js';
import './Icon-CM89Lxh4.js';
import './house-B7XjrWsP.js';
import './layout-dashboard-PdpePzL-.js';
import './user-DvE0JuLE.js';
import './users-B-WaIXgI.js';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

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
	if (!params.id) return json({
		status: "error",
		message: "Missing user id"
	}, { status: 400 });
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
	if (!params.id) return json({
		status: "error",
		message: "Missing user id"
	}, { status: 400 });
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
//# sourceMappingURL=_server.ts-BPQ2bJMb.js.map
