import { auth } from '$lib/auth';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ request, locals, url }) => {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) throw redirect(302, `/auth/login?redirectTo=${url.pathname}`);
  return { session, user: session.user };
}) satisfies LayoutServerLoad;
