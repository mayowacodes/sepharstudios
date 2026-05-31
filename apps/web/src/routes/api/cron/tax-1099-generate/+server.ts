import { json, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { db } from '$lib/db/drizzle';
import { taxForms, tax1099Forms, payouts, creators } from '$lib/db/schema/sepharstudios';
import { user } from '$lib/db/schema';
import { and, eq, gte, lt, isNull, sql } from 'drizzle-orm';
import { notify } from '$lib/server/notify';
import { render1099NecPdf } from '$lib/server/tax-1099-pdf';

/**
 * POST /api/cron/tax-1099-generate
 *
 * Annual run (recommended late January for previous year's tax year).
 * Generates 1099 records for US creators with a verified W-9 whose total
 * paid in the year ≥ $600. Stores a row in tax_1099_forms, renders a
 * creator-facing summary PDF, and notifies the creator.
 *
 * Idempotent on (creatorId, taxYear). Re-running the cron only renders
 * PDFs for rows where pdf_url IS NULL, so it doubles as the backfill
 * pass for legacy rows that were created before the PDF renderer landed.
 *
 * Query: ?taxYear=2025 (defaults to current year - 1)
 * Auth: CRON_SECRET bearer.
 */

const REPORTABLE_THRESHOLD_CENTS = 60_000; // $600

export const POST: RequestHandler = async ({ request, url }) => {
	const auth = request.headers.get('authorization');
	const expected = env.CRON_SECRET;
	if (!expected) return json({ error: 'CRON_SECRET not configured' }, { status: 500 });
	if (auth !== `Bearer ${expected}`) return json({ error: 'Unauthorized' }, { status: 401 });

	const taxYear = Number(url.searchParams.get('taxYear') ?? (new Date().getFullYear() - 1));
	if (!Number.isInteger(taxYear) || taxYear < 2000 || taxYear > 2100) {
		return json({ error: 'Invalid taxYear' }, { status: 400 });
	}

	const yearStart = new Date(Date.UTC(taxYear, 0, 1));
	const yearEnd = new Date(Date.UTC(taxYear + 1, 0, 1));

	// US persons with a verified W-9 on file for this year. We pull formData
	// so the PDF renderer can address the recipient (name, address, last4
	// TIN) without an extra round-trip per row.
	const eligible = await db.select({
		creatorId: creators.id,
		userId: creators.userId,
		displayName: creators.displayName,
		userEmail: user.email,
		userName: user.name,
		w9Data: taxForms.formData
	})
		.from(creators)
		.innerJoin(user, eq(user.id, creators.userId))
		.innerJoin(taxForms, and(
			eq(taxForms.creatorId, creators.id),
			eq(taxForms.formKind, 'W-9'),
			eq(taxForms.taxYear, taxYear),
			eq(taxForms.status, 'verified')
		));

	const result = {
		eligible: eligible.length,
		generated: 0,
		skipped: 0,
		pdfsRendered: 0,
		pdfsBackfilled: 0,
		notified: 0,
		errors: [] as string[]
	};

	function pickAddress(w9: unknown): string | null {
		if (!w9 || typeof w9 !== 'object') return null;
		const f = w9 as Record<string, unknown>;
		const candidates = [f.address, f.streetAddress, f.mailingAddress];
		const line = candidates.find((v) => typeof v === 'string' && (v as string).trim());
		return typeof line === 'string' ? line : null;
	}
	function pickTinLast4(w9: unknown): string | null {
		if (!w9 || typeof w9 !== 'object') return null;
		const f = w9 as Record<string, unknown>;
		const candidates = [f.taxIdLast4, f.tinLast4, f.ssnLast4];
		const last4 = candidates.find((v) => typeof v === 'string' && /^\d{4}$/.test(v as string));
		if (last4) return last4 as string;
		// Some forms store the full TIN — derive last 4.
		const fullTin = [f.taxId, f.tin, f.ssn].find((v) => typeof v === 'string');
		if (typeof fullTin === 'string') {
			const digits = fullTin.replace(/\D/g, '');
			if (digits.length >= 4) return digits.slice(-4);
		}
		return null;
	}

	for (const c of eligible) {
		try {
			// Annual paid total = sum of payouts.netCents where status='paid' in the tax year.
			const [agg] = await db.select({
				total: sql<number>`coalesce(sum(${payouts.netCents}), 0)::bigint`
			})
				.from(payouts)
				.where(and(
					eq(payouts.creatorId, c.creatorId),
					eq(payouts.status, 'paid'),
					gte(payouts.paidAt, yearStart),
					lt(payouts.paidAt, yearEnd)
				));
			const total = Number(agg?.total ?? 0);
			if (total < REPORTABLE_THRESHOLD_CENTS) {
				result.skipped += 1;
				continue;
			}

			// Idempotent on (creatorId, taxYear). If the row exists but
			// pdf_url is null, treat as backfill — render and update.
			const [existing] = await db.select({
				id: tax1099Forms.id,
				pdfUrl: tax1099Forms.pdfUrl
			})
				.from(tax1099Forms)
				.where(and(eq(tax1099Forms.creatorId, c.creatorId), eq(tax1099Forms.taxYear, taxYear)))
				.limit(1);

			const renderInput = {
				creatorId: c.creatorId,
				taxYear,
				recipient: {
					name: c.userName ?? c.displayName,
					address: pickAddress(c.w9Data),
					taxIdLast4: pickTinLast4(c.w9Data),
					email: c.userEmail
				},
				totalPaidCents: total
			};

			if (existing) {
				if (existing.pdfUrl) {
					result.skipped += 1;
					continue;
				}
				// Backfill the PDF for a row that pre-dated the renderer.
				const rendered = await render1099NecPdf(renderInput);
				await db.update(tax1099Forms)
					.set({ pdfUrl: rendered.directUrl })
					.where(eq(tax1099Forms.id, existing.id));
				result.pdfsBackfilled += 1;
				continue;
			}

			// New row — render PDF first so the row lands with the URL set
			// (avoids notify-now-PDF-later UX).
			const rendered = await render1099NecPdf(renderInput);

			await db.insert(tax1099Forms).values({
				creatorId: c.creatorId,
				taxYear,
				totalPaidCents: total,
				pdfUrl: rendered.directUrl
			});
			result.generated += 1;
			result.pdfsRendered += 1;

			notify({
				userId: c.userId,
				kind: 'subscription',
				title: `1099 ready for ${taxYear}`,
				message: `Your 1099 for ${taxYear} is ready to download. Total reported: $${(total / 100).toFixed(2)}.`,
				actionUrl: '/creator/earnings/tax-forms'
			}).catch(() => undefined);
			result.notified += 1;
		} catch (err) {
			result.errors.push(`${c.creatorId}: ${err instanceof Error ? err.message : String(err)}`);
		}
	}

	// Also pick up rows from prior tax years that still have no PDF — same
	// renderer, same recipient lookup. Lets the annual cron heal historical
	// gaps in one pass.
	try {
		const orphans = await db.select({
			id: tax1099Forms.id,
			creatorId: tax1099Forms.creatorId,
			taxYear: tax1099Forms.taxYear,
			totalPaidCents: tax1099Forms.totalPaidCents,
			userId: creators.userId,
			displayName: creators.displayName,
			userEmail: user.email,
			userName: user.name,
			w9Data: taxForms.formData
		})
			.from(tax1099Forms)
			.innerJoin(creators, eq(creators.id, tax1099Forms.creatorId))
			.innerJoin(user, eq(user.id, creators.userId))
			.leftJoin(taxForms, and(
				eq(taxForms.creatorId, creators.id),
				eq(taxForms.formKind, 'W-9'),
				eq(taxForms.taxYear, tax1099Forms.taxYear)
			))
			.where(isNull(tax1099Forms.pdfUrl))
			.limit(50);

		for (const o of orphans) {
			try {
				const rendered = await render1099NecPdf({
					creatorId: o.creatorId,
					taxYear: o.taxYear,
					recipient: {
						name: o.userName ?? o.displayName,
						address: pickAddress(o.w9Data),
						taxIdLast4: pickTinLast4(o.w9Data),
						email: o.userEmail
					},
					totalPaidCents: Number(o.totalPaidCents ?? 0)
				});
				await db.update(tax1099Forms)
					.set({ pdfUrl: rendered.directUrl })
					.where(eq(tax1099Forms.id, o.id));
				result.pdfsBackfilled += 1;
			} catch (err) {
				result.errors.push(`backfill ${o.id}: ${err instanceof Error ? err.message : String(err)}`);
			}
		}
	} catch (err) {
		result.errors.push(`backfill scan: ${err instanceof Error ? err.message : String(err)}`);
	}

	return json({ ok: true, taxYear, ...result });
};
