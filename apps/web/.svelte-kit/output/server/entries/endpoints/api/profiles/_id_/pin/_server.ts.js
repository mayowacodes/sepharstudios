import { ot as profiles, t as db } from "../../../../../../chunks/drizzle.js";
import { json } from "@sveltejs/kit";
import { and, eq } from "drizzle-orm";
import { createHash, randomBytes, scryptSync, timingSafeEqual } from "crypto";
//#region src/routes/api/profiles/[id]/pin/+server.ts
function hashPin(pin) {
	const salt = randomBytes(16).toString("hex");
	return `v1:${salt}:${scryptSync(pin, salt, 64).toString("hex")}`;
}
function safeHexEqual(a, b) {
	const aBuf = Buffer.from(a, "hex");
	const bBuf = Buffer.from(b, "hex");
	if (aBuf.length !== bBuf.length) return false;
	return timingSafeEqual(aBuf, bBuf);
}
function verifyPin(pin, stored) {
	if (!stored) return true;
	if (stored.startsWith("v1:")) {
		const parts = stored.split(":");
		if (parts.length !== 3) return false;
		const salt = parts[1];
		const expectedHex = parts[2];
		return safeHexEqual(scryptSync(pin, salt, 64).toString("hex"), expectedHex);
	}
	return false;
}
function verifyLegacyPin(pin, profileId, stored) {
	if (!stored) return true;
	return safeHexEqual(createHash("sha256").update(pin + profileId).digest("hex"), stored);
}
var POST = async ({ params, request, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	const { action, pin } = await request.json();
	const [profile] = await db.select().from(profiles).where(and(eq(profiles.id, params.id), eq(profiles.userId, session.user.id))).limit(1);
	if (!profile) return json({ error: "Not found" }, { status: 404 });
	if (action === "set") {
		if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) return json({ error: "PIN must be 4 digits" }, { status: 400 });
		await db.update(profiles).set({
			pin: hashPin(pin),
			pinSetAt: /* @__PURE__ */ new Date(),
			updatedAt: /* @__PURE__ */ new Date()
		}).where(eq(profiles.id, params.id));
		return json({ success: true });
	}
	if (action === "verify") {
		if (!profile.pin) return json({ valid: true });
		if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) return json({ valid: false });
		let valid = verifyPin(pin, profile.pin);
		if (!valid && !profile.pin.startsWith("v1:")) {
			valid = verifyLegacyPin(pin, profile.id, profile.pin);
			if (valid) await db.update(profiles).set({
				pin: hashPin(pin),
				updatedAt: /* @__PURE__ */ new Date()
			}).where(eq(profiles.id, params.id));
		}
		return json({ valid });
	}
	if (action === "remove") {
		await db.update(profiles).set({
			pin: null,
			pinSetAt: null,
			updatedAt: /* @__PURE__ */ new Date()
		}).where(and(eq(profiles.id, params.id), eq(profiles.userId, session.user.id)));
		return json({ success: true });
	}
	return json({ error: "Invalid action" }, { status: 400 });
};
//#endregion
export { POST };
