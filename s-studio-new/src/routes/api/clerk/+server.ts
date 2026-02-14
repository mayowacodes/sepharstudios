import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { Webhook } from "svix";
import { CLERK_SECRET_KEY } from '$env/static/private';

import type { WebhookEvent } from '@clerk/clerk-sdk-node';
import { emailToTag } from '@toolsntuts/utils';
import { getXataClient, XataClient } from '$lib/xata';

export const GET: RequestHandler = async () => json({ message: "Hello World" });

const processDatabaseUpdate = async (xata: XataClient, event: WebhookEvent) => {
  try {
    switch (event.type) {
      case "user.created": {
        const email = event.data.email_addresses?.[0]?.email_address ?? "unknown@example.com";
        const nameTag = emailToTag(email);
        const userData = {
          name: `${event.data.first_name ?? "Guest"} ${event.data.last_name ?? ""}`.trim(),
          email,
          bio: `nameTag: ${nameTag}`
        };
        await xata.db.users.create(userData);
        break;
      }
      case "user.updated": {
        const record = await xata.db.users.filter({ email: event.data.email_addresses?.[0]?.email_address }).getFirst();
        if (!record) throw new Error("User not found");
        
        const updatedName = `${event.data.first_name ?? "Guest"} ${event.data.last_name ?? ""}`.trim();
        await xata.db.users.update(record.xata_id, {
          name: updatedName
        });
        break;
      }
      default:
        console.warn(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error("Database update error", error);
    throw error;
  }
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const xata = getXataClient();
    const webhook = new Webhook(CLERK_SECRET_KEY);

    const payload = await request.text();
    const svixId = request.headers.get("svix-id");
    const svixSignature = request.headers.get("svix-signature");
    const svixTimestamp = request.headers.get("svix-timestamp");

    if (!svixId || !svixSignature || !svixTimestamp) {
      console.error("Missing required webhook headers");
      return new Response("Missing required headers", { status: 400 });
    }

    const headers = {
      "svix-id": svixId,
      "svix-signature": svixSignature,
      "svix-timestamp": svixTimestamp
    };

    const event = webhook.verify(payload, headers) as WebhookEvent;
    await processDatabaseUpdate(xata, event);

    return new Response(null, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error("Webhook processing error", { message: errorMessage, stack: errorStack });
    return new Response(errorMessage, { status: 400 });
  }
};
