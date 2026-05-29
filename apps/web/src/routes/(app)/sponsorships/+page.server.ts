import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { sponsorshipApplications } from '$lib/db/schema/sepharstudios';
import { take } from '$lib/server/rate-limit';
import { uploadAndSaveFile } from '$lib/server/minio';
import { env } from '$env/dynamic/private';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.getSession();
	return {
		user: session?.user ? { id: session.user.id, email: session.user.email, name: session.user.name } : null
	};
};

export const actions: Actions = {
	submit: async ({ request, locals, getClientAddress }) => {
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

		// Persist supporting documents into MinIO. We don't fail the whole
		// submission on a per-file upload error — better to keep the pitch
		// captured than reject the whole row if the storyboard upload glitches.
		const bucket = env.MINIO_BUCKET || 'uploads';
		const docSpecs: Array<{ field: string; kind: string; mime: RegExp; maxBytes: number }> = [
			{ field: 'script', kind: 'script', mime: /^(application\/pdf|application\/msword|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document)$/, maxBytes: 10 * 1024 * 1024 },
			{ field: 'budget_breakdown', kind: 'budget', mime: /^(application\/pdf|application\/vnd\.ms-excel|application\/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet)$/, maxBytes: 10 * 1024 * 1024 },
			{ field: 'storyboard', kind: 'storyboard', mime: /^(application\/pdf|application\/zip|image\/jpeg|image\/png)$/, maxBytes: 10 * 1024 * 1024 }
		];

		const documents: Array<{ kind: string; url: string; name: string; size?: number }> = [];
		for (const spec of docSpecs) {
			const file = data.get(spec.field);
			if (!(file instanceof File) || file.size === 0) continue;
			if (file.size > spec.maxBytes) {
				return fail(400, { success: false, message: `${spec.kind} file exceeds 10 MB.` });
			}
			if (!spec.mime.test(file.type)) {
				return fail(400, { success: false, message: `${spec.kind} has an unsupported file type.` });
			}
			try {
				const result = await uploadAndSaveFile(file, bucket);
				const url = (result as { file?: { url?: string }; url?: string }).file?.url
					?? (result as { url?: string }).url;
				if (url) documents.push({ kind: spec.kind, url, name: file.name, size: file.size });
			} catch (err) {
				console.error(`[sponsorships] ${spec.kind} upload failed:`, err);
			}
		}

		await db.insert(sponsorshipApplications).values({
			userId: session?.user.id ?? null,
			projectTitle: title.slice(0, 255),
			genre: genre?.slice(0, 60) ?? null,
			synopsis: synopsis.slice(0, 8000),
			contactEmail: email.slice(0, 320),
			documents: documents.length > 0 ? documents : null
		});

		return { success: true, message: 'Thanks — your project is in the review queue. We will reach out within 5 business days.' };
	}
};
