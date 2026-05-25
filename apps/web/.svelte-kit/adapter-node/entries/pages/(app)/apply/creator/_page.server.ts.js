import { redirect } from "@sveltejs/kit";
const load = (async ({ locals, url }) => {
  const user = locals.user;
  if (!user) throw redirect(303, `/auth/login?redirectTo=${url.pathname}`);
  return {};
});
export {
  load
};
