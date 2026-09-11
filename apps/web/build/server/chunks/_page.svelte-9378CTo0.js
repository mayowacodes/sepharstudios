import { k as head, q as escape_html, i as attr } from './index.js-CxPEndTa.js';
import { S as SiteMeta } from './constants-BiiFHz9b.js';
import { M as MediaDetailPage } from './MediaDetailPage-BCYIZc3k.js';
import './file-text-By5QqCz6.js';
import './Icon-Bw1rnKTC.js';
import './house-6lS0tROn.js';
import './layout-dashboard-B2Dnc05Q.js';
import './user-DfNTMTjp.js';
import './users-BHfWNfsK.js';
import './bell-BrL1tBn8.js';
import './bookmark-ZSZZcAps.js';
import './check-check-Dhnd8htD.js';
import './check-Dd25bh0_.js';
import './circle-play-D2YB-YnC.js';
import './rotate-ccw-UYdBij60.js';
import './ReviewSection-B03CObfh.js';
import './volume-x-Bbc2TmQl.js';
import './x-57ZXvvuj.js';
import './toast-state.svelte-jhYVYtU8.js';
import './client-DsZfmj3l.js';
import './button-DtPBvYl-.js';
import './utils2-DZI6czOR.js';
import './index-BoGG3uCW.js';
import './myList-e_4PgnNM.js';

//#region src/routes/(app)/shows/[slug]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const { data } = $$props;
		head("13boihu", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>${escape_html(data.content.title)} — Sephar Studios</title>`);
			});
			$$renderer.push(`<meta name="description"${attr("content", data.content.description ?? "")}/> <meta property="og:type" content="video.tv_show"/> <meta property="og:title"${attr("content", `${data.content.title} — Sephar Studios`)}/> <meta property="og:description"${attr("content", data.content.description ?? "")}/> <meta property="og:image"${attr("content", data.content.posterUrl || data.content.thumbnail || `${SiteMeta.link}${SiteMeta.ogimage}`)}/>`);
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

export { _page as default };
//# sourceMappingURL=_page.svelte-9378CTo0.js.map
