import { k as head, q as escape_html, i as attr } from './index.js-DwRgOKlO.js';
import { S as SiteMeta } from './constants-RccSloty.js';
import { M as MediaDetailPage } from './MediaDetailPage-BKoPEloD.js';
import './file-text-CHS0iqgH.js';
import './Icon-C7ASqKku.js';
import './house-XwjJ8C_P.js';
import './layout-dashboard-BnGht0MN.js';
import './user-D4TNxAED.js';
import './users-Cy8n6xcU.js';
import './bell-DfUUzOyO.js';
import './bookmark-CLrxsfBk.js';
import './check-check-BPtLS_Iw.js';
import './check-wXMKuUnA.js';
import './circle-play-Bz79mOxb.js';
import './rotate-ccw-BCzVhbOX.js';
import './ReviewSection-Bevk701D.js';
import './volume-x-CA54XE_R.js';
import './x-rv9H-xuH.js';
import './toast-state.svelte-_bigiMZf.js';
import './client-BnGpewQC.js';
import './button-CGRNF9DE.js';
import './utils2-DHW1aw82.js';
import './index-CMAaDatn.js';
import './myList-CuSSJxPp.js';

//#region src/routes/kids/teens/[slug]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const { data } = $$props;
		head("d87x1m", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>${escape_html(data.content.title)} — Sephar Teens</title>`);
			});
			$$renderer.push(`<meta name="description"${attr("content", data.content.description ?? "")}/> <meta property="og:type" content="video.other"/> <meta property="og:title"${attr("content", `${data.content.title} — Sephar Teens`)}/> <meta property="og:description"${attr("content", data.content.description ?? "")}/> <meta property="og:image"${attr("content", data.content.posterUrl || data.content.thumbnail || `${SiteMeta.link}${SiteMeta.ogimage}`)}/>`);
		});
		MediaDetailPage($$renderer, {
			content: data.content,
			episodes: data.episodes,
			watchProgress: data.watchProgress,
			isInMyList: data.isInMyList,
			mode: "teens",
			previewDurationSec: 15
		});
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-BoOE54de.js.map
