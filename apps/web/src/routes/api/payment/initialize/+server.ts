import { json, type RequestHandler } from '@sveltejs/kit';
import { initializeTransaction, PLAN_PRICES_CENTS, type PlanName } from '$lib/payment/paystack';
import { verifyOtp } from '$lib/server/otp';
import { env } from '$env/dynamic/private';

export const POST: RequestHandler = async ({ request, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const { plan, addFamily, phone, otp } = await request.json() as {
		plan: PlanName;
		addFamily?: boolean;
		phone?: string;
		otp?: string;
	};

	// Verify OTP if provided (required for new trial signups)
	if (phone && otp) {
		const valid = verifyOtp(phone, otp);
		if (!valid) {
			return json({ error: 'Invalid or expired verification code' }, { status: 400 });
		}
	} else if (phone || otp) {
		// Partial submission — both required together
		return json({ error: 'Phone number and OTP are both required' }, { status: 400 });
	}

	if (!PLAN_PRICES_CENTS[plan]) {
		return json({ error: 'Invalid plan' }, { status: 400 });
	}

	try {
		// For trial: charge $0 initially to tokenise the card, then charge after trial
		// We initialize with $0.50 as a card verification charge (refundable)
		const verificationAmountCents = 50; // $0.50 card verification

		const tx = await initializeTransaction({
			email: session.user.email,
			amountKobo: verificationAmountCents,
			callbackUrl: `${env.PUBLIC_SITE_URL ?? 'http://localhost:5173'}/api/payment/verify`,
			metadata: {
				userId: session.user.id,
				plan,
				addFamily: addFamily ?? false,
				isTrial: true
			}
		});

		return json({ authorizationUrl: tx.authorization_url, reference: tx.reference });
	} catch (err) {
		console.error('Paystack init error:', err);
		return json({ error: 'Payment initialization failed' }, { status: 500 });
	}
};
