import { n as requireAdmin } from "../../../../../../chunks/admin-auth.js";
import { i as SiteMeta } from "../../../../../../chunks/constants.js";
import { t as sendEmailAction } from "../../../../../../chunks/server2.js";
import { json } from "@sveltejs/kit";
//#region src/routes/api/admin/creators/invite/+server.ts
/**
* POST /api/admin/creators/invite
*
* Sends an invitation email with a sign-up link to a prospective creator.
* The email is best-effort — if the email backend is misconfigured we
* surface a 502 so the admin sees the failure rather than silently
* "succeeding".
*
* Body: { email: string, displayName?: string | null }
*/
var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var POST = async ({ locals, request }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;
	const body = await request.json().catch(() => ({}));
	const email = body.email?.trim().toLowerCase();
	if (!email || !EMAIL_RE.test(email)) return json({ error: "Valid email is required" }, { status: 400 });
	const displayName = body.displayName?.trim() || null;
	const signupUrl = `${SiteMeta.link}/auth/register?role=creator&email=${encodeURIComponent(email)}`;
	const subject = `You're invited to create on ${SiteMeta.name}`;
	const description = displayName ? `Hi ${displayName},\n\nThe ${SiteMeta.name} team has invited you to apply as a creator. Click the link below to start the application.` : `Hi there,\n\nThe ${SiteMeta.name} team has invited you to apply as a creator. Click the link below to start the application.`;
	try {
		await sendEmailAction({
			to: email,
			subject,
			meta: {
				description,
				link: signupUrl
			}
		});
		return json({
			ok: true,
			email
		});
	} catch (err) {
		console.error("[admin/creators/invite] email send failed:", err);
		return json({
			error: "Failed to send invitation email. Check email service configuration.",
			detail: err instanceof Error ? err.message : "unknown"
		}, { status: 502 });
	}
};
//#endregion
export { POST };
