import { auth, type User } from "$lib/auth";
import { svelteKitHandler } from "better-auth/svelte-kit";
import { building } from "$app/environment";

export async function handle({ event, resolve }) {
  const session = await auth.api.getSession({
    headers: event.request.headers,
  });

  if (session) {
    event.locals.session = session.session;
    event.locals.user = session.user as User;
  } else {
    event.locals.session = undefined;
    event.locals.user = undefined;
  }

  return svelteKitHandler({ event, resolve, auth, building });
}
