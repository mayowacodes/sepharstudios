import { C as Constants } from './constants-BEpeHz1K.js';
import { s as sendEmailAction } from './server2-D6YOLBns.js';
import { j as json } from './index-Cv5VcsYq.js';
import './ui-libs-BjzLDLAh.js';
import './rolldown-runtime-pTpnEGsq.js';
import './file-text-C_v9vOk2.js';
import './Icon-CM89Lxh4.js';
import './house-B7XjrWsP.js';
import './layout-dashboard-PdpePzL-.js';
import './user-DvE0JuLE.js';
import './users-B-WaIXgI.js';
import './shared-server-DUDL94jl.js';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

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
//# sourceMappingURL=_server.ts-BI1O7PPq.js.map
