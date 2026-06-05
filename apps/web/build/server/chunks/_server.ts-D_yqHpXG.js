import { w as db, ag as user, u as creators, ad as taxForms } from './drizzle-CKUH7ukq.js';
import { j as json } from './index-Cv5VcsYq.js';
import { eq, desc } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/routes/api/admin/tax-forms/+server.ts
/**
* GET /api/admin/tax-forms?status=
*
* Tax form review queue. Admin-only. Joins creator + user for display.
*/
var GET = async ({ url, locals }) => {
	if (locals.user?.role !== "admin") return json({ error: "Forbidden" }, { status: 403 });
	const status = url.searchParams.get("status");
	return json({ forms: await db.select({
		id: taxForms.id,
		formKind: taxForms.formKind,
		taxYear: taxForms.taxYear,
		status: taxForms.status,
		submittedAt: taxForms.submittedAt,
		verifiedAt: taxForms.verifiedAt,
		rejectionReason: taxForms.rejectionReason,
		pdfUrl: taxForms.pdfUrl,
		formData: taxForms.formData,
		creatorId: creators.id,
		creatorDisplayName: creators.displayName,
		creatorEmail: user.email,
		userName: user.name
	}).from(taxForms).leftJoin(creators, eq(creators.id, taxForms.creatorId)).leftJoin(user, eq(user.id, creators.userId)).where(status ? eq(taxForms.status, status) : void 0).orderBy(desc(taxForms.submittedAt)).limit(200) });
};

export { GET };
//# sourceMappingURL=_server.ts-D_yqHpXG.js.map
