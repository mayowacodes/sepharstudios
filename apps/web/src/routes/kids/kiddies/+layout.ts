// Kids ("kiddies") route group root loader. Originally had an age-gate
// redirect that caused a navigation loop when the parent (/kids) was also
// gated. The redirect lives in /kids/+layout.svelte's profile guard instead;
// this loader is intentionally a no-op so child routes render directly.
export const load = () => {
  return {};
};