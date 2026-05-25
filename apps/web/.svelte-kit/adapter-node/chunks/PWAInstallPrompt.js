import { F as FILENAME } from "./ui-libs.js";
import "clsx";
PWAInstallPrompt[FILENAME] = "src/lib/components/widgets/PWAInstallPrompt.svelte";
function PWAInstallPrompt($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
    },
    PWAInstallPrompt
  );
}
PWAInstallPrompt.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
export {
  PWAInstallPrompt as P
};
