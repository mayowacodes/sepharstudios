import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { taxForms, creators } from '$lib/db/schema/sepharstudios';
import { user } from '$lib/db/schema';
import { and, desc, eq } from 'drizzle-orm';

/**
 * GET /api/admin/tax-forms?status=
 *
 * Tax form review queue. Admin-only. Joins creator + user for display.
 */

export const GET: RequestHandler = async ({ url, locals }) => {
	if (locals.user?.role !== 'admin') return json({ error: 'Forbidden' }, { status: 403 });

	const status = url.searchParams.get('status');

	const rows = await db.select({
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
	})
		.from(taxForms)
		.leftJoin(creators, eq(creators.id, taxForms.creatorId))
		.leftJoin(user, eq(user.id, creators.userId))
		.where(status ? eq(taxForms.status, status) : undefined)
		.orderBy(desc(taxForms.submittedAt))
		.limit(200);

	return json({ forms: rows });
};
