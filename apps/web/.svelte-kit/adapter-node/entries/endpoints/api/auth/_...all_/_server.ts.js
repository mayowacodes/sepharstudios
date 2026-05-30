import { t as auth } from "../../../../../chunks/auth.js";
//#region src/routes/api/auth/[...all]/+server.ts
var GET = async ({ request }) => auth.handler(request);
var POST = async ({ request }) => auth.handler(request);
//#endregion
export { GET, POST };
