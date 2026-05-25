import { a as auth } from "../../../../../chunks/auth.js";
const GET = async ({ request }) => auth.handler(request);
const POST = async ({ request }) => auth.handler(request);
export {
  GET,
  POST
};
