import { a as auth } from './auth-PuLQJk1d.js';
import 'zod';
import './defu-BDNAzC90.js';
import { b as building } from './index-BB3j6gxp.js';
import 'drizzle-orm';
import './drizzle-D6ijTnnB.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import './shared-server-BeisX7n9.js';
import 'drizzle-orm/pg-core';
import './index4-Cnd3Rmm9.js';
import './index-C14HL8mA.js';
import './index-client-DVey9PBT.js';
import './dev-cqarhAJ0.js';
import './Icon-DLeFNkXp.js';
import './users-CMHMaCG6.js';
import './user-CU8eWwNU.js';
import './index-BcOZ6EV9.js';
import './utils-FiC4zhrQ.js';
import './exports-BuGzoaN1.js';
import './index3-CnQVvK5M.js';
import './events-DndNBaun.js';

const svelteKitHandler = async ({ auth: auth2, event, resolve, building: building2 }) => {
  const { request, url } = event;
  if (isAuthPath(url.toString(), auth2.options)) return auth2.handler(request);
  return resolve(event);
};
function isAuthPath(url, options) {
  const _url = new URL(url);
  const baseURL = new URL(`${options.baseURL || _url.origin}${options.basePath || "/api/auth"}`);
  if (_url.origin !== baseURL.origin) return false;
  if (!_url.pathname.startsWith(baseURL.pathname.endsWith("/") ? baseURL.pathname : `${baseURL.pathname}/`)) return false;
  return true;
}
async function handle({ event, resolve }) {
  const session = await auth.api.getSession({
    headers: event.request.headers
  });
  if (session) {
    event.locals.session = session.session;
    event.locals.user = session.user;
  } else {
    event.locals.session = void 0;
    event.locals.user = void 0;
  }
  return svelteKitHandler({ event, resolve, auth, building });
}

export { handle };
//# sourceMappingURL=hooks.server-Ivnu1Y6o.js.map
