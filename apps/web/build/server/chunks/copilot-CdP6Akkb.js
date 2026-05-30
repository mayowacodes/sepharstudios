import { aQ as writable } from './ui-libs-TtGtWAGI.js';

//#region src/lib/stores/copilot.ts
/** Set this from any content page. Null = general mode (no specific content). */
var copilotContext = writable(null);
/** Control the open/closed state globally — so other elements can open the chat */
var copilotOpen = writable(false);

export { copilotOpen as a, copilotContext as c };
//# sourceMappingURL=copilot-CdP6Akkb.js.map
