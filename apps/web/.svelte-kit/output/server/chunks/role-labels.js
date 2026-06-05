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
//#endregion
export { sectionLabel as n, translateRole as r, normalizeLocale as t };
