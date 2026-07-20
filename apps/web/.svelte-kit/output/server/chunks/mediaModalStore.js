import { Bt as writable } from "./ui-libs.js";
import "./index-server.js";
//#region src/lib/stores/mediaModalStore.ts
var { subscribe, update, set } = writable({
	isOpen: false,
	media: null
});
//#endregion
export {};
