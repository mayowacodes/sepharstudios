import { w as writable } from './index.js-DwRgOKlO.js';

//#region src/lib/stores/copilot.ts
/** Set this from any content page. Null = general mode (no specific content). */
var copilotContext = writable(null);
/** Control the open/closed state globally — so other elements can open the chat */
var copilotOpen = writable(false);

export { copilotContext as a, copilotOpen as c };
//# sourceMappingURL=copilot-D91nQZmB.js.map
