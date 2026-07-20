import { Ht as attr, Wt as escape_html, kt as head } from "../../../../../chunks/ui-libs.js";
import { i as SiteMeta } from "../../../../../chunks/constants.js";
import { t as MediaDetailPage } from "../../../../../chunks/MediaDetailPage.js";
//#region src/routes/(app)/documentaries/[slug]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const { data } = $$props;
		head("1a5vu5l", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>${escape_html(data.content.title)} — Sephar Studios</title>`);
			});
			$$renderer.push(`<meta name="description"${attr("content", data.content.description ?? "")}/> <meta property="og:type" content="video.other"/> <meta property="og:title"${attr("content", `${data.content.title} — Sephar Studios`)}/> <meta property="og:description"${attr("content", data.content.description ?? "")}/> <meta property="og:image"${attr("content", data.content.posterUrl || data.content.thumbnail || `${SiteMeta.link}${SiteMeta.ogimage}`)}/>`);
		});
		MediaDetailPage($$renderer, {
			content: data.content,
			episodes: data.episodes,
			watchProgress: data.watchProgress,
			isInMyList: data.isInMyList,
			mode: "standard",
			previewDurationSec: 60
		});
	});
}
//#endregion
export { _page as default };
