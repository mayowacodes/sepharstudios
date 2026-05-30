import { s as sendEmailAction } from './server2-D6YOLBns.js';

//#region src/lib/server/notifications.ts
var SITE_URL = "https://sepharstudios.com";
async function sendTrialWelcome(to, name, plan, trialEndDate) {
	const formatted = trialEndDate.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric"
	});
	await sendEmailAction({
		to,
		subject: "Your Sephar Studios free trial has started!",
		meta: {
			description: `Hi ${name}, welcome to Sephar Studios! Your 3-month free trial of the ${capitalize(plan)} plan has started. You won't be charged until ${formatted}. Enjoy unlimited faith-based entertainment.`,
			link: `${SITE_URL}/dashboard`
		}
	});
}
async function sendCancellationConfirmation(to, name, accessUntil) {
	await sendEmailAction({
		to,
		subject: "Your subscription has been cancelled",
		meta: {
			description: `Hi ${name}, your Sephar Studios subscription has been cancelled. You'll continue to have full access until ${accessUntil.toLocaleDateString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric"
			})}. We hope to see you again!`,
			link: `${SITE_URL}/plans`
		}
	});
}
async function sendNewReleaseNotification(to, name, contentTitle, contentType, contentId) {
	await sendEmailAction({
		to,
		subject: `New on Sephar Studios: ${contentTitle}`,
		meta: {
			description: `Hi ${name}, a new ${contentType} has just arrived on Sephar Studios — "${contentTitle}". Start watching now!`,
			link: `${SITE_URL}/watch/${contentId}`
		}
	});
}
/**
* Sends the weekly content digest. Includes an unsubscribe URL that lets the
* recipient opt out without signing in (via the per-row `unsubscribe_token`).
*/
async function sendWeeklyDigest(to, name, items, unsubscribeUrl) {
	const headline = items.length === 1 ? `${items[0].title} — this week on Sephar Studios` : `${items.length} new arrivals this week`;
	const description = `Hi ${name},\n\nHere's what landed on Sephar Studios over the past week:\n\n${items.slice(0, 10).map((it) => `• ${it.title}${it.mediaType ? ` (${it.mediaType})` : ""}`).join("\n")}\n\nUnsubscribe: ${unsubscribeUrl}`;
	await sendEmailAction({
		to,
		subject: `Sephar Weekly — ${headline}`,
		meta: {
			description,
			link: `${SITE_URL}/browse`
		}
	});
}
function capitalize(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export { sendNewReleaseNotification as a, sendTrialWelcome as b, sendWeeklyDigest as c, sendCancellationConfirmation as s };
//# sourceMappingURL=notifications-CKo51rvz.js.map
