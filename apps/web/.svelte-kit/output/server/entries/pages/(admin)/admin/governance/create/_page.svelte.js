import { a as push_element, b as pop_element, i as ensure_array_like, e as escape_html, F as FILENAME, o as head, n as attr } from "../../../../../../chunks/ui-libs.js";
GuardrailValidator[FILENAME] = "src/lib/components/admin/governance/GuardrailValidator.svelte";
function GuardrailValidator($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { warnings } = $$props;
      if (warnings.length > 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">`);
        push_element($$renderer2, "div", 10, 1);
        $$renderer2.push(`<p class="text-xs font-semibold text-amber-300 mb-1">`);
        push_element($$renderer2, "p", 11, 2);
        $$renderer2.push(`Guardrail Warnings</p>`);
        pop_element();
        $$renderer2.push(` <ul class="text-xs text-amber-200 space-y-1">`);
        push_element($$renderer2, "ul", 12, 2);
        $$renderer2.push(`<!--[-->`);
        const each_array = ensure_array_like(warnings);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let warning = each_array[$$index];
          $$renderer2.push(`<li>`);
          push_element($$renderer2, "li", 14, 4);
          $$renderer2.push(`- ${escape_html(warning)}</li>`);
          pop_element();
        }
        $$renderer2.push(`<!--]--></ul>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div class="rounded-lg border border-green-500/30 bg-green-500/10 p-3">`);
        push_element($$renderer2, "div", 19, 1);
        $$renderer2.push(`<p class="text-xs text-green-200">`);
        push_element($$renderer2, "p", 20, 2);
        $$renderer2.push(`No guardrail issues detected.</p>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]-->`);
    },
    GuardrailValidator
  );
}
GuardrailValidator.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
_page[FILENAME] = "src/routes/(admin)/admin/governance/create/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let title = "";
      let description = "";
      let type = "parameter_update";
      let payloadText = '{\n  "changePercent": 5\n}';
      let saving = false;
      function evaluateGuardrails() {
        const warnings = [];
        try {
          const parsed = JSON.parse(payloadText);
          const percent = Number(parsed.changePercent ?? 0);
          if (type === "parameter_update") {
            if (Number.isFinite(percent) && Math.abs(percent) > 10) {
              warnings.push("Change exceeds 10%; governance supermajority is recommended.");
            }
            if (Number.isFinite(percent) && Math.abs(percent) > 25) {
              warnings.push("Change exceeds 25%; likely outside policy guardrails.");
            }
          }
          if (type === "policy_change") ;
          if (type === "emergency_action") ;
        } catch {
          warnings.push("Payload JSON is invalid.");
        }
        return warnings;
      }
      head("r0oezv", $$renderer2, ($$renderer3) => {
        $$renderer3.title(($$renderer4) => {
          $$renderer4.push(`<title>Create Governance Proposal - Admin</title>`);
        });
      });
      $$renderer2.push(`<div class="container mx-auto px-4 py-8 max-w-3xl space-y-4">`);
      push_element($$renderer2, "div", 75, 0);
      $$renderer2.push(`<h1 class="text-2xl font-bold text-white">`);
      push_element($$renderer2, "h1", 76, 1);
      $$renderer2.push(`Create Governance Proposal</h1>`);
      pop_element();
      $$renderer2.push(` <div class="rounded-xl border border-white/10 bg-white/5 p-5 space-y-4">`);
      push_element($$renderer2, "div", 78, 1);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 79, 2);
      $$renderer2.push(`<label for="proposal-title" class="text-xs text-gray-300">`);
      push_element($$renderer2, "label", 80, 3);
      $$renderer2.push(`Title</label>`);
      pop_element();
      $$renderer2.push(` <input id="proposal-title" class="mt-1 w-full bg-black/40 border border-white/15 rounded px-3 py-2 text-white"${attr("value", title)}/>`);
      push_element($$renderer2, "input", 81, 3);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 84, 2);
      $$renderer2.push(`<label for="proposal-type" class="text-xs text-gray-300">`);
      push_element($$renderer2, "label", 85, 3);
      $$renderer2.push(`Type</label>`);
      pop_element();
      $$renderer2.push(` `);
      $$renderer2.select(
        {
          id: "proposal-type",
          class: "mt-1 w-full bg-black/40 border border-white/15 rounded px-3 py-2 text-white",
          value: type
        },
        ($$renderer3) => {
          $$renderer3.option({ value: "parameter_update" }, ($$renderer4) => {
            $$renderer4.push(`parameter_update`);
          });
          $$renderer3.option({ value: "treasury_action" }, ($$renderer4) => {
            $$renderer4.push(`treasury_action`);
          });
          $$renderer3.option({ value: "policy_change" }, ($$renderer4) => {
            $$renderer4.push(`policy_change`);
          });
          $$renderer3.option({ value: "emergency_action" }, ($$renderer4) => {
            $$renderer4.push(`emergency_action`);
          });
        }
      );
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 94, 2);
      $$renderer2.push(`<label for="proposal-description" class="text-xs text-gray-300">`);
      push_element($$renderer2, "label", 95, 3);
      $$renderer2.push(`Description</label>`);
      pop_element();
      $$renderer2.push(` <textarea id="proposal-description" class="mt-1 w-full min-h-24 bg-black/40 border border-white/15 rounded px-3 py-2 text-white">`);
      push_element($$renderer2, "textarea", 96, 3);
      const $$body = escape_html(description);
      if ($$body) {
        $$renderer2.push(`${$$body}`);
      }
      $$renderer2.push(`</textarea>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 99, 2);
      $$renderer2.push(`<label for="proposal-payload" class="text-xs text-gray-300">`);
      push_element($$renderer2, "label", 100, 3);
      $$renderer2.push(`Payload (JSON)</label>`);
      pop_element();
      $$renderer2.push(` <textarea id="proposal-payload" class="mt-1 w-full min-h-32 bg-black/40 border border-white/15 rounded px-3 py-2 text-white font-mono text-xs">`);
      push_element($$renderer2, "textarea", 101, 3);
      const $$body_1 = escape_html(payloadText);
      if ($$body_1) {
        $$renderer2.push(`${$$body_1}`);
      }
      $$renderer2.push(`</textarea>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      GuardrailValidator($$renderer2, { warnings: evaluateGuardrails() });
      $$renderer2.push(`<!----> <div class="flex items-center gap-3">`);
      push_element($$renderer2, "div", 106, 2);
      $$renderer2.push(`<button class="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 disabled:opacity-50"${attr("disabled", saving, true)}>`);
      push_element($$renderer2, "button", 107, 3);
      $$renderer2.push(`${escape_html("Create Proposal")}</button>`);
      pop_element();
      $$renderer2.push(` <a href="/admin/governance/proposals" class="text-sm text-gray-300 hover:text-white">`);
      push_element($$renderer2, "a", 110, 3);
      $$renderer2.push(`Back to proposals</a>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
    },
    _page
  );
}
_page.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
export {
  _page as default
};
