import { aY as writable } from './ui-libs-BjzLDLAh.js';

//#region src/lib/stores/copilot.ts
/** Set this from any content page. Null = general mode (no specific content). */
var copilotContext = writable(null);
/** Control the open/closed state globally — so other elements can open the chat */
var copilotOpen = writable(false);

export { copilotOpen as a, copilotContext as c };
//# sourceMappingURL=copilot-BqKT2IJl.js.map
