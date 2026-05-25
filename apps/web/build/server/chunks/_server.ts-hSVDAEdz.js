import { j as json } from './index-BcOZ6EV9.js';
import { d as db, c as user, q as governanceMemberships } from './drizzle-CW7hPjGG.js';
import { eq } from 'drizzle-orm';
import { g as getGovernanceActor, D as DEFAULT_GOVERNANCE_PERMISSIONS } from './governance-auth-C645BtCl.js';
import './utils-FiC4zhrQ.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import './shared-server-BeisX7n9.js';
import 'drizzle-orm/pg-core';

const GET = async ({ locals }) => {
  const { allowed } = await getGovernanceActor(locals, "governance.roles.manage");
  if (!allowed) return json({ error: "Forbidden" }, { status: 403 });
  const admins = await db.select({ id: user.id, name: user.name, email: user.email, role: user.role }).from(user).where(eq(user.role, "admin"));
  const memberships = await db.select({
    userId: governanceMemberships.userId,
    label: governanceMemberships.label,
    permissions: governanceMemberships.permissions,
    active: governanceMemberships.active
  }).from(governanceMemberships);
  const membershipByUserId = new Map(
    memberships.map((row) => [row.userId, { label: row.label, active: row.active, permissions: row.permissions ?? [] }])
  );
  return json({
    matrix: [
      {
        role: "PAUSER_ROLE",
        description: "May trigger emergency pause only",
        can: ["Trigger pause", "View incidents"],
        cannot: ["Execute monetary changes", "Change ownership"]
      },
      {
        role: "TREASURY_ROLE",
        description: "May propose treasury actions within limits",
        can: ["Draft treasury proposals", "View treasury"],
        cannot: ["Bypass timelock", "Mint tokens"]
      },
      {
        role: "POLICY_ROLE",
        description: "May propose parameter updates within guardrails",
        can: ["Draft policy updates", "Queue approved changes"],
        cannot: ["Disable guardrails", "Execute before timelock"]
      }
    ],
    admins: admins.map((admin) => {
      const assignment = membershipByUserId.get(admin.id);
      return {
        ...admin,
        governanceLabel: assignment?.label ?? "default_admin",
        governanceActive: assignment?.active ?? true,
        governancePermissions: assignment?.permissions ?? DEFAULT_GOVERNANCE_PERMISSIONS
      };
    })
  });
};

export { GET };
//# sourceMappingURL=_server.ts-hSVDAEdz.js.map
