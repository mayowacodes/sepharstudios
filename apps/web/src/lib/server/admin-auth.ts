import type { RequestEvent } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { user } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

export interface AdminActor {
	id: string;
	name: string;
	email: string;
}

export async function getAdminActor(locals: RequestEvent['locals']): Promise<AdminActor | null> {
	const session = await locals.auth.getSession();
	if (!session) return null;

	const [account] = await db
		.select({ id: user.id, role: user.role, name: user.name, email: user.email })
		.from(user)
		.where(eq(user.id, session.user.id))
		.limit(1);

	if (!account || account.role !== 'admin') return null;

	return {
		id: account.id,
		name: account.name ?? session.user.name ?? 'Admin',
		email: account.email ?? session.user.email
	};
}

