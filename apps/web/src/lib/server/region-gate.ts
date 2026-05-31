/**
 * Region gate helpers. The mediaLibrary.geoMode + geoRegions columns
 * declare per-content availability; viewers' country comes from
 * cf-ipcountry / x-vercel-ip-country (parsed by `fingerprintFromHeaders`).
 *
 * Mode semantics:
 *   'all'   — no restriction (default)
 *   'allow' — country must be IN geoRegions
 *   'block' — country must NOT be IN geoRegions
 *
 * Always allow when the country can't be determined; gating viewers who
 * happen to be on a network without the header would be a false-positive
 * UX failure. Always allow when the viewer IS the creator.
 */

export interface RegionGateInput {
	mode: string;
	regions: string[];
	viewerCountry: string | null;
	isOwner: boolean;
}

export function isRegionAllowed(input: RegionGateInput): boolean {
	if (input.isOwner) return true;
	if (input.mode === 'all' || !input.mode) return true;
	if (!input.viewerCountry) return true;
	const inList = input.regions.includes(input.viewerCountry.toUpperCase());
	if (input.mode === 'allow') return inList;
	if (input.mode === 'block') return !inList;
	return true;
}
