import { r as requireAdmin } from './admin-auth-C5lShqv4.js';
import { S as SiteMeta } from './constants-BiiFHz9b.js';
import { s as sendEmailAction } from './server2-C3RwuLls.js';
import { j as json } from './index.js-CxPEndTa.js';
import './drizzle-C3SH12nS.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import 'drizzle-orm';
import './file-text-By5QqCz6.js';
import './Icon-Bw1rnKTC.js';
import './house-6lS0tROn.js';
import './layout-dashboard-B2Dnc05Q.js';
import './user-DfNTMTjp.js';
import './users-BHfWNfsK.js';

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

export { POST };
//# sourceMappingURL=_server.ts-XoB4vGQQ.js.map
