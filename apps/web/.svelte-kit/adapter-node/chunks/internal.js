import { H as asClassComponent$1, I as render, F as FILENAME, J as setContext, p as prevent_snippet_stringification } from "./ui-libs.js";
import "clsx";
import "./environment.js";
import "./shared-server.js";
let read_implementation = null;
function set_read_implementation(fn) {
  read_implementation = fn;
}
function set_manifest(_) {
}
function asClassComponent(component) {
  const component_constructor = asClassComponent$1(component);
  const _render = (props, { context, csp } = {}) => {
    const result = render(component, { props, context, csp });
    const munged = Object.defineProperties(
      /** @type {LegacyRenderResult & PromiseLike<LegacyRenderResult>} */
      {},
      {
        css: {
          value: { code: "", map: null }
        },
        head: {
          get: () => result.head
        },
        html: {
          get: () => result.body
        },
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
            {
              const user_result = onfulfilled({
                css: munged.css,
                head: munged.head,
                html: munged.html
              });
              return Promise.resolve(user_result);
            }
          }
        }
      }
    );
    return munged;
  };
  component_constructor.render = _render;
  return component_constructor;
}
Root[FILENAME] = ".svelte-kit/generated/root.svelte";
function Root($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        stores,
        page,
        constructors,
        components = [],
        form,
        data_0 = null,
        data_1 = null,
        data_2 = null
      } = $$props;
      {
        setContext("__svelte__", stores);
      }
      {
        stores.page.set(page);
      }
      const Pyramid_2 = constructors[2];
      if (constructors[1]) {
        $$renderer2.push("<!--[-->");
        const Pyramid_0 = constructors[0];
        $$renderer2.push(`<!---->`);
        Pyramid_0($$renderer2, {
          data: data_0,
          form,
          params: page.params,
          children: prevent_snippet_stringification(($$renderer3) => {
            if (constructors[2]) {
              $$renderer3.push("<!--[-->");
              const Pyramid_1 = constructors[1];
              $$renderer3.push(`<!---->`);
              Pyramid_1($$renderer3, {
                data: data_1,
                form,
                params: page.params,
                children: prevent_snippet_stringification(($$renderer4) => {
                  $$renderer4.push(`<!---->`);
                  Pyramid_2($$renderer4, { data: data_2, form, params: page.params });
                  $$renderer4.push(`<!---->`);
                }),
                $$slots: { default: true }
              });
              $$renderer3.push(`<!---->`);
            } else {
              $$renderer3.push("<!--[!-->");
              const Pyramid_1 = constructors[1];
              $$renderer3.push(`<!---->`);
              Pyramid_1($$renderer3, { data: data_1, form, params: page.params });
              $$renderer3.push(`<!---->`);
            }
            $$renderer3.push(`<!--]-->`);
          }),
          $$slots: { default: true }
        });
        $$renderer2.push(`<!---->`);
      } else {
        $$renderer2.push("<!--[!-->");
        const Pyramid_0 = constructors[0];
        $$renderer2.push(`<!---->`);
        Pyramid_0($$renderer2, { data: data_0, form, params: page.params });
        $$renderer2.push(`<!---->`);
      }
      $$renderer2.push(`<!--]--> `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
    },
    Root
  );
}
Root.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
const root = asClassComponent(Root);
const options = {
  app_template_contains_nonce: false,
  async: false,
  csp: { "mode": "auto", "directives": { "upgrade-insecure-requests": false, "block-all-mixed-content": false }, "reportOnly": { "upgrade-insecure-requests": false, "block-all-mixed-content": false } },
  csrf_check_origin: true,
  csrf_trusted_origins: [],
  embedded: false,
  env_public_prefix: "PUBLIC_",
  env_private_prefix: "",
  hash_routing: false,
  hooks: null,
  // added lazily, via `get_hooks`
  preload_strategy: "modulepreload",
  root,
  service_worker: false,
  service_worker_options: void 0,
  templates: {
    app: ({ head, body, assets, nonce, env }) => '<!doctype html>\n<html lang="en" class="dark">\n  <head>\n    <meta charset="utf-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />\n    <title>Sephar Studios</title>\n    <meta name="apple-mobile-web-app-capable" content="yes" />\n    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />\n    <meta name="theme-color" content="#0b0c10" />\n    <link rel="apple-touch-icon" sizes="180x180" href="/logo-alone-sepharstudios.png" />\n    ' + head + '\n    <link rel="icon" type="image/png" href="/logo-alone-sepharstudios.png" />\n    <link rel="shortcut icon" href="/logo-alone-sepharstudios.png" />\n    <meta name="apple-mobile-web-app-title" content="Sephar Studios" />\n    <link rel="manifest" href="/manifest.json" />\n    <link rel="preconnect" href="https://fonts.googleapis.com" />\n    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />\n    <link href="https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..900;1,300..900&display=swap" rel="stylesheet" />\n    <script type="application/ld+json">\n      {\n        "@context": "https://schema.org",\n        "@type": "WebSite",\n        "name": "sepharstudios",\n        "url": "/"\n      }\n    <\/script>\n  </head>\n  <body data-sveltekit-preload-data="hover" data-sveltekit-reload>\n    <div id="svelte">' + body + "</div>\n  </body>\n</html>\n",
    error: ({ status, message }) => '<!doctype html>\n<html lang="en">\n	<head>\n		<meta charset="utf-8" />\n		<title>' + message + `</title>

		<style>
			body {
				--bg: white;
				--fg: #222;
				--divider: #ccc;
				background: var(--bg);
				color: var(--fg);
				font-family:
					system-ui,
					-apple-system,
					BlinkMacSystemFont,
					'Segoe UI',
					Roboto,
					Oxygen,
					Ubuntu,
					Cantarell,
					'Open Sans',
					'Helvetica Neue',
					sans-serif;
				display: flex;
				align-items: center;
				justify-content: center;
				height: 100vh;
				margin: 0;
			}

			.error {
				display: flex;
				align-items: center;
				max-width: 32rem;
				margin: 0 1rem;
			}

			.status {
				font-weight: 200;
				font-size: 3rem;
				line-height: 1;
				position: relative;
				top: -0.05rem;
			}

			.message {
				border-left: 1px solid var(--divider);
				padding: 0 0 0 1rem;
				margin: 0 0 0 1rem;
				min-height: 2.5rem;
				display: flex;
				align-items: center;
			}

			.message h1 {
				font-weight: 400;
				font-size: 1em;
				margin: 0;
			}

			@media (prefers-color-scheme: dark) {
				body {
					--bg: #222;
					--fg: #ddd;
					--divider: #666;
				}
			}
		</style>
	</head>
	<body>
		<div class="error">
			<span class="status">` + status + '</span>\n			<div class="message">\n				<h1>' + message + "</h1>\n			</div>\n		</div>\n	</body>\n</html>\n"
  },
  version_hash: "1j6fsgq"
};
async function get_hooks() {
  let handle;
  let handleFetch;
  let handleError;
  let handleValidationError;
  let init;
  ({ handle, handleFetch, handleError, handleValidationError, init } = await import("./hooks.server.js"));
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
export {
  set_manifest as a,
  get_hooks as g,
  options as o,
  read_implementation as r,
  set_read_implementation as s
};
