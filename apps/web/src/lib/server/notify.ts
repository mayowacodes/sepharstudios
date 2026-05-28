import { db } from '$lib/db/drizzle';
import { notifications, notificationPreferences } from '$lib/db/schema/sepharstudios';
import { user } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { sendPushToUser, isPushConfigured } from './push';

/**
 * Single-call notification dispatcher. Always inserts an in-app notification.
 * Optionally also sends an email — but only if the user has opted into that
 * notification kind in their `notificationPreferences`.
 *
 * Usage:
 *   await notify({
 *     userId: '...',
 *     kind: 'creator_application',
 *     title: 'Creator application approved',
 *     message: 'Welcome to the creator program. You can now upload content.',
 *     actionUrl: '/creator',
 *     emailFn: (to, name) => sendCreatorApprovalEmail(to, name)  // optional
 *   });
 *
 * The `emailFn` signature lets callers wire to existing senders in
 * `$lib/server/notifications.ts` without leaking email-template specifics here.
 */

export type NotificationKind =
  | 'subscription'
  | 'creator_application'
  | 'content_publish'
  | 'achievement'
  | 'system';

interface NotifyArgs {
  userId: string;
  kind: NotificationKind;
  title: string;
  message: string;
  actionUrl?: string;
  /** Optional: which preference flag controls the email side-effect.
   *  If omitted, no email is sent regardless of `emailFn`. */
  emailPref?: keyof Pick<typeof notificationPreferences.$inferSelect,
    'newReleases' | 'trialExpiry' | 'paymentConfirmation' | 'weeklyDigest' | 'creatorUpdates'>;
  /** Optional: function to send the email. Receives the user's email address
   *  and display name. Called only if `emailPref` exists and is `true`. */
  emailFn?: (toEmail: string, displayName: string) => Promise<void>;
}

export async function notify(args: NotifyArgs): Promise<void> {
  // 1. Always insert the in-app notification.
  try {
    await db.insert(notifications).values({
      userId: args.userId,
      kind: args.kind,
      title: args.title,
      message: args.message,
      actionUrl: args.actionUrl ?? null
    });
  } catch (err) {
    // Logging only — never throw out of notify, callers shouldn't fail their
    // primary action because the notification couldn't be persisted.
    console.error('[notify] insert failed:', err);
  }

  // 1a. Web Push fan-out — fire-and-forget, no-op when VAPID isn't configured.
  if (isPushConfigured()) {
    void sendPushToUser(args.userId, {
      title: args.title,
      body: args.message,
      url: args.actionUrl,
      tag: args.kind
    }).catch((err) => console.warn('[notify] push fan-out failed:', err));
  }

  // 2. Email side-effect, gated by user preference.
  if (!args.emailPref || !args.emailFn) return;

  // Per-flag defaults must match the schema column defaults in
  // `notificationPreferences`. If a user has no row yet, we fall back to these.
  const prefDefaults: Record<NonNullable<NotifyArgs['emailPref']>, boolean> = {
    newReleases: true,
    trialExpiry: true,
    paymentConfirmation: true,
    weeklyDigest: false,
    creatorUpdates: false
  };

  try {
    const [prefs] = await db
      .select()
      .from(notificationPreferences)
      .where(eq(notificationPreferences.userId, args.userId))
      .limit(1);

    const value = prefs?.[args.emailPref];
    const optedIn = value === null || value === undefined
      ? prefDefaults[args.emailPref]
      : value === true;
    if (!optedIn) return;

    const [account] = await db
      .select({ email: user.email, name: user.name })
      .from(user)
      .where(eq(user.id, args.userId))
      .limit(1);

    if (!account?.email) return;
    await args.emailFn(account.email, account.name ?? 'there');
  } catch (err) {
    console.error('[notify] email side-effect failed:', err);
  }
}
