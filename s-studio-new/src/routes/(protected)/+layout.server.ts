import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
    const { userId } = locals.auth

    if (!userId) {
        throw redirect(302, '/sign-in');
    }
    return {};
}) satisfies LayoutServerLoad;