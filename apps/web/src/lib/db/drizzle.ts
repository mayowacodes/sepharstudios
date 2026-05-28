import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '$env/dynamic/private';
import * as schema from './schema';

// postgres-js defaults to max=10 per process. With 3+ SvelteKit replicas behind
// a load balancer that's ~30 total, which queues fast under modest load.
// Bumping to 25 per replica gives ~75 across 3 replicas — enough headroom for
// our current hot endpoints (watch progress, stc-balance, home feed).
// When we migrate to a managed Postgres with a built-in pooler (Supabase's
// PgBouncer, RDS Proxy), the per-replica max matters less and we can drop back
// to the default.
const client = postgres(env.DATABASE_URL!, {
	max: 25,
	idle_timeout: 30,
	connect_timeout: 10
});
export const db = drizzle(client, { schema });
