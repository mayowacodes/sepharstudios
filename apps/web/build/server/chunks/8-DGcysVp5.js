import { d as auth } from './auth-DJFZtSzG.js';
import { r as redirect } from './index-5kYmxIr9.js';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import './drizzle-BjmsPAPl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import 'drizzle-orm';
import './server2-D6YOLBns.js';
import './string-BCawZznR.js';
import './constants-ChVx7CIu.js';
import './ui-libs-TtGtWAGI.js';
import './Icon-CGEdwVFL.js';
import './file-text-CODLMeLI.js';
import './layout-dashboard-B00hq5k6.js';
import './user-BR-ZR5dM.js';
import './users-Bb_ynahW.js';
import './analytics-C04NmVoh.js';
import '@openpanel/sdk';
import './hmac-DQSDUlCl.js';
import './utils-BQDJK5Ro.js';
import 'node:crypto';
import './sha2-Cn2-4DsP.js';
import 'zod';
import 'node:fs';
import 'node:fs/promises';
import 'node:os';
import 'node:path';
import './index-DBqjc0Yf.js';

//#region src/routes/(protected)/+layout.server.ts
var load = (async ({ request, locals, url }) => {
	const session = await auth.api.getSession({ headers: request.headers });
	if (!session) throw redirect(302, `/auth/login?redirectTo=${url.pathname}`);
	return {
		session,
		user: session.user
	};
});

var _layout_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

const index = 8;
let component_cache;
const component = async () => component_cache ??= (await import('./_layout.svelte-DCmCFd02.js')).default;
const server_id = "src/routes/(protected)/+layout.server.ts";
const imports = ["_app/immutable/nodes/8.DXthSQUx.js","_app/immutable/chunks/kNaey6uv.js","_app/immutable/chunks/g6f9qJp6.js","_app/immutable/chunks/BVYEN9jI.js","_app/immutable/chunks/82XWPh1s.js","_app/immutable/chunks/BgHc62fs.js","_app/immutable/chunks/-c01j_DQ.js","_app/immutable/chunks/FqtpMiZa.js","_app/immutable/chunks/QvtZIkiR.js","_app/immutable/chunks/SDVjwcu-.js","_app/immutable/chunks/CkPKcep_2.js","_app/immutable/chunks/BQYPg9Bi2.js","_app/immutable/chunks/CaAB7dOD.js","_app/immutable/chunks/C4QiHKi92.js","_app/immutable/chunks/ClqGSka_2.js","_app/immutable/chunks/DE6Vj2l8.js","_app/immutable/chunks/D8e-wLbb2.js","_app/immutable/chunks/CFVmnJei2.js","_app/immutable/chunks/DDBuJQLx2.js","_app/immutable/chunks/DXFs0FbB2.js","_app/immutable/chunks/DTiwN7q82.js","_app/immutable/chunks/JxzNFG6M.js","_app/immutable/chunks/B-hbAyTs2.js","_app/immutable/chunks/CrtR1HQa.js","_app/immutable/chunks/D3wrU__d2.js","_app/immutable/chunks/A7Vb2tMq.js","_app/immutable/chunks/Cj9sdKvC.js","_app/immutable/chunks/DD3oU49q.js","_app/immutable/chunks/CYoPNDXM.js"];
const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css"];
const fonts = [];

export { component, fonts, imports, index, _layout_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=8-DGcysVp5.js.map
