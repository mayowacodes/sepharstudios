import { t as private_env } from "../../../../../chunks/shared-server.js";
import { T as creators, Y as payouts, a as user, ht as taxForms, mt as tax1099Forms, t as db } from "../../../../../chunks/drizzle.js";
import { t as notify } from "../../../../../chunks/notify.js";
import { i as SiteMeta } from "../../../../../chunks/constants.js";
import { o as uploadFile } from "../../../../../chunks/minio2.js";
import { json } from "@sveltejs/kit";
import { and, eq, gte, isNull, lt, sql } from "drizzle-orm";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
//#region src/lib/server/tax-1099-pdf.ts
/**
* 1099-NEC PDF renderer for creator payouts.
*
* What this produces:
*   A clean, single-page creator-facing summary PDF showing payer info,
*   recipient info, tax year, and Box 1 (nonemployee compensation).
*   This is what we send the creator for their records.
*
* What this does NOT do:
*   It does not produce an IRS-fileable form. IRS requires the official
*   1099-NEC red-ink form for paper filing, or e-filing via the FIRE
*   system. Producing a fileable PDF means overlaying onto the official
*   IRS template PDF — drop that file at `src/lib/server/templates/
*   1099-nec.pdf` and switch render1099NecPdf() to use overlayMode=true.
*
* Storage:
*   Renders in-memory, uploads to MinIO under the `documents` bucket at
*   `1099/<taxYear>/<creatorId>.pdf`. Returns the directUrl which we
*   persist on `tax_1099_forms.pdf_url`.
*/
var BUCKET = private_env.MINIO_DOCS_BUCKET || private_env.MINIO_BUCKET || "uploads";
function payerInfo() {
	return {
		name: private_env.PAYER_LEGAL_NAME ?? SiteMeta.name,
		address: private_env.PAYER_ADDRESS ?? "",
		taxId: private_env.PAYER_TAX_ID ?? ""
	};
}
function money(cents) {
	const dollars = Math.floor(cents / 100);
	const fractional = Math.abs(cents % 100).toString().padStart(2, "0");
	return `$${dollars.toLocaleString("en-US")}.${fractional}`;
}
function safe(text) {
	if (!text) return "";
	let out = "";
	for (const ch of text) {
		const code = ch.charCodeAt(0);
		if (code >= 32 && code <= 126) out += ch;
		else if (code === 8216 || code === 8217) out += "'";
		else if (code === 8220 || code === 8221) out += "\"";
		else if (code === 8211 || code === 8212) out += "-";
	}
	return out;
}
async function render1099NecPdf(input) {
	const doc = await PDFDocument.create();
	const page = doc.addPage([612, 792]);
	const font = await doc.embedFont(StandardFonts.Helvetica);
	const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
	const black = rgb(0, 0, 0);
	const gray = rgb(.45, .45, .45);
	const accent = rgb(.42, .27, .76);
	const payer = payerInfo();
	page.drawRectangle({
		x: 0,
		y: 740,
		width: 612,
		height: 52,
		color: accent
	});
	page.drawText("Form 1099-NEC Summary", {
		x: 36,
		y: 762,
		size: 18,
		font: fontBold,
		color: rgb(1, 1, 1)
	});
	page.drawText(`Tax Year ${input.taxYear}`, {
		x: 36,
		y: 746,
		size: 11,
		font,
		color: rgb(1, 1, 1)
	});
	page.drawText("Informational summary of nonemployee compensation paid in the tax year shown.", {
		x: 36,
		y: 716,
		size: 9,
		font,
		color: gray
	});
	page.drawText("This is your record copy. Retain for your tax filings; consult a tax professional with questions.", {
		x: 36,
		y: 704,
		size: 9,
		font,
		color: gray
	});
	const colY = 660;
	page.drawText("PAYER", {
		x: 36,
		y: colY,
		size: 9,
		font: fontBold,
		color: gray
	});
	page.drawLine({
		start: {
			x: 36,
			y: colY - 4
		},
		end: {
			x: 286,
			y: colY - 4
		},
		thickness: .5,
		color: gray
	});
	page.drawText(safe(payer.name), {
		x: 36,
		y: colY - 20,
		size: 11,
		font: fontBold,
		color: black
	});
	if (payer.address) payer.address.split("\n").slice(0, 3).forEach((line, i) => {
		page.drawText(safe(line), {
			x: 36,
			y: colY - 36 - i * 13,
			size: 10,
			font,
			color: black
		});
	});
	page.drawText("Payer TIN", {
		x: 36,
		y: colY - 90,
		size: 8,
		font,
		color: gray
	});
	page.drawText(safe(payer.taxId) || "—", {
		x: 36,
		y: colY - 102,
		size: 10,
		font,
		color: black
	});
	page.drawText("RECIPIENT", {
		x: 326,
		y: colY,
		size: 9,
		font: fontBold,
		color: gray
	});
	page.drawLine({
		start: {
			x: 326,
			y: colY - 4
		},
		end: {
			x: 576,
			y: colY - 4
		},
		thickness: .5,
		color: gray
	});
	page.drawText(safe(input.recipient.name), {
		x: 326,
		y: colY - 20,
		size: 11,
		font: fontBold,
		color: black
	});
	if (input.recipient.address) input.recipient.address.split("\n").slice(0, 3).forEach((line, i) => {
		page.drawText(safe(line), {
			x: 326,
			y: colY - 36 - i * 13,
			size: 10,
			font,
			color: black
		});
	});
	page.drawText("Recipient TIN (last 4)", {
		x: 326,
		y: colY - 90,
		size: 8,
		font,
		color: gray
	});
	const tinDisplay = input.recipient.taxIdLast4 ? `XXX-XX-${safe(input.recipient.taxIdLast4)}` : "—";
	page.drawText(tinDisplay, {
		x: 326,
		y: colY - 102,
		size: 10,
		font,
		color: black
	});
	const boxY = 480;
	page.drawRectangle({
		x: 36,
		y: boxY - 60,
		width: 540,
		height: 80,
		borderColor: black,
		borderWidth: 1
	});
	page.drawText("Box 1 — Nonemployee compensation", {
		x: 48,
		y: 488,
		size: 10,
		font: fontBold,
		color: black
	});
	page.drawText(money(input.totalPaidCents), {
		x: 48,
		y: boxY - 30,
		size: 28,
		font: fontBold,
		color: accent
	});
	page.drawText(`Tax year ${input.taxYear}`, {
		x: 48,
		y: boxY - 52,
		size: 9,
		font,
		color: gray
	});
	page.drawLine({
		start: {
			x: 36,
			y: 160
		},
		end: {
			x: 576,
			y: 160
		},
		thickness: .5,
		color: gray
	});
	page.drawText("Notes", {
		x: 36,
		y: 148,
		size: 9,
		font: fontBold,
		color: gray
	});
	[
		"• This summary reflects payouts marked as paid in the tax year shown.",
		"• Currency: USD. Amounts paid in other currencies were converted using the payout-day rate.",
		"• Disputes, refunds, and reversals after the tax-year cutoff are not included here.",
		`• Generated by ${SiteMeta.name} on ${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)} UTC.`
	].forEach((line, i) => {
		page.drawText(line, {
			x: 36,
			y: 132 - i * 12,
			size: 9,
			font,
			color: black
		});
	});
	const pdfBytes = await doc.save();
	const ab = pdfBytes.buffer.slice(pdfBytes.byteOffset, pdfBytes.byteOffset + pdfBytes.byteLength);
	const blob = new Blob([ab], { type: "application/pdf" });
	const objectKey = `1099/${input.taxYear}/${input.creatorId}.pdf`;
	const result = await uploadFile(BUCKET, objectKey, blob, { "Cache-Control": "private, max-age=300" });
	return {
		url: result.url,
		directUrl: result.directUrl,
		objectKey,
		pages: doc.getPageCount()
	};
}
//#endregion
//#region src/routes/api/cron/tax-1099-generate/+server.ts
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
var REPORTABLE_THRESHOLD_CENTS = 6e4;
var POST = async ({ request, url }) => {
	const auth = request.headers.get("authorization");
	const expected = private_env.CRON_SECRET;
	if (!expected) return json({ error: "CRON_SECRET not configured" }, { status: 500 });
	if (auth !== `Bearer ${expected}`) return json({ error: "Unauthorized" }, { status: 401 });
	const taxYear = Number(url.searchParams.get("taxYear") ?? (/* @__PURE__ */ new Date()).getFullYear() - 1);
	if (!Number.isInteger(taxYear) || taxYear < 2e3 || taxYear > 2100) return json({ error: "Invalid taxYear" }, { status: 400 });
	const yearStart = new Date(Date.UTC(taxYear, 0, 1));
	const yearEnd = new Date(Date.UTC(taxYear + 1, 0, 1));
	const eligible = await db.select({
		creatorId: creators.id,
		userId: creators.userId,
		displayName: creators.displayName,
		userEmail: user.email,
		userName: user.name,
		w9Data: taxForms.formData
	}).from(creators).innerJoin(user, eq(user.id, creators.userId)).innerJoin(taxForms, and(eq(taxForms.creatorId, creators.id), eq(taxForms.formKind, "W-9"), eq(taxForms.taxYear, taxYear), eq(taxForms.status, "verified")));
	const result = {
		eligible: eligible.length,
		generated: 0,
		skipped: 0,
		pdfsRendered: 0,
		pdfsBackfilled: 0,
		notified: 0,
		errors: []
	};
	function pickAddress(w9) {
		if (!w9 || typeof w9 !== "object") return null;
		const f = w9;
		const line = [
			f.address,
			f.streetAddress,
			f.mailingAddress
		].find((v) => typeof v === "string" && v.trim());
		return typeof line === "string" ? line : null;
	}
	function pickTinLast4(w9) {
		if (!w9 || typeof w9 !== "object") return null;
		const f = w9;
		const last4 = [
			f.taxIdLast4,
			f.tinLast4,
			f.ssnLast4
		].find((v) => typeof v === "string" && /^\d{4}$/.test(v));
		if (last4) return last4;
		const fullTin = [
			f.taxId,
			f.tin,
			f.ssn
		].find((v) => typeof v === "string");
		if (typeof fullTin === "string") {
			const digits = fullTin.replace(/\D/g, "");
			if (digits.length >= 4) return digits.slice(-4);
		}
		return null;
	}
	for (const c of eligible) try {
		const [agg] = await db.select({ total: sql`coalesce(sum(${payouts.netCents}), 0)::bigint` }).from(payouts).where(and(eq(payouts.creatorId, c.creatorId), eq(payouts.status, "paid"), gte(payouts.paidAt, yearStart), lt(payouts.paidAt, yearEnd)));
		const total = Number(agg?.total ?? 0);
		if (total < REPORTABLE_THRESHOLD_CENTS) {
			result.skipped += 1;
			continue;
		}
		const [existing] = await db.select({
			id: tax1099Forms.id,
			pdfUrl: tax1099Forms.pdfUrl
		}).from(tax1099Forms).where(and(eq(tax1099Forms.creatorId, c.creatorId), eq(tax1099Forms.taxYear, taxYear))).limit(1);
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
			const rendered = await render1099NecPdf(renderInput);
			await db.update(tax1099Forms).set({ pdfUrl: rendered.directUrl }).where(eq(tax1099Forms.id, existing.id));
			result.pdfsBackfilled += 1;
			continue;
		}
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
			kind: "subscription",
			title: `1099 ready for ${taxYear}`,
			message: `Your 1099 for ${taxYear} is ready to download. Total reported: $${(total / 100).toFixed(2)}.`,
			actionUrl: "/creator/earnings/tax-forms"
		}).catch(() => void 0);
		result.notified += 1;
	} catch (err) {
		result.errors.push(`${c.creatorId}: ${err instanceof Error ? err.message : String(err)}`);
	}
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
		}).from(tax1099Forms).innerJoin(creators, eq(creators.id, tax1099Forms.creatorId)).innerJoin(user, eq(user.id, creators.userId)).leftJoin(taxForms, and(eq(taxForms.creatorId, creators.id), eq(taxForms.formKind, "W-9"), eq(taxForms.taxYear, tax1099Forms.taxYear))).where(isNull(tax1099Forms.pdfUrl)).limit(50);
		for (const o of orphans) try {
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
			await db.update(tax1099Forms).set({ pdfUrl: rendered.directUrl }).where(eq(tax1099Forms.id, o.id));
			result.pdfsBackfilled += 1;
		} catch (err) {
			result.errors.push(`backfill ${o.id}: ${err instanceof Error ? err.message : String(err)}`);
		}
	} catch (err) {
		result.errors.push(`backfill scan: ${err instanceof Error ? err.message : String(err)}`);
	}
	return json({
		ok: true,
		taxYear,
		...result
	});
};
//#endregion
export { POST };
