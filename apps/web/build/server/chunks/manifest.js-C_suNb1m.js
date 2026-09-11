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
		client: {start:"_app/immutable/entry/start.Bsyy4YUY.js",app:"_app/immutable/entry/app.B_HhFXrx.js",imports:["_app/immutable/entry/start.Bsyy4YUY.js","_app/immutable/chunks/BTEnPp3h.js","_app/immutable/chunks/BsVwIFTV.js","_app/immutable/chunks/QTnfLwEv.js","_app/immutable/chunks/BuFlayix.js","_app/immutable/chunks/Bc9cMxm7.js","_app/immutable/entry/app.B_HhFXrx.js","_app/immutable/chunks/BsVwIFTV.js","_app/immutable/chunks/QTnfLwEv.js","_app/immutable/chunks/HclGiUj8.js"],stylesheets:["_app/immutable/assets/ui-libs.C1tyNZCz.css","_app/immutable/assets/ui-libs.C1tyNZCz.css"],fonts:[],uses_env_dynamic_public:true},
		nodes: [
			__memo(() => import('./0-C5hHvhUu.js')),
			__memo(() => import('./1-DwG2y6fl.js')),
			__memo(() => import('./2-B8E4wbCv.js')),
			__memo(() => import('./3-IqGfXeBW.js')),
			__memo(() => import('./4-CkZJiz3s.js')),
			__memo(() => import('./5-PVp5Zh0j.js')),
			__memo(() => import('./6-BkRnuUdk.js')),
			__memo(() => import('./7-BYdH0Qob.js')),
			__memo(() => import('./8-Ysx3_9MG.js')),
			__memo(() => import('./9-BoSdf5wa.js')),
			__memo(() => import('./10-BTi86hH5.js')),
			__memo(() => import('./11-DXaLWOOW.js')),
			__memo(() => import('./12-C4WWFXPQ.js')),
			__memo(() => import('./13-it-eztc3.js')),
			__memo(() => import('./14-B7I1BZSw.js')),
			__memo(() => import('./15-CKaCQXH_.js')),
			__memo(() => import('./16-BFDLvGAP.js')),
			__memo(() => import('./17-Dq6kTYjo.js')),
			__memo(() => import('./18-TecxjXxB.js')),
			__memo(() => import('./19-CVau6tya.js')),
			__memo(() => import('./20-DKK1vUUe.js')),
			__memo(() => import('./21-BxMGqNGv.js')),
			__memo(() => import('./22-DorG4cKy.js')),
			__memo(() => import('./23-B1RTjYhC.js')),
			__memo(() => import('./24-DBc6tnKD.js')),
			__memo(() => import('./25-ClHYoI6d.js')),
			__memo(() => import('./26-BxBBF4tA.js')),
			__memo(() => import('./27-Q5QU38RA.js')),
			__memo(() => import('./28-CFqGMuKI.js')),
			__memo(() => import('./29-CYiRO9y4.js')),
			__memo(() => import('./30-CawsX-wf.js')),
			__memo(() => import('./31-BdxFrEiJ.js')),
			__memo(() => import('./32-DwuEfoGx.js')),
			__memo(() => import('./33-QdAgIoeD.js')),
			__memo(() => import('./34-BtPYt-S6.js')),
			__memo(() => import('./35-MLK4ubVR.js')),
			__memo(() => import('./36-BL0xA6pW.js')),
			__memo(() => import('./37-C-RuaMSK.js')),
			__memo(() => import('./38-BMGpfo33.js')),
			__memo(() => import('./39-DLpQnTEW.js')),
			__memo(() => import('./40-CUJLMwSZ.js')),
			__memo(() => import('./41-vRkuTllO.js')),
			__memo(() => import('./42-CC21EAvT.js')),
			__memo(() => import('./43-CS1fSbtk.js')),
			__memo(() => import('./44-CumTxM5N.js')),
			__memo(() => import('./45-BOx3CYLk.js')),
			__memo(() => import('./46-MJQ2DRQT.js')),
			__memo(() => import('./47-CZpQnLdw.js')),
			__memo(() => import('./48-CZ5PQQBN.js')),
			__memo(() => import('./49-CUEQGNzA.js')),
			__memo(() => import('./50-DUHZ5iQP.js')),
			__memo(() => import('./51-Djj54xJR.js')),
			__memo(() => import('./52-DpzNxmgH.js')),
			__memo(() => import('./53-DVtvW1xX.js')),
			__memo(() => import('./54-BICf9ej4.js')),
			__memo(() => import('./55-wFCShNIG.js')),
			__memo(() => import('./56-C7Em9Qao.js')),
			__memo(() => import('./57-CgtMFE7s.js')),
			__memo(() => import('./58-C4SbBa2C.js')),
			__memo(() => import('./59-V9Olno-F.js')),
			__memo(() => import('./60-D64kda3i.js')),
			__memo(() => import('./61-CZHBQ5YD.js')),
			__memo(() => import('./62-hJ3PIfoT.js')),
			__memo(() => import('./63-C7b826et.js')),
			__memo(() => import('./64-C2Ft6HW-.js')),
			__memo(() => import('./65-C3E11uu6.js')),
			__memo(() => import('./66-C70o_YyM.js')),
			__memo(() => import('./67-DY_3rpFn.js')),
			__memo(() => import('./68-CosqqJYr.js')),
			__memo(() => import('./69-Ddgft92_.js')),
			__memo(() => import('./70-DX16BN6B.js')),
			__memo(() => import('./71-B_s4nvoI.js')),
			__memo(() => import('./72-YAy0HZwf.js')),
			__memo(() => import('./73-CTiAXTaD.js')),
			__memo(() => import('./74-CdFadlwR.js')),
			__memo(() => import('./75-Mpquxg_J.js')),
			__memo(() => import('./76-Dgtf3f4i.js')),
			__memo(() => import('./77-tocleH29.js')),
			__memo(() => import('./78-D9inCe59.js')),
			__memo(() => import('./79-BtItt_6-.js')),
			__memo(() => import('./80-CuwtlfHD.js')),
			__memo(() => import('./81-DlPQoZbs.js')),
			__memo(() => import('./82-BU1I3l5Y.js')),
			__memo(() => import('./83-Y-IgzZ3Q.js')),
			__memo(() => import('./84-D3usPb4M.js')),
			__memo(() => import('./85-Ct44Y_22.js')),
			__memo(() => import('./86-UJkTJb0Y.js')),
			__memo(() => import('./87-AD6QxpmE.js')),
			__memo(() => import('./88-yVazevgF.js')),
			__memo(() => import('./89-s3pSUwM8.js')),
			__memo(() => import('./90-BcqKNvhm.js')),
			__memo(() => import('./91-9BnKfC3g.js')),
			__memo(() => import('./92-Cok22j9f.js')),
			__memo(() => import('./93-BnDH6gPu.js')),
			__memo(() => import('./94-CkndA0hT.js')),
			__memo(() => import('./95-D8u39vCq.js')),
			__memo(() => import('./96-Bxp6snAA.js')),
			__memo(() => import('./97-2SYIilKg.js')),
			__memo(() => import('./98-Duf1iiJQ.js')),
			__memo(() => import('./99-84xanjS6.js')),
			__memo(() => import('./100-CWt58HqP.js')),
			__memo(() => import('./101-BdQW8ZZh.js')),
			__memo(() => import('./102-D2-bY8P3.js')),
			__memo(() => import('./103-DFIVQtsh.js')),
			__memo(() => import('./104-Ki5lJeQn.js')),
			__memo(() => import('./105-DWXeTkYH.js')),
			__memo(() => import('./106-Yxz0Hlch.js')),
			__memo(() => import('./107-CpaZ-vhN.js')),
			__memo(() => import('./108-CXthFGR0.js')),
			__memo(() => import('./109-DdRHGsBx.js')),
			__memo(() => import('./110-DZks9znu.js')),
			__memo(() => import('./111-D4Vb3Z2f.js')),
			__memo(() => import('./112-2BiiJbqd.js')),
			__memo(() => import('./113-Et4L8UsR.js')),
			__memo(() => import('./114-BQuZjUqL.js')),
			__memo(() => import('./115-CDoyqxek.js')),
			__memo(() => import('./116-C4vNFpuk.js')),
			__memo(() => import('./117-C0lmPL1S.js')),
			__memo(() => import('./118-BkuskgAw.js')),
			__memo(() => import('./119-CB6yrTpG.js')),
			__memo(() => import('./120-BeStynmt.js')),
			__memo(() => import('./121-C-RC9LJF.js')),
			__memo(() => import('./122-Dobi-eUu.js')),
			__memo(() => import('./123-CsEBbcxz.js')),
			__memo(() => import('./124-e1Rv1DAY.js')),
			__memo(() => import('./125-C_x9mAvD.js')),
			__memo(() => import('./126-OAgy4CMy.js')),
			__memo(() => import('./127-D3s_AAvh.js')),
			__memo(() => import('./128-BXNOsl52.js')),
			__memo(() => import('./129-D_uHQ8ha.js')),
			__memo(() => import('./130-OARTTDT_.js')),
			__memo(() => import('./131-CrI1gH_J.js')),
			__memo(() => import('./132-B-RO37-W.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/(app)",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 43 },
				endpoint: null
			},
			{
				id: "/(app)/about",
				pattern: /^\/about\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 44 },
				endpoint: null
			},
			{
				id: "/(app)/access-denied",
				pattern: /^\/access-denied\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 45 },
				endpoint: null
			},
			{
				id: "/(protected)/achievements",
				pattern: /^\/achievements\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 108 },
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
				id: "/(admin)/admin/promo",
				pattern: /^\/admin\/promo\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 31 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/refunds",
				pattern: /^\/admin\/refunds\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 32 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/review",
				pattern: /^\/admin\/review\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 33 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/review/[id]",
				pattern: /^\/admin\/review\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 34 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/settings",
				pattern: /^\/admin\/settings\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 35 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/submissions",
				pattern: /^\/admin\/submissions\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 36 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/system-health",
				pattern: /^\/admin\/system-health\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 37 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/tax-forms",
				pattern: /^\/admin\/tax-forms\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 38 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/tokenomics",
				pattern: /^\/admin\/tokenomics\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 39 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/users",
				pattern: /^\/admin\/users\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 40 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/users/[id]",
				pattern: /^\/admin\/users\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 41 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/workflow",
				pattern: /^\/admin\/workflow\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 42 },
				endpoint: null
			},
			{
				id: "/api/achievements",
				pattern: /^\/api\/achievements\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-p41hojt0.js'))
			},
			{
				id: "/api/admin/abuse",
				pattern: /^\/api\/admin\/abuse\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DpidfSjV.js'))
			},
			{
				id: "/api/admin/abuse/[id]",
				pattern: /^\/api\/admin\/abuse\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-D6Lm3azM.js'))
			},
			{
				id: "/api/admin/admins",
				pattern: /^\/api\/admin\/admins\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-C2lgb_mv.js'))
			},
			{
				id: "/api/admin/agent-runs",
				pattern: /^\/api\/admin\/agent-runs\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CcQjUOZj.js'))
			},
			{
				id: "/api/admin/agents/status",
				pattern: /^\/api\/admin\/agents\/status\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DmfWQsIT.js'))
			},
			{
				id: "/api/admin/agents/[name]/fire",
				pattern: /^\/api\/admin\/agents\/([^/]+?)\/fire\/?$/,
				params: [{"name":"name","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Dnitz7MB.js'))
			},
			{
				id: "/api/admin/ai-costs",
				pattern: /^\/api\/admin\/ai-costs\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-C-KW1QwI.js'))
			},
			{
				id: "/api/admin/ai/config",
				pattern: /^\/api\/admin\/ai\/config\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-PfhQYlOW.js'))
			},
			{
				id: "/api/admin/ai/models",
				pattern: /^\/api\/admin\/ai\/models\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-HqacHhof.js'))
			},
			{
				id: "/api/admin/ai/test",
				pattern: /^\/api\/admin\/ai\/test\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BBMCBvLA.js'))
			},
			{
				id: "/api/admin/analytics",
				pattern: /^\/api\/admin\/analytics\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BuSC1Xg7.js'))
			},
			{
				id: "/api/admin/analytics/stream",
				pattern: /^\/api\/admin\/analytics\/stream\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DJIgTN11.js'))
			},
			{
				id: "/api/admin/communications",
				pattern: /^\/api\/admin\/communications\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Dlwd_y9J.js'))
			},
			{
				id: "/api/admin/communications/templates",
				pattern: /^\/api\/admin\/communications\/templates\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-ClqSPS68.js'))
			},
			{
				id: "/api/admin/content",
				pattern: /^\/api\/admin\/content\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-pgGn4k-l.js'))
			},
			{
				id: "/api/admin/content/bulk",
				pattern: /^\/api\/admin\/content\/bulk\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-D54IK2ms.js'))
			},
			{
				id: "/api/admin/content/[id]",
				pattern: /^\/api\/admin\/content\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BJMV2L_I.js'))
			},
			{
				id: "/api/admin/content/[id]/assign",
				pattern: /^\/api\/admin\/content\/([^/]+?)\/assign\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DW39Ufmx.js'))
			},
			{
				id: "/api/admin/content/[id]/cancel-encode",
				pattern: /^\/api\/admin\/content\/([^/]+?)\/cancel-encode\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-32rEUmrk.js'))
			},
			{
				id: "/api/admin/content/[id]/ppv",
				pattern: /^\/api\/admin\/content\/([^/]+?)\/ppv\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DL2FEjgN.js'))
			},
			{
				id: "/api/admin/content/[id]/pricing",
				pattern: /^\/api\/admin\/content\/([^/]+?)\/pricing\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-YnpK7Bsu.js'))
			},
			{
				id: "/api/admin/content/[id]/publish",
				pattern: /^\/api\/admin\/content\/([^/]+?)\/publish\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DBatNCpu.js'))
			},
			{
				id: "/api/admin/content/[id]/rescan",
				pattern: /^\/api\/admin\/content\/([^/]+?)\/rescan\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DJnlK5Sr.js'))
			},
			{
				id: "/api/admin/content/[id]/review",
				pattern: /^\/api\/admin\/content\/([^/]+?)\/review\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DUX2oSRA.js'))
			},
			{
				id: "/api/admin/content/[id]/thread",
				pattern: /^\/api\/admin\/content\/([^/]+?)\/thread\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Ckfk0T_o.js'))
			},
			{
				id: "/api/admin/content/[id]/thread/stream",
				pattern: /^\/api\/admin\/content\/([^/]+?)\/thread\/stream\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BhUAjtwm.js'))
			},
			{
				id: "/api/admin/creator-applications",
				pattern: /^\/api\/admin\/creator-applications\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DSoOS66-.js'))
			},
			{
				id: "/api/admin/creator-applications/[id]/review",
				pattern: /^\/api\/admin\/creator-applications\/([^/]+?)\/review\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Bo5lhuBY.js'))
			},
			{
				id: "/api/admin/creators",
				pattern: /^\/api\/admin\/creators\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DzzNzDWB.js'))
			},
			{
				id: "/api/admin/creators/invite",
				pattern: /^\/api\/admin\/creators\/invite\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-gobMNxi8.js'))
			},
			{
				id: "/api/admin/dashboard",
				pattern: /^\/api\/admin\/dashboard\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CMCPfpJY.js'))
			},
			{
				id: "/api/admin/disputes",
				pattern: /^\/api\/admin\/disputes\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-D6KZY9qx.js'))
			},
			{
				id: "/api/admin/encoder-stream",
				pattern: /^\/api\/admin\/encoder-stream\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-C4MbUvQK.js'))
			},
			{
				id: "/api/admin/encoder/jobs",
				pattern: /^\/api\/admin\/encoder\/jobs\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-B4nJwC0V.js'))
			},
			{
				id: "/api/admin/encoder/jobs/[mediaId]/cancel",
				pattern: /^\/api\/admin\/encoder\/jobs\/([^/]+?)\/cancel\/?$/,
				params: [{"name":"mediaId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CVt0Wn7d.js'))
			},
			{
				id: "/api/admin/encoder/jobs/[mediaId]/retry",
				pattern: /^\/api\/admin\/encoder\/jobs\/([^/]+?)\/retry\/?$/,
				params: [{"name":"mediaId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Bpcu1snt.js'))
			},
			{
				id: "/api/admin/events",
				pattern: /^\/api\/admin\/events\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-D2Is4XBp.js'))
			},
			{
				id: "/api/admin/events/[id]",
				pattern: /^\/api\/admin\/events\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-TblgzUzA.js'))
			},
			{
				id: "/api/admin/forum/threads/[id]",
				pattern: /^\/api\/admin\/forum\/threads\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DBsNdtYk.js'))
			},
			{
				id: "/api/admin/governance/approve",
				pattern: /^\/api\/admin\/governance\/approve\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Jren22Rw.js'))
			},
			{
				id: "/api/admin/governance/audit",
				pattern: /^\/api\/admin\/governance\/audit\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CY-G4E2E.js'))
			},
			{
				id: "/api/admin/governance/emergency/pause",
				pattern: /^\/api\/admin\/governance\/emergency\/pause\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-7yCMwZVP.js'))
			},
			{
				id: "/api/admin/governance/execute",
				pattern: /^\/api\/admin\/governance\/execute\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-ByEq8VcO.js'))
			},
			{
				id: "/api/admin/governance/proposals",
				pattern: /^\/api\/admin\/governance\/proposals\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CVvzXqX-.js'))
			},
			{
				id: "/api/admin/governance/queue",
				pattern: /^\/api\/admin\/governance\/queue\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CDzyTvCq.js'))
			},
			{
				id: "/api/admin/governance/reports",
				pattern: /^\/api\/admin\/governance\/reports\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BPwQvJMy.js'))
			},
			{
				id: "/api/admin/governance/roles",
				pattern: /^\/api\/admin\/governance\/roles\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Df4bbn1c.js'))
			},
			{
				id: "/api/admin/governance/status",
				pattern: /^\/api\/admin\/governance\/status\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-C2oQd7p7.js'))
			},
			{
				id: "/api/admin/governance/timelock-queue",
				pattern: /^\/api\/admin\/governance\/timelock-queue\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CFcsCHrV.js'))
			},
			{
				id: "/api/admin/governance/treasury",
				pattern: /^\/api\/admin\/governance\/treasury\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-D8BZgJoY.js'))
			},
			{
				id: "/api/admin/observability",
				pattern: /^\/api\/admin\/observability\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BYjVgRun.js'))
			},
			{
				id: "/api/admin/payouts",
				pattern: /^\/api\/admin\/payouts\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CyBBSEKA.js'))
			},
			{
				id: "/api/admin/payouts/[id]/approve",
				pattern: /^\/api\/admin\/payouts\/([^/]+?)\/approve\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-ZJoBSLd7.js'))
			},
			{
				id: "/api/admin/payouts/[id]/hold",
				pattern: /^\/api\/admin\/payouts\/([^/]+?)\/hold\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-42E0yixX.js'))
			},
			{
				id: "/api/admin/payouts/[id]/retry",
				pattern: /^\/api\/admin\/payouts\/([^/]+?)\/retry\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Dc0BLxm3.js'))
			},
			{
				id: "/api/admin/policies",
				pattern: /^\/api\/admin\/policies\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BbLcI352.js'))
			},
			{
				id: "/api/admin/promo/advertisers",
				pattern: /^\/api\/admin\/promo\/advertisers\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-D1Gny8tH.js'))
			},
			{
				id: "/api/admin/promo/breaks",
				pattern: /^\/api\/admin\/promo\/breaks\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DJkRV9QZ.js'))
			},
			{
				id: "/api/admin/promo/campaigns",
				pattern: /^\/api\/admin\/promo\/campaigns\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BHK10CAW.js'))
			},
			{
				id: "/api/admin/promo/creatives",
				pattern: /^\/api\/admin\/promo\/creatives\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-2t5mNsgD.js'))
			},
			{
				id: "/api/admin/promo/preview",
				pattern: /^\/api\/admin\/promo\/preview\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-9Ghj4LT4.js'))
			},
			{
				id: "/api/admin/promo/reports",
				pattern: /^\/api\/admin\/promo\/reports\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-5jLPm-O7.js'))
			},
			{
				id: "/api/admin/refunds",
				pattern: /^\/api\/admin\/refunds\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BcbOUK08.js'))
			},
			{
				id: "/api/admin/refunds/lookup",
				pattern: /^\/api\/admin\/refunds\/lookup\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-bGswl9UY.js'))
			},
			{
				id: "/api/admin/reviews",
				pattern: /^\/api\/admin\/reviews\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BpP4tKmy.js'))
			},
			{
				id: "/api/admin/settings",
				pattern: /^\/api\/admin\/settings\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Dnzypy2_.js'))
			},
			{
				id: "/api/admin/settings/test-email",
				pattern: /^\/api\/admin\/settings\/test-email\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Cr2YLodi.js'))
			},
			{
				id: "/api/admin/sponsorships",
				pattern: /^\/api\/admin\/sponsorships\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-eEL7GP2i.js'))
			},
			{
				id: "/api/admin/sponsorships/[id]/review",
				pattern: /^\/api\/admin\/sponsorships\/([^/]+?)\/review\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BwD9mrWA.js'))
			},
			{
				id: "/api/admin/stats",
				pattern: /^\/api\/admin\/stats\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BEfDGmSo.js'))
			},
			{
				id: "/api/admin/success-stories",
				pattern: /^\/api\/admin\/success-stories\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DTDjR3b1.js'))
			},
			{
				id: "/api/admin/success-stories/[id]/review",
				pattern: /^\/api\/admin\/success-stories\/([^/]+?)\/review\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DGNtG0HG.js'))
			},
			{
				id: "/api/admin/support-tickets",
				pattern: /^\/api\/admin\/support-tickets\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CbI6Y5vb.js'))
			},
			{
				id: "/api/admin/support-tickets/[id]/review",
				pattern: /^\/api\/admin\/support-tickets\/([^/]+?)\/review\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BJFjG2AD.js'))
			},
			{
				id: "/api/admin/tax-forms",
				pattern: /^\/api\/admin\/tax-forms\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-gfE8jPjj.js'))
			},
			{
				id: "/api/admin/tax-forms/[id]/verify",
				pattern: /^\/api\/admin\/tax-forms\/([^/]+?)\/verify\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-C1vYgKbt.js'))
			},
			{
				id: "/api/admin/tokenomics",
				pattern: /^\/api\/admin\/tokenomics\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DLNGV6LG.js'))
			},
			{
				id: "/api/admin/tokenomics/distribution",
				pattern: /^\/api\/admin\/tokenomics\/distribution\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Caw6pR7X.js'))
			},
			{
				id: "/api/admin/users",
				pattern: /^\/api\/admin\/users\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CBr38vrF.js'))
			},
			{
				id: "/api/admin/users/stats",
				pattern: /^\/api\/admin\/users\/stats\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CKQzJLhb.js'))
			},
			{
				id: "/api/admin/users/[id]",
				pattern: /^\/api\/admin\/users\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-C7VoOGQu.js'))
			},
			{
				id: "/api/admin/users/[id]/ban",
				pattern: /^\/api\/admin\/users\/([^/]+?)\/ban\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-d4hlM27H.js'))
			},
			{
				id: "/api/admin/users/[id]/warn",
				pattern: /^\/api\/admin\/users\/([^/]+?)\/warn\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-lhXyboFA.js'))
			},
			{
				id: "/api/admin/workflow",
				pattern: /^\/api\/admin\/workflow\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BFLMZGU9.js'))
			},
			{
				id: "/api/admin/workflow/stats",
				pattern: /^\/api\/admin\/workflow\/stats\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-D6TzBrsx.js'))
			},
			{
				id: "/api/ai/admin/classify-abuse",
				pattern: /^\/api\/ai\/admin\/classify-abuse\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Ba6A9AO3.js'))
			},
			{
				id: "/api/ai/admin/draft-message",
				pattern: /^\/api\/ai\/admin\/draft-message\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CAy85am4.js'))
			},
			{
				id: "/api/ai/admin/summarize-application",
				pattern: /^\/api\/ai\/admin\/summarize-application\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DQkRVhE8.js'))
			},
			{
				id: "/api/ai/companion",
				pattern: /^\/api\/ai\/companion\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CKSIvO6M.js'))
			},
			{
				id: "/api/ai/copilot",
				pattern: /^\/api\/ai\/copilot\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DbTUXXBo.js'))
			},
			{
				id: "/api/ai/copilot/approve",
				pattern: /^\/api\/ai\/copilot\/approve\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BDyfdQmv.js'))
			},
			{
				id: "/api/ai/copilot/conversations",
				pattern: /^\/api\/ai\/copilot\/conversations\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DIDyLZ3V.js'))
			},
			{
				id: "/api/ai/creator-insights",
				pattern: /^\/api\/ai\/creator-insights\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DkDEDBP1.js'))
			},
			{
				id: "/api/ai/moderate",
				pattern: /^\/api\/ai\/moderate\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Dq_QKb1p.js'))
			},
			{
				id: "/api/ai/nft",
				pattern: /^\/api\/ai\/nft\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DjaNlVki.js'))
			},
			{
				id: "/api/ai/search",
				pattern: /^\/api\/ai\/search\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-RYlZXYac.js'))
			},
			{
				id: "/api/ai/suggest/chapters",
				pattern: /^\/api\/ai\/suggest\/chapters\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CNjl5QBo.js'))
			},
			{
				id: "/api/ai/suggest/description",
				pattern: /^\/api\/ai\/suggest\/description\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DvJhSHdc.js'))
			},
			{
				id: "/api/ai/suggest/review-reply",
				pattern: /^\/api\/ai\/suggest\/review-reply\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CaeyUBVw.js'))
			},
			{
				id: "/api/ai/suggest/title",
				pattern: /^\/api\/ai\/suggest\/title\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CVURKiH1.js'))
			},
			{
				id: "/api/ai/tag",
				pattern: /^\/api\/ai\/tag\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-D8_uVlpM.js'))
			},
			{
				id: "/api/ai/token-score",
				pattern: /^\/api\/ai\/token-score\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CtDFj2n3.js'))
			},
			{
				id: "/api/auth/[...all]",
				pattern: /^\/api\/auth(?:\/([^]*))?\/?$/,
				params: [{"name":"all","optional":false,"rest":true,"chained":true}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BvhnmKTU.js'))
			},
			{
				id: "/api/catalog/audience/[category]",
				pattern: /^\/api\/catalog\/audience\/([^/]+?)\/?$/,
				params: [{"name":"category","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-_89droQg.js'))
			},
			{
				id: "/api/catalog/browse",
				pattern: /^\/api\/catalog\/browse\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BhfYA0Ov.js'))
			},
			{
				id: "/api/catalog/coming-soon",
				pattern: /^\/api\/catalog\/coming-soon\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BmMKUR2o.js'))
			},
			{
				id: "/api/catalog/detail/[scope]/[slug]",
				pattern: /^\/api\/catalog\/detail\/([^/]+?)\/([^/]+?)\/?$/,
				params: [{"name":"scope","optional":false,"rest":false,"chained":false},{"name":"slug","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-B3R7MA0Z.js'))
			},
			{
				id: "/api/catalog/[kind]",
				pattern: /^\/api\/catalog\/([^/]+?)\/?$/,
				params: [{"name":"kind","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BVLtCoeJ.js'))
			},
			{
				id: "/api/coming-soon",
				pattern: /^\/api\/coming-soon\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CKTIBrBu.js'))
			},
			{
				id: "/api/coming-soon/[contentId]/notify",
				pattern: /^\/api\/coming-soon\/([^/]+?)\/notify\/?$/,
				params: [{"name":"contentId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Brgnyk6l.js'))
			},
			{
				id: "/api/contact",
				pattern: /^\/api\/contact\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Cx1TlQ1w.js'))
			},
			{
				id: "/api/content/kids",
				pattern: /^\/api\/content\/kids\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CpIr0ACk.js'))
			},
			{
				id: "/api/content/[id]/price",
				pattern: /^\/api\/content\/([^/]+?)\/price\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-D5n5cGPa.js'))
			},
			{
				id: "/api/content/[id]/subtitles",
				pattern: /^\/api\/content\/([^/]+?)\/subtitles\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BeSNSdhw.js'))
			},
			{
				id: "/api/content/[id]/thumbnail-click",
				pattern: /^\/api\/content\/([^/]+?)\/thumbnail-click\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BYxZ5ADc.js'))
			},
			{
				id: "/api/content/[id]/thumbnail-impression",
				pattern: /^\/api\/content\/([^/]+?)\/thumbnail-impression\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-XxYrg0fG.js'))
			},
			{
				id: "/api/creators/[id]/follow",
				pattern: /^\/api\/creators\/([^/]+?)\/follow\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-b1d1rOHF.js'))
			},
			{
				id: "/api/creators/[id]/page",
				pattern: /^\/api\/creators\/([^/]+?)\/page\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-UfCdnWm6.js'))
			},
			{
				id: "/api/creator/analytics",
				pattern: /^\/api\/creator\/analytics\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-dBfO4NkD.js'))
			},
			{
				id: "/api/creator/analytics/stream",
				pattern: /^\/api\/creator\/analytics\/stream\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-urkweQc9.js'))
			},
			{
				id: "/api/creator/application",
				pattern: /^\/api\/creator\/application\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DkvgkOIr.js'))
			},
			{
				id: "/api/creator/content",
				pattern: /^\/api\/creator\/content\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CVnQLOZ-.js'))
			},
			{
				id: "/api/creator/content/bulk",
				pattern: /^\/api\/creator\/content\/bulk\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-B_ZRV7dm.js'))
			},
			{
				id: "/api/creator/content/lookup",
				pattern: /^\/api\/creator\/content\/lookup\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CsXdkVC4.js'))
			},
			{
				id: "/api/creator/content/search",
				pattern: /^\/api\/creator\/content\/search\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-C9x7RqIn.js'))
			},
			{
				id: "/api/creator/content/[id]",
				pattern: /^\/api\/creator\/content\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Can6P0u3.js'))
			},
			{
				id: "/api/creator/content/[id]/duplicate",
				pattern: /^\/api\/creator\/content\/([^/]+?)\/duplicate\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CqApMBUS.js'))
			},
			{
				id: "/api/creator/content/[id]/episodes",
				pattern: /^\/api\/creator\/content\/([^/]+?)\/episodes\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CEmNfxk6.js'))
			},
			{
				id: "/api/creator/content/[id]/episodes/[episodeId]",
				pattern: /^\/api\/creator\/content\/([^/]+?)\/episodes\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false},{"name":"episodeId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BecrF-kP.js'))
			},
			{
				id: "/api/creator/content/[id]/pricing",
				pattern: /^\/api\/creator\/content\/([^/]+?)\/pricing\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-B-smwlGO.js'))
			},
			{
				id: "/api/creator/content/[id]/subtitles",
				pattern: /^\/api\/creator\/content\/([^/]+?)\/subtitles\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Dm-Mncvb.js'))
			},
			{
				id: "/api/creator/content/[id]/subtitles/[trackId]",
				pattern: /^\/api\/creator\/content\/([^/]+?)\/subtitles\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false},{"name":"trackId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DKtrjpOP.js'))
			},
			{
				id: "/api/creator/content/[id]/thread",
				pattern: /^\/api\/creator\/content\/([^/]+?)\/thread\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DLQb3PkW.js'))
			},
			{
				id: "/api/creator/content/[id]/thread/stream",
				pattern: /^\/api\/creator\/content\/([^/]+?)\/thread\/stream\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DXTNDmpB.js'))
			},
			{
				id: "/api/creator/content/[id]/thumbnails",
				pattern: /^\/api\/creator\/content\/([^/]+?)\/thumbnails\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CCPO5eLP.js'))
			},
			{
				id: "/api/creator/content/[id]/thumbnails/[vid]",
				pattern: /^\/api\/creator\/content\/([^/]+?)\/thumbnails\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false},{"name":"vid","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BpydJyXb.js'))
			},
			{
				id: "/api/creator/content/[id]/thumbnails/[vid]/promote",
				pattern: /^\/api\/creator\/content\/([^/]+?)\/thumbnails\/([^/]+?)\/promote\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false},{"name":"vid","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BMVTjpN4.js'))
			},
			{
				id: "/api/creator/earnings",
				pattern: /^\/api\/creator\/earnings\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DLCXC_uD.js'))
			},
			{
				id: "/api/creator/encoder-stream",
				pattern: /^\/api\/creator\/encoder-stream\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DvuyPL2F.js'))
			},
			{
				id: "/api/creator/in-flight-encodes",
				pattern: /^\/api\/creator\/in-flight-encodes\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BS43h5hw.js'))
			},
			{
				id: "/api/creator/live",
				pattern: /^\/api\/creator\/live\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CZ0CyNbT.js'))
			},
			{
				id: "/api/creator/live/[id]",
				pattern: /^\/api\/creator\/live\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-gRQuI8sR.js'))
			},
			{
				id: "/api/creator/messages",
				pattern: /^\/api\/creator\/messages\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-GyBa1Or8.js'))
			},
			{
				id: "/api/creator/messages/bulk",
				pattern: /^\/api\/creator\/messages\/bulk\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Cm_8Mh0u.js'))
			},
			{
				id: "/api/creator/messages/[id]/archive",
				pattern: /^\/api\/creator\/messages\/([^/]+?)\/archive\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-ChG98U6O.js'))
			},
			{
				id: "/api/creator/messages/[id]/read",
				pattern: /^\/api\/creator\/messages\/([^/]+?)\/read\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DyVswW21.js'))
			},
			{
				id: "/api/creator/moderation/forum",
				pattern: /^\/api\/creator\/moderation\/forum\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-MSEFPCUV.js'))
			},
			{
				id: "/api/creator/moderation/forum/replies/[id]",
				pattern: /^\/api\/creator\/moderation\/forum\/replies\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-G7focL1m.js'))
			},
			{
				id: "/api/creator/moderation/forum/threads/[id]",
				pattern: /^\/api\/creator\/moderation\/forum\/threads\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BN7rEz6h.js'))
			},
			{
				id: "/api/creator/moderation/reviews",
				pattern: /^\/api\/creator\/moderation\/reviews\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-l8nLo64p.js'))
			},
			{
				id: "/api/creator/moderation/reviews/[id]",
				pattern: /^\/api\/creator\/moderation\/reviews\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CTPTM8av.js'))
			},
			{
				id: "/api/creator/newsletter/subscribe",
				pattern: /^\/api\/creator\/newsletter\/subscribe\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DO3VEOEm.js'))
			},
			{
				id: "/api/creator/payment-preferences",
				pattern: /^\/api\/creator\/payment-preferences\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CrCBHeiR.js'))
			},
			{
				id: "/api/creator/payouts/method",
				pattern: /^\/api\/creator\/payouts\/method\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-b1Wt5E0U.js'))
			},
			{
				id: "/api/creator/payouts/stripe/onboard",
				pattern: /^\/api\/creator\/payouts\/stripe\/onboard\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-B5hllDHi.js'))
			},
			{
				id: "/api/creator/payouts/stripe/status",
				pattern: /^\/api\/creator\/payouts\/stripe\/status\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CVzyivVI.js'))
			},
			{
				id: "/api/creator/people/lookup",
				pattern: /^\/api\/creator\/people\/lookup\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-UOrBKyxC.js'))
			},
			{
				id: "/api/creator/profile",
				pattern: /^\/api\/creator\/profile\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CuypIfIo.js'))
			},
			{
				id: "/api/creator/stats",
				pattern: /^\/api\/creator\/stats\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-B99Mjl_w.js'))
			},
			{
				id: "/api/creator/tax-1099-forms",
				pattern: /^\/api\/creator\/tax-1099-forms\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-usg6RgXN.js'))
			},
			{
				id: "/api/creator/tax-forms",
				pattern: /^\/api\/creator\/tax-forms\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-hihswnat.js'))
			},
			{
				id: "/api/creator/trailer-upload/commit",
				pattern: /^\/api\/creator\/trailer-upload\/commit\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CqqbbZY6.js'))
			},
			{
				id: "/api/creator/trailer-upload/sign",
				pattern: /^\/api\/creator\/trailer-upload\/sign\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BkztrIkh.js'))
			},
			{
				id: "/api/cron/ab-auto-promote",
				pattern: /^\/api\/cron\/ab-auto-promote\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BERY5xGM.js'))
			},
			{
				id: "/api/cron/agents/[name]",
				pattern: /^\/api\/cron\/agents\/([^/]+?)\/?$/,
				params: [{"name":"name","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-ScYrgTcb.js'))
			},
			{
				id: "/api/cron/analytics-rollup",
				pattern: /^\/api\/cron\/analytics-rollup\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Cmj06nBq.js'))
			},
			{
				id: "/api/cron/creator-payouts",
				pattern: /^\/api\/cron\/creator-payouts\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DHMeZ6k7.js'))
			},
			{
				id: "/api/cron/event-status-sweep",
				pattern: /^\/api\/cron\/event-status-sweep\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-kCnWcaqQ.js'))
			},
			{
				id: "/api/cron/meilisearch-reindex",
				pattern: /^\/api\/cron\/meilisearch-reindex\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CLPYugDp.js'))
			},
			{
				id: "/api/cron/newsletter-weekly-digest",
				pattern: /^\/api\/cron\/newsletter-weekly-digest\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BsME5o0H.js'))
			},
			{
				id: "/api/cron/payout-reserve",
				pattern: /^\/api\/cron\/payout-reserve\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CPPq3Vv-.js'))
			},
			{
				id: "/api/cron/promo-rollup",
				pattern: /^\/api\/cron\/promo-rollup\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Bx3oH4u-.js'))
			},
			{
				id: "/api/cron/renew-subscriptions",
				pattern: /^\/api\/cron\/renew-subscriptions\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CzMUoNLr.js'))
			},
			{
				id: "/api/cron/scheduled-publish",
				pattern: /^\/api\/cron\/scheduled-publish\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BTPb1R63.js'))
			},
			{
				id: "/api/cron/settlement-reconcile",
				pattern: /^\/api\/cron\/settlement-reconcile\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DuOtSrxV.js'))
			},
			{
				id: "/api/cron/staking-indexer",
				pattern: /^\/api\/cron\/staking-indexer\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-D60-OVE4.js'))
			},
			{
				id: "/api/cron/stc-settle",
				pattern: /^\/api\/cron\/stc-settle\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CjmMPUhJ.js'))
			},
			{
				id: "/api/cron/tax-1099-generate",
				pattern: /^\/api\/cron\/tax-1099-generate\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-D8aHe9eI.js'))
			},
			{
				id: "/api/downloads/manifest/[id]",
				pattern: /^\/api\/downloads\/manifest\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-D4tJoMwe.js'))
			},
			{
				id: "/api/encoder/jobs",
				pattern: /^\/api\/encoder\/jobs\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-C_H5TSSX.js'))
			},
			{
				id: "/api/encoder/jobs/[jobId]",
				pattern: /^\/api\/encoder\/jobs\/([^/]+?)\/?$/,
				params: [{"name":"jobId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DCmJKIVi.js'))
			},
			{
				id: "/api/encoder/jobs/[jobId]/commit",
				pattern: /^\/api\/encoder\/jobs\/([^/]+?)\/commit\/?$/,
				params: [{"name":"jobId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-L-K4HhTd.js'))
			},
			{
				id: "/api/encoder/jobs/[jobId]/playback",
				pattern: /^\/api\/encoder\/jobs\/([^/]+?)\/playback\/?$/,
				params: [{"name":"jobId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-9DTjezEh.js'))
			},
			{
				id: "/api/encoder/live-finalize",
				pattern: /^\/api\/encoder\/live-finalize\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-D0s6nIFt.js'))
			},
			{
				id: "/api/encoder/live-state",
				pattern: /^\/api\/encoder\/live-state\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Bxddj9XM.js'))
			},
			{
				id: "/api/encoder/live-state/validate",
				pattern: /^\/api\/encoder\/live-state\/validate\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-D-J1oQby.js'))
			},
			{
				id: "/api/encoder/pending",
				pattern: /^\/api\/encoder\/pending\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CdcHsei4.js'))
			},
			{
				id: "/api/encoder/presigned",
				pattern: /^\/api\/encoder\/presigned\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-ChsrqG5T.js'))
			},
			{
				id: "/api/encoder/process",
				pattern: /^\/api\/encoder\/process\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CwgZa7mh.js'))
			},
			{
				id: "/api/encoder/ready",
				pattern: /^\/api\/encoder\/ready\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-C175txBo.js'))
			},
			{
				id: "/api/encoder/scan-ready",
				pattern: /^\/api\/encoder\/scan-ready\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DHlfSvT6.js'))
			},
			{
				id: "/api/encoder/webhook",
				pattern: /^\/api\/encoder\/webhook\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CruYUQUC.js'))
			},
			{
				id: "/api/events",
				pattern: /^\/api\/events\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-0xtZo7yE.js'))
			},
			{
				id: "/api/events/feed.ics",
				pattern: /^\/api\/events\/feed\.ics\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DsDfP_S2.js'))
			},
			{
				id: "/api/events/[id]",
				pattern: /^\/api\/events\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-D2gvevxE.js'))
			},
			{
				id: "/api/events/[id]/register",
				pattern: /^\/api\/events\/([^/]+?)\/register\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-ICR2SSKx.js'))
			},
			{
				id: "/api/files",
				pattern: /^\/api\/files\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BPTaomtA.js'))
			},
			{
				id: "/api/files/commit",
				pattern: /^\/api\/files\/commit\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BtWtTjP6.js'))
			},
			{
				id: "/api/files/sign",
				pattern: /^\/api\/files\/sign\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-YTPWml86.js'))
			},
			{
				id: "/api/forum/replies/[id]",
				pattern: /^\/api\/forum\/replies\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-aAKBasI7.js'))
			},
			{
				id: "/api/forum/replies/[id]/like",
				pattern: /^\/api\/forum\/replies\/([^/]+?)\/like\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Ba4TsAib.js'))
			},
			{
				id: "/api/forum/threads",
				pattern: /^\/api\/forum\/threads\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DH7ZNhIi.js'))
			},
			{
				id: "/api/forum/threads/[id]",
				pattern: /^\/api\/forum\/threads\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BpZY7Xv2.js'))
			},
			{
				id: "/api/forum/threads/[id]/like",
				pattern: /^\/api\/forum\/threads\/([^/]+?)\/like\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CZKMPkqh.js'))
			},
			{
				id: "/api/forum/threads/[id]/replies",
				pattern: /^\/api\/forum\/threads\/([^/]+?)\/replies\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DKddk7Vx.js'))
			},
			{
				id: "/api/health",
				pattern: /^\/api\/health\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CGTdygHI.js'))
			},
			{
				id: "/api/home",
				pattern: /^\/api\/home\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DTGXDJwY.js'))
			},
			{
				id: "/api/internal/refunds/sweep-pending",
				pattern: /^\/api\/internal\/refunds\/sweep-pending\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BYYXZ5qd.js'))
			},
			{
				id: "/api/kids/quiz/generate",
				pattern: /^\/api\/kids\/quiz\/generate\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Dz5mhAMc.js'))
			},
			{
				id: "/api/kids/quiz/submit",
				pattern: /^\/api\/kids\/quiz\/submit\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DgnDRqxQ.js'))
			},
			{
				id: "/api/live/[streamId]/chat",
				pattern: /^\/api\/live\/([^/]+?)\/chat\/?$/,
				params: [{"name":"streamId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-36G9TjjS.js'))
			},
			{
				id: "/api/live/[streamId]/chat/stream",
				pattern: /^\/api\/live\/([^/]+?)\/chat\/stream\/?$/,
				params: [{"name":"streamId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CCyJvQWA.js'))
			},
			{
				id: "/api/live/[streamId]/chat/[messageId]",
				pattern: /^\/api\/live\/([^/]+?)\/chat\/([^/]+?)\/?$/,
				params: [{"name":"streamId","optional":false,"rest":false,"chained":false},{"name":"messageId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DjeE8d0h.js'))
			},
			{
				id: "/api/milestones",
				pattern: /^\/api\/milestones\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-D7KIhgAi.js'))
			},
			{
				id: "/api/my-list/[contentId]",
				pattern: /^\/api\/my-list\/([^/]+?)\/?$/,
				params: [{"name":"contentId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Ckcvm_U3.js'))
			},
			{
				id: "/api/notifications",
				pattern: /^\/api\/notifications\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BtFieT08.js'))
			},
			{
				id: "/api/notifications/preferences",
				pattern: /^\/api\/notifications\/preferences\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Bg1MgXWJ.js'))
			},
			{
				id: "/api/notifications/[id]",
				pattern: /^\/api\/notifications\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CPgK24sI.js'))
			},
			{
				id: "/api/notifications/[id]/read",
				pattern: /^\/api\/notifications\/([^/]+?)\/read\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Cirg892F.js'))
			},
			{
				id: "/api/parental/report",
				pattern: /^\/api\/parental\/report\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-MuDanB31.js'))
			},
			{
				id: "/api/payment/initialize",
				pattern: /^\/api\/payment\/initialize\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-D1mnnKBE.js'))
			},
			{
				id: "/api/payment/verify",
				pattern: /^\/api\/payment\/verify\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DbzQxAKZ.js'))
			},
			{
				id: "/api/payment/webhook",
				pattern: /^\/api\/payment\/webhook\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-B6dTUz3G.js'))
			},
			{
				id: "/api/platform-settings",
				pattern: /^\/api\/platform-settings\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BU3ctOwM.js'))
			},
			{
				id: "/api/playback/live/[id]",
				pattern: /^\/api\/playback\/live\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-wOuVYCtk.js'))
			},
			{
				id: "/api/playback/[id]",
				pattern: /^\/api\/playback\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Dn5d2_KV.js'))
			},
			{
				id: "/api/playlists",
				pattern: /^\/api\/playlists\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CqI9vYxF.js'))
			},
			{
				id: "/api/playlists/[id]/items",
				pattern: /^\/api\/playlists\/([^/]+?)\/items\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-QwQsFds0.js'))
			},
			{
				id: "/api/ppv/check-access/[contentId]",
				pattern: /^\/api\/ppv\/check-access\/([^/]+?)\/?$/,
				params: [{"name":"contentId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BbuGQbCH.js'))
			},
			{
				id: "/api/ppv/purchase",
				pattern: /^\/api\/ppv\/purchase\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DT3TLoIz.js'))
			},
			{
				id: "/api/ppv/refund",
				pattern: /^\/api\/ppv\/refund\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DBnrT-qW.js'))
			},
			{
				id: "/api/profiles",
				pattern: /^\/api\/profiles\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-C_8bixX0.js'))
			},
			{
				id: "/api/profiles/current",
				pattern: /^\/api\/profiles\/current\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DzuoHoku.js'))
			},
			{
				id: "/api/profiles/overview",
				pattern: /^\/api\/profiles\/overview\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-K7EYuDA3.js'))
			},
			{
				id: "/api/profiles/[id]",
				pattern: /^\/api\/profiles\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Dluo7RyT.js'))
			},
			{
				id: "/api/profiles/[id]/pin",
				pattern: /^\/api\/profiles\/([^/]+?)\/pin\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DSXWu7Um.js'))
			},
			{
				id: "/api/promo/decision",
				pattern: /^\/api\/promo\/decision\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-xkpmmw9-.js'))
			},
			{
				id: "/api/promo/e",
				pattern: /^\/api\/promo\/e\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-S4llnZ-i.js'))
			},
			{
				id: "/api/promo/plan",
				pattern: /^\/api\/promo\/plan\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CwrtVKDa.js'))
			},
			{
				id: "/api/promo/vast-tag",
				pattern: /^\/api\/promo\/vast-tag\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-D1OiUa9h.js'))
			},
			{
				id: "/api/push/subscribe",
				pattern: /^\/api\/push\/subscribe\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DWH-_WSd.js'))
			},
			{
				id: "/api/recommendations",
				pattern: /^\/api\/recommendations\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Cnr0B96f.js'))
			},
			{
				id: "/api/reports",
				pattern: /^\/api\/reports\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-C81VIISU.js'))
			},
			{
				id: "/api/reviews",
				pattern: /^\/api\/reviews\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-B3c-R1rb.js'))
			},
			{
				id: "/api/reviews/[id]/helpful",
				pattern: /^\/api\/reviews\/([^/]+?)\/helpful\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-C0OarQYe.js'))
			},
			{
				id: "/api/search",
				pattern: /^\/api\/search\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-lyr0GvNB.js'))
			},
			{
				id: "/api/shares",
				pattern: /^\/api\/shares\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-B-ZGrEjp.js'))
			},
			{
				id: "/api/sponsorships",
				pattern: /^\/api\/sponsorships\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DGtUh8vn.js'))
			},
			{
				id: "/api/subscriptions/add-family",
				pattern: /^\/api\/subscriptions\/add-family\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BSL0f2He.js'))
			},
			{
				id: "/api/subscriptions/cancel",
				pattern: /^\/api\/subscriptions\/cancel\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-V6BKHWy9.js'))
			},
			{
				id: "/api/subscriptions/change-plan",
				pattern: /^\/api\/subscriptions\/change-plan\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DQUzjg4W.js'))
			},
			{
				id: "/api/subscriptions/send-otp",
				pattern: /^\/api\/subscriptions\/send-otp\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CYJJnUMB.js'))
			},
			{
				id: "/api/subscriptions/start-free",
				pattern: /^\/api\/subscriptions\/start-free\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BlBLuzf4.js'))
			},
			{
				id: "/api/subscriptions/start-trial",
				pattern: /^\/api\/subscriptions\/start-trial\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BKnb_0wE.js'))
			},
			{
				id: "/api/subscriptions/status",
				pattern: /^\/api\/subscriptions\/status\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CSSt7rEm.js'))
			},
			{
				id: "/api/success-stories",
				pattern: /^\/api\/success-stories\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CKoTy4Rx.js'))
			},
			{
				id: "/api/support/tickets",
				pattern: /^\/api\/support\/tickets\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-e0PjMMWh.js'))
			},
			{
				id: "/api/users",
				pattern: /^\/api\/users\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Vj5gAds3.js'))
			},
			{
				id: "/api/users/me/auth-providers",
				pattern: /^\/api\/users\/me\/auth-providers\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Ct4LV37H.js'))
			},
			{
				id: "/api/users/me/stc-balance",
				pattern: /^\/api\/users\/me\/stc-balance\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CTRVbkfI.js'))
			},
			{
				id: "/api/users/me/stc-claim",
				pattern: /^\/api\/users\/me\/stc-claim\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BUkjKWKy.js'))
			},
			{
				id: "/api/users/[id]",
				pattern: /^\/api\/users\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-nfa63y7T.js'))
			},
			{
				id: "/api/user/profile",
				pattern: /^\/api\/user\/profile\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DExtWypU.js'))
			},
			{
				id: "/api/watch/active",
				pattern: /^\/api\/watch\/active\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-B0Lr4dZQ.js'))
			},
			{
				id: "/api/watch/history",
				pattern: /^\/api\/watch\/history\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BWrnL2Iv.js'))
			},
			{
				id: "/api/watch/live/[id]/stream",
				pattern: /^\/api\/watch\/live\/([^/]+?)\/stream\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-w5a8K1AC.js'))
			},
			{
				id: "/api/watch/mark/[contentId]",
				pattern: /^\/api\/watch\/mark\/([^/]+?)\/?$/,
				params: [{"name":"contentId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Dqqi-C0j.js'))
			},
			{
				id: "/api/watch/progress",
				pattern: /^\/api\/watch\/progress\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-qBiY4_RI.js'))
			},
			{
				id: "/api/watch/telemetry",
				pattern: /^\/api\/watch\/telemetry\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DMo2a3mO.js'))
			},
			{
				id: "/api/watch/[videoId]",
				pattern: /^\/api\/watch\/([^/]+?)\/?$/,
				params: [{"name":"videoId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BuiDBKo6.js'))
			},
			{
				id: "/api/webhooks/stripe",
				pattern: /^\/api\/webhooks\/stripe\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Rw-0395c.js'))
			},
			{
				id: "/(app)/apply/creator",
				pattern: /^\/apply\/creator\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 46 },
				endpoint: null
			},
			{
				id: "/(auth)/auth/forget-password",
				pattern: /^\/auth\/forget-password\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,,], leaf: 77 },
				endpoint: null
			},
			{
				id: "/(auth)/auth/forget-password/success",
				pattern: /^\/auth\/forget-password\/success\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,,], leaf: 78 },
				endpoint: null
			},
			{
				id: "/(auth)/auth/login",
				pattern: /^\/auth\/login\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,,], leaf: 79 },
				endpoint: null
			},
			{
				id: "/(auth)/auth/register",
				pattern: /^\/auth\/register\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,,], leaf: 80 },
				endpoint: null
			},
			{
				id: "/(auth)/auth/reset-password",
				pattern: /^\/auth\/reset-password\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,,], leaf: 81 },
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
				id: "/(app)/coming-soon",
				pattern: /^\/coming-soon\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 50 },
				endpoint: null
			},
			{
				id: "/(app)/contact",
				pattern: /^\/contact\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 51 },
				endpoint: null
			},
			{
				id: "/(app)/creators/[id]",
				pattern: /^\/creators\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,3,], errors: [1,,], leaf: 52 },
				endpoint: null
			},
			{
				id: "/(creator)/creator",
				pattern: /^\/creator\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 82 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/agreement",
				pattern: /^\/creator\/agreement\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 83 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/analytics-help",
				pattern: /^\/creator\/analytics-help\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 85 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/analytics",
				pattern: /^\/creator\/analytics\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 84 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/best-practices",
				pattern: /^\/creator\/best-practices\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 86 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/content",
				pattern: /^\/creator\/content\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 87 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/content/[id]",
				pattern: /^\/creator\/content\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,5,], errors: [1,,], leaf: 88 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/content/[id]/episodes",
				pattern: /^\/creator\/content\/([^/]+?)\/episodes\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,5,], errors: [1,,], leaf: 89 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/copyright",
				pattern: /^\/creator\/copyright\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 90 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/earnings",
				pattern: /^\/creator\/earnings\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 91 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/earnings/tax-forms",
				pattern: /^\/creator\/earnings\/tax-forms\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 92 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/events",
				pattern: /^\/creator\/events\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 93 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/forum",
				pattern: /^\/creator\/forum\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 94 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/forum/new",
				pattern: /^\/creator\/forum\/new\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 95 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/forum/[id]",
				pattern: /^\/creator\/forum\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,5,], errors: [1,,], leaf: 96 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/guidelines",
				pattern: /^\/creator\/guidelines\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 97 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/inbox",
				pattern: /^\/creator\/inbox\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 98 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/live",
				pattern: /^\/creator\/live\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 99 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/moderation",
				pattern: /^\/creator\/moderation\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 100 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/newsletter",
				pattern: /^\/creator\/newsletter\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 101 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/profile",
				pattern: /^\/creator\/profile\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 102 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/success-stories",
				pattern: /^\/creator\/success-stories\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 103 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/support",
				pattern: /^\/creator\/support\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 104 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/tech-support",
				pattern: /^\/creator\/tech-support\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 105 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/test",
				pattern: /^\/creator\/test\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 106 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/upload",
				pattern: /^\/creator\/upload\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 107 },
				endpoint: null
			},
			{
				id: "/(protected)/dashboard",
				pattern: /^\/dashboard\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 109 },
				endpoint: null
			},
			{
				id: "/(app)/device-support",
				pattern: /^\/device-support\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 53 },
				endpoint: null
			},
			{
				id: "/(app)/documentaries",
				pattern: /^\/documentaries\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 54 },
				endpoint: null
			},
			{
				id: "/(app)/documentaries/[slug]",
				pattern: /^\/documentaries\/([^/]+?)\/?$/,
				params: [{"name":"slug","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,3,], errors: [1,,], leaf: 55 },
				endpoint: null
			},
			{
				id: "/(protected)/documentation",
				pattern: /^\/documentation\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 110 },
				endpoint: null
			},
			{
				id: "/(app)/exchange",
				pattern: /^\/exchange\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 56 },
				endpoint: null
			},
			{
				id: "/(app)/faq",
				pattern: /^\/faq\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 57 },
				endpoint: null
			},
			{
				id: "/(app)/features",
				pattern: /^\/features\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 58 },
				endpoint: null
			},
			{
				id: "/(app)/guidelines",
				pattern: /^\/guidelines\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 59 },
				endpoint: null
			},
			{
				id: "/(app)/help",
				pattern: /^\/help\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 60 },
				endpoint: null
			},
			{
				id: "/kids",
				pattern: /^\/kids\/?$/,
				params: [],
				page: { layouts: [0,8,], errors: [1,,], leaf: 121 },
				endpoint: null
			},
			{
				id: "/kids/kiddies",
				pattern: /^\/kids\/kiddies\/?$/,
				params: [],
				page: { layouts: [0,9,], errors: [1,,], leaf: 122 },
				endpoint: null
			},
			{
				id: "/kids/kiddies/bible-quiz",
				pattern: /^\/kids\/kiddies\/bible-quiz\/?$/,
				params: [],
				page: { layouts: [0,9,], errors: [1,,], leaf: 123 },
				endpoint: null
			},
			{
				id: "/kids/kiddies/documentaries",
				pattern: /^\/kids\/kiddies\/documentaries\/?$/,
				params: [],
				page: { layouts: [0,9,], errors: [1,,], leaf: 124 },
				endpoint: null
			},
			{
				id: "/kids/kiddies/movies",
				pattern: /^\/kids\/kiddies\/movies\/?$/,
				params: [],
				page: { layouts: [0,9,], errors: [1,,], leaf: 125 },
				endpoint: null
			},
			{
				id: "/kids/kiddies/profile",
				pattern: /^\/kids\/kiddies\/profile\/?$/,
				params: [],
				page: { layouts: [0,9,], errors: [1,,], leaf: 126 },
				endpoint: null
			},
			{
				id: "/kids/kiddies/shows",
				pattern: /^\/kids\/kiddies\/shows\/?$/,
				params: [],
				page: { layouts: [0,9,], errors: [1,,], leaf: 127 },
				endpoint: null
			},
			{
				id: "/kids/kiddies/[slug]",
				pattern: /^\/kids\/kiddies\/([^/]+?)\/?$/,
				params: [{"name":"slug","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,9,], errors: [1,,], leaf: 128 },
				endpoint: null
			},
			{
				id: "/kids/teens",
				pattern: /^\/kids\/teens\/?$/,
				params: [],
				page: { layouts: [0,8,], errors: [1,,], leaf: 129 },
				endpoint: null
			},
			{
				id: "/kids/teens/[slug]",
				pattern: /^\/kids\/teens\/([^/]+?)\/?$/,
				params: [{"name":"slug","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,8,], errors: [1,,], leaf: 130 },
				endpoint: null
			},
			{
				id: "/(app)/liquidity",
				pattern: /^\/liquidity\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 61 },
				endpoint: null
			},
			{
				id: "/(protected)/milestones",
				pattern: /^\/milestones\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 111 },
				endpoint: null
			},
			{
				id: "/(app)/movies",
				pattern: /^\/movies\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 62 },
				endpoint: null
			},
			{
				id: "/(app)/movies/[slug]",
				pattern: /^\/movies\/([^/]+?)\/?$/,
				params: [{"name":"slug","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,3,], errors: [1,,], leaf: 63 },
				endpoint: null
			},
			{
				id: "/(app)/my-studios",
				pattern: /^\/my-studios\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 64 },
				endpoint: null
			},
			{
				id: "/(app)/offline",
				pattern: /^\/offline\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 65 },
				endpoint: null
			},
			{
				id: "/(protected)/parental-controls",
				pattern: /^\/parental-controls\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 112 },
				endpoint: null
			},
			{
				id: "/(app)/plans",
				pattern: /^\/plans\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 66 },
				endpoint: __memo(() => import('./abis-D6BRqEOc.js').then(function (n) { return n._; }))
			},
			{
				id: "/(app)/press",
				pattern: /^\/press\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 67 },
				endpoint: null
			},
			{
				id: "/(app)/privacy",
				pattern: /^\/privacy\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 68 },
				endpoint: null
			},
			{
				id: "/(protected)/profiles",
				pattern: /^\/profiles\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 114 },
				endpoint: null
			},
			{
				id: "/(protected)/profile",
				pattern: /^\/profile\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 113 },
				endpoint: null
			},
			{
				id: "/(app)/search",
				pattern: /^\/search\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 69 },
				endpoint: null
			},
			{
				id: "/(protected)/settings",
				pattern: /^\/settings\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 115 },
				endpoint: null
			},
			{
				id: "/(app)/shows",
				pattern: /^\/shows\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 70 },
				endpoint: null
			},
			{
				id: "/(app)/shows/[slug]",
				pattern: /^\/shows\/([^/]+?)\/?$/,
				params: [{"name":"slug","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,3,], errors: [1,,], leaf: 71 },
				endpoint: null
			},
			{
				id: "/sitemap.xml",
				pattern: /^\/sitemap\.xml\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-C4AB6K1M.js'))
			},
			{
				id: "/(app)/sponsorships",
				pattern: /^\/sponsorships\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 72 },
				endpoint: null
			},
			{
				id: "/(app)/staking",
				pattern: /^\/staking\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 73 },
				endpoint: null
			},
			{
				id: "/(web3)/subscription",
				pattern: /^\/subscription\/?$/,
				params: [],
				page: { layouts: [0,7,], errors: [1,,], leaf: 118 },
				endpoint: null
			},
			{
				id: "/(app)/terms",
				pattern: /^\/terms\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 74 },
				endpoint: null
			},
			{
				id: "/(web3)/tokens",
				pattern: /^\/tokens\/?$/,
				params: [],
				page: { layouts: [0,7,], errors: [1,,], leaf: 119 },
				endpoint: null
			},
			{
				id: "/(app)/token",
				pattern: /^\/token\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 75 },
				endpoint: null
			},
			{
				id: "/(protected)/users",
				pattern: /^\/users\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 116 },
				endpoint: null
			},
			{
				id: "/(web3)/wallet",
				pattern: /^\/wallet\/?$/,
				params: [],
				page: { layouts: [0,7,], errors: [1,,], leaf: 120 },
				endpoint: null
			},
			{
				id: "/(protected)/watchlist",
				pattern: /^\/watchlist\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 117 },
				endpoint: null
			},
			{
				id: "/watch/live/[id]",
				pattern: /^\/watch\/live\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 131 },
				endpoint: null
			},
			{
				id: "/watch/[id]",
				pattern: /^\/watch\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 132 },
				endpoint: null
			},
			{
				id: "/(app)/webinars",
				pattern: /^\/webinars\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 76 },
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

export { manifest as m };
//# sourceMappingURL=manifest.js-C_suNb1m.js.map
