import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

// Guards every route under (admin)/* with a server-side role check.
// The hook also enforces this on the admin.* subdomain, but this is defence in
// depth: if anyone hits an /admin/* path on the apex domain (or the hook is
// ever bypassed), the server load still refuses to render the page.
export const load: LayoutServerLoad = async ({ locals }) => {
  const user = locals.user;
  if (!user) throw error(401, 'Sign in required');
  if (user.role !== 'admin') throw error(403, 'Forbidden: you are not an admin');
  return { user };
};
