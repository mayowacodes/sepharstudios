import { k as head, q as escape_html, i as attr } from './index.js-BP8aAXBX.js';
import { S as SiteMeta } from './constants-DSOCQRom.js';
import { M as MediaDetailPage } from './MediaDetailPage-N0Na6IxD.js';
import './file-text-BWq_Qfpf.js';
import './Icon-DOH8dWtn.js';
import './house-CsvPkjXR.js';
import './layout-dashboard-BBz-1-70.js';
import './user-BOId-Hm8.js';
import './users-C2Q26AgN.js';
import './bell-DqXql3zC.js';
import './bookmark-ChXBTKIF.js';
import './check-check-DmlThrSa.js';
import './check-CTMQVuXr.js';
import './circle-play-rbxPgmu1.js';
import './rotate-ccw-C8xEPT27.js';
import './ReviewSection-CAN8Rk5Q.js';
import './volume-x-D1Fisdy-.js';
import './x-CH8KQLcs.js';
import './toast-state.svelte-B2rj3hM9.js';
import './client-ZoNwVBKD.js';
import './button--do5FSjb.js';
import './utils2-CqskQpUP.js';
import './index-D1eQaiDA.js';
import './myList-Dunyrnu8.js';

//#region src/routes/kids/kiddies/[slug]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const { data } = $$props;
		head("2hsisw", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>${escape_html(data.content.title)} — Sephar Kids</title>`);
			});
			$$renderer.push(`<meta name="description"${attr("content", data.content.description ?? "")}/> <meta property="og:type" content="video.other"/> <meta property="og:title"${attr("content", `${data.content.title} — Sephar Kids`)}/> <meta property="og:description"${attr("content", data.content.description ?? "")}/> <meta property="og:image"${attr("content", data.content.posterUrl || data.content.thumbnail || `${SiteMeta.link}${SiteMeta.ogimage}`)}/>`);
		});
		MediaDetailPage($$renderer, {
			content: data.content,
			episodes: data.episodes,
			watchProgress: data.watchProgress,
			isInMyList: data.isInMyList,
			mode: "kids",
			previewDurationSec: 15
		});
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-CugR0sJj.js.map
