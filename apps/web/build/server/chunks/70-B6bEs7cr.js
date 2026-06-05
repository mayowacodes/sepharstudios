import { p as private_env } from './shared-server-DUDL94jl.js';
import { w as db, a6 as sponsorshipApplications } from './drizzle-CKUH7ukq.js';
import { t as take } from './rate-limit-C3y7GHEd.js';
import { u as uploadAndSaveFile } from './minio2-CjcJBaLF.js';
import { f as fail } from './index-Cv5VcsYq.js';
import './rolldown-runtime-pTpnEGsq.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import 'drizzle-orm';
import './redis-B0W1dNO5.js';
import 'ioredis';
import 'minio';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

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

var _page_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	actions: actions,
	load: load
});

const index = 70;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-CnDC-WMR.js')).default;
const server_id = "src/routes/(app)/sponsorships/+page.server.ts";
const imports = ["_app/immutable/nodes/70.BpzFPYtS.js","_app/immutable/chunks/BrQ41psm.js","_app/immutable/chunks/CocL4akC.js","_app/immutable/chunks/-c01j_DQ.js","_app/immutable/chunks/BYLiR5YE.js","_app/immutable/chunks/BSdbgJIN2.js","_app/immutable/chunks/Clnoo-nb2.js","_app/immutable/chunks/Cvt29zcG2.js","_app/immutable/chunks/CbLu3LzT2.js","_app/immutable/chunks/bBIPRcQI2.js","_app/immutable/chunks/Dqag1JzJ.js","_app/immutable/chunks/j5L7JOaG.js","_app/immutable/chunks/DWyV3ox3.js","_app/immutable/chunks/DTkeaA6Q2.js","_app/immutable/chunks/ZcdXcAV-.js","_app/immutable/chunks/BxLQxVhM.js","_app/immutable/chunks/CWuPlnNs.js","_app/immutable/chunks/B3AYJye92.js","_app/immutable/chunks/Dy-TKAjK.js"];
const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=70-B6bEs7cr.js.map
