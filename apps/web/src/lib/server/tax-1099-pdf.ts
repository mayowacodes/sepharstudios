import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { env } from '$env/dynamic/private';
import { uploadFile } from '$lib/server/minio';
import { SiteMeta } from '$lib/constants';

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

const BUCKET = env.MINIO_DOCS_BUCKET || env.MINIO_BUCKET || 'uploads';

export interface Render1099NecInput {
	creatorId: string;
	taxYear: number;
	recipient: {
		name: string;
		address?: string | null;
		taxIdLast4?: string | null;
		email?: string | null;
	};
	totalPaidCents: number;
}

function payerInfo() {
	return {
		name: env.PAYER_LEGAL_NAME ?? SiteMeta.name,
		address: env.PAYER_ADDRESS ?? '',
		taxId: env.PAYER_TAX_ID ?? ''
	};
}

function money(cents: number): string {
	const dollars = Math.floor(cents / 100);
	const fractional = Math.abs(cents % 100).toString().padStart(2, '0');
	return `$${dollars.toLocaleString('en-US')}.${fractional}`;
}

function safe(text: string | null | undefined): string {
	// pdf-lib's StandardFonts (WinAnsi) only handles a subset of glyphs. We
	// strip anything outside the printable WinAnsi range so a stray emoji
	// or curly quote in user-entered fields doesn't blow up the encode.
	if (!text) return '';
	let out = '';
	for (const ch of text) {
		const code = ch.charCodeAt(0);
		if (code >= 0x20 && code <= 0x7e) out += ch;
		else if (code === 0x2018 || code === 0x2019) out += "'";
		else if (code === 0x201c || code === 0x201d) out += '"';
		else if (code === 0x2013 || code === 0x2014) out += '-';
		// drop everything else (emoji, non-Latin scripts) — sufficient for
		// US W-9 / 1099 use which is Latin-only by IRS rule
	}
	return out;
}

export async function render1099NecPdf(input: Render1099NecInput): Promise<{
	url: string;
	directUrl: string;
	objectKey: string;
	pages: number;
}> {
	const doc = await PDFDocument.create();
	const page = doc.addPage([612, 792]); // US Letter
	const font = await doc.embedFont(StandardFonts.Helvetica);
	const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

	const black = rgb(0, 0, 0);
	const gray = rgb(0.45, 0.45, 0.45);
	const accent = rgb(0.42, 0.27, 0.76); // sephar purple

	const payer = payerInfo();

	// Title bar
	page.drawRectangle({ x: 0, y: 740, width: 612, height: 52, color: accent });
	page.drawText('Form 1099-NEC Summary', { x: 36, y: 762, size: 18, font: fontBold, color: rgb(1, 1, 1) });
	page.drawText(`Tax Year ${input.taxYear}`, { x: 36, y: 746, size: 11, font, color: rgb(1, 1, 1) });

	// Disclaimer
	page.drawText(
		'Informational summary of nonemployee compensation paid in the tax year shown.',
		{ x: 36, y: 716, size: 9, font, color: gray }
	);
	page.drawText(
		'This is your record copy. Retain for your tax filings; consult a tax professional with questions.',
		{ x: 36, y: 704, size: 9, font, color: gray }
	);

	// Two-column block: PAYER (left), RECIPIENT (right)
	const colY = 660;
	page.drawText('PAYER', { x: 36, y: colY, size: 9, font: fontBold, color: gray });
	page.drawLine({ start: { x: 36, y: colY - 4 }, end: { x: 286, y: colY - 4 }, thickness: 0.5, color: gray });
	page.drawText(safe(payer.name), { x: 36, y: colY - 20, size: 11, font: fontBold, color: black });
	if (payer.address) {
		const addressLines = payer.address.split('\n').slice(0, 3);
		addressLines.forEach((line, i) => {
			page.drawText(safe(line), { x: 36, y: colY - 36 - i * 13, size: 10, font, color: black });
		});
	}
	page.drawText('Payer TIN', { x: 36, y: colY - 90, size: 8, font, color: gray });
	page.drawText(safe(payer.taxId) || '—', { x: 36, y: colY - 102, size: 10, font, color: black });

	page.drawText('RECIPIENT', { x: 326, y: colY, size: 9, font: fontBold, color: gray });
	page.drawLine({ start: { x: 326, y: colY - 4 }, end: { x: 576, y: colY - 4 }, thickness: 0.5, color: gray });
	page.drawText(safe(input.recipient.name), { x: 326, y: colY - 20, size: 11, font: fontBold, color: black });
	if (input.recipient.address) {
		const addressLines = input.recipient.address.split('\n').slice(0, 3);
		addressLines.forEach((line, i) => {
			page.drawText(safe(line), { x: 326, y: colY - 36 - i * 13, size: 10, font, color: black });
		});
	}
	page.drawText('Recipient TIN (last 4)', { x: 326, y: colY - 90, size: 8, font, color: gray });
	const tinDisplay = input.recipient.taxIdLast4 ? `XXX-XX-${safe(input.recipient.taxIdLast4)}` : '—';
	page.drawText(tinDisplay, { x: 326, y: colY - 102, size: 10, font, color: black });

	// Box 1 — Nonemployee compensation
	const boxY = 480;
	page.drawRectangle({
		x: 36, y: boxY - 60, width: 540, height: 80,
		borderColor: black, borderWidth: 1
	});
	page.drawText('Box 1 — Nonemployee compensation', { x: 48, y: boxY + 8, size: 10, font: fontBold, color: black });
	page.drawText(money(input.totalPaidCents), { x: 48, y: boxY - 30, size: 28, font: fontBold, color: accent });
	page.drawText(`Tax year ${input.taxYear}`, { x: 48, y: boxY - 52, size: 9, font, color: gray });

	// Footer / notes
	const footerY = 100;
	page.drawLine({ start: { x: 36, y: footerY + 60 }, end: { x: 576, y: footerY + 60 }, thickness: 0.5, color: gray });
	page.drawText('Notes', { x: 36, y: footerY + 48, size: 9, font: fontBold, color: gray });
	const notes = [
		'• This summary reflects payouts marked as paid in the tax year shown.',
		'• Currency: USD. Amounts paid in other currencies were converted using the payout-day rate.',
		'• Disputes, refunds, and reversals after the tax-year cutoff are not included here.',
		`• Generated by ${SiteMeta.name} on ${new Date().toISOString().slice(0, 10)} UTC.`
	];
	notes.forEach((line, i) => {
		page.drawText(line, { x: 36, y: footerY + 32 - i * 12, size: 9, font, color: black });
	});

	const pdfBytes = await doc.save();
	// pdf-lib returns a Uint8Array; wrap as a Blob (with explicit type) so
	// uploadFile() can read it via arrayBuffer().
	// Use ArrayBuffer slice to avoid SharedArrayBuffer typing issues.
	const ab = pdfBytes.buffer.slice(pdfBytes.byteOffset, pdfBytes.byteOffset + pdfBytes.byteLength) as ArrayBuffer;
	const blob = new Blob([ab], { type: 'application/pdf' });

	const objectKey = `1099/${input.taxYear}/${input.creatorId}.pdf`;
	const result = await uploadFile(BUCKET, objectKey, blob, {
		'Cache-Control': 'private, max-age=300'
	});

	return {
		url: result.url,
		directUrl: result.directUrl,
		objectKey,
		pages: doc.getPageCount()
	};
}
