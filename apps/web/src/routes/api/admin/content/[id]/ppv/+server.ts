import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { ppvContent } from '$lib/db/schema/sepharstudios';
import { eq } from 'drizzle-orm';

// POST /api/admin/content/[id]/ppv — set or update PPV pricing for a content item
export const POST: RequestHandler = async ({ params, request, locals }) => {
	if (locals.user?.role !== 'admin') {
		return json({ error: 'Forbidden' }, { status: 403 });
	}

	const contentId = params.id!;
	const { finalPriceCents, isActive } = await request.json() as {
		finalPriceCents: number;
		isActive: boolean;
	};

	if (!finalPriceCents || finalPriceCents < 99) {
		return json({ error: 'Final price must be at least $0.99 (99 cents)' }, { status: 400 });
	}

	// Upsert — update if exists, insert if not
	const existing = await db.select({ id: ppvContent.id })
		.from(ppvContent)
		.where(eq(ppvContent.contentId, contentId))
		.then((r) => r[0]);

	if (existing) {
		await db.update(ppvContent)
			.set({
				finalPriceCents,
				isActive,
				adminApprovedAt: isActive ? new Date() : null
			})
			.where(eq(ppvContent.id, existing.id));
	} else {
		await db.insert(ppvContent).values({
			contentId,
			finalPriceCents,
			isActive,
			adminApprovedAt: isActive ? new Date() : null
		});
	}

	return json({ success: true, finalPriceCents, isActive });
};

// DELETE /api/admin/content/[id]/ppv — remove PPV from content
export const DELETE: RequestHandler = async ({ params, locals }) => {
	if (locals.user?.role !== 'admin') {
		return json({ error: 'Forbidden' }, { status: 403 });
	}

	await db.delete(ppvContent).where(eq(ppvContent.contentId, params.id!));
	return json({ success: true });
};
