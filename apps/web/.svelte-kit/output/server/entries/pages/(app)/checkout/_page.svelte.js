import { _t as head, gt as ensure_array_like, jt as escape_html, kt as attr, mt as derived, ut as attr_class } from "../../../../chunks/ui-libs.js";
import { t as Check } from "../../../../chunks/check.js";
import { t as Credit_card } from "../../../../chunks/credit-card.js";
import { t as Gift } from "../../../../chunks/gift.js";
import { t as Shield } from "../../../../chunks/shield.js";
import { t as Button } from "../../../../chunks/button.js";
import { t as Badge } from "../../../../chunks/badge.js";
import { a as Card, i as Card_content, n as Card_header, t as Card_title } from "../../../../chunks/card.js";
//#region src/routes/(app)/checkout/+page.svelte
function _page($$renderer) {
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
	const selected = derived(() => plans.find((p) => p.id === selectedPlan));
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
			if (res.ok) otpSent = true;
			else error = (await res.json()).error || "Failed to send OTP";
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
				body: JSON.stringify({
					plan: selectedPlan,
					phone: phoneNumber,
					otp
				})
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
	head("zowvl0", $$renderer, ($$renderer) => {
		$$renderer.title(($$renderer) => {
			$$renderer.push(`<title>Start Your Free Trial - Sephar Studios</title>`);
		});
	});
	$$renderer.push(`<div class="min-h-screen bg-linear-to-b from-background to-accent/10 py-12 px-4"><div class="max-w-4xl mx-auto"><div class="text-center mb-10"><div class="inline-flex items-center gap-2 bg-green-600/10 text-green-400 border border-green-600/20 rounded-full px-4 py-1.5 text-sm mb-4">`);
	Gift($$renderer, { class: "w-4 h-4" });
	$$renderer.push(`<!----> 3 months free — no charge today</div> <h1 class="text-3xl font-bold mb-2">Choose Your Plan</h1> <p class="text-muted-foreground">Cancel anytime before your trial ends. Your card is required to start.</p></div> `);
	if (step === "select") {
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"><!--[-->`);
		const each_array = ensure_array_like(plans);
		for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
			let plan = each_array[$$index_1];
			$$renderer.push(`<button${attr_class(`text-left rounded-xl border-2 transition-all p-5 ${selectedPlan === plan.id ? "border-primary bg-primary/5" : "border-border bg-card hover:border-muted-foreground/40"}`)}><div class="flex items-start justify-between mb-3"><div><p class="font-semibold text-lg">${escape_html(plan.name)}</p> <p class="text-2xl font-bold">$${escape_html(plan.price)}<span class="text-sm font-normal text-muted-foreground">/mo</span></p></div> `);
			if (plan.isPopular) {
				$$renderer.push("<!--[0-->");
				Badge($$renderer, {
					class: "bg-primary text-white",
					children: ($$renderer) => {
						$$renderer.push(`<!---->Popular`);
					},
					$$slots: { default: true }
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (selectedPlan === plan.id) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">`);
				Check($$renderer, { class: "w-3 h-3 text-white" });
				$$renderer.push(`<!----></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div> <ul class="space-y-1.5"><!--[-->`);
			const each_array_1 = ensure_array_like(plan.features);
			for (let $$index = 0, $$length = each_array_1.length; $$index < $$length; $$index++) {
				let feature = each_array_1[$$index];
				$$renderer.push(`<li class="flex items-center gap-2 text-sm text-muted-foreground">`);
				Check($$renderer, { class: "w-3.5 h-3.5 text-green-500 shrink-0" });
				$$renderer.push(`<!----> ${escape_html(feature)}</li>`);
			}
			$$renderer.push(`<!--]--></ul></button>`);
		}
		$$renderer.push(`<!--]--></div> <div class="max-w-md mx-auto">`);
		Card($$renderer, {
			children: ($$renderer) => {
				Card_header($$renderer, {
					children: ($$renderer) => {
						Card_title($$renderer, {
							class: "text-base flex items-center gap-2",
							children: ($$renderer) => {
								Shield($$renderer, { class: "w-4 h-4 text-green-500" });
								$$renderer.push(`<!----> Verify your phone number`);
							},
							$$slots: { default: true }
						});
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				Card_content($$renderer, {
					class: "space-y-4",
					children: ($$renderer) => {
						$$renderer.push(`<p class="text-sm text-muted-foreground">One phone number per trial. This helps us prevent abuse.</p> <div class="flex gap-2"><input type="tel"${attr("value", phoneNumber)} placeholder="+234 800 000 0000" class="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"/> `);
						Button($$renderer, {
							onclick: sendOtp,
							disabled: sending || otpSent,
							size: "sm",
							children: ($$renderer) => {
								$$renderer.push(`<!---->${escape_html(sending ? "Sending..." : otpSent ? "Sent" : "Send OTP")}`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----></div> `);
						if (otpSent) {
							$$renderer.push("<!--[0-->");
							$$renderer.push(`<div><input type="text"${attr("value", otp)} placeholder="Enter 6-digit code" maxlength="6" class="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"/></div>`);
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]--> `);
						if (error) {
							$$renderer.push("<!--[0-->");
							$$renderer.push(`<p class="text-sm text-red-400">${escape_html(error)}</p>`);
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]--> `);
						Button($$renderer, {
							onclick: startTrial,
							disabled: !otpSent || verifying,
							class: "w-full bg-primary text-white",
							children: ($$renderer) => {
								Credit_card($$renderer, { class: "w-4 h-4 mr-2" });
								$$renderer.push(`<!----> ${escape_html(verifying ? "Redirecting..." : `Start Free Trial - ${selected().name} Plan`)}`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> <p class="text-xs text-center text-muted-foreground">You will be charged $${escape_html(selected().price)}/month after 3 months.
              Your card is verified now but not charged. Cancel anytime.</p>`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!---->`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----></div>`);
	} else if (step === "processing") {
		$$renderer.push("<!--[1-->");
		$$renderer.push(`<div class="text-center py-20"><div class="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-4"></div> <p class="text-muted-foreground">Redirecting to secure payment...</p></div>`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]--></div></div>`);
}
//#endregion
export { _page as default };
