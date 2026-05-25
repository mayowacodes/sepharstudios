import { redirect } from "@sveltejs/kit";
import { u as usersRoles, C as Constants } from "../../../../chunks/index.js";
const load = (async ({ locals, url }) => {
  const user = locals.user;
  if (!user) throw redirect(303, `/auth/login?redirectTo=${url.pathname}`);
  if (!usersRoles.includes(user.role)) throw redirect(303, Constants.AFTERAUTH);
  return {};
});
export {
  load
};
