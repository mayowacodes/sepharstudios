import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { tax1099Forms, creators } from '$lib/db/schema/sepharstudios';
import { and, desc, eq } from 'drizzle-orm';
import { Role } from '$lib/constants';

/**
 * GET /api/creator/tax-1099-forms
 *
 * Returns every 1099 row the system has generated for the signed-in
 * creator, newest tax year first. Used by the tax-forms page to render
 * download links once the cron has rendered the PDF.
 */

export const GET: RequestHandler = async ({ locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role as Role)) {
		return json({ error: 'Forbidden' }, { status: 403 });
	}

	// creators.userId joins back to the signed-in user; admins can pass
	// ?creatorId to look up another creator's 1099s for support flows.
	const [creatorRow] = await db
		.select({ id: creators.id })
		.from(creators)
		.where(eq(creators.userId, session.user.id))
		.limit(1);
	if (!creatorRow) return json({ forms: [] });

	const rows = await db
		.select({
			id: tax1099Forms.id,
			taxYear: tax1099Forms.taxYear,
			totalPaidCents: tax1099Forms.totalPaidCents,
			pdfUrl: tax1099Forms.pdfUrl,
			emailedAt: tax1099Forms.emailedAt,
			createdAt: tax1099Forms.createdAt
		})
		.from(tax1099Forms)
		.where(and(eq(tax1099Forms.creatorId, creatorRow.id)))
		.orderBy(desc(tax1099Forms.taxYear));

	return json({ forms: rows });
};
