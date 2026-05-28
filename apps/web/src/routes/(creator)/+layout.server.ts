import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

// Guards every route under (creator)/*. Admins can view creator pages too —
// they often need to inspect a creator's workspace for moderation.
export const load: LayoutServerLoad = async ({ locals }) => {
  const user = locals.user;
  if (!user) throw error(401, 'Sign in required');
  if (user.role !== 'creator' && user.role !== 'admin') {
    throw error(403, 'Forbidden: you are not a creator');
  }
  return { user };
};
