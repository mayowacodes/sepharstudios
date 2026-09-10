import { C as Constants } from './constants-RccSloty.js';
import { s as sendEmailAction } from './server2-K9pj3rZ3.js';
import { j as json } from './index.js-DwRgOKlO.js';
import './file-text-CHS0iqgH.js';
import './Icon-C7ASqKku.js';
import './house-XwjJ8C_P.js';
import './layout-dashboard-BnGht0MN.js';
import './user-D4TNxAED.js';
import './users-Cy8n6xcU.js';

//#region src/routes/api/contact/+server.ts
function isValidEmail(value) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
var POST = async ({ request }) => {
	const body = await request.json().catch(() => ({}));
	const name = (body.name ?? "").trim();
	const email = (body.email ?? "").trim();
	const subject = (body.subject ?? "").trim();
	const message = (body.message ?? "").trim();
	if (!name || !email || !subject || !message) return json({ error: "All fields are required." }, { status: 400 });
	if (!isValidEmail(email)) return json({ error: "Please enter a valid email address." }, { status: 400 });
	if (message.length > 5e3) return json({ error: "Message is too long (5000 char max)." }, { status: 400 });
	try {
		await sendEmailAction({
			to: Constants.SUPPORTEMAIL,
			subject: `[Contact form] ${subject} — from ${name}`,
			meta: {
				description: `${message}\n\nFrom: ${name} <${email}>`,
				link: `mailto:${email}`
			}
		});
		return json({ ok: true });
	} catch (err) {
		console.error("Contact form send failed:", err);
		return json({ error: "Could not send your message right now. Please try again later." }, { status: 502 });
	}
};

export { POST };
//# sourceMappingURL=_server.ts-DKuFzB2R.js.map
