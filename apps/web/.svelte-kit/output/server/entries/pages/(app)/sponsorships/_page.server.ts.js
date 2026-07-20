import { t as private_env } from "../../../../chunks/shared-server.js";
import { ft as sponsorshipApplications, t as db } from "../../../../chunks/drizzle.js";
import { s as uploadAndSaveFile } from "../../../../chunks/minio2.js";
import { a as take } from "../../../../chunks/rate-limit.js";
import { fail } from "@sveltejs/kit";
//#region src/routes/(app)/sponsorships/+page.server.ts
var load = async ({ locals }) => {
	const session = await locals.auth.getSession();
	return { user: session?.user ? {
		id: session.user.id,
		email: session.user.email,
		name: session.user.name
	} : null };
};
var actions = { submit: async ({ request, locals, getClientAddress }) => {
	const session = await locals.auth.getSession();
	if (!(await take(`sponsorships:${session?.user.id ?? `ip:${getClientAddress()}`}`, {
		capacity: 3,
		refillPerSec: 1 / 1800
	})).allowed) return fail(429, {
		success: false,
		message: "Too many submissions, try again later."
	});
	const data = await request.formData();
	const title = data.get("title")?.trim() ?? "";
	const synopsis = data.get("synopsis")?.trim() ?? "";
	const genre = data.get("genre")?.trim() ?? null;
	const email = data.get("email")?.trim() ?? session?.user.email ?? null;
	if (!title || title.length < 3) return fail(400, {
		success: false,
		message: "Project title is required."
	});
	if (!synopsis || synopsis.length < 40) return fail(400, {
		success: false,
		message: "Synopsis is too short (40+ characters)."
	});
	if (!email) return fail(400, {
		success: false,
		message: "Contact email is required."
	});
	const bucket = private_env.MINIO_BUCKET || "uploads";
	const docSpecs = [
		{
			field: "script",
			kind: "script",
			mime: /^(application\/pdf|application\/msword|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document)$/,
			maxBytes: 10 * 1024 * 1024
		},
		{
			field: "budget_breakdown",
			kind: "budget",
			mime: /^(application\/pdf|application\/vnd\.ms-excel|application\/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet)$/,
			maxBytes: 10 * 1024 * 1024
		},
		{
			field: "storyboard",
			kind: "storyboard",
			mime: /^(application\/pdf|application\/zip|image\/jpeg|image\/png)$/,
			maxBytes: 10 * 1024 * 1024
		}
	];
	const documents = [];
	for (const spec of docSpecs) {
		const file = data.get(spec.field);
		if (!(file instanceof File) || file.size === 0) continue;
		if (file.size > spec.maxBytes) return fail(400, {
			success: false,
			message: `${spec.kind} file exceeds 10 MB.`
		});
		if (!spec.mime.test(file.type)) return fail(400, {
			success: false,
			message: `${spec.kind} has an unsupported file type.`
		});
		try {
			const result = await uploadAndSaveFile(file, bucket);
			const url = result.file?.url ?? result.url;
			if (url) documents.push({
				kind: spec.kind,
				url,
				name: file.name,
				size: file.size
			});
		} catch (err) {
			console.error(`[sponsorships] ${spec.kind} upload failed:`, err);
		}
	}
	await db.insert(sponsorshipApplications).values({
		userId: session?.user.id ?? null,
		projectTitle: title.slice(0, 255),
		genre: genre?.slice(0, 60) ?? null,
		synopsis: synopsis.slice(0, 8e3),
		contactEmail: email.slice(0, 320),
		documents: documents.length > 0 ? documents : null
	});
	return {
		success: true,
		message: "Thanks — your project is in the review queue. We will reach out within 5 business days."
	};
} };
//#endregion
export { actions, load };
