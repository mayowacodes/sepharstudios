import { It as writable } from "./ui-libs.js";
import "./index-server.js";
//#region src/lib/stores/copilot.ts
/** Set this from any content page. Null = general mode (no specific content). */
var copilotContext = writable(null);
/** Control the open/closed state globally — so other elements can open the chat */
var copilotOpen = writable(false);
//#endregion
export { copilotOpen as n, copilotContext as t };
