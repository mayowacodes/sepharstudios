import { d as auth } from './auth-B1iRtYym.js';
import { r as redirect } from './index-Cv5VcsYq.js';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import './drizzle-CKUH7ukq.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import 'drizzle-orm';
import './constants-BEpeHz1K.js';
import './ui-libs-BjzLDLAh.js';
import './file-text-C_v9vOk2.js';
import './Icon-CM89Lxh4.js';
import './house-B7XjrWsP.js';
import './layout-dashboard-PdpePzL-.js';
import './user-DvE0JuLE.js';
import './users-B-WaIXgI.js';
import './server2-D6YOLBns.js';
import './string-DVvRuJqu.js';
import './analytics-C04NmVoh.js';
import '@openpanel/sdk';
import 'zod';
import './hmac-DQSDUlCl.js';
import './utils-BQDJK5Ro.js';
import 'node:crypto';
import './sha2-Cn2-4DsP.js';
import 'node:fs';
import 'node:fs/promises';
import 'node:os';
import 'node:path';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

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
const component = async () => component_cache ??= (await import('./_layout.svelte-DjG8y8tO.js')).default;
const server_id = "src/routes/(protected)/+layout.server.ts";
const imports = ["_app/immutable/nodes/8.CZ3vtw8b.js","_app/immutable/chunks/kNaey6uv.js","_app/immutable/chunks/Biu5sxxD2.js","_app/immutable/chunks/CKRMjvU22.js","_app/immutable/chunks/DdntYR2r.js","_app/immutable/chunks/CocL4akC.js","_app/immutable/chunks/-c01j_DQ.js","_app/immutable/chunks/DbP8MhBG2.js","_app/immutable/chunks/j5L7JOaG.js","_app/immutable/chunks/DZXko5A82.js","_app/immutable/chunks/DQQV4u0O2.js","_app/immutable/chunks/BC4b7XLa.js","_app/immutable/chunks/GKWuiuOh.js","_app/immutable/chunks/lnztPWNe2.js","_app/immutable/chunks/COiortTs2.js","_app/immutable/chunks/Clnoo-nb2.js","_app/immutable/chunks/CdtIMIMZ2.js","_app/immutable/chunks/Cvt29zcG2.js","_app/immutable/chunks/BSdbgJIN2.js","_app/immutable/chunks/CbfRYWmO2.js","_app/immutable/chunks/DvStR9bS.js","_app/immutable/chunks/DcIqsvyW2.js","_app/immutable/chunks/DoL5YEHc.js","_app/immutable/chunks/DTkeaA6Q2.js","_app/immutable/chunks/CiK3Qc-12.js","_app/immutable/chunks/Dqag1JzJ.js","_app/immutable/chunks/CDrcCp8G2.js","_app/immutable/chunks/BN3TxkTI2.js","_app/immutable/chunks/CO5m0ek1.js","_app/immutable/chunks/BrQ41psm.js","_app/immutable/chunks/BYLiR5YE.js","_app/immutable/chunks/AMeTL3ZL.js","_app/immutable/chunks/Dy-TKAjK.js"];
const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css"];
const fonts = [];

export { component, fonts, imports, index, _layout_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=8-Cv_HjTzR.js.map
