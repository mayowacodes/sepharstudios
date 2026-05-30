import { json, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { db } from '$lib/db/drizzle';
import {
	creators,
	mediaLibrary,
	mediaWatchProgress,
	transactions,
	paymentIntents
} from '$lib/db/schema/sepharstudios';
import { user } from '$lib/db/schema';
import { and, eq, gte, sql, inArray, isNotNull } from 'drizzle-orm';
import { notify } from '$lib/server/notify';
import { transferStc, isTreasuryReady } from '$lib/server/stc-transfer';

/**
 * POST /api/cron/creator-payouts
 *
 * Monthly creator payout worker. Aggregates each creator's earned share of
 * platform revenue over the past 30 days, then splits the payout according
 * to the creator's saved payment preference (fiat / usdc / stc / mixed).
 *
 * Same auth model as the subscription renewal cron — `CRON_SECRET` bearer.
 *
 *   curl -X POST https://sepharstudios.com/api/cron/creator-payouts \
 *        -H "Authorization: Bearer $CRON_SECRET"
 *
 * Recommended schedule: monthly on the 1st at 00:05 UTC.
 *
 * Revenue model (matches CreatorPayments.sol tier shares):
 *   - Each completed watch (mediaWatchProgress where isCompleted=true) earns
 *     the content's creator a fixed per-completion bounty in USD cents.
 *   - tier share: standard 30%, exclusive 40%, top_performer 55%
 *   - The CRON_BOUNTY_PER_COMPLETION_CENTS env var (default: 25 = $0.25)
 *     sets the per-completion gross figure; tier share is applied on top.
 *
 * STC payouts go through the treasury (lib/server/stc-transfer.ts) — when
 * the treasury isn't configured, the STC slice is recorded as a pending
 * transaction the admin can later mark settled by hand.
 *
 * Fiat payouts are NOT settled by this worker — they're recorded as
 * `pending` transactions for finance ops to process out-of-band (Paystack
 * Transfers, bank transfer, etc.).
 *
 * USDC payouts are similarly recorded as pending — settled by treasury via
 * `chargeAuthorization` or direct USDC transfer in a follow-up round.
 */

const BOUNTY_CENTS = Number(env.CRON_BOUNTY_PER_COMPLETION_CENTS ?? 25);
const BATCH_SIZE = 100;

function shareForTier(creatorType: string | null): number {
	if (creatorType === 'top_performer') return 0.55;
	if (creatorType === 'exclusive') return 0.40;
	return 0.30;
}

export const POST: RequestHandler = async ({ request }) => {
	const auth = request.headers.get('authorization');
	const expected = env.CRON_SECRET;
	if (!expected) return json({ error: 'CRON_SECRET not configured' }, { status: 500 });
	if (auth !== `Bearer ${expected}`) return json({ error: 'Unauthorized' }, { status: 401 });

	const now = new Date();
	const periodStart = new Date(now.getTime() - 30 * 86_400_000);

	// Pull every active creator. For each, we'll count their completed-watches
	// over the past 30 days and compute their payout share.
	const allCreators = await db
		.select({
			id: creators.id,
			userId: creators.userId,
			displayName: creators.displayName,
			creatorType: creators.creatorType,
			preferences: creators.preferences,
			email: user.email
		})
		.from(creators)
		.innerJoin(user, eq(user.id, creators.userId))
		.limit(BATCH_SIZE);

	const results = {
		processed: 0,
		paidCreators: 0,
		skippedZeroEarnings: 0,
		stcSettled: 0,
		stcQueued: 0,
		fiatQueued: 0,
		usdcQueued: 0,
		errors: [] as string[]
	};

	const treasuryReady = isTreasuryReady();

	for (const creator of allCreators) {
		results.processed += 1;

		// Count completed watches for this creator's content in the period.
		const contentIds = await db
			.select({ id: mediaLibrary.id })
			.from(mediaLibrary)
			.where(eq(mediaLibrary.creatorId, creator.userId));

		if (contentIds.length === 0) {
			results.skippedZeroEarnings += 1;
			continue;
		}

		const ids = contentIds.map((c) => c.id);
		const [completionsRow] = await db
			.select({ count: sql<number>`count(*)::int` })
			.from(mediaWatchProgress)
			.where(and(
				inArray(mediaWatchProgress.contentId, ids),
				eq(mediaWatchProgress.isCompleted, true),
				gte(mediaWatchProgress.updatedAt, periodStart)
			));

		const completions = Number(completionsRow?.count ?? 0);
		const grossCents = completions * BOUNTY_CENTS;
		const shareCents = Math.round(grossCents * shareForTier(creator.creatorType));

		if (shareCents <= 0) {
			results.skippedZeroEarnings += 1;
			continue;
		}

		// Resolve payout split. `creators.preferences.payment` is set by the
		// /api/creator/payment-preferences PUT endpoint. Default is 100% USDC
		// when the creator has never set a preference — keeps it server-side
		// and reversible, avoids needing a fiat banking workflow until they opt in.
		const prefs = (creator.preferences ?? {}) as Record<string, unknown>;
		const payment = (prefs.payment as { fiatPct?: number; usdcPct?: number; stcPct?: number } | undefined) ?? null;
		const fiatPct = Number(payment?.fiatPct ?? 0);
		const usdcPct = Number(payment?.usdcPct ?? 100);
		const stcPct = Number(payment?.stcPct ?? 0);

		const fiatCents = Math.round(shareCents * (fiatPct / 100));
		const usdcCents = Math.round(shareCents * (usdcPct / 100));
		// Whatever didn't round to fiat/usdc goes to STC so the cents balance.
		const stcCents = shareCents - fiatCents - usdcCents;

		try {
			// Insert one transaction per currency slice, all type='creator_payout'.
			// Fiat + USDC start as 'pending' — finance ops settle them later.
			// STC is settled now if treasury is ready, otherwise also pending.
			await db.transaction(async (tx) => {
				if (fiatCents > 0) {
					const ref = `payout_fiat_${creator.id}_${now.getTime()}`;
					await tx.insert(paymentIntents).values({
						reference: ref,
						userId: creator.userId,
						kind: 'creator_payout',
						amountCents: fiatCents,
						currency: 'USD'
					});
					await tx.insert(transactions).values({
						id: crypto.randomUUID(),
						userId: creator.userId,
						type: 'creator_payout',
						amount: fiatCents,
						currency: 'USD',
						status: 'pending',
						metadata: {
							payoutKind: 'fiat',
							completions,
							periodStart: periodStart.toISOString(),
							periodEnd: now.toISOString(),
							reference: ref
						},
						createdAt: now
					});
					results.fiatQueued += 1;
				}

				if (usdcCents > 0) {
					const ref = `payout_usdc_${creator.id}_${now.getTime()}`;
					await tx.insert(paymentIntents).values({
						reference: ref,
						userId: creator.userId,
						kind: 'creator_payout',
						amountCents: usdcCents,
						currency: 'USDC'
					});
					await tx.insert(transactions).values({
						id: crypto.randomUUID(),
						userId: creator.userId,
						type: 'creator_payout',
						amount: usdcCents,
						currency: 'USDC',
						status: 'pending',
						metadata: {
							payoutKind: 'usdc',
							completions,
							periodStart: periodStart.toISOString(),
							periodEnd: now.toISOString(),
							reference: ref
						},
						createdAt: now
					});
					results.usdcQueued += 1;
				}

				if (stcCents > 0) {
					await tx.insert(transactions).values({
						id: crypto.randomUUID(),
						userId: creator.userId,
						type: 'creator_payout',
						amount: stcCents,
						currency: 'STC',
						status: 'pending',
						metadata: {
							payoutKind: 'stc',
							completions,
							periodStart: periodStart.toISOString(),
							periodEnd: now.toISOString()
						},
						createdAt: now
					});
				}
			});

			// STC settlement (outside the transaction — viem is HTTP, not DB).
			// Only attempt if treasury is configured AND the creator has linked a
			// wallet to receive STC. If not, the row stays 'pending' for the
			// existing stc-claim flow to pick up.
			if (stcCents > 0 && treasuryReady) {
				try {
					// Creator wallet address lives on the user row's metadata or
					// directly via creators.walletAddress.
					const [creatorRow] = await db.select({ wallet: creators.walletAddress })
						.from(creators)
						.where(eq(creators.id, creator.id))
						.limit(1);
					if (creatorRow?.wallet) {
						// Convert cents → STC tokens. Assumes 1 STC == $0.01 floor (the
						// launch-phase STC subscription pricing model). When STC price
						// moves, this conversion needs to factor live price.
						const stcAmount = stcCents / 100;
						const txHash = await transferStc(creatorRow.wallet as `0x${string}`, stcAmount);
						// Mark the STC payout as completed with the txHash recorded.
						await db.update(transactions)
							.set({ status: 'completed', txHash: txHash.txHash })
							.where(and(
								eq(transactions.userId, creator.userId),
								eq(transactions.type, 'creator_payout'),
								eq(transactions.currency, 'STC'),
								eq(transactions.status, 'pending'),
								sql`${transactions.createdAt} >= ${now}`
							));
						results.stcSettled += 1;
					} else {
						results.stcQueued += 1;
					}
				} catch (err) {
					console.warn(`[cron/creator-payouts] STC settlement failed for ${creator.id}:`, err);
					results.stcQueued += 1;
				}
			} else if (stcCents > 0) {
				results.stcQueued += 1;
			}

			// Update lifetime earnings counter on the creator row (denormalized
			// for fast dashboard reads — the live `transactions` table remains
			// the source of truth).
			await db.update(creators)
				.set({
					totalEarnings: sql`coalesce(${creators.totalEarnings}, 0) + ${shareCents}`,
					updatedAt: now
				})
				.where(eq(creators.id, creator.id));

			// Notify the creator that their monthly payout was processed.
			await notify({
				userId: creator.userId,
				kind: 'subscription',
				title: 'Monthly payout processed',
				message: `Your ${new Intl.DateTimeFormat('en-US', { month: 'long' }).format(now)} payout of $${(shareCents / 100).toFixed(2)} has been processed (${fiatPct}% fiat, ${usdcPct}% USDC, ${stcPct}% STC). Visit your earnings page for details.`,
				actionUrl: '/creator/earnings'
			});

			results.paidCreators += 1;
		} catch (err) {
			console.error(`[cron/creator-payouts] failed for ${creator.id}:`, err);
			results.errors.push(`creator ${creator.id}: ${(err as Error).message}`);
		}
	}

	return json({
		ok: true,
		runAt: now.toISOString(),
		periodStart: periodStart.toISOString(),
		bountyCents: BOUNTY_CENTS,
		treasuryReady,
		...results
	});
};
