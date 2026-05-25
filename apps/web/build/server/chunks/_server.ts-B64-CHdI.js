import { j as json } from './index-BcOZ6EV9.js';
import { g as getGovernanceActor, b as listPauseEvents, c as getActivePause, t as triggerPause } from './governance-auth-C645BtCl.js';
import './utils-FiC4zhrQ.js';
import './drizzle-CW7hPjGG.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import './shared-server-BeisX7n9.js';
import 'drizzle-orm/pg-core';
import 'drizzle-orm';

const GET = async ({ locals }) => {
  const { allowed } = await getGovernanceActor(locals, "governance.view");
  if (!allowed) return json({ error: "Forbidden" }, { status: 403 });
  return json({
    active: await getActivePause(),
    history: await listPauseEvents()
  });
};
const POST = async ({ locals, request }) => {
  const { actor, allowed } = await getGovernanceActor(locals, "governance.pause.trigger");
  if (!actor || !allowed) return json({ error: "Forbidden" }, { status: 403 });
  const { reason } = await request.json();
  if (!reason || reason.trim().length < 12) {
    return json({ error: "Provide a detailed incident reason (min 12 chars)" }, { status: 400 });
  }
  const event = await triggerPause(reason.trim(), { id: actor.id, name: actor.name });
  return json(event, { status: 201 });
};

export { GET, POST };
//# sourceMappingURL=_server.ts-B64-CHdI.js.map
