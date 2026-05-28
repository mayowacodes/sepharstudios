import { json, type RequestHandler } from '@sveltejs/kit';
import { sendEmailAction } from '$lib/authentication/server';
import { Constants } from '$lib/constants';

interface ContactPayload {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export const POST: RequestHandler = async ({ request }) => {
  const body = (await request.json().catch(() => ({}))) as ContactPayload;
  const name = (body.name ?? '').trim();
  const email = (body.email ?? '').trim();
  const subject = (body.subject ?? '').trim();
  const message = (body.message ?? '').trim();

  if (!name || !email || !subject || !message) {
    return json({ error: 'All fields are required.' }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }
  if (message.length > 5000) {
    return json({ error: 'Message is too long (5000 char max).' }, { status: 400 });
  }

  try {
    await sendEmailAction({
      to: Constants.SUPPORTEMAIL,
      subject: `[Contact form] ${subject} — from ${name}`,
      meta: {
        description: `${message}\n\nFrom: ${name} <${email}>`,
        link: `mailto:${email}`
      }
    });
    return json({ ok: true });
  } catch (err) {
    console.error('Contact form send failed:', err);
    return json({ error: 'Could not send your message right now. Please try again later.' }, { status: 502 });
  }
};
