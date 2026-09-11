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
		client: {start:"_app/immutable/entry/start.Cs_NrVXg.js",app:"_app/immutable/entry/app.DmGDHpBC.js",imports:["_app/immutable/entry/start.Cs_NrVXg.js","_app/immutable/chunks/Jzq66i-T.js","_app/immutable/chunks/BsVwIFTV.js","_app/immutable/chunks/QTnfLwEv.js","_app/immutable/chunks/BuFlayix.js","_app/immutable/chunks/Bc9cMxm7.js","_app/immutable/entry/app.DmGDHpBC.js","_app/immutable/chunks/BsVwIFTV.js","_app/immutable/chunks/QTnfLwEv.js","_app/immutable/chunks/HclGiUj8.js"],stylesheets:["_app/immutable/assets/ui-libs.C1tyNZCz.css","_app/immutable/assets/ui-libs.C1tyNZCz.css"],fonts:[],uses_env_dynamic_public:true},
		nodes: [
			__memo(() => import('./0-DmIyMuCX.js')),
			__memo(() => import('./1-D8-u-dfa.js')),
			__memo(() => import('./2-XyONWlw0.js')),
			__memo(() => import('./3-BxIew2a3.js')),
			__memo(() => import('./4-CbcsTp3w.js')),
			__memo(() => import('./5-D9fM34_B.js')),
			__memo(() => import('./6-bz0ORX0N.js')),
			__memo(() => import('./7-DXsQUZ3A.js')),
			__memo(() => import('./8-B20NuewQ.js')),
			__memo(() => import('./9-BXrsGMl8.js')),
			__memo(() => import('./10-CPkXFawy.js')),
			__memo(() => import('./11-CeJa1_k9.js')),
			__memo(() => import('./12-BrKHw46m.js')),
			__memo(() => import('./13-BHl3c-7e.js')),
			__memo(() => import('./14-xmKTynfX.js')),
			__memo(() => import('./15-B1HSSfZf.js')),
			__memo(() => import('./16-CftRPuvw.js')),
			__memo(() => import('./17-C13aSJQu.js')),
			__memo(() => import('./18-BwLk9VWq.js')),
			__memo(() => import('./19-C5HzX7YB.js')),
			__memo(() => import('./20-BpXpof8w.js')),
			__memo(() => import('./21-BpqSSB4b.js')),
			__memo(() => import('./22-DUprjzte.js')),
			__memo(() => import('./23-BbqvTHQD.js')),
			__memo(() => import('./24-VuXrxOBE.js')),
			__memo(() => import('./25-C721s4J9.js')),
			__memo(() => import('./26-BzkEQsUZ.js')),
			__memo(() => import('./27-KzzstWN4.js')),
			__memo(() => import('./28-B8GXthTJ.js')),
			__memo(() => import('./29-DZrfSA3k.js')),
			__memo(() => import('./30-CbwhOmnv.js')),
			__memo(() => import('./31-DzM7QPTc.js')),
			__memo(() => import('./32-C0UDIcGu.js')),
			__memo(() => import('./33-CGvdl-eI.js')),
			__memo(() => import('./34-tF0bZuCG.js')),
			__memo(() => import('./35-CYoEpp7M.js')),
			__memo(() => import('./36-C6zzKd0e.js')),
			__memo(() => import('./37-BFVmwd0_.js')),
			__memo(() => import('./38-Uhd-rML9.js')),
			__memo(() => import('./39-B_jNMl0g.js')),
			__memo(() => import('./40-zWpjQMj7.js')),
			__memo(() => import('./41-gj9WPKkg.js')),
			__memo(() => import('./42-Bxcle9hr.js')),
			__memo(() => import('./43-Cm-A70DP.js')),
			__memo(() => import('./44-DYXKY1Us.js')),
			__memo(() => import('./45-3gRZde4C.js')),
			__memo(() => import('./46-xFZyC-ST.js')),
			__memo(() => import('./47-C5wTM2I7.js')),
			__memo(() => import('./48-Kg-3IMWS.js')),
			__memo(() => import('./49-CRT5ljlh.js')),
			__memo(() => import('./50-D2gSNej2.js')),
			__memo(() => import('./51-DFPsVyjS.js')),
			__memo(() => import('./52-RbI_jkls.js')),
			__memo(() => import('./53-BQL45cQj.js')),
			__memo(() => import('./54-8l2oxm4S.js')),
			__memo(() => import('./55-Bv6Fw7QU.js')),
			__memo(() => import('./56-CiQOZ6hb.js')),
			__memo(() => import('./57-B_SmB0oR.js')),
			__memo(() => import('./58-Q9YloiPI.js')),
			__memo(() => import('./59-CfzGerlq.js')),
			__memo(() => import('./60-DFV72Lww.js')),
			__memo(() => import('./61-uzlw0RVE.js')),
			__memo(() => import('./62-CqBUouWf.js')),
			__memo(() => import('./63-DQIsBgIF.js')),
			__memo(() => import('./64-CIeSSpMX.js')),
			__memo(() => import('./65-DpeJkJCv.js')),
			__memo(() => import('./66-C0mLUAeW.js')),
			__memo(() => import('./67-CQyOTWao.js')),
			__memo(() => import('./68-CLIjkUkK.js')),
			__memo(() => import('./69-CZF-3KyX.js')),
			__memo(() => import('./70-M-6hlP4f.js')),
			__memo(() => import('./71-B7xykDFa.js')),
			__memo(() => import('./72-BZlmt_5d.js')),
			__memo(() => import('./73-nalPOB-g.js')),
			__memo(() => import('./74-BNBP4Uyx.js')),
			__memo(() => import('./75-D_B_4-xv.js')),
			__memo(() => import('./76-Cvx-8ms1.js')),
			__memo(() => import('./77-C128gExU.js')),
			__memo(() => import('./78-Dr0CzA3P.js')),
			__memo(() => import('./79-BpZ6Qz6p.js')),
			__memo(() => import('./80-BAEVjZam.js')),
			__memo(() => import('./81-SO_59oag.js')),
			__memo(() => import('./82-DVg9bd-B.js')),
			__memo(() => import('./83-nAViI-wM.js')),
			__memo(() => import('./84-BtJGWmzG.js')),
			__memo(() => import('./85-ex_Bts6H.js')),
			__memo(() => import('./86-BhHDUrK1.js')),
			__memo(() => import('./87-B_Y0KlJL.js')),
			__memo(() => import('./88-rxO1Gj7N.js')),
			__memo(() => import('./89-Ca2q8BKe.js')),
			__memo(() => import('./90-CAuJd9mJ.js')),
			__memo(() => import('./91-BM7YPHwX.js')),
			__memo(() => import('./92-Bge_tlaa.js')),
			__memo(() => import('./93-BuFIGn7n.js')),
			__memo(() => import('./94-D6169VZa.js')),
			__memo(() => import('./95-C5Tw2PQ_.js')),
			__memo(() => import('./96-DTmhWM2N.js')),
			__memo(() => import('./97-Dnpt3bzm.js')),
			__memo(() => import('./98-NGyns1zS.js')),
			__memo(() => import('./99-BWhvxlV3.js')),
			__memo(() => import('./100-Csn_9W0w.js')),
			__memo(() => import('./101-w7dJab3F.js')),
			__memo(() => import('./102-DQ1sz8mJ.js')),
			__memo(() => import('./103-BJTf5mZa.js')),
			__memo(() => import('./104-BcDoVZi_.js')),
			__memo(() => import('./105-DSlHR2pD.js')),
			__memo(() => import('./106-MblvYuFF.js')),
			__memo(() => import('./107-g2YNNZNs.js')),
			__memo(() => import('./108-yzWbq12C.js')),
			__memo(() => import('./109-Cu80yI0Y.js')),
			__memo(() => import('./110-Clo_Uies.js')),
			__memo(() => import('./111-CdwGdGXI.js')),
			__memo(() => import('./112-CeslfK9a.js')),
			__memo(() => import('./113-DGmFN1WZ.js')),
			__memo(() => import('./114-B37RAyR7.js')),
			__memo(() => import('./115--HrHssD0.js')),
			__memo(() => import('./116-BgFzheU2.js')),
			__memo(() => import('./117-DX1naGEb.js')),
			__memo(() => import('./118-1jc6bQYa.js')),
			__memo(() => import('./119-BtXx2SPc.js')),
			__memo(() => import('./120-CANp5bl1.js')),
			__memo(() => import('./121-CZBeaZlS.js')),
			__memo(() => import('./122-CeTyoWSb.js')),
			__memo(() => import('./123-Hu8Tq3V8.js')),
			__memo(() => import('./124-C78PM_3r.js')),
			__memo(() => import('./125-CzmghKKs.js')),
			__memo(() => import('./126-BFHURq3S.js')),
			__memo(() => import('./127-C4DCUmtd.js')),
			__memo(() => import('./128-CU9p05nd.js')),
			__memo(() => import('./129-D6LbaNfn.js')),
			__memo(() => import('./130-D581TWXN.js')),
			__memo(() => import('./131-1V9Rk6r8.js')),
			__memo(() => import('./132-DvcfB0VO.js')),
			__memo(() => import('./133-BoV-2ERO.js')),
			__memo(() => import('./134-iOlBMnge.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/(app)",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 45 },
				endpoint: null
			},
			{
				id: "/(app)/about",
				pattern: /^\/about\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 46 },
				endpoint: null
			},
			{
				id: "/(app)/access-denied",
				pattern: /^\/access-denied\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 47 },
				endpoint: null
			},
			{
				id: "/(protected)/achievements",
				pattern: /^\/achievements\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 110 },
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
				id: "/(admin)/admin/ai-costs",
				pattern: /^\/admin\/ai-costs\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 12 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/ai-runs",
				pattern: /^\/admin\/ai-runs\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 13 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/analytics",
				pattern: /^\/admin\/analytics\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 14 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/communications",
				pattern: /^\/admin\/communications\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 15 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/content",
				pattern: /^\/admin\/content\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 16 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/creator-applications",
				pattern: /^\/admin\/creator-applications\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 17 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/creators",
				pattern: /^\/admin\/creators\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 18 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/dashboard",
				pattern: /^\/admin\/dashboard\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 19 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/disputes",
				pattern: /^\/admin\/disputes\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 20 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/events",
				pattern: /^\/admin\/events\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 21 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/governance",
				pattern: /^\/admin\/governance\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 22 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/governance/create",
				pattern: /^\/admin\/governance\/create\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 23 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/governance/emergency",
				pattern: /^\/admin\/governance\/emergency\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 24 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/governance/execution",
				pattern: /^\/admin\/governance\/execution\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 25 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/governance/proposals",
				pattern: /^\/admin\/governance\/proposals\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 26 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/governance/reports",
				pattern: /^\/admin\/governance\/reports\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 27 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/governance/roles",
				pattern: /^\/admin\/governance\/roles\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 28 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/governance/treasury",
				pattern: /^\/admin\/governance\/treasury\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 29 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/observability",
				pattern: /^\/admin\/observability\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 30 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/payouts",
				pattern: /^\/admin\/payouts\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 31 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/policies",
				pattern: /^\/admin\/policies\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 32 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/promo",
				pattern: /^\/admin\/promo\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 33 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/refunds",
				pattern: /^\/admin\/refunds\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 34 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/review",
				pattern: /^\/admin\/review\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 35 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/review/[id]",
				pattern: /^\/admin\/review\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 36 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/settings",
				pattern: /^\/admin\/settings\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 37 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/submissions",
				pattern: /^\/admin\/submissions\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 38 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/system-health",
				pattern: /^\/admin\/system-health\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 39 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/tax-forms",
				pattern: /^\/admin\/tax-forms\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 40 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/tokenomics",
				pattern: /^\/admin\/tokenomics\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 41 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/users",
				pattern: /^\/admin\/users\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 42 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/users/[id]",
				pattern: /^\/admin\/users\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 43 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/workflow",
				pattern: /^\/admin\/workflow\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 44 },
				endpoint: null
			},
			{
				id: "/api/achievements",
				pattern: /^\/api\/achievements\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DABPOOab.js'))
			},
			{
				id: "/api/admin/abuse",
				pattern: /^\/api\/admin\/abuse\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-C2J0KcAp.js'))
			},
			{
				id: "/api/admin/abuse/[id]",
				pattern: /^\/api\/admin\/abuse\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-pnlt2x0e.js'))
			},
			{
				id: "/api/admin/admins",
				pattern: /^\/api\/admin\/admins\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BUmy_8Rg.js'))
			},
			{
				id: "/api/admin/agent-runs",
				pattern: /^\/api\/admin\/agent-runs\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DVsHH4x7.js'))
			},
			{
				id: "/api/admin/agents/status",
				pattern: /^\/api\/admin\/agents\/status\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-UFqCyUUz.js'))
			},
			{
				id: "/api/admin/agents/[name]/fire",
				pattern: /^\/api\/admin\/agents\/([^/]+?)\/fire\/?$/,
				params: [{"name":"name","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BgxKd2fc.js'))
			},
			{
				id: "/api/admin/ai-costs",
				pattern: /^\/api\/admin\/ai-costs\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-RqMNDMkN.js'))
			},
			{
				id: "/api/admin/ai/config",
				pattern: /^\/api\/admin\/ai\/config\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CTuwHtWv.js'))
			},
			{
				id: "/api/admin/ai/models",
				pattern: /^\/api\/admin\/ai\/models\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DoDkW-XO.js'))
			},
			{
				id: "/api/admin/ai/test",
				pattern: /^\/api\/admin\/ai\/test\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-D4zbeYVN.js'))
			},
			{
				id: "/api/admin/analytics",
				pattern: /^\/api\/admin\/analytics\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-B5lT8qen.js'))
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
				endpoint: __memo(() => import('./_server.ts-BY2aNxPi.js'))
			},
			{
				id: "/api/admin/communications/templates",
				pattern: /^\/api\/admin\/communications\/templates\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DZ19dJGg.js'))
			},
			{
				id: "/api/admin/content",
				pattern: /^\/api\/admin\/content\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-UOPQL_RA.js'))
			},
			{
				id: "/api/admin/content/bulk",
				pattern: /^\/api\/admin\/content\/bulk\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BQrRBn5y.js'))
			},
			{
				id: "/api/admin/content/[id]",
				pattern: /^\/api\/admin\/content\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BaBSEFhX.js'))
			},
			{
				id: "/api/admin/content/[id]/assign",
				pattern: /^\/api\/admin\/content\/([^/]+?)\/assign\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Dl_QEbiq.js'))
			},
			{
				id: "/api/admin/content/[id]/cancel-encode",
				pattern: /^\/api\/admin\/content\/([^/]+?)\/cancel-encode\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BLbR-qQ_.js'))
			},
			{
				id: "/api/admin/content/[id]/ppv",
				pattern: /^\/api\/admin\/content\/([^/]+?)\/ppv\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DC27Otia.js'))
			},
			{
				id: "/api/admin/content/[id]/pricing",
				pattern: /^\/api\/admin\/content\/([^/]+?)\/pricing\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-B42WtIti.js'))
			},
			{
				id: "/api/admin/content/[id]/publish",
				pattern: /^\/api\/admin\/content\/([^/]+?)\/publish\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DRPs1otp.js'))
			},
			{
				id: "/api/admin/content/[id]/rescan",
				pattern: /^\/api\/admin\/content\/([^/]+?)\/rescan\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DK4GR7zj.js'))
			},
			{
				id: "/api/admin/content/[id]/review",
				pattern: /^\/api\/admin\/content\/([^/]+?)\/review\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-zwmWnT5Z.js'))
			},
			{
				id: "/api/admin/content/[id]/thread",
				pattern: /^\/api\/admin\/content\/([^/]+?)\/thread\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DnoqU9D1.js'))
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
				endpoint: __memo(() => import('./_server.ts-CrmJqIZz.js'))
			},
			{
				id: "/api/admin/creator-applications/[id]/review",
				pattern: /^\/api\/admin\/creator-applications\/([^/]+?)\/review\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DOBdoTnu.js'))
			},
			{
				id: "/api/admin/creators",
				pattern: /^\/api\/admin\/creators\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-T0iCLfL6.js'))
			},
			{
				id: "/api/admin/creators/invite",
				pattern: /^\/api\/admin\/creators\/invite\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-XoB4vGQQ.js'))
			},
			{
				id: "/api/admin/dashboard",
				pattern: /^\/api\/admin\/dashboard\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-kLJzTZ8B.js'))
			},
			{
				id: "/api/admin/disputes",
				pattern: /^\/api\/admin\/disputes\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-ChZZjz9U.js'))
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
				endpoint: __memo(() => import('./_server.ts-D3scpz7w.js'))
			},
			{
				id: "/api/admin/encoder/jobs/[mediaId]/cancel",
				pattern: /^\/api\/admin\/encoder\/jobs\/([^/]+?)\/cancel\/?$/,
				params: [{"name":"mediaId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-B8M6rTVh.js'))
			},
			{
				id: "/api/admin/encoder/jobs/[mediaId]/retry",
				pattern: /^\/api\/admin\/encoder\/jobs\/([^/]+?)\/retry\/?$/,
				params: [{"name":"mediaId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Cagyhh_a.js'))
			},
			{
				id: "/api/admin/events",
				pattern: /^\/api\/admin\/events\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Ge2tLauk.js'))
			},
			{
				id: "/api/admin/events/[id]",
				pattern: /^\/api\/admin\/events\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Cmtp9ADy.js'))
			},
			{
				id: "/api/admin/forum/threads/[id]",
				pattern: /^\/api\/admin\/forum\/threads\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DD5Ga5HT.js'))
			},
			{
				id: "/api/admin/governance/approve",
				pattern: /^\/api\/admin\/governance\/approve\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Dq7VPYFl.js'))
			},
			{
				id: "/api/admin/governance/audit",
				pattern: /^\/api\/admin\/governance\/audit\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Cq1-AieM.js'))
			},
			{
				id: "/api/admin/governance/emergency/pause",
				pattern: /^\/api\/admin\/governance\/emergency\/pause\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BaryKXFH.js'))
			},
			{
				id: "/api/admin/governance/execute",
				pattern: /^\/api\/admin\/governance\/execute\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BNPRlw_3.js'))
			},
			{
				id: "/api/admin/governance/proposals",
				pattern: /^\/api\/admin\/governance\/proposals\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-xcska4p3.js'))
			},
			{
				id: "/api/admin/governance/queue",
				pattern: /^\/api\/admin\/governance\/queue\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CGVWngPI.js'))
			},
			{
				id: "/api/admin/governance/reports",
				pattern: /^\/api\/admin\/governance\/reports\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Dimc1j2n.js'))
			},
			{
				id: "/api/admin/governance/roles",
				pattern: /^\/api\/admin\/governance\/roles\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-EXzEjafq.js'))
			},
			{
				id: "/api/admin/governance/status",
				pattern: /^\/api\/admin\/governance\/status\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-ebeynazw.js'))
			},
			{
				id: "/api/admin/governance/timelock-queue",
				pattern: /^\/api\/admin\/governance\/timelock-queue\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-D0Wp4Fcy.js'))
			},
			{
				id: "/api/admin/governance/treasury",
				pattern: /^\/api\/admin\/governance\/treasury\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BsOhTlYY.js'))
			},
			{
				id: "/api/admin/observability",
				pattern: /^\/api\/admin\/observability\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-5TM-0CdB.js'))
			},
			{
				id: "/api/admin/payouts",
				pattern: /^\/api\/admin\/payouts\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-B3CBsljE.js'))
			},
			{
				id: "/api/admin/payouts/[id]/approve",
				pattern: /^\/api\/admin\/payouts\/([^/]+?)\/approve\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BwY4DpzY.js'))
			},
			{
				id: "/api/admin/payouts/[id]/hold",
				pattern: /^\/api\/admin\/payouts\/([^/]+?)\/hold\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CBetVBjM.js'))
			},
			{
				id: "/api/admin/payouts/[id]/retry",
				pattern: /^\/api\/admin\/payouts\/([^/]+?)\/retry\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Bp_doM9h.js'))
			},
			{
				id: "/api/admin/policies",
				pattern: /^\/api\/admin\/policies\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DlxwGsfS.js'))
			},
			{
				id: "/api/admin/promo/advertisers",
				pattern: /^\/api\/admin\/promo\/advertisers\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-ExEnflQf.js'))
			},
			{
				id: "/api/admin/promo/breaks",
				pattern: /^\/api\/admin\/promo\/breaks\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DNT2Cx97.js'))
			},
			{
				id: "/api/admin/promo/breaks/generate",
				pattern: /^\/api\/admin\/promo\/breaks\/generate\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BO3Ur7e_.js'))
			},
			{
				id: "/api/admin/promo/campaigns",
				pattern: /^\/api\/admin\/promo\/campaigns\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DtIpgrP0.js'))
			},
			{
				id: "/api/admin/promo/creatives",
				pattern: /^\/api\/admin\/promo\/creatives\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BNXD5r5M.js'))
			},
			{
				id: "/api/admin/promo/preview",
				pattern: /^\/api\/admin\/promo\/preview\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Cp5V3jDh.js'))
			},
			{
				id: "/api/admin/promo/reports",
				pattern: /^\/api\/admin\/promo\/reports\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BKaQFlqH.js'))
			},
			{
				id: "/api/admin/refunds",
				pattern: /^\/api\/admin\/refunds\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-GlnAuSMb.js'))
			},
			{
				id: "/api/admin/refunds/lookup",
				pattern: /^\/api\/admin\/refunds\/lookup\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CaWPkVq6.js'))
			},
			{
				id: "/api/admin/reviews",
				pattern: /^\/api\/admin\/reviews\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-D5Wv8ruj.js'))
			},
			{
				id: "/api/admin/settings",
				pattern: /^\/api\/admin\/settings\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-we0dw6ht.js'))
			},
			{
				id: "/api/admin/settings/test-email",
				pattern: /^\/api\/admin\/settings\/test-email\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CgCQC-U1.js'))
			},
			{
				id: "/api/admin/sponsorships",
				pattern: /^\/api\/admin\/sponsorships\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DBreBP7U.js'))
			},
			{
				id: "/api/admin/sponsorships/[id]/review",
				pattern: /^\/api\/admin\/sponsorships\/([^/]+?)\/review\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Cc5kehJ_.js'))
			},
			{
				id: "/api/admin/stats",
				pattern: /^\/api\/admin\/stats\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DVyMObB5.js'))
			},
			{
				id: "/api/admin/success-stories",
				pattern: /^\/api\/admin\/success-stories\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CZM9sC2u.js'))
			},
			{
				id: "/api/admin/success-stories/[id]/review",
				pattern: /^\/api\/admin\/success-stories\/([^/]+?)\/review\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CxM2BGuW.js'))
			},
			{
				id: "/api/admin/support-tickets",
				pattern: /^\/api\/admin\/support-tickets\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Cqyv091k.js'))
			},
			{
				id: "/api/admin/support-tickets/[id]/review",
				pattern: /^\/api\/admin\/support-tickets\/([^/]+?)\/review\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-IA6ZmeeP.js'))
			},
			{
				id: "/api/admin/tax-forms",
				pattern: /^\/api\/admin\/tax-forms\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CSLILAgI.js'))
			},
			{
				id: "/api/admin/tax-forms/[id]/verify",
				pattern: /^\/api\/admin\/tax-forms\/([^/]+?)\/verify\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-HDiqeWRW.js'))
			},
			{
				id: "/api/admin/tokenomics",
				pattern: /^\/api\/admin\/tokenomics\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CObFVEUz.js'))
			},
			{
				id: "/api/admin/tokenomics/distribution",
				pattern: /^\/api\/admin\/tokenomics\/distribution\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DNIOk75B.js'))
			},
			{
				id: "/api/admin/users",
				pattern: /^\/api\/admin\/users\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CqZ7xKcq.js'))
			},
			{
				id: "/api/admin/users/stats",
				pattern: /^\/api\/admin\/users\/stats\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CDeGRR5c.js'))
			},
			{
				id: "/api/admin/users/[id]",
				pattern: /^\/api\/admin\/users\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BWvv0zuG.js'))
			},
			{
				id: "/api/admin/users/[id]/ban",
				pattern: /^\/api\/admin\/users\/([^/]+?)\/ban\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BBTdloUO.js'))
			},
			{
				id: "/api/admin/users/[id]/warn",
				pattern: /^\/api\/admin\/users\/([^/]+?)\/warn\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BehcOrnt.js'))
			},
			{
				id: "/api/admin/workflow",
				pattern: /^\/api\/admin\/workflow\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DwBj2mOi.js'))
			},
			{
				id: "/api/admin/workflow/stats",
				pattern: /^\/api\/admin\/workflow\/stats\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-ClIXaqKJ.js'))
			},
			{
				id: "/api/ai/admin/classify-abuse",
				pattern: /^\/api\/ai\/admin\/classify-abuse\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-bZ5ylhdx.js'))
			},
			{
				id: "/api/ai/admin/draft-message",
				pattern: /^\/api\/ai\/admin\/draft-message\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-B0vfROU7.js'))
			},
			{
				id: "/api/ai/admin/summarize-application",
				pattern: /^\/api\/ai\/admin\/summarize-application\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BxZZTI71.js'))
			},
			{
				id: "/api/ai/companion",
				pattern: /^\/api\/ai\/companion\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Cfzrw848.js'))
			},
			{
				id: "/api/ai/copilot",
				pattern: /^\/api\/ai\/copilot\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DA-GUprP.js'))
			},
			{
				id: "/api/ai/copilot/approve",
				pattern: /^\/api\/ai\/copilot\/approve\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BDpRGkCd.js'))
			},
			{
				id: "/api/ai/copilot/conversations",
				pattern: /^\/api\/ai\/copilot\/conversations\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Ch8M1PCC.js'))
			},
			{
				id: "/api/ai/creator-insights",
				pattern: /^\/api\/ai\/creator-insights\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DbEgU18M.js'))
			},
			{
				id: "/api/ai/moderate",
				pattern: /^\/api\/ai\/moderate\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DKVYr-V-.js'))
			},
			{
				id: "/api/ai/nft",
				pattern: /^\/api\/ai\/nft\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CpjLave5.js'))
			},
			{
				id: "/api/ai/search",
				pattern: /^\/api\/ai\/search\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Bubhp7HL.js'))
			},
			{
				id: "/api/ai/suggest/chapters",
				pattern: /^\/api\/ai\/suggest\/chapters\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-UStpebgR.js'))
			},
			{
				id: "/api/ai/suggest/description",
				pattern: /^\/api\/ai\/suggest\/description\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DhUFnJ0T.js'))
			},
			{
				id: "/api/ai/suggest/review-reply",
				pattern: /^\/api\/ai\/suggest\/review-reply\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DocV2z1y.js'))
			},
			{
				id: "/api/ai/suggest/title",
				pattern: /^\/api\/ai\/suggest\/title\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BlSzqENZ.js'))
			},
			{
				id: "/api/ai/tag",
				pattern: /^\/api\/ai\/tag\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CXV1vZbD.js'))
			},
			{
				id: "/api/ai/token-score",
				pattern: /^\/api\/ai\/token-score\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-akwfOI8a.js'))
			},
			{
				id: "/api/auth/[...all]",
				pattern: /^\/api\/auth(?:\/([^]*))?\/?$/,
				params: [{"name":"all","optional":false,"rest":true,"chained":true}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DacqfENJ.js'))
			},
			{
				id: "/api/catalog/audience/[category]",
				pattern: /^\/api\/catalog\/audience\/([^/]+?)\/?$/,
				params: [{"name":"category","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BQX09hEU.js'))
			},
			{
				id: "/api/catalog/browse",
				pattern: /^\/api\/catalog\/browse\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CRCwdrRJ.js'))
			},
			{
				id: "/api/catalog/coming-soon",
				pattern: /^\/api\/catalog\/coming-soon\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CmDD0_Vt.js'))
			},
			{
				id: "/api/catalog/detail/[scope]/[slug]",
				pattern: /^\/api\/catalog\/detail\/([^/]+?)\/([^/]+?)\/?$/,
				params: [{"name":"scope","optional":false,"rest":false,"chained":false},{"name":"slug","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BsUJx7F8.js'))
			},
			{
				id: "/api/catalog/[kind]",
				pattern: /^\/api\/catalog\/([^/]+?)\/?$/,
				params: [{"name":"kind","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DsZOSSQt.js'))
			},
			{
				id: "/api/coming-soon",
				pattern: /^\/api\/coming-soon\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-ZXrlUxH2.js'))
			},
			{
				id: "/api/coming-soon/[contentId]/notify",
				pattern: /^\/api\/coming-soon\/([^/]+?)\/notify\/?$/,
				params: [{"name":"contentId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-M-UJVfN7.js'))
			},
			{
				id: "/api/contact",
				pattern: /^\/api\/contact\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-M_yUzTUP.js'))
			},
			{
				id: "/api/content/kids",
				pattern: /^\/api\/content\/kids\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BHYQa2rI.js'))
			},
			{
				id: "/api/content/[id]/price",
				pattern: /^\/api\/content\/([^/]+?)\/price\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DDCxdikk.js'))
			},
			{
				id: "/api/content/[id]/subtitles",
				pattern: /^\/api\/content\/([^/]+?)\/subtitles\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Bec84iWF.js'))
			},
			{
				id: "/api/content/[id]/thumbnail-click",
				pattern: /^\/api\/content\/([^/]+?)\/thumbnail-click\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BWx_jCbF.js'))
			},
			{
				id: "/api/content/[id]/thumbnail-impression",
				pattern: /^\/api\/content\/([^/]+?)\/thumbnail-impression\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-VSpSEt3i.js'))
			},
			{
				id: "/api/creators/[id]/follow",
				pattern: /^\/api\/creators\/([^/]+?)\/follow\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-RSoKohmb.js'))
			},
			{
				id: "/api/creators/[id]/page",
				pattern: /^\/api\/creators\/([^/]+?)\/page\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BZiTjlYL.js'))
			},
			{
				id: "/api/creator/analytics",
				pattern: /^\/api\/creator\/analytics\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BezI6VRS.js'))
			},
			{
				id: "/api/creator/analytics/stream",
				pattern: /^\/api\/creator\/analytics\/stream\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-2ZFlhr3m.js'))
			},
			{
				id: "/api/creator/application",
				pattern: /^\/api\/creator\/application\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-oEFMl0RF.js'))
			},
			{
				id: "/api/creator/content",
				pattern: /^\/api\/creator\/content\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CdPzeW9L.js'))
			},
			{
				id: "/api/creator/content/bulk",
				pattern: /^\/api\/creator\/content\/bulk\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CFRtDqd6.js'))
			},
			{
				id: "/api/creator/content/lookup",
				pattern: /^\/api\/creator\/content\/lookup\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DGa8lkHz.js'))
			},
			{
				id: "/api/creator/content/search",
				pattern: /^\/api\/creator\/content\/search\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BylAJ9yr.js'))
			},
			{
				id: "/api/creator/content/[id]",
				pattern: /^\/api\/creator\/content\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-sU8b2ywA.js'))
			},
			{
				id: "/api/creator/content/[id]/duplicate",
				pattern: /^\/api\/creator\/content\/([^/]+?)\/duplicate\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CMuZ_Eeq.js'))
			},
			{
				id: "/api/creator/content/[id]/episodes",
				pattern: /^\/api\/creator\/content\/([^/]+?)\/episodes\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DpTVnPPy.js'))
			},
			{
				id: "/api/creator/content/[id]/episodes/[episodeId]",
				pattern: /^\/api\/creator\/content\/([^/]+?)\/episodes\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false},{"name":"episodeId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DE78XziZ.js'))
			},
			{
				id: "/api/creator/content/[id]/pricing",
				pattern: /^\/api\/creator\/content\/([^/]+?)\/pricing\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-C57c2EcI.js'))
			},
			{
				id: "/api/creator/content/[id]/subtitles",
				pattern: /^\/api\/creator\/content\/([^/]+?)\/subtitles\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-D9YWV55T.js'))
			},
			{
				id: "/api/creator/content/[id]/subtitles/[trackId]",
				pattern: /^\/api\/creator\/content\/([^/]+?)\/subtitles\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false},{"name":"trackId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CXS41dQD.js'))
			},
			{
				id: "/api/creator/content/[id]/thread",
				pattern: /^\/api\/creator\/content\/([^/]+?)\/thread\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CuyO8tgs.js'))
			},
			{
				id: "/api/creator/content/[id]/thread/stream",
				pattern: /^\/api\/creator\/content\/([^/]+?)\/thread\/stream\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts--YVj7BIo.js'))
			},
			{
				id: "/api/creator/content/[id]/thumbnails",
				pattern: /^\/api\/creator\/content\/([^/]+?)\/thumbnails\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DmaPP5E1.js'))
			},
			{
				id: "/api/creator/content/[id]/thumbnails/[vid]",
				pattern: /^\/api\/creator\/content\/([^/]+?)\/thumbnails\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false},{"name":"vid","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DhxmW2IF.js'))
			},
			{
				id: "/api/creator/content/[id]/thumbnails/[vid]/promote",
				pattern: /^\/api\/creator\/content\/([^/]+?)\/thumbnails\/([^/]+?)\/promote\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false},{"name":"vid","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-kXdw-OGg.js'))
			},
			{
				id: "/api/creator/earnings",
				pattern: /^\/api\/creator\/earnings\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-C0FFJxEI.js'))
			},
			{
				id: "/api/creator/encoder-stream",
				pattern: /^\/api\/creator\/encoder-stream\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DM4tmRu7.js'))
			},
			{
				id: "/api/creator/in-flight-encodes",
				pattern: /^\/api\/creator\/in-flight-encodes\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-B2ODyShZ.js'))
			},
			{
				id: "/api/creator/live",
				pattern: /^\/api\/creator\/live\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CCe4AVZG.js'))
			},
			{
				id: "/api/creator/live/[id]",
				pattern: /^\/api\/creator\/live\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Bwn6tiah.js'))
			},
			{
				id: "/api/creator/messages",
				pattern: /^\/api\/creator\/messages\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-y-KPyz1Y.js'))
			},
			{
				id: "/api/creator/messages/bulk",
				pattern: /^\/api\/creator\/messages\/bulk\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DiGP1ZoJ.js'))
			},
			{
				id: "/api/creator/messages/[id]/archive",
				pattern: /^\/api\/creator\/messages\/([^/]+?)\/archive\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DntLnB77.js'))
			},
			{
				id: "/api/creator/messages/[id]/read",
				pattern: /^\/api\/creator\/messages\/([^/]+?)\/read\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BFwrlh8M.js'))
			},
			{
				id: "/api/creator/moderation/forum",
				pattern: /^\/api\/creator\/moderation\/forum\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-94NbkkBD.js'))
			},
			{
				id: "/api/creator/moderation/forum/replies/[id]",
				pattern: /^\/api\/creator\/moderation\/forum\/replies\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-9dQtMuYQ.js'))
			},
			{
				id: "/api/creator/moderation/forum/threads/[id]",
				pattern: /^\/api\/creator\/moderation\/forum\/threads\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-VoaMOK_n.js'))
			},
			{
				id: "/api/creator/moderation/reviews",
				pattern: /^\/api\/creator\/moderation\/reviews\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Bteho7Y4.js'))
			},
			{
				id: "/api/creator/moderation/reviews/[id]",
				pattern: /^\/api\/creator\/moderation\/reviews\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-V3RR98hN.js'))
			},
			{
				id: "/api/creator/newsletter/subscribe",
				pattern: /^\/api\/creator\/newsletter\/subscribe\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-u155nEJO.js'))
			},
			{
				id: "/api/creator/payment-preferences",
				pattern: /^\/api\/creator\/payment-preferences\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Bz6bQZbY.js'))
			},
			{
				id: "/api/creator/payouts/method",
				pattern: /^\/api\/creator\/payouts\/method\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CAZLH68G.js'))
			},
			{
				id: "/api/creator/payouts/stripe/onboard",
				pattern: /^\/api\/creator\/payouts\/stripe\/onboard\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DJ88vpOD.js'))
			},
			{
				id: "/api/creator/payouts/stripe/status",
				pattern: /^\/api\/creator\/payouts\/stripe\/status\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-NUpOZmoN.js'))
			},
			{
				id: "/api/creator/people/lookup",
				pattern: /^\/api\/creator\/people\/lookup\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-aR8WK0vv.js'))
			},
			{
				id: "/api/creator/profile",
				pattern: /^\/api\/creator\/profile\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-gGSqY0kq.js'))
			},
			{
				id: "/api/creator/stats",
				pattern: /^\/api\/creator\/stats\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DmR5ERNA.js'))
			},
			{
				id: "/api/creator/tax-1099-forms",
				pattern: /^\/api\/creator\/tax-1099-forms\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-D7zce58N.js'))
			},
			{
				id: "/api/creator/tax-forms",
				pattern: /^\/api\/creator\/tax-forms\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CrJw9d5s.js'))
			},
			{
				id: "/api/creator/trailer-upload/commit",
				pattern: /^\/api\/creator\/trailer-upload\/commit\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Y_XmY6-Q.js'))
			},
			{
				id: "/api/creator/trailer-upload/sign",
				pattern: /^\/api\/creator\/trailer-upload\/sign\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DvFyLbyF.js'))
			},
			{
				id: "/api/cron/ab-auto-promote",
				pattern: /^\/api\/cron\/ab-auto-promote\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Cuxyx3fs.js'))
			},
			{
				id: "/api/cron/agents/[name]",
				pattern: /^\/api\/cron\/agents\/([^/]+?)\/?$/,
				params: [{"name":"name","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BhY9ymwn.js'))
			},
			{
				id: "/api/cron/analytics-rollup",
				pattern: /^\/api\/cron\/analytics-rollup\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-C2Vt6Rv9.js'))
			},
			{
				id: "/api/cron/creator-payouts",
				pattern: /^\/api\/cron\/creator-payouts\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DD6UsE6s.js'))
			},
			{
				id: "/api/cron/event-status-sweep",
				pattern: /^\/api\/cron\/event-status-sweep\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BtnG0P4O.js'))
			},
			{
				id: "/api/cron/meilisearch-reindex",
				pattern: /^\/api\/cron\/meilisearch-reindex\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DuN9A8Mf.js'))
			},
			{
				id: "/api/cron/newsletter-weekly-digest",
				pattern: /^\/api\/cron\/newsletter-weekly-digest\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-B3xTahEZ.js'))
			},
			{
				id: "/api/cron/payout-reserve",
				pattern: /^\/api\/cron\/payout-reserve\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-QCbhhf5i.js'))
			},
			{
				id: "/api/cron/promo-rollup",
				pattern: /^\/api\/cron\/promo-rollup\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-C2tVEcPw.js'))
			},
			{
				id: "/api/cron/renew-subscriptions",
				pattern: /^\/api\/cron\/renew-subscriptions\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Bg_5QzT0.js'))
			},
			{
				id: "/api/cron/scheduled-publish",
				pattern: /^\/api\/cron\/scheduled-publish\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Dx3QVNtz.js'))
			},
			{
				id: "/api/cron/settlement-reconcile",
				pattern: /^\/api\/cron\/settlement-reconcile\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BmJ_-3-o.js'))
			},
			{
				id: "/api/cron/staking-indexer",
				pattern: /^\/api\/cron\/staking-indexer\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-B7usztg7.js'))
			},
			{
				id: "/api/cron/stc-settle",
				pattern: /^\/api\/cron\/stc-settle\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DCd1PzwU.js'))
			},
			{
				id: "/api/cron/tax-1099-generate",
				pattern: /^\/api\/cron\/tax-1099-generate\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CxxIqJOP.js'))
			},
			{
				id: "/api/downloads/manifest/[id]",
				pattern: /^\/api\/downloads\/manifest\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CnI9CsN-.js'))
			},
			{
				id: "/api/encoder/jobs",
				pattern: /^\/api\/encoder\/jobs\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-ml3Pl-HO.js'))
			},
			{
				id: "/api/encoder/jobs/[jobId]",
				pattern: /^\/api\/encoder\/jobs\/([^/]+?)\/?$/,
				params: [{"name":"jobId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-3aF9lXIA.js'))
			},
			{
				id: "/api/encoder/jobs/[jobId]/commit",
				pattern: /^\/api\/encoder\/jobs\/([^/]+?)\/commit\/?$/,
				params: [{"name":"jobId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CqIEsnTI.js'))
			},
			{
				id: "/api/encoder/jobs/[jobId]/playback",
				pattern: /^\/api\/encoder\/jobs\/([^/]+?)\/playback\/?$/,
				params: [{"name":"jobId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BD55fmkB.js'))
			},
			{
				id: "/api/encoder/live-finalize",
				pattern: /^\/api\/encoder\/live-finalize\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Dd1n0tmw.js'))
			},
			{
				id: "/api/encoder/live-state",
				pattern: /^\/api\/encoder\/live-state\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-g-psCC1M.js'))
			},
			{
				id: "/api/encoder/live-state/validate",
				pattern: /^\/api\/encoder\/live-state\/validate\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DT1hz-Bk.js'))
			},
			{
				id: "/api/encoder/pending",
				pattern: /^\/api\/encoder\/pending\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-HwfKrmdX.js'))
			},
			{
				id: "/api/encoder/presigned",
				pattern: /^\/api\/encoder\/presigned\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-QVV3gzm-.js'))
			},
			{
				id: "/api/encoder/process",
				pattern: /^\/api\/encoder\/process\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-B9cyQW-J.js'))
			},
			{
				id: "/api/encoder/ready",
				pattern: /^\/api\/encoder\/ready\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DtfpeYEY.js'))
			},
			{
				id: "/api/encoder/scan-ready",
				pattern: /^\/api\/encoder\/scan-ready\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CYSSY8zG.js'))
			},
			{
				id: "/api/encoder/webhook",
				pattern: /^\/api\/encoder\/webhook\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-C4Y6xz2y.js'))
			},
			{
				id: "/api/events",
				pattern: /^\/api\/events\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CIyRBKIH.js'))
			},
			{
				id: "/api/events/feed.ics",
				pattern: /^\/api\/events\/feed\.ics\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DtSjgVx3.js'))
			},
			{
				id: "/api/events/[id]",
				pattern: /^\/api\/events\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-jqu9_g-F.js'))
			},
			{
				id: "/api/events/[id]/register",
				pattern: /^\/api\/events\/([^/]+?)\/register\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DmWAfCUK.js'))
			},
			{
				id: "/api/files",
				pattern: /^\/api\/files\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CmWGr52-.js'))
			},
			{
				id: "/api/files/commit",
				pattern: /^\/api\/files\/commit\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BFA6y3EC.js'))
			},
			{
				id: "/api/files/sign",
				pattern: /^\/api\/files\/sign\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DqdImJAt.js'))
			},
			{
				id: "/api/forum/replies/[id]",
				pattern: /^\/api\/forum\/replies\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-4_7h3aiR.js'))
			},
			{
				id: "/api/forum/replies/[id]/like",
				pattern: /^\/api\/forum\/replies\/([^/]+?)\/like\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Cb0Ns8jj.js'))
			},
			{
				id: "/api/forum/threads",
				pattern: /^\/api\/forum\/threads\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Daj4GgjA.js'))
			},
			{
				id: "/api/forum/threads/[id]",
				pattern: /^\/api\/forum\/threads\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CuxvbIF7.js'))
			},
			{
				id: "/api/forum/threads/[id]/like",
				pattern: /^\/api\/forum\/threads\/([^/]+?)\/like\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BDP5pWVQ.js'))
			},
			{
				id: "/api/forum/threads/[id]/replies",
				pattern: /^\/api\/forum\/threads\/([^/]+?)\/replies\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DPZhNW-x.js'))
			},
			{
				id: "/api/health",
				pattern: /^\/api\/health\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BnlMIi3-.js'))
			},
			{
				id: "/api/home",
				pattern: /^\/api\/home\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CEGb4hNO.js'))
			},
			{
				id: "/api/internal/refunds/sweep-pending",
				pattern: /^\/api\/internal\/refunds\/sweep-pending\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DK13VG3J.js'))
			},
			{
				id: "/api/kids/quiz/generate",
				pattern: /^\/api\/kids\/quiz\/generate\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-jCnypefz.js'))
			},
			{
				id: "/api/kids/quiz/submit",
				pattern: /^\/api\/kids\/quiz\/submit\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-czw_zE-t.js'))
			},
			{
				id: "/api/live/[streamId]/chat",
				pattern: /^\/api\/live\/([^/]+?)\/chat\/?$/,
				params: [{"name":"streamId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-AFai_UaI.js'))
			},
			{
				id: "/api/live/[streamId]/chat/stream",
				pattern: /^\/api\/live\/([^/]+?)\/chat\/stream\/?$/,
				params: [{"name":"streamId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DpCINGJO.js'))
			},
			{
				id: "/api/live/[streamId]/chat/[messageId]",
				pattern: /^\/api\/live\/([^/]+?)\/chat\/([^/]+?)\/?$/,
				params: [{"name":"streamId","optional":false,"rest":false,"chained":false},{"name":"messageId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BESnPjKA.js'))
			},
			{
				id: "/api/milestones",
				pattern: /^\/api\/milestones\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-D_KkNXUF.js'))
			},
			{
				id: "/api/my-list/[contentId]",
				pattern: /^\/api\/my-list\/([^/]+?)\/?$/,
				params: [{"name":"contentId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CJyk3Eq3.js'))
			},
			{
				id: "/api/notifications",
				pattern: /^\/api\/notifications\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CL3VVjoY.js'))
			},
			{
				id: "/api/notifications/preferences",
				pattern: /^\/api\/notifications\/preferences\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-P-4coChH.js'))
			},
			{
				id: "/api/notifications/[id]",
				pattern: /^\/api\/notifications\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-COH4ls84.js'))
			},
			{
				id: "/api/notifications/[id]/read",
				pattern: /^\/api\/notifications\/([^/]+?)\/read\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-B3Imx8Eo.js'))
			},
			{
				id: "/api/parental/report",
				pattern: /^\/api\/parental\/report\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Dm0UOEwL.js'))
			},
			{
				id: "/api/payment/initialize",
				pattern: /^\/api\/payment\/initialize\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DtizLJ48.js'))
			},
			{
				id: "/api/payment/verify",
				pattern: /^\/api\/payment\/verify\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CFzGa4YD.js'))
			},
			{
				id: "/api/payment/webhook",
				pattern: /^\/api\/payment\/webhook\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-C-WZ18kL.js'))
			},
			{
				id: "/api/platform-settings",
				pattern: /^\/api\/platform-settings\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DZBM5iMm.js'))
			},
			{
				id: "/api/playback/live/[id]",
				pattern: /^\/api\/playback\/live\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-B_pmM8Pe.js'))
			},
			{
				id: "/api/playback/[id]",
				pattern: /^\/api\/playback\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-B0pLsui4.js'))
			},
			{
				id: "/api/playlists",
				pattern: /^\/api\/playlists\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DJpK0SIm.js'))
			},
			{
				id: "/api/playlists/[id]/items",
				pattern: /^\/api\/playlists\/([^/]+?)\/items\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CsrGdubZ.js'))
			},
			{
				id: "/api/ppv/check-access/[contentId]",
				pattern: /^\/api\/ppv\/check-access\/([^/]+?)\/?$/,
				params: [{"name":"contentId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-TOWJ_RAr.js'))
			},
			{
				id: "/api/ppv/purchase",
				pattern: /^\/api\/ppv\/purchase\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BKFh7xSw.js'))
			},
			{
				id: "/api/ppv/refund",
				pattern: /^\/api\/ppv\/refund\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DUJPQPIM.js'))
			},
			{
				id: "/api/profiles",
				pattern: /^\/api\/profiles\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CTtMf3AQ.js'))
			},
			{
				id: "/api/profiles/current",
				pattern: /^\/api\/profiles\/current\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-scmO1ISS.js'))
			},
			{
				id: "/api/profiles/overview",
				pattern: /^\/api\/profiles\/overview\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DD6Cy5jq.js'))
			},
			{
				id: "/api/profiles/[id]",
				pattern: /^\/api\/profiles\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Dq-fV5o7.js'))
			},
			{
				id: "/api/profiles/[id]/pin",
				pattern: /^\/api\/profiles\/([^/]+?)\/pin\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CHPOZwGT.js'))
			},
			{
				id: "/api/promo/decision",
				pattern: /^\/api\/promo\/decision\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BxX19u1M.js'))
			},
			{
				id: "/api/promo/e",
				pattern: /^\/api\/promo\/e\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BqSXXzTo.js'))
			},
			{
				id: "/api/promo/plan",
				pattern: /^\/api\/promo\/plan\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-w3ToSkJv.js'))
			},
			{
				id: "/api/push/subscribe",
				pattern: /^\/api\/push\/subscribe\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DfyzlluD.js'))
			},
			{
				id: "/api/recommendations",
				pattern: /^\/api\/recommendations\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-De1lxd3i.js'))
			},
			{
				id: "/api/reports",
				pattern: /^\/api\/reports\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Bwf7vY_U.js'))
			},
			{
				id: "/api/reviews",
				pattern: /^\/api\/reviews\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BHcKuOZ7.js'))
			},
			{
				id: "/api/reviews/[id]/helpful",
				pattern: /^\/api\/reviews\/([^/]+?)\/helpful\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BjrYKQ5k.js'))
			},
			{
				id: "/api/search",
				pattern: /^\/api\/search\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CW8PEtF6.js'))
			},
			{
				id: "/api/shares",
				pattern: /^\/api\/shares\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-ndBNF6S_.js'))
			},
			{
				id: "/api/sponsorships",
				pattern: /^\/api\/sponsorships\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CObPfO73.js'))
			},
			{
				id: "/api/subscriptions/add-family",
				pattern: /^\/api\/subscriptions\/add-family\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Dp6j0pOM.js'))
			},
			{
				id: "/api/subscriptions/cancel",
				pattern: /^\/api\/subscriptions\/cancel\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DTU31H8t.js'))
			},
			{
				id: "/api/subscriptions/change-plan",
				pattern: /^\/api\/subscriptions\/change-plan\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DSXJcD7l.js'))
			},
			{
				id: "/api/subscriptions/send-otp",
				pattern: /^\/api\/subscriptions\/send-otp\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BB04_D1C.js'))
			},
			{
				id: "/api/subscriptions/start-free",
				pattern: /^\/api\/subscriptions\/start-free\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DvHtwXQL.js'))
			},
			{
				id: "/api/subscriptions/start-trial",
				pattern: /^\/api\/subscriptions\/start-trial\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CpjO4v-k.js'))
			},
			{
				id: "/api/subscriptions/status",
				pattern: /^\/api\/subscriptions\/status\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CcPY07gN.js'))
			},
			{
				id: "/api/success-stories",
				pattern: /^\/api\/success-stories\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BX8h2Rz-.js'))
			},
			{
				id: "/api/support/tickets",
				pattern: /^\/api\/support\/tickets\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CK2i7dg6.js'))
			},
			{
				id: "/api/users",
				pattern: /^\/api\/users\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CgEy3sCu.js'))
			},
			{
				id: "/api/users/me/auth-providers",
				pattern: /^\/api\/users\/me\/auth-providers\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CwoRsapb.js'))
			},
			{
				id: "/api/users/me/stc-balance",
				pattern: /^\/api\/users\/me\/stc-balance\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Ctki4oTi.js'))
			},
			{
				id: "/api/users/me/stc-claim",
				pattern: /^\/api\/users\/me\/stc-claim\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-K7xF7OIY.js'))
			},
			{
				id: "/api/users/[id]",
				pattern: /^\/api\/users\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-COyNDFAS.js'))
			},
			{
				id: "/api/user/profile",
				pattern: /^\/api\/user\/profile\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-NaHSmWB4.js'))
			},
			{
				id: "/api/watch/active",
				pattern: /^\/api\/watch\/active\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Dq-t_mxq.js'))
			},
			{
				id: "/api/watch/history",
				pattern: /^\/api\/watch\/history\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-B8mzPcR5.js'))
			},
			{
				id: "/api/watch/live/[id]/stream",
				pattern: /^\/api\/watch\/live\/([^/]+?)\/stream\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Ww7SGBur.js'))
			},
			{
				id: "/api/watch/mark/[contentId]",
				pattern: /^\/api\/watch\/mark\/([^/]+?)\/?$/,
				params: [{"name":"contentId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CzUMRP2y.js'))
			},
			{
				id: "/api/watch/progress",
				pattern: /^\/api\/watch\/progress\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BzfAaf5o.js'))
			},
			{
				id: "/api/watch/telemetry",
				pattern: /^\/api\/watch\/telemetry\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-sZ1nGbz1.js'))
			},
			{
				id: "/api/watch/[videoId]",
				pattern: /^\/api\/watch\/([^/]+?)\/?$/,
				params: [{"name":"videoId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BSmfA_Pc.js'))
			},
			{
				id: "/api/webhooks/stripe",
				pattern: /^\/api\/webhooks\/stripe\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-X5RaqkdO.js'))
			},
			{
				id: "/(app)/apply/creator",
				pattern: /^\/apply\/creator\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 48 },
				endpoint: null
			},
			{
				id: "/(auth)/auth/forget-password",
				pattern: /^\/auth\/forget-password\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,,], leaf: 79 },
				endpoint: null
			},
			{
				id: "/(auth)/auth/forget-password/success",
				pattern: /^\/auth\/forget-password\/success\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,,], leaf: 80 },
				endpoint: null
			},
			{
				id: "/(auth)/auth/login",
				pattern: /^\/auth\/login\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,,], leaf: 81 },
				endpoint: null
			},
			{
				id: "/(auth)/auth/register",
				pattern: /^\/auth\/register\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,,], leaf: 82 },
				endpoint: null
			},
			{
				id: "/(auth)/auth/reset-password",
				pattern: /^\/auth\/reset-password\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,,], leaf: 83 },
				endpoint: null
			},
			{
				id: "/(app)/browse",
				pattern: /^\/browse\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 49 },
				endpoint: null
			},
			{
				id: "/(app)/careers",
				pattern: /^\/careers\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 50 },
				endpoint: null
			},
			{
				id: "/(app)/checkout",
				pattern: /^\/checkout\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 51 },
				endpoint: null
			},
			{
				id: "/(app)/coming-soon",
				pattern: /^\/coming-soon\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 52 },
				endpoint: null
			},
			{
				id: "/(app)/contact",
				pattern: /^\/contact\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 53 },
				endpoint: null
			},
			{
				id: "/(app)/creators/[id]",
				pattern: /^\/creators\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,3,], errors: [1,,], leaf: 54 },
				endpoint: null
			},
			{
				id: "/(creator)/creator",
				pattern: /^\/creator\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 84 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/agreement",
				pattern: /^\/creator\/agreement\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 85 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/analytics-help",
				pattern: /^\/creator\/analytics-help\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 87 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/analytics",
				pattern: /^\/creator\/analytics\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 86 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/best-practices",
				pattern: /^\/creator\/best-practices\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 88 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/content",
				pattern: /^\/creator\/content\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 89 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/content/[id]",
				pattern: /^\/creator\/content\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,5,], errors: [1,,], leaf: 90 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/content/[id]/episodes",
				pattern: /^\/creator\/content\/([^/]+?)\/episodes\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,5,], errors: [1,,], leaf: 91 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/copyright",
				pattern: /^\/creator\/copyright\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 92 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/earnings",
				pattern: /^\/creator\/earnings\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 93 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/earnings/tax-forms",
				pattern: /^\/creator\/earnings\/tax-forms\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 94 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/events",
				pattern: /^\/creator\/events\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 95 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/forum",
				pattern: /^\/creator\/forum\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 96 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/forum/new",
				pattern: /^\/creator\/forum\/new\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 97 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/forum/[id]",
				pattern: /^\/creator\/forum\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,5,], errors: [1,,], leaf: 98 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/guidelines",
				pattern: /^\/creator\/guidelines\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 99 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/inbox",
				pattern: /^\/creator\/inbox\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 100 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/live",
				pattern: /^\/creator\/live\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 101 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/moderation",
				pattern: /^\/creator\/moderation\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 102 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/newsletter",
				pattern: /^\/creator\/newsletter\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 103 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/profile",
				pattern: /^\/creator\/profile\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 104 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/success-stories",
				pattern: /^\/creator\/success-stories\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 105 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/support",
				pattern: /^\/creator\/support\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 106 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/tech-support",
				pattern: /^\/creator\/tech-support\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 107 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/test",
				pattern: /^\/creator\/test\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 108 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/upload",
				pattern: /^\/creator\/upload\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 109 },
				endpoint: null
			},
			{
				id: "/(protected)/dashboard",
				pattern: /^\/dashboard\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 111 },
				endpoint: null
			},
			{
				id: "/(app)/device-support",
				pattern: /^\/device-support\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 55 },
				endpoint: null
			},
			{
				id: "/(app)/documentaries",
				pattern: /^\/documentaries\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 56 },
				endpoint: null
			},
			{
				id: "/(app)/documentaries/[slug]",
				pattern: /^\/documentaries\/([^/]+?)\/?$/,
				params: [{"name":"slug","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,3,], errors: [1,,], leaf: 57 },
				endpoint: null
			},
			{
				id: "/(protected)/documentation",
				pattern: /^\/documentation\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 112 },
				endpoint: null
			},
			{
				id: "/(app)/exchange",
				pattern: /^\/exchange\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 58 },
				endpoint: null
			},
			{
				id: "/(app)/faq",
				pattern: /^\/faq\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 59 },
				endpoint: null
			},
			{
				id: "/(app)/features",
				pattern: /^\/features\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 60 },
				endpoint: null
			},
			{
				id: "/(app)/guidelines",
				pattern: /^\/guidelines\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 61 },
				endpoint: null
			},
			{
				id: "/(app)/help",
				pattern: /^\/help\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 62 },
				endpoint: null
			},
			{
				id: "/kids",
				pattern: /^\/kids\/?$/,
				params: [],
				page: { layouts: [0,8,], errors: [1,,], leaf: 123 },
				endpoint: null
			},
			{
				id: "/kids/kiddies",
				pattern: /^\/kids\/kiddies\/?$/,
				params: [],
				page: { layouts: [0,9,], errors: [1,,], leaf: 124 },
				endpoint: null
			},
			{
				id: "/kids/kiddies/bible-quiz",
				pattern: /^\/kids\/kiddies\/bible-quiz\/?$/,
				params: [],
				page: { layouts: [0,9,], errors: [1,,], leaf: 125 },
				endpoint: null
			},
			{
				id: "/kids/kiddies/documentaries",
				pattern: /^\/kids\/kiddies\/documentaries\/?$/,
				params: [],
				page: { layouts: [0,9,], errors: [1,,], leaf: 126 },
				endpoint: null
			},
			{
				id: "/kids/kiddies/movies",
				pattern: /^\/kids\/kiddies\/movies\/?$/,
				params: [],
				page: { layouts: [0,9,], errors: [1,,], leaf: 127 },
				endpoint: null
			},
			{
				id: "/kids/kiddies/profile",
				pattern: /^\/kids\/kiddies\/profile\/?$/,
				params: [],
				page: { layouts: [0,9,], errors: [1,,], leaf: 128 },
				endpoint: null
			},
			{
				id: "/kids/kiddies/shows",
				pattern: /^\/kids\/kiddies\/shows\/?$/,
				params: [],
				page: { layouts: [0,9,], errors: [1,,], leaf: 129 },
				endpoint: null
			},
			{
				id: "/kids/kiddies/[slug]",
				pattern: /^\/kids\/kiddies\/([^/]+?)\/?$/,
				params: [{"name":"slug","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,9,], errors: [1,,], leaf: 130 },
				endpoint: null
			},
			{
				id: "/kids/teens",
				pattern: /^\/kids\/teens\/?$/,
				params: [],
				page: { layouts: [0,8,], errors: [1,,], leaf: 131 },
				endpoint: null
			},
			{
				id: "/kids/teens/[slug]",
				pattern: /^\/kids\/teens\/([^/]+?)\/?$/,
				params: [{"name":"slug","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,8,], errors: [1,,], leaf: 132 },
				endpoint: null
			},
			{
				id: "/(app)/liquidity",
				pattern: /^\/liquidity\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 63 },
				endpoint: null
			},
			{
				id: "/(protected)/milestones",
				pattern: /^\/milestones\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 113 },
				endpoint: null
			},
			{
				id: "/(app)/movies",
				pattern: /^\/movies\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 64 },
				endpoint: null
			},
			{
				id: "/(app)/movies/[slug]",
				pattern: /^\/movies\/([^/]+?)\/?$/,
				params: [{"name":"slug","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,3,], errors: [1,,], leaf: 65 },
				endpoint: null
			},
			{
				id: "/(app)/my-studios",
				pattern: /^\/my-studios\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 66 },
				endpoint: null
			},
			{
				id: "/(app)/offline",
				pattern: /^\/offline\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 67 },
				endpoint: null
			},
			{
				id: "/(protected)/parental-controls",
				pattern: /^\/parental-controls\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 114 },
				endpoint: null
			},
			{
				id: "/(app)/plans",
				pattern: /^\/plans\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 68 },
				endpoint: __memo(() => import('./abis-D6BRqEOc.js').then(function (n) { return n._; }))
			},
			{
				id: "/(app)/press",
				pattern: /^\/press\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 69 },
				endpoint: null
			},
			{
				id: "/(app)/privacy",
				pattern: /^\/privacy\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 70 },
				endpoint: null
			},
			{
				id: "/(protected)/profiles",
				pattern: /^\/profiles\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 116 },
				endpoint: null
			},
			{
				id: "/(protected)/profile",
				pattern: /^\/profile\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 115 },
				endpoint: null
			},
			{
				id: "/(app)/search",
				pattern: /^\/search\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 71 },
				endpoint: null
			},
			{
				id: "/(protected)/settings",
				pattern: /^\/settings\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 117 },
				endpoint: null
			},
			{
				id: "/(app)/shows",
				pattern: /^\/shows\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 72 },
				endpoint: null
			},
			{
				id: "/(app)/shows/[slug]",
				pattern: /^\/shows\/([^/]+?)\/?$/,
				params: [{"name":"slug","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,3,], errors: [1,,], leaf: 73 },
				endpoint: null
			},
			{
				id: "/sitemap.xml",
				pattern: /^\/sitemap\.xml\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-byyajHGV.js'))
			},
			{
				id: "/(app)/sponsorships",
				pattern: /^\/sponsorships\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 74 },
				endpoint: null
			},
			{
				id: "/(app)/staking",
				pattern: /^\/staking\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 75 },
				endpoint: null
			},
			{
				id: "/(web3)/subscription",
				pattern: /^\/subscription\/?$/,
				params: [],
				page: { layouts: [0,7,], errors: [1,,], leaf: 120 },
				endpoint: null
			},
			{
				id: "/(app)/terms",
				pattern: /^\/terms\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 76 },
				endpoint: null
			},
			{
				id: "/(web3)/tokens",
				pattern: /^\/tokens\/?$/,
				params: [],
				page: { layouts: [0,7,], errors: [1,,], leaf: 121 },
				endpoint: null
			},
			{
				id: "/(app)/token",
				pattern: /^\/token\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 77 },
				endpoint: null
			},
			{
				id: "/(protected)/users",
				pattern: /^\/users\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 118 },
				endpoint: null
			},
			{
				id: "/(web3)/wallet",
				pattern: /^\/wallet\/?$/,
				params: [],
				page: { layouts: [0,7,], errors: [1,,], leaf: 122 },
				endpoint: null
			},
			{
				id: "/(protected)/watchlist",
				pattern: /^\/watchlist\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 119 },
				endpoint: null
			},
			{
				id: "/watch/live/[id]",
				pattern: /^\/watch\/live\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 133 },
				endpoint: null
			},
			{
				id: "/watch/[id]",
				pattern: /^\/watch\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 134 },
				endpoint: null
			},
			{
				id: "/(app)/webinars",
				pattern: /^\/webinars\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 78 },
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
//# sourceMappingURL=manifest.js-CoIl5DLf.js.map
