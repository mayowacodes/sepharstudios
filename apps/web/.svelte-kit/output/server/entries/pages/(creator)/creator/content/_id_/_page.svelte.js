import { Et as derived, vt as onDestroy } from "../../../../../../chunks/ui-libs.js";
import "../../../../../../chunks/archive.js";
import { t as Arrow_left } from "../../../../../../chunks/arrow-left.js";
import "../../../../../../chunks/external-link.js";
import "../../../../../../chunks/ContentThreadPanel.js";
import "../../../../../../chunks/trash-2.js";
import "../../../../../../chunks/toast-state.svelte.js";
import { t as beforeNavigate } from "../../../../../../chunks/client.js";
import { t as page } from "../../../../../../chunks/state.js";
import "../../../../../../chunks/live-region.js";
import "../../../../../../chunks/navigation.js";
import "../../../../../../chunks/VideoPlayer.js";
new Map([
	{
		code: "US",
		name: "United States"
	},
	{
		code: "GB",
		name: "United Kingdom"
	},
	{
		code: "CA",
		name: "Canada"
	},
	{
		code: "AU",
		name: "Australia"
	},
	{
		code: "NZ",
		name: "New Zealand"
	},
	{
		code: "IE",
		name: "Ireland"
	},
	{
		code: "ZA",
		name: "South Africa"
	},
	{
		code: "NG",
		name: "Nigeria"
	},
	{
		code: "KE",
		name: "Kenya"
	},
	{
		code: "GH",
		name: "Ghana"
	},
	{
		code: "UG",
		name: "Uganda"
	},
	{
		code: "TZ",
		name: "Tanzania"
	},
	{
		code: "ET",
		name: "Ethiopia"
	},
	{
		code: "EG",
		name: "Egypt"
	},
	{
		code: "MA",
		name: "Morocco"
	},
	{
		code: "DZ",
		name: "Algeria"
	},
	{
		code: "TN",
		name: "Tunisia"
	},
	{
		code: "SN",
		name: "Senegal"
	},
	{
		code: "CM",
		name: "Cameroon"
	},
	{
		code: "CI",
		name: "Côte d'Ivoire"
	},
	{
		code: "RW",
		name: "Rwanda"
	},
	{
		code: "ZM",
		name: "Zambia"
	},
	{
		code: "ZW",
		name: "Zimbabwe"
	},
	{
		code: "BW",
		name: "Botswana"
	},
	{
		code: "NA",
		name: "Namibia"
	},
	{
		code: "MZ",
		name: "Mozambique"
	},
	{
		code: "AO",
		name: "Angola"
	},
	{
		code: "IN",
		name: "India"
	},
	{
		code: "PK",
		name: "Pakistan"
	},
	{
		code: "BD",
		name: "Bangladesh"
	},
	{
		code: "LK",
		name: "Sri Lanka"
	},
	{
		code: "NP",
		name: "Nepal"
	},
	{
		code: "CN",
		name: "China"
	},
	{
		code: "JP",
		name: "Japan"
	},
	{
		code: "KR",
		name: "South Korea"
	},
	{
		code: "TW",
		name: "Taiwan"
	},
	{
		code: "HK",
		name: "Hong Kong"
	},
	{
		code: "SG",
		name: "Singapore"
	},
	{
		code: "MY",
		name: "Malaysia"
	},
	{
		code: "TH",
		name: "Thailand"
	},
	{
		code: "VN",
		name: "Vietnam"
	},
	{
		code: "PH",
		name: "Philippines"
	},
	{
		code: "ID",
		name: "Indonesia"
	},
	{
		code: "MM",
		name: "Myanmar"
	},
	{
		code: "KH",
		name: "Cambodia"
	},
	{
		code: "LA",
		name: "Laos"
	},
	{
		code: "DE",
		name: "Germany"
	},
	{
		code: "FR",
		name: "France"
	},
	{
		code: "ES",
		name: "Spain"
	},
	{
		code: "IT",
		name: "Italy"
	},
	{
		code: "PT",
		name: "Portugal"
	},
	{
		code: "NL",
		name: "Netherlands"
	},
	{
		code: "BE",
		name: "Belgium"
	},
	{
		code: "LU",
		name: "Luxembourg"
	},
	{
		code: "CH",
		name: "Switzerland"
	},
	{
		code: "AT",
		name: "Austria"
	},
	{
		code: "SE",
		name: "Sweden"
	},
	{
		code: "NO",
		name: "Norway"
	},
	{
		code: "DK",
		name: "Denmark"
	},
	{
		code: "FI",
		name: "Finland"
	},
	{
		code: "IS",
		name: "Iceland"
	},
	{
		code: "PL",
		name: "Poland"
	},
	{
		code: "CZ",
		name: "Czechia"
	},
	{
		code: "SK",
		name: "Slovakia"
	},
	{
		code: "HU",
		name: "Hungary"
	},
	{
		code: "RO",
		name: "Romania"
	},
	{
		code: "BG",
		name: "Bulgaria"
	},
	{
		code: "HR",
		name: "Croatia"
	},
	{
		code: "SI",
		name: "Slovenia"
	},
	{
		code: "RS",
		name: "Serbia"
	},
	{
		code: "BA",
		name: "Bosnia and Herzegovina"
	},
	{
		code: "MK",
		name: "North Macedonia"
	},
	{
		code: "AL",
		name: "Albania"
	},
	{
		code: "ME",
		name: "Montenegro"
	},
	{
		code: "GR",
		name: "Greece"
	},
	{
		code: "CY",
		name: "Cyprus"
	},
	{
		code: "TR",
		name: "Türkiye"
	},
	{
		code: "IL",
		name: "Israel"
	},
	{
		code: "PS",
		name: "Palestine"
	},
	{
		code: "JO",
		name: "Jordan"
	},
	{
		code: "LB",
		name: "Lebanon"
	},
	{
		code: "SY",
		name: "Syria"
	},
	{
		code: "IQ",
		name: "Iraq"
	},
	{
		code: "IR",
		name: "Iran"
	},
	{
		code: "SA",
		name: "Saudi Arabia"
	},
	{
		code: "AE",
		name: "United Arab Emirates"
	},
	{
		code: "QA",
		name: "Qatar"
	},
	{
		code: "KW",
		name: "Kuwait"
	},
	{
		code: "BH",
		name: "Bahrain"
	},
	{
		code: "OM",
		name: "Oman"
	},
	{
		code: "YE",
		name: "Yemen"
	},
	{
		code: "AF",
		name: "Afghanistan"
	},
	{
		code: "RU",
		name: "Russia"
	},
	{
		code: "UA",
		name: "Ukraine"
	},
	{
		code: "BY",
		name: "Belarus"
	},
	{
		code: "MD",
		name: "Moldova"
	},
	{
		code: "GE",
		name: "Georgia"
	},
	{
		code: "AM",
		name: "Armenia"
	},
	{
		code: "AZ",
		name: "Azerbaijan"
	},
	{
		code: "KZ",
		name: "Kazakhstan"
	},
	{
		code: "UZ",
		name: "Uzbekistan"
	},
	{
		code: "TM",
		name: "Turkmenistan"
	},
	{
		code: "TJ",
		name: "Tajikistan"
	},
	{
		code: "KG",
		name: "Kyrgyzstan"
	},
	{
		code: "MN",
		name: "Mongolia"
	},
	{
		code: "MX",
		name: "Mexico"
	},
	{
		code: "GT",
		name: "Guatemala"
	},
	{
		code: "BZ",
		name: "Belize"
	},
	{
		code: "SV",
		name: "El Salvador"
	},
	{
		code: "HN",
		name: "Honduras"
	},
	{
		code: "NI",
		name: "Nicaragua"
	},
	{
		code: "CR",
		name: "Costa Rica"
	},
	{
		code: "PA",
		name: "Panama"
	},
	{
		code: "CU",
		name: "Cuba"
	},
	{
		code: "DO",
		name: "Dominican Republic"
	},
	{
		code: "HT",
		name: "Haiti"
	},
	{
		code: "JM",
		name: "Jamaica"
	},
	{
		code: "PR",
		name: "Puerto Rico"
	},
	{
		code: "TT",
		name: "Trinidad and Tobago"
	},
	{
		code: "BB",
		name: "Barbados"
	},
	{
		code: "BS",
		name: "Bahamas"
	},
	{
		code: "BR",
		name: "Brazil"
	},
	{
		code: "AR",
		name: "Argentina"
	},
	{
		code: "CL",
		name: "Chile"
	},
	{
		code: "PE",
		name: "Peru"
	},
	{
		code: "CO",
		name: "Colombia"
	},
	{
		code: "VE",
		name: "Venezuela"
	},
	{
		code: "EC",
		name: "Ecuador"
	},
	{
		code: "BO",
		name: "Bolivia"
	},
	{
		code: "PY",
		name: "Paraguay"
	},
	{
		code: "UY",
		name: "Uruguay"
	}
].map((c) => [c.code, c.name]));
//#endregion
//#region src/routes/(creator)/creator/content/[id]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		derived(() => page.params.id);
		const initialTabFromQuery = page.url.searchParams.get("tab");
		initialTabFromQuery && [
			"details",
			"images",
			"video",
			"subtitles",
			"chapters",
			"episodes",
			"analytics",
			"thread"
		].includes(initialTabFromQuery);
		let editTitle = "";
		let editDescription = "";
		let editContentType = "movie";
		let editAgeRating = "";
		let editGenres = "";
		let editTopics = "";
		let editKeywords = "";
		let editBibleReference = "";
		let editLanguage = "";
		let editDuration = "";
		let editVisibility = "public";
		let editScheduledPublishAt = "";
		let editChapters = [];
		let editCast = [];
		let editCrew = [];
		let editGeoMode = "all";
		let editGeoRegions = [];
		let editNextUpIds = [];
		derived(() => JSON.stringify({
			editTitle,
			editDescription,
			editContentType,
			editAgeRating,
			editGenres,
			editTopics,
			editKeywords,
			editBibleReference,
			editLanguage,
			editDuration,
			editVisibility,
			editScheduledPublishAt,
			editChapters,
			editCast,
			editCrew,
			editGeoMode,
			editGeoRegions,
			editNextUpIds
		}));
		const isDirty = derived(() => false);
		let encoderSse = null;
		derived(() => false);
		beforeNavigate(({ cancel }) => {
			if (isDirty() && !confirm("You have unsaved changes. Leave anyway?")) cancel();
		});
		function beforeUnloadHandler(e) {
			if (isDirty()) {
				e.preventDefault();
				e.returnValue = "";
			}
		}
		onDestroy(() => {
			if (encoderSse) {
				encoderSse.close();
				encoderSse = null;
			}
			if (typeof window !== "undefined") window.removeEventListener("beforeunload", beforeUnloadHandler);
		});
		$$renderer.push(`<div class="container mx-auto py-6 px-4 space-y-6 min-h-screen"><a href="/creator/content" class="text-xs text-primary hover:opacity-80 inline-flex items-center gap-1">`);
		Arrow_left($$renderer, { class: "w-3 h-3" });
		$$renderer.push(`<!----> Back to content</a> `);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="text-center text-muted-foreground py-12">Loading…</div>`);
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
export { _page as default };
