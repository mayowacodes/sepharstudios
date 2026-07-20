
import root from '../root.js';
import { set_building, set_prerendering } from '$app/env/internal';
import { set_assets } from '$app/paths/internal/server';
import { set_manifest, set_read_implementation } from '__sveltekit/server';
import { set_private_env, set_public_env } from '../../../../../node_modules/.bun/@sveltejs+kit@2.69.3+ab726ce7a871e72d/node_modules/@sveltejs/kit/src/runtime/shared-server.js';
import error from '../shared/error-template.js';

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
		error
	},
	version_hash: "7hil99"
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
