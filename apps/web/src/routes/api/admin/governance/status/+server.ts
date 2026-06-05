import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { paystackSubscriptions, mediaLibrary } from '$lib/db/schema/sepharstudios';
import { count, eq } from 'drizzle-orm';
import { getGovernanceActor } from '$lib/server/governance-auth';
import { getActivePause, listAuditEntries, listQueue, listProposals } from '$lib/server/governance-store';

export const GET: RequestHandler = async ({ locals }) => {
	const { actor, allowed } = await getGovernanceActor(locals, 'governance.view');
	if (!actor || !allowed) return json({ error: 'Forbidden' }, { status: 403 });

	// Defensive defaults — if any of the DB queries or governance-store
	// reads throw (missing tables on a fresh DB, transient Postgres error,
	// etc.) we still return a complete shape with zeros so the admin page
	// doesn't blank. Errors are logged for diagnosis but the response
	// itself remains 200.
	const safe = async <T,>(fn: () => Promise<T>, fallback: T, label: string): Promise<T> => {
		try {
			return await fn();
		} catch (err) {
			console.error(`[admin/governance/status] ${label} failed:`, err);
			return fallback;
		}
	};

	const [activeSubs, activeContent, queue, proposals, emergency, audit] = await Promise.all([
		safe(
			() =>
				db
					.select({ total: count() })
					.from(paystackSubscriptions)
					.where(eq(paystackSubscriptions.status, 'active'))
					.then((r) => r[0]?.total ?? 0),
			0,
			'activeSubs'
		),
		safe(
			() =>
				db
					.select({ total: count() })
					.from(mediaLibrary)
					.where(eq(mediaLibrary.isActive, true))
					.then((r) => r[0]?.total ?? 0),
			0,
			'activeContent'
		),
		safe(() => listQueue(), [] as Awaited<ReturnType<typeof listQueue>>, 'queue'),
		safe(() => listProposals(), [] as Awaited<ReturnType<typeof listProposals>>, 'proposals'),
		safe(() => getActivePause(), null as Awaited<ReturnType<typeof getActivePause>>, 'emergency'),
		safe(() => listAuditEntries(), [] as Awaited<ReturnType<typeof listAuditEntries>>, 'audit')
	]);

	return json({
		policyMode: 'fixed_supply_recycle',
		mintAuthorityEnabled: false,
		timelockDelays: {
			routineHours: 72,
			monetaryChangeHours: 168
		},
		multisig: {
			threshold: 4,
			totalSigners: 7
		},
		admin: actor,
		metrics: {
			activeSubscriptions: activeSubs,
			activeContentItems: activeContent,
			totalProposals: proposals.length,
			queuedActions: queue.length,
			auditEvents: audit.length
		},
		incident: emergency
	});
};
