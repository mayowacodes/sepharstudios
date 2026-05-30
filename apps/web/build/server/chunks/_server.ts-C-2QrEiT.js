import { n as db, a0 as user } from './drizzle-BjmsPAPl.js';
import { j as json } from './index-5kYmxIr9.js';
import { eq } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './index-DBqjc0Yf.js';

//#region src/routes/api/user/profile/+server.ts
/**
* GET  /api/user/profile — current user's self-reported profile fields
* PATCH /api/user/profile  { dateOfBirth?, gender? }
*
* Only the user's own row is touched. Demographics fields are optional and
* default to NULL; sending an empty string clears the value.
*/
var ALLOWED_GENDERS = new Set([
	"male",
	"female",
	"non_binary",
	"prefer_not_to_say"
]);
var GET = async ({ locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	const [row] = await db.select({
		dateOfBirth: user.dateOfBirth,
		gender: user.gender
	}).from(user).where(eq(user.id, session.user.id)).limit(1);
	return json({
		dateOfBirth: row?.dateOfBirth ?? null,
		gender: row?.gender ?? null
	});
};
var PATCH = async ({ request, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	const body = await request.json().catch(() => ({}));
	const updates = { updatedAt: /* @__PURE__ */ new Date() };
	if ("dateOfBirth" in body) {
		if (body.dateOfBirth === null || body.dateOfBirth === "") updates.dateOfBirth = null;
		else if (typeof body.dateOfBirth === "string") {
			const parsed = new Date(body.dateOfBirth);
			if (isNaN(parsed.getTime()) || parsed > /* @__PURE__ */ new Date() || parsed.getFullYear() < 1900) return json({ error: "Invalid date of birth." }, { status: 400 });
			updates.dateOfBirth = body.dateOfBirth.slice(0, 10);
		}
	}
	if ("gender" in body) if (body.gender === null || body.gender === "") updates.gender = null;
	else if (typeof body.gender === "string" && ALLOWED_GENDERS.has(body.gender)) updates.gender = body.gender;
	else return json({ error: "Invalid gender value." }, { status: 400 });
	if (Object.keys(updates).length === 1) return json({ error: "No updatable fields supplied." }, { status: 400 });
	await db.update(user).set(updates).where(eq(user.id, session.user.id));
	return json({ success: true });
};

export { GET, PATCH };
//# sourceMappingURL=_server.ts-C-2QrEiT.js.map
