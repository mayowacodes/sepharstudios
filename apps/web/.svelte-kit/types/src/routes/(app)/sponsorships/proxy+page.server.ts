// @ts-nocheck
import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { sponsorshipApplications } from '$lib/db/schema/sepharstudios';
import { take } from '$lib/server/rate-limit';

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
	const session = await locals.auth.getSession();
	return {
		user: session?.user ? { id: session.user.id, email: session.user.email, name: session.user.name } : null
	};
};

export const actions = {
	submit: async ({ request, locals, getClientAddress }: import('./$types').RequestEvent) => {
		const session = await locals.auth.getSession();

		const bucketKey = session?.user.id ?? `ip:${getClientAddress()}`;
		const limit = await take(`sponsorships:${bucketKey}`, { capacity: 3, refillPerSec: 1 / 1800 });
		if (!limit.allowed) {
			return fail(429, { success: false, message: 'Too many submissions, try again later.' });
		}

		const data = await request.formData();
		const title = (data.get('title') as string | null)?.trim() ?? '';
		const synopsis = (data.get('synopsis') as string | null)?.trim() ?? '';
		const genre = (data.get('genre') as string | null)?.trim() ?? null;
		// Contact email/name are optional for signed-in users (we already have them).
		const email = (data.get('email') as string | null)?.trim() ?? session?.user.email ?? null;

		if (!title || title.length < 3) {
			return fail(400, { success: false, message: 'Project title is required.' });
		}
		if (!synopsis || synopsis.length < 40) {
			return fail(400, { success: false, message: 'Synopsis is too short (40+ characters).' });
		}
		if (!email) {
			return fail(400, { success: false, message: 'Contact email is required.' });
		}

		await db.insert(sponsorshipApplications).values({
			userId: session?.user.id ?? null,
			projectTitle: title.slice(0, 255),
			genre: genre?.slice(0, 60) ?? null,
			synopsis: synopsis.slice(0, 8000),
			contactEmail: email.slice(0, 320)
		});

		// File uploads (script, budget, storyboard) are received as parts in the
		// multipart form but not persisted here yet — they need their own MinIO
		// pipeline (separate from /api/files which is image-shaped). Capturing
		// the textual pitch on its own is honest empty-state for the file slots
		// until that pipeline ships.

		return { success: true, message: 'Thanks — your project is in the review queue. We will reach out within 5 business days.' };
	}
};
;null as any as Actions;