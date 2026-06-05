import { r as requireAdmin } from './admin-auth-DwogZLlW.js';
import { S as SiteMeta } from './constants-BEpeHz1K.js';
import { s as sendEmailAction } from './server2-D6YOLBns.js';
import { j as json } from './index-Cv5VcsYq.js';
import './drizzle-CKUH7ukq.js';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import 'drizzle-orm';
import './ui-libs-BjzLDLAh.js';
import './file-text-C_v9vOk2.js';
import './Icon-CM89Lxh4.js';
import './house-B7XjrWsP.js';
import './layout-dashboard-PdpePzL-.js';
import './user-DvE0JuLE.js';
import './users-B-WaIXgI.js';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

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
//# sourceMappingURL=_server.ts-DACqVpCs.js.map
