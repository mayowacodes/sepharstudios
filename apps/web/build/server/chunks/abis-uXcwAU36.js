const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["asl-logo.png","favicon-96x96.png","favicon.ico","favicon.svg","logo&name-sepharstudios.png","logo-alone-sepharstudios-bgless.png","logo-alone-sepharstudios.png","logo_name-sepharstudios.png","manifest.json","name-alone-sepharstudios.png","pwa-192x192.png","pwa-512x512.png","pwa-maskable-192x192.png","pwa-maskable-512x512.png","robots.txt","screenshot-mobile.webp","screenshot-wide.webp","sw.js"]),
	mimeTypes: {".png":"image/png",".svg":"image/svg+xml",".json":"application/json",".txt":"text/plain",".webp":"image/webp",".js":"text/javascript"},
	_: {
		client: {start:"_app/immutable/entry/start.B1BhGO80.js",app:"_app/immutable/entry/app.DBjCe-X0.js",imports:["_app/immutable/entry/start.B1BhGO80.js","_app/immutable/chunks/BrQ41psm.js","_app/immutable/chunks/CocL4akC.js","_app/immutable/chunks/-c01j_DQ.js","_app/immutable/chunks/BYLiR5YE.js","_app/immutable/entry/app.DBjCe-X0.js","_app/immutable/chunks/kNaey6uv.js","_app/immutable/chunks/CocL4akC.js","_app/immutable/chunks/-c01j_DQ.js"],stylesheets:["_app/immutable/assets/ui-libs.C1tyNZCz.css","_app/immutable/assets/ui-libs.C1tyNZCz.css"],fonts:[],uses_env_dynamic_public:true},
		nodes: [
			__memo(() => import('./0-Cyv8zUMv.js')),
			__memo(() => import('./1-C194lg1v.js')),
			__memo(() => import('./3-CCowoDaG.js')),
			__memo(() => import('./4-TBmjuG52.js')),
			__memo(() => import('./5-CfOuv_4F.js')),
			__memo(() => import('./7-19bH9qs-.js')),
			__memo(() => import('./8-Cv_HjTzR.js')),
			__memo(() => import('./9-BWIk_ROu.js')),
			__memo(() => import('./10-d_jCA0km.js')),
			__memo(() => import('./11-B2e7k4sj.js')),
			__memo(() => import('./12-DSZ-WoON.js')),
			__memo(() => import('./13-BsIa65bF.js')),
			__memo(() => import('./14-Q3wlIcna.js')),
			__memo(() => import('./15-DVM96-yW.js')),
			__memo(() => import('./16-ua_i8gHe.js')),
			__memo(() => import('./17-DKOaNIyU.js')),
			__memo(() => import('./18-DihbD8Os.js')),
			__memo(() => import('./19-MlANy6Zv.js')),
			__memo(() => import('./20-2dlEust_.js')),
			__memo(() => import('./21-B2m8gmpI.js')),
			__memo(() => import('./22-C59s_L9-.js')),
			__memo(() => import('./23-CiQX8Otb.js')),
			__memo(() => import('./24-BKPv4j9f.js')),
			__memo(() => import('./25-NU4dCKGd.js')),
			__memo(() => import('./26-CXDDYaGJ.js')),
			__memo(() => import('./27-HATBmS9e.js')),
			__memo(() => import('./28-DmtLVksn.js')),
			__memo(() => import('./29-Bt-yZPC4.js')),
			__memo(() => import('./30-C8Dlmec6.js')),
			__memo(() => import('./31-FT-fY2ui.js')),
			__memo(() => import('./32-BakwtTz4.js')),
			__memo(() => import('./33-3OZe6e-Z.js')),
			__memo(() => import('./34-BDVyri7d.js')),
			__memo(() => import('./35-B5891TES.js')),
			__memo(() => import('./36-Re42bzf2.js')),
			__memo(() => import('./37-LQpTiF0E.js')),
			__memo(() => import('./38-Clo8gsrx.js')),
			__memo(() => import('./39-BqVyBaIr.js')),
			__memo(() => import('./40-CUQXk-1-.js')),
			__memo(() => import('./41-DfhgYZjU.js')),
			__memo(() => import('./42-B915mGDZ.js')),
			__memo(() => import('./43-UYtDx8ER.js')),
			__memo(() => import('./44-B4G19YWH.js')),
			__memo(() => import('./45-nBLPhoVC.js')),
			__memo(() => import('./46-BvBAZ87-.js')),
			__memo(() => import('./47-YlD_BbT8.js')),
			__memo(() => import('./48-pSP_-O82.js')),
			__memo(() => import('./49-CxfaNj9o.js')),
			__memo(() => import('./50-C98tAksp.js')),
			__memo(() => import('./51-Dovbd3nO.js')),
			__memo(() => import('./52-qf6drSw3.js')),
			__memo(() => import('./53-ZLT2zYUZ.js')),
			__memo(() => import('./54-DCHmEzbS.js')),
			__memo(() => import('./55-BQcsIJPd.js')),
			__memo(() => import('./56-CbZoSMui.js')),
			__memo(() => import('./57-CNrXBp7Q.js')),
			__memo(() => import('./58-BatHmqEN.js')),
			__memo(() => import('./59-BRqRj9GI.js')),
			__memo(() => import('./60-CUeoof6v.js')),
			__memo(() => import('./61-Hd6mbPSG.js')),
			__memo(() => import('./62-HO_ib9Da.js')),
			__memo(() => import('./63-BCbt27D5.js')),
			__memo(() => import('./64-BQ-0oyBt.js')),
			__memo(() => import('./65-D7eaUS8z.js')),
			__memo(() => import('./66-fBwYrIW8.js')),
			__memo(() => import('./67-DN4cPhdC.js')),
			__memo(() => import('./68-B0Q0FXzr.js')),
			__memo(() => import('./69-CqN-zDgg.js')),
			__memo(() => import('./70-B6bEs7cr.js')),
			__memo(() => import('./71-BARuFCq9.js')),
			__memo(() => import('./72-DdUd_Rzw.js')),
			__memo(() => import('./73-DrI6HPJ9.js')),
			__memo(() => import('./74-B3SegsCr.js')),
			__memo(() => import('./75-BHS08eY1.js')),
			__memo(() => import('./76-B3oGoWyK.js')),
			__memo(() => import('./77-C-qyDjh8.js')),
			__memo(() => import('./78-BvZh-3cq.js')),
			__memo(() => import('./79-k5h8nElX.js')),
			__memo(() => import('./80-DTb4kPIR.js')),
			__memo(() => import('./81-C8y1YaWr.js')),
			__memo(() => import('./82-DcYIx1KP.js')),
			__memo(() => import('./83-Dh5e-cly.js')),
			__memo(() => import('./84-D4JQRELB.js')),
			__memo(() => import('./85-B9DWS6c0.js')),
			__memo(() => import('./86-CTUt6WNd.js')),
			__memo(() => import('./87-DDsunUAA.js')),
			__memo(() => import('./88-BN2Sn_Tt.js')),
			__memo(() => import('./89-TWoNltjB.js')),
			__memo(() => import('./90-6GLLpTgq.js')),
			__memo(() => import('./91-HUo0kd4O.js')),
			__memo(() => import('./92-BXqwXQo9.js')),
			__memo(() => import('./93-BQzy_sT5.js')),
			__memo(() => import('./94-D1dKBRti.js')),
			__memo(() => import('./95-FyOOu7N_.js')),
			__memo(() => import('./96-Dqeg6Qz5.js')),
			__memo(() => import('./97-gaUj63fV.js')),
			__memo(() => import('./98-WuKysW0o.js')),
			__memo(() => import('./99-BetC1SbA.js')),
			__memo(() => import('./100-CBM0iHbF.js')),
			__memo(() => import('./101-5ohxHgVS.js')),
			__memo(() => import('./102-YkLAm_TE.js')),
			__memo(() => import('./103-CoiMYLvE.js')),
			__memo(() => import('./104-DMHEK_jU.js')),
			__memo(() => import('./105-CYlZD2Wu.js')),
			__memo(() => import('./106-D7B-GFaC.js')),
			__memo(() => import('./107-CaLMe7Ea.js')),
			__memo(() => import('./108-i11t6k1h.js')),
			__memo(() => import('./109-yOWKRLmV.js')),
			__memo(() => import('./110-B8kfSWgd.js')),
			__memo(() => import('./111-1kPLM5tY.js')),
			__memo(() => import('./112-S_MBWcl3.js')),
			__memo(() => import('./113-DIlS-NEU.js')),
			__memo(() => import('./114-pyZULNSP.js')),
			__memo(() => import('./115-wMnjlyqQ.js')),
			__memo(() => import('./116-OoaYHCZu.js')),
			__memo(() => import('./117-tYPBlxLA.js')),
			__memo(() => import('./118-CfcEFU4u.js')),
			__memo(() => import('./119-CK5e-ppn.js')),
			__memo(() => import('./120-JhkdwRa-.js')),
			__memo(() => import('./121-B7N5rTPT.js')),
			__memo(() => import('./122-B6HuvOo4.js')),
			__memo(() => import('./123-iGEaids4.js')),
			__memo(() => import('./124-BJ7uYMh4.js')),
			__memo(() => import('./125-DtdrEa3M.js')),
			__memo(() => import('./126-CDcEt-WK.js')),
			__memo(() => import('./127-hwU-yTk-.js').then(function (n) { return n._; }))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/(app)",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 42 },
				endpoint: null
			},
			{
				id: "/(app)/about",
				pattern: /^\/about\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 43 },
				endpoint: null
			},
			{
				id: "/(app)/access-denied",
				pattern: /^\/access-denied\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 44 },
				endpoint: null
			},
			{
				id: "/(protected)/achievements",
				pattern: /^\/achievements\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 104 },
				endpoint: null
			},
			{
				id: "/(admin)/admin",
				pattern: /^\/admin\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 10 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/abuse",
				pattern: /^\/admin\/abuse\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/ai-runs",
				pattern: /^\/admin\/ai-runs\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 12 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/analytics",
				pattern: /^\/admin\/analytics\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 13 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/communications",
				pattern: /^\/admin\/communications\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 14 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/content",
				pattern: /^\/admin\/content\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 15 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/creator-applications",
				pattern: /^\/admin\/creator-applications\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 16 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/creators",
				pattern: /^\/admin\/creators\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 17 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/dashboard",
				pattern: /^\/admin\/dashboard\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 18 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/disputes",
				pattern: /^\/admin\/disputes\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 19 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/events",
				pattern: /^\/admin\/events\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 20 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/governance",
				pattern: /^\/admin\/governance\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 21 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/governance/create",
				pattern: /^\/admin\/governance\/create\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 22 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/governance/emergency",
				pattern: /^\/admin\/governance\/emergency\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 23 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/governance/execution",
				pattern: /^\/admin\/governance\/execution\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 24 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/governance/proposals",
				pattern: /^\/admin\/governance\/proposals\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 25 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/governance/reports",
				pattern: /^\/admin\/governance\/reports\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 26 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/governance/roles",
				pattern: /^\/admin\/governance\/roles\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 27 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/governance/treasury",
				pattern: /^\/admin\/governance\/treasury\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 28 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/payouts",
				pattern: /^\/admin\/payouts\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 29 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/policies",
				pattern: /^\/admin\/policies\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 30 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/refunds",
				pattern: /^\/admin\/refunds\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 31 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/review",
				pattern: /^\/admin\/review\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 32 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/review/[id]",
				pattern: /^\/admin\/review\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 33 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/settings",
				pattern: /^\/admin\/settings\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 34 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/submissions",
				pattern: /^\/admin\/submissions\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 35 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/system-health",
				pattern: /^\/admin\/system-health\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 36 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/tax-forms",
				pattern: /^\/admin\/tax-forms\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 37 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/tokenomics",
				pattern: /^\/admin\/tokenomics\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 38 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/users",
				pattern: /^\/admin\/users\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 39 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/users/[id]",
				pattern: /^\/admin\/users\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 40 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/workflow",
				pattern: /^\/admin\/workflow\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 41 },
				endpoint: null
			},
			{
				id: "/api/achievements",
				pattern: /^\/api\/achievements\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DVcblGer.js'))
			},
			{
				id: "/api/admin/abuse",
				pattern: /^\/api\/admin\/abuse\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-D6zVimNX.js'))
			},
			{
				id: "/api/admin/abuse/[id]",
				pattern: /^\/api\/admin\/abuse\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CyqupL7f.js'))
			},
			{
				id: "/api/admin/admins",
				pattern: /^\/api\/admin\/admins\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BspMHmd6.js'))
			},
			{
				id: "/api/admin/agent-runs",
				pattern: /^\/api\/admin\/agent-runs\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-fIj5TcTv.js'))
			},
			{
				id: "/api/admin/agents/[name]/fire",
				pattern: /^\/api\/admin\/agents\/([^/]+?)\/fire\/?$/,
				params: [{"name":"name","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts--kyYpWZq.js'))
			},
			{
				id: "/api/admin/ai/config",
				pattern: /^\/api\/admin\/ai\/config\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BLapuGpm.js'))
			},
			{
				id: "/api/admin/ai/models",
				pattern: /^\/api\/admin\/ai\/models\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DmVV8zGz.js'))
			},
			{
				id: "/api/admin/ai/test",
				pattern: /^\/api\/admin\/ai\/test\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CQNXFGCC.js'))
			},
			{
				id: "/api/admin/analytics",
				pattern: /^\/api\/admin\/analytics\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-C9GLBasX.js'))
			},
			{
				id: "/api/admin/communications",
				pattern: /^\/api\/admin\/communications\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BoCunVxO.js'))
			},
			{
				id: "/api/admin/communications/templates",
				pattern: /^\/api\/admin\/communications\/templates\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DejBlmAw.js'))
			},
			{
				id: "/api/admin/content",
				pattern: /^\/api\/admin\/content\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-D5y2Rbny.js'))
			},
			{
				id: "/api/admin/content/bulk",
				pattern: /^\/api\/admin\/content\/bulk\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Cwr7F7iG.js'))
			},
			{
				id: "/api/admin/content/[id]",
				pattern: /^\/api\/admin\/content\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BBTC7vKO.js'))
			},
			{
				id: "/api/admin/content/[id]/assign",
				pattern: /^\/api\/admin\/content\/([^/]+?)\/assign\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BOu-UaYm.js'))
			},
			{
				id: "/api/admin/content/[id]/cancel-encode",
				pattern: /^\/api\/admin\/content\/([^/]+?)\/cancel-encode\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-YklFTc_C.js'))
			},
			{
				id: "/api/admin/content/[id]/ppv",
				pattern: /^\/api\/admin\/content\/([^/]+?)\/ppv\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CLSmMzBI.js'))
			},
			{
				id: "/api/admin/content/[id]/pricing",
				pattern: /^\/api\/admin\/content\/([^/]+?)\/pricing\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CIQcbabB.js'))
			},
			{
				id: "/api/admin/content/[id]/publish",
				pattern: /^\/api\/admin\/content\/([^/]+?)\/publish\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Dp6Equb3.js'))
			},
			{
				id: "/api/admin/content/[id]/rescan",
				pattern: /^\/api\/admin\/content\/([^/]+?)\/rescan\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-B4bH-NZ8.js'))
			},
			{
				id: "/api/admin/content/[id]/review",
				pattern: /^\/api\/admin\/content\/([^/]+?)\/review\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-0HmTJyT4.js'))
			},
			{
				id: "/api/admin/content/[id]/thread",
				pattern: /^\/api\/admin\/content\/([^/]+?)\/thread\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DUx8B0yn.js'))
			},
			{
				id: "/api/admin/content/[id]/thread/stream",
				pattern: /^\/api\/admin\/content\/([^/]+?)\/thread\/stream\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CFbwOVCw.js'))
			},
			{
				id: "/api/admin/creator-applications",
				pattern: /^\/api\/admin\/creator-applications\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Ip12oZu2.js'))
			},
			{
				id: "/api/admin/creator-applications/[id]/review",
				pattern: /^\/api\/admin\/creator-applications\/([^/]+?)\/review\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-mZYAfEqK.js'))
			},
			{
				id: "/api/admin/creators",
				pattern: /^\/api\/admin\/creators\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-cfOIKdWU.js'))
			},
			{
				id: "/api/admin/creators/invite",
				pattern: /^\/api\/admin\/creators\/invite\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DACqVpCs.js'))
			},
			{
				id: "/api/admin/disputes",
				pattern: /^\/api\/admin\/disputes\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CAxcTg5E.js'))
			},
			{
				id: "/api/admin/encoder-stream",
				pattern: /^\/api\/admin\/encoder-stream\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-t8YpIgvX.js'))
			},
			{
				id: "/api/admin/encoder/jobs",
				pattern: /^\/api\/admin\/encoder\/jobs\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-jcO11d0N.js'))
			},
			{
				id: "/api/admin/encoder/jobs/[mediaId]/cancel",
				pattern: /^\/api\/admin\/encoder\/jobs\/([^/]+?)\/cancel\/?$/,
				params: [{"name":"mediaId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-8V9D70pW.js'))
			},
			{
				id: "/api/admin/encoder/jobs/[mediaId]/retry",
				pattern: /^\/api\/admin\/encoder\/jobs\/([^/]+?)\/retry\/?$/,
				params: [{"name":"mediaId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BahY_TXj.js'))
			},
			{
				id: "/api/admin/events",
				pattern: /^\/api\/admin\/events\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Djzr4DvJ.js'))
			},
			{
				id: "/api/admin/events/[id]",
				pattern: /^\/api\/admin\/events\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DNXXT6dJ.js'))
			},
			{
				id: "/api/admin/forum/threads/[id]",
				pattern: /^\/api\/admin\/forum\/threads\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CZpBt5-a.js'))
			},
			{
				id: "/api/admin/governance/approve",
				pattern: /^\/api\/admin\/governance\/approve\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-ElkNiISK.js'))
			},
			{
				id: "/api/admin/governance/audit",
				pattern: /^\/api\/admin\/governance\/audit\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-D_dEA7oC.js'))
			},
			{
				id: "/api/admin/governance/emergency/pause",
				pattern: /^\/api\/admin\/governance\/emergency\/pause\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-WmTFLoYp.js'))
			},
			{
				id: "/api/admin/governance/execute",
				pattern: /^\/api\/admin\/governance\/execute\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DAjF4oLz.js'))
			},
			{
				id: "/api/admin/governance/proposals",
				pattern: /^\/api\/admin\/governance\/proposals\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-xGTV19tV.js'))
			},
			{
				id: "/api/admin/governance/queue",
				pattern: /^\/api\/admin\/governance\/queue\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Bfm_gbfG.js'))
			},
			{
				id: "/api/admin/governance/reports",
				pattern: /^\/api\/admin\/governance\/reports\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Cxxgy1cQ.js'))
			},
			{
				id: "/api/admin/governance/roles",
				pattern: /^\/api\/admin\/governance\/roles\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DB_TvH9N.js'))
			},
			{
				id: "/api/admin/governance/status",
				pattern: /^\/api\/admin\/governance\/status\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Dt0nyoeZ.js'))
			},
			{
				id: "/api/admin/governance/timelock-queue",
				pattern: /^\/api\/admin\/governance\/timelock-queue\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CeNspbxv.js'))
			},
			{
				id: "/api/admin/governance/treasury",
				pattern: /^\/api\/admin\/governance\/treasury\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DKnWy4XZ.js'))
			},
			{
				id: "/api/admin/payouts",
				pattern: /^\/api\/admin\/payouts\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Bn8PRow1.js'))
			},
			{
				id: "/api/admin/payouts/[id]/approve",
				pattern: /^\/api\/admin\/payouts\/([^/]+?)\/approve\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BY5W-6ks.js'))
			},
			{
				id: "/api/admin/payouts/[id]/hold",
				pattern: /^\/api\/admin\/payouts\/([^/]+?)\/hold\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-D5ZPslOp.js'))
			},
			{
				id: "/api/admin/payouts/[id]/retry",
				pattern: /^\/api\/admin\/payouts\/([^/]+?)\/retry\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-D5jXEIGw.js'))
			},
			{
				id: "/api/admin/policies",
				pattern: /^\/api\/admin\/policies\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BV7cNUJM.js'))
			},
			{
				id: "/api/admin/refunds",
				pattern: /^\/api\/admin\/refunds\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Cg_N8mv6.js'))
			},
			{
				id: "/api/admin/refunds/lookup",
				pattern: /^\/api\/admin\/refunds\/lookup\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BnjnGF97.js'))
			},
			{
				id: "/api/admin/reviews",
				pattern: /^\/api\/admin\/reviews\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DQ_Ot8j0.js'))
			},
			{
				id: "/api/admin/settings",
				pattern: /^\/api\/admin\/settings\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DncQ9uEd.js'))
			},
			{
				id: "/api/admin/settings/test-email",
				pattern: /^\/api\/admin\/settings\/test-email\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Dnf2GvMm.js'))
			},
			{
				id: "/api/admin/sponsorships",
				pattern: /^\/api\/admin\/sponsorships\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-IT4CJ7fn.js'))
			},
			{
				id: "/api/admin/sponsorships/[id]/review",
				pattern: /^\/api\/admin\/sponsorships\/([^/]+?)\/review\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-2AKQ5FnV.js'))
			},
			{
				id: "/api/admin/stats",
				pattern: /^\/api\/admin\/stats\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CPi2k4Qw.js'))
			},
			{
				id: "/api/admin/success-stories",
				pattern: /^\/api\/admin\/success-stories\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CHf5CVgJ.js'))
			},
			{
				id: "/api/admin/success-stories/[id]/review",
				pattern: /^\/api\/admin\/success-stories\/([^/]+?)\/review\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-65rlArmM.js'))
			},
			{
				id: "/api/admin/support-tickets",
				pattern: /^\/api\/admin\/support-tickets\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DPtrPCP6.js'))
			},
			{
				id: "/api/admin/support-tickets/[id]/review",
				pattern: /^\/api\/admin\/support-tickets\/([^/]+?)\/review\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DTqANWSr.js'))
			},
			{
				id: "/api/admin/tax-forms",
				pattern: /^\/api\/admin\/tax-forms\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-D_yqHpXG.js'))
			},
			{
				id: "/api/admin/tax-forms/[id]/verify",
				pattern: /^\/api\/admin\/tax-forms\/([^/]+?)\/verify\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-eQje2mO4.js'))
			},
			{
				id: "/api/admin/tokenomics",
				pattern: /^\/api\/admin\/tokenomics\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts--C_Mu4DS.js'))
			},
			{
				id: "/api/admin/tokenomics/distribution",
				pattern: /^\/api\/admin\/tokenomics\/distribution\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DZ4q6-PL.js'))
			},
			{
				id: "/api/admin/users",
				pattern: /^\/api\/admin\/users\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CePjjJUY.js'))
			},
			{
				id: "/api/admin/users/stats",
				pattern: /^\/api\/admin\/users\/stats\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CxsOiG_F.js'))
			},
			{
				id: "/api/admin/users/[id]",
				pattern: /^\/api\/admin\/users\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BWUFNJG3.js'))
			},
			{
				id: "/api/admin/users/[id]/ban",
				pattern: /^\/api\/admin\/users\/([^/]+?)\/ban\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CeD2bNaN.js'))
			},
			{
				id: "/api/admin/users/[id]/warn",
				pattern: /^\/api\/admin\/users\/([^/]+?)\/warn\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CBfEv5zM.js'))
			},
			{
				id: "/api/admin/workflow",
				pattern: /^\/api\/admin\/workflow\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-D9gG1FNT.js'))
			},
			{
				id: "/api/admin/workflow/stats",
				pattern: /^\/api\/admin\/workflow\/stats\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-B0o7SOck.js'))
			},
			{
				id: "/api/ads/vast-tag",
				pattern: /^\/api\/ads\/vast-tag\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DrEK88Dd.js'))
			},
			{
				id: "/api/ai/admin/classify-abuse",
				pattern: /^\/api\/ai\/admin\/classify-abuse\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BWhi95KG.js'))
			},
			{
				id: "/api/ai/admin/draft-message",
				pattern: /^\/api\/ai\/admin\/draft-message\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-C-2ZDDAK.js'))
			},
			{
				id: "/api/ai/admin/summarize-application",
				pattern: /^\/api\/ai\/admin\/summarize-application\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-A9GPQ3Zc.js'))
			},
			{
				id: "/api/ai/companion",
				pattern: /^\/api\/ai\/companion\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Wwym2CU5.js'))
			},
			{
				id: "/api/ai/copilot",
				pattern: /^\/api\/ai\/copilot\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CCVr0Hog.js'))
			},
			{
				id: "/api/ai/creator-insights",
				pattern: /^\/api\/ai\/creator-insights\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DO6v7TAP.js'))
			},
			{
				id: "/api/ai/moderate",
				pattern: /^\/api\/ai\/moderate\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-C0pc1jLC.js'))
			},
			{
				id: "/api/ai/nft",
				pattern: /^\/api\/ai\/nft\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-ClWDmt69.js'))
			},
			{
				id: "/api/ai/search",
				pattern: /^\/api\/ai\/search\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-FFkH28tT.js'))
			},
			{
				id: "/api/ai/suggest/chapters",
				pattern: /^\/api\/ai\/suggest\/chapters\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DWwJXVPm.js'))
			},
			{
				id: "/api/ai/suggest/description",
				pattern: /^\/api\/ai\/suggest\/description\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Uv5nKfyu.js'))
			},
			{
				id: "/api/ai/suggest/review-reply",
				pattern: /^\/api\/ai\/suggest\/review-reply\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DOr4ve3R.js'))
			},
			{
				id: "/api/ai/suggest/title",
				pattern: /^\/api\/ai\/suggest\/title\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Cx4S8rms.js'))
			},
			{
				id: "/api/ai/tag",
				pattern: /^\/api\/ai\/tag\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CDUJmmHS.js'))
			},
			{
				id: "/api/ai/token-score",
				pattern: /^\/api\/ai\/token-score\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BVt8kIOe.js'))
			},
			{
				id: "/api/auth/[...all]",
				pattern: /^\/api\/auth(?:\/([^]*))?\/?$/,
				params: [{"name":"all","optional":false,"rest":true,"chained":true}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Dld3COke.js'))
			},
			{
				id: "/api/contact",
				pattern: /^\/api\/contact\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BI1O7PPq.js'))
			},
			{
				id: "/api/content/kids",
				pattern: /^\/api\/content\/kids\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-D1Rxp1dW.js'))
			},
			{
				id: "/api/content/[id]/price",
				pattern: /^\/api\/content\/([^/]+?)\/price\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CRzXhnGY.js'))
			},
			{
				id: "/api/content/[id]/subtitles",
				pattern: /^\/api\/content\/([^/]+?)\/subtitles\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BKhR3JM3.js'))
			},
			{
				id: "/api/content/[id]/thumbnail-click",
				pattern: /^\/api\/content\/([^/]+?)\/thumbnail-click\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DZXDXRT6.js'))
			},
			{
				id: "/api/content/[id]/thumbnail-impression",
				pattern: /^\/api\/content\/([^/]+?)\/thumbnail-impression\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-srj3jDmK.js'))
			},
			{
				id: "/api/creators/[id]/follow",
				pattern: /^\/api\/creators\/([^/]+?)\/follow\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DSGI3yRZ.js'))
			},
			{
				id: "/api/creator/analytics",
				pattern: /^\/api\/creator\/analytics\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BNhOHG5O.js'))
			},
			{
				id: "/api/creator/application",
				pattern: /^\/api\/creator\/application\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-f0o_8ywo.js'))
			},
			{
				id: "/api/creator/content",
				pattern: /^\/api\/creator\/content\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DMkKLJ-L.js'))
			},
			{
				id: "/api/creator/content/bulk",
				pattern: /^\/api\/creator\/content\/bulk\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CD8xbnV3.js'))
			},
			{
				id: "/api/creator/content/lookup",
				pattern: /^\/api\/creator\/content\/lookup\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BzMT5CU0.js'))
			},
			{
				id: "/api/creator/content/search",
				pattern: /^\/api\/creator\/content\/search\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CKAl1iSS.js'))
			},
			{
				id: "/api/creator/content/[id]",
				pattern: /^\/api\/creator\/content\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CTPqyiMy.js'))
			},
			{
				id: "/api/creator/content/[id]/duplicate",
				pattern: /^\/api\/creator\/content\/([^/]+?)\/duplicate\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DUo-HNdX.js'))
			},
			{
				id: "/api/creator/content/[id]/episodes",
				pattern: /^\/api\/creator\/content\/([^/]+?)\/episodes\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BU05qEdj.js'))
			},
			{
				id: "/api/creator/content/[id]/episodes/[episodeId]",
				pattern: /^\/api\/creator\/content\/([^/]+?)\/episodes\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false},{"name":"episodeId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BhowCTBp.js'))
			},
			{
				id: "/api/creator/content/[id]/pricing",
				pattern: /^\/api\/creator\/content\/([^/]+?)\/pricing\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-ghxLoHQB.js'))
			},
			{
				id: "/api/creator/content/[id]/subtitles",
				pattern: /^\/api\/creator\/content\/([^/]+?)\/subtitles\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Bkfp6y8_.js'))
			},
			{
				id: "/api/creator/content/[id]/subtitles/[trackId]",
				pattern: /^\/api\/creator\/content\/([^/]+?)\/subtitles\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false},{"name":"trackId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-EhHP8pS-.js'))
			},
			{
				id: "/api/creator/content/[id]/thread",
				pattern: /^\/api\/creator\/content\/([^/]+?)\/thread\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DqGP2N8T.js'))
			},
			{
				id: "/api/creator/content/[id]/thread/stream",
				pattern: /^\/api\/creator\/content\/([^/]+?)\/thread\/stream\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CqXh8XjR.js'))
			},
			{
				id: "/api/creator/content/[id]/thumbnails",
				pattern: /^\/api\/creator\/content\/([^/]+?)\/thumbnails\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DVUGV-mo.js'))
			},
			{
				id: "/api/creator/content/[id]/thumbnails/[vid]",
				pattern: /^\/api\/creator\/content\/([^/]+?)\/thumbnails\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false},{"name":"vid","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-B9XWWqy6.js'))
			},
			{
				id: "/api/creator/content/[id]/thumbnails/[vid]/promote",
				pattern: /^\/api\/creator\/content\/([^/]+?)\/thumbnails\/([^/]+?)\/promote\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false},{"name":"vid","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-B_TpuL56.js'))
			},
			{
				id: "/api/creator/earnings",
				pattern: /^\/api\/creator\/earnings\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DcS3_TfW.js'))
			},
			{
				id: "/api/creator/encoder-stream",
				pattern: /^\/api\/creator\/encoder-stream\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DKy0FS_1.js'))
			},
			{
				id: "/api/creator/live",
				pattern: /^\/api\/creator\/live\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BP40EQbl.js'))
			},
			{
				id: "/api/creator/live/[id]",
				pattern: /^\/api\/creator\/live\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DwtSa9O_.js'))
			},
			{
				id: "/api/creator/messages",
				pattern: /^\/api\/creator\/messages\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BytPoxgE.js'))
			},
			{
				id: "/api/creator/messages/bulk",
				pattern: /^\/api\/creator\/messages\/bulk\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-w_szoQfx.js'))
			},
			{
				id: "/api/creator/messages/[id]/archive",
				pattern: /^\/api\/creator\/messages\/([^/]+?)\/archive\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-3E3rzKb9.js'))
			},
			{
				id: "/api/creator/messages/[id]/read",
				pattern: /^\/api\/creator\/messages\/([^/]+?)\/read\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-nX_xjQAB.js'))
			},
			{
				id: "/api/creator/moderation/forum",
				pattern: /^\/api\/creator\/moderation\/forum\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BjLaGaVn.js'))
			},
			{
				id: "/api/creator/moderation/forum/replies/[id]",
				pattern: /^\/api\/creator\/moderation\/forum\/replies\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-B11A1KUP.js'))
			},
			{
				id: "/api/creator/moderation/forum/threads/[id]",
				pattern: /^\/api\/creator\/moderation\/forum\/threads\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DEv9Xo2l.js'))
			},
			{
				id: "/api/creator/moderation/reviews",
				pattern: /^\/api\/creator\/moderation\/reviews\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BYNkiPHc.js'))
			},
			{
				id: "/api/creator/moderation/reviews/[id]",
				pattern: /^\/api\/creator\/moderation\/reviews\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Cs0y7_mc.js'))
			},
			{
				id: "/api/creator/newsletter/subscribe",
				pattern: /^\/api\/creator\/newsletter\/subscribe\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-C01w-q5F.js'))
			},
			{
				id: "/api/creator/payment-preferences",
				pattern: /^\/api\/creator\/payment-preferences\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BZOMzvOp.js'))
			},
			{
				id: "/api/creator/payouts/method",
				pattern: /^\/api\/creator\/payouts\/method\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DNebHTFl.js'))
			},
			{
				id: "/api/creator/payouts/stripe/onboard",
				pattern: /^\/api\/creator\/payouts\/stripe\/onboard\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Bawv41Wi.js'))
			},
			{
				id: "/api/creator/payouts/stripe/status",
				pattern: /^\/api\/creator\/payouts\/stripe\/status\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BKHJ3VDm.js'))
			},
			{
				id: "/api/creator/profile",
				pattern: /^\/api\/creator\/profile\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-B9Q_hIrs.js'))
			},
			{
				id: "/api/creator/stats",
				pattern: /^\/api\/creator\/stats\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-ChJpreZH.js'))
			},
			{
				id: "/api/creator/tax-1099-forms",
				pattern: /^\/api\/creator\/tax-1099-forms\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CRb-d96L.js'))
			},
			{
				id: "/api/creator/tax-forms",
				pattern: /^\/api\/creator\/tax-forms\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DA9-9Efv.js'))
			},
			{
				id: "/api/cron/ab-auto-promote",
				pattern: /^\/api\/cron\/ab-auto-promote\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Ckvz1yBY.js'))
			},
			{
				id: "/api/cron/agents/[name]",
				pattern: /^\/api\/cron\/agents\/([^/]+?)\/?$/,
				params: [{"name":"name","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DyeYFq_m.js'))
			},
			{
				id: "/api/cron/creator-payouts",
				pattern: /^\/api\/cron\/creator-payouts\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-B8mm-WUs.js'))
			},
			{
				id: "/api/cron/encoder-poll",
				pattern: /^\/api\/cron\/encoder-poll\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-C8PXPD83.js'))
			},
			{
				id: "/api/cron/event-status-sweep",
				pattern: /^\/api\/cron\/event-status-sweep\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CQ-mDjb3.js'))
			},
			{
				id: "/api/cron/meilisearch-reindex",
				pattern: /^\/api\/cron\/meilisearch-reindex\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DyC6Em7_.js'))
			},
			{
				id: "/api/cron/newsletter-weekly-digest",
				pattern: /^\/api\/cron\/newsletter-weekly-digest\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-LHnTWqCp.js'))
			},
			{
				id: "/api/cron/payout-reserve",
				pattern: /^\/api\/cron\/payout-reserve\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Dtl17nxZ.js'))
			},
			{
				id: "/api/cron/renew-subscriptions",
				pattern: /^\/api\/cron\/renew-subscriptions\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Dgqnd3Zw.js'))
			},
			{
				id: "/api/cron/scheduled-publish",
				pattern: /^\/api\/cron\/scheduled-publish\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-tuWYzofo.js'))
			},
			{
				id: "/api/cron/settlement-reconcile",
				pattern: /^\/api\/cron\/settlement-reconcile\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-c5xJb063.js'))
			},
			{
				id: "/api/cron/staking-indexer",
				pattern: /^\/api\/cron\/staking-indexer\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-YBGPLzKH.js'))
			},
			{
				id: "/api/cron/stc-settle",
				pattern: /^\/api\/cron\/stc-settle\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CRy-EG3e.js'))
			},
			{
				id: "/api/cron/tax-1099-generate",
				pattern: /^\/api\/cron\/tax-1099-generate\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BZryuAFX.js'))
			},
			{
				id: "/api/downloads/manifest/[id]",
				pattern: /^\/api\/downloads\/manifest\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DZtWWxgL.js'))
			},
			{
				id: "/api/encoder/job-state/[jobId]",
				pattern: /^\/api\/encoder\/job-state\/([^/]+?)\/?$/,
				params: [{"name":"jobId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-B4FKZge1.js'))
			},
			{
				id: "/api/encoder/jobs",
				pattern: /^\/api\/encoder\/jobs\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-GPJOCTUy.js'))
			},
			{
				id: "/api/encoder/jobs/[jobId]",
				pattern: /^\/api\/encoder\/jobs\/([^/]+?)\/?$/,
				params: [{"name":"jobId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-C6uta51i.js'))
			},
			{
				id: "/api/encoder/jobs/[jobId]/commit",
				pattern: /^\/api\/encoder\/jobs\/([^/]+?)\/commit\/?$/,
				params: [{"name":"jobId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DJEbuJwo.js'))
			},
			{
				id: "/api/encoder/jobs/[jobId]/playback",
				pattern: /^\/api\/encoder\/jobs\/([^/]+?)\/playback\/?$/,
				params: [{"name":"jobId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Cqfr7Zyt.js'))
			},
			{
				id: "/api/encoder/live-finalize",
				pattern: /^\/api\/encoder\/live-finalize\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DD4fWND3.js'))
			},
			{
				id: "/api/encoder/live-state",
				pattern: /^\/api\/encoder\/live-state\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CrPVfp5t.js'))
			},
			{
				id: "/api/encoder/live-state/validate",
				pattern: /^\/api\/encoder\/live-state\/validate\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-C6xBH99u.js'))
			},
			{
				id: "/api/encoder/pending",
				pattern: /^\/api\/encoder\/pending\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-C94DbFRa.js'))
			},
			{
				id: "/api/encoder/presigned",
				pattern: /^\/api\/encoder\/presigned\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-KcL4aPh9.js'))
			},
			{
				id: "/api/encoder/process",
				pattern: /^\/api\/encoder\/process\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CyzJShXP.js'))
			},
			{
				id: "/api/encoder/ready",
				pattern: /^\/api\/encoder\/ready\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-U8_50yCi.js'))
			},
			{
				id: "/api/encoder/scan-ready",
				pattern: /^\/api\/encoder\/scan-ready\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BbRNBQVk.js'))
			},
			{
				id: "/api/encoder/webhook",
				pattern: /^\/api\/encoder\/webhook\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CUCDSIas.js'))
			},
			{
				id: "/api/events",
				pattern: /^\/api\/events\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CmBAiQAX.js'))
			},
			{
				id: "/api/events/feed.ics",
				pattern: /^\/api\/events\/feed\.ics\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Baks_FCr.js'))
			},
			{
				id: "/api/events/[id]",
				pattern: /^\/api\/events\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-B-JN2mBZ.js'))
			},
			{
				id: "/api/events/[id]/register",
				pattern: /^\/api\/events\/([^/]+?)\/register\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-C1sT3fBN.js'))
			},
			{
				id: "/api/files",
				pattern: /^\/api\/files\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DZ4sNTIz.js'))
			},
			{
				id: "/api/forum/replies/[id]",
				pattern: /^\/api\/forum\/replies\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BJLtCGY0.js'))
			},
			{
				id: "/api/forum/replies/[id]/like",
				pattern: /^\/api\/forum\/replies\/([^/]+?)\/like\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-WFNtrfdl.js'))
			},
			{
				id: "/api/forum/threads",
				pattern: /^\/api\/forum\/threads\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DVtyXB0L.js'))
			},
			{
				id: "/api/forum/threads/[id]",
				pattern: /^\/api\/forum\/threads\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-tRXngCwQ.js'))
			},
			{
				id: "/api/forum/threads/[id]/like",
				pattern: /^\/api\/forum\/threads\/([^/]+?)\/like\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-G8Nv0yw8.js'))
			},
			{
				id: "/api/forum/threads/[id]/replies",
				pattern: /^\/api\/forum\/threads\/([^/]+?)\/replies\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Cv8k1vim.js'))
			},
			{
				id: "/api/health",
				pattern: /^\/api\/health\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DgTbpixG.js'))
			},
			{
				id: "/api/internal/refunds/sweep-pending",
				pattern: /^\/api\/internal\/refunds\/sweep-pending\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CaxiwH01.js'))
			},
			{
				id: "/api/kids/quiz/generate",
				pattern: /^\/api\/kids\/quiz\/generate\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CxYOfrTR.js'))
			},
			{
				id: "/api/kids/quiz/submit",
				pattern: /^\/api\/kids\/quiz\/submit\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DZhLAvEd.js'))
			},
			{
				id: "/api/live/[streamId]/chat",
				pattern: /^\/api\/live\/([^/]+?)\/chat\/?$/,
				params: [{"name":"streamId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BjxapCjZ.js'))
			},
			{
				id: "/api/live/[streamId]/chat/stream",
				pattern: /^\/api\/live\/([^/]+?)\/chat\/stream\/?$/,
				params: [{"name":"streamId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CyVdGFoK.js'))
			},
			{
				id: "/api/live/[streamId]/chat/[messageId]",
				pattern: /^\/api\/live\/([^/]+?)\/chat\/([^/]+?)\/?$/,
				params: [{"name":"streamId","optional":false,"rest":false,"chained":false},{"name":"messageId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Fvt_FE2A.js'))
			},
			{
				id: "/api/milestones",
				pattern: /^\/api\/milestones\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BL3VZSVw.js'))
			},
			{
				id: "/api/notifications",
				pattern: /^\/api\/notifications\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CqTcwiXu.js'))
			},
			{
				id: "/api/notifications/preferences",
				pattern: /^\/api\/notifications\/preferences\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Dq8XJihF.js'))
			},
			{
				id: "/api/notifications/[id]",
				pattern: /^\/api\/notifications\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DUP1SiBg.js'))
			},
			{
				id: "/api/notifications/[id]/read",
				pattern: /^\/api\/notifications\/([^/]+?)\/read\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BNJ3XzjB.js'))
			},
			{
				id: "/api/parental/report",
				pattern: /^\/api\/parental\/report\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DqIHz9aC.js'))
			},
			{
				id: "/api/payment/initialize",
				pattern: /^\/api\/payment\/initialize\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DM50dq9U.js'))
			},
			{
				id: "/api/payment/verify",
				pattern: /^\/api\/payment\/verify\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-P035GemH.js'))
			},
			{
				id: "/api/payment/webhook",
				pattern: /^\/api\/payment\/webhook\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CRxEW1fP.js'))
			},
			{
				id: "/api/platform-settings",
				pattern: /^\/api\/platform-settings\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CNsS39Xo.js'))
			},
			{
				id: "/api/playlists",
				pattern: /^\/api\/playlists\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BAKJwLKH.js'))
			},
			{
				id: "/api/playlists/[id]/items",
				pattern: /^\/api\/playlists\/([^/]+?)\/items\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-_WE-V_ho.js'))
			},
			{
				id: "/api/ppv/check-access/[contentId]",
				pattern: /^\/api\/ppv\/check-access\/([^/]+?)\/?$/,
				params: [{"name":"contentId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CaUe_lwt.js'))
			},
			{
				id: "/api/ppv/purchase",
				pattern: /^\/api\/ppv\/purchase\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DimGeNeE.js'))
			},
			{
				id: "/api/ppv/refund",
				pattern: /^\/api\/ppv\/refund\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BEyEEYeD.js'))
			},
			{
				id: "/api/profiles",
				pattern: /^\/api\/profiles\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DwOAuOQc.js'))
			},
			{
				id: "/api/profiles/current",
				pattern: /^\/api\/profiles\/current\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DNUxQqOi.js'))
			},
			{
				id: "/api/profiles/[id]",
				pattern: /^\/api\/profiles\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CYPrquGx.js'))
			},
			{
				id: "/api/profiles/[id]/pin",
				pattern: /^\/api\/profiles\/([^/]+?)\/pin\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BxMZpvsk.js'))
			},
			{
				id: "/api/push/subscribe",
				pattern: /^\/api\/push\/subscribe\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BEVcK5gX.js'))
			},
			{
				id: "/api/recommendations",
				pattern: /^\/api\/recommendations\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-29MUm8Ix.js'))
			},
			{
				id: "/api/reports",
				pattern: /^\/api\/reports\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CUxgKBcj.js'))
			},
			{
				id: "/api/reviews",
				pattern: /^\/api\/reviews\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-D9sd8l-A.js'))
			},
			{
				id: "/api/reviews/[id]/helpful",
				pattern: /^\/api\/reviews\/([^/]+?)\/helpful\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-D1jq956M.js'))
			},
			{
				id: "/api/search",
				pattern: /^\/api\/search\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BAj2dlU9.js'))
			},
			{
				id: "/api/shares",
				pattern: /^\/api\/shares\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-J87QEtAF.js'))
			},
			{
				id: "/api/subscriptions/add-family",
				pattern: /^\/api\/subscriptions\/add-family\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DuIrmbsG.js'))
			},
			{
				id: "/api/subscriptions/cancel",
				pattern: /^\/api\/subscriptions\/cancel\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-l3SfkwDu.js'))
			},
			{
				id: "/api/subscriptions/change-plan",
				pattern: /^\/api\/subscriptions\/change-plan\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CYuwUFmx.js'))
			},
			{
				id: "/api/subscriptions/send-otp",
				pattern: /^\/api\/subscriptions\/send-otp\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-D_rvgMas.js'))
			},
			{
				id: "/api/subscriptions/start-trial",
				pattern: /^\/api\/subscriptions\/start-trial\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-P5XprBdC.js'))
			},
			{
				id: "/api/subscriptions/status",
				pattern: /^\/api\/subscriptions\/status\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-OLR7KTlO.js'))
			},
			{
				id: "/api/success-stories",
				pattern: /^\/api\/success-stories\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BjZVo1lm.js'))
			},
			{
				id: "/api/support/tickets",
				pattern: /^\/api\/support\/tickets\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CTEnfJ0C.js'))
			},
			{
				id: "/api/users",
				pattern: /^\/api\/users\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-JKffUmxb.js'))
			},
			{
				id: "/api/users/me/auth-providers",
				pattern: /^\/api\/users\/me\/auth-providers\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-C197L93F.js'))
			},
			{
				id: "/api/users/me/stc-balance",
				pattern: /^\/api\/users\/me\/stc-balance\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-C7olciVU.js'))
			},
			{
				id: "/api/users/me/stc-claim",
				pattern: /^\/api\/users\/me\/stc-claim\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BJq-nzLs.js'))
			},
			{
				id: "/api/users/[id]",
				pattern: /^\/api\/users\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BPQ2bJMb.js'))
			},
			{
				id: "/api/user/profile",
				pattern: /^\/api\/user\/profile\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DDEejM4g.js'))
			},
			{
				id: "/api/watch/active",
				pattern: /^\/api\/watch\/active\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-C9Wy4Rzv.js'))
			},
			{
				id: "/api/watch/history",
				pattern: /^\/api\/watch\/history\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-IGj2zPhu.js'))
			},
			{
				id: "/api/watch/live/[id]/stream",
				pattern: /^\/api\/watch\/live\/([^/]+?)\/stream\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CEv0rH7P.js'))
			},
			{
				id: "/api/watch/progress",
				pattern: /^\/api\/watch\/progress\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-D-GH5ufA.js'))
			},
			{
				id: "/api/watch/[videoId]",
				pattern: /^\/api\/watch\/([^/]+?)\/?$/,
				params: [{"name":"videoId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Cs3Mp-kA.js'))
			},
			{
				id: "/api/webhooks/stripe",
				pattern: /^\/api\/webhooks\/stripe\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Mijzl1ed.js'))
			},
			{
				id: "/(app)/apply/creator",
				pattern: /^\/apply\/creator\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 45 },
				endpoint: null
			},
			{
				id: "/(app)/archive",
				pattern: /^\/archive\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 46 },
				endpoint: null
			},
			{
				id: "/(auth)/auth/forget-password",
				pattern: /^\/auth\/forget-password\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,,], leaf: 73 },
				endpoint: null
			},
			{
				id: "/(auth)/auth/forget-password/success",
				pattern: /^\/auth\/forget-password\/success\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,,], leaf: 74 },
				endpoint: null
			},
			{
				id: "/(auth)/auth/login",
				pattern: /^\/auth\/login\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,,], leaf: 75 },
				endpoint: null
			},
			{
				id: "/(auth)/auth/register",
				pattern: /^\/auth\/register\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,,], leaf: 76 },
				endpoint: null
			},
			{
				id: "/(auth)/auth/reset-password",
				pattern: /^\/auth\/reset-password\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,,], leaf: 77 },
				endpoint: null
			},
			{
				id: "/(app)/browse",
				pattern: /^\/browse\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 47 },
				endpoint: null
			},
			{
				id: "/(app)/careers",
				pattern: /^\/careers\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 48 },
				endpoint: null
			},
			{
				id: "/(app)/checkout",
				pattern: /^\/checkout\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 49 },
				endpoint: null
			},
			{
				id: "/(app)/contact",
				pattern: /^\/contact\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 50 },
				endpoint: null
			},
			{
				id: "/(app)/creators/[id]",
				pattern: /^\/creators\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,3,], errors: [1,,], leaf: 51 },
				endpoint: null
			},
			{
				id: "/(creator)/creator",
				pattern: /^\/creator\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 78 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/agreement",
				pattern: /^\/creator\/agreement\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 79 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/analytics-help",
				pattern: /^\/creator\/analytics-help\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 81 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/analytics",
				pattern: /^\/creator\/analytics\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 80 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/best-practices",
				pattern: /^\/creator\/best-practices\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 82 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/content",
				pattern: /^\/creator\/content\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 83 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/content/[id]",
				pattern: /^\/creator\/content\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,5,], errors: [1,,], leaf: 84 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/content/[id]/episodes",
				pattern: /^\/creator\/content\/([^/]+?)\/episodes\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,5,], errors: [1,,], leaf: 85 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/copyright",
				pattern: /^\/creator\/copyright\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 86 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/earnings",
				pattern: /^\/creator\/earnings\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 87 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/earnings/tax-forms",
				pattern: /^\/creator\/earnings\/tax-forms\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 88 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/events",
				pattern: /^\/creator\/events\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 89 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/forum",
				pattern: /^\/creator\/forum\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 90 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/forum/new",
				pattern: /^\/creator\/forum\/new\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 91 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/forum/[id]",
				pattern: /^\/creator\/forum\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,5,], errors: [1,,], leaf: 92 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/guidelines",
				pattern: /^\/creator\/guidelines\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 93 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/inbox",
				pattern: /^\/creator\/inbox\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 94 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/live",
				pattern: /^\/creator\/live\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 95 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/moderation",
				pattern: /^\/creator\/moderation\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 96 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/newsletter",
				pattern: /^\/creator\/newsletter\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 97 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/profile",
				pattern: /^\/creator\/profile\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 98 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/success-stories",
				pattern: /^\/creator\/success-stories\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 99 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/support",
				pattern: /^\/creator\/support\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 100 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/tech-support",
				pattern: /^\/creator\/tech-support\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 101 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/test",
				pattern: /^\/creator\/test\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 102 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/upload",
				pattern: /^\/creator\/upload\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 103 },
				endpoint: null
			},
			{
				id: "/(protected)/dashboard",
				pattern: /^\/dashboard\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 105 },
				endpoint: null
			},
			{
				id: "/(app)/device-support",
				pattern: /^\/device-support\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 52 },
				endpoint: null
			},
			{
				id: "/(app)/documentaries",
				pattern: /^\/documentaries\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 53 },
				endpoint: null
			},
			{
				id: "/(protected)/documentation",
				pattern: /^\/documentation\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 106 },
				endpoint: null
			},
			{
				id: "/(app)/exchange",
				pattern: /^\/exchange\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 54 },
				endpoint: null
			},
			{
				id: "/(app)/faq",
				pattern: /^\/faq\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 55 },
				endpoint: null
			},
			{
				id: "/(app)/features",
				pattern: /^\/features\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 56 },
				endpoint: null
			},
			{
				id: "/(app)/guidelines",
				pattern: /^\/guidelines\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 57 },
				endpoint: null
			},
			{
				id: "/(app)/help",
				pattern: /^\/help\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 58 },
				endpoint: null
			},
			{
				id: "/kids/kiddies",
				pattern: /^\/kids\/kiddies\/?$/,
				params: [],
				page: { layouts: [0,9,], errors: [1,,], leaf: 117 },
				endpoint: null
			},
			{
				id: "/kids/kiddies/bible-quiz",
				pattern: /^\/kids\/kiddies\/bible-quiz\/?$/,
				params: [],
				page: { layouts: [0,9,], errors: [1,,], leaf: 118 },
				endpoint: null
			},
			{
				id: "/kids/kiddies/documentaries",
				pattern: /^\/kids\/kiddies\/documentaries\/?$/,
				params: [],
				page: { layouts: [0,9,], errors: [1,,], leaf: 119 },
				endpoint: null
			},
			{
				id: "/kids/kiddies/movies",
				pattern: /^\/kids\/kiddies\/movies\/?$/,
				params: [],
				page: { layouts: [0,9,], errors: [1,,], leaf: 120 },
				endpoint: null
			},
			{
				id: "/kids/kiddies/profile",
				pattern: /^\/kids\/kiddies\/profile\/?$/,
				params: [],
				page: { layouts: [0,9,], errors: [1,,], leaf: 121 },
				endpoint: null
			},
			{
				id: "/kids/kiddies/shows",
				pattern: /^\/kids\/kiddies\/shows\/?$/,
				params: [],
				page: { layouts: [0,9,], errors: [1,,], leaf: 122 },
				endpoint: null
			},
			{
				id: "/kids/teens",
				pattern: /^\/kids\/teens\/?$/,
				params: [],
				page: { layouts: [0,8,], errors: [1,,], leaf: 123 },
				endpoint: null
			},
			{
				id: "/(app)/liquidity",
				pattern: /^\/liquidity\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 59 },
				endpoint: null
			},
			{
				id: "/(protected)/milestones",
				pattern: /^\/milestones\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 107 },
				endpoint: null
			},
			{
				id: "/(app)/movies",
				pattern: /^\/movies\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 60 },
				endpoint: null
			},
			{
				id: "/(app)/my-studios",
				pattern: /^\/my-studios\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 61 },
				endpoint: null
			},
			{
				id: "/(app)/offline",
				pattern: /^\/offline\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 62 },
				endpoint: null
			},
			{
				id: "/(protected)/parental-controls",
				pattern: /^\/parental-controls\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 108 },
				endpoint: null
			},
			{
				id: "/(app)/plans",
				pattern: /^\/plans\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 63 },
				endpoint: __memo(() => Promise.resolve().then(function () { return _server_ts; }))
			},
			{
				id: "/(app)/press",
				pattern: /^\/press\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 64 },
				endpoint: null
			},
			{
				id: "/(app)/privacy",
				pattern: /^\/privacy\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 65 },
				endpoint: null
			},
			{
				id: "/(protected)/profiles",
				pattern: /^\/profiles\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 110 },
				endpoint: null
			},
			{
				id: "/(protected)/profile",
				pattern: /^\/profile\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 109 },
				endpoint: null
			},
			{
				id: "/(app)/search",
				pattern: /^\/search\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 66 },
				endpoint: null
			},
			{
				id: "/(protected)/settings",
				pattern: /^\/settings\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 111 },
				endpoint: null
			},
			{
				id: "/(app)/shows",
				pattern: /^\/shows\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 67 },
				endpoint: null
			},
			{
				id: "/sitemap.xml",
				pattern: /^\/sitemap\.xml\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-C4aqcXgh.js'))
			},
			{
				id: "/(app)/sponsorships",
				pattern: /^\/sponsorships\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 68 },
				endpoint: null
			},
			{
				id: "/(app)/staking",
				pattern: /^\/staking\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 69 },
				endpoint: null
			},
			{
				id: "/(web3)/subscription",
				pattern: /^\/subscription\/?$/,
				params: [],
				page: { layouts: [0,7,], errors: [1,,], leaf: 114 },
				endpoint: null
			},
			{
				id: "/(app)/terms",
				pattern: /^\/terms\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 70 },
				endpoint: null
			},
			{
				id: "/(web3)/tokens",
				pattern: /^\/tokens\/?$/,
				params: [],
				page: { layouts: [0,7,], errors: [1,,], leaf: 115 },
				endpoint: null
			},
			{
				id: "/(app)/token",
				pattern: /^\/token\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 71 },
				endpoint: null
			},
			{
				id: "/(protected)/users",
				pattern: /^\/users\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 112 },
				endpoint: null
			},
			{
				id: "/(web3)/wallet",
				pattern: /^\/wallet\/?$/,
				params: [],
				page: { layouts: [0,7,], errors: [1,,], leaf: 116 },
				endpoint: null
			},
			{
				id: "/(protected)/watchlist",
				pattern: /^\/watchlist\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 113 },
				endpoint: null
			},
			{
				id: "/watch/live/[id]",
				pattern: /^\/watch\/live\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 124 },
				endpoint: null
			},
			{
				id: "/watch/[id]",
				pattern: /^\/watch\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 125 },
				endpoint: null
			},
			{
				id: "/(app)/webinars",
				pattern: /^\/webinars\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 72 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

const prerendered = new Set([]);

const base = "";

var _server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null
});

var abis = /*#__PURE__*/Object.freeze({
	__proto__: null
});

export { abis as a, base as b, manifest as m, prerendered as p };
//# sourceMappingURL=abis-uXcwAU36.js.map
