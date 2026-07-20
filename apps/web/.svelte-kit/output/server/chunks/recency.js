//#region src/lib/utils/recency.ts
var RECENT_WINDOW_MS = 336 * 60 * 60 * 1e3;
function isRecentlyAdded(value) {
	if (!value) return false;
	const ts = value instanceof Date ? value.getTime() : Date.parse(value);
	if (Number.isNaN(ts)) return false;
	return Date.now() - ts <= RECENT_WINDOW_MS;
}
//#endregion
export { isRecentlyAdded as t };
