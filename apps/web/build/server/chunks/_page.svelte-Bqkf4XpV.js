import { h as head, b as push_element, d as pop_element, e as ensure_array_like, k as attr_class, i as stringify, l as escape_html, p as prevent_snippet_stringification, g as attr, F as FILENAME } from './ui-libs-Yf6h8PPk.js';
import { B as Button } from './button-C1v8XzqW.js';
import { C as Card, a as Card_header, b as Card_title, c as Card_content } from './card-title-Bb6tCQUO.js';
import { B as Badge } from './badge-D_nuztXS.js';
import { G as Gift } from './gift-DM5QqSI7.js';
import { C as Check } from './check-BU5QHt2h.js';
import { S as Shield } from './shield-CjWF93NT.js';
import { C as Credit_card } from './credit-card-Cy41K6n2.js';
import './utils2-DYlu6U_t.js';
import './index-D4iwt0su.js';
import './Icon-DVHDtCfs.js';

_page[FILENAME] = "src/routes/(app)/checkout/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      const plans = [
        {
          id: "basic",
          name: "Basic",
          price: 3,
          features: [
            "HD streaming",
            "1 screen at a time",
            "Access to standard library",
            "Download on 1 device"
          ]
        },
        {
          id: "premium",
          name: "Premium",
          price: 10,
          features: [
            "4K Ultra HD streaming",
            "2 screens at a time",
            "Full content library",
            "Downloads on 2 devices",
            "Offline viewing"
          ],
          isPopular: true
        },
        {
          id: "creator",
          name: "Creator",
          price: 15,
          features: [
            "Everything in Premium",
            "Upload & publish content",
            "Revenue share dashboard",
            "Creator analytics",
            "Priority support"
          ]
        }
      ];
      let selectedPlan = "premium";
      let step = "select";
      let phoneNumber = "";
      let otp = "";
      let otpSent = false;
      let error = "";
      let sending = false;
      let verifying = false;
      const selected = plans.find((p) => p.id === selectedPlan);
      async function sendOtp() {
        if (!phoneNumber.trim()) {
          error = "Please enter your phone number";
          return;
        }
        sending = true;
        error = "";
        try {
          const res = await fetch("/api/subscriptions/send-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone: phoneNumber })
          });
          if (res.ok) {
            otpSent = true;
          } else {
            const data = await res.json();
            error = data.error || "Failed to send OTP";
          }
        } catch {
          error = "Network error. Please try again.";
        } finally {
          sending = false;
        }
      }
      async function startTrial() {
        if (!otp.trim()) {
          error = "Please enter the verification code";
          return;
        }
        verifying = true;
        error = "";
        try {
          const res = await fetch("/api/payment/initialize", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ plan: selectedPlan, phone: phoneNumber, otp })
          });
          const data = await res.json();
          if (!res.ok) {
            error = data.error || "Failed to start checkout";
            return;
          }
          step = "processing";
          window.location.href = data.authorizationUrl;
        } catch {
          error = "Network error. Please try again.";
        } finally {
          verifying = false;
        }
      }
      head("zowvl0", $$renderer2, ($$renderer3) => {
        $$renderer3.title(($$renderer4) => {
          $$renderer4.push(`<title>Start Your Free Trial - Sephar Studios</title>`);
        });
      });
      $$renderer2.push(`<div class="min-h-screen bg-linear-to-b from-background to-accent/10 py-12 px-4">`);
      push_element($$renderer2, "div", 126, 0);
      $$renderer2.push(`<div class="max-w-4xl mx-auto">`);
      push_element($$renderer2, "div", 127, 2);
      $$renderer2.push(`<div class="text-center mb-10">`);
      push_element($$renderer2, "div", 129, 4);
      $$renderer2.push(`<div class="inline-flex items-center gap-2 bg-green-600/10 text-green-400 border border-green-600/20 rounded-full px-4 py-1.5 text-sm mb-4">`);
      push_element($$renderer2, "div", 130, 6);
      Gift($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!----> 3 months free — no charge today</div>`);
      pop_element();
      $$renderer2.push(` <h1 class="text-3xl font-bold mb-2">`);
      push_element($$renderer2, "h1", 134, 6);
      $$renderer2.push(`Choose Your Plan</h1>`);
      pop_element();
      $$renderer2.push(` <p class="text-muted-foreground">`);
      push_element($$renderer2, "p", 135, 6);
      $$renderer2.push(`Cancel anytime before your trial ends. Your card is required to start.</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      if (step === "select") {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">`);
        push_element($$renderer2, "div", 140, 6);
        $$renderer2.push(`<!--[-->`);
        const each_array = ensure_array_like(plans);
        for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
          let plan = each_array[$$index_1];
          $$renderer2.push(`<button${attr_class(`text-left rounded-xl border-2 transition-all p-5 ${stringify(selectedPlan === plan.id ? "border-primary bg-primary/5" : "border-border bg-card hover:border-muted-foreground/40")}`)}>`);
          push_element($$renderer2, "button", 142, 10);
          $$renderer2.push(`<div class="flex items-start justify-between mb-3">`);
          push_element($$renderer2, "div", 146, 12);
          $$renderer2.push(`<div>`);
          push_element($$renderer2, "div", 147, 14);
          $$renderer2.push(`<p class="font-semibold text-lg">`);
          push_element($$renderer2, "p", 148, 16);
          $$renderer2.push(`${escape_html(plan.name)}</p>`);
          pop_element();
          $$renderer2.push(` <p class="text-2xl font-bold">`);
          push_element($$renderer2, "p", 149, 16);
          $$renderer2.push(`$${escape_html(plan.price)}<span class="text-sm font-normal text-muted-foreground">`);
          push_element($$renderer2, "span", 149, 59);
          $$renderer2.push(`/mo</span>`);
          pop_element();
          $$renderer2.push(`</p>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(` `);
          if (plan.isPopular) {
            $$renderer2.push("<!--[-->");
            Badge($$renderer2, {
              class: "bg-primary text-white",
              children: prevent_snippet_stringification(($$renderer3) => {
                $$renderer3.push(`<!---->Popular`);
              }),
              $$slots: { default: true }
            });
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]--> `);
          if (selectedPlan === plan.id) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<div class="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">`);
            push_element($$renderer2, "div", 155, 16);
            Check($$renderer2, { class: "w-3 h-3 text-white" });
            $$renderer2.push(`<!----></div>`);
            pop_element();
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]--></div>`);
          pop_element();
          $$renderer2.push(` <ul class="space-y-1.5">`);
          push_element($$renderer2, "ul", 160, 12);
          $$renderer2.push(`<!--[-->`);
          const each_array_1 = ensure_array_like(plan.features);
          for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
            let feature = each_array_1[$$index];
            $$renderer2.push(`<li class="flex items-center gap-2 text-sm text-muted-foreground">`);
            push_element($$renderer2, "li", 162, 16);
            Check($$renderer2, { class: "w-3.5 h-3.5 text-green-500 shrink-0" });
            $$renderer2.push(`<!----> ${escape_html(feature)}</li>`);
            pop_element();
          }
          $$renderer2.push(`<!--]--></ul>`);
          pop_element();
          $$renderer2.push(`</button>`);
          pop_element();
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
        $$renderer2.push(` <div class="max-w-md mx-auto">`);
        push_element($$renderer2, "div", 172, 6);
        Card($$renderer2, {
          children: prevent_snippet_stringification(($$renderer3) => {
            Card_header($$renderer3, {
              children: prevent_snippet_stringification(($$renderer4) => {
                Card_title($$renderer4, {
                  class: "text-base flex items-center gap-2",
                  children: prevent_snippet_stringification(($$renderer5) => {
                    Shield($$renderer5, { class: "w-4 h-4 text-green-500" });
                    $$renderer5.push(`<!----> Verify your phone number`);
                  }),
                  $$slots: { default: true }
                });
              }),
              $$slots: { default: true }
            });
            $$renderer3.push(`<!----> `);
            Card_content($$renderer3, {
              class: "space-y-4",
              children: prevent_snippet_stringification(($$renderer4) => {
                $$renderer4.push(`<p class="text-sm text-muted-foreground">`);
                push_element($$renderer4, "p", 181, 12);
                $$renderer4.push(`One phone number per trial. This helps us prevent abuse.</p>`);
                pop_element();
                $$renderer4.push(` <div class="flex gap-2">`);
                push_element($$renderer4, "div", 182, 12);
                $$renderer4.push(`<input type="tel"${attr("value", phoneNumber)} placeholder="+234 800 000 0000" class="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"/>`);
                push_element($$renderer4, "input", 183, 14);
                pop_element();
                $$renderer4.push(` `);
                Button($$renderer4, {
                  onclick: sendOtp,
                  disabled: sending || otpSent,
                  size: "sm",
                  children: prevent_snippet_stringification(($$renderer5) => {
                    $$renderer5.push(`<!---->${escape_html(sending ? "Sending..." : otpSent ? "Sent" : "Send OTP")}`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer4.push(`<!----></div>`);
                pop_element();
                $$renderer4.push(` `);
                if (otpSent) {
                  $$renderer4.push("<!--[-->");
                  $$renderer4.push(`<div>`);
                  push_element($$renderer4, "div", 195, 14);
                  $$renderer4.push(`<input type="text"${attr("value", otp)} placeholder="Enter 6-digit code" maxlength="6" class="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"/>`);
                  push_element($$renderer4, "input", 196, 16);
                  pop_element();
                  $$renderer4.push(`</div>`);
                  pop_element();
                } else {
                  $$renderer4.push("<!--[!-->");
                }
                $$renderer4.push(`<!--]--> `);
                if (error) {
                  $$renderer4.push("<!--[-->");
                  $$renderer4.push(`<p class="text-sm text-red-400">`);
                  push_element($$renderer4, "p", 207, 14);
                  $$renderer4.push(`${escape_html(error)}</p>`);
                  pop_element();
                } else {
                  $$renderer4.push("<!--[!-->");
                }
                $$renderer4.push(`<!--]--> `);
                Button($$renderer4, {
                  onclick: startTrial,
                  disabled: !otpSent || verifying,
                  class: "w-full bg-primary text-white",
                  children: prevent_snippet_stringification(($$renderer5) => {
                    Credit_card($$renderer5, { class: "w-4 h-4 mr-2" });
                    $$renderer5.push(`<!----> ${escape_html(verifying ? "Redirecting..." : `Start Free Trial - ${selected.name} Plan`)}`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer4.push(`<!----> <p class="text-xs text-center text-muted-foreground">`);
                push_element($$renderer4, "p", 219, 12);
                $$renderer4.push(`You will be charged $${escape_html(selected.price)}/month after 3 months.
              Your card is verified now but not charged. Cancel anytime.</p>`);
                pop_element();
              }),
              $$slots: { default: true }
            });
            $$renderer3.push(`<!---->`);
          }),
          $$slots: { default: true }
        });
        $$renderer2.push(`<!----></div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
        if (step === "processing") {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="text-center py-20">`);
          push_element($$renderer2, "div", 228, 6);
          $$renderer2.push(`<div class="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-4">`);
          push_element($$renderer2, "div", 229, 8);
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(` <p class="text-muted-foreground">`);
          push_element($$renderer2, "p", 230, 8);
          $$renderer2.push(`Redirecting to secure payment...</p>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]-->`);
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

export { _page as default };
//# sourceMappingURL=_page.svelte-Bqkf4XpV.js.map
