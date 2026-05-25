export const manifest = (() => {
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
		client: {start:"_app/immutable/entry/start.dyziKMPQ.js",app:"_app/immutable/entry/app.CYE3P7UU.js",imports:["_app/immutable/entry/start.dyziKMPQ.js","_app/immutable/chunks/_r6ywi_I.js","_app/immutable/chunks/Dm3kmBgO.js","_app/immutable/entry/app.CYE3P7UU.js","_app/immutable/chunks/PPVm8Dsz.js","_app/immutable/chunks/Dm3kmBgO.js"],stylesheets:["_app/immutable/assets/ui-libs.BmaF0Alh.css","_app/immutable/assets/ui-libs.BmaF0Alh.css"],fonts:[],uses_env_dynamic_public:true},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js')),
			__memo(() => import('./nodes/6.js')),
			__memo(() => import('./nodes/7.js')),
			__memo(() => import('./nodes/8.js')),
			__memo(() => import('./nodes/9.js')),
			__memo(() => import('./nodes/10.js')),
			__memo(() => import('./nodes/11.js')),
			__memo(() => import('./nodes/12.js')),
			__memo(() => import('./nodes/13.js')),
			__memo(() => import('./nodes/14.js')),
			__memo(() => import('./nodes/15.js')),
			__memo(() => import('./nodes/16.js')),
			__memo(() => import('./nodes/17.js')),
			__memo(() => import('./nodes/18.js')),
			__memo(() => import('./nodes/19.js')),
			__memo(() => import('./nodes/20.js')),
			__memo(() => import('./nodes/21.js')),
			__memo(() => import('./nodes/22.js')),
			__memo(() => import('./nodes/23.js')),
			__memo(() => import('./nodes/24.js')),
			__memo(() => import('./nodes/25.js')),
			__memo(() => import('./nodes/26.js')),
			__memo(() => import('./nodes/27.js')),
			__memo(() => import('./nodes/28.js')),
			__memo(() => import('./nodes/29.js')),
			__memo(() => import('./nodes/30.js')),
			__memo(() => import('./nodes/31.js')),
			__memo(() => import('./nodes/32.js')),
			__memo(() => import('./nodes/33.js')),
			__memo(() => import('./nodes/34.js')),
			__memo(() => import('./nodes/35.js')),
			__memo(() => import('./nodes/36.js')),
			__memo(() => import('./nodes/37.js')),
			__memo(() => import('./nodes/38.js')),
			__memo(() => import('./nodes/39.js')),
			__memo(() => import('./nodes/40.js')),
			__memo(() => import('./nodes/41.js')),
			__memo(() => import('./nodes/42.js')),
			__memo(() => import('./nodes/43.js')),
			__memo(() => import('./nodes/44.js')),
			__memo(() => import('./nodes/45.js')),
			__memo(() => import('./nodes/46.js')),
			__memo(() => import('./nodes/47.js')),
			__memo(() => import('./nodes/48.js')),
			__memo(() => import('./nodes/49.js')),
			__memo(() => import('./nodes/50.js')),
			__memo(() => import('./nodes/51.js')),
			__memo(() => import('./nodes/52.js')),
			__memo(() => import('./nodes/53.js')),
			__memo(() => import('./nodes/54.js')),
			__memo(() => import('./nodes/55.js')),
			__memo(() => import('./nodes/56.js')),
			__memo(() => import('./nodes/57.js')),
			__memo(() => import('./nodes/58.js')),
			__memo(() => import('./nodes/59.js')),
			__memo(() => import('./nodes/60.js')),
			__memo(() => import('./nodes/61.js')),
			__memo(() => import('./nodes/62.js')),
			__memo(() => import('./nodes/63.js')),
			__memo(() => import('./nodes/64.js')),
			__memo(() => import('./nodes/65.js')),
			__memo(() => import('./nodes/66.js')),
			__memo(() => import('./nodes/67.js')),
			__memo(() => import('./nodes/68.js')),
			__memo(() => import('./nodes/69.js')),
			__memo(() => import('./nodes/70.js')),
			__memo(() => import('./nodes/71.js')),
			__memo(() => import('./nodes/72.js')),
			__memo(() => import('./nodes/73.js')),
			__memo(() => import('./nodes/74.js')),
			__memo(() => import('./nodes/75.js')),
			__memo(() => import('./nodes/76.js')),
			__memo(() => import('./nodes/77.js')),
			__memo(() => import('./nodes/78.js')),
			__memo(() => import('./nodes/79.js')),
			__memo(() => import('./nodes/80.js')),
			__memo(() => import('./nodes/81.js')),
			__memo(() => import('./nodes/82.js')),
			__memo(() => import('./nodes/83.js')),
			__memo(() => import('./nodes/84.js')),
			__memo(() => import('./nodes/85.js')),
			__memo(() => import('./nodes/86.js')),
			__memo(() => import('./nodes/87.js')),
			__memo(() => import('./nodes/88.js')),
			__memo(() => import('./nodes/89.js')),
			__memo(() => import('./nodes/90.js')),
			__memo(() => import('./nodes/91.js')),
			__memo(() => import('./nodes/92.js')),
			__memo(() => import('./nodes/93.js')),
			__memo(() => import('./nodes/94.js')),
			__memo(() => import('./nodes/95.js')),
			__memo(() => import('./nodes/96.js')),
			__memo(() => import('./nodes/97.js')),
			__memo(() => import('./nodes/98.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/(app)",
				pattern: /^\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 32 },
				endpoint: null
			},
			{
				id: "/(app)/about",
				pattern: /^\/about\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 33 },
				endpoint: null
			},
			{
				id: "/(protected)/achievements",
				pattern: /^\/achievements\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 78 },
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
				id: "/(admin)/admin/analytics",
				pattern: /^\/admin\/analytics\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/communications",
				pattern: /^\/admin\/communications\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 12 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/content",
				pattern: /^\/admin\/content\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 13 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/creator-applications",
				pattern: /^\/admin\/creator-applications\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 14 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/creators",
				pattern: /^\/admin\/creators\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 15 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/dashboard",
				pattern: /^\/admin\/dashboard\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 16 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/governance",
				pattern: /^\/admin\/governance\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 17 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/governance/create",
				pattern: /^\/admin\/governance\/create\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 18 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/governance/emergency",
				pattern: /^\/admin\/governance\/emergency\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 19 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/governance/execution",
				pattern: /^\/admin\/governance\/execution\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 20 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/governance/proposals",
				pattern: /^\/admin\/governance\/proposals\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 21 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/governance/reports",
				pattern: /^\/admin\/governance\/reports\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 22 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/governance/roles",
				pattern: /^\/admin\/governance\/roles\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 23 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/governance/treasury",
				pattern: /^\/admin\/governance\/treasury\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 24 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/policies",
				pattern: /^\/admin\/policies\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 25 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/review",
				pattern: /^\/admin\/review\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 26 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/review/[id]",
				pattern: /^\/admin\/review\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 27 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/settings",
				pattern: /^\/admin\/settings\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 28 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/test",
				pattern: /^\/admin\/test\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 29 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/tokenomics",
				pattern: /^\/admin\/tokenomics\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 30 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/workflow",
				pattern: /^\/admin\/workflow\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 31 },
				endpoint: null
			},
			{
				id: "/api/achievements",
				pattern: /^\/api\/achievements\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/achievements/_server.ts.js'))
			},
			{
				id: "/api/admin/ai/config",
				pattern: /^\/api\/admin\/ai\/config\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/admin/ai/config/_server.ts.js'))
			},
			{
				id: "/api/admin/ai/models",
				pattern: /^\/api\/admin\/ai\/models\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/admin/ai/models/_server.ts.js'))
			},
			{
				id: "/api/admin/ai/test",
				pattern: /^\/api\/admin\/ai\/test\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/admin/ai/test/_server.ts.js'))
			},
			{
				id: "/api/admin/analytics",
				pattern: /^\/api\/admin\/analytics\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/admin/analytics/_server.ts.js'))
			},
			{
				id: "/api/admin/communications",
				pattern: /^\/api\/admin\/communications\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/admin/communications/_server.ts.js'))
			},
			{
				id: "/api/admin/communications/templates",
				pattern: /^\/api\/admin\/communications\/templates\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/admin/communications/templates/_server.ts.js'))
			},
			{
				id: "/api/admin/content",
				pattern: /^\/api\/admin\/content\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/admin/content/_server.ts.js'))
			},
			{
				id: "/api/admin/content/[id]",
				pattern: /^\/api\/admin\/content\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/admin/content/_id_/_server.ts.js'))
			},
			{
				id: "/api/admin/content/[id]/ppv",
				pattern: /^\/api\/admin\/content\/([^/]+?)\/ppv\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/admin/content/_id_/ppv/_server.ts.js'))
			},
			{
				id: "/api/admin/content/[id]/publish",
				pattern: /^\/api\/admin\/content\/([^/]+?)\/publish\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/admin/content/_id_/publish/_server.ts.js'))
			},
			{
				id: "/api/admin/content/[id]/review",
				pattern: /^\/api\/admin\/content\/([^/]+?)\/review\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/admin/content/_id_/review/_server.ts.js'))
			},
			{
				id: "/api/admin/creator-applications",
				pattern: /^\/api\/admin\/creator-applications\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/admin/creator-applications/_server.ts.js'))
			},
			{
				id: "/api/admin/creator-applications/[id]/review",
				pattern: /^\/api\/admin\/creator-applications\/([^/]+?)\/review\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/admin/creator-applications/_id_/review/_server.ts.js'))
			},
			{
				id: "/api/admin/creators",
				pattern: /^\/api\/admin\/creators\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/admin/creators/_server.ts.js'))
			},
			{
				id: "/api/admin/governance/approve",
				pattern: /^\/api\/admin\/governance\/approve\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/admin/governance/approve/_server.ts.js'))
			},
			{
				id: "/api/admin/governance/audit",
				pattern: /^\/api\/admin\/governance\/audit\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/admin/governance/audit/_server.ts.js'))
			},
			{
				id: "/api/admin/governance/emergency/pause",
				pattern: /^\/api\/admin\/governance\/emergency\/pause\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/admin/governance/emergency/pause/_server.ts.js'))
			},
			{
				id: "/api/admin/governance/execute",
				pattern: /^\/api\/admin\/governance\/execute\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/admin/governance/execute/_server.ts.js'))
			},
			{
				id: "/api/admin/governance/proposals",
				pattern: /^\/api\/admin\/governance\/proposals\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/admin/governance/proposals/_server.ts.js'))
			},
			{
				id: "/api/admin/governance/queue",
				pattern: /^\/api\/admin\/governance\/queue\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/admin/governance/queue/_server.ts.js'))
			},
			{
				id: "/api/admin/governance/reports",
				pattern: /^\/api\/admin\/governance\/reports\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/admin/governance/reports/_server.ts.js'))
			},
			{
				id: "/api/admin/governance/roles",
				pattern: /^\/api\/admin\/governance\/roles\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/admin/governance/roles/_server.ts.js'))
			},
			{
				id: "/api/admin/governance/status",
				pattern: /^\/api\/admin\/governance\/status\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/admin/governance/status/_server.ts.js'))
			},
			{
				id: "/api/admin/governance/timelock-queue",
				pattern: /^\/api\/admin\/governance\/timelock-queue\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/admin/governance/timelock-queue/_server.ts.js'))
			},
			{
				id: "/api/admin/governance/treasury",
				pattern: /^\/api\/admin\/governance\/treasury\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/admin/governance/treasury/_server.ts.js'))
			},
			{
				id: "/api/admin/policies",
				pattern: /^\/api\/admin\/policies\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/admin/policies/_server.ts.js'))
			},
			{
				id: "/api/admin/reviews",
				pattern: /^\/api\/admin\/reviews\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/admin/reviews/_server.ts.js'))
			},
			{
				id: "/api/admin/settings",
				pattern: /^\/api\/admin\/settings\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/admin/settings/_server.ts.js'))
			},
			{
				id: "/api/admin/settings/test-email",
				pattern: /^\/api\/admin\/settings\/test-email\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/admin/settings/test-email/_server.ts.js'))
			},
			{
				id: "/api/admin/stats",
				pattern: /^\/api\/admin\/stats\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/admin/stats/_server.ts.js'))
			},
			{
				id: "/api/admin/tokenomics",
				pattern: /^\/api\/admin\/tokenomics\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/admin/tokenomics/_server.ts.js'))
			},
			{
				id: "/api/admin/tokenomics/distribution",
				pattern: /^\/api\/admin\/tokenomics\/distribution\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/admin/tokenomics/distribution/_server.ts.js'))
			},
			{
				id: "/api/admin/users/stats",
				pattern: /^\/api\/admin\/users\/stats\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/admin/users/stats/_server.ts.js'))
			},
			{
				id: "/api/admin/workflow",
				pattern: /^\/api\/admin\/workflow\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/admin/workflow/_server.ts.js'))
			},
			{
				id: "/api/admin/workflow/stats",
				pattern: /^\/api\/admin\/workflow\/stats\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/admin/workflow/stats/_server.ts.js'))
			},
			{
				id: "/api/ai/companion",
				pattern: /^\/api\/ai\/companion\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/ai/companion/_server.ts.js'))
			},
			{
				id: "/api/ai/creator-insights",
				pattern: /^\/api\/ai\/creator-insights\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/ai/creator-insights/_server.ts.js'))
			},
			{
				id: "/api/ai/moderate",
				pattern: /^\/api\/ai\/moderate\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/ai/moderate/_server.ts.js'))
			},
			{
				id: "/api/ai/nft",
				pattern: /^\/api\/ai\/nft\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/ai/nft/_server.ts.js'))
			},
			{
				id: "/api/ai/search",
				pattern: /^\/api\/ai\/search\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/ai/search/_server.ts.js'))
			},
			{
				id: "/api/ai/tag",
				pattern: /^\/api\/ai\/tag\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/ai/tag/_server.ts.js'))
			},
			{
				id: "/api/ai/token-score",
				pattern: /^\/api\/ai\/token-score\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/ai/token-score/_server.ts.js'))
			},
			{
				id: "/api/auth/[...all]",
				pattern: /^\/api\/auth(?:\/([^]*))?\/?$/,
				params: [{"name":"all","optional":false,"rest":true,"chained":true}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/auth/_...all_/_server.ts.js'))
			},
			{
				id: "/api/content/kids",
				pattern: /^\/api\/content\/kids\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/content/kids/_server.ts.js'))
			},
			{
				id: "/api/creator/application",
				pattern: /^\/api\/creator\/application\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/creator/application/_server.ts.js'))
			},
			{
				id: "/api/creator/content",
				pattern: /^\/api\/creator\/content\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/creator/content/_server.ts.js'))
			},
			{
				id: "/api/creator/profile",
				pattern: /^\/api\/creator\/profile\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/creator/profile/_server.ts.js'))
			},
			{
				id: "/api/creator/stats",
				pattern: /^\/api\/creator\/stats\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/creator/stats/_server.ts.js'))
			},
			{
				id: "/api/downloads/manifest/[id]",
				pattern: /^\/api\/downloads\/manifest\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/downloads/manifest/_id_/_server.ts.js'))
			},
			{
				id: "/api/encoder/jobs",
				pattern: /^\/api\/encoder\/jobs\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/encoder/jobs/_server.ts.js'))
			},
			{
				id: "/api/encoder/jobs/[jobId]",
				pattern: /^\/api\/encoder\/jobs\/([^/]+?)\/?$/,
				params: [{"name":"jobId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/encoder/jobs/_jobId_/_server.ts.js'))
			},
			{
				id: "/api/encoder/jobs/[jobId]/commit",
				pattern: /^\/api\/encoder\/jobs\/([^/]+?)\/commit\/?$/,
				params: [{"name":"jobId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/encoder/jobs/_jobId_/commit/_server.ts.js'))
			},
			{
				id: "/api/encoder/jobs/[jobId]/playback",
				pattern: /^\/api\/encoder\/jobs\/([^/]+?)\/playback\/?$/,
				params: [{"name":"jobId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/encoder/jobs/_jobId_/playback/_server.ts.js'))
			},
			{
				id: "/api/encoder/pending",
				pattern: /^\/api\/encoder\/pending\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/encoder/pending/_server.ts.js'))
			},
			{
				id: "/api/encoder/presigned",
				pattern: /^\/api\/encoder\/presigned\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/encoder/presigned/_server.ts.js'))
			},
			{
				id: "/api/encoder/process",
				pattern: /^\/api\/encoder\/process\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/encoder/process/_server.ts.js'))
			},
			{
				id: "/api/encoder/ready",
				pattern: /^\/api\/encoder\/ready\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/encoder/ready/_server.ts.js'))
			},
			{
				id: "/api/files",
				pattern: /^\/api\/files\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/files/_server.ts.js'))
			},
			{
				id: "/api/kids/quiz/generate",
				pattern: /^\/api\/kids\/quiz\/generate\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/kids/quiz/generate/_server.ts.js'))
			},
			{
				id: "/api/kids/quiz/submit",
				pattern: /^\/api\/kids\/quiz\/submit\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/kids/quiz/submit/_server.ts.js'))
			},
			{
				id: "/api/milestones",
				pattern: /^\/api\/milestones\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/milestones/_server.ts.js'))
			},
			{
				id: "/api/notifications/preferences",
				pattern: /^\/api\/notifications\/preferences\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/notifications/preferences/_server.ts.js'))
			},
			{
				id: "/api/parental/report",
				pattern: /^\/api\/parental\/report\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/parental/report/_server.ts.js'))
			},
			{
				id: "/api/payment/initialize",
				pattern: /^\/api\/payment\/initialize\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/payment/initialize/_server.ts.js'))
			},
			{
				id: "/api/payment/verify",
				pattern: /^\/api\/payment\/verify\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/payment/verify/_server.ts.js'))
			},
			{
				id: "/api/payment/webhook",
				pattern: /^\/api\/payment\/webhook\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/payment/webhook/_server.ts.js'))
			},
			{
				id: "/api/playlists",
				pattern: /^\/api\/playlists\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/playlists/_server.ts.js'))
			},
			{
				id: "/api/playlists/[id]/items",
				pattern: /^\/api\/playlists\/([^/]+?)\/items\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/playlists/_id_/items/_server.ts.js'))
			},
			{
				id: "/api/ppv/check-access/[contentId]",
				pattern: /^\/api\/ppv\/check-access\/([^/]+?)\/?$/,
				params: [{"name":"contentId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/ppv/check-access/_contentId_/_server.ts.js'))
			},
			{
				id: "/api/ppv/purchase",
				pattern: /^\/api\/ppv\/purchase\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/ppv/purchase/_server.ts.js'))
			},
			{
				id: "/api/profiles",
				pattern: /^\/api\/profiles\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/profiles/_server.ts.js'))
			},
			{
				id: "/api/profiles/[id]",
				pattern: /^\/api\/profiles\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/profiles/_id_/_server.ts.js'))
			},
			{
				id: "/api/profiles/[id]/pin",
				pattern: /^\/api\/profiles\/([^/]+?)\/pin\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/profiles/_id_/pin/_server.ts.js'))
			},
			{
				id: "/api/recommendations",
				pattern: /^\/api\/recommendations\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/recommendations/_server.ts.js'))
			},
			{
				id: "/api/reviews",
				pattern: /^\/api\/reviews\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/reviews/_server.ts.js'))
			},
			{
				id: "/api/reviews/[id]/helpful",
				pattern: /^\/api\/reviews\/([^/]+?)\/helpful\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/reviews/_id_/helpful/_server.ts.js'))
			},
			{
				id: "/api/subscriptions/add-family",
				pattern: /^\/api\/subscriptions\/add-family\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/subscriptions/add-family/_server.ts.js'))
			},
			{
				id: "/api/subscriptions/cancel",
				pattern: /^\/api\/subscriptions\/cancel\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/subscriptions/cancel/_server.ts.js'))
			},
			{
				id: "/api/subscriptions/change-plan",
				pattern: /^\/api\/subscriptions\/change-plan\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/subscriptions/change-plan/_server.ts.js'))
			},
			{
				id: "/api/subscriptions/send-otp",
				pattern: /^\/api\/subscriptions\/send-otp\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/subscriptions/send-otp/_server.ts.js'))
			},
			{
				id: "/api/subscriptions/start-trial",
				pattern: /^\/api\/subscriptions\/start-trial\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/subscriptions/start-trial/_server.ts.js'))
			},
			{
				id: "/api/subscriptions/status",
				pattern: /^\/api\/subscriptions\/status\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/subscriptions/status/_server.ts.js'))
			},
			{
				id: "/api/users",
				pattern: /^\/api\/users\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/users/_server.ts.js'))
			},
			{
				id: "/api/users/[id]",
				pattern: /^\/api\/users\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/users/_id_/_server.ts.js'))
			},
			{
				id: "/api/watch/history",
				pattern: /^\/api\/watch\/history\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/watch/history/_server.ts.js'))
			},
			{
				id: "/api/watch/progress",
				pattern: /^\/api\/watch\/progress\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/watch/progress/_server.ts.js'))
			},
			{
				id: "/api/watch/[videoId]",
				pattern: /^\/api\/watch\/([^/]+?)\/?$/,
				params: [{"name":"videoId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/watch/_videoId_/_server.ts.js'))
			},
			{
				id: "/(app)/apply/creator",
				pattern: /^\/apply\/creator\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 34 },
				endpoint: null
			},
			{
				id: "/(app)/archive",
				pattern: /^\/archive\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 35 },
				endpoint: null
			},
			{
				id: "/(auth)/auth/forget-password",
				pattern: /^\/auth\/forget-password\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,,], leaf: 56 },
				endpoint: null
			},
			{
				id: "/(auth)/auth/forget-password/success",
				pattern: /^\/auth\/forget-password\/success\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,,], leaf: 57 },
				endpoint: null
			},
			{
				id: "/(auth)/auth/login",
				pattern: /^\/auth\/login\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,,], leaf: 58 },
				endpoint: null
			},
			{
				id: "/(auth)/auth/register",
				pattern: /^\/auth\/register\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,,], leaf: 59 },
				endpoint: null
			},
			{
				id: "/(auth)/auth/reset-password",
				pattern: /^\/auth\/reset-password\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,,], leaf: 60 },
				endpoint: null
			},
			{
				id: "/(app)/careers",
				pattern: /^\/careers\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 36 },
				endpoint: null
			},
			{
				id: "/(app)/checkout",
				pattern: /^\/checkout\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 37 },
				endpoint: null
			},
			{
				id: "/(app)/contact",
				pattern: /^\/contact\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 38 },
				endpoint: null
			},
			{
				id: "/(creator)/creator",
				pattern: /^\/creator\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 61 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/agreement",
				pattern: /^\/creator\/agreement\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 62 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/analytics-help",
				pattern: /^\/creator\/analytics-help\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 64 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/analytics",
				pattern: /^\/creator\/analytics\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 63 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/best-practices",
				pattern: /^\/creator\/best-practices\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 65 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/content",
				pattern: /^\/creator\/content\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 66 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/earnings",
				pattern: /^\/creator\/earnings\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 67 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/events",
				pattern: /^\/creator\/events\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 68 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/forum",
				pattern: /^\/creator\/forum\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 69 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/guidelines",
				pattern: /^\/creator\/guidelines\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 70 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/newsletter",
				pattern: /^\/creator\/newsletter\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 71 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/profile",
				pattern: /^\/creator\/profile\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 72 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/success-stories",
				pattern: /^\/creator\/success-stories\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 73 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/support",
				pattern: /^\/creator\/support\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 74 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/tech-support",
				pattern: /^\/creator\/tech-support\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 75 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/test",
				pattern: /^\/creator\/test\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 76 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/upload",
				pattern: /^\/creator\/upload\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 77 },
				endpoint: null
			},
			{
				id: "/(protected)/dashboard",
				pattern: /^\/dashboard\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 79 },
				endpoint: null
			},
			{
				id: "/(app)/device-support",
				pattern: /^\/device-support\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 39 },
				endpoint: null
			},
			{
				id: "/(app)/documentaries",
				pattern: /^\/documentaries\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 40 },
				endpoint: null
			},
			{
				id: "/(protected)/documentation",
				pattern: /^\/documentation\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 80 },
				endpoint: null
			},
			{
				id: "/(app)/faq",
				pattern: /^\/faq\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 41 },
				endpoint: null
			},
			{
				id: "/(app)/features",
				pattern: /^\/features\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 42 },
				endpoint: null
			},
			{
				id: "/(app)/guidelines",
				pattern: /^\/guidelines\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 43 },
				endpoint: null
			},
			{
				id: "/(app)/help",
				pattern: /^\/help\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 44 },
				endpoint: null
			},
			{
				id: "/kids/kiddies",
				pattern: /^\/kids\/kiddies\/?$/,
				params: [],
				page: { layouts: [0,9,], errors: [1,,], leaf: 91 },
				endpoint: null
			},
			{
				id: "/kids/kiddies/bible-quiz",
				pattern: /^\/kids\/kiddies\/bible-quiz\/?$/,
				params: [],
				page: { layouts: [0,9,], errors: [1,,], leaf: 92 },
				endpoint: null
			},
			{
				id: "/kids/kiddies/documentaries",
				pattern: /^\/kids\/kiddies\/documentaries\/?$/,
				params: [],
				page: { layouts: [0,9,], errors: [1,,], leaf: 93 },
				endpoint: null
			},
			{
				id: "/kids/kiddies/movies",
				pattern: /^\/kids\/kiddies\/movies\/?$/,
				params: [],
				page: { layouts: [0,9,], errors: [1,,], leaf: 94 },
				endpoint: null
			},
			{
				id: "/kids/kiddies/profile",
				pattern: /^\/kids\/kiddies\/profile\/?$/,
				params: [],
				page: { layouts: [0,9,], errors: [1,,], leaf: 95 },
				endpoint: null
			},
			{
				id: "/kids/kiddies/shows",
				pattern: /^\/kids\/kiddies\/shows\/?$/,
				params: [],
				page: { layouts: [0,9,], errors: [1,,], leaf: 96 },
				endpoint: null
			},
			{
				id: "/kids/teens",
				pattern: /^\/kids\/teens\/?$/,
				params: [],
				page: { layouts: [0,8,], errors: [1,,], leaf: 97 },
				endpoint: null
			},
			{
				id: "/(app)/mayowa",
				pattern: /^\/mayowa\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 45 },
				endpoint: null
			},
			{
				id: "/(protected)/milestones",
				pattern: /^\/milestones\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 81 },
				endpoint: null
			},
			{
				id: "/(app)/movies",
				pattern: /^\/movies\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 46 },
				endpoint: null
			},
			{
				id: "/(app)/my-studios",
				pattern: /^\/my-studios\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 47 },
				endpoint: null
			},
			{
				id: "/(app)/offline",
				pattern: /^\/offline\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 48 },
				endpoint: null
			},
			{
				id: "/(protected)/parental-controls",
				pattern: /^\/parental-controls\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 82 },
				endpoint: null
			},
			{
				id: "/(app)/plans",
				pattern: /^\/plans\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 49 },
				endpoint: __memo(() => import('./entries/endpoints/(app)/plans/_server.ts.js'))
			},
			{
				id: "/(app)/press",
				pattern: /^\/press\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 50 },
				endpoint: null
			},
			{
				id: "/(app)/privacy",
				pattern: /^\/privacy\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 51 },
				endpoint: null
			},
			{
				id: "/(protected)/profiles",
				pattern: /^\/profiles\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 84 },
				endpoint: null
			},
			{
				id: "/(protected)/profile",
				pattern: /^\/profile\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 83 },
				endpoint: null
			},
			{
				id: "/(protected)/settings",
				pattern: /^\/settings\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 85 },
				endpoint: null
			},
			{
				id: "/(app)/shows",
				pattern: /^\/shows\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 52 },
				endpoint: null
			},
			{
				id: "/(app)/sponsorships",
				pattern: /^\/sponsorships\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 53 },
				endpoint: null
			},
			{
				id: "/(web3)/subscription",
				pattern: /^\/subscription\/?$/,
				params: [],
				page: { layouts: [0,7,], errors: [1,,], leaf: 88 },
				endpoint: null
			},
			{
				id: "/(app)/terms",
				pattern: /^\/terms\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 54 },
				endpoint: null
			},
			{
				id: "/(web3)/tokens",
				pattern: /^\/tokens\/?$/,
				params: [],
				page: { layouts: [0,7,], errors: [1,,], leaf: 89 },
				endpoint: null
			},
			{
				id: "/(app)/token",
				pattern: /^\/token\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 55 },
				endpoint: null
			},
			{
				id: "/(protected)/users",
				pattern: /^\/users\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 86 },
				endpoint: null
			},
			{
				id: "/(web3)/wallet",
				pattern: /^\/wallet\/?$/,
				params: [],
				page: { layouts: [0,7,], errors: [1,,], leaf: 90 },
				endpoint: null
			},
			{
				id: "/(protected)/watchlist",
				pattern: /^\/watchlist\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 87 },
				endpoint: null
			},
			{
				id: "/watch/[id]",
				pattern: /^\/watch\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 98 },
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
