import "./server.js";
import { At as render, Et as derived, Gt as async_mode_flag, Xt as setContext, ht as asClassComponent$1 } from "./ui-libs.js";
//#region \0virtual:__sveltekit/server
var read_implementation = null;
function set_read_implementation(fn) {
	read_implementation = fn;
}
function set_manifest(_) {}
//#endregion
//#region ../../node_modules/svelte/src/legacy/legacy-server.js
/** @import { SvelteComponent } from '../index.js' */
/** @import { Csp } from '#server' */
/** @typedef {{ head: string, html: string, css: { code: string, map: null }; hashes?: { script: `sha256-${string}`[] } }} LegacyRenderResult */
/**
* Takes a Svelte 5 component and returns a Svelte 4 compatible component constructor.
*
* @deprecated Use this only as a temporary solution to migrate your imperative component code to Svelte 5.
*
* @template {Record<string, any>} Props
* @template {Record<string, any>} Exports
* @template {Record<string, any>} Events
* @template {Record<string, any>} Slots
*
* @param {SvelteComponent<Props, Events, Slots>} component
* @returns {typeof SvelteComponent<Props, Events, Slots> & Exports}
*/
function asClassComponent(component) {
	const component_constructor = asClassComponent$1(component);
	/** @type {(props?: {}, opts?: { $$slots?: {}; context?: Map<any, any>; csp?: Csp; transformError?: (error: unknown) => unknown }) => LegacyRenderResult & PromiseLike<LegacyRenderResult> } */
	const _render = (props, { context, csp, transformError } = {}) => {
		const result = render(component, {
			props,
			context,
			csp,
			transformError
		});
		const munged = Object.defineProperties({}, {
			css: { value: {
				code: "",
				map: null
			} },
			head: { get: () => result.head },
			html: { get: () => result.body },
			then: { 
			/**
			* this is not type-safe, but honestly it's the best I can do right now, and it's a straightforward function.
			*
			* @template TResult1
			* @template [TResult2=never]
			* @param { (value: LegacyRenderResult) => TResult1 } onfulfilled
			* @param { (reason: unknown) => TResult2 } onrejected
			*/
value: (onfulfilled, onrejected) => {
				if (!async_mode_flag) {
					const user_result = onfulfilled({
						css: munged.css,
						head: munged.head,
						html: munged.html
					});
					return Promise.resolve(user_result);
				}
				return result.then((result) => {
					return onfulfilled({
						css: munged.css,
						head: result.head,
						html: result.body,
						hashes: result.hashes
					});
				}, onrejected);
			} }
		});
		return munged;
	};
	component_constructor.render = _render;
	return component_constructor;
}
//#endregion
//#region .svelte-kit/generated/root.svelte
function Root($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { stores, page, constructors, components = [], form, data_0 = null, data_1 = null, data_2 = null } = $$props;
		setContext("__svelte__", stores);
		stores.page.set(page);
		const Pyramid_2 = derived(() => constructors[2]);
		if (constructors[1]) {
			$$renderer.push("<!--[0-->");
			const Pyramid_0 = constructors[0];
			if (Pyramid_0) {
				$$renderer.push("<!--[-->");
				Pyramid_0($$renderer, {
					data: data_0,
					form,
					params: page.params,
					children: ($$renderer) => {
						if (constructors[2]) {
							$$renderer.push("<!--[0-->");
							const Pyramid_1 = constructors[1];
							if (Pyramid_1) {
								$$renderer.push("<!--[-->");
								Pyramid_1($$renderer, {
									data: data_1,
									form,
									params: page.params,
									children: ($$renderer) => {
										if (Pyramid_2()) {
											$$renderer.push("<!--[-->");
											Pyramid_2()($$renderer, {
												data: data_2,
												form,
												params: page.params
											});
											$$renderer.push("<!--]-->");
										} else {
											$$renderer.push("<!--[!-->");
											$$renderer.push("<!--]-->");
										}
									},
									$$slots: { default: true }
								});
								$$renderer.push("<!--]-->");
							} else {
								$$renderer.push("<!--[!-->");
								$$renderer.push("<!--]-->");
							}
						} else {
							$$renderer.push("<!--[-1-->");
							const Pyramid_1 = constructors[1];
							if (Pyramid_1) {
								$$renderer.push("<!--[-->");
								Pyramid_1($$renderer, {
									data: data_1,
									form,
									params: page.params
								});
								$$renderer.push("<!--]-->");
							} else {
								$$renderer.push("<!--[!-->");
								$$renderer.push("<!--]-->");
							}
						}
						$$renderer.push(`<!--]-->`);
					},
					$$slots: { default: true }
				});
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
		} else {
			$$renderer.push("<!--[-1-->");
			const Pyramid_0 = constructors[0];
			if (Pyramid_0) {
				$$renderer.push("<!--[-->");
				Pyramid_0($$renderer, {
					data: data_0,
					form,
					params: page.params
				});
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
		}
		$$renderer.push(`<!--]--> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
//#region .svelte-kit/generated/server/internal.js
var options = {
	app_template_contains_nonce: false,
	async: false,
	csp: {
		"mode": "auto",
		"directives": {
			"upgrade-insecure-requests": false,
			"block-all-mixed-content": false
		},
		"reportOnly": {
			"upgrade-insecure-requests": false,
			"block-all-mixed-content": false
		}
	},
	csrf_check_origin: true,
	csrf_trusted_origins: [],
	embedded: false,
	env_public_prefix: "PUBLIC_",
	env_private_prefix: "",
	hash_routing: false,
	hooks: null,
	preload_strategy: "modulepreload",
	root: asClassComponent(Root),
	service_worker: false,
	service_worker_options: void 0,
	server_error_boundaries: false,
	templates: {
		app: ({ head, body, assets, nonce, env }) => "<!doctype html>\n<html lang=\"en\" class=\"dark\">\n  <head>\n    <meta charset=\"utf-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1, viewport-fit=cover\" />\n    <title>Sephar Studios</title>\n    <meta name=\"mobile-web-app-capable\" content=\"yes\" />\n    <meta name=\"apple-mobile-web-app-capable\" content=\"yes\" />\n    <meta name=\"apple-mobile-web-app-status-bar-style\" content=\"black-translucent\" />\n    <meta name=\"theme-color\" content=\"#0b0c10\" />\n    <!-- Favicons. All three rel=\"icon\" sizes point to the same flame PNG to\n         keep the brand consistent across address-bar, bookmark, tab thumbnail\n         and Android home-screen contexts. The order matters: browsers pick the\n         best size match, falling back to the last entry if nothing fits.\n         Cache-bust query (?v=3) when changing the source image. -->\n    <link rel=\"icon\" type=\"image/png\" sizes=\"32x32\" href=\"/logo-alone-sepharstudios-bgless.png?v=3\" />\n    <link rel=\"icon\" type=\"image/png\" sizes=\"96x96\" href=\"/logo-alone-sepharstudios-bgless.png?v=3\" />\n    <link rel=\"icon\" type=\"image/png\" sizes=\"192x192\" href=\"/logo-alone-sepharstudios-bgless.png?v=3\" />\n    <link rel=\"icon\" type=\"image/png\" sizes=\"any\" href=\"/logo-alone-sepharstudios-bgless.png?v=3\" />\n    <link rel=\"apple-touch-icon\" sizes=\"180x180\" href=\"/logo-alone-sepharstudios-bgless.png?v=3\" />\n    <link rel=\"shortcut icon\" href=\"/logo-alone-sepharstudios-bgless.png?v=3\" />\n    " + head + "\n    <meta name=\"apple-mobile-web-app-title\" content=\"Sephar Studios\" />\n    <link rel=\"manifest\" href=\"/manifest.json\" />\n    <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\" />\n    <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin />\n    <link href=\"https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..900;1,300..900&display=swap\" rel=\"stylesheet\" />\n    <!--\n      Site-wide structured data. Organization + WebSite (with SearchAction)\n      are the minimum Google expects for a sitelinks search box. Per-page\n      schemas (VideoObject on /watch, Person on /creators/[id]) are emitted\n      from those pages via <svelte:head>.\n    -->\n    <script type=\"application/ld+json\">\n      {\n        \"@context\": \"https://schema.org\",\n        \"@graph\": [\n          {\n            \"@type\": \"Organization\",\n            \"@id\": \"https://sepharstudios.com/#organization\",\n            \"name\": \"Sephar Studios\",\n            \"url\": \"https://sepharstudios.com\",\n            \"logo\": \"https://sepharstudios.com/logo-alone-sepharstudios.png\"\n          },\n          {\n            \"@type\": \"WebSite\",\n            \"@id\": \"https://sepharstudios.com/#website\",\n            \"name\": \"Sephar Studios\",\n            \"url\": \"https://sepharstudios.com\",\n            \"description\": \"Stream faith-based movies, shows, documentaries, and kids content.\",\n            \"publisher\": { \"@id\": \"https://sepharstudios.com/#organization\" },\n            \"potentialAction\": {\n              \"@type\": \"SearchAction\",\n              \"target\": \"https://sepharstudios.com/search?q={search_term_string}\",\n              \"query-input\": \"required name=search_term_string\"\n            }\n          }\n        ]\n      }\n    <\/script>\n\n    <!-- Openpanel — product analytics. Auto-tracks page views; we fire\n         explicit server-side events from $lib/server/analytics.ts. The\n         clientId is public-safe. Set via PUBLIC_OPENPANEL_CLIENT_ID env. -->\n    <script>\n      (function () {\n        var clientId = '" + (env["PUBLIC_OPENPANEL_CLIENT_ID"] ?? "") + "';\n        if (!clientId || clientId.indexOf('%') === 0) return;\n        var s = document.createElement('script');\n        s.src = 'https://openpanel.dev/op1.js';\n        s.defer = true;\n        s.setAttribute('data-client-id', clientId);\n        s.setAttribute('data-track-screen-views', 'true');\n        s.setAttribute('data-track-outgoing-links', 'true');\n        document.head.appendChild(s);\n      })();\n    <\/script>\n  </head>\n  <body data-sveltekit-preload-data=\"hover\" data-sveltekit-reload>\n    <div id=\"svelte\">" + body + "</div>\n  </body>\n</html>\n",
		error: ({ status, message }) => "<!doctype html>\n<html lang=\"en\">\n	<head>\n		<meta charset=\"utf-8\" />\n		<title>" + message + "</title>\n\n		<style>\n			body {\n				--bg: white;\n				--fg: #222;\n				--divider: #ccc;\n				background: var(--bg);\n				color: var(--fg);\n				font-family:\n					system-ui,\n					-apple-system,\n					BlinkMacSystemFont,\n					'Segoe UI',\n					Roboto,\n					Oxygen,\n					Ubuntu,\n					Cantarell,\n					'Open Sans',\n					'Helvetica Neue',\n					sans-serif;\n				display: flex;\n				align-items: center;\n				justify-content: center;\n				height: 100vh;\n				margin: 0;\n			}\n\n			.error {\n				display: flex;\n				align-items: center;\n				max-width: 32rem;\n				margin: 0 1rem;\n			}\n\n			.status {\n				font-weight: 200;\n				font-size: 3rem;\n				line-height: 1;\n				position: relative;\n				top: -0.05rem;\n			}\n\n			.message {\n				border-left: 1px solid var(--divider);\n				padding: 0 0 0 1rem;\n				margin: 0 0 0 1rem;\n				min-height: 2.5rem;\n				display: flex;\n				align-items: center;\n			}\n\n			.message h1 {\n				font-weight: 400;\n				font-size: 1em;\n				margin: 0;\n			}\n\n			@media (prefers-color-scheme: dark) {\n				body {\n					--bg: #222;\n					--fg: #ddd;\n					--divider: #666;\n				}\n			}\n		</style>\n	</head>\n	<body>\n		<div class=\"error\">\n			<span class=\"status\">" + status + "</span>\n			<div class=\"message\">\n				<h1>" + message + "</h1>\n			</div>\n		</div>\n	</body>\n</html>\n"
	},
	version_hash: "19lned"
};
async function get_hooks() {
	let handle;
	let handleFetch;
	let handleError;
	let handleValidationError;
	let init;
	({handle, handleFetch, handleError, handleValidationError, init} = await import("../entries/hooks.server.js"));
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
//#endregion
export { set_read_implementation as a, set_manifest as i, options as n, read_implementation as r, get_hooks as t };
