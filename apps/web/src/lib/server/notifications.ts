import { sendEmailAction } from '$lib/authentication/server';

const SITE_URL = 'https://sepharstudios.com';

// ─── Trial notifications ───────────────────────────────────────────────────────

export async function sendTrialWelcome(to: string, name: string, plan: string, trialEndDate: Date) {
	const formatted = trialEndDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
	await sendEmailAction({
		to,
		subject: 'Your Sephar Studios free trial has started!',
		meta: {
			description: `Hi ${name}, welcome to Sephar Studios! Your 3-month free trial of the ${capitalize(plan)} plan has started. You won't be charged until ${formatted}. Enjoy unlimited faith-based entertainment.`,
			link: `${SITE_URL}/dashboard`
		}
	});
}

export async function sendTrialExpiryReminder(to: string, name: string, daysLeft: number, chargeDate: Date) {
	const formatted = chargeDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
	await sendEmailAction({
		to,
		subject: `Your free trial ends in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`,
		meta: {
			description: `Hi ${name}, your Sephar Studios free trial ends in ${daysLeft} day${daysLeft === 1 ? '' : 's'}. Your card will be charged on ${formatted}. You can cancel anytime before then from your account settings.`,
			link: `${SITE_URL}/profile`
		}
	});
}

export async function sendPaymentReceipt(to: string, name: string, plan: string, amountCents: number, nextDate: Date) {
	const amount = `$${(amountCents / 100).toFixed(2)}`;
	const formatted = nextDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
	await sendEmailAction({
		to,
		subject: `Payment confirmed — ${capitalize(plan)} plan`,
		meta: {
			description: `Hi ${name}, we've successfully charged ${amount} for your Sephar Studios ${capitalize(plan)} plan. Your next billing date is ${formatted}. Thank you for being a member!`,
			link: `${SITE_URL}/profile`
		}
	});
}

export async function sendCancellationConfirmation(to: string, name: string, accessUntil: Date) {
	const formatted = accessUntil.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
	await sendEmailAction({
		to,
		subject: 'Your subscription has been cancelled',
		meta: {
			description: `Hi ${name}, your Sephar Studios subscription has been cancelled. You'll continue to have full access until ${formatted}. We hope to see you again!`,
			link: `${SITE_URL}/plans`
		}
	});
}

// ─── Content notifications ────────────────────────────────────────────────────

export async function sendNewReleaseNotification(to: string, name: string, contentTitle: string, contentType: string, contentId: string) {
	await sendEmailAction({
		to,
		subject: `New on Sephar Studios: ${contentTitle}`,
		meta: {
			description: `Hi ${name}, a new ${contentType} has just arrived on Sephar Studios — "${contentTitle}". Start watching now!`,
			link: `${SITE_URL}/watch/${contentId}`
		}
	});
}

// ─── Achievement notifications ────────────────────────────────────────────────

export async function sendAchievementEmail(to: string, name: string, achievementName: string, stcReward: number) {
	await sendEmailAction({
		to,
		subject: `Achievement unlocked: ${achievementName}`,
		meta: {
			description: `Congratulations ${name}! You just unlocked the "${achievementName}" achievement and earned ${stcReward} STC tokens. Keep watching to unlock more rewards!`,
			link: `${SITE_URL}/achievements`
		}
	});
}

// ─── Weekly digest ────────────────────────────────────────────────────────────

export interface DigestItem {
	id: string;
	title: string;
	mediaType: string | null;
	description: string | null;
}

/**
 * Sends the weekly content digest. Includes an unsubscribe URL that lets the
 * recipient opt out without signing in (via the per-row `unsubscribe_token`).
 */
export async function sendWeeklyDigest(
	to: string,
	name: string,
	items: DigestItem[],
	unsubscribeUrl: string
) {
	const headline = items.length === 1
		? `${items[0].title} — this week on Sephar Studios`
		: `${items.length} new arrivals this week`;
	const bullets = items
		.slice(0, 10)
		.map((it) => `• ${it.title}${it.mediaType ? ` (${it.mediaType})` : ''}`)
		.join('\n');
	const description = `Hi ${name},\n\nHere's what landed on Sephar Studios over the past week:\n\n${bullets}\n\nUnsubscribe: ${unsubscribeUrl}`;

	await sendEmailAction({
		to,
		subject: `Sephar Weekly — ${headline}`,
		meta: {
			description,
			link: `${SITE_URL}/browse`
		}
	});
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function capitalize(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}
