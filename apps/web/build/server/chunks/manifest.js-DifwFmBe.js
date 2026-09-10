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
		client: {start:"_app/immutable/entry/start.C4gmdPAW.js",app:"_app/immutable/entry/app.CV3yMyaS.js",imports:["_app/immutable/entry/start.C4gmdPAW.js","_app/immutable/chunks/B8N3I6Xu.js","_app/immutable/chunks/BsVwIFTV.js","_app/immutable/chunks/QTnfLwEv.js","_app/immutable/chunks/BuFlayix.js","_app/immutable/chunks/Bc9cMxm7.js","_app/immutable/entry/app.CV3yMyaS.js","_app/immutable/chunks/BsVwIFTV.js","_app/immutable/chunks/QTnfLwEv.js","_app/immutable/chunks/HclGiUj8.js"],stylesheets:["_app/immutable/assets/ui-libs.C1tyNZCz.css","_app/immutable/assets/ui-libs.C1tyNZCz.css"],fonts:[],uses_env_dynamic_public:true},
		nodes: [
			__memo(() => import('./0-CTzbhMZ8.js')),
			__memo(() => import('./1-BuMHWkZP.js')),
			__memo(() => import('./2-Ca9ncQmz.js')),
			__memo(() => import('./3-C6k6eUGW.js')),
			__memo(() => import('./4-DkbUkxkG.js')),
			__memo(() => import('./5-DYZno_4T.js')),
			__memo(() => import('./6-BoPt_vxh.js')),
			__memo(() => import('./7-Cz0wPs6f.js')),
			__memo(() => import('./8-BxvwYuCn.js')),
			__memo(() => import('./9-CqF3RnRH.js')),
			__memo(() => import('./10-C_NMmvBM.js')),
			__memo(() => import('./11-DJUMYxto.js')),
			__memo(() => import('./12-C8wlGbUx.js')),
			__memo(() => import('./13-MXqIKmxv.js')),
			__memo(() => import('./14-BmqYOWpc.js')),
			__memo(() => import('./15-CFnuaPmn.js')),
			__memo(() => import('./16-y0bQu8HJ.js')),
			__memo(() => import('./17-BWAE7HCs.js')),
			__memo(() => import('./18-DdNP81XC.js')),
			__memo(() => import('./19-CrQHK545.js')),
			__memo(() => import('./20-_ijeEWLu.js')),
			__memo(() => import('./21-DObmWC2v.js')),
			__memo(() => import('./22-BOru3Q9l.js')),
			__memo(() => import('./23-y2ARX7CQ.js')),
			__memo(() => import('./24-CeGtY3bi.js')),
			__memo(() => import('./25-CPWq9AXb.js')),
			__memo(() => import('./26-BHjeCBBD.js')),
			__memo(() => import('./27-C4USU99p.js')),
			__memo(() => import('./28-CB5P96wf.js')),
			__memo(() => import('./29-DTNjWpog.js')),
			__memo(() => import('./30-2-fcPFHi.js')),
			__memo(() => import('./31-cN7mmqs6.js')),
			__memo(() => import('./32-CtLtQn46.js')),
			__memo(() => import('./33-DMdccJdl.js')),
			__memo(() => import('./34-Cyg3s3oq.js')),
			__memo(() => import('./35-BZsStj8k.js')),
			__memo(() => import('./36-CgT3kuG7.js')),
			__memo(() => import('./37-Dib8O6cU.js')),
			__memo(() => import('./38-BBvApc8z.js')),
			__memo(() => import('./39-C5LzfZCs.js')),
			__memo(() => import('./40-BstMSgJd.js')),
			__memo(() => import('./41-B07tDcq3.js')),
			__memo(() => import('./42-Cz5OK2bm.js')),
			__memo(() => import('./43-CoYnqpT8.js')),
			__memo(() => import('./44-CrJwA5Ns.js')),
			__memo(() => import('./45-DlbXEMy8.js')),
			__memo(() => import('./46-D2mewNML.js')),
			__memo(() => import('./47-fR6QvyYp.js')),
			__memo(() => import('./48-CtihrlUc.js')),
			__memo(() => import('./49-D_XNS1Xx.js')),
			__memo(() => import('./50-DEtRvf39.js')),
			__memo(() => import('./51-Cy3bOpOD.js')),
			__memo(() => import('./52-DRo0_4oB.js')),
			__memo(() => import('./53-CK2viYjk.js')),
			__memo(() => import('./54-DuLpRgiP.js')),
			__memo(() => import('./55-Da2zGEou.js')),
			__memo(() => import('./56-Df8Gl3XR.js')),
			__memo(() => import('./57-3k2TLgDR.js')),
			__memo(() => import('./58-DdBtq0xC.js')),
			__memo(() => import('./59-DkY9HB1G.js')),
			__memo(() => import('./60-DZzloExo.js')),
			__memo(() => import('./61-Dl_LQ6Ic.js')),
			__memo(() => import('./62-CtDihOsy.js')),
			__memo(() => import('./63-w_WI5RDG.js')),
			__memo(() => import('./64-DotF_h-0.js')),
			__memo(() => import('./65-D6rDOu8I.js')),
			__memo(() => import('./66-BF4aR7Rm.js')),
			__memo(() => import('./67-lsReVNCg.js')),
			__memo(() => import('./68-DkzOruA2.js')),
			__memo(() => import('./69-DXktJ3IP.js')),
			__memo(() => import('./70-BgSbLITm.js')),
			__memo(() => import('./71-di6IqURB.js')),
			__memo(() => import('./72-5N4lPL82.js')),
			__memo(() => import('./73-Bfeeibxa.js')),
			__memo(() => import('./74-DxWTxSkY.js')),
			__memo(() => import('./75-MMQjHFpK.js')),
			__memo(() => import('./76-DiJcMAEV.js')),
			__memo(() => import('./77-DCyFPdyX.js')),
			__memo(() => import('./78-DV264Ivl.js')),
			__memo(() => import('./79-lZZwqLOV.js')),
			__memo(() => import('./80-Uk_ZNp1B.js')),
			__memo(() => import('./81-CgVTcVXX.js')),
			__memo(() => import('./82-BE46xU4s.js')),
			__memo(() => import('./83-BRJ5I1Vv.js')),
			__memo(() => import('./84-CDcTTWkP.js')),
			__memo(() => import('./85-BLw9Y3fd.js')),
			__memo(() => import('./86-DrR2l_h6.js')),
			__memo(() => import('./87-BNp-ZNgF.js')),
			__memo(() => import('./88-DMrBoiI_.js')),
			__memo(() => import('./89-DujkZGUM.js')),
			__memo(() => import('./90-DNAzwytH.js')),
			__memo(() => import('./91-Cn2azf1e.js')),
			__memo(() => import('./92-FERDUxd6.js')),
			__memo(() => import('./93-CP2UAFB5.js')),
			__memo(() => import('./94-BmXJhkRX.js')),
			__memo(() => import('./95-BVx51Dfm.js')),
			__memo(() => import('./96-Wg2yOImI.js')),
			__memo(() => import('./97-Ee7AkFJf.js')),
			__memo(() => import('./98-B1ijIjc-.js')),
			__memo(() => import('./99-CISgpFfr.js')),
			__memo(() => import('./100-B4oaYNB_.js')),
			__memo(() => import('./101-BZRw-1dI.js')),
			__memo(() => import('./102-CNXWtBX-.js')),
			__memo(() => import('./103-C2mNlXo9.js')),
			__memo(() => import('./104-DRCOKloL.js')),
			__memo(() => import('./105-SWZgCbGf.js')),
			__memo(() => import('./106-CQFZC7Pr.js')),
			__memo(() => import('./107-Cz8TSjnc.js')),
			__memo(() => import('./108-CTtFoMX6.js')),
			__memo(() => import('./109-dqQqJFbS.js')),
			__memo(() => import('./110-BUZ35of0.js')),
			__memo(() => import('./111-CvEG9mCO.js')),
			__memo(() => import('./112-Bammj3do.js')),
			__memo(() => import('./113-0TKJo2Gm.js')),
			__memo(() => import('./114-DaaWfCS6.js')),
			__memo(() => import('./115-DoJWBOjR.js')),
			__memo(() => import('./116-C4ZKEK1v.js')),
			__memo(() => import('./117-D5ZZ42Re.js')),
			__memo(() => import('./118-CdlWU8FQ.js')),
			__memo(() => import('./119-CluHcUKi.js')),
			__memo(() => import('./120-Bjrh_wyA.js')),
			__memo(() => import('./121-ClKaZjRe.js')),
			__memo(() => import('./122-uVb2kuUR.js')),
			__memo(() => import('./123-lfltnsEx.js')),
			__memo(() => import('./124-BBsp6REO.js')),
			__memo(() => import('./125-Bw6TVfwK.js')),
			__memo(() => import('./126-Bx_V0Wvt.js')),
			__memo(() => import('./127-C2Ts7hxI.js')),
			__memo(() => import('./128-B9pwcYJd.js')),
			__memo(() => import('./129-C5RfLptq.js')),
			__memo(() => import('./130-B5giBaLu.js')),
			__memo(() => import('./131-CNQwG4X_.js')),
			__memo(() => import('./132-ByR1f2QX.js'))
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
				endpoint: __memo(() => import('./_server.ts-Brw9QJNP.js'))
			},
			{
				id: "/api/admin/abuse",
				pattern: /^\/api\/admin\/abuse\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DB0DT7nO.js'))
			},
			{
				id: "/api/admin/abuse/[id]",
				pattern: /^\/api\/admin\/abuse\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-nA_BFsNW.js'))
			},
			{
				id: "/api/admin/admins",
				pattern: /^\/api\/admin\/admins\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DLvD7qQA.js'))
			},
			{
				id: "/api/admin/agent-runs",
				pattern: /^\/api\/admin\/agent-runs\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-lEvJbm_T.js'))
			},
			{
				id: "/api/admin/agents/status",
				pattern: /^\/api\/admin\/agents\/status\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-C1LGkG8U.js'))
			},
			{
				id: "/api/admin/agents/[name]/fire",
				pattern: /^\/api\/admin\/agents\/([^/]+?)\/fire\/?$/,
				params: [{"name":"name","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BlhXiErx.js'))
			},
			{
				id: "/api/admin/ai/config",
				pattern: /^\/api\/admin\/ai\/config\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-dTQSwjxs.js'))
			},
			{
				id: "/api/admin/ai/models",
				pattern: /^\/api\/admin\/ai\/models\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-aD6buLJ3.js'))
			},
			{
				id: "/api/admin/ai/test",
				pattern: /^\/api\/admin\/ai\/test\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BLZweSXd.js'))
			},
			{
				id: "/api/admin/analytics",
				pattern: /^\/api\/admin\/analytics\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CbiCk586.js'))
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
				endpoint: __memo(() => import('./_server.ts-Bxbft9Q5.js'))
			},
			{
				id: "/api/admin/communications/templates",
				pattern: /^\/api\/admin\/communications\/templates\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DgscbYTz.js'))
			},
			{
				id: "/api/admin/content",
				pattern: /^\/api\/admin\/content\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-KIQu2c7H.js'))
			},
			{
				id: "/api/admin/content/bulk",
				pattern: /^\/api\/admin\/content\/bulk\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-C4BSVGv1.js'))
			},
			{
				id: "/api/admin/content/[id]",
				pattern: /^\/api\/admin\/content\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Cq10ECzW.js'))
			},
			{
				id: "/api/admin/content/[id]/assign",
				pattern: /^\/api\/admin\/content\/([^/]+?)\/assign\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-C0katGLE.js'))
			},
			{
				id: "/api/admin/content/[id]/cancel-encode",
				pattern: /^\/api\/admin\/content\/([^/]+?)\/cancel-encode\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DxOThTHL.js'))
			},
			{
				id: "/api/admin/content/[id]/ppv",
				pattern: /^\/api\/admin\/content\/([^/]+?)\/ppv\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-op5My9RP.js'))
			},
			{
				id: "/api/admin/content/[id]/pricing",
				pattern: /^\/api\/admin\/content\/([^/]+?)\/pricing\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-nYLWFfY7.js'))
			},
			{
				id: "/api/admin/content/[id]/publish",
				pattern: /^\/api\/admin\/content\/([^/]+?)\/publish\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CK95E2Fg.js'))
			},
			{
				id: "/api/admin/content/[id]/rescan",
				pattern: /^\/api\/admin\/content\/([^/]+?)\/rescan\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-nqAoIWqr.js'))
			},
			{
				id: "/api/admin/content/[id]/review",
				pattern: /^\/api\/admin\/content\/([^/]+?)\/review\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-C0Dn_i5G.js'))
			},
			{
				id: "/api/admin/content/[id]/thread",
				pattern: /^\/api\/admin\/content\/([^/]+?)\/thread\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CjbE5lAy.js'))
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
				endpoint: __memo(() => import('./_server.ts-C2SXlLGp.js'))
			},
			{
				id: "/api/admin/creator-applications/[id]/review",
				pattern: /^\/api\/admin\/creator-applications\/([^/]+?)\/review\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Bv0DWUYz.js'))
			},
			{
				id: "/api/admin/creators",
				pattern: /^\/api\/admin\/creators\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CgbgLHU0.js'))
			},
			{
				id: "/api/admin/creators/invite",
				pattern: /^\/api\/admin\/creators\/invite\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Whh0KK7P.js'))
			},
			{
				id: "/api/admin/dashboard",
				pattern: /^\/api\/admin\/dashboard\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Db6jRZ5D.js'))
			},
			{
				id: "/api/admin/disputes",
				pattern: /^\/api\/admin\/disputes\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DQiosOUA.js'))
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
				endpoint: __memo(() => import('./_server.ts-Cq9aujJ9.js'))
			},
			{
				id: "/api/admin/encoder/jobs/[mediaId]/cancel",
				pattern: /^\/api\/admin\/encoder\/jobs\/([^/]+?)\/cancel\/?$/,
				params: [{"name":"mediaId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CZHjK0sU.js'))
			},
			{
				id: "/api/admin/encoder/jobs/[mediaId]/retry",
				pattern: /^\/api\/admin\/encoder\/jobs\/([^/]+?)\/retry\/?$/,
				params: [{"name":"mediaId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-FXcVX7ub.js'))
			},
			{
				id: "/api/admin/events",
				pattern: /^\/api\/admin\/events\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CYYNhLpT.js'))
			},
			{
				id: "/api/admin/events/[id]",
				pattern: /^\/api\/admin\/events\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-C7Mf3qMy.js'))
			},
			{
				id: "/api/admin/forum/threads/[id]",
				pattern: /^\/api\/admin\/forum\/threads\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CfBI8opK.js'))
			},
			{
				id: "/api/admin/governance/approve",
				pattern: /^\/api\/admin\/governance\/approve\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-i2JvaH5U.js'))
			},
			{
				id: "/api/admin/governance/audit",
				pattern: /^\/api\/admin\/governance\/audit\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CjKh1vnn.js'))
			},
			{
				id: "/api/admin/governance/emergency/pause",
				pattern: /^\/api\/admin\/governance\/emergency\/pause\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DKWjvBQG.js'))
			},
			{
				id: "/api/admin/governance/execute",
				pattern: /^\/api\/admin\/governance\/execute\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CaUq9UG2.js'))
			},
			{
				id: "/api/admin/governance/proposals",
				pattern: /^\/api\/admin\/governance\/proposals\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-yYGzYa44.js'))
			},
			{
				id: "/api/admin/governance/queue",
				pattern: /^\/api\/admin\/governance\/queue\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-4zhOVGNP.js'))
			},
			{
				id: "/api/admin/governance/reports",
				pattern: /^\/api\/admin\/governance\/reports\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BdshBxWG.js'))
			},
			{
				id: "/api/admin/governance/roles",
				pattern: /^\/api\/admin\/governance\/roles\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-vf34bafj.js'))
			},
			{
				id: "/api/admin/governance/status",
				pattern: /^\/api\/admin\/governance\/status\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-C0gt4m54.js'))
			},
			{
				id: "/api/admin/governance/timelock-queue",
				pattern: /^\/api\/admin\/governance\/timelock-queue\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Dx8uRDUo.js'))
			},
			{
				id: "/api/admin/governance/treasury",
				pattern: /^\/api\/admin\/governance\/treasury\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DOw6l4U1.js'))
			},
			{
				id: "/api/admin/payouts",
				pattern: /^\/api\/admin\/payouts\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DgpSXMoR.js'))
			},
			{
				id: "/api/admin/payouts/[id]/approve",
				pattern: /^\/api\/admin\/payouts\/([^/]+?)\/approve\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-rOg05dgC.js'))
			},
			{
				id: "/api/admin/payouts/[id]/hold",
				pattern: /^\/api\/admin\/payouts\/([^/]+?)\/hold\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DXstsHkQ.js'))
			},
			{
				id: "/api/admin/payouts/[id]/retry",
				pattern: /^\/api\/admin\/payouts\/([^/]+?)\/retry\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DFdk6CDU.js'))
			},
			{
				id: "/api/admin/policies",
				pattern: /^\/api\/admin\/policies\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DQC2BZSi.js'))
			},
			{
				id: "/api/admin/promo/advertisers",
				pattern: /^\/api\/admin\/promo\/advertisers\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DnoWPSq9.js'))
			},
			{
				id: "/api/admin/promo/breaks",
				pattern: /^\/api\/admin\/promo\/breaks\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DFq4c2XU.js'))
			},
			{
				id: "/api/admin/promo/campaigns",
				pattern: /^\/api\/admin\/promo\/campaigns\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BNkfH-zr.js'))
			},
			{
				id: "/api/admin/promo/creatives",
				pattern: /^\/api\/admin\/promo\/creatives\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BLchKECx.js'))
			},
			{
				id: "/api/admin/promo/preview",
				pattern: /^\/api\/admin\/promo\/preview\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DGkdkOqN.js'))
			},
			{
				id: "/api/admin/promo/reports",
				pattern: /^\/api\/admin\/promo\/reports\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CwOOfqeG.js'))
			},
			{
				id: "/api/admin/refunds",
				pattern: /^\/api\/admin\/refunds\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-9Uz5iYPM.js'))
			},
			{
				id: "/api/admin/refunds/lookup",
				pattern: /^\/api\/admin\/refunds\/lookup\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-B6iujMo0.js'))
			},
			{
				id: "/api/admin/reviews",
				pattern: /^\/api\/admin\/reviews\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-nrQlqS2I.js'))
			},
			{
				id: "/api/admin/settings",
				pattern: /^\/api\/admin\/settings\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-B1r0EdP7.js'))
			},
			{
				id: "/api/admin/settings/test-email",
				pattern: /^\/api\/admin\/settings\/test-email\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-B7pWnO8H.js'))
			},
			{
				id: "/api/admin/sponsorships",
				pattern: /^\/api\/admin\/sponsorships\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CqCJM637.js'))
			},
			{
				id: "/api/admin/sponsorships/[id]/review",
				pattern: /^\/api\/admin\/sponsorships\/([^/]+?)\/review\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BNDSaliO.js'))
			},
			{
				id: "/api/admin/stats",
				pattern: /^\/api\/admin\/stats\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-f9p2VEVL.js'))
			},
			{
				id: "/api/admin/success-stories",
				pattern: /^\/api\/admin\/success-stories\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Cjq6Fd1F.js'))
			},
			{
				id: "/api/admin/success-stories/[id]/review",
				pattern: /^\/api\/admin\/success-stories\/([^/]+?)\/review\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Cu7s1ct5.js'))
			},
			{
				id: "/api/admin/support-tickets",
				pattern: /^\/api\/admin\/support-tickets\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CjJe2cYx.js'))
			},
			{
				id: "/api/admin/support-tickets/[id]/review",
				pattern: /^\/api\/admin\/support-tickets\/([^/]+?)\/review\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DPLR2cF5.js'))
			},
			{
				id: "/api/admin/tax-forms",
				pattern: /^\/api\/admin\/tax-forms\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-C18n_Ixb.js'))
			},
			{
				id: "/api/admin/tax-forms/[id]/verify",
				pattern: /^\/api\/admin\/tax-forms\/([^/]+?)\/verify\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BYN_jYnw.js'))
			},
			{
				id: "/api/admin/tokenomics",
				pattern: /^\/api\/admin\/tokenomics\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-zxdzN-Lc.js'))
			},
			{
				id: "/api/admin/tokenomics/distribution",
				pattern: /^\/api\/admin\/tokenomics\/distribution\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DX-Gjdq8.js'))
			},
			{
				id: "/api/admin/users",
				pattern: /^\/api\/admin\/users\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-cKKVxvQF.js'))
			},
			{
				id: "/api/admin/users/stats",
				pattern: /^\/api\/admin\/users\/stats\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-exaXBOWC.js'))
			},
			{
				id: "/api/admin/users/[id]",
				pattern: /^\/api\/admin\/users\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BJvvcknr.js'))
			},
			{
				id: "/api/admin/users/[id]/ban",
				pattern: /^\/api\/admin\/users\/([^/]+?)\/ban\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-B0mPjp4f.js'))
			},
			{
				id: "/api/admin/users/[id]/warn",
				pattern: /^\/api\/admin\/users\/([^/]+?)\/warn\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-D07UjZzG.js'))
			},
			{
				id: "/api/admin/workflow",
				pattern: /^\/api\/admin\/workflow\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Bgn0dcDq.js'))
			},
			{
				id: "/api/admin/workflow/stats",
				pattern: /^\/api\/admin\/workflow\/stats\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DLedspX3.js'))
			},
			{
				id: "/api/ai/admin/classify-abuse",
				pattern: /^\/api\/ai\/admin\/classify-abuse\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-D5M0zYUN.js'))
			},
			{
				id: "/api/ai/admin/draft-message",
				pattern: /^\/api\/ai\/admin\/draft-message\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DPJGRYgP.js'))
			},
			{
				id: "/api/ai/admin/summarize-application",
				pattern: /^\/api\/ai\/admin\/summarize-application\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DBRzra9A.js'))
			},
			{
				id: "/api/ai/companion",
				pattern: /^\/api\/ai\/companion\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts--fh78g1D.js'))
			},
			{
				id: "/api/ai/copilot",
				pattern: /^\/api\/ai\/copilot\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Bb-u2VbM.js'))
			},
			{
				id: "/api/ai/copilot/approve",
				pattern: /^\/api\/ai\/copilot\/approve\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-D0uoeBRl.js'))
			},
			{
				id: "/api/ai/copilot/conversations",
				pattern: /^\/api\/ai\/copilot\/conversations\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-B6PD0n5X.js'))
			},
			{
				id: "/api/ai/creator-insights",
				pattern: /^\/api\/ai\/creator-insights\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-3YP5SsK4.js'))
			},
			{
				id: "/api/ai/moderate",
				pattern: /^\/api\/ai\/moderate\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-WcH1ZcRx.js'))
			},
			{
				id: "/api/ai/nft",
				pattern: /^\/api\/ai\/nft\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-B0W9o8HB.js'))
			},
			{
				id: "/api/ai/search",
				pattern: /^\/api\/ai\/search\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-B82fc09C.js'))
			},
			{
				id: "/api/ai/suggest/chapters",
				pattern: /^\/api\/ai\/suggest\/chapters\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-B8OpsG6_.js'))
			},
			{
				id: "/api/ai/suggest/description",
				pattern: /^\/api\/ai\/suggest\/description\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Dukj9XSQ.js'))
			},
			{
				id: "/api/ai/suggest/review-reply",
				pattern: /^\/api\/ai\/suggest\/review-reply\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CEZNGi4J.js'))
			},
			{
				id: "/api/ai/suggest/title",
				pattern: /^\/api\/ai\/suggest\/title\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-XTO-6n3n.js'))
			},
			{
				id: "/api/ai/tag",
				pattern: /^\/api\/ai\/tag\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-V_ZzAKyU.js'))
			},
			{
				id: "/api/ai/token-score",
				pattern: /^\/api\/ai\/token-score\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BgXKTrKa.js'))
			},
			{
				id: "/api/auth/[...all]",
				pattern: /^\/api\/auth(?:\/([^]*))?\/?$/,
				params: [{"name":"all","optional":false,"rest":true,"chained":true}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-hL6dfpA-.js'))
			},
			{
				id: "/api/catalog/audience/[category]",
				pattern: /^\/api\/catalog\/audience\/([^/]+?)\/?$/,
				params: [{"name":"category","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-D-oqIR1Z.js'))
			},
			{
				id: "/api/catalog/browse",
				pattern: /^\/api\/catalog\/browse\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Yq50OxwO.js'))
			},
			{
				id: "/api/catalog/coming-soon",
				pattern: /^\/api\/catalog\/coming-soon\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-eMQ1ANUd.js'))
			},
			{
				id: "/api/catalog/detail/[scope]/[slug]",
				pattern: /^\/api\/catalog\/detail\/([^/]+?)\/([^/]+?)\/?$/,
				params: [{"name":"scope","optional":false,"rest":false,"chained":false},{"name":"slug","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-4MsVCAQx.js'))
			},
			{
				id: "/api/catalog/[kind]",
				pattern: /^\/api\/catalog\/([^/]+?)\/?$/,
				params: [{"name":"kind","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-avTNJpKD.js'))
			},
			{
				id: "/api/coming-soon",
				pattern: /^\/api\/coming-soon\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-B6Qtmqje.js'))
			},
			{
				id: "/api/coming-soon/[contentId]/notify",
				pattern: /^\/api\/coming-soon\/([^/]+?)\/notify\/?$/,
				params: [{"name":"contentId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-ChimVpC2.js'))
			},
			{
				id: "/api/contact",
				pattern: /^\/api\/contact\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DKuFzB2R.js'))
			},
			{
				id: "/api/content/kids",
				pattern: /^\/api\/content\/kids\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DxqkkGew.js'))
			},
			{
				id: "/api/content/[id]/price",
				pattern: /^\/api\/content\/([^/]+?)\/price\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CTIU9QxZ.js'))
			},
			{
				id: "/api/content/[id]/subtitles",
				pattern: /^\/api\/content\/([^/]+?)\/subtitles\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CawRxYj6.js'))
			},
			{
				id: "/api/content/[id]/thumbnail-click",
				pattern: /^\/api\/content\/([^/]+?)\/thumbnail-click\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BG4mxqc2.js'))
			},
			{
				id: "/api/content/[id]/thumbnail-impression",
				pattern: /^\/api\/content\/([^/]+?)\/thumbnail-impression\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DLNBaouQ.js'))
			},
			{
				id: "/api/creators/[id]/follow",
				pattern: /^\/api\/creators\/([^/]+?)\/follow\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CaG2n7xr.js'))
			},
			{
				id: "/api/creators/[id]/page",
				pattern: /^\/api\/creators\/([^/]+?)\/page\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CJZOYwEQ.js'))
			},
			{
				id: "/api/creator/analytics",
				pattern: /^\/api\/creator\/analytics\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BFvekHYd.js'))
			},
			{
				id: "/api/creator/analytics/stream",
				pattern: /^\/api\/creator\/analytics\/stream\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CMMYsVPZ.js'))
			},
			{
				id: "/api/creator/application",
				pattern: /^\/api\/creator\/application\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-P35LX0Ax.js'))
			},
			{
				id: "/api/creator/content",
				pattern: /^\/api\/creator\/content\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BbS147W6.js'))
			},
			{
				id: "/api/creator/content/bulk",
				pattern: /^\/api\/creator\/content\/bulk\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-D2bA6sCO.js'))
			},
			{
				id: "/api/creator/content/lookup",
				pattern: /^\/api\/creator\/content\/lookup\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-MYBUaXyk.js'))
			},
			{
				id: "/api/creator/content/search",
				pattern: /^\/api\/creator\/content\/search\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BBPiuiV6.js'))
			},
			{
				id: "/api/creator/content/[id]",
				pattern: /^\/api\/creator\/content\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DKpqzc9C.js'))
			},
			{
				id: "/api/creator/content/[id]/duplicate",
				pattern: /^\/api\/creator\/content\/([^/]+?)\/duplicate\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-B_zm14ZT.js'))
			},
			{
				id: "/api/creator/content/[id]/episodes",
				pattern: /^\/api\/creator\/content\/([^/]+?)\/episodes\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts--okdiJ7t.js'))
			},
			{
				id: "/api/creator/content/[id]/episodes/[episodeId]",
				pattern: /^\/api\/creator\/content\/([^/]+?)\/episodes\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false},{"name":"episodeId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BznvV3Fn.js'))
			},
			{
				id: "/api/creator/content/[id]/pricing",
				pattern: /^\/api\/creator\/content\/([^/]+?)\/pricing\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-v1H-Wr10.js'))
			},
			{
				id: "/api/creator/content/[id]/subtitles",
				pattern: /^\/api\/creator\/content\/([^/]+?)\/subtitles\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-0TcUFQd8.js'))
			},
			{
				id: "/api/creator/content/[id]/subtitles/[trackId]",
				pattern: /^\/api\/creator\/content\/([^/]+?)\/subtitles\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false},{"name":"trackId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-zg7dn3mm.js'))
			},
			{
				id: "/api/creator/content/[id]/thread",
				pattern: /^\/api\/creator\/content\/([^/]+?)\/thread\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DvSpsJXp.js'))
			},
			{
				id: "/api/creator/content/[id]/thread/stream",
				pattern: /^\/api\/creator\/content\/([^/]+?)\/thread\/stream\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CSAVLVZE.js'))
			},
			{
				id: "/api/creator/content/[id]/thumbnails",
				pattern: /^\/api\/creator\/content\/([^/]+?)\/thumbnails\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BXkupJKi.js'))
			},
			{
				id: "/api/creator/content/[id]/thumbnails/[vid]",
				pattern: /^\/api\/creator\/content\/([^/]+?)\/thumbnails\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false},{"name":"vid","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-By1BShNo.js'))
			},
			{
				id: "/api/creator/content/[id]/thumbnails/[vid]/promote",
				pattern: /^\/api\/creator\/content\/([^/]+?)\/thumbnails\/([^/]+?)\/promote\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false},{"name":"vid","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-zqq0Tbmj.js'))
			},
			{
				id: "/api/creator/earnings",
				pattern: /^\/api\/creator\/earnings\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-C_5ZWO__.js'))
			},
			{
				id: "/api/creator/encoder-stream",
				pattern: /^\/api\/creator\/encoder-stream\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-3xJuGgwU.js'))
			},
			{
				id: "/api/creator/in-flight-encodes",
				pattern: /^\/api\/creator\/in-flight-encodes\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-jL948xLL.js'))
			},
			{
				id: "/api/creator/live",
				pattern: /^\/api\/creator\/live\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DKMvYeX_.js'))
			},
			{
				id: "/api/creator/live/[id]",
				pattern: /^\/api\/creator\/live\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-C11WVVan.js'))
			},
			{
				id: "/api/creator/messages",
				pattern: /^\/api\/creator\/messages\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BRVUGjvP.js'))
			},
			{
				id: "/api/creator/messages/bulk",
				pattern: /^\/api\/creator\/messages\/bulk\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CQmMg50A.js'))
			},
			{
				id: "/api/creator/messages/[id]/archive",
				pattern: /^\/api\/creator\/messages\/([^/]+?)\/archive\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Bjeu3ka2.js'))
			},
			{
				id: "/api/creator/messages/[id]/read",
				pattern: /^\/api\/creator\/messages\/([^/]+?)\/read\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-qJk_JCC-.js'))
			},
			{
				id: "/api/creator/moderation/forum",
				pattern: /^\/api\/creator\/moderation\/forum\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DB-W1vbw.js'))
			},
			{
				id: "/api/creator/moderation/forum/replies/[id]",
				pattern: /^\/api\/creator\/moderation\/forum\/replies\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BvFhXSDf.js'))
			},
			{
				id: "/api/creator/moderation/forum/threads/[id]",
				pattern: /^\/api\/creator\/moderation\/forum\/threads\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-ckH_AcJG.js'))
			},
			{
				id: "/api/creator/moderation/reviews",
				pattern: /^\/api\/creator\/moderation\/reviews\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-C3IWg1g7.js'))
			},
			{
				id: "/api/creator/moderation/reviews/[id]",
				pattern: /^\/api\/creator\/moderation\/reviews\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CV26s-KA.js'))
			},
			{
				id: "/api/creator/newsletter/subscribe",
				pattern: /^\/api\/creator\/newsletter\/subscribe\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DrwmweVJ.js'))
			},
			{
				id: "/api/creator/payment-preferences",
				pattern: /^\/api\/creator\/payment-preferences\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Dta0hbTa.js'))
			},
			{
				id: "/api/creator/payouts/method",
				pattern: /^\/api\/creator\/payouts\/method\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-d7Kwi1MS.js'))
			},
			{
				id: "/api/creator/payouts/stripe/onboard",
				pattern: /^\/api\/creator\/payouts\/stripe\/onboard\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DNi6kT6U.js'))
			},
			{
				id: "/api/creator/payouts/stripe/status",
				pattern: /^\/api\/creator\/payouts\/stripe\/status\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-NtTFKxce.js'))
			},
			{
				id: "/api/creator/people/lookup",
				pattern: /^\/api\/creator\/people\/lookup\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts--CjufyNc.js'))
			},
			{
				id: "/api/creator/profile",
				pattern: /^\/api\/creator\/profile\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BcseKZWQ.js'))
			},
			{
				id: "/api/creator/stats",
				pattern: /^\/api\/creator\/stats\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DUhvcPXP.js'))
			},
			{
				id: "/api/creator/tax-1099-forms",
				pattern: /^\/api\/creator\/tax-1099-forms\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Ct3EJYRo.js'))
			},
			{
				id: "/api/creator/tax-forms",
				pattern: /^\/api\/creator\/tax-forms\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BgZQw-MX.js'))
			},
			{
				id: "/api/creator/trailer-upload/commit",
				pattern: /^\/api\/creator\/trailer-upload\/commit\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-EorhIHvt.js'))
			},
			{
				id: "/api/creator/trailer-upload/sign",
				pattern: /^\/api\/creator\/trailer-upload\/sign\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-jMgKgVpo.js'))
			},
			{
				id: "/api/cron/ab-auto-promote",
				pattern: /^\/api\/cron\/ab-auto-promote\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-C5TopicW.js'))
			},
			{
				id: "/api/cron/agents/[name]",
				pattern: /^\/api\/cron\/agents\/([^/]+?)\/?$/,
				params: [{"name":"name","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BWIVpuno.js'))
			},
			{
				id: "/api/cron/analytics-rollup",
				pattern: /^\/api\/cron\/analytics-rollup\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DTjxCP6g.js'))
			},
			{
				id: "/api/cron/creator-payouts",
				pattern: /^\/api\/cron\/creator-payouts\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BEM_WGwJ.js'))
			},
			{
				id: "/api/cron/encoder-poll",
				pattern: /^\/api\/cron\/encoder-poll\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BbToYQAX.js'))
			},
			{
				id: "/api/cron/event-status-sweep",
				pattern: /^\/api\/cron\/event-status-sweep\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-H_vCJdh1.js'))
			},
			{
				id: "/api/cron/meilisearch-reindex",
				pattern: /^\/api\/cron\/meilisearch-reindex\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-P5dOvvp9.js'))
			},
			{
				id: "/api/cron/newsletter-weekly-digest",
				pattern: /^\/api\/cron\/newsletter-weekly-digest\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BTRVWWxm.js'))
			},
			{
				id: "/api/cron/payout-reserve",
				pattern: /^\/api\/cron\/payout-reserve\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BWu-bz9H.js'))
			},
			{
				id: "/api/cron/promo-rollup",
				pattern: /^\/api\/cron\/promo-rollup\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CJslpqzT.js'))
			},
			{
				id: "/api/cron/renew-subscriptions",
				pattern: /^\/api\/cron\/renew-subscriptions\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-VvZXYXtq.js'))
			},
			{
				id: "/api/cron/scheduled-publish",
				pattern: /^\/api\/cron\/scheduled-publish\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-C_pVr2lg.js'))
			},
			{
				id: "/api/cron/settlement-reconcile",
				pattern: /^\/api\/cron\/settlement-reconcile\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-C7irH03g.js'))
			},
			{
				id: "/api/cron/staking-indexer",
				pattern: /^\/api\/cron\/staking-indexer\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-D1ysMckU.js'))
			},
			{
				id: "/api/cron/stc-settle",
				pattern: /^\/api\/cron\/stc-settle\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BN0tgN0M.js'))
			},
			{
				id: "/api/cron/tax-1099-generate",
				pattern: /^\/api\/cron\/tax-1099-generate\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-ByXPelz1.js'))
			},
			{
				id: "/api/downloads/manifest/[id]",
				pattern: /^\/api\/downloads\/manifest\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-B_LTomOK.js'))
			},
			{
				id: "/api/encoder/job-state/[jobId]",
				pattern: /^\/api\/encoder\/job-state\/([^/]+?)\/?$/,
				params: [{"name":"jobId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BJFYVcFe.js'))
			},
			{
				id: "/api/encoder/jobs",
				pattern: /^\/api\/encoder\/jobs\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-B9LTxpg7.js'))
			},
			{
				id: "/api/encoder/jobs/[jobId]",
				pattern: /^\/api\/encoder\/jobs\/([^/]+?)\/?$/,
				params: [{"name":"jobId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-L70XJC2T.js'))
			},
			{
				id: "/api/encoder/jobs/[jobId]/commit",
				pattern: /^\/api\/encoder\/jobs\/([^/]+?)\/commit\/?$/,
				params: [{"name":"jobId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Dmva2BA4.js'))
			},
			{
				id: "/api/encoder/jobs/[jobId]/playback",
				pattern: /^\/api\/encoder\/jobs\/([^/]+?)\/playback\/?$/,
				params: [{"name":"jobId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BZtGqXZL.js'))
			},
			{
				id: "/api/encoder/live-finalize",
				pattern: /^\/api\/encoder\/live-finalize\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BOOdF_42.js'))
			},
			{
				id: "/api/encoder/live-state",
				pattern: /^\/api\/encoder\/live-state\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-C-ebS6QE.js'))
			},
			{
				id: "/api/encoder/live-state/validate",
				pattern: /^\/api\/encoder\/live-state\/validate\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Z-JTVA2m.js'))
			},
			{
				id: "/api/encoder/pending",
				pattern: /^\/api\/encoder\/pending\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BVMJzbCU.js'))
			},
			{
				id: "/api/encoder/presigned",
				pattern: /^\/api\/encoder\/presigned\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DYB-7udi.js'))
			},
			{
				id: "/api/encoder/process",
				pattern: /^\/api\/encoder\/process\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Cw44WcSz.js'))
			},
			{
				id: "/api/encoder/ready",
				pattern: /^\/api\/encoder\/ready\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DAy_A6YX.js'))
			},
			{
				id: "/api/encoder/scan-ready",
				pattern: /^\/api\/encoder\/scan-ready\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CZC8C8-y.js'))
			},
			{
				id: "/api/encoder/webhook",
				pattern: /^\/api\/encoder\/webhook\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DX6vcLb4.js'))
			},
			{
				id: "/api/events",
				pattern: /^\/api\/events\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DBmzzOLs.js'))
			},
			{
				id: "/api/events/feed.ics",
				pattern: /^\/api\/events\/feed\.ics\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Ba4N3i2e.js'))
			},
			{
				id: "/api/events/[id]",
				pattern: /^\/api\/events\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CKYrtgiX.js'))
			},
			{
				id: "/api/events/[id]/register",
				pattern: /^\/api\/events\/([^/]+?)\/register\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-vm_yZA1R.js'))
			},
			{
				id: "/api/files",
				pattern: /^\/api\/files\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-5aDWJpmh.js'))
			},
			{
				id: "/api/files/commit",
				pattern: /^\/api\/files\/commit\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-B-954aSW.js'))
			},
			{
				id: "/api/files/sign",
				pattern: /^\/api\/files\/sign\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-D9RtbxGl.js'))
			},
			{
				id: "/api/forum/replies/[id]",
				pattern: /^\/api\/forum\/replies\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CMvMYnzO.js'))
			},
			{
				id: "/api/forum/replies/[id]/like",
				pattern: /^\/api\/forum\/replies\/([^/]+?)\/like\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-D3M-h0a2.js'))
			},
			{
				id: "/api/forum/threads",
				pattern: /^\/api\/forum\/threads\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-D7HGjJwB.js'))
			},
			{
				id: "/api/forum/threads/[id]",
				pattern: /^\/api\/forum\/threads\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Dtq8RmHO.js'))
			},
			{
				id: "/api/forum/threads/[id]/like",
				pattern: /^\/api\/forum\/threads\/([^/]+?)\/like\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-7AhHCm0N.js'))
			},
			{
				id: "/api/forum/threads/[id]/replies",
				pattern: /^\/api\/forum\/threads\/([^/]+?)\/replies\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BjglLw8B.js'))
			},
			{
				id: "/api/health",
				pattern: /^\/api\/health\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DxR6NnS7.js'))
			},
			{
				id: "/api/home",
				pattern: /^\/api\/home\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DCJx_8T9.js'))
			},
			{
				id: "/api/internal/refunds/sweep-pending",
				pattern: /^\/api\/internal\/refunds\/sweep-pending\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BaoLgwO8.js'))
			},
			{
				id: "/api/kids/quiz/generate",
				pattern: /^\/api\/kids\/quiz\/generate\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Du3fsXUG.js'))
			},
			{
				id: "/api/kids/quiz/submit",
				pattern: /^\/api\/kids\/quiz\/submit\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-iCsGOfNT.js'))
			},
			{
				id: "/api/live/[streamId]/chat",
				pattern: /^\/api\/live\/([^/]+?)\/chat\/?$/,
				params: [{"name":"streamId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BtXrVzEc.js'))
			},
			{
				id: "/api/live/[streamId]/chat/stream",
				pattern: /^\/api\/live\/([^/]+?)\/chat\/stream\/?$/,
				params: [{"name":"streamId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CbcVAWOp.js'))
			},
			{
				id: "/api/live/[streamId]/chat/[messageId]",
				pattern: /^\/api\/live\/([^/]+?)\/chat\/([^/]+?)\/?$/,
				params: [{"name":"streamId","optional":false,"rest":false,"chained":false},{"name":"messageId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-D8W6EAzI.js'))
			},
			{
				id: "/api/milestones",
				pattern: /^\/api\/milestones\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BU3E79e7.js'))
			},
			{
				id: "/api/my-list/[contentId]",
				pattern: /^\/api\/my-list\/([^/]+?)\/?$/,
				params: [{"name":"contentId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BIfGojEz.js'))
			},
			{
				id: "/api/notifications",
				pattern: /^\/api\/notifications\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CK8MjQ2i.js'))
			},
			{
				id: "/api/notifications/preferences",
				pattern: /^\/api\/notifications\/preferences\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DMVJTzwV.js'))
			},
			{
				id: "/api/notifications/[id]",
				pattern: /^\/api\/notifications\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-D4ZeEF1k.js'))
			},
			{
				id: "/api/notifications/[id]/read",
				pattern: /^\/api\/notifications\/([^/]+?)\/read\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-zIKfMq_x.js'))
			},
			{
				id: "/api/parental/report",
				pattern: /^\/api\/parental\/report\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-C96vDTJi.js'))
			},
			{
				id: "/api/payment/initialize",
				pattern: /^\/api\/payment\/initialize\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Rlik6LEE.js'))
			},
			{
				id: "/api/payment/verify",
				pattern: /^\/api\/payment\/verify\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Cskv_w-N.js'))
			},
			{
				id: "/api/payment/webhook",
				pattern: /^\/api\/payment\/webhook\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BeyfGHOH.js'))
			},
			{
				id: "/api/platform-settings",
				pattern: /^\/api\/platform-settings\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DFpH5T4A.js'))
			},
			{
				id: "/api/playback/live/[id]",
				pattern: /^\/api\/playback\/live\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Ct-nW0P5.js'))
			},
			{
				id: "/api/playback/[id]",
				pattern: /^\/api\/playback\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BPnCLHpc.js'))
			},
			{
				id: "/api/playlists",
				pattern: /^\/api\/playlists\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-HElP19AR.js'))
			},
			{
				id: "/api/playlists/[id]/items",
				pattern: /^\/api\/playlists\/([^/]+?)\/items\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Buqw62_t.js'))
			},
			{
				id: "/api/ppv/check-access/[contentId]",
				pattern: /^\/api\/ppv\/check-access\/([^/]+?)\/?$/,
				params: [{"name":"contentId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-C2WvjhhJ.js'))
			},
			{
				id: "/api/ppv/purchase",
				pattern: /^\/api\/ppv\/purchase\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-yOkF2FQe.js'))
			},
			{
				id: "/api/ppv/refund",
				pattern: /^\/api\/ppv\/refund\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Bskvoffx.js'))
			},
			{
				id: "/api/profiles",
				pattern: /^\/api\/profiles\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-C_Z1S0i3.js'))
			},
			{
				id: "/api/profiles/current",
				pattern: /^\/api\/profiles\/current\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-8k1lOhU7.js'))
			},
			{
				id: "/api/profiles/overview",
				pattern: /^\/api\/profiles\/overview\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-iTiVWJv5.js'))
			},
			{
				id: "/api/profiles/[id]",
				pattern: /^\/api\/profiles\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DtHfwa6A.js'))
			},
			{
				id: "/api/profiles/[id]/pin",
				pattern: /^\/api\/profiles\/([^/]+?)\/pin\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-C-E1gSL6.js'))
			},
			{
				id: "/api/promo/decision",
				pattern: /^\/api\/promo\/decision\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-ZQkqAE--.js'))
			},
			{
				id: "/api/promo/e",
				pattern: /^\/api\/promo\/e\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DbXvVCzY.js'))
			},
			{
				id: "/api/promo/plan",
				pattern: /^\/api\/promo\/plan\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BnuhWgEY.js'))
			},
			{
				id: "/api/promo/vast-tag",
				pattern: /^\/api\/promo\/vast-tag\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-pQZRWhP-.js'))
			},
			{
				id: "/api/push/subscribe",
				pattern: /^\/api\/push\/subscribe\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-C14cdln5.js'))
			},
			{
				id: "/api/recommendations",
				pattern: /^\/api\/recommendations\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CiK2i-To.js'))
			},
			{
				id: "/api/reports",
				pattern: /^\/api\/reports\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CtWznOtl.js'))
			},
			{
				id: "/api/reviews",
				pattern: /^\/api\/reviews\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DKqc6fIV.js'))
			},
			{
				id: "/api/reviews/[id]/helpful",
				pattern: /^\/api\/reviews\/([^/]+?)\/helpful\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BXXuGPB7.js'))
			},
			{
				id: "/api/search",
				pattern: /^\/api\/search\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CNQZFAHn.js'))
			},
			{
				id: "/api/shares",
				pattern: /^\/api\/shares\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Lh8dIT7m.js'))
			},
			{
				id: "/api/sponsorships",
				pattern: /^\/api\/sponsorships\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CvXleCTq.js'))
			},
			{
				id: "/api/subscriptions/add-family",
				pattern: /^\/api\/subscriptions\/add-family\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-2cIBt1bk.js'))
			},
			{
				id: "/api/subscriptions/cancel",
				pattern: /^\/api\/subscriptions\/cancel\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BWPcVm0j.js'))
			},
			{
				id: "/api/subscriptions/change-plan",
				pattern: /^\/api\/subscriptions\/change-plan\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DWWn5sTX.js'))
			},
			{
				id: "/api/subscriptions/send-otp",
				pattern: /^\/api\/subscriptions\/send-otp\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-1gz2K8rc.js'))
			},
			{
				id: "/api/subscriptions/start-free",
				pattern: /^\/api\/subscriptions\/start-free\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-D9wwKzxc.js'))
			},
			{
				id: "/api/subscriptions/start-trial",
				pattern: /^\/api\/subscriptions\/start-trial\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BXQ_Y8oU.js'))
			},
			{
				id: "/api/subscriptions/status",
				pattern: /^\/api\/subscriptions\/status\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-edpTdJLz.js'))
			},
			{
				id: "/api/success-stories",
				pattern: /^\/api\/success-stories\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-C0P4judP.js'))
			},
			{
				id: "/api/support/tickets",
				pattern: /^\/api\/support\/tickets\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-iu56FxMq.js'))
			},
			{
				id: "/api/users",
				pattern: /^\/api\/users\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DXYzAVp6.js'))
			},
			{
				id: "/api/users/me/auth-providers",
				pattern: /^\/api\/users\/me\/auth-providers\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-B5LumD9p.js'))
			},
			{
				id: "/api/users/me/stc-balance",
				pattern: /^\/api\/users\/me\/stc-balance\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DPNL3jv6.js'))
			},
			{
				id: "/api/users/me/stc-claim",
				pattern: /^\/api\/users\/me\/stc-claim\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-BvqwpdNW.js'))
			},
			{
				id: "/api/users/[id]",
				pattern: /^\/api\/users\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-X485WZDX.js'))
			},
			{
				id: "/api/user/profile",
				pattern: /^\/api\/user\/profile\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DyzLhQT9.js'))
			},
			{
				id: "/api/watch/active",
				pattern: /^\/api\/watch\/active\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-0cv7voL4.js'))
			},
			{
				id: "/api/watch/history",
				pattern: /^\/api\/watch\/history\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-ldAWP7kU.js'))
			},
			{
				id: "/api/watch/live/[id]/stream",
				pattern: /^\/api\/watch\/live\/([^/]+?)\/stream\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-fBkvz9v7.js'))
			},
			{
				id: "/api/watch/mark/[contentId]",
				pattern: /^\/api\/watch\/mark\/([^/]+?)\/?$/,
				params: [{"name":"contentId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-CYbUT_YD.js'))
			},
			{
				id: "/api/watch/progress",
				pattern: /^\/api\/watch\/progress\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-DEnlgHua.js'))
			},
			{
				id: "/api/watch/[videoId]",
				pattern: /^\/api\/watch\/([^/]+?)\/?$/,
				params: [{"name":"videoId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./_server.ts-D8GHUUAF.js'))
			},
			{
				id: "/api/webhooks/stripe",
				pattern: /^\/api\/webhooks\/stripe\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./_server.ts-Bd4c6wsZ.js'))
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
				endpoint: __memo(() => import('./_server.ts-CEMbxlLy.js'))
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
//# sourceMappingURL=manifest.js-DifwFmBe.js.map
