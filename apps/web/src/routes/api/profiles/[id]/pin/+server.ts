import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { profiles } from '$lib/db/schema/sepharstudios';
import { and, eq } from 'drizzle-orm';
import { randomBytes, scryptSync, timingSafeEqual, createHash } from 'crypto';

function hashPin(pin: string): string {
	const salt = randomBytes(16).toString('hex');
	const digest = scryptSync(pin, salt, 64).toString('hex');
	return `v1:${salt}:${digest}`;
}

function safeHexEqual(a: string, b: string): boolean {
	const aBuf = Buffer.from(a, 'hex');
	const bBuf = Buffer.from(b, 'hex');
	if (aBuf.length !== bBuf.length) return false;
	return timingSafeEqual(aBuf, bBuf);
}

function verifyPin(pin: string, stored: string | null): boolean {
	if (!stored) return true;

	if (stored.startsWith('v1:')) {
		const parts = stored.split(':');
		if (parts.length !== 3) return false;
		const salt = parts[1];
		const expectedHex = parts[2];
		const derivedHex = scryptSync(pin, salt, 64).toString('hex');
		return safeHexEqual(derivedHex, expectedHex);
	}

	return false;
}

function verifyLegacyPin(pin: string, profileId: string, stored: string | null): boolean {
	if (!stored) return true;
	const hashHex = createHash('sha256').update(pin + profileId).digest('hex');
	return safeHexEqual(hashHex, stored);
}

// POST /api/profiles/[id]/pin - set PIN or verify PIN
export const POST: RequestHandler = async ({ params, request, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const { action, pin } = await request.json() as { action: 'set' | 'verify' | 'remove'; pin?: string };

	const [profile] = await db.select()
		.from(profiles)
		.where(and(eq(profiles.id, params.id!), eq(profiles.userId, session.user.id)))
		.limit(1);

	if (!profile) return json({ error: 'Not found' }, { status: 404 });

	if (action === 'set') {
		if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
			return json({ error: 'PIN must be 4 digits' }, { status: 400 });
		}

		await db.update(profiles)
			.set({ pin: hashPin(pin), pinSetAt: new Date(), updatedAt: new Date() })
			.where(eq(profiles.id, params.id!));

		return json({ success: true });
	}

	if (action === 'verify') {
		if (!profile.pin) return json({ valid: true });
		if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) return json({ valid: false });

		let valid = verifyPin(pin, profile.pin);

		// Backward compatibility: upgrade old SHA-256 PINs to scrypt format on successful verify.
		if (!valid && !profile.pin.startsWith('v1:')) {
			valid = verifyLegacyPin(pin, profile.id, profile.pin);
			if (valid) {
				await db.update(profiles)
					.set({ pin: hashPin(pin), updatedAt: new Date() })
					.where(eq(profiles.id, params.id!));
			}
		}

		return json({ valid });
	}

	if (action === 'remove') {
		await db.update(profiles)
			.set({ pin: null, pinSetAt: null, updatedAt: new Date() })
			.where(and(eq(profiles.id, params.id!), eq(profiles.userId, session.user.id)));
		return json({ success: true });
	}

	return json({ error: 'Invalid action' }, { status: 400 });
};
