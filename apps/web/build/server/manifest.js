const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["manifest.json","robots.txt"]),
	mimeTypes: {".json":"application/json",".txt":"text/plain"},
	_: {
		client: {start:"_app/immutable/entry/start.Cz3YEuex.js",app:"_app/immutable/entry/app.JcHhIdQA.js",imports:["_app/immutable/entry/start.Cz3YEuex.js","_app/immutable/chunks/DqoD9RWJ.js","_app/immutable/chunks/TpWHEDIq.js","_app/immutable/chunks/DJngHVR0.js","_app/immutable/entry/app.JcHhIdQA.js","_app/immutable/chunks/PPVm8Dsz.js","_app/immutable/chunks/TpWHEDIq.js","_app/immutable/chunks/BQ03z0kT.js","_app/immutable/chunks/CxiJ-Vy5.js","_app/immutable/chunks/C6zGasQL.js","_app/immutable/chunks/BGd3TWsR.js","_app/immutable/chunks/S4pqshPe.js","_app/immutable/chunks/B4lX7oYV.js","_app/immutable/chunks/BTcBi_6o.js","_app/immutable/chunks/B5XzSBQu.js","_app/immutable/chunks/DJngHVR0.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:true},
		nodes: [
			__memo(() => import('./chunks/0-CDBCRcpn.js')),
			__memo(() => import('./chunks/1-GVJDdkDN.js')),
			__memo(() => import('./chunks/2-Cgd65ttW.js')),
			__memo(() => import('./chunks/3-BlpdSH43.js')),
			__memo(() => import('./chunks/4-CGGJjTJs.js')),
			__memo(() => import('./chunks/5-CuUXHlif.js')),
			__memo(() => import('./chunks/6-BWlv-koQ.js')),
			__memo(() => import('./chunks/7-Cnu5aImf.js')),
			__memo(() => import('./chunks/8-DATQTBa9.js')),
			__memo(() => import('./chunks/9-D90Q3huK.js')),
			__memo(() => import('./chunks/10-D4WSTL9J.js')),
			__memo(() => import('./chunks/11-DMaA2WHN.js')),
			__memo(() => import('./chunks/12-qM8DgEey.js')),
			__memo(() => import('./chunks/13-CiR_yvGi.js')),
			__memo(() => import('./chunks/14-PKYEV6zP.js')),
			__memo(() => import('./chunks/15-RQ1vWjtp.js')),
			__memo(() => import('./chunks/16-C7knp91P.js')),
			__memo(() => import('./chunks/17-Zm2_fqlt.js')),
			__memo(() => import('./chunks/18-Dj5dHnV4.js')),
			__memo(() => import('./chunks/19-sCl7ppeJ.js')),
			__memo(() => import('./chunks/20-DT1XeEKQ.js')),
			__memo(() => import('./chunks/21-ywyqG_MY.js')),
			__memo(() => import('./chunks/22-QoIv31cB.js')),
			__memo(() => import('./chunks/23-C4h-X_51.js')),
			__memo(() => import('./chunks/24-D-ZBW2Am.js')),
			__memo(() => import('./chunks/25-DTZorwlq.js')),
			__memo(() => import('./chunks/26-DUpYAKSG.js')),
			__memo(() => import('./chunks/27-B5Mrk9l_.js')),
			__memo(() => import('./chunks/28-DKMuNYSC.js')),
			__memo(() => import('./chunks/29-DgkrYy7c.js')),
			__memo(() => import('./chunks/30-EYld-9Gv.js')),
			__memo(() => import('./chunks/31-laf7_ynM.js')),
			__memo(() => import('./chunks/32-Dav6PAg1.js')),
			__memo(() => import('./chunks/33-w6_RC_ZB.js')),
			__memo(() => import('./chunks/34-r5P-shNa.js')),
			__memo(() => import('./chunks/35-KVxSFolM.js')),
			__memo(() => import('./chunks/36-BJcGVQaB.js')),
			__memo(() => import('./chunks/37-DuE8tE2_.js')),
			__memo(() => import('./chunks/38-DBhM-g5z.js')),
			__memo(() => import('./chunks/39-CTdnetEo.js')),
			__memo(() => import('./chunks/40-CSEEKBWH.js')),
			__memo(() => import('./chunks/41-3aif2EOl.js')),
			__memo(() => import('./chunks/42-Cai7BdbQ.js')),
			__memo(() => import('./chunks/43-B267SlMk.js')),
			__memo(() => import('./chunks/44-M-qAZMyb.js')),
			__memo(() => import('./chunks/45-28IQdSvB.js')),
			__memo(() => import('./chunks/46-C7kOP8Kg.js')),
			__memo(() => import('./chunks/47-DPxbDAGw.js')),
			__memo(() => import('./chunks/48-VEGKMK32.js')),
			__memo(() => import('./chunks/49-BWYZ0kln.js')),
			__memo(() => import('./chunks/50-DXpKuOYt.js')),
			__memo(() => import('./chunks/51-BO4uf3mA.js')),
			__memo(() => import('./chunks/52-BrtB4VP8.js')),
			__memo(() => import('./chunks/53-8ViaumqY.js')),
			__memo(() => import('./chunks/54-BlB0U-pZ.js')),
			__memo(() => import('./chunks/55-D8GnKxGK.js')),
			__memo(() => import('./chunks/56-CjZ-cUP4.js')),
			__memo(() => import('./chunks/57-6vTVXZCH.js')),
			__memo(() => import('./chunks/58-CTsbOmsF.js')),
			__memo(() => import('./chunks/59-DiUO2sne.js')),
			__memo(() => import('./chunks/60-Blqe-LHR.js')),
			__memo(() => import('./chunks/61-y-b4kXFU.js')),
			__memo(() => import('./chunks/62-CqiuQgZr.js')),
			__memo(() => import('./chunks/63-D4vHNiL5.js')),
			__memo(() => import('./chunks/64-B6sH5H6q.js')),
			__memo(() => import('./chunks/65-O-C5FQJY.js')),
			__memo(() => import('./chunks/66-CBscCXhA.js')),
			__memo(() => import('./chunks/67-BMuPDg-X.js')),
			__memo(() => import('./chunks/68-BVSVsvyG.js')),
			__memo(() => import('./chunks/69-N2IoyDFh.js')),
			__memo(() => import('./chunks/70-CNytOkZC.js')),
			__memo(() => import('./chunks/71-BRIHE47F.js')),
			__memo(() => import('./chunks/72-CwSOUgcD.js')),
			__memo(() => import('./chunks/73-B2JFnLuX.js')),
			__memo(() => import('./chunks/74-Cfg-VsRH.js')),
			__memo(() => import('./chunks/75-6nYPin1I.js')),
			__memo(() => import('./chunks/76-Dicjr4xv.js')),
			__memo(() => import('./chunks/77-blHxDfdh.js')),
			__memo(() => import('./chunks/78-DdbtuchD.js')),
			__memo(() => import('./chunks/79-CvnVwbuc.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/(app)",
				pattern: /^\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 22 },
				endpoint: null
			},
			{
				id: "/(app)/about",
				pattern: /^\/about\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 23 },
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
				id: "/(admin)/admin/creators",
				pattern: /^\/admin\/creators\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 14 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/policies",
				pattern: /^\/admin\/policies\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 15 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/review",
				pattern: /^\/admin\/review\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 16 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/review/[id]",
				pattern: /^\/admin\/review\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 17 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/settings",
				pattern: /^\/admin\/settings\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 18 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/test",
				pattern: /^\/admin\/test\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 19 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/tokenomics",
				pattern: /^\/admin\/tokenomics\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 20 },
				endpoint: null
			},
			{
				id: "/(admin)/admin/workflow",
				pattern: /^\/admin\/workflow\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 21 },
				endpoint: null
			},
			{
				id: "/api/auth/[...all]",
				pattern: /^\/api\/auth(?:\/([^]*))?\/?$/,
				params: [{"name":"all","optional":false,"rest":true,"chained":true}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-xqcujNzY.js'))
			},
			{
				id: "/api/files",
				pattern: /^\/api\/files\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-BQECYAZl.js'))
			},
			{
				id: "/api/users",
				pattern: /^\/api\/users\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-Bf0P7hFS.js'))
			},
			{
				id: "/(app)/archive",
				pattern: /^\/archive\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 24 },
				endpoint: null
			},
			{
				id: "/(auth)/auth/forget-password",
				pattern: /^\/auth\/forget-password\/?$/,
				params: [],
				page: { layouts: [0,7,], errors: [1,,], leaf: 54 },
				endpoint: null
			},
			{
				id: "/(auth)/auth/forget-password/success",
				pattern: /^\/auth\/forget-password\/success\/?$/,
				params: [],
				page: { layouts: [0,7,], errors: [1,,], leaf: 55 },
				endpoint: null
			},
			{
				id: "/(auth)/auth/login",
				pattern: /^\/auth\/login\/?$/,
				params: [],
				page: { layouts: [0,7,], errors: [1,,], leaf: 56 },
				endpoint: null
			},
			{
				id: "/(auth)/auth/register",
				pattern: /^\/auth\/register\/?$/,
				params: [],
				page: { layouts: [0,7,], errors: [1,,], leaf: 57 },
				endpoint: null
			},
			{
				id: "/(auth)/auth/reset-password",
				pattern: /^\/auth\/reset-password\/?$/,
				params: [],
				page: { layouts: [0,7,], errors: [1,,], leaf: 58 },
				endpoint: null
			},
			{
				id: "/(app)/contact",
				pattern: /^\/contact\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 25 },
				endpoint: null
			},
			{
				id: "/(creator)/creator",
				pattern: /^\/creator\/?$/,
				params: [],
				page: { layouts: [0,8,], errors: [1,,], leaf: 59 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/agreement",
				pattern: /^\/creator\/agreement\/?$/,
				params: [],
				page: { layouts: [0,8,], errors: [1,,], leaf: 60 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/analytics-help",
				pattern: /^\/creator\/analytics-help\/?$/,
				params: [],
				page: { layouts: [0,8,], errors: [1,,], leaf: 62 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/analytics",
				pattern: /^\/creator\/analytics\/?$/,
				params: [],
				page: { layouts: [0,8,], errors: [1,,], leaf: 61 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/best-practices",
				pattern: /^\/creator\/best-practices\/?$/,
				params: [],
				page: { layouts: [0,8,], errors: [1,,], leaf: 63 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/content",
				pattern: /^\/creator\/content\/?$/,
				params: [],
				page: { layouts: [0,8,], errors: [1,,], leaf: 64 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/earnings",
				pattern: /^\/creator\/earnings\/?$/,
				params: [],
				page: { layouts: [0,8,], errors: [1,,], leaf: 65 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/events",
				pattern: /^\/creator\/events\/?$/,
				params: [],
				page: { layouts: [0,8,], errors: [1,,], leaf: 66 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/forum",
				pattern: /^\/creator\/forum\/?$/,
				params: [],
				page: { layouts: [0,8,], errors: [1,,], leaf: 67 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/guidelines",
				pattern: /^\/creator\/guidelines\/?$/,
				params: [],
				page: { layouts: [0,8,], errors: [1,,], leaf: 68 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/newsletter",
				pattern: /^\/creator\/newsletter\/?$/,
				params: [],
				page: { layouts: [0,8,], errors: [1,,], leaf: 69 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/profile",
				pattern: /^\/creator\/profile\/?$/,
				params: [],
				page: { layouts: [0,8,], errors: [1,,], leaf: 70 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/success-stories",
				pattern: /^\/creator\/success-stories\/?$/,
				params: [],
				page: { layouts: [0,8,], errors: [1,,], leaf: 71 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/support",
				pattern: /^\/creator\/support\/?$/,
				params: [],
				page: { layouts: [0,8,], errors: [1,,], leaf: 72 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/tech-support",
				pattern: /^\/creator\/tech-support\/?$/,
				params: [],
				page: { layouts: [0,8,], errors: [1,,], leaf: 73 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/test",
				pattern: /^\/creator\/test\/?$/,
				params: [],
				page: { layouts: [0,8,], errors: [1,,], leaf: 74 },
				endpoint: null
			},
			{
				id: "/(creator)/creator/upload",
				pattern: /^\/creator\/upload\/?$/,
				params: [],
				page: { layouts: [0,8,], errors: [1,,], leaf: 75 },
				endpoint: null
			},
			{
				id: "/(protected)/dashboard",
				pattern: /^\/dashboard\/?$/,
				params: [],
				page: { layouts: [0,9,], errors: [1,,], leaf: 76 },
				endpoint: null
			},
			{
				id: "/(app)/documentaries",
				pattern: /^\/documentaries\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 26 },
				endpoint: null
			},
			{
				id: "/(protected)/documentation",
				pattern: /^\/documentation\/?$/,
				params: [],
				page: { layouts: [0,9,], errors: [1,,], leaf: 77 },
				endpoint: null
			},
			{
				id: "/(app)/faq",
				pattern: /^\/faq\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 27 },
				endpoint: null
			},
			{
				id: "/(app)/features",
				pattern: /^\/features\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 28 },
				endpoint: null
			},
			{
				id: "/(app)/guidelines",
				pattern: /^\/guidelines\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 29 },
				endpoint: null
			},
			{
				id: "/(app)/help",
				pattern: /^\/help\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 30 },
				endpoint: null
			},
			{
				id: "/(app)/kids",
				pattern: /^\/kids\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,,], leaf: 31 },
				endpoint: null
			},
			{
				id: "/(app)/kids/kiddies",
				pattern: /^\/kids\/kiddies\/?$/,
				params: [],
				page: { layouts: [0,4,5,], errors: [1,,,], leaf: 32 },
				endpoint: null
			},
			{
				id: "/(app)/kids/kiddies/documentaries",
				pattern: /^\/kids\/kiddies\/documentaries\/?$/,
				params: [],
				page: { layouts: [0,4,5,], errors: [1,,,], leaf: 33 },
				endpoint: null
			},
			{
				id: "/(app)/kids/kiddies/movies",
				pattern: /^\/kids\/kiddies\/movies\/?$/,
				params: [],
				page: { layouts: [0,4,5,], errors: [1,,,], leaf: 34 },
				endpoint: null
			},
			{
				id: "/(app)/kids/kiddies/shows",
				pattern: /^\/kids\/kiddies\/shows\/?$/,
				params: [],
				page: { layouts: [0,4,5,], errors: [1,,,], leaf: 35 },
				endpoint: null
			},
			{
				id: "/(app)/kids/profile",
				pattern: /^\/kids\/profile\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,,], leaf: 36 },
				endpoint: null
			},
			{
				id: "/(app)/kids/teens",
				pattern: /^\/kids\/teens\/?$/,
				params: [],
				page: { layouts: [0,4,6,], errors: [1,,,], leaf: 37 },
				endpoint: null
			},
			{
				id: "/(app)/kids/teens/documentaries",
				pattern: /^\/kids\/teens\/documentaries\/?$/,
				params: [],
				page: { layouts: [0,4,6,], errors: [1,,,], leaf: 38 },
				endpoint: null
			},
			{
				id: "/(app)/kids/teens/movies",
				pattern: /^\/kids\/teens\/movies\/?$/,
				params: [],
				page: { layouts: [0,4,6,], errors: [1,,,], leaf: 39 },
				endpoint: null
			},
			{
				id: "/(app)/kids/teens/profile",
				pattern: /^\/kids\/teens\/profile\/?$/,
				params: [],
				page: { layouts: [0,4,6,], errors: [1,,,], leaf: 40 },
				endpoint: null
			},
			{
				id: "/(app)/kids/teens/shows",
				pattern: /^\/kids\/teens\/shows\/?$/,
				params: [],
				page: { layouts: [0,4,6,], errors: [1,,,], leaf: 41 },
				endpoint: null
			},
			{
				id: "/(app)/mayowa",
				pattern: /^\/mayowa\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 42 },
				endpoint: null
			},
			{
				id: "/(app)/movies",
				pattern: /^\/movies\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 43 },
				endpoint: null
			},
			{
				id: "/(app)/my-studios",
				pattern: /^\/my-studios\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 44 },
				endpoint: null
			},
			{
				id: "/(app)/offline",
				pattern: /^\/offline\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 45 },
				endpoint: null
			},
			{
				id: "/(app)/plans",
				pattern: /^\/plans\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 46 },
				endpoint: __memo(() => Promise.resolve().then(function () { return _server_ts; }))
			},
			{
				id: "/(app)/press",
				pattern: /^\/press\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 47 },
				endpoint: null
			},
			{
				id: "/(app)/privacy",
				pattern: /^\/privacy\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 48 },
				endpoint: null
			},
			{
				id: "/(protected)/profile",
				pattern: /^\/profile\/?$/,
				params: [],
				page: { layouts: [0,9,], errors: [1,,], leaf: 78 },
				endpoint: null
			},
			{
				id: "/(app)/shows",
				pattern: /^\/shows\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 49 },
				endpoint: null
			},
			{
				id: "/(app)/sponsorships",
				pattern: /^\/sponsorships\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 50 },
				endpoint: null
			},
			{
				id: "/(app)/subscription",
				pattern: /^\/subscription\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 51 },
				endpoint: null
			},
			{
				id: "/(app)/terms",
				pattern: /^\/terms\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 52 },
				endpoint: null
			},
			{
				id: "/(app)/tokens",
				pattern: /^\/tokens\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 53 },
				endpoint: null
			},
			{
				id: "/(protected)/users",
				pattern: /^\/users\/?$/,
				params: [],
				page: { layouts: [0,9,], errors: [1,,], leaf: 79 },
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

export { base, manifest, prerendered };
//# sourceMappingURL=manifest.js.map
