import { auth } from "$lib/auth";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ request }) => auth.handler(request);
export const POST: RequestHandler = async ({ request }) => auth.handler(request);
