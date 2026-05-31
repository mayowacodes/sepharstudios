import { json, type RequestHandler } from '@sveltejs/kit';
import { requireAdmin } from '$lib/server/admin-auth';
import { sendEmailAction } from '$lib/authentication/server';
import { SiteMeta } from '$lib/constants';

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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const POST: RequestHandler = async ({ locals, request }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;

	const body = await request.json().catch(() => ({})) as {
		email?: string;
		displayName?: string | null;
	};

	const email = body.email?.trim().toLowerCase();
	if (!email || !EMAIL_RE.test(email)) {
		return json({ error: 'Valid email is required' }, { status: 400 });
	}
	const displayName = body.displayName?.trim() || null;

	const signupUrl = `${SiteMeta.link}/auth/register?role=creator&email=${encodeURIComponent(email)}`;
	const subject = `You're invited to create on ${SiteMeta.name}`;
	const description = displayName
		? `Hi ${displayName},\n\nThe ${SiteMeta.name} team has invited you to apply as a creator. Click the link below to start the application.`
		: `Hi there,\n\nThe ${SiteMeta.name} team has invited you to apply as a creator. Click the link below to start the application.`;

	try {
		await sendEmailAction({
			to: email,
			subject,
			meta: { description, link: signupUrl }
		});
		return json({ ok: true, email });
	} catch (err) {
		console.error('[admin/creators/invite] email send failed:', err);
		return json({
			error: 'Failed to send invitation email. Check email service configuration.',
			detail: err instanceof Error ? err.message : 'unknown'
		}, { status: 502 });
	}
};
