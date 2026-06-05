import { Tt as head, wt as ensure_array_like, zt as escape_html } from "../../../../chunks/ui-libs.js";
import { t as Circle_question_mark } from "../../../../chunks/circle-question-mark.js";
import { t as Download } from "../../../../chunks/download.js";
import { t as Monitor } from "../../../../chunks/monitor.js";
import { t as Smartphone } from "../../../../chunks/smartphone.js";
import { t as Tablet } from "../../../../chunks/tablet.js";
import { t as Tv } from "../../../../chunks/tv.js";
import { t as Wifi } from "../../../../chunks/wifi.js";
import { t as PWAInstallPrompt } from "../../../../chunks/PWAInstallPrompt.js";
//#region src/routes/(app)/device-support/+page.svelte
function _page($$renderer) {
	head("15jn15c", $$renderer, ($$renderer) => {
		$$renderer.title(($$renderer) => {
			$$renderer.push(`<title>Device Support - Sephar Studios</title>`);
		});
	});
	PWAInstallPrompt($$renderer, {});
	$$renderer.push(`<!----> <div class="min-h-screen bg-background px-4 py-12"><div class="max-w-4xl mx-auto"><h1 class="text-3xl font-bold mb-2">Device Support</h1> <p class="text-muted-foreground mb-10">Stream Sephar Studios on any screen, anywhere.</p> <section class="mb-12"><h2 class="text-xl font-semibold mb-6">Supported Devices</h2> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"><div class="bg-card border border-border rounded-xl p-5 text-center">`);
	Monitor($$renderer, { class: "w-8 h-8 mx-auto mb-3 text-primary" });
	$$renderer.push(`<!----> <h3 class="font-semibold mb-2">Desktop &amp; Laptop</h3> <ul class="text-sm text-muted-foreground space-y-1"><li>Chrome 90+</li> <li>Firefox 88+</li> <li>Safari 14+</li> <li>Edge 90+</li></ul> <p class="text-xs text-green-400 mt-3">Full support</p></div> <div class="bg-card border border-border rounded-xl p-5 text-center">`);
	Smartphone($$renderer, { class: "w-8 h-8 mx-auto mb-3 text-primary" });
	$$renderer.push(`<!----> <h3 class="font-semibold mb-2">Mobile</h3> <ul class="text-sm text-muted-foreground space-y-1"><li>iOS Safari 14+</li> <li>Android Chrome 90+</li> <li>Samsung Internet 14+</li></ul> <p class="text-xs text-green-400 mt-3">Full support + PWA</p></div> <div class="bg-card border border-border rounded-xl p-5 text-center">`);
	Tablet($$renderer, { class: "w-8 h-8 mx-auto mb-3 text-primary" });
	$$renderer.push(`<!----> <h3 class="font-semibold mb-2">Tablet</h3> <ul class="text-sm text-muted-foreground space-y-1"><li>iPad (iOS 14+)</li> <li>Android tablets</li> <li>Surface (Edge)</li></ul> <p class="text-xs text-green-400 mt-3">Full support + PWA</p></div> <div class="bg-card border border-border rounded-xl p-5 text-center">`);
	Tv($$renderer, { class: "w-8 h-8 mx-auto mb-3 text-muted-foreground" });
	$$renderer.push(`<!----> <h3 class="font-semibold mb-2">Smart TV</h3> <ul class="text-sm text-muted-foreground space-y-1"><li>Samsung Tizen 5+</li> <li>LG webOS 5+</li> <li>Android TV</li></ul> <p class="text-xs text-yellow-400 mt-3">Browser-based</p></div></div></section> <section class="mb-12"><h2 class="text-xl font-semibold mb-4">Minimum Requirements</h2> <div class="bg-card border border-border rounded-xl overflow-hidden"><table class="w-full text-sm"><thead class="bg-muted/30"><tr><th class="text-left px-4 py-3 text-muted-foreground font-medium">Feature</th><th class="text-left px-4 py-3 text-muted-foreground font-medium">Requirement</th></tr></thead><tbody class="divide-y divide-border"><tr><td class="px-4 py-3">Internet speed (SD)</td><td class="px-4 py-3">3 Mbps</td></tr><tr><td class="px-4 py-3">Internet speed (HD)</td><td class="px-4 py-3">5 Mbps</td></tr><tr><td class="px-4 py-3">Internet speed (4K)</td><td class="px-4 py-3">25 Mbps</td></tr><tr><td class="px-4 py-3">RAM (mobile)</td><td class="px-4 py-3">2 GB</td></tr><tr><td class="px-4 py-3">Storage for downloads</td><td class="px-4 py-3">1 GB free (varies by content)</td></tr><tr><td class="px-4 py-3">JavaScript</td><td class="px-4 py-3">Must be enabled</td></tr><tr><td class="px-4 py-3">Cookies</td><td class="px-4 py-3">Must be enabled</td></tr></tbody></table></div></section> <section class="mb-12" id="install"><h2 class="text-xl font-semibold mb-2">Install the App</h2> <p class="text-muted-foreground text-sm mb-6">Sephar Studios is a Progressive Web App — install it on your device for the best experience,
        offline access, and a native app feel with no app store required.</p> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div class="bg-card border border-border rounded-xl p-5"><div class="flex items-center gap-2 mb-3">`);
	Download($$renderer, { class: "w-4 h-4 text-primary" });
	$$renderer.push(`<!----> <h3 class="font-semibold text-sm">Android (Chrome)</h3></div> <ol class="text-sm text-muted-foreground space-y-2 list-decimal list-inside"><li>Open Sephar Studios in Chrome</li> <li>Tap the 3-dot menu in the top right</li> <li>Tap "Add to Home screen"</li> <li>Tap "Add" to confirm</li> <li>The app icon appears on your home screen</li></ol></div> <div class="bg-card border border-border rounded-xl p-5"><div class="flex items-center gap-2 mb-3">`);
	Download($$renderer, { class: "w-4 h-4 text-primary" });
	$$renderer.push(`<!----> <h3 class="font-semibold text-sm">iPhone / iPad (Safari)</h3></div> <ol class="text-sm text-muted-foreground space-y-2 list-decimal list-inside"><li>Open Sephar Studios in Safari</li> <li>Tap the Share button (rectangle with arrow)</li> <li>Scroll down and tap "Add to Home Screen"</li> <li>Tap "Add" to confirm</li> <li>The app icon appears on your home screen</li></ol></div> <div class="bg-card border border-border rounded-xl p-5"><div class="flex items-center gap-2 mb-3">`);
	Download($$renderer, { class: "w-4 h-4 text-primary" });
	$$renderer.push(`<!----> <h3 class="font-semibold text-sm">Desktop (Chrome / Edge)</h3></div> <ol class="text-sm text-muted-foreground space-y-2 list-decimal list-inside"><li>Open Sephar Studios in Chrome or Edge</li> <li>Look for the install icon in the address bar</li> <li>Click it and select "Install"</li> <li>The app opens in its own window</li></ol></div> <div class="bg-card border border-border rounded-xl p-5"><div class="flex items-center gap-2 mb-3">`);
	Wifi($$renderer, { class: "w-4 h-4 text-primary" });
	$$renderer.push(`<!----> <h3 class="font-semibold text-sm">Offline Downloads (Premium+)</h3></div> <ol class="text-sm text-muted-foreground space-y-2 list-decimal list-inside"><li>Install the app on your device</li> <li>Browse to any movie or episode</li> <li>Tap the download icon to save offline</li> <li>Go to your Downloads section</li> <li>Watch without internet</li></ol></div></div></section> <section><h2 class="text-xl font-semibold mb-4 flex items-center gap-2">`);
	Circle_question_mark($$renderer, { class: "w-5 h-5 text-muted-foreground" });
	$$renderer.push(`<!----> Troubleshooting</h2> <div class="space-y-3"><!--[-->`);
	const each_array = ensure_array_like([
		{
			q: "Video won't play or keeps buffering",
			a: "Check your internet speed. Try switching to a lower quality in the player settings. Reload the page. Clear your browser cache."
		},
		{
			q: "Downloads not working",
			a: "Downloads require Premium or Creator plan. Make sure you have enough storage space. Downloads require the app to be installed as a PWA."
		},
		{
			q: "Can't connect wallet",
			a: "Make sure MetaMask or your Web3 wallet is installed and unlocked. Switch to the Polygon Amoy network. Refresh the page after connecting."
		},
		{
			q: "Kids content showing adult content",
			a: "Set up Parental Controls under Settings. Ensure your child's profile is set to Kids type. Enable Safe Exploration Mode."
		},
		{
			q: "App not installable",
			a: "Make sure you're using a supported browser (Chrome, Edge, Safari). The install prompt appears automatically on supported devices. Try refreshing the page."
		}
	]);
	for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
		let item = each_array[$$index];
		$$renderer.push(`<details class="bg-card border border-border rounded-xl group"><summary class="px-5 py-4 cursor-pointer text-sm font-medium flex items-center justify-between list-none">${escape_html(item.q)} <span class="text-muted-foreground text-xs group-open:rotate-180 transition-transform">▼</span></summary> <div class="px-5 pb-4 text-sm text-muted-foreground">${escape_html(item.a)}</div></details>`);
	}
	$$renderer.push(`<!--]--></div></section></div></div>`);
}
//#endregion
export { _page as default };
