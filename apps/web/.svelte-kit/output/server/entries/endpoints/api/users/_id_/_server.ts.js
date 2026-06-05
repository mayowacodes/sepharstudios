import { a as user, t as db } from "../../../../../chunks/drizzle.js";
import { r as Role } from "../../../../../chunks/constants.js";
import { json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
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
//#endregion
export { DELETE, PATCH };
