import { a as auth } from "../../../chunks/auth.js";
import { redirect } from "@sveltejs/kit";
const load = (async ({ request, locals, url }) => {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) throw redirect(302, `/auth/login?redirectTo=${url.pathname}`);
  return { session, user: session.user };
});
export {
  load
};
