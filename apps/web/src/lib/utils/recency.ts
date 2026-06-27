// How long a catalog row counts as "Just added" on cards. 14 days lines
// up with the rotation expectation from product — anything older has
// usually been seen by the audience that watches the relevant rows.
const RECENT_WINDOW_DAYS = 14;
const RECENT_WINDOW_MS = RECENT_WINDOW_DAYS * 24 * 60 * 60 * 1000;

export function isRecentlyAdded(value: string | Date | null | undefined): boolean {
  if (!value) return false;
  const ts = value instanceof Date ? value.getTime() : Date.parse(value);
  if (Number.isNaN(ts)) return false;
  return Date.now() - ts <= RECENT_WINDOW_MS;
}
