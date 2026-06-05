import { Tt as head, wt as ensure_array_like, zt as escape_html } from "../../../../../chunks/ui-libs.js";
import { t as File_text } from "../../../../../chunks/file-text.js";
import { t as Mail } from "../../../../../chunks/mail.js";
import { t as Shield_check } from "../../../../../chunks/shield-check.js";
import { t as Triangle_alert } from "../../../../../chunks/triangle-alert.js";
import { t as Button } from "../../../../../chunks/button.js";
import { t as PageHeader } from "../../../../../chunks/PageHeader.js";
//#region src/routes/(creator)/creator/copyright/+page.svelte
function _page($$renderer) {
	const sections = [
		{
			title: "1. You own what you upload",
			body: `When you upload original work to Sephar Studios you retain full ownership of the underlying copyright.
You grant us a worldwide, non-exclusive licence to host, stream, transcode, cache, distribute and promote that content
through our apps, mirrors, NFT subscription channels and CDN partners — strictly for the purpose of operating the platform.`
		},
		{
			title: "2. Originality and clearances",
			body: `By submitting content you affirm that you either authored it, hold the master rights, or have written permission
from every party with a copyright, neighbouring-right, performance, or publicity claim. This includes music synchronisation
licences, location releases, talent and crew releases, and any underlying literary work (scripts, books, devotionals).`
		},
		{
			title: "3. Scripture quotations and translations",
			body: `Quoting Scripture is encouraged. Translations are not all in the public domain — NIV, NLT, MSG, AMP, NKJV and
many others remain copyrighted. If your quotation budget exceeds the translation's fair-use threshold, secure permission
from the rights-holder before submission. KJV, ASV and most ancient-language texts (Hebrew, Greek, Aramaic, Latin Vulgate)
are public domain in all jurisdictions we serve.`
		},
		{
			title: "4. Third-party assets",
			body: `Stock footage, photography, music, fonts and graphics must be licensed for commercial streaming. Royalty-free
sites that prohibit "broadcast" or "subscription" use do not qualify. We will request proof of licence on any flagged asset.`
		},
		{
			title: "5. DMCA / takedown process",
			body: `If you believe content on Sephar Studios infringes a copyright you own or represent, send a takedown notice to
copyright@sepharstudios.com containing: identification of the work, the URL of the infringing item, your contact details,
a statement of good-faith belief, a statement under penalty of perjury, and your signature. Counter-notices follow the
standard DMCA flow — see § 7.`
		},
		{
			title: "6. Repeat infringer policy",
			body: `Three substantiated infringement strikes within twelve months results in permanent removal of the creator's
account, forfeiture of pending revenue share, and recovery of any STC paid out for the infringing works.`
		},
		{
			title: "7. Counter-notification",
			body: `Creators whose work was removed in error may file a counter-notification at copyright@sepharstudios.com. We
restore content 10–14 business days after counter-notice unless the original complainant files suit.`
		},
		{
			title: "8. Faith-based content review",
			body: `Sephar Studios is a faith-based platform. Submissions that misrepresent quoted scripture, attribute fabricated
quotes to historical religious figures, or weaponise theological material against named individuals or communities will
be removed independently of copyright status. See the content guidelines for the full review rubric.`
		},
		{
			title: "9. NFT subscription mechanics and copyright",
			body: `Subscription NFTs grant viewing access only. They do not transfer any copyright, distribution right, or right
to re-stream content elsewhere. STC token holdings do not constitute equity in any creator's work.`
		},
		{
			title: "10. Contact",
			body: `Copyright matters: copyright@sepharstudios.com — General creator support: support@sepharstudios.com — DMCA
agent: copyright@sepharstudios.com.`
		}
	];
	head("129e569", $$renderer, ($$renderer) => {
		$$renderer.title(($$renderer) => {
			$$renderer.push(`<title>Creator Copyright Policy · Sephar Studios</title>`);
		});
		$$renderer.push(`<meta name="description" content="Copyright, licensing and DMCA policy for Sephar Studios creators."/>`);
	});
	$$renderer.push(`<div class="container mx-auto max-w-3xl py-6 px-4 space-y-6">`);
	PageHeader($$renderer, {
		icon: Shield_check,
		title: "Copyright & Licensing",
		subtitle: "Last updated 2026-05-27. By uploading you agree to every clause below."
	});
	$$renderer.push(`<!----> <div class="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex gap-3">`);
	Triangle_alert($$renderer, { class: "w-5 h-5 text-yellow-300 shrink-0 mt-0.5" });
	$$renderer.push(`<!----> <p class="text-sm">If you are unsure whether you have the rights to publish something, <strong>don't upload it.</strong> Email <a class="underline" href="mailto:copyright@sepharstudios.com">copyright@sepharstudios.com</a> first — pre-submission clearance is free and avoids strikes.</p></div> <ol class="space-y-6"><!--[-->`);
	const each_array = ensure_array_like(sections);
	for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
		let section = each_array[$$index];
		$$renderer.push(`<li class="bg-card border border-border rounded-xl p-5 space-y-2"><h2 class="text-lg font-semibold flex items-center gap-2">`);
		File_text($$renderer, { class: "w-4 h-4 text-primary" });
		$$renderer.push(`<!---->${escape_html(section.title)}</h2> <p class="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">${escape_html(section.body)}</p></li>`);
	}
	$$renderer.push(`<!--]--></ol> <footer class="bg-card border border-border rounded-xl p-5 text-center space-y-3">`);
	Mail($$renderer, { class: "w-6 h-6 text-primary mx-auto" });
	$$renderer.push(`<!----> <p class="text-sm text-muted-foreground">Questions about anything above? Reach the copyright team directly.</p> `);
	Button($$renderer, {
		href: "mailto:copyright@sepharstudios.com",
		children: ($$renderer) => {
			$$renderer.push(`<!---->Email copyright@sepharstudios.com`);
		},
		$$slots: { default: true }
	});
	$$renderer.push(`<!----></footer></div>`);
}
//#endregion
export { _page as default };
