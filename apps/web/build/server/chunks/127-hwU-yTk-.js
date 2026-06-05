import { w as db, M as mediaLibrary, Y as ppvContent, Z as ppvPurchases, o as contentSubtitleTracks } from './drizzle-CKUH7ukq.js';
import { d as getEncoderPlayback } from './encoder-orchestrator-CM-fqCvD.js';
import { f as fingerprintFromHeaders } from './ua-country-BNOH1xSS.js';
import { e as error } from './index-Cv5VcsYq.js';
import { eq, and, sql, ne, desc } from 'drizzle-orm';

//#region src/lib/i18n/role-labels.ts
/**
* Cast / crew role-label translations.
*
* Names are NOT translated (they're proper nouns); only the role label
* — "Director", "Producer", "Actor" — is locale-aware so French/Spanish/
* Portuguese viewers see "Réalisateur", "Director", "Diretor", etc.
*
* Unknown roles fall back to the original string. Lookup is
* case-insensitive. Extend the table as needed — keep keys lower-case.
*/
var LABELS = {
	actor: {
		en: "Actor",
		es: "Actor",
		fr: "Acteur",
		pt: "Ator",
		de: "Schauspieler"
	},
	actress: {
		en: "Actress",
		es: "Actriz",
		fr: "Actrice",
		pt: "Atriz",
		de: "Schauspielerin"
	},
	cameo: {
		en: "Cameo",
		es: "Cameo",
		fr: "Caméo",
		pt: "Aparição",
		de: "Gastauftritt"
	},
	narrator: {
		en: "Narrator",
		es: "Narrador",
		fr: "Narrateur",
		pt: "Narrador",
		de: "Erzähler"
	},
	voice: {
		en: "Voice",
		es: "Voz",
		fr: "Voix",
		pt: "Voz",
		de: "Stimme"
	},
	director: {
		en: "Director",
		es: "Director",
		fr: "Réalisateur",
		pt: "Diretor",
		de: "Regisseur"
	},
	producer: {
		en: "Producer",
		es: "Productor",
		fr: "Producteur",
		pt: "Produtor",
		de: "Produzent"
	},
	"executive producer": {
		en: "Executive Producer",
		es: "Productor ejecutivo",
		fr: "Producteur exécutif",
		pt: "Produtor executivo",
		de: "Ausführender Produzent"
	},
	writer: {
		en: "Writer",
		es: "Guionista",
		fr: "Scénariste",
		pt: "Roteirista",
		de: "Drehbuchautor"
	},
	screenwriter: {
		en: "Screenwriter",
		es: "Guionista",
		fr: "Scénariste",
		pt: "Roteirista",
		de: "Drehbuchautor"
	},
	editor: {
		en: "Editor",
		es: "Editor",
		fr: "Monteur",
		pt: "Editor",
		de: "Cutter"
	},
	cinematographer: {
		en: "Cinematographer",
		es: "Director de fotografía",
		fr: "Directeur de la photographie",
		pt: "Diretor de fotografia",
		de: "Kameramann"
	},
	"director of photography": {
		en: "Director of Photography",
		es: "Director de fotografía",
		fr: "Directeur de la photographie",
		pt: "Diretor de fotografia",
		de: "Kameramann"
	},
	dp: {
		en: "DP",
		es: "Director de fotografía",
		fr: "Directeur photo",
		pt: "DF",
		de: "Bildgestalter"
	},
	composer: {
		en: "Composer",
		es: "Compositor",
		fr: "Compositeur",
		pt: "Compositor",
		de: "Komponist"
	},
	"music supervisor": {
		en: "Music Supervisor",
		es: "Supervisor musical",
		fr: "Superviseur musical",
		pt: "Supervisor musical",
		de: "Musikbetreuer"
	},
	"sound designer": {
		en: "Sound Designer",
		es: "Diseñador de sonido",
		fr: "Concepteur sonore",
		pt: "Designer de som",
		de: "Sound Designer"
	},
	"production designer": {
		en: "Production Designer",
		es: "Diseñador de producción",
		fr: "Chef décorateur",
		pt: "Diretor de arte",
		de: "Szenenbildner"
	},
	"costume designer": {
		en: "Costume Designer",
		es: "Diseñador de vestuario",
		fr: "Costumier",
		pt: "Figurinista",
		de: "Kostümbildner"
	},
	"makeup artist": {
		en: "Makeup Artist",
		es: "Maquillador",
		fr: "Maquilleur",
		pt: "Maquiador",
		de: "Maskenbildner"
	},
	"special effects": {
		en: "Special Effects",
		es: "Efectos especiales",
		fr: "Effets spéciaux",
		pt: "Efeitos especiais",
		de: "Spezialeffekte"
	},
	"visual effects": {
		en: "Visual Effects",
		es: "Efectos visuales",
		fr: "Effets visuels",
		pt: "Efeitos visuais",
		de: "Visuelle Effekte"
	},
	gaffer: {
		en: "Gaffer",
		es: "Gaffer",
		fr: "Chef électricien",
		pt: "Gaffer",
		de: "Oberbeleuchter"
	},
	"key grip": {
		en: "Key Grip",
		es: "Jefe de tramoya",
		fr: "Chef machiniste",
		pt: "Chefe de equipe",
		de: "Bühnenmeister"
	}
};
/** Section headings — "Cast" / "Crew" / "as <character>". */
var SECTIONS = {
	cast: {
		en: "Cast",
		es: "Reparto",
		fr: "Distribution",
		pt: "Elenco",
		de: "Besetzung"
	},
	crew: {
		en: "Crew",
		es: "Equipo",
		fr: "Équipe",
		pt: "Equipe",
		de: "Crew"
	},
	as: {
		en: "as",
		es: "como",
		fr: "dans le rôle de",
		pt: "como",
		de: "als"
	},
	castAndCrew: {
		en: "Cast & crew",
		es: "Reparto y equipo",
		fr: "Distribution et équipe",
		pt: "Elenco e equipe",
		de: "Besetzung & Crew"
	}
};
var SUPPORTED = [
	"en",
	"es",
	"fr",
	"pt",
	"de"
];
/** Normalize "fr-CA" → "fr", drop unsupported locales back to 'en'. */
function normalizeLocale(input) {
	if (!input) return "en";
	const base = input.toLowerCase().split(/[-_]/)[0];
	return SUPPORTED.includes(base) ? base : "en";
}
function translateRole(role, locale) {
	const key = role.trim().toLowerCase();
	const loc = normalizeLocale(locale);
	const entry = LABELS[key];
	if (entry && entry[loc]) return entry[loc];
	return role;
}
function sectionLabel(key, locale) {
	const loc = normalizeLocale(locale);
	return SECTIONS[key]?.[loc] ?? SECTIONS[key]?.en ?? key;
}

//#region src/lib/server/region-gate.ts
function isRegionAllowed(input) {
	if (input.isOwner) return true;
	if (input.mode === "all" || !input.mode) return true;
	if (!input.viewerCountry) return true;
	const inList = input.regions.includes(input.viewerCountry.toUpperCase());
	if (input.mode === "allow") return inList;
	if (input.mode === "block") return !inList;
	return true;
}
//#endregion
//#region src/routes/watch/[id]/+page.server.ts
var load = async ({ params, locals, request }) => {
	const session = await locals.auth.getSession();
	if (!session) error(401, "Please sign in to watch content");
	const content = await db.select({
		id: mediaLibrary.id,
		title: mediaLibrary.title,
		description: mediaLibrary.description,
		thumbnail: mediaLibrary.thumbnail,
		posterUrl: mediaLibrary.posterUrl,
		backdropUrl: mediaLibrary.backdropUrl,
		videoUrl: mediaLibrary.videoUrl,
		videoId: mediaLibrary.videoId,
		encoderJobId: mediaLibrary.encoderJobId,
		processingStatus: mediaLibrary.processingStatus,
		mediaType: mediaLibrary.mediaType,
		genres: mediaLibrary.genres,
		topics: mediaLibrary.topics,
		duration: mediaLibrary.duration,
		year: mediaLibrary.year,
		rating: mediaLibrary.rating,
		ageRating: mediaLibrary.ageRating,
		bibleReference: mediaLibrary.bibleReference,
		language: mediaLibrary.language,
		category: mediaLibrary.category,
		trailerUrl: mediaLibrary.trailerUrl,
		createdAt: mediaLibrary.createdAt,
		isActive: mediaLibrary.isActive,
		visibility: mediaLibrary.visibility,
		creatorId: mediaLibrary.creatorId,
		chapters: mediaLibrary.chapters,
		cast: mediaLibrary.cast,
		crew: mediaLibrary.crew,
		geoMode: mediaLibrary.geoMode,
		geoRegions: mediaLibrary.geoRegions,
		nextUpContentIds: mediaLibrary.nextUpContentIds,
		previewThumbnailsVtt: mediaLibrary.previewThumbnailsVtt,
		previewSpriteUrls: mediaLibrary.previewSpriteUrls,
		posterAutoUrl: mediaLibrary.posterAutoUrl
	}).from(mediaLibrary).where(eq(mediaLibrary.id, params.id)).then((r) => r[0]);
	if (!content || !content.isActive) error(404, "Content not found");
	const isOwner = content.creatorId === session.user.id;
	if (content.visibility === "private" && !isOwner) error(404, "Content not found");
	const fingerprint = fingerprintFromHeaders(request.headers);
	if (!isRegionAllowed({
		mode: content.geoMode ?? "all",
		regions: Array.isArray(content.geoRegions) ? content.geoRegions : [],
		viewerCountry: fingerprint.country,
		isOwner
	})) error(451, "This title isn’t available in your region.");
	let paywall = null;
	if (!isOwner) {
		const [ppvRow] = await db.select({
			priceCents: ppvContent.finalPriceCents,
			currency: ppvContent.currency
		}).from(ppvContent).where(and(eq(ppvContent.contentId, content.id), eq(ppvContent.isActive, true))).limit(1);
		if (ppvRow) {
			const [purchase] = await db.select({ id: ppvPurchases.id }).from(ppvPurchases).where(and(eq(ppvPurchases.userId, session.user.id), eq(ppvPurchases.contentId, content.id))).limit(1);
			paywall = {
				required: !purchase,
				priceCents: ppvRow.priceCents,
				currency: (ppvRow.currency ?? "USD").toUpperCase()
			};
		}
	}
	const tracks = await db.select().from(contentSubtitleTracks).where(eq(contentSubtitleTracks.contentId, content.id));
	const subtitles = tracks.filter((t) => t.kind !== "descriptions").map((t) => ({
		label: t.label,
		src: t.fileUrl,
		srclang: t.language
	}));
	const descriptions = tracks.filter((t) => t.kind === "descriptions").map((t) => ({
		label: t.label,
		src: t.fileUrl,
		srclang: t.language
	}));
	let playbackUrl = content.videoUrl;
	if (!playbackUrl && content.encoderJobId && content.processingStatus === "ready") try {
		playbackUrl = (await getEncoderPlayback(content.encoderJobId)).playback.master;
	} catch (err) {
		console.error(`Failed to sign playback URL for ${content.id}:`, err);
	}
	const nextUp = [];
	const curatedIds = Array.isArray(content.nextUpContentIds) ? content.nextUpContentIds : [];
	if (curatedIds.length > 0) {
		const curatedRows = await db.select({
			id: mediaLibrary.id,
			title: mediaLibrary.title,
			thumbnail: mediaLibrary.thumbnail,
			duration: mediaLibrary.duration
		}).from(mediaLibrary).where(and(sql`${mediaLibrary.id} = ANY(${curatedIds})`, eq(mediaLibrary.isActive, true))).limit(3);
		const byId = new Map(curatedRows.map((r) => [r.id, r]));
		for (const cid of curatedIds) {
			const r = byId.get(cid);
			if (!r) continue;
			nextUp.push({
				id: r.id,
				title: r.title,
				thumbnail: r.thumbnail ?? null,
				duration: r.duration ?? null
			});
			if (nextUp.length >= 3) break;
		}
	}
	if (nextUp.length === 0 && content.creatorId) {
		const sameCreator = await db.select({
			id: mediaLibrary.id,
			title: mediaLibrary.title,
			thumbnail: mediaLibrary.thumbnail,
			duration: mediaLibrary.duration
		}).from(mediaLibrary).where(and(eq(mediaLibrary.creatorId, content.creatorId), ne(mediaLibrary.id, content.id), eq(mediaLibrary.isActive, true), eq(mediaLibrary.visibility, "public"))).orderBy(desc(mediaLibrary.viewCount)).limit(3);
		for (const r of sameCreator) nextUp.push({
			id: r.id,
			title: r.title,
			thumbnail: r.thumbnail ?? null,
			duration: r.duration ?? null
		});
	}
	if (nextUp.length < 3 && Array.isArray(content.genres) && content.genres.length > 0) {
		const genres = content.genres;
		const sameGenre = await db.select({
			id: mediaLibrary.id,
			title: mediaLibrary.title,
			thumbnail: mediaLibrary.thumbnail,
			duration: mediaLibrary.duration
		}).from(mediaLibrary).where(and(ne(mediaLibrary.id, content.id), eq(mediaLibrary.isActive, true), eq(mediaLibrary.visibility, "public"), sql`${mediaLibrary.genres} ?| array[${sql.join(genres.map((g) => sql`${g}`), sql`, `)}]`)).orderBy(desc(mediaLibrary.viewCount)).limit(3 - nextUp.length);
		for (const r of sameGenre) if (!nextUp.find((x) => x.id === r.id)) nextUp.push({
			id: r.id,
			title: r.title,
			thumbnail: r.thumbnail ?? null,
			duration: r.duration ?? null
		});
	}
	const localeOverride = new URL(request.url).searchParams.get("locale");
	const acceptLang = request.headers.get("accept-language")?.split(",")[0]?.trim();
	const viewerLocale = normalizeLocale(localeOverride || acceptLang);
	return {
		content: {
			...content,
			playbackUrl
		},
		subtitles,
		descriptions,
		nextUp,
		viewerLocale,
		paywall,
		activeProfileId: locals.activeProfileId
	};
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

const index = 127;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-u39tI0TY.js')).default;
const server_id = "src/routes/watch/[id]/+page.server.ts";
const imports = ["_app/immutable/nodes/127.Cfeeh1Aq.js","_app/immutable/chunks/BrQ41psm.js","_app/immutable/chunks/CocL4akC.js","_app/immutable/chunks/-c01j_DQ.js","_app/immutable/chunks/BYLiR5YE.js","_app/immutable/chunks/CWwGv6Bu.js","_app/immutable/chunks/DvMOey9o2.js","_app/immutable/chunks/j5L7JOaG.js","_app/immutable/chunks/Dy-TKAjK.js","_app/immutable/chunks/DdntYR2r.js","_app/immutable/chunks/DbP8MhBG2.js","_app/immutable/chunks/DZXko5A82.js","_app/immutable/chunks/DQQV4u0O2.js","_app/immutable/chunks/BC4b7XLa.js","_app/immutable/chunks/GKWuiuOh.js","_app/immutable/chunks/BOpLWbne.js","_app/immutable/chunks/kNaey6uv.js","_app/immutable/chunks/Cqn-zCcn2.js","_app/immutable/chunks/Cry5QRAL.js","_app/immutable/chunks/DFS-vUwq2.js","_app/immutable/chunks/DrlkLnen2.js","_app/immutable/chunks/B3AYJye92.js","_app/immutable/chunks/BkYdGwXx.js"];
const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css"];
const fonts = [];

var _127 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	component: component,
	fonts: fonts,
	imports: imports,
	index: index,
	server: _page_server_ts,
	server_id: server_id,
	stylesheets: stylesheets
});

export { _127 as _, sectionLabel as s, translateRole as t };
//# sourceMappingURL=127-hwU-yTk-.js.map
