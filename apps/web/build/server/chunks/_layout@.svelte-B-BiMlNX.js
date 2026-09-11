import { k as head } from './index.js-CxPEndTa.js';
import { P as PortalShell } from './PortalShell-h2syflsp.js';
import { p as page } from './state-p7jw8P-1.js';
import { B as Button } from './button-DtPBvYl-.js';
import './Icon-Bw1rnKTC.js';
import './activity-HOlvKMcx.js';
import './banknote-Bga5PAMF.js';
import './bell-BrL1tBn8.js';
import './chart-column-Clm7jeZ1.js';
import './check-Dd25bh0_.js';
import './chevron-right-BXeoMTPQ.js';
import './coins-HZ1N_e-W.js';
import './external-link-BtRO0xQl.js';
import './file-check-Br5bL08N.js';
import './file-text-By5QqCz6.js';
import './house-6lS0tROn.js';
import './landmark-BiAsGGZg.js';
import './loader-circle-B0HKi6ku.js';
import './log-out-Bf9yLhaA.js';
import './megaphone-HgPRtjd7.js';
import './message-square-DuXesl7d.js';
import './monitor-BOrhpr28.js';
import './sidebar-5BfDywwL.js';
import './utils2-DZI6czOR.js';
import './sheet-CF_bCjvd.js';
import './x-57ZXvvuj.js';
import './index-BoGG3uCW.js';
import './plus-NyypAj8P.js';
import './search-DTs5QrbF.js';
import './send-BkIRApbm.js';
import './settings-BAao4cwu.js';
import './shield-alert-DqY7tJTj.js';
import './shield-check-D3aiDu0V.js';
import './sparkles-DUEEirDg.js';
import './triangle-alert-DrDB-0_5.js';
import './upload-ouNUZcQF.js';
import './user-DfNTMTjp.js';
import './users-BHfWNfsK.js';
import './video-BLlujA8B.js';
import './wallet-CRqOK7UE.js';
import './zap-Cm0mFJ3v.js';
import './toast-state.svelte-jhYVYtU8.js';
import './dist2-D60iehlE.js';
import './client-DsZfmj3l.js';
import './separator-16ygnFBZ.js';
import './dropdown-menu-ZI0zkml5.js';
import './command-Bm9SqMGA.js';
import './dialog-BZDWaiEy.js';
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
//# sourceMappingURL=_layout@.svelte-B-BiMlNX.js.map
