
import root from '../root.js';
import { set_building, set_prerendering } from '__sveltekit/environment';
import { set_assets } from '$app/paths/internal/server';
import { set_manifest, set_read_implementation } from '__sveltekit/server';
import { set_private_env, set_public_env } from '../../../../../node_modules/@sveltejs/kit/src/runtime/shared-server.js';

export const options = {
	app_template_contains_nonce: false,
	async: false,
	csp: {"mode":"auto","directives":{"upgrade-insecure-requests":false,"block-all-mixed-content":false},"reportOnly":{"upgrade-insecure-requests":false,"block-all-mixed-content":false}},
	csrf_check_origin: true,
	csrf_trusted_origins: [],
	embedded: false,
	env_public_prefix: 'PUBLIC_',
	env_private_prefix: '',
	hash_routing: false,
	hooks: null, // added lazily, via `get_hooks`
	preload_strategy: "modulepreload",
	root,
	service_worker: false,
	service_worker_options: undefined,
	server_error_boundaries: false,
	templates: {
		app: ({ head, body, assets, nonce, env }) => "<!doctype html>\n<html lang=\"en\" class=\"dark\">\n  <head>\n    <meta charset=\"utf-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1, viewport-fit=cover\" />\n    <title>Sephar Studios</title>\n    <meta name=\"mobile-web-app-capable\" content=\"yes\" />\n    <meta name=\"apple-mobile-web-app-capable\" content=\"yes\" />\n    <meta name=\"apple-mobile-web-app-status-bar-style\" content=\"black-translucent\" />\n    <meta name=\"theme-color\" content=\"#0b0c10\" />\n    <!-- Favicons. All three rel=\"icon\" sizes point to the same flame PNG to\n         keep the brand consistent across address-bar, bookmark, tab thumbnail\n         and Android home-screen contexts. The order matters: browsers pick the\n         best size match, falling back to the last entry if nothing fits.\n         Cache-bust query (?v=3) when changing the source image. -->\n    <link rel=\"icon\" type=\"image/png\" sizes=\"32x32\" href=\"/logo-alone-sepharstudios-bgless.png?v=3\" />\n    <link rel=\"icon\" type=\"image/png\" sizes=\"96x96\" href=\"/logo-alone-sepharstudios-bgless.png?v=3\" />\n    <link rel=\"icon\" type=\"image/png\" sizes=\"192x192\" href=\"/logo-alone-sepharstudios-bgless.png?v=3\" />\n    <link rel=\"icon\" type=\"image/png\" sizes=\"any\" href=\"/logo-alone-sepharstudios-bgless.png?v=3\" />\n    <link rel=\"apple-touch-icon\" sizes=\"180x180\" href=\"/logo-alone-sepharstudios-bgless.png?v=3\" />\n    <link rel=\"shortcut icon\" href=\"/logo-alone-sepharstudios-bgless.png?v=3\" />\n    " + head + "\n    <meta name=\"apple-mobile-web-app-title\" content=\"Sephar Studios\" />\n    <link rel=\"manifest\" href=\"/manifest.json\" />\n    <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\" />\n    <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin />\n    <link href=\"https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..900;1,300..900&display=swap\" rel=\"stylesheet\" />\n    <!--\n      Site-wide structured data. Organization + WebSite (with SearchAction)\n      are the minimum Google expects for a sitelinks search box. Per-page\n      schemas (VideoObject on /watch, Person on /creators/[id]) are emitted\n      from those pages via <svelte:head>.\n    -->\n    <script type=\"application/ld+json\">\n      {\n        \"@context\": \"https://schema.org\",\n        \"@graph\": [\n          {\n            \"@type\": \"Organization\",\n            \"@id\": \"https://sepharstudios.com/#organization\",\n            \"name\": \"Sephar Studios\",\n            \"url\": \"https://sepharstudios.com\",\n            \"logo\": \"https://sepharstudios.com/logo-alone-sepharstudios.png\"\n          },\n          {\n            \"@type\": \"WebSite\",\n            \"@id\": \"https://sepharstudios.com/#website\",\n            \"name\": \"Sephar Studios\",\n            \"url\": \"https://sepharstudios.com\",\n            \"description\": \"Stream faith-based movies, shows, documentaries, and kids content.\",\n            \"publisher\": { \"@id\": \"https://sepharstudios.com/#organization\" },\n            \"potentialAction\": {\n              \"@type\": \"SearchAction\",\n              \"target\": \"https://sepharstudios.com/search?q={search_term_string}\",\n              \"query-input\": \"required name=search_term_string\"\n            }\n          }\n        ]\n      }\n    </script>\n\n    <!-- Openpanel — product analytics. Auto-tracks page views; we fire\n         explicit server-side events from $lib/server/analytics.ts. The\n         clientId is public-safe. Set via PUBLIC_OPENPANEL_CLIENT_ID env. -->\n    <script>\n      (function () {\n        var clientId = '" + (env["PUBLIC_OPENPANEL_CLIENT_ID"] ?? "") + "';\n        if (!clientId || clientId.indexOf('%') === 0) return;\n        var s = document.createElement('script');\n        s.src = 'https://openpanel.dev/op1.js';\n        s.defer = true;\n        s.setAttribute('data-client-id', clientId);\n        s.setAttribute('data-track-screen-views', 'true');\n        s.setAttribute('data-track-outgoing-links', 'true');\n        document.head.appendChild(s);\n      })();\n    </script>\n  </head>\n  <body data-sveltekit-preload-data=\"hover\" data-sveltekit-reload>\n    <div id=\"svelte\">" + body + "</div>\n  </body>\n</html>\n",
		error: ({ status, message }) => "<!doctype html>\n<html lang=\"en\">\n\t<head>\n\t\t<meta charset=\"utf-8\" />\n\t\t<title>" + message + "</title>\n\n\t\t<style>\n\t\t\tbody {\n\t\t\t\t--bg: white;\n\t\t\t\t--fg: #222;\n\t\t\t\t--divider: #ccc;\n\t\t\t\tbackground: var(--bg);\n\t\t\t\tcolor: var(--fg);\n\t\t\t\tfont-family:\n\t\t\t\t\tsystem-ui,\n\t\t\t\t\t-apple-system,\n\t\t\t\t\tBlinkMacSystemFont,\n\t\t\t\t\t'Segoe UI',\n\t\t\t\t\tRoboto,\n\t\t\t\t\tOxygen,\n\t\t\t\t\tUbuntu,\n\t\t\t\t\tCantarell,\n\t\t\t\t\t'Open Sans',\n\t\t\t\t\t'Helvetica Neue',\n\t\t\t\t\tsans-serif;\n\t\t\t\tdisplay: flex;\n\t\t\t\talign-items: center;\n\t\t\t\tjustify-content: center;\n\t\t\t\theight: 100vh;\n\t\t\t\tmargin: 0;\n\t\t\t}\n\n\t\t\t.error {\n\t\t\t\tdisplay: flex;\n\t\t\t\talign-items: center;\n\t\t\t\tmax-width: 32rem;\n\t\t\t\tmargin: 0 1rem;\n\t\t\t}\n\n\t\t\t.status {\n\t\t\t\tfont-weight: 200;\n\t\t\t\tfont-size: 3rem;\n\t\t\t\tline-height: 1;\n\t\t\t\tposition: relative;\n\t\t\t\ttop: -0.05rem;\n\t\t\t}\n\n\t\t\t.message {\n\t\t\t\tborder-left: 1px solid var(--divider);\n\t\t\t\tpadding: 0 0 0 1rem;\n\t\t\t\tmargin: 0 0 0 1rem;\n\t\t\t\tmin-height: 2.5rem;\n\t\t\t\tdisplay: flex;\n\t\t\t\talign-items: center;\n\t\t\t}\n\n\t\t\t.message h1 {\n\t\t\t\tfont-weight: 400;\n\t\t\t\tfont-size: 1em;\n\t\t\t\tmargin: 0;\n\t\t\t}\n\n\t\t\t@media (prefers-color-scheme: dark) {\n\t\t\t\tbody {\n\t\t\t\t\t--bg: #222;\n\t\t\t\t\t--fg: #ddd;\n\t\t\t\t\t--divider: #666;\n\t\t\t\t}\n\t\t\t}\n\t\t</style>\n\t</head>\n\t<body>\n\t\t<div class=\"error\">\n\t\t\t<span class=\"status\">" + status + "</span>\n\t\t\t<div class=\"message\">\n\t\t\t\t<h1>" + message + "</h1>\n\t\t\t</div>\n\t\t</div>\n\t</body>\n</html>\n"
	},
	version_hash: "mgqdo1"
};

export async function get_hooks() {
	let handle;
	let handleFetch;
	let handleError;
	let handleValidationError;
	let init;
	({ handle, handleFetch, handleError, handleValidationError, init } = await import("../../../src/hooks.server.ts"));

	let reroute;
	let transport;
	

	return {
		handle,
		handleFetch,
		handleError,
		handleValidationError,
		init,
		reroute,
		transport
	};
}

export { set_assets, set_building, set_manifest, set_prerendering, set_private_env, set_public_env, set_read_implementation };
