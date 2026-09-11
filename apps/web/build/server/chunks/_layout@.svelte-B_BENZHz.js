import { k as head } from './index.js-BP8aAXBX.js';
import { P as PortalShell } from './PortalShell-NFFBm6nU.js';
import { p as page } from './state-DL22RgpG.js';
import { B as Button } from './button--do5FSjb.js';
import './Icon-DOH8dWtn.js';
import './activity-DIO6mqKB.js';
import './banknote-CTwoWlII.js';
import './bell-DqXql3zC.js';
import './chart-column-CCJFc6e2.js';
import './check-CTMQVuXr.js';
import './chevron-right-BoQzJUbV.js';
import './external-link-l5pl3dzR.js';
import './file-check-3Kyppc0i.js';
import './file-text-BWq_Qfpf.js';
import './house-CsvPkjXR.js';
import './landmark-DzMZMpfv.js';
import './loader-circle-B6adu1ox.js';
import './log-out-Bdw9dv4_.js';
import './megaphone-CiGyROPY.js';
import './message-square-CzZQ0DJR.js';
import './monitor-y2RME_vy.js';
import './sidebar-F5o7pyQI.js';
import './utils2-CqskQpUP.js';
import './sheet-BaQNM3qn.js';
import './x-CH8KQLcs.js';
import './index-D1eQaiDA.js';
import './plus-2AgTxg80.js';
import './search-Ca95ule-.js';
import './send-CjdUsiSa.js';
import './settings-BOw-ku0u.js';
import './shield-alert-Cgwe5Fn0.js';
import './shield-check-CLcqoqe0.js';
import './sparkles-BMsBMaRm.js';
import './triangle-alert-K4XkRqGf.js';
import './upload-DYWbwu2_.js';
import './user-BOId-Hm8.js';
import './users-C2Q26AgN.js';
import './video-fthjtWII.js';
import './wallet-Bahp6I3V.js';
import './zap-X10ohogX.js';
import './toast-state.svelte-B2rj3hM9.js';
import './dist2-DHNNWwV-.js';
import './client-ZoNwVBKD.js';
import './separator-SMJ0pSqw.js';
import './dropdown-menu-95C89c6A.js';
import './command-CCypJf_q.js';
import './dialog-Dn09nUte.js';
import 'ai';

//#region src/routes/(creator)/creator/+layout@.svelte
function _layout_($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { children } = $$props;
		const user = page.data.user;
		head("1tcrg26", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Creator Studio - Sephar Studios</title>`);
			});
		});
		if (user) {
			$$renderer.push("<!--[0-->");
			PortalShell($$renderer, {
				portal: "creator",
				children: ($$renderer) => {
					children($$renderer);
					$$renderer.push(`<!---->`);
				}});
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="min-h-screen flex items-center justify-center bg-linear-to-br from-background to-muted"><div class="text-center max-w-md px-6"><div class="mb-8"><div class="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4"><svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg></div> <h1 class="text-3xl font-bold mb-4">Creator Access Required</h1> <p class="text-muted-foreground mb-8">Sign in to access the creator portal and start sharing your faith-based content with the world.</p></div> <div class="space-y-4">`);
			Button($$renderer, {
				href: "/auth/login?redirectTo=/creator",
				class: "w-full bg-primary hover:bg-primary/90",
				size: "lg",
				children: ($$renderer) => {
					$$renderer.push(`<!---->Sign In to Creator Portal`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> <div class="text-sm text-muted-foreground"><p>Don't have an account?</p> `);
			Button($$renderer, {
				href: "/auth/register?redirectTo=/creator",
				variant: "link",
				class: "text-primary hover:text-primary/80",
				children: ($$renderer) => {
					$$renderer.push(`<!---->Sign up here`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></div></div> <div class="mt-8 pt-8 border-t border-border"><p class="text-xs text-muted-foreground">Need help getting started? `);
			Button($$renderer, {
				href: "/help",
				variant: "link",
				class: "text-primary p-0 h-auto",
				children: ($$renderer) => {
					$$renderer.push(`<!---->Visit our help center`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></p></div></div></div>`);
		}
		$$renderer.push(`<!--]-->`);
	});
}

export { _layout_ as default };
//# sourceMappingURL=_layout@.svelte-B_BENZHz.js.map
