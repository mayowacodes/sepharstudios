/** @import { StandardSchemaV1 } from '@standard-schema/spec' */

class HttpError {
	/**
	 * @param {number} status
	 * @param {{message: string} extends App.Error ? (App.Error | string | undefined) : App.Error} body
	 */
	constructor(status, body) {
		this.status = status;
		if (typeof body === 'string') {
			this.body = { message: body };
		} else if (body) {
			this.body = body;
		} else {
			this.body = { message: `Error: ${status}` };
		}
	}

	toString() {
		return JSON.stringify(this.body);
	}
}

class Redirect {
	/**
	 * @param {300 | 301 | 302 | 303 | 304 | 305 | 306 | 307 | 308} status
	 * @param {string} location
	 */
	constructor(status, location) {
		try {
			new Headers({ location });
		} catch {
			throw new Error(
				`Invalid redirect location ${JSON.stringify(location)}: ` +
					'this string contains characters that cannot be used in HTTP headers'
			);
		}

		this.status = status;
		this.location = location;
	}
}

/**
 * An error that was thrown from within the SvelteKit runtime that is not fatal and doesn't result in a 500, such as a 404.
 * `SvelteKitError` goes through `handleError`.
 * @extends Error
 */
class SvelteKitError extends Error {
	/**
	 * @param {number} status
	 * @param {string} text
	 * @param {string} message
	 */
	constructor(status, text, message) {
		super(message);
		this.status = status;
		this.text = text;
	}
}

/**
 * @template [T=undefined]
 */
class ActionFailure {
	/**
	 * @param {number} status
	 * @param {T} data
	 */
	constructor(status, data) {
		this.status = status;
		this.data = data;
	}
}

const text_encoder$2 = new TextEncoder();

//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	__defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};

function r(e){var t,f,n="";if("string"==typeof e||"number"==typeof e)n+=e;else if("object"==typeof e)if(Array.isArray(e)){var o=e.length;for(t=0;t<o;t++)e[t]&&(f=r(e[t]))&&(n&&(n+=" "),n+=f);}else for(f in e)e[f]&&(n&&(n+=" "),n+=f);return n}function clsx(){for(var e,t,f=0,n="",o=arguments.length;f<o;f++)(e=arguments[f])&&(t=r(e))&&(n&&(n+=" "),n+=t);return n}

//#region ../../node_modules/.bun/devalue@5.8.1/node_modules/devalue/src/constants.js
var MAX_ARRAY_LEN = 2 ** 32 - 1;
var MAX_ARRAY_INDEX = MAX_ARRAY_LEN - 1;
//#endregion
//#region ../../node_modules/.bun/devalue@5.8.1/node_modules/devalue/src/utils.js
/** @type {Record<string, string>} */
var escaped = {
	"<": "\\u003C",
	"\\": "\\\\",
	"\b": "\\b",
	"\f": "\\f",
	"\n": "\\n",
	"\r": "\\r",
	"	": "\\t",
	"\u2028": "\\u2028",
	"\u2029": "\\u2029"
};
var DevalueError = class extends Error {
	/**
	* @param {string} message
	* @param {string[]} keys
	* @param {any} [value] - The value that failed to be serialized
	* @param {any} [root] - The root value being serialized
	*/
	constructor(message, keys, value, root) {
		super(message);
		this.name = "DevalueError";
		this.path = keys.join("");
		this.value = value;
		this.root = root;
	}
};
/** @param {any} thing */
function is_primitive(thing) {
	return thing === null || typeof thing !== "object" && typeof thing !== "function";
}
var object_proto_names = /* @__PURE__ */ Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
/** @param {any} thing */
function is_plain_object(thing) {
	const proto = Object.getPrototypeOf(thing);
	return proto === Object.prototype || proto === null || Object.getPrototypeOf(proto) === null || Object.getOwnPropertyNames(proto).sort().join("\0") === object_proto_names;
}
/** @param {any} thing */
function get_type(thing) {
	return Object.prototype.toString.call(thing).slice(8, -1);
}
/** @param {string} char */
function get_escaped_char(char) {
	switch (char) {
		case "\"": return "\\\"";
		case "<": return "\\u003C";
		case "\\": return "\\\\";
		case "\n": return "\\n";
		case "\r": return "\\r";
		case "	": return "\\t";
		case "\b": return "\\b";
		case "\f": return "\\f";
		case "\u2028": return "\\u2028";
		case "\u2029": return "\\u2029";
		default: return char < " " ? `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}` : "";
	}
}
/** @param {string} str */
function stringify_string(str) {
	let result = "";
	let last_pos = 0;
	const len = str.length;
	for (let i = 0; i < len; i += 1) {
		const char = str[i];
		const replacement = get_escaped_char(char);
		if (replacement) {
			result += str.slice(last_pos, i) + replacement;
			last_pos = i + 1;
		}
	}
	return `"${last_pos === 0 ? str : result + str.slice(last_pos)}"`;
}
/** @param {Record<string | symbol, any>} object */
function enumerable_symbols(object) {
	return Object.getOwnPropertySymbols(object).filter((symbol) => Object.getOwnPropertyDescriptor(object, symbol).enumerable);
}
var is_identifier = /^[a-zA-Z_$][a-zA-Z_$0-9]*$/;
/** @param {string} key */
function stringify_key(key) {
	return is_identifier.test(key) ? "." + key : "[" + JSON.stringify(key) + "]";
}
/** @param {number} n */
function is_valid_array_index(n) {
	if (!Number.isInteger(n)) return false;
	if (n < 0) return false;
	if (n > MAX_ARRAY_INDEX) return false;
	return true;
}
/** @param {number} n */
function is_valid_array_len(n) {
	if (!Number.isInteger(n)) return false;
	if (n < 0) return false;
	if (n > MAX_ARRAY_LEN) return false;
	return true;
}
/** @param {string} s */
function is_valid_array_index_string(s) {
	if (s.length === 0) return false;
	if (s.length > 1 && s.charCodeAt(0) === 48) return false;
	for (let i = 0; i < s.length; i++) {
		const c = s.charCodeAt(i);
		if (c < 48 || c > 57) return false;
	}
	return is_valid_array_index(+s);
}
/**
* Finds the populated indices of an array.
* @param {unknown[]} array
*/
function valid_array_indices(array) {
	const keys = Object.keys(array);
	for (var i = keys.length - 1; i >= 0; i--) if (is_valid_array_index_string(keys[i])) break;
	keys.length = i + 1;
	return keys;
}
//#endregion
//#region ../../node_modules/.bun/devalue@5.8.1/node_modules/devalue/src/uneval.js
var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$";
var unsafe_chars = /[<\b\f\n\r\t\0\u2028\u2029]/g;
var reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
/**
* Turn a value into the JavaScript that creates an equivalent value
* @param {any} value
* @param {(value: any, uneval: (value: any) => string) => string | void} [replacer]
*/
function uneval(value, replacer) {
	const counts = /* @__PURE__ */ new Map();
	/** @type {string[]} */
	const keys = [];
	const custom = /* @__PURE__ */ new Map();
	/** @param {any} thing */
	function walk(thing) {
		if (!is_primitive(thing)) {
			if (counts.has(thing)) {
				counts.set(thing, counts.get(thing) + 1);
				return;
			}
			counts.set(thing, 1);
			if (replacer) {
				const str = replacer(thing, (value) => uneval(value, replacer));
				if (typeof str === "string") {
					custom.set(thing, str);
					return;
				}
			}
			if (typeof thing === "function") throw new DevalueError(`Cannot stringify a function`, keys, thing, value);
			switch (get_type(thing)) {
				case "Number":
				case "BigInt":
				case "String":
				case "Boolean":
				case "Date":
				case "RegExp":
				case "URL":
				case "URLSearchParams": return;
				case "Array":
					/** @type {any[]} */ thing.forEach((value, i) => {
						keys.push(`[${i}]`);
						walk(value);
						keys.pop();
					});
					break;
				case "Set":
					Array.from(thing).forEach(walk);
					break;
				case "Map":
					for (const [key, value] of thing) {
						keys.push(`.get(${is_primitive(key) ? stringify_primitive$1(key) : "..."})`);
						walk(value);
						keys.pop();
					}
					break;
				case "Int8Array":
				case "Uint8Array":
				case "Uint8ClampedArray":
				case "Int16Array":
				case "Uint16Array":
				case "Float16Array":
				case "Int32Array":
				case "Uint32Array":
				case "Float32Array":
				case "Float64Array":
				case "BigInt64Array":
				case "BigUint64Array":
				case "DataView":
					walk(thing.buffer);
					return;
				case "ArrayBuffer": return;
				case "Temporal.Duration":
				case "Temporal.Instant":
				case "Temporal.PlainDate":
				case "Temporal.PlainTime":
				case "Temporal.PlainDateTime":
				case "Temporal.PlainMonthDay":
				case "Temporal.PlainYearMonth":
				case "Temporal.ZonedDateTime": return;
				default:
					if (!is_plain_object(thing)) throw new DevalueError(`Cannot stringify arbitrary non-POJOs`, keys, thing, value);
					if (enumerable_symbols(thing).length > 0) throw new DevalueError(`Cannot stringify POJOs with symbolic keys`, keys, thing, value);
					for (const key of Object.keys(thing)) {
						if (key === "__proto__") throw new DevalueError(`Cannot stringify objects with __proto__ keys`, keys, thing, value);
						keys.push(stringify_key(key));
						walk(thing[key]);
						keys.pop();
					}
			}
		} else if (typeof thing === "symbol") throw new DevalueError(`Cannot stringify a Symbol primitive`, keys, thing, value);
	}
	walk(value);
	const names = /* @__PURE__ */ new Map();
	Array.from(counts).filter((entry) => entry[1] > 1).sort((a, b) => b[1] - a[1]).forEach((entry, i) => {
		names.set(entry[0], get_name(i));
	});
	/**
	* @param {any} thing
	* @returns {string}
	*/
	function stringify(thing) {
		if (names.has(thing)) return names.get(thing);
		if (is_primitive(thing)) return stringify_primitive$1(thing);
		if (custom.has(thing)) return custom.get(thing);
		const type = get_type(thing);
		switch (type) {
			case "Number":
			case "String":
			case "Boolean":
			case "BigInt": return `Object(${stringify(thing.valueOf())})`;
			case "RegExp":
				const { source, flags } = thing;
				return flags ? `new RegExp(${stringify_string(source)},"${flags}")` : `new RegExp(${stringify_string(source)})`;
			case "Date": return `new Date(${thing.getTime()})`;
			case "URL": return `new URL(${stringify_string(thing.toString())})`;
			case "URLSearchParams": return `new URLSearchParams(${stringify_string(thing.toString())})`;
			case "Array": {
				let has_holes = false;
				let result = "[";
				for (let i = 0; i < thing.length; i += 1) {
					if (i > 0) result += ",";
					if (Object.hasOwn(thing, i)) result += stringify(thing[i]);
					else if (!has_holes) {
						const populated_keys = valid_array_indices(thing);
						const population = populated_keys.length;
						const d = String(thing.length).length;
						if (thing.length + 2 > 25 + d + population * (d + 2)) {
							const entries = populated_keys.map((k) => `${k}:${stringify(thing[k])}`).join(",");
							return `Object.assign(Array(${thing.length}),{${entries}})`;
						}
						has_holes = true;
						i -= 1;
					}
				}
				const tail = thing.length === 0 || thing.length - 1 in thing ? "" : ",";
				return result + tail + "]";
			}
			case "Set":
			case "Map": return `new ${type}([${Array.from(thing).map(stringify).join(",")}])`;
			case "Int8Array":
			case "Uint8Array":
			case "Uint8ClampedArray":
			case "Int16Array":
			case "Uint16Array":
			case "Float16Array":
			case "Int32Array":
			case "Uint32Array":
			case "Float32Array":
			case "Float64Array":
			case "BigInt64Array":
			case "BigUint64Array": {
				let str = `new ${type}`;
				if (!names.has(thing.buffer)) {
					const array = new thing.constructor(thing.buffer);
					str += `([${array}])`;
				} else str += `(${stringify(thing.buffer)})`;
				if (thing.byteLength !== thing.buffer.byteLength) {
					const start = thing.byteOffset / thing.BYTES_PER_ELEMENT;
					const end = start + thing.length;
					str += `.subarray(${start},${end})`;
				}
				return str;
			}
			case "DataView": {
				let str = `new DataView`;
				if (!names.has(thing.buffer)) str += `(new Uint8Array([${new Uint8Array(thing.buffer)}]).buffer`;
				else str += `(${stringify(thing.buffer)}`;
				if (thing.byteLength !== thing.buffer.byteLength) str += `,${thing.startOffset},${thing.byteLength}`;
				return str + ")";
			}
			case "ArrayBuffer": return `new Uint8Array([${new Uint8Array(thing).toString()}]).buffer`;
			case "Temporal.Duration":
			case "Temporal.Instant":
			case "Temporal.PlainDate":
			case "Temporal.PlainTime":
			case "Temporal.PlainDateTime":
			case "Temporal.PlainMonthDay":
			case "Temporal.PlainYearMonth":
			case "Temporal.ZonedDateTime": return `${type}.from(${stringify_string(thing.toString())})`;
			default:
				const keys = Object.keys(thing);
				const obj = keys.map((key) => `${safe_key(key)}:${stringify(thing[key])}`).join(",");
				if (Object.getPrototypeOf(thing) === null) return keys.length > 0 ? `{${obj},__proto__:null}` : `{__proto__:null}`;
				return `{${obj}}`;
		}
	}
	const str = stringify(value);
	if (names.size) {
		/** @type {string[]} */
		const params = [];
		/** @type {string[]} */
		const statements = [];
		/** @type {string[]} */
		const values = [];
		names.forEach((name, thing) => {
			params.push(name);
			if (custom.has(thing)) {
				values.push(custom.get(thing));
				return;
			}
			if (is_primitive(thing)) {
				values.push(stringify_primitive$1(thing));
				return;
			}
			const type = get_type(thing);
			switch (type) {
				case "Number":
				case "String":
				case "Boolean":
				case "BigInt":
					values.push(`Object(${stringify(thing.valueOf())})`);
					break;
				case "RegExp":
					const { source, flags } = thing;
					const regexp = flags ? `new RegExp(${stringify_string(source)},"${flags}")` : `new RegExp(${stringify_string(source)})`;
					values.push(regexp);
					break;
				case "Date":
					values.push(`new Date(${thing.getTime()})`);
					break;
				case "URL":
					values.push(`new URL(${stringify_string(thing.toString())})`);
					break;
				case "URLSearchParams":
					values.push(`new URLSearchParams(${stringify_string(thing.toString())})`);
					break;
				case "Array":
					values.push(`Array(${thing.length})`);
					/** @type {any[]} */ thing.forEach((v, i) => {
						statements.push(`${name}[${i}]=${stringify(v)}`);
					});
					break;
				case "Set":
					values.push(`new Set`);
					statements.push(`${name}.${Array.from(thing).map((v) => `add(${stringify(v)})`).join(".")}`);
					break;
				case "Map":
					values.push(`new Map`);
					statements.push(`${name}.${Array.from(thing).map(([k, v]) => `set(${stringify(k)}, ${stringify(v)})`).join(".")}`);
					break;
				case "Int8Array":
				case "Uint8Array":
				case "Uint8ClampedArray":
				case "Int16Array":
				case "Uint16Array":
				case "Float16Array":
				case "Int32Array":
				case "Uint32Array":
				case "Float32Array":
				case "Float64Array":
				case "BigInt64Array":
				case "BigUint64Array": {
					let str = `new ${type}`;
					if (!names.has(thing.buffer)) {
						const array = new thing.constructor(thing.buffer);
						str += `([${array}])`;
					} else str += `(${stringify(thing.buffer)})`;
					if (thing.byteLength !== thing.buffer.byteLength) {
						const start = thing.byteOffset / thing.BYTES_PER_ELEMENT;
						const end = start + thing.length;
						str += `.subarray(${start},${end})`;
					}
					values.push(`{}`);
					statements.push(`${name}=${str}`);
					break;
				}
				case "DataView": {
					let str = `new DataView`;
					if (!names.has(thing.buffer)) str += `(new Uint8Array([${new Uint8Array(thing.buffer)}]).buffer`;
					else str += `(${stringify(thing.buffer)}`;
					if (thing.byteLength !== thing.buffer.byteLength) str += `,${thing.byteOffset},${thing.byteLength}`;
					str += ")";
					values.push(`{}`);
					statements.push(`${name}=${str}`);
					break;
				}
				case "ArrayBuffer":
					values.push(`new Uint8Array([${new Uint8Array(thing)}]).buffer`);
					break;
				default:
					values.push(Object.getPrototypeOf(thing) === null ? "Object.create(null)" : "{}");
					Object.keys(thing).forEach((key) => {
						statements.push(`${name}${safe_prop(key)}=${stringify(thing[key])}`);
					});
			}
		});
		statements.push(`return ${str}`);
		return `(function(${params.join(",")}){${statements.join(";")}}(${values.join(",")}))`;
	} else return str;
}
/** @param {number} num */
function get_name(num) {
	let name = "";
	do {
		name = chars[num % 54] + name;
		num = ~~(num / 54) - 1;
	} while (num >= 0);
	return reserved.test(name) ? `${name}0` : name;
}
/** @param {string} c */
function escape_unsafe_char(c) {
	return escaped[c] || c;
}
/** @param {string} str */
function escape_unsafe_chars(str) {
	return str.replace(unsafe_chars, escape_unsafe_char);
}
/** @param {string} key */
function safe_key(key) {
	return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? key : escape_unsafe_chars(JSON.stringify(key));
}
/** @param {string} key */
function safe_prop(key) {
	return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? `.${key}` : `[${escape_unsafe_chars(JSON.stringify(key))}]`;
}
/** @param {any} thing */
function stringify_primitive$1(thing) {
	const type = typeof thing;
	if (type === "string") return stringify_string(thing);
	if (thing === void 0) return "void 0";
	if (thing === 0 && 1 / thing < 0) return "-0";
	const str = String(thing);
	if (type === "number") return str.replace(/^(-)?0\./, "$1.");
	if (type === "bigint") return thing + "n";
	return str;
}
//#endregion
//#region ../../node_modules/.bun/svelte@5.56.5/node_modules/svelte/src/internal/shared/utils.js
var is_array = Array.isArray;
var index_of = Array.prototype.indexOf;
var includes = Array.prototype.includes;
var array_from = Array.from;
var define_property = Object.defineProperty;
var get_descriptor = Object.getOwnPropertyDescriptor;
var object_prototype = Object.prototype;
var array_prototype = Array.prototype;
var get_prototype_of = Object.getPrototypeOf;
var is_extensible = Object.isExtensible;
var has_own_property = Object.prototype.hasOwnProperty;
var noop$1 = () => {};
/** @param {Function} fn */
function run$1(fn) {
	return fn();
}
/** @param {Array<() => void>} arr */
function run_all(arr) {
	for (var i = 0; i < arr.length; i++) arr[i]();
}
/**
* TODO replace with Promise.withResolvers once supported widely enough
* @template [T=void]
*/
function deferred() {
	/** @type {(value: T) => void} */
	var resolve;
	/** @type {(reason: any) => void} */
	var reject;
	return {
		promise: new Promise((res, rej) => {
			resolve = res;
			reject = rej;
		}),
		resolve,
		reject
	};
}
//#endregion
//#region ../../node_modules/.bun/svelte@5.56.5/node_modules/svelte/src/internal/client/reactivity/equality.js
/** @import { Equals } from '#client' */
/** @type {Equals} */
function equals(value) {
	return value === this.v;
}
/**
* @param {unknown} a
* @param {unknown} b
* @returns {boolean}
*/
function safe_not_equal(a, b) {
	return a != a ? b == b : a !== b || a !== null && typeof a === "object" || typeof a === "function";
}
/** @type {Equals} */
function safe_equals(value) {
	return !safe_not_equal(value, this.v);
}
var CLEAN = 1024;
var DIRTY = 2048;
var MAYBE_DIRTY = 4096;
var INERT = 8192;
var DESTROYED = 16384;
/** Set once a reaction has run for the first time */
var REACTION_RAN = 32768;
/** Effect is in the process of getting destroyed. Can be observed in child teardown functions */
var DESTROYING = 1 << 25;
/**
* 'Transparent' effects do not create a transition boundary.
* This is on a block effect 99% of the time but may also be on a branch effect if its parent block effect was pruned
*/
var EFFECT_TRANSPARENT = 65536;
var EFFECT_PRESERVED = 1 << 19;
var USER_EFFECT = 1 << 20;
/**
* Tells that we marked this derived and its reactions as visited during the "mark as (maybe) dirty"-phase.
* Will be lifted during execution of the derived and during checking its dirty state (both are necessary
* because a derived might be checked but not executed). This is a pure performance optimization flag and
* should not be used for any other purpose!
*/
var WAS_MARKED = 65536;
var REACTION_IS_UPDATING = 1 << 21;
var ERROR_VALUE = 1 << 23;
var STATE_SYMBOL = Symbol("$state");
var LEGACY_PROPS = Symbol("legacy props");
var ATTRIBUTES_CACHE = Symbol("attributes");
var CLASS_CACHE = Symbol("class");
var STYLE_CACHE = Symbol("style");
var TEXT_CACHE = Symbol("text");
/** allow users to ignore aborted signal errors if `reason.name === 'StaleReactionError` */
var STALE_REACTION = new class StaleReactionError extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}();
//#endregion
//#region ../../node_modules/.bun/svelte@5.56.5/node_modules/svelte/src/internal/shared/errors.js
/**
* Cannot use `%name%(...)` unless the `experimental.async` compiler option is `true`
* @param {string} name
* @returns {never}
*/
function experimental_async_required(name) {
	throw new Error(`https://svelte.dev/e/experimental_async_required`);
}
/**
* `%name%(...)` can only be used during component initialisation
* @param {string} name
* @returns {never}
*/
function lifecycle_outside_component(name) {
	throw new Error(`https://svelte.dev/e/lifecycle_outside_component`);
}
/**
* Context was not set in a parent component
* @returns {never}
*/
function missing_context() {
	throw new Error(`https://svelte.dev/e/missing_context`);
}
/**
* Maximum update depth exceeded. This typically indicates that an effect reads and writes the same piece of state
* @returns {never}
*/
function effect_update_depth_exceeded() {
	throw new Error(`https://svelte.dev/e/effect_update_depth_exceeded`);
}
/**
* Failed to hydrate the application
* @returns {never}
*/
function hydration_failed() {
	throw new Error(`https://svelte.dev/e/hydration_failed`);
}
/**
* Property descriptors defined on `$state` objects must contain `value` and always be `enumerable`, `configurable` and `writable`.
* @returns {never}
*/
function state_descriptors_fixed() {
	throw new Error(`https://svelte.dev/e/state_descriptors_fixed`);
}
/**
* Cannot set prototype of `$state` object
* @returns {never}
*/
function state_prototype_fixed() {
	throw new Error(`https://svelte.dev/e/state_prototype_fixed`);
}
/**
* Updating state inside `$derived(...)`, `$inspect(...)` or a template expression is forbidden. If the value should not be reactive, declare it without `$state`
* @returns {never}
*/
function state_unsafe_mutation() {
	throw new Error(`https://svelte.dev/e/state_unsafe_mutation`);
}
/**
* A `<svelte:boundary>` `reset` function cannot be called while an error is still being handled
* @returns {never}
*/
function svelte_boundary_reset_onerror() {
	throw new Error(`https://svelte.dev/e/svelte_boundary_reset_onerror`);
}
//#endregion
//#region ../../node_modules/.bun/svelte@5.56.5/node_modules/svelte/src/constants.js
var HYDRATION_ERROR = {};
var UNINITIALIZED = Symbol("uninitialized");
var ATTACHMENT_KEY = "@attach";
/**
* Reading a derived belonging to a now-destroyed effect may result in stale values
*/
function derived_inert() {
	console.warn(`https://svelte.dev/e/derived_inert`);
}
/**
* Hydration failed because the initial UI does not match what was rendered on the server. The error occurred near %location%
* @param {string | undefined | null} [location]
*/
function hydration_mismatch(location) {
	console.warn(`https://svelte.dev/e/hydration_mismatch`);
}
/**
* A `<svelte:boundary>` `reset` function only resets the boundary the first time it is called
*/
function svelte_boundary_reset_noop() {
	console.warn(`https://svelte.dev/e/svelte_boundary_reset_noop`);
}
//#endregion
//#region ../../node_modules/.bun/svelte@5.56.5/node_modules/svelte/src/internal/client/dom/hydration.js
/** @import { TemplateNode } from '#client' */
/**
* Use this variable to guard everything related to hydration code so it can be treeshaken out
* if the user doesn't use the `hydrate` method and these code paths are therefore not needed.
*/
var hydrating = false;
/** @param {boolean} value */
function set_hydrating(value) {
	hydrating = value;
}
/**
* The node that is currently being hydrated. This starts out as the first node inside the opening
* <!--[--> comment, and updates each time a component calls `$.child(...)` or `$.sibling(...)`.
* When entering a block (e.g. `{#if ...}`), `hydrate_node` is the block opening comment; by the
* time we leave the block it is the closing comment, which serves as the block's anchor.
* @type {TemplateNode}
*/
var hydrate_node;
/** @param {TemplateNode | null} node */
function set_hydrate_node(node) {
	if (node === null) {
		hydration_mismatch();
		throw HYDRATION_ERROR;
	}
	return hydrate_node = node;
}
function hydrate_next() {
	return set_hydrate_node(/* @__PURE__ */ get_next_sibling(hydrate_node));
}
function next$1(count = 1) {
	if (hydrating) {
		var i = count;
		var node = hydrate_node;
		while (i--) node = /* @__PURE__ */ get_next_sibling(node);
		hydrate_node = node;
	}
}
/**
* Skips or removes (depending on {@link remove}) all nodes starting at `hydrate_node` up until the next hydration end comment
* @param {boolean} remove
*/
function skip_nodes(remove = true) {
	var depth = 0;
	var node = hydrate_node;
	while (true) {
		if (node.nodeType === 8) {
			var data = node.data;
			if (data === "]") {
				if (depth === 0) return node;
				depth -= 1;
			} else if (data === "[" || data === "[!" || data[0] === "[" && !isNaN(Number(data.slice(1)))) depth += 1;
		}
		var next = /* @__PURE__ */ get_next_sibling(node);
		if (remove) node.remove();
		node = next;
	}
}
//#endregion
//#region ../../node_modules/.bun/svelte@5.56.5/node_modules/svelte/src/internal/shared/clone.js
/** @import { Snapshot } from './types' */
/**
* In dev, we keep track of which properties could not be cloned. In prod
* we don't bother, but we keep a dummy array around so that the
* signature stays the same
* @type {string[]}
*/
var empty = [];
/**
* @template T
* @param {T} value
* @param {boolean} [skip_warning]
* @param {boolean} [no_tojson]
* @returns {Snapshot<T>}
*/
function snapshot(value, skip_warning = false, no_tojson = false) {
	return clone(value, /* @__PURE__ */ new Map(), "", empty, null, no_tojson);
}
/**
* @template T
* @param {T} value
* @param {Map<T, Snapshot<T>>} cloned
* @param {string} path
* @param {string[]} paths
* @param {null | T} [original] The original value, if `value` was produced from a `toJSON` call
* @param {boolean} [no_tojson]
* @returns {Snapshot<T>}
*/
function clone(value, cloned, path, paths, original = null, no_tojson = false) {
	if (typeof value === "object" && value !== null) {
		var unwrapped = cloned.get(value);
		if (unwrapped !== void 0) return unwrapped;
		if (value instanceof Map) return new Map(value);
		if (value instanceof Set) return new Set(value);
		if (is_array(value)) {
			var copy = Array(value.length);
			cloned.set(value, copy);
			if (original !== null) cloned.set(original, copy);
			for (var i = 0; i < value.length; i += 1) {
				var element = value[i];
				if (i in value) copy[i] = clone(element, cloned, path, paths, null, no_tojson);
			}
			return copy;
		}
		if (get_prototype_of(value) === object_prototype) {
			/** @type {Snapshot<any>} */
			copy = {};
			cloned.set(value, copy);
			if (original !== null) cloned.set(original, copy);
			for (var key of Object.keys(value)) copy[key] = clone(value[key], cloned, path, paths, null, no_tojson);
			return copy;
		}
		if (value instanceof Date) return structuredClone(value);
		if (typeof value.toJSON === "function" && !no_tojson) return clone(
			/** @type {T & { toJSON(): any } } */
			value.toJSON(),
			cloned,
			path,
			paths,
			value
		);
	}
	if (value instanceof EventTarget) return value;
	try {
		return structuredClone(value);
	} catch (e) {
		return value;
	}
}
//#endregion
//#region ../../node_modules/.bun/svelte@5.56.5/node_modules/svelte/src/internal/client/context.js
/** @import { ComponentContext, DevStackEntry, Effect } from '#client' */
/** @type {ComponentContext | null} */
var component_context = null;
/** @param {ComponentContext | null} context */
function set_component_context(context) {
	component_context = context;
}
/**
* @param {Record<string, unknown>} props
* @param {any} runes
* @param {Function} [fn]
* @returns {void}
*/
function push$1(props, runes = false, fn) {
	component_context = {
		p: component_context,
		i: false,
		c: null,
		e: null,
		s: props,
		x: null,
		r: active_effect,
		l: null
	};
}
/**
* @template {Record<string, any>} T
* @param {T} [component]
* @returns {T}
*/
function pop$1(component) {
	var context = component_context;
	var effects = context.e;
	if (effects !== null) {
		context.e = null;
		for (var fn of effects) create_user_effect(fn);
	}
	context.i = true;
	component_context = context.p;
	return {};
}
/** @returns {boolean} */
function is_runes() {
	return true;
}
//#endregion
//#region ../../node_modules/.bun/svelte@5.56.5/node_modules/svelte/src/internal/client/dom/task.js
/** @type {Array<() => void>} */
var micro_tasks = [];
function run_micro_tasks() {
	var tasks = micro_tasks;
	micro_tasks = [];
	run_all(tasks);
}
/**
* @param {() => void} fn
*/
function queue_micro_task(fn) {
	if (micro_tasks.length === 0 && !is_flushing_sync) {
		var tasks = micro_tasks;
		queueMicrotask(() => {
			if (tasks === micro_tasks) run_micro_tasks();
		});
	}
	micro_tasks.push(fn);
}
/**
* Synchronously run any queued tasks.
*/
function flush_tasks() {
	while (micro_tasks.length > 0) run_micro_tasks();
}
/**
* @param {unknown} error
*/
function handle_error(error) {
	var effect = active_effect;
	if (effect === null) {
		/** @type {Derived} */ active_reaction.f |= ERROR_VALUE;
		return error;
	}
	if ((effect.f & 32768) === 0 && (effect.f & 4) === 0) throw error;
	invoke_error_boundary(error, effect);
}
/**
* @param {unknown} error
* @param {Effect | null} effect
*/
function invoke_error_boundary(error, effect) {
	if (effect !== null && (effect.f & 16384) !== 0) return;
	while (effect !== null) {
		if ((effect.f & 128) !== 0) {
			if ((effect.f & 32768) === 0) throw error;
			try {
				/** @type {Boundary} */ effect.b.error(error);
				return;
			} catch (e) {
				error = e;
			}
		}
		effect = effect.parent;
	}
	throw error;
}
//#endregion
//#region ../../node_modules/.bun/svelte@5.56.5/node_modules/svelte/src/internal/client/reactivity/status.js
/** @import { Derived, Signal } from '#client' */
var STATUS_MASK = -7169;
/**
* @param {Signal} signal
* @param {number} status
*/
function set_signal_status(signal, status) {
	signal.f = signal.f & STATUS_MASK | status;
}
/**
* Set a derived's status to CLEAN or MAYBE_DIRTY based on its connection state.
* @param {Derived} derived
*/
function update_derived_status(derived) {
	if ((derived.f & 512) !== 0 || derived.deps === null) set_signal_status(derived, CLEAN);
	else set_signal_status(derived, MAYBE_DIRTY);
}
//#endregion
//#region ../../node_modules/.bun/svelte@5.56.5/node_modules/svelte/src/internal/client/reactivity/utils.js
/** @import { Derived, Effect, Value } from '#client' */
/**
* @param {Value[] | null} deps
*/
function clear_marked(deps) {
	if (deps === null) return;
	for (const dep of deps) {
		if ((dep.f & 2) === 0 || (dep.f & 65536) === 0) continue;
		dep.f ^= WAS_MARKED;
		clear_marked(
			/** @type {Derived} */
			dep.deps
		);
	}
}
/**
* @param {Effect} effect
* @param {Set<Effect>} dirty_effects
* @param {Set<Effect>} maybe_dirty_effects
*/
function defer_effect(effect, dirty_effects, maybe_dirty_effects) {
	if ((effect.f & 2048) !== 0) dirty_effects.add(effect);
	else if ((effect.f & 4096) !== 0) maybe_dirty_effects.add(effect);
	clear_marked(effect.deps);
	set_signal_status(effect, CLEAN);
}
//#endregion
//#region ../../node_modules/.bun/svelte@5.56.5/node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
/**
* @template T
* @param {() => T} fn
*/
function without_reactive_context(fn) {
	var previous_reaction = active_reaction;
	var previous_effect = active_effect;
	set_active_reaction(null);
	set_active_effect(null);
	try {
		return fn();
	} finally {
		set_active_reaction(previous_reaction);
		set_active_effect(previous_effect);
	}
}
//#endregion
//#region ../../node_modules/.bun/svelte@5.56.5/node_modules/svelte/src/reactivity/create-subscriber.js
/**
* Returns a `subscribe` function that integrates external event-based systems with Svelte's reactivity.
* It's particularly useful for integrating with web APIs like `MediaQuery`, `IntersectionObserver`, or `WebSocket`.
*
* If `subscribe` is called inside an effect (including indirectly, for example inside a getter),
* the `start` callback will be called with an `update` function. Whenever `update` is called, the effect re-runs.
*
* If `start` returns a cleanup function, it will be called when the effect is destroyed.
*
* If `subscribe` is called in multiple effects, `start` will only be called once as long as the effects
* are active, and the returned teardown function will only be called when all effects are destroyed.
*
* It's best understood with an example. Here's an implementation of [`MediaQuery`](https://svelte.dev/docs/svelte/svelte-reactivity#MediaQuery):
*
* ```js
* import { createSubscriber } from 'svelte/reactivity';
* import { on } from 'svelte/events';
*
* export class MediaQuery {
* 	#query;
* 	#subscribe;
*
* 	constructor(query) {
* 		this.#query = window.matchMedia(`(${query})`);
*
* 		this.#subscribe = createSubscriber((update) => {
* 			// when the `change` event occurs, re-run any effects that read `this.current`
* 			const off = on(this.#query, 'change', update);
*
* 			// stop listening when all the effects are destroyed
* 			return () => off();
* 		});
* 	}
*
* 	get current() {
* 		// This makes the getter reactive, if read in an effect
* 		this.#subscribe();
*
* 		// Return the current state of the query, whether or not we're in an effect
* 		return this.#query.matches;
* 	}
* }
* ```
* @param {(update: () => void) => (() => void) | void} start
* @since 5.7.0
*/
function createSubscriber$1(start) {
	let subscribers = 0;
	let version = source(0);
	/** @type {(() => void) | void} */
	let stop;
	return () => {
		if (effect_tracking()) {
			get$3(version);
			render_effect(() => {
				if (subscribers === 0) stop = untrack(() => start(() => increment(version)));
				subscribers += 1;
				return () => {
					queue_micro_task(() => {
						subscribers -= 1;
						if (subscribers === 0) {
							stop?.();
							stop = void 0;
							increment(version);
						}
					});
				};
			});
		}
	};
}
//#endregion
//#region ../../node_modules/.bun/svelte@5.56.5/node_modules/svelte/src/internal/client/dom/blocks/boundary.js
/** @import { Effect, Source, TemplateNode, } from '#client' */
/**
* @typedef {{
* 	 onerror?: ((error: unknown, reset: () => void) => void) | null;
*   failed?: ((anchor: Node, error: () => unknown, reset: () => () => void) => void) | null;
*   pending?: ((anchor: Node) => void) | null;
* }} BoundaryProps
*/
var flags = EFFECT_TRANSPARENT | EFFECT_PRESERVED;
/**
* @param {TemplateNode} node
* @param {BoundaryProps} props
* @param {((anchor: Node) => void)} children
* @param {((error: unknown) => unknown) | undefined} [transform_error]
* @returns {void}
*/
function boundary(node, props, children, transform_error) {
	new Boundary(node, props, children, transform_error);
}
var Boundary = class {
	/** @type {Boundary | null} */
	parent;
	is_pending = false;
	/**
	* API-level transformError transform function. Transforms errors before they reach the `failed` snippet.
	* Inherited from parent boundary, or defaults to identity.
	* @type {(error: unknown) => unknown}
	*/
	transform_error;
	/** @type {TemplateNode} */
	#anchor;
	/** @type {TemplateNode | null} */
	#hydrate_open = hydrating ? hydrate_node : null;
	/** @type {BoundaryProps} */
	#props;
	/** @type {((anchor: Node) => void)} */
	#children;
	/** @type {Effect} */
	#effect;
	/** @type {Effect | null} */
	#main_effect = null;
	/** @type {Effect | null} */
	#pending_effect = null;
	/** @type {Effect | null} */
	#failed_effect = null;
	/** @type {DocumentFragment | null} */
	#offscreen_fragment = null;
	#local_pending_count = 0;
	#pending_count = 0;
	#pending_count_update_queued = false;
	/** @type {Set<Effect>} */
	#dirty_effects = /* @__PURE__ */ new Set();
	/** @type {Set<Effect>} */
	#maybe_dirty_effects = /* @__PURE__ */ new Set();
	/**
	* A source containing the number of pending async deriveds/expressions.
	* Only created if `$effect.pending()` is used inside the boundary,
	* otherwise updating the source results in needless `Batch.ensure()`
	* calls followed by no-op flushes
	* @type {Source<number> | null}
	*/
	#effect_pending = null;
	#effect_pending_subscriber = createSubscriber$1(() => {
		this.#effect_pending = source(this.#local_pending_count);
		return () => {
			this.#effect_pending = null;
		};
	});
	/**
	* @param {TemplateNode} node
	* @param {BoundaryProps} props
	* @param {((anchor: Node) => void)} children
	* @param {((error: unknown) => unknown) | undefined} [transform_error]
	*/
	constructor(node, props, children, transform_error) {
		this.#anchor = node;
		this.#props = props;
		this.#children = (anchor) => {
			var effect = active_effect;
			effect.b = this;
			effect.f |= 128;
			children(anchor);
		};
		this.parent = active_effect.b;
		this.transform_error = transform_error ?? this.parent?.transform_error ?? ((e) => e);
		this.#effect = block(() => {
			if (hydrating) {
				const comment = this.#hydrate_open;
				hydrate_next();
				const server_rendered_pending = comment.data === "[!";
				if (comment.data.startsWith("[?")) {
					const serialized_error = JSON.parse(comment.data.slice(2));
					this.#hydrate_failed_content(serialized_error);
				} else if (server_rendered_pending) this.#hydrate_pending_content();
				else this.#hydrate_resolved_content();
			} else this.#render();
		}, flags);
		if (hydrating) this.#anchor = hydrate_node;
	}
	#hydrate_resolved_content() {
		try {
			this.#main_effect = branch(() => this.#children(this.#anchor));
		} catch (error) {
			this.error(error);
		}
	}
	/**
	* @param {unknown} error The deserialized error from the server's hydration comment
	*/
	#hydrate_failed_content(error) {
		const failed = this.#props.failed;
		if (!failed) return;
		this.#failed_effect = branch(() => {
			failed(this.#anchor, () => error, () => () => {});
		});
	}
	#hydrate_pending_content() {
		const pending = this.#props.pending;
		if (!pending) return;
		this.is_pending = true;
		this.#pending_effect = branch(() => pending(this.#anchor));
		queue_micro_task(() => {
			var fragment = this.#offscreen_fragment = document.createDocumentFragment();
			var anchor = create_text();
			fragment.append(anchor);
			this.#main_effect = this.#run(() => {
				return branch(() => this.#children(anchor));
			});
			if (this.#pending_count === 0) {
				this.#anchor.before(fragment);
				this.#offscreen_fragment = null;
				pause_effect(this.#pending_effect, () => {
					this.#pending_effect = null;
				});
				this.#resolve(current_batch);
			}
		});
	}
	#render() {
		try {
			this.is_pending = this.has_pending_snippet();
			this.#pending_count = 0;
			this.#local_pending_count = 0;
			this.#main_effect = branch(() => {
				this.#children(this.#anchor);
			});
			if (this.#pending_count > 0) {
				var fragment = this.#offscreen_fragment = document.createDocumentFragment();
				move_effect(this.#main_effect, fragment);
				const pending = this.#props.pending;
				this.#pending_effect = branch(() => pending(this.#anchor));
			} else this.#resolve(current_batch);
		} catch (error) {
			this.error(error);
		}
	}
	/**
	* @param {Batch} batch
	*/
	#resolve(batch) {
		this.is_pending = false;
		batch.transfer_effects(this.#dirty_effects, this.#maybe_dirty_effects);
	}
	/**
	* Defer an effect inside a pending boundary until the boundary resolves
	* @param {Effect} effect
	*/
	defer_effect(effect) {
		defer_effect(effect, this.#dirty_effects, this.#maybe_dirty_effects);
	}
	/**
	* Returns `false` if the effect exists inside a boundary whose pending snippet is shown
	* @returns {boolean}
	*/
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#props.pending;
	}
	/**
	* @template T
	* @param {() => T} fn
	*/
	#run(fn) {
		var previous_effect = active_effect;
		var previous_reaction = active_reaction;
		var previous_ctx = component_context;
		set_active_effect(this.#effect);
		set_active_reaction(this.#effect);
		set_component_context(this.#effect.ctx);
		try {
			Batch.ensure();
			return fn();
		} catch (e) {
			handle_error(e);
			return null;
		} finally {
			set_active_effect(previous_effect);
			set_active_reaction(previous_reaction);
			set_component_context(previous_ctx);
		}
	}
	/**
	* Updates the pending count associated with the currently visible pending snippet,
	* if any, such that we can replace the snippet with content once work is done
	* @param {1 | -1} d
	* @param {Batch} batch
	*/
	#update_pending_count(d, batch) {
		if (!this.has_pending_snippet()) {
			if (this.parent) this.parent.#update_pending_count(d, batch);
			return;
		}
		this.#pending_count += d;
		if (this.#pending_count === 0) {
			this.#resolve(batch);
			if (this.#pending_effect) pause_effect(this.#pending_effect, () => {
				this.#pending_effect = null;
			});
			if (this.#offscreen_fragment) {
				this.#anchor.before(this.#offscreen_fragment);
				this.#offscreen_fragment = null;
			}
		}
	}
	/**
	* Update the source that powers `$effect.pending()` inside this boundary,
	* and controls when the current `pending` snippet (if any) is removed.
	* Do not call from inside the class
	* @param {1 | -1} d
	* @param {Batch} batch
	*/
	update_pending_count(d, batch) {
		this.#update_pending_count(d, batch);
		this.#local_pending_count += d;
		if (!this.#effect_pending || this.#pending_count_update_queued) return;
		this.#pending_count_update_queued = true;
		queue_micro_task(() => {
			this.#pending_count_update_queued = false;
			if (this.#effect_pending) internal_set(this.#effect_pending, this.#local_pending_count);
		});
	}
	get_effect_pending() {
		this.#effect_pending_subscriber();
		return get$3(this.#effect_pending);
	}
	/** @param {unknown} error */
	error(error) {
		if (!this.#props.onerror && !this.#props.failed) throw error;
		if (current_batch?.is_fork) {
			if (this.#main_effect) current_batch.skip_effect(this.#main_effect);
			if (this.#pending_effect) current_batch.skip_effect(this.#pending_effect);
			if (this.#failed_effect) current_batch.skip_effect(this.#failed_effect);
			current_batch.oncommit(() => {
				this.#handle_error(error);
			});
		} else this.#handle_error(error);
	}
	/**
	* @param {unknown} error
	*/
	#handle_error(error) {
		if (this.#main_effect) {
			destroy_effect(this.#main_effect);
			this.#main_effect = null;
		}
		if (this.#pending_effect) {
			destroy_effect(this.#pending_effect);
			this.#pending_effect = null;
		}
		if (this.#failed_effect) {
			destroy_effect(this.#failed_effect);
			this.#failed_effect = null;
		}
		if (hydrating) {
			set_hydrate_node(this.#hydrate_open);
			next$1();
			set_hydrate_node(skip_nodes());
		}
		var onerror = this.#props.onerror;
		let failed = this.#props.failed;
		var did_reset = false;
		var calling_on_error = false;
		const reset = () => {
			if (did_reset) {
				svelte_boundary_reset_noop();
				return;
			}
			did_reset = true;
			if (calling_on_error) svelte_boundary_reset_onerror();
			if (this.#failed_effect !== null) pause_effect(this.#failed_effect, () => {
				this.#failed_effect = null;
			});
			this.#run(() => {
				this.#render();
			});
		};
		/** @param {unknown} transformed_error */
		const handle_error_result = (transformed_error) => {
			try {
				calling_on_error = true;
				onerror?.(transformed_error, reset);
				calling_on_error = false;
			} catch (error) {
				invoke_error_boundary(error, this.#effect && this.#effect.parent);
			}
			if (failed) this.#failed_effect = this.#run(() => {
				try {
					return branch(() => {
						var effect = active_effect;
						effect.b = this;
						effect.f |= 128;
						failed(this.#anchor, () => transformed_error, () => reset);
					});
				} catch (error) {
					invoke_error_boundary(error, this.#effect.parent);
					return null;
				}
			});
		};
		queue_micro_task(() => {
			/** @type {unknown} */
			var result;
			try {
				result = this.transform_error(error);
			} catch (e) {
				invoke_error_boundary(e, this.#effect && this.#effect.parent);
				return;
			}
			if (result !== null && typeof result === "object" && typeof result.then === "function")
 /** @type {any} */ result.then(
				handle_error_result,
				/** @param {unknown} e */
				(e) => invoke_error_boundary(e, this.#effect && this.#effect.parent)
			);
			else handle_error_result(result);
		});
	}
};
var OBSOLETE = Symbol("obsolete");
/**
* @param {Derived} derived
* @returns {void}
*/
function destroy_derived_effects(derived) {
	var effects = derived.effects;
	if (effects !== null) {
		derived.effects = null;
		for (var i = 0; i < effects.length; i += 1) destroy_effect(effects[i]);
	}
}
/**
* @template T
* @param {Derived} derived
* @returns {T}
*/
function execute_derived(derived) {
	var value;
	var prev_active_effect = active_effect;
	var parent = derived.parent;
	if (!is_destroying_effect && parent !== null && derived.v !== UNINITIALIZED && (parent.f & 24576) !== 0) {
		derived_inert();
		return derived.v;
	}
	set_active_effect(parent);
	try {
		derived.f &= ~WAS_MARKED;
		destroy_derived_effects(derived);
		value = update_reaction(derived);
	} finally {
		set_active_effect(prev_active_effect);
	}
	return value;
}
/**
* @param {Derived} derived
* @returns {void}
*/
function update_derived(derived) {
	var value = execute_derived(derived);
	if (!derived.equals(value)) {
		derived.wv = increment_write_version();
		if (!current_batch?.is_fork || derived.deps === null) {
			if (current_batch !== null) {
				current_batch.capture(derived, value, true);
				previous_batch?.capture(derived, value, true);
			} else derived.v = value;
			if (derived.deps === null) {
				set_signal_status(derived, CLEAN);
				return;
			}
		}
	}
	if (is_destroying_effect) return;
	if (batch_values !== null) {
		if (effect_tracking() || current_batch?.is_fork) batch_values.set(derived, value);
	} else update_derived_status(derived);
}
/**
* @param {Derived} derived
*/
function freeze_derived_effects(derived) {
	if (derived.effects === null) return;
	for (const e of derived.effects) if (e.teardown || e.ac) {
		e.teardown?.();
		if (e.ac !== null) without_reactive_context(() => {
			/** @type {AbortController} */ e.ac.abort(STALE_REACTION);
			e.ac = null;
		});
		if (e.fn !== null) e.teardown = noop$1;
		remove_reactions(e, 0);
		destroy_effect_children(e);
	}
}
/**
* @param {Derived} derived
*/
function unfreeze_derived_effects(derived) {
	if (derived.effects === null) return;
	for (const e of derived.effects) if (e.teardown && e.fn !== null) update_effect(e);
}
//#endregion
//#region ../../node_modules/.bun/svelte@5.56.5/node_modules/svelte/src/internal/client/reactivity/batch.js
/** @import { Fork } from 'svelte' */
/** @import { Derived, Effect, Reaction, Source, Value } from '#client' */
/** @type {Batch | null} */
var first_batch = null;
/** @type {Batch | null} */
var last_batch = null;
/** @type {Batch | null} */
var current_batch = null;
/**
* This is needed to avoid overwriting inputs
* @type {Batch | null}
*/
var previous_batch = null;
/**
* When time travelling (i.e. working in one batch, while other batches
* still have ongoing work), we ignore the real values of affected
* signals in favour of their values within the batch
* @type {Map<Value, any> | null}
*/
var batch_values = null;
/** @type {Effect | null} */
var last_scheduled_effect = null;
var is_flushing_sync = false;
var is_processing = false;
/**
* During traversal, this is an array. Newly created effects are (if not immediately
* executed) pushed to this array, rather than going through the scheduling
* rigamarole that would cause another turn of the flush loop.
* @type {Effect[] | null}
*/
var collected_effects = null;
/**
* An array of effects that are marked during traversal as a result of a `set`
* (not `internal_set`) call. These will be added to the next batch and
* trigger another `batch.process()`
* @type {Effect[] | null}
* @deprecated when we get rid of legacy mode and stores, we can get rid of this
*/
var legacy_updates = null;
var flush_count = 0;
var uid = 1;
var Batch = class Batch {
	id = uid++;
	/** True as soon as `#process` was called */
	#started = false;
	linked = true;
	/** @type {Batch | null} */
	#prev = null;
	/** @type {Batch | null} */
	#next = null;
	/** @type {Map<Effect, ReturnType<typeof deferred<any>>>} */
	async_deriveds = /* @__PURE__ */ new Map();
	/**
	* The current values of any signals that are updated in this batch.
	* Tuple format: [value, is_derived] (note: is_derived is false for deriveds, too, if they were overridden via assignment)
	* They keys of this map are identical to `this.#previous`
	* @type {Map<Value, [any, boolean]>}
	*/
	current = /* @__PURE__ */ new Map();
	/**
	* The values of any signals (sources and deriveds) that are updated in this batch _before_ those updates took place.
	* They keys of this map are identical to `this.#current`
	* @type {Map<Value, any>}
	*/
	previous = /* @__PURE__ */ new Map();
	/**
	* When the batch is committed (and the DOM is updated), we need to remove old branches
	* and append new ones by calling the functions added inside (if/each/key/etc) blocks
	* @type {Set<(batch: Batch) => void>}
	*/
	#commit_callbacks = /* @__PURE__ */ new Set();
	/**
	* If a fork is discarded, we need to destroy any effects that are no longer needed
	* @type {Set<(batch: Batch) => void>}
	*/
	#discard_callbacks = /* @__PURE__ */ new Set();
	/**
	* The number of async effects that are currently in flight
	*/
	#pending = 0;
	/**
	* Async effects that are currently in flight, _not_ inside a pending boundary
	* @type {Map<Effect, number>}
	*/
	#blocking_pending = /* @__PURE__ */ new Map();
	/**
	* A deferred that resolves when the batch is committed, used with `settled()`
	* TODO replace with Promise.withResolvers once supported widely enough
	* @type {{ promise: Promise<void>, resolve: (value?: any) => void, reject: (reason: unknown) => void } | null}
	*/
	#deferred = null;
	/**
	* The root effects that need to be flushed
	* @type {Effect[]}
	*/
	#roots = [];
	/**
	* Effects created while this batch was active.
	* @type {Effect[]}
	*/
	#new_effects = [];
	/**
	* Deferred effects (which run after async work has completed) that are DIRTY
	* @type {Set<Effect>}
	*/
	#dirty_effects = /* @__PURE__ */ new Set();
	/**
	* Deferred effects that are MAYBE_DIRTY
	* @type {Set<Effect>}
	*/
	#maybe_dirty_effects = /* @__PURE__ */ new Set();
	/**
	* A map of branches that still exist, but will be destroyed when this batch
	* is committed — we skip over these during `process`.
	* The value contains child effects that were dirty/maybe_dirty before being reset,
	* so they can be rescheduled if the branch survives.
	* @type {Map<Effect, { d: Effect[], m: Effect[] }>}
	*/
	#skipped_branches = /* @__PURE__ */ new Map();
	/**
	* Inverse of #skipped_branches which we need to tell prior batches to unskip them when committing
	* @type {Set<Effect>}
	*/
	#unskipped_branches = /* @__PURE__ */ new Set();
	is_fork = false;
	#decrement_queued = false;
	constructor() {
		if (last_batch === null) first_batch = last_batch = this;
		else {
			last_batch.#next = this;
			this.#prev = last_batch;
		}
		last_batch = this;
	}
	#is_deferred() {
		if (this.is_fork) return true;
		for (const effect of this.#blocking_pending.keys()) {
			var e = effect;
			var skipped = false;
			while (e.parent !== null) {
				if (this.#skipped_branches.has(e)) {
					skipped = true;
					break;
				}
				e = e.parent;
			}
			if (!skipped) return true;
		}
		return false;
	}
	/**
	* Add an effect to the #skipped_branches map and reset its children
	* @param {Effect} effect
	*/
	skip_effect(effect) {
		if (!this.#skipped_branches.has(effect)) this.#skipped_branches.set(effect, {
			d: [],
			m: []
		});
		this.#unskipped_branches.delete(effect);
	}
	/**
	* Remove an effect from the #skipped_branches map and reschedule
	* any tracked dirty/maybe_dirty child effects
	* @param {Effect} effect
	* @param {(e: Effect) => void} callback
	*/
	unskip_effect(effect, callback = (e) => this.schedule(e)) {
		var tracked = this.#skipped_branches.get(effect);
		if (tracked) {
			this.#skipped_branches.delete(effect);
			for (var e of tracked.d) {
				set_signal_status(e, DIRTY);
				callback(e);
			}
			for (e of tracked.m) {
				set_signal_status(e, MAYBE_DIRTY);
				callback(e);
			}
		}
		this.#unskipped_branches.add(effect);
	}
	#process() {
		this.#started = true;
		if (flush_count++ > 1e3) {
			this.#unlink();
			infinite_loop_guard();
		}
		for (const e of this.#dirty_effects) {
			this.#maybe_dirty_effects.delete(e);
			set_signal_status(e, DIRTY);
			this.schedule(e);
		}
		for (const e of this.#maybe_dirty_effects) {
			set_signal_status(e, MAYBE_DIRTY);
			this.schedule(e);
		}
		const roots = this.#roots;
		this.#roots = [];
		this.apply();
		/** @type {Effect[]} */
		var effects = collected_effects = [];
		/** @type {Effect[]} */
		var render_effects = [];
		/**
		* @type {Effect[]}
		* @deprecated when we get rid of legacy mode and stores, we can get rid of this
		*/
		var updates = legacy_updates = [];
		for (const root of roots) try {
			this.#traverse(root, effects, render_effects);
		} catch (e) {
			reset_all(root);
			if (!this.#is_deferred()) this.discard();
			throw e;
		}
		current_batch = null;
		if (updates.length > 0) {
			var batch = Batch.ensure();
			for (const e of updates) batch.schedule(e);
		}
		collected_effects = null;
		legacy_updates = null;
		if (this.#is_deferred()) {
			this.#defer_effects(render_effects);
			this.#defer_effects(effects);
			for (const [e, t] of this.#skipped_branches) reset_branch(e, t);
			if (updates.length > 0)
 /** @type {Batch} */ current_batch.#process();
			return;
		}
		const earlier_batch = this.#find_earlier_batch();
		if (earlier_batch) {
			this.#defer_effects(render_effects);
			this.#defer_effects(effects);
			earlier_batch.#merge(this);
			return;
		}
		this.#dirty_effects.clear();
		this.#maybe_dirty_effects.clear();
		for (const fn of this.#commit_callbacks) fn(this);
		this.#commit_callbacks.clear();
		previous_batch = this;
		flush_queued_effects(render_effects);
		flush_queued_effects(effects);
		previous_batch = null;
		this.#deferred?.resolve();
		var next_batch = current_batch;
		if (this.#pending === 0 && (this.#roots.length === 0 || next_batch !== null)) {
			this.#unlink();
		}
		if (this.#roots.length > 0) if (next_batch !== null) {
			const batch = next_batch;
			batch.#roots.push(...this.#roots.filter((r) => !batch.#roots.includes(r)));
		} else next_batch = this;
		if (next_batch !== null) next_batch.#process();
	}
	/**
	* Traverse the effect tree, executing effects or stashing
	* them for later execution as appropriate
	* @param {Effect} root
	* @param {Effect[]} effects
	* @param {Effect[]} render_effects
	*/
	#traverse(root, effects, render_effects) {
		root.f ^= CLEAN;
		var effect = root.first;
		while (effect !== null) {
			var flags = effect.f;
			var is_branch = (flags & 96) !== 0;
			if (!(is_branch && (flags & 1024) !== 0 || (flags & 8192) !== 0 || this.#skipped_branches.has(effect)) && effect.fn !== null) {
				if (is_branch) effect.f ^= CLEAN;
				else if ((flags & 4) !== 0) effects.push(effect);
				else if (is_dirty(effect)) {
					if ((flags & 16) !== 0) this.#maybe_dirty_effects.add(effect);
					update_effect(effect);
				}
				var child = effect.first;
				if (child !== null) {
					effect = child;
					continue;
				}
			}
			while (effect !== null) {
				var next = effect.next;
				if (next !== null) {
					effect = next;
					break;
				}
				effect = effect.parent;
			}
		}
	}
	#find_earlier_batch() {
		var batch = this.#prev;
		while (batch !== null) {
			if (!batch.is_fork) {
				for (const [value, [, is_derived]] of this.current) if (batch.current.has(value) && !is_derived) return batch;
			}
			batch = batch.#prev;
		}
		return null;
	}
	/**
	* @param {Batch} batch
	*/
	#merge(batch) {
		for (const [source, value] of batch.current) {
			if (!this.previous.has(source) && batch.previous.has(source)) this.previous.set(source, batch.previous.get(source));
			this.current.set(source, value);
		}
		for (const [effect, deferred] of batch.async_deriveds) {
			const d = this.async_deriveds.get(effect);
			if (d) deferred.promise.then(d.resolve).catch(d.reject);
		}
		batch.async_deriveds.clear();
		this.transfer_effects(batch.#dirty_effects, batch.#maybe_dirty_effects);
		/**
		* mark all effects that depend on `batch.current`, except the
		* async effects that we just resolved (TODO unless they depend
		* on values in this batch that are NOT in the later batch?).
		* Through this we also will populate the correct #skipped_branches,
		* oncommit callbacks etc, so we don't need to merge them separately.
		* @param {Value} value
		*/
		const mark = (value) => {
			var reactions = value.reactions;
			if (reactions === null) return;
			if ((value.f & 2) !== 0 && (value.f & 6144) === 0) return;
			for (const reaction of reactions) {
				var flags = reaction.f;
				if ((flags & 2) !== 0) mark(reaction);
				else {
					var effect = reaction;
					if (flags & 4194320 && !this.async_deriveds.has(effect)) {
						this.#maybe_dirty_effects.delete(effect);
						set_signal_status(effect, DIRTY);
						this.schedule(effect);
					}
				}
			}
		};
		for (const source of this.current.keys()) mark(source);
		this.oncommit(() => batch.discard());
		batch.#unlink();
		current_batch = this;
		this.#process();
	}
	/**
	* @param {Effect[]} effects
	*/
	#defer_effects(effects) {
		for (var i = 0; i < effects.length; i += 1) defer_effect(effects[i], this.#dirty_effects, this.#maybe_dirty_effects);
	}
	/**
	* Associate a change to a given source with the current
	* batch, noting its previous and current values
	* @param {Value} source
	* @param {any} value
	* @param {boolean} [is_derived]
	*/
	capture(source, value, is_derived = false) {
		if (source.v !== UNINITIALIZED && !this.previous.has(source)) this.previous.set(source, source.v);
		if ((source.f & 8388608) === 0) {
			this.current.set(source, [value, is_derived]);
			batch_values?.set(source, value);
		}
		if (!this.is_fork) source.v = value;
	}
	activate() {
		current_batch = this;
	}
	deactivate() {
		current_batch = null;
		batch_values = null;
	}
	flush() {
		try {
			is_processing = true;
			current_batch = this;
			this.#process();
		} finally {
			flush_count = 0;
			last_scheduled_effect = null;
			collected_effects = null;
			legacy_updates = null;
			is_processing = false;
			current_batch = null;
			batch_values = null;
			old_values.clear();
		}
	}
	discard() {
		for (const fn of this.#discard_callbacks) fn(this);
		this.#discard_callbacks.clear();
		for (const deferred of this.async_deriveds.values()) deferred.reject(OBSOLETE);
		this.#unlink();
		this.#deferred?.resolve();
	}
	/**
	* @param {Effect} effect
	*/
	register_created_effect(effect) {
		this.#new_effects.push(effect);
	}
	#commit() {
		for (let batch = first_batch; batch !== null; batch = batch.#next) {
			var is_earlier = batch.id < this.id;
			/** @type {Source[]} */
			var sources = [];
			for (const [source, [value, is_derived]] of this.current) {
				if (batch.current.has(source)) {
					var batch_value = batch.current.get(source)[0];
					if (is_earlier && value !== batch_value) batch.current.set(source, [value, is_derived]);
					else continue;
				}
				sources.push(source);
			}
			if (is_earlier) for (const [effect, deferred] of this.async_deriveds) {
				const d = batch.async_deriveds.get(effect);
				if (d) deferred.promise.then(d.resolve).catch(d.reject);
			}
			var current = [...batch.current.keys()].filter((source) => !batch.current.get(source)[1]);
			if (!batch.#started || current.length === 0) continue;
			var others = current.filter((source) => !this.current.has(source));
			if (others.length === 0) {
				if (is_earlier) batch.discard();
			} else if (sources.length > 0) {
				if (is_earlier) for (const unskipped of this.#unskipped_branches) batch.unskip_effect(unskipped, (e) => {
					if ((e.f & 4194320) !== 0) batch.schedule(e);
					else batch.#defer_effects([e]);
				});
				batch.activate();
				/** @type {Set<Value>} */
				var marked = /* @__PURE__ */ new Set();
				/** @type {Map<Reaction, boolean>} */
				var checked = /* @__PURE__ */ new Map();
				for (var source of sources) mark_effects(source, others, marked, checked);
				checked = /* @__PURE__ */ new Map();
				var current_unequal = [...batch.current].filter(([c, v1]) => {
					const v2 = this.current.get(c);
					if (!v2) return true;
					return v2[0] !== v1[0] || v2[1] !== v1[1];
				}).map(([c]) => c);
				if (current_unequal.length > 0) {
					for (const effect of this.#new_effects) if ((effect.f & 155648) === 0 && depends_on(effect, current_unequal, checked)) if ((effect.f & 4194320) !== 0) {
						set_signal_status(effect, DIRTY);
						batch.schedule(effect);
					} else batch.#dirty_effects.add(effect);
				}
				if (batch.#roots.length > 0 && !batch.#decrement_queued) {
					batch.apply();
					for (var root of batch.#roots) batch.#traverse(root, [], []);
					batch.#roots = [];
				}
				batch.deactivate();
			}
		}
	}
	/**
	* @param {boolean} blocking
	* @param {Effect} effect
	*/
	increment(blocking, effect) {
		this.#pending += 1;
		if (blocking) {
			let blocking_pending_count = this.#blocking_pending.get(effect) ?? 0;
			this.#blocking_pending.set(effect, blocking_pending_count + 1);
		}
	}
	/**
	* @param {boolean} blocking
	* @param {Effect} effect
	*/
	decrement(blocking, effect) {
		this.#pending -= 1;
		if (blocking) {
			let blocking_pending_count = this.#blocking_pending.get(effect) ?? 0;
			if (blocking_pending_count === 1) this.#blocking_pending.delete(effect);
			else this.#blocking_pending.set(effect, blocking_pending_count - 1);
		}
		if (this.#decrement_queued) return;
		this.#decrement_queued = true;
		queue_micro_task(() => {
			this.#decrement_queued = false;
			if (this.linked) this.flush();
		});
	}
	/**
	* @param {Set<Effect>} dirty_effects
	* @param {Set<Effect>} maybe_dirty_effects
	*/
	transfer_effects(dirty_effects, maybe_dirty_effects) {
		for (const e of dirty_effects) this.#dirty_effects.add(e);
		for (const e of maybe_dirty_effects) this.#maybe_dirty_effects.add(e);
		dirty_effects.clear();
		maybe_dirty_effects.clear();
	}
	/** @param {(batch: Batch) => void} fn */
	oncommit(fn) {
		this.#commit_callbacks.add(fn);
	}
	/** @param {(batch: Batch) => void} fn */
	ondiscard(fn) {
		this.#discard_callbacks.add(fn);
	}
	settled() {
		return (this.#deferred ??= deferred()).promise;
	}
	static ensure() {
		if (current_batch === null) {
			const batch = current_batch = new Batch();
			if (!is_processing && !is_flushing_sync) queue_micro_task(() => {
				if (!batch.#started) batch.flush();
			});
		}
		return current_batch;
	}
	apply() {
		{
			batch_values = null;
			return;
		}
	}
	/**
	*
	* @param {Effect} effect
	*/
	schedule(effect) {
		last_scheduled_effect = effect;
		if (effect.b?.is_pending && (effect.f & 16777228) !== 0 && (effect.f & 32768) === 0) {
			effect.b.defer_effect(effect);
			return;
		}
		var e = effect;
		while (e.parent !== null) {
			e = e.parent;
			var flags = e.f;
			if (collected_effects !== null && e === active_effect) {
				if ((active_reaction === null || (active_reaction.f & 2) === 0) && true) return;
			}
			if ((flags & 96) !== 0) {
				if ((flags & 1024) === 0) return;
				e.f ^= CLEAN;
			}
		}
		this.#roots.push(e);
	}
	#unlink() {
		if (!this.linked) return;
		var prev = this.#prev;
		var next = this.#next;
		if (prev === null) first_batch = next;
		else prev.#next = next;
		if (next === null) last_batch = prev;
		else next.#prev = prev;
		this.linked = false;
	}
};
/**
* Synchronously flush any pending updates.
* Returns void if no callback is provided, otherwise returns the result of calling the callback.
* @template [T=void]
* @param {(() => T) | undefined} [fn]
* @returns {T}
*/
function flushSync(fn) {
	var was_flushing_sync = is_flushing_sync;
	is_flushing_sync = true;
	try {
		var result;
		if (fn) ;
		while (true) {
			flush_tasks();
			if (current_batch === null) return result;
			current_batch.flush();
		}
	} finally {
		is_flushing_sync = was_flushing_sync;
	}
}
function infinite_loop_guard() {
	try {
		effect_update_depth_exceeded();
	} catch (error) {
		invoke_error_boundary(error, last_scheduled_effect);
	}
}
/** @type {Set<Effect> | null} */
var eager_block_effects = null;
/**
* @param {Array<Effect>} effects
* @returns {void}
*/
function flush_queued_effects(effects) {
	var length = effects.length;
	if (length === 0) return;
	var i = 0;
	while (i < length) {
		var effect = effects[i++];
		if ((effect.f & 24576) === 0 && is_dirty(effect)) {
			eager_block_effects = /* @__PURE__ */ new Set();
			update_effect(effect);
			if (effect.deps === null && effect.first === null && effect.nodes === null && effect.teardown === null && effect.ac === null) unlink_effect(effect);
			if (eager_block_effects?.size > 0) {
				old_values.clear();
				for (const e of eager_block_effects) {
					if ((e.f & 24576) !== 0) continue;
					/** @type {Effect[]} */
					const ordered_effects = [e];
					let ancestor = e.parent;
					while (ancestor !== null) {
						if (eager_block_effects.has(ancestor)) {
							eager_block_effects.delete(ancestor);
							ordered_effects.push(ancestor);
						}
						ancestor = ancestor.parent;
					}
					for (let j = ordered_effects.length - 1; j >= 0; j--) {
						const e = ordered_effects[j];
						if ((e.f & 24576) !== 0) continue;
						update_effect(e);
					}
				}
				eager_block_effects.clear();
			}
		}
	}
	eager_block_effects = null;
}
/**
* This is similar to `mark_reactions`, but it only marks async/block effects
* depending on `value` and at least one of the other `sources`, so that
* these effects can re-run after another batch has been committed
* @param {Value} value
* @param {Source[]} sources
* @param {Set<Value>} marked
* @param {Map<Reaction, boolean>} checked
*/
function mark_effects(value, sources, marked, checked) {
	if (marked.has(value)) return;
	marked.add(value);
	if (value.reactions !== null) for (const reaction of value.reactions) {
		const flags = reaction.f;
		if ((flags & 2) !== 0) mark_effects(reaction, sources, marked, checked);
		else if ((flags & 4194320) !== 0 && (flags & 2048) === 0 && depends_on(reaction, sources, checked)) {
			set_signal_status(reaction, DIRTY);
			schedule_effect(reaction);
		}
	}
}
/**
* @param {Reaction} reaction
* @param {Source[]} sources
* @param {Map<Reaction, boolean>} checked
*/
function depends_on(reaction, sources, checked) {
	const depends = checked.get(reaction);
	if (depends !== void 0) return depends;
	if (reaction.deps !== null) for (const dep of reaction.deps) {
		if (includes.call(sources, dep)) return true;
		if ((dep.f & 2) !== 0 && depends_on(dep, sources, checked)) {
			checked.set(dep, true);
			return true;
		}
	}
	checked.set(reaction, false);
	return false;
}
/**
* @param {Effect} effect
* @returns {void}
*/
function schedule_effect(effect) {
	/** @type {Batch} */ current_batch.schedule(effect);
}
/**
* Mark all the effects inside a skipped branch CLEAN, so that
* they can be correctly rescheduled later. Tracks dirty and maybe_dirty
* effects so they can be rescheduled if the branch survives.
* @param {Effect} effect
* @param {{ d: Effect[], m: Effect[] }} tracked
*/
function reset_branch(effect, tracked) {
	if ((effect.f & 32) !== 0 && (effect.f & 1024) !== 0) return;
	if ((effect.f & 2048) !== 0) tracked.d.push(effect);
	else if ((effect.f & 4096) !== 0) tracked.m.push(effect);
	set_signal_status(effect, CLEAN);
	var e = effect.first;
	while (e !== null) {
		reset_branch(e, tracked);
		e = e.next;
	}
}
/**
* Mark an entire effect tree clean following an error
* @param {Effect} effect
*/
function reset_all(effect) {
	set_signal_status(effect, CLEAN);
	var e = effect.first;
	while (e !== null) {
		reset_all(e);
		e = e.next;
	}
}
//#endregion
//#region ../../node_modules/.bun/svelte@5.56.5/node_modules/svelte/src/internal/client/reactivity/sources.js
/** @import { Derived, Effect, Source, Value } from '#client' */
/** @type {Set<Effect>} */
var eager_effects = /* @__PURE__ */ new Set();
/** @type {Map<Source, any>} */
var old_values = /* @__PURE__ */ new Map();
var eager_effects_deferred = false;
/**
* @template V
* @param {V} v
* @param {Error | null} [stack]
* @returns {Source<V>}
*/
function source(v, stack) {
	return {
		f: 0,
		v,
		reactions: null,
		equals,
		rv: 0,
		wv: 0
	};
}
/**
* @template V
* @param {V} v
* @param {Error | null} [stack]
*/
/*#__NO_SIDE_EFFECTS__*/
function state(v, stack) {
	const s = source(v);
	push_reaction_value(s);
	return s;
}
/**
* @template V
* @param {V} initial_value
* @param {boolean} [immutable]
* @returns {Source<V>}
*/
/*#__NO_SIDE_EFFECTS__*/
function mutable_source(initial_value, immutable = false, trackable = true) {
	const s = source(initial_value);
	if (!immutable) s.equals = safe_equals;
	return s;
}
/**
* @template V
* @param {Source<V>} source
* @param {V} value
* @param {boolean} [should_proxy]
* @returns {V}
*/
function set(source, value, should_proxy = false) {
	if (active_reaction !== null && (!untracking || (active_reaction.f & 131072) !== 0) && is_runes() && (active_reaction.f & 4325394) !== 0 && (current_sources === null || !current_sources.has(source))) state_unsafe_mutation();
	return internal_set(source, should_proxy ? proxy(value) : value, legacy_updates);
}
/**
* @template V
* @param {Source<V>} source
* @param {V} value
* @param {Effect[] | null} [updated_during_traversal]
* @returns {V}
*/
function internal_set(source, value, updated_during_traversal = null) {
	if (!source.equals(value)) {
		old_values.set(source, is_destroying_effect ? value : source.v);
		var batch = Batch.ensure();
		batch.capture(source, value);
		if ((source.f & 2) !== 0) {
			const derived = source;
			if ((source.f & 2048) !== 0) execute_derived(derived);
			if (batch_values === null) update_derived_status(derived);
		}
		source.wv = increment_write_version();
		mark_reactions(source, DIRTY, updated_during_traversal);
		if (active_effect !== null && (active_effect.f & 1024) !== 0 && (active_effect.f & 96) === 0) if (untracked_writes === null) set_untracked_writes([source]);
		else untracked_writes.push(source);
		if (!batch.is_fork && eager_effects.size > 0 && !eager_effects_deferred) flush_eager_effects();
	}
	return value;
}
function flush_eager_effects() {
	eager_effects_deferred = false;
	for (const effect of eager_effects) {
		if ((effect.f & 1024) !== 0) set_signal_status(effect, MAYBE_DIRTY);
		let dirty;
		try {
			dirty = is_dirty(effect);
		} catch {
			dirty = true;
		}
		if (dirty) update_effect(effect);
	}
	eager_effects.clear();
}
/**
* Silently (without using `get`) increment a source
* @param {Source<number>} source
*/
function increment(source) {
	set(source, source.v + 1);
}
/**
* @param {Value} signal
* @param {number} status should be DIRTY or MAYBE_DIRTY
* @param {Effect[] | null} updated_during_traversal
* @returns {void}
*/
function mark_reactions(signal, status, updated_during_traversal) {
	var reactions = signal.reactions;
	if (reactions === null) return;
	var length = reactions.length;
	for (var i = 0; i < length; i++) {
		var reaction = reactions[i];
		var flags = reaction.f;
		var not_dirty = (flags & DIRTY) === 0;
		if (not_dirty) set_signal_status(reaction, status);
		if ((flags & 131072) !== 0) eager_effects.add(reaction);
		else if ((flags & 2) !== 0) {
			var derived = reaction;
			batch_values?.delete(derived);
			if ((flags & 65536) === 0) {
				if (flags & 512 && (active_effect === null || (active_effect.f & 2097152) === 0)) reaction.f |= WAS_MARKED;
				mark_reactions(derived, MAYBE_DIRTY, updated_during_traversal);
			}
		} else if (not_dirty) {
			var effect = reaction;
			if ((flags & 16) !== 0 && eager_block_effects !== null) eager_block_effects.add(effect);
			if (updated_during_traversal !== null) updated_during_traversal.push(effect);
			else schedule_effect(effect);
		}
	}
}
/**
* @template T
* @param {T} value
* @returns {T}
*/
function proxy(value) {
	if (typeof value !== "object" || value === null || STATE_SYMBOL in value) return value;
	const prototype = get_prototype_of(value);
	if (prototype !== object_prototype && prototype !== array_prototype) return value;
	/** @type {Map<any, Source<any>>} */
	var sources = /* @__PURE__ */ new Map();
	var is_proxied_array = is_array(value);
	var version = /* @__PURE__ */ state(0);
	var parent_version = update_version;
	/**
	* Executes the proxy in the context of the reaction it was originally created in, if any
	* @template T
	* @param {() => T} fn
	*/
	var with_parent = (fn) => {
		if (update_version === parent_version) return fn();
		var reaction = active_reaction;
		var version = update_version;
		set_active_reaction(null);
		set_update_version(parent_version);
		var result = fn();
		set_active_reaction(reaction);
		set_update_version(version);
		return result;
	};
	if (is_proxied_array) sources.set("length", /* @__PURE__ */ state(
		/** @type {any[]} */
		value.length));
	return new Proxy(value, {
		defineProperty(_, prop, descriptor) {
			if (!("value" in descriptor) || descriptor.configurable === false || descriptor.enumerable === false || descriptor.writable === false) state_descriptors_fixed();
			var s = sources.get(prop);
			if (s === void 0) with_parent(() => {
				var s = /* @__PURE__ */ state(descriptor.value);
				sources.set(prop, s);
				return s;
			});
			else set(s, descriptor.value, true);
			return true;
		},
		deleteProperty(target, prop) {
			var s = sources.get(prop);
			if (s === void 0) {
				if (prop in target) {
					const s = with_parent(() => /* @__PURE__ */ state(UNINITIALIZED));
					sources.set(prop, s);
					increment(version);
				}
			} else {
				set(s, UNINITIALIZED);
				increment(version);
			}
			return true;
		},
		get(target, prop, receiver) {
			if (prop === STATE_SYMBOL) return value;
			var s = sources.get(prop);
			var exists = prop in target;
			if (s === void 0 && (!exists || get_descriptor(target, prop)?.writable)) {
				s = with_parent(() => {
					return /* @__PURE__ */ state(proxy(exists ? target[prop] : UNINITIALIZED));
				});
				sources.set(prop, s);
			}
			if (s !== void 0) {
				var v = get$3(s);
				return v === UNINITIALIZED ? void 0 : v;
			}
			return Reflect.get(target, prop, receiver);
		},
		getOwnPropertyDescriptor(target, prop) {
			var descriptor = Reflect.getOwnPropertyDescriptor(target, prop);
			if (descriptor && "value" in descriptor) {
				var s = sources.get(prop);
				if (s) descriptor.value = get$3(s);
			} else if (descriptor === void 0) {
				var source = sources.get(prop);
				var value = source?.v;
				if (source !== void 0 && value !== UNINITIALIZED) return {
					enumerable: true,
					configurable: true,
					value,
					writable: true
				};
			}
			return descriptor;
		},
		has(target, prop) {
			if (prop === STATE_SYMBOL) return true;
			var s = sources.get(prop);
			var has = s !== void 0 && s.v !== UNINITIALIZED || Reflect.has(target, prop);
			if (s !== void 0 || active_effect !== null && (!has || get_descriptor(target, prop)?.writable)) {
				if (s === void 0) {
					s = with_parent(() => {
						return /* @__PURE__ */ state(has ? proxy(target[prop]) : UNINITIALIZED);
					});
					sources.set(prop, s);
				}
				if (get$3(s) === UNINITIALIZED) return false;
			}
			return has;
		},
		set(target, prop, value, receiver) {
			var s = sources.get(prop);
			var has = prop in target;
			if (is_proxied_array && prop === "length") for (var i = value; i < s.v; i += 1) {
				var other_s = sources.get(i + "");
				if (other_s !== void 0) set(other_s, UNINITIALIZED);
				else if (i in target) {
					other_s = with_parent(() => /* @__PURE__ */ state(UNINITIALIZED));
					sources.set(i + "", other_s);
				}
			}
			if (s === void 0) {
				if (!has || get_descriptor(target, prop)?.writable) {
					s = with_parent(() => /* @__PURE__ */ state(void 0));
					set(s, proxy(value));
					sources.set(prop, s);
				}
			} else {
				has = s.v !== UNINITIALIZED;
				var p = with_parent(() => proxy(value));
				set(s, p);
			}
			var descriptor = Reflect.getOwnPropertyDescriptor(target, prop);
			if (descriptor?.set) descriptor.set.call(receiver, value);
			if (!has) {
				if (is_proxied_array && typeof prop === "string") {
					var ls = sources.get("length");
					var n = Number(prop);
					if (Number.isInteger(n) && n >= ls.v) set(ls, n + 1);
				}
				increment(version);
			}
			return true;
		},
		ownKeys(target) {
			get$3(version);
			var own_keys = Reflect.ownKeys(target).filter((key) => {
				var source = sources.get(key);
				return source === void 0 || source.v !== UNINITIALIZED;
			});
			for (var [key, source] of sources) if (source.v !== UNINITIALIZED && !(key in target)) own_keys.push(key);
			return own_keys;
		},
		setPrototypeOf() {
			state_prototype_fixed();
		}
	});
}
//#endregion
//#region ../../node_modules/.bun/svelte@5.56.5/node_modules/svelte/src/internal/client/dom/operations.js
/** @type {Window} */
var $window;
/** @type {() => Node | null} */
var first_child_getter;
/** @type {() => Node | null} */
var next_sibling_getter;
/**
* Initialize these lazily to avoid issues when using the runtime in a server context
* where these globals are not available while avoiding a separate server entry point
*/
function init_operations() {
	if ($window !== void 0) return;
	$window = window;
	var element_prototype = Element.prototype;
	var node_prototype = Node.prototype;
	var text_prototype = Text.prototype;
	first_child_getter = get_descriptor(node_prototype, "firstChild").get;
	next_sibling_getter = get_descriptor(node_prototype, "nextSibling").get;
	if (is_extensible(element_prototype)) {
		/** @type {any} */ element_prototype[CLASS_CACHE] = void 0;
		/** @type {any} */ element_prototype[ATTRIBUTES_CACHE] = null;
		/** @type {any} */ element_prototype[STYLE_CACHE] = void 0;
		element_prototype.__e = void 0;
	}
	if (is_extensible(text_prototype))
 /** @type {any} */ text_prototype[TEXT_CACHE] = void 0;
}
/**
* @param {string} value
* @returns {Text}
*/
function create_text(value = "") {
	return document.createTextNode(value);
}
/**
* @template {Node} N
* @param {N} node
*/
/*@__NO_SIDE_EFFECTS__*/
function get_first_child(node) {
	return first_child_getter.call(node);
}
/**
* @template {Node} N
* @param {N} node
*/
/*@__NO_SIDE_EFFECTS__*/
function get_next_sibling(node) {
	return next_sibling_getter.call(node);
}
/**
* @template {Node} N
* @param {N} node
* @returns {void}
*/
function clear_text_content(node) {
	node.textContent = "";
}
//#endregion
//#region ../../node_modules/.bun/svelte@5.56.5/node_modules/svelte/src/internal/client/reactivity/effects.js
/** @import { Blocker, ComponentContext, ComponentContextLegacy, Derived, Effect, TemplateNode, TransitionManager } from '#client' */
/**
* @param {Effect} effect
* @param {Effect} parent_effect
*/
function push_effect(effect, parent_effect) {
	var parent_last = parent_effect.last;
	if (parent_last === null) parent_effect.last = parent_effect.first = effect;
	else {
		parent_last.next = effect;
		effect.prev = parent_last;
		parent_effect.last = effect;
	}
}
/**
* @param {number} type
* @param {null | (() => void | (() => void))} fn
* @returns {Effect}
*/
function create_effect(type, fn) {
	var parent = active_effect;
	if (parent !== null && (parent.f & 8192) !== 0) type |= INERT;
	/** @type {Effect} */
	var effect = {
		ctx: component_context,
		deps: null,
		nodes: null,
		f: type | DIRTY | 512,
		first: null,
		fn,
		last: null,
		next: null,
		parent,
		b: parent && parent.b,
		prev: null,
		teardown: null,
		wv: 0,
		ac: null
	};
	current_batch?.register_created_effect(effect);
	/** @type {Effect | null} */
	var e = effect;
	if ((type & 4) !== 0) if (collected_effects !== null) collected_effects.push(effect);
	else Batch.ensure().schedule(effect);
	else if (fn !== null) {
		try {
			update_effect(effect);
		} catch (e) {
			destroy_effect(effect);
			throw e;
		}
		if (e.deps === null && e.teardown === null && e.nodes === null && e.first === e.last && (e.f & 524288) === 0) {
			e = e.first;
			if ((type & 16) !== 0 && (type & 65536) !== 0 && e !== null) e.f |= EFFECT_TRANSPARENT;
		}
	}
	if (e !== null) {
		e.parent = parent;
		if (parent !== null) push_effect(e, parent);
		if (active_reaction !== null && (active_reaction.f & 2) !== 0 && (type & 64) === 0) {
			var derived = active_reaction;
			(derived.effects ??= []).push(e);
		}
	}
	return effect;
}
/**
* Internal representation of `$effect.tracking()`
* @returns {boolean}
*/
function effect_tracking() {
	return active_reaction !== null && !untracking;
}
/**
* @param {() => void | (() => void)} fn
*/
function create_user_effect(fn) {
	return create_effect(4 | USER_EFFECT, fn);
}
/**
* An effect root whose children can transition out
* @param {() => void} fn
* @returns {(options?: { outro?: boolean }) => Promise<void>}
*/
function component_root(fn) {
	Batch.ensure();
	const effect = create_effect(64 | EFFECT_PRESERVED, fn);
	return (options = {}) => {
		return new Promise((fulfil) => {
			if (options.outro) pause_effect(effect, () => {
				destroy_effect(effect);
				fulfil(void 0);
			});
			else {
				destroy_effect(effect);
				fulfil(void 0);
			}
		});
	};
}
/**
* @param {() => void | (() => void)} fn
* @returns {Effect}
*/
function render_effect(fn, flags = 0) {
	return create_effect(8 | flags, fn);
}
/**
* @param {(() => void)} fn
* @param {number} flags
*/
function block(fn, flags = 0) {
	return create_effect(16 | flags, fn);
}
/**
* @param {(() => void)} fn
*/
function branch(fn) {
	return create_effect(32 | EFFECT_PRESERVED, fn);
}
/**
* @param {Effect} effect
*/
function execute_effect_teardown(effect) {
	var teardown = effect.teardown;
	if (teardown !== null) {
		const previously_destroying_effect = is_destroying_effect;
		const previous_reaction = active_reaction;
		set_is_destroying_effect(true);
		set_active_reaction(null);
		try {
			teardown.call(null);
		} finally {
			set_is_destroying_effect(previously_destroying_effect);
			set_active_reaction(previous_reaction);
		}
	}
}
/**
* @param {Effect} signal
* @param {boolean} remove_dom
* @returns {void}
*/
function destroy_effect_children(signal, remove_dom = false) {
	var effect = signal.first;
	signal.first = signal.last = null;
	while (effect !== null) {
		const controller = effect.ac;
		if (controller !== null) without_reactive_context(() => {
			controller.abort(STALE_REACTION);
		});
		var next = effect.next;
		if ((effect.f & 64) !== 0) effect.parent = null;
		else destroy_effect(effect, remove_dom);
		effect = next;
	}
}
/**
* @param {Effect} signal
* @returns {void}
*/
function destroy_block_effect_children(signal) {
	var effect = signal.first;
	while (effect !== null) {
		var next = effect.next;
		if ((effect.f & 32) === 0) destroy_effect(effect);
		effect = next;
	}
}
/**
* @param {Effect} effect
* @param {boolean} [remove_dom]
* @returns {void}
*/
function destroy_effect(effect, remove_dom = true) {
	var removed = false;
	if ((remove_dom || (effect.f & 262144) !== 0) && effect.nodes !== null && effect.nodes.end !== null) {
		remove_effect_dom(effect.nodes.start, effect.nodes.end);
		removed = true;
	}
	effect.f |= DESTROYING;
	destroy_effect_children(effect, remove_dom && !removed);
	remove_reactions(effect, 0);
	var transitions = effect.nodes && effect.nodes.t;
	if (transitions !== null) for (const transition of transitions) transition.stop();
	execute_effect_teardown(effect);
	effect.f ^= DESTROYING;
	effect.f |= DESTROYED;
	var parent = effect.parent;
	if (parent !== null && parent.first !== null) unlink_effect(effect);
	effect.next = effect.prev = effect.teardown = effect.ctx = effect.deps = effect.fn = effect.nodes = effect.ac = effect.b = null;
}
/**
*
* @param {TemplateNode | null} node
* @param {TemplateNode} end
*/
function remove_effect_dom(node, end) {
	while (node !== null) {
		/** @type {TemplateNode | null} */
		var next = node === end ? null : /* @__PURE__ */ get_next_sibling(node);
		node.remove();
		node = next;
	}
}
/**
* Detach an effect from the effect tree, freeing up memory and
* reducing the amount of work that happens on subsequent traversals
* @param {Effect} effect
*/
function unlink_effect(effect) {
	var parent = effect.parent;
	var prev = effect.prev;
	var next = effect.next;
	if (prev !== null) prev.next = next;
	if (next !== null) next.prev = prev;
	if (parent !== null) {
		if (parent.first === effect) parent.first = next;
		if (parent.last === effect) parent.last = prev;
	}
}
/**
* When a block effect is removed, we don't immediately destroy it or yank it
* out of the DOM, because it might have transitions. Instead, we 'pause' it.
* It stays around (in memory, and in the DOM) until outro transitions have
* completed, and if the state change is reversed then we _resume_ it.
* A paused effect does not update, and the DOM subtree becomes inert.
* @param {Effect} effect
* @param {() => void} [callback]
* @param {boolean} [destroy]
*/
function pause_effect(effect, callback, destroy = true) {
	/** @type {TransitionManager[]} */
	var transitions = [];
	pause_children(effect, transitions, true);
	var fn = () => {
		if (destroy) destroy_effect(effect);
		if (callback) callback();
	};
	var remaining = transitions.length;
	if (remaining > 0) {
		var check = () => --remaining || fn();
		for (var transition of transitions) transition.out(check);
	} else fn();
}
/**
* @param {Effect} effect
* @param {TransitionManager[]} transitions
* @param {boolean} local
*/
function pause_children(effect, transitions, local) {
	if ((effect.f & 8192) !== 0) return;
	effect.f ^= INERT;
	var t = effect.nodes && effect.nodes.t;
	if (t !== null) {
		for (const transition of t) if (transition.is_global || local) transitions.push(transition);
	}
	var child = effect.first;
	while (child !== null) {
		var sibling = child.next;
		if ((child.f & 64) === 0) {
			var transparent = (child.f & 65536) !== 0 || (child.f & 32) !== 0 && (effect.f & 16) !== 0;
			pause_children(child, transitions, transparent ? local : false);
		}
		child = sibling;
	}
}
/**
* @param {Effect} effect
* @param {DocumentFragment} fragment
*/
function move_effect(effect, fragment) {
	if (!effect.nodes) return;
	/** @type {TemplateNode | null} */
	var node = effect.nodes.start;
	var end = effect.nodes.end;
	while (node !== null) {
		/** @type {TemplateNode | null} */
		var next = node === end ? null : /* @__PURE__ */ get_next_sibling(node);
		fragment.append(node);
		node = next;
	}
}
//#endregion
//#region ../../node_modules/.bun/svelte@5.56.5/node_modules/svelte/src/internal/client/runtime.js
/** @import { Derived, Effect, Reaction, Source, Value } from '#client' */
/**
* True if updating in an effect context that is reactive (i.e. not branch/root effects)
*/
var is_updating_effect = false;
var is_destroying_effect = false;
/** @param {boolean} value */
function set_is_destroying_effect(value) {
	is_destroying_effect = value;
}
/** @type {null | Reaction} */
var active_reaction = null;
var untracking = false;
/** @param {null | Reaction} reaction */
function set_active_reaction(reaction) {
	active_reaction = reaction;
}
/** @type {null | Effect} */
var active_effect = null;
/** @param {null | Effect} effect */
function set_active_effect(effect) {
	active_effect = effect;
}
/**
* When sources are created within a reaction, reading and writing
* them within that reaction should not cause a re-run
* @type {null | Set<Source>}
*/
var current_sources = null;
/** @param {Value} value */
function push_reaction_value(value) {
	if (active_reaction !== null && (true)) (current_sources ??= /* @__PURE__ */ new Set()).add(value);
}
/**
* The dependencies of the reaction that is currently being executed. In many cases,
* the dependencies are unchanged between runs, and so this will be `null` unless
* and until a new dependency is accessed — we track this via `skipped_deps`
* @type {null | Value[]}
*/
var new_deps = null;
var skipped_deps = 0;
/**
* Tracks writes that the effect it's executed in doesn't listen to yet,
* so that the dependency can be added to the effect later on if it then reads it
* @type {null | Source[]}
*/
var untracked_writes = null;
/** @param {null | Source[]} value */
function set_untracked_writes(value) {
	untracked_writes = value;
}
/**
* @type {number} Used by sources and deriveds for handling updates.
* Version starts from 1 so that unowned deriveds differentiate between a created effect and a run one for tracing
**/
var write_version = 1;
/** @type {number} Used to version each read of a source of derived to avoid duplicating depedencies inside a reaction */
var read_version = 0;
var update_version = read_version;
/** @param {number} value */
function set_update_version(value) {
	update_version = value;
}
function increment_write_version() {
	return ++write_version;
}
/**
* Determines whether a derived or effect is dirty.
* If it is MAYBE_DIRTY, will set the status to CLEAN
* @param {Reaction} reaction
* @returns {boolean}
*/
function is_dirty(reaction) {
	var flags = reaction.f;
	if ((flags & 2048) !== 0) return true;
	if (flags & 2) reaction.f &= ~WAS_MARKED;
	if ((flags & 4096) !== 0) {
		var dependencies = reaction.deps;
		var length = dependencies.length;
		for (var i = 0; i < length; i++) {
			var dependency = dependencies[i];
			if (is_dirty(dependency)) update_derived(dependency);
			if (dependency.wv > reaction.wv) return true;
		}
		if ((flags & 512) !== 0 && batch_values === null) set_signal_status(reaction, CLEAN);
	}
	return false;
}
/**
* @param {Value} signal
* @param {Effect} effect
* @param {boolean} [root]
*/
function schedule_possible_effect_self_invalidation(signal, effect, root = true) {
	var reactions = signal.reactions;
	if (reactions === null) return;
	if (current_sources !== null && current_sources.has(signal)) return;
	for (var i = 0; i < reactions.length; i++) {
		var reaction = reactions[i];
		if ((reaction.f & 2) !== 0) schedule_possible_effect_self_invalidation(reaction, effect, false);
		else if (effect === reaction) {
			if (root) set_signal_status(reaction, DIRTY);
			else if ((reaction.f & 1024) !== 0) set_signal_status(reaction, MAYBE_DIRTY);
			schedule_effect(reaction);
		}
	}
}
/** @param {Reaction} reaction */
function update_reaction(reaction) {
	var previous_deps = new_deps;
	var previous_skipped_deps = skipped_deps;
	var previous_untracked_writes = untracked_writes;
	var previous_reaction = active_reaction;
	var previous_sources = current_sources;
	var previous_component_context = component_context;
	var previous_untracking = untracking;
	var previous_update_version = update_version;
	var flags = reaction.f;
	new_deps = null;
	skipped_deps = 0;
	untracked_writes = null;
	active_reaction = (flags & 96) === 0 ? reaction : null;
	current_sources = null;
	set_component_context(reaction.ctx);
	untracking = false;
	update_version = ++read_version;
	if (reaction.ac !== null) {
		without_reactive_context(() => {
			/** @type {AbortController} */ reaction.ac.abort(STALE_REACTION);
		});
		reaction.ac = null;
	}
	try {
		reaction.f |= REACTION_IS_UPDATING;
		var fn = reaction.fn;
		var result = fn();
		reaction.f |= REACTION_RAN;
		var deps = reaction.deps;
		var is_fork = current_batch?.is_fork;
		if (new_deps !== null) {
			var i;
			if (!is_fork) remove_reactions(reaction, skipped_deps);
			if (deps !== null && skipped_deps > 0) {
				deps.length = skipped_deps + new_deps.length;
				for (i = 0; i < new_deps.length; i++) deps[skipped_deps + i] = new_deps[i];
			} else reaction.deps = deps = new_deps;
			if (effect_tracking() && (reaction.f & 512) !== 0) for (i = skipped_deps; i < deps.length; i++) (deps[i].reactions ??= []).push(reaction);
		} else if (!is_fork && deps !== null && skipped_deps < deps.length) {
			remove_reactions(reaction, skipped_deps);
			deps.length = skipped_deps;
		}
		if (is_runes() && untracked_writes !== null && !untracking && deps !== null && (reaction.f & 6146) === 0) for (i = 0; i < untracked_writes.length; i++) schedule_possible_effect_self_invalidation(untracked_writes[i], reaction);
		if (previous_reaction !== null && previous_reaction !== reaction) {
			read_version++;
			if (previous_reaction.deps !== null) for (let i = 0; i < previous_skipped_deps; i += 1) previous_reaction.deps[i].rv = read_version;
			if (previous_deps !== null) for (const dep of previous_deps) dep.rv = read_version;
			if (untracked_writes !== null) if (previous_untracked_writes === null) previous_untracked_writes = untracked_writes;
			else previous_untracked_writes.push(...untracked_writes);
		}
		if ((reaction.f & 8388608) !== 0) reaction.f ^= ERROR_VALUE;
		return result;
	} catch (error) {
		return handle_error(error);
	} finally {
		reaction.f ^= REACTION_IS_UPDATING;
		new_deps = previous_deps;
		skipped_deps = previous_skipped_deps;
		untracked_writes = previous_untracked_writes;
		active_reaction = previous_reaction;
		current_sources = previous_sources;
		set_component_context(previous_component_context);
		untracking = previous_untracking;
		update_version = previous_update_version;
	}
}
/**
* @template V
* @param {Reaction} signal
* @param {Value<V>} dependency
* @returns {void}
*/
function remove_reaction(signal, dependency) {
	let reactions = dependency.reactions;
	if (reactions !== null) {
		var index = index_of.call(reactions, signal);
		if (index !== -1) {
			var new_length = reactions.length - 1;
			if (new_length === 0) reactions = dependency.reactions = null;
			else {
				reactions[index] = reactions[new_length];
				reactions.pop();
			}
		}
	}
	if (reactions === null && (dependency.f & 2) !== 0 && (new_deps === null || !includes.call(new_deps, dependency))) {
		var derived = dependency;
		if ((derived.f & 512) !== 0) {
			derived.f ^= 512;
			derived.f &= ~WAS_MARKED;
		}
		if (derived.v !== UNINITIALIZED) update_derived_status(derived);
		if (derived.ac !== null) without_reactive_context(() => {
			/** @type {AbortController} */ derived.ac.abort(STALE_REACTION);
			derived.ac = null;
		});
		freeze_derived_effects(derived);
		remove_reactions(derived, 0);
	}
}
/**
* @param {Reaction} signal
* @param {number} start_index
* @returns {void}
*/
function remove_reactions(signal, start_index) {
	var dependencies = signal.deps;
	if (dependencies === null) return;
	for (var i = start_index; i < dependencies.length; i++) remove_reaction(signal, dependencies[i]);
}
/**
* @param {Effect} effect
* @returns {void}
*/
function update_effect(effect) {
	var flags = effect.f;
	if ((flags & 16384) !== 0) return;
	set_signal_status(effect, CLEAN);
	var previous_effect = active_effect;
	var was_updating_effect = is_updating_effect;
	active_effect = effect;
	is_updating_effect = (flags & 96) === 0;
	try {
		if ((flags & 16777232) !== 0) destroy_block_effect_children(effect);
		else destroy_effect_children(effect);
		execute_effect_teardown(effect);
		var teardown = update_reaction(effect);
		effect.teardown = typeof teardown === "function" ? teardown : null;
		effect.wv = write_version;
	} finally {
		is_updating_effect = was_updating_effect;
		active_effect = previous_effect;
	}
}
/**
* @template V
* @param {Value<V>} signal
* @returns {V}
*/
function get$3(signal) {
	var is_derived = (signal.f & 2) !== 0;
	if (active_reaction !== null && !untracking) {
		if (!(active_effect !== null && (active_effect.f & 16384) !== 0) && (current_sources === null || !current_sources.has(signal))) {
			var deps = active_reaction.deps;
			if ((active_reaction.f & 2097152) !== 0) {
				if (signal.rv < read_version) {
					signal.rv = read_version;
					if (new_deps === null && deps !== null && deps[skipped_deps] === signal) skipped_deps++;
					else if (new_deps === null) new_deps = [signal];
					else new_deps.push(signal);
				}
			} else {
				active_reaction.deps ??= [];
				if (!includes.call(active_reaction.deps, signal)) active_reaction.deps.push(signal);
				var reactions = signal.reactions;
				if (reactions === null) signal.reactions = [active_reaction];
				else if (!includes.call(reactions, active_reaction)) reactions.push(active_reaction);
			}
		}
	}
	if (is_destroying_effect && old_values.has(signal)) return old_values.get(signal);
	if (is_derived) {
		var derived = signal;
		if (is_destroying_effect) {
			var value = derived.v;
			if ((derived.f & 1024) === 0 && derived.reactions !== null || depends_on_old_values(derived)) value = execute_derived(derived);
			old_values.set(derived, value);
			return value;
		}
		var should_connect = (derived.f & 512) === 0 && !untracking && active_reaction !== null && (is_updating_effect || (active_reaction.f & 512) !== 0);
		var is_new = (derived.f & REACTION_RAN) === 0;
		if (is_dirty(derived)) {
			if (should_connect) derived.f |= 512;
			update_derived(derived);
		}
		if (should_connect && !is_new) {
			unfreeze_derived_effects(derived);
			reconnect(derived);
		}
	}
	if (batch_values?.has(signal)) return batch_values.get(signal);
	if ((signal.f & 8388608) !== 0) throw signal.v;
	return signal.v;
}
/**
* (Re)connect a disconnected derived, so that it is notified
* of changes in `mark_reactions`
* @param {Derived} derived
*/
function reconnect(derived) {
	derived.f |= 512;
	if (derived.deps === null) return;
	for (const dep of derived.deps) {
		(dep.reactions ??= []).push(derived);
		if ((dep.f & 2) !== 0 && (dep.f & 512) === 0) {
			unfreeze_derived_effects(dep);
			reconnect(dep);
		}
	}
}
/** @param {Derived} derived */
function depends_on_old_values(derived) {
	if (derived.v === UNINITIALIZED) return true;
	if (derived.deps === null) return false;
	for (const dep of derived.deps) {
		if (old_values.has(dep)) return true;
		if ((dep.f & 2) !== 0 && depends_on_old_values(dep)) return true;
	}
	return false;
}
/**
* When used inside a [`$derived`](https://svelte.dev/docs/svelte/$derived) or [`$effect`](https://svelte.dev/docs/svelte/$effect),
* any state read inside `fn` will not be treated as a dependency.
*
* ```ts
* $effect(() => {
*   // this will run when `data` changes, but not when `time` changes
*   save(data, {
*     timestamp: untrack(() => time)
*   });
* });
* ```
* @template T
* @param {() => T} fn
* @returns {T}
*/
function untrack(fn) {
	var previous_untracking = untracking;
	try {
		untracking = true;
		return fn();
	} finally {
		untracking = previous_untracking;
	}
}
//#endregion
//#region ../../node_modules/.bun/svelte@5.56.5/node_modules/svelte/src/store/utils.js
/** @import { Readable } from './public' */
/**
* @template T
* @param {Readable<T> | null | undefined} store
* @param {(value: T) => void} run
* @param {(value: T) => void} [invalidate]
* @returns {() => void}
*/
function subscribe_to_store(store, run, invalidate) {
	if (store == null) {
		run(void 0);
		if (invalidate) invalidate(void 0);
		return noop$1;
	}
	const unsub = untrack(() => store.subscribe(run, invalidate));
	return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
//#endregion
//#region ../../node_modules/.bun/svelte@5.56.5/node_modules/svelte/src/store/shared/index.js
/** @import { Readable, StartStopNotifier, Subscriber, Unsubscriber, Updater, Writable } from '../public.js' */
/** @import { Stores, StoresValues, SubscribeInvalidateTuple } from '../private.js' */
/**
* @type {Array<SubscribeInvalidateTuple<any> | any>}
*/
var subscriber_queue = [];
/**
* Creates a `Readable` store that allows reading by subscription.
*
* @template T
* @param {T} [value] initial value
* @param {StartStopNotifier<T>} [start]
* @returns {Readable<T>}
*/
function readable(value, start) {
	return { subscribe: writable(value, start).subscribe };
}
/**
* Create a `Writable` store that allows both updating and reading by subscription.
*
* @template T
* @param {T} [value] initial value
* @param {StartStopNotifier<T>} [start]
* @returns {Writable<T>}
*/
function writable(value, start = noop$1) {
	/** @type {Unsubscriber | null} */
	let stop = null;
	/** @type {Set<SubscribeInvalidateTuple<T>>} */
	const subscribers = /* @__PURE__ */ new Set();
	/**
	* @param {T} new_value
	* @returns {void}
	*/
	function set(new_value) {
		if (safe_not_equal(value, new_value)) {
			value = new_value;
			if (stop) {
				const run_queue = !subscriber_queue.length;
				for (const subscriber of subscribers) {
					subscriber[1]();
					subscriber_queue.push(subscriber, value);
				}
				if (run_queue) {
					for (let i = 0; i < subscriber_queue.length; i += 2) subscriber_queue[i][0](subscriber_queue[i + 1]);
					subscriber_queue.length = 0;
				}
			}
		}
	}
	/**
	* @param {Updater<T>} fn
	* @returns {void}
	*/
	function update(fn) {
		set(fn(value));
	}
	/**
	* @param {Subscriber<T>} run
	* @param {() => void} [invalidate]
	* @returns {Unsubscriber}
	*/
	function subscribe(run, invalidate = noop$1) {
		/** @type {SubscribeInvalidateTuple<T>} */
		const subscriber = [run, invalidate];
		subscribers.add(subscriber);
		if (subscribers.size === 1) stop = start(set, update) || noop$1;
		run(value);
		return () => {
			subscribers.delete(subscriber);
			if (subscribers.size === 0 && stop) {
				stop();
				stop = null;
			}
		};
	}
	return {
		set,
		update,
		subscribe
	};
}
/**
* Derived value store by synchronizing one or more readable stores and
* applying an aggregation function over its input values.
*
* @template {Stores} S
* @template T
* @overload
* @param {S} stores
* @param {(values: StoresValues<S>, set: (value: T) => void, update: (fn: Updater<T>) => void) => Unsubscriber | void} fn
* @param {T} [initial_value]
* @returns {Readable<T>}
*/
/**
* Derived value store by synchronizing one or more readable stores and
* applying an aggregation function over its input values.
*
* @template {Stores} S
* @template T
* @overload
* @param {S} stores
* @param {(values: StoresValues<S>) => T} fn
* @param {T} [initial_value]
* @returns {Readable<T>}
*/
/**
* @template {Stores} S
* @template T
* @param {S} stores
* @param {Function} fn
* @param {T} [initial_value]
* @returns {Readable<T>}
*/
function derived$1(stores, fn, initial_value) {
	const single = !Array.isArray(stores);
	/** @type {Array<Readable<any>>} */
	const stores_array = single ? [stores] : stores;
	if (!stores_array.every(Boolean)) throw new Error("derived() expects stores as input, got a falsy value");
	const auto = fn.length < 2;
	return readable(initial_value, (set, update) => {
		let started = false;
		/** @type {T[]} */
		const values = [];
		let pending = 0;
		let cleanup = noop$1;
		const sync = () => {
			if (pending) return;
			cleanup();
			const result = fn(single ? values[0] : values, set, update);
			if (auto) set(result);
			else cleanup = typeof result === "function" ? result : noop$1;
		};
		const unsubscribers = stores_array.map((store, i) => subscribe_to_store(store, (value) => {
			values[i] = value;
			pending &= ~(1 << i);
			if (started) sync();
		}, () => {
			pending |= 1 << i;
		}));
		started = true;
		sync();
		return function stop() {
			run_all(unsubscribers);
			cleanup();
			started = false;
		};
	});
}
/**
* Get the current value from a store by subscribing and immediately unsubscribing.
*
* @template T
* @param {Readable<T>} store
* @returns {T}
*/
function get$2(store) {
	let value;
	subscribe_to_store(store, (_) => value = _)();
	return value;
}
//#endregion
//#region ../../node_modules/.bun/svelte@5.56.5/node_modules/svelte/src/internal/client/dom/elements/events.js
/**
* Used on elements, as a map of event type -> event handler,
* and on events themselves to track which element handled an event
*/
var event_symbol = Symbol("events");
/** @type {Set<string>} */
var all_registered_events = /* @__PURE__ */ new Set();
/** @type {Set<(events: Array<string>) => void>} */
var root_event_handles = /* @__PURE__ */ new Set();
/**
* @param {string} event_name
* @param {EventTarget} dom
* @param {EventListener} [handler]
* @param {AddEventListenerOptions} [options]
*/
function create_event(event_name, dom, handler, options = {}) {
	/**
	* @this {EventTarget}
	*/
	function target_handler(event) {
		if (!options.capture) handle_event_propagation.call(dom, event);
		if (!event.cancelBubble) return without_reactive_context(() => {
			return handler?.call(this, event);
		});
	}
	if (event_name.startsWith("pointer") || event_name.startsWith("touch") || event_name === "wheel") queue_micro_task(() => {
		dom.addEventListener(event_name, target_handler, options);
	});
	else dom.addEventListener(event_name, target_handler, options);
	return target_handler;
}
/**
* Attaches an event handler to an element and returns a function that removes the handler. Using this
* rather than `addEventListener` will preserve the correct order relative to handlers added declaratively
* (with attributes like `onclick`), which use event delegation for performance reasons
*
* @param {EventTarget} element
* @param {string} type
* @param {EventListener} handler
* @param {AddEventListenerOptions} [options]
*/
function on(element, type, handler, options = {}) {
	var target_handler = create_event(type, element, handler, options);
	return () => {
		element.removeEventListener(type, target_handler, options);
	};
}
var last_propagated_event = null;
/**
* @this {EventTarget}
* @param {Event} event
* @returns {void}
*/
function handle_event_propagation(event) {
	var handler_element = this;
	var owner_document = handler_element.ownerDocument;
	var event_name = event.type;
	var path = event.composedPath?.() || [];
	var current_target = path[0] || event.target;
	last_propagated_event = event;
	var path_idx = 0;
	var handled_at = last_propagated_event === event && event[event_symbol];
	if (handled_at) {
		var at_idx = path.indexOf(handled_at);
		if (at_idx !== -1 && (handler_element === document || handler_element === window)) {
			event[event_symbol] = handler_element;
			return;
		}
		var handler_idx = path.indexOf(handler_element);
		if (handler_idx === -1) return;
		if (at_idx <= handler_idx) path_idx = at_idx;
	}
	current_target = path[path_idx] || event.target;
	if (current_target === handler_element) return;
	define_property(event, "currentTarget", {
		configurable: true,
		get() {
			return current_target || owner_document;
		}
	});
	var previous_reaction = active_reaction;
	var previous_effect = active_effect;
	set_active_reaction(null);
	set_active_effect(null);
	try {
		/**
		* @type {unknown}
		*/
		var throw_error;
		/**
		* @type {unknown[]}
		*/
		var other_errors = [];
		while (current_target !== null) {
			if (current_target === handler_element) break;
			try {
				var delegated = current_target[event_symbol]?.[event_name];
				if (delegated != null && (!current_target.disabled || event.target === current_target)) delegated.call(current_target, event);
			} catch (error) {
				if (throw_error) other_errors.push(error);
				else throw_error = error;
			}
			if (event.cancelBubble) break;
			path_idx++;
			current_target = path_idx < path.length ? path[path_idx] : null;
		}
		if (throw_error) {
			for (let error of other_errors) queueMicrotask(() => {
				throw error;
			});
			throw throw_error;
		}
	} finally {
		event[event_symbol] = handler_element;
		delete event.currentTarget;
		set_active_reaction(previous_reaction);
		set_active_effect(previous_effect);
	}
}
//#endregion
//#region ../../node_modules/.bun/svelte@5.56.5/node_modules/svelte/src/internal/client/dom/template.js
/** @import { Effect, EffectNodes, TemplateNode } from '#client' */
/** @import { TemplateStructure } from './types' */
/**
* @param {TemplateNode} start
* @param {TemplateNode | null} end
*/
function assign_nodes(start, end) {
	var effect = active_effect;
	if (effect.nodes === null) effect.nodes = {
		start,
		end,
		a: null,
		t: null
	};
}
var VOID_ELEMENT_NAMES = [
	"area",
	"base",
	"br",
	"col",
	"command",
	"embed",
	"hr",
	"img",
	"input",
	"keygen",
	"link",
	"meta",
	"param",
	"source",
	"track",
	"wbr"
];
/**
* Returns `true` if `name` is of a void element
* @param {string} name
*/
function is_void(name) {
	return VOID_ELEMENT_NAMES.includes(name) || name.toLowerCase() === "!doctype";
}
/**
* Attributes that are boolean, i.e. they are present or not present.
*/
var DOM_BOOLEAN_ATTRIBUTES = [
	"allowfullscreen",
	"async",
	"autofocus",
	"autoplay",
	"checked",
	"controls",
	"default",
	"disabled",
	"formnovalidate",
	"indeterminate",
	"inert",
	"ismap",
	"loop",
	"multiple",
	"muted",
	"nomodule",
	"novalidate",
	"open",
	"playsinline",
	"readonly",
	"required",
	"reversed",
	"seamless",
	"selected",
	"webkitdirectory",
	"defer",
	"disablepictureinpicture",
	"disableremoteplayback"
];
/**
* Returns `true` if `name` is a boolean attribute
* @param {string} name
*/
function is_boolean_attribute(name) {
	return DOM_BOOLEAN_ATTRIBUTES.includes(name);
}
/**
* Subset of delegated events which should be passive by default.
* These two are already passive via browser defaults on window, document and body.
* But since
* - we're delegating them
* - they happen often
* - they apply to mobile which is generally less performant
* we're marking them as passive by default for other elements, too.
*/
var PASSIVE_EVENTS = ["touchstart", "touchmove"];
/**
* Returns `true` if `name` is a passive event
* @param {string} name
*/
function is_passive_event(name) {
	return PASSIVE_EVENTS.includes(name);
}
/** List of elements that require raw contents and should not have SSR comments put in them */
var RAW_TEXT_ELEMENTS = [
	"textarea",
	"script",
	"style",
	"title"
];
/** @param {string} name */
function is_raw_text_element(name) {
	return RAW_TEXT_ELEMENTS.includes(name);
}
var REGEX_VALID_TAG_NAME = /^[a-zA-Z][a-zA-Z0-9]*(-[a-zA-Z0-9.\-_\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u{10000}-\u{EFFFF}]*)?$/u;
/**
* Mounts a component to the given target and returns the exports and potentially the props (if compiled with `accessors: true`) of the component.
* Transitions will play during the initial render unless the `intro` option is set to `false`.
*
* @template {Record<string, any>} Props
* @template {Record<string, any>} Exports
* @param {ComponentType<SvelteComponent<Props>> | Component<Props, Exports, any>} component
* @param {MountOptions<Props>} options
* @returns {Exports}
*/
function mount$1(component, options) {
	return _mount(component, options);
}
/**
* Hydrates a component on the given target and returns the exports and potentially the props (if compiled with `accessors: true`) of the component
*
* @template {Record<string, any>} Props
* @template {Record<string, any>} Exports
* @param {ComponentType<SvelteComponent<Props>> | Component<Props, Exports, any>} component
* @param {{} extends Props ? {
* 		target: Document | Element | ShadowRoot;
* 		props?: Props;
* 		events?: Record<string, (e: any) => any>;
*  	context?: Map<any, any>;
* 		intro?: boolean;
* 		recover?: boolean;
*		transformError?: (error: unknown) => unknown;
* 	} : {
* 		target: Document | Element | ShadowRoot;
* 		props: Props;
* 		events?: Record<string, (e: any) => any>;
*  	context?: Map<any, any>;
* 		intro?: boolean;
* 		recover?: boolean;
*		transformError?: (error: unknown) => unknown;
* 	}} options
* @returns {Exports}
*/
function hydrate$1(component, options) {
	init_operations();
	options.intro = options.intro ?? false;
	const target = options.target;
	const was_hydrating = hydrating;
	const previous_hydrate_node = hydrate_node;
	try {
		var anchor = /* @__PURE__ */ get_first_child(target);
		while (anchor && (anchor.nodeType !== 8 || anchor.data !== "[")) anchor = /* @__PURE__ */ get_next_sibling(anchor);
		if (!anchor) throw HYDRATION_ERROR;
		set_hydrating(true);
		set_hydrate_node(anchor);
		const instance = _mount(component, {
			...options,
			anchor
		});
		set_hydrating(false);
		return instance;
	} catch (error) {
		if (error instanceof Error && error.message.split("\n").some((line) => line.startsWith("https://svelte.dev/e/"))) throw error;
		if (error !== HYDRATION_ERROR) console.warn("Failed to hydrate: ", error);
		if (options.recover === false) hydration_failed();
		init_operations();
		clear_text_content(target);
		set_hydrating(false);
		return mount$1(component, options);
	} finally {
		set_hydrating(was_hydrating);
		set_hydrate_node(previous_hydrate_node);
	}
}
/** @type {Map<EventTarget, Map<string, number>>} */
var listeners = /* @__PURE__ */ new Map();
/**
* @template {Record<string, any>} Exports
* @param {ComponentType<SvelteComponent<any>> | Component<any>} Component
* @param {MountOptions} options
* @returns {Exports}
*/
function _mount(Component, { target, anchor, props = {}, events, context, intro = true, transformError }) {
	init_operations();
	/** @type {Exports} */
	var component = void 0;
	var unmount = component_root(() => {
		var anchor_node = anchor ?? target.appendChild(create_text());
		boundary(anchor_node, { pending: () => {} }, (anchor_node) => {
			push$1({});
			var ctx = component_context;
			if (context) ctx.c = context;
			if (events)
 /** @type {any} */ props.$$events = events;
			if (hydrating) assign_nodes(anchor_node, null);
			component = Component(anchor_node, props) || {};
			if (hydrating) {
				/** @type {Effect & { nodes: EffectNodes }} */ active_effect.nodes.end = hydrate_node;
				if (hydrate_node === null || hydrate_node.nodeType !== 8 || hydrate_node.data !== "]") {
					hydration_mismatch();
					throw HYDRATION_ERROR;
				}
			}
			pop$1();
		}, transformError);
		/** @type {Set<string>} */
		var registered_events = /* @__PURE__ */ new Set();
		/** @param {Array<string>} events */
		var event_handle = (events) => {
			for (var i = 0; i < events.length; i++) {
				var event_name = events[i];
				if (registered_events.has(event_name)) continue;
				registered_events.add(event_name);
				var passive = is_passive_event(event_name);
				for (const node of [target, document]) {
					var counts = listeners.get(node);
					if (counts === void 0) {
						counts = /* @__PURE__ */ new Map();
						listeners.set(node, counts);
					}
					var count = counts.get(event_name);
					if (count === void 0) {
						node.addEventListener(event_name, handle_event_propagation, { passive });
						counts.set(event_name, 1);
					} else counts.set(event_name, count + 1);
				}
			}
		};
		event_handle(array_from(all_registered_events));
		root_event_handles.add(event_handle);
		return () => {
			for (var event_name of registered_events) for (const node of [target, document]) {
				var counts = listeners.get(node);
				var count = counts.get(event_name);
				if (--count == 0) {
					node.removeEventListener(event_name, handle_event_propagation);
					counts.delete(event_name);
					if (counts.size === 0) listeners.delete(node);
				} else counts.set(event_name, count);
			}
			root_event_handles.delete(event_handle);
			if (anchor_node !== anchor) anchor_node.parentNode?.removeChild(anchor_node);
		};
	});
	mounted_components.set(component, unmount);
	return component;
}
/**
* References of the components that were mounted or hydrated.
* Uses a `WeakMap` to avoid memory leaks.
*/
var mounted_components = /* @__PURE__ */ new WeakMap();
/**
* Unmounts a component that was previously mounted using `mount` or `hydrate`.
*
* Since 5.13.0, if `options.outro` is `true`, [transitions](https://svelte.dev/docs/svelte/transition) will play before the component is removed from the DOM.
*
* Returns a `Promise` that resolves after transitions have completed if `options.outro` is true, or immediately otherwise (prior to 5.13.0, returns `void`).
*
* ```js
* import { mount, unmount } from 'svelte';
* import App from './App.svelte';
*
* const app = mount(App, { target: document.body });
*
* // later...
* unmount(app, { outro: true });
* ```
* @param {Record<string, any>} component
* @param {{ outro?: boolean }} [options]
* @returns {Promise<void>}
*/
function unmount$1(component, options) {
	const fn = mounted_components.get(component);
	if (fn) {
		mounted_components.delete(component);
		return fn(options);
	}
	return Promise.resolve();
}
/**
* Takes the component function and returns a Svelte 4 compatible component constructor.
*
* @deprecated Use this only as a temporary solution to migrate your imperative component code to Svelte 5.
*
* @template {Record<string, any>} Props
* @template {Record<string, any>} Exports
* @template {Record<string, any>} Events
* @template {Record<string, any>} Slots
*
* @param {SvelteComponent<Props, Events, Slots> | Component<Props>} component
* @returns {ComponentType<SvelteComponent<Props, Events, Slots> & Exports>}
*/
function asClassComponent$1(component) {
	return class extends Svelte4Component {
		/** @param {any} options */
		constructor(options) {
			super({
				component,
				...options
			});
		}
	};
}
/**
* Support using the component as both a class and function during the transition period
* @typedef  {{new (o: ComponentConstructorOptions): SvelteComponent;(...args: Parameters<Component<Record<string, any>>>): ReturnType<Component<Record<string, any>, Record<string, any>>>;}} LegacyComponentType
*/
var Svelte4Component = class {
	/** @type {any} */
	#events;
	/** @type {Record<string, any>} */
	#instance;
	/**
	* @param {ComponentConstructorOptions & {
	*  component: any;
	* }} options
	*/
	constructor(options) {
		var sources = /* @__PURE__ */ new Map();
		/**
		* @param {string | symbol} key
		* @param {unknown} value
		*/
		var add_source = (key, value) => {
			var s = /* @__PURE__ */ mutable_source(value, false, false);
			sources.set(key, s);
			return s;
		};
		const props = new Proxy({
			...options.props || {},
			$$events: {}
		}, {
			get(target, prop) {
				return get$3(sources.get(prop) ?? add_source(prop, Reflect.get(target, prop)));
			},
			has(target, prop) {
				if (prop === LEGACY_PROPS) return true;
				get$3(sources.get(prop) ?? add_source(prop, Reflect.get(target, prop)));
				return Reflect.has(target, prop);
			},
			set(target, prop, value) {
				set(sources.get(prop) ?? add_source(prop, value), value);
				return Reflect.set(target, prop, value);
			}
		});
		this.#instance = (options.hydrate ? hydrate$1 : mount$1)(options.component, {
			target: options.target,
			anchor: options.anchor,
			props,
			context: options.context,
			intro: options.intro ?? false,
			recover: options.recover,
			transformError: options.transformError
		});
		if ((!options?.props?.$$host || options.sync === false)) flushSync();
		this.#events = props.$$events;
		for (const key of Object.keys(this.#instance)) {
			if (key === "$set" || key === "$destroy" || key === "$on") continue;
			define_property(this, key, {
				get() {
					return this.#instance[key];
				},
				/** @param {any} value */
				set(value) {
					this.#instance[key] = value;
				},
				enumerable: true
			});
		}
		this.#instance.$set = (next) => {
			Object.assign(props, next);
		};
		this.#instance.$destroy = () => {
			unmount$1(this.#instance);
		};
	}
	/** @param {Record<string, any>} props */
	$set(props) {
		this.#instance.$set(props);
	}
	/**
	* @param {string} event
	* @param {(...args: any[]) => any} callback
	* @returns {any}
	*/
	$on(event, callback) {
		this.#events[event] = this.#events[event] || [];
		/** @param {any[]} args */
		const cb = (...args) => callback.call(this, ...args);
		this.#events[event].push(cb);
		return () => {
			this.#events[event] = this.#events[event].filter(
				/** @param {any} fn */
				(fn) => fn !== cb
			);
		};
	}
	$destroy() {
		this.#instance.$destroy();
	}
};
//#endregion
//#region ../../node_modules/.bun/svelte@5.56.5/node_modules/svelte/src/escaping.js
var ATTR_REGEX = /[&"<]/g;
var CONTENT_REGEX = /[&<]/g;
/**
* @template V
* @param {V} value
* @param {boolean} [is_attr]
*/
function escape_html$1(value, is_attr) {
	const str = String(value ?? "");
	const pattern = is_attr ? ATTR_REGEX : CONTENT_REGEX;
	pattern.lastIndex = 0;
	let escaped = "";
	let last = 0;
	while (pattern.test(str)) {
		const i = pattern.lastIndex - 1;
		const ch = str[i];
		escaped += str.substring(last, i) + (ch === "&" ? "&amp;" : ch === "\"" ? "&quot;" : "&lt;");
		last = i + 1;
	}
	return escaped + str.substring(last);
}
//#endregion
//#region ../../node_modules/.bun/svelte@5.56.5/node_modules/svelte/src/internal/shared/attributes.js
/**
* `<div translate={false}>` should be rendered as `<div translate="no">` and _not_
* `<div translate="false">`, which is equivalent to `<div translate="yes">`. There
* may be other odd cases that need to be added to this list in future
* @type {Record<string, Map<any, string>>}
*/
var replacements$1 = { translate: /* @__PURE__ */ new Map([[true, "yes"], [false, "no"]]) };
/**
* @template V
* @param {string} name
* @param {V} value
* @param {boolean} [is_boolean]
* @returns {string}
*/
function attr(name, value, is_boolean = false) {
	if (name === "hidden" && value !== "until-found") is_boolean = true;
	if (value == null || !value && is_boolean) return "";
	const normalized = has_own_property.call(replacements$1, name) && replacements$1[name].get(value) || value;
	return ` ${name}${is_boolean ? `=""` : `="${escape_html$1(normalized, true)}"`}`;
}
/**
* Small wrapper around clsx to preserve Svelte's (weird) handling of falsy values.
* TODO Svelte 6 revisit this, and likely turn all falsy values into the empty string (what clsx also does)
* @param  {any} value
*/
function clsx$1(value) {
	if (typeof value === "object") return clsx(value);
	else return value ?? "";
}
var whitespace = [..." 	\n\r\f\xA0\v﻿"];
/**
* @param {any} value
* @param {string | null} [hash]
* @param {Record<string, boolean>} [directives]
* @returns {string | null}
*/
function to_class(value, hash, directives) {
	var classname = value == null ? "" : "" + value;
	if (hash) classname = classname ? classname + " " + hash : hash;
	if (directives) {
		for (var key of Object.keys(directives)) if (directives[key]) classname = classname ? classname + " " + key : key;
		else if (classname.length) {
			var len = key.length;
			var a = 0;
			while ((a = classname.indexOf(key, a)) >= 0) {
				var b = a + len;
				if ((a === 0 || whitespace.includes(classname[a - 1])) && (b === classname.length || whitespace.includes(classname[b]))) classname = (a === 0 ? "" : classname.substring(0, a)) + classname.substring(b + 1);
				else a = b;
			}
		}
	}
	return classname === "" ? null : classname;
}
/**
*
* @param {Record<string,any>} styles
* @param {boolean} important
*/
function append_styles(styles, important = false) {
	var separator = important ? " !important;" : ";";
	var css = "";
	for (var key of Object.keys(styles)) {
		var value = styles[key];
		if (value != null && value !== "") css += " " + key + ": " + value + separator;
	}
	return css;
}
/**
* @param {string} name
* @returns {string}
*/
function to_css_name(name) {
	if (name[0] !== "-" || name[1] !== "-") return name.toLowerCase();
	return name;
}
/**
* @param {any} value
* @param {Record<string, any> | [Record<string, any>, Record<string, any>]} [styles]
* @returns {string | null}
*/
function to_style(value, styles) {
	if (styles) {
		var new_style = "";
		/** @type {Record<string,any> | undefined} */
		var normal_styles;
		/** @type {Record<string,any> | undefined} */
		var important_styles;
		if (Array.isArray(styles)) {
			normal_styles = styles[0];
			important_styles = styles[1];
		} else normal_styles = styles;
		if (value) {
			value = String(value).replaceAll(/\s*\/\*.*?\*\/\s*/g, "").trim();
			/** @type {boolean | '"' | "'"} */
			var in_str = false;
			var in_apo = 0;
			var in_comment = false;
			var reserved_names = [];
			if (normal_styles) reserved_names.push(...Object.keys(normal_styles).map(to_css_name));
			if (important_styles) reserved_names.push(...Object.keys(important_styles).map(to_css_name));
			var start_index = 0;
			var name_index = -1;
			const len = value.length;
			for (var i = 0; i < len; i++) {
				var c = value[i];
				if (in_comment) {
					if (c === "/" && value[i - 1] === "*") in_comment = false;
				} else if (in_str) {
					if (in_str === c) in_str = false;
				} else if (c === "/" && value[i + 1] === "*") in_comment = true;
				else if (c === "\"" || c === "'") in_str = c;
				else if (c === "(") in_apo++;
				else if (c === ")") in_apo--;
				if (!in_comment && in_str === false && in_apo === 0) {
					if (c === ":" && name_index === -1) name_index = i;
					else if (c === ";" || i === len - 1) {
						if (name_index !== -1) {
							var name = to_css_name(value.substring(start_index, name_index).trim());
							if (!reserved_names.includes(name)) {
								if (c !== ";") i++;
								var property = value.substring(start_index, i).trim();
								new_style += " " + property + ";";
							}
						}
						start_index = i + 1;
						name_index = -1;
					}
				}
			}
		}
		if (normal_styles) new_style += append_styles(normal_styles);
		if (important_styles) new_style += append_styles(important_styles, true);
		new_style = new_style.trim();
		return new_style === "" ? null : new_style;
	}
	return value == null ? null : String(value);
}
//#endregion
//#region ../../node_modules/.bun/svelte@5.56.5/node_modules/svelte/src/internal/server/hydration.js
var BLOCK_OPEN = `<!--[-->`;
var BLOCK_CLOSE = `<!--]-->`;
var EMPTY_COMMENT = `<!---->`;
//#endregion
//#region ../../node_modules/.bun/svelte@5.56.5/node_modules/svelte/src/internal/server/abort-signal.js
/** @type {AbortController | null} */
var controller = null;
function abort() {
	controller?.abort(STALE_REACTION);
	controller = null;
}
function getAbortSignal() {
	return (controller ??= new AbortController()).signal;
}
/**
* Encountered asynchronous work while rendering synchronously.
* @returns {never}
*/
function await_invalid() {
	const error = /* @__PURE__ */ new Error(`await_invalid\nEncountered asynchronous work while rendering synchronously.\nhttps://svelte.dev/e/await_invalid`);
	error.name = "Svelte error";
	throw error;
}
/**
* `<svelte:element this="%tag%">` is not a valid element name — the element will not be rendered
* @param {string} tag
* @returns {never}
*/
function dynamic_element_invalid_tag(tag) {
	const error = /* @__PURE__ */ new Error(`dynamic_element_invalid_tag\n\`<svelte:element this="${tag}">\` is not a valid element name — the element will not be rendered\nhttps://svelte.dev/e/dynamic_element_invalid_tag`);
	error.name = "Svelte error";
	throw error;
}
/**
* Failed to serialize `hydratable` data for key `%key%`.
* 
* `hydratable` can serialize anything [`uneval` from `devalue`](https://npmjs.com/package/uneval) can, plus Promises.
* 
* Cause:
* %stack%
* @param {string} key
* @param {string} stack
* @returns {never}
*/
function hydratable_serialization_failed(key, stack) {
	const error = /* @__PURE__ */ new Error(`hydratable_serialization_failed\nFailed to serialize \`hydratable\` data for key \`${key}\`.

\`hydratable\` can serialize anything [\`uneval\` from \`devalue\`](https://npmjs.com/package/uneval) can, plus Promises.

Cause:
${stack}\nhttps://svelte.dev/e/hydratable_serialization_failed`);
	error.name = "Svelte error";
	throw error;
}
/**
* `csp.nonce` was set while `csp.hash` was `true`. These options cannot be used simultaneously.
* @returns {never}
*/
function invalid_csp() {
	const error = /* @__PURE__ */ new Error(`invalid_csp\n\`csp.nonce\` was set while \`csp.hash\` was \`true\`. These options cannot be used simultaneously.\nhttps://svelte.dev/e/invalid_csp`);
	error.name = "Svelte error";
	throw error;
}
/**
* The `idPrefix` option cannot include `--`.
* @returns {never}
*/
function invalid_id_prefix() {
	const error = /* @__PURE__ */ new Error(`invalid_id_prefix\nThe \`idPrefix\` option cannot include \`--\`.\nhttps://svelte.dev/e/invalid_id_prefix`);
	error.name = "Svelte error";
	throw error;
}
/**
* `%name%(...)` is not available on the server
* @param {string} name
* @returns {never}
*/
function lifecycle_function_unavailable(name) {
	const error = /* @__PURE__ */ new Error(`lifecycle_function_unavailable\n\`${name}(...)\` is not available on the server\nhttps://svelte.dev/e/lifecycle_function_unavailable`);
	error.name = "Svelte error";
	throw error;
}
/**
* Could not resolve `render` context.
* @returns {never}
*/
function server_context_required() {
	const error = /* @__PURE__ */ new Error(`server_context_required\nCould not resolve \`render\` context.\nhttps://svelte.dev/e/server_context_required`);
	error.name = "Svelte error";
	throw error;
}
//#endregion
//#region ../../node_modules/.bun/svelte@5.56.5/node_modules/svelte/src/internal/server/context.js
/** @import { SSRContext } from '#server' */
/** @type {SSRContext | null} */
var ssr_context = null;
/** @param {SSRContext | null} v */
function set_ssr_context(v) {
	ssr_context = v;
}
/**
* @template T
* @returns {[() => T, (context: T) => T]}
* @since 5.40.0
*/
function createContext() {
	const key = {};
	return [() => {
		if (!hasContext(key)) missing_context();
		return getContext(key);
	}, (context) => setContext(key, context)];
}
/**
* @template T
* @param {any} key
* @returns {T}
*/
function getContext(key) {
	return get_or_init_context_map().get(key);
}
/**
* @template T
* @param {any} key
* @param {T} context
* @returns {T}
*/
function setContext(key, context) {
	get_or_init_context_map().set(key, context);
	return context;
}
/**
* @param {any} key
* @returns {boolean}
*/
function hasContext(key) {
	return get_or_init_context_map().has(key);
}
/** @returns {Map<any, any>} */
function getAllContexts() {
	return get_or_init_context_map();
}
/**
* @param {string} name
* @returns {Map<unknown, unknown>}
*/
function get_or_init_context_map(name) {
	if (ssr_context === null) lifecycle_outside_component();
	return ssr_context.c ??= new Map(get_parent_context(ssr_context) || void 0);
}
/**
* @param {Function} [fn]
*/
function push(fn) {
	ssr_context = {
		p: ssr_context,
		c: null,
		r: null
	};
}
function pop() {
	ssr_context = ssr_context.p;
}
/**
* @param {SSRContext} ssr_context
* @returns {Map<unknown, unknown> | null}
*/
function get_parent_context(ssr_context) {
	let parent = ssr_context.p;
	while (parent !== null) {
		const context_map = parent.c;
		if (context_map !== null) return context_map;
		parent = parent.p;
	}
	return null;
}
/**
* A `hydratable` value with key `%key%` was created, but at least part of it was not used during the render.
* 
* The `hydratable` was initialized in:
* %stack%
* @param {string} key
* @param {string} stack
*/
function unresolved_hydratable(key, stack) {
	console.warn(`https://svelte.dev/e/unresolved_hydratable`);
}
/** @returns {RenderContext} */
function get_render_context() {
	const store = als$1?.getStore();
	server_context_required();
	return store;
}
/** @type {AsyncLocalStorage<RenderContext | null> | null} */
var als$1 = null;
//#endregion
//#region ../../node_modules/.bun/svelte@5.56.5/node_modules/svelte/src/internal/server/crypto.js
var text_encoder$1;
var crypto$1;
/** @param {string} module_name */
var obfuscated_import = (module_name) => import(
	/* @vite-ignore */
	module_name
);
/** @param {string} data */
async function sha256$1(data) {
	text_encoder$1 ??= new TextEncoder();
	crypto$1 ??= globalThis.crypto?.subtle?.digest ? globalThis.crypto : (await obfuscated_import("node:crypto")).webcrypto;
	return base64_encode$1(await crypto$1.subtle.digest("SHA-256", text_encoder$1.encode(data)));
}
/**
* @param {Uint8Array} bytes
* @returns {string}
*/
function base64_encode$1(bytes) {
	if (globalThis.Buffer) return globalThis.Buffer.from(bytes).toString("base64");
	let binary = "";
	for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
	return btoa(binary);
}
//#endregion
//#region ../../node_modules/.bun/svelte@5.56.5/node_modules/svelte/src/internal/server/renderer.js
/** @import { Component } from 'svelte' */
/** @import { Csp, HydratableContext, RenderOutput, SSRContext, SyncRenderOutput, Sha256Source } from './types.js' */
/** @import { MaybePromise } from '#shared' */
/** @typedef {'head' | 'body'} RendererType */
/** @typedef {{ [key in RendererType]: string }} AccumulatedContent */
/**
* @typedef {string | Renderer} RendererItem
*/
/**
* Renderers are basically a tree of `string | Renderer`s, where each `Renderer` in the tree represents
* work that may or may not have completed. A renderer can be {@link collect}ed to aggregate the
* content from itself and all of its children, but this will throw if any of the children are
* performing asynchronous work. To asynchronously collect a renderer, just `await` it.
*
* The `string` values within a renderer are always associated with the {@link type} of that renderer. To switch types,
* call {@link child} with a different `type` argument.
*/
var Renderer = class Renderer {
	/**
	* The contents of the renderer.
	* @type {RendererItem[]}
	*/
	#out = [];
	/**
	* Any `onDestroy` callbacks registered during execution of this renderer.
	* @type {(() => void)[] | undefined}
	*/
	#on_destroy = void 0;
	/**
	* Whether this renderer is a component body.
	* @type {boolean}
	*/
	#is_component_body = false;
	/**
	* If set, this renderer is an error boundary. When async collection
	* of the children fails, the failed snippet is rendered instead.
	* @type {{
	* 	failed: (renderer: Renderer, error: unknown, reset: () => void) => void;
	* 	transformError: (error: unknown) => unknown;
	* 	context: SSRContext | null;
	* } | null}
	*/
	#boundary = null;
	/**
	* The type of string content that this renderer is accumulating.
	* @type {RendererType}
	*/
	type;
	/** @type {Renderer | undefined} */
	#parent;
	/**
	* Asynchronous work associated with this renderer
	* @type {Promise<void> | undefined}
	*/
	promise = void 0;
	/**
	* State which is associated with the content tree as a whole.
	* It will be re-exposed, uncopied, on all children.
	* @type {SSRState}
	* @readonly
	*/
	global;
	/**
	* State that is local to the branch it is declared in.
	* It will be shallow-copied to all children.
	*
	* @type {{ select_value: string | undefined }}
	*/
	local;
	/**
	* @param {SSRState} global
	* @param {Renderer | undefined} [parent]
	*/
	constructor(global, parent) {
		this.#parent = parent;
		this.global = global;
		this.local = parent ? { ...parent.local } : { select_value: void 0 };
		this.type = parent ? parent.type : "body";
	}
	/**
	* @param {(renderer: Renderer) => void} fn
	*/
	head(fn) {
		const head = new Renderer(this.global, this);
		head.type = "head";
		this.#out.push(head);
		head.child(fn);
	}
	/**
	* @param {Array<Promise<void>>} blockers
	* @param {(renderer: Renderer) => void} fn
	*/
	async_block(blockers, fn) {
		this.#out.push(BLOCK_OPEN);
		this.async(blockers, fn);
		this.#out.push(BLOCK_CLOSE);
	}
	/**
	* @param {Array<Promise<void>>} blockers
	* @param {(renderer: Renderer) => void} fn
	*/
	async(blockers, fn) {
		let callback = fn;
		if (blockers.length > 0) {
			const context = ssr_context;
			callback = (renderer) => {
				return Promise.all(blockers).then(() => {
					const previous_context = ssr_context;
					try {
						set_ssr_context(context);
						return fn(renderer);
					} finally {
						set_ssr_context(previous_context);
					}
				});
			};
		}
		this.child(callback);
	}
	/**
	* @param {Array<() => void>} thunks
	*/
	run(thunks) {
		const context = ssr_context;
		let promise = Promise.resolve(thunks[0]());
		const promises = [promise];
		for (const fn of thunks.slice(1)) {
			promise = promise.then(() => {
				const previous_context = ssr_context;
				set_ssr_context(context);
				try {
					return fn();
				} finally {
					set_ssr_context(previous_context);
				}
			});
			promises.push(promise);
		}
		promise.catch(noop$1);
		this.promise = promise;
		return promises;
	}
	/**
	* @param {(renderer: Renderer) => MaybePromise<void>} fn
	*/
	child_block(fn) {
		this.#out.push(BLOCK_OPEN);
		this.child(fn);
		this.#out.push(BLOCK_CLOSE);
	}
	/**
	* Create a child renderer. The child renderer inherits the state from the parent,
	* but has its own content.
	* @param {(renderer: Renderer) => MaybePromise<void>} fn
	*/
	child(fn) {
		const child = new Renderer(this.global, this);
		this.#out.push(child);
		const parent = ssr_context;
		set_ssr_context({
			...ssr_context,
			p: parent,
			c: null,
			r: child
		});
		const result = fn(child);
		set_ssr_context(parent);
		if (result instanceof Promise) {
			result.catch(noop$1);
			result.finally(() => set_ssr_context(null)).catch(noop$1);
			if (child.global.mode === "sync") await_invalid();
			child.promise = result;
		}
		return child;
	}
	/**
	* Render children inside an error boundary. If the children throw and the API-level
	* `transformError` transform handles the error (doesn't re-throw), the `failed` snippet is
	* rendered instead. Otherwise the error propagates.
	*
	* @param {{ failed?: (renderer: Renderer, error: unknown, reset: () => void) => void }} props
	* @param {(renderer: Renderer) => MaybePromise<void>} children_fn
	*/
	boundary(props, children_fn) {
		const child = new Renderer(this.global, this);
		this.#out.push(child);
		const parent_context = ssr_context;
		if (props.failed) child.#boundary = {
			failed: props.failed,
			transformError: this.global.transformError,
			context: parent_context
		};
		set_ssr_context({
			...ssr_context,
			p: parent_context,
			c: null,
			r: child
		});
		try {
			const result = children_fn(child);
			set_ssr_context(parent_context);
			if (result instanceof Promise) {
				if (child.global.mode === "sync") await_invalid();
				result.catch(noop$1);
				child.promise = result;
			}
		} catch (error) {
			set_ssr_context(parent_context);
			const failed_snippet = props.failed;
			if (!failed_snippet) throw error;
			const result = this.global.transformError(error);
			child.#out.length = 0;
			child.#boundary = null;
			if (result instanceof Promise) {
				if (this.global.mode === "sync") await_invalid();
				child.promise = result.then((transformed) => {
					set_ssr_context(parent_context);
					child.#out.push(Renderer.#serialize_failed_boundary(transformed));
					failed_snippet(child, transformed, noop$1);
					child.#out.push(BLOCK_CLOSE);
				});
				child.promise.catch(noop$1);
			} else {
				child.#out.push(Renderer.#serialize_failed_boundary(result));
				failed_snippet(child, result, noop$1);
				child.#out.push(BLOCK_CLOSE);
			}
		}
	}
	/**
	* Create a component renderer. The component renderer inherits the state from the parent,
	* but has its own content. It is treated as an ordering boundary for ondestroy callbacks.
	* @param {(renderer: Renderer) => MaybePromise<void>} fn
	* @param {Function} [component_fn]
	* @returns {void}
	*/
	component(fn, component_fn) {
		push();
		const child = this.child(fn);
		child.#is_component_body = true;
		pop();
	}
	/**
	* @param {Record<string, any>} attrs
	* @param {(renderer: Renderer) => void} fn
	* @param {string | undefined} [css_hash]
	* @param {Record<string, boolean> | undefined} [classes]
	* @param {Record<string, string> | undefined} [styles]
	* @param {number | undefined} [flags]
	* @param {boolean | undefined} [is_rich]
	* @returns {void}
	*/
	select(attrs, fn, css_hash, classes, styles, flags, is_rich) {
		const { value, ...select_attrs } = attrs;
		this.push(`<select${attributes(select_attrs, css_hash, classes, styles, flags)}>`);
		this.child((renderer) => {
			renderer.local.select_value = value;
			fn(renderer);
		});
		this.push(`${is_rich ? "<!>" : ""}</select>`);
	}
	/**
	* @param {Record<string, any>} attrs
	* @param {string | number | boolean | ((renderer: Renderer) => void)} body
	* @param {string | undefined} [css_hash]
	* @param {Record<string, boolean> | undefined} [classes]
	* @param {Record<string, string> | undefined} [styles]
	* @param {number | undefined} [flags]
	* @param {boolean | undefined} [is_rich]
	*/
	option(attrs, body, css_hash, classes, styles, flags, is_rich) {
		this.#out.push(`<option${attributes(attrs, css_hash, classes, styles, flags)}`);
		/**
		* @param {Renderer} renderer
		* @param {any} value
		* @param {{ head?: string, body: any }} content
		*/
		const close = (renderer, value, { head, body }) => {
			if (has_own_property.call(attrs, "value")) value = attrs.value;
			if (value === this.local.select_value) renderer.#out.push(" selected=\"\"");
			renderer.#out.push(`>${body}${is_rich ? "<!>" : ""}</option>`);
			if (head) renderer.head((child) => child.push(head));
		};
		if (typeof body === "function") this.child((renderer) => {
			const r = new Renderer(this.global, this);
			body(r);
			if (this.global.mode === "async") return r.#collect_content_async().then((content) => {
				close(renderer, content.body.replaceAll("<!---->", ""), content);
			});
			else {
				const content = r.#collect_content();
				close(renderer, content.body.replaceAll("<!---->", ""), content);
			}
		});
		else close(this, body, { body: escape_html$1(body) });
	}
	/**
	* @param {(renderer: Renderer) => void} fn
	*/
	title(fn) {
		const path = this.get_path();
		/** @param {string} head */
		const close = (head) => {
			this.global.set_title(head, path);
		};
		this.child((renderer) => {
			const r = new Renderer(renderer.global, renderer);
			fn(r);
			if (renderer.global.mode === "async") return r.#collect_content_async().then((content) => {
				close(content.head);
			});
			else {
				const content = r.#collect_content();
				close(content.head);
			}
		});
	}
	/**
	* @param {string | (() => Promise<string>)} content
	*/
	push(content) {
		if (typeof content === "function") this.child(async (renderer) => renderer.push(await content()));
		else this.#out.push(content);
	}
	/**
	* @param {() => void} fn
	*/
	on_destroy(fn) {
		(this.#on_destroy ??= []).push(fn);
	}
	/**
	* @returns {number[]}
	*/
	get_path() {
		return this.#parent ? [...this.#parent.get_path(), this.#parent.#out.indexOf(this)] : [];
	}
	/**
	* @deprecated this is needed for legacy component bindings
	*/
	copy() {
		const copy = new Renderer(this.global, this.#parent);
		copy.#out = this.#out.map((item) => item instanceof Renderer ? item.copy() : item);
		copy.promise = this.promise;
		return copy;
	}
	/**
	* @param {Renderer} other
	* @deprecated this is needed for legacy component bindings
	*/
	subsume(other) {
		if (this.global.mode !== other.global.mode) throw new Error("invariant: A renderer cannot switch modes. If you're seeing this, there's a compiler bug. File an issue!");
		this.local = other.local;
		this.#out = other.#out.map((item, i) => {
			const current = this.#out[i];
			if (current instanceof Renderer && item instanceof Renderer) {
				current.subsume(item);
				return current;
			}
			return item;
		});
		this.promise = other.promise;
		this.type = other.type;
	}
	get length() {
		return this.#out.length;
	}
	/**
	* Creates the hydration comment that marks the start of a failed boundary.
	* The error is JSON-serialized and embedded inside an HTML comment for the client
	* to parse during hydration. The JSON is escaped to prevent `-->` or `<!--` sequences
	* from breaking out of the comment (XSS). Uses unicode escapes which `JSON.parse()`
	* handles transparently.
	* @param {unknown} error
	* @returns {string}
	*/
	static #serialize_failed_boundary(error) {
		return `<!--[?${JSON.stringify(error).replace(/>/g, "\\u003e").replace(/</g, "\\u003c")}-->`;
	}
	/**
	* Only available on the server and when compiling with the `server` option.
	* Takes a component and returns an object with `body` and `head` properties on it, which you can use to populate the HTML when server-rendering your app.
	* @template {Record<string, any>} Props
	* @param {Component<Props>} component
	* @param {{ props?: Omit<Props, '$$slots' | '$$events'>; context?: Map<any, any>; idPrefix?: string; csp?: Csp }} [options]
	* @returns {RenderOutput}
	*/
	static render(component, options = {}) {
		/** @type {AccumulatedContent | undefined} */
		let sync;
		const result = {};
		Object.defineProperties(result, {
			html: { get: () => {
				return (sync ??= Renderer.#render(component, options)).body;
			} },
			head: { get: () => {
				return (sync ??= Renderer.#render(component, options)).head;
			} },
			body: { get: () => {
				return (sync ??= Renderer.#render(component, options)).body;
			} },
			hashes: { value: { script: "" } },
			then: { value: (onfulfilled, onrejected) => {
				{
					const result = sync ??= Renderer.#render(component, options);
					const user_result = onfulfilled({
						head: result.head,
						body: result.body,
						html: result.body,
						hashes: { script: [] }
					});
					return Promise.resolve(user_result);
				}
			} }
		});
		return result;
	}
	/**
	* Collect all of the `onDestroy` callbacks registered during rendering. In an async context, this is only safe to call
	* after awaiting `collect_async`.
	*
	* Child renderers are "porous" and don't affect execution order, but component body renderers
	* create ordering boundaries. Within a renderer, callbacks run in order until hitting a component boundary.
	* @returns {Iterable<() => void>}
	*/
	*#collect_on_destroy() {
		for (const component of this.#traverse_components()) yield* component.#collect_ondestroy();
	}
	/**
	* Performs a depth-first search of renderers, yielding the deepest components first, then additional components as we backtrack up the tree.
	* @returns {Iterable<Renderer>}
	*/
	*#traverse_components() {
		for (const child of this.#out) if (typeof child !== "string") yield* child.#traverse_components();
		if (this.#is_component_body) yield this;
	}
	/**
	* @returns {Iterable<() => void>}
	*/
	*#collect_ondestroy() {
		if (this.#on_destroy) for (const fn of this.#on_destroy) yield fn;
		for (const child of this.#out) if (child instanceof Renderer && !child.#is_component_body) yield* child.#collect_ondestroy();
	}
	/**
	* Render a component. Throws if any of the children are performing asynchronous work.
	*
	* @template {Record<string, any>} Props
	* @param {Component<Props>} component
	* @param {{ props?: Omit<Props, '$$slots' | '$$events'>; context?: Map<any, any>; idPrefix?: string }} options
	* @returns {AccumulatedContent}
	*/
	static #render(component, options) {
		var previous_context = ssr_context;
		try {
			const renderer = Renderer.#open_render("sync", component, options);
			const content = renderer.#collect_content();
			return Renderer.#close_render(content, renderer);
		} finally {
			abort();
			set_ssr_context(previous_context);
		}
	}
	/**
	* Render a component.
	*
	* @template {Record<string, any>} Props
	* @param {Component<Props>} component
	* @param {{ props?: Omit<Props, '$$slots' | '$$events'>; context?: Map<any, any>; idPrefix?: string; csp?: Csp }} options
	* @returns {Promise<AccumulatedContent & { hashes: { script: Sha256Source[] } }>}
	*/
	static async #render_async(component, options) {
		const previous_context = ssr_context;
		try {
			const renderer = Renderer.#open_render("async", component, options);
			const content = await renderer.#collect_content_async();
			const hydratables = await renderer.#collect_hydratables();
			if (hydratables !== null) content.head = hydratables + content.head;
			return Renderer.#close_render(content, renderer);
		} finally {
			set_ssr_context(previous_context);
			abort();
		}
	}
	/**
	* Collect all of the code from the `out` array and return it as a string, or a promise resolving to a string.
	* @param {AccumulatedContent} content
	* @returns {AccumulatedContent}
	*/
	#collect_content(content = {
		head: "",
		body: ""
	}) {
		for (const item of this.#out) if (typeof item === "string") content[this.type] += item;
		else if (item instanceof Renderer) item.#collect_content(content);
		return content;
	}
	/**
	* Collect all of the code from the `out` array and return it as a string.
	* @param {AccumulatedContent} content
	* @returns {Promise<AccumulatedContent>}
	*/
	async #collect_content_async(content = {
		head: "",
		body: ""
	}) {
		await this.promise;
		for (const item of this.#out) if (typeof item === "string") content[this.type] += item;
		else if (item instanceof Renderer) if (item.#boundary) {
			/** @type {AccumulatedContent} */
			const boundary_content = {
				head: "",
				body: ""
			};
			try {
				await item.#collect_content_async(boundary_content);
				content.head += boundary_content.head;
				content.body += boundary_content.body;
			} catch (error) {
				const { context, failed, transformError } = item.#boundary;
				set_ssr_context(context);
				let promise = transformError(error);
				set_ssr_context(null);
				let transformed = await promise;
				set_ssr_context(context);
				const failed_renderer = new Renderer(item.global, item);
				failed_renderer.type = item.type;
				failed_renderer.#out.push(Renderer.#serialize_failed_boundary(transformed));
				failed(failed_renderer, transformed, noop$1);
				failed_renderer.#out.push(BLOCK_CLOSE);
				await failed_renderer.#collect_content_async(content);
			}
		} else await item.#collect_content_async(content);
		return content;
	}
	async #collect_hydratables() {
		const ctx = get_render_context().hydratable;
		for (const [_, key] of ctx.unresolved_promises) unresolved_hydratable(key, ctx.lookup.get(key)?.stack ?? "<missing stack trace>");
		for (const comparison of ctx.comparisons) await comparison;
		return await this.#hydratable_block(ctx);
	}
	/**
	* @template {Record<string, any>} Props
	* @param {'sync' | 'async'} mode
	* @param {import('svelte').Component<Props>} component
	* @param {{ props?: Omit<Props, '$$slots' | '$$events'>; context?: Map<any, any>; idPrefix?: string; csp?: Csp; transformError?: (error: unknown) => unknown }} options
	* @returns {Renderer}
	*/
	static #open_render(mode, component, options) {
		if (options.idPrefix?.includes("--")) invalid_id_prefix();
		var previous_context = ssr_context;
		try {
			const renderer = new Renderer(new SSRState(mode, options.idPrefix ? options.idPrefix + "-" : "", options.csp, options.transformError));
			set_ssr_context({
				p: null,
				c: options.context ?? null,
				r: renderer
			});
			renderer.push(BLOCK_OPEN);
			component(renderer, options.props ?? {});
			renderer.push(BLOCK_CLOSE);
			return renderer;
		} finally {
			set_ssr_context(previous_context);
		}
	}
	/**
	* @param {AccumulatedContent} content
	* @param {Renderer} renderer
	* @returns {AccumulatedContent & { hashes: { script: Sha256Source[] } }}
	*/
	static #close_render(content, renderer) {
		for (const cleanup of renderer.#collect_on_destroy()) cleanup();
		let head = content.head + renderer.global.get_title();
		let body = content.body;
		for (const { hash, code } of renderer.global.css) head += `<style id="${hash}">${code}</style>`;
		return {
			head,
			body,
			hashes: { script: renderer.global.csp.script_hashes }
		};
	}
	/**
	* @param {HydratableContext} ctx
	*/
	async #hydratable_block(ctx) {
		if (ctx.lookup.size === 0) return null;
		let entries = [];
		let has_promises = false;
		for (const [k, v] of ctx.lookup) {
			if (v.promises) {
				has_promises = true;
				for (const p of v.promises) await p;
			}
			entries.push(`[${uneval(k)},${v.serialized}]`);
		}
		let prelude = `const h = (window.__svelte ??= {}).h ??= new Map();`;
		if (has_promises) prelude = `const r = (v) => Promise.resolve(v);
				${prelude}`;
		const body = `
			{
				${prelude}

				for (const [k, v] of [
					${entries.join(",\n					")}
				]) {
					h.set(k, v);
				}
			}
		`;
		let csp_attr = "";
		if (this.global.csp.nonce) csp_attr = ` nonce="${this.global.csp.nonce}"`;
		else if (this.global.csp.hash) {
			const hash = await sha256$1(body);
			this.global.csp.script_hashes.push(`sha256-${hash}`);
		}
		return `\n\t\t<script${csp_attr}>${body}<\/script>`;
	}
};
var SSRState = class {
	/** @readonly @type {Csp & { script_hashes: Sha256Source[] }} */
	csp;
	/** @readonly @type {'sync' | 'async'} */
	mode;
	/** @readonly @type {() => string} */
	uid;
	/** @readonly @type {Set<{ hash: string; code: string }>} */
	css = /* @__PURE__ */ new Set();
	/**
	* `transformError` passed to `render`. Called when an error boundary catches an error.
	* Throws by default if unset in `render`.
	* @type {(error: unknown) => unknown}
	*/
	transformError;
	/** @type {{ path: number[], value: string }} */
	#title = {
		path: [],
		value: ""
	};
	/**
	* @param {'sync' | 'async'} mode
	* @param {string} id_prefix
	* @param {Csp} csp
	* @param {((error: unknown) => unknown) | undefined} [transformError]
	*/
	constructor(mode, id_prefix = "", csp = { hash: false }, transformError) {
		this.mode = mode;
		this.csp = {
			...csp,
			script_hashes: []
		};
		this.transformError = transformError ?? ((error) => {
			throw error;
		});
		let uid = 1;
		this.uid = () => `${id_prefix}s${uid++}`;
	}
	get_title() {
		return this.#title.value;
	}
	/**
	* Performs a depth-first (lexicographic) comparison using the path. Rejects sets
	* from earlier than or equal to the current value.
	* @param {string} value
	* @param {number[]} path
	*/
	set_title(value, path) {
		const current = this.#title.path;
		let i = 0;
		let l = Math.min(path.length, current.length);
		while (i < l && path[i] === current[i]) i += 1;
		if (path[i] === void 0) return;
		if (current[i] === void 0 || path[i] > current[i]) {
			this.#title.path = path;
			this.#title.value = value;
		}
	}
};
//#endregion
//#region ../../node_modules/.bun/svelte@5.56.5/node_modules/svelte/src/internal/server/blocks/html.js
/**
* @param {string} value
*/
function html(value) {
	return "<!---->" + String(value ?? "") + "<!---->";
}
//#endregion
//#region ../../node_modules/.bun/svelte@5.56.5/node_modules/svelte/src/internal/server/index.js
var INVALID_ATTR_NAME_CHAR_REGEX = /[\s'">/=\u{FDD0}-\u{FDEF}\u{FFFE}\u{FFFF}\u{1FFFE}\u{1FFFF}\u{2FFFE}\u{2FFFF}\u{3FFFE}\u{3FFFF}\u{4FFFE}\u{4FFFF}\u{5FFFE}\u{5FFFF}\u{6FFFE}\u{6FFFF}\u{7FFFE}\u{7FFFF}\u{8FFFE}\u{8FFFF}\u{9FFFE}\u{9FFFF}\u{AFFFE}\u{AFFFF}\u{BFFFE}\u{BFFFF}\u{CFFFE}\u{CFFFF}\u{DFFFE}\u{DFFFF}\u{EFFFE}\u{EFFFF}\u{FFFFE}\u{FFFFF}\u{10FFFE}\u{10FFFF}]/u;
/**
* @param {Renderer} renderer
* @param {string} tag
* @param {() => void} attributes_fn
* @param {() => void} children_fn
* @returns {void}
*/
function element(renderer, tag, attributes_fn = noop$1, children_fn = noop$1) {
	renderer.push("<!---->");
	if (tag) {
		if (!REGEX_VALID_TAG_NAME.test(tag)) dynamic_element_invalid_tag(tag);
		renderer.push(`<${tag}`);
		attributes_fn();
		renderer.push(`>`);
		if (!is_void(tag)) {
			children_fn();
			if (!is_raw_text_element(tag)) renderer.push(EMPTY_COMMENT);
			renderer.push(`</${tag}>`);
		}
	}
	renderer.push("<!---->");
}
/**
* Only available on the server and when compiling with the `server` option.
* Takes a component and returns an object with `body` and `head` properties on it, which you can use to populate the HTML when server-rendering your app.
* @template {Record<string, any>} Props
* @param {Component<Props> | ComponentType<SvelteComponent<Props>>} component
* @param {{ props?: Omit<Props, '$$slots' | '$$events'>; context?: Map<any, any>; idPrefix?: string; csp?: Csp; transformError?: (error: unknown) => unknown }} [options]
* @returns {RenderOutput}
*/
function render(component, options = {}) {
	if (options.csp?.hash && options.csp.nonce) invalid_csp();
	return Renderer.render(component, options);
}
/**
* @param {string} hash
* @param {Renderer} renderer
* @param {(renderer: Renderer) => Promise<void> | void} fn
* @returns {void}
*/
function head(hash, renderer, fn) {
	renderer.head((renderer) => {
		renderer.push(`<!--${hash}-->`);
		renderer.child(fn);
		renderer.push(EMPTY_COMMENT);
	});
}
/**
* @param {Record<string, unknown>} attrs
* @param {string} [css_hash]
* @param {Record<string, boolean>} [classes]
* @param {Record<string, string>} [styles]
* @param {number} [flags]
* @returns {string}
*/
function attributes(attrs, css_hash, classes, styles, flags = 0) {
	if (styles) attrs.style = to_style(attrs.style, styles);
	if (attrs.class) attrs.class = clsx$1(attrs.class);
	if (css_hash || classes) attrs.class = to_class(attrs.class, css_hash, classes);
	let attr_str = "";
	let name;
	const is_html = (flags & 1) === 0;
	const lowercase = (flags & 2) === 0;
	const is_input = (flags & 4) !== 0;
	for (name of Object.keys(attrs)) {
		if (typeof attrs[name] === "function") continue;
		if (name[0] === "$" && name[1] === "$") continue;
		if (name === "" || INVALID_ATTR_NAME_CHAR_REGEX.test(name)) continue;
		var value = attrs[name];
		var lower = name.toLowerCase();
		if (lowercase) name = lower;
		if (lower.length > 2 && lower.startsWith("on")) continue;
		if (is_input) {
			if (name === "defaultvalue" || name === "defaultchecked") {
				name = name === "defaultvalue" ? "value" : "checked";
				if (attrs[name]) continue;
			}
		}
		attr_str += attr(name, value, is_html && is_boolean_attribute(name));
	}
	return attr_str;
}
/**
* @param {Record<string, unknown>[]} props
* @returns {Record<string, unknown>}
*/
function spread_props(props) {
	/** @type {Record<string, unknown>} */
	const merged_props = {};
	let key;
	for (let i = 0; i < props.length; i++) {
		const obj = props[i];
		if (obj == null) continue;
		for (key of Object.keys(obj)) {
			const desc = Object.getOwnPropertyDescriptor(obj, key);
			if (desc) Object.defineProperty(merged_props, key, desc);
			else merged_props[key] = obj[key];
		}
	}
	return merged_props;
}
/**
* @param {unknown} value
* @returns {string}
*/
function stringify$2(value) {
	return typeof value === "string" ? value : value == null ? "" : value + "";
}
/**
* @param {any} value
* @param {string | undefined} [hash]
* @param {Record<string, boolean>} [directives]
*/
function attr_class(value, hash, directives) {
	var result = to_class(value, hash, directives);
	return result ? ` class="${escape_html$1(result, true)}"` : "";
}
/**
* @param {any} value
* @param {Record<string,any>|[Record<string,any>,Record<string,any>]} [directives]
*/
function attr_style(value, directives) {
	var result = to_style(value, directives);
	return result ? ` style="${escape_html$1(result, true)}"` : "";
}
/**
* @template V
* @param {Record<string, [any, any, any]>} store_values
* @param {string} store_name
* @param {Store<V> | null | undefined} store
* @returns {V}
*/
function store_get(store_values, store_name, store) {
	if (store_name in store_values && store_values[store_name][0] === store) return store_values[store_name][2];
	store_values[store_name]?.[1]();
	store_values[store_name] = [
		store,
		null,
		void 0
	];
	const unsub = subscribe_to_store(
		store,
		/** @param {any} v */
		(v) => store_values[store_name][2] = v
	);
	store_values[store_name][1] = unsub;
	return store_values[store_name][2];
}
/**
* Sets the new value of a store and returns that value.
* @template V
* @param {Store<V>} store
* @param {V} value
* @returns {V}
*/
function store_set(store, value) {
	store.set(value);
	return value;
}
/** @param {Record<string, [any, any, any]>} store_values */
function unsubscribe_stores(store_values) {
	for (const store_name of Object.keys(store_values)) store_values[store_name][1]();
}
/**
* Legacy mode: If the prop has a fallback and is bound in the
* parent component, propagate the fallback value upwards.
* @param {Record<string, unknown>} props_parent
* @param {Record<string, unknown>} props_now
*/
function bind_props(props_parent, props_now) {
	for (const key of Object.keys(props_now)) {
		const initial_value = props_parent[key];
		const value = props_now[key];
		if (initial_value === void 0 && value !== void 0 && Object.getOwnPropertyDescriptor(props_parent, key)?.set) props_parent[key] = value;
	}
}
/** @param {any} array_like_or_iterator */
function ensure_array_like(array_like_or_iterator) {
	if (array_like_or_iterator) return array_like_or_iterator.length !== void 0 ? array_like_or_iterator : Array.from(array_like_or_iterator);
	return [];
}
/**
* @template V
* @param {() => V} get_value
*/
function once$1(get_value) {
	let value = UNINITIALIZED;
	return () => {
		if (value === UNINITIALIZED) value = get_value();
		return value;
	};
}
/**
* Create an unique ID
* @param {Renderer} renderer
* @returns {string}
*/
function props_id(renderer) {
	const uid = renderer.global.uid();
	renderer.push("<!--$" + uid + "-->");
	return uid;
}
/**
* @template T
* @param {()=>T} fn
* @returns {(new_value?: T) => (T | void)}
*/
function derived(fn) {
	const get_value = ssr_context === null ? fn : once$1(fn);
	/** @type {T | undefined} */
	let updated_value;
	return function(new_value) {
		if (arguments.length === 0) return updated_value ?? get_value();
		updated_value = new_value;
		return updated_value;
	};
}
//#endregion
//#region ../../node_modules/.bun/svelte@5.56.5/node_modules/svelte/src/internal/server/hydratable.js
/** @import { HydratableLookupEntry } from '#server' */
/**
* @template T
* @param {string} key
* @param {() => T} fn
* @returns {T}
*/
function hydratable(key, fn) {
	experimental_async_required();
	const { hydratable } = get_render_context();
	let entry = hydratable.lookup.get(key);
	if (entry !== void 0) return entry.value;
	const value = fn();
	entry = encode$1(key, value, hydratable.unresolved_promises);
	hydratable.lookup.set(key, entry);
	return value;
}
/**
* @param {string} key
* @param {any} value
* @param {Map<Promise<any>, string>} [unresolved]
*/
function encode$1(key, value, unresolved) {
	/** @type {HydratableLookupEntry} */
	const entry = {
		value,
		serialized: ""
	};
	let uid = 1;
	entry.serialized = uneval(entry.value, (value, uneval) => {
		if (is_promise(value)) {
			const placeholder = `"${uid++}"`;
			const p = value.then((v) => {
				entry.serialized = entry.serialized.replace(placeholder, () => `r(${uneval(v)})`);
			}).catch((devalue_error) => hydratable_serialization_failed(key, serialization_stack(entry.stack, devalue_error?.stack)));
			p.catch(() => {}).finally(() => unresolved?.delete(p));
			(entry.promises ??= []).push(p);
			return placeholder;
		}
	});
	return entry;
}
/**
* @param {any} value
* @returns {value is Promise<any>}
*/
function is_promise(value) {
	return Object.prototype.toString.call(value) === "[object Promise]";
}
/**
* @param {string | undefined} root_stack
* @param {string | undefined} uneval_stack
*/
function serialization_stack(root_stack, uneval_stack) {
	let out = "";
	if (root_stack) out += root_stack + "\n";
	if (uneval_stack) out += "Caused by:\n" + uneval_stack + "\n";
	return out || "<missing stack trace>";
}
//#endregion
//#region ../../node_modules/.bun/svelte@5.56.5/node_modules/svelte/src/internal/server/blocks/snippet.js
/** @import { Snippet } from 'svelte' */
/** @import { Renderer } from '../renderer' */
/** @import { Getters } from '#shared' */
/**
* Create a snippet programmatically
* @template {unknown[]} Params
* @param {(...params: Getters<Params>) => {
*   render: () => string
*   setup?: (element: Element) => void | (() => void)
* }} fn
* @returns {Snippet<Params>}
*/
function createRawSnippet(fn) {
	return (renderer, ...args) => {
		var getters = args.map((value) => () => value);
		renderer.push(fn(...getters).render().trim());
	};
}
//#endregion
//#region ../../node_modules/.bun/svelte@5.56.5/node_modules/svelte/src/index-server.js
/** @import { SSRContext } from '#server' */
/** @import { Renderer } from './internal/server/renderer.js' */
var index_server_exports = /* @__PURE__ */ __exportAll({
	afterUpdate: () => noop$1,
	beforeUpdate: () => noop$1,
	createContext: () => createContext,
	createEventDispatcher: () => createEventDispatcher,
	createRawSnippet: () => createRawSnippet,
	flushSync: () => noop$1,
	fork: () => fork,
	getAbortSignal: () => getAbortSignal,
	getAllContexts: () => getAllContexts,
	getContext: () => getContext,
	hasContext: () => hasContext,
	hydratable: () => hydratable,
	hydrate: () => hydrate,
	mount: () => mount,
	onDestroy: () => onDestroy,
	onMount: () => noop$1,
	setContext: () => setContext,
	settled: () => settled,
	tick: () => tick,
	unmount: () => unmount,
	untrack: () => run$1
});
/** @param {() => void} fn */
function onDestroy(fn) {
	/** @type {Renderer} */ ssr_context.r.on_destroy(fn);
}
function createEventDispatcher() {
	return noop$1;
}
function mount() {
	lifecycle_function_unavailable("mount");
}
function hydrate() {
	lifecycle_function_unavailable("hydrate");
}
function unmount() {
	lifecycle_function_unavailable("unmount");
}
function fork() {
	lifecycle_function_unavailable("fork");
}
async function tick() {}
async function settled() {}
var SvelteSet = globalThis.Set;
var SvelteMap = globalThis.Map;
var MediaQuery = class {
	current;
	/**
	* @param {string} query
	* @param {boolean} [matches]
	*/
	constructor(query, matches = false) {
		this.current = matches;
	}
};
/**
* @param {any} _
*/
function createSubscriber(_) {
	return () => {};
}
//#endregion
//#region ../../node_modules/.bun/inline-style-parser@0.2.7/node_modules/inline-style-parser/esm/index.mjs
var COMMENT_REGEX = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g;
var NEWLINE_REGEX = /\n/g;
var WHITESPACE_REGEX = /^\s*/;
var PROPERTY_REGEX = /^(\*?[-#/*\\\w]+(\[[0-9a-z_-]+\])?)\s*/;
var COLON_REGEX = /^:\s*/;
var VALUE_REGEX = /^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};])+)/;
var SEMICOLON_REGEX = /^[;\s]*/;
var TRIM_REGEX = /^\s+|\s+$/g;
var NEWLINE = "\n";
var FORWARD_SLASH = "/";
var ASTERISK = "*";
var EMPTY_STRING = "";
var TYPE_COMMENT = "comment";
var TYPE_DECLARATION = "declaration";
/**
* @param {String} style
* @param {Object} [options]
* @return {Object[]}
* @throws {TypeError}
* @throws {Error}
*/
function index(style, options) {
	if (typeof style !== "string") throw new TypeError("First argument must be a string");
	if (!style) return [];
	options = options || {};
	/**
	* Positional.
	*/
	var lineno = 1;
	var column = 1;
	/**
	* Update lineno and column based on `str`.
	*
	* @param {String} str
	*/
	function updatePosition(str) {
		var lines = str.match(NEWLINE_REGEX);
		if (lines) lineno += lines.length;
		var i = str.lastIndexOf(NEWLINE);
		column = ~i ? str.length - i : column + str.length;
	}
	/**
	* Mark position and patch `node.position`.
	*
	* @return {Function}
	*/
	function position() {
		var start = {
			line: lineno,
			column
		};
		return function(node) {
			node.position = new Position(start);
			whitespace();
			return node;
		};
	}
	/**
	* Store position information for a node.
	*
	* @constructor
	* @property {Object} start
	* @property {Object} end
	* @property {undefined|String} source
	*/
	function Position(start) {
		this.start = start;
		this.end = {
			line: lineno,
			column
		};
		this.source = options.source;
	}
	/**
	* Non-enumerable source string.
	*/
	Position.prototype.content = style;
	/**
	* Error `msg`.
	*
	* @param {String} msg
	* @throws {Error}
	*/
	function error(msg) {
		var err = /* @__PURE__ */ new Error(options.source + ":" + lineno + ":" + column + ": " + msg);
		err.reason = msg;
		err.filename = options.source;
		err.line = lineno;
		err.column = column;
		err.source = style;
		if (options.silent);
		else throw err;
	}
	/**
	* Match `re` and return captures.
	*
	* @param {RegExp} re
	* @return {undefined|Array}
	*/
	function match(re) {
		var m = re.exec(style);
		if (!m) return;
		var str = m[0];
		updatePosition(str);
		style = style.slice(str.length);
		return m;
	}
	/**
	* Parse whitespace.
	*/
	function whitespace() {
		match(WHITESPACE_REGEX);
	}
	/**
	* Parse comments.
	*
	* @param {Object[]} [rules]
	* @return {Object[]}
	*/
	function comments(rules) {
		var c;
		rules = rules || [];
		while (c = comment()) if (c !== false) rules.push(c);
		return rules;
	}
	/**
	* Parse comment.
	*
	* @return {Object}
	* @throws {Error}
	*/
	function comment() {
		var pos = position();
		if (FORWARD_SLASH != style.charAt(0) || ASTERISK != style.charAt(1)) return;
		var i = 2;
		while (EMPTY_STRING != style.charAt(i) && (ASTERISK != style.charAt(i) || FORWARD_SLASH != style.charAt(i + 1))) ++i;
		i += 2;
		if (EMPTY_STRING === style.charAt(i - 1)) return error("End of comment missing");
		var str = style.slice(2, i - 2);
		column += 2;
		updatePosition(str);
		style = style.slice(i);
		column += 2;
		return pos({
			type: TYPE_COMMENT,
			comment: str
		});
	}
	/**
	* Parse declaration.
	*
	* @return {Object}
	* @throws {Error}
	*/
	function declaration() {
		var pos = position();
		var prop = match(PROPERTY_REGEX);
		if (!prop) return;
		comment();
		if (!match(COLON_REGEX)) return error("property missing ':'");
		var val = match(VALUE_REGEX);
		var ret = pos({
			type: TYPE_DECLARATION,
			property: trim(prop[0].replace(COMMENT_REGEX, EMPTY_STRING)),
			value: val ? trim(val[0].replace(COMMENT_REGEX, EMPTY_STRING)) : EMPTY_STRING
		});
		match(SEMICOLON_REGEX);
		return ret;
	}
	/**
	* Parse declarations.
	*
	* @return {Object[]}
	*/
	function declarations() {
		var decls = [];
		comments(decls);
		var decl;
		while (decl = declaration()) if (decl !== false) {
			decls.push(decl);
			comments(decls);
		}
		return decls;
	}
	whitespace();
	return declarations();
}
/**
* Trim `str`.
*
* @param {String} str
* @return {String}
*/
function trim(str) {
	return str ? str.replace(TRIM_REGEX, EMPTY_STRING) : EMPTY_STRING;
}
//#endregion
//#region ../../node_modules/.bun/style-to-object@1.0.14/node_modules/style-to-object/esm/index.mjs
/**
* Parses inline style to object.
*
* @param style - Inline style.
* @param iterator - Iterator.
* @returns - Style object or null.
*
* @example Parsing inline style to object:
*
* ```js
* import parse from 'style-to-object';
* parse('line-height: 42;'); // { 'line-height': '42' }
* ```
*/
function StyleToObject(style, iterator) {
	let styleObject = null;
	if (!style || typeof style !== "string") return styleObject;
	const declarations = index(style);
	const hasIterator = typeof iterator === "function";
	declarations.forEach((declaration) => {
		if (declaration.type !== "declaration") return;
		const { property, value } = declaration;
		if (hasIterator) iterator(property, value, declaration);
		else if (value) {
			styleObject = styleObject || {};
			styleObject[property] = value;
		}
	});
	return styleObject;
}
//#endregion
//#region ../../node_modules/.bun/svelte-toolbelt@0.10.6+37e628f89a6bdaed/node_modules/svelte-toolbelt/dist/utils/is.js
function isFunction$1(value) {
	return typeof value === "function";
}
function isObject(value) {
	return value !== null && typeof value === "object";
}
var CLASS_VALUE_PRIMITIVE_TYPES = [
	"string",
	"number",
	"bigint",
	"boolean"
];
function isClassValue(value) {
	if (value === null || value === void 0) return true;
	if (CLASS_VALUE_PRIMITIVE_TYPES.includes(typeof value)) return true;
	if (Array.isArray(value)) return value.every((item) => isClassValue(item));
	if (typeof value === "object") {
		if (Object.getPrototypeOf(value) !== Object.prototype) return false;
		return true;
	}
	return false;
}
//#endregion
//#region ../../node_modules/.bun/svelte-toolbelt@0.10.6+37e628f89a6bdaed/node_modules/svelte-toolbelt/dist/box/box-extras.svelte.js
var BoxSymbol = Symbol("box");
var isWritableSymbol = Symbol("is-writable");
function boxWith(getter, setter) {
	const derived$2 = derived(getter);
	if (setter) return {
		[BoxSymbol]: true,
		[isWritableSymbol]: true,
		get current() {
			return derived$2();
		},
		set current(v) {
			setter(v);
		}
	};
	return {
		[BoxSymbol]: true,
		get current() {
			return getter();
		}
	};
}
/**
* @returns Whether the value is a Box
*
* @see {@link https://runed.dev/docs/functions/box}
*/
function isBox(value) {
	return isObject(value) && BoxSymbol in value;
}
/**
* @returns Whether the value is a WritableBox
*
* @see {@link https://runed.dev/docs/functions/box}
*/
function isWritableBox(value) {
	return isBox(value) && isWritableSymbol in value;
}
function boxFrom(value) {
	if (isBox(value)) return value;
	if (isFunction$1(value)) return boxWith(value);
	return simpleBox(value);
}
/**
* Function that gets an object of boxes, and returns an object of reactive values
*
* @example
* const count = box(0)
* const flat = box.flatten({ count, double: box.with(() => count.current) })
* // type of flat is { count: number, readonly double: number }
*
* @see {@link https://runed.dev/docs/functions/box}
*/
function boxFlatten(boxes) {
	return Object.entries(boxes).reduce((acc, [key, b]) => {
		if (!isBox(b)) return Object.assign(acc, { [key]: b });
		if (isWritableBox(b)) Object.defineProperty(acc, key, {
			get() {
				return b.current;
			},
			set(v) {
				b.current = v;
			}
		});
		else Object.defineProperty(acc, key, { get() {
			return b.current;
		} });
		return acc;
	}, {});
}
/**
* Function that converts a box to a readonly box.
*
* @example
* const count = box(0) // WritableBox<number>
* const countReadonly = box.readonly(count) // ReadableBox<number>
*
* @see {@link https://runed.dev/docs/functions/box}
*/
function toReadonlyBox(b) {
	if (!isWritableBox(b)) return b;
	return {
		[BoxSymbol]: true,
		get current() {
			return b.current;
		}
	};
}
function simpleBox(initialValue) {
	let current = initialValue;
	return {
		[BoxSymbol]: true,
		[isWritableSymbol]: true,
		get current() {
			return current;
		},
		set current(v) {
			current = v;
		}
	};
}
//#endregion
//#region ../../node_modules/.bun/svelte-toolbelt@0.10.6+37e628f89a6bdaed/node_modules/svelte-toolbelt/dist/box/box.svelte.js
function box(initialValue) {
	let current = initialValue;
	return {
		[BoxSymbol]: true,
		[isWritableSymbol]: true,
		get current() {
			return current;
		},
		set current(v) {
			current = v;
		}
	};
}
box.from = boxFrom;
box.with = boxWith;
box.flatten = boxFlatten;
box.readonly = toReadonlyBox;
box.isBox = isBox;
box.isWritableBox = isWritableBox;
//#endregion
//#region ../../node_modules/.bun/svelte-toolbelt@0.10.6+37e628f89a6bdaed/node_modules/svelte-toolbelt/dist/utils/compose-handlers.js
/**
* Composes event handlers into a single function that can be called with an event.
* If the previous handler cancels the event using `event.preventDefault()`, the handlers
* that follow will not be called.
*/
function composeHandlers(...handlers) {
	return function(e) {
		for (const handler of handlers) {
			if (!handler) continue;
			if (e.defaultPrevented) return;
			if (typeof handler === "function") handler.call(this, e);
			else handler.current?.call(this, e);
		}
	};
}
//#endregion
//#region ../../node_modules/.bun/svelte-toolbelt@0.10.6+37e628f89a6bdaed/node_modules/svelte-toolbelt/dist/utils/strings.js
var NUMBER_CHAR_RE = /\d/;
var STR_SPLITTERS = [
	"-",
	"_",
	"/",
	"."
];
function isUppercase(char = "") {
	if (NUMBER_CHAR_RE.test(char)) return void 0;
	return char !== char.toLowerCase();
}
function splitByCase(str) {
	const parts = [];
	let buff = "";
	let previousUpper;
	let previousSplitter;
	for (const char of str) {
		const isSplitter = STR_SPLITTERS.includes(char);
		if (isSplitter === true) {
			parts.push(buff);
			buff = "";
			previousUpper = void 0;
			continue;
		}
		const isUpper = isUppercase(char);
		if (previousSplitter === false) {
			if (previousUpper === false && isUpper === true) {
				parts.push(buff);
				buff = char;
				previousUpper = isUpper;
				continue;
			}
			if (previousUpper === true && isUpper === false && buff.length > 1) {
				const lastChar = buff.at(-1);
				parts.push(buff.slice(0, Math.max(0, buff.length - 1)));
				buff = lastChar + char;
				previousUpper = isUpper;
				continue;
			}
		}
		buff += char;
		previousUpper = isUpper;
		previousSplitter = isSplitter;
	}
	parts.push(buff);
	return parts;
}
function pascalCase(str) {
	if (!str) return "";
	return splitByCase(str).map((p) => upperFirst(p)).join("");
}
function camelCase(str) {
	return lowerFirst(pascalCase(str || ""));
}
function upperFirst(str) {
	return str ? str[0].toUpperCase() + str.slice(1) : "";
}
function lowerFirst(str) {
	return str ? str[0].toLowerCase() + str.slice(1) : "";
}
//#endregion
//#region ../../node_modules/.bun/svelte-toolbelt@0.10.6+37e628f89a6bdaed/node_modules/svelte-toolbelt/dist/utils/css-to-style-obj.js
function cssToStyleObj(css) {
	if (!css) return {};
	const styleObj = {};
	function iterator(name, value) {
		if (name.startsWith("-moz-") || name.startsWith("-webkit-") || name.startsWith("-ms-") || name.startsWith("-o-")) {
			styleObj[pascalCase(name)] = value;
			return;
		}
		if (name.startsWith("--")) {
			styleObj[name] = value;
			return;
		}
		styleObj[camelCase(name)] = value;
	}
	StyleToObject(css, iterator);
	return styleObj;
}
//#endregion
//#region ../../node_modules/.bun/svelte-toolbelt@0.10.6+37e628f89a6bdaed/node_modules/svelte-toolbelt/dist/utils/execute-callbacks.js
/**
* Executes an array of callback functions with the same arguments.
* @template T The types of the arguments that the callback functions take.
* @param callbacks array of callback functions to execute.
* @returns A new function that executes all of the original callback functions with the same arguments.
*/
function executeCallbacks(...callbacks) {
	return (...args) => {
		for (const callback of callbacks) if (typeof callback === "function") callback(...args);
	};
}
//#endregion
//#region ../../node_modules/.bun/svelte-toolbelt@0.10.6+37e628f89a6bdaed/node_modules/svelte-toolbelt/dist/utils/style-to-css.js
function createParser(matcher, replacer) {
	const regex = RegExp(matcher, "g");
	return (str) => {
		if (typeof str !== "string") throw new TypeError(`expected an argument of type string, but got ${typeof str}`);
		if (!str.match(regex)) return str;
		return str.replace(regex, replacer);
	};
}
var camelToKebab = createParser(/[A-Z]/, (match) => `-${match.toLowerCase()}`);
function styleToCSS(styleObj) {
	if (!styleObj || typeof styleObj !== "object" || Array.isArray(styleObj)) throw new TypeError(`expected an argument of type object, but got ${typeof styleObj}`);
	return Object.keys(styleObj).map((property) => `${camelToKebab(property)}: ${styleObj[property]};`).join("\n");
}
//#endregion
//#region ../../node_modules/.bun/svelte-toolbelt@0.10.6+37e628f89a6bdaed/node_modules/svelte-toolbelt/dist/utils/style.js
function styleToString(style = {}) {
	return styleToCSS(style).replace("\n", " ");
}
var EVENT_LIST_SET = /* @__PURE__ */ new Set([
	"onabort",
	"onanimationcancel",
	"onanimationend",
	"onanimationiteration",
	"onanimationstart",
	"onauxclick",
	"onbeforeinput",
	"onbeforetoggle",
	"onblur",
	"oncancel",
	"oncanplay",
	"oncanplaythrough",
	"onchange",
	"onclick",
	"onclose",
	"oncompositionend",
	"oncompositionstart",
	"oncompositionupdate",
	"oncontextlost",
	"oncontextmenu",
	"oncontextrestored",
	"oncopy",
	"oncuechange",
	"oncut",
	"ondblclick",
	"ondrag",
	"ondragend",
	"ondragenter",
	"ondragleave",
	"ondragover",
	"ondragstart",
	"ondrop",
	"ondurationchange",
	"onemptied",
	"onended",
	"onerror",
	"onfocus",
	"onfocusin",
	"onfocusout",
	"onformdata",
	"ongotpointercapture",
	"oninput",
	"oninvalid",
	"onkeydown",
	"onkeypress",
	"onkeyup",
	"onload",
	"onloadeddata",
	"onloadedmetadata",
	"onloadstart",
	"onlostpointercapture",
	"onmousedown",
	"onmouseenter",
	"onmouseleave",
	"onmousemove",
	"onmouseout",
	"onmouseover",
	"onmouseup",
	"onpaste",
	"onpause",
	"onplay",
	"onplaying",
	"onpointercancel",
	"onpointerdown",
	"onpointerenter",
	"onpointerleave",
	"onpointermove",
	"onpointerout",
	"onpointerover",
	"onpointerup",
	"onprogress",
	"onratechange",
	"onreset",
	"onresize",
	"onscroll",
	"onscrollend",
	"onsecuritypolicyviolation",
	"onseeked",
	"onseeking",
	"onselect",
	"onselectionchange",
	"onselectstart",
	"onslotchange",
	"onstalled",
	"onsubmit",
	"onsuspend",
	"ontimeupdate",
	"ontoggle",
	"ontouchcancel",
	"ontouchend",
	"ontouchmove",
	"ontouchstart",
	"ontransitioncancel",
	"ontransitionend",
	"ontransitionrun",
	"ontransitionstart",
	"onvolumechange",
	"onwaiting",
	"onwebkitanimationend",
	"onwebkitanimationiteration",
	"onwebkitanimationstart",
	"onwebkittransitionend",
	"onwheel"
]);
//#endregion
//#region ../../node_modules/.bun/svelte-toolbelt@0.10.6+37e628f89a6bdaed/node_modules/svelte-toolbelt/dist/utils/merge-props.js
/**
* Modified from https://github.com/adobe/react-spectrum/blob/main/packages/%40react-aria/utils/src/mergeProps.ts (see NOTICE.txt for source)
*/
function isEventHandler(key) {
	return EVENT_LIST_SET.has(key);
}
/**
* Given a list of prop objects, merges them into a single object.
* - Automatically composes event handlers (e.g. `onclick`, `oninput`, etc.)
* - Chains regular functions with the same name so they are called in order
* - Merges class strings with `clsx`
* - Merges style objects and converts them to strings
* - Handles a bug with Svelte where setting the `hidden` attribute to `false` doesn't remove it
* - Overrides other values with the last one
*/
function mergeProps(...args) {
	const result = { ...args[0] };
	for (let i = 1; i < args.length; i++) {
		const props = args[i];
		if (!props) continue;
		for (const key of Object.keys(props)) {
			const a = result[key];
			const b = props[key];
			const aIsFunction = typeof a === "function";
			const bIsFunction = typeof b === "function";
			if (aIsFunction && typeof bIsFunction && isEventHandler(key)) result[key] = composeHandlers(a, b);
			else if (aIsFunction && bIsFunction) result[key] = executeCallbacks(a, b);
			else if (key === "class") {
				const aIsClassValue = isClassValue(a);
				const bIsClassValue = isClassValue(b);
				if (aIsClassValue && bIsClassValue) result[key] = clsx(a, b);
				else if (aIsClassValue) result[key] = clsx(a);
				else if (bIsClassValue) result[key] = clsx(b);
			} else if (key === "style") {
				const aIsObject = typeof a === "object";
				const bIsObject = typeof b === "object";
				const aIsString = typeof a === "string";
				const bIsString = typeof b === "string";
				if (aIsObject && bIsObject) result[key] = {
					...a,
					...b
				};
				else if (aIsObject && bIsString) {
					const parsedStyle = cssToStyleObj(b);
					result[key] = {
						...a,
						...parsedStyle
					};
				} else if (aIsString && bIsObject) result[key] = {
					...cssToStyleObj(a),
					...b
				};
				else if (aIsString && bIsString) {
					const parsedStyleA = cssToStyleObj(a);
					const parsedStyleB = cssToStyleObj(b);
					result[key] = {
						...parsedStyleA,
						...parsedStyleB
					};
				} else if (aIsObject) result[key] = a;
				else if (bIsObject) result[key] = b;
				else if (aIsString) result[key] = a;
				else if (bIsString) result[key] = b;
			} else result[key] = b !== void 0 ? b : a;
		}
		for (const key of Object.getOwnPropertySymbols(props)) {
			const a = result[key];
			const b = props[key];
			result[key] = b !== void 0 ? b : a;
		}
	}
	if (typeof result.style === "object") result.style = styleToString(result.style).replaceAll("\n", " ");
	if (result.hidden === false) {
		result.hidden = void 0;
		delete result.hidden;
	}
	if (result.disabled === false) {
		result.disabled = void 0;
		delete result.disabled;
	}
	return result;
}
//#endregion
//#region ../../node_modules/.bun/svelte-toolbelt@0.10.6+37e628f89a6bdaed/node_modules/svelte-toolbelt/dist/utils/sr-only-styles.js
var srOnlyStyles = {
	position: "absolute",
	width: "1px",
	height: "1px",
	padding: "0",
	margin: "-1px",
	overflow: "hidden",
	clip: "rect(0, 0, 0, 0)",
	whiteSpace: "nowrap",
	borderWidth: "0",
	transform: "translateX(-100%)"
};
styleToString(srOnlyStyles);
//#endregion
//#region ../../node_modules/.bun/runed@0.35.1+37e628f89a6bdaed/node_modules/runed/dist/internal/configurable-globals.js
var defaultWindow = void 0;
//#endregion
//#region ../../node_modules/.bun/runed@0.35.1+37e628f89a6bdaed/node_modules/runed/dist/internal/utils/dom.js
/**
* Handles getting the active element in a document or shadow root.
* If the active element is within a shadow root, it will traverse the shadow root
* to find the active element.
* If not, it will return the active element in the document.
*
* @param document A document or shadow root to get the active element from.
* @returns The active element in the document or shadow root.
*/
function getActiveElement$1(document) {
	let activeElement = document.activeElement;
	while (activeElement?.shadowRoot) {
		const node = activeElement.shadowRoot.activeElement;
		if (node === activeElement) break;
		else activeElement = node;
	}
	return activeElement;
}
//#endregion
//#region ../../node_modules/.bun/runed@0.35.1+37e628f89a6bdaed/node_modules/runed/dist/utilities/active-element/active-element.svelte.js
var ActiveElement = class {
	#document;
	#subscribe;
	constructor(options = {}) {
		const { window = defaultWindow, document = window?.document } = options;
		if (window === void 0) return;
		this.#document = document;
		this.#subscribe = createSubscriber();
	}
	get current() {
		this.#subscribe?.();
		if (!this.#document) return null;
		return getActiveElement$1(this.#document);
	}
};
new ActiveElement();
//#endregion
//#region ../../node_modules/.bun/runed@0.35.1+37e628f89a6bdaed/node_modules/runed/dist/internal/utils/is.js
function isFunction(value) {
	return typeof value === "function";
}
//#endregion
//#region ../../node_modules/.bun/runed@0.35.1+37e628f89a6bdaed/node_modules/runed/dist/utilities/extract/extract.svelte.js
function extract(value, defaultValue) {
	if (isFunction(value)) {
		const gotten = value();
		if (gotten === void 0) return defaultValue;
		return gotten;
	}
	if (value === void 0) return defaultValue;
	return value;
}
//#endregion
//#region ../../node_modules/.bun/runed@0.35.1+37e628f89a6bdaed/node_modules/runed/dist/utilities/context/context.js
var Context = class {
	#name;
	#key;
	/**
	* @param name The name of the context.
	* This is used for generating the context key and error messages.
	*/
	constructor(name) {
		this.#name = name;
		this.#key = Symbol(name);
	}
	/**
	* The key used to get and set the context.
	*
	* It is not recommended to use this value directly.
	* Instead, use the methods provided by this class.
	*/
	get key() {
		return this.#key;
	}
	/**
	* Checks whether this has been set in the context of a parent component.
	*
	* Must be called during component initialisation.
	*/
	exists() {
		return hasContext(this.#key);
	}
	/**
	* Retrieves the context that belongs to the closest parent component.
	*
	* Must be called during component initialisation.
	*
	* @throws An error if the context does not exist.
	*/
	get() {
		const context = getContext(this.#key);
		if (context === void 0) throw new Error(`Context "${this.#name}" not found`);
		return context;
	}
	/**
	* Retrieves the context that belongs to the closest parent component,
	* or the given fallback value if the context does not exist.
	*
	* Must be called during component initialisation.
	*/
	getOr(fallback) {
		const context = getContext(this.#key);
		if (context === void 0) return fallback;
		return context;
	}
	/**
	* Associates the given value with the current component and returns it.
	*
	* Must be called during component initialisation.
	*/
	set(context) {
		return setContext(this.#key, context);
	}
};
//#endregion
//#region ../../node_modules/.bun/runed@0.35.1+37e628f89a6bdaed/node_modules/runed/dist/utilities/use-debounce/use-debounce.svelte.js
function useDebounce(callback, wait) {
	let context = null;
	const wait$ = derived(() => extract(wait, 250));
	function debounced(...args) {
		if (context) {
			if (context.timeout) clearTimeout(context.timeout);
		} else {
			let resolve;
			let reject;
			context = {
				timeout: null,
				runner: null,
				promise: new Promise((res, rej) => {
					resolve = res;
					reject = rej;
				}),
				resolve,
				reject
			};
		}
		context.runner = async () => {
			if (!context) return;
			const ctx = context;
			context = null;
			try {
				ctx.resolve(await callback.apply(this, args));
			} catch (error) {
				ctx.reject(error);
			}
		};
		context.timeout = setTimeout(context.runner, wait$());
		return context.promise;
	}
	debounced.cancel = async () => {
		if (!context || context.timeout === null) {
			await new Promise((resolve) => setTimeout(resolve, 0));
			if (!context || context.timeout === null) return;
		}
		clearTimeout(context.timeout);
		context.reject("Cancelled");
		context = null;
	};
	debounced.runScheduledNow = async () => {
		if (!context || !context.timeout) {
			await new Promise((resolve) => setTimeout(resolve, 0));
			if (!context || !context.timeout) return;
		}
		clearTimeout(context.timeout);
		context.timeout = null;
		await context.runner?.();
	};
	Object.defineProperty(debounced, "pending", {
		enumerable: true,
		get() {
			return !!context?.timeout;
		}
	});
	return debounced;
}
//#endregion
//#region ../../node_modules/.bun/runed@0.35.1+37e628f89a6bdaed/node_modules/runed/dist/utilities/watch/watch.svelte.js
function runWatcher(sources, flush, effect, options = {}) {
	const { lazy = false } = options;
}
function watch(sources, effect, options) {
	runWatcher(sources, "post", effect, options);
}
function watchPre(sources, effect, options) {
	runWatcher(sources, "pre", effect, options);
}
watch.pre = watchPre;
//#endregion
//#region ../../node_modules/.bun/runed@0.35.1+37e628f89a6bdaed/node_modules/runed/dist/internal/utils/get.js
function get$1(value) {
	if (isFunction(value)) return value();
	return value;
}
//#endregion
//#region ../../node_modules/.bun/runed@0.35.1+37e628f89a6bdaed/node_modules/runed/dist/utilities/element-size/element-size.svelte.js
var ElementSize = class {
	#size = {
		width: 0,
		height: 0
	};
	#observed = false;
	#options;
	#node;
	#window;
	#width = derived(() => {
		this.#subscribe()?.();
		return this.getSize().width;
	});
	#height = derived(() => {
		this.#subscribe()?.();
		return this.getSize().height;
	});
	#subscribe = derived(() => {
		const node$ = get$1(this.#node);
		if (!node$) return;
		return createSubscriber();
	});
	constructor(node, options = { box: "border-box" }) {
		this.#window = options.window ?? defaultWindow;
		this.#options = options;
		this.#node = node;
		this.#size = {
			width: 0,
			height: 0
		};
	}
	calculateSize() {
		const element = get$1(this.#node);
		if (!element || !this.#window) return;
		const offsetWidth = element.offsetWidth;
		const offsetHeight = element.offsetHeight;
		if (this.#options.box === "border-box") return {
			width: offsetWidth,
			height: offsetHeight
		};
		const style = this.#window.getComputedStyle(element);
		const paddingWidth = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
		const paddingHeight = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
		const borderWidth = parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);
		const borderHeight = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
		return {
			width: offsetWidth - paddingWidth - borderWidth,
			height: offsetHeight - paddingHeight - borderHeight
		};
	}
	getSize() {
		return this.#observed ? this.#size : this.calculateSize() ?? this.#size;
	}
	get current() {
		this.#subscribe()?.();
		return this.getSize();
	}
	get width() {
		return this.#width();
	}
	get height() {
		return this.#height();
	}
};
//#endregion
//#region ../../node_modules/.bun/runed@0.35.1+37e628f89a6bdaed/node_modules/runed/dist/utilities/is-mounted/is-mounted.svelte.js
var IsMounted = class {
	#isMounted = false;
	constructor() {}
	get current() {
		return this.#isMounted;
	}
};
//#endregion
//#region ../../node_modules/.bun/runed@0.35.1+37e628f89a6bdaed/node_modules/runed/dist/utilities/previous/previous.svelte.js
var Previous = class {
	#previousCallback = () => void 0;
	#previous = derived(() => this.#previousCallback());
	constructor(getter, initialValue) {
		let actualPrevious = void 0;
		if (initialValue !== void 0) actualPrevious = initialValue;
		this.#previousCallback = () => {
			try {
				return actualPrevious;
			} finally {
				actualPrevious = getter();
			}
		};
	}
	get current() {
		return this.#previous();
	}
};
//#endregion
//#region ../../node_modules/.bun/svelte-toolbelt@0.10.6+37e628f89a6bdaed/node_modules/svelte-toolbelt/dist/utils/after-sleep.js
/**
* A utility function that executes a callback after a specified number of milliseconds.
*/
function afterSleep(ms, cb) {
	return setTimeout(cb, ms);
}
//#endregion
//#region ../../node_modules/.bun/svelte-toolbelt@0.10.6+37e628f89a6bdaed/node_modules/svelte-toolbelt/dist/utils/after-tick.js
function afterTick(fn) {
	(/* @__PURE__ */ tick()).then(fn);
}
//#endregion
//#region ../../node_modules/.bun/svelte-toolbelt@0.10.6+37e628f89a6bdaed/node_modules/svelte-toolbelt/dist/utils/dom.js
var ELEMENT_NODE = 1;
var DOCUMENT_NODE = 9;
var DOCUMENT_FRAGMENT_NODE = 11;
function isHTMLElement$2(node) {
	return isObject(node) && node.nodeType === ELEMENT_NODE && typeof node.nodeName === "string";
}
function isDocument(node) {
	return isObject(node) && node.nodeType === DOCUMENT_NODE;
}
function isWindow(node) {
	return isObject(node) && node.constructor?.name === "VisualViewport";
}
function isNode$1(node) {
	return isObject(node) && node.nodeType !== void 0;
}
function isShadowRoot$1(node) {
	return isNode$1(node) && node.nodeType === DOCUMENT_FRAGMENT_NODE && "host" in node;
}
function contains(parent, child) {
	if (!parent || !child) return false;
	if (!isHTMLElement$2(parent) || !isHTMLElement$2(child)) return false;
	const rootNode = child.getRootNode?.();
	if (parent === child) return true;
	if (parent.contains(child)) return true;
	if (rootNode && isShadowRoot$1(rootNode)) {
		let next = child;
		while (next) {
			if (parent === next) return true;
			next = next.parentNode || next.host;
		}
	}
	return false;
}
function getDocument(node) {
	if (isDocument(node)) return node;
	if (isWindow(node)) return node.document;
	return node?.ownerDocument ?? document;
}
function getWindow$1(node) {
	if (isShadowRoot$1(node)) return getWindow$1(node.host);
	if (isDocument(node)) return node.defaultView ?? window;
	if (isHTMLElement$2(node)) return node.ownerDocument?.defaultView ?? window;
	return window;
}
function getActiveElement(rootNode) {
	let activeElement = rootNode.activeElement;
	while (activeElement?.shadowRoot) {
		const el = activeElement.shadowRoot.activeElement;
		if (el === activeElement) break;
		else activeElement = el;
	}
	return activeElement;
}
//#endregion
//#region ../../node_modules/.bun/svelte-toolbelt@0.10.6+37e628f89a6bdaed/node_modules/svelte-toolbelt/dist/utils/dom-context.svelte.js
var DOMContext = class {
	element;
	#root = derived(() => {
		if (!this.element.current) return document;
		return this.element.current.getRootNode() ?? document;
	});
	get root() {
		return this.#root();
	}
	set root($$value) {
		return this.#root($$value);
	}
	constructor(element) {
		if (typeof element === "function") this.element = boxWith(element);
		else this.element = element;
	}
	getDocument = () => {
		return getDocument(this.root);
	};
	getWindow = () => {
		return this.getDocument().defaultView ?? window;
	};
	getActiveElement = () => {
		return getActiveElement(this.root);
	};
	isActiveElement = (node) => {
		return node === this.getActiveElement();
	};
	getElementById(id) {
		return this.root.getElementById(id);
	}
	querySelector = (selector) => {
		if (!this.root) return null;
		return this.root.querySelector(selector);
	};
	querySelectorAll = (selector) => {
		if (!this.root) return [];
		return this.root.querySelectorAll(selector);
	};
	setTimeout = (callback, delay) => {
		return this.getWindow().setTimeout(callback, delay);
	};
	clearTimeout = (timeoutId) => {
		return this.getWindow().clearTimeout(timeoutId);
	};
};
//#endregion
//#region ../../node_modules/.bun/svelte@5.56.5/node_modules/svelte/src/attachments/index.js
/**
* Creates an object key that will be recognised as an attachment when the object is spread onto an element,
* as a programmatic alternative to using `{@attach ...}`. This can be useful for library authors, though
* is generally not needed when building an app.
*
* ```svelte
* <script>
* 	import { createAttachmentKey } from 'svelte/attachments';
*
* 	const props = {
* 		class: 'cool',
* 		onclick: () => alert('clicked'),
* 		[createAttachmentKey()]: (node) => {
* 			node.textContent = 'attached!';
* 		}
* 	};
* <\/script>
*
* <button {...props}>click me</button>
* ```
* @since 5.29
*/
function createAttachmentKey() {
	return Symbol(ATTACHMENT_KEY);
}
//#endregion
//#region ../../node_modules/.bun/svelte-toolbelt@0.10.6+37e628f89a6bdaed/node_modules/svelte-toolbelt/dist/utils/attach-ref.js
/**
* Creates a Svelte Attachment that attaches a DOM element to a ref.
* The ref can be either a WritableBox or a callback function.
*
* @param ref - Either a WritableBox to store the element in, or a callback function that receives the element
* @param onChange - Optional callback that fires when the ref changes
* @returns An object with a spreadable attachment key that should be spread onto the element
*
* @example
* // Using with WritableBox
* const ref = box<HTMLDivElement | null>(null);
* <div {...attachRef(ref)}>Content</div>
*
* @example
* // Using with callback
* <div {...attachRef((node) => myNode = node)}>Content</div>
*
* @example
* // Using with onChange
* <div {...attachRef(ref, (node) => console.log(node))}>Content</div>
*/
function attachRef(ref, onChange) {
	return { [createAttachmentKey()]: (node) => {
		if (isBox(ref)) {
			ref.current = node;
			run$1(() => onChange?.(node));
			return () => {
				if ("isConnected" in node && node.isConnected) return;
				ref.current = null;
				onChange?.(null);
			};
		}
		ref(node);
		run$1(() => onChange?.(node));
		return () => {
			if ("isConnected" in node && node.isConnected) return;
			ref(null);
			onChange?.(null);
		};
	} };
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/internal/attrs.js
function boolToStr(condition) {
	return condition ? "true" : "false";
}
function boolToStrTrueOrUndef(condition) {
	return condition ? "true" : void 0;
}
function boolToEmptyStrOrUndef(condition) {
	return condition ? "" : void 0;
}
function boolToTrueOrUndef(condition) {
	return condition ? true : void 0;
}
function getDataOpenClosed(condition) {
	return condition ? "open" : "closed";
}
function getDataTransitionAttrs(state) {
	if (state === "starting") return { "data-starting-style": "" };
	if (state === "ending") return { "data-ending-style": "" };
	return {};
}
function getAriaChecked(checked, indeterminate) {
	return checked ? "true" : "false";
}
var BitsAttrs = class {
	#variant;
	#prefix;
	attrs;
	constructor(config) {
		this.#variant = config.getVariant ? config.getVariant() : null;
		this.#prefix = this.#variant ? `data-${this.#variant}-` : `data-${config.component}-`;
		this.getAttr = this.getAttr.bind(this);
		this.selector = this.selector.bind(this);
		this.attrs = Object.fromEntries(config.parts.map((part) => [part, this.getAttr(part)]));
	}
	getAttr(part, variantOverride) {
		if (variantOverride) return `data-${variantOverride}-${part}`;
		return `${this.#prefix}${part}`;
	}
	selector(part, variantOverride) {
		return `[${this.getAttr(part, variantOverride)}]`;
	}
};
function createBitsAttrs(config) {
	const bitsAttrs = new BitsAttrs(config);
	return {
		...bitsAttrs.attrs,
		selector: bitsAttrs.selector,
		getAttr: bitsAttrs.getAttr
	};
}
var ARROW_DOWN = "ArrowDown";
var ARROW_LEFT = "ArrowLeft";
var ARROW_RIGHT = "ArrowRight";
var ARROW_UP = "ArrowUp";
var ENTER = "Enter";
var HOME = "Home";
var PAGE_DOWN = "PageDown";
var PAGE_UP = "PageUp";
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/internal/locale.js
/**
* Detects the text direction in the element.
* @returns {Direction} The text direction ('ltr' for left-to-right or 'rtl' for right-to-left).
*/
function getElemDirection(elem) {
	return window.getComputedStyle(elem).getPropertyValue("direction");
}
/**
* A utility function that returns the next key based on the direction and orientation.
*/
function getNextKey(dir = "ltr", orientation = "horizontal") {
	return {
		horizontal: dir === "rtl" ? ARROW_LEFT : ARROW_RIGHT,
		vertical: ARROW_DOWN
	}[orientation];
}
/**
* A utility function that returns the previous key based on the direction and orientation.
*/
function getPrevKey(dir = "ltr", orientation = "horizontal") {
	return {
		horizontal: dir === "rtl" ? ARROW_RIGHT : ARROW_LEFT,
		vertical: ARROW_UP
	}[orientation];
}
/**
* A utility function that returns the next and previous keys based on the direction
* and orientation.
*/
function getDirectionalKeys(dir = "ltr", orientation = "horizontal") {
	if (!["ltr", "rtl"].includes(dir)) dir = "ltr";
	if (!["horizontal", "vertical"].includes(orientation)) orientation = "horizontal";
	return {
		nextKey: getNextKey(dir, orientation),
		prevKey: getPrevKey(dir, orientation)
	};
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/internal/is.js
var isBrowser = typeof document !== "undefined";
var isIOS = getIsIOS();
function getIsIOS() {
	return isBrowser && window?.navigator?.userAgent && (/iP(ad|hone|od)/.test(window.navigator.userAgent) || window?.navigator?.maxTouchPoints > 2 && /iPad|Macintosh/.test(window?.navigator.userAgent));
}
function isHTMLElement$1(element) {
	return element instanceof HTMLElement;
}
function isElement$1(element) {
	return element instanceof Element;
}
function isElementOrSVGElement(element) {
	return element instanceof Element || element instanceof SVGElement;
}
function isTouch(e) {
	return e.pointerType === "touch";
}
function isFocusVisible(element) {
	return element.matches(":focus-visible");
}
function isNotNull(value) {
	return value !== null;
}
/**
* Determines if the provided object is a valid `HTMLInputElement` with
* a `select` method available.
*/
function isSelectableInput(element) {
	return element instanceof HTMLInputElement && "select" in element;
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/internal/roving-focus-group.js
var RovingFocusGroup = class {
	#opts;
	#currentTabStopId = box(null);
	constructor(opts) {
		this.#opts = opts;
	}
	getCandidateNodes() {
		return [];
	}
	focusFirstCandidate() {
		const items = this.getCandidateNodes();
		if (!items.length) return;
		items[0]?.focus();
	}
	handleKeydown(node, e, both = false) {
		const rootNode = this.#opts.rootNode.current;
		if (!rootNode || !node) return;
		const items = this.getCandidateNodes();
		if (!items.length) return;
		const currentIndex = items.indexOf(node);
		const { nextKey, prevKey } = getDirectionalKeys(getElemDirection(rootNode), this.#opts.orientation.current);
		const loop = this.#opts.loop.current;
		const keyToIndex = {
			[nextKey]: currentIndex + 1,
			[prevKey]: currentIndex - 1,
			[HOME]: 0,
			["End"]: items.length - 1
		};
		if (both) {
			const altNextKey = nextKey === "ArrowDown" ? ARROW_RIGHT : ARROW_DOWN;
			const altPrevKey = prevKey === "ArrowUp" ? ARROW_LEFT : ARROW_UP;
			keyToIndex[altNextKey] = currentIndex + 1;
			keyToIndex[altPrevKey] = currentIndex - 1;
		}
		let itemIndex = keyToIndex[e.key];
		if (itemIndex === void 0) return;
		e.preventDefault();
		if (itemIndex < 0 && loop) itemIndex = items.length - 1;
		else if (itemIndex === items.length && loop) itemIndex = 0;
		const itemToFocus = items[itemIndex];
		if (!itemToFocus) return;
		itemToFocus.focus();
		this.#currentTabStopId.current = itemToFocus.id;
		this.#opts.onCandidateFocus?.(itemToFocus);
		return itemToFocus;
	}
	getTabIndex(node) {
		const items = this.getCandidateNodes();
		const anyActive = this.#currentTabStopId.current !== null;
		if (node && !anyActive && items[0] === node) {
			this.#currentTabStopId.current = node.id;
			return 0;
		} else if (node?.id === this.#currentTabStopId.current) return 0;
		return -1;
	}
	setCurrentTabStopId(id) {
		this.#currentTabStopId.current = id;
	}
	focusCurrentTabStop() {
		const currentTabStopId = this.#currentTabStopId.current;
		if (!currentTabStopId) return;
		const currentTabStop = this.#opts.rootNode.current?.querySelector(`#${currentTabStopId}`);
		if (!currentTabStop || !isHTMLElement$1(currentTabStop)) return;
		currentTabStop.focus();
	}
};
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/internal/animations-complete.js
var AnimationsComplete = class {
	#opts;
	#currentFrame = null;
	#observer = null;
	#runId = 0;
	constructor(opts) {
		this.#opts = opts;
	}
	#cleanup() {
		if (this.#currentFrame !== null) {
			window.cancelAnimationFrame(this.#currentFrame);
			this.#currentFrame = null;
		}
		this.#observer?.disconnect();
		this.#observer = null;
		this.#runId++;
	}
	run(fn) {
		this.#cleanup();
		const node = this.#opts.ref.current;
		if (!node) return;
		if (typeof node.getAnimations !== "function") {
			this.#executeCallback(fn);
			return;
		}
		const runId = this.#runId;
		const executeIfCurrent = () => {
			if (runId !== this.#runId) return;
			this.#executeCallback(fn);
		};
		const waitForAnimations = () => {
			if (runId !== this.#runId) return;
			const animations = node.getAnimations();
			if (animations.length === 0) {
				executeIfCurrent();
				return;
			}
			Promise.all(animations.map((animation) => animation.finished)).then(() => {
				executeIfCurrent();
			}).catch(() => {
				if (runId !== this.#runId) return;
				if (node.getAnimations().some((animation) => animation.pending || animation.playState !== "finished")) {
					waitForAnimations();
					return;
				}
				executeIfCurrent();
			});
		};
		const requestWaitForAnimations = () => {
			this.#currentFrame = window.requestAnimationFrame(() => {
				this.#currentFrame = null;
				waitForAnimations();
			});
		};
		if (!this.#opts.afterTick.current) {
			requestWaitForAnimations();
			return;
		}
		this.#currentFrame = window.requestAnimationFrame(() => {
			this.#currentFrame = null;
			const startingStyleAttr = "data-starting-style";
			if (!node.hasAttribute(startingStyleAttr)) {
				requestWaitForAnimations();
				return;
			}
			this.#observer = new MutationObserver(() => {
				if (runId !== this.#runId) return;
				if (node.hasAttribute(startingStyleAttr)) return;
				this.#observer?.disconnect();
				this.#observer = null;
				requestWaitForAnimations();
			});
			this.#observer.observe(node, {
				attributes: true,
				attributeFilter: [startingStyleAttr]
			});
		});
	}
	#executeCallback(fn) {
		const execute = () => {
			fn();
		};
		if (this.#opts.afterTick) afterTick(execute);
		else execute();
	}
};
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/internal/presence-manager.svelte.js
var PresenceManager = class {
	#opts;
	#enabled;
	#afterAnimations;
	#shouldRender = false;
	#transitionStatus = void 0;
	#hasMounted = false;
	#transitionFrame = null;
	constructor(opts) {
		this.#opts = opts;
		this.#shouldRender = opts.open.current;
		this.#enabled = opts.enabled ?? true;
		this.#afterAnimations = new AnimationsComplete({
			ref: this.#opts.ref,
			afterTick: this.#opts.open
		});
		watch(() => this.#opts.open.current, (isOpen) => {
			if (!this.#hasMounted) {
				this.#hasMounted = true;
				return;
			}
			this.#clearTransitionFrame();
			if (!isOpen && this.#opts.shouldSkipExitAnimation?.()) {
				this.#shouldRender = false;
				this.#transitionStatus = void 0;
				this.#opts.onComplete?.();
				return;
			}
			if (isOpen) this.#shouldRender = true;
			this.#transitionStatus = isOpen ? "starting" : "ending";
			if (isOpen) this.#transitionFrame = window.requestAnimationFrame(() => {
				this.#transitionFrame = null;
				if (this.#opts.open.current) this.#transitionStatus = void 0;
			});
			if (!this.#enabled) {
				if (!isOpen) this.#shouldRender = false;
				this.#transitionStatus = void 0;
				this.#opts.onComplete?.();
				return;
			}
			this.#afterAnimations.run(() => {
				if (isOpen === this.#opts.open.current) {
					if (!this.#opts.open.current) this.#shouldRender = false;
					this.#transitionStatus = void 0;
					this.#opts.onComplete?.();
				}
			});
		});
	}
	get shouldRender() {
		return this.#shouldRender;
	}
	get transitionStatus() {
		return this.#transitionStatus;
	}
	#clearTransitionFrame() {
		if (this.#transitionFrame === null) return;
		window.cancelAnimationFrame(this.#transitionFrame);
		this.#transitionFrame = null;
	}
};
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/accordion/accordion.svelte.js
var accordionAttrs = createBitsAttrs({
	component: "accordion",
	parts: [
		"root",
		"trigger",
		"content",
		"item",
		"header"
	]
});
var AccordionRootContext = new Context("Accordion.Root");
var AccordionItemContext = new Context("Accordion.Item");
var AccordionBaseState = class {
	opts;
	rovingFocusGroup;
	attachment;
	constructor(opts) {
		this.opts = opts;
		this.rovingFocusGroup = new RovingFocusGroup({
			rootNode: this.opts.ref,
			candidateAttr: accordionAttrs.trigger,
			loop: this.opts.loop,
			orientation: this.opts.orientation
		});
		this.attachment = attachRef(this.opts.ref);
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		"data-orientation": this.opts.orientation.current,
		"data-disabled": boolToEmptyStrOrUndef(this.opts.disabled.current),
		[accordionAttrs.root]: "",
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var AccordionSingleState = class extends AccordionBaseState {
	opts;
	isMulti = false;
	constructor(opts) {
		super(opts);
		this.opts = opts;
		this.includesItem = this.includesItem.bind(this);
		this.toggleItem = this.toggleItem.bind(this);
	}
	includesItem(item) {
		return this.opts.value.current === item;
	}
	toggleItem(item) {
		this.opts.value.current = this.includesItem(item) ? "" : item;
	}
};
var AccordionMultiState = class extends AccordionBaseState {
	#value;
	isMulti = true;
	constructor(props) {
		super(props);
		this.#value = props.value;
		this.includesItem = this.includesItem.bind(this);
		this.toggleItem = this.toggleItem.bind(this);
	}
	includesItem(item) {
		return this.#value.current.includes(item);
	}
	toggleItem(item) {
		this.#value.current = this.includesItem(item) ? this.#value.current.filter((v) => v !== item) : [...this.#value.current, item];
	}
};
var AccordionRootState = class {
	static create(props) {
		const { type, ...rest } = props;
		const rootState = type === "single" ? new AccordionSingleState(rest) : new AccordionMultiState(rest);
		return AccordionRootContext.set(rootState);
	}
};
var AccordionItemState = class AccordionItemState {
	static create(props) {
		return AccordionItemContext.set(new AccordionItemState({
			...props,
			rootState: AccordionRootContext.get()
		}));
	}
	opts;
	root;
	#isActive = derived(() => this.root.includesItem(this.opts.value.current));
	get isActive() {
		return this.#isActive();
	}
	set isActive($$value) {
		return this.#isActive($$value);
	}
	#isDisabled = derived(() => this.opts.disabled.current || this.root.opts.disabled.current);
	get isDisabled() {
		return this.#isDisabled();
	}
	set isDisabled($$value) {
		return this.#isDisabled($$value);
	}
	attachment;
	contentNode = null;
	contentPresence;
	constructor(opts) {
		this.opts = opts;
		this.root = opts.rootState;
		this.updateValue = this.updateValue.bind(this);
		this.attachment = attachRef(this.opts.ref);
		this.contentPresence = new PresenceManager({
			ref: boxWith(() => this.contentNode),
			open: boxWith(() => this.isActive)
		});
	}
	updateValue() {
		this.root.toggleItem(this.opts.value.current);
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		"data-state": getDataOpenClosed(this.isActive),
		"data-disabled": boolToEmptyStrOrUndef(this.isDisabled),
		"data-orientation": this.root.opts.orientation.current,
		[accordionAttrs.item]: "",
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var AccordionTriggerState = class AccordionTriggerState {
	opts;
	itemState;
	#root;
	#isDisabled = derived(() => this.opts.disabled.current || this.itemState.opts.disabled.current || this.#root.opts.disabled.current);
	attachment;
	constructor(opts, itemState) {
		this.opts = opts;
		this.itemState = itemState;
		this.#root = itemState.root;
		this.onclick = this.onclick.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
		this.attachment = attachRef(this.opts.ref);
	}
	static create(props) {
		return new AccordionTriggerState(props, AccordionItemContext.get());
	}
	onclick(e) {
		if (this.#isDisabled() || e.button !== 0) {
			e.preventDefault();
			return;
		}
		this.itemState.updateValue();
	}
	onkeydown(e) {
		if (this.#isDisabled()) return;
		if (e.key === " " || e.key === "Enter") {
			e.preventDefault();
			this.itemState.updateValue();
			return;
		}
		this.#root.rovingFocusGroup.handleKeydown(this.opts.ref.current, e);
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		disabled: this.#isDisabled(),
		"aria-expanded": boolToStr(this.itemState.isActive),
		"aria-disabled": boolToStr(this.#isDisabled()),
		"data-disabled": boolToEmptyStrOrUndef(this.#isDisabled()),
		"data-state": getDataOpenClosed(this.itemState.isActive),
		"data-orientation": this.#root.opts.orientation.current,
		[accordionAttrs.trigger]: "",
		tabindex: this.opts.tabindex.current,
		onclick: this.onclick,
		onkeydown: this.onkeydown,
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var AccordionContentState = class AccordionContentState {
	opts;
	item;
	attachment;
	#originalStyles = void 0;
	#isMountAnimationPrevented = false;
	#dimensions = {
		width: 0,
		height: 0
	};
	#open = derived(() => {
		if (this.opts.hiddenUntilFound.current) return this.item.isActive;
		return this.opts.forceMount.current || this.item.isActive;
	});
	get open() {
		return this.#open();
	}
	set open($$value) {
		return this.#open($$value);
	}
	constructor(opts, item) {
		this.opts = opts;
		this.item = item;
		this.#isMountAnimationPrevented = this.item.isActive;
		this.attachment = attachRef(this.opts.ref, (v) => this.item.contentNode = v);
		watch.pre([() => this.opts.ref.current, () => this.opts.hiddenUntilFound.current], ([node, hiddenUntilFound]) => {
			if (!node || !hiddenUntilFound) return;
			const handleBeforeMatch = () => {
				if (this.item.isActive) return;
				requestAnimationFrame(() => {
					this.item.updateValue();
				});
			};
			return on(node, "beforematch", handleBeforeMatch);
		});
		watch([() => this.open, () => this.opts.ref.current], this.#updateDimensions);
	}
	static create(props) {
		return new AccordionContentState(props, AccordionItemContext.get());
	}
	#updateDimensions = ([_, node]) => {
		if (!node) return;
		afterTick(() => {
			const element = this.opts.ref.current;
			if (!element) return;
			this.#originalStyles ??= {
				transitionDuration: element.style.transitionDuration,
				animationName: element.style.animationName
			};
			element.style.transitionDuration = "0s";
			element.style.animationName = "none";
			const rect = element.getBoundingClientRect();
			this.#dimensions = {
				width: rect.width,
				height: rect.height
			};
			if (!this.#isMountAnimationPrevented && this.#originalStyles) {
				element.style.transitionDuration = this.#originalStyles.transitionDuration;
				element.style.animationName = this.#originalStyles.animationName;
			}
		});
	};
	get shouldRender() {
		return this.item.contentPresence.shouldRender;
	}
	#snippetProps = derived(() => ({ open: this.item.isActive }));
	get snippetProps() {
		return this.#snippetProps();
	}
	set snippetProps($$value) {
		return this.#snippetProps($$value);
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		"data-state": getDataOpenClosed(this.item.isActive),
		...getDataTransitionAttrs(this.item.contentPresence.transitionStatus),
		"data-disabled": boolToEmptyStrOrUndef(this.item.isDisabled),
		"data-orientation": this.item.root.opts.orientation.current,
		[accordionAttrs.content]: "",
		style: {
			"--bits-accordion-content-height": `${this.#dimensions.height}px`,
			"--bits-accordion-content-width": `${this.#dimensions.width}px`
		},
		hidden: this.opts.hiddenUntilFound.current && !this.item.isActive ? "until-found" : void 0,
		...this.opts.hiddenUntilFound.current && !this.shouldRender ? {} : { hidden: this.opts.hiddenUntilFound.current ? !this.shouldRender : this.opts.forceMount.current ? void 0 : !this.shouldRender },
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var AccordionHeaderState = class AccordionHeaderState {
	opts;
	item;
	attachment;
	constructor(opts, item) {
		this.opts = opts;
		this.item = item;
		this.attachment = attachRef(this.opts.ref);
	}
	static create(props) {
		return new AccordionHeaderState(props, AccordionItemContext.get());
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		role: "heading",
		"aria-level": this.opts.level.current,
		"data-heading-level": this.opts.level.current,
		"data-state": getDataOpenClosed(this.item.isActive),
		"data-orientation": this.item.root.opts.orientation.current,
		[accordionAttrs.header]: "",
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/internal/noop.js
/**
* A no operation function (does nothing)
*/
function noop$2() {}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/internal/create-id.js
function createId(prefixOrUid, uid) {
	return `bits-${prefixOrUid}`;
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/accordion/components/accordion.svelte
function Accordion($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { disabled = false, children, child, type, value = void 0, ref = null, id = createId(uid), onValueChange = noop$2, loop = true, orientation = "vertical", $$slots, $$events, ...restProps } = $$props;
		function handleDefaultValue() {
			if (value !== void 0) return;
			value = type === "single" ? "" : [];
		}
		handleDefaultValue();
		watch.pre(() => value, () => {
			handleDefaultValue();
		});
		const rootState = AccordionRootState.create({
			type,
			value: boxWith(() => value, (v) => {
				value = v;
				onValueChange(v);
			}),
			id: boxWith(() => id),
			disabled: boxWith(() => disabled),
			loop: boxWith(() => loop),
			orientation: boxWith(() => orientation),
			ref: boxWith(() => ref, (v) => ref = v)
		});
		const mergedProps = derived(() => mergeProps(restProps, rootState.props));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, { props: mergedProps() });
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div${attributes({ ...mergedProps() })}>`);
			children?.($$renderer);
			$$renderer.push(`<!----></div>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, {
			value,
			ref
		});
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/accordion/components/accordion-item.svelte
function Accordion_item($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const defaultId = createId(props_id($$renderer));
		let { id = defaultId, disabled = false, value = defaultId, children, child, ref = null, $$slots, $$events, ...restProps } = $$props;
		const itemState = AccordionItemState.create({
			value: boxWith(() => value),
			disabled: boxWith(() => disabled),
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v)
		});
		const mergedProps = derived(() => mergeProps(restProps, itemState.props));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, { props: mergedProps() });
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div${attributes({ ...mergedProps() })}>`);
			children?.($$renderer);
			$$renderer.push(`<!----></div>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/accordion/components/accordion-header.svelte
function Accordion_header($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { id = createId(uid), level = 2, children, child, ref = null, $$slots, $$events, ...restProps } = $$props;
		const headerState = AccordionHeaderState.create({
			id: boxWith(() => id),
			level: boxWith(() => level),
			ref: boxWith(() => ref, (v) => ref = v)
		});
		const mergedProps = derived(() => mergeProps(restProps, headerState.props));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, { props: mergedProps() });
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div${attributes({ ...mergedProps() })}>`);
			children?.($$renderer);
			$$renderer.push(`<!----></div>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/accordion/components/accordion-trigger.svelte
function Accordion_trigger($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { disabled = false, ref = null, id = createId(uid), tabindex = 0, children, child, $$slots, $$events, ...restProps } = $$props;
		const triggerState = AccordionTriggerState.create({
			disabled: boxWith(() => disabled),
			id: boxWith(() => id),
			tabindex: boxWith(() => tabindex ?? 0),
			ref: boxWith(() => ref, (v) => ref = v)
		});
		const mergedProps = derived(() => mergeProps(restProps, triggerState.props));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, { props: mergedProps() });
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<button${attributes({
				type: "button",
				...mergedProps()
			})}>`);
			children?.($$renderer);
			$$renderer.push(`<!----></button>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/accordion/components/accordion-content.svelte
function Accordion_content($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { child, ref = null, id = createId(uid), forceMount = false, children, hiddenUntilFound = false, $$slots, $$events, ...restProps } = $$props;
		const contentState = AccordionContentState.create({
			forceMount: boxWith(() => forceMount),
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v),
			hiddenUntilFound: boxWith(() => hiddenUntilFound)
		});
		const mergedProps = derived(() => mergeProps(restProps, contentState.props));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, {
				props: mergedProps(),
				...contentState.snippetProps
			});
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div${attributes({ ...mergedProps() })}>`);
			children?.($$renderer);
			$$renderer.push(`<!----></div>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/dialog/dialog.svelte.js
var dialogAttrs = createBitsAttrs({
	component: "dialog",
	parts: [
		"content",
		"trigger",
		"overlay",
		"title",
		"description",
		"close",
		"cancel",
		"action"
	]
});
var DialogRootContext = new Context("Dialog.Root | AlertDialog.Root");
var DialogRootState = class DialogRootState {
	static create(opts) {
		const parent = DialogRootContext.getOr(null);
		return DialogRootContext.set(new DialogRootState(opts, parent));
	}
	opts;
	triggerNode = null;
	contentNode = null;
	overlayNode = null;
	descriptionNode = null;
	contentId = void 0;
	titleId = void 0;
	triggerId = void 0;
	descriptionId = void 0;
	cancelNode = null;
	nestedOpenCount = 0;
	depth;
	parent;
	contentPresence;
	overlayPresence;
	constructor(opts, parent) {
		this.opts = opts;
		this.parent = parent;
		this.depth = parent ? parent.depth + 1 : 0;
		this.handleOpen = this.handleOpen.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.contentPresence = new PresenceManager({
			ref: boxWith(() => this.contentNode),
			open: this.opts.open,
			enabled: true,
			onComplete: () => {
				this.opts.onOpenChangeComplete.current(this.opts.open.current);
			}
		});
		this.overlayPresence = new PresenceManager({
			ref: boxWith(() => this.overlayNode),
			open: this.opts.open,
			enabled: true
		});
		watch(() => this.opts.open.current, (isOpen) => {
			if (!this.parent) return;
			if (isOpen) this.parent.incrementNested();
			else this.parent.decrementNested();
		}, { lazy: true });
	}
	handleOpen() {
		if (this.opts.open.current) return;
		this.opts.open.current = true;
	}
	handleClose() {
		if (!this.opts.open.current) return;
		this.opts.open.current = false;
	}
	getBitsAttr = (part) => {
		return dialogAttrs.getAttr(part, this.opts.variant.current);
	};
	incrementNested() {
		this.nestedOpenCount++;
		this.parent?.incrementNested();
	}
	decrementNested() {
		if (this.nestedOpenCount === 0) return;
		this.nestedOpenCount--;
		this.parent?.decrementNested();
	}
	#sharedProps = derived(() => ({ "data-state": getDataOpenClosed(this.opts.open.current) }));
	get sharedProps() {
		return this.#sharedProps();
	}
	set sharedProps($$value) {
		return this.#sharedProps($$value);
	}
};
var DialogTriggerState = class DialogTriggerState {
	static create(opts) {
		return new DialogTriggerState(opts, DialogRootContext.get());
	}
	opts;
	root;
	attachment;
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref, (v) => {
			this.root.triggerNode = v;
			this.root.triggerId = v?.id;
		});
		this.onclick = this.onclick.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
	}
	onclick(e) {
		if (this.opts.disabled.current) return;
		if (e.button > 0) return;
		this.root.handleOpen();
	}
	onkeydown(e) {
		if (this.opts.disabled.current) return;
		if (e.key === " " || e.key === "Enter") {
			e.preventDefault();
			this.root.handleOpen();
		}
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		"aria-haspopup": "dialog",
		"aria-expanded": boolToStr(this.root.opts.open.current),
		"aria-controls": this.root.contentId,
		[this.root.getBitsAttr("trigger")]: "",
		onkeydown: this.onkeydown,
		onclick: this.onclick,
		disabled: this.opts.disabled.current ? true : void 0,
		...this.root.sharedProps,
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var DialogCloseState = class DialogCloseState {
	static create(opts) {
		return new DialogCloseState(opts, DialogRootContext.get());
	}
	opts;
	root;
	attachment;
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref);
		this.onclick = this.onclick.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
	}
	onclick(e) {
		if (this.opts.disabled.current) return;
		if (e.button > 0) return;
		this.root.handleClose();
	}
	onkeydown(e) {
		if (this.opts.disabled.current) return;
		if (e.key === " " || e.key === "Enter") {
			e.preventDefault();
			this.root.handleClose();
		}
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		[this.root.getBitsAttr(this.opts.variant.current)]: "",
		onclick: this.onclick,
		onkeydown: this.onkeydown,
		disabled: this.opts.disabled.current ? true : void 0,
		tabindex: 0,
		...this.root.sharedProps,
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var DialogTitleState = class DialogTitleState {
	static create(opts) {
		return new DialogTitleState(opts, DialogRootContext.get());
	}
	opts;
	root;
	attachment;
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.root.titleId = this.opts.id.current;
		this.attachment = attachRef(this.opts.ref);
		watch.pre(() => this.opts.id.current, (id) => {
			this.root.titleId = id;
		});
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		role: "heading",
		"aria-level": this.opts.level.current,
		[this.root.getBitsAttr("title")]: "",
		...this.root.sharedProps,
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var DialogDescriptionState = class DialogDescriptionState {
	static create(opts) {
		return new DialogDescriptionState(opts, DialogRootContext.get());
	}
	opts;
	root;
	attachment;
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.root.descriptionId = this.opts.id.current;
		this.attachment = attachRef(this.opts.ref, (v) => {
			this.root.descriptionNode = v;
		});
		watch.pre(() => this.opts.id.current, (id) => {
			this.root.descriptionId = id;
		});
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		[this.root.getBitsAttr("description")]: "",
		...this.root.sharedProps,
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var DialogContentState = class DialogContentState {
	static create(opts) {
		return new DialogContentState(opts, DialogRootContext.get());
	}
	opts;
	root;
	attachment;
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref, (v) => {
			this.root.contentNode = v;
			this.root.contentId = v?.id;
		});
	}
	#snippetProps = derived(() => ({ open: this.root.opts.open.current }));
	get snippetProps() {
		return this.#snippetProps();
	}
	set snippetProps($$value) {
		return this.#snippetProps($$value);
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		role: this.root.opts.variant.current === "alert-dialog" ? "alertdialog" : "dialog",
		"aria-modal": "true",
		"aria-describedby": this.root.descriptionId,
		"aria-labelledby": this.root.titleId,
		[this.root.getBitsAttr("content")]: "",
		style: {
			pointerEvents: "auto",
			outline: this.root.opts.variant.current === "alert-dialog" ? "none" : void 0,
			"--bits-dialog-depth": this.root.depth,
			"--bits-dialog-nested-count": this.root.nestedOpenCount,
			contain: "layout style"
		},
		tabindex: this.root.opts.variant.current === "alert-dialog" ? -1 : void 0,
		"data-nested-open": boolToEmptyStrOrUndef(this.root.nestedOpenCount > 0),
		"data-nested": boolToEmptyStrOrUndef(this.root.parent !== null),
		...getDataTransitionAttrs(this.root.contentPresence.transitionStatus),
		...this.root.sharedProps,
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
	get shouldRender() {
		return this.root.contentPresence.shouldRender;
	}
};
var DialogOverlayState = class DialogOverlayState {
	static create(opts) {
		return new DialogOverlayState(opts, DialogRootContext.get());
	}
	opts;
	root;
	attachment;
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref, (v) => this.root.overlayNode = v);
	}
	#snippetProps = derived(() => ({ open: this.root.opts.open.current }));
	get snippetProps() {
		return this.#snippetProps();
	}
	set snippetProps($$value) {
		return this.#snippetProps($$value);
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		[this.root.getBitsAttr("overlay")]: "",
		style: {
			pointerEvents: "auto",
			"--bits-dialog-depth": this.root.depth,
			"--bits-dialog-nested-count": this.root.nestedOpenCount
		},
		"data-nested-open": boolToEmptyStrOrUndef(this.root.nestedOpenCount > 0),
		"data-nested": boolToEmptyStrOrUndef(this.root.parent !== null),
		...getDataTransitionAttrs(this.root.overlayPresence.transitionStatus),
		...this.root.sharedProps,
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
	get shouldRender() {
		return this.root.overlayPresence.shouldRender;
	}
};
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/dialog/components/dialog-title.svelte
function Dialog_title($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { id = createId(uid), ref = null, child, children, level = 2, $$slots, $$events, ...restProps } = $$props;
		const titleState = DialogTitleState.create({
			id: boxWith(() => id),
			level: boxWith(() => level),
			ref: boxWith(() => ref, (v) => ref = v)
		});
		const mergedProps = derived(() => mergeProps(restProps, titleState.props));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, { props: mergedProps() });
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div${attributes({ ...mergedProps() })}>`);
			children?.($$renderer);
			$$renderer.push(`<!----></div>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/utilities/config/bits-config.js
var BitsConfigContext = new Context("BitsConfig");
/**
* Gets the current Bits UI configuration state from the context.
*
* Returns a default configuration (where all values are `undefined`) if no configuration is found.
*/
function getBitsConfig() {
	const fallback = new BitsConfigState(null, {});
	return BitsConfigContext.getOr(fallback).opts;
}
/**
* Configuration state that inherits from parent configurations.
*
* @example
* Config resolution:
* ```
* Level 1: { defaultPortalTo: "#some-element", theme: "dark" }
* Level 2: { spacing: "large" } // inherits defaultPortalTo="#some-element", theme="dark"
* Level 3: { theme: "light" }   // inherits defaultPortalTo="#some-element", spacing="large", overrides theme="light"
* ```
*/
var BitsConfigState = class {
	opts;
	constructor(parent, opts) {
		const resolveConfigOption = createConfigResolver(parent, opts);
		this.opts = {
			defaultPortalTo: resolveConfigOption((config) => config.defaultPortalTo),
			defaultLocale: resolveConfigOption((config) => config.defaultLocale)
		};
	}
};
/**
* Returns a config resolver that resolves a given config option's value.
*
* The resolver creates reactive boxes that resolve config option values using this priority:
* 1. Current level's value (if defined)
* 2. Parent level's value (if defined and current is undefined)
* 3. `undefined` (if no value is found in either parent or child)
*
* @param parent - Parent configuration state (null if this is root level)
* @param currentOpts - Current level's configuration options
*
* @example
* ```typescript
* // Given this hierarchy:
* // Root: { defaultPortalTo: "#some-element" }
* // Child: { someOtherProp: "value" } // no defaultPortalTo specified
*
* const resolveConfigOption = createConfigResolver(parent, opts);
* const portalTo = resolveConfigOption(config => config.defaultPortalTo);
*
* // portalTo.current === "#some-element" (inherited from parent)
* // even when child didn't specify `defaultPortalTo`
* ```
*/
function createConfigResolver(parent, currentOpts) {
	return (getter) => {
		return boxWith(() => {
			const value = getter(currentOpts)?.current;
			if (value !== void 0) return value;
			if (parent === null) return void 0;
			return getter(parent.opts)?.current;
		});
	};
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/utilities/config/prop-resolvers.js
/**
* Creates a generic prop resolver that follows a standard priority chain:
* 1. The getter's prop value (if defined)
* 2. The config default value (if no getter prop value is defined)
* 3. The fallback value (if no config value found)
*/
function createPropResolver(configOption, fallback) {
	return (getProp) => {
		const config = getBitsConfig();
		return boxWith(() => {
			const propValue = getProp();
			if (propValue !== void 0) return propValue;
			const option = configOption(config).current;
			if (option !== void 0) return option;
			return fallback;
		});
	};
}
/**
* Resolves a portal's `to` value using the prop, the config default, or a fallback.
*
* Default value: `"body"`
*/
var resolvePortalToProp = createPropResolver((config) => config.defaultPortalTo, "body");
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/utilities/portal/portal.svelte
function Portal($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { to: toProp, children, disabled } = $$props;
		const to = resolvePortalToProp(() => toProp);
		getAllContexts();
		let target = derived(getTarget);
		function getTarget() {
			if (!isBrowser || disabled) return null;
			let localTarget = null;
			if (typeof to.current === "string") localTarget = document.querySelector(to.current);
			else localTarget = to.current;
			return localTarget;
		}
		let instance;
		function unmountInstance() {
			if (instance) {
				unmount();
				instance = null;
			}
		}
		watch([() => target(), () => disabled], ([target, disabled]) => {
			if (!target || disabled) {
				unmountInstance();
				return;
			}
			instance = mount();
			return () => {
				unmountInstance();
			};
		});
		if (disabled) {
			$$renderer.push("<!--[0-->");
			children?.($$renderer);
			$$renderer.push(`<!---->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/internal/events.js
/**
* Creates a typed event dispatcher and listener pair for custom events
* @template T - The type of data that will be passed in the event detail
* @param eventName - The name of the custom event
* @param options - CustomEvent options (bubbles, cancelable, etc.)
*/
var CustomEventDispatcher = class {
	eventName;
	options;
	constructor(eventName, options = {
		bubbles: true,
		cancelable: true
	}) {
		this.eventName = eventName;
		this.options = options;
	}
	createEvent(detail) {
		return new CustomEvent(this.eventName, {
			...this.options,
			detail
		});
	}
	dispatch(element, detail) {
		const event = this.createEvent(detail);
		element.dispatchEvent(event);
		return event;
	}
	listen(element, callback, options) {
		const handler = (event) => {
			callback(event);
		};
		return on(element, this.eventName, handler, options);
	}
};
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/internal/debounce.js
function debounce(fn, wait = 500) {
	let timeout = null;
	const debounced = (...args) => {
		if (timeout !== null) clearTimeout(timeout);
		timeout = setTimeout(() => {
			fn(...args);
		}, wait);
	};
	debounced.destroy = () => {
		if (timeout !== null) {
			clearTimeout(timeout);
			timeout = null;
		}
	};
	return debounced;
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/internal/elements.js
function isOrContainsTarget(node, target) {
	return node === target || node.contains(target);
}
function getOwnerDocument(el) {
	return el?.ownerDocument ?? document;
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/internal/dom.js
function getFirstNonCommentChild(element) {
	if (!element) return null;
	for (const child of element.childNodes) if (child.nodeType !== Node.COMMENT_NODE) return child;
	return null;
}
/**
* Determines if the click event truly occurred outside the content node.
* This was added to handle password managers and other elements that may be injected
* into the DOM but visually appear inside the content.
*/
function isClickTrulyOutside(event, contentNode) {
	const { clientX, clientY } = event;
	const rect = contentNode.getBoundingClientRect();
	return clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom;
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/menu/utils.js
var SELECTION_KEYS$1 = [ENTER, " "];
var FIRST_KEYS$1 = [
	ARROW_DOWN,
	PAGE_UP,
	HOME
];
var LAST_KEYS$1 = [
	ARROW_UP,
	PAGE_DOWN,
	"End"
];
var FIRST_LAST_KEYS$1 = [...FIRST_KEYS$1, ...LAST_KEYS$1];
var SUB_OPEN_KEYS = {
	ltr: [...SELECTION_KEYS$1, ARROW_RIGHT],
	rtl: [...SELECTION_KEYS$1, ARROW_LEFT]
};
var SUB_CLOSE_KEYS = {
	ltr: [ARROW_LEFT],
	rtl: [ARROW_RIGHT]
};
function isMouseEvent(event) {
	return event.pointerType === "mouse";
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/internal/focus.js
/**
* A utility function that focuses an element.
*/
function focus(element, { select = false } = {}) {
	if (!element || !element.focus) return;
	const doc = getDocument(element);
	if (doc.activeElement === element) return;
	const previouslyFocusedElement = doc.activeElement;
	element.focus({ preventScroll: true });
	if (element !== previouslyFocusedElement && isSelectableInput(element) && select) element.select();
}
/**
* Attempts to focus the first element in a list of candidates.
* Stops when focus is successful.
*/
function focusFirst(candidates, { select = false } = {}, getActiveElement) {
	const previouslyFocusedElement = getActiveElement();
	for (const candidate of candidates) {
		focus(candidate, { select });
		if (getActiveElement() !== previouslyFocusedElement) return true;
	}
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/utilities/is-using-keyboard/is-using-keyboard.svelte.js
var isUsingKeyboard = false;
var IsUsingKeyboard = class {
	static _refs = 0;
	static _cleanup;
	constructor() {}
	get current() {
		return isUsingKeyboard;
	}
	set current(value) {
		isUsingKeyboard = value;
	}
};
//#endregion
//#region ../../node_modules/.bun/tabbable@6.5.0/node_modules/tabbable/dist/index.esm.js
/*!
* tabbable 6.5.0
* @license MIT, https://github.com/focus-trap/tabbable/blob/master/LICENSE
*/
var candidateSelectors = [
	"input:not([inert]):not([inert] *)",
	"select:not([inert]):not([inert] *)",
	"textarea:not([inert]):not([inert] *)",
	"a[href]:not([inert]):not([inert] *)",
	"area[href]:not([inert]):not([inert] *)",
	"button:not([inert]):not([inert] *)",
	"[tabindex]:not(slot):not([inert]):not([inert] *)",
	"audio[controls]:not([inert]):not([inert] *)",
	"video[controls]:not([inert]):not([inert] *)",
	"[contenteditable]:not([contenteditable=\"false\"]):not([inert]):not([inert] *)",
	"details>summary:first-of-type:not([inert]):not([inert] *)",
	"details:not([inert]):not([inert] *)"
];
var candidateSelector = /* #__PURE__ */ candidateSelectors.join(",");
var NoElement = typeof Element === "undefined";
var matches = NoElement ? function() {} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
var getRootNode = !NoElement && Element.prototype.getRootNode ? function(element) {
	var _element$getRootNode;
	return element === null || element === void 0 ? void 0 : (_element$getRootNode = element.getRootNode) === null || _element$getRootNode === void 0 ? void 0 : _element$getRootNode.call(element);
} : function(element) {
	return element === null || element === void 0 ? void 0 : element.ownerDocument;
};
/**
* Determines if a node is inert or in an inert ancestor.
* @param {Node} [node]
* @param {boolean} [lookUp] If true and `node` is not inert, looks up at ancestors to
*  see if any of them are inert. If false, only `node` itself is considered.
* @returns {boolean} True if inert itself or by way of being in an inert ancestor.
*  False if `node` is falsy.
*/
var _isInert = function isInert(node, lookUp) {
	var _node$getAttribute;
	if (lookUp === void 0) lookUp = true;
	var inertAtt = node === null || node === void 0 ? void 0 : (_node$getAttribute = node.getAttribute) === null || _node$getAttribute === void 0 ? void 0 : _node$getAttribute.call(node, "inert");
	return inertAtt === "" || inertAtt === "true" || lookUp && node && (typeof node.closest === "function" ? node.closest("[inert]") : _isInert(node.parentNode));
};
/**
* Determines if a node's content is editable.
* @param {Element} [node]
* @returns True if it's content-editable; false if it's not or `node` is falsy.
*/
var isContentEditable = function isContentEditable(node) {
	var _node$getAttribute2;
	var attValue = node === null || node === void 0 ? void 0 : (_node$getAttribute2 = node.getAttribute) === null || _node$getAttribute2 === void 0 ? void 0 : _node$getAttribute2.call(node, "contenteditable");
	return attValue === "" || attValue === "true";
};
/**
* @param {Element} el container to check in
* @param {boolean} includeContainer add container to check
* @param {(node: Element) => boolean} filter filter candidates
* @returns {Element[]}
*/
var getCandidates = function getCandidates(el, includeContainer, filter) {
	if (_isInert(el)) return [];
	var candidates = Array.prototype.slice.apply(el.querySelectorAll(candidateSelector));
	if (includeContainer && matches.call(el, candidateSelector)) candidates.unshift(el);
	candidates = candidates.filter(filter);
	return candidates;
};
/**
* @callback GetShadowRoot
* @param {Element} element to check for shadow root
* @returns {ShadowRoot|boolean} ShadowRoot if available or boolean indicating if a shadowRoot is attached but not available.
*/
/**
* @callback ShadowRootFilter
* @param {Element} shadowHostNode the element which contains shadow content
* @returns {boolean} true if a shadow root could potentially contain valid candidates.
*/
/**
* @typedef {Object} CandidateScope
* @property {Element} scopeParent contains inner candidates
* @property {Element[]} candidates list of candidates found in the scope parent
*/
/**
* @typedef {Object} IterativeOptions
* @property {GetShadowRoot|boolean} getShadowRoot true if shadow support is enabled; falsy if not;
*  if a function, implies shadow support is enabled and either returns the shadow root of an element
*  or a boolean stating if it has an undisclosed shadow root
* @property {(node: Element) => boolean} filter filter candidates
* @property {boolean} flatten if true then result will flatten any CandidateScope into the returned list
* @property {ShadowRootFilter} shadowRootFilter filter shadow roots;
*/
/**
* @param {Element[]} elements list of element containers to match candidates from
* @param {boolean} includeContainer add container list to check
* @param {IterativeOptions} options
* @returns {Array.<Element|CandidateScope>}
*/
var _getCandidatesIteratively = function getCandidatesIteratively(elements, includeContainer, options) {
	var candidates = [];
	var elementsToCheck = Array.from(elements);
	while (elementsToCheck.length) {
		var element = elementsToCheck.shift();
		if (_isInert(element, false)) continue;
		if (element.tagName === "SLOT") {
			var assigned = element.assignedElements();
			var nestedCandidates = _getCandidatesIteratively(assigned.length ? assigned : element.children, true, options);
			if (options.flatten) candidates.push.apply(candidates, nestedCandidates);
			else candidates.push({
				scopeParent: element,
				candidates: nestedCandidates
			});
		} else {
			if (matches.call(element, candidateSelector) && options.filter(element) && (includeContainer || !elements.includes(element))) candidates.push(element);
			var shadowRoot = element.shadowRoot || typeof options.getShadowRoot === "function" && options.getShadowRoot(element);
			var validShadowRoot = !_isInert(shadowRoot, false) && (!options.shadowRootFilter || options.shadowRootFilter(element));
			if (shadowRoot && validShadowRoot) {
				var _nestedCandidates = _getCandidatesIteratively(shadowRoot === true ? element.children : shadowRoot.children, true, options);
				if (options.flatten) candidates.push.apply(candidates, _nestedCandidates);
				else candidates.push({
					scopeParent: element,
					candidates: _nestedCandidates
				});
			} else elementsToCheck.unshift.apply(elementsToCheck, element.children);
		}
	}
	return candidates;
};
/**
* @private
* Determines if the node has an explicitly specified `tabindex` attribute.
* @param {HTMLElement} node
* @returns {boolean} True if so; false if not.
*/
var hasTabIndex = function hasTabIndex(node) {
	return !isNaN(parseInt(node.getAttribute("tabindex"), 10));
};
/**
* Determine the tab index of a given node.
* @param {HTMLElement} node
* @returns {number} Tab order (negative, 0, or positive number).
* @throws {Error} If `node` is falsy.
*/
var getTabIndex = function getTabIndex(node) {
	if (!node) throw new Error("No node provided");
	if (node.tabIndex < 0) {
		if ((/^(AUDIO|VIDEO|DETAILS)$/.test(node.tagName) || isContentEditable(node)) && !hasTabIndex(node)) return 0;
	}
	return node.tabIndex;
};
/**
* Determine the tab index of a given node __for sort order purposes__.
* @param {HTMLElement} node
* @param {boolean} [isScope] True for a custom element with shadow root or slot that, by default,
*  has tabIndex -1, but needs to be sorted by document order in order for its content to be
*  inserted into the correct sort position.
* @returns {number} Tab order (negative, 0, or positive number).
*/
var getSortOrderTabIndex = function getSortOrderTabIndex(node, isScope) {
	var tabIndex = getTabIndex(node);
	if (tabIndex < 0 && isScope && !hasTabIndex(node)) return 0;
	return tabIndex;
};
var sortOrderedTabbables = function sortOrderedTabbables(a, b) {
	return a.tabIndex === b.tabIndex ? a.documentOrder - b.documentOrder : a.tabIndex - b.tabIndex;
};
var isInput = function isInput(node) {
	return node.tagName === "INPUT";
};
var isHiddenInput = function isHiddenInput(node) {
	return isInput(node) && node.type === "hidden";
};
var isDetailsWithSummary = function isDetailsWithSummary(node) {
	return node.tagName === "DETAILS" && Array.prototype.slice.apply(node.children).some(function(child) {
		return child.tagName === "SUMMARY";
	});
};
var getCheckedRadio = function getCheckedRadio(nodes, form) {
	for (var i = 0; i < nodes.length; i++) if (nodes[i].checked && nodes[i].form === form) return nodes[i];
};
var isTabbableRadio = function isTabbableRadio(node) {
	if (!node.name) return true;
	var radioScope = node.form || getRootNode(node);
	var queryRadios = function queryRadios(name) {
		return radioScope.querySelectorAll("input[type=\"radio\"][name=\"" + name + "\"]");
	};
	var radioSet;
	if (typeof window !== "undefined" && typeof window.CSS !== "undefined" && typeof window.CSS.escape === "function") radioSet = queryRadios(window.CSS.escape(node.name));
	else try {
		radioSet = queryRadios(node.name);
	} catch (err) {
		console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s", err.message);
		return false;
	}
	var checked = getCheckedRadio(radioSet, node.form);
	return !checked || checked === node;
};
var isRadio = function isRadio(node) {
	return isInput(node) && node.type === "radio";
};
var isNonTabbableRadio = function isNonTabbableRadio(node) {
	return isRadio(node) && !isTabbableRadio(node);
};
var isNodeAttached = function isNodeAttached(node) {
	var _nodeRoot;
	var nodeRoot = node && getRootNode(node);
	var nodeRootHost = (_nodeRoot = nodeRoot) === null || _nodeRoot === void 0 ? void 0 : _nodeRoot.host;
	var attached = false;
	if (nodeRoot && nodeRoot !== node) {
		var _nodeRootHost, _nodeRootHost$ownerDo, _node$ownerDocument;
		attached = !!((_nodeRootHost = nodeRootHost) !== null && _nodeRootHost !== void 0 && (_nodeRootHost$ownerDo = _nodeRootHost.ownerDocument) !== null && _nodeRootHost$ownerDo !== void 0 && _nodeRootHost$ownerDo.contains(nodeRootHost) || node !== null && node !== void 0 && (_node$ownerDocument = node.ownerDocument) !== null && _node$ownerDocument !== void 0 && _node$ownerDocument.contains(node));
		while (!attached && nodeRootHost) {
			var _nodeRoot2, _nodeRootHost2, _nodeRootHost2$ownerD;
			nodeRoot = getRootNode(nodeRootHost);
			nodeRootHost = (_nodeRoot2 = nodeRoot) === null || _nodeRoot2 === void 0 ? void 0 : _nodeRoot2.host;
			attached = !!((_nodeRootHost2 = nodeRootHost) !== null && _nodeRootHost2 !== void 0 && (_nodeRootHost2$ownerD = _nodeRootHost2.ownerDocument) !== null && _nodeRootHost2$ownerD !== void 0 && _nodeRootHost2$ownerD.contains(nodeRootHost));
		}
	}
	return attached;
};
var isZeroArea = function isZeroArea(node) {
	var _node$getBoundingClie = node.getBoundingClientRect(), width = _node$getBoundingClie.width, height = _node$getBoundingClie.height;
	return width === 0 && height === 0;
};
var isHidden = function isHidden(node, _ref) {
	var displayCheck = _ref.displayCheck, getShadowRoot = _ref.getShadowRoot;
	if (displayCheck === "full-native") {
		if ("checkVisibility" in node) return !node.checkVisibility({
			checkOpacity: false,
			opacityProperty: false,
			contentVisibilityAuto: true,
			visibilityProperty: true,
			checkVisibilityCSS: true
		});
	}
	var visibility = getComputedStyle(node).visibility;
	if (visibility === "hidden" || visibility === "collapse") return true;
	var nodeUnderDetails = matches.call(node, "details>summary:first-of-type") ? node.parentElement : node;
	if (matches.call(nodeUnderDetails, "details:not([open]) *")) return true;
	if (!displayCheck || displayCheck === "full" || displayCheck === "full-native" || displayCheck === "legacy-full") {
		if (typeof getShadowRoot === "function") {
			var originalNode = node;
			while (node) {
				var parentElement = node.parentElement;
				var rootNode = getRootNode(node);
				if (parentElement && !parentElement.shadowRoot && getShadowRoot(parentElement) === true) return isZeroArea(node);
				else if (node.assignedSlot) node = node.assignedSlot;
				else if (!parentElement && rootNode !== node.ownerDocument) node = rootNode.host;
				else node = parentElement;
			}
			node = originalNode;
		}
		if (isNodeAttached(node)) return !node.getClientRects().length;
		if (displayCheck !== "legacy-full") return true;
	} else if (displayCheck === "non-zero-area") return isZeroArea(node);
	return false;
};
var isDisabledFromFieldset = function isDisabledFromFieldset(node) {
	if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(node.tagName)) {
		var parentNode = node.parentElement;
		while (parentNode) {
			if (parentNode.tagName === "FIELDSET" && parentNode.disabled) {
				for (var i = 0; i < parentNode.children.length; i++) {
					var child = parentNode.children.item(i);
					if (child.tagName === "LEGEND") return matches.call(parentNode, "fieldset[disabled] *") ? true : !child.contains(node);
				}
				return true;
			}
			parentNode = parentNode.parentElement;
		}
	}
	return false;
};
var isNodeMatchingSelectorFocusable = function isNodeMatchingSelectorFocusable(options, node) {
	if (node.disabled || isHiddenInput(node) || isHidden(node, options) || isDetailsWithSummary(node) || isDisabledFromFieldset(node)) return false;
	return true;
};
var isNodeMatchingSelectorTabbable = function isNodeMatchingSelectorTabbable(options, node) {
	if (isNonTabbableRadio(node) || getTabIndex(node) < 0 || !isNodeMatchingSelectorFocusable(options, node)) return false;
	return true;
};
var isShadowRootTabbable = function isShadowRootTabbable(shadowHostNode) {
	var tabIndex = parseInt(shadowHostNode.getAttribute("tabindex"), 10);
	if (isNaN(tabIndex) || tabIndex >= 0) return true;
	return false;
};
/**
* @param {Array.<Element|CandidateScope>} candidates
* @returns Element[]
*/
var _sortByOrder = function sortByOrder(candidates) {
	var regularTabbables = [];
	var orderedTabbables = [];
	candidates.forEach(function(item, i) {
		var isScope = !!item.scopeParent;
		var element = isScope ? item.scopeParent : item;
		var candidateTabindex = getSortOrderTabIndex(element, isScope);
		var elements = isScope ? _sortByOrder(item.candidates) : element;
		if (candidateTabindex === 0) isScope ? regularTabbables.push.apply(regularTabbables, elements) : regularTabbables.push(element);
		else orderedTabbables.push({
			documentOrder: i,
			tabIndex: candidateTabindex,
			item,
			isScope,
			content: elements
		});
	});
	return orderedTabbables.sort(sortOrderedTabbables).reduce(function(acc, sortable) {
		sortable.isScope ? acc.push.apply(acc, sortable.content) : acc.push(sortable.content);
		return acc;
	}, []).concat(regularTabbables);
};
var tabbable = function tabbable(container, options) {
	options = options || {};
	var candidates;
	if (options.getShadowRoot) candidates = _getCandidatesIteratively([container], options.includeContainer, {
		filter: isNodeMatchingSelectorTabbable.bind(null, options),
		flatten: false,
		getShadowRoot: options.getShadowRoot,
		shadowRootFilter: isShadowRootTabbable
	});
	else candidates = getCandidates(container, options.includeContainer, isNodeMatchingSelectorTabbable.bind(null, options));
	return _sortByOrder(candidates);
};
var focusable = function focusable(container, options) {
	options = options || {};
	var candidates;
	if (options.getShadowRoot) candidates = _getCandidatesIteratively([container], options.includeContainer, {
		filter: isNodeMatchingSelectorFocusable.bind(null, options),
		flatten: true,
		getShadowRoot: options.getShadowRoot
	});
	else candidates = getCandidates(container, options.includeContainer, isNodeMatchingSelectorFocusable.bind(null, options));
	return candidates;
};
var isTabbable = function isTabbable(node, options) {
	options = options || {};
	if (!node) throw new Error("No node provided");
	if (matches.call(node, candidateSelector) === false) return false;
	return isNodeMatchingSelectorTabbable(options, node);
};
var focusableCandidateSelector = /* #__PURE__ */ candidateSelectors.concat("iframe:not([inert]):not([inert] *)").join(",");
var isFocusable = function isFocusable(node, options) {
	options = options || {};
	if (!node) throw new Error("No node provided");
	if (matches.call(node, focusableCandidateSelector) === false) return false;
	return isNodeMatchingSelectorFocusable(options, node);
};
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/internal/tabbable.js
function getTabbableOptions() {
	return {
		getShadowRoot: true,
		displayCheck: typeof ResizeObserver === "function" && ResizeObserver.toString().includes("[native code]") ? "full" : "none"
	};
}
/**
* Gets all tabbable elements in the body and finds the next/previous tabbable element
* from the `currentNode` based on the `direction` provided.
* @param currentNode - the node we want to get the next/previous tabbable from
*/
function getTabbableFrom(currentNode, direction) {
	if (!isTabbable(currentNode, getTabbableOptions())) return getTabbableFromFocusable(currentNode, direction);
	const doc = getDocument(currentNode);
	const allTabbable = tabbable(doc.body, getTabbableOptions());
	if (direction === "prev") allTabbable.reverse();
	const activeIndex = allTabbable.indexOf(currentNode);
	if (activeIndex === -1) return doc.body;
	return allTabbable.slice(activeIndex + 1)[0];
}
function getTabbableFromFocusable(currentNode, direction) {
	const doc = getDocument(currentNode);
	if (!isFocusable(currentNode, getTabbableOptions())) return doc.body;
	const allFocusable = focusable(doc.body, getTabbableOptions());
	if (direction === "prev") allFocusable.reverse();
	const activeIndex = allFocusable.indexOf(currentNode);
	if (activeIndex === -1) return doc.body;
	return allFocusable.slice(activeIndex + 1).find((node) => isTabbable(node, getTabbableOptions())) ?? doc.body;
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/internal/arrays.js
/**
* Returns the array element after the given index, or undefined for out-of-bounds or empty arrays.
* @param array the array.
* @param index the index of the current element.
* @param loop loop to the beginning of the array if the next index is out of bounds?
*/
/**
* Returns the array element after the given index, or undefined for out-of-bounds or empty arrays.
* For single-element arrays, returns the element if the index is 0.
* @param array the array.
* @param index the index of the current element.
* @param loop loop to the beginning of the array if the next index is out of bounds?
*/
function next(array, index, loop = true) {
	if (array.length === 0 || index < 0 || index >= array.length) return;
	if (array.length === 1 && index === 0) return array[0];
	if (index === array.length - 1) return loop ? array[0] : void 0;
	return array[index + 1];
}
/**
* Returns the array element prior to the given index, or undefined for out-of-bounds or empty arrays.
* For single-element arrays, returns the element if the index is 0.
* @param array the array.
* @param index the index of the current element.
* @param loop loop to the end of the array if the previous index is out of bounds?
*/
function prev(array, index, loop = true) {
	if (array.length === 0 || index < 0 || index >= array.length) return;
	if (array.length === 1 && index === 0) return array[0];
	if (index === 0) return loop ? array[array.length - 1] : void 0;
	return array[index - 1];
}
/**
* Returns the element some number after the given index. If the target index is out of bounds:
*   - If looping is disabled, the first or last element will be returned.
*   - If looping is enabled, it will wrap around the array.
* Returns undefined for empty arrays or out-of-bounds initial indices.
* @param array the array.
* @param index the index of the current element.
* @param increment the number of elements to move forward (can be negative).
* @param loop loop around the array if the target index is out of bounds?
*/
function forward(array, index, increment, loop = true) {
	if (array.length === 0 || index < 0 || index >= array.length) return;
	let targetIndex = index + increment;
	if (loop) targetIndex = (targetIndex % array.length + array.length) % array.length;
	else targetIndex = Math.max(0, Math.min(targetIndex, array.length - 1));
	return array[targetIndex];
}
/**
* Returns the element some number before the given index. If the target index is out of bounds:
*   - If looping is disabled, the first or last element will be returned.
*   - If looping is enabled, it will wrap around the array.
* Returns undefined for empty arrays or out-of-bounds initial indices.
* @param array the array.
* @param index the index of the current element.
* @param decrement the number of elements to move backward (can be negative).
* @param loop loop around the array if the target index is out of bounds?
*/
function backward(array, index, decrement, loop = true) {
	if (array.length === 0 || index < 0 || index >= array.length) return;
	let targetIndex = index - decrement;
	if (loop) targetIndex = (targetIndex % array.length + array.length) % array.length;
	else targetIndex = Math.max(0, Math.min(targetIndex, array.length - 1));
	return array[targetIndex];
}
/**
* Finds the next matching item from a list of values based on a search string.
*
* This function handles several special cases in typeahead behavior:
*
* 1. Space handling: When a search string ends with a space, it handles it specially:
*    - If there's only one match for the text before the space, it ignores the space
*    - If there are multiple matches and the current match already starts with the search prefix
*      followed by a space, it keeps the current match (doesn't change selection on space)
*    - Only after typing characters beyond the space will it move to a more specific match
*
* 2. Repeated character handling: If a search consists of repeated characters (e.g., "aaa"),
*    it treats it as a single character for matching purposes
*
* 3. Cycling behavior: The function wraps around the values array starting from the current match
*    to find the next appropriate match, creating a cycling selection behavior
*
* @param values - Array of string values to search through (e.g., the text content of menu items)
* @param search - The current search string typed by the user
* @param currentMatch - The currently selected/matched item, if any
* @returns The next matching value that should be selected, or undefined if no match is found
*/
function getNextMatch(values, search, currentMatch) {
	const lowerSearch = search.toLowerCase();
	if (lowerSearch.endsWith(" ")) {
		const searchWithoutSpace = lowerSearch.slice(0, -1);
		/**
		* If there's only one match for the prefix without space, we don't
		* watch to match with space.
		*/
		if (values.filter((value) => value.toLowerCase().startsWith(searchWithoutSpace)).length <= 1) return getNextMatch(values, searchWithoutSpace, currentMatch);
		const currentMatchLowercase = currentMatch?.toLowerCase();
		/**
		* If the current match already starts with the search prefix and has a space afterward,
		* and the user has only typed up to that space, keep the current match until they
		* disambiguate.
		*/
		if (currentMatchLowercase && currentMatchLowercase.startsWith(searchWithoutSpace) && currentMatchLowercase.charAt(searchWithoutSpace.length) === " " && search.trim() === searchWithoutSpace) return currentMatch;
		/**
		* With multiple matches, find items that match the full search string with space
		*/
		const spacedMatches = values.filter((value) => value.toLowerCase().startsWith(lowerSearch));
		/**
		* If we found matches with the space, use the first one that's not the current match
		*/
		if (spacedMatches.length > 0) {
			const currentMatchIndex = currentMatch ? values.indexOf(currentMatch) : -1;
			return wrapArray(spacedMatches, Math.max(currentMatchIndex, 0)).find((match) => match !== currentMatch) || currentMatch;
		}
	}
	const normalizedSearch = search.length > 1 && Array.from(search).every((char) => char === search[0]) ? search[0] : search;
	const normalizedLowerSearch = normalizedSearch.toLowerCase();
	const currentMatchIndex = currentMatch ? values.indexOf(currentMatch) : -1;
	let wrappedValues = wrapArray(values, Math.max(currentMatchIndex, 0));
	if (normalizedSearch.length === 1) wrappedValues = wrappedValues.filter((v) => v !== currentMatch);
	const nextMatch = wrappedValues.find((value) => value?.toLowerCase().startsWith(normalizedLowerSearch));
	return nextMatch !== currentMatch ? nextMatch : void 0;
}
/**
* Wraps an array around itself at a given start index
* Example: `wrapArray(['a', 'b', 'c', 'd'], 2) === ['c', 'd', 'a', 'b']`
*/
function wrapArray(array, startIndex) {
	return array.map((_, index) => array[(startIndex + index) % array.length]);
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/internal/box-auto-reset.svelte.js
var defaultOptions = {
	afterMs: 1e4,
	onChange: noop$2
};
function boxAutoReset(defaultValue, options) {
	const { afterMs, onChange, getWindow } = {
		...defaultOptions,
		...options
	};
	let timeout = null;
	let value = defaultValue;
	function resetAfter() {
		return getWindow().setTimeout(() => {
			value = defaultValue;
			onChange?.(defaultValue);
		}, afterMs);
	}
	return boxWith(() => value, (v) => {
		value = v;
		onChange?.(v);
		if (timeout) getWindow().clearTimeout(timeout);
		timeout = resetAfter();
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/internal/dom-typeahead.svelte.js
var DOMTypeahead = class {
	#opts;
	#search;
	#onMatch = derived(() => {
		if (this.#opts.onMatch) return this.#opts.onMatch;
		return (node) => node.focus();
	});
	#getCurrentItem = derived(() => {
		if (this.#opts.getCurrentItem) return this.#opts.getCurrentItem;
		return this.#opts.getActiveElement;
	});
	constructor(opts) {
		this.#opts = opts;
		this.#search = boxAutoReset("", {
			afterMs: 1e3,
			getWindow: opts.getWindow
		});
		this.handleTypeaheadSearch = this.handleTypeaheadSearch.bind(this);
		this.resetTypeahead = this.resetTypeahead.bind(this);
	}
	handleTypeaheadSearch(key, candidates) {
		if (!candidates.length) return;
		this.#search.current = this.#search.current + key;
		const currentItem = this.#getCurrentItem()();
		const currentMatch = candidates.find((item) => item === currentItem)?.textContent?.trim() ?? "";
		const nextMatch = getNextMatch(candidates.map((item) => item.textContent?.trim() ?? ""), this.#search.current, currentMatch);
		const newItem = candidates.find((item) => item.textContent?.trim() === nextMatch);
		if (newItem) this.#onMatch()(newItem);
		return newItem;
	}
	resetTypeahead() {
		this.#search.current = "";
	}
	get search() {
		return this.#search.current;
	}
};
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/menu/menu.svelte.js
var CONTEXT_MENU_TRIGGER_ATTR = "data-context-menu-trigger";
var CONTEXT_MENU_CONTENT_ATTR = "data-context-menu-content";
var MenuRootContext = new Context("Menu.Root");
var MenuMenuContext = new Context("Menu.Root | Menu.Sub");
var MenuContentContext = new Context("Menu.Content");
var MenuGroupContext = new Context("Menu.Group | Menu.RadioGroup");
var MenuOpenEvent = new CustomEventDispatcher("bitsmenuopen", {
	bubbles: false,
	cancelable: true
});
var menuAttrs = createBitsAttrs({
	component: "menu",
	parts: [
		"trigger",
		"content",
		"sub-trigger",
		"item",
		"group",
		"group-heading",
		"checkbox-group",
		"checkbox-item",
		"radio-group",
		"radio-item",
		"separator",
		"sub-content",
		"arrow"
	]
});
var MenuSubmenuIntent = class {
	#opts;
	#cleanupDocMove = null;
	#fallbackTimer = null;
	#active = false;
	#target = null;
	#apex = null;
	#pointerPoint = null;
	#launchPoint = null;
	constructor(opts) {
		this.#opts = opts;
		watch([
			opts.triggerNode,
			opts.contentNode,
			opts.enabled
		], ([triggerNode, contentNode, enabled]) => {
			this.#reset();
			if (!triggerNode || !contentNode || !enabled) return;
			const onTriggerMove = (e) => {
				if (!isMouseEvent(e)) return;
				this.#launchPoint = {
					x: e.clientX,
					y: e.clientY
				};
				if (!this.#active) this.#preview(e, "content");
			};
			const onTriggerLeave = (e) => {
				if (!isMouseEvent(e)) return;
				this.#engage(e, "content");
			};
			const onContentMove = (e) => {
				if (!isMouseEvent(e)) return;
				if (!this.#active) this.#preview(e, "trigger");
			};
			const onContentLeave = (e) => {
				if (!isMouseEvent(e)) return;
				if (isElement$1(e.relatedTarget)) {
					const selector = this.#opts.subContentSelector();
					const matchedSubContent = e.relatedTarget.closest(selector);
					if (matchedSubContent && matchedSubContent !== contentNode && matchedSubContent.id) {
						if (!!contentNode.querySelector(`[aria-controls="${matchedSubContent.id}"]`)) return;
					}
				}
				this.#engage(e, "trigger");
			};
			const onTriggerEnter = (e) => {
				if (!isMouseEvent(e)) return;
				this.#disengage();
			};
			const onContentEnter = (e) => {
				if (!isMouseEvent(e)) return;
				this.#disengage();
			};
			triggerNode.addEventListener("pointermove", onTriggerMove);
			triggerNode.addEventListener("pointerleave", onTriggerLeave);
			triggerNode.addEventListener("pointerenter", onTriggerEnter);
			contentNode.addEventListener("pointermove", onContentMove);
			contentNode.addEventListener("pointerleave", onContentLeave);
			contentNode.addEventListener("pointerenter", onContentEnter);
			return () => {
				triggerNode.removeEventListener("pointermove", onTriggerMove);
				triggerNode.removeEventListener("pointerleave", onTriggerLeave);
				triggerNode.removeEventListener("pointerenter", onTriggerEnter);
				contentNode.removeEventListener("pointermove", onContentMove);
				contentNode.removeEventListener("pointerleave", onContentLeave);
				contentNode.removeEventListener("pointerenter", onContentEnter);
				this.#reset();
			};
		});
	}
	#parentTargetRect() {
		const parent = this.#opts.parentContentNode();
		if (parent) return parent.getBoundingClientRect();
		return this.#opts.triggerNode()?.getBoundingClientRect() ?? null;
	}
	#computePolygons(pointerPt, target) {
		const triggerNode = this.#opts.triggerNode();
		const contentNode = this.#opts.contentNode();
		if (!triggerNode || !contentNode) return null;
		const triggerRect = triggerNode.getBoundingClientRect();
		const contentRect = contentNode.getBoundingClientRect();
		const side = getSide$2(triggerRect, contentRect);
		let apex;
		let targetRect;
		let sourceRect;
		if (target === "content") {
			apex = this.#active ? this.#apex ?? pointerPt : pointerPt;
			targetRect = contentRect;
		} else {
			apex = this.#launchPoint ?? pointerPt;
			targetRect = this.#parentTargetRect() ?? triggerRect;
			sourceRect = contentRect;
		}
		this.#apex = apex;
		return {
			corridor: getCorridorPolygon(triggerRect, contentRect, side),
			intent: getIntentPolygon(apex, targetRect, side, target, sourceRect),
			targetRect,
			side
		};
	}
	#isInSafeZone(pt, corridor, intent) {
		return isPointInPolygon$1(pt, corridor) || isPointInPolygon$1(pt, intent);
	}
	#preview(e, target) {
		const pt = {
			x: e.clientX,
			y: e.clientY
		};
		if (!this.#computePolygons(pt, target)) return;
		this.#target = target;
		this.#pointerPoint = pt;
	}
	#engage(e, target) {
		if (!this.#opts.enabled()) return;
		const triggerNode = this.#opts.triggerNode();
		const contentNode = this.#opts.contentNode();
		if (!triggerNode || !contentNode) return;
		const related = e.relatedTarget;
		if (isElement$1(related)) {
			if (target === "content" && contentNode.contains(related)) return;
			if (target === "trigger" && triggerNode.contains(related)) return;
		}
		const pt = {
			x: e.clientX,
			y: e.clientY
		};
		const geo = this.#computePolygons(pt, target);
		if (!geo) return;
		if (!isInsideRect$1(pt, geo.targetRect) && !this.#isInSafeZone(pt, geo.corridor, geo.intent)) {
			this.#clearVisuals();
			return;
		}
		this.#active = true;
		this.#target = target;
		this.#pointerPoint = pt;
		this.#opts.setIsPointerInTransit(true);
		this.#attachDocMove();
		this.#startFallback();
	}
	#disengageTimer = null;
	#disengage() {
		if (!this.#active) return;
		const wasReturning = this.#target === "trigger";
		this.#detachDocMove();
		this.#clearFallback();
		this.#active = false;
		this.#clearVisuals();
		if (wasReturning) {
			this.#clearDisengageTimer();
			this.#disengageTimer = setTimeout(() => {
				this.#disengageTimer = null;
				this.#opts.setIsPointerInTransit(false);
			}, 100);
		} else this.#opts.setIsPointerInTransit(false);
	}
	#clearDisengageTimer() {
		if (this.#disengageTimer === null) return;
		clearTimeout(this.#disengageTimer);
		this.#disengageTimer = null;
	}
	#intentExit() {
		const pointerPoint = this.#pointerPoint;
		this.#detachDocMove();
		this.#clearFallback();
		this.#clearDisengageTimer();
		this.#active = false;
		this.#opts.setIsPointerInTransit(false);
		this.#clearVisuals();
		this.#opts.onIntentExit(pointerPoint);
	}
	#reset() {
		this.#detachDocMove();
		this.#clearFallback();
		this.#clearDisengageTimer();
		if (this.#active) this.#opts.setIsPointerInTransit(false);
		this.#active = false;
		this.#target = null;
		this.#apex = null;
		this.#pointerPoint = null;
		this.#launchPoint = null;
	}
	#isPointerInDescendantSubContent(pt) {
		const contentNode = this.#opts.contentNode();
		if (!contentNode) return false;
		const el = contentNode.ownerDocument.elementFromPoint(pt.x, pt.y);
		if (!el) return false;
		const selector = this.#opts.subContentSelector();
		const subContent = el.closest(selector);
		if (!subContent || subContent === contentNode) return false;
		if (subContent.id) return !!contentNode.querySelector(`[aria-controls="${subContent.id}"]`);
		return false;
	}
	#onDocMove = (e) => {
		if (!this.#active || !this.#target) return;
		if (!isMouseEvent(e)) return;
		const triggerNode = this.#opts.triggerNode();
		const contentNode = this.#opts.contentNode();
		if (!triggerNode || !contentNode) {
			this.#intentExit();
			return;
		}
		this.#clearFallback();
		const pt = {
			x: e.clientX,
			y: e.clientY
		};
		this.#pointerPoint = pt;
		const triggerRect = triggerNode.getBoundingClientRect();
		const contentRect = contentNode.getBoundingClientRect();
		if (this.#target === "content" && isInsideRect$1(pt, contentRect)) {
			this.#disengage();
			return;
		}
		if (this.#target === "trigger" && isInsideInsetRect(pt, triggerRect, 4)) {
			this.#disengage();
			return;
		}
		if (this.#isPointerInDescendantSubContent(pt)) {
			this.#startFallback();
			return;
		}
		const geo = this.#computePolygons(pt, this.#target);
		if (!geo) {
			this.#intentExit();
			return;
		}
		if (this.#isInSafeZone(pt, geo.corridor, geo.intent)) {
			this.#startFallback();
			return;
		}
		this.#intentExit();
	};
	#attachDocMove() {
		if (this.#cleanupDocMove) return;
		const doc = getDocument(this.#opts.triggerNode() ?? this.#opts.contentNode());
		if (!doc) return;
		doc.addEventListener("pointermove", this.#onDocMove, true);
		this.#cleanupDocMove = () => {
			doc.removeEventListener("pointermove", this.#onDocMove, true);
			this.#cleanupDocMove = null;
		};
	}
	#detachDocMove() {
		this.#cleanupDocMove?.();
	}
	#startFallback() {
		this.#clearFallback();
		this.#fallbackTimer = setTimeout(() => {
			this.#fallbackTimer = null;
			if (this.#active) this.#intentExit();
		}, 500);
	}
	#clearFallback() {
		if (this.#fallbackTimer === null) return;
		clearTimeout(this.#fallbackTimer);
		this.#fallbackTimer = null;
	}
	#clearVisuals() {
		this.#target = null;
		this.#apex = null;
		this.#pointerPoint = null;
	}
};
function isPointInPolygon$1(point, polygon) {
	const { x, y } = point;
	let inside = false;
	for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
		const xi = polygon[i].x;
		const yi = polygon[i].y;
		const xj = polygon[j].x;
		const yj = polygon[j].y;
		if (yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
	}
	return inside;
}
function isInsideRect$1(point, rect) {
	return point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom;
}
function isInsideInsetRect(point, rect, inset) {
	return point.x >= rect.left + inset && point.x <= rect.right - inset && point.y >= rect.top + inset && point.y <= rect.bottom - inset;
}
function getSide$2(triggerRect, contentRect) {
	const triggerCenterX = triggerRect.left + triggerRect.width / 2;
	const triggerCenterY = triggerRect.top + triggerRect.height / 2;
	const contentCenterX = contentRect.left + contentRect.width / 2;
	const contentCenterY = contentRect.top + contentRect.height / 2;
	const deltaX = contentCenterX - triggerCenterX;
	const deltaY = contentCenterY - triggerCenterY;
	if (Math.abs(deltaX) > Math.abs(deltaY)) return deltaX > 0 ? "right" : "left";
	return deltaY > 0 ? "bottom" : "top";
}
function getCorridorPolygon(triggerRect, contentRect, side) {
	const buffer = 2;
	switch (side) {
		case "top": return [
			{
				x: Math.min(triggerRect.left, contentRect.left) - buffer,
				y: triggerRect.top
			},
			{
				x: Math.min(triggerRect.left, contentRect.left) - buffer,
				y: contentRect.bottom
			},
			{
				x: Math.max(triggerRect.right, contentRect.right) + buffer,
				y: contentRect.bottom
			},
			{
				x: Math.max(triggerRect.right, contentRect.right) + buffer,
				y: triggerRect.top
			}
		];
		case "bottom": return [
			{
				x: Math.min(triggerRect.left, contentRect.left) - buffer,
				y: triggerRect.bottom
			},
			{
				x: Math.min(triggerRect.left, contentRect.left) - buffer,
				y: contentRect.top
			},
			{
				x: Math.max(triggerRect.right, contentRect.right) + buffer,
				y: contentRect.top
			},
			{
				x: Math.max(triggerRect.right, contentRect.right) + buffer,
				y: triggerRect.bottom
			}
		];
		case "left": return [
			{
				x: triggerRect.left,
				y: Math.min(triggerRect.top, contentRect.top) - buffer
			},
			{
				x: contentRect.right,
				y: Math.min(triggerRect.top, contentRect.top) - buffer
			},
			{
				x: contentRect.right,
				y: Math.max(triggerRect.bottom, contentRect.bottom) + buffer
			},
			{
				x: triggerRect.left,
				y: Math.max(triggerRect.bottom, contentRect.bottom) + buffer
			}
		];
		case "right": return [
			{
				x: triggerRect.right,
				y: Math.min(triggerRect.top, contentRect.top) - buffer
			},
			{
				x: contentRect.left,
				y: Math.min(triggerRect.top, contentRect.top) - buffer
			},
			{
				x: contentRect.left,
				y: Math.max(triggerRect.bottom, contentRect.bottom) + buffer
			},
			{
				x: triggerRect.right,
				y: Math.max(triggerRect.bottom, contentRect.bottom) + buffer
			}
		];
	}
}
function getIntentPolygon(exitPoint, targetRect, side, target, sourceRect) {
	const edgeBuffer = 8;
	const effectiveSide = target === "trigger" ? flipSide(side) : side;
	const top = sourceRect ? Math.min(targetRect.top, sourceRect.top) - edgeBuffer : targetRect.top - edgeBuffer;
	const bottom = sourceRect ? Math.max(targetRect.bottom, sourceRect.bottom) + edgeBuffer : targetRect.bottom + edgeBuffer;
	const left = sourceRect ? Math.min(targetRect.left, sourceRect.left) - edgeBuffer : targetRect.left - edgeBuffer;
	const right = sourceRect ? Math.max(targetRect.right, sourceRect.right) + edgeBuffer : targetRect.right + edgeBuffer;
	switch (effectiveSide) {
		case "right": return [
			exitPoint,
			{
				x: targetRect.left,
				y: top
			},
			{
				x: targetRect.left,
				y: bottom
			}
		];
		case "left": return [
			exitPoint,
			{
				x: targetRect.right,
				y: top
			},
			{
				x: targetRect.right,
				y: bottom
			}
		];
		case "bottom": return [
			exitPoint,
			{
				x: left,
				y: targetRect.top
			},
			{
				x: right,
				y: targetRect.top
			}
		];
		case "top": return [
			exitPoint,
			{
				x: left,
				y: targetRect.bottom
			},
			{
				x: right,
				y: targetRect.bottom
			}
		];
	}
}
function flipSide(side) {
	switch (side) {
		case "top": return "bottom";
		case "bottom": return "top";
		case "left": return "right";
		case "right": return "left";
	}
}
var MenuRootState = class MenuRootState {
	static create(opts) {
		const root = new MenuRootState(opts);
		return MenuRootContext.set(root);
	}
	opts;
	isUsingKeyboard = new IsUsingKeyboard();
	ignoreCloseAutoFocus = false;
	isPointerInTransit = false;
	constructor(opts) {
		this.opts = opts;
	}
	getBitsAttr = (part) => {
		return menuAttrs.getAttr(part, this.opts.variant.current);
	};
};
var MenuMenuState = class MenuMenuState {
	static create(opts, root) {
		return MenuMenuContext.set(new MenuMenuState(opts, root, null));
	}
	opts;
	root;
	parentMenu;
	contentId = boxWith(() => "");
	contentNode = null;
	contentPresence;
	triggerNode = null;
	constructor(opts, root, parentMenu) {
		this.opts = opts;
		this.root = root;
		this.parentMenu = parentMenu;
		this.contentPresence = new PresenceManager({
			ref: boxWith(() => this.contentNode),
			open: this.opts.open,
			onComplete: () => {
				this.opts.onOpenChangeComplete.current(this.opts.open.current);
			},
			shouldSkipExitAnimation: () => {
				if (this.root.opts.variant.current !== "menubar" || this.parentMenu !== null) return false;
				return this.root.opts.shouldSkipExitAnimation?.() ?? false;
			}
		});
		if (parentMenu) watch(() => parentMenu.opts.open.current, () => {
			if (parentMenu.opts.open.current) return;
			this.opts.open.current = false;
		});
	}
	toggleOpen() {
		this.opts.open.current = !this.opts.open.current;
	}
	onOpen() {
		this.opts.open.current = true;
	}
	onClose() {
		this.opts.open.current = false;
	}
};
var MenuContentState = class MenuContentState {
	static create(opts) {
		return MenuContentContext.set(new MenuContentState(opts, MenuMenuContext.get()));
	}
	opts;
	parentMenu;
	rovingFocusGroup;
	domContext;
	attachment;
	search = "";
	#timer = 0;
	#handleTypeaheadSearch;
	mounted = false;
	#isSub;
	constructor(opts, parentMenu) {
		this.opts = opts;
		this.parentMenu = parentMenu;
		this.domContext = new DOMContext(opts.ref);
		this.attachment = attachRef(this.opts.ref, (v) => {
			if (this.parentMenu.contentNode !== v) this.parentMenu.contentNode = v;
		});
		parentMenu.contentId = opts.id;
		this.#isSub = opts.isSub ?? false;
		this.onkeydown = this.onkeydown.bind(this);
		this.onblur = this.onblur.bind(this);
		this.onfocus = this.onfocus.bind(this);
		this.handleInteractOutside = this.handleInteractOutside.bind(this);
		new MenuSubmenuIntent({
			contentNode: () => this.parentMenu.contentNode,
			triggerNode: () => this.parentMenu.triggerNode,
			parentContentNode: () => this.parentMenu.parentMenu?.contentNode ?? null,
			subContentSelector: () => `[${this.parentMenu.root.getBitsAttr("sub-content")}]`,
			enabled: () => this.parentMenu.opts.open.current && Boolean(this.parentMenu.triggerNode?.hasAttribute(this.parentMenu.root.getBitsAttr("sub-trigger"))),
			onIntentExit: (pointerPoint) => {
				this.parentMenu.opts.open.current = false;
				this.#dispatchPointerMoveToHoveredSubTrigger(pointerPoint);
			},
			setIsPointerInTransit: (value) => {
				this.parentMenu.root.isPointerInTransit = value;
			}
		});
		this.#handleTypeaheadSearch = new DOMTypeahead({
			getActiveElement: () => this.domContext.getActiveElement(),
			getWindow: () => this.domContext.getWindow()
		}).handleTypeaheadSearch;
		this.rovingFocusGroup = new RovingFocusGroup({
			rootNode: boxWith(() => this.parentMenu.contentNode),
			candidateAttr: this.parentMenu.root.getBitsAttr("item"),
			loop: this.opts.loop,
			orientation: boxWith(() => "vertical")
		});
		watch(() => this.parentMenu.contentNode, (contentNode) => {
			if (!contentNode) return;
			const handler = () => {
				afterTick(() => {
					if (!this.parentMenu.root.isUsingKeyboard.current) return;
					this.rovingFocusGroup.focusFirstCandidate();
				});
			};
			return MenuOpenEvent.listen(contentNode, handler);
		});
	}
	#getCandidateNodes() {
		const node = this.parentMenu.contentNode;
		if (!node) return [];
		return Array.from(node.querySelectorAll(`[${this.parentMenu.root.getBitsAttr("item")}]:not([data-disabled])`));
	}
	#isPointerMovingToSubmenu() {
		return this.parentMenu.root.isPointerInTransit;
	}
	#dispatchPointerMoveToHoveredSubTrigger(pointerPoint) {
		if (!pointerPoint) return;
		const parentContentNode = this.parentMenu.parentMenu?.contentNode;
		if (!parentContentNode) return;
		const hoveredNode = this.domContext.getDocument().elementFromPoint(pointerPoint.x, pointerPoint.y);
		if (!isElement$1(hoveredNode)) return;
		const hoveredSubTrigger = hoveredNode.closest(`[${this.parentMenu.root.getBitsAttr("sub-trigger")}]`);
		if (!hoveredSubTrigger || !parentContentNode.contains(hoveredSubTrigger)) return;
		if (hoveredSubTrigger === this.parentMenu.triggerNode) return;
		hoveredSubTrigger.dispatchEvent(new PointerEvent("pointermove", {
			bubbles: true,
			cancelable: true,
			pointerType: "mouse",
			clientX: pointerPoint.x,
			clientY: pointerPoint.y
		}));
	}
	onCloseAutoFocus = (e) => {
		this.opts.onCloseAutoFocus.current?.(e);
		if (e.defaultPrevented || this.#isSub) return;
		if (this.parentMenu.root.ignoreCloseAutoFocus) {
			e.preventDefault();
			return;
		}
		if (this.parentMenu.triggerNode && isTabbable(this.parentMenu.triggerNode)) {
			e.preventDefault();
			this.parentMenu.triggerNode.focus();
		}
	};
	handleTabKeyDown(e) {
		/**
		* We locate the root `menu`'s trigger by going up the tree until
		* we find a menu that has no parent. This will allow us to focus the next
		* tabbable element before/after the root trigger.
		*/
		let rootMenu = this.parentMenu;
		while (rootMenu.parentMenu !== null) rootMenu = rootMenu.parentMenu;
		if (!rootMenu.triggerNode) return;
		e.preventDefault();
		const nodeToFocus = getTabbableFrom(rootMenu.triggerNode, e.shiftKey ? "prev" : "next");
		if (nodeToFocus) {
			/**
			* We set a flag to ignore the `onCloseAutoFocus` event handler
			* as well as the fallbacks inside the focus scope to prevent
			* race conditions causing focus to fall back to the body even
			* though we're trying to focus the next tabbable element.
			*/
			this.parentMenu.root.ignoreCloseAutoFocus = true;
			rootMenu.onClose();
			afterTick(() => {
				nodeToFocus.focus();
				afterTick(() => {
					this.parentMenu.root.ignoreCloseAutoFocus = false;
				});
			});
		} else this.domContext.getDocument().body.focus();
	}
	onkeydown(e) {
		if (e.defaultPrevented) return;
		if (e.key === "Tab") {
			this.handleTabKeyDown(e);
			return;
		}
		const target = e.target;
		const currentTarget = e.currentTarget;
		if (!isHTMLElement$1(target) || !isHTMLElement$1(currentTarget)) return;
		const isKeydownInside = target.closest(`[${this.parentMenu.root.getBitsAttr("content")}]`)?.id === this.parentMenu.contentId.current;
		const isModifierKey = e.ctrlKey || e.altKey || e.metaKey;
		const isCharacterKey = e.key.length === 1;
		if (this.rovingFocusGroup.handleKeydown(target, e)) return;
		if (e.code === "Space") return;
		const candidateNodes = this.#getCandidateNodes();
		if (isKeydownInside) {
			if (!isModifierKey && isCharacterKey) this.#handleTypeaheadSearch(e.key, candidateNodes);
		}
		if (e.target?.id !== this.parentMenu.contentId.current) return;
		if (!FIRST_LAST_KEYS$1.includes(e.key)) return;
		e.preventDefault();
		if (LAST_KEYS$1.includes(e.key)) candidateNodes.reverse();
		focusFirst(candidateNodes, { select: false }, () => this.domContext.getActiveElement());
	}
	onblur(e) {
		if (!isElement$1(e.currentTarget)) return;
		if (!isElement$1(e.target)) return;
		if (!e.currentTarget.contains?.(e.target)) {
			this.domContext.getWindow().clearTimeout(this.#timer);
			this.search = "";
		}
	}
	onfocus(_) {
		if (!this.parentMenu.root.isUsingKeyboard.current) return;
		afterTick(() => this.rovingFocusGroup.focusFirstCandidate());
	}
	onItemEnter() {
		return this.#isPointerMovingToSubmenu();
	}
	onItemLeave(e) {
		if (e.currentTarget.hasAttribute(this.parentMenu.root.getBitsAttr("sub-trigger"))) return;
		if (this.#isPointerMovingToSubmenu() || this.parentMenu.root.isUsingKeyboard.current) return;
		this.parentMenu.contentNode?.focus({ preventScroll: true });
		this.rovingFocusGroup.setCurrentTabStopId("");
	}
	onTriggerLeave() {
		if (this.#isPointerMovingToSubmenu()) return true;
		return false;
	}
	handleInteractOutside(e) {
		if (!isElementOrSVGElement(e.target)) return;
		const triggerId = this.parentMenu.triggerNode?.id;
		if (e.target.id === triggerId) {
			e.preventDefault();
			return;
		}
		if (e.target.closest(`#${triggerId}`)) {
			e.preventDefault();
			return;
		}
		/**
		* when the menu closes due to an outside pointer interaction (for example,
		* clicking another dropdown trigger), avoid focusing this menu's trigger
		* to prevent stealing focus from the new interaction target.
		*/
		this.parentMenu.root.ignoreCloseAutoFocus = true;
		afterTick(() => {
			this.parentMenu.root.ignoreCloseAutoFocus = false;
		});
	}
	get shouldRender() {
		return this.parentMenu.contentPresence.shouldRender;
	}
	#snippetProps = derived(() => ({ open: this.parentMenu.opts.open.current }));
	get snippetProps() {
		return this.#snippetProps();
	}
	set snippetProps($$value) {
		return this.#snippetProps($$value);
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		role: "menu",
		"aria-orientation": "vertical",
		[this.parentMenu.root.getBitsAttr("content")]: "",
		"data-state": getDataOpenClosed(this.parentMenu.opts.open.current),
		...getDataTransitionAttrs(this.parentMenu.contentPresence.transitionStatus),
		onkeydown: this.onkeydown,
		onblur: this.onblur,
		onfocus: this.onfocus,
		dir: this.parentMenu.root.opts.dir.current,
		style: {
			pointerEvents: "auto",
			contain: "layout style"
		},
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
	popperProps = { onCloseAutoFocus: (e) => this.onCloseAutoFocus(e) };
};
var MenuItemSharedState = class {
	opts;
	content;
	attachment;
	#isFocused = false;
	constructor(opts, content) {
		this.opts = opts;
		this.content = content;
		this.attachment = attachRef(this.opts.ref);
		this.onpointermove = this.onpointermove.bind(this);
		this.onpointerleave = this.onpointerleave.bind(this);
		this.onfocus = this.onfocus.bind(this);
		this.onblur = this.onblur.bind(this);
	}
	onpointermove(e) {
		if (e.defaultPrevented) return;
		if (!isMouseEvent(e)) return;
		if (this.opts.disabled.current) this.content.onItemLeave(e);
		else {
			if (this.content.onItemEnter()) return;
			const item = e.currentTarget;
			if (!isHTMLElement$1(item)) return;
			item.focus({ preventScroll: true });
		}
	}
	onpointerleave(e) {
		if (e.defaultPrevented) return;
		if (!isMouseEvent(e)) return;
		this.content.onItemLeave(e);
	}
	onfocus(e) {
		afterTick(() => {
			if (e.defaultPrevented || this.opts.disabled.current) return;
			this.#isFocused = true;
		});
	}
	onblur(e) {
		afterTick(() => {
			if (e.defaultPrevented) return;
			this.#isFocused = false;
		});
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		tabindex: -1,
		role: "menuitem",
		"aria-disabled": boolToStr(this.opts.disabled.current),
		"data-disabled": boolToEmptyStrOrUndef(this.opts.disabled.current),
		"data-highlighted": this.#isFocused ? "" : void 0,
		[this.content.parentMenu.root.getBitsAttr("item")]: "",
		onpointermove: this.onpointermove,
		onpointerleave: this.onpointerleave,
		onfocus: this.onfocus,
		onblur: this.onblur,
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var MenuItemState = class MenuItemState {
	static create(opts) {
		const item = new MenuItemSharedState(opts, MenuContentContext.get());
		return new MenuItemState(opts, item);
	}
	opts;
	item;
	root;
	#isPointerDown = false;
	constructor(opts, item) {
		this.opts = opts;
		this.item = item;
		this.root = item.content.parentMenu.root;
		this.onkeydown = this.onkeydown.bind(this);
		this.onclick = this.onclick.bind(this);
		this.onpointerdown = this.onpointerdown.bind(this);
		this.onpointerup = this.onpointerup.bind(this);
	}
	#handleSelect() {
		if (this.item.opts.disabled.current) return;
		const selectEvent = new CustomEvent("menuitemselect", {
			bubbles: true,
			cancelable: true
		});
		this.opts.onSelect.current(selectEvent);
		if (selectEvent.defaultPrevented) {
			this.item.content.parentMenu.root.isUsingKeyboard.current = false;
			return;
		}
		if (this.opts.closeOnSelect.current) this.item.content.parentMenu.root.opts.onClose();
	}
	onkeydown(e) {
		const isTypingAhead = this.item.content.search !== "";
		if (this.item.opts.disabled.current || isTypingAhead && e.key === " ") return;
		if (SELECTION_KEYS$1.includes(e.key)) {
			if (!isHTMLElement$1(e.currentTarget)) return;
			e.currentTarget.click();
			/**
			* We prevent default browser behavior for selection keys as they should trigger
			* a selection only:
			* - prevents space from scrolling the page.
			* - if keydown causes focus to move, prevents keydown from firing on the new target.
			*/
			e.preventDefault();
		}
	}
	onclick(_) {
		if (this.item.opts.disabled.current) return;
		this.#handleSelect();
	}
	onpointerup(e) {
		if (e.defaultPrevented) return;
		if (!this.#isPointerDown) {
			if (!isHTMLElement$1(e.currentTarget)) return;
			e.currentTarget?.click();
		}
	}
	onpointerdown(_) {
		this.#isPointerDown = true;
	}
	#props = derived(() => mergeProps(this.item.props, {
		onclick: this.onclick,
		onpointerdown: this.onpointerdown,
		onpointerup: this.onpointerup,
		onkeydown: this.onkeydown
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var MenuSubTriggerState = class MenuSubTriggerState {
	static create(opts) {
		const content = MenuContentContext.get();
		const item = new MenuItemSharedState(opts, content);
		const submenu = MenuMenuContext.get();
		return new MenuSubTriggerState(opts, item, content, submenu);
	}
	opts;
	item;
	content;
	submenu;
	attachment;
	#openTimer = null;
	constructor(opts, item, content, submenu) {
		this.opts = opts;
		this.item = item;
		this.content = content;
		this.submenu = submenu;
		this.attachment = attachRef(this.opts.ref, (v) => this.submenu.triggerNode = v);
		this.onpointerleave = this.onpointerleave.bind(this);
		this.onpointermove = this.onpointermove.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
		this.onclick = this.onclick.bind(this);
	}
	#clearOpenTimer() {
		if (this.#openTimer === null) return;
		this.content.domContext.getWindow().clearTimeout(this.#openTimer);
		this.#openTimer = null;
	}
	onpointermove(e) {
		if (!isMouseEvent(e)) return;
		if (this.submenu.root.isPointerInTransit) {
			if (this.#openTimer !== null) this.#clearOpenTimer();
			return;
		}
		if (!this.item.opts.disabled.current && !this.submenu.opts.open.current && !this.#openTimer) {
			const openDelay = this.opts.openDelay.current;
			if (openDelay <= 0) {
				this.submenu.onOpen();
				return;
			}
			this.#openTimer = this.content.domContext.setTimeout(() => {
				if (this.submenu.root.isPointerInTransit) {
					this.#clearOpenTimer();
					return;
				}
				this.submenu.onOpen();
				this.#clearOpenTimer();
			}, openDelay);
		}
	}
	onpointerleave(e) {
		if (!isMouseEvent(e)) return;
		this.#clearOpenTimer();
	}
	onkeydown(e) {
		const isTypingAhead = this.content.search !== "";
		if (this.item.opts.disabled.current || isTypingAhead && e.key === " ") return;
		if (SUB_OPEN_KEYS[this.submenu.root.opts.dir.current].includes(e.key)) {
			e.currentTarget.click();
			e.preventDefault();
		}
	}
	onclick(e) {
		if (this.item.opts.disabled.current) return;
		/**
		* We manually focus because iOS Safari doesn't always focus on click (e.g. buttons)
		* and we rely heavily on `onFocusOutside` for submenus to close when switching
		* between separate submenus.
		*/
		if (!isHTMLElement$1(e.currentTarget)) return;
		e.currentTarget.focus();
		const selectEvent = new CustomEvent("menusubtriggerselect", {
			bubbles: true,
			cancelable: true
		});
		this.opts.onSelect.current(selectEvent);
		if (!this.submenu.opts.open.current) {
			this.submenu.onOpen();
			afterTick(() => {
				const contentNode = this.submenu.contentNode;
				if (!contentNode) return;
				MenuOpenEvent.dispatch(contentNode);
			});
		}
	}
	#props = derived(() => mergeProps({
		"aria-haspopup": "menu",
		"aria-expanded": boolToStr(this.submenu.opts.open.current),
		"data-state": getDataOpenClosed(this.submenu.opts.open.current),
		"aria-controls": this.submenu.opts.open.current ? this.submenu.contentId.current : void 0,
		[this.submenu.root.getBitsAttr("sub-trigger")]: "",
		onclick: this.onclick,
		onpointermove: this.onpointermove,
		onpointerleave: this.onpointerleave,
		onkeydown: this.onkeydown,
		...this.attachment
	}, this.item.props));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var MenuGroupState = class MenuGroupState {
	static create(opts) {
		return MenuGroupContext.set(new MenuGroupState(opts, MenuRootContext.get()));
	}
	opts;
	root;
	attachment;
	groupHeadingId = void 0;
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref);
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		role: "group",
		"aria-labelledby": this.groupHeadingId,
		[this.root.getBitsAttr("group")]: "",
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var MenuSeparatorState = class MenuSeparatorState {
	static create(opts) {
		return new MenuSeparatorState(opts, MenuRootContext.get());
	}
	opts;
	root;
	attachment;
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref);
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		role: "group",
		[this.root.getBitsAttr("separator")]: "",
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var DropdownMenuTriggerState = class DropdownMenuTriggerState {
	static create(opts) {
		return new DropdownMenuTriggerState(opts, MenuMenuContext.get());
	}
	opts;
	parentMenu;
	attachment;
	constructor(opts, parentMenu) {
		this.opts = opts;
		this.parentMenu = parentMenu;
		this.attachment = attachRef(this.opts.ref, (v) => this.parentMenu.triggerNode = v);
	}
	onclick = (e) => {
		/**
		* MacOS VoiceOver sends a click in Safari/Firefox bypassing the keydown event
		* when V0+Space is pressed. Since we already handle the keydown event and the
		* pointerdown events separately, we ignore it if the detail is not 0.
		*/
		if (this.opts.disabled.current || e.detail !== 0) return;
		this.parentMenu.toggleOpen();
		e.preventDefault();
	};
	onpointerdown = (e) => {
		if (this.opts.disabled.current) return;
		if (e.pointerType === "touch") return e.preventDefault();
		if (e.button === 0 && e.ctrlKey === false) {
			this.parentMenu.toggleOpen();
			if (!this.parentMenu.opts.open.current) e.preventDefault();
		}
	};
	onpointerup = (e) => {
		if (this.opts.disabled.current) return;
		if (e.pointerType === "touch") {
			e.preventDefault();
			this.parentMenu.toggleOpen();
		}
	};
	onkeydown = (e) => {
		if (this.opts.disabled.current) return;
		if (e.key === " " || e.key === "Enter") {
			this.parentMenu.toggleOpen();
			e.preventDefault();
			return;
		}
		if (e.key === "ArrowDown") {
			this.parentMenu.onOpen();
			e.preventDefault();
		}
	};
	#ariaControls = derived(() => {
		if (this.parentMenu.opts.open.current && this.parentMenu.contentId.current) return this.parentMenu.contentId.current;
	});
	#props = derived(() => ({
		id: this.opts.id.current,
		disabled: this.opts.disabled.current,
		"aria-haspopup": "menu",
		"aria-expanded": boolToStr(this.parentMenu.opts.open.current),
		"aria-controls": this.#ariaControls(),
		"data-disabled": boolToEmptyStrOrUndef(this.opts.disabled.current),
		"data-state": getDataOpenClosed(this.parentMenu.opts.open.current),
		[this.parentMenu.root.getBitsAttr("trigger")]: "",
		onclick: this.onclick,
		onpointerdown: this.onpointerdown,
		onpointerup: this.onpointerup,
		onkeydown: this.onkeydown,
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var MenuSubmenuState = class {
	static create(opts) {
		const menu = MenuMenuContext.get();
		return MenuMenuContext.set(new MenuMenuState(opts, menu.root, menu));
	}
};
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/utilities/dismissible-layer/use-dismissable-layer.svelte.js
globalThis.bitsDismissableLayers ??= /* @__PURE__ */ new Map();
var DismissibleLayerState = class DismissibleLayerState {
	static create(opts) {
		return new DismissibleLayerState(opts);
	}
	opts;
	#interactOutsideProp;
	#behaviorType;
	#interceptedEvents = { pointerdown: false };
	#isResponsibleLayer = false;
	#isFocusInsideDOMTree = false;
	#documentObj = void 0;
	#onFocusOutside;
	#unsubClickListener = noop$2;
	constructor(opts) {
		this.opts = opts;
		this.#behaviorType = opts.interactOutsideBehavior;
		this.#interactOutsideProp = opts.onInteractOutside;
		this.#onFocusOutside = opts.onFocusOutside;
		let unsubEvents = noop$2;
		const cleanup = () => {
			this.#resetState();
			globalThis.bitsDismissableLayers.delete(this);
			this.#handleInteractOutside.destroy();
			unsubEvents();
		};
		watch([() => this.opts.enabled.current, () => this.opts.ref.current], () => {
			if (!this.opts.enabled.current || !this.opts.ref.current) return;
			afterSleep(1, () => {
				if (!this.opts.ref.current) return;
				globalThis.bitsDismissableLayers.set(this, this.#behaviorType);
				unsubEvents();
				unsubEvents = this.#addEventListeners();
			});
			return cleanup;
		});
	}
	#handleFocus = (event) => {
		if (event.defaultPrevented) return;
		if (!this.opts.ref.current) return;
		afterTick(() => {
			if (!this.opts.ref.current || this.#isTargetWithinLayer(event.target)) return;
			if (event.target && !this.#isFocusInsideDOMTree) this.#onFocusOutside.current?.(event);
		});
	};
	#addEventListeners() {
		return executeCallbacks(
			/**
			* CAPTURE INTERACTION START
			* mark interaction-start event as intercepted.
			* mark responsible layer during interaction start
			* to avoid checking if is responsible layer during interaction end
			* when a new floating element may have been opened.
			*/
			on(this.#documentObj, "pointerdown", executeCallbacks(this.#markInterceptedEvent, this.#markResponsibleLayer), { capture: true }),
			/**
			* BUBBLE INTERACTION START
			* Mark interaction-start event as non-intercepted. Debounce `onInteractOutsideStart`
			* to avoid prematurely checking if other events were intercepted.
			*/
			on(this.#documentObj, "pointerdown", executeCallbacks(this.#markNonInterceptedEvent, this.#handleInteractOutside)),
			/**
			* HANDLE FOCUS OUTSIDE
			*/
			on(this.#documentObj, "focusin", this.#handleFocus)
		);
	}
	#handleDismiss = (e) => {
		let event = e;
		if (event.defaultPrevented) event = createWrappedEvent(e);
		this.#interactOutsideProp.current(e);
	};
	#handleInteractOutside = debounce((e) => {
		if (!this.opts.ref.current) {
			this.#unsubClickListener();
			return;
		}
		const isEventValid = this.opts.isValidEvent.current(e, this.opts.ref.current) || isValidEvent(e, this.opts.ref.current);
		if (!this.#isResponsibleLayer || this.#isAnyEventIntercepted() || !isEventValid) {
			this.#unsubClickListener();
			return;
		}
		let event = e;
		if (event.defaultPrevented) event = createWrappedEvent(event);
		if (this.#behaviorType.current !== "close" && this.#behaviorType.current !== "defer-otherwise-close") {
			this.#unsubClickListener();
			return;
		}
		if (e.pointerType === "touch") {
			this.#unsubClickListener();
			this.#unsubClickListener = on(this.#documentObj, "click", this.#handleDismiss, { once: true });
		} else this.#interactOutsideProp.current(event);
	}, 10);
	#markInterceptedEvent = (e) => {
		this.#interceptedEvents[e.type] = true;
	};
	#markNonInterceptedEvent = (e) => {
		this.#interceptedEvents[e.type] = false;
	};
	#markResponsibleLayer = () => {
		if (!this.opts.ref.current) return;
		this.#isResponsibleLayer = isResponsibleLayer(this.opts.ref.current);
	};
	#isTargetWithinLayer = (target) => {
		if (!this.opts.ref.current) return false;
		return isOrContainsTarget(this.opts.ref.current, target);
	};
	#resetState = debounce(() => {
		for (const eventType in this.#interceptedEvents) this.#interceptedEvents[eventType] = false;
		this.#isResponsibleLayer = false;
	}, 20);
	#isAnyEventIntercepted() {
		return Object.values(this.#interceptedEvents).some(Boolean);
	}
	#onfocuscapture = () => {
		this.#isFocusInsideDOMTree = true;
	};
	#onblurcapture = () => {
		this.#isFocusInsideDOMTree = false;
	};
	props = {
		onfocuscapture: this.#onfocuscapture,
		onblurcapture: this.#onblurcapture
	};
};
function getTopMostDismissableLayer(layersArr = [...globalThis.bitsDismissableLayers]) {
	return layersArr.findLast(([_, { current: behaviorType }]) => behaviorType === "close" || behaviorType === "ignore");
}
function isResponsibleLayer(node) {
	const layersArr = [...globalThis.bitsDismissableLayers];
	/**
	* We first check if we can find a top layer with `close` or `ignore`.
	* If that top layer was found and matches the provided node, then the node is
	* responsible for the outside interaction. Otherwise, we know that all layers defer so
	* the first layer is the responsible one.
	*/
	const topMostLayer = getTopMostDismissableLayer(layersArr);
	if (topMostLayer) return topMostLayer[0].opts.ref.current === node;
	const [firstLayerNode] = layersArr[0];
	return firstLayerNode.opts.ref.current === node;
}
function isValidEvent(e, node) {
	const target = e.target;
	if (!isElementOrSVGElement(target)) return false;
	const targetIsContextMenuTrigger = Boolean(target.closest(`[${CONTEXT_MENU_TRIGGER_ATTR}]`));
	const nodeIsContextMenu = Boolean(node.closest(`[${CONTEXT_MENU_CONTENT_ATTR}]`));
	if ("button" in e && e.button > 0 && !targetIsContextMenuTrigger) return false;
	if ("button" in e && e.button === 0 && targetIsContextMenuTrigger && nodeIsContextMenu) return true;
	if (targetIsContextMenuTrigger && nodeIsContextMenu) return false;
	return getOwnerDocument(target).documentElement.contains(target) && !isOrContainsTarget(node, target) && isClickTrulyOutside(e, node);
}
function createWrappedEvent(e) {
	const capturedCurrentTarget = e.currentTarget;
	const capturedTarget = e.target;
	let newEvent;
	if (e instanceof PointerEvent) newEvent = new PointerEvent(e.type, e);
	else newEvent = new PointerEvent("pointerdown", e);
	let isPrevented = false;
	return new Proxy(newEvent, { get: (target, prop) => {
		if (prop === "currentTarget") return capturedCurrentTarget;
		if (prop === "target") return capturedTarget;
		if (prop === "preventDefault") return () => {
			isPrevented = true;
			if (typeof target.preventDefault === "function") target.preventDefault();
		};
		if (prop === "defaultPrevented") return isPrevented;
		if (prop in target) return target[prop];
		return e[prop];
	} });
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/utilities/dismissible-layer/dismissible-layer.svelte
function Dismissible_layer($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { interactOutsideBehavior = "close", onInteractOutside = noop$2, onFocusOutside = noop$2, id, children, enabled, isValidEvent = () => false, ref } = $$props;
		const dismissibleLayerState = DismissibleLayerState.create({
			id: boxWith(() => id),
			interactOutsideBehavior: boxWith(() => interactOutsideBehavior),
			onInteractOutside: boxWith(() => onInteractOutside),
			enabled: boxWith(() => enabled),
			onFocusOutside: boxWith(() => onFocusOutside),
			isValidEvent: boxWith(() => isValidEvent),
			ref
		});
		children?.($$renderer, { props: dismissibleLayerState.props });
		$$renderer.push(`<!---->`);
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/utilities/escape-layer/use-escape-layer.svelte.js
globalThis.bitsEscapeLayers ??= /* @__PURE__ */ new Map();
var EscapeLayerState = class EscapeLayerState {
	static create(opts) {
		return new EscapeLayerState(opts);
	}
	opts;
	domContext;
	constructor(opts) {
		this.opts = opts;
		this.domContext = new DOMContext(this.opts.ref);
		let unsubEvents = noop$2;
		watch(() => opts.enabled.current, (enabled) => {
			if (enabled) {
				globalThis.bitsEscapeLayers.set(this, opts.escapeKeydownBehavior);
				unsubEvents = this.#addEventListener();
			}
			return () => {
				unsubEvents();
				globalThis.bitsEscapeLayers.delete(this);
			};
		});
	}
	#addEventListener = () => {
		return on(this.domContext.getDocument(), "keydown", this.#onkeydown, { passive: false });
	};
	#onkeydown = (e) => {
		if (e.key !== "Escape" || !isResponsibleEscapeLayer(this)) return;
		const clonedEvent = new KeyboardEvent(e.type, e);
		e.preventDefault();
		const behaviorType = this.opts.escapeKeydownBehavior.current;
		if (behaviorType !== "close" && behaviorType !== "defer-otherwise-close") return;
		this.opts.onEscapeKeydown.current(clonedEvent);
	};
};
function isResponsibleEscapeLayer(instance) {
	const layersArr = [...globalThis.bitsEscapeLayers];
	/**
	* We first check if we can find a top layer with `close` or `ignore`.
	* If that top layer was found and matches the provided node, then the node is
	* responsible for the escape. Otherwise, we know that all layers defer so
	* the first layer is the responsible one.
	*/
	const topMostLayer = layersArr.findLast(([_, { current: behaviorType }]) => behaviorType === "close" || behaviorType === "ignore");
	if (topMostLayer) return topMostLayer[0] === instance;
	const [firstLayerNode] = layersArr[0];
	return firstLayerNode === instance;
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/utilities/escape-layer/escape-layer.svelte
function Escape_layer($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { escapeKeydownBehavior = "close", onEscapeKeydown = noop$2, children, enabled, ref } = $$props;
		EscapeLayerState.create({
			escapeKeydownBehavior: boxWith(() => escapeKeydownBehavior),
			onEscapeKeydown: boxWith(() => onEscapeKeydown),
			enabled: boxWith(() => enabled),
			ref
		});
		children?.($$renderer);
		$$renderer.push(`<!---->`);
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/utilities/focus-scope/focus-scope-manager.js
var FocusScopeManager = class FocusScopeManager {
	static instance;
	#scopeStack = simpleBox([]);
	#focusHistory = /* @__PURE__ */ new WeakMap();
	#preFocusHistory = /* @__PURE__ */ new WeakMap();
	static getInstance() {
		if (!this.instance) this.instance = new FocusScopeManager();
		return this.instance;
	}
	register(scope) {
		const current = this.getActive();
		if (current && current !== scope) current.pause();
		const activeElement = document.activeElement;
		if (activeElement && activeElement !== document.body) this.#preFocusHistory.set(scope, activeElement);
		this.#scopeStack.current = this.#scopeStack.current.filter((s) => s !== scope);
		this.#scopeStack.current.unshift(scope);
	}
	unregister(scope) {
		this.#scopeStack.current = this.#scopeStack.current.filter((s) => s !== scope);
		const next = this.getActive();
		if (next) next.resume();
	}
	getActive() {
		return this.#scopeStack.current[0];
	}
	setFocusMemory(scope, element) {
		this.#focusHistory.set(scope, element);
	}
	getFocusMemory(scope) {
		return this.#focusHistory.get(scope);
	}
	isActiveScope(scope) {
		return this.getActive() === scope;
	}
	setPreFocusMemory(scope, element) {
		this.#preFocusHistory.set(scope, element);
	}
	getPreFocusMemory(scope) {
		return this.#preFocusHistory.get(scope);
	}
	clearPreFocusMemory(scope) {
		this.#preFocusHistory.delete(scope);
	}
};
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/utilities/focus-scope/focus-scope.svelte.js
var FocusScope = class FocusScope {
	#paused = false;
	#container = null;
	#manager = FocusScopeManager.getInstance();
	#cleanupFns = [];
	#opts;
	constructor(opts) {
		this.#opts = opts;
	}
	get paused() {
		return this.#paused;
	}
	pause() {
		this.#paused = true;
	}
	resume() {
		this.#paused = false;
	}
	#cleanup() {
		for (const fn of this.#cleanupFns) fn();
		this.#cleanupFns = [];
	}
	mount(container) {
		if (this.#container) this.unmount();
		this.#container = container;
		this.#manager.register(this);
		this.#setupEventListeners();
		this.#handleOpenAutoFocus();
	}
	unmount() {
		if (!this.#container) return;
		this.#cleanup();
		this.#handleCloseAutoFocus();
		this.#manager.unregister(this);
		this.#manager.clearPreFocusMemory(this);
		this.#container = null;
	}
	#handleOpenAutoFocus() {
		if (!this.#container) return;
		const event = new CustomEvent("focusScope.onOpenAutoFocus", {
			bubbles: false,
			cancelable: true
		});
		this.#opts.onOpenAutoFocus.current(event);
		if (!event.defaultPrevented) requestAnimationFrame(() => {
			if (!this.#container) return;
			const firstTabbable = this.#getFirstTabbable();
			if (firstTabbable) {
				firstTabbable.focus();
				this.#manager.setFocusMemory(this, firstTabbable);
			} else this.#container.focus();
		});
	}
	#handleCloseAutoFocus() {
		const event = new CustomEvent("focusScope.onCloseAutoFocus", {
			bubbles: false,
			cancelable: true
		});
		this.#opts.onCloseAutoFocus.current?.(event);
		if (!event.defaultPrevented) {
			const preFocusedElement = this.#manager.getPreFocusMemory(this);
			if (preFocusedElement && document.contains(preFocusedElement)) try {
				preFocusedElement.focus();
			} catch {
				document.body.focus();
			}
		}
	}
	#setupEventListeners() {
		if (!this.#container || !this.#opts.trap.current) return;
		const container = this.#container;
		const doc = container.ownerDocument;
		const handleFocus = (e) => {
			if (this.#paused || !this.#manager.isActiveScope(this)) return;
			const target = e.target;
			if (!target) return;
			if (container.contains(target)) this.#manager.setFocusMemory(this, target);
			else {
				const lastFocused = this.#manager.getFocusMemory(this);
				if (lastFocused && container.contains(lastFocused) && isFocusable(lastFocused)) {
					e.preventDefault();
					lastFocused.focus();
				} else {
					const firstTabbable = this.#getFirstTabbable();
					const firstFocusable = this.#getAllFocusables()[0];
					(firstTabbable || firstFocusable || container).focus();
				}
			}
		};
		const handleKeydown = (e) => {
			if (!this.#opts.loop || this.#paused || e.key !== "Tab") return;
			if (!this.#manager.isActiveScope(this)) return;
			const tabbables = this.#getTabbables();
			if (tabbables.length === 0) return;
			const first = tabbables[0];
			const last = tabbables[tabbables.length - 1];
			if (!e.shiftKey && doc.activeElement === last) {
				e.preventDefault();
				first.focus();
			} else if (e.shiftKey && doc.activeElement === first) {
				e.preventDefault();
				last.focus();
			}
		};
		this.#cleanupFns.push(on(doc, "focusin", handleFocus, { capture: true }), on(container, "keydown", handleKeydown));
		const observer = new MutationObserver(() => {
			const lastFocused = this.#manager.getFocusMemory(this);
			if (lastFocused && !container.contains(lastFocused)) {
				const firstTabbable = this.#getFirstTabbable();
				const firstFocusable = this.#getAllFocusables()[0];
				const elementToFocus = firstTabbable || firstFocusable;
				if (elementToFocus) {
					elementToFocus.focus();
					this.#manager.setFocusMemory(this, elementToFocus);
				} else container.focus();
			}
		});
		observer.observe(container, {
			childList: true,
			subtree: true
		});
		this.#cleanupFns.push(() => observer.disconnect());
	}
	#getTabbables() {
		if (!this.#container) return [];
		return tabbable(this.#container, {
			includeContainer: false,
			getShadowRoot: true
		});
	}
	#getFirstTabbable() {
		return this.#getTabbables()[0] || null;
	}
	#getAllFocusables() {
		if (!this.#container) return [];
		return focusable(this.#container, {
			includeContainer: false,
			getShadowRoot: true
		});
	}
	static use(opts) {
		let scope = null;
		watch([() => opts.ref.current, () => opts.enabled.current], ([ref, enabled]) => {
			if (ref && enabled) {
				if (!scope) scope = new FocusScope(opts);
				scope.mount(ref);
			} else if (scope) {
				scope.unmount();
				scope = null;
			}
		});
		return { get props() {
			return { tabindex: -1 };
		} };
	}
};
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/utilities/focus-scope/focus-scope.svelte
function Focus_scope($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { enabled = false, trapFocus = false, loop = false, onCloseAutoFocus = noop$2, onOpenAutoFocus = noop$2, focusScope, ref } = $$props;
		const focusScopeState = FocusScope.use({
			enabled: boxWith(() => enabled),
			trap: boxWith(() => trapFocus),
			loop,
			onCloseAutoFocus: boxWith(() => onCloseAutoFocus),
			onOpenAutoFocus: boxWith(() => onOpenAutoFocus),
			ref
		});
		focusScope?.($$renderer, { props: focusScopeState.props });
		$$renderer.push(`<!---->`);
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/utilities/text-selection-layer/use-text-selection-layer.svelte.js
var noopPointer = () => {};
globalThis.bitsTextSelectionLayers ??= /* @__PURE__ */ new Map();
var TextSelectionLayerState = class TextSelectionLayerState {
	static create(opts) {
		return new TextSelectionLayerState(opts);
	}
	opts;
	domContext;
	#unsubSelectionLock = noop$2;
	#enabledSnapshot = false;
	#onPointerDownSnapshot = noopPointer;
	#onPointerUpSnapshot = noopPointer;
	constructor(opts) {
		this.opts = opts;
		this.domContext = new DOMContext(opts.ref);
		let unsubEvents = noop$2;
		watch(() => [
			this.opts.enabled.current,
			this.opts.onPointerDown.current,
			this.opts.onPointerUp.current
		], ([enabled, onPointerDown, onPointerUp]) => {
			this.#enabledSnapshot = enabled;
			this.#onPointerDownSnapshot = onPointerDown;
			this.#onPointerUpSnapshot = onPointerUp;
			if (enabled) {
				globalThis.bitsTextSelectionLayers.set(this, this.opts.enabled);
				unsubEvents();
				unsubEvents = this.#addEventListeners();
			}
			return () => {
				this.#enabledSnapshot = false;
				unsubEvents();
				this.#resetSelectionLock();
				globalThis.bitsTextSelectionLayers.delete(this);
			};
		});
	}
	#addEventListeners() {
		return executeCallbacks(on(this.domContext.getDocument(), "pointerdown", this.#pointerdown), on(this.domContext.getDocument(), "pointerup", composeHandlers(this.#resetSelectionLock, this.#pointerupUserHandler)));
	}
	#pointerupUserHandler = (e) => {
		this.#onPointerUpSnapshot(e);
	};
	#pointerdown = (e) => {
		const node = this.opts.ref.current;
		const target = e.target;
		if (!isHTMLElement$1(node) || !isHTMLElement$1(target) || !this.#enabledSnapshot) return;
		/**
		* We only lock user-selection overflow if layer is the top most layer and
		* pointerdown occurred inside the node. You are still allowed to select text
		* outside the node provided pointerdown occurs outside the node.
		*/
		if (!isHighestLayer(this) || !contains(node, target)) return;
		this.#onPointerDownSnapshot(e);
		if (e.defaultPrevented) return;
		this.#unsubSelectionLock = preventTextSelectionOverflow(node, this.domContext.getDocument().body);
	};
	#resetSelectionLock = () => {
		this.#unsubSelectionLock();
		this.#unsubSelectionLock = noop$2;
	};
};
var getUserSelect = (node) => node.style.userSelect || node.style.webkitUserSelect;
function preventTextSelectionOverflow(node, body) {
	const originalBodyUserSelect = getUserSelect(body);
	const originalNodeUserSelect = getUserSelect(node);
	setUserSelect(body, "none");
	setUserSelect(node, "text");
	return () => {
		setUserSelect(body, originalBodyUserSelect);
		setUserSelect(node, originalNodeUserSelect);
	};
}
function setUserSelect(node, value) {
	node.style.userSelect = value;
	node.style.webkitUserSelect = value;
}
function isHighestLayer(instance) {
	const layersArr = [...globalThis.bitsTextSelectionLayers];
	if (!layersArr.length) return false;
	const highestLayer = layersArr.at(-1);
	if (!highestLayer) return false;
	return highestLayer[0] === instance;
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/utilities/text-selection-layer/text-selection-layer.svelte
function Text_selection_layer($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { preventOverflowTextSelection = true, onPointerDown = noop$2, onPointerUp = noop$2, id, children, enabled, ref } = $$props;
		TextSelectionLayerState.create({
			id: boxWith(() => id),
			onPointerDown: boxWith(() => onPointerDown),
			onPointerUp: boxWith(() => onPointerUp),
			enabled: boxWith(() => enabled && preventOverflowTextSelection),
			ref
		});
		children?.($$renderer);
		$$renderer.push(`<!---->`);
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/internal/use-id.js
globalThis.bitsIdCounter ??= { current: 0 };
/**
* Generates a unique ID based on a global counter.
*/
function useId(prefix = "bits") {
	globalThis.bitsIdCounter.current++;
	return `${prefix}-${globalThis.bitsIdCounter.current}`;
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/internal/shared-state.svelte.js
var SharedState = class {
	#factory;
	#subscribers = 0;
	#state;
	#scope;
	constructor(factory) {
		this.#factory = factory;
	}
	#dispose() {
		this.#subscribers -= 1;
		if (this.#scope && this.#subscribers <= 0) {
			this.#scope();
			this.#state = void 0;
			this.#scope = void 0;
		}
	}
	get(...args) {
		this.#subscribers += 1;
		if (this.#state === void 0) this.#scope = () => {};
		return this.#state;
	}
};
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/internal/body-scroll-lock.svelte.js
var lockMap = new SvelteMap();
var initialBodyStyle = null;
var cleanupTimeoutId = null;
var isInCleanupTransition = false;
var anyLocked = boxWith(() => {
	for (const value of lockMap.values()) if (value) return true;
	return false;
});
/**
* We track the time we scheduled the cleanup to prevent race conditions
* when multiple locks are created/destroyed in the same tick, ensuring
* only the last one to schedule the cleanup will run.
*
* reference: https://github.com/huntabyte/bits-ui/issues/1639
*/
var cleanupScheduledAt = null;
var bodyLockStackCount = new SharedState(() => {
	function resetBodyStyle() {}
	function cancelPendingCleanup() {
		if (cleanupTimeoutId === null) return;
		window.clearTimeout(cleanupTimeoutId);
		cleanupTimeoutId = null;
	}
	function scheduleCleanupIfNoNewLocks(delay, callback) {
		cancelPendingCleanup();
		isInCleanupTransition = true;
		cleanupScheduledAt = Date.now();
		const currentCleanupId = cleanupScheduledAt;
		/**
		* We schedule the cleanup to run after a delay to allow new locks to register
		* that might have been added in the same tick as the current cleanup.
		*
		* If a new lock is added in the same tick, the cleanup will be cancelled and
		* a new cleanup will be scheduled.
		*
		* This is to prevent the cleanup from running too early and resetting the body
		* style before the new lock has had a chance to apply its styles.
		*/
		const cleanupFn = () => {
			cleanupTimeoutId = null;
			if (cleanupScheduledAt !== currentCleanupId) return;
			if (!isAnyLocked(lockMap)) {
				isInCleanupTransition = false;
				callback();
			} else isInCleanupTransition = false;
		};
		const actualDelay = delay === null ? 24 : delay;
		cleanupTimeoutId = window.setTimeout(cleanupFn, actualDelay);
	}
	function ensureInitialStyleCaptured() {
		if (initialBodyStyle === null && lockMap.size === 0 && !isInCleanupTransition) initialBodyStyle = document.body.getAttribute("style");
	}
	watch(() => anyLocked.current, () => {
		if (!anyLocked.current) return;
		ensureInitialStyleCaptured();
		isInCleanupTransition = false;
		const htmlStyle = getComputedStyle(document.documentElement);
		const bodyStyle = getComputedStyle(document.body);
		const hasStableGutter = htmlStyle.scrollbarGutter?.includes("stable") || bodyStyle.scrollbarGutter?.includes("stable");
		const verticalScrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
		const config = {
			padding: Number.parseInt(bodyStyle.paddingRight ?? "0", 10) + verticalScrollbarWidth,
			margin: Number.parseInt(bodyStyle.marginRight ?? "0", 10)
		};
		if (verticalScrollbarWidth > 0 && !hasStableGutter) {
			document.body.style.paddingRight = `${config.padding}px`;
			document.body.style.marginRight = `${config.margin}px`;
			document.body.style.setProperty("--scrollbar-width", `${verticalScrollbarWidth}px`);
		}
		document.body.style.overflow = "hidden";
		if (isIOS) on(document, "touchmove", (e) => {
			if (e.target !== document.documentElement) return;
			if (e.touches.length > 1) return;
			e.preventDefault();
		}, { passive: false });
		/**
		* We ensure pointer-events: none is applied _after_ DOM updates, so that any focus/
		* interaction changes from opening overlays/menus complete _before_ we block pointer
		* events.
		*
		* this avoids race conditions where pointer-events could be set too early and break
		* focus/interaction.
		*/
		afterTick(() => {
			document.body.style.pointerEvents = "none";
			document.body.style.overflow = "hidden";
		});
	});
	return {
		get lockMap() {
			return lockMap;
		},
		resetBodyStyle,
		scheduleCleanupIfNoNewLocks,
		cancelPendingCleanup,
		ensureInitialStyleCaptured
	};
});
var BodyScrollLock = class {
	#id = useId();
	#initialState;
	#restoreScrollDelay = () => null;
	#countState;
	locked;
	constructor(initialState, restoreScrollDelay = () => null) {
		this.#initialState = initialState;
		this.#restoreScrollDelay = restoreScrollDelay;
		this.#countState = bodyLockStackCount.get();
		if (!this.#countState) return;
		/**
		* Since a new lock is being created, we cancel any pending cleanup to
		* prevent the cleanup from running too early and resetting the body style
		* before the new lock has had a chance to apply its styles.
		*
		* reference: https://github.com/huntabyte/bits-ui/issues/1639
		*/
		this.#countState.cancelPendingCleanup();
		this.#countState.ensureInitialStyleCaptured();
		this.#countState.lockMap.set(this.#id, this.#initialState ?? false);
		this.locked = boxWith(() => this.#countState.lockMap.get(this.#id) ?? false, (v) => this.#countState.lockMap.set(this.#id, v));
	}
};
function isAnyLocked(map) {
	for (const [_, value] of map) if (value) return true;
	return false;
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/utilities/scroll-lock/scroll-lock.svelte
function Scroll_lock($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { preventScroll = true, restoreScrollDelay = null } = $$props;
		if (preventScroll) new BodyScrollLock(preventScroll, () => restoreScrollDelay);
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/dialog/components/dialog-overlay.svelte
function Dialog_overlay($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { id = createId(uid), forceMount = false, child, children, ref = null, $$slots, $$events, ...restProps } = $$props;
		const overlayState = DialogOverlayState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v)
		});
		const mergedProps = derived(() => mergeProps(restProps, overlayState.props));
		if (overlayState.shouldRender || forceMount) {
			$$renderer.push("<!--[0-->");
			if (child) {
				$$renderer.push("<!--[0-->");
				child($$renderer, {
					props: mergeProps(mergedProps()),
					...overlayState.snippetProps
				});
				$$renderer.push(`<!---->`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<div${attributes({ ...mergeProps(mergedProps()) })}>`);
				children?.($$renderer, overlayState.snippetProps);
				$$renderer.push(`<!----></div>`);
			}
			$$renderer.push(`<!--]-->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/dialog/components/dialog-trigger.svelte
function Dialog_trigger($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { id = createId(uid), ref = null, children, child, disabled = false, $$slots, $$events, ...restProps } = $$props;
		const triggerState = DialogTriggerState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v),
			disabled: boxWith(() => Boolean(disabled))
		});
		const mergedProps = derived(() => mergeProps(restProps, triggerState.props));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, { props: mergedProps() });
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<button${attributes({ ...mergedProps() })}>`);
			children?.($$renderer);
			$$renderer.push(`<!----></button>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/dialog/components/dialog-description.svelte
function Dialog_description($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { id = createId(uid), children, child, ref = null, $$slots, $$events, ...restProps } = $$props;
		const descriptionState = DialogDescriptionState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v)
		});
		const mergedProps = derived(() => mergeProps(restProps, descriptionState.props));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, { props: mergedProps() });
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div${attributes({ ...mergedProps() })}>`);
			children?.($$renderer);
			$$renderer.push(`<!----></div>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/avatar/avatar.svelte.js
var avatarAttrs = createBitsAttrs({
	component: "avatar",
	parts: [
		"root",
		"image",
		"fallback"
	]
});
var AvatarRootContext = new Context("Avatar.Root");
var AvatarRootState = class AvatarRootState {
	static create(opts) {
		return AvatarRootContext.set(new AvatarRootState(opts));
	}
	opts;
	domContext;
	attachment;
	constructor(opts) {
		this.opts = opts;
		this.domContext = new DOMContext(this.opts.ref);
		this.loadImage = this.loadImage.bind(this);
		this.attachment = attachRef(this.opts.ref);
	}
	loadImage(src, crossorigin, referrerPolicy) {
		if (this.opts.loadingStatus.current === "loaded") return;
		let imageTimerId;
		const image = new Image();
		image.src = src;
		if (crossorigin !== void 0) image.crossOrigin = crossorigin;
		if (referrerPolicy) image.referrerPolicy = referrerPolicy;
		this.opts.loadingStatus.current = "loading";
		image.onload = () => {
			imageTimerId = this.domContext.setTimeout(() => {
				this.opts.loadingStatus.current = "loaded";
			}, this.opts.delayMs.current);
		};
		image.onerror = () => {
			this.opts.loadingStatus.current = "error";
		};
		return () => {
			if (!imageTimerId) return;
			this.domContext.clearTimeout(imageTimerId);
		};
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		[avatarAttrs.root]: "",
		"data-status": this.opts.loadingStatus.current,
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var AvatarImageState = class AvatarImageState {
	static create(opts) {
		return new AvatarImageState(opts, AvatarRootContext.get());
	}
	opts;
	root;
	attachment;
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref);
		watch.pre([() => this.opts.src.current, () => this.opts.crossOrigin.current], ([src, crossOrigin]) => {
			if (!src) {
				this.root.opts.loadingStatus.current = "error";
				return;
			}
			this.root.loadImage(src, crossOrigin, this.opts.referrerPolicy.current);
		});
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		style: { display: this.root.opts.loadingStatus.current === "loaded" ? "block" : "none" },
		"data-status": this.root.opts.loadingStatus.current,
		[avatarAttrs.image]: "",
		src: this.opts.src.current,
		crossorigin: this.opts.crossOrigin.current,
		referrerpolicy: this.opts.referrerPolicy.current,
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var AvatarFallbackState = class AvatarFallbackState {
	static create(opts) {
		return new AvatarFallbackState(opts, AvatarRootContext.get());
	}
	opts;
	root;
	attachment;
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref);
	}
	#style = derived(() => this.root.opts.loadingStatus.current === "loaded" ? { display: "none" } : void 0);
	get style() {
		return this.#style();
	}
	set style($$value) {
		return this.#style($$value);
	}
	#props = derived(() => ({
		style: this.style,
		"data-status": this.root.opts.loadingStatus.current,
		[avatarAttrs.fallback]: "",
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/avatar/components/avatar.svelte
function Avatar($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { delayMs = 0, loadingStatus = "loading", onLoadingStatusChange, child, children, id = createId(uid), ref = null, $$slots, $$events, ...restProps } = $$props;
		const rootState = AvatarRootState.create({
			delayMs: boxWith(() => delayMs),
			loadingStatus: boxWith(() => loadingStatus, (v) => {
				if (loadingStatus !== v) {
					loadingStatus = v;
					onLoadingStatusChange?.(v);
				}
			}),
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v)
		});
		const mergedProps = derived(() => mergeProps(restProps, rootState.props));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, { props: mergedProps() });
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div${attributes({ ...mergedProps() })}>`);
			children?.($$renderer);
			$$renderer.push(`<!----></div>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, {
			loadingStatus,
			ref
		});
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/avatar/components/avatar-image.svelte
function Avatar_image($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { src, child, id = createId(uid), ref = null, crossorigin = void 0, referrerpolicy = void 0, $$slots, $$events, ...restProps } = $$props;
		const imageState = AvatarImageState.create({
			src: boxWith(() => src),
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v),
			crossOrigin: boxWith(() => crossorigin),
			referrerPolicy: boxWith(() => referrerpolicy)
		});
		const mergedProps = derived(() => mergeProps(restProps, imageState.props));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, { props: mergedProps() });
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<img${attributes({
				...mergedProps(),
				src
			})} onload="this.__e=event" onerror="this.__e=event"/>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/avatar/components/avatar-fallback.svelte
function Avatar_fallback($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { children, child, id = createId(uid), ref = null, $$slots, $$events, ...restProps } = $$props;
		const fallbackState = AvatarFallbackState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v)
		});
		const mergedProps = derived(() => mergeProps(restProps, fallbackState.props));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, { props: mergedProps() });
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<span${attributes({ ...mergedProps() })}>`);
			children?.($$renderer);
			$$renderer.push(`<!----></span>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/utilities/hidden-input.svelte
function Hidden_input($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { value = void 0, $$slots, $$events, ...restProps } = $$props;
		const mergedProps = derived(() => mergeProps(restProps, {
			"aria-hidden": "true",
			tabindex: -1,
			style: {
				...srOnlyStyles,
				position: "absolute",
				top: "0",
				left: "0"
			}
		}));
		if (mergedProps().type === "checkbox") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<input${attributes({
				...mergedProps(),
				value
			}, void 0, void 0, void 0, 4)}/>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<input${attributes({
				value,
				...mergedProps()
			}, void 0, void 0, void 0, 4)}/>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { value });
	});
}
//#endregion
//#region ../../node_modules/.bun/@floating-ui+utils@0.2.12/node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs
/**
* Custom positioning reference element.
* @see https://floating-ui.com/docs/virtual-elements
*/
var sides = [
	"top",
	"right",
	"bottom",
	"left"
];
var min = Math.min;
var max = Math.max;
var round = Math.round;
var createCoords = (v) => ({
	x: v,
	y: v
});
var oppositeSideMap = {
	left: "right",
	right: "left",
	bottom: "top",
	top: "bottom"
};
function clamp$1(start, value, end) {
	return max(start, min(value, end));
}
function evaluate(value, param) {
	return typeof value === "function" ? value(param) : value;
}
function getSide$1(placement) {
	return placement.split("-")[0];
}
function getAlignment(placement) {
	return placement.split("-")[1];
}
function getOppositeAxis(axis) {
	return axis === "x" ? "y" : "x";
}
function getAxisLength(axis) {
	return axis === "y" ? "height" : "width";
}
function getSideAxis(placement) {
	const firstChar = placement[0];
	return firstChar === "t" || firstChar === "b" ? "y" : "x";
}
function getAlignmentAxis(placement) {
	return getOppositeAxis(getSideAxis(placement));
}
function getAlignmentSides(placement, rects, rtl) {
	if (rtl === void 0) rtl = false;
	const alignment = getAlignment(placement);
	const alignmentAxis = getAlignmentAxis(placement);
	const length = getAxisLength(alignmentAxis);
	let mainAlignmentSide = alignmentAxis === "x" ? alignment === (rtl ? "end" : "start") ? "right" : "left" : alignment === "start" ? "bottom" : "top";
	if (rects.reference[length] > rects.floating[length]) mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
	return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
}
function getExpandedPlacements(placement) {
	const oppositePlacement = getOppositePlacement(placement);
	return [
		getOppositeAlignmentPlacement(placement),
		oppositePlacement,
		getOppositeAlignmentPlacement(oppositePlacement)
	];
}
function getOppositeAlignmentPlacement(placement) {
	return placement.includes("start") ? placement.replace("start", "end") : placement.replace("end", "start");
}
var lrPlacement = ["left", "right"];
var rlPlacement = ["right", "left"];
var tbPlacement = ["top", "bottom"];
var btPlacement = ["bottom", "top"];
function getSideList(side, isStart, rtl) {
	switch (side) {
		case "top":
		case "bottom":
			if (rtl) return isStart ? rlPlacement : lrPlacement;
			return isStart ? lrPlacement : rlPlacement;
		case "left":
		case "right": return isStart ? tbPlacement : btPlacement;
		default: return [];
	}
}
function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
	const alignment = getAlignment(placement);
	let list = getSideList(getSide$1(placement), direction === "start", rtl);
	if (alignment) {
		list = list.map((side) => side + "-" + alignment);
		if (flipAlignment) list = list.concat(list.map(getOppositeAlignmentPlacement));
	}
	return list;
}
function getOppositePlacement(placement) {
	const side = getSide$1(placement);
	return oppositeSideMap[side] + placement.slice(side.length);
}
function expandPaddingObject(padding) {
	var _padding$top, _padding$right, _padding$bottom, _padding$left;
	return {
		top: (_padding$top = padding.top) != null ? _padding$top : 0,
		right: (_padding$right = padding.right) != null ? _padding$right : 0,
		bottom: (_padding$bottom = padding.bottom) != null ? _padding$bottom : 0,
		left: (_padding$left = padding.left) != null ? _padding$left : 0
	};
}
function getPaddingObject(padding) {
	return typeof padding !== "number" ? expandPaddingObject(padding) : {
		top: padding,
		right: padding,
		bottom: padding,
		left: padding
	};
}
function rectToClientRect(rect) {
	const { x, y, width, height } = rect;
	return {
		width,
		height,
		top: y,
		left: x,
		right: x + width,
		bottom: y + height,
		x,
		y
	};
}
//#endregion
//#region ../../node_modules/.bun/@floating-ui+core@1.8.0/node_modules/@floating-ui/core/dist/floating-ui.core.mjs
function computeCoordsFromPlacement(_ref, placement, rtl) {
	let { reference, floating } = _ref;
	const sideAxis = getSideAxis(placement);
	const alignmentAxis = getAlignmentAxis(placement);
	const alignLength = getAxisLength(alignmentAxis);
	const side = getSide$1(placement);
	const isVertical = sideAxis === "y";
	const commonX = reference.x + reference.width / 2 - floating.width / 2;
	const commonY = reference.y + reference.height / 2 - floating.height / 2;
	const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
	let coords;
	switch (side) {
		case "top":
			coords = {
				x: commonX,
				y: reference.y - floating.height
			};
			break;
		case "bottom":
			coords = {
				x: commonX,
				y: reference.y + reference.height
			};
			break;
		case "right":
			coords = {
				x: reference.x + reference.width,
				y: commonY
			};
			break;
		case "left":
			coords = {
				x: reference.x - floating.width,
				y: commonY
			};
			break;
		default: coords = {
			x: reference.x,
			y: reference.y
		};
	}
	const alignment = getAlignment(placement);
	if (alignment) coords[alignmentAxis] += commonAlign * (alignment === "end" ? 1 : -1) * (rtl && isVertical ? -1 : 1);
	return coords;
}
/**
* Resolves with an object of overflow side offsets that determine how much the
* element is overflowing a given clipping boundary on each side.
* - positive = overflowing the boundary by that number of pixels
* - negative = how many pixels left before it will overflow
* - 0 = lies flush with the boundary
* @see https://floating-ui.com/docs/detectOverflow
*/
async function detectOverflow(state, options) {
	var _await$platform$isEle;
	if (options === void 0) options = {};
	const { x, y, platform, rects, elements, strategy } = state;
	const { boundary = "clippingAncestors", rootBoundary = "viewport", elementContext = "floating", altBoundary = false, padding = 0 } = evaluate(options, state);
	const paddingObject = getPaddingObject(padding);
	const element = elements[altBoundary ? elementContext === "floating" ? "reference" : "floating" : elementContext];
	const clippingClientRect = rectToClientRect(await platform.getClippingRect({
		element: ((_await$platform$isEle = await (platform.isElement == null ? void 0 : platform.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || await (platform.getDocumentElement == null ? void 0 : platform.getDocumentElement(elements.floating)),
		boundary,
		rootBoundary,
		strategy
	}));
	const rect = elementContext === "floating" ? {
		x,
		y,
		width: rects.floating.width,
		height: rects.floating.height
	} : rects.reference;
	const offsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(elements.floating));
	const offsetScale = await (platform.isElement == null ? void 0 : platform.isElement(offsetParent)) && await (platform.getScale == null ? void 0 : platform.getScale(offsetParent)) || {
		x: 1,
		y: 1
	};
	const elementClientRect = rectToClientRect(platform.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform.convertOffsetParentRelativeRectToViewportRelativeRect({
		elements,
		rect,
		offsetParent,
		strategy
	}) : rect);
	return {
		top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
		bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
		left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
		right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
	};
}
var MAX_RESET_COUNT = 50;
/**
* Computes the `x` and `y` coordinates that will place the floating element
* next to a given reference element.
*
* This export does not have any `platform` interface logic. You will need to
* write one for the platform you are using Floating UI with.
*/
var computePosition$1 = async (reference, floating, config) => {
	const { placement = "bottom", strategy = "absolute", middleware = [], platform } = config;
	const platformWithDetectOverflow = platform.detectOverflow ? platform : {
		...platform,
		detectOverflow
	};
	const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(floating));
	let rects = await platform.getElementRects({
		reference,
		floating,
		strategy
	});
	let { x, y } = computeCoordsFromPlacement(rects, placement, rtl);
	let statefulPlacement = placement;
	let resetCount = 0;
	const middlewareData = {};
	for (let i = 0; i < middleware.length; i++) {
		const currentMiddleware = middleware[i];
		if (!currentMiddleware) continue;
		const { name, fn } = currentMiddleware;
		const { x: nextX, y: nextY, data, reset } = await fn({
			x,
			y,
			initialPlacement: placement,
			placement: statefulPlacement,
			strategy,
			middlewareData,
			rects,
			platform: platformWithDetectOverflow,
			elements: {
				reference,
				floating
			}
		});
		x = nextX != null ? nextX : x;
		y = nextY != null ? nextY : y;
		middlewareData[name] = {
			...middlewareData[name],
			...data
		};
		if (reset && resetCount < MAX_RESET_COUNT) {
			resetCount++;
			if (typeof reset === "object") {
				if (reset.placement) statefulPlacement = reset.placement;
				if (reset.rects) rects = reset.rects === true ? await platform.getElementRects({
					reference,
					floating,
					strategy
				}) : reset.rects;
				({x, y} = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
			}
			i = -1;
		}
	}
	return {
		x,
		y,
		placement: statefulPlacement,
		strategy,
		middlewareData
	};
};
/**
* Provides data to position an inner element of the floating element so that it
* appears centered to the reference element.
* @see https://floating-ui.com/docs/arrow
*/
var arrow$1 = (options) => ({
	name: "arrow",
	options,
	async fn(state) {
		const { x, y, placement, rects, platform, elements, middlewareData } = state;
		const { element, padding = 0 } = evaluate(options, state) || {};
		if (element == null) return {};
		const paddingObject = getPaddingObject(padding);
		const coords = {
			x,
			y
		};
		const axis = getAlignmentAxis(placement);
		const length = getAxisLength(axis);
		const arrowDimensions = await platform.getDimensions(element);
		const isYAxis = axis === "y";
		const minProp = isYAxis ? "top" : "left";
		const maxProp = isYAxis ? "bottom" : "right";
		const clientProp = isYAxis ? "clientHeight" : "clientWidth";
		const endDiff = rects.reference[length] + rects.reference[axis] - coords[axis] - rects.floating[length];
		const startDiff = coords[axis] - rects.reference[axis];
		const arrowOffsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(element));
		let clientSize = arrowOffsetParent ? arrowOffsetParent[clientProp] : 0;
		if (!clientSize || !await (platform.isElement == null ? void 0 : platform.isElement(arrowOffsetParent))) clientSize = elements.floating[clientProp] || rects.floating[length];
		const centerToReference = endDiff / 2 - startDiff / 2;
		const largestPossiblePadding = clientSize / 2 - arrowDimensions[length] / 2 - 1;
		const minPadding = min(paddingObject[minProp], largestPossiblePadding);
		const maxPadding = min(paddingObject[maxProp], largestPossiblePadding);
		const max = clientSize - arrowDimensions[length] - maxPadding;
		const center = clientSize / 2 - arrowDimensions[length] / 2 + centerToReference;
		const offset = clamp$1(minPadding, center, max);
		const shouldAddOffset = !middlewareData.arrow && getAlignment(placement) != null && center !== offset && rects.reference[length] / 2 - (center < minPadding ? minPadding : maxPadding) - arrowDimensions[length] / 2 < 0;
		const alignmentOffset = shouldAddOffset ? center < minPadding ? center - minPadding : center - max : 0;
		return {
			[axis]: coords[axis] + alignmentOffset,
			data: {
				[axis]: offset,
				centerOffset: center - offset - alignmentOffset,
				...shouldAddOffset && { alignmentOffset }
			},
			reset: shouldAddOffset
		};
	}
});
/**
* Optimizes the visibility of the floating element by flipping the `placement`
* in order to keep it in view when the preferred placement(s) will overflow the
* clipping boundary. Alternative to `autoPlacement`.
* @see https://floating-ui.com/docs/flip
*/
var flip$1 = function(options) {
	if (options === void 0) options = {};
	return {
		name: "flip",
		options,
		async fn(state) {
			var _middlewareData$arrow, _middlewareData$flip;
			const { placement, middlewareData, rects, initialPlacement, platform, elements } = state;
			const { mainAxis: checkMainAxis = true, crossAxis: checkCrossAxis = true, fallbackPlacements: specifiedFallbackPlacements, fallbackStrategy = "bestFit", fallbackAxisSideDirection = "none", flipAlignment = true, ...detectOverflowOptions } = evaluate(options, state);
			if ((_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) return {};
			const side = getSide$1(placement);
			const initialSideAxis = getSideAxis(initialPlacement);
			const isBasePlacement = getSide$1(initialPlacement) === initialPlacement;
			const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
			const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [getOppositePlacement(initialPlacement)] : getExpandedPlacements(initialPlacement));
			const hasFallbackAxisSideDirection = fallbackAxisSideDirection !== "none";
			if (!specifiedFallbackPlacements && hasFallbackAxisSideDirection) fallbackPlacements.push(...getOppositeAxisPlacements(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
			const placements = [initialPlacement, ...fallbackPlacements];
			const overflow = await platform.detectOverflow(state, detectOverflowOptions);
			const overflows = [];
			let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
			if (checkMainAxis) overflows.push(overflow[side]);
			if (checkCrossAxis) {
				const sides = getAlignmentSides(placement, rects, rtl);
				overflows.push(overflow[sides[0]], overflow[sides[1]]);
			}
			overflowsData = [...overflowsData, {
				placement,
				overflows
			}];
			if (!overflows.every((side) => side <= 0)) {
				var _middlewareData$flip2, _overflowsData$filter;
				const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
				const nextPlacement = placements[nextIndex];
				if (nextPlacement) {
					if (!(checkCrossAxis === "alignment" ? initialSideAxis !== getSideAxis(nextPlacement) : false) || overflowsData.every((d) => getSideAxis(d.placement) === initialSideAxis ? d.overflows[0] > 0 : true)) return {
						data: {
							index: nextIndex,
							overflows: overflowsData
						},
						reset: { placement: nextPlacement }
					};
				}
				let resetPlacement = (_overflowsData$filter = overflowsData.filter((d) => d.overflows[0] <= 0).sort((a, b) => a.overflows[1] - b.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;
				if (!resetPlacement) switch (fallbackStrategy) {
					case "bestFit": {
						var _overflowsData$filter2;
						const placement = (_overflowsData$filter2 = overflowsData.filter((d) => {
							if (hasFallbackAxisSideDirection) {
								const currentSideAxis = getSideAxis(d.placement);
								return currentSideAxis === initialSideAxis || currentSideAxis === "y";
							}
							return true;
						}).map((d) => [d.placement, d.overflows.filter((overflow) => overflow > 0).reduce((acc, overflow) => acc + overflow, 0)]).sort((a, b) => a[1] - b[1])[0]) == null ? void 0 : _overflowsData$filter2[0];
						if (placement) resetPlacement = placement;
						break;
					}
					case "initialPlacement":
						resetPlacement = initialPlacement;
						break;
				}
				if (placement !== resetPlacement) return { reset: { placement: resetPlacement } };
			}
			return {};
		}
	};
};
function getSideOffsets(overflow, rect) {
	return {
		top: overflow.top - rect.height,
		right: overflow.right - rect.width,
		bottom: overflow.bottom - rect.height,
		left: overflow.left - rect.width
	};
}
function isAnySideFullyClipped(overflow) {
	return sides.some((side) => overflow[side] >= 0);
}
/**
* Provides data to hide the floating element in applicable situations, such as
* when it is not in the same clipping context as the reference element.
* @see https://floating-ui.com/docs/hide
*/
var hide$1 = function(options) {
	if (options === void 0) options = {};
	return {
		name: "hide",
		options,
		async fn(state) {
			const { rects, platform } = state;
			const { strategy = "referenceHidden", ...detectOverflowOptions } = evaluate(options, state);
			switch (strategy) {
				case "referenceHidden": {
					const offsets = getSideOffsets(await platform.detectOverflow(state, {
						...detectOverflowOptions,
						elementContext: "reference"
					}), rects.reference);
					return { data: {
						referenceHiddenOffsets: offsets,
						referenceHidden: isAnySideFullyClipped(offsets)
					} };
				}
				case "escaped": {
					const offsets = getSideOffsets(await platform.detectOverflow(state, {
						...detectOverflowOptions,
						altBoundary: true
					}), rects.floating);
					return { data: {
						escapedOffsets: offsets,
						escaped: isAnySideFullyClipped(offsets)
					} };
				}
				default: return {};
			}
		}
	};
};
var originSides = /*#__PURE__*/ new Set(["left", "top"]);
async function convertValueToCoords(state, options) {
	const { placement, platform, elements } = state;
	const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
	const side = getSide$1(placement);
	const alignment = getAlignment(placement);
	const isVertical = getSideAxis(placement) === "y";
	const mainAxisMulti = originSides.has(side) ? -1 : 1;
	const crossAxisMulti = rtl && isVertical ? -1 : 1;
	const rawValue = evaluate(options, state);
	let { mainAxis, crossAxis, alignmentAxis } = typeof rawValue === "number" ? {
		mainAxis: rawValue,
		crossAxis: 0,
		alignmentAxis: null
	} : {
		mainAxis: rawValue.mainAxis || 0,
		crossAxis: rawValue.crossAxis || 0,
		alignmentAxis: rawValue.alignmentAxis
	};
	if (alignment && typeof alignmentAxis === "number") crossAxis = alignment === "end" ? alignmentAxis * -1 : alignmentAxis;
	return isVertical ? {
		x: crossAxis * crossAxisMulti,
		y: mainAxis * mainAxisMulti
	} : {
		x: mainAxis * mainAxisMulti,
		y: crossAxis * crossAxisMulti
	};
}
/**
* Modifies the placement by translating the floating element along the
* specified axes.
* A number (shorthand for `mainAxis` or distance), or an axes configuration
* object may be passed.
* @see https://floating-ui.com/docs/offset
*/
var offset$1 = function(options) {
	if (options === void 0) options = 0;
	return {
		name: "offset",
		options,
		async fn(state) {
			var _middlewareData$offse, _middlewareData$arrow;
			const { x, y, placement, middlewareData } = state;
			const diffCoords = await convertValueToCoords(state, options);
			if (placement === ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse.placement) && (_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) return {};
			return {
				x: x + diffCoords.x,
				y: y + diffCoords.y,
				data: {
					...diffCoords,
					placement
				}
			};
		}
	};
};
/**
* Optimizes the visibility of the floating element by shifting it in order to
* keep it in view when it will overflow the clipping boundary.
* @see https://floating-ui.com/docs/shift
*/
var shift$1 = function(options) {
	if (options === void 0) options = {};
	return {
		name: "shift",
		options,
		async fn(state) {
			const { x, y, placement, platform } = state;
			const { mainAxis: checkMainAxis = true, crossAxis: checkCrossAxis = false, limiter = { fn: (_ref) => {
				let { x, y } = _ref;
				return {
					x,
					y
				};
			} }, ...detectOverflowOptions } = evaluate(options, state);
			const coords = {
				x,
				y
			};
			const overflow = await platform.detectOverflow(state, detectOverflowOptions);
			const crossAxis = getSideAxis(placement);
			const mainAxis = getOppositeAxis(crossAxis);
			let mainAxisCoord = coords[mainAxis];
			let crossAxisCoord = coords[crossAxis];
			const clampCoord = (axis, coord) => clamp$1(coord + overflow[axis === "y" ? "top" : "left"], coord, coord - overflow[axis === "y" ? "bottom" : "right"]);
			if (checkMainAxis) mainAxisCoord = clampCoord(mainAxis, mainAxisCoord);
			if (checkCrossAxis) crossAxisCoord = clampCoord(crossAxis, crossAxisCoord);
			const limitedCoords = limiter.fn({
				...state,
				[mainAxis]: mainAxisCoord,
				[crossAxis]: crossAxisCoord
			});
			return {
				...limitedCoords,
				data: {
					x: limitedCoords.x - x,
					y: limitedCoords.y - y,
					enabled: {
						[mainAxis]: checkMainAxis,
						[crossAxis]: checkCrossAxis
					}
				}
			};
		}
	};
};
/**
* Built-in `limiter` that will stop `shift()` at a certain point.
*/
var limitShift$1 = function(options) {
	if (options === void 0) options = {};
	return {
		options,
		fn(state) {
			var _rawOffset$mainAxis, _rawOffset$crossAxis;
			const { x, y, placement, rects, middlewareData } = state;
			const { offset = 0, mainAxis: checkMainAxis = true, crossAxis: checkCrossAxis = true } = evaluate(options, state);
			const coords = {
				x,
				y
			};
			const crossAxis = getSideAxis(placement);
			const mainAxis = getOppositeAxis(crossAxis);
			let mainAxisCoord = coords[mainAxis];
			let crossAxisCoord = coords[crossAxis];
			const rawOffset = evaluate(offset, state);
			const computedOffset = typeof rawOffset === "number" ? {
				mainAxis: rawOffset,
				crossAxis: 0
			} : {
				mainAxis: (_rawOffset$mainAxis = rawOffset.mainAxis) != null ? _rawOffset$mainAxis : 0,
				crossAxis: (_rawOffset$crossAxis = rawOffset.crossAxis) != null ? _rawOffset$crossAxis : 0
			};
			if (checkMainAxis) {
				const len = mainAxis === "y" ? "height" : "width";
				const limitMin = rects.reference[mainAxis] - rects.floating[len] + computedOffset.mainAxis;
				const limitMax = rects.reference[mainAxis] + rects.reference[len] - computedOffset.mainAxis;
				if (mainAxisCoord < limitMin) mainAxisCoord = limitMin;
				else if (mainAxisCoord > limitMax) mainAxisCoord = limitMax;
			}
			if (checkCrossAxis) {
				var _middlewareData$offse, _middlewareData$offse2;
				const len = mainAxis === "y" ? "width" : "height";
				const isOriginSide = originSides.has(getSide$1(placement));
				const limitMin = rects.reference[crossAxis] - rects.floating[len] + (isOriginSide ? ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse[crossAxis]) || 0 : 0) + (isOriginSide ? 0 : computedOffset.crossAxis);
				const limitMax = rects.reference[crossAxis] + rects.reference[len] + (isOriginSide ? 0 : ((_middlewareData$offse2 = middlewareData.offset) == null ? void 0 : _middlewareData$offse2[crossAxis]) || 0) - (isOriginSide ? computedOffset.crossAxis : 0);
				if (crossAxisCoord < limitMin) crossAxisCoord = limitMin;
				else if (crossAxisCoord > limitMax) crossAxisCoord = limitMax;
			}
			return {
				[mainAxis]: mainAxisCoord,
				[crossAxis]: crossAxisCoord
			};
		}
	};
};
/**
* Provides data that allows you to change the size of the floating element —
* for instance, prevent it from overflowing the clipping boundary or match the
* width of the reference element.
* @see https://floating-ui.com/docs/size
*/
var size$1 = function(options) {
	if (options === void 0) options = {};
	return {
		name: "size",
		options,
		async fn(state) {
			const { placement, rects, platform, elements } = state;
			const { apply = () => {}, ...detectOverflowOptions } = evaluate(options, state);
			const overflow = await platform.detectOverflow(state, detectOverflowOptions);
			const side = getSide$1(placement);
			const alignment = getAlignment(placement);
			const isYAxis = getSideAxis(placement) === "y";
			const { width, height } = rects.floating;
			let heightSide;
			let widthSide;
			if (side === "top" || side === "bottom") {
				heightSide = side;
				widthSide = alignment === (await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating)) ? "start" : "end") ? "left" : "right";
			} else {
				widthSide = side;
				heightSide = alignment === "end" ? "top" : "bottom";
			}
			const maximumClippingHeight = height - overflow.top - overflow.bottom;
			const maximumClippingWidth = width - overflow.left - overflow.right;
			const overflowAvailableHeight = min(height - overflow[heightSide], maximumClippingHeight);
			const overflowAvailableWidth = min(width - overflow[widthSide], maximumClippingWidth);
			const shiftData = state.middlewareData.shift;
			const noShift = !shiftData;
			let availableHeight = overflowAvailableHeight;
			let availableWidth = overflowAvailableWidth;
			if (shiftData != null && shiftData.enabled.x) availableWidth = maximumClippingWidth;
			if (shiftData != null && shiftData.enabled.y) availableHeight = maximumClippingHeight;
			if (noShift && !alignment) if (isYAxis) availableWidth = width - 2 * max(overflow.left, overflow.right);
			else availableHeight = height - 2 * max(overflow.top, overflow.bottom);
			await apply({
				...state,
				availableWidth,
				availableHeight
			});
			const nextDimensions = await platform.getDimensions(elements.floating);
			if (width !== nextDimensions.width || height !== nextDimensions.height) return { reset: { rects: true } };
			return {};
		}
	};
};
//#endregion
//#region ../../node_modules/.bun/@floating-ui+utils@0.2.12/node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs
function hasWindow() {
	return typeof window !== "undefined";
}
function getNodeName(node) {
	if (isNode(node)) return (node.nodeName || "").toLowerCase();
	return "#document";
}
function getWindow(node) {
	var _node$ownerDocument;
	return (node == null || (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
}
function getDocumentElement(node) {
	var _ref;
	return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
}
function isNode(value) {
	if (!hasWindow()) return false;
	return value instanceof Node || value instanceof getWindow(value).Node;
}
function isElement(value) {
	if (!hasWindow()) return false;
	return value instanceof Element || value instanceof getWindow(value).Element;
}
function isHTMLElement(value) {
	if (!hasWindow()) return false;
	return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
}
function isShadowRoot(value) {
	if (!hasWindow() || typeof ShadowRoot === "undefined") return false;
	return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
}
function isOverflowElement(element) {
	const { overflow, overflowX, overflowY, display } = getComputedStyle$1(element);
	return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && display !== "inline" && display !== "contents";
}
function isTableElement(element) {
	return /^(table|td|th)$/.test(getNodeName(element));
}
function isTopLayer(element) {
	try {
		if (element.matches(":popover-open")) return true;
	} catch (_e) {}
	try {
		return element.matches(":modal");
	} catch (_e) {
		return false;
	}
}
var willChangeRe = /transform|translate|scale|rotate|perspective|filter/;
var containRe = /paint|layout|strict|content/;
var isNotNone = (value) => !!value && value !== "none";
var isWebKitValue;
function isContainingBlock(elementOrCss) {
	const css = isElement(elementOrCss) ? getComputedStyle$1(elementOrCss) : elementOrCss;
	return isNotNone(css.transform) || isNotNone(css.translate) || isNotNone(css.scale) || isNotNone(css.rotate) || isNotNone(css.perspective) || !isWebKit() && (isNotNone(css.backdropFilter) || isNotNone(css.filter)) || willChangeRe.test(css.willChange || "") || containRe.test(css.contain || "");
}
function getContainingBlock(element) {
	let currentNode = getParentNode(element);
	while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
		if (isContainingBlock(currentNode)) return currentNode;
		else if (isTopLayer(currentNode)) return null;
		currentNode = getParentNode(currentNode);
	}
	return null;
}
function isWebKit() {
	if (isWebKitValue == null) isWebKitValue = typeof CSS !== "undefined" && CSS.supports && CSS.supports("-webkit-backdrop-filter", "none");
	return isWebKitValue;
}
function isLastTraversableNode(node) {
	return /^(html|body|#document)$/.test(getNodeName(node));
}
function getComputedStyle$1(element) {
	return getWindow(element).getComputedStyle(element);
}
function getNodeScroll(element) {
	if (isElement(element)) return {
		scrollLeft: element.scrollLeft,
		scrollTop: element.scrollTop
	};
	return {
		scrollLeft: element.scrollX,
		scrollTop: element.scrollY
	};
}
function getParentNode(node) {
	if (getNodeName(node) === "html") return node;
	const result = node.assignedSlot || node.parentNode || isShadowRoot(node) && node.host || getDocumentElement(node);
	return isShadowRoot(result) ? result.host : result;
}
function getNearestOverflowAncestor(node) {
	const parentNode = getParentNode(node);
	if (isLastTraversableNode(parentNode)) return (node.ownerDocument || node).body;
	if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) return parentNode;
	return getNearestOverflowAncestor(parentNode);
}
function getOverflowAncestors(node, list, traverseIframes) {
	var _node$ownerDocument2;
	if (list === void 0) list = [];
	const scrollableAncestor = getNearestOverflowAncestor(node);
	const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
	const win = getWindow(scrollableAncestor);
	if (isBody) {
		getFrameElement(win);
		return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], []);
	} else return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, []));
}
function getFrameElement(win) {
	return win.parent && Object.getPrototypeOf(win.parent) ? win.frameElement : null;
}
//#endregion
//#region ../../node_modules/.bun/@floating-ui+dom@1.8.0/node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs
function getCssDimensions(element) {
	const css = getComputedStyle$1(element);
	let width = parseFloat(css.width) || 0;
	let height = parseFloat(css.height) || 0;
	const hasOffset = isHTMLElement(element);
	const offsetWidth = hasOffset ? element.offsetWidth : width;
	const offsetHeight = hasOffset ? element.offsetHeight : height;
	const shouldFallback = round(width) !== offsetWidth || round(height) !== offsetHeight;
	if (shouldFallback) {
		width = offsetWidth;
		height = offsetHeight;
	}
	return {
		width,
		height,
		$: shouldFallback
	};
}
function unwrapElement(element) {
	return !isElement(element) ? element.contextElement : element;
}
function getScale(element) {
	const domElement = unwrapElement(element);
	if (!isHTMLElement(domElement)) return createCoords(1);
	const rect = domElement.getBoundingClientRect();
	const { width, height, $ } = getCssDimensions(domElement);
	let x = ($ ? round(rect.width) : rect.width) / width;
	let y = ($ ? round(rect.height) : rect.height) / height;
	if (!x || !Number.isFinite(x)) x = 1;
	if (!y || !Number.isFinite(y)) y = 1;
	return {
		x,
		y
	};
}
var noOffsets = /*#__PURE__*/ createCoords(0);
function getVisualOffsets(element) {
	const win = getWindow(element);
	if (!isWebKit() || !win.visualViewport) return noOffsets;
	return {
		x: win.visualViewport.offsetLeft,
		y: win.visualViewport.offsetTop
	};
}
function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
	if (isFixed === void 0) isFixed = false;
	return !!floatingOffsetParent && isFixed && floatingOffsetParent === getWindow(element);
}
function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
	if (includeScale === void 0) includeScale = false;
	if (isFixedStrategy === void 0) isFixedStrategy = false;
	const clientRect = element.getBoundingClientRect();
	const domElement = unwrapElement(element);
	let scale = createCoords(1);
	if (includeScale) if (offsetParent) {
		if (isElement(offsetParent)) scale = getScale(offsetParent);
	} else scale = getScale(element);
	const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : createCoords(0);
	let x = (clientRect.left + visualOffsets.x) / scale.x;
	let y = (clientRect.top + visualOffsets.y) / scale.y;
	let width = clientRect.width / scale.x;
	let height = clientRect.height / scale.y;
	if (domElement && offsetParent) {
		const win = getWindow(domElement);
		const offsetWin = isElement(offsetParent) ? getWindow(offsetParent) : offsetParent;
		let currentWin = win;
		let currentIFrame = getFrameElement(currentWin);
		while (currentIFrame && offsetWin !== currentWin) {
			const iframeScale = getScale(currentIFrame);
			const iframeRect = currentIFrame.getBoundingClientRect();
			const css = getComputedStyle$1(currentIFrame);
			const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
			const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
			x *= iframeScale.x;
			y *= iframeScale.y;
			width *= iframeScale.x;
			height *= iframeScale.y;
			x += left;
			y += top;
			currentWin = getWindow(currentIFrame);
			currentIFrame = getFrameElement(currentWin);
		}
	}
	return rectToClientRect({
		width,
		height,
		x,
		y
	});
}
function getWindowScrollBarX(element, rect) {
	const leftScroll = getNodeScroll(element).scrollLeft;
	if (!rect) return getBoundingClientRect(getDocumentElement(element)).left + leftScroll;
	return rect.left + leftScroll;
}
function getHTMLOffset(documentElement, scroll) {
	const htmlRect = documentElement.getBoundingClientRect();
	return {
		x: htmlRect.left + scroll.scrollLeft - getWindowScrollBarX(documentElement, htmlRect),
		y: htmlRect.top + scroll.scrollTop
	};
}
function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
	let { elements, rect, offsetParent, strategy } = _ref;
	const isFixed = strategy === "fixed";
	const documentElement = getDocumentElement(offsetParent);
	const topLayer = elements ? isTopLayer(elements.floating) : false;
	if (offsetParent === documentElement || topLayer && isFixed) return rect;
	let scroll = {
		scrollLeft: 0,
		scrollTop: 0
	};
	let scale = createCoords(1);
	const offsets = createCoords(0);
	const isOffsetParentAnElement = isHTMLElement(offsetParent);
	if (isOffsetParentAnElement || !isFixed) {
		if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) scroll = getNodeScroll(offsetParent);
		if (isOffsetParentAnElement) {
			const offsetRect = getBoundingClientRect(offsetParent);
			scale = getScale(offsetParent);
			offsets.x = offsetRect.x + offsetParent.clientLeft;
			offsets.y = offsetRect.y + offsetParent.clientTop;
		}
	}
	const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
	return {
		width: rect.width * scale.x,
		height: rect.height * scale.y,
		x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x + htmlOffset.x,
		y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y + htmlOffset.y
	};
}
function getClientRects(element) {
	return element.getClientRects ? Array.from(element.getClientRects()) : [];
}
function getDocumentRect(html) {
	const scroll = getNodeScroll(html);
	const body = html.ownerDocument.body;
	const width = max(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
	const height = max(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
	let x = -scroll.scrollLeft + getWindowScrollBarX(html);
	const y = -scroll.scrollTop;
	if (getComputedStyle$1(body).direction === "rtl") x += max(html.clientWidth, body.clientWidth) - width;
	return {
		width,
		height,
		x,
		y
	};
}
var SCROLLBAR_MAX = 25;
function getViewportRect(element, strategy, rootBoundary) {
	if (rootBoundary === void 0) rootBoundary = "viewport";
	const isLayoutViewport = rootBoundary === "layoutViewport";
	const win = getWindow(element);
	const html = getDocumentElement(element);
	const visualViewport = win.visualViewport;
	let width = html.clientWidth;
	let height = html.clientHeight;
	let x = 0;
	let y = 0;
	if (visualViewport) {
		const layoutRelativeClientCoords = !isWebKit() || strategy === "fixed";
		if (isLayoutViewport) {
			if (!layoutRelativeClientCoords) {
				x = -visualViewport.offsetLeft;
				y = -visualViewport.offsetTop;
			}
		} else {
			width = visualViewport.width;
			height = visualViewport.height;
			if (layoutRelativeClientCoords) {
				x = visualViewport.offsetLeft;
				y = visualViewport.offsetTop;
			}
		}
	}
	if (getWindowScrollBarX(html) <= 0) {
		const doc = html.ownerDocument;
		const body = doc.body;
		const bodyStyles = getComputedStyle(body);
		const bodyMarginInline = doc.compatMode === "CSS1Compat" ? parseFloat(bodyStyles.marginLeft) + parseFloat(bodyStyles.marginRight) || 0 : 0;
		const reservedWidth = Math.abs(html.clientWidth - body.clientWidth - bodyMarginInline);
		const gutter = getComputedStyle(html).scrollbarGutter === "stable both-edges" ? reservedWidth / 2 : reservedWidth;
		if (gutter <= SCROLLBAR_MAX) width -= gutter;
	}
	return {
		width,
		height,
		x,
		y
	};
}
function getInnerBoundingClientRect(element, strategy) {
	const clientRect = getBoundingClientRect(element, true, strategy === "fixed");
	const top = clientRect.top + element.clientTop;
	const left = clientRect.left + element.clientLeft;
	const scale = getScale(element);
	return {
		width: element.clientWidth * scale.x,
		height: element.clientHeight * scale.y,
		x: left * scale.x,
		y: top * scale.y
	};
}
function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
	let rect;
	if (clippingAncestor === "viewport" || clippingAncestor === "layoutViewport") rect = getViewportRect(element, strategy, clippingAncestor);
	else if (clippingAncestor === "document") rect = getDocumentRect(getDocumentElement(element));
	else if (isElement(clippingAncestor)) rect = getInnerBoundingClientRect(clippingAncestor, strategy);
	else {
		const visualOffsets = getVisualOffsets(element);
		rect = {
			x: clippingAncestor.x - visualOffsets.x,
			y: clippingAncestor.y - visualOffsets.y,
			width: clippingAncestor.width,
			height: clippingAncestor.height
		};
	}
	return rectToClientRect(rect);
}
function getClippingElementAncestors(element, cache) {
	const cachedResult = cache.get(element);
	if (cachedResult) return cachedResult;
	let result = getOverflowAncestors(element, []).filter((el) => isElement(el) && getNodeName(el) !== "body");
	let lastKeptComputedStyle = null;
	const elementIsFixed = getComputedStyle$1(element).position === "fixed";
	let currentNode = elementIsFixed ? getParentNode(element) : element;
	while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
		const computedStyle = getComputedStyle$1(currentNode);
		const currentNodeIsContaining = isContainingBlock(currentNode);
		const lastPosition = lastKeptComputedStyle ? lastKeptComputedStyle.position : elementIsFixed ? "fixed" : "";
		if (!currentNodeIsContaining && (lastPosition === "fixed" || lastPosition === "absolute" && computedStyle.position === "static")) result = result.filter((ancestor) => ancestor !== currentNode);
		else lastKeptComputedStyle = computedStyle;
		currentNode = getParentNode(currentNode);
	}
	cache.set(element, result);
	return result;
}
function getClippingRect(_ref) {
	let { element, boundary, rootBoundary, strategy } = _ref;
	const clippingAncestors = [...boundary === "clippingAncestors" ? isTopLayer(element) ? [] : getClippingElementAncestors(element, this._c) : [].concat(boundary), rootBoundary];
	const firstRect = getClientRectFromClippingAncestor(element, clippingAncestors[0], strategy);
	let top = firstRect.top;
	let right = firstRect.right;
	let bottom = firstRect.bottom;
	let left = firstRect.left;
	for (let i = 1; i < clippingAncestors.length; i++) {
		const rect = getClientRectFromClippingAncestor(element, clippingAncestors[i], strategy);
		top = max(rect.top, top);
		right = min(rect.right, right);
		bottom = min(rect.bottom, bottom);
		left = max(rect.left, left);
	}
	return {
		width: right - left,
		height: bottom - top,
		x: left,
		y: top
	};
}
function getDimensions(element) {
	const { width, height } = getCssDimensions(element);
	return {
		width,
		height
	};
}
function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
	const isOffsetParentAnElement = isHTMLElement(offsetParent);
	const documentElement = getDocumentElement(offsetParent);
	const isFixed = strategy === "fixed";
	const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
	let scroll = {
		scrollLeft: 0,
		scrollTop: 0
	};
	const offsets = createCoords(0);
	if (isOffsetParentAnElement || !isFixed) {
		if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) scroll = getNodeScroll(offsetParent);
		if (isOffsetParentAnElement) {
			const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
			offsets.x = offsetRect.x + offsetParent.clientLeft;
			offsets.y = offsetRect.y + offsetParent.clientTop;
		}
	}
	if (!isOffsetParentAnElement && documentElement) offsets.x = getWindowScrollBarX(documentElement);
	const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
	return {
		x: rect.left + scroll.scrollLeft - offsets.x - htmlOffset.x,
		y: rect.top + scroll.scrollTop - offsets.y - htmlOffset.y,
		width: rect.width,
		height: rect.height
	};
}
function isStaticPositioned(element) {
	return getComputedStyle$1(element).position === "static";
}
function getTrueOffsetParent(element, polyfill) {
	if (!isHTMLElement(element) || getComputedStyle$1(element).position === "fixed") return null;
	if (polyfill) return polyfill(element);
	let rawOffsetParent = element.offsetParent;
	if (getDocumentElement(element) === rawOffsetParent) rawOffsetParent = rawOffsetParent.ownerDocument.body;
	return rawOffsetParent;
}
function getOffsetParent(element, polyfill) {
	const win = getWindow(element);
	if (isTopLayer(element)) return win;
	if (!isHTMLElement(element)) {
		let svgOffsetParent = getParentNode(element);
		while (svgOffsetParent && !isLastTraversableNode(svgOffsetParent)) {
			if (isElement(svgOffsetParent) && !isStaticPositioned(svgOffsetParent)) return svgOffsetParent;
			svgOffsetParent = getParentNode(svgOffsetParent);
		}
		return win;
	}
	let offsetParent = getTrueOffsetParent(element, polyfill);
	while (offsetParent && isTableElement(offsetParent) && isStaticPositioned(offsetParent)) offsetParent = getTrueOffsetParent(offsetParent, polyfill);
	if (offsetParent && isLastTraversableNode(offsetParent) && isStaticPositioned(offsetParent) && !isContainingBlock(offsetParent)) return win;
	return offsetParent || getContainingBlock(element) || win;
}
var getElementRects = async function(data) {
	const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
	const getDimensionsFn = this.getDimensions;
	const floatingDimensions = await getDimensionsFn(data.floating);
	return {
		reference: getRectRelativeToOffsetParent(data.reference, await getOffsetParentFn(data.floating), data.strategy),
		floating: {
			x: 0,
			y: 0,
			width: floatingDimensions.width,
			height: floatingDimensions.height
		}
	};
};
function isRTL(element) {
	return getComputedStyle$1(element).direction === "rtl";
}
var platform = {
	convertOffsetParentRelativeRectToViewportRelativeRect,
	getDocumentElement,
	getClippingRect,
	getOffsetParent,
	getElementRects,
	getClientRects,
	getDimensions,
	getScale,
	isElement,
	isRTL
};
/**
* Modifies the placement by translating the floating element along the
* specified axes.
* A number (shorthand for `mainAxis` or distance), or an axes configuration
* object may be passed.
* @see https://floating-ui.com/docs/offset
*/
var offset = offset$1;
/**
* Optimizes the visibility of the floating element by shifting it in order to
* keep it in view when it will overflow the clipping boundary.
* @see https://floating-ui.com/docs/shift
*/
var shift = shift$1;
/**
* Optimizes the visibility of the floating element by flipping the `placement`
* in order to keep it in view when the preferred placement(s) will overflow the
* clipping boundary. Alternative to `autoPlacement`.
* @see https://floating-ui.com/docs/flip
*/
var flip = flip$1;
/**
* Provides data that allows you to change the size of the floating element —
* for instance, prevent it from overflowing the clipping boundary or match the
* width of the reference element.
* @see https://floating-ui.com/docs/size
*/
var size = size$1;
/**
* Provides data to hide the floating element in applicable situations, such as
* when it is not in the same clipping context as the reference element.
* @see https://floating-ui.com/docs/hide
*/
var hide = hide$1;
/**
* Provides data to position an inner element of the floating element so that it
* appears centered to the reference element.
* @see https://floating-ui.com/docs/arrow
*/
var arrow = arrow$1;
/**
* Built-in `limiter` that will stop `shift()` at a certain point.
*/
var limitShift = limitShift$1;
/**
* Computes the `x` and `y` coordinates that will place the floating element
* next to a given reference element.
*/
var computePosition = (reference, floating, options) => {
	const cache = /* @__PURE__ */ new Map();
	const mergedOptions = options != null ? options : {};
	const platformWithCache = {
		...platform,
		...mergedOptions.platform,
		_c: cache
	};
	return computePosition$1(reference, floating, {
		...mergedOptions,
		platform: platformWithCache
	});
};
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/internal/floating-svelte/floating-utils.svelte.js
function get(valueOrGetValue) {
	return typeof valueOrGetValue === "function" ? valueOrGetValue() : valueOrGetValue;
}
function getDPR(element) {
	if (typeof window === "undefined") return 1;
	return (element.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function roundByDPR(element, value) {
	const dpr = getDPR(element);
	return Math.round(value * dpr) / dpr;
}
function getFloatingContentCSSVars(name) {
	return {
		[`--bits-${name}-content-transform-origin`]: `var(--bits-floating-transform-origin)`,
		[`--bits-${name}-content-available-width`]: `var(--bits-floating-available-width)`,
		[`--bits-${name}-content-available-height`]: `var(--bits-floating-available-height)`,
		[`--bits-${name}-anchor-width`]: `var(--bits-floating-anchor-width)`,
		[`--bits-${name}-anchor-height`]: `var(--bits-floating-anchor-height)`
	};
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/internal/floating-svelte/use-floating.svelte.js
function useFloating(options) {
	const openOption = derived(() => get(options.open) ?? true);
	const middlewareOption = derived(() => get(options.middleware));
	const transformOption = derived(() => get(options.transform) ?? true);
	const placementOption = derived(() => get(options.placement) ?? "bottom");
	const strategyOption = derived(() => get(options.strategy) ?? "absolute");
	const sideOffsetOption = derived(() => get(options.sideOffset) ?? 0);
	const alignOffsetOption = derived(() => get(options.alignOffset) ?? 0);
	const reference = options.reference;
	/** State */
	let x = 0;
	let y = 0;
	const floating = simpleBox(null);
	let strategy = strategyOption();
	let placement = placementOption();
	let middlewareData = {};
	let isPositioned = false;
	let updateRequestId = 0;
	const floatingStyles = derived(() => {
		const xVal = floating.current ? roundByDPR(floating.current, x) : x;
		const yVal = floating.current ? roundByDPR(floating.current, y) : y;
		if (transformOption()) return {
			position: strategy,
			left: "0",
			top: "0",
			transform: `translate(${xVal}px, ${yVal}px)`,
			...floating.current && getDPR(floating.current) >= 1.5 && { willChange: "transform" }
		};
		return {
			position: strategy,
			left: `${xVal}px`,
			top: `${yVal}px`
		};
	});
	function update() {
		if (reference.current === null || floating.current === null) return;
		const referenceNode = reference.current;
		const floatingNode = floating.current;
		const requestId = ++updateRequestId;
		computePosition(referenceNode, floatingNode, {
			middleware: middlewareOption(),
			placement: placementOption(),
			strategy: strategyOption()
		}).then((position) => {
			if (requestId !== updateRequestId) return;
			if (reference.current !== referenceNode || floating.current !== floatingNode) return;
			if (isReferenceHidden(referenceNode)) {
				middlewareData = {
					...middlewareData,
					hide: {
						...middlewareData.hide,
						referenceHidden: true
					}
				};
				return;
			}
			if (!openOption() && x !== 0 && y !== 0) {
				const maxExpectedOffset = Math.max(Math.abs(sideOffsetOption()), Math.abs(alignOffsetOption()), 15);
				if (position.x <= maxExpectedOffset && position.y <= maxExpectedOffset) return;
			}
			x = position.x;
			y = position.y;
			strategy = position.strategy;
			placement = position.placement;
			middlewareData = position.middlewareData;
			isPositioned = true;
		});
	}
	return {
		floating,
		reference,
		get strategy() {
			return strategy;
		},
		get placement() {
			return placement;
		},
		get middlewareData() {
			return middlewareData;
		},
		get isPositioned() {
			return isPositioned;
		},
		get floatingStyles() {
			return floatingStyles();
		},
		get update() {
			return update;
		}
	};
}
function isReferenceHidden(node) {
	if (!(node instanceof Element)) return false;
	if (!node.isConnected) return true;
	if (node instanceof HTMLElement && node.hidden) return true;
	return node.getClientRects().length === 0;
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/utilities/floating-layer/use-floating-layer.svelte.js
var OPPOSITE_SIDE = {
	top: "bottom",
	right: "left",
	bottom: "top",
	left: "right"
};
var FloatingRootContext = new Context("Floating.Root");
var FloatingContentContext = new Context("Floating.Content");
var FloatingTooltipRootContext = new Context("Floating.Root");
var FloatingRootState = class FloatingRootState {
	static create(tooltip = false) {
		return tooltip ? FloatingTooltipRootContext.set(new FloatingRootState()) : FloatingRootContext.set(new FloatingRootState());
	}
	anchorNode = simpleBox(null);
	customAnchorNode = simpleBox(null);
	triggerNode = simpleBox(null);
	constructor() {}
};
var FloatingContentState = class FloatingContentState {
	static create(opts, tooltip = false) {
		return tooltip ? FloatingContentContext.set(new FloatingContentState(opts, FloatingTooltipRootContext.get())) : FloatingContentContext.set(new FloatingContentState(opts, FloatingRootContext.get()));
	}
	opts;
	root;
	contentRef = simpleBox(null);
	wrapperRef = simpleBox(null);
	arrowRef = simpleBox(null);
	contentAttachment = attachRef(this.contentRef);
	wrapperAttachment = attachRef(this.wrapperRef);
	arrowAttachment = attachRef(this.arrowRef);
	arrowId = simpleBox(useId());
	#transformedStyle = derived(() => {
		if (typeof this.opts.style === "string") return cssToStyleObj(this.opts.style);
		if (!this.opts.style) return {};
	});
	#updatePositionStrategy = void 0;
	#arrowSize = new ElementSize(() => this.arrowRef.current ?? void 0);
	#arrowWidth = derived(() => this.#arrowSize?.width ?? 0);
	#arrowHeight = derived(() => this.#arrowSize?.height ?? 0);
	#desiredPlacement = derived(() => this.opts.side?.current + (this.opts.align.current !== "center" ? `-${this.opts.align.current}` : ""));
	#boundary = derived(() => Array.isArray(this.opts.collisionBoundary.current) ? this.opts.collisionBoundary.current : [this.opts.collisionBoundary.current]);
	#hasExplicitBoundaries = derived(() => this.#boundary().length > 0);
	get hasExplicitBoundaries() {
		return this.#hasExplicitBoundaries();
	}
	set hasExplicitBoundaries($$value) {
		return this.#hasExplicitBoundaries($$value);
	}
	#detectOverflowOptions = derived(() => ({
		padding: this.opts.collisionPadding.current,
		boundary: this.#boundary().filter(isNotNull),
		altBoundary: this.hasExplicitBoundaries
	}));
	get detectOverflowOptions() {
		return this.#detectOverflowOptions();
	}
	set detectOverflowOptions($$value) {
		return this.#detectOverflowOptions($$value);
	}
	#availableWidth = void 0;
	#availableHeight = void 0;
	#anchorWidth = void 0;
	#anchorHeight = void 0;
	#middleware = derived(() => [
		offset({
			mainAxis: this.opts.sideOffset.current + this.#arrowHeight(),
			alignmentAxis: this.opts.alignOffset.current
		}),
		this.opts.avoidCollisions.current && shift({
			mainAxis: true,
			crossAxis: false,
			limiter: this.opts.sticky.current === "partial" ? limitShift() : void 0,
			...this.detectOverflowOptions
		}),
		this.opts.avoidCollisions.current && flip({ ...this.detectOverflowOptions }),
		size({
			...this.detectOverflowOptions,
			apply: ({ rects, availableWidth, availableHeight }) => {
				const { width: anchorWidth, height: anchorHeight } = rects.reference;
				this.#availableWidth = availableWidth;
				this.#availableHeight = availableHeight;
				this.#anchorWidth = anchorWidth;
				this.#anchorHeight = anchorHeight;
			}
		}),
		this.arrowRef.current && arrow({
			element: this.arrowRef.current,
			padding: this.opts.arrowPadding.current
		}),
		transformOrigin({
			arrowWidth: this.#arrowWidth(),
			arrowHeight: this.#arrowHeight()
		}),
		this.opts.hideWhenDetached.current && hide({
			strategy: "referenceHidden",
			...this.detectOverflowOptions
		})
	].filter(Boolean));
	get middleware() {
		return this.#middleware();
	}
	set middleware($$value) {
		return this.#middleware($$value);
	}
	floating;
	#placedSide = derived(() => getSideFromPlacement(this.floating.placement));
	get placedSide() {
		return this.#placedSide();
	}
	set placedSide($$value) {
		return this.#placedSide($$value);
	}
	#placedAlign = derived(() => getAlignFromPlacement(this.floating.placement));
	get placedAlign() {
		return this.#placedAlign();
	}
	set placedAlign($$value) {
		return this.#placedAlign($$value);
	}
	#arrowX = derived(() => this.floating.middlewareData.arrow?.x ?? 0);
	get arrowX() {
		return this.#arrowX();
	}
	set arrowX($$value) {
		return this.#arrowX($$value);
	}
	#arrowY = derived(() => this.floating.middlewareData.arrow?.y ?? 0);
	get arrowY() {
		return this.#arrowY();
	}
	set arrowY($$value) {
		return this.#arrowY($$value);
	}
	#cannotCenterArrow = derived(() => this.floating.middlewareData.arrow?.centerOffset !== 0);
	get cannotCenterArrow() {
		return this.#cannotCenterArrow();
	}
	set cannotCenterArrow($$value) {
		return this.#cannotCenterArrow($$value);
	}
	contentZIndex;
	#arrowBaseSide = derived(() => OPPOSITE_SIDE[this.placedSide]);
	get arrowBaseSide() {
		return this.#arrowBaseSide();
	}
	set arrowBaseSide($$value) {
		return this.#arrowBaseSide($$value);
	}
	#wrapperProps = derived(() => ({
		id: this.opts.wrapperId.current,
		"data-bits-floating-content-wrapper": "",
		style: {
			...this.floating.floatingStyles,
			transform: this.floating.isPositioned ? this.floating.floatingStyles.transform : "translate(0, -200%)",
			minWidth: "max-content",
			zIndex: this.contentZIndex,
			"--bits-floating-transform-origin": `${this.floating.middlewareData.transformOrigin?.x} ${this.floating.middlewareData.transformOrigin?.y}`,
			"--bits-floating-available-width": `${this.#availableWidth}px`,
			"--bits-floating-available-height": `${this.#availableHeight}px`,
			"--bits-floating-anchor-width": `${this.#anchorWidth}px`,
			"--bits-floating-anchor-height": `${this.#anchorHeight}px`,
			...this.floating.middlewareData.hide?.referenceHidden && {
				visibility: "hidden",
				"pointer-events": "none"
			},
			...this.#transformedStyle()
		},
		dir: this.opts.dir.current,
		...this.wrapperAttachment
	}));
	get wrapperProps() {
		return this.#wrapperProps();
	}
	set wrapperProps($$value) {
		return this.#wrapperProps($$value);
	}
	#props = derived(() => ({
		"data-side": this.placedSide,
		"data-align": this.placedAlign,
		style: styleToString({ ...this.#transformedStyle() }),
		...this.contentAttachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
	#arrowStyle = derived(() => ({
		position: "absolute",
		left: this.arrowX ? `${this.arrowX}px` : void 0,
		top: this.arrowY ? `${this.arrowY}px` : void 0,
		[this.arrowBaseSide]: 0,
		"transform-origin": {
			top: "",
			right: "0 0",
			bottom: "center 0",
			left: "100% 0"
		}[this.placedSide],
		transform: {
			top: "translateY(100%)",
			right: "translateY(50%) rotate(90deg) translateX(-50%)",
			bottom: "rotate(180deg)",
			left: "translateY(50%) rotate(-90deg) translateX(50%)"
		}[this.placedSide],
		visibility: this.cannotCenterArrow ? "hidden" : void 0
	}));
	get arrowStyle() {
		return this.#arrowStyle();
	}
	set arrowStyle($$value) {
		return this.#arrowStyle($$value);
	}
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.#updatePositionStrategy = opts.updatePositionStrategy;
		if (opts.customAnchor) this.root.customAnchorNode.current = opts.customAnchor.current;
		watch(() => opts.customAnchor.current, (customAnchor) => {
			this.root.customAnchorNode.current = customAnchor;
		});
		this.floating = useFloating({
			strategy: () => this.opts.strategy.current,
			placement: () => this.#desiredPlacement(),
			middleware: () => this.middleware,
			reference: this.root.anchorNode,
			open: () => this.opts.enabled.current,
			sideOffset: () => this.opts.sideOffset.current,
			alignOffset: () => this.opts.alignOffset.current
		});
		watch(() => this.contentRef.current, (contentNode) => {
			if (!contentNode || !this.opts.enabled.current) return;
			const win = getWindow$1(contentNode);
			const rafId = win.requestAnimationFrame(() => {
				if (this.contentRef.current !== contentNode || !this.opts.enabled.current) return;
				const zIndex = win.getComputedStyle(contentNode).zIndex;
				if (zIndex !== this.contentZIndex) this.contentZIndex = zIndex;
			});
			return () => {
				win.cancelAnimationFrame(rafId);
			};
		});
	}
};
var FloatingArrowState = class FloatingArrowState {
	static create(opts) {
		return new FloatingArrowState(opts, FloatingContentContext.get());
	}
	opts;
	content;
	constructor(opts, content) {
		this.opts = opts;
		this.content = content;
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		style: this.content.arrowStyle,
		"data-side": this.content.placedSide,
		...this.content.arrowAttachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var FloatingAnchorState = class FloatingAnchorState {
	static create(opts, tooltip = false) {
		return tooltip ? new FloatingAnchorState(opts, FloatingTooltipRootContext.get()) : new FloatingAnchorState(opts, FloatingRootContext.get());
	}
	opts;
	root;
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		if (opts.virtualEl && opts.virtualEl.current) root.triggerNode = boxFrom(opts.virtualEl.current);
		else root.triggerNode = opts.ref;
	}
};
function transformOrigin(options) {
	return {
		name: "transformOrigin",
		options,
		fn(data) {
			const { placement, rects, middlewareData } = data;
			const isArrowHidden = middlewareData.arrow?.centerOffset !== 0;
			const arrowWidth = isArrowHidden ? 0 : options.arrowWidth;
			const arrowHeight = isArrowHidden ? 0 : options.arrowHeight;
			const [placedSide, placedAlign] = getSideAndAlignFromPlacement(placement);
			const noArrowAlign = {
				start: "0%",
				center: "50%",
				end: "100%"
			}[placedAlign];
			const arrowXCenter = (middlewareData.arrow?.x ?? 0) + arrowWidth / 2;
			const arrowYCenter = (middlewareData.arrow?.y ?? 0) + arrowHeight / 2;
			let x = "";
			let y = "";
			if (placedSide === "bottom") {
				x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
				y = `${-arrowHeight}px`;
			} else if (placedSide === "top") {
				x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
				y = `${rects.floating.height + arrowHeight}px`;
			} else if (placedSide === "right") {
				x = `${-arrowHeight}px`;
				y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
			} else if (placedSide === "left") {
				x = `${rects.floating.width + arrowHeight}px`;
				y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
			}
			return { data: {
				x,
				y
			} };
		}
	};
}
function getSideAndAlignFromPlacement(placement) {
	const [side, align = "center"] = placement.split("-");
	return [side, align];
}
function getSideFromPlacement(placement) {
	return getSideAndAlignFromPlacement(placement)[0];
}
function getAlignFromPlacement(placement) {
	return getSideAndAlignFromPlacement(placement)[1];
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/utilities/floating-layer/components/floating-layer.svelte
function Floating_layer($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { children, tooltip = false } = $$props;
		FloatingRootState.create(tooltip);
		children?.($$renderer);
		$$renderer.push(`<!---->`);
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/internal/data-typeahead.svelte.js
var DataTypeahead = class {
	#opts;
	#candidateValues = derived(() => this.#opts.candidateValues());
	#search;
	constructor(opts) {
		this.#opts = opts;
		this.#search = boxAutoReset("", {
			afterMs: 1e3,
			getWindow: this.#opts.getWindow
		});
		this.handleTypeaheadSearch = this.handleTypeaheadSearch.bind(this);
		this.resetTypeahead = this.resetTypeahead.bind(this);
	}
	handleTypeaheadSearch(key) {
		if (!this.#opts.enabled() || !this.#candidateValues().length) return;
		this.#search.current = this.#search.current + key;
		const currentItem = this.#opts.getCurrentItem();
		const currentMatch = this.#candidateValues().find((item) => item === currentItem) ?? "";
		const nextMatch = getNextMatch(this.#candidateValues().map((item) => item ?? ""), this.#search.current, currentMatch);
		const newItem = this.#candidateValues().find((item) => item === nextMatch);
		if (newItem) this.#opts.onMatch(newItem);
		return newItem;
	}
	resetTypeahead() {
		this.#search.current = "";
	}
};
var FIRST_KEYS = [
	ARROW_DOWN,
	PAGE_UP,
	HOME
];
var LAST_KEYS = [
	ARROW_UP,
	PAGE_DOWN,
	"End"
];
var FIRST_LAST_KEYS = [...FIRST_KEYS, ...LAST_KEYS];
var selectAttrs = createBitsAttrs({
	component: "select",
	parts: [
		"trigger",
		"content",
		"item",
		"viewport",
		"scroll-up-button",
		"scroll-down-button",
		"group",
		"group-label",
		"separator",
		"arrow",
		"input",
		"content-wrapper",
		"item-text",
		"value"
	]
});
var SelectRootContext = new Context("Select.Root | Combobox.Root");
var SelectGroupContext = new Context("Select.Group | Combobox.Group");
var SelectContentContext = new Context("Select.Content | Combobox.Content");
var SelectBaseRootState = class {
	opts;
	touchedInput = false;
	inputNode = null;
	contentNode = null;
	contentPresence;
	viewportNode = null;
	triggerNode = null;
	valueNode = null;
	valueId = "";
	highlightedNode = null;
	#highlightedValue = derived(() => {
		if (!this.highlightedNode) return null;
		return this.highlightedNode.getAttribute("data-value");
	});
	get highlightedValue() {
		return this.#highlightedValue();
	}
	set highlightedValue($$value) {
		return this.#highlightedValue($$value);
	}
	#highlightedId = derived(() => {
		if (!this.highlightedNode) return void 0;
		return this.highlightedNode.id;
	});
	get highlightedId() {
		return this.#highlightedId();
	}
	set highlightedId($$value) {
		return this.#highlightedId($$value);
	}
	#highlightedLabel = derived(() => {
		if (!this.highlightedNode) return null;
		return this.highlightedNode.getAttribute("data-label");
	});
	get highlightedLabel() {
		return this.#highlightedLabel();
	}
	set highlightedLabel($$value) {
		return this.#highlightedLabel($$value);
	}
	contentIsPositioned = false;
	isUsingKeyboard = false;
	isCombobox = false;
	domContext = new DOMContext(() => null);
	constructor(opts) {
		this.opts = opts;
		this.isCombobox = opts.isCombobox;
		this.contentPresence = new PresenceManager({
			ref: boxWith(() => this.contentNode),
			open: this.opts.open,
			onComplete: () => {
				this.opts.onOpenChangeComplete.current(this.opts.open.current);
			}
		});
	}
	setHighlightedNode(node, initial = false) {
		this.highlightedNode = node;
		if (node && (this.isUsingKeyboard || initial)) this.scrollHighlightedNodeIntoView(node);
	}
	scrollHighlightedNodeIntoView(node) {
		if (!this.viewportNode || !this.contentIsPositioned) return;
		node.scrollIntoView({ block: this.opts.scrollAlignment.current });
	}
	getCandidateNodes() {
		const node = this.contentNode;
		if (!node) return [];
		return Array.from(node.querySelectorAll(`[${this.getBitsAttr("item")}]:not([data-disabled])`));
	}
	setHighlightedToFirstCandidate(initial = false) {
		this.setHighlightedNode(null);
		let nodes = this.getCandidateNodes();
		if (!nodes.length) return;
		if (this.viewportNode) {
			const viewportRect = this.viewportNode.getBoundingClientRect();
			nodes = nodes.filter((node) => {
				if (!this.viewportNode) return false;
				const nodeRect = node.getBoundingClientRect();
				return nodeRect.right <= viewportRect.right && nodeRect.left >= viewportRect.left && nodeRect.bottom <= viewportRect.bottom && nodeRect.top >= viewportRect.top;
			});
		}
		this.setHighlightedNode(nodes[0], initial);
	}
	getNodeByValue(value) {
		return this.getCandidateNodes().find((node) => node.dataset.value === value) ?? null;
	}
	/**
	* Resolves the display label for a value: `items` entry when present, otherwise the
	* mounted item's `data-label` or its text content.
	*/
	getLabelForValue(value) {
		if (value === "") return "";
		const fromItems = this.opts.items.current.find((item) => item.value === value)?.label;
		if (fromItems !== void 0) return fromItems;
		const node = this.getNodeByValue(value);
		if (node) {
			const dataLabel = node.getAttribute("data-label");
			if (dataLabel !== null && dataLabel !== "") return dataLabel;
			return node.textContent?.trim() ?? value;
		}
		return value;
	}
	setOpen(open) {
		this.opts.open.current = open;
	}
	toggleOpen() {
		this.opts.open.current = !this.opts.open.current;
	}
	handleOpen() {
		this.setOpen(true);
	}
	handleClose() {
		this.setHighlightedNode(null);
		this.setOpen(false);
	}
	toggleMenu() {
		this.toggleOpen();
	}
	getBitsAttr = (part) => {
		return selectAttrs.getAttr(part, this.isCombobox ? "combobox" : void 0);
	};
};
var SelectSingleRootState = class extends SelectBaseRootState {
	opts;
	isMulti = false;
	#hasValue = derived(() => this.opts.value.current !== "");
	get hasValue() {
		return this.#hasValue();
	}
	set hasValue($$value) {
		return this.#hasValue($$value);
	}
	#currentLabel = derived(() => {
		if (!this.opts.items.current.length) return "";
		return this.opts.items.current.find((item) => item.value === this.opts.value.current)?.label ?? "";
	});
	get currentLabel() {
		return this.#currentLabel();
	}
	set currentLabel($$value) {
		return this.#currentLabel($$value);
	}
	#candidateLabels = derived(() => {
		if (!this.opts.items.current.length) return [];
		return this.opts.items.current.filter((item) => !item.disabled).map((item) => item.label);
	});
	get candidateLabels() {
		return this.#candidateLabels();
	}
	set candidateLabels($$value) {
		return this.#candidateLabels($$value);
	}
	#dataTypeaheadEnabled = derived(() => {
		if (this.isMulti) return false;
		if (this.opts.items.current.length === 0) return false;
		return true;
	});
	get dataTypeaheadEnabled() {
		return this.#dataTypeaheadEnabled();
	}
	set dataTypeaheadEnabled($$value) {
		return this.#dataTypeaheadEnabled($$value);
	}
	constructor(opts) {
		super(opts);
		this.opts = opts;
		watch(() => this.opts.open.current, () => {
			if (!this.opts.open.current) return;
			this.setInitialHighlightedNode();
		});
	}
	includesItem(itemValue) {
		return this.opts.value.current === itemValue;
	}
	toggleItem(itemValue, itemLabel = itemValue) {
		const newValue = this.includesItem(itemValue) ? "" : itemValue;
		this.opts.value.current = newValue;
		if (newValue !== "") this.opts.inputValue.current = itemLabel;
	}
	setInitialHighlightedNode() {
		afterTick(() => {
			if (this.highlightedNode && this.domContext.getDocument().contains(this.highlightedNode)) return;
			if (this.opts.value.current !== "") {
				const node = this.getNodeByValue(this.opts.value.current);
				if (node) {
					this.setHighlightedNode(node, true);
					return;
				}
			}
			this.setHighlightedToFirstCandidate(true);
		});
	}
};
var SelectMultipleRootState = class extends SelectBaseRootState {
	opts;
	isMulti = true;
	#hasValue = derived(() => this.opts.value.current.length > 0);
	get hasValue() {
		return this.#hasValue();
	}
	set hasValue($$value) {
		return this.#hasValue($$value);
	}
	constructor(opts) {
		super(opts);
		this.opts = opts;
		watch(() => this.opts.open.current, () => {
			if (!this.opts.open.current) return;
			this.setInitialHighlightedNode();
		});
	}
	includesItem(itemValue) {
		return this.opts.value.current.includes(itemValue);
	}
	toggleItem(itemValue, itemLabel = itemValue) {
		if (this.includesItem(itemValue)) this.opts.value.current = this.opts.value.current.filter((v) => v !== itemValue);
		else this.opts.value.current = [...this.opts.value.current, itemValue];
		this.opts.inputValue.current = itemLabel;
	}
	setInitialHighlightedNode() {
		afterTick(() => {
			if (!this.domContext) return;
			if (this.highlightedNode && this.domContext.getDocument().contains(this.highlightedNode)) return;
			if (this.opts.value.current.length && this.opts.value.current[0] !== "") {
				const node = this.getNodeByValue(this.opts.value.current[0]);
				if (node) {
					this.setHighlightedNode(node, true);
					return;
				}
			}
			this.setHighlightedToFirstCandidate(true);
		});
	}
};
var SelectRootState = class {
	static create(props) {
		const { type, ...rest } = props;
		const rootState = type === "single" ? new SelectSingleRootState(rest) : new SelectMultipleRootState(rest);
		return SelectRootContext.set(rootState);
	}
};
var SelectTriggerState = class SelectTriggerState {
	static create(opts) {
		return new SelectTriggerState(opts, SelectRootContext.get());
	}
	opts;
	root;
	attachment;
	#domTypeahead;
	#dataTypeahead;
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(opts.ref, (v) => this.root.triggerNode = v);
		this.root.domContext = new DOMContext(opts.ref);
		this.#domTypeahead = new DOMTypeahead({
			getCurrentItem: () => this.root.highlightedNode,
			onMatch: (node) => {
				this.root.setHighlightedNode(node);
			},
			getActiveElement: () => this.root.domContext.getActiveElement(),
			getWindow: () => this.root.domContext.getWindow()
		});
		this.#dataTypeahead = new DataTypeahead({
			getCurrentItem: () => {
				if (this.root.isMulti) return "";
				return this.root.currentLabel;
			},
			onMatch: (label) => {
				if (this.root.isMulti) return;
				if (!this.root.opts.items.current) return;
				const matchedItem = this.root.opts.items.current.find((item) => item.label === label);
				if (!matchedItem) return;
				this.root.opts.value.current = matchedItem.value;
			},
			enabled: () => !this.root.isMulti && this.root.dataTypeaheadEnabled,
			candidateValues: () => this.root.isMulti ? [] : this.root.candidateLabels,
			getWindow: () => this.root.domContext.getWindow()
		});
		this.onkeydown = this.onkeydown.bind(this);
		this.onpointerdown = this.onpointerdown.bind(this);
		this.onpointerup = this.onpointerup.bind(this);
		this.onclick = this.onclick.bind(this);
	}
	#handleOpen() {
		this.root.opts.open.current = true;
		this.#dataTypeahead.resetTypeahead();
		this.#domTypeahead.resetTypeahead();
	}
	#handlePointerOpen(_) {
		this.#handleOpen();
	}
	/**
	* Logic used to handle keyboard selection/deselection.
	*
	* If it returns true, it means the item was selected and whatever is calling
	* this function should return early
	*
	*/
	#handleKeyboardSelection() {
		const isCurrentSelectedValue = this.root.highlightedValue === this.root.opts.value.current;
		if (!this.root.opts.allowDeselect.current && isCurrentSelectedValue && !this.root.isMulti) {
			this.root.handleClose();
			return true;
		}
		if (this.root.highlightedValue !== null) this.root.toggleItem(this.root.highlightedValue, this.root.highlightedLabel ?? void 0);
		if (!this.root.isMulti && !isCurrentSelectedValue) {
			this.root.handleClose();
			return true;
		}
		return false;
	}
	onkeydown(e) {
		this.root.isUsingKeyboard = true;
		if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault();
		if (!this.root.opts.open.current) {
			if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown" || e.key === "ArrowUp") {
				e.preventDefault();
				this.root.handleOpen();
			} else if (!this.root.isMulti && this.root.dataTypeaheadEnabled) {
				this.#dataTypeahead.handleTypeaheadSearch(e.key);
				return;
			}
			if (this.root.hasValue) return;
			const candidateNodes = this.root.getCandidateNodes();
			if (!candidateNodes.length) return;
			if (e.key === "ArrowDown") {
				const firstCandidate = candidateNodes[0];
				this.root.setHighlightedNode(firstCandidate);
			} else if (e.key === "ArrowUp") {
				const lastCandidate = candidateNodes[candidateNodes.length - 1];
				this.root.setHighlightedNode(lastCandidate);
			}
			return;
		}
		if (e.key === "Tab") {
			this.root.handleClose();
			return;
		}
		if ((e.key === "Enter" || e.key === " " && this.#domTypeahead.search === "") && !e.isComposing) {
			e.preventDefault();
			if (this.#handleKeyboardSelection()) return;
		}
		if (e.key === "ArrowUp" && e.altKey) this.root.handleClose();
		if (FIRST_LAST_KEYS.includes(e.key)) {
			e.preventDefault();
			const candidateNodes = this.root.getCandidateNodes();
			const currHighlightedNode = this.root.highlightedNode;
			const currIndex = currHighlightedNode ? candidateNodes.indexOf(currHighlightedNode) : -1;
			const loop = this.root.opts.loop.current;
			let nextItem;
			if (e.key === "ArrowDown") nextItem = next(candidateNodes, currIndex, loop);
			else if (e.key === "ArrowUp") nextItem = prev(candidateNodes, currIndex, loop);
			else if (e.key === "PageDown") nextItem = forward(candidateNodes, currIndex, 10, loop);
			else if (e.key === "PageUp") nextItem = backward(candidateNodes, currIndex, 10, loop);
			else if (e.key === "Home") nextItem = candidateNodes[0];
			else if (e.key === "End") nextItem = candidateNodes[candidateNodes.length - 1];
			if (!nextItem) return;
			this.root.setHighlightedNode(nextItem);
			return;
		}
		const isModifierKey = e.ctrlKey || e.altKey || e.metaKey;
		const isCharacterKey = e.key.length === 1;
		const isSpaceKey = e.key === " ";
		const candidateNodes = this.root.getCandidateNodes();
		if (e.key === "Tab") return;
		if (!isModifierKey && (isCharacterKey || isSpaceKey)) {
			if (!this.#domTypeahead.handleTypeaheadSearch(e.key, candidateNodes) && isSpaceKey) {
				e.preventDefault();
				this.#handleKeyboardSelection();
			}
			return;
		}
		if (!this.root.highlightedNode) this.root.setHighlightedToFirstCandidate();
	}
	onclick(e) {
		e.currentTarget.focus();
	}
	onpointerdown(e) {
		if (this.root.opts.disabled.current) return;
		if (e.pointerType === "touch") return e.preventDefault();
		const target = e.target;
		if (target?.hasPointerCapture(e.pointerId)) target?.releasePointerCapture(e.pointerId);
		if (e.button === 0 && e.ctrlKey === false) if (this.root.opts.open.current === false) this.#handlePointerOpen(e);
		else this.root.handleClose();
	}
	onpointerup(e) {
		if (this.root.opts.disabled.current) return;
		e.preventDefault();
		if (e.pointerType === "touch") if (this.root.opts.open.current === false) this.#handlePointerOpen(e);
		else this.root.handleClose();
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		disabled: this.root.opts.disabled.current ? true : void 0,
		"aria-haspopup": "listbox",
		"aria-expanded": boolToStr(this.root.opts.open.current),
		"aria-activedescendant": this.root.highlightedId,
		"data-state": getDataOpenClosed(this.root.opts.open.current),
		"data-disabled": boolToEmptyStrOrUndef(this.root.opts.disabled.current),
		"data-placeholder": this.root.hasValue ? void 0 : "",
		[this.root.getBitsAttr("trigger")]: "",
		onpointerdown: this.onpointerdown,
		onkeydown: this.onkeydown,
		onclick: this.onclick,
		onpointerup: this.onpointerup,
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var SelectContentState = class SelectContentState {
	static create(opts) {
		return SelectContentContext.set(new SelectContentState(opts, SelectRootContext.get()));
	}
	opts;
	root;
	attachment;
	isPositioned = false;
	domContext;
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(opts.ref, (v) => this.root.contentNode = v);
		this.domContext = new DOMContext(this.opts.ref);
		if (this.root.domContext === null) this.root.domContext = this.domContext;
		watch(() => this.root.opts.open.current, () => {
			if (this.root.opts.open.current) return;
			this.root.contentIsPositioned = false;
			this.isPositioned = false;
		});
		watch([() => this.isPositioned, () => this.root.highlightedNode], () => {
			if (!this.isPositioned || !this.root.highlightedNode) return;
			this.root.scrollHighlightedNodeIntoView(this.root.highlightedNode);
		});
		this.onpointermove = this.onpointermove.bind(this);
	}
	onpointermove(_) {
		this.root.isUsingKeyboard = false;
	}
	#styles = derived(() => {
		return getFloatingContentCSSVars(this.root.isCombobox ? "combobox" : "select");
	});
	onInteractOutside = (e) => {
		if (e.target === this.root.triggerNode || e.target === this.root.inputNode) {
			e.preventDefault();
			return;
		}
		this.opts.onInteractOutside.current(e);
		if (e.defaultPrevented) return;
		this.root.handleClose();
	};
	onEscapeKeydown = (e) => {
		this.opts.onEscapeKeydown.current(e);
		if (e.defaultPrevented) return;
		this.root.handleClose();
	};
	onOpenAutoFocus = (e) => {
		e.preventDefault();
	};
	onCloseAutoFocus = (e) => {
		e.preventDefault();
	};
	get shouldRender() {
		return this.root.contentPresence.shouldRender;
	}
	#snippetProps = derived(() => ({ open: this.root.opts.open.current }));
	get snippetProps() {
		return this.#snippetProps();
	}
	set snippetProps($$value) {
		return this.#snippetProps($$value);
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		role: "listbox",
		"aria-multiselectable": this.root.isMulti ? "true" : void 0,
		"data-state": getDataOpenClosed(this.root.opts.open.current),
		...getDataTransitionAttrs(this.root.contentPresence.transitionStatus),
		[this.root.getBitsAttr("content")]: "",
		style: {
			display: "flex",
			flexDirection: "column",
			outline: "none",
			boxSizing: "border-box",
			pointerEvents: "auto",
			...this.#styles()
		},
		onpointermove: this.onpointermove,
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
	popperProps = {
		onInteractOutside: this.onInteractOutside,
		onEscapeKeydown: this.onEscapeKeydown,
		onOpenAutoFocus: this.onOpenAutoFocus,
		onCloseAutoFocus: this.onCloseAutoFocus,
		trapFocus: false,
		loop: false,
		onPlaced: () => {
			if (this.root.opts.open.current) {
				this.root.contentIsPositioned = true;
				this.isPositioned = true;
			}
		}
	};
};
var SelectItemState = class SelectItemState {
	static create(opts) {
		return new SelectItemState(opts, SelectRootContext.get());
	}
	opts;
	root;
	attachment;
	#isSelected = derived(() => this.root.includesItem(this.opts.value.current));
	get isSelected() {
		return this.#isSelected();
	}
	set isSelected($$value) {
		return this.#isSelected($$value);
	}
	#isHighlighted = derived(() => this.root.highlightedValue === this.opts.value.current);
	get isHighlighted() {
		return this.#isHighlighted();
	}
	set isHighlighted($$value) {
		return this.#isHighlighted($$value);
	}
	prevHighlighted = new Previous(() => this.isHighlighted);
	mounted = false;
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(opts.ref);
		watch([() => this.isHighlighted, () => this.prevHighlighted.current], () => {
			if (this.isHighlighted) this.opts.onHighlight.current();
			else if (this.prevHighlighted.current) this.opts.onUnhighlight.current();
		});
		watch(() => this.mounted, () => {
			if (!this.mounted) return;
			this.root.setInitialHighlightedNode();
		});
		this.onpointerdown = this.onpointerdown.bind(this);
		this.onpointerup = this.onpointerup.bind(this);
		this.onpointermove = this.onpointermove.bind(this);
	}
	handleSelect() {
		if (this.opts.disabled.current) return;
		const isCurrentSelectedValue = this.opts.value.current === this.root.opts.value.current;
		if (!this.root.opts.allowDeselect.current && isCurrentSelectedValue && !this.root.isMulti) {
			this.root.handleClose();
			return;
		}
		this.root.toggleItem(this.opts.value.current, this.opts.label.current);
		if (!this.root.isMulti && !isCurrentSelectedValue) this.root.handleClose();
	}
	#snippetProps = derived(() => ({
		selected: this.isSelected,
		highlighted: this.isHighlighted
	}));
	get snippetProps() {
		return this.#snippetProps();
	}
	set snippetProps($$value) {
		return this.#snippetProps($$value);
	}
	onpointerdown(e) {
		e.preventDefault();
	}
	/**
	* Using `pointerup` instead of `click` allows power users to pointerdown
	* the trigger, then release pointerup on an item to select it vs having to do
	* multiple clicks.
	*/
	onpointerup(e) {
		if (e.defaultPrevented || !this.opts.ref.current) return;
		/**
		* For one reason or another, when it's a touch pointer and _not_ on IOS,
		* we need to listen for the immediate click event to handle the selection,
		* otherwise a click event will fire on the element _behind_ the item.
		*/
		if (e.pointerType === "touch" && !isIOS) {
			on(this.opts.ref.current, "click", () => {
				this.handleSelect();
				this.root.setHighlightedNode(this.opts.ref.current);
			}, { once: true });
			return;
		}
		e.preventDefault();
		this.handleSelect();
		if (e.pointerType === "touch") this.root.setHighlightedNode(this.opts.ref.current);
	}
	onpointermove(e) {
		/**
		* We don't want to highlight items on touch devices when scrolling,
		* as this is confusing behavior, so we return here and instead handle
		* the highlighting on the `pointerup` (or following `click`) event for
		* touch devices only.
		*/
		if (e.pointerType === "touch") return;
		if (this.root.highlightedNode !== this.opts.ref.current) this.root.setHighlightedNode(this.opts.ref.current);
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		role: "option",
		"aria-selected": this.root.includesItem(this.opts.value.current) ? "true" : void 0,
		"data-value": this.opts.value.current,
		"data-disabled": boolToEmptyStrOrUndef(this.opts.disabled.current),
		"data-highlighted": this.root.highlightedValue === this.opts.value.current && !this.opts.disabled.current ? "" : void 0,
		"data-selected": this.root.includesItem(this.opts.value.current) ? "" : void 0,
		"data-label": this.opts.label.current,
		[this.root.getBitsAttr("item")]: "",
		onpointermove: this.onpointermove,
		onpointerdown: this.onpointerdown,
		onpointerup: this.onpointerup,
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var SelectGroupState = class SelectGroupState {
	static create(opts) {
		return SelectGroupContext.set(new SelectGroupState(opts, SelectRootContext.get()));
	}
	opts;
	root;
	labelNode = null;
	attachment;
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(opts.ref);
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		role: "group",
		[this.root.getBitsAttr("group")]: "",
		"aria-labelledby": this.labelNode?.id ?? void 0,
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var SelectHiddenInputState = class SelectHiddenInputState {
	static create(opts) {
		return new SelectHiddenInputState(opts, SelectRootContext.get());
	}
	opts;
	root;
	#shouldRender = derived(() => this.root.opts.name.current !== "");
	get shouldRender() {
		return this.#shouldRender();
	}
	set shouldRender($$value) {
		return this.#shouldRender($$value);
	}
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.onfocus = this.onfocus.bind(this);
	}
	onfocus(e) {
		e.preventDefault();
		if (!this.root.isCombobox) this.root.triggerNode?.focus();
		else this.root.inputNode?.focus();
	}
	#props = derived(() => ({
		disabled: boolToTrueOrUndef(this.root.opts.disabled.current),
		required: boolToTrueOrUndef(this.root.opts.required.current),
		name: this.root.opts.name.current,
		value: this.opts.value.current,
		onfocus: this.onfocus
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var SelectViewportState = class SelectViewportState {
	static create(opts) {
		return new SelectViewportState(opts, SelectContentContext.get());
	}
	opts;
	content;
	root;
	attachment;
	prevScrollTop = 0;
	constructor(opts, content) {
		this.opts = opts;
		this.content = content;
		this.root = content.root;
		this.attachment = attachRef(opts.ref, (v) => {
			this.root.viewportNode = v;
		});
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		role: "presentation",
		[this.root.getBitsAttr("viewport")]: "",
		style: {
			position: "relative",
			flex: 1,
			overflow: "auto"
		},
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var SelectScrollButtonImplState = class {
	opts;
	content;
	root;
	attachment;
	autoScrollTimer = null;
	userScrollTimer = -1;
	isUserScrolling = false;
	onAutoScroll = noop$2;
	mounted = false;
	constructor(opts, content) {
		this.opts = opts;
		this.content = content;
		this.root = content.root;
		this.attachment = attachRef(opts.ref);
		watch([() => this.mounted], () => {
			if (!this.mounted) {
				this.isUserScrolling = false;
				return;
			}
			if (this.isUserScrolling) return;
		});
		this.onpointerdown = this.onpointerdown.bind(this);
		this.onpointermove = this.onpointermove.bind(this);
		this.onpointerleave = this.onpointerleave.bind(this);
	}
	handleUserScroll() {
		this.content.domContext.clearTimeout(this.userScrollTimer);
		this.isUserScrolling = true;
		this.userScrollTimer = this.content.domContext.setTimeout(() => {
			this.isUserScrolling = false;
		}, 200);
	}
	clearAutoScrollInterval() {
		if (this.autoScrollTimer === null) return;
		this.content.domContext.clearTimeout(this.autoScrollTimer);
		this.autoScrollTimer = null;
	}
	onpointerdown(_) {
		if (this.autoScrollTimer !== null) return;
		const autoScroll = (tick) => {
			this.onAutoScroll();
			this.autoScrollTimer = this.content.domContext.setTimeout(() => autoScroll(tick + 1), this.opts.delay.current(tick));
		};
		this.autoScrollTimer = this.content.domContext.setTimeout(() => autoScroll(1), this.opts.delay.current(0));
	}
	onpointermove(e) {
		this.onpointerdown(e);
	}
	onpointerleave(_) {
		this.clearAutoScrollInterval();
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		"aria-hidden": boolToStrTrueOrUndef(true),
		style: { flexShrink: 0 },
		onpointerdown: this.onpointerdown,
		onpointermove: this.onpointermove,
		onpointerleave: this.onpointerleave,
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var SelectScrollDownButtonState = class SelectScrollDownButtonState {
	static create(opts) {
		return new SelectScrollDownButtonState(new SelectScrollButtonImplState(opts, SelectContentContext.get()));
	}
	scrollButtonState;
	content;
	root;
	canScrollDown = false;
	scrollIntoViewTimer = null;
	constructor(scrollButtonState) {
		this.scrollButtonState = scrollButtonState;
		this.content = scrollButtonState.content;
		this.root = scrollButtonState.root;
		this.scrollButtonState.onAutoScroll = this.handleAutoScroll;
		watch([() => this.root.viewportNode, () => this.content.isPositioned], () => {
			if (!this.root.viewportNode || !this.content.isPositioned) return;
			this.handleScroll(true);
			return on(this.root.viewportNode, "scroll", () => this.handleScroll());
		});
		/**
		* If the input value changes, this means that the filtered items may have changed,
		* so we need to re-evaluate the scroll-ability of the list.
		*/
		watch([
			() => this.root.opts.inputValue.current,
			() => this.root.viewportNode,
			() => this.content.isPositioned
		], () => {
			if (!this.root.viewportNode || !this.content.isPositioned) return;
			this.handleScroll(true);
		});
		watch(() => this.scrollButtonState.mounted, () => {
			if (!this.scrollButtonState.mounted) return;
			if (this.scrollIntoViewTimer) clearTimeout(this.scrollIntoViewTimer);
			this.scrollIntoViewTimer = afterSleep(5, () => {
				const activeItem = this.root.highlightedNode;
				if (!activeItem) return;
				this.root.scrollHighlightedNodeIntoView(activeItem);
			});
		});
	}
	/**
	* @param manual - if true, it means the function was invoked manually outside of an event
	* listener, so we don't call `handleUserScroll` to prevent the auto scroll from kicking in.
	*/
	handleScroll = (manual = false) => {
		if (!manual) this.scrollButtonState.handleUserScroll();
		if (!this.root.viewportNode) return;
		const maxScroll = this.root.viewportNode.scrollHeight - this.root.viewportNode.clientHeight;
		const paddingTop = Number.parseInt(getComputedStyle(this.root.viewportNode).paddingTop, 10);
		this.canScrollDown = Math.ceil(this.root.viewportNode.scrollTop) < maxScroll - paddingTop;
	};
	handleAutoScroll = () => {
		const viewport = this.root.viewportNode;
		const selectedItem = this.root.highlightedNode;
		if (!viewport || !selectedItem) return;
		viewport.scrollTop = viewport.scrollTop + selectedItem.offsetHeight;
	};
	#props = derived(() => ({
		...this.scrollButtonState.props,
		[this.root.getBitsAttr("scroll-down-button")]: ""
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var SelectScrollUpButtonState = class SelectScrollUpButtonState {
	static create(opts) {
		return new SelectScrollUpButtonState(new SelectScrollButtonImplState(opts, SelectContentContext.get()));
	}
	scrollButtonState;
	content;
	root;
	canScrollUp = false;
	constructor(scrollButtonState) {
		this.scrollButtonState = scrollButtonState;
		this.content = scrollButtonState.content;
		this.root = scrollButtonState.root;
		this.scrollButtonState.onAutoScroll = this.handleAutoScroll;
		watch([() => this.root.viewportNode, () => this.content.isPositioned], () => {
			if (!this.root.viewportNode || !this.content.isPositioned) return;
			this.handleScroll(true);
			return on(this.root.viewportNode, "scroll", () => this.handleScroll());
		});
	}
	/**
	* @param manual - if true, it means the function was invoked manually outside of an event
	* listener, so we don't call `handleUserScroll` to prevent the auto scroll from kicking in.
	*/
	handleScroll = (manual = false) => {
		if (!manual) this.scrollButtonState.handleUserScroll();
		if (!this.root.viewportNode) return;
		const paddingTop = Number.parseInt(getComputedStyle(this.root.viewportNode).paddingTop, 10);
		this.canScrollUp = this.root.viewportNode.scrollTop - paddingTop > .1;
	};
	handleAutoScroll = () => {
		if (!this.root.viewportNode || !this.root.highlightedNode) return;
		this.root.viewportNode.scrollTop = this.root.viewportNode.scrollTop - this.root.highlightedNode.offsetHeight;
	};
	#props = derived(() => ({
		...this.scrollButtonState.props,
		[this.root.getBitsAttr("scroll-up-button")]: ""
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/select/components/select-hidden-input.svelte
function Select_hidden_input($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { value = void 0, autocomplete } = $$props;
		const hiddenInputState = SelectHiddenInputState.create({ value: boxWith(() => value) });
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (hiddenInputState.shouldRender) {
				$$renderer.push("<!--[0-->");
				Hidden_input($$renderer, spread_props([hiddenInputState.props, {
					autocomplete,
					get value() {
						return value;
					},
					set value($$value) {
						value = $$value;
						$$settled = false;
					}
				}]));
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { value });
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/utilities/floating-layer/components/floating-layer-anchor.svelte
function Floating_layer_anchor($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { id, children, virtualEl, ref, tooltip = false } = $$props;
		FloatingAnchorState.create({
			id: boxWith(() => id),
			virtualEl: boxWith(() => virtualEl),
			ref
		}, tooltip);
		children?.($$renderer);
		$$renderer.push(`<!---->`);
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/utilities/arrow/arrow.svelte
function Arrow($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { id = useId(), children, child, width = 10, height = 5, $$slots, $$events, ...restProps } = $$props;
		const mergedProps = derived(() => mergeProps(restProps, { id }));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, { props: mergedProps() });
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<span${attributes({ ...mergedProps() })}>`);
			if (children) {
				$$renderer.push("<!--[0-->");
				children?.($$renderer);
				$$renderer.push(`<!---->`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<svg${attr("width", width)}${attr("height", height)} viewBox="0 0 30 10" preserveAspectRatio="none" data-arrow=""><polygon points="0,0 30,0 15,10" fill="currentColor"></polygon></svg>`);
			}
			$$renderer.push(`<!--]--></span>`);
		}
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/utilities/floating-layer/components/floating-layer-arrow.svelte
function Floating_layer_arrow($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { id = useId(), ref = null, $$slots, $$events, ...restProps } = $$props;
		const arrowState = FloatingArrowState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v)
		});
		Arrow($$renderer, spread_props([derived(() => mergeProps(restProps, arrowState.props))()]));
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/utilities/floating-layer/components/floating-layer-content.svelte
function Floating_layer_content($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { content, side = "bottom", sideOffset = 0, align = "center", alignOffset = 0, id, arrowPadding = 0, avoidCollisions = true, collisionBoundary = [], collisionPadding = 0, hideWhenDetached = false, onPlaced = () => {}, sticky = "partial", updatePositionStrategy = "optimized", strategy = "fixed", dir = "ltr", style = {}, wrapperId = useId(), customAnchor = null, enabled, tooltip = false } = $$props;
		const contentState = FloatingContentState.create({
			side: boxWith(() => side),
			sideOffset: boxWith(() => sideOffset),
			align: boxWith(() => align),
			alignOffset: boxWith(() => alignOffset),
			id: boxWith(() => id),
			arrowPadding: boxWith(() => arrowPadding),
			avoidCollisions: boxWith(() => avoidCollisions),
			collisionBoundary: boxWith(() => collisionBoundary),
			collisionPadding: boxWith(() => collisionPadding),
			hideWhenDetached: boxWith(() => hideWhenDetached),
			onPlaced: boxWith(() => onPlaced),
			sticky: boxWith(() => sticky),
			updatePositionStrategy: boxWith(() => updatePositionStrategy),
			strategy: boxWith(() => strategy),
			dir: boxWith(() => dir),
			style: boxWith(() => style),
			enabled: boxWith(() => enabled),
			wrapperId: boxWith(() => wrapperId),
			customAnchor: boxWith(() => customAnchor)
		}, tooltip);
		const mergedProps = derived(() => mergeProps(contentState.wrapperProps, { style: { pointerEvents: "auto" } }));
		content?.($$renderer, {
			props: contentState.props,
			wrapperProps: mergedProps()
		});
		$$renderer.push(`<!---->`);
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/utilities/floating-layer/components/floating-layer-content-static.svelte
function Floating_layer_content_static($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { content} = $$props;
		content?.($$renderer, {
			props: {},
			wrapperProps: {}
		});
		$$renderer.push(`<!---->`);
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/separator/separator.svelte.js
var separatorAttrs = createBitsAttrs({
	component: "separator",
	parts: ["root"]
});
var SeparatorRootState = class SeparatorRootState {
	static create(opts) {
		return new SeparatorRootState(opts);
	}
	opts;
	attachment;
	constructor(opts) {
		this.opts = opts;
		this.attachment = attachRef(opts.ref);
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		role: this.opts.decorative.current ? "none" : "separator",
		"aria-orientation": this.opts.orientation.current,
		"aria-hidden": boolToStrTrueOrUndef(this.opts.decorative.current),
		"data-orientation": this.opts.orientation.current,
		[separatorAttrs.root]: "",
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/separator/components/separator.svelte
function Separator($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { id = createId(uid), ref = null, child, children, decorative = false, orientation = "horizontal", $$slots, $$events, ...restProps } = $$props;
		const rootState = SeparatorRootState.create({
			ref: boxWith(() => ref, (v) => ref = v),
			id: boxWith(() => id),
			decorative: boxWith(() => decorative),
			orientation: boxWith(() => orientation)
		});
		const mergedProps = derived(() => mergeProps(restProps, rootState.props));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, { props: mergedProps() });
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div${attributes({ ...mergedProps() })}>`);
			children?.($$renderer);
			$$renderer.push(`<!----></div>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/utilities/popper-layer/popper-content.svelte
function Popper_content($$renderer, $$props) {
	let { content, isStatic = false, onPlaced, $$slots, $$events, ...restProps } = $$props;
	if (isStatic) {
		$$renderer.push("<!--[0-->");
		Floating_layer_content_static($$renderer, {
			content});
	} else {
		$$renderer.push("<!--[-1-->");
		Floating_layer_content($$renderer, spread_props([{
			content,
			onPlaced
		}, restProps]));
	}
	$$renderer.push(`<!--]-->`);
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/utilities/popper-layer/popper-layer-inner.svelte
function Popper_layer_inner($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { popper, onEscapeKeydown, escapeKeydownBehavior, preventOverflowTextSelection, id, onPointerDown, onPointerUp, side, sideOffset, align, alignOffset, arrowPadding, avoidCollisions, collisionBoundary, collisionPadding, sticky, hideWhenDetached, updatePositionStrategy, strategy, dir, preventScroll, wrapperId, style, onPlaced, onInteractOutside, onCloseAutoFocus, onOpenAutoFocus, onFocusOutside, interactOutsideBehavior = "close", loop, trapFocus = true, isValidEvent = () => false, customAnchor = null, isStatic = false, enabled, ref, tooltip = false, contentPointerEvents = "auto", $$slots, $$events, ...restProps } = $$props;
		const resolvedPreventScroll = derived(() => preventScroll ?? true);
		const effectiveStrategy = derived(() => strategy ?? (resolvedPreventScroll() ? "fixed" : "absolute"));
		{
			function content($$renderer, { props: floatingProps, wrapperProps }) {
				if (restProps.forceMount && enabled) {
					$$renderer.push("<!--[0-->");
					Scroll_lock($$renderer, { preventScroll: resolvedPreventScroll() });
				} else if (!restProps.forceMount) {
					$$renderer.push("<!--[1-->");
					Scroll_lock($$renderer, { preventScroll: resolvedPreventScroll() });
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				{
					function focusScope($$renderer, { props: focusScopeProps }) {
						Escape_layer($$renderer, {
							onEscapeKeydown,
							escapeKeydownBehavior,
							enabled,
							ref,
							children: ($$renderer) => {
								{
									function children($$renderer, { props: dismissibleProps }) {
										Text_selection_layer($$renderer, {
											id,
											preventOverflowTextSelection,
											onPointerDown,
											onPointerUp,
											enabled,
											ref,
											children: ($$renderer) => {
												popper?.($$renderer, {
													props: mergeProps(restProps, floatingProps, dismissibleProps, focusScopeProps, { style: { pointerEvents: contentPointerEvents } }),
													wrapperProps
												});
												$$renderer.push(`<!---->`);
											}});
									}
									Dismissible_layer($$renderer, {
										id,
										onInteractOutside,
										onFocusOutside,
										interactOutsideBehavior,
										isValidEvent,
										enabled,
										ref,
										children});
								}
							}});
					}
					Focus_scope($$renderer, {
						onOpenAutoFocus,
						onCloseAutoFocus,
						loop,
						enabled,
						trapFocus,
						forceMount: restProps.forceMount,
						ref,
						focusScope});
				}
				$$renderer.push(`<!---->`);
			}
			Popper_content($$renderer, {
				isStatic,
				id,
				side,
				sideOffset,
				align,
				alignOffset,
				arrowPadding,
				avoidCollisions,
				collisionBoundary,
				collisionPadding,
				sticky,
				hideWhenDetached,
				updatePositionStrategy,
				strategy: effectiveStrategy(),
				dir,
				wrapperId,
				style,
				onPlaced,
				customAnchor,
				enabled,
				tooltip,
				content,
				$$slots: { content: true }
			});
		}
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/utilities/popper-layer/popper-layer.svelte
function Popper_layer($$renderer, $$props) {
	let { popper, open, onEscapeKeydown, escapeKeydownBehavior, preventOverflowTextSelection, id, onPointerDown, onPointerUp, side, sideOffset, align, alignOffset, arrowPadding, avoidCollisions, collisionBoundary, collisionPadding, sticky, hideWhenDetached, updatePositionStrategy, strategy, dir, preventScroll, wrapperId, style, onPlaced, onInteractOutside, onCloseAutoFocus, onOpenAutoFocus, onFocusOutside, interactOutsideBehavior = "close", loop, trapFocus = true, isValidEvent = () => false, customAnchor = null, isStatic = false, ref, shouldRender, $$slots, $$events, ...restProps } = $$props;
	if (shouldRender) {
		$$renderer.push("<!--[0-->");
		Popper_layer_inner($$renderer, spread_props([{
			popper,
			onEscapeKeydown,
			escapeKeydownBehavior,
			preventOverflowTextSelection,
			id,
			onPointerDown,
			onPointerUp,
			side,
			sideOffset,
			align,
			alignOffset,
			arrowPadding,
			avoidCollisions,
			collisionBoundary,
			collisionPadding,
			sticky,
			hideWhenDetached,
			updatePositionStrategy,
			strategy,
			dir,
			preventScroll,
			wrapperId,
			style,
			onPlaced,
			customAnchor,
			isStatic,
			enabled: open,
			onInteractOutside,
			onCloseAutoFocus,
			onOpenAutoFocus,
			interactOutsideBehavior,
			loop,
			trapFocus,
			isValidEvent,
			onFocusOutside,
			forceMount: false,
			ref
		}, restProps]));
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]-->`);
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/utilities/popper-layer/popper-layer-force-mount.svelte
function Popper_layer_force_mount($$renderer, $$props) {
	let { popper, onEscapeKeydown, escapeKeydownBehavior, preventOverflowTextSelection, id, onPointerDown, onPointerUp, side, sideOffset, align, alignOffset, arrowPadding, avoidCollisions, collisionBoundary, collisionPadding, sticky, hideWhenDetached, updatePositionStrategy, strategy, dir, preventScroll, wrapperId, style, onPlaced, onInteractOutside, onCloseAutoFocus, onOpenAutoFocus, onFocusOutside, interactOutsideBehavior = "close", loop, trapFocus = true, isValidEvent = () => false, customAnchor = null, isStatic = false, enabled, $$slots, $$events, ...restProps } = $$props;
	Popper_layer_inner($$renderer, spread_props([
		{
			popper,
			onEscapeKeydown,
			escapeKeydownBehavior,
			preventOverflowTextSelection,
			id,
			onPointerDown,
			onPointerUp,
			side,
			sideOffset,
			align,
			alignOffset,
			arrowPadding,
			avoidCollisions,
			collisionBoundary,
			collisionPadding,
			sticky,
			hideWhenDetached,
			updatePositionStrategy,
			strategy,
			dir,
			preventScroll,
			wrapperId,
			style,
			onPlaced,
			customAnchor,
			isStatic,
			enabled,
			onInteractOutside,
			onCloseAutoFocus,
			onOpenAutoFocus,
			interactOutsideBehavior,
			loop,
			trapFocus,
			isValidEvent,
			onFocusOutside
		},
		restProps,
		{ forceMount: true }
	]));
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/select/components/select-content.svelte
function Select_content($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { id = createId(uid), ref = null, forceMount = false, side = "bottom", onInteractOutside = noop$2, onEscapeKeydown = noop$2, children, child, preventScroll = false, style, $$slots, $$events, ...restProps } = $$props;
		const contentState = SelectContentState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v),
			onInteractOutside: boxWith(() => onInteractOutside),
			onEscapeKeydown: boxWith(() => onEscapeKeydown)
		});
		const mergedProps = derived(() => mergeProps(restProps, contentState.props));
		if (forceMount) {
			$$renderer.push("<!--[0-->");
			{
				function popper($$renderer, { props, wrapperProps }) {
					const finalProps = mergeProps(props, { style: contentState.props.style }, { style });
					if (child) {
						$$renderer.push("<!--[0-->");
						child($$renderer, {
							props: finalProps,
							wrapperProps,
							...contentState.snippetProps
						});
						$$renderer.push(`<!---->`);
					} else {
						$$renderer.push("<!--[-1-->");
						$$renderer.push(`<div${attributes({ ...wrapperProps })}><div${attributes({ ...finalProps })}>`);
						children?.($$renderer);
						$$renderer.push(`<!----></div></div>`);
					}
					$$renderer.push(`<!--]-->`);
				}
				Popper_layer_force_mount($$renderer, spread_props([
					mergedProps(),
					contentState.popperProps,
					{
						ref: contentState.opts.ref,
						side,
						enabled: contentState.root.opts.open.current,
						id,
						preventScroll,
						forceMount: true,
						shouldRender: contentState.shouldRender,
						popper,
						$$slots: { popper: true }
					}
				]));
			}
		} else if (!forceMount) {
			$$renderer.push("<!--[1-->");
			{
				function popper($$renderer, { props, wrapperProps }) {
					const finalProps = mergeProps(props, { style: contentState.props.style }, { style });
					if (child) {
						$$renderer.push("<!--[0-->");
						child($$renderer, {
							props: finalProps,
							wrapperProps,
							...contentState.snippetProps
						});
						$$renderer.push(`<!---->`);
					} else {
						$$renderer.push("<!--[-1-->");
						$$renderer.push(`<div${attributes({ ...wrapperProps })}><div${attributes({ ...finalProps })}>`);
						children?.($$renderer);
						$$renderer.push(`<!----></div></div>`);
					}
					$$renderer.push(`<!--]-->`);
				}
				Popper_layer($$renderer, spread_props([
					mergedProps(),
					contentState.popperProps,
					{
						ref: contentState.opts.ref,
						side,
						open: contentState.root.opts.open.current,
						id,
						preventScroll,
						forceMount: false,
						shouldRender: contentState.shouldRender,
						popper,
						$$slots: { popper: true }
					}
				]));
			}
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/utilities/mounted.svelte
function Mounted($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { mounted = false, onMountedChange = noop$2 } = $$props;
		bind_props($$props, { mounted });
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/select/components/select-item.svelte
function Select_item($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { id = createId(uid), ref = null, value, label = value, disabled = false, children, child, onHighlight = noop$2, onUnhighlight = noop$2, $$slots, $$events, ...restProps } = $$props;
		const itemState = SelectItemState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v),
			value: boxWith(() => value),
			disabled: boxWith(() => disabled),
			label: boxWith(() => label),
			onHighlight: boxWith(() => onHighlight),
			onUnhighlight: boxWith(() => onUnhighlight)
		});
		const mergedProps = derived(() => mergeProps(restProps, itemState.props));
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (child) {
				$$renderer.push("<!--[0-->");
				child($$renderer, {
					props: mergedProps(),
					...itemState.snippetProps
				});
				$$renderer.push(`<!---->`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<div${attributes({ ...mergedProps() })}>`);
				children?.($$renderer, itemState.snippetProps);
				$$renderer.push(`<!----></div>`);
			}
			$$renderer.push(`<!--]--> `);
			Mounted($$renderer, {
				get mounted() {
					return itemState.mounted;
				},
				set mounted($$value) {
					itemState.mounted = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!---->`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/select/components/select-group.svelte
function Select_group($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { id = createId(uid), ref = null, children, child, $$slots, $$events, ...restProps } = $$props;
		const groupState = SelectGroupState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v)
		});
		const mergedProps = derived(() => mergeProps(restProps, groupState.props));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, { props: mergedProps() });
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div${attributes({ ...mergedProps() })}>`);
			children?.($$renderer);
			$$renderer.push(`<!----></div>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/select/components/select-viewport.svelte
function Select_viewport($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { id = createId(uid), ref = null, children, child, $$slots, $$events, ...restProps } = $$props;
		const viewportState = SelectViewportState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v)
		});
		const mergedProps = derived(() => mergeProps(restProps, viewportState.props));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, { props: mergedProps() });
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div${attributes({ ...mergedProps() })}>`);
			children?.($$renderer);
			$$renderer.push(`<!----></div>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/select/components/select-scroll-down-button.svelte
function Select_scroll_down_button($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { id = createId(uid), ref = null, delay = () => 50, child, children, $$slots, $$events, ...restProps } = $$props;
		const scrollButtonState = SelectScrollDownButtonState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v),
			delay: boxWith(() => delay)
		});
		const mergedProps = derived(() => mergeProps(restProps, scrollButtonState.props));
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (scrollButtonState.canScrollDown) {
				$$renderer.push("<!--[0-->");
				Mounted($$renderer, {
					get mounted() {
						return scrollButtonState.scrollButtonState.mounted;
					},
					set mounted($$value) {
						scrollButtonState.scrollButtonState.mounted = $$value;
						$$settled = false;
					}
				});
				$$renderer.push(`<!----> `);
				if (child) {
					$$renderer.push("<!--[0-->");
					child($$renderer, { props: restProps });
					$$renderer.push(`<!---->`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<div${attributes({ ...mergedProps() })}>`);
					children?.($$renderer);
					$$renderer.push(`<!----></div>`);
				}
				$$renderer.push(`<!--]-->`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/select/components/select-scroll-up-button.svelte
function Select_scroll_up_button($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { id = createId(uid), ref = null, delay = () => 50, child, children, $$slots, $$events, ...restProps } = $$props;
		const scrollButtonState = SelectScrollUpButtonState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v),
			delay: boxWith(() => delay)
		});
		const mergedProps = derived(() => mergeProps(restProps, scrollButtonState.props));
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (scrollButtonState.canScrollUp) {
				$$renderer.push("<!--[0-->");
				Mounted($$renderer, {
					get mounted() {
						return scrollButtonState.scrollButtonState.mounted;
					},
					set mounted($$value) {
						scrollButtonState.scrollButtonState.mounted = $$value;
						$$settled = false;
					}
				});
				$$renderer.push(`<!----> `);
				if (child) {
					$$renderer.push("<!--[0-->");
					child($$renderer, { props: restProps });
					$$renderer.push(`<!---->`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<div${attributes({ ...mergedProps() })}>`);
					children?.($$renderer);
					$$renderer.push(`<!----></div>`);
				}
				$$renderer.push(`<!--]-->`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/command/utils.js
function findNextSibling(el, selector) {
	let sibling = el.nextElementSibling;
	while (sibling) {
		if (sibling.matches(selector)) return sibling;
		sibling = sibling.nextElementSibling;
	}
}
function findPreviousSibling(el, selector) {
	let sibling = el.previousElementSibling;
	while (sibling) {
		if (sibling.matches(selector)) return sibling;
		sibling = sibling.previousElementSibling;
	}
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/internal/css-escape.js
/**
* https://github.com/mathiasbynens/CSS.escape
*
* @param value - The value to escape for use as a CSS identifier
* @returns The escaped CSS identifier string
*/
function cssEscape(value) {
	if (typeof CSS !== "undefined" && typeof CSS.escape === "function") return CSS.escape(value);
	const length = value.length;
	let index = -1;
	let codeUnit;
	let result = "";
	const firstCodeUnit = value.charCodeAt(0);
	if (length === 1 && firstCodeUnit === 45) return "\\" + value;
	while (++index < length) {
		codeUnit = value.charCodeAt(index);
		if (codeUnit === 0) {
			result += "�";
			continue;
		}
		if (codeUnit >= 1 && codeUnit <= 31 || codeUnit === 127 || index === 0 && codeUnit >= 48 && codeUnit <= 57 || index === 1 && codeUnit >= 48 && codeUnit <= 57 && firstCodeUnit === 45) {
			result += "\\" + codeUnit.toString(16) + " ";
			continue;
		}
		if (codeUnit >= 128 || codeUnit === 45 || codeUnit === 95 || codeUnit >= 48 && codeUnit <= 57 || codeUnit >= 65 && codeUnit <= 90 || codeUnit >= 97 && codeUnit <= 122) {
			result += value.charAt(index);
			continue;
		}
		result += "\\" + value.charAt(index);
	}
	return result;
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/command/command.svelte.js
var COMMAND_VALUE_ATTR = "data-value";
var commandAttrs = createBitsAttrs({
	component: "command",
	parts: [
		"root",
		"list",
		"input",
		"separator",
		"loading",
		"empty",
		"group",
		"group-items",
		"group-heading",
		"item",
		"viewport",
		"input-label"
	]
});
var COMMAND_GROUP_SELECTOR = commandAttrs.selector("group");
var COMMAND_GROUP_ITEMS_SELECTOR = commandAttrs.selector("group-items");
var COMMAND_GROUP_HEADING_SELECTOR = commandAttrs.selector("group-heading");
var COMMAND_ITEM_SELECTOR = commandAttrs.selector("item");
var COMMAND_VALID_ITEM_SELECTOR = `${commandAttrs.selector("item")}:not([aria-disabled="true"])`;
var CommandRootContext = new Context("Command.Root");
var CommandListContext = new Context("Command.List");
var CommandGroupContainerContext = new Context("Command.Group");
var defaultState = {
	search: "",
	value: "",
	filtered: {
		count: 0,
		items: /* @__PURE__ */ new Map(),
		groups: /* @__PURE__ */ new Set()
	}
};
var CommandRootState = class CommandRootState {
	static create(opts) {
		return CommandRootContext.set(new CommandRootState(opts));
	}
	opts;
	attachment;
	#updateScheduled = false;
	#isInitialMount = true;
	sortAfterTick = false;
	sortAndFilterAfterTick = false;
	allItems = /* @__PURE__ */ new Set();
	allGroups = /* @__PURE__ */ new Map();
	allIds = /* @__PURE__ */ new Map();
	key = 0;
	viewportNode = null;
	inputNode = null;
	labelNode = null;
	commandState = defaultState;
	_commandState = defaultState;
	#snapshot() {
		return snapshot(this._commandState);
	}
	#scheduleUpdate() {
		if (this.#updateScheduled) return;
		this.#updateScheduled = true;
		afterTick(() => {
			this.#updateScheduled = false;
			const currentState = this.#snapshot();
			if (!Object.is(this.commandState, currentState)) {
				this.commandState = currentState;
				this.opts.onStateChange?.current?.(currentState);
			}
		});
	}
	setState(key, value, preventScroll) {
		if (Object.is(this._commandState[key], value)) return;
		this._commandState[key] = value;
		if (key === "search") {
			this.#filterItems();
			this.#sort();
		} else if (key === "value") {
			if (!preventScroll) this.#scrollSelectedIntoView();
		}
		this.#scheduleUpdate();
	}
	constructor(opts) {
		this.opts = opts;
		this.attachment = attachRef(this.opts.ref);
		const defaults = {
			...this._commandState,
			value: this.opts.value.current ?? ""
		};
		this._commandState = defaults;
		this.commandState = defaults;
		this.onkeydown = this.onkeydown.bind(this);
	}
	/**
	* Calculates score for an item based on search text and keywords.
	* Higher score = better match.
	*
	* @param value - Item's display text
	* @param keywords - Optional keywords to boost scoring
	* @returns Score from 0-1, where 0 = no match
	*/
	#score(value, keywords) {
		const filter = this.opts.filter.current ?? computeCommandScore;
		return value ? filter(value, this._commandState.search, keywords) : 0;
	}
	/**
	* Sorts items and groups based on search scores.
	* Groups are sorted by their highest scoring item.
	* When no search active, selects first item.
	*/
	#sort() {
		if (!this._commandState.search || this.opts.shouldFilter.current === false) {
			if (!this._commandState.value || !this.#isInitialMount) this.#selectFirstItem();
			else if (this.#isInitialMount && this._commandState.value) this.#scrollInitialValue();
			return;
		}
		const scores = this._commandState.filtered.items;
		const groups = [];
		for (const value of this._commandState.filtered.groups) {
			const items = this.allGroups.get(value);
			let max = 0;
			if (!items) {
				groups.push([value, max]);
				continue;
			}
			for (const item of items) {
				const score = scores.get(item);
				max = Math.max(score ?? 0, max);
			}
			groups.push([value, max]);
		}
		const listInsertionElement = this.viewportNode;
		const sorted = this.getValidItems().sort((a, b) => {
			const valueA = a.getAttribute("data-value");
			const valueB = b.getAttribute("data-value");
			const scoresA = scores.get(valueA) ?? 0;
			return (scores.get(valueB) ?? 0) - scoresA;
		});
		for (const item of sorted) {
			const group = item.closest(COMMAND_GROUP_ITEMS_SELECTOR);
			if (group) {
				const itemToAppend = item.parentElement === group ? item : item.closest(`${COMMAND_GROUP_ITEMS_SELECTOR} > *`);
				if (itemToAppend) group.appendChild(itemToAppend);
			} else {
				const itemToAppend = item.parentElement === listInsertionElement ? item : item.closest(`${COMMAND_GROUP_ITEMS_SELECTOR} > *`);
				if (itemToAppend) listInsertionElement?.appendChild(itemToAppend);
			}
		}
		const sortedGroups = groups.sort((a, b) => b[1] - a[1]);
		for (const group of sortedGroups) {
			const element = listInsertionElement?.querySelector(`${COMMAND_GROUP_SELECTOR}[${COMMAND_VALUE_ATTR}="${cssEscape(group[0])}"]`);
			element?.parentElement?.appendChild(element);
		}
		this.#selectFirstItem();
	}
	/**
	* Sets current value and triggers re-render if cleared.
	*
	* @param value - New value to set
	*/
	setValue(value, opts) {
		if (value !== this.opts.value.current && value === "") afterTick(() => {
			this.key++;
		});
		this.setState("value", value, opts);
		this.opts.value.current = value;
	}
	/**
	* Selects first non-disabled item on next tick.
	*/
	#selectFirstItem() {
		afterTick(() => {
			const value = this.getValidItems().find((item) => item.getAttribute("aria-disabled") !== "true")?.getAttribute(COMMAND_VALUE_ATTR);
			const shouldPreventScroll = this.#isInitialMount && this.opts.disableInitialScroll.current;
			this.setValue(value ?? "", shouldPreventScroll);
			this.#isInitialMount = false;
		});
	}
	/**
	* Scrolls the initial value into view if it exists and is not the first item.
	* Called during initial mount when a value is provided.
	*/
	#scrollInitialValue() {
		afterTick(() => {
			if (!this.opts.disableInitialScroll.current) this.#scrollSelectedIntoView();
			this.#isInitialMount = false;
		});
	}
	/**
	* Updates filtered items/groups based on search.
	* Recalculates scores and filtered count.
	*/
	#filterItems() {
		if (!this._commandState.search || this.opts.shouldFilter.current === false) {
			this._commandState.filtered.count = this.allItems.size;
			return;
		}
		this._commandState.filtered.groups = /* @__PURE__ */ new Set();
		let itemCount = 0;
		for (const id of this.allItems) {
			const value = this.allIds.get(id)?.value ?? "";
			const keywords = this.allIds.get(id)?.keywords ?? [];
			const rank = this.#score(value, keywords);
			this._commandState.filtered.items.set(id, rank);
			if (rank > 0) itemCount++;
		}
		for (const [groupId, group] of this.allGroups) for (const itemId of group) {
			const currItem = this._commandState.filtered.items.get(itemId);
			if (currItem && currItem > 0) {
				this._commandState.filtered.groups.add(groupId);
				break;
			}
		}
		this._commandState.filtered.count = itemCount;
	}
	/**
	* Gets all non-disabled, visible command items.
	*
	* @returns Array of valid item elements
	* @remarks Exposed for direct item access and bound checking
	*/
	getValidItems() {
		const node = this.opts.ref.current;
		if (!node) return [];
		return Array.from(node.querySelectorAll(COMMAND_VALID_ITEM_SELECTOR)).filter((el) => !!el);
	}
	/**
	* Gets all visible command items.
	*
	* @returns Array of valid item elements
	* @remarks Exposed for direct item access and bound checking
	*/
	getVisibleItems() {
		const node = this.opts.ref.current;
		if (!node) return [];
		return Array.from(node.querySelectorAll(COMMAND_ITEM_SELECTOR)).filter((el) => !!el);
	}
	/** Returns all visible items in a matrix structure
	*
	* @remarks Returns empty if the command isn't configured as a grid
	*
	* @returns
	*/
	get itemsGrid() {
		if (!this.isGrid) return [];
		const columns = this.opts.columns.current ?? 1;
		const items = this.getVisibleItems();
		const grid = [[]];
		let currentGroup = items[0]?.getAttribute("data-group");
		let column = 0;
		let row = 0;
		for (let i = 0; i < items.length; i++) {
			const item = items[i];
			const itemGroup = item?.getAttribute("data-group");
			if (currentGroup !== itemGroup) {
				currentGroup = itemGroup;
				column = 1;
				row++;
				grid.push([{
					index: i,
					firstRowOfGroup: true,
					ref: item
				}]);
			} else {
				column++;
				if (column > columns) {
					row++;
					column = 1;
					grid.push([]);
				}
				grid[row]?.push({
					index: i,
					firstRowOfGroup: grid[row]?.[0]?.firstRowOfGroup ?? i === 0,
					ref: item
				});
			}
		}
		return grid;
	}
	/**
	* Gets currently selected command item.
	*
	* @returns Selected element or undefined
	*/
	#getSelectedItem() {
		const node = this.opts.ref.current;
		if (!node) return;
		const selectedNode = node.querySelector(`${COMMAND_VALID_ITEM_SELECTOR}[data-selected]`);
		if (!selectedNode) return;
		return selectedNode;
	}
	/**
	* Scrolls selected item into view.
	* Special handling for first items in groups.
	*/
	#scrollSelectedIntoView() {
		afterTick(() => {
			const item = this.#getSelectedItem();
			if (!item) return;
			const grandparent = item.parentElement?.parentElement;
			if (!grandparent) return;
			if (this.isGrid) {
				const isFirstRowOfGroup = this.#itemIsFirstRowOfGroup(item);
				item.scrollIntoView({ block: "nearest" });
				if (isFirstRowOfGroup) {
					(item?.closest(COMMAND_GROUP_SELECTOR)?.querySelector(COMMAND_GROUP_HEADING_SELECTOR))?.scrollIntoView({ block: "nearest" });
					return;
				}
			} else {
				const firstChildOfParent = getFirstNonCommentChild(grandparent);
				if (firstChildOfParent && firstChildOfParent.dataset?.value === item.dataset?.value) {
					(item?.closest(COMMAND_GROUP_SELECTOR)?.querySelector(COMMAND_GROUP_HEADING_SELECTOR))?.scrollIntoView({ block: "nearest" });
					return;
				}
			}
			item.scrollIntoView({ block: "nearest" });
		});
	}
	#itemIsFirstRowOfGroup(item) {
		const grid = this.itemsGrid;
		if (grid.length === 0) return false;
		for (let r = 0; r < grid.length; r++) {
			const row = grid[r];
			if (row === void 0) continue;
			for (let c = 0; c < row.length; c++) {
				const column = row[c];
				if (column === void 0 || column.ref !== item) continue;
				return column.firstRowOfGroup;
			}
		}
		return false;
	}
	/**
	* Sets selection to item at specified index in valid items array.
	* If index is out of bounds, does nothing.
	*
	* @param index - Zero-based index of item to select
	* @remarks
	* Uses `getValidItems()` to get selectable items, filtering out disabled/hidden ones.
	* Access valid items directly via `getValidItems()` to check bounds before calling.
	*
	* @example
	* // get valid items length for bounds check
	* const items = getValidItems()
	* if (index < items.length) {
	*   updateSelectedToIndex(index)
	* }
	*/
	updateSelectedToIndex(index) {
		const item = this.getValidItems()[index];
		if (!item) return;
		this.setValue(item.getAttribute(COMMAND_VALUE_ATTR) ?? "");
	}
	/**
	* Updates selected item by moving up/down relative to current selection.
	* Handles wrapping when loop option is enabled.
	*
	* @param change - Direction to move: 1 for next item, -1 for previous item
	* @remarks
	* The loop behavior wraps:
	* - From last item to first when moving next
	* - From first item to last when moving previous
	*
	* Uses `getValidItems()` to get all selectable items, which filters out disabled/hidden items.
	* You can call `getValidItems()` directly to get the current valid items array.
	*
	* @example
	* // select next item
	* updateSelectedByItem(1)
	*
	* // get all valid items
	* const items = getValidItems()
	*/
	updateSelectedByItem(change) {
		const selected = this.#getSelectedItem();
		const items = this.getValidItems();
		const index = items.findIndex((item) => item === selected);
		let newSelected = items[index + change];
		if (this.opts.loop.current) newSelected = index + change < 0 ? items[items.length - 1] : index + change === items.length ? items[0] : items[index + change];
		if (newSelected) this.setValue(newSelected.getAttribute(COMMAND_VALUE_ATTR) ?? "");
	}
	/**
	* Moves selection to the first valid item in the next/previous group.
	* If no group is found, falls back to selecting the next/previous item globally.
	*
	* @param change - Direction to move: 1 for next group, -1 for previous group
	* @example
	* // move to first item in next group
	* updateSelectedByGroup(1)
	*
	* // move to first item in previous group
	* updateSelectedByGroup(-1)
	*/
	updateSelectedByGroup(change) {
		let group = this.#getSelectedItem()?.closest(COMMAND_GROUP_SELECTOR);
		let item;
		while (group && !item) {
			group = change > 0 ? findNextSibling(group, COMMAND_GROUP_SELECTOR) : findPreviousSibling(group, COMMAND_GROUP_SELECTOR);
			item = group?.querySelector(COMMAND_VALID_ITEM_SELECTOR);
		}
		if (item) this.setValue(item.getAttribute(COMMAND_VALUE_ATTR) ?? "");
		else this.updateSelectedByItem(change);
	}
	/**
	* Maps item id to display value and search keywords.
	* Returns cleanup function to remove mapping.
	*
	* @param id - Unique item identifier
	* @param value - Display text
	* @param keywords - Optional search boost terms
	* @returns Cleanup function
	*/
	registerValue(value, keywords) {
		if (!(value && value === this.allIds.get(value)?.value)) this.allIds.set(value, {
			value,
			keywords
		});
		this._commandState.filtered.items.set(value, this.#score(value, keywords));
		if (!this.sortAfterTick) {
			this.sortAfterTick = true;
			afterTick(() => {
				this.#sort();
				this.sortAfterTick = false;
			});
		}
		return () => {
			this.allIds.delete(value);
		};
	}
	/**
	* Registers item in command list and its group.
	* Handles filtering, sorting and selection updates.
	*
	* @param id - Item identifier
	* @param groupId - Optional group to add item to
	* @returns Cleanup function that handles selection
	*/
	registerItem(id, groupId) {
		this.allItems.add(id);
		if (groupId) if (!this.allGroups.has(groupId)) this.allGroups.set(groupId, /* @__PURE__ */ new Set([id]));
		else this.allGroups.get(groupId).add(id);
		if (!this.sortAndFilterAfterTick) {
			this.sortAndFilterAfterTick = true;
			afterTick(() => {
				this.#filterItems();
				this.#sort();
				this.sortAndFilterAfterTick = false;
			});
		}
		this.#scheduleUpdate();
		return () => {
			const selectedItem = this.#getSelectedItem();
			this.allItems.delete(id);
			this.commandState.filtered.items.delete(id);
			this.#filterItems();
			if (selectedItem?.getAttribute("id") === id) this.#selectFirstItem();
			this.#scheduleUpdate();
		};
	}
	/**
	* Creates empty group if not exists.
	*
	* @param id - Group identifier
	* @returns Cleanup function
	*/
	registerGroup(id) {
		if (!this.allGroups.has(id)) this.allGroups.set(id, /* @__PURE__ */ new Set());
		return () => {
			this.allIds.delete(id);
			this.allGroups.delete(id);
		};
	}
	get isGrid() {
		return this.opts.columns.current !== null;
	}
	/**
	* Selects last valid item.
	*/
	#last() {
		return this.updateSelectedToIndex(this.getValidItems().length - 1);
	}
	/**
	* Handles next item selection:
	* - Meta: Jump to last
	* - Alt: Next group
	* - Default: Next item
	*
	* @param e - Keyboard event
	*/
	#next(e) {
		e.preventDefault();
		if (e.metaKey) this.#last();
		else if (e.altKey) this.updateSelectedByGroup(1);
		else this.updateSelectedByItem(1);
	}
	#down(e) {
		if (this.opts.columns.current === null) return;
		e.preventDefault();
		if (e.metaKey) this.updateSelectedByGroup(1);
		else this.updateSelectedByItem(this.#nextRowColumnOffset(e));
	}
	#getColumn(item, grid) {
		if (grid.length === 0) return null;
		for (let r = 0; r < grid.length; r++) {
			const row = grid[r];
			if (row === void 0) continue;
			for (let c = 0; c < row.length; c++) {
				const column = row[c];
				if (column === void 0 || column.ref !== item) continue;
				return {
					columnIndex: c,
					rowIndex: r
				};
			}
		}
		return null;
	}
	#nextRowColumnOffset(e) {
		const grid = this.itemsGrid;
		const selected = this.#getSelectedItem();
		if (!selected) return 0;
		const column = this.#getColumn(selected, grid);
		if (!column) return 0;
		let newItem = null;
		const skipRows = e.altKey ? 1 : 0;
		if (e.altKey && column.rowIndex === grid.length - 2 && !this.opts.loop.current) newItem = this.#findNextNonDisabledItem({
			start: grid.length - 1,
			end: grid.length,
			expectedColumnIndex: column.columnIndex,
			grid
		});
		else if (column.rowIndex === grid.length - 1) {
			if (!this.opts.loop.current) return 0;
			newItem = this.#findNextNonDisabledItem({
				start: 0 + skipRows,
				end: column.rowIndex,
				expectedColumnIndex: column.columnIndex,
				grid
			});
		} else {
			newItem = this.#findNextNonDisabledItem({
				start: column.rowIndex + 1 + skipRows,
				end: grid.length,
				expectedColumnIndex: column.columnIndex,
				grid
			});
			if (newItem === null && this.opts.loop.current) newItem = this.#findNextNonDisabledItem({
				start: 0,
				end: column.rowIndex,
				expectedColumnIndex: column.columnIndex,
				grid
			});
		}
		return this.#calculateOffset(selected, newItem);
	}
	/** Attempts to find the next non-disabled column that matches the expected column.
	*
	* @remarks
	* - Skips over disabled columns
	* - When a row is shorter than the expected column it defaults to the last item in the row
	*
	* @param param0
	* @returns
	*/
	#findNextNonDisabledItem({ start, end, grid, expectedColumnIndex }) {
		let newItem = null;
		for (let r = start; r < end; r++) {
			const row = grid[r];
			newItem = row[expectedColumnIndex]?.ref ?? null;
			if (newItem !== null && itemIsDisabled(newItem)) {
				newItem = null;
				continue;
			}
			if (newItem === null) for (let i = row.length - 1; i >= 0; i--) {
				const item = row[row.length - 1];
				if (item === void 0 || itemIsDisabled(item.ref)) continue;
				newItem = item.ref;
				break;
			}
			break;
		}
		return newItem;
	}
	#calculateOffset(selected, newSelected) {
		if (newSelected === null) return 0;
		const items = this.getValidItems();
		const ogIndex = items.findIndex((item) => item === selected);
		return items.findIndex((item) => item === newSelected) - ogIndex;
	}
	#up(e) {
		if (this.opts.columns.current === null) return;
		e.preventDefault();
		if (e.metaKey) this.updateSelectedByGroup(-1);
		else this.updateSelectedByItem(this.#previousRowColumnOffset(e));
	}
	#previousRowColumnOffset(e) {
		const grid = this.itemsGrid;
		const selected = this.#getSelectedItem();
		if (selected === void 0) return 0;
		const column = this.#getColumn(selected, grid);
		if (column === null) return 0;
		let newItem = null;
		const skipRows = e.altKey ? 1 : 0;
		if (e.altKey && column.rowIndex === 1 && this.opts.loop.current === false) newItem = this.#findNextNonDisabledItemDesc({
			start: 0,
			end: 0,
			expectedColumnIndex: column.columnIndex,
			grid
		});
		else if (column.rowIndex === 0) {
			if (this.opts.loop.current === false) return 0;
			newItem = this.#findNextNonDisabledItemDesc({
				start: grid.length - 1 - skipRows,
				end: column.rowIndex + 1,
				expectedColumnIndex: column.columnIndex,
				grid
			});
		} else {
			newItem = this.#findNextNonDisabledItemDesc({
				start: column.rowIndex - 1 - skipRows,
				end: 0,
				expectedColumnIndex: column.columnIndex,
				grid
			});
			if (newItem === null && this.opts.loop.current) newItem = this.#findNextNonDisabledItemDesc({
				start: grid.length - 1,
				end: column.rowIndex + 1,
				expectedColumnIndex: column.columnIndex,
				grid
			});
		}
		return this.#calculateOffset(selected, newItem);
	}
	/**
	* Attempts to find the next non-disabled column that matches the expected column.
	*
	* @remarks
	* - Skips over disabled columns
	* - When a row is shorter than the expected column it defaults to the last item in the row
	*/
	#findNextNonDisabledItemDesc({ start, end, grid, expectedColumnIndex }) {
		let newItem = null;
		for (let r = start; r >= end; r--) {
			const row = grid[r];
			if (row === void 0) continue;
			newItem = row[expectedColumnIndex]?.ref ?? null;
			if (newItem !== null && itemIsDisabled(newItem)) {
				newItem = null;
				continue;
			}
			if (newItem === null) for (let i = row.length - 1; i >= 0; i--) {
				const item = row[row.length - 1];
				if (item === void 0 || itemIsDisabled(item.ref)) continue;
				newItem = item.ref;
				break;
			}
			break;
		}
		return newItem;
	}
	/**
	* Handles previous item selection:
	* - Meta: Jump to first
	* - Alt: Previous group
	* - Default: Previous item
	*
	* @param e - Keyboard event
	*/
	#prev(e) {
		e.preventDefault();
		if (e.metaKey) this.updateSelectedToIndex(0);
		else if (e.altKey) this.updateSelectedByGroup(-1);
		else this.updateSelectedByItem(-1);
	}
	onkeydown(e) {
		const isVim = this.opts.vimBindings.current && e.ctrlKey;
		switch (e.key) {
			case "n":
			case "j":
				if (isVim) if (this.isGrid) this.#down(e);
				else this.#next(e);
				break;
			case "l":
				if (isVim) {
					if (this.isGrid) this.#next(e);
				}
				break;
			case ARROW_DOWN:
				if (this.isGrid) this.#down(e);
				else this.#next(e);
				break;
			case ARROW_RIGHT:
				if (!this.isGrid) break;
				this.#next(e);
				break;
			case "p":
			case "k":
				if (isVim) if (this.isGrid) this.#up(e);
				else this.#prev(e);
				break;
			case "h":
				if (isVim && this.isGrid) this.#prev(e);
				break;
			case ARROW_UP:
				if (this.isGrid) this.#up(e);
				else this.#prev(e);
				break;
			case ARROW_LEFT:
				if (!this.isGrid) break;
				this.#prev(e);
				break;
			case HOME:
				e.preventDefault();
				this.updateSelectedToIndex(0);
				break;
			case "End":
				e.preventDefault();
				this.#last();
				break;
			case ENTER:
 /**
			* Check if IME composition is finished before triggering the select event.
			* This prevents unwanted triggering while user is still inputting text with IME.
			* e.keyCode === 229 is for the Japanese IME && Safari as `isComposing` does not
			* work with Japanese IME and Safari in combination.
			*/
			if (!e.isComposing && e.keyCode !== 229) {
				e.preventDefault();
				const item = this.#getSelectedItem();
				if (item) item?.click();
			}
		}
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		role: "application",
		[commandAttrs.root]: "",
		tabindex: -1,
		onkeydown: this.onkeydown,
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
function itemIsDisabled(item) {
	return item.getAttribute("aria-disabled") === "true";
}
var CommandEmptyState = class CommandEmptyState {
	static create(opts) {
		return new CommandEmptyState(opts, CommandRootContext.get());
	}
	opts;
	root;
	attachment;
	#shouldRender = derived(() => {
		return this.root._commandState.filtered.count === 0 && this.#isInitialRender === false || this.opts.forceMount.current;
	});
	get shouldRender() {
		return this.#shouldRender();
	}
	set shouldRender($$value) {
		return this.#shouldRender($$value);
	}
	#isInitialRender = true;
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref);
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		role: "presentation",
		[commandAttrs.empty]: "",
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var CommandGroupContainerState = class CommandGroupContainerState {
	static create(opts) {
		return CommandGroupContainerContext.set(new CommandGroupContainerState(opts, CommandRootContext.get()));
	}
	opts;
	root;
	attachment;
	#shouldRender = derived(() => {
		if (this.opts.forceMount.current) return true;
		if (this.root.opts.shouldFilter.current === false) return true;
		if (!this.root.commandState.search) return true;
		return this.root._commandState.filtered.groups.has(this.trueValue);
	});
	get shouldRender() {
		return this.#shouldRender();
	}
	set shouldRender($$value) {
		return this.#shouldRender($$value);
	}
	headingNode = null;
	trueValue = "";
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref);
		this.trueValue = opts.value.current ?? opts.id.current;
		watch(() => this.trueValue, () => {
			return this.root.registerGroup(this.trueValue);
		});
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		role: "presentation",
		hidden: this.shouldRender ? void 0 : true,
		"data-value": this.trueValue,
		[commandAttrs.group]: "",
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var CommandGroupHeadingState = class CommandGroupHeadingState {
	static create(opts) {
		return new CommandGroupHeadingState(opts, CommandGroupContainerContext.get());
	}
	opts;
	group;
	attachment;
	constructor(opts, group) {
		this.opts = opts;
		this.group = group;
		this.attachment = attachRef(this.opts.ref, (v) => this.group.headingNode = v);
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		[commandAttrs["group-heading"]]: "",
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var CommandGroupItemsState = class CommandGroupItemsState {
	static create(opts) {
		return new CommandGroupItemsState(opts, CommandGroupContainerContext.get());
	}
	opts;
	group;
	attachment;
	constructor(opts, group) {
		this.opts = opts;
		this.group = group;
		this.attachment = attachRef(this.opts.ref);
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		role: "group",
		[commandAttrs["group-items"]]: "",
		"aria-labelledby": this.group.headingNode?.id ?? void 0,
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var CommandInputState = class CommandInputState {
	static create(opts) {
		return new CommandInputState(opts, CommandRootContext.get());
	}
	opts;
	root;
	attachment;
	#selectedItemId = derived(() => {
		const item = this.root.viewportNode?.querySelector(`${COMMAND_ITEM_SELECTOR}[${COMMAND_VALUE_ATTR}="${cssEscape(this.root.opts.value.current)}"]`);
		if (item === void 0 || item === null) return;
		return item.getAttribute("id") ?? void 0;
	});
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref, (v) => this.root.inputNode = v);
		watch(() => this.opts.ref.current, () => {
			const node = this.opts.ref.current;
			if (node && this.opts.autofocus.current) afterSleep(10, () => node.focus());
		});
		watch(() => this.opts.value.current, () => {
			if (this.root.commandState.search !== this.opts.value.current) this.root.setState("search", this.opts.value.current);
		});
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		type: "text",
		[commandAttrs.input]: "",
		autocomplete: "off",
		autocorrect: "off",
		spellcheck: false,
		"aria-autocomplete": "list",
		role: "combobox",
		"aria-expanded": boolToStr(true),
		"aria-controls": this.root.viewportNode?.id ?? void 0,
		"aria-labelledby": this.root.labelNode?.id ?? void 0,
		"aria-activedescendant": this.#selectedItemId(),
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var CommandItemState = class CommandItemState {
	static create(opts) {
		const group = CommandGroupContainerContext.getOr(null);
		return new CommandItemState({
			...opts,
			group
		}, CommandRootContext.get());
	}
	opts;
	root;
	attachment;
	#group = null;
	#trueForceMount = derived(() => {
		return this.opts.forceMount.current || this.#group?.opts.forceMount.current === true;
	});
	#shouldRender = derived(() => {
		this.opts.ref.current;
		if (this.#trueForceMount() || this.root.opts.shouldFilter.current === false || !this.root.commandState.search) return true;
		const currentScore = this.root.commandState.filtered.items.get(this.trueValue);
		if (currentScore === void 0) return false;
		return currentScore > 0;
	});
	get shouldRender() {
		return this.#shouldRender();
	}
	set shouldRender($$value) {
		return this.#shouldRender($$value);
	}
	#isSelected = derived(() => this.root.opts.value.current === this.trueValue && this.trueValue !== "");
	get isSelected() {
		return this.#isSelected();
	}
	set isSelected($$value) {
		return this.#isSelected($$value);
	}
	trueValue = "";
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.#group = CommandGroupContainerContext.getOr(null);
		this.trueValue = opts.value.current;
		this.attachment = attachRef(this.opts.ref);
		watch([
			() => this.trueValue,
			() => this.#group?.trueValue,
			() => this.opts.forceMount.current
		], () => {
			if (this.opts.forceMount.current || !this.trueValue) return;
			return this.root.registerItem(this.trueValue, this.#group?.trueValue);
		});
		watch([() => this.opts.value.current, () => this.opts.ref.current], () => {
			if (this.opts.value.current) this.trueValue = this.opts.value.current;
			else if (this.opts.ref.current?.textContent) this.trueValue = this.opts.ref.current.textContent.trim();
			if (this.trueValue) {
				this.root.registerValue(this.trueValue, opts.keywords.current.map((kw) => kw.trim()));
				this.opts.ref.current?.setAttribute(COMMAND_VALUE_ATTR, this.trueValue);
			}
		});
		this.onclick = this.onclick.bind(this);
		this.onpointermove = this.onpointermove.bind(this);
	}
	#onSelect() {
		if (this.opts.disabled.current) return;
		this.#select();
		this.opts.onSelect?.current();
	}
	#select() {
		if (this.opts.disabled.current) return;
		this.root.setValue(this.trueValue, true);
	}
	onpointermove(_) {
		if (this.opts.disabled.current || this.root.opts.disablePointerSelection.current) return;
		this.#select();
	}
	onclick(_) {
		if (this.opts.disabled.current) return;
		this.#onSelect();
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		"aria-disabled": boolToStr(this.opts.disabled.current),
		"aria-selected": boolToStr(this.isSelected),
		"data-disabled": boolToEmptyStrOrUndef(this.opts.disabled.current),
		"data-selected": boolToEmptyStrOrUndef(this.isSelected),
		"data-value": this.trueValue,
		"data-group": this.#group?.trueValue,
		[commandAttrs.item]: "",
		role: "option",
		onpointermove: this.onpointermove,
		onclick: this.onclick,
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var CommandSeparatorState = class CommandSeparatorState {
	static create(opts) {
		return new CommandSeparatorState(opts, CommandRootContext.get());
	}
	opts;
	root;
	attachment;
	#shouldRender = derived(() => !this.root._commandState.search || this.opts.forceMount.current);
	get shouldRender() {
		return this.#shouldRender();
	}
	set shouldRender($$value) {
		return this.#shouldRender($$value);
	}
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref);
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		"aria-hidden": "true",
		[commandAttrs.separator]: "",
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var CommandListState = class CommandListState {
	static create(opts) {
		return CommandListContext.set(new CommandListState(opts, CommandRootContext.get()));
	}
	opts;
	root;
	attachment;
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref);
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		role: "listbox",
		"aria-label": this.opts.ariaLabel.current,
		[commandAttrs.list]: "",
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var CommandLabelState = class CommandLabelState {
	static create(opts) {
		return new CommandLabelState(opts, CommandRootContext.get());
	}
	opts;
	root;
	attachment;
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref, (v) => this.root.labelNode = v);
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		[commandAttrs["input-label"]]: "",
		for: this.opts.for?.current,
		style: srOnlyStyles,
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/command/components/_command-label.svelte
function _command_label($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { id = createId(uid), ref = null, children, $$slots, $$events, ...restProps } = $$props;
		const labelState = CommandLabelState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v)
		});
		const mergedProps = derived(() => mergeProps(restProps, labelState.props));
		$$renderer.push(`<label${attributes({ ...mergedProps() })}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></label>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/command/components/command.svelte
function Command($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { id = createId(uid), ref = null, value = "", onValueChange = noop$2, onStateChange = noop$2, loop = false, shouldFilter = true, filter = computeCommandScore, label = "", vimBindings = true, disablePointerSelection = false, disableInitialScroll = false, columns = null, children, child, $$slots, $$events, ...restProps } = $$props;
		const rootState = CommandRootState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v),
			filter: boxWith(() => filter),
			shouldFilter: boxWith(() => shouldFilter),
			loop: boxWith(() => loop),
			value: boxWith(() => value, (v) => {
				if (value !== v) {
					value = v;
					onValueChange(v);
				}
			}),
			vimBindings: boxWith(() => vimBindings),
			disablePointerSelection: boxWith(() => disablePointerSelection),
			disableInitialScroll: boxWith(() => disableInitialScroll),
			onStateChange: boxWith(() => onStateChange),
			columns: boxWith(() => columns)
		});
		/**
		* Sets selection to item at specified index in valid items array.
		* If index is out of bounds, does nothing.
		*
		* @param index - Zero-based index of item to select
		* @remarks
		* Uses `getValidItems()` to get selectable items, filtering out disabled/hidden ones.
		* Access valid items directly via `getValidItems()` to check bounds before calling.
		*
		* @example
		* // get valid items length for bounds check
		* const items = getValidItems()
		* if (index < items.length) {
		*   updateSelectedToIndex(index)
		* }
		*/
		const updateSelectedToIndex = (i) => rootState.updateSelectedToIndex(i);
		/**
		* Moves selection to the first valid item in the next/previous group.
		* If no group is found, falls back to selecting the next/previous item globally.
		*
		* @param change - Direction to move: 1 for next group, -1 for previous group
		* @example
		* // move to first item in next group
		* updateSelectedByGroup(1)
		*
		* // move to first item in previous group
		* updateSelectedByGroup(-1)
		*/
		const updateSelectedByGroup = (c) => rootState.updateSelectedByGroup(c);
		/**
		* Updates selected item by moving up/down relative to current selection.
		* Handles wrapping when loop option is enabled.
		*
		* @param change - Direction to move: 1 for next item, -1 for previous item
		* @remarks
		* The loop behavior wraps:
		* - From last item to first when moving next
		* - From first item to last when moving previous
		*
		* Uses `getValidItems()` to get all selectable items, which filters out disabled/hidden items.
		* You can call `getValidItems()` directly to get the current valid items array.
		*
		* @example
		* // select next item
		* updateSelectedByItem(1)
		*
		* // get all valid items
		* const items = getValidItems()
		*/
		const updateSelectedByItem = (c) => rootState.updateSelectedByItem(c);
		/**
		* Gets all non-disabled, visible command items.
		*
		* @returns Array of valid item elements
		* @remarks Exposed for direct item access and bound checking
		*/
		const getValidItems = () => rootState.getValidItems();
		const mergedProps = derived(() => mergeProps(restProps, rootState.props));
		function Label($$renderer) {
			_command_label($$renderer, {
				children: ($$renderer) => {
					$$renderer.push(`<!---->${escape_html$1(label)}`);
				},
				$$slots: { default: true }
			});
		}
		if (child) {
			$$renderer.push("<!--[0-->");
			Label($$renderer);
			$$renderer.push(`<!----> `);
			child($$renderer, { props: mergedProps() });
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div${attributes({ ...mergedProps() })}>`);
			Label($$renderer);
			$$renderer.push(`<!----> `);
			children?.($$renderer);
			$$renderer.push(`<!----></div>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, {
			ref,
			value,
			updateSelectedToIndex,
			updateSelectedByGroup,
			updateSelectedByItem,
			getValidItems
		});
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/command/components/command-empty.svelte
function Command_empty($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { id = createId(uid), ref = null, children, child, forceMount = false, $$slots, $$events, ...restProps } = $$props;
		const emptyState = CommandEmptyState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v),
			forceMount: boxWith(() => forceMount)
		});
		const mergedProps = derived(() => mergeProps(emptyState.props, restProps));
		if (emptyState.shouldRender) {
			$$renderer.push("<!--[0-->");
			if (child) {
				$$renderer.push("<!--[0-->");
				child($$renderer, { props: mergedProps() });
				$$renderer.push(`<!---->`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<div${attributes({ ...mergedProps() })}>`);
				children?.($$renderer);
				$$renderer.push(`<!----></div>`);
			}
			$$renderer.push(`<!--]-->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/command/components/command-group.svelte
function Command_group($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { id = createId(uid), ref = null, value = "", forceMount = false, children, child, $$slots, $$events, ...restProps } = $$props;
		const groupState = CommandGroupContainerState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v),
			forceMount: boxWith(() => forceMount),
			value: boxWith(() => value)
		});
		const mergedProps = derived(() => mergeProps(restProps, groupState.props));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, { props: mergedProps() });
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div${attributes({ ...mergedProps() })}>`);
			children?.($$renderer);
			$$renderer.push(`<!----></div>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/command/components/command-group-heading.svelte
function Command_group_heading($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { id = createId(uid), ref = null, children, child, $$slots, $$events, ...restProps } = $$props;
		const headingState = CommandGroupHeadingState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v)
		});
		const mergedProps = derived(() => mergeProps(restProps, headingState.props));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, { props: mergedProps() });
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div${attributes({ ...mergedProps() })}>`);
			children?.($$renderer);
			$$renderer.push(`<!----></div>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/command/components/command-group-items.svelte
function Command_group_items($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { id = createId(uid), ref = null, children, child, $$slots, $$events, ...restProps } = $$props;
		const groupItemsState = CommandGroupItemsState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v)
		});
		const mergedProps = derived(() => mergeProps(restProps, groupItemsState.props));
		$$renderer.push(`<div style="display: contents;">`);
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, { props: mergedProps() });
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div${attributes({ ...mergedProps() })}>`);
			children?.($$renderer);
			$$renderer.push(`<!----></div>`);
		}
		$$renderer.push(`<!--]--></div>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/command/components/command-input.svelte
function Command_input($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { value = "", autofocus = false, id = createId(uid), ref = null, child, $$slots, $$events, ...restProps } = $$props;
		const inputState = CommandInputState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v),
			value: boxWith(() => value, (v) => {
				value = v;
			}),
			autofocus: boxWith(() => autofocus ?? false)
		});
		const mergedProps = derived(() => mergeProps(restProps, inputState.props));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, { props: mergedProps() });
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<input${attributes({
				...mergedProps(),
				value
			}, void 0, void 0, void 0, 4)}/>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, {
			value,
			ref
		});
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/command/components/command-item.svelte
function Command_item($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { id = createId(uid), ref = null, value = "", disabled = false, children, child, onSelect = noop$2, forceMount = false, keywords = [], $$slots, $$events, ...restProps } = $$props;
		const itemState = CommandItemState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v),
			value: boxWith(() => value),
			disabled: boxWith(() => disabled),
			onSelect: boxWith(() => onSelect),
			forceMount: boxWith(() => forceMount),
			keywords: boxWith(() => keywords)
		});
		const mergedProps = derived(() => mergeProps(restProps, itemState.props));
		$$renderer.push(`<!---->`);
		$$renderer.push(`<div style="display: contents;" data-item-wrapper=""${attr("data-value", itemState.trueValue)}>`);
		if (itemState.shouldRender) {
			$$renderer.push("<!--[0-->");
			if (child) {
				$$renderer.push("<!--[0-->");
				child($$renderer, { props: mergedProps() });
				$$renderer.push(`<!---->`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<div${attributes({ ...mergedProps() })}>`);
				children?.($$renderer);
				$$renderer.push(`<!----></div>`);
			}
			$$renderer.push(`<!--]-->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div>`);
		$$renderer.push(`<!---->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/command/components/command-list.svelte
function Command_list($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { id = createId(uid), ref = null, child, children, "aria-label": ariaLabel, $$slots, $$events, ...restProps } = $$props;
		const listState = CommandListState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v),
			ariaLabel: boxWith(() => ariaLabel ?? "Suggestions...")
		});
		const mergedProps = derived(() => mergeProps(restProps, listState.props));
		$$renderer.push(`<!---->`);
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, { props: mergedProps() });
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div${attributes({ ...mergedProps() })}>`);
			children?.($$renderer);
			$$renderer.push(`<!----></div>`);
		}
		$$renderer.push(`<!--]-->`);
		$$renderer.push(`<!---->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/command/components/command-separator.svelte
function Command_separator($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { id = createId(uid), ref = null, forceMount = false, children, child, $$slots, $$events, ...restProps } = $$props;
		const separatorState = CommandSeparatorState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v),
			forceMount: boxWith(() => forceMount)
		});
		const mergedProps = derived(() => mergeProps(restProps, separatorState.props));
		if (separatorState.shouldRender) {
			$$renderer.push("<!--[0-->");
			if (child) {
				$$renderer.push("<!--[0-->");
				child($$renderer, { props: mergedProps() });
				$$renderer.push(`<!---->`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<div${attributes({ ...mergedProps() })}>`);
				children?.($$renderer);
				$$renderer.push(`<!----></div>`);
			}
			$$renderer.push(`<!--]-->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/command/compute-command-score.js
var SCORE_CONTINUE_MATCH = 1;
var SCORE_SPACE_WORD_JUMP = .9;
var SCORE_NON_SPACE_WORD_JUMP = .8;
var SCORE_CHARACTER_JUMP = .17;
var SCORE_TRANSPOSITION = .1;
var PENALTY_SKIPPED = .999;
var PENALTY_CASE_MISMATCH = .9999;
var PENALTY_NOT_COMPLETE = .99;
var IS_GAP_REGEXP = /[\\/_+.#"@[({&]/;
var COUNT_GAPS_REGEXP = /[\\/_+.#"@[({&]/g;
var IS_SPACE_REGEXP = /[\s-]/;
var COUNT_SPACE_REGEXP = /[\s-]/g;
function computeCommandScoreInner(string, abbreviation, lowerString, lowerAbbreviation, stringIndex, abbreviationIndex, memoizedResults) {
	if (abbreviationIndex === abbreviation.length) {
		if (stringIndex === string.length) return SCORE_CONTINUE_MATCH;
		return PENALTY_NOT_COMPLETE;
	}
	const memoizeKey = `${stringIndex},${abbreviationIndex}`;
	if (memoizedResults[memoizeKey] !== void 0) return memoizedResults[memoizeKey];
	const abbreviationChar = lowerAbbreviation.charAt(abbreviationIndex);
	let index = lowerString.indexOf(abbreviationChar, stringIndex);
	let highScore = 0;
	let score, transposedScore, wordBreaks, spaceBreaks;
	while (index >= 0) {
		score = computeCommandScoreInner(string, abbreviation, lowerString, lowerAbbreviation, index + 1, abbreviationIndex + 1, memoizedResults);
		if (score > highScore) {
			if (index === stringIndex) score *= SCORE_CONTINUE_MATCH;
			else if (IS_GAP_REGEXP.test(string.charAt(index - 1))) {
				score *= SCORE_NON_SPACE_WORD_JUMP;
				wordBreaks = string.slice(stringIndex, index - 1).match(COUNT_GAPS_REGEXP);
				if (wordBreaks && stringIndex > 0) score *= PENALTY_SKIPPED ** wordBreaks.length;
			} else if (IS_SPACE_REGEXP.test(string.charAt(index - 1))) {
				score *= SCORE_SPACE_WORD_JUMP;
				spaceBreaks = string.slice(stringIndex, index - 1).match(COUNT_SPACE_REGEXP);
				if (spaceBreaks && stringIndex > 0) score *= PENALTY_SKIPPED ** spaceBreaks.length;
			} else {
				score *= SCORE_CHARACTER_JUMP;
				if (stringIndex > 0) score *= PENALTY_SKIPPED ** (index - stringIndex);
			}
			if (string.charAt(index) !== abbreviation.charAt(abbreviationIndex)) score *= PENALTY_CASE_MISMATCH;
		}
		if (score < SCORE_TRANSPOSITION && lowerString.charAt(index - 1) === lowerAbbreviation.charAt(abbreviationIndex + 1) || lowerAbbreviation.charAt(abbreviationIndex + 1) === lowerAbbreviation.charAt(abbreviationIndex) && lowerString.charAt(index - 1) !== lowerAbbreviation.charAt(abbreviationIndex)) {
			transposedScore = computeCommandScoreInner(string, abbreviation, lowerString, lowerAbbreviation, index + 1, abbreviationIndex + 2, memoizedResults);
			if (transposedScore * SCORE_TRANSPOSITION > score) score = transposedScore * SCORE_TRANSPOSITION;
		}
		if (score > highScore) highScore = score;
		index = lowerString.indexOf(abbreviationChar, index + 1);
	}
	memoizedResults[memoizeKey] = highScore;
	return highScore;
}
/**
*
* @param string
* @returns
*/
function formatInput(string) {
	return string.toLowerCase().replace(COUNT_SPACE_REGEXP, " ");
}
/**
* Given a command, a search query, and (optionally) a list of keywords for the command,
* computes a score between 0 and 1 that represents how well the search query matches the
* abbreviation and keywords. 1 is a perfect match, 0 is no match.
*
* The score is calculated based on the following rules:
* - The scores are arranged so that a continuous match of characters will result in a total
* score of 1. The best case, this character is a match, and either this is the start of the string
* or the previous character was also a match.
* - A new match at the start of a word scores better than a new match elsewhere as it's more likely
* that the user will type the starts of fragments.
* - Word jumps between spaces are scored slightly higher than slashes, brackets, hyphens, etc.
* - A continuous match of characters will result in a total score of 1.
* - A new match at the start of a word scores better than a new match elsewhere as it's more likely that the user will type the starts of fragments.
* - Any other match isn't ideal, but we include it for completeness.
* - If the user transposed two letters, it should be significantly penalized.
* - The goodness of a match should decay slightly with each missing character.
* - Match higher for letters closer to the beginning of the word.
*
* @param command - The value to score against the search string (e.g. a command name like "Calculator")
* @param search - The search string to score against the value/aliases
* @param commandKeywords - An optional list of aliases/keywords to score against the search string - e.g. ["math", "add", "divide", "multiply", "subtract"]
* @returns A score between 0 and 1 that represents how well the search string matches the
* command (and keywords)
*/
function computeCommandScore(command, search, commandKeywords) {
	/**
	* NOTE: We used to do lower-casing on each recursive call, but this meant that `toLowerCase()`
	* was the dominating cost in the algorithm. Passing both is a little ugly, but considerably
	* faster.
	*/
	command = commandKeywords && commandKeywords.length > 0 ? `${`${command} ${commandKeywords?.join(" ")}`}` : command;
	return computeCommandScoreInner(command, search, formatInput(command), formatInput(search), 0, 0, {});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/menu/components/menu-sub.svelte
function Menu_sub($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { open = false, onOpenChange = noop$2, onOpenChangeComplete = noop$2, children } = $$props;
		MenuSubmenuState.create({
			open: boxWith(() => open, (v) => {
				open = v;
				onOpenChange?.(v);
			}),
			onOpenChangeComplete: boxWith(() => onOpenChangeComplete)
		});
		Floating_layer($$renderer, {
			children: ($$renderer) => {
				children?.($$renderer);
				$$renderer.push(`<!---->`);
			}});
		bind_props($$props, { open });
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/menu/components/menu-item.svelte
function Menu_item($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { child, children, ref = null, id = createId(uid), disabled = false, onSelect = noop$2, closeOnSelect = true, $$slots, $$events, ...restProps } = $$props;
		const itemState = MenuItemState.create({
			id: boxWith(() => id),
			disabled: boxWith(() => disabled),
			onSelect: boxWith(() => onSelect),
			ref: boxWith(() => ref, (v) => ref = v),
			closeOnSelect: boxWith(() => closeOnSelect)
		});
		const mergedProps = derived(() => mergeProps(restProps, itemState.props));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, { props: mergedProps() });
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div${attributes({ ...mergedProps() })}>`);
			children?.($$renderer);
			$$renderer.push(`<!----></div>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/menu/components/menu-group.svelte
function Menu_group($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { children, child, ref = null, id = createId(uid), $$slots, $$events, ...restProps } = $$props;
		const groupState = MenuGroupState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v)
		});
		const mergedProps = derived(() => mergeProps(restProps, groupState.props));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, { props: mergedProps() });
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div${attributes({ ...mergedProps() })}>`);
			children?.($$renderer);
			$$renderer.push(`<!----></div>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/menu/components/menu-separator.svelte
function Menu_separator($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { ref = null, id = createId(uid), child, children, $$slots, $$events, ...restProps } = $$props;
		const separatorState = MenuSeparatorState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v)
		});
		const mergedProps = derived(() => mergeProps(restProps, separatorState.props));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, { props: mergedProps() });
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div${attributes({ ...mergedProps() })}>`);
			children?.($$renderer);
			$$renderer.push(`<!----></div>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/menu/components/menu-sub-content.svelte
function Menu_sub_content($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { id = createId(uid), ref = null, children, child, loop = true, onInteractOutside = noop$2, forceMount = false, onEscapeKeydown = noop$2, interactOutsideBehavior = "defer-otherwise-close", escapeKeydownBehavior = "defer-otherwise-close", onOpenAutoFocus: onOpenAutoFocusProp = noop$2, onCloseAutoFocus: onCloseAutoFocusProp = noop$2, onFocusOutside = noop$2, side = "right", trapFocus = false, style, $$slots, $$events, ...restProps } = $$props;
		const subContentState = MenuContentState.create({
			id: boxWith(() => id),
			loop: boxWith(() => loop),
			ref: boxWith(() => ref, (v) => ref = v),
			isSub: true,
			onCloseAutoFocus: boxWith(() => handleCloseAutoFocus)
		});
		function onkeydown(e) {
			const isKeyDownInside = e.currentTarget.contains(e.target);
			const isCloseKey = SUB_CLOSE_KEYS[subContentState.parentMenu.root.opts.dir.current].includes(e.key);
			if (isKeyDownInside && isCloseKey) {
				subContentState.parentMenu.onClose();
				subContentState.parentMenu.triggerNode?.focus();
				e.preventDefault();
			}
		}
		const dataAttr = derived(() => subContentState.parentMenu.root.getBitsAttr("sub-content"));
		const mergedProps = derived(() => mergeProps(restProps, subContentState.props, {
			side,
			onkeydown,
			[dataAttr()]: ""
		}));
		function handleOpenAutoFocus(e) {
			onOpenAutoFocusProp(e);
			if (e.defaultPrevented) return;
			e.preventDefault();
			if (subContentState.parentMenu.root.isUsingKeyboard && subContentState.parentMenu.contentNode) MenuOpenEvent.dispatch(subContentState.parentMenu.contentNode);
		}
		function handleCloseAutoFocus(e) {
			onCloseAutoFocusProp(e);
			if (e.defaultPrevented) return;
			e.preventDefault();
		}
		function handleInteractOutside(e) {
			onInteractOutside(e);
			if (e.defaultPrevented) return;
			subContentState.parentMenu.onClose();
		}
		function handleEscapeKeydown(e) {
			onEscapeKeydown(e);
			if (e.defaultPrevented) return;
			subContentState.parentMenu.onClose();
		}
		function handleOnFocusOutside(e) {
			onFocusOutside(e);
			if (e.defaultPrevented) return;
			if (!isHTMLElement$1(e.target)) return;
			if (e.target.id === subContentState.parentMenu.triggerNode?.id) return;
			if ((subContentState.parentMenu.parentMenu?.contentNode)?.contains(e.target)) {
				subContentState.parentMenu.onClose();
				e.preventDefault();
				return;
			}
			const subContentSelector = `[${subContentState.parentMenu.root.getBitsAttr("sub-content")}]`;
			if (e.target.closest(subContentSelector)) {
				e.preventDefault();
				return;
			}
			subContentState.parentMenu.onClose();
		}
		if (forceMount) {
			$$renderer.push("<!--[0-->");
			{
				function popper($$renderer, { props, wrapperProps }) {
					const finalProps = mergeProps(props, mergedProps(), { style: getFloatingContentCSSVars("menu") }, { style });
					if (child) {
						$$renderer.push("<!--[0-->");
						child($$renderer, {
							props: finalProps,
							wrapperProps,
							...subContentState.snippetProps
						});
						$$renderer.push(`<!---->`);
					} else {
						$$renderer.push("<!--[-1-->");
						$$renderer.push(`<div${attributes({ ...wrapperProps })}><div${attributes({ ...finalProps })}>`);
						children?.($$renderer);
						$$renderer.push(`<!----></div></div>`);
					}
					$$renderer.push(`<!--]-->`);
				}
				Popper_layer_force_mount($$renderer, spread_props([mergedProps(), {
					ref: subContentState.opts.ref,
					interactOutsideBehavior,
					escapeKeydownBehavior,
					onOpenAutoFocus: handleOpenAutoFocus,
					enabled: subContentState.parentMenu.opts.open.current,
					onInteractOutside: handleInteractOutside,
					onEscapeKeydown: handleEscapeKeydown,
					onFocusOutside: handleOnFocusOutside,
					preventScroll: false,
					loop,
					trapFocus,
					shouldRender: subContentState.shouldRender,
					popper,
					$$slots: { popper: true }
				}]));
			}
		} else if (!forceMount) {
			$$renderer.push("<!--[1-->");
			{
				function popper($$renderer, { props, wrapperProps }) {
					const finalProps = mergeProps(props, mergedProps(), { style: getFloatingContentCSSVars("menu") }, { style });
					if (child) {
						$$renderer.push("<!--[0-->");
						child($$renderer, {
							props: finalProps,
							wrapperProps,
							...subContentState.snippetProps
						});
						$$renderer.push(`<!---->`);
					} else {
						$$renderer.push("<!--[-1-->");
						$$renderer.push(`<div${attributes({ ...wrapperProps })}><div${attributes({ ...finalProps })}>`);
						children?.($$renderer);
						$$renderer.push(`<!----></div></div>`);
					}
					$$renderer.push(`<!--]-->`);
				}
				Popper_layer($$renderer, spread_props([mergedProps(), {
					ref: subContentState.opts.ref,
					interactOutsideBehavior,
					escapeKeydownBehavior,
					onCloseAutoFocus: handleCloseAutoFocus,
					onOpenAutoFocus: handleOpenAutoFocus,
					open: subContentState.parentMenu.opts.open.current,
					onInteractOutside: handleInteractOutside,
					onEscapeKeydown: handleEscapeKeydown,
					onFocusOutside: handleOnFocusOutside,
					preventScroll: false,
					loop,
					trapFocus,
					shouldRender: subContentState.shouldRender,
					popper,
					$$slots: { popper: true }
				}]));
			}
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/menu/components/menu-sub-trigger.svelte
function Menu_sub_trigger($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { id = createId(uid), disabled = false, ref = null, children, child, onSelect = noop$2, openDelay = 0, $$slots, $$events, ...restProps } = $$props;
		const subTriggerState = MenuSubTriggerState.create({
			disabled: boxWith(() => disabled),
			onSelect: boxWith(() => onSelect),
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v),
			openDelay: boxWith(() => openDelay)
		});
		const mergedProps = derived(() => mergeProps(restProps, subTriggerState.props));
		Floating_layer_anchor($$renderer, {
			id,
			ref: subTriggerState.opts.ref,
			children: ($$renderer) => {
				if (child) {
					$$renderer.push("<!--[0-->");
					child($$renderer, { props: mergedProps() });
					$$renderer.push(`<!---->`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<div${attributes({ ...mergedProps() })}>`);
					children?.($$renderer);
					$$renderer.push(`<!----></div>`);
				}
				$$renderer.push(`<!--]-->`);
			}});
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/internal/safe-polygon.svelte.js
function isPointInPolygon(point, polygon) {
	const [x, y] = point;
	let isInside = false;
	const length = polygon.length;
	for (let i = 0, j = length - 1; i < length; j = i++) {
		const [xi, yi] = polygon[i] ?? [0, 0];
		const [xj, yj] = polygon[j] ?? [0, 0];
		if (yi >= y !== yj >= y && x <= (xj - xi) * (y - yi) / (yj - yi) + xi) isInside = !isInside;
	}
	return isInside;
}
function isInsideRect(point, rect) {
	return point[0] >= rect.left && point[0] <= rect.right && point[1] >= rect.top && point[1] <= rect.bottom;
}
function getSide(triggerRect, contentRect) {
	const triggerCenterX = triggerRect.left + triggerRect.width / 2;
	const triggerCenterY = triggerRect.top + triggerRect.height / 2;
	const contentCenterX = contentRect.left + contentRect.width / 2;
	const contentCenterY = contentRect.top + contentRect.height / 2;
	const deltaX = contentCenterX - triggerCenterX;
	const deltaY = contentCenterY - triggerCenterY;
	if (Math.abs(deltaX) > Math.abs(deltaY)) return deltaX > 0 ? "right" : "left";
	return deltaY > 0 ? "bottom" : "top";
}
/**
* Creates a safe polygon area that allows users to move their cursor between
* the trigger and floating content without closing it.
*/
var SafePolygon = class {
	#opts;
	#buffer;
	#transitIntentTimeout;
	#exitPoint = null;
	#exitTarget = null;
	#transitTargets = [];
	#trackedTriggerNode = null;
	#leaveFallbackRafId = null;
	#transitIntentTimeoutId = null;
	#cancelLeaveFallback() {
		if (this.#leaveFallbackRafId !== null) {
			cancelAnimationFrame(this.#leaveFallbackRafId);
			this.#leaveFallbackRafId = null;
		}
	}
	#scheduleLeaveFallback() {
		this.#cancelLeaveFallback();
		this.#leaveFallbackRafId = requestAnimationFrame(() => {
			this.#leaveFallbackRafId = null;
			if (!this.#exitPoint || !this.#exitTarget) return;
			this.#clearTracking();
			this.#opts.onPointerExit();
		});
	}
	#cancelTransitIntentTimeout() {
		if (this.#transitIntentTimeoutId !== null) {
			clearTimeout(this.#transitIntentTimeoutId);
			this.#transitIntentTimeoutId = null;
		}
	}
	#scheduleTransitIntentTimeout() {
		if (this.#transitIntentTimeout === null) return;
		this.#cancelTransitIntentTimeout();
		this.#transitIntentTimeoutId = window.setTimeout(() => {
			this.#transitIntentTimeoutId = null;
			if (!this.#exitPoint || !this.#exitTarget) return;
			this.#clearTracking();
			this.#opts.onPointerExit();
		}, this.#transitIntentTimeout);
	}
	constructor(opts) {
		this.#opts = opts;
		this.#buffer = opts.buffer ?? 1;
		const transitIntentTimeout = opts.transitIntentTimeout;
		this.#transitIntentTimeout = typeof transitIntentTimeout === "number" && transitIntentTimeout > 0 ? transitIntentTimeout : null;
		watch([
			opts.triggerNode,
			opts.contentNode,
			opts.enabled
		], ([triggerNode, contentNode, enabled]) => {
			if (!triggerNode || !contentNode || !enabled) {
				this.#trackedTriggerNode = null;
				this.#clearTracking();
				return;
			}
			if (this.#trackedTriggerNode && this.#trackedTriggerNode !== triggerNode) this.#clearTracking();
			this.#trackedTriggerNode = triggerNode;
			const doc = getDocument(triggerNode);
			const handlePointerMove = (e) => {
				this.#onPointerMove([e.clientX, e.clientY], triggerNode, contentNode);
			};
			const handleTriggerLeave = (e) => {
				const target = e.relatedTarget;
				if (isElement$1(target) && contentNode.contains(target)) return;
				const ignoredTargets = this.#opts.ignoredTargets?.() ?? [];
				if (isElement$1(target) && ignoredTargets.some((n) => n === target || n.contains(target))) return;
				this.#transitTargets = isElement$1(target) && ignoredTargets.length > 0 ? ignoredTargets.filter((n) => target.contains(n)) : [];
				this.#exitPoint = [e.clientX, e.clientY];
				this.#exitTarget = "content";
				this.#scheduleLeaveFallback();
			};
			const handleTriggerEnter = () => {
				this.#clearTracking();
			};
			const handleContentEnter = () => {
				this.#clearTracking();
			};
			const handleContentLeave = (e) => {
				const target = e.relatedTarget;
				if (isElement$1(target) && triggerNode.contains(target)) return;
				this.#exitPoint = [e.clientX, e.clientY];
				this.#exitTarget = "trigger";
				this.#scheduleLeaveFallback();
			};
			return [
				on(doc, "pointermove", handlePointerMove),
				on(triggerNode, "pointerleave", handleTriggerLeave),
				on(triggerNode, "pointerenter", handleTriggerEnter),
				on(contentNode, "pointerenter", handleContentEnter),
				on(contentNode, "pointerleave", handleContentLeave)
			].reduce((acc, cleanup) => () => {
				acc();
				cleanup();
			}, () => {});
		});
	}
	#onPointerMove(clientPoint, triggerNode, contentNode) {
		if (!this.#exitPoint || !this.#exitTarget) return;
		this.#cancelLeaveFallback();
		this.#scheduleTransitIntentTimeout();
		const triggerRect = triggerNode.getBoundingClientRect();
		const contentRect = contentNode.getBoundingClientRect();
		if (this.#exitTarget === "content" && isInsideRect(clientPoint, contentRect)) {
			this.#clearTracking();
			return;
		}
		if (this.#exitTarget === "trigger" && isInsideRect(clientPoint, triggerRect)) {
			this.#clearTracking();
			return;
		}
		if (this.#exitTarget === "content" && this.#transitTargets.length > 0) for (const transitTarget of this.#transitTargets) {
			const transitRect = transitTarget.getBoundingClientRect();
			if (isInsideRect(clientPoint, transitRect)) return;
			const transitSide = getSide(triggerRect, transitRect);
			const transitCorridor = this.#getCorridorPolygon(triggerRect, transitRect, transitSide);
			if (transitCorridor && isPointInPolygon(clientPoint, transitCorridor)) return;
		}
		const side = getSide(triggerRect, contentRect);
		const corridorPoly = this.#getCorridorPolygon(triggerRect, contentRect, side);
		if (corridorPoly && isPointInPolygon(clientPoint, corridorPoly)) return;
		const targetRect = this.#exitTarget === "content" ? contentRect : triggerRect;
		if (isPointInPolygon(clientPoint, this.#getSafePolygon(this.#exitPoint, targetRect, side, this.#exitTarget))) return;
		this.#clearTracking();
		this.#opts.onPointerExit();
	}
	#clearTracking() {
		this.#exitPoint = null;
		this.#exitTarget = null;
		this.#transitTargets = [];
		this.#cancelLeaveFallback();
		this.#cancelTransitIntentTimeout();
	}
	/**
	* Creates a rectangular corridor between trigger and content
	* This prevents closing when cursor is in the gap between them
	*/
	#getCorridorPolygon(triggerRect, contentRect, side) {
		const buffer = this.#buffer;
		switch (side) {
			case "top": return [
				[Math.min(triggerRect.left, contentRect.left) - buffer, triggerRect.top],
				[Math.min(triggerRect.left, contentRect.left) - buffer, contentRect.bottom],
				[Math.max(triggerRect.right, contentRect.right) + buffer, contentRect.bottom],
				[Math.max(triggerRect.right, contentRect.right) + buffer, triggerRect.top]
			];
			case "bottom": return [
				[Math.min(triggerRect.left, contentRect.left) - buffer, triggerRect.bottom],
				[Math.min(triggerRect.left, contentRect.left) - buffer, contentRect.top],
				[Math.max(triggerRect.right, contentRect.right) + buffer, contentRect.top],
				[Math.max(triggerRect.right, contentRect.right) + buffer, triggerRect.bottom]
			];
			case "left": return [
				[triggerRect.left, Math.min(triggerRect.top, contentRect.top) - buffer],
				[contentRect.right, Math.min(triggerRect.top, contentRect.top) - buffer],
				[contentRect.right, Math.max(triggerRect.bottom, contentRect.bottom) + buffer],
				[triggerRect.left, Math.max(triggerRect.bottom, contentRect.bottom) + buffer]
			];
			case "right": return [
				[triggerRect.right, Math.min(triggerRect.top, contentRect.top) - buffer],
				[contentRect.left, Math.min(triggerRect.top, contentRect.top) - buffer],
				[contentRect.left, Math.max(triggerRect.bottom, contentRect.bottom) + buffer],
				[triggerRect.right, Math.max(triggerRect.bottom, contentRect.bottom) + buffer]
			];
		}
	}
	/**
	* Creates a triangular/trapezoidal safe zone from the exit point to the target
	*/
	#getSafePolygon(exitPoint, targetRect, side, exitTarget) {
		const buffer = this.#buffer * 4;
		const [x, y] = exitPoint;
		switch (exitTarget === "trigger" ? this.#flipSide(side) : side) {
			case "top": return [
				[x - buffer, y + buffer],
				[x + buffer, y + buffer],
				[targetRect.right + buffer, targetRect.bottom],
				[targetRect.right + buffer, targetRect.top],
				[targetRect.left - buffer, targetRect.top],
				[targetRect.left - buffer, targetRect.bottom]
			];
			case "bottom": return [
				[x - buffer, y - buffer],
				[x + buffer, y - buffer],
				[targetRect.right + buffer, targetRect.top],
				[targetRect.right + buffer, targetRect.bottom],
				[targetRect.left - buffer, targetRect.bottom],
				[targetRect.left - buffer, targetRect.top]
			];
			case "left": return [
				[x + buffer, y - buffer],
				[x + buffer, y + buffer],
				[targetRect.right, targetRect.bottom + buffer],
				[targetRect.left, targetRect.bottom + buffer],
				[targetRect.left, targetRect.top - buffer],
				[targetRect.right, targetRect.top - buffer]
			];
			case "right": return [
				[x - buffer, y - buffer],
				[x - buffer, y + buffer],
				[targetRect.left, targetRect.bottom + buffer],
				[targetRect.right, targetRect.bottom + buffer],
				[targetRect.right, targetRect.top - buffer],
				[targetRect.left, targetRect.top - buffer]
			];
		}
	}
	#flipSide(side) {
		switch (side) {
			case "top": return "bottom";
			case "bottom": return "top";
			case "left": return "right";
			case "right": return "left";
		}
	}
};
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/popover/popover.svelte.js
var popoverAttrs = createBitsAttrs({
	component: "popover",
	parts: [
		"root",
		"trigger",
		"content",
		"close",
		"overlay"
	]
});
var PopoverRootContext = new Context("Popover.Root");
var PopoverRootState = class PopoverRootState {
	static create(opts) {
		return PopoverRootContext.set(new PopoverRootState(opts));
	}
	opts;
	contentNode = null;
	contentPresence;
	triggerNode = null;
	overlayNode = null;
	overlayPresence;
	openedViaHover = false;
	hasInteractedWithContent = false;
	hoverCooldown = false;
	closeDelay = 0;
	#closeTimeout = null;
	#domContext = null;
	constructor(opts) {
		this.opts = opts;
		this.contentPresence = new PresenceManager({
			ref: boxWith(() => this.contentNode),
			open: this.opts.open,
			onComplete: () => {
				this.opts.onOpenChangeComplete.current(this.opts.open.current);
			}
		});
		this.overlayPresence = new PresenceManager({
			ref: boxWith(() => this.overlayNode),
			open: this.opts.open
		});
		watch(() => this.opts.open.current, (isOpen) => {
			if (!isOpen) {
				this.openedViaHover = false;
				this.hasInteractedWithContent = false;
				this.#clearCloseTimeout();
			}
		});
	}
	setDomContext(ctx) {
		this.#domContext = ctx;
	}
	#clearCloseTimeout() {
		if (this.#closeTimeout !== null && this.#domContext) {
			this.#domContext.clearTimeout(this.#closeTimeout);
			this.#closeTimeout = null;
		}
	}
	toggleOpen() {
		this.#clearCloseTimeout();
		this.opts.open.current = !this.opts.open.current;
	}
	handleClose() {
		this.#clearCloseTimeout();
		if (!this.opts.open.current) return;
		this.opts.open.current = false;
	}
	handleHoverOpen() {
		this.#clearCloseTimeout();
		if (this.opts.open.current) return;
		this.openedViaHover = true;
		this.opts.open.current = true;
	}
	handleHoverClose() {
		if (!this.opts.open.current) return;
		if (this.openedViaHover && !this.hasInteractedWithContent) this.opts.open.current = false;
	}
	handleDelayedHoverClose() {
		if (!this.opts.open.current) return;
		if (!this.openedViaHover || this.hasInteractedWithContent) return;
		this.#clearCloseTimeout();
		if (this.closeDelay <= 0) this.opts.open.current = false;
		else if (this.#domContext) this.#closeTimeout = this.#domContext.setTimeout(() => {
			if (this.openedViaHover && !this.hasInteractedWithContent) this.opts.open.current = false;
			this.#closeTimeout = null;
		}, this.closeDelay);
	}
	cancelDelayedClose() {
		this.#clearCloseTimeout();
	}
	markInteraction() {
		this.hasInteractedWithContent = true;
		this.#clearCloseTimeout();
	}
};
var PopoverTriggerState = class PopoverTriggerState {
	static create(opts) {
		return new PopoverTriggerState(opts, PopoverRootContext.get());
	}
	opts;
	root;
	attachment;
	domContext;
	#openTimeout = null;
	#closeTimeout = null;
	#isHovering = false;
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref, (v) => this.root.triggerNode = v);
		this.domContext = new DOMContext(opts.ref);
		this.root.setDomContext(this.domContext);
		this.onclick = this.onclick.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
		this.onpointerenter = this.onpointerenter.bind(this);
		this.onpointerleave = this.onpointerleave.bind(this);
		watch(() => this.opts.closeDelay.current, (delay) => {
			this.root.closeDelay = delay;
		});
	}
	#clearOpenTimeout() {
		if (this.#openTimeout !== null) {
			this.domContext.clearTimeout(this.#openTimeout);
			this.#openTimeout = null;
		}
	}
	#clearCloseTimeout() {
		if (this.#closeTimeout !== null) {
			this.domContext.clearTimeout(this.#closeTimeout);
			this.#closeTimeout = null;
		}
	}
	#clearAllTimeouts() {
		this.#clearOpenTimeout();
		this.#clearCloseTimeout();
	}
	onpointerenter(e) {
		if (this.opts.disabled.current) return;
		if (!this.opts.openOnHover.current) return;
		if (isTouch(e)) return;
		this.#isHovering = true;
		this.#clearCloseTimeout();
		this.root.cancelDelayedClose();
		if (this.root.opts.open.current || this.root.hoverCooldown) return;
		const delay = this.opts.openDelay.current;
		if (delay <= 0) this.root.handleHoverOpen();
		else this.#openTimeout = this.domContext.setTimeout(() => {
			this.root.handleHoverOpen();
			this.#openTimeout = null;
		}, delay);
	}
	onpointerleave(e) {
		if (this.opts.disabled.current) return;
		if (!this.opts.openOnHover.current) return;
		if (isTouch(e)) return;
		this.#isHovering = false;
		this.#clearOpenTimeout();
		this.root.hoverCooldown = false;
	}
	onclick(e) {
		if (this.opts.disabled.current) return;
		if (e.button !== 0) return;
		this.#clearAllTimeouts();
		if (this.#isHovering && this.root.opts.open.current && this.root.openedViaHover) {
			this.root.openedViaHover = false;
			this.root.hasInteractedWithContent = true;
			return;
		}
		if (this.#isHovering && this.opts.openOnHover.current && this.root.opts.open.current) this.root.hoverCooldown = true;
		if (this.root.hoverCooldown && !this.root.opts.open.current) this.root.hoverCooldown = false;
		this.root.toggleOpen();
	}
	onkeydown(e) {
		if (this.opts.disabled.current) return;
		if (!(e.key === "Enter" || e.key === " ")) return;
		e.preventDefault();
		this.#clearAllTimeouts();
		this.root.toggleOpen();
	}
	#getAriaControls() {
		if (this.root.opts.open.current && this.root.contentNode?.id) return this.root.contentNode?.id;
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		"aria-haspopup": "dialog",
		"aria-expanded": boolToStr(this.root.opts.open.current),
		"data-state": getDataOpenClosed(this.root.opts.open.current),
		"aria-controls": this.#getAriaControls(),
		[popoverAttrs.trigger]: "",
		disabled: this.opts.disabled.current,
		onkeydown: this.onkeydown,
		onclick: this.onclick,
		onpointerenter: this.onpointerenter,
		onpointerleave: this.onpointerleave,
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var PopoverContentState = class PopoverContentState {
	static create(opts) {
		return new PopoverContentState(opts, PopoverRootContext.get());
	}
	opts;
	root;
	attachment;
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref, (v) => this.root.contentNode = v);
		this.onpointerdown = this.onpointerdown.bind(this);
		this.onfocusin = this.onfocusin.bind(this);
		this.onpointerenter = this.onpointerenter.bind(this);
		this.onpointerleave = this.onpointerleave.bind(this);
		new SafePolygon({
			triggerNode: () => this.root.triggerNode,
			contentNode: () => this.root.contentNode,
			enabled: () => this.root.opts.open.current && this.root.openedViaHover && !this.root.hasInteractedWithContent,
			onPointerExit: () => {
				this.root.handleDelayedHoverClose();
			}
		});
	}
	onpointerdown(_) {
		this.root.markInteraction();
	}
	onfocusin(e) {
		const target = e.target;
		if (isElement$1(target) && isTabbable(target)) this.root.markInteraction();
	}
	onpointerenter(e) {
		if (isTouch(e)) return;
		this.root.cancelDelayedClose();
	}
	onpointerleave(e) {
		if (isTouch(e)) return;
	}
	onInteractOutside = (e) => {
		this.opts.onInteractOutside.current(e);
		if (e.defaultPrevented) return;
		if (!isElement$1(e.target)) return;
		const closestTrigger = e.target.closest(popoverAttrs.selector("trigger"));
		if (closestTrigger && closestTrigger === this.root.triggerNode) return;
		if (this.opts.customAnchor.current) {
			if (isElement$1(this.opts.customAnchor.current)) {
				if (this.opts.customAnchor.current.contains(e.target)) return;
			} else if (typeof this.opts.customAnchor.current === "string") {
				const el = document.querySelector(this.opts.customAnchor.current);
				if (el && el.contains(e.target)) return;
			}
		}
		this.root.handleClose();
	};
	onEscapeKeydown = (e) => {
		this.opts.onEscapeKeydown.current(e);
		if (e.defaultPrevented) return;
		this.root.handleClose();
	};
	get shouldRender() {
		return this.root.contentPresence.shouldRender;
	}
	get shouldTrapFocus() {
		if (this.root.openedViaHover && !this.root.hasInteractedWithContent) return false;
		return true;
	}
	#snippetProps = derived(() => ({ open: this.root.opts.open.current }));
	get snippetProps() {
		return this.#snippetProps();
	}
	set snippetProps($$value) {
		return this.#snippetProps($$value);
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		tabindex: -1,
		"data-state": getDataOpenClosed(this.root.opts.open.current),
		...getDataTransitionAttrs(this.root.contentPresence.transitionStatus),
		[popoverAttrs.content]: "",
		style: {
			pointerEvents: "auto",
			contain: "layout style"
		},
		onpointerdown: this.onpointerdown,
		onfocusin: this.onfocusin,
		onpointerenter: this.onpointerenter,
		onpointerleave: this.onpointerleave,
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
	popperProps = {
		onInteractOutside: this.onInteractOutside,
		onEscapeKeydown: this.onEscapeKeydown
	};
};
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/popover/components/popover-content.svelte
function Popover_content($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { child, children, ref = null, id = createId(uid), forceMount = false, onOpenAutoFocus = noop$2, onCloseAutoFocus = noop$2, onEscapeKeydown = noop$2, onInteractOutside = noop$2, trapFocus = true, preventScroll = false, customAnchor = null, style, $$slots, $$events, ...restProps } = $$props;
		const contentState = PopoverContentState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v),
			onInteractOutside: boxWith(() => onInteractOutside),
			onEscapeKeydown: boxWith(() => onEscapeKeydown),
			customAnchor: boxWith(() => customAnchor)
		});
		const mergedProps = derived(() => mergeProps(restProps, contentState.props));
		const effectiveTrapFocus = derived(() => trapFocus && contentState.shouldTrapFocus);
		function handleOpenAutoFocus(e) {
			if (!contentState.shouldTrapFocus) e.preventDefault();
			onOpenAutoFocus(e);
		}
		if (forceMount) {
			$$renderer.push("<!--[0-->");
			{
				function popper($$renderer, { props, wrapperProps }) {
					const finalProps = mergeProps(props, { style: getFloatingContentCSSVars("popover") }, { style });
					if (child) {
						$$renderer.push("<!--[0-->");
						child($$renderer, {
							props: finalProps,
							wrapperProps,
							...contentState.snippetProps
						});
						$$renderer.push(`<!---->`);
					} else {
						$$renderer.push("<!--[-1-->");
						$$renderer.push(`<div${attributes({ ...wrapperProps })}><div${attributes({ ...finalProps })}>`);
						children?.($$renderer);
						$$renderer.push(`<!----></div></div>`);
					}
					$$renderer.push(`<!--]-->`);
				}
				Popper_layer_force_mount($$renderer, spread_props([
					mergedProps(),
					contentState.popperProps,
					{
						ref: contentState.opts.ref,
						enabled: contentState.root.opts.open.current,
						id,
						trapFocus: effectiveTrapFocus(),
						preventScroll,
						loop: true,
						forceMount: true,
						customAnchor,
						onOpenAutoFocus: handleOpenAutoFocus,
						onCloseAutoFocus,
						shouldRender: contentState.shouldRender,
						popper,
						$$slots: { popper: true }
					}
				]));
			}
		} else if (!forceMount) {
			$$renderer.push("<!--[1-->");
			{
				function popper($$renderer, { props, wrapperProps }) {
					const finalProps = mergeProps(props, { style: getFloatingContentCSSVars("popover") }, { style });
					if (child) {
						$$renderer.push("<!--[0-->");
						child($$renderer, {
							props: finalProps,
							wrapperProps,
							...contentState.snippetProps
						});
						$$renderer.push(`<!---->`);
					} else {
						$$renderer.push("<!--[-1-->");
						$$renderer.push(`<div${attributes({ ...wrapperProps })}><div${attributes({ ...finalProps })}>`);
						children?.($$renderer);
						$$renderer.push(`<!----></div></div>`);
					}
					$$renderer.push(`<!--]-->`);
				}
				Popper_layer($$renderer, spread_props([
					mergedProps(),
					contentState.popperProps,
					{
						ref: contentState.opts.ref,
						open: contentState.root.opts.open.current,
						id,
						trapFocus: effectiveTrapFocus(),
						preventScroll,
						loop: true,
						forceMount: false,
						customAnchor,
						onOpenAutoFocus: handleOpenAutoFocus,
						onCloseAutoFocus,
						shouldRender: contentState.shouldRender,
						popper,
						$$slots: { popper: true }
					}
				]));
			}
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/popover/components/popover-trigger.svelte
function Popover_trigger($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { children, child, id = createId(uid), ref = null, type = "button", disabled = false, openOnHover = false, openDelay = 700, closeDelay = 300, $$slots, $$events, ...restProps } = $$props;
		const triggerState = PopoverTriggerState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v),
			disabled: boxWith(() => Boolean(disabled)),
			openOnHover: boxWith(() => openOnHover),
			openDelay: boxWith(() => openDelay),
			closeDelay: boxWith(() => closeDelay)
		});
		const mergedProps = derived(() => mergeProps(restProps, triggerState.props, { type }));
		Floating_layer_anchor($$renderer, {
			id,
			ref: triggerState.opts.ref,
			children: ($$renderer) => {
				if (child) {
					$$renderer.push("<!--[0-->");
					child($$renderer, { props: mergedProps() });
					$$renderer.push(`<!---->`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<button${attributes({ ...mergedProps() })}>`);
					children?.($$renderer);
					$$renderer.push(`<!----></button>`);
				}
				$$renderer.push(`<!--]-->`);
			}});
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/dialog/components/dialog.svelte
function Dialog($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { open = false, onOpenChange = noop$2, onOpenChangeComplete = noop$2, children } = $$props;
		DialogRootState.create({
			variant: boxWith(() => "dialog"),
			open: boxWith(() => open, (v) => {
				open = v;
				onOpenChange(v);
			}),
			onOpenChangeComplete: boxWith(() => onOpenChangeComplete)
		});
		children?.($$renderer);
		$$renderer.push(`<!---->`);
		bind_props($$props, { open });
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/dialog/components/dialog-close.svelte
function Dialog_close($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { children, child, id = createId(uid), ref = null, disabled = false, $$slots, $$events, ...restProps } = $$props;
		const closeState = DialogCloseState.create({
			variant: boxWith(() => "close"),
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v),
			disabled: boxWith(() => Boolean(disabled))
		});
		const mergedProps = derived(() => mergeProps(restProps, closeState.props));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, { props: mergedProps() });
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<button${attributes({ ...mergedProps() })}>`);
			children?.($$renderer);
			$$renderer.push(`<!----></button>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/dialog/components/dialog-content.svelte
function Dialog_content($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { id = createId(uid), children, child, ref = null, forceMount = false, onCloseAutoFocus = noop$2, onOpenAutoFocus = noop$2, onEscapeKeydown = noop$2, onInteractOutside = noop$2, trapFocus = true, preventScroll = true, restoreScrollDelay = null, $$slots, $$events, ...restProps } = $$props;
		const contentState = DialogContentState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v)
		});
		const mergedProps = derived(() => mergeProps(restProps, contentState.props));
		if (contentState.shouldRender || forceMount) {
			$$renderer.push("<!--[0-->");
			{
				function focusScope($$renderer, { props: focusScopeProps }) {
					Escape_layer($$renderer, spread_props([mergedProps(), {
						enabled: contentState.root.opts.open.current,
						ref: contentState.opts.ref,
						onEscapeKeydown: (e) => {
							onEscapeKeydown(e);
							if (e.defaultPrevented) return;
							contentState.root.handleClose();
						},
						children: ($$renderer) => {
							Dismissible_layer($$renderer, spread_props([mergedProps(), {
								ref: contentState.opts.ref,
								enabled: contentState.root.opts.open.current,
								onInteractOutside: (e) => {
									onInteractOutside(e);
									if (e.defaultPrevented) return;
									contentState.root.handleClose();
								},
								children: ($$renderer) => {
									Text_selection_layer($$renderer, spread_props([mergedProps(), {
										ref: contentState.opts.ref,
										enabled: contentState.root.opts.open.current,
										children: ($$renderer) => {
											if (child) {
												$$renderer.push("<!--[0-->");
												if (contentState.root.opts.open.current) {
													$$renderer.push("<!--[0-->");
													Scroll_lock($$renderer, {
														preventScroll,
														restoreScrollDelay
													});
												} else $$renderer.push("<!--[-1-->");
												$$renderer.push(`<!--]--> `);
												child($$renderer, {
													props: mergeProps(mergedProps(), focusScopeProps),
													...contentState.snippetProps
												});
												$$renderer.push(`<!---->`);
											} else {
												$$renderer.push("<!--[-1-->");
												Scroll_lock($$renderer, { preventScroll });
												$$renderer.push(`<!----> <div${attributes({ ...mergeProps(mergedProps(), focusScopeProps) })}>`);
												children?.($$renderer);
												$$renderer.push(`<!----></div>`);
											}
											$$renderer.push(`<!--]-->`);
										},
										$$slots: { default: true }
									}]));
								},
								$$slots: { default: true }
							}]));
						},
						$$slots: { default: true }
					}]));
				}
				Focus_scope($$renderer, {
					ref: contentState.opts.ref,
					loop: true,
					trapFocus,
					enabled: contentState.root.opts.open.current,
					onOpenAutoFocus,
					onCloseAutoFocus,
					focusScope});
			}
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/menu/components/menu.svelte
function Menu($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { open = false, dir = "ltr", onOpenChange = noop$2, onOpenChangeComplete = noop$2, _internal_variant: variant = "dropdown-menu", _internal_should_skip_exit_animation: shouldSkipExitAnimation = void 0, children } = $$props;
		const root = MenuRootState.create({
			variant: boxWith(() => variant),
			dir: boxWith(() => dir),
			onClose: () => {
				open = false;
				onOpenChange(false);
			},
			shouldSkipExitAnimation: () => shouldSkipExitAnimation?.() ?? false
		});
		MenuMenuState.create({
			open: boxWith(() => open, (v) => {
				open = v;
				onOpenChange(v);
			}),
			onOpenChangeComplete: boxWith(() => onOpenChangeComplete)
		}, root);
		Floating_layer($$renderer, {
			children: ($$renderer) => {
				children?.($$renderer);
				$$renderer.push(`<!---->`);
			}});
		bind_props($$props, { open });
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/dropdown-menu/components/dropdown-menu-content.svelte
function Dropdown_menu_content($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { id = createId(uid), child, children, ref = null, loop = true, onInteractOutside = noop$2, onEscapeKeydown = noop$2, onCloseAutoFocus = noop$2, forceMount = false, trapFocus = false, style, $$slots, $$events, ...restProps } = $$props;
		const contentState = MenuContentState.create({
			id: boxWith(() => id),
			loop: boxWith(() => loop),
			ref: boxWith(() => ref, (v) => ref = v),
			onCloseAutoFocus: boxWith(() => onCloseAutoFocus)
		});
		const mergedProps = derived(() => mergeProps(restProps, contentState.props));
		function handleInteractOutside(e) {
			contentState.handleInteractOutside(e);
			if (e.defaultPrevented) return;
			onInteractOutside(e);
			if (e.defaultPrevented) return;
			if (e.target && e.target instanceof Element) {
				const subContentSelector = `[${contentState.parentMenu.root.getBitsAttr("sub-content")}]`;
				if (e.target.closest(subContentSelector)) return;
			}
			contentState.parentMenu.onClose();
		}
		function handleEscapeKeydown(e) {
			onEscapeKeydown(e);
			if (e.defaultPrevented) return;
			contentState.parentMenu.onClose();
		}
		if (forceMount) {
			$$renderer.push("<!--[0-->");
			{
				function popper($$renderer, { props, wrapperProps }) {
					const finalProps = mergeProps(props, { style: getFloatingContentCSSVars("dropdown-menu") }, { style });
					if (child) {
						$$renderer.push("<!--[0-->");
						child($$renderer, {
							props: finalProps,
							wrapperProps,
							...contentState.snippetProps
						});
						$$renderer.push(`<!---->`);
					} else {
						$$renderer.push("<!--[-1-->");
						$$renderer.push(`<div${attributes({ ...wrapperProps })}><div${attributes({ ...finalProps })}>`);
						children?.($$renderer);
						$$renderer.push(`<!----></div></div>`);
					}
					$$renderer.push(`<!--]-->`);
				}
				Popper_layer_force_mount($$renderer, spread_props([
					mergedProps(),
					contentState.popperProps,
					{
						ref: contentState.opts.ref,
						enabled: contentState.parentMenu.opts.open.current,
						onInteractOutside: handleInteractOutside,
						onEscapeKeydown: handleEscapeKeydown,
						trapFocus,
						loop,
						forceMount: true,
						id,
						shouldRender: contentState.shouldRender,
						popper,
						$$slots: { popper: true }
					}
				]));
			}
		} else if (!forceMount) {
			$$renderer.push("<!--[1-->");
			{
				function popper($$renderer, { props, wrapperProps }) {
					const finalProps = mergeProps(props, { style: getFloatingContentCSSVars("dropdown-menu") }, { style });
					if (child) {
						$$renderer.push("<!--[0-->");
						child($$renderer, {
							props: finalProps,
							wrapperProps,
							...contentState.snippetProps
						});
						$$renderer.push(`<!---->`);
					} else {
						$$renderer.push("<!--[-1-->");
						$$renderer.push(`<div${attributes({ ...wrapperProps })}><div${attributes({ ...finalProps })}>`);
						children?.($$renderer);
						$$renderer.push(`<!----></div></div>`);
					}
					$$renderer.push(`<!--]-->`);
				}
				Popper_layer($$renderer, spread_props([
					mergedProps(),
					contentState.popperProps,
					{
						ref: contentState.opts.ref,
						open: contentState.parentMenu.opts.open.current,
						onInteractOutside: handleInteractOutside,
						onEscapeKeydown: handleEscapeKeydown,
						trapFocus,
						loop,
						forceMount: false,
						id,
						shouldRender: contentState.shouldRender,
						popper,
						$$slots: { popper: true }
					}
				]));
			}
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/menu/components/menu-trigger.svelte
function Menu_trigger($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { id = createId(uid), ref = null, child, children, disabled = false, type = "button", $$slots, $$events, ...restProps } = $$props;
		const triggerState = DropdownMenuTriggerState.create({
			id: boxWith(() => id),
			disabled: boxWith(() => disabled ?? false),
			ref: boxWith(() => ref, (v) => ref = v)
		});
		const mergedProps = derived(() => mergeProps(restProps, triggerState.props, { type }));
		Floating_layer_anchor($$renderer, {
			id,
			ref: triggerState.opts.ref,
			children: ($$renderer) => {
				if (child) {
					$$renderer.push("<!--[0-->");
					child($$renderer, { props: mergedProps() });
					$$renderer.push(`<!---->`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<button${attributes({ ...mergedProps() })}>`);
					children?.($$renderer);
					$$renderer.push(`<!----></button>`);
				}
				$$renderer.push(`<!--]-->`);
			}});
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/label/label.svelte.js
var labelAttrs = createBitsAttrs({
	component: "label",
	parts: ["root"]
});
var LabelRootState = class LabelRootState {
	static create(opts) {
		return new LabelRootState(opts);
	}
	opts;
	attachment;
	constructor(opts) {
		this.opts = opts;
		this.attachment = attachRef(this.opts.ref);
		this.onmousedown = this.onmousedown.bind(this);
	}
	onmousedown(e) {
		if (e.detail > 1) e.preventDefault();
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		[labelAttrs.root]: "",
		onmousedown: this.onmousedown,
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/label/components/label.svelte
function Label($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { children, child, id = createId(uid), ref = null, for: forProp, $$slots, $$events, ...restProps } = $$props;
		const rootState = LabelRootState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v)
		});
		const mergedProps = derived(() => mergeProps(restProps, rootState.props, { for: forProp }));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, { props: mergedProps() });
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<label${attributes({
				...mergedProps(),
				for: forProp
			})}>`);
			children?.($$renderer);
			$$renderer.push(`<!----></label>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/internal/svelte-resize-observer.svelte.js
var SvelteResizeObserver = class {
	#node;
	#onResize;
	constructor(node, onResize) {
		this.#node = node;
		this.#onResize = onResize;
		this.handler = this.handler.bind(this);
	}
	handler() {
		let rAF = 0;
		const _node = this.#node();
		if (!_node) return;
		const resizeObserver = new ResizeObserver(() => {
			cancelAnimationFrame(rAF);
			rAF = window.requestAnimationFrame(this.#onResize);
		});
		resizeObserver.observe(_node);
		return () => {
			window.cancelAnimationFrame(rAF);
			resizeObserver.unobserve(_node);
		};
	}
};
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/utilities/presence-layer/presence.svelte.js
var Presence = class {
	opts;
	present;
	#afterAnimations;
	#isPresent = false;
	#hasMounted = false;
	#transitionStatus = void 0;
	#transitionFrame = null;
	constructor(opts) {
		this.opts = opts;
		this.present = this.opts.open;
		this.#isPresent = opts.open.current;
		this.#afterAnimations = new AnimationsComplete({
			ref: this.opts.ref,
			afterTick: this.opts.open
		});
		watch(() => this.present.current, (isOpen) => {
			if (!this.#hasMounted) {
				this.#hasMounted = true;
				return;
			}
			this.#clearTransitionFrame();
			if (isOpen) this.#isPresent = true;
			this.#transitionStatus = isOpen ? "starting" : "ending";
			if (isOpen) this.#transitionFrame = window.requestAnimationFrame(() => {
				this.#transitionFrame = null;
				if (this.present.current) this.#transitionStatus = void 0;
			});
			this.#afterAnimations.run(() => {
				if (isOpen !== this.present.current) return;
				if (!isOpen) this.#isPresent = false;
				this.#transitionStatus = void 0;
			});
		});
	}
	#_isPresent = derived(() => {
		return this.#isPresent;
	});
	get isPresent() {
		return this.#_isPresent();
	}
	set isPresent($$value) {
		return this.#_isPresent($$value);
	}
	get transitionStatus() {
		return this.#transitionStatus;
	}
	#clearTransitionFrame() {
		if (this.#transitionFrame === null) return;
		window.cancelAnimationFrame(this.#transitionFrame);
		this.#transitionFrame = null;
	}
};
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/utilities/presence-layer/presence-layer.svelte
function Presence_layer($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { open, forceMount, presence, ref } = $$props;
		const presenceState = new Presence({
			open: boxWith(() => open),
			ref
		});
		if (forceMount || open || presenceState.isPresent) {
			$$renderer.push("<!--[0-->");
			presence?.($$renderer, {
				present: presenceState.isPresent,
				transitionStatus: presenceState.transitionStatus
			});
			$$renderer.push(`<!---->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/popover/components/popover.svelte
function Popover($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { open = false, onOpenChange = noop$2, onOpenChangeComplete = noop$2, children } = $$props;
		PopoverRootState.create({
			open: boxWith(() => open, (v) => {
				open = v;
				onOpenChange(v);
			}),
			onOpenChangeComplete: boxWith(() => onOpenChangeComplete)
		});
		Floating_layer($$renderer, {
			children: ($$renderer) => {
				children?.($$renderer);
				$$renderer.push(`<!---->`);
			}});
		bind_props($$props, { open });
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/radio-group/radio-group.svelte.js
var radioGroupAttrs = createBitsAttrs({
	component: "radio-group",
	parts: ["root", "item"]
});
var RadioGroupRootContext = new Context("RadioGroup.Root");
var RadioGroupRootState = class RadioGroupRootState {
	static create(opts) {
		return RadioGroupRootContext.set(new RadioGroupRootState(opts));
	}
	opts;
	#hasValue = derived(() => this.opts.value.current !== "");
	get hasValue() {
		return this.#hasValue();
	}
	set hasValue($$value) {
		return this.#hasValue($$value);
	}
	rovingFocusGroup;
	attachment;
	constructor(opts) {
		this.opts = opts;
		this.attachment = attachRef(this.opts.ref);
		this.rovingFocusGroup = new RovingFocusGroup({
			rootNode: this.opts.ref,
			candidateAttr: radioGroupAttrs.item,
			loop: this.opts.loop,
			orientation: this.opts.orientation
		});
	}
	isChecked(value) {
		return this.opts.value.current === value;
	}
	setValue(value) {
		this.opts.value.current = value;
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		role: "radiogroup",
		"aria-required": boolToStr(this.opts.required.current),
		"aria-disabled": boolToStr(this.opts.disabled.current),
		"aria-readonly": this.opts.readonly.current ? "true" : void 0,
		"data-disabled": boolToEmptyStrOrUndef(this.opts.disabled.current),
		"data-readonly": boolToEmptyStrOrUndef(this.opts.readonly.current),
		"data-orientation": this.opts.orientation.current,
		[radioGroupAttrs.root]: "",
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var RadioGroupItemState = class RadioGroupItemState {
	static create(opts) {
		return new RadioGroupItemState(opts, RadioGroupRootContext.get());
	}
	opts;
	root;
	attachment;
	#checked = derived(() => this.root.opts.value.current === this.opts.value.current);
	get checked() {
		return this.#checked();
	}
	set checked($$value) {
		return this.#checked($$value);
	}
	#isDisabled = derived(() => this.opts.disabled.current || this.root.opts.disabled.current);
	#isReadonly = derived(() => this.root.opts.readonly.current);
	#isChecked = derived(() => this.root.isChecked(this.opts.value.current));
	#tabIndex = -1;
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref);
		if (this.opts.value.current === this.root.opts.value.current) {
			this.root.rovingFocusGroup.setCurrentTabStopId(this.opts.id.current);
			this.#tabIndex = 0;
		} else if (!this.root.opts.value.current) this.#tabIndex = 0;
		watch([() => this.opts.value.current, () => this.root.opts.value.current], () => {
			if (this.opts.value.current === this.root.opts.value.current) {
				this.root.rovingFocusGroup.setCurrentTabStopId(this.opts.id.current);
				this.#tabIndex = 0;
			}
		});
		this.onclick = this.onclick.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
		this.onfocus = this.onfocus.bind(this);
	}
	onclick(_) {
		if (this.opts.disabled.current || this.#isReadonly()) return;
		this.root.setValue(this.opts.value.current);
	}
	onfocus(_) {
		if (!this.root.hasValue || this.#isReadonly()) return;
		this.root.setValue(this.opts.value.current);
	}
	onkeydown(e) {
		if (this.#isDisabled()) return;
		if (e.key === " ") {
			e.preventDefault();
			if (!this.#isReadonly()) this.root.setValue(this.opts.value.current);
			return;
		}
		this.root.rovingFocusGroup.handleKeydown(this.opts.ref.current, e, true);
	}
	#snippetProps = derived(() => ({ checked: this.#isChecked() }));
	get snippetProps() {
		return this.#snippetProps();
	}
	set snippetProps($$value) {
		return this.#snippetProps($$value);
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		disabled: this.#isDisabled() ? true : void 0,
		"data-value": this.opts.value.current,
		"data-orientation": this.root.opts.orientation.current,
		"data-disabled": boolToEmptyStrOrUndef(this.#isDisabled()),
		"data-readonly": boolToEmptyStrOrUndef(this.#isReadonly()),
		"data-state": this.#isChecked() ? "checked" : "unchecked",
		"aria-checked": getAriaChecked(this.#isChecked()),
		[radioGroupAttrs.item]: "",
		type: "button",
		role: "radio",
		tabindex: this.#tabIndex,
		onkeydown: this.onkeydown,
		onfocus: this.onfocus,
		onclick: this.onclick,
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var RadioGroupInputState = class RadioGroupInputState {
	static create() {
		return new RadioGroupInputState(RadioGroupRootContext.get());
	}
	root;
	#shouldRender = derived(() => this.root.opts.name.current !== void 0);
	get shouldRender() {
		return this.#shouldRender();
	}
	set shouldRender($$value) {
		return this.#shouldRender($$value);
	}
	constructor(root) {
		this.root = root;
		this.onfocus = this.onfocus.bind(this);
	}
	onfocus(_) {
		this.root.rovingFocusGroup.focusCurrentTabStop();
	}
	#props = derived(() => ({
		name: this.root.opts.name.current,
		value: this.root.opts.value.current,
		required: this.root.opts.required.current,
		disabled: this.root.opts.disabled.current,
		onfocus: this.onfocus
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/radio-group/components/radio-group-input.svelte
function Radio_group_input($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const inputState = RadioGroupInputState.create();
		if (inputState.shouldRender) {
			$$renderer.push("<!--[0-->");
			Hidden_input($$renderer, spread_props([inputState.props]));
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/radio-group/components/radio-group.svelte
function Radio_group($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { disabled = false, children, child, value = "", ref = null, orientation = "vertical", loop = true, name = void 0, required = false, readonly = false, id = createId(uid), onValueChange = noop$2, $$slots, $$events, ...restProps } = $$props;
		const rootState = RadioGroupRootState.create({
			orientation: boxWith(() => orientation),
			disabled: boxWith(() => disabled),
			loop: boxWith(() => loop),
			name: boxWith(() => name),
			required: boxWith(() => required),
			readonly: boxWith(() => readonly),
			id: boxWith(() => id),
			value: boxWith(() => value, (v) => {
				if (v === value) return;
				value = v;
				onValueChange?.(v);
			}),
			ref: boxWith(() => ref, (v) => ref = v)
		});
		const mergedProps = derived(() => mergeProps(restProps, rootState.props));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, { props: mergedProps() });
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div${attributes({ ...mergedProps() })}>`);
			children?.($$renderer);
			$$renderer.push(`<!----></div>`);
		}
		$$renderer.push(`<!--]--> `);
		Radio_group_input($$renderer);
		$$renderer.push(`<!---->`);
		bind_props($$props, {
			value,
			ref
		});
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/radio-group/components/radio-group-item.svelte
function Radio_group_item($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { id = createId(uid), children, child, value, disabled = false, ref = null, $$slots, $$events, ...restProps } = $$props;
		const itemState = RadioGroupItemState.create({
			value: boxWith(() => value),
			disabled: boxWith(() => disabled ?? false),
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v)
		});
		const mergedProps = derived(() => mergeProps(restProps, itemState.props));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, {
				props: mergedProps(),
				...itemState.snippetProps
			});
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<button${attributes({ ...mergedProps() })}>`);
			children?.($$renderer, itemState.snippetProps);
			$$renderer.push(`<!----></button>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/internal/clamp.js
/**
* Clamps a number between a minimum and maximum value.
*/
function clamp(n, min, max) {
	return Math.min(max, Math.max(min, n));
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/internal/state-machine.js
var StateMachine = class {
	state;
	#machine;
	constructor(initialState, machine) {
		this.state = simpleBox(initialState);
		this.#machine = machine;
		this.dispatch = this.dispatch.bind(this);
	}
	#reducer(event) {
		return this.#machine[this.state.current][event] ?? this.state.current;
	}
	dispatch(event) {
		this.state.current = this.#reducer(event);
	}
};
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/scroll-area/scroll-area.svelte.js
var scrollAreaAttrs = createBitsAttrs({
	component: "scroll-area",
	parts: [
		"root",
		"viewport",
		"corner",
		"thumb",
		"scrollbar"
	]
});
var ScrollAreaRootContext = new Context("ScrollArea.Root");
var ScrollAreaScrollbarContext = new Context("ScrollArea.Scrollbar");
var ScrollAreaScrollbarVisibleContext = new Context("ScrollArea.ScrollbarVisible");
var ScrollAreaScrollbarAxisContext = new Context("ScrollArea.ScrollbarAxis");
var ScrollAreaScrollbarSharedContext = new Context("ScrollArea.ScrollbarShared");
var ScrollAreaRootState = class ScrollAreaRootState {
	static create(opts) {
		return ScrollAreaRootContext.set(new ScrollAreaRootState(opts));
	}
	opts;
	attachment;
	scrollAreaNode = null;
	viewportNode = null;
	contentNode = null;
	scrollbarXNode = null;
	scrollbarYNode = null;
	cornerWidth = 0;
	cornerHeight = 0;
	scrollbarXEnabled = false;
	scrollbarYEnabled = false;
	domContext;
	constructor(opts) {
		this.opts = opts;
		this.attachment = attachRef(opts.ref, (v) => this.scrollAreaNode = v);
		this.domContext = new DOMContext(opts.ref);
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		dir: this.opts.dir.current,
		style: {
			position: "relative",
			"--bits-scroll-area-corner-height": `${this.cornerHeight}px`,
			"--bits-scroll-area-corner-width": `${this.cornerWidth}px`
		},
		[scrollAreaAttrs.root]: "",
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var ScrollAreaViewportState = class ScrollAreaViewportState {
	static create(opts) {
		return new ScrollAreaViewportState(opts, ScrollAreaRootContext.get());
	}
	opts;
	root;
	attachment;
	#contentId = simpleBox(useId());
	#contentRef = simpleBox(null);
	contentAttachment = attachRef(this.#contentRef, (v) => this.root.contentNode = v);
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(opts.ref, (v) => this.root.viewportNode = v);
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		style: {
			overflowX: this.root.scrollbarXEnabled ? "scroll" : "hidden",
			overflowY: this.root.scrollbarYEnabled ? "scroll" : "hidden"
		},
		[scrollAreaAttrs.viewport]: "",
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
	#contentProps = derived(() => ({
		id: this.#contentId.current,
		"data-scroll-area-content": "",
		style: { minWidth: this.root.scrollbarXEnabled ? "fit-content" : void 0 },
		...this.contentAttachment
	}));
	get contentProps() {
		return this.#contentProps();
	}
	set contentProps($$value) {
		return this.#contentProps($$value);
	}
};
var ScrollAreaScrollbarState = class ScrollAreaScrollbarState {
	static create(opts) {
		return ScrollAreaScrollbarContext.set(new ScrollAreaScrollbarState(opts, ScrollAreaRootContext.get()));
	}
	opts;
	root;
	#isHorizontal = derived(() => this.opts.orientation.current === "horizontal");
	get isHorizontal() {
		return this.#isHorizontal();
	}
	set isHorizontal($$value) {
		return this.#isHorizontal($$value);
	}
	hasThumb = false;
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		watch(() => this.isHorizontal, (isHorizontal) => {
			if (isHorizontal) {
				this.root.scrollbarXEnabled = true;
				return () => {
					this.root.scrollbarXEnabled = false;
				};
			} else {
				this.root.scrollbarYEnabled = true;
				return () => {
					this.root.scrollbarYEnabled = false;
				};
			}
		});
	}
};
var ScrollAreaScrollbarHoverState = class ScrollAreaScrollbarHoverState {
	static create() {
		return new ScrollAreaScrollbarHoverState(ScrollAreaScrollbarContext.get());
	}
	scrollbar;
	root;
	isVisible = false;
	constructor(scrollbar) {
		this.scrollbar = scrollbar;
		this.root = scrollbar.root;
	}
	#props = derived(() => ({ "data-state": this.isVisible ? "visible" : "hidden" }));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var ScrollAreaScrollbarScrollState = class ScrollAreaScrollbarScrollState {
	static create() {
		return new ScrollAreaScrollbarScrollState(ScrollAreaScrollbarContext.get());
	}
	scrollbar;
	root;
	machine = new StateMachine("hidden", {
		hidden: { SCROLL: "scrolling" },
		scrolling: {
			SCROLL_END: "idle",
			POINTER_ENTER: "interacting"
		},
		interacting: {
			SCROLL: "interacting",
			POINTER_LEAVE: "idle"
		},
		idle: {
			HIDE: "hidden",
			SCROLL: "scrolling",
			POINTER_ENTER: "interacting"
		}
	});
	#isHidden = derived(() => this.machine.state.current === "hidden");
	get isHidden() {
		return this.#isHidden();
	}
	set isHidden($$value) {
		return this.#isHidden($$value);
	}
	constructor(scrollbar) {
		this.scrollbar = scrollbar;
		this.root = scrollbar.root;
		useDebounce(() => this.machine.dispatch("SCROLL_END"), 100);
		this.onpointerenter = this.onpointerenter.bind(this);
		this.onpointerleave = this.onpointerleave.bind(this);
	}
	onpointerenter(_) {
		this.machine.dispatch("POINTER_ENTER");
	}
	onpointerleave(_) {
		this.machine.dispatch("POINTER_LEAVE");
	}
	#props = derived(() => ({
		"data-state": this.machine.state.current === "hidden" ? "hidden" : "visible",
		onpointerenter: this.onpointerenter,
		onpointerleave: this.onpointerleave
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var ScrollAreaScrollbarAutoState = class ScrollAreaScrollbarAutoState {
	static create() {
		return new ScrollAreaScrollbarAutoState(ScrollAreaScrollbarContext.get());
	}
	scrollbar;
	root;
	isVisible = false;
	constructor(scrollbar) {
		this.scrollbar = scrollbar;
		this.root = scrollbar.root;
		const handleResize = useDebounce(() => {
			const viewportNode = this.root.viewportNode;
			if (!viewportNode) return;
			const isOverflowX = viewportNode.offsetWidth < viewportNode.scrollWidth;
			const isOverflowY = viewportNode.offsetHeight < viewportNode.scrollHeight;
			this.isVisible = this.scrollbar.isHorizontal ? isOverflowX : isOverflowY;
		}, 10);
		new SvelteResizeObserver(() => this.root.viewportNode, handleResize);
		new SvelteResizeObserver(() => this.root.contentNode, handleResize);
	}
	#props = derived(() => ({ "data-state": this.isVisible ? "visible" : "hidden" }));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var ScrollAreaScrollbarVisibleState = class ScrollAreaScrollbarVisibleState {
	static create() {
		return ScrollAreaScrollbarVisibleContext.set(new ScrollAreaScrollbarVisibleState(ScrollAreaScrollbarContext.get()));
	}
	scrollbar;
	root;
	thumbNode = null;
	pointerOffset = 0;
	sizes = {
		content: 0,
		viewport: 0,
		scrollbar: {
			size: 0,
			paddingStart: 0,
			paddingEnd: 0
		}
	};
	#thumbRatio = derived(() => getThumbRatio(this.sizes.viewport, this.sizes.content));
	get thumbRatio() {
		return this.#thumbRatio();
	}
	set thumbRatio($$value) {
		return this.#thumbRatio($$value);
	}
	#hasThumb = derived(() => Boolean(this.thumbRatio > 0 && this.thumbRatio < 1));
	get hasThumb() {
		return this.#hasThumb();
	}
	set hasThumb($$value) {
		return this.#hasThumb($$value);
	}
	prevTransformStyle = "";
	constructor(scrollbar) {
		this.scrollbar = scrollbar;
		this.root = scrollbar.root;
	}
	setSizes(sizes) {
		this.sizes = sizes;
	}
	getScrollPosition(pointerPos, dir) {
		return getScrollPositionFromPointer({
			pointerPos,
			pointerOffset: this.pointerOffset,
			sizes: this.sizes,
			dir
		});
	}
	onThumbPointerUp() {
		this.pointerOffset = 0;
	}
	onThumbPointerDown(pointerPos) {
		this.pointerOffset = pointerPos;
	}
	xOnThumbPositionChange() {
		if (!(this.root.viewportNode && this.thumbNode)) return;
		const scrollPos = this.root.viewportNode.scrollLeft;
		const transformStyle = `translate3d(${getThumbOffsetFromScroll({
			scrollPos,
			sizes: this.sizes,
			dir: this.root.opts.dir.current
		})}px, 0, 0)`;
		this.thumbNode.style.transform = transformStyle;
		this.prevTransformStyle = transformStyle;
	}
	xOnWheelScroll(scrollPos) {
		if (!this.root.viewportNode) return;
		this.root.viewportNode.scrollLeft = scrollPos;
	}
	xOnDragScroll(pointerPos) {
		if (!this.root.viewportNode) return;
		this.root.viewportNode.scrollLeft = this.getScrollPosition(pointerPos, this.root.opts.dir.current);
	}
	yOnThumbPositionChange() {
		if (!(this.root.viewportNode && this.thumbNode)) return;
		const scrollPos = this.root.viewportNode.scrollTop;
		const transformStyle = `translate3d(0, ${getThumbOffsetFromScroll({
			scrollPos,
			sizes: this.sizes
		})}px, 0)`;
		this.thumbNode.style.transform = transformStyle;
		this.prevTransformStyle = transformStyle;
	}
	yOnWheelScroll(scrollPos) {
		if (!this.root.viewportNode) return;
		this.root.viewportNode.scrollTop = scrollPos;
	}
	yOnDragScroll(pointerPos) {
		if (!this.root.viewportNode) return;
		this.root.viewportNode.scrollTop = this.getScrollPosition(pointerPos, this.root.opts.dir.current);
	}
};
var ScrollAreaScrollbarXState = class ScrollAreaScrollbarXState {
	static create(opts) {
		return ScrollAreaScrollbarAxisContext.set(new ScrollAreaScrollbarXState(opts, ScrollAreaScrollbarVisibleContext.get()));
	}
	opts;
	scrollbarVis;
	root;
	scrollbar;
	attachment;
	computedStyle;
	constructor(opts, scrollbarVis) {
		this.opts = opts;
		this.scrollbarVis = scrollbarVis;
		this.root = scrollbarVis.root;
		this.scrollbar = scrollbarVis.scrollbar;
		this.attachment = attachRef(this.scrollbar.opts.ref, (v) => this.root.scrollbarXNode = v);
	}
	onThumbPointerDown = (pointerPos) => {
		this.scrollbarVis.onThumbPointerDown(pointerPos.x);
	};
	onDragScroll = (pointerPos) => {
		this.scrollbarVis.xOnDragScroll(pointerPos.x);
	};
	onThumbPointerUp = () => {
		this.scrollbarVis.onThumbPointerUp();
	};
	onThumbPositionChange = () => {
		this.scrollbarVis.xOnThumbPositionChange();
	};
	onWheelScroll = (e, maxScrollPos) => {
		if (!this.root.viewportNode) return;
		const scrollPos = this.root.viewportNode.scrollLeft + e.deltaX;
		this.scrollbarVis.xOnWheelScroll(scrollPos);
		if (isScrollingWithinScrollbarBounds(scrollPos, maxScrollPos)) e.preventDefault();
	};
	onResize = () => {
		if (!(this.scrollbar.opts.ref.current && this.root.viewportNode && this.computedStyle)) return;
		this.scrollbarVis.setSizes({
			content: this.root.viewportNode.scrollWidth,
			viewport: this.root.viewportNode.offsetWidth,
			scrollbar: {
				size: this.scrollbar.opts.ref.current.clientWidth,
				paddingStart: toInt(this.computedStyle.paddingLeft),
				paddingEnd: toInt(this.computedStyle.paddingRight)
			}
		});
	};
	#thumbSize = derived(() => {
		return getThumbSize(this.scrollbarVis.sizes);
	});
	get thumbSize() {
		return this.#thumbSize();
	}
	set thumbSize($$value) {
		return this.#thumbSize($$value);
	}
	#props = derived(() => ({
		id: this.scrollbar.opts.id.current,
		"data-orientation": "horizontal",
		style: {
			bottom: 0,
			left: this.root.opts.dir.current === "rtl" ? "var(--bits-scroll-area-corner-width)" : 0,
			right: this.root.opts.dir.current === "ltr" ? "var(--bits-scroll-area-corner-width)" : 0,
			"--bits-scroll-area-thumb-width": `${this.thumbSize}px`
		},
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var ScrollAreaScrollbarYState = class ScrollAreaScrollbarYState {
	static create(opts) {
		return ScrollAreaScrollbarAxisContext.set(new ScrollAreaScrollbarYState(opts, ScrollAreaScrollbarVisibleContext.get()));
	}
	opts;
	scrollbarVis;
	root;
	scrollbar;
	attachment;
	computedStyle;
	constructor(opts, scrollbarVis) {
		this.opts = opts;
		this.scrollbarVis = scrollbarVis;
		this.root = scrollbarVis.root;
		this.scrollbar = scrollbarVis.scrollbar;
		this.attachment = attachRef(this.scrollbar.opts.ref, (v) => this.root.scrollbarYNode = v);
		this.onThumbPointerDown = this.onThumbPointerDown.bind(this);
		this.onDragScroll = this.onDragScroll.bind(this);
		this.onThumbPointerUp = this.onThumbPointerUp.bind(this);
		this.onThumbPositionChange = this.onThumbPositionChange.bind(this);
		this.onWheelScroll = this.onWheelScroll.bind(this);
		this.onResize = this.onResize.bind(this);
	}
	onThumbPointerDown(pointerPos) {
		this.scrollbarVis.onThumbPointerDown(pointerPos.y);
	}
	onDragScroll(pointerPos) {
		this.scrollbarVis.yOnDragScroll(pointerPos.y);
	}
	onThumbPointerUp() {
		this.scrollbarVis.onThumbPointerUp();
	}
	onThumbPositionChange() {
		this.scrollbarVis.yOnThumbPositionChange();
	}
	onWheelScroll(e, maxScrollPos) {
		if (!this.root.viewportNode) return;
		const scrollPos = this.root.viewportNode.scrollTop + e.deltaY;
		this.scrollbarVis.yOnWheelScroll(scrollPos);
		if (isScrollingWithinScrollbarBounds(scrollPos, maxScrollPos)) e.preventDefault();
	}
	onResize() {
		if (!(this.scrollbar.opts.ref.current && this.root.viewportNode && this.computedStyle)) return;
		this.scrollbarVis.setSizes({
			content: this.root.viewportNode.scrollHeight,
			viewport: this.root.viewportNode.offsetHeight,
			scrollbar: {
				size: this.scrollbar.opts.ref.current.clientHeight,
				paddingStart: toInt(this.computedStyle.paddingTop),
				paddingEnd: toInt(this.computedStyle.paddingBottom)
			}
		});
	}
	#thumbSize = derived(() => {
		return getThumbSize(this.scrollbarVis.sizes);
	});
	get thumbSize() {
		return this.#thumbSize();
	}
	set thumbSize($$value) {
		return this.#thumbSize($$value);
	}
	#props = derived(() => ({
		id: this.scrollbar.opts.id.current,
		"data-orientation": "vertical",
		style: {
			top: 0,
			right: this.root.opts.dir.current === "ltr" ? 0 : void 0,
			left: this.root.opts.dir.current === "rtl" ? 0 : void 0,
			bottom: "var(--bits-scroll-area-corner-height)",
			"--bits-scroll-area-thumb-height": `${this.thumbSize}px`
		},
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var ScrollAreaScrollbarSharedState = class ScrollAreaScrollbarSharedState {
	static create() {
		return ScrollAreaScrollbarSharedContext.set(new ScrollAreaScrollbarSharedState(ScrollAreaScrollbarAxisContext.get()));
	}
	scrollbarState;
	root;
	scrollbarVis;
	scrollbar;
	rect = null;
	prevWebkitUserSelect = "";
	handleResize;
	handleThumbPositionChange;
	handleWheelScroll;
	handleThumbPointerDown;
	handleThumbPointerUp;
	#maxScrollPos = derived(() => this.scrollbarVis.sizes.content - this.scrollbarVis.sizes.viewport);
	get maxScrollPos() {
		return this.#maxScrollPos();
	}
	set maxScrollPos($$value) {
		return this.#maxScrollPos($$value);
	}
	constructor(scrollbarState) {
		this.scrollbarState = scrollbarState;
		this.root = scrollbarState.root;
		this.scrollbarVis = scrollbarState.scrollbarVis;
		this.scrollbar = scrollbarState.scrollbarVis.scrollbar;
		this.handleResize = useDebounce(() => this.scrollbarState.onResize(), 10);
		this.handleThumbPositionChange = this.scrollbarState.onThumbPositionChange;
		this.handleWheelScroll = this.scrollbarState.onWheelScroll;
		this.handleThumbPointerDown = this.scrollbarState.onThumbPointerDown;
		this.handleThumbPointerUp = this.scrollbarState.onThumbPointerUp;
		new SvelteResizeObserver(() => this.scrollbar.opts.ref.current, this.handleResize);
		new SvelteResizeObserver(() => this.root.contentNode, this.handleResize);
		this.onpointerdown = this.onpointerdown.bind(this);
		this.onpointermove = this.onpointermove.bind(this);
		this.onpointerup = this.onpointerup.bind(this);
		this.onlostpointercapture = this.onlostpointercapture.bind(this);
	}
	handleDragScroll(e) {
		if (!this.rect) return;
		const x = e.clientX - this.rect.left;
		const y = e.clientY - this.rect.top;
		this.scrollbarState.onDragScroll({
			x,
			y
		});
	}
	#cleanupPointerState() {
		if (this.rect === null) return;
		this.root.domContext.getDocument().body.style.webkitUserSelect = this.prevWebkitUserSelect;
		if (this.root.viewportNode) this.root.viewportNode.style.scrollBehavior = "";
		this.rect = null;
	}
	onpointerdown(e) {
		if (e.button !== 0) return;
		e.target.setPointerCapture(e.pointerId);
		this.rect = this.scrollbar.opts.ref.current?.getBoundingClientRect() ?? null;
		this.prevWebkitUserSelect = this.root.domContext.getDocument().body.style.webkitUserSelect;
		this.root.domContext.getDocument().body.style.webkitUserSelect = "none";
		if (this.root.viewportNode) this.root.viewportNode.style.scrollBehavior = "auto";
		this.handleDragScroll(e);
	}
	onpointermove(e) {
		this.handleDragScroll(e);
	}
	onpointerup(e) {
		const target = e.target;
		if (target.hasPointerCapture(e.pointerId)) target.releasePointerCapture(e.pointerId);
		this.#cleanupPointerState();
	}
	onlostpointercapture(_) {
		this.#cleanupPointerState();
	}
	#props = derived(() => mergeProps({
		...this.scrollbarState.props,
		style: {
			position: "absolute",
			...this.scrollbarState.props.style
		},
		[scrollAreaAttrs.scrollbar]: "",
		onpointerdown: this.onpointerdown,
		onpointermove: this.onpointermove,
		onpointerup: this.onpointerup,
		onlostpointercapture: this.onlostpointercapture
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var ScrollAreaThumbImplState = class ScrollAreaThumbImplState {
	static create(opts) {
		return new ScrollAreaThumbImplState(opts, ScrollAreaScrollbarSharedContext.get());
	}
	opts;
	scrollbarState;
	attachment;
	#root;
	#removeUnlinkedScrollListener;
	#debounceScrollEnd = useDebounce(() => {
		if (this.#removeUnlinkedScrollListener) {
			this.#removeUnlinkedScrollListener();
			this.#removeUnlinkedScrollListener = void 0;
		}
	}, 100);
	constructor(opts, scrollbarState) {
		this.opts = opts;
		this.scrollbarState = scrollbarState;
		this.#root = scrollbarState.root;
		this.attachment = attachRef(this.opts.ref, (v) => this.scrollbarState.scrollbarVis.thumbNode = v);
		this.onpointerdowncapture = this.onpointerdowncapture.bind(this);
		this.onpointerup = this.onpointerup.bind(this);
	}
	onpointerdowncapture(e) {
		const thumb = e.target;
		if (!thumb) return;
		const thumbRect = thumb.getBoundingClientRect();
		const x = e.clientX - thumbRect.left;
		const y = e.clientY - thumbRect.top;
		this.scrollbarState.handleThumbPointerDown({
			x,
			y
		});
	}
	onpointerup(_) {
		this.scrollbarState.handleThumbPointerUp();
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		"data-state": this.scrollbarState.scrollbarVis.hasThumb ? "visible" : "hidden",
		style: {
			width: "var(--bits-scroll-area-thumb-width)",
			height: "var(--bits-scroll-area-thumb-height)",
			transform: this.scrollbarState.scrollbarVis.prevTransformStyle
		},
		onpointerdowncapture: this.onpointerdowncapture,
		onpointerup: this.onpointerup,
		[scrollAreaAttrs.thumb]: "",
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var ScrollAreaCornerImplState = class ScrollAreaCornerImplState {
	static create(opts) {
		return new ScrollAreaCornerImplState(opts, ScrollAreaRootContext.get());
	}
	opts;
	root;
	attachment;
	#width = 0;
	#height = 0;
	#hasSize = derived(() => Boolean(this.#width && this.#height));
	get hasSize() {
		return this.#hasSize();
	}
	set hasSize($$value) {
		return this.#hasSize($$value);
	}
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref);
		new SvelteResizeObserver(() => this.root.scrollbarXNode, () => {
			const height = this.root.scrollbarXNode?.offsetHeight || 0;
			this.root.cornerHeight = height;
			this.#height = height;
		});
		new SvelteResizeObserver(() => this.root.scrollbarYNode, () => {
			const width = this.root.scrollbarYNode?.offsetWidth || 0;
			this.root.cornerWidth = width;
			this.#width = width;
		});
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		style: {
			width: this.#width,
			height: this.#height,
			position: "absolute",
			right: this.root.opts.dir.current === "ltr" ? 0 : void 0,
			left: this.root.opts.dir.current === "rtl" ? 0 : void 0,
			bottom: 0
		},
		[scrollAreaAttrs.corner]: "",
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
function toInt(value) {
	return value ? Number.parseInt(value, 10) : 0;
}
function getThumbRatio(viewportSize, contentSize) {
	const ratio = viewportSize / contentSize;
	return Number.isNaN(ratio) ? 0 : ratio;
}
function getThumbSize(sizes) {
	const ratio = getThumbRatio(sizes.viewport, sizes.content);
	const scrollbarPadding = sizes.scrollbar.paddingStart + sizes.scrollbar.paddingEnd;
	const thumbSize = (sizes.scrollbar.size - scrollbarPadding) * ratio;
	return Math.max(thumbSize, 18);
}
function getScrollPositionFromPointer({ pointerPos, pointerOffset, sizes, dir = "ltr" }) {
	const thumbSizePx = getThumbSize(sizes);
	const thumbCenter = thumbSizePx / 2;
	const offset = pointerOffset || thumbCenter;
	const thumbOffsetFromEnd = thumbSizePx - offset;
	const minPointerPos = sizes.scrollbar.paddingStart + offset;
	const maxPointerPos = sizes.scrollbar.size - sizes.scrollbar.paddingEnd - thumbOffsetFromEnd;
	const maxScrollPos = sizes.content - sizes.viewport;
	const scrollRange = dir === "ltr" ? [0, maxScrollPos] : [maxScrollPos * -1, 0];
	return linearScale([minPointerPos, maxPointerPos], scrollRange)(pointerPos);
}
function getThumbOffsetFromScroll({ scrollPos, sizes, dir = "ltr" }) {
	const thumbSizePx = getThumbSize(sizes);
	const scrollbarPadding = sizes.scrollbar.paddingStart + sizes.scrollbar.paddingEnd;
	const scrollbar = sizes.scrollbar.size - scrollbarPadding;
	const maxScrollPos = sizes.content - sizes.viewport;
	const maxThumbPos = scrollbar - thumbSizePx;
	const scrollClampRange = dir === "ltr" ? [0, maxScrollPos] : [maxScrollPos * -1, 0];
	const scrollWithoutMomentum = clamp(scrollPos, scrollClampRange[0], scrollClampRange[1]);
	return linearScale([0, maxScrollPos], [0, maxThumbPos])(scrollWithoutMomentum);
}
function linearScale(input, output) {
	return (value) => {
		if (input[0] === input[1] || output[0] === output[1]) return output[0];
		const ratio = (output[1] - output[0]) / (input[1] - input[0]);
		return output[0] + ratio * (value - input[0]);
	};
}
function isScrollingWithinScrollbarBounds(scrollPos, maxScrollPos) {
	return scrollPos > 0 && scrollPos < maxScrollPos;
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/scroll-area/components/scroll-area.svelte
function Scroll_area($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { ref = null, id = createId(uid), type = "hover", dir = "ltr", scrollHideDelay = 600, children, child, $$slots, $$events, ...restProps } = $$props;
		const rootState = ScrollAreaRootState.create({
			type: boxWith(() => type),
			dir: boxWith(() => dir),
			scrollHideDelay: boxWith(() => scrollHideDelay),
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v)
		});
		const mergedProps = derived(() => mergeProps(restProps, rootState.props));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, { props: mergedProps() });
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div${attributes({ ...mergedProps() })}>`);
			children?.($$renderer);
			$$renderer.push(`<!----></div>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/scroll-area/components/scroll-area-viewport.svelte
function Scroll_area_viewport($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { ref = null, id = createId(uid), children, $$slots, $$events, ...restProps } = $$props;
		const viewportState = ScrollAreaViewportState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v)
		});
		const mergedProps = derived(() => mergeProps(restProps, viewportState.props));
		const mergedContentProps = derived(() => mergeProps({}, viewportState.contentProps));
		$$renderer.push(`<div${attributes({ ...mergedProps() })}><div${attributes({ ...mergedContentProps() })}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></div></div>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/scroll-area/components/scroll-area-scrollbar-shared.svelte
function Scroll_area_scrollbar_shared($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { child, children, $$slots, $$events, ...restProps } = $$props;
		const scrollbarSharedState = ScrollAreaScrollbarSharedState.create();
		const mergedProps = derived(() => mergeProps(restProps, scrollbarSharedState.props));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, { props: mergedProps() });
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div${attributes({ ...mergedProps() })}>`);
			children?.($$renderer);
			$$renderer.push(`<!----></div>`);
		}
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/scroll-area/components/scroll-area-scrollbar-x.svelte
function Scroll_area_scrollbar_x($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { $$slots, $$events, ...restProps } = $$props;
		const isMounted = new IsMounted();
		const scrollbarXState = ScrollAreaScrollbarXState.create({ mounted: boxWith(() => isMounted.current) });
		Scroll_area_scrollbar_shared($$renderer, spread_props([derived(() => mergeProps(restProps, scrollbarXState.props))()]));
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/scroll-area/components/scroll-area-scrollbar-y.svelte
function Scroll_area_scrollbar_y($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { $$slots, $$events, ...restProps } = $$props;
		const isMounted = new IsMounted();
		const scrollbarYState = ScrollAreaScrollbarYState.create({ mounted: boxWith(() => isMounted.current) });
		Scroll_area_scrollbar_shared($$renderer, spread_props([derived(() => mergeProps(restProps, scrollbarYState.props))()]));
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/scroll-area/components/scroll-area-scrollbar-visible.svelte
function Scroll_area_scrollbar_visible($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { $$slots, $$events, ...restProps } = $$props;
		if (ScrollAreaScrollbarVisibleState.create().scrollbar.opts.orientation.current === "horizontal") {
			$$renderer.push("<!--[0-->");
			Scroll_area_scrollbar_x($$renderer, spread_props([restProps]));
		} else {
			$$renderer.push("<!--[-1-->");
			Scroll_area_scrollbar_y($$renderer, spread_props([restProps]));
		}
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/scroll-area/components/scroll-area-scrollbar-auto.svelte
function Scroll_area_scrollbar_auto($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { forceMount = false, $$slots, $$events, ...restProps } = $$props;
		const scrollbarAutoState = ScrollAreaScrollbarAutoState.create();
		const mergedProps = derived(() => mergeProps(restProps, scrollbarAutoState.props));
		{
			function presence($$renderer) {
				Scroll_area_scrollbar_visible($$renderer, spread_props([mergedProps()]));
			}
			Presence_layer($$renderer, {
				open: forceMount || scrollbarAutoState.isVisible,
				ref: scrollbarAutoState.scrollbar.opts.ref,
				presence});
		}
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/scroll-area/components/scroll-area-scrollbar-scroll.svelte
function Scroll_area_scrollbar_scroll($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { forceMount = false, $$slots, $$events, ...restProps } = $$props;
		const scrollbarScrollState = ScrollAreaScrollbarScrollState.create();
		const mergedProps = derived(() => mergeProps(restProps, scrollbarScrollState.props));
		{
			function presence($$renderer) {
				Scroll_area_scrollbar_visible($$renderer, spread_props([mergedProps()]));
			}
			Presence_layer($$renderer, spread_props([mergedProps(), {
				open: forceMount || !scrollbarScrollState.isHidden,
				ref: scrollbarScrollState.scrollbar.opts.ref,
				presence,
				$$slots: { presence: true }
			}]));
		}
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/scroll-area/components/scroll-area-scrollbar-hover.svelte
function Scroll_area_scrollbar_hover($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { forceMount = false, $$slots, $$events, ...restProps } = $$props;
		const scrollbarHoverState = ScrollAreaScrollbarHoverState.create();
		const scrollbarAutoState = ScrollAreaScrollbarAutoState.create();
		const mergedProps = derived(() => mergeProps(restProps, scrollbarHoverState.props, scrollbarAutoState.props, { "data-state": scrollbarHoverState.isVisible ? "visible" : "hidden" }));
		const open = derived(() => forceMount || scrollbarHoverState.isVisible && scrollbarAutoState.isVisible);
		{
			function presence($$renderer) {
				Scroll_area_scrollbar_visible($$renderer, spread_props([mergedProps()]));
			}
			Presence_layer($$renderer, {
				open: open(),
				ref: scrollbarAutoState.scrollbar.opts.ref,
				presence});
		}
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/scroll-area/components/scroll-area-scrollbar.svelte
function Scroll_area_scrollbar($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { ref = null, id = createId(uid), orientation, $$slots, $$events, ...restProps } = $$props;
		const scrollbarState = ScrollAreaScrollbarState.create({
			orientation: boxWith(() => orientation),
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v)
		});
		const type = derived(() => scrollbarState.root.opts.type.current);
		if (type() === "hover") {
			$$renderer.push("<!--[0-->");
			Scroll_area_scrollbar_hover($$renderer, spread_props([restProps, { id }]));
		} else if (type() === "scroll") {
			$$renderer.push("<!--[1-->");
			Scroll_area_scrollbar_scroll($$renderer, spread_props([restProps, { id }]));
		} else if (type() === "auto") {
			$$renderer.push("<!--[2-->");
			Scroll_area_scrollbar_auto($$renderer, spread_props([restProps, { id }]));
		} else if (type() === "always") {
			$$renderer.push("<!--[3-->");
			Scroll_area_scrollbar_visible($$renderer, spread_props([restProps, { id }]));
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/scroll-area/components/scroll-area-thumb-impl.svelte
function Scroll_area_thumb_impl($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, id, child, children, present, $$slots, $$events, ...restProps } = $$props;
		const isMounted = new IsMounted();
		const thumbState = ScrollAreaThumbImplState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v),
			mounted: boxWith(() => isMounted.current)
		});
		const mergedProps = derived(() => mergeProps(restProps, thumbState.props, { style: { hidden: !present } }));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, { props: mergedProps() });
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div${attributes({ ...mergedProps() })}>`);
			children?.($$renderer);
			$$renderer.push(`<!----></div>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/scroll-area/components/scroll-area-thumb.svelte
function Scroll_area_thumb($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { id = createId(uid), ref = null, forceMount = false, $$slots, $$events, ...restProps } = $$props;
		const scrollbarState = ScrollAreaScrollbarVisibleContext.get();
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			{
				function presence($$renderer, { present }) {
					Scroll_area_thumb_impl($$renderer, spread_props([restProps, {
						id,
						present,
						get ref() {
							return ref;
						},
						set ref($$value) {
							ref = $$value;
							$$settled = false;
						}
					}]));
				}
				Presence_layer($$renderer, {
					open: forceMount || scrollbarState.hasThumb,
					ref: scrollbarState.scrollbar.opts.ref,
					presence});
			}
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/scroll-area/components/scroll-area-corner-impl.svelte
function Scroll_area_corner_impl($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, id, children, child, $$slots, $$events, ...restProps } = $$props;
		const cornerState = ScrollAreaCornerImplState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v)
		});
		const mergedProps = derived(() => mergeProps(restProps, cornerState.props));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, { props: mergedProps() });
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div${attributes({ ...mergedProps() })}>`);
			children?.($$renderer);
			$$renderer.push(`<!----></div>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/scroll-area/components/scroll-area-corner.svelte
function Scroll_area_corner($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { ref = null, id = createId(uid), $$slots, $$events, ...restProps } = $$props;
		const scrollAreaState = ScrollAreaRootContext.get();
		const hasBothScrollbarsVisible = derived(() => Boolean(scrollAreaState.scrollbarXNode && scrollAreaState.scrollbarYNode));
		const hasCorner = derived(() => scrollAreaState.opts.type.current !== "scroll" && hasBothScrollbarsVisible());
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (hasCorner()) {
				$$renderer.push("<!--[0-->");
				Scroll_area_corner_impl($$renderer, spread_props([restProps, {
					id,
					get ref() {
						return ref;
					},
					set ref($$value) {
						ref = $$value;
						$$settled = false;
					}
				}]));
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/select/components/select.svelte
function Select($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { value = void 0, onValueChange = noop$2, name = "", disabled = false, type, open = false, onOpenChange = noop$2, onOpenChangeComplete = noop$2, loop = false, scrollAlignment = "nearest", required = false, items = [], allowDeselect = false, autocomplete, children } = $$props;
		function handleDefaultValue() {
			if (value !== void 0) return;
			value = type === "single" ? "" : [];
		}
		handleDefaultValue();
		watch.pre(() => value, () => {
			handleDefaultValue();
		});
		let inputValue = "";
		const rootState = SelectRootState.create({
			type,
			value: boxWith(() => value, (v) => {
				value = v;
				onValueChange(v);
			}),
			disabled: boxWith(() => disabled),
			required: boxWith(() => required),
			open: boxWith(() => open, (v) => {
				open = v;
				onOpenChange(v);
			}),
			loop: boxWith(() => loop),
			scrollAlignment: boxWith(() => scrollAlignment),
			name: boxWith(() => name),
			isCombobox: false,
			items: boxWith(() => items),
			allowDeselect: boxWith(() => allowDeselect),
			inputValue: boxWith(() => inputValue, (v) => inputValue = v),
			onOpenChangeComplete: boxWith(() => onOpenChangeComplete)
		});
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			Floating_layer($$renderer, {
				children: ($$renderer) => {
					children?.($$renderer);
					$$renderer.push(`<!---->`);
				}});
			$$renderer.push(`<!----> `);
			if (Array.isArray(rootState.opts.value.current)) {
				$$renderer.push("<!--[0-->");
				if (rootState.opts.value.current.length === 0) {
					$$renderer.push("<!--[0-->");
					Select_hidden_input($$renderer, { autocomplete });
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--[-->`);
					const each_array = ensure_array_like(rootState.opts.value.current);
					for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
						let item = each_array[$$index];
						Select_hidden_input($$renderer, {
							value: item,
							autocomplete
						});
					}
					$$renderer.push(`<!--]-->`);
				}
				$$renderer.push(`<!--]-->`);
			} else {
				$$renderer.push("<!--[-1-->");
				Select_hidden_input($$renderer, {
					autocomplete,
					get value() {
						return rootState.opts.value.current;
					},
					set value($$value) {
						rootState.opts.value.current = $$value;
						$$settled = false;
					}
				});
			}
			$$renderer.push(`<!--]-->`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, {
			value,
			open
		});
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/select/components/select-trigger.svelte
function Select_trigger($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { id = createId(uid), ref = null, child, children, type = "button", $$slots, $$events, ...restProps } = $$props;
		const triggerState = SelectTriggerState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v)
		});
		const mergedProps = derived(() => mergeProps(restProps, triggerState.props, { type }));
		if (Floating_layer_anchor) {
			$$renderer.push("<!--[-->");
			Floating_layer_anchor($$renderer, {
				id,
				ref: triggerState.opts.ref,
				children: ($$renderer) => {
					if (child) {
						$$renderer.push("<!--[0-->");
						child($$renderer, { props: mergedProps() });
						$$renderer.push(`<!---->`);
					} else {
						$$renderer.push("<!--[-1-->");
						$$renderer.push(`<button${attributes({ ...mergedProps() })}>`);
						children?.($$renderer);
						$$renderer.push(`<!----></button>`);
					}
					$$renderer.push(`<!--]-->`);
				}});
			$$renderer.push("<!--]-->");
		} else {
			$$renderer.push("<!--[!-->");
			$$renderer.push("<!--]-->");
		}
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/tabs/tabs.svelte.js
var tabsAttrs = createBitsAttrs({
	component: "tabs",
	parts: [
		"root",
		"list",
		"trigger",
		"content"
	]
});
var TabsRootContext = new Context("Tabs.Root");
var TabsRootState = class TabsRootState {
	static create(opts) {
		return TabsRootContext.set(new TabsRootState(opts));
	}
	opts;
	attachment;
	rovingFocusGroup;
	triggerIds = [];
	valueToTriggerId = new SvelteMap();
	valueToContentId = new SvelteMap();
	constructor(opts) {
		this.opts = opts;
		this.attachment = attachRef(opts.ref);
		this.rovingFocusGroup = new RovingFocusGroup({
			candidateAttr: tabsAttrs.trigger,
			rootNode: this.opts.ref,
			loop: this.opts.loop,
			orientation: this.opts.orientation
		});
	}
	registerTrigger(id, value) {
		this.triggerIds.push(id);
		this.valueToTriggerId.set(value, id);
		return () => {
			this.triggerIds = this.triggerIds.filter((triggerId) => triggerId !== id);
			this.valueToTriggerId.delete(value);
		};
	}
	registerContent(id, value) {
		this.valueToContentId.set(value, id);
		return () => {
			this.valueToContentId.delete(value);
		};
	}
	setValue(v) {
		this.opts.value.current = v;
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		"data-orientation": this.opts.orientation.current,
		[tabsAttrs.root]: "",
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var TabsListState = class TabsListState {
	static create(opts) {
		return new TabsListState(opts, TabsRootContext.get());
	}
	opts;
	root;
	attachment;
	#isDisabled = derived(() => this.root.opts.disabled.current);
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(opts.ref);
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		role: "tablist",
		"aria-orientation": this.root.opts.orientation.current,
		"data-orientation": this.root.opts.orientation.current,
		[tabsAttrs.list]: "",
		"data-disabled": boolToEmptyStrOrUndef(this.#isDisabled()),
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var TabsTriggerState = class TabsTriggerState {
	static create(opts) {
		return new TabsTriggerState(opts, TabsRootContext.get());
	}
	opts;
	root;
	attachment;
	#tabIndex = 0;
	#isActive = derived(() => this.root.opts.value.current === this.opts.value.current);
	#isDisabled = derived(() => this.opts.disabled.current || this.root.opts.disabled.current);
	#ariaControls = derived(() => this.root.valueToContentId.get(this.opts.value.current));
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(opts.ref);
		watch([() => this.opts.id.current, () => this.opts.value.current], ([id, value]) => {
			return this.root.registerTrigger(id, value);
		});
		this.onfocus = this.onfocus.bind(this);
		this.onclick = this.onclick.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
	}
	#activate() {
		if (this.root.opts.value.current === this.opts.value.current) return;
		this.root.setValue(this.opts.value.current);
	}
	onfocus(_) {
		if (this.root.opts.activationMode.current !== "automatic" || this.#isDisabled()) return;
		this.#activate();
	}
	onclick(_) {
		if (this.#isDisabled()) return;
		this.#activate();
	}
	onkeydown(e) {
		if (this.#isDisabled()) return;
		if (e.key === " " || e.key === "Enter") {
			e.preventDefault();
			this.#activate();
			return;
		}
		this.root.rovingFocusGroup.handleKeydown(this.opts.ref.current, e);
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		role: "tab",
		"data-state": getTabDataState(this.#isActive()),
		"data-value": this.opts.value.current,
		"data-orientation": this.root.opts.orientation.current,
		"data-disabled": boolToEmptyStrOrUndef(this.#isDisabled()),
		"aria-selected": boolToStr(this.#isActive()),
		"aria-controls": this.#ariaControls(),
		[tabsAttrs.trigger]: "",
		disabled: boolToTrueOrUndef(this.#isDisabled()),
		tabindex: this.#tabIndex,
		onclick: this.onclick,
		onfocus: this.onfocus,
		onkeydown: this.onkeydown,
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var TabsContentState = class TabsContentState {
	static create(opts) {
		return new TabsContentState(opts, TabsRootContext.get());
	}
	opts;
	root;
	attachment;
	#isActive = derived(() => this.root.opts.value.current === this.opts.value.current);
	#ariaLabelledBy = derived(() => this.root.valueToTriggerId.get(this.opts.value.current));
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(opts.ref);
		watch([() => this.opts.id.current, () => this.opts.value.current], ([id, value]) => {
			return this.root.registerContent(id, value);
		});
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		role: "tabpanel",
		hidden: boolToTrueOrUndef(!this.#isActive()),
		tabindex: 0,
		"data-value": this.opts.value.current,
		"data-state": getTabDataState(this.#isActive()),
		"aria-labelledby": this.#ariaLabelledBy(),
		"data-orientation": this.root.opts.orientation.current,
		[tabsAttrs.content]: "",
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
function getTabDataState(condition) {
	return condition ? "active" : "inactive";
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/tabs/components/tabs.svelte
function Tabs($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { id = createId(uid), ref = null, value = "", onValueChange = noop$2, orientation = "horizontal", loop = true, activationMode = "automatic", disabled = false, children, child, $$slots, $$events, ...restProps } = $$props;
		const rootState = TabsRootState.create({
			id: boxWith(() => id),
			value: boxWith(() => value, (v) => {
				value = v;
				onValueChange(v);
			}),
			orientation: boxWith(() => orientation),
			loop: boxWith(() => loop),
			activationMode: boxWith(() => activationMode),
			disabled: boxWith(() => disabled),
			ref: boxWith(() => ref, (v) => ref = v)
		});
		const mergedProps = derived(() => mergeProps(restProps, rootState.props));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, { props: mergedProps() });
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div${attributes({ ...mergedProps() })}>`);
			children?.($$renderer);
			$$renderer.push(`<!----></div>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, {
			ref,
			value
		});
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/tabs/components/tabs-content.svelte
function Tabs_content($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { children, child, id = createId(uid), ref = null, value, $$slots, $$events, ...restProps } = $$props;
		const contentState = TabsContentState.create({
			value: boxWith(() => value),
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v)
		});
		const mergedProps = derived(() => mergeProps(restProps, contentState.props));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, { props: mergedProps() });
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div${attributes({ ...mergedProps() })}>`);
			children?.($$renderer);
			$$renderer.push(`<!----></div>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/tabs/components/tabs-list.svelte
function Tabs_list($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { child, children, id = createId(uid), ref = null, $$slots, $$events, ...restProps } = $$props;
		const listState = TabsListState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v)
		});
		const mergedProps = derived(() => mergeProps(restProps, listState.props));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, { props: mergedProps() });
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div${attributes({ ...mergedProps() })}>`);
			children?.($$renderer);
			$$renderer.push(`<!----></div>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/tabs/components/tabs-trigger.svelte
function Tabs_trigger($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { child, children, disabled = false, id = createId(uid), type = "button", value, ref = null, $$slots, $$events, ...restProps } = $$props;
		const triggerState = TabsTriggerState.create({
			id: boxWith(() => id),
			disabled: boxWith(() => disabled ?? false),
			value: boxWith(() => value),
			ref: boxWith(() => ref, (v) => ref = v)
		});
		const mergedProps = derived(() => mergeProps(restProps, triggerState.props, { type }));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, { props: mergedProps() });
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<button${attributes({ ...mergedProps() })}>`);
			children?.($$renderer);
			$$renderer.push(`<!----></button>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/internal/timeout-fn.js
var TimeoutFn = class {
	#interval;
	#cb;
	#timer = null;
	constructor(cb, interval) {
		this.#cb = cb;
		this.#interval = interval;
		this.stop = this.stop.bind(this);
		this.start = this.start.bind(this);
		this.stop;
	}
	#clear() {
		if (this.#timer !== null) {
			window.clearTimeout(this.#timer);
			this.#timer = null;
		}
	}
	stop() {
		this.#clear();
	}
	start(...args) {
		this.#clear();
		this.#timer = window.setTimeout(() => {
			this.#timer = null;
			this.#cb(...args);
		}, this.#interval);
	}
};
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/tooltip/tooltip.svelte.js
var tooltipAttrs = createBitsAttrs({
	component: "tooltip",
	parts: ["content", "trigger"]
});
var TooltipProviderContext = new Context("Tooltip.Provider");
var TooltipRootContext = new Context("Tooltip.Root");
var TooltipTriggerRegistryState = class {
	triggers = /* @__PURE__ */ new Map();
	activeTriggerId = null;
	#activeTriggerNode = derived(() => {
		const activeTriggerId = this.activeTriggerId;
		if (activeTriggerId === null) return null;
		return this.triggers.get(activeTriggerId)?.node ?? null;
	});
	get activeTriggerNode() {
		return this.#activeTriggerNode();
	}
	set activeTriggerNode($$value) {
		return this.#activeTriggerNode($$value);
	}
	#activePayload = derived(() => {
		const activeTriggerId = this.activeTriggerId;
		if (activeTriggerId === null) return null;
		return this.triggers.get(activeTriggerId)?.payload ?? null;
	});
	get activePayload() {
		return this.#activePayload();
	}
	set activePayload($$value) {
		return this.#activePayload($$value);
	}
	register = (record) => {
		const next = new Map(this.triggers);
		next.set(record.id, record);
		this.triggers = next;
		this.#coerceActiveTrigger();
	};
	update = (record) => {
		const next = new Map(this.triggers);
		next.set(record.id, record);
		this.triggers = next;
		this.#coerceActiveTrigger();
	};
	unregister = (id) => {
		if (!this.triggers.has(id)) return;
		const next = new Map(this.triggers);
		next.delete(id);
		this.triggers = next;
		if (this.activeTriggerId === id) this.activeTriggerId = null;
	};
	setActiveTrigger = (id) => {
		if (id === null) {
			this.activeTriggerId = null;
			return;
		}
		if (!this.triggers.has(id)) {
			this.activeTriggerId = null;
			return;
		}
		this.activeTriggerId = id;
	};
	get = (id) => {
		return this.triggers.get(id);
	};
	has = (id) => {
		return this.triggers.has(id);
	};
	getFirstTriggerId = () => {
		const firstEntry = this.triggers.entries().next();
		if (firstEntry.done) return null;
		return firstEntry.value[0];
	};
	#coerceActiveTrigger = () => {
		const activeTriggerId = this.activeTriggerId;
		if (activeTriggerId === null) return;
		if (!this.triggers.has(activeTriggerId)) this.activeTriggerId = null;
	};
};
var TooltipProviderState = class TooltipProviderState {
	static create(opts) {
		return TooltipProviderContext.set(new TooltipProviderState(opts));
	}
	opts;
	isOpenDelayed = true;
	isPointerInTransit = simpleBox(false);
	#timerFn;
	#openTooltip = null;
	constructor(opts) {
		this.opts = opts;
		this.#timerFn = new TimeoutFn(() => {
			this.isOpenDelayed = true;
		}, this.opts.skipDelayDuration.current);
	}
	#startTimer = () => {
		if (this.opts.skipDelayDuration.current === 0) {
			this.isOpenDelayed = true;
			return;
		} else this.#timerFn.start();
	};
	#clearTimer = () => {
		this.#timerFn.stop();
	};
	onOpen = (tooltip) => {
		if (this.#openTooltip && this.#openTooltip !== tooltip) this.#openTooltip.handleClose();
		this.#clearTimer();
		this.isOpenDelayed = false;
		this.#openTooltip = tooltip;
	};
	onClose = (tooltip) => {
		if (this.#openTooltip === tooltip) {
			this.#openTooltip = null;
			this.#startTimer();
		}
	};
	isTooltipOpen = (tooltip) => {
		return this.#openTooltip === tooltip;
	};
};
var TooltipRootState = class TooltipRootState {
	static create(opts) {
		return TooltipRootContext.set(new TooltipRootState(opts, TooltipProviderContext.get()));
	}
	opts;
	provider;
	#delayDuration = derived(() => this.opts.delayDuration.current ?? this.provider.opts.delayDuration.current);
	get delayDuration() {
		return this.#delayDuration();
	}
	set delayDuration($$value) {
		return this.#delayDuration($$value);
	}
	#disableHoverableContent = derived(() => this.opts.disableHoverableContent.current ?? this.provider.opts.disableHoverableContent.current);
	get disableHoverableContent() {
		return this.#disableHoverableContent();
	}
	set disableHoverableContent($$value) {
		return this.#disableHoverableContent($$value);
	}
	#disableCloseOnTriggerClick = derived(() => this.opts.disableCloseOnTriggerClick.current ?? this.provider.opts.disableCloseOnTriggerClick.current);
	get disableCloseOnTriggerClick() {
		return this.#disableCloseOnTriggerClick();
	}
	set disableCloseOnTriggerClick($$value) {
		return this.#disableCloseOnTriggerClick($$value);
	}
	#disabled = derived(() => this.opts.disabled.current ?? this.provider.opts.disabled.current);
	get disabled() {
		return this.#disabled();
	}
	set disabled($$value) {
		return this.#disabled($$value);
	}
	#ignoreNonKeyboardFocus = derived(() => this.opts.ignoreNonKeyboardFocus.current ?? this.provider.opts.ignoreNonKeyboardFocus.current);
	get ignoreNonKeyboardFocus() {
		return this.#ignoreNonKeyboardFocus();
	}
	set ignoreNonKeyboardFocus($$value) {
		return this.#ignoreNonKeyboardFocus($$value);
	}
	registry;
	tether;
	contentNode = null;
	contentPresence;
	#wasOpenDelayed = false;
	#timerFn;
	#stateAttr = derived(() => {
		if (!this.opts.open.current) return "closed";
		return this.#wasOpenDelayed ? "delayed-open" : "instant-open";
	});
	get stateAttr() {
		return this.#stateAttr();
	}
	set stateAttr($$value) {
		return this.#stateAttr($$value);
	}
	constructor(opts, provider) {
		this.opts = opts;
		this.provider = provider;
		this.tether = opts.tether.current?.state ?? null;
		this.registry = this.tether?.registry ?? new TooltipTriggerRegistryState();
		this.#timerFn = new TimeoutFn(() => {
			this.#wasOpenDelayed = true;
			this.opts.open.current = true;
		}, this.delayDuration ?? 0);
		if (this.tether) this.tether.root = this;
		this.contentPresence = new PresenceManager({
			open: this.opts.open,
			ref: boxWith(() => this.contentNode),
			onComplete: () => {
				this.opts.onOpenChangeComplete.current(this.opts.open.current);
			}
		});
		watch(() => this.delayDuration, () => {
			if (this.delayDuration === void 0) return;
			this.#timerFn = new TimeoutFn(() => {
				this.#wasOpenDelayed = true;
				this.opts.open.current = true;
			}, this.delayDuration);
		});
		watch(() => this.opts.open.current, (isOpen) => {
			if (isOpen) {
				this.ensureActiveTrigger();
				this.provider.onOpen(this);
			} else this.provider.onClose(this);
		}, { lazy: true });
		watch(() => this.opts.triggerId.current, (triggerId) => {
			if (triggerId === this.registry.activeTriggerId) return;
			this.registry.setActiveTrigger(triggerId);
		});
		watch(() => this.registry.activeTriggerId, (activeTriggerId) => {
			if (this.opts.triggerId.current === activeTriggerId) return;
			this.opts.triggerId.current = activeTriggerId;
		});
	}
	handleOpen = () => {
		this.#timerFn.stop();
		this.#wasOpenDelayed = false;
		this.ensureActiveTrigger();
		this.opts.open.current = true;
	};
	handleClose = () => {
		this.#timerFn.stop();
		this.opts.open.current = false;
	};
	#handleDelayedOpen = () => {
		this.#timerFn.stop();
		const shouldSkipDelay = !this.provider.isOpenDelayed;
		const delayDuration = this.delayDuration ?? 0;
		if (shouldSkipDelay || delayDuration === 0) {
			this.#wasOpenDelayed = false;
			this.opts.open.current = true;
		} else this.#timerFn.start();
	};
	onTriggerEnter = (triggerId) => {
		this.setActiveTrigger(triggerId);
		this.#handleDelayedOpen();
	};
	onTriggerLeave = () => {
		if (this.disableHoverableContent) this.handleClose();
		else this.#timerFn.stop();
	};
	ensureActiveTrigger = () => {
		if (this.registry.activeTriggerId !== null && this.registry.has(this.registry.activeTriggerId)) return;
		if (this.opts.triggerId.current !== null && this.registry.has(this.opts.triggerId.current)) {
			this.registry.setActiveTrigger(this.opts.triggerId.current);
			return;
		}
		const firstTriggerId = this.registry.getFirstTriggerId();
		this.registry.setActiveTrigger(firstTriggerId);
	};
	setActiveTrigger = (triggerId) => {
		this.registry.setActiveTrigger(triggerId);
	};
	registerTrigger = (trigger) => {
		this.registry.register(trigger);
		if (trigger.disabled && this.registry.activeTriggerId === trigger.id && this.opts.open.current) this.handleClose();
	};
	updateTrigger = (trigger) => {
		this.registry.update(trigger);
		if (trigger.disabled && this.registry.activeTriggerId === trigger.id && this.opts.open.current) this.handleClose();
	};
	unregisterTrigger = (id) => {
		const isActive = this.registry.activeTriggerId === id;
		this.registry.unregister(id);
		if (isActive && this.opts.open.current) this.handleClose();
	};
	isActiveTrigger = (triggerId) => {
		return this.registry.activeTriggerId === triggerId;
	};
	get triggerNode() {
		return this.registry.activeTriggerNode;
	}
	get activePayload() {
		return this.registry.activePayload;
	}
	get activeTriggerId() {
		return this.registry.activeTriggerId;
	}
};
var TooltipTriggerState = class TooltipTriggerState {
	static create(opts) {
		if (opts.tether.current) return new TooltipTriggerState(opts, null, opts.tether.current.state);
		return new TooltipTriggerState(opts, TooltipRootContext.get(), null);
	}
	opts;
	root;
	tether;
	attachment;
	#isPointerDown = simpleBox(false);
	#hasPointerMoveOpened = false;
	domContext;
	#transitCheckTimeout = null;
	#mounted = false;
	#lastRegisteredId = null;
	constructor(opts, root, tether) {
		this.opts = opts;
		this.root = root;
		this.tether = tether;
		this.domContext = new DOMContext(opts.ref);
		this.attachment = attachRef(this.opts.ref, (v) => this.#register(v));
		watch(() => this.opts.id.current, () => {
			this.#register(this.opts.ref.current);
		});
		watch(() => this.opts.payload.current, () => {
			this.#register(this.opts.ref.current);
		});
		watch(() => this.opts.disabled.current, () => {
			this.#register(this.opts.ref.current);
		});
	}
	#getRoot = () => {
		return this.tether?.root ?? this.root;
	};
	#isDisabled = () => {
		const root = this.#getRoot();
		return this.opts.disabled.current || Boolean(root?.disabled);
	};
	#register = (node) => {
		if (!this.#mounted) return;
		const id = this.opts.id.current;
		const payload = this.opts.payload.current;
		const disabled = this.opts.disabled.current;
		if (this.#lastRegisteredId && this.#lastRegisteredId !== id) {
			const root = this.#getRoot();
			if (this.tether) this.tether.registry.unregister(this.#lastRegisteredId);
			else root?.unregisterTrigger(this.#lastRegisteredId);
		}
		const triggerRecord = {
			id,
			node,
			payload,
			disabled
		};
		const root = this.#getRoot();
		if (this.tether) {
			if (this.tether.registry.has(id)) this.tether.registry.update(triggerRecord);
			else this.tether.registry.register(triggerRecord);
			if (disabled && this.tether.registry.activeTriggerId === id && root?.opts.open.current) root.handleClose();
		} else if (root?.registry.has(id)) root.updateTrigger(triggerRecord);
		else root?.registerTrigger(triggerRecord);
		this.#lastRegisteredId = id;
	};
	#clearTransitCheck = () => {
		if (this.#transitCheckTimeout !== null) {
			clearTimeout(this.#transitCheckTimeout);
			this.#transitCheckTimeout = null;
		}
	};
	handlePointerUp = () => {
		this.#isPointerDown.current = false;
	};
	#onpointerup = () => {
		if (this.#isDisabled()) return;
		this.#isPointerDown.current = false;
	};
	#onpointerdown = () => {
		if (this.#isDisabled()) return;
		this.#isPointerDown.current = true;
		this.domContext.getDocument().addEventListener("pointerup", () => {
			this.handlePointerUp();
		}, { once: true });
	};
	#onpointerenter = (e) => {
		const root = this.#getRoot();
		if (!root) return;
		if (this.#isDisabled()) {
			if (root.opts.open.current) root.handleClose();
			return;
		}
		if (e.pointerType === "touch") return;
		if (root.provider.isPointerInTransit.current) {
			this.#clearTransitCheck();
			this.#transitCheckTimeout = window.setTimeout(() => {
				if (root.provider.isPointerInTransit.current) {
					root.provider.isPointerInTransit.current = false;
					root.onTriggerEnter(this.opts.id.current);
					this.#hasPointerMoveOpened = true;
				}
			}, 250);
			return;
		}
		root.onTriggerEnter(this.opts.id.current);
		this.#hasPointerMoveOpened = true;
	};
	#onpointermove = (e) => {
		const root = this.#getRoot();
		if (!root) return;
		if (this.#isDisabled()) {
			if (root.opts.open.current) root.handleClose();
			return;
		}
		if (e.pointerType === "touch") return;
		if (this.#hasPointerMoveOpened) return;
		this.#clearTransitCheck();
		root.provider.isPointerInTransit.current = false;
		root.onTriggerEnter(this.opts.id.current);
		this.#hasPointerMoveOpened = true;
	};
	#onpointerleave = (e) => {
		const root = this.#getRoot();
		if (!root) return;
		if (this.#isDisabled()) return;
		this.#clearTransitCheck();
		if (!root.isActiveTrigger(this.opts.id.current)) {
			this.#hasPointerMoveOpened = false;
			return;
		}
		const relatedTarget = e.relatedTarget;
		if (isElement$1(relatedTarget)) for (const record of root.registry.triggers.values()) {
			if (record.node !== relatedTarget) continue;
			if (root.provider.opts.skipDelayDuration.current > 0) {
				this.#hasPointerMoveOpened = false;
				return;
			}
			root.handleClose();
			this.#hasPointerMoveOpened = false;
			return;
		}
		root.onTriggerLeave();
		this.#hasPointerMoveOpened = false;
	};
	#onfocus = (e) => {
		const root = this.#getRoot();
		if (!root) return;
		if (this.#isPointerDown.current) return;
		if (this.#isDisabled()) {
			if (root.opts.open.current) root.handleClose();
			return;
		}
		if (root.ignoreNonKeyboardFocus && !isFocusVisible(e.currentTarget)) return;
		root.setActiveTrigger(this.opts.id.current);
		root.handleOpen();
	};
	#onblur = () => {
		const root = this.#getRoot();
		if (!root || this.#isDisabled()) return;
		root.handleClose();
	};
	#onclick = () => {
		const root = this.#getRoot();
		if (!root || root.disableCloseOnTriggerClick || this.#isDisabled()) return;
		root.handleClose();
	};
	#props = derived(() => {
		const root = this.#getRoot();
		const isOpenForTrigger = Boolean(root?.opts.open.current && root.isActiveTrigger(this.opts.id.current));
		const isDisabled = this.#isDisabled();
		return {
			id: this.opts.id.current,
			"aria-describedby": isOpenForTrigger ? root?.contentNode?.id : void 0,
			"data-state": isOpenForTrigger ? root?.stateAttr : "closed",
			"data-disabled": boolToEmptyStrOrUndef(isDisabled),
			"data-delay-duration": `${root?.delayDuration ?? 0}`,
			[tooltipAttrs.trigger]: "",
			tabindex: isDisabled ? void 0 : this.opts.tabindex.current,
			disabled: this.opts.disabled.current,
			onpointerup: this.#onpointerup,
			onpointerdown: this.#onpointerdown,
			onpointerenter: this.#onpointerenter,
			onpointermove: this.#onpointermove,
			onpointerleave: this.#onpointerleave,
			onfocus: this.#onfocus,
			onblur: this.#onblur,
			onclick: this.#onclick,
			...this.attachment
		};
	});
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var TooltipContentState = class TooltipContentState {
	static create(opts) {
		return new TooltipContentState(opts, TooltipRootContext.get());
	}
	opts;
	root;
	attachment;
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref, (v) => this.root.contentNode = v);
		new SafePolygon({
			triggerNode: () => this.root.triggerNode,
			contentNode: () => this.root.contentNode,
			enabled: () => this.root.opts.open.current && !this.root.disableHoverableContent,
			transitIntentTimeout: 180,
			ignoredTargets: () => {
				if (this.root.provider.opts.skipDelayDuration.current === 0) return [];
				const nodes = [];
				const activeTriggerNode = this.root.triggerNode;
				for (const record of this.root.registry.triggers.values()) if (record.node && record.node !== activeTriggerNode) nodes.push(record.node);
				return nodes;
			},
			onPointerExit: () => {
				if (this.root.provider.isTooltipOpen(this.root)) this.root.handleClose();
			}
		});
	}
	onInteractOutside = (e) => {
		if (isElement$1(e.target) && this.root.triggerNode?.contains(e.target) && this.root.disableCloseOnTriggerClick) {
			e.preventDefault();
			return;
		}
		this.opts.onInteractOutside.current(e);
		if (e.defaultPrevented) return;
		this.root.handleClose();
	};
	onEscapeKeydown = (e) => {
		this.opts.onEscapeKeydown.current?.(e);
		if (e.defaultPrevented) return;
		this.root.handleClose();
	};
	onOpenAutoFocus = (e) => {
		e.preventDefault();
	};
	onCloseAutoFocus = (e) => {
		e.preventDefault();
	};
	get shouldRender() {
		return this.root.contentPresence.shouldRender;
	}
	#snippetProps = derived(() => ({ open: this.root.opts.open.current }));
	get snippetProps() {
		return this.#snippetProps();
	}
	set snippetProps($$value) {
		return this.#snippetProps($$value);
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		"data-state": this.root.stateAttr,
		"data-disabled": boolToEmptyStrOrUndef(this.root.disabled),
		...getDataTransitionAttrs(this.root.contentPresence.transitionStatus),
		style: { outline: "none" },
		[tooltipAttrs.content]: "",
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
	popperProps = {
		onInteractOutside: this.onInteractOutside,
		onEscapeKeydown: this.onEscapeKeydown,
		onOpenAutoFocus: this.onOpenAutoFocus,
		onCloseAutoFocus: this.onCloseAutoFocus
	};
};
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/tooltip/components/tooltip.svelte
function Tooltip($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { open = false, triggerId = null, onOpenChange = noop$2, onOpenChangeComplete = noop$2, disabled, delayDuration, disableCloseOnTriggerClick, disableHoverableContent, ignoreNonKeyboardFocus, tether, children } = $$props;
		const rootState = TooltipRootState.create({
			open: boxWith(() => open, (v) => {
				open = v;
				onOpenChange(v);
			}),
			triggerId: boxWith(() => triggerId, (v) => {
				triggerId = v;
			}),
			delayDuration: boxWith(() => delayDuration),
			disableCloseOnTriggerClick: boxWith(() => disableCloseOnTriggerClick),
			disableHoverableContent: boxWith(() => disableHoverableContent),
			ignoreNonKeyboardFocus: boxWith(() => ignoreNonKeyboardFocus),
			disabled: boxWith(() => disabled),
			onOpenChangeComplete: boxWith(() => onOpenChangeComplete),
			tether: boxWith(() => tether)
		});
		Floating_layer($$renderer, {
			tooltip: true,
			children: ($$renderer) => {
				children?.($$renderer, {
					open: rootState.opts.open.current,
					triggerId: rootState.activeTriggerId,
					payload: rootState.activePayload
				});
				$$renderer.push(`<!---->`);
			}});
		bind_props($$props, {
			open,
			triggerId
		});
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/tooltip/components/tooltip-content.svelte
function Tooltip_content($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { children, child, id = createId(uid), ref = null, side = "top", sideOffset = 0, align = "center", avoidCollisions = true, arrowPadding = 0, sticky = "partial", strategy, hideWhenDetached = false, customAnchor, collisionPadding = 0, onInteractOutside = noop$2, onEscapeKeydown = noop$2, forceMount = false, style, $$slots, $$events, ...restProps } = $$props;
		const contentState = TooltipContentState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v),
			onInteractOutside: boxWith(() => onInteractOutside),
			onEscapeKeydown: boxWith(() => onEscapeKeydown)
		});
		const floatingProps = derived(() => ({
			side,
			sideOffset,
			align,
			avoidCollisions,
			arrowPadding,
			sticky,
			hideWhenDetached,
			collisionPadding,
			strategy,
			customAnchor: customAnchor ?? contentState.root.triggerNode
		}));
		const mergedProps = derived(() => mergeProps(restProps, floatingProps(), contentState.props));
		if (forceMount) {
			$$renderer.push("<!--[0-->");
			{
				function popper($$renderer, { props, wrapperProps }) {
					const finalWrapperProps = mergeProps(wrapperProps, { style: { pointerEvents: contentState.root.disableHoverableContent ? "none" : void 0 } });
					const finalProps = mergeProps(props, { style: getFloatingContentCSSVars("tooltip") }, { style });
					if (child) {
						$$renderer.push("<!--[0-->");
						child($$renderer, {
							props: finalProps,
							wrapperProps: finalWrapperProps,
							...contentState.snippetProps
						});
						$$renderer.push(`<!---->`);
					} else {
						$$renderer.push("<!--[-1-->");
						$$renderer.push(`<div${attributes({ ...finalWrapperProps })}><div${attributes({ ...finalProps })}>`);
						children?.($$renderer);
						$$renderer.push(`<!----></div></div>`);
					}
					$$renderer.push(`<!--]-->`);
				}
				Popper_layer_force_mount($$renderer, spread_props([
					mergedProps(),
					contentState.popperProps,
					{
						enabled: contentState.root.opts.open.current,
						id,
						trapFocus: false,
						loop: false,
						preventScroll: false,
						forceMount: true,
						ref: contentState.opts.ref,
						tooltip: true,
						shouldRender: contentState.shouldRender,
						contentPointerEvents: contentState.root.disableHoverableContent ? "none" : "auto",
						popper,
						$$slots: { popper: true }
					}
				]));
			}
		} else if (!forceMount) {
			$$renderer.push("<!--[1-->");
			{
				function popper($$renderer, { props, wrapperProps }) {
					const finalWrapperProps = mergeProps(wrapperProps, { style: { pointerEvents: contentState.root.disableHoverableContent ? "none" : void 0 } });
					const finalProps = mergeProps(props, { style: getFloatingContentCSSVars("tooltip") }, { style });
					if (child) {
						$$renderer.push("<!--[0-->");
						child($$renderer, {
							props: finalProps,
							wrapperProps: finalWrapperProps,
							...contentState.snippetProps
						});
						$$renderer.push(`<!---->`);
					} else {
						$$renderer.push("<!--[-1-->");
						$$renderer.push(`<div${attributes({ ...finalWrapperProps })}><div${attributes({ ...finalProps })}>`);
						children?.($$renderer);
						$$renderer.push(`<!----></div></div>`);
					}
					$$renderer.push(`<!--]-->`);
				}
				Popper_layer($$renderer, spread_props([
					mergedProps(),
					contentState.popperProps,
					{
						open: contentState.root.opts.open.current,
						id,
						trapFocus: false,
						loop: false,
						preventScroll: false,
						forceMount: false,
						ref: contentState.opts.ref,
						tooltip: true,
						shouldRender: contentState.shouldRender,
						contentPointerEvents: contentState.root.disableHoverableContent ? "none" : "auto",
						popper,
						$$slots: { popper: true }
					}
				]));
			}
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/tooltip/components/tooltip-trigger.svelte
function Tooltip_trigger($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { children, child, id = createId(uid), disabled = false, payload, tether, type = "button", tabindex = 0, ref = null, $$slots, $$events, ...restProps } = $$props;
		const triggerState = TooltipTriggerState.create({
			id: boxWith(() => id),
			disabled: boxWith(() => disabled ?? false),
			tabindex: boxWith(() => tabindex ?? 0),
			payload: boxWith(() => payload),
			tether: boxWith(() => tether),
			ref: boxWith(() => ref, (v) => ref = v)
		});
		const mergedProps = derived(() => mergeProps(restProps, triggerState.props, { type }));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, { props: mergedProps() });
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<button${attributes({ ...mergedProps() })}>`);
			children?.($$renderer);
			$$renderer.push(`<!----></button>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/tooltip/components/tooltip-arrow.svelte
function Tooltip_arrow($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			Floating_layer_arrow($$renderer, spread_props([restProps, {
				get ref() {
					return ref;
				},
				set ref($$value) {
					ref = $$value;
					$$settled = false;
				}
			}]));
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.bun/bits-ui@2.18.1+1145bf17e4779b6a/node_modules/bits-ui/dist/bits/tooltip/components/tooltip-provider.svelte
function Tooltip_provider($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { children, delayDuration = 700, disableCloseOnTriggerClick = false, disableHoverableContent = false, disabled = false, ignoreNonKeyboardFocus = false, skipDelayDuration = 300 } = $$props;
		TooltipProviderState.create({
			delayDuration: boxWith(() => delayDuration),
			disableCloseOnTriggerClick: boxWith(() => disableCloseOnTriggerClick),
			disableHoverableContent: boxWith(() => disableHoverableContent),
			disabled: boxWith(() => disabled),
			ignoreNonKeyboardFocus: boxWith(() => ignoreNonKeyboardFocus),
			skipDelayDuration: boxWith(() => skipDelayDuration)
		});
		children?.($$renderer);
		$$renderer.push(`<!---->`);
	});
}

//#region ../../node_modules/.bun/@sveltejs+kit@2.69.3+ab726ce7a871e72d/node_modules/@sveltejs/kit/src/utils/functions.js
function noop() {}
/**
* @template T
* @param {() => T} fn
*/
function once(fn) {
	let done = false;
	/** @type T */
	let result;
	return () => {
		if (done) return result;
		done = true;
		return result = fn();
	};
}
//#endregion
//#region ../../node_modules/.bun/devalue@5.8.1/node_modules/devalue/src/base64.js
/**	@type {(array_buffer: ArrayBuffer) => string} */
function encode_native(array_buffer) {
	return new Uint8Array(array_buffer).toBase64();
}
/**	@type {(base64: string) => ArrayBuffer} */
function decode_native(base64) {
	return Uint8Array.fromBase64(base64).buffer;
}
/** @type {(array_buffer: ArrayBuffer) => string} */
function encode_buffer(array_buffer) {
	return Buffer.from(array_buffer).toString("base64");
}
/**	@type {(base64: string) => ArrayBuffer} */
function decode_buffer(base64) {
	return Uint8Array.from(Buffer.from(base64, "base64")).buffer;
}
/** @type {(array_buffer: ArrayBuffer) => string} */
function encode_legacy(array_buffer) {
	const array = new Uint8Array(array_buffer);
	let binary = "";
	const chunk_size = 32768;
	for (let i = 0; i < array.length; i += chunk_size) {
		const chunk = array.subarray(i, i + chunk_size);
		binary += String.fromCharCode.apply(null, chunk);
	}
	return btoa(binary);
}
/**	@type {(base64: string) => ArrayBuffer} */
function decode_legacy(base64) {
	const binary_string = atob(base64);
	const len = binary_string.length;
	const array = new Uint8Array(len);
	for (let i = 0; i < len; i++) array[i] = binary_string.charCodeAt(i);
	return array.buffer;
}
var native = typeof Uint8Array.fromBase64 === "function";
var buffer = typeof process === "object" && process.versions?.node !== void 0;
var encode64 = native ? encode_native : buffer ? encode_buffer : encode_legacy;
var decode64 = native ? decode_native : buffer ? decode_buffer : decode_legacy;
//#endregion
//#region ../../node_modules/.bun/devalue@5.8.1/node_modules/devalue/src/parse.js
/**
* Revive a value serialized with `devalue.stringify`
* @param {string} serialized
* @param {Record<string, (value: any) => any>} [revivers]
*/
function parse(serialized, revivers) {
	return unflatten(JSON.parse(serialized), revivers);
}
/**
* Revive a value flattened with `devalue.stringify`
* @param {number | any[]} parsed
* @param {Record<string, (value: any) => any>} [revivers]
*/
function unflatten(parsed, revivers) {
	if (typeof parsed === "number") return hydrate(parsed, true);
	if (!Array.isArray(parsed) || parsed.length === 0) throw new Error("Invalid input");
	const values = parsed;
	const hydrated = Array(values.length);
	/**
	* A set of values currently being hydrated with custom revivers,
	* used to detect invalid cyclical dependencies
	* @type {Set<number> | null}
	*/
	let hydrating = null;
	/**
	* @param {number} index
	* @returns {any}
	*/
	function hydrate(index, standalone = false) {
		if (index === -1) return void 0;
		if (index === -3) return NaN;
		if (index === -4) return Infinity;
		if (index === -5) return -Infinity;
		if (index === -6) return -0;
		if (standalone || typeof index !== "number") throw new Error(`Invalid input`);
		if (index in hydrated) return hydrated[index];
		const value = values[index];
		if (!value || typeof value !== "object") hydrated[index] = value;
		else if (Array.isArray(value)) if (typeof value[0] === "string") {
			const type = value[0];
			const reviver = revivers && Object.hasOwn(revivers, type) ? revivers[type] : void 0;
			if (reviver) {
				let i = value[1];
				if (typeof i !== "number") i = values.push(value[1]) - 1;
				hydrating ??= /* @__PURE__ */ new Set();
				if (hydrating.has(i)) throw new Error("Invalid circular reference");
				hydrating.add(i);
				hydrated[index] = reviver(hydrate(i));
				hydrating.delete(i);
				return hydrated[index];
			}
			switch (type) {
				case "Date":
					hydrated[index] = new Date(value[1]);
					break;
				case "Set":
					const set = /* @__PURE__ */ new Set();
					hydrated[index] = set;
					for (let i = 1; i < value.length; i += 1) set.add(hydrate(value[i]));
					break;
				case "Map":
					const map = /* @__PURE__ */ new Map();
					hydrated[index] = map;
					for (let i = 1; i < value.length; i += 2) map.set(hydrate(value[i]), hydrate(value[i + 1]));
					break;
				case "RegExp":
					hydrated[index] = new RegExp(value[1], value[2]);
					break;
				case "Object": {
					const wrapped_index = value[1];
					if (typeof values[wrapped_index] === "object" && values[wrapped_index][0] !== "BigInt") throw new Error("Invalid input");
					hydrated[index] = Object(hydrate(wrapped_index));
					break;
				}
				case "BigInt":
					hydrated[index] = BigInt(value[1]);
					break;
				case "null":
					const obj = Object.create(null);
					hydrated[index] = obj;
					for (let i = 1; i < value.length; i += 2) {
						if (value[i] === "__proto__") throw new Error("Cannot parse an object with a `__proto__` property");
						obj[value[i]] = hydrate(value[i + 1]);
					}
					break;
				case "Int8Array":
				case "Uint8Array":
				case "Uint8ClampedArray":
				case "Int16Array":
				case "Uint16Array":
				case "Float16Array":
				case "Int32Array":
				case "Uint32Array":
				case "Float32Array":
				case "Float64Array":
				case "BigInt64Array":
				case "BigUint64Array":
				case "DataView": {
					if (values[value[1]][0] !== "ArrayBuffer") throw new Error("Invalid data");
					const TypedArrayConstructor = globalThis[type];
					const buffer = hydrate(value[1]);
					hydrated[index] = value[2] !== void 0 ? new TypedArrayConstructor(buffer, value[2], value[3]) : new TypedArrayConstructor(buffer);
					break;
				}
				case "ArrayBuffer": {
					const base64 = value[1];
					if (typeof base64 !== "string") throw new Error("Invalid ArrayBuffer encoding");
					const arraybuffer = decode64(base64);
					hydrated[index] = arraybuffer;
					break;
				}
				case "Temporal.Duration":
				case "Temporal.Instant":
				case "Temporal.PlainDate":
				case "Temporal.PlainTime":
				case "Temporal.PlainDateTime":
				case "Temporal.PlainMonthDay":
				case "Temporal.PlainYearMonth":
				case "Temporal.ZonedDateTime": {
					const temporalName = type.slice(9);
					hydrated[index] = Temporal[temporalName].from(value[1]);
					break;
				}
				case "URL": {
					const url = new URL(value[1]);
					hydrated[index] = url;
					break;
				}
				case "URLSearchParams": {
					const url = new URLSearchParams(value[1]);
					hydrated[index] = url;
					break;
				}
				default: throw new Error(`Unknown type ${type}`);
			}
		} else if (value[0] === -7) {
			const len = value[1];
			if (!is_valid_array_len(len)) throw new Error("Invalid input");
			/** @type {any[]} */
			const array = [];
			hydrated[index] = array;
			array[MAX_ARRAY_INDEX] = void 0;
			delete array[MAX_ARRAY_INDEX];
			for (let i = 2; i < value.length; i += 2) {
				const idx = value[i];
				if (!is_valid_array_index(idx) || idx >= len) throw new Error("Invalid input");
				array[idx] = hydrate(value[i + 1]);
			}
			array.length = len;
		} else {
			const array = new Array(value.length);
			hydrated[index] = array;
			for (let i = 0; i < value.length; i += 1) {
				const n = value[i];
				if (n === -2) continue;
				array[i] = hydrate(n);
			}
		}
		else {
			/** @type {Record<string, any>} */
			const object = {};
			hydrated[index] = object;
			for (const key of Object.keys(value)) {
				if (key === "__proto__") throw new Error("Cannot parse an object with a `__proto__` property");
				const n = value[key];
				object[key] = hydrate(n);
			}
		}
		return hydrated[index];
	}
	return hydrate(0);
}
//#endregion
//#region ../../node_modules/.bun/devalue@5.8.1/node_modules/devalue/src/stringify.js
/**
* Turn a value into a JSON string that can be parsed with `devalue.parse`
* @param {any} value
* @param {Record<string, (value: any) => any>} [reducers]
*/
function stringify$1(value, reducers) {
	const stringified = run(false, value, reducers);
	return typeof stringified === "string" ? stringified : `[${stringified.join(",")}]`;
}
/**
* @param {boolean} async
* @param {any} value
* @param {Record<string, (value: any) => any>} [reducers]
*/
function run(async, value, reducers) {
	/** @type {any[]} */
	const stringified = [];
	/** @type {Map<any, number>} */
	const indexes = /* @__PURE__ */ new Map();
	/** @type {Array<{ key: string, fn: (value: any) => any }>} */
	const custom = [];
	if (reducers) for (const key of Object.getOwnPropertyNames(reducers)) custom.push({
		key,
		fn: reducers[key]
	});
	/** @type {string[]} */
	const keys = [];
	let p = 0;
	/**
	* @param {any} thing
	* @param {number} [index]
	*/
	function flatten(thing, index) {
		if (thing === void 0) return -1;
		if (Number.isNaN(thing)) return -3;
		if (thing === Infinity) return -4;
		if (thing === -Infinity) return -5;
		if (thing === 0 && 1 / thing < 0) return -6;
		if (indexes.has(thing)) return indexes.get(thing);
		index ??= p++;
		indexes.set(thing, index);
		for (const { key, fn } of custom) {
			const value = fn(thing);
			if (value) {
				stringified[index] = `["${key}",${flatten(value)}]`;
				return index;
			}
		}
		if (typeof thing === "function") throw new DevalueError(`Cannot stringify a function`, keys, thing, value);
		else if (typeof thing === "symbol") throw new DevalueError(`Cannot stringify a Symbol primitive`, keys, thing, value);
		/** @type {string | Promise<any>} */
		let str = "";
		if (is_primitive(thing)) str = stringify_primitive(thing);
		else if (typeof thing.then === "function") {
			throw new DevalueError(`Cannot stringify a Promise or thenable — use stringifyAsync instead`, keys, thing, value);
		} else {
			const type = get_type(thing);
			switch (type) {
				case "Number":
				case "String":
				case "Boolean":
				case "BigInt":
					str = `["Object",${flatten(thing.valueOf())}]`;
					break;
				case "Date":
					str = `["Date","${!isNaN(thing.getDate()) ? thing.toISOString() : ""}"]`;
					break;
				case "URL":
					str = `["URL",${stringify_string(thing.toString())}]`;
					break;
				case "URLSearchParams":
					str = `["URLSearchParams",${stringify_string(thing.toString())}]`;
					break;
				case "RegExp":
					const { source, flags } = thing;
					str = flags ? `["RegExp",${stringify_string(source)},"${flags}"]` : `["RegExp",${stringify_string(source)}]`;
					break;
				case "Array": {
					let mostly_dense = false;
					str = "[";
					for (let i = 0; i < thing.length; i += 1) {
						if (i > 0) str += ",";
						if (Object.hasOwn(thing, i)) {
							keys.push(`[${i}]`);
							str += flatten(thing[i]);
							keys.pop();
						} else if (mostly_dense) str += -2;
						else {
							const populated_keys = valid_array_indices(thing);
							const population = populated_keys.length;
							const d = String(thing.length).length;
							if ((thing.length - population) * 3 > 4 + d + population * (d + 1)) {
								str = "[-7," + thing.length;
								for (let j = 0; j < populated_keys.length; j++) {
									const key = populated_keys[j];
									keys.push(`[${key}]`);
									str += "," + key + "," + flatten(thing[key]);
									keys.pop();
								}
								break;
							} else {
								mostly_dense = true;
								str += -2;
							}
						}
					}
					str += "]";
					break;
				}
				case "Set":
					str = "[\"Set\"";
					for (const value of thing) str += `,${flatten(value)}`;
					str += "]";
					break;
				case "Map":
					str = "[\"Map\"";
					for (const [key, value] of thing) {
						keys.push(`.get(${is_primitive(key) ? stringify_primitive(key) : "..."})`);
						str += `,${flatten(key)},${flatten(value)}`;
						keys.pop();
					}
					str += "]";
					break;
				case "Int8Array":
				case "Uint8Array":
				case "Uint8ClampedArray":
				case "Int16Array":
				case "Uint16Array":
				case "Float16Array":
				case "Int32Array":
				case "Uint32Array":
				case "Float32Array":
				case "Float64Array":
				case "BigInt64Array":
				case "BigUint64Array":
				case "DataView": {
					/** @type {import("./types.js").TypedArray} */
					const typedArray = thing;
					str = "[\"" + type + "\"," + flatten(typedArray.buffer);
					if (typedArray.byteLength !== typedArray.buffer.byteLength) str += `,${typedArray.byteOffset},${typedArray.length}`;
					str += "]";
					break;
				}
				case "ArrayBuffer":
					str = `["ArrayBuffer","${encode64(thing)}"]`;
					break;
				case "Temporal.Duration":
				case "Temporal.Instant":
				case "Temporal.PlainDate":
				case "Temporal.PlainTime":
				case "Temporal.PlainDateTime":
				case "Temporal.PlainMonthDay":
				case "Temporal.PlainYearMonth":
				case "Temporal.ZonedDateTime":
					str = `["${type}",${stringify_string(thing.toString())}]`;
					break;
				default:
					if (!is_plain_object(thing)) throw new DevalueError(`Cannot stringify arbitrary non-POJOs`, keys, thing, value);
					if (enumerable_symbols(thing).length > 0) throw new DevalueError(`Cannot stringify POJOs with symbolic keys`, keys, thing, value);
					if (Object.getPrototypeOf(thing) === null) {
						str = "[\"null\"";
						for (const key of Object.keys(thing)) {
							if (key === "__proto__") throw new DevalueError(`Cannot stringify objects with __proto__ keys`, keys, thing, value);
							keys.push(stringify_key(key));
							str += `,${stringify_string(key)},${flatten(thing[key])}`;
							keys.pop();
						}
						str += "]";
					} else {
						str = "{";
						let started = false;
						for (const key of Object.keys(thing)) {
							if (key === "__proto__") throw new DevalueError(`Cannot stringify objects with __proto__ keys`, keys, thing, value);
							if (started) str += ",";
							started = true;
							keys.push(stringify_key(key));
							str += `${stringify_string(key)}:${flatten(thing[key])}`;
							keys.pop();
						}
						str += "}";
					}
			}
		}
		stringified[index] = str;
		return index;
	}
	const index = flatten(value);
	if (index < 0) return `${index}`;
	return stringified;
}
/**
* @param {any} thing
* @returns {string}
*/
function stringify_primitive(thing) {
	const type = typeof thing;
	if (type === "string") return stringify_string(thing);
	if (thing === void 0) return (-1).toString();
	if (thing === 0 && 1 / thing < 0) return (-6).toString();
	if (type === "bigint") return `["BigInt","${thing}"]`;
	return String(thing);
}
//#endregion
//#region ../../node_modules/.bun/@sveltejs+kit@2.69.3+ab726ce7a871e72d/node_modules/@sveltejs/kit/src/runtime/utils.js
var text_encoder = new TextEncoder();
/**
* Like node's path.relative, but without using node
* @param {string} from
* @param {string} to
*/
function get_relative_path(from, to) {
	const from_parts = from.split(/[/\\]/);
	const to_parts = to.split(/[/\\]/);
	from_parts.pop();
	while (from_parts[0] === to_parts[0]) {
		from_parts.shift();
		to_parts.shift();
	}
	let i = from_parts.length;
	while (i--) from_parts[i] = "..";
	return from_parts.concat(to_parts).join("/");
}
/**
* @param {Uint8Array} bytes
* @returns {string}
*/
function base64_encode(bytes) {
	if (globalThis.Buffer) return globalThis.Buffer.from(bytes).toString("base64");
	let binary = "";
	for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
	return btoa(binary);
}
/**
* @param {string} encoded
* @returns {Uint8Array}
*/
function base64_decode(encoded) {
	if (globalThis.Buffer) {
		const buffer = globalThis.Buffer.from(encoded, "base64");
		return new Uint8Array(buffer);
	}
	const binary = atob(encoded);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
	return bytes;
}
//#endregion
//#region ../../node_modules/.bun/@sveltejs+kit@2.69.3+ab726ce7a871e72d/node_modules/@sveltejs/kit/src/utils/error.js
/**
* @param {unknown} err
* @return {Error}
*/
function coalesce_to_error(err) {
	return err instanceof Error || err && err.name && err.message ? err : new Error(JSON.stringify(err));
}
/**
* This is an identity function that exists to make TypeScript less
* paranoid about people throwing things that aren't errors, which
* frankly is not something we should care about
* @param {unknown} error
*/
function normalize_error(error) {
	return error;
}
/**
* @param {unknown} error
*/
function get_status(error) {
	return error instanceof HttpError || error instanceof SvelteKitError ? error.status : 500;
}
/**
* @param {unknown} error
*/
function get_message(error) {
	return error instanceof SvelteKitError ? error.text : "Internal Error";
}
var INVALIDATED_PARAM = "x-sveltekit-invalidated";
var TRAILING_SLASH_PARAM = "x-sveltekit-trailing-slash";
/**
* Try to `devalue.stringify` the data object using the provided transport encoders.
* @param {any} data
* @param {Transport} transport
*/
function stringify(data, transport) {
	return stringify$1(data, Object.fromEntries(Object.entries(transport).map(([k, v]) => [k, v.encode])));
}
var remote_object = "__skrao";
var remote_map = "__skram";
var remote_set = "__skras";
var remote_file = "__skraf";
/** @param {Transport} transport */
function create_remote_arg_revivers(transport) {
	const remote_fns_revivers = {
		/** @type {(value: unknown) => unknown} */
		[remote_object]: (value) => value,
		/** @type {(value: unknown) => Map<unknown, unknown>} */
		[remote_map]: (value) => {
			if (!Array.isArray(value)) throw new Error("Invalid data for Map reviver");
			const map = /* @__PURE__ */ new Map();
			for (const item of value) {
				if (!Array.isArray(item) || item.length !== 2 || typeof item[0] !== "string" || typeof item[1] !== "string") throw new Error("Invalid data for Map reviver");
				const [key, val] = item;
				map.set(parse$1(key), parse$1(val));
			}
			return map;
		},
		/** @type {(value: unknown) => Set<unknown>} */
		[remote_set]: (value) => {
			if (!Array.isArray(value)) throw new Error("Invalid data for Set reviver");
			const set = /* @__PURE__ */ new Set();
			for (const item of value) {
				if (typeof item !== "string") throw new Error("Invalid data for Set reviver");
				set.add(parse$1(item));
			}
			return set;
		},
		/** @type {(value: any) => File} */
		[remote_file]: (value) => {
			if (!value || typeof value !== "object" || typeof value.name !== "string" || typeof value.type !== "string" || typeof value.size !== "number" || typeof value.lastModified !== "number" || !(value.data instanceof ArrayBuffer)) throw new Error("Invalid data for File reviver");
			const { data, name, ...meta } = value;
			return new File([data], name, meta);
		}
	};
	const all_revivers = {
		...Object.fromEntries(Object.entries(transport).map(([k, v]) => [k, v.decode])),
		...remote_fns_revivers
	};
	/** @type {(data: string) => unknown} */
	const parse$1 = (data) => parse(data, all_revivers);
	return all_revivers;
}
/**
* Parses the argument (if any) for a remote function
* @param {string} string
* @param {Transport} transport
*/
function parse_remote_arg(string, transport) {
	if (!string) return void 0;
	return parse(new TextDecoder().decode(base64_decode(string.replaceAll("-", "+").replaceAll("_", "/"))), create_remote_arg_revivers(transport));
}
/**
* @param {string} id
* @param {string} payload
*/
function create_remote_key(id, payload) {
	return id + "/" + payload;
}
/**
* @param {string} key
* @returns {{ id: string; payload: string }}
*/
function split_remote_key(key) {
	const i = key.lastIndexOf("/");
	if (i === -1) throw new Error(`Invalid remote key: ${key}`);
	return {
		id: key.slice(0, i),
		payload: key.slice(i + 1)
	};
}

//#region ../../node_modules/.bun/@sveltejs+kit@2.69.3+ab726ce7a871e72d/node_modules/@sveltejs/kit/src/runtime/app/paths/internal/server.js
var base = "";
var assets = base;
var app_dir = "_app";
var initial = {
	base,
	assets
};
/**
* @param {{ base: string, assets: string }} paths
*/
function override(paths) {
	base = paths.base;
	assets = paths.assets;
}
function reset() {
	base = initial.base;
	assets = initial.assets;
}

/** @import { StandardSchemaV1 } from '@standard-schema/spec' */


// TODO 3.0: remove these types as they are not used anymore (we can't remove them yet because that would be a breaking change)
/**
 * @template {number} TNumber
 * @template {any[]} [TArray=[]]
 * @typedef {TNumber extends TArray['length'] ? TArray[number] : LessThan<TNumber, [...TArray, TArray['length']]>} LessThan
 */

/**
 * @template {number} TStart
 * @template {number} TEnd
 * @typedef {Exclude<TEnd | LessThan<TEnd>, LessThan<TStart>>} NumericRange
 */

// Keep the status codes as `number` because restricting to certain numbers makes it unnecessarily hard to use compared to the benefits
// (we have runtime errors already to check for invalid codes). Also see https://github.com/sveltejs/kit/issues/11780

// we have to repeat the JSDoc because the display for function overloads is broken
// see https://github.com/microsoft/TypeScript/issues/55056

/**
 * Throws an error with a HTTP status code and an optional message.
 * When called during request handling, this will cause SvelteKit to
 * return an error response without invoking `handleError`.
 * Make sure you're not catching the thrown error, which would prevent SvelteKit from handling it.
 * @param {number} status The [HTTP status code](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#client_error_responses). Must be in the range 400-599.
 * @param {App.Error} body An object that conforms to the App.Error type. If a string is passed, it will be used as the message property.
 * @overload
 * @param {number} status
 * @param {App.Error} body
 * @return {never}
 * @throws {HttpError} This error instructs SvelteKit to initiate HTTP error handling.
 * @throws {Error} If the provided status is invalid (not between 400 and 599).
 */
/**
 * Throws an error with a HTTP status code and an optional message.
 * When called during request handling, this will cause SvelteKit to
 * return an error response without invoking `handleError`.
 * Make sure you're not catching the thrown error, which would prevent SvelteKit from handling it.
 * @param {number} status The [HTTP status code](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#client_error_responses). Must be in the range 400-599.
 * @param {{ message: string } extends App.Error ? App.Error | string | undefined : never} [body] An object that conforms to the App.Error type. If a string is passed, it will be used as the message property.
 * @overload
 * @param {number} status
 * @param {{ message: string } extends App.Error ? App.Error | string | undefined : never} [body]
 * @return {never}
 * @throws {HttpError} This error instructs SvelteKit to initiate HTTP error handling.
 * @throws {Error} If the provided status is invalid (not between 400 and 599).
 */
/**
 * Throws an error with a HTTP status code and an optional message.
 * When called during request handling, this will cause SvelteKit to
 * return an error response without invoking `handleError`.
 * Make sure you're not catching the thrown error, which would prevent SvelteKit from handling it.
 * @param {number} status The [HTTP status code](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#client_error_responses). Must be in the range 400-599.
 * @param {{ message: string } extends App.Error ? App.Error | string | undefined : never} body An object that conforms to the App.Error type. If a string is passed, it will be used as the message property.
 * @return {never}
 * @throws {HttpError} This error instructs SvelteKit to initiate HTTP error handling.
 * @throws {Error} If the provided status is invalid (not between 400 and 599).
 */
function error(status, body) {
	if ((isNaN(status) || status < 400 || status > 599)) {
		throw new Error(`HTTP error status codes must be between 400 and 599 — ${status} is invalid`);
	}

	throw new HttpError(status, body);
}

/**
 * Redirect a request. When called during request handling, SvelteKit will return a redirect response.
 * Make sure you're not catching the thrown redirect, which would prevent SvelteKit from handling it.
 *
 * Most common status codes:
 *  * `303 See Other`: redirect as a GET request (often used after a form POST request)
 *  * `307 Temporary Redirect`: redirect will keep the request method
 *  * `308 Permanent Redirect`: redirect will keep the request method, SEO will be transferred to the new page
 *
 * [See all redirect status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#redirection_messages)
 *
 * @param {300 | 301 | 302 | 303 | 304 | 305 | 306 | 307 | 308 | ({} & number)} status The [HTTP status code](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#redirection_messages). Must be in the range 300-308.
 * @param {string | URL} location The location to redirect to.
 * @throws {Redirect} This error instructs SvelteKit to redirect to the specified location.
 * @throws {Error} If the provided status is invalid or the location cannot be used as a header value.
 * @return {never}
 */
function redirect(status, location) {
	if ((isNaN(status) || status < 300 || status > 308)) {
		throw new Error('Invalid status code');
	}

	throw new Redirect(
		// @ts-ignore
		status,
		location.toString()
	);
}

/**
 * Checks whether this is a redirect thrown by {@link redirect}.
 * @param {unknown} e The object to check.
 * @return {e is Redirect}
 */
function isRedirect(e) {
	return e instanceof Redirect;
}

/**
 * Create a JSON `Response` object from the supplied data.
 * @param {any} data The value that will be serialized as JSON.
 * @param {ResponseInit} [init] Options such as `status` and `headers` that will be added to the response. `Content-Type: application/json` and `Content-Length` headers will be added automatically.
 */
function json(data, init) {
	// TODO deprecate this in favour of `Response.json` when it's
	// more widely supported
	const body = JSON.stringify(data);

	// we can't just do `text(JSON.stringify(data), init)` because
	// it will set a default `content-type` header. duplicated code
	// means less duplicated work
	const headers = new Headers(init?.headers);
	if (!headers.has('content-length')) {
		headers.set('content-length', text_encoder$2.encode(body).byteLength.toString());
	}

	if (!headers.has('content-type')) {
		headers.set('content-type', 'application/json');
	}

	return new Response(body, {
		...init,
		headers
	});
}

/**
 * Create a `Response` object from the supplied body.
 * @param {string} body The value that will be used as-is.
 * @param {ResponseInit} [init] Options such as `status` and `headers` that will be added to the response. A `Content-Length` header will be added automatically.
 */
function text(body, init) {
	const headers = new Headers(init?.headers);
	if (!headers.has('content-length')) {
		const encoded = text_encoder$2.encode(body);
		headers.set('content-length', encoded.byteLength.toString());
		return new Response(encoded, {
			...init,
			headers
		});
	}

	return new Response(body, {
		...init,
		headers
	});
}

// eslint-disable-next-line n/prefer-global/process
const IN_WEBCONTAINER$1 = !!globalThis.process?.versions?.webcontainer;

/** @import { RequestEvent } from '@sveltejs/kit' */
/** @import { RequestStore } from 'types' */
/** @import { AsyncLocalStorage } from 'node:async_hooks' */


/** @type {RequestStore | null} */
let sync_store = null;

/** @type {AsyncLocalStorage<RequestStore | null> | null} */
let als;

import('node:async_hooks')
	.then((hooks) => (als = new hooks.AsyncLocalStorage()))
	.catch(() => {
		// can't use AsyncLocalStorage, but can still call getRequestEvent synchronously.
		// this isn't behind `supports` because it's basically just StackBlitz (i.e.
		// in-browser usage) that doesn't support it AFAICT
	});

/**
 * @template T
 * @param {RequestStore | null} store
 * @param {() => T} fn
 */
function with_request_store(store, fn) {
	try {
		sync_store = store;
		return als ? als.run(store, fn) : fn();
	} finally {
		// Since AsyncLocalStorage is not working in webcontainers, we don't reset `sync_store`
		// and handle only one request at a time in `src/runtime/server/index.js`.
		if (!IN_WEBCONTAINER$1) {
			sync_store = null;
		}
	}
}

/**
 * @template {{ tracing: { enabled: boolean, root: import('@opentelemetry/api').Span, current: import('@opentelemetry/api').Span } }} T
 * @param {T} event_like
 * @param {import('@opentelemetry/api').Span} current
 * @returns {T}
 */
function merge_tracing(event_like, current) {
	return {
		...event_like,
		tracing: {
			...event_like.tracing,
			current
		}
	};
}

var ENDPOINT_METHODS = [
	"GET",
	"POST",
	"PUT",
	"PATCH",
	"DELETE",
	"OPTIONS",
	"HEAD"
];
var PAGE_METHODS = [
	"GET",
	"POST",
	"HEAD"
];
//#endregion
//#region ../../node_modules/.bun/set-cookie-parser@3.1.2/node_modules/set-cookie-parser/lib/set-cookie.js
var defaultParseOptions = {
	decodeValues: true,
	map: false,
	silent: false,
	split: "auto"
};
function isForbiddenKey(key) {
	return typeof key !== "string" || key in {};
}
function createNullObj() {
	return Object.create(null);
}
function isNonEmptyString(str) {
	return typeof str === "string" && !!str.trim();
}
function parseString(setCookieValue, options) {
	var parts = setCookieValue.split(";").filter(isNonEmptyString);
	var nameValuePairStr = parts.shift();
	if (!nameValuePairStr) return null;
	var parsed = parseNameValuePair(nameValuePairStr);
	var name = parsed.name;
	var value = parsed.value;
	options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;
	if (isForbiddenKey(name)) return null;
	try {
		value = options.decodeValues ? decodeURIComponent(value) : value;
	} catch (e) {
		console.error("set-cookie-parser: failed to decode cookie value. Set options.decodeValues=false to disable decoding.", e);
	}
	var cookie = createNullObj();
	cookie.name = name;
	cookie.value = value;
	parts.forEach(function(part) {
		var sides = part.split("=");
		var key = sides.shift().trim().toLowerCase();
		if (isForbiddenKey(key)) return;
		var value = sides.join("=").trim();
		if (key === "expires") cookie.expires = new Date(value);
		else if (key === "max-age") {
			var n = parseInt(value, 10);
			if (!Number.isNaN(n)) cookie.maxAge = n;
		} else if (key === "secure") cookie.secure = true;
		else if (key === "httponly") cookie.httpOnly = true;
		else if (key === "samesite") cookie.sameSite = value;
		else if (key === "partitioned") cookie.partitioned = true;
		else if (key) cookie[key] = value;
	});
	return cookie;
}
function parseNameValuePair(nameValuePairStr) {
	var name = "";
	var value = "";
	var nameValueArr = nameValuePairStr.split("=");
	if (nameValueArr.length > 1) {
		name = nameValueArr.shift();
		value = nameValueArr.join("=");
	} else value = nameValuePairStr;
	return {
		name,
		value
	};
}
function parseSetCookie(input, options) {
	options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;
	if (!input) if (!options.map) return [];
	else return createNullObj();
	if (input.headers) if (typeof input.headers.getSetCookie === "function") input = input.headers.getSetCookie();
	else if (input.headers["set-cookie"]) input = input.headers["set-cookie"];
	else {
		var sch = input.headers[Object.keys(input.headers).find(function(key) {
			return key.toLowerCase() === "set-cookie";
		})];
		if (!sch && input.headers.cookie && !options.silent) console.warn("Warning: set-cookie-parser appears to have been called on a request object. It is designed to parse Set-Cookie headers from responses, not Cookie headers from requests. Set the option {silent: true} to suppress this warning.");
		input = sch;
	}
	var split = options.split;
	var isArray = Array.isArray(input);
	if (split === "auto") split = !isArray;
	if (!isArray) input = [input];
	input = input.filter(isNonEmptyString);
	if (split) input = input.map(splitCookiesString).flat();
	if (!options.map) return input.map(function(str) {
		return parseString(str, options);
	}).filter(Boolean);
	else {
		var cookies = createNullObj();
		return input.reduce(function(cookies, str) {
			var cookie = parseString(str, options);
			if (cookie && !isForbiddenKey(cookie.name)) cookies[cookie.name] = cookie;
			return cookies;
		}, cookies);
	}
}
function splitCookiesString(cookiesString) {
	if (Array.isArray(cookiesString)) return cookiesString;
	if (typeof cookiesString !== "string") return [];
	var cookiesStrings = [];
	var pos = 0;
	var start;
	var ch;
	var lastComma;
	var nextStart;
	var cookiesSeparatorFound;
	function skipWhitespace() {
		while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) pos += 1;
		return pos < cookiesString.length;
	}
	function notSpecialChar() {
		ch = cookiesString.charAt(pos);
		return ch !== "=" && ch !== ";" && ch !== ",";
	}
	while (pos < cookiesString.length) {
		start = pos;
		cookiesSeparatorFound = false;
		while (skipWhitespace()) {
			ch = cookiesString.charAt(pos);
			if (ch === ",") {
				lastComma = pos;
				pos += 1;
				skipWhitespace();
				nextStart = pos;
				while (pos < cookiesString.length && notSpecialChar()) pos += 1;
				if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
					cookiesSeparatorFound = true;
					pos = nextStart;
					cookiesStrings.push(cookiesString.substring(start, lastComma));
					start = pos;
				} else pos = lastComma + 1;
			} else pos += 1;
		}
		if (!cookiesSeparatorFound || pos >= cookiesString.length) cookiesStrings.push(cookiesString.substring(start, cookiesString.length));
	}
	return cookiesStrings;
}
parseSetCookie.parseSetCookie = parseSetCookie;
parseSetCookie.parse = parseSetCookie;
parseSetCookie.parseString = parseString;
parseSetCookie.splitCookiesString = splitCookiesString;
//#endregion
//#region ../../node_modules/.bun/@sveltejs+kit@2.69.3+ab726ce7a871e72d/node_modules/@sveltejs/kit/src/runtime/form-utils.js
/** @import { RemoteForm } from '@sveltejs/kit' */
/** @import { BinaryFormMeta, InternalRemoteFormIssue } from 'types' */
/** @import { StandardSchemaV1 } from '@standard-schema/spec' */
var decoder = new TextDecoder();
/**
* Sets a value in a nested object using a path string, mutating the original object
* @param {Record<string, any>} object
* @param {string} path_string
* @param {any} value
*/
function set_nested_value(object, path_string, value) {
	if (path_string.startsWith("n:")) {
		path_string = path_string.slice(2);
		value = value === "" ? void 0 : parseFloat(value);
	} else if (path_string.startsWith("b:")) {
		path_string = path_string.slice(2);
		value = value === "on";
	}
	deep_set(object, split_path(path_string), value);
}
/** Pass this to set_nested_value to delete the last part of the given path */
var DELETE_KEY = {};
/**
* Convert `FormData` into a POJO
* @param {FormData} data
*/
function convert_formdata(data) {
	/** @type {Record<string, any>} */
	const result = {};
	for (let key of data.keys()) {
		const is_array = key.endsWith("[]");
		/** @type {any[]} */
		let values = data.getAll(key);
		if (is_array) key = key.slice(0, -2);
		values = values.filter((entry) => typeof entry === "string" || entry.name !== "" || entry.size > 0);
		if (values.length === 0 && !is_array) continue;
		if (key.startsWith("n:")) {
			key = key.slice(2);
			values = values.map((v) => v === "" ? void 0 : parseFloat(v));
		} else if (key.startsWith("b:")) {
			key = key.slice(2);
			values = values.map((v) => v === "on");
		}
		if (values.length > 1 && !is_array) throw new Error(`Form cannot contain duplicated keys — "${key}" has ${values.length} values`);
		set_nested_value(result, key, is_array ? values : values[0]);
	}
	return result;
}
var BINARY_FORM_CONTENT_TYPE = "application/x-sveltekit-formdata";
var BINARY_FORM_VERSION = 0;
var HEADER_BYTES = 7;
/**
* @param {Request} request
* @returns {Promise<{ data: Record<string, any>; meta: BinaryFormMeta; form_data: FormData | null }>}
*/
async function deserialize_binary_form(request) {
	if (request.headers.get("content-type") !== "application/x-sveltekit-formdata") {
		const form_data = await request.formData();
		return {
			data: convert_formdata(form_data),
			meta: {},
			form_data
		};
	}
	if (!request.body) throw deserialize_error("no body");
	const reader = request.body.getReader();
	/** @type {Array<Promise<Uint8Array<ArrayBuffer> | undefined>>} */
	const chunks = [];
	/**
	* @param {number} index
	* @returns {Promise<Uint8Array<ArrayBuffer> | undefined>}
	*/
	function get_chunk(index) {
		if (index in chunks) return chunks[index];
		let i = chunks.length;
		while (i <= index) {
			chunks[i] = reader.read().then((chunk) => chunk.value);
			i++;
		}
		return chunks[index];
	}
	/**
	* @param {number} offset
	* @param {number} length
	* @returns {Promise<Uint8Array | null>}
	*/
	async function get_buffer(offset, length) {
		/** @type {Uint8Array} */
		let start_chunk;
		let chunk_start = 0;
		/** @type {number} */
		let chunk_index;
		for (chunk_index = 0;; chunk_index++) {
			const chunk = await get_chunk(chunk_index);
			if (!chunk) return null;
			const chunk_end = chunk_start + chunk.byteLength;
			if (offset >= chunk_start && offset < chunk_end) {
				start_chunk = chunk;
				break;
			}
			chunk_start = chunk_end;
		}
		if (offset + length <= chunk_start + start_chunk.byteLength) return start_chunk.subarray(offset - chunk_start, offset + length - chunk_start);
		const chunks = [start_chunk.subarray(offset - chunk_start)];
		let cursor = start_chunk.byteLength - offset + chunk_start;
		while (cursor < length) {
			chunk_index++;
			let chunk = await get_chunk(chunk_index);
			if (!chunk) return null;
			if (chunk.byteLength > length - cursor) chunk = chunk.subarray(0, length - cursor);
			chunks.push(chunk);
			cursor += chunk.byteLength;
		}
		const buffer = new Uint8Array(length);
		cursor = 0;
		for (const chunk of chunks) {
			buffer.set(chunk, cursor);
			cursor += chunk.byteLength;
		}
		return buffer;
	}
	const header = await get_buffer(0, HEADER_BYTES);
	if (!header) throw deserialize_error("too short");
	if (header[0] !== BINARY_FORM_VERSION) throw deserialize_error(`got version ${header[0]}, expected version ${BINARY_FORM_VERSION}`);
	const header_view = new DataView(header.buffer, header.byteOffset, header.byteLength);
	const data_length = header_view.getUint32(1, true);
	const file_offsets_length = header_view.getUint16(5, true);
	const data_buffer = await get_buffer(HEADER_BYTES, data_length);
	if (!data_buffer) throw deserialize_error("data too short");
	/** @type {Array<number | undefined>} */
	let file_offsets;
	/** @type {number} */
	let files_start_offset;
	if (file_offsets_length > 0) {
		const file_offsets_buffer = await get_buffer(HEADER_BYTES + data_length, file_offsets_length);
		if (!file_offsets_buffer) throw deserialize_error("file offset table too short");
		const parsed_offsets = JSON.parse(decoder.decode(file_offsets_buffer));
		if (!Array.isArray(parsed_offsets) || parsed_offsets.some((n) => typeof n !== "number" || !Number.isInteger(n) || n < 0)) throw deserialize_error("invalid file offset table");
		file_offsets = parsed_offsets;
		files_start_offset = HEADER_BYTES + data_length + file_offsets_length;
	}
	/** @type {Array<{ offset: number, size: number }>} */
	const file_spans = [];
	const [data, meta] = parse(decoder.decode(data_buffer), { File: ([name, type, size, last_modified, index]) => {
		if (typeof name !== "string" || typeof type !== "string" || typeof size !== "number" || typeof last_modified !== "number" || typeof index !== "number") throw deserialize_error("invalid file metadata");
		let offset = file_offsets[index];
		if (offset === void 0) throw deserialize_error("duplicate file offset table index");
		file_offsets[index] = void 0;
		offset += files_start_offset;
		file_spans.push({
			offset,
			size
		});
		return new Proxy(new LazyFile(name, type, size, last_modified, get_chunk, offset), { getPrototypeOf() {
			return File.prototype;
		} });
	} });
	file_spans.sort((a, b) => a.offset - b.offset || a.size - b.size);
	for (let i = 1; i < file_spans.length; i++) {
		const previous = file_spans[i - 1];
		const current = file_spans[i];
		const previous_end = previous.offset + previous.size;
		if (previous_end < current.offset) throw deserialize_error("gaps in file data");
		if (previous_end > current.offset) throw deserialize_error("overlapping file data");
	}
	(async () => {
		let has_more = true;
		while (has_more) has_more = !!await get_chunk(chunks.length);
	})().catch(noop);
	return {
		data,
		meta,
		form_data: null
	};
}
/**
* @param {string} message
*/
function deserialize_error(message) {
	return new SvelteKitError(400, "Bad Request", `Could not deserialize binary form: ${message}`);
}
/** @implements {File} */
var LazyFile = class LazyFile {
	/** @type {(index: number) => Promise<Uint8Array<ArrayBuffer> | undefined>} */
	#get_chunk;
	/** @type {number} */
	#offset;
	/**
	* @param {string} name
	* @param {string} type
	* @param {number} size
	* @param {number} last_modified
	* @param {(index: number) => Promise<Uint8Array<ArrayBuffer> | undefined>} get_chunk
	* @param {number} offset
	*/
	constructor(name, type, size, last_modified, get_chunk, offset) {
		this.name = name;
		this.type = type;
		this.size = size;
		this.lastModified = last_modified;
		this.webkitRelativePath = "";
		this.#get_chunk = get_chunk;
		this.#offset = offset;
		this.arrayBuffer = this.arrayBuffer.bind(this);
		this.bytes = this.bytes.bind(this);
		this.slice = this.slice.bind(this);
		this.stream = this.stream.bind(this);
		this.text = this.text.bind(this);
	}
	/** @type {ArrayBuffer | undefined} */
	#buffer;
	async arrayBuffer() {
		this.#buffer ??= await new Response(this.stream()).arrayBuffer();
		return this.#buffer;
	}
	async bytes() {
		return new Uint8Array(await this.arrayBuffer());
	}
	/**
	* @param {number=} start
	* @param {number=} end
	* @param {string=} contentType
	*/
	slice(start = 0, end = this.size, contentType = this.type) {
		if (start < 0) start = Math.max(this.size + start, 0);
		else start = Math.min(start, this.size);
		if (end < 0) end = Math.max(this.size + end, 0);
		else end = Math.min(end, this.size);
		const size = Math.max(end - start, 0);
		return new LazyFile(this.name, contentType, size, this.lastModified, this.#get_chunk, this.#offset + start);
	}
	stream() {
		let cursor = 0;
		let chunk_index = 0;
		return new ReadableStream({
			start: async (controller) => {
				let chunk_start = 0;
				/** @type {Uint8Array} */
				let start_chunk;
				for (chunk_index = 0;; chunk_index++) {
					const chunk = await this.#get_chunk(chunk_index);
					if (!chunk) return null;
					const chunk_end = chunk_start + chunk.byteLength;
					if (this.#offset >= chunk_start && this.#offset < chunk_end) {
						start_chunk = chunk;
						break;
					}
					chunk_start = chunk_end;
				}
				if (this.#offset + this.size <= chunk_start + start_chunk.byteLength) {
					controller.enqueue(start_chunk.subarray(this.#offset - chunk_start, this.#offset + this.size - chunk_start));
					controller.close();
				} else {
					controller.enqueue(start_chunk.subarray(this.#offset - chunk_start));
					cursor = start_chunk.byteLength - this.#offset + chunk_start;
				}
			},
			pull: async (controller) => {
				chunk_index++;
				let chunk = await this.#get_chunk(chunk_index);
				if (!chunk) {
					controller.error("incomplete file data");
					controller.close();
					return;
				}
				if (chunk.byteLength > this.size - cursor) chunk = chunk.subarray(0, this.size - cursor);
				controller.enqueue(chunk);
				cursor += chunk.byteLength;
				if (cursor >= this.size) controller.close();
			}
		});
	}
	async text() {
		return decoder.decode(await this.arrayBuffer());
	}
};
var path_regex = /^[a-zA-Z_$]\w*(\.[a-zA-Z_$]\w*|\[\d+\])*$/;
/**
* @param {string} path
*/
function split_path(path) {
	if (!path_regex.test(path)) throw new Error(`Invalid path ${path}`);
	return path.split(/\.|\[|\]/).filter(Boolean);
}
/**
* Check if a property key is dangerous and could lead to prototype pollution
* @param {string} key
*/
function check_prototype_pollution(key) {
	if (key === "__proto__" || key === "constructor" || key === "prototype") throw new Error(`Invalid key "${key}"`);
}
/**
* Sets a value in a nested object using an array of keys, mutating the original object.
* @param {Record<string, any>} object
* @param {string[]} keys
* @param {any} value
*/
function deep_set(object, keys, value) {
	let current = object;
	for (let i = 0; i < keys.length - 1; i += 1) {
		const key = keys[i];
		check_prototype_pollution(key);
		const is_array = /^\d+$/.test(keys[i + 1]);
		const inner = Object.hasOwn(current, key) ? current[key] : void 0;
		const exists = inner != null;
		if (exists && is_array !== Array.isArray(inner)) throw new Error(`Invalid array key ${keys[i + 1]}`);
		if (!exists) {
			if (value === DELETE_KEY) return;
			current[key] = is_array ? [] : {};
		}
		current = current[key];
	}
	const final_key = keys[keys.length - 1];
	check_prototype_pollution(final_key);
	if (value === DELETE_KEY) delete current[final_key];
	else current[final_key] = value;
}
//#endregion
//#region ../../node_modules/.bun/@sveltejs+kit@2.69.3+ab726ce7a871e72d/node_modules/@sveltejs/kit/src/utils/http.js
/**
* Given an Accept header and a list of possible content types, pick
* the most suitable one to respond with
* @param {string} accept
* @param {string[]} types
*/
function negotiate(accept, types) {
	/** @type {Array<{ type: string, subtype: string, q: number, i: number }>} */
	const parts = [];
	accept.split(",").forEach((str, i) => {
		const match = /([^/ \t]+)\/([^; \t]+)[ \t]*(?:;[ \t]*q=([0-9.]+))?/.exec(str);
		if (match) {
			const [, type, subtype, q = "1"] = match;
			parts.push({
				type,
				subtype,
				q: +q,
				i
			});
		}
	});
	parts.sort((a, b) => {
		if (a.q !== b.q) return b.q - a.q;
		if (a.subtype === "*" !== (b.subtype === "*")) return a.subtype === "*" ? 1 : -1;
		if (a.type === "*" !== (b.type === "*")) return a.type === "*" ? 1 : -1;
		return a.i - b.i;
	});
	let accepted;
	let min_priority = Infinity;
	for (const mimetype of types) {
		const [type, subtype] = mimetype.split("/");
		const priority = parts.findIndex((part) => (part.type === type || part.type === "*") && (part.subtype === subtype || part.subtype === "*"));
		if (priority !== -1 && priority < min_priority) {
			accepted = mimetype;
			min_priority = priority;
		}
	}
	return accepted;
}
/**
* Reads all `Set-Cookie` headers as separate values. `Headers.get('set-cookie')`
* collapses them into a single comma-joined string that browsers cannot parse, so
* we use `Headers.getSetCookie()` where available and fall back to splitting the
* joined string otherwise.
*
* TODO 3.0 `getSetCookie` is available in Node 19.7+; once we drop support for
* older versions we can use it directly and remove the `splitCookiesString` fallback
* @param {Headers} headers
* @returns {string[]}
*/
function get_set_cookies(headers) {
	if (typeof headers.getSetCookie === "function") return headers.getSetCookie();
	const set_cookie = headers.get("set-cookie");
	return set_cookie ? splitCookiesString(set_cookie) : [];
}
/**
* Returns `true` if the request contains a `content-type` header with the given type
* @param {Request} request
* @param  {...string} types
*/
function is_content_type(request, ...types) {
	const type = request.headers.get("content-type")?.split(";", 1)[0].trim() ?? "";
	return types.includes(type.toLowerCase());
}
/**
* @param {Request} request
*/
function is_form_content_type(request) {
	return is_content_type(request, "application/x-www-form-urlencoded", "multipart/form-data", "text/plain", BINARY_FORM_CONTENT_TYPE);
}
//#endregion
//#region ../../node_modules/.bun/@sveltejs+kit@2.69.3+ab726ce7a871e72d/node_modules/@sveltejs/kit/src/utils/escape.js
/**
* When inside a double-quoted attribute value, only `&` and `"` hold special meaning.
* @see https://html.spec.whatwg.org/multipage/parsing.html#attribute-value-(double-quoted)-state
* @type {Record<string, string>}
*/
var escape_html_attr_dict = {
	"&": "&amp;",
	"\"": "&quot;"
};
/**
* @type {Record<string, string>}
*/
var escape_html_dict = {
	"&": "&amp;",
	"<": "&lt;"
};
var escape_html_attr_regex = new RegExp(`[${Object.keys(escape_html_attr_dict).join("")}]|[\\ud800-\\udbff](?![\\udc00-\\udfff])|[\\ud800-\\udbff][\\udc00-\\udfff]|[\\udc00-\\udfff]`, "g");
var escape_html_regex = new RegExp(`[${Object.keys(escape_html_dict).join("")}]|[\\ud800-\\udbff](?![\\udc00-\\udfff])|[\\ud800-\\udbff][\\udc00-\\udfff]|[\\udc00-\\udfff]`, "g");
/**
* Escapes unpaired surrogates (which are allowed in js strings but invalid in HTML) and
* escapes characters that are special.
*
* @param {string} str
* @param {boolean} [is_attr]
* @returns {string} escaped string
* @example const html = `<tag data-value="${escape_html('value', true)}">...</tag>`;
*/
function escape_html(str, is_attr) {
	const dict = is_attr ? escape_html_attr_dict : escape_html_dict;
	return str.replace(is_attr ? escape_html_attr_regex : escape_html_regex, (match) => {
		if (match.length === 2) return match;
		return dict[match] ?? `&#${match.charCodeAt(0)};`;
	});
}
//#endregion
//#region ../../node_modules/.bun/@sveltejs+kit@2.69.3+ab726ce7a871e72d/node_modules/@sveltejs/kit/src/runtime/server/utils.js
/** @import { ServerHooks } from 'types' */
/**
* @param {Partial<Record<import('types').HttpMethod, any>>} mod
* @param {import('types').HttpMethod} method
*/
function method_not_allowed(mod, method) {
	return text(`${method} method not allowed`, {
		status: 405,
		headers: { allow: allowed_methods(mod).join(", ") }
	});
}
/** @param {Partial<Record<import('types').HttpMethod, any>>} mod */
function allowed_methods(mod) {
	const allowed = ENDPOINT_METHODS.filter((method) => method in mod);
	if ("GET" in mod && !("HEAD" in mod)) allowed.push("HEAD");
	return allowed;
}
/**
* @param {import('types').SSROptions} options
*/
function get_global_name(options) {
	return `__sveltekit_${options.version_hash}`;
}
/**
* Return as a response that renders the error.html
*
* @param {import('types').SSROptions} options
* @param {number} status
* @param {string} message
*/
function static_error_page(options, status, message) {
	return text(options.templates.error({
		status,
		message: escape_html(message)
	}), {
		headers: { "content-type": "text/html; charset=utf-8" },
		status
	});
}
/**
* @param {import('@sveltejs/kit').RequestEvent} event
* @param {import('types').RequestState} state
* @param {import('types').SSROptions} options
* @param {unknown} error
*/
async function handle_fatal_error(event, state, options, error) {
	error = error instanceof HttpError ? error : coalesce_to_error(error);
	const status = get_status(error);
	const body = await handle_error_and_jsonify(event, state, options, error);
	const type = negotiate(event.request.headers.get("accept") || "text/html", ["application/json", "text/html"]);
	if (event.isDataRequest || type === "application/json") return json(body, { status });
	return static_error_page(options, status, body.message);
}
/**
* @param {import('@sveltejs/kit').RequestEvent} event
* @param {import('types').RequestState} state
* @param {import('types').SSROptions} options
* @param {any} error
* @returns {Promise<App.Error>}
*/
async function handle_error_and_jsonify(event, state, options, error) {
	if (error instanceof HttpError) return {
		message: "Unknown Error",
		...error.body
	};
	const status = get_status(error);
	const message = get_message(error);
	return await with_request_store({
		event,
		state
	}, () => options.hooks.handleError({
		error,
		event,
		status,
		message
	})) ?? { message };
}
/**
* @param {number} status
* @param {string} location
*/
function redirect_response(status, location) {
	return new Response(void 0, {
		status,
		headers: { location }
	});
}
/**
* @param {import('@sveltejs/kit').RequestEvent} event
* @param {Error & { path: string }} error
*/
function clarify_devalue_error(event, error) {
	if (error.path) return `Data returned from \`load\` while rendering ${event.route.id} is not serializable: ${error.message} (${error.path}). If you need to serialize/deserialize custom types, use transport hooks: https://svelte.dev/docs/kit/hooks#Universal-hooks-transport.`;
	if (error.path === "") return `Data returned from \`load\` while rendering ${event.route.id} is not a plain object`;
	return error.message;
}
/**
* @param {import('types').ServerDataNode} node
*/
function serialize_uses(node) {
	const uses = {};
	if (node.uses && node.uses.dependencies.size > 0) uses.dependencies = Array.from(node.uses.dependencies);
	if (node.uses && node.uses.search_params.size > 0) uses.search_params = Array.from(node.uses.search_params);
	if (node.uses && node.uses.params.size > 0) uses.params = Array.from(node.uses.params);
	if (node.uses?.parent) uses.parent = 1;
	if (node.uses?.route) uses.route = 1;
	if (node.uses?.url) uses.url = 1;
	return uses;
}
/**
* Returns `true` if the given path was prerendered
* @param {import('@sveltejs/kit').SSRManifest} manifest
* @param {string} pathname Should include the base and be decoded
*/
function has_prerendered_path(manifest, pathname) {
	return manifest._.prerendered_routes.has(pathname) || pathname.at(-1) === "/" && manifest._.prerendered_routes.has(pathname.slice(0, -1));
}
/**
* Formats the error into a nice message with sanitized stack trace
* @param {number} status
* @param {Error} error
* @param {import('@sveltejs/kit').RequestEvent} event
*/
function format_server_error(status, error, event) {
	const formatted_text = `\n\x1b[1;31m[${status}] ${event.request.method} ${event.url.pathname}\x1b[0m`;
	if (status === 404) return formatted_text;
	return `${formatted_text}\n${error.stack}`;
}
/**
* Returns the filename without the extension. e.g., `+page.server`, `+page`, etc.
* @param {string | undefined} node_id
* @returns {string}
*/
function get_node_type(node_id) {
	const filename = (node_id?.split("/"))?.at(-1);
	if (!filename) return "unknown";
	return filename.split(".").slice(0, -1).join(".");
}
/**
* Creates a serialiser for non-arbitrary POJOs using the app's transport hook
* @param {ServerHooks['transport']} transport
* @returns {(thing: unknown) => string | undefined}
*/
function create_replacer(transport) {
	/** @param {unknown} thing */
	const replacer = (thing) => {
		for (const key in transport) {
			const encoded = transport[key].encode(thing);
			if (encoded) return `app.decode('${key}', ${uneval(encoded, replacer)})`;
		}
	};
	return replacer;
}

//#region ../../node_modules/.bun/@sveltejs+kit@2.69.3+ab726ce7a871e72d/node_modules/@sveltejs/kit/src/runtime/shared-server.js
/**
* `$env/dynamic/private`
* @type {Record<string, string>}
*/
var private_env = {};
/**
* `$env/dynamic/public`
* @type {Record<string, string>}
*/
var public_env = {};
/** @type {(environment: Record<string, string>) => void} */
function set_private_env(environment) {
	private_env = environment;
}
/** @type {(environment: Record<string, string>) => void} */
function set_public_env(environment) {
	public_env = environment;
}

//#region ../../node_modules/.bun/@sveltejs+kit@2.69.3+ab726ce7a871e72d/node_modules/@sveltejs/kit/src/utils/array.js
/**
* Removes nullish values from an array.
*
* @template T
* @param {Array<T>} arr
*/
function compact(arr) {
	return arr.filter(
		/** @returns {val is NonNullable<T>} */
		(val) => val != null
	);
}
//#endregion
//#region ../../node_modules/.bun/@sveltejs+kit@2.69.3+ab726ce7a871e72d/node_modules/@sveltejs/kit/src/runtime/pathname.js
var DATA_SUFFIX = "/__data.json";
var HTML_DATA_SUFFIX = ".html__data.json";
/** @param {string} pathname */
function has_data_suffix(pathname) {
	return pathname.endsWith(DATA_SUFFIX) || pathname.endsWith(HTML_DATA_SUFFIX);
}
/** @param {string} pathname */
function add_data_suffix(pathname) {
	if (pathname.endsWith(".html")) return pathname.replace(/\.html$/, HTML_DATA_SUFFIX);
	return pathname.replace(/\/$/, "") + DATA_SUFFIX;
}
/** @param {string} pathname */
function strip_data_suffix(pathname) {
	if (pathname.endsWith(HTML_DATA_SUFFIX)) return pathname.slice(0, -16) + ".html";
	return pathname.slice(0, -12);
}
var ROUTE_SUFFIX = "/__route.js";
/**
* @param {string} pathname
* @returns {boolean}
*/
function has_resolution_suffix(pathname) {
	return pathname.endsWith(ROUTE_SUFFIX);
}
/**
* Convert a regular URL to a route to send to SvelteKit's server-side route resolution endpoint
* @param {string} pathname
* @returns {string}
*/
function add_resolution_suffix(pathname) {
	return pathname.replace(/\/$/, "") + ROUTE_SUFFIX;
}
/**
* @param {string} pathname
* @returns {string}
*/
function strip_resolution_suffix(pathname) {
	return pathname.slice(0, -11);
}
//#endregion
//#region ../../node_modules/.bun/@sveltejs+kit@2.69.3+ab726ce7a871e72d/node_modules/@sveltejs/kit/src/runtime/telemetry/noop.js
/**
* @type {Span}
*/
var noop_span = {
	spanContext() {
		return noop_span_context;
	},
	setAttribute() {
		return this;
	},
	setAttributes() {
		return this;
	},
	addEvent() {
		return this;
	},
	setStatus() {
		return this;
	},
	updateName() {
		return this;
	},
	end() {
		return this;
	},
	isRecording() {
		return false;
	},
	recordException() {
		return this;
	},
	addLink() {
		return this;
	},
	addLinks() {
		return this;
	}
};
/**
* @type {SpanContext}
*/
var noop_span_context = {
	traceId: "",
	spanId: "",
	traceFlags: 0
};
var internal = new URL("sveltekit-internal://");
/**
* @param {string} base
* @param {string} path
*/
function resolve(base, path) {
	if (path[0] === "/" && path[1] === "/") return path;
	let url = new URL(base, internal);
	url = new URL(path, url);
	return url.protocol === internal.protocol ? url.pathname + url.search + url.hash : url.href;
}
/**
* @param {string} path
* @param {import('types').TrailingSlash} trailing_slash
*/
function normalize_path(path, trailing_slash) {
	if (path === "/" || trailing_slash === "ignore") return path;
	if (trailing_slash === "never") return path.endsWith("/") ? path.slice(0, -1) : path;
	else if (trailing_slash === "always" && !path.endsWith("/")) return path + "/";
	return path;
}
/**
* Decode pathname excluding %25 to prevent further double decoding of params
* @param {string} pathname
*/
function decode_pathname(pathname) {
	return pathname.split("%25").map(decodeURI).join("%25");
}
/** @param {Record<string, string>} params */
function decode_params(params) {
	for (const key in params) params[key] = decodeURIComponent(params[key]);
	return params;
}
/**
* @param {URL} url
* @param {() => void} callback
* @param {(search_param: string) => void} search_params_callback
* @param {boolean} [allow_hash]
*/
function make_trackable(url, callback, search_params_callback, allow_hash = false) {
	const tracked = new URL(url);
	Object.defineProperty(tracked, "searchParams", {
		value: new Proxy(tracked.searchParams, { get(obj, key) {
			if (key === "get" || key === "getAll" || key === "has") return (param, ...rest) => {
				search_params_callback(param);
				return obj[key](param, ...rest);
			};
			callback();
			const value = Reflect.get(obj, key);
			return typeof value === "function" ? value.bind(obj) : value;
		} }),
		enumerable: true,
		configurable: true
	});
	/**
	* URL properties that could change during the lifetime of the page,
	* which excludes things like `origin`
	* @type {(keyof URL)[]}
	*/
	const tracked_url_properties = [
		"href",
		"pathname",
		"search",
		"toString",
		"toJSON"
	];
	if (allow_hash) tracked_url_properties.push("hash");
	for (const property of tracked_url_properties) Object.defineProperty(tracked, property, {
		get() {
			callback();
			return url[property];
		},
		enumerable: true,
		configurable: true
	});
	tracked[Symbol.for("nodejs.util.inspect.custom")] = (_depth, opts, inspect) => {
		return inspect(url, opts);
	};
	tracked.searchParams[Symbol.for("nodejs.util.inspect.custom")] = (_depth, opts, inspect) => {
		return inspect(url.searchParams, opts);
	};
	if (!allow_hash) disable_hash(tracked);
	return tracked;
}
/**
* Disallow access to `url.hash` on the server and in `load`
* @param {URL} url
*/
function disable_hash(url) {
	allow_nodejs_console_log(url);
	Object.defineProperty(url, "hash", { get() {
		throw new Error("Cannot access event.url.hash. Consider using `page.url.hash` inside a component instead");
	} });
}
/**
* Disallow access to `url.search` and `url.searchParams` during prerendering
* @param {URL} url
*/
function disable_search(url) {
	allow_nodejs_console_log(url);
	for (const property of ["search", "searchParams"]) Object.defineProperty(url, property, { get() {
		throw new Error(`Cannot access url.${property} on a page with prerendering enabled`);
	} });
}
/**
* Allow URL to be console logged, bypassing disabled properties.
* @param {URL} url
*/
function allow_nodejs_console_log(url) {
	url[Symbol.for("nodejs.util.inspect.custom")] = (_depth, opts, inspect) => {
		return inspect(new URL(url), opts);
	};
}
//#endregion
//#region ../../node_modules/.bun/@sveltejs+kit@2.69.3+ab726ce7a871e72d/node_modules/@sveltejs/kit/src/utils/hash.js
/**
* Hash using djb2
* @param {import('types').StrictBody[]} values
*/
function hash(...values) {
	let hash = 5381;
	for (const value of values) if (typeof value === "string") {
		let i = value.length;
		while (i) hash = hash * 33 ^ value.charCodeAt(--i);
	} else if (ArrayBuffer.isView(value)) {
		const buffer = new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
		let i = buffer.length;
		while (i) hash = hash * 33 ^ buffer[--i];
	} else throw new TypeError("value must be a string or TypedArray");
	return (hash >>> 0).toString(36);
}
//#endregion
//#region ../../node_modules/.bun/@sveltejs+kit@2.69.3+ab726ce7a871e72d/node_modules/@sveltejs/kit/src/utils/routing.js
/**
* @param {RegExpMatchArray} match
* @param {import('types').RouteParam[]} params
* @param {Record<string, import('@sveltejs/kit').ParamMatcher>} matchers
*/
function exec(match, params, matchers) {
	/** @type {Record<string, string>} */
	const result = {};
	const values = match.slice(1);
	const values_needing_match = values.filter((value) => value !== void 0);
	let buffered = 0;
	for (let i = 0; i < params.length; i += 1) {
		const param = params[i];
		let value = values[i - buffered];
		if (param.chained && param.rest && buffered) {
			value = values.slice(i - buffered, i + 1).filter((s) => s).join("/");
			buffered = 0;
		}
		if (value === void 0) if (param.rest) value = "";
		else continue;
		if (!param.matcher || matchers[param.matcher](value)) {
			result[param.name] = value;
			const next_param = params[i + 1];
			const next_value = values[i + 1];
			if (next_param && !next_param.rest && next_param.optional && next_value && param.chained) buffered = 0;
			if (!next_param && !next_value && Object.keys(result).length === values_needing_match.length) buffered = 0;
			continue;
		}
		if (param.optional && param.chained) {
			buffered++;
			continue;
		}
		return;
	}
	if (buffered) return;
	return result;
}
/**
* Find the first route that matches the given path
* @template {{pattern: RegExp, params: import('types').RouteParam[]}} Route
* @param {string} path - The decoded pathname to match
* @param {Route[]} routes
* @param {Record<string, import('@sveltejs/kit').ParamMatcher>} matchers
* @returns {{ route: Route, params: Record<string, string> } | null}
*/
function find_route(path, routes, matchers) {
	for (const route of routes) {
		const match = route.pattern.exec(path);
		if (!match) continue;
		const matched = exec(match, route.params, matchers);
		if (matched) return {
			route,
			params: decode_params(matched)
		};
	}
	return null;
}
//#endregion
//#region ../../node_modules/.bun/@sveltejs+kit@2.69.3+ab726ce7a871e72d/node_modules/@sveltejs/kit/src/utils/exports.js
/**
* @param {Set<string>} expected
*/
function validator(expected) {
	/**
	* @param {any} module
	* @param {string} [file]
	*/
	function validate(module, file) {
		if (!module) return;
		for (const key in module) {
			if (key[0] === "_" || expected.has(key)) continue;
			const values = [...expected.values()];
			const hint = hint_for_supported_files(key, file?.slice(file.lastIndexOf("."))) ?? `valid exports are ${values.join(", ")}, or anything with a '_' prefix`;
			throw new Error(`Invalid export '${key}'${file ? ` in ${file}` : ""} (${hint})`);
		}
	}
	return validate;
}
/**
* @param {string} key
* @param {string} ext
* @returns {string | void}
*/
function hint_for_supported_files(key, ext = ".js") {
	const supported_files = [];
	if (valid_layout_exports.has(key)) supported_files.push(`+layout${ext}`);
	if (valid_page_exports.has(key)) supported_files.push(`+page${ext}`);
	if (valid_layout_server_exports.has(key)) supported_files.push(`+layout.server${ext}`);
	if (valid_page_server_exports.has(key)) supported_files.push(`+page.server${ext}`);
	if (valid_server_exports.has(key)) supported_files.push(`+server${ext}`);
	if (supported_files.length > 0) return `'${key}' is a valid export in ${supported_files.slice(0, -1).join(", ")}${supported_files.length > 1 ? " or " : ""}${supported_files.at(-1)}`;
}
var valid_layout_exports = /* @__PURE__ */ new Set([
	"load",
	"prerender",
	"csr",
	"ssr",
	"trailingSlash",
	"config"
]);
var valid_page_exports = /* @__PURE__ */ new Set([...valid_layout_exports, "entries"]);
var valid_layout_server_exports = /* @__PURE__ */ new Set([...valid_layout_exports]);
var valid_page_server_exports = /* @__PURE__ */ new Set([
	...valid_layout_server_exports,
	"actions",
	"entries"
]);
var valid_server_exports = /* @__PURE__ */ new Set([
	"GET",
	"POST",
	"PATCH",
	"PUT",
	"DELETE",
	"OPTIONS",
	"HEAD",
	"fallback",
	"prerender",
	"trailingSlash",
	"config",
	"entries"
]);
var validate_layout_exports = validator(valid_layout_exports);
var validate_page_exports = validator(valid_page_exports);
var validate_layout_server_exports = validator(valid_layout_server_exports);
var validate_page_server_exports = validator(valid_page_server_exports);

//#region \0virtual:__sveltekit/server
var read_implementation = null;
function set_read_implementation(fn) {
	read_implementation = fn;
}
//#endregion
//#region ../../node_modules/.bun/svelte@5.56.5/node_modules/svelte/src/legacy/legacy-server.js
/** @import { SvelteComponent } from '../index.js' */
/** @import { Csp } from '#server' */
/** @typedef {{ head: string, html: string, css: { code: string, map: null }; hashes?: { script: `sha256-${string}`[] } }} LegacyRenderResult */
/**
* Takes a Svelte 5 component and returns a Svelte 4 compatible component constructor.
*
* @deprecated Use this only as a temporary solution to migrate your imperative component code to Svelte 5.
*
* @template {Record<string, any>} Props
* @template {Record<string, any>} Exports
* @template {Record<string, any>} Events
* @template {Record<string, any>} Slots
*
* @param {SvelteComponent<Props, Events, Slots>} component
* @returns {typeof SvelteComponent<Props, Events, Slots> & Exports}
*/
function asClassComponent(component) {
	const component_constructor = asClassComponent$1(component);
	/** @type {(props?: {}, opts?: { $$slots?: {}; context?: Map<any, any>; csp?: Csp; transformError?: (error: unknown) => unknown }) => LegacyRenderResult & PromiseLike<LegacyRenderResult> } */
	const _render = (props, { context, csp, transformError } = {}) => {
		const result = render(component, {
			props,
			context,
			csp,
			transformError
		});
		const munged = Object.defineProperties({}, {
			css: { value: {
				code: "",
				map: null
			} },
			head: { get: () => result.head },
			html: { get: () => result.body },
			then: { 
			/**
			* this is not type-safe, but honestly it's the best I can do right now, and it's a straightforward function.
			*
			* @template TResult1
			* @template [TResult2=never]
			* @param { (value: LegacyRenderResult) => TResult1 } onfulfilled
			* @param { (reason: unknown) => TResult2 } onrejected
			*/
value: (onfulfilled, onrejected) => {
				{
					const user_result = onfulfilled({
						css: munged.css,
						head: munged.head,
						html: munged.html
					});
					return Promise.resolve(user_result);
				}
			} }
		});
		return munged;
	};
	component_constructor.render = _render;
	return component_constructor;
}
//#endregion
//#region .svelte-kit/generated/root.svelte
function Root($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { stores, page, constructors, components = [], form, data_0 = null, data_1 = null, data_2 = null } = $$props;
		setContext("__svelte__", stores);
		stores.page.set(page);
		const Pyramid_2 = derived(() => constructors[2]);
		if (constructors[1]) {
			$$renderer.push("<!--[0-->");
			const Pyramid_0 = constructors[0];
			if (Pyramid_0) {
				$$renderer.push("<!--[-->");
				Pyramid_0($$renderer, {
					data: data_0,
					form,
					params: page.params,
					children: ($$renderer) => {
						if (constructors[2]) {
							$$renderer.push("<!--[0-->");
							const Pyramid_1 = constructors[1];
							if (Pyramid_1) {
								$$renderer.push("<!--[-->");
								Pyramid_1($$renderer, {
									data: data_1,
									form,
									params: page.params,
									children: ($$renderer) => {
										if (Pyramid_2()) {
											$$renderer.push("<!--[-->");
											Pyramid_2()($$renderer, {
												data: data_2,
												form,
												params: page.params
											});
											$$renderer.push("<!--]-->");
										} else {
											$$renderer.push("<!--[!-->");
											$$renderer.push("<!--]-->");
										}
									},
									$$slots: { default: true }
								});
								$$renderer.push("<!--]-->");
							} else {
								$$renderer.push("<!--[!-->");
								$$renderer.push("<!--]-->");
							}
						} else {
							$$renderer.push("<!--[-1-->");
							const Pyramid_1 = constructors[1];
							if (Pyramid_1) {
								$$renderer.push("<!--[-->");
								Pyramid_1($$renderer, {
									data: data_1,
									form,
									params: page.params
								});
								$$renderer.push("<!--]-->");
							} else {
								$$renderer.push("<!--[!-->");
								$$renderer.push("<!--]-->");
							}
						}
						$$renderer.push(`<!--]-->`);
					},
					$$slots: { default: true }
				});
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
		} else {
			$$renderer.push("<!--[-1-->");
			const Pyramid_0 = constructors[0];
			if (Pyramid_0) {
				$$renderer.push("<!--[-->");
				Pyramid_0($$renderer, {
					data: data_0,
					form,
					params: page.params
				});
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
		}
		$$renderer.push(`<!--]--> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
//#region .svelte-kit/generated/root.js
var root_default = asClassComponent(Root);
//#endregion
//#region .svelte-kit/generated/shared/error-template.js
var error_template_default = ({ status, message }) => "<!doctype html>\n<html lang=\"en\">\n	<head>\n		<meta charset=\"utf-8\" />\n		<title>" + message + "</title>\n\n		<style>\n			body {\n				--bg: white;\n				--fg: #222;\n				--divider: #ccc;\n				background: var(--bg);\n				color: var(--fg);\n				font-family:\n					system-ui,\n					-apple-system,\n					BlinkMacSystemFont,\n					'Segoe UI',\n					Roboto,\n					Oxygen,\n					Ubuntu,\n					Cantarell,\n					'Open Sans',\n					'Helvetica Neue',\n					sans-serif;\n				display: flex;\n				align-items: center;\n				justify-content: center;\n				height: 100vh;\n				margin: 0;\n			}\n\n			.error {\n				display: flex;\n				align-items: center;\n				max-width: 32rem;\n				margin: 0 1rem;\n			}\n\n			.status {\n				font-weight: 200;\n				font-size: 3rem;\n				line-height: 1;\n				position: relative;\n				top: -0.05rem;\n			}\n\n			.message {\n				border-left: 1px solid var(--divider);\n				padding: 0 0 0 1rem;\n				margin: 0 0 0 1rem;\n				min-height: 2.5rem;\n				display: flex;\n				align-items: center;\n			}\n\n			.message h1 {\n				font-weight: 400;\n				font-size: 1em;\n				margin: 0;\n			}\n\n			@media (prefers-color-scheme: dark) {\n				body {\n					--bg: #222;\n					--fg: #ddd;\n					--divider: #666;\n				}\n			}\n		</style>\n	</head>\n	<body>\n		<div class=\"error\">\n			<span class=\"status\">" + status + "</span>\n			<div class=\"message\">\n				<h1>" + message + "</h1>\n			</div>\n		</div>\n	</body>\n</html>\n";
//#endregion
//#region .svelte-kit/generated/server/internal.js
var options = {
	app_template_contains_nonce: false,
	async: false,
	csp: {
		"mode": "auto",
		"directives": {
			"upgrade-insecure-requests": false,
			"block-all-mixed-content": false
		},
		"reportOnly": {
			"upgrade-insecure-requests": false,
			"block-all-mixed-content": false
		}
	},
	csrf_check_origin: true,
	csrf_trusted_origins: [],
	embedded: false,
	env_public_prefix: "PUBLIC_",
	env_private_prefix: "",
	hash_routing: false,
	hooks: null,
	preload_strategy: "modulepreload",
	root: root_default,
	service_worker: false,
	service_worker_options: void 0,
	server_error_boundaries: false,
	templates: {
		app: ({ head, body, assets, nonce, env }) => "<!doctype html>\n<html lang=\"en\" class=\"dark\">\n  <head>\n    <meta charset=\"utf-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1, viewport-fit=cover\" />\n    <title>Sephar Studios</title>\n    <meta name=\"mobile-web-app-capable\" content=\"yes\" />\n    <meta name=\"apple-mobile-web-app-capable\" content=\"yes\" />\n    <meta name=\"apple-mobile-web-app-status-bar-style\" content=\"black-translucent\" />\n    <meta name=\"theme-color\" content=\"#0b0c10\" />\n    <!-- Favicons. All three rel=\"icon\" sizes point to the same flame PNG to\n         keep the brand consistent across address-bar, bookmark, tab thumbnail\n         and Android home-screen contexts. The order matters: browsers pick the\n         best size match, falling back to the last entry if nothing fits.\n         Cache-bust query (?v=3) when changing the source image. -->\n    <link rel=\"icon\" type=\"image/png\" sizes=\"32x32\" href=\"/logo-alone-sepharstudios-bgless.png?v=3\" />\n    <link rel=\"icon\" type=\"image/png\" sizes=\"96x96\" href=\"/logo-alone-sepharstudios-bgless.png?v=3\" />\n    <link rel=\"icon\" type=\"image/png\" sizes=\"192x192\" href=\"/logo-alone-sepharstudios-bgless.png?v=3\" />\n    <link rel=\"icon\" type=\"image/png\" sizes=\"any\" href=\"/logo-alone-sepharstudios-bgless.png?v=3\" />\n    <link rel=\"apple-touch-icon\" sizes=\"180x180\" href=\"/logo-alone-sepharstudios-bgless.png?v=3\" />\n    <link rel=\"shortcut icon\" href=\"/logo-alone-sepharstudios-bgless.png?v=3\" />\n    " + head + "\n    <meta name=\"apple-mobile-web-app-title\" content=\"Sephar Studios\" />\n    <link rel=\"manifest\" href=\"/manifest.json\" />\n    <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\" />\n    <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin />\n    <link href=\"https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..900;1,300..900&display=swap\" rel=\"stylesheet\" />\n    <!--\n      Site-wide structured data. Organization + WebSite (with SearchAction)\n      are the minimum Google expects for a sitelinks search box. Per-page\n      schemas (VideoObject on /watch, Person on /creators/[id]) are emitted\n      from those pages via <svelte:head>.\n    -->\n    <script type=\"application/ld+json\">\n      {\n        \"@context\": \"https://schema.org\",\n        \"@graph\": [\n          {\n            \"@type\": \"Organization\",\n            \"@id\": \"https://sepharstudios.com/#organization\",\n            \"name\": \"Sephar Studios\",\n            \"url\": \"https://sepharstudios.com\",\n            \"logo\": \"https://sepharstudios.com/logo-alone-sepharstudios.png\"\n          },\n          {\n            \"@type\": \"WebSite\",\n            \"@id\": \"https://sepharstudios.com/#website\",\n            \"name\": \"Sephar Studios\",\n            \"url\": \"https://sepharstudios.com\",\n            \"description\": \"Stream faith-based movies, shows, documentaries, and kids content.\",\n            \"publisher\": { \"@id\": \"https://sepharstudios.com/#organization\" },\n            \"potentialAction\": {\n              \"@type\": \"SearchAction\",\n              \"target\": \"https://sepharstudios.com/search?q={search_term_string}\",\n              \"query-input\": \"required name=search_term_string\"\n            }\n          }\n        ]\n      }\n    <\/script>\n\n    <!-- Openpanel — product analytics. Auto-tracks page views; we fire\n         explicit server-side events from $lib/server/analytics.ts. The\n         clientId is public-safe. Set via PUBLIC_OPENPANEL_CLIENT_ID env. -->\n    <script>\n      (function () {\n        var clientId = '" + (env["PUBLIC_OPENPANEL_CLIENT_ID"] ?? "") + "';\n        if (!clientId || clientId.indexOf('%') === 0) return;\n        var s = document.createElement('script');\n        s.src = 'https://openpanel.dev/op1.js';\n        s.defer = true;\n        s.setAttribute('data-client-id', clientId);\n        s.setAttribute('data-track-screen-views', 'true');\n        s.setAttribute('data-track-outgoing-links', 'true');\n        document.head.appendChild(s);\n      })();\n    <\/script>\n  </head>\n  <body data-sveltekit-preload-data=\"hover\" data-sveltekit-reload>\n    <div id=\"svelte\">" + body + "</div>\n  </body>\n</html>\n",
		error: error_template_default
	},
	version_hash: "1o69dbt"
};
async function get_hooks() {
	let handle;
	let handleFetch;
	let handleError;
	let handleValidationError;
	let init;
	({handle, handleFetch, handleError, handleValidationError, init} = await import('./hooks.server-98ID0pMm.js'));
	let reroute;
	let transport;
	return {
		handle,
		handleFetch,
		handleError,
		handleValidationError,
		init,
		reroute,
		transport
	};
}

//#region ../../node_modules/.bun/@sveltejs+kit@2.69.3+ab726ce7a871e72d/node_modules/@sveltejs/kit/src/utils/promise.js
/** @see https://github.com/microsoft/TypeScript/blob/904e7dd97dc8da1352c8e05d70829dff17c73214/src/lib/es2024.promise.d.ts */
/**
* @template T
* @typedef {{
*   promise: Promise<T>;
*   resolve: (value: T | PromiseLike<T>) => void;
*   reject: (reason?: any) => void;
* }} PromiseWithResolvers<T>
*/
/**
* TODO: Whenever Node >21 is minimum supported version, we can use `Promise.withResolvers` to avoid this ceremony
*
* @template T
* @returns {PromiseWithResolvers<T>}
*/
function with_resolvers() {
	let resolve;
	let reject;
	return {
		promise: new Promise((res, rej) => {
			resolve = res;
			reject = rej;
		}),
		resolve,
		reject
	};
}
//#endregion
//#region ../../node_modules/.bun/@sveltejs+kit@2.69.3+ab726ce7a871e72d/node_modules/@sveltejs/kit/src/runtime/server/constants.js
var NULL_BODY_STATUS = [
	101,
	103,
	204,
	205,
	304
];
var IN_WEBCONTAINER = !!globalThis.process?.versions?.webcontainer;
//#endregion
//#region ../../node_modules/.bun/@sveltejs+kit@2.69.3+ab726ce7a871e72d/node_modules/@sveltejs/kit/src/utils/misc.js
var s = JSON.stringify;
//#endregion
//#region ../../node_modules/.bun/@sveltejs+kit@2.69.3+ab726ce7a871e72d/node_modules/@sveltejs/kit/src/runtime/server/endpoint.js
/**
* @param {import('@sveltejs/kit').RequestEvent} event
* @param {import('types').RequestState} event_state
* @param {import('types').SSREndpoint} mod
* @param {import('types').SSRState} state
* @returns {Promise<Response>}
*/
async function render_endpoint(event, event_state, mod, state) {
	const method = event.request.method;
	let handler = mod[method] || mod.fallback;
	if (method === "HEAD" && !mod.HEAD && mod.GET) handler = mod.GET;
	if (!handler) return method_not_allowed(mod, method);
	const prerender = mod.prerender ?? state.prerender_default;
	if (prerender && (mod.POST || mod.PATCH || mod.PUT || mod.DELETE)) throw new Error("Cannot prerender endpoints that have mutative methods");
	if (state.prerendering && !state.prerendering.inside_reroute && !prerender) if (state.depth > 0) throw new Error(`${event.route.id} is not prerenderable`);
	else return new Response(void 0, { status: 204 });
	try {
		const response = await with_request_store({
			event,
			state: event_state
		}, () => handler(event));
		if (!(response instanceof Response)) throw new Error(`Invalid response from route ${event.url.pathname}: handler should return a Response object`);
		if (state.prerendering && (!state.prerendering.inside_reroute || prerender)) {
			const cloned = new Response(response.clone().body, {
				status: response.status,
				statusText: response.statusText,
				headers: new Headers(response.headers)
			});
			cloned.headers.set("x-sveltekit-prerender", String(prerender));
			if (state.prerendering.inside_reroute && prerender) {
				cloned.headers.set("x-sveltekit-routeid", encodeURI(event.route.id));
				state.prerendering.dependencies.set(event.url.pathname, {
					response: cloned,
					body: null
				});
			} else return cloned;
		}
		return response;
	} catch (e) {
		if (e instanceof Redirect) return new Response(void 0, {
			status: e.status,
			headers: { location: e.location }
		});
		throw e;
	}
}
/**
* @param {import('@sveltejs/kit').RequestEvent} event
*/
function is_endpoint_request(event) {
	const { method, headers } = event.request;
	if (ENDPOINT_METHODS.includes(method) && !PAGE_METHODS.includes(method)) return true;
	if (method === "POST" && headers.get("x-sveltekit-action") === "true") return false;
	return negotiate(event.request.headers.get("accept") ?? "*/*", ["*", "text/html"]) !== "text/html";
}
//#endregion
//#region ../../node_modules/.bun/@sveltejs+kit@2.69.3+ab726ce7a871e72d/node_modules/@sveltejs/kit/src/runtime/telemetry/record_span.js
/** @import { RecordSpan } from 'types' */
/** @type {RecordSpan} */
async function record_span({ name, attributes, fn }) {
	return fn(noop_span);
}
//#endregion
//#region ../../node_modules/.bun/@sveltejs+kit@2.69.3+ab726ce7a871e72d/node_modules/@sveltejs/kit/src/runtime/server/page/actions.js
/** @import { RequestEvent, ActionResult, Actions } from '@sveltejs/kit' */
/** @import { SSROptions, SSRNode, ServerNode, ServerHooks } from 'types' */
/** @param {RequestEvent} event */
function is_action_json_request(event) {
	return negotiate(event.request.headers.get("accept") ?? "*/*", ["application/json", "text/html"]) === "application/json" && event.request.method === "POST";
}
/**
* @param {RequestEvent} event
* @param {import('types').RequestState} event_state
* @param {SSROptions} options
* @param {SSRNode['server'] | undefined} server
*/
async function handle_action_json_request(event, event_state, options, server) {
	const actions = server?.actions;
	if (!actions) {
		const no_actions_error = new SvelteKitError(405, "Method Not Allowed", `POST method not allowed. No form actions exist for this page`);
		return action_json({
			type: "error",
			error: await handle_error_and_jsonify(event, event_state, options, no_actions_error)
		}, {
			status: no_actions_error.status,
			headers: { allow: "GET" }
		});
	}
	check_named_default_separate(actions);
	try {
		const data = await call_action(event, event_state, actions);
		if (data instanceof ActionFailure) return action_json({
			type: "failure",
			status: data.status,
			data: stringify_action_response(data.data, event.route.id, options.hooks.transport)
		});
		else return action_json({
			type: "success",
			status: data ? 200 : 204,
			data: stringify_action_response(data, event.route.id, options.hooks.transport)
		});
	} catch (e) {
		const err = normalize_error(e);
		if (err instanceof Redirect) return action_json_redirect(err);
		return action_json({
			type: "error",
			error: await handle_error_and_jsonify(event, event_state, options, check_incorrect_fail_use(err))
		}, { status: get_status(err) });
	}
}
/**
* @param {HttpError | Error} error
*/
function check_incorrect_fail_use(error) {
	return error instanceof ActionFailure ? /* @__PURE__ */ new Error("Cannot \"throw fail()\". Use \"return fail()\"") : error;
}
/**
* @param {Redirect} redirect
*/
function action_json_redirect(redirect) {
	return action_json({
		type: "redirect",
		status: redirect.status,
		location: redirect.location
	});
}
/**
* @param {ActionResult} data
* @param {ResponseInit} [init]
*/
function action_json(data, init) {
	return json(data, init);
}
/**
* @param {RequestEvent} event
*/
function is_action_request(event) {
	return event.request.method === "POST";
}
/**
* @param {RequestEvent} event
* @param {import('types').RequestState} event_state
* @param {SSRNode['server'] | undefined} server
* @returns {Promise<ActionResult>}
*/
async function handle_action_request(event, event_state, server) {
	const actions = server?.actions;
	if (!actions) {
		event.setHeaders({ allow: "GET" });
		return {
			type: "error",
			error: new SvelteKitError(405, "Method Not Allowed", `POST method not allowed. No form actions exist for this page`)
		};
	}
	check_named_default_separate(actions);
	try {
		const data = await call_action(event, event_state, actions);
		if (data instanceof ActionFailure) return {
			type: "failure",
			status: data.status,
			data: data.data
		};
		else return {
			type: "success",
			status: 200,
			data
		};
	} catch (e) {
		const err = normalize_error(e);
		if (err instanceof Redirect) return {
			type: "redirect",
			status: err.status,
			location: err.location
		};
		return {
			type: "error",
			error: check_incorrect_fail_use(err)
		};
	}
}
/**
* @param {Actions} actions
*/
function check_named_default_separate(actions) {
	if (actions.default && Object.keys(actions).length > 1) throw new Error("When using named actions, the default action cannot be used. See the docs for more info: https://svelte.dev/docs/kit/form-actions#named-actions");
}
/**
* @param {RequestEvent} event
* @param {import('types').RequestState} event_state
* @param {NonNullable<ServerNode['actions']>} actions
* @throws {Redirect | HttpError | SvelteKitError | Error}
*/
async function call_action(event, event_state, actions) {
	const url = new URL(event.request.url);
	let name = "default";
	for (const param of url.searchParams) if (param[0].startsWith("/")) {
		name = param[0].slice(1);
		if (name === "default") throw new Error("Cannot use reserved action name \"default\"");
		break;
	}
	const action = actions[name];
	if (!action) throw new SvelteKitError(404, "Not Found", `No action with name '${name}' found`);
	if (!is_form_content_type(event.request)) throw new SvelteKitError(415, "Unsupported Media Type", `Form actions expect form-encoded data — received ${event.request.headers.get("content-type")}`);
	return record_span({
		name: "sveltekit.form_action",
		attributes: {
			"http.route": event.route.id || "unknown"
		},
		fn: async (current) => {
			const traced_event = merge_tracing(event, current);
			const result = await with_request_store({
				event: traced_event,
				state: event_state
			}, () => action(traced_event));
			if (result instanceof ActionFailure) current.setAttributes({
				"sveltekit.form_action.result.type": "failure",
				"sveltekit.form_action.result.status": result.status
			});
			return result;
		}
	});
}
/**
* Try to `devalue.uneval` the data object, and if it fails, return a proper Error with context
* @param {any} data
* @param {string} route_id
* @param {ServerHooks['transport']} transport
*/
function uneval_action_response(data, route_id, transport) {
	const replacer = create_replacer(transport);
	return try_serialize(data, (value) => uneval(value, replacer), route_id);
}
/**
* Try to `devalue.stringify` the data object, and if it fails, return a proper Error with context
* @param {any} data
* @param {string} route_id
* @param {ServerHooks['transport']} transport
*/
function stringify_action_response(data, route_id, transport) {
	const encoders = Object.fromEntries(Object.entries(transport).map(([key, value]) => [key, value.encode]));
	return try_serialize(data, (value) => stringify$1(value, encoders), route_id);
}
/**
* @param {any} data
* @param {(data: any) => string} fn
* @param {string} route_id
*/
function try_serialize(data, fn, route_id) {
	try {
		return fn(data);
	} catch (e) {
		const error = e;
		if (data instanceof Response) throw new Error(`Data returned from action inside ${route_id} is not serializable. Form actions need to return plain objects or fail(). E.g. return { success: true } or return fail(400, { message: "invalid" });`, { cause: e });
		if ("path" in error) {
			let message = `Data returned from action inside ${route_id} is not serializable: ${error.message}`;
			if (error.path !== "") message += ` (data.${error.path})`;
			throw new Error(message, { cause: e });
		}
		throw error;
	}
}
//#endregion
//#region ../../node_modules/.bun/@sveltejs+kit@2.69.3+ab726ce7a871e72d/node_modules/@sveltejs/kit/src/utils/streaming.js
/**
* Create an async iterator and a function to push values into it
* @template T
* @returns {{
*   iterate: (transform?: (input: T) => T) => AsyncIterable<T>;
*   add: (promise: Promise<T>) => void;
* }}
*/
function create_async_iterator() {
	let resolved = -1;
	let returned = -1;
	/** @type {import('./promise.js').PromiseWithResolvers<T>[]} */
	const deferred = [];
	return {
		iterate: (transform = (x) => x) => {
			return { [Symbol.asyncIterator]() {
				return { next: async () => {
					const next = deferred[++returned];
					if (!next) return {
						value: null,
						done: true
					};
					return {
						value: transform(await next.promise),
						done: false
					};
				} };
			} };
		},
		add: (promise) => {
			/** @type {import('./promise.js').PromiseWithResolvers<T>} */
			const next = with_resolvers();
			next.promise.catch(noop);
			deferred.push(next);
			promise.then((value) => {
				deferred[++resolved].resolve(value);
			}, (error) => {
				deferred[++resolved].reject(error);
			});
		}
	};
}
//#endregion
//#region ../../node_modules/.bun/@sveltejs+kit@2.69.3+ab726ce7a871e72d/node_modules/@sveltejs/kit/src/runtime/server/page/data_serializer.js
/**
* If the serialized data contains promises, `chunks` will be an
* async iterable containing their resolutions
* @param {import('@sveltejs/kit').RequestEvent} event
* @param {import('types').RequestState} event_state
* @param {import('types').SSROptions} options
* @returns {import('./types.js').ServerDataSerializer}
*/
function server_data_serializer(event, event_state, options) {
	let promise_id = 1;
	let max_nodes = -1;
	const iterator = create_async_iterator();
	const global = get_global_name(options);
	/** @param {number} index */
	function get_replacer(index) {
		/** @param {any} thing */
		return function replacer(thing) {
			if (typeof thing?.then === "function") {
				const id = promise_id++;
				const promise = thing.then(
					/** @param {any} data */
					(data) => ({ data })
				).catch(
					/** @param {any} error */
					async (error) => ({ error: await handle_error_and_jsonify(event, event_state, options, error) })
				).then(
					/**
					* @param {{data: any; error: any}} result
					*/
					async ({ data, error }) => {
						let str;
						try {
							str = uneval(error ? [, error] : [data], replacer);
						} catch {
							error = await handle_error_and_jsonify(event, event_state, options, /* @__PURE__ */ new Error(`Failed to serialize promise while rendering ${event.route.id}`));
							str = uneval([, error], replacer);
						}
						return {
							index,
							str: `${global}.resolve(${id}, ${str.includes("app.decode") ? `(app) => ${str}` : `() => ${str}`})`
						};
					}
				);
				iterator.add(promise);
				return `${global}.defer(${id})`;
			} else for (const key in options.hooks.transport) {
				const encoded = options.hooks.transport[key].encode(thing);
				if (encoded) return `app.decode('${key}', ${uneval(encoded, replacer)})`;
			}
		};
	}
	const strings = [];
	return {
		set_max_nodes(i) {
			max_nodes = i;
		},
		add_node(i, node) {
			try {
				if (!node) {
					strings[i] = "null";
					return;
				}
				/** @type {any} */
				const payload = {
					type: "data",
					data: node.data,
					uses: serialize_uses(node)
				};
				if (node.slash) payload.slash = node.slash;
				strings[i] = uneval(payload, get_replacer(i));
			} catch (e) {
				e.path = e.path.slice(1);
				throw new Error(clarify_devalue_error(event, e), { cause: e });
			}
		},
		get_data(csp) {
			const open = `<script${csp.script_needs_nonce ? ` nonce="${csp.nonce}"` : ""}>`;
			const close = `<\/script>\n`;
			return {
				data: `[${compact(max_nodes > -1 ? strings.slice(0, max_nodes) : strings).join(",")}]`,
				chunks: promise_id > 1 ? iterator.iterate(({ index, str }) => {
					if (max_nodes > -1 && index >= max_nodes) return "";
					return open + str + close;
				}) : null
			};
		}
	};
}
/**
* If the serialized data contains promises, `chunks` will be an
* async iterable containing their resolutions
* @param {import('@sveltejs/kit').RequestEvent} event
* @param {import('types').RequestState} event_state
* @param {import('types').SSROptions} options
* @returns {import('./types.js').ServerDataSerializerJson}
*/
function server_data_serializer_json(event, event_state, options) {
	let promise_id = 1;
	const iterator = create_async_iterator();
	const reducers = {
		...Object.fromEntries(Object.entries(options.hooks.transport).map(([key, value]) => [key, value.encode])),
		/** @param {any} thing */
		Promise: (thing) => {
			if (typeof thing?.then !== "function") return;
			const id = promise_id++;
			/** @type {'data' | 'error'} */
			let key = "data";
			const promise = thing.catch(
				/** @param {any} e */
				async (e) => {
					key = "error";
					return handle_error_and_jsonify(event, event_state, options, e);
				}
			).then(
				/** @param {any} value */
				async (value) => {
					let str;
					try {
						str = stringify$1(value, reducers);
					} catch {
						const error = await handle_error_and_jsonify(event, event_state, options, /* @__PURE__ */ new Error(`Failed to serialize promise while rendering ${event.route.id}`));
						key = "error";
						str = stringify$1(error, reducers);
					}
					return `{"type":"chunk","id":${id},"${key}":${str}}\n`;
				}
			);
			iterator.add(promise);
			return id;
		}
	};
	const strings = [];
	return {
		add_node(i, node) {
			try {
				if (!node) {
					strings[i] = "null";
					return;
				}
				if (node.type === "error" || node.type === "skip") {
					strings[i] = JSON.stringify(node);
					return;
				}
				strings[i] = `{"type":"data","data":${stringify$1(node.data, reducers)},"uses":${JSON.stringify(serialize_uses(node))}${node.slash ? `,"slash":${JSON.stringify(node.slash)}` : ""}}`;
			} catch (e) {
				e.path = "data" + e.path;
				throw new Error(clarify_devalue_error(event, e), { cause: e });
			}
		},
		get_data() {
			return {
				data: `{"type":"data","nodes":[${strings.join(",")}]}\n`,
				chunks: promise_id > 1 ? iterator.iterate() : null
			};
		}
	};
}
//#endregion
//#region ../../node_modules/.bun/@sveltejs+kit@2.69.3+ab726ce7a871e72d/node_modules/@sveltejs/kit/src/runtime/server/page/load_data.js
/**
* Calls the user's server `load` function.
* @param {{
*   event: import('@sveltejs/kit').RequestEvent;
*   event_state: import('types').RequestState;
*   state: import('types').SSRState;
*   node: import('types').SSRNode | undefined;
*   parent: () => Promise<Record<string, any>>;
* }} opts
* @returns {Promise<import('types').ServerDataNode | null>}
*/
async function load_server_data({ event, event_state, state, node, parent }) {
	if (!node?.server) return null;
	let is_tracking = true;
	const uses = {
		dependencies: /* @__PURE__ */ new Set(),
		params: /* @__PURE__ */ new Set(),
		parent: false,
		route: false,
		url: false,
		search_params: /* @__PURE__ */ new Set()
	};
	const load = node.server.load;
	const slash = node.server.trailingSlash;
	if (!load) return {
		type: "data",
		data: null,
		uses,
		slash
	};
	const url = make_trackable(event.url, () => {
		if (is_tracking) uses.url = true;
	}, (param) => {
		if (is_tracking) uses.search_params.add(param);
	});
	if (state.prerendering) disable_search(url);
	return {
		type: "data",
		data: await record_span({
			name: "sveltekit.load",
			attributes: {
				"sveltekit.load.node_id": node.server_id || "unknown",
				"sveltekit.load.node_type": get_node_type(node.server_id),
				"http.route": event.route.id || "unknown"
			},
			fn: async (current) => {
				const traced_event = merge_tracing(event, current);
				return await with_request_store({
					event: traced_event,
					state: event_state
				}, () => load.call(null, {
					...traced_event,
					fetch: (info, init) => {
						new URL(info instanceof Request ? info.url : info, event.url);
						return event.fetch(info, init);
					},
					/** @param {string[]} deps */
					depends: (...deps) => {
						for (const dep of deps) {
							const { href } = new URL(dep, event.url);
							uses.dependencies.add(href);
						}
					},
					params: new Proxy(event.params, { get: (target, key) => {
						if (is_tracking) uses.params.add(key);
						return target[key];
					} }),
					parent: async () => {
						if (is_tracking) uses.parent = true;
						return parent();
					},
					route: new Proxy(event.route, { get: (target, key) => {
						if (is_tracking) uses.route = true;
						return target[key];
					} }),
					url,
					untrack(fn) {
						is_tracking = false;
						try {
							return fn();
						} finally {
							is_tracking = true;
						}
					}
				}));
			}
		}) ?? null,
		uses,
		slash
	};
}
/**
* Calls the user's `load` function.
* @param {{
*   event: import('@sveltejs/kit').RequestEvent;
*   event_state: import('types').RequestState;
*   fetched: import('./types.js').Fetched[];
*   node: import('types').SSRNode | undefined;
*   parent: () => Promise<Record<string, any>>;
*   resolve_opts: import('types').RequiredResolveOptions;
*   server_data_promise: Promise<import('types').ServerDataNode | null>;
*   state: import('types').SSRState;
*   csr: boolean;
* }} opts
* @returns {Promise<Record<string, any | Promise<any>> | null>}
*/
async function load_data({ event, event_state, fetched, node, parent, server_data_promise, state, resolve_opts, csr }) {
	const server_data_node = await server_data_promise;
	const load = node?.universal?.load;
	if (!load) return server_data_node?.data ?? null;
	return await record_span({
		name: "sveltekit.load",
		attributes: {
			"sveltekit.load.node_id": node.universal_id || "unknown",
			"sveltekit.load.node_type": get_node_type(node.universal_id),
			"http.route": event.route.id || "unknown"
		},
		fn: async (current) => {
			const traced_event = merge_tracing(event, current);
			return await with_request_store({
				event: traced_event,
				state: {
					...event_state,
					is_in_universal_load: true
				}
			}, () => load.call(null, {
				url: event.url,
				params: event.params,
				data: server_data_node?.data ?? null,
				route: event.route,
				fetch: create_universal_fetch(event, state, fetched, csr, resolve_opts),
				setHeaders: event.setHeaders,
				depends: noop,
				parent,
				untrack: (fn) => fn(),
				tracing: traced_event.tracing
			}));
		}
	}) ?? null;
}
/**
* @param {Pick<import('@sveltejs/kit').RequestEvent, 'fetch' | 'url' | 'request' | 'route'>} event
* @param {import('types').SSRState} state
* @param {import('./types.js').Fetched[]} fetched
* @param {boolean} csr
* @param {Pick<Required<import('@sveltejs/kit').ResolveOptions>, 'filterSerializedResponseHeaders'>} resolve_opts
* @returns {typeof fetch}
*/
function create_universal_fetch(event, state, fetched, csr, resolve_opts) {
	/**
	* @param {URL | RequestInfo} input
	* @param {RequestInit} [init]
	*/
	const universal_fetch = async (input, init) => {
		const cloned_body = input instanceof Request && input.body ? input.clone().body : null;
		const cloned_headers = input instanceof Request && [...input.headers].length ? new Headers(input.headers) : init?.headers;
		let response = await event.fetch(input, init);
		const url = new URL(input instanceof Request ? input.url : input, event.url);
		const same_origin = url.origin === event.url.origin;
		/** @type {import('types').PrerenderDependency} */
		let dependency;
		if (same_origin) {
			if (state.prerendering) {
				dependency = {
					response,
					body: null
				};
				state.prerendering.dependencies.set(url.pathname, dependency);
			}
		} else if (url.protocol === "https:" || url.protocol === "http:") if ((input instanceof Request ? input.mode : init?.mode ?? "cors") === "no-cors") response = new Response("", {
			status: response.status,
			statusText: response.statusText,
			headers: response.headers
		});
		else {
			const acao = response.headers.get("access-control-allow-origin");
			if (!acao || acao !== event.url.origin && acao !== "*") throw new Error(`CORS error: ${acao ? "Incorrect" : "No"} 'Access-Control-Allow-Origin' header is present on the requested resource`);
		}
		/** @type {ReadableStream<Uint8Array>} */
		let teed_body;
		const proxy = new Proxy(response, { get(response, key, receiver) {
			/**
			* @param {string | undefined} body
			* @param {boolean} is_b64
			*/
			async function push_fetched(body, is_b64) {
				const status_number = Number(response.status);
				if (isNaN(status_number)) throw new Error(`response.status is not a number. value: "${response.status}" type: ${typeof response.status}`);
				fetched.push({
					url: same_origin ? url.href.slice(event.url.origin.length) : url.href,
					method: event.request.method,
					request_body: input instanceof Request && cloned_body ? await stream_to_string(cloned_body) : init?.body,
					request_headers: cloned_headers,
					response_body: body,
					response,
					is_b64
				});
			}
			if (key === "body") {
				if (response.body === null) return null;
				if (teed_body) return teed_body;
				const [a, b] = response.body.tee();
				(async () => {
					let result = /* @__PURE__ */ new Uint8Array();
					for await (const chunk of a) {
						const combined = new Uint8Array(result.length + chunk.length);
						combined.set(result, 0);
						combined.set(chunk, result.length);
						result = combined;
					}
					if (dependency) dependency.body = new Uint8Array(result);
					push_fetched(base64_encode(result), true);
				})().catch(noop);
				return teed_body = b;
			}
			if (key === "arrayBuffer") return async () => {
				const buffer = await response.arrayBuffer();
				const bytes = new Uint8Array(buffer);
				if (dependency) dependency.body = bytes;
				if (buffer instanceof ArrayBuffer) await push_fetched(base64_encode(bytes), true);
				return buffer;
			};
			async function text() {
				const body = await response.text();
				if (body === "" && NULL_BODY_STATUS.includes(response.status)) {
					await push_fetched(void 0, false);
					return;
				}
				if (!body || typeof body === "string") await push_fetched(body, false);
				if (dependency) dependency.body = body;
				return body;
			}
			if (key === "text") return text;
			if (key === "json") return async () => {
				const body = await text();
				return body ? JSON.parse(body) : void 0;
			};
			const value = Reflect.get(response, key, response);
			if (value instanceof Function) return Object.defineProperties(
				/**
				* @this {any}
				*/
				function() {
					return Reflect.apply(value, this === receiver ? response : this, arguments);
				},
				{
					name: { value: value.name },
					length: { value: value.length }
				}
			);
			return value;
		} });
		if (csr) {
			const get = response.headers.get;
			response.headers.get = (key) => {
				const lower = key.toLowerCase();
				const value = get.call(response.headers, lower);
				if (value && !lower.startsWith("x-sveltekit-")) {
					if (!resolve_opts.filterSerializedResponseHeaders(lower, value)) throw new Error(`Failed to get response header "${lower}" — it must be included by the \`filterSerializedResponseHeaders\` option: https://svelte.dev/docs/kit/hooks#Server-hooks-handle (at ${event.route.id})`);
				}
				return value;
			};
		}
		return proxy;
	};
	return (input, init) => {
		const response = universal_fetch(input, init);
		response.catch(noop);
		return response;
	};
}
/**
* @param {ReadableStream<Uint8Array>} stream
*/
async function stream_to_string(stream) {
	let result = "";
	const reader = stream.getReader();
	const decoder = new TextDecoder();
	while (true) {
		const { done, value } = await reader.read();
		if (done) {
			result += decoder.decode();
			break;
		}
		result += decoder.decode(value, { stream: true });
	}
	return result;
}
//#endregion
//#region ../../node_modules/.bun/@sveltejs+kit@2.69.3+ab726ce7a871e72d/node_modules/@sveltejs/kit/src/runtime/server/page/serialize_data.js
/**
* Inside a script element, only `<\/script` and `<!--` hold special meaning to the HTML parser.
*
* The first closes the script element, so everything after is treated as raw HTML.
* The second disables further parsing until `-->`, so the script element might be unexpectedly
* kept open up until an unrelated HTML comment in the page.
*
* U+2028 LINE SEPARATOR and U+2029 PARAGRAPH SEPARATOR are escaped for the sake of pre-2018
* browsers.
*
* @see tests for unsafe parsing examples.
* @see https://html.spec.whatwg.org/multipage/scripting.html#restrictions-for-contents-of-script-elements
* @see https://html.spec.whatwg.org/multipage/syntax.html#cdata-rcdata-restrictions
* @see https://html.spec.whatwg.org/multipage/parsing.html#script-data-state
* @see https://html.spec.whatwg.org/multipage/parsing.html#script-data-double-escaped-state
* @see https://github.com/tc39/proposal-json-superset
* @type {Record<string, string>}
*/
var replacements = {
	"<": "\\u003C",
	"\u2028": "\\u2028",
	"\u2029": "\\u2029"
};
var pattern = new RegExp(`[${Object.keys(replacements).join("")}]`, "g");
/**
* Generates a raw HTML string containing a safe script element carrying data and associated attributes.
*
* It escapes all the special characters needed to guarantee the element is unbroken, but care must
* be taken to ensure it is inserted in the document at an acceptable position for a script element,
* and that the resulting string isn't further modified.
*
* @param {import('./types.js').Fetched} fetched
* @param {(name: string, value: string) => boolean} filter
* @param {boolean} [prerendering]
* @returns {string} The raw HTML of a script element carrying the JSON payload.
* @example const html = serialize_data('/data.json', null, { foo: 'bar' });
*/
function serialize_data(fetched, filter, prerendering = false) {
	/** @type {Record<string, string>} */
	const headers = {};
	let cache_control = null;
	let age = null;
	let varyAny = false;
	for (const [key, value] of fetched.response.headers) {
		if (filter(key, value)) headers[key] = value;
		if (key === "cache-control") cache_control = value;
		else if (key === "age") age = value;
		else if (key === "vary" && value.trim() === "*") varyAny = true;
	}
	const payload = {
		status: fetched.response.status,
		statusText: fetched.response.statusText,
		headers,
		body: fetched.response_body
	};
	const safe_payload = JSON.stringify(payload).replace(pattern, (match) => replacements[match]);
	const attrs = [
		"type=\"application/json\"",
		"data-sveltekit-fetched",
		`data-url="${escape_html(fetched.url, true)}"`
	];
	if (fetched.is_b64) attrs.push("data-b64");
	if (fetched.request_headers || fetched.request_body) {
		/** @type {import('types').StrictBody[]} */
		const values = [];
		if (fetched.request_headers) values.push([...new Headers(fetched.request_headers)].join(","));
		if (fetched.request_body) values.push(fetched.request_body);
		attrs.push(`data-hash="${hash(...values)}"`);
	}
	if (!prerendering && fetched.method === "GET" && cache_control && !varyAny) {
		const match = /s-maxage=(\d+)/g.exec(cache_control) ?? /max-age=(\d+)/g.exec(cache_control);
		if (match) {
			const ttl = +match[1] - +(age ?? "0");
			attrs.push(`data-ttl="${ttl}"`);
		}
	}
	return `<script ${attrs.join(" ")}>${safe_payload}<\/script>`;
}
//#endregion
//#region ../../node_modules/.bun/@sveltejs+kit@2.69.3+ab726ce7a871e72d/node_modules/@sveltejs/kit/src/runtime/server/page/crypto.js
/**
* SHA-256 hashing function adapted from https://bitwiseshiftleft.github.io/sjcl
* modified and redistributed under BSD license
* @param {string} data
*/
function sha256(data) {
	if (!key[0]) precompute();
	const out = init.slice(0);
	const array = encode(data);
	for (let i = 0; i < array.length; i += 16) {
		const w = array.subarray(i, i + 16);
		let tmp;
		let a;
		let b;
		let out0 = out[0];
		let out1 = out[1];
		let out2 = out[2];
		let out3 = out[3];
		let out4 = out[4];
		let out5 = out[5];
		let out6 = out[6];
		let out7 = out[7];
		for (let i = 0; i < 64; i++) {
			if (i < 16) tmp = w[i];
			else {
				a = w[i + 1 & 15];
				b = w[i + 14 & 15];
				tmp = w[i & 15] = (a >>> 7 ^ a >>> 18 ^ a >>> 3 ^ a << 25 ^ a << 14) + (b >>> 17 ^ b >>> 19 ^ b >>> 10 ^ b << 15 ^ b << 13) + w[i & 15] + w[i + 9 & 15] | 0;
			}
			tmp = tmp + out7 + (out4 >>> 6 ^ out4 >>> 11 ^ out4 >>> 25 ^ out4 << 26 ^ out4 << 21 ^ out4 << 7) + (out6 ^ out4 & (out5 ^ out6)) + key[i];
			out7 = out6;
			out6 = out5;
			out5 = out4;
			out4 = out3 + tmp | 0;
			out3 = out2;
			out2 = out1;
			out1 = out0;
			out0 = tmp + (out1 & out2 ^ out3 & (out1 ^ out2)) + (out1 >>> 2 ^ out1 >>> 13 ^ out1 >>> 22 ^ out1 << 30 ^ out1 << 19 ^ out1 << 10) | 0;
		}
		out[0] = out[0] + out0 | 0;
		out[1] = out[1] + out1 | 0;
		out[2] = out[2] + out2 | 0;
		out[3] = out[3] + out3 | 0;
		out[4] = out[4] + out4 | 0;
		out[5] = out[5] + out5 | 0;
		out[6] = out[6] + out6 | 0;
		out[7] = out[7] + out7 | 0;
	}
	const bytes = new Uint8Array(out.buffer);
	reverse_endianness(bytes);
	return btoa(String.fromCharCode(...bytes));
}
/** The SHA-256 initialization vector */
var init = /* @__PURE__ */ new Uint32Array(8);
/** The SHA-256 hash key */
var key = /* @__PURE__ */ new Uint32Array(64);
/** Function to precompute init and key. */
function precompute() {
	/** @param {number} x */
	function frac(x) {
		return (x - Math.floor(x)) * 4294967296;
	}
	let prime = 2;
	for (let i = 0; i < 64; prime++) {
		let is_prime = true;
		for (let factor = 2; factor * factor <= prime; factor++) if (prime % factor === 0) {
			is_prime = false;
			break;
		}
		if (is_prime) {
			if (i < 8) init[i] = frac(prime ** (1 / 2));
			key[i] = frac(prime ** (1 / 3));
			i++;
		}
	}
}
/** @param {Uint8Array} bytes */
function reverse_endianness(bytes) {
	for (let i = 0; i < bytes.length; i += 4) {
		const a = bytes[i + 0];
		const b = bytes[i + 1];
		const c = bytes[i + 2];
		const d = bytes[i + 3];
		bytes[i + 0] = d;
		bytes[i + 1] = c;
		bytes[i + 2] = b;
		bytes[i + 3] = a;
	}
}
/** @param {string} str */
function encode(str) {
	const encoded = text_encoder.encode(str);
	const length = encoded.length * 8;
	const size = 512 * Math.ceil((length + 65) / 512);
	const bytes = new Uint8Array(size / 8);
	bytes.set(encoded);
	bytes[encoded.length] = 128;
	reverse_endianness(bytes);
	const words = new Uint32Array(bytes.buffer);
	words[words.length - 2] = Math.floor(length / 4294967296);
	words[words.length - 1] = length;
	return words;
}
//#endregion
//#region ../../node_modules/.bun/@sveltejs+kit@2.69.3+ab726ce7a871e72d/node_modules/@sveltejs/kit/src/runtime/server/page/csp.js
var array = /* @__PURE__ */ new Uint8Array(16);
function generate_nonce() {
	crypto.getRandomValues(array);
	return btoa(String.fromCharCode(...array));
}
var quoted = /* @__PURE__ */ new Set([
	"self",
	"unsafe-eval",
	"unsafe-hashes",
	"unsafe-inline",
	"none",
	"strict-dynamic",
	"report-sample",
	"wasm-unsafe-eval",
	"script"
]);
var crypto_pattern = /^(nonce|sha\d\d\d)-/;
var BaseProvider = class {
	/** @type {boolean} */
	#use_hashes;
	/** @type {boolean} */
	#script_needs_csp;
	/** @type {boolean} */
	#script_src_needs_csp;
	/** @type {boolean} */
	#script_src_elem_needs_csp;
	/** @type {boolean} */
	#style_needs_csp;
	/** @type {boolean} */
	#style_src_needs_csp;
	/** @type {boolean} */
	#style_src_attr_needs_csp;
	/** @type {boolean} */
	#style_src_elem_needs_csp;
	/** @type {import('types').CspDirectives} */
	#directives;
	/** @type {Set<import('types').Csp.Source>} */
	#script_src;
	/** @type {Set<import('types').Csp.Source>} */
	#script_src_elem;
	/** @type {Set<import('types').Csp.Source>} */
	#style_src;
	/** @type {Set<import('types').Csp.Source>} */
	#style_src_attr;
	/** @type {Set<import('types').Csp.Source>} */
	#style_src_elem;
	/** @type {boolean} */
	script_needs_nonce;
	/** @type {boolean} */
	style_needs_nonce;
	/** @type {boolean} */
	script_needs_hash;
	/** @type {string} */
	#nonce;
	/**
	* @param {boolean} use_hashes
	* @param {import('types').CspDirectives} directives
	* @param {string} nonce
	*/
	constructor(use_hashes, directives, nonce) {
		this.#use_hashes = use_hashes;
		this.#directives = directives;
		const d = this.#directives;
		this.#script_src = /* @__PURE__ */ new Set();
		this.#script_src_elem = /* @__PURE__ */ new Set();
		this.#style_src = /* @__PURE__ */ new Set();
		this.#style_src_attr = /* @__PURE__ */ new Set();
		this.#style_src_elem = /* @__PURE__ */ new Set();
		const effective_script_src = d["script-src"] || d["default-src"];
		const script_src_elem = d["script-src-elem"];
		const effective_style_src = d["style-src"] || d["default-src"];
		const style_src_attr = d["style-src-attr"];
		const style_src_elem = d["style-src-elem"];
		/** @param {(import('types').Csp.Source | import('types').Csp.ActionSource)[] | undefined} directive */
		const style_needs_csp = (directive) => !!directive && !directive.some((value) => value === "unsafe-inline");
		/** @param {(import('types').Csp.Source | import('types').Csp.ActionSource)[] | undefined} directive */
		const script_needs_csp = (directive) => !!directive && (!directive.some((value) => value === "unsafe-inline") || directive.some((value) => value === "strict-dynamic"));
		this.#script_src_needs_csp = script_needs_csp(effective_script_src);
		this.#script_src_elem_needs_csp = script_needs_csp(script_src_elem);
		this.#style_src_needs_csp = style_needs_csp(effective_style_src);
		this.#style_src_attr_needs_csp = style_needs_csp(style_src_attr);
		this.#style_src_elem_needs_csp = style_needs_csp(style_src_elem);
		this.#script_needs_csp = this.#script_src_needs_csp || this.#script_src_elem_needs_csp;
		this.#style_needs_csp = this.#style_src_needs_csp || this.#style_src_attr_needs_csp || this.#style_src_elem_needs_csp;
		this.script_needs_nonce = this.#script_needs_csp && !this.#use_hashes;
		this.style_needs_nonce = this.#style_needs_csp && !this.#use_hashes;
		this.script_needs_hash = this.#script_needs_csp && this.#use_hashes;
		this.#nonce = nonce;
	}
	/** @param {string} content */
	add_script(content) {
		if (!this.#script_needs_csp) return;
		/** @type {`nonce-${string}` | `sha256-${string}`} */
		const source = this.#use_hashes ? `sha256-${sha256(content)}` : `nonce-${this.#nonce}`;
		if (this.#script_src_needs_csp) this.#script_src.add(source);
		if (this.#script_src_elem_needs_csp) this.#script_src_elem.add(source);
	}
	/** @param {`sha256-${string}`[]} hashes */
	add_script_hashes(hashes) {
		for (const hash of hashes) {
			if (this.#script_src_needs_csp) this.#script_src.add(hash);
			if (this.#script_src_elem_needs_csp) this.#script_src_elem.add(hash);
		}
	}
	/** @param {string} content */
	add_style(content) {
		if (!this.#style_needs_csp) return;
		/** @type {`nonce-${string}` | `sha256-${string}`} */
		const source = this.#use_hashes ? `sha256-${sha256(content)}` : `nonce-${this.#nonce}`;
		if (this.#style_src_needs_csp) this.#style_src.add(source);
		if (this.#style_src_attr_needs_csp) this.#style_src_attr.add(source);
		if (this.#style_src_elem_needs_csp) {
			const sha256_empty_comment_hash = "sha256-9OlNO0DNEeaVzHL4RZwCLsBHA8WBQ8toBp/4F5XV2nc=";
			const d = this.#directives;
			if (d["style-src-elem"] && !d["style-src-elem"].includes(sha256_empty_comment_hash) && !this.#style_src_elem.has(sha256_empty_comment_hash)) this.#style_src_elem.add(sha256_empty_comment_hash);
			if (source !== sha256_empty_comment_hash) this.#style_src_elem.add(source);
		}
	}
	/**
	* @param {boolean} [is_meta]
	*/
	get_header(is_meta = false) {
		const header = [];
		const directives = { ...this.#directives };
		if (this.#style_src.size > 0) directives["style-src"] = [...directives["style-src"] || directives["default-src"] || [], ...this.#style_src];
		if (this.#style_src_attr.size > 0) directives["style-src-attr"] = [...directives["style-src-attr"] || [], ...this.#style_src_attr];
		if (this.#style_src_elem.size > 0) directives["style-src-elem"] = [...directives["style-src-elem"] || [], ...this.#style_src_elem];
		if (this.#script_src.size > 0) directives["script-src"] = [...directives["script-src"] || directives["default-src"] || [], ...this.#script_src];
		if (this.#script_src_elem.size > 0) directives["script-src-elem"] = [...directives["script-src-elem"] || [], ...this.#script_src_elem];
		for (const key in directives) {
			if (is_meta && (key === "frame-ancestors" || key === "report-uri" || key === "sandbox")) continue;
			const value = directives[key];
			if (!value) continue;
			const directive = [key];
			if (Array.isArray(value)) value.forEach((value) => {
				if (quoted.has(value) || crypto_pattern.test(value)) directive.push(`'${value}'`);
				else directive.push(value);
			});
			header.push(directive.join(" "));
		}
		return header.join("; ");
	}
};
var CspProvider = class extends BaseProvider {
	get_meta() {
		const content = this.get_header(true);
		if (!content) return;
		return `<meta http-equiv="content-security-policy" content="${escape_html(content, true)}">`;
	}
};
var CspReportOnlyProvider = class extends BaseProvider {
	/**
	* @param {boolean} use_hashes
	* @param {import('types').CspDirectives} directives
	* @param {string} nonce
	*/
	constructor(use_hashes, directives, nonce) {
		super(use_hashes, directives, nonce);
		if (Object.values(directives).filter((v) => !!v).length > 0) {
			const has_report_to = directives["report-to"]?.length ?? false;
			const has_report_uri = directives["report-uri"]?.length ?? false;
			if (!has_report_to && !has_report_uri) throw Error("`content-security-policy-report-only` must be specified with either the `report-to` or `report-uri` directives, or both");
		}
	}
};
var Csp = class {
	/** @readonly */
	nonce = generate_nonce();
	/** @type {CspProvider} */
	csp_provider;
	/** @type {CspReportOnlyProvider} */
	report_only_provider;
	/**
	* @param {import('./types.js').CspConfig} config
	* @param {import('./types.js').CspOpts} opts
	*/
	constructor({ mode, directives, reportOnly }, { prerender }) {
		const use_hashes = mode === "hash" || mode === "auto" && prerender;
		this.csp_provider = new CspProvider(use_hashes, directives, this.nonce);
		this.report_only_provider = new CspReportOnlyProvider(use_hashes, reportOnly, this.nonce);
	}
	get script_needs_hash() {
		return this.csp_provider.script_needs_hash || this.report_only_provider.script_needs_hash;
	}
	get script_needs_nonce() {
		return this.csp_provider.script_needs_nonce || this.report_only_provider.script_needs_nonce;
	}
	get style_needs_nonce() {
		return this.csp_provider.style_needs_nonce || this.report_only_provider.style_needs_nonce;
	}
	/** @param {string} content */
	add_script(content) {
		this.csp_provider.add_script(content);
		this.report_only_provider.add_script(content);
	}
	/** @param {`sha256-${string}`[]} hashes */
	add_script_hashes(hashes) {
		this.csp_provider.add_script_hashes(hashes);
		this.report_only_provider.add_script_hashes(hashes);
	}
	/** @param {string} content */
	add_style(content) {
		this.csp_provider.add_style(content);
		this.report_only_provider.add_style(content);
	}
};
//#endregion
//#region ../../node_modules/.bun/@sveltejs+kit@2.69.3+ab726ce7a871e72d/node_modules/@sveltejs/kit/src/runtime/server/page/server_routing.js
/** @import { SSRManifest } from '@sveltejs/kit' */
/**
* @param {import('types').SSRClientRoute} route
* @param {URL} url
* @param {NonNullable<SSRManifest['_']['client']>} client
* @returns {string}
*/
function generate_route_object(route, url, client) {
	const { errors, layouts, leaf } = route;
	const nodes = [
		...errors,
		...layouts.map((l) => l?.[1]),
		leaf[1]
	].filter((n) => typeof n === "number").map((n) => `'${n}': () => ${create_client_import(client.nodes?.[n], url)}`).join(",\n		");
	/** @type {import('types').CSRRouteServer} */
	return [
		`{\n\tid: ${s(route.id)}`,
		`errors: ${s(route.errors)}`,
		`layouts: ${s(route.layouts)}`,
		`leaf: ${s(route.leaf)}`,
		`nodes: {\n\t\t${nodes}\n\t}\n}`
	].join(",\n	");
}
/**
* @param {string | undefined} import_path
* @param {URL} url
*/
function create_client_import(import_path, url) {
	if (!import_path) return "Promise.resolve({})";
	if (import_path[0] === "/") return `import('${import_path}')`;
	if (assets !== "") return `import('${assets}/${import_path}')`;
	let path = get_relative_path(url.pathname, `${base}/${import_path}`);
	if (path[0] !== ".") path = `./${path}`;
	return `import('${path}')`;
}
/**
* @param {string} resolved_path
* @param {URL} url
* @param {SSRManifest} manifest
* @returns {Promise<Response>}
*/
async function resolve_route(resolved_path, url, manifest) {
	if (!manifest._.client?.routes) return text("Server-side route resolution disabled", { status: 400 });
	const matchers = await manifest._.matchers();
	const result = find_route(resolved_path, manifest._.client.routes, matchers);
	return create_server_routing_response(result?.route ?? null, result?.params ?? {}, url, manifest._.client).response;
}
/**
* @param {import('types').SSRClientRoute | null} route
* @param {Partial<Record<string, string>>} params
* @param {URL} url
* @param {NonNullable<SSRManifest['_']['client']>} client
* @returns {{response: Response, body: string}}
*/
function create_server_routing_response(route, params, url, client) {
	const headers = new Headers({ "content-type": "application/javascript; charset=utf-8" });
	if (route) {
		const csr_route = generate_route_object(route, url, client);
		const body = `${create_css_import(route, url, client)}\nexport const route = ${csr_route}; export const params = ${JSON.stringify(params)};`;
		return {
			response: text(body, { headers }),
			body
		};
	} else return {
		response: text("", { headers }),
		body: ""
	};
}
/**
* This function generates the client-side import for the CSS files that are
* associated with the current route. Vite takes care of that when using
* client-side route resolution, but for server-side resolution it does
* not know about the CSS files automatically.
*
* @param {import('types').SSRClientRoute} route
* @param {URL} url
* @param {NonNullable<SSRManifest['_']['client']>} client
* @returns {string}
*/
function create_css_import(route, url, client) {
	const { errors, layouts, leaf } = route;
	let css = "";
	for (const node of [
		...errors,
		...layouts.map((l) => l?.[1]),
		leaf[1]
	]) {
		if (typeof node !== "number") continue;
		const node_css = client.css?.[node];
		for (const css_path of node_css ?? []) css += `'${assets || base}/${css_path}',`;
	}
	if (!css) return "";
	return `${create_client_import(client.start, url)}.then(x => x.load_css([${css}]));`;
}
//#endregion
//#region ../../node_modules/.bun/@sveltejs+kit@2.69.3+ab726ce7a871e72d/node_modules/@sveltejs/kit/src/runtime/server/remote.js
/** @import { ActionResult, RemoteForm, RequestEvent, SSRManifest } from '@sveltejs/kit' */
/** @import { RemoteFormInternals, RemoteFunctionData, RemoteFunctionResponse, RemoteInternals, RequestState, SSROptions } from 'types' */
/** @type {typeof handle_remote_call_internal} */
async function handle_remote_call(event, state, options, manifest, id) {
	return record_span({
		name: "sveltekit.remote.call",
		attributes: { },
		fn: (current) => {
			const traced_event = merge_tracing(event, current);
			return with_request_store({
				event: traced_event,
				state
			}, () => handle_remote_call_internal(traced_event, state, options, manifest, id));
		}
	});
}
/**
* @param {RequestEvent} event
* @param {RequestState} state
* @param {SSROptions} options
* @param {SSRManifest} manifest
* @param {string} id
*/
async function handle_remote_call_internal(event, state, options, manifest, id) {
	const [hash, name, additional_args] = id.split("/");
	const remotes = manifest._.remotes;
	if (!remotes[hash]) error(404);
	const fn = (await remotes[hash]()).default[name];
	if (!fn) error(404);
	/** @type {RemoteInternals} */
	const internals = fn.__;
	const transport = options.hooks.transport;
	event.tracing.current.setAttributes({
		"sveltekit.remote.call.type": internals.type,
		"sveltekit.remote.call.name": internals.name
	});
	/** @type {HeadersInit | undefined} */
	const headers = state.prerendering ? void 0 : { "cache-control": "private, no-store" };
	try {
		/** @type {RemoteFunctionData} */
		const data = {};
		switch (internals.type) {
			case "query_live": {
				if (event.request.method !== "GET") throw new SvelteKitError(405, "Method Not Allowed", `\`query.live\` functions must be invoked via GET request, not ${event.request.method}`);
				const payload = new URL(event.request.url).searchParams.get("payload");
				const generator = internals.run(event, state, parse_remote_arg(payload, transport));
				const encoder = new TextEncoder();
				/**
				* @param {ReadableStreamDefaultController} controller
				* @param {any} payload
				*/
				function send(controller, payload) {
					controller.enqueue(encoder.encode("data: " + JSON.stringify(payload) + "\n\n"));
				}
				let closed = false;
				/** @type {string | undefined} */
				let result = void 0;
				async function cancel() {
					if (closed) return;
					closed = true;
					await generator.return(void 0);
				}
				event.request.signal.addEventListener("abort", cancel, { once: true });
				return new Response(new ReadableStream({
					async pull(controller) {
						if (event.request.signal.aborted) {
							await cancel();
							controller.close();
							return;
						}
						try {
							while (true) {
								const { value, done } = await generator.next();
								if (done) {
									await cancel();
									controller.close();
									return;
								}
								if (result !== (result = stringify(value, transport))) {
									send(controller, {
										type: "result",
										result
									});
									return;
								}
							}
						} catch (error) {
							if (!event.request.signal.aborted) if (error instanceof Redirect) send(controller, {
								type: "redirect",
								location: error.location
							});
							else {
								const status = error instanceof HttpError || error instanceof SvelteKitError ? error.status : 500;
								send(controller, {
									type: "error",
									error: await handle_error_and_jsonify(event, state, options, error),
									status
								});
							}
							await cancel();
							controller.close();
						}
					},
					cancel
				}), { headers: {
					"cache-control": "private, no-store",
					"content-type": "text/event-stream"
				} });
			}
			case "query_batch": {
				if (event.request.method !== "POST") throw new SvelteKitError(405, "Method Not Allowed", `\`query.batch\` functions must be invoked via POST request, not ${event.request.method}`);
				/** @type {{ payloads: string[] }} */
				const { payloads } = await event.request.json();
				const args = await Promise.all(payloads.map((payload) => parse_remote_arg(payload, transport)));
				data._ = await with_request_store({
					event,
					state
				}, () => internals.run(args, options));
				break;
			}
			case "form": {
				if (event.request.method !== "POST") throw new SvelteKitError(405, "Method Not Allowed", `\`form\` functions must be invoked via POST request, not ${event.request.method}`);
				if (!is_form_content_type(event.request)) throw new SvelteKitError(415, "Unsupported Media Type", `\`form\` functions expect form-encoded data — received ${event.request.headers.get("content-type")}`);
				const { data: input, meta, form_data } = await deserialize_binary_form(event.request);
				state.remote.requested = create_requested_map(meta.remote_refreshes);
				if (additional_args && !("id" in input)) input.id = JSON.parse(decodeURIComponent(additional_args));
				const fn = internals.fn;
				data._ = await with_request_store({
					event,
					state: {
						...state,
						is_in_remote_form_or_command: true
					}
				}, () => fn(input, meta, form_data));
				if (data._.issues) return json({
					type: "result",
					data: stringify(data, transport)
				}, { headers });
				break;
			}
			case "command": {
				/** @type {{ payload: string, refreshes?: string[] }} */
				const { payload, refreshes } = await event.request.json();
				state.remote.requested = create_requested_map(refreshes);
				const arg = parse_remote_arg(payload, transport);
				data._ = await with_request_store({
					event,
					state: {
						...state,
						is_in_remote_form_or_command: true
					}
				}, () => fn(arg));
				break;
			}
			case "prerender":
				data._ = await with_request_store({
					event,
					state
				}, () => fn(parse_remote_arg(additional_args, transport)));
				break;
			case "query": {
				const payload = new URL(event.request.url).searchParams.get("payload");
				data._ = await with_request_store({
					event,
					state
				}, () => fn(parse_remote_arg(payload, transport)));
				break;
			}
		}
		await collect_remote_data(data, event, state, options);
		return json({
			type: "result",
			data: stringify(data, transport)
		}, { headers });
	} catch (error) {
		if (error instanceof Redirect) return json({
			type: "result",
			data: stringify(await collect_remote_data({ redirect: error.location }, event, state, options), transport)
		}, { headers });
		const status = error instanceof HttpError || error instanceof SvelteKitError ? error.status : 500;
		return json({
			type: "error",
			error: await handle_error_and_jsonify(event, state, options, error),
			status
		}, {
			status: state.prerendering ? status : void 0,
			headers: { "cache-control": "private, no-store" }
		});
	}
}
/**
* Collects all the query/prerender data that was retrieved
* during the request and adds it to `data`
* @param {RemoteFunctionData} data
* @param {RequestEvent} event
* @param {RequestState} state
* @param {SSROptions} options
*/
async function collect_remote_data(data, event, state, options) {
	/**
	*
	* @param {unknown} error
	* @returns {Promise<[status: number, error: App.Error]>}
	*/
	async function convert_error(error) {
		return [error instanceof HttpError || error instanceof SvelteKitError ? error.status : 500, await handle_error_and_jsonify(event, state, options, error)];
	}
	/** @type {Promise<any>[]} */
	const promises = [];
	if (state.remote.explicit) for (const [remote_key, { internals, promise }] of state.remote.explicit) {
		data.r = true;
		const type = internals.type === "query_live" ? "l" : internals.type[0];
		await promise.then((v) => {
			((data[type] ??= {})[remote_key] ??= {}).v = v;
		}, async (e) => {
			if (e instanceof Redirect) return;
			((data[type] ??= {})[remote_key] ??= {}).e = await convert_error(e);
		});
	}
	await Promise.all(promises);
	if (state.remote.implicit) for (const [internals, record] of state.remote.implicit) {
		if (!internals.id) continue;
		for (const key in record) {
			const remote_key = internals.type === "form" ? key : create_remote_key(internals.id, key);
			const type = internals.type === "query_live" ? "l" : internals.type[0];
			const promise = state.remote.data?.get(internals)?.[key] ?? record[key]();
			let resolved = true;
			await Promise.race([Promise.resolve(promise).then((v) => {
				if (resolved) ((data[type] ??= {})[remote_key] ??= {}).v = v;
			}, (e) => {
				if (e instanceof Redirect) return;
				if (resolved) promises.push(convert_error(e).then((e) => {
					((data[type] ??= {})[remote_key] ??= {}).e = e;
				}));
			}), Promise.resolve().then(() => resolved = false)]);
		}
	}
	await Promise.all(promises);
	return data;
}
/**
* @param {string[] | undefined} refreshes
*/
function create_requested_map(refreshes) {
	/** @type {Map<string, string[]>} */
	const requested = /* @__PURE__ */ new Map();
	for (const key of refreshes ?? []) {
		const parts = split_remote_key(key);
		const existing = requested.get(parts.id);
		if (existing) existing.push(parts.payload);
		else requested.set(parts.id, [parts.payload]);
	}
	return requested;
}
/** @type {typeof handle_remote_form_post_internal} */
async function handle_remote_form_post(event, state, manifest, id) {
	return record_span({
		name: "sveltekit.remote.form.post",
		attributes: { },
		fn: (current) => {
			const traced_event = merge_tracing(event, current);
			return with_request_store({
				event: traced_event,
				state
			}, () => handle_remote_form_post_internal(traced_event, state, manifest, id));
		}
	});
}
/**
* @param {RequestEvent} event
* @param {RequestState} state
* @param {SSRManifest} manifest
* @param {string} id
* @returns {Promise<ActionResult>}
*/
async function handle_remote_form_post_internal(event, state, manifest, id) {
	const [hash, name, ...rest] = id.split("/");
	const action_id = rest.join("/");
	let form = (await manifest._.remotes[hash]?.())?.default[name];
	if (!form) {
		event.setHeaders({ allow: "GET" });
		return {
			type: "error",
			error: new SvelteKitError(405, "Method Not Allowed", `POST method not allowed. No form actions exist for this page`)
		};
	}
	if (action_id) form = with_request_store({
		event,
		state
	}, () => form.for(JSON.parse(action_id)));
	try {
		const fn = form.__.fn;
		const { data, meta, form_data } = await deserialize_binary_form(event.request);
		if (action_id && !("id" in data)) data.id = JSON.parse(decodeURIComponent(action_id));
		await with_request_store({
			event,
			state: {
				...state,
				is_in_remote_form_or_command: true
			}
		}, () => fn(data, meta, form_data));
		return {
			type: "success",
			status: 200
		};
	} catch (e) {
		const err = normalize_error(e);
		if (err instanceof Redirect) return {
			type: "redirect",
			status: err.status,
			location: err.location
		};
		return {
			type: "error",
			error: check_incorrect_fail_use(err)
		};
	}
}
/**
* @param {URL} url
*/
function get_remote_id(url) {
	return url.pathname.startsWith(`${base}/_app/remote/`) && url.pathname.replace(`${base}/_app/remote/`, "");
}
/**
* @param {URL} url
*/
function get_remote_action(url) {
	return url.searchParams.get("/remote");
}
//#endregion
//#region ../../node_modules/.bun/@sveltejs+kit@2.69.3+ab726ce7a871e72d/node_modules/@sveltejs/kit/src/runtime/server/page/render.js
var updated = {
	...readable(false),
	check: () => false
};
/**
* Creates the HTML response.
* @param {{
*   branch: Array<import('./types.js').Loaded>;
*   fetched: Array<import('./types.js').Fetched>;
*   options: import('types').SSROptions;
*   manifest: import('@sveltejs/kit').SSRManifest;
*   state: import('types').SSRState;
*   page_config: { ssr: boolean; csr: boolean };
*   status: number;
*   error: App.Error | null;
*   event: import('@sveltejs/kit').RequestEvent;
*   event_state: import('types').RequestState;
*   resolve_opts: import('types').RequiredResolveOptions;
*   action_result?: import('@sveltejs/kit').ActionResult;
*   data_serializer: import('./types.js').ServerDataSerializer;
*   error_components?: Array<import('types').SSRComponent | undefined>
* }} opts
*/
async function render_response({ branch, fetched, options, manifest, state, page_config, status, error = null, event, event_state, resolve_opts, action_result, data_serializer, error_components }) {
	if (state.prerendering) {
		if (options.csp.mode === "nonce") throw new Error("Cannot use prerendering if config.kit.csp.mode === \"nonce\"");
		if (options.app_template_contains_nonce) throw new Error("Cannot use prerendering if page template contains %sveltekit.nonce%");
	}
	const { client } = manifest._;
	const modulepreloads = new Set(client?.imports);
	const stylesheets = new Set(client?.stylesheets);
	const fonts = new Set(client?.fonts);
	/**
	* The value of the Link header that is added to the response when not prerendering
	* @type {Set<string>}
	*/
	const link_headers = /* @__PURE__ */ new Set();
	/** @type {Map<string, string>} */
	const inline_styles = /* @__PURE__ */ new Map();
	/** @type {ReturnType<typeof options.root.render>} */
	let rendered;
	const form_value = action_result?.type === "success" || action_result?.type === "failure" ? action_result.data ?? null : null;
	/** @type {string} */
	let base$1 = base;
	/** @type {string} */
	let assets$1 = assets;
	/**
	* An expression that will evaluate in the client to determine the resolved base path.
	* We use a relative path when possible to support IPFS, the internet archive, etc.
	*/
	let base_expression = s(base);
	const csp = new Csp(options.csp, { prerender: !!state.prerendering });
	if (!state.prerendering?.fallback) {
		base$1 = (event.isDataRequest ? add_data_suffix(event.url.pathname) : event.url.pathname).slice(base.length).split("/").slice(2).map(() => "..").join("/") || ".";
		base_expression = `new URL(${s(base$1)}, location).pathname.slice(0, -1)`;
		if (!assets || assets[0] === "/" && assets !== "/_svelte_kit_assets") assets$1 = base$1;
	} else if (options.hash_routing) base_expression = "new URL('.', location).pathname.slice(0, -1)";
	if (page_config.ssr) {
		/** @type {Record<string, any>} */
		const props = {
			stores: {
				page: writable(null),
				navigating: writable(null),
				updated
			},
			constructors: await Promise.all(branch.map(({ node }) => {
				if (!node.component) throw new Error(`Missing +page.svelte component for route ${event.route.id}`);
				return node.component();
			})),
			form: form_value
		};
		if (error_components) {
			if (error) props.error = error;
			props.errors = error_components;
		}
		let data = {};
		for (let i = 0; i < branch.length; i += 1) {
			data = {
				...data,
				...branch[i].data
			};
			props[`data_${i}`] = data;
		}
		props.page = {
			error,
			params: event.params,
			route: event.route,
			status,
			url: event.url,
			data,
			form: form_value,
			state: {}
		};
		const render_opts = {
			context: /* @__PURE__ */ new Map([["__request__", { page: props.page }]]),
			csp: csp.script_needs_nonce ? { nonce: csp.nonce } : { hash: csp.script_needs_hash },
			transformError: error_components ? async (e) => {
				if (isRedirect(e)) throw e;
				const transformed = await handle_error_and_jsonify(event, event_state, options, e);
				props.page.error = props.error = error = transformed;
				props.page.status = status = get_status(e);
				return transformed;
			} : void 0
		};
		try {
			rendered = await with_request_store({
				event,
				state: {
					...event_state,
					is_in_render: true
				}
			}, async () => {
				override({
					base: base$1,
					assets: assets$1
				});
				const maybe_promise = options.root.render(props, render_opts);
				const rendered = options.async && "then" in maybe_promise ? maybe_promise.then((r) => r) : maybe_promise;
				if (options.async) reset();
				const { head, html, css, hashes } = options.async ? await rendered : rendered;
				if (hashes) csp.add_script_hashes(hashes.script);
				return {
					head,
					html,
					css,
					hashes
				};
			});
		} finally {
			reset();
		}
	} else rendered = {
		head: "",
		html: "",
		css: {
			code: "",
			map: null
		},
		hashes: { script: [] }
	};
	for (const { node } of branch) {
		for (const url of node.imports) modulepreloads.add(url);
		for (const url of node.stylesheets) stylesheets.add(url);
		for (const url of node.fonts) fonts.add(url);
		if (node.inline_styles && !client?.inline) Object.entries(await node.inline_styles()).forEach(([filename, css]) => {
			if (typeof css === "string") {
				inline_styles.set(filename, css);
				return;
			}
			inline_styles.set(filename, css(`${assets$1}/${app_dir}/immutable/assets`, assets$1));
		});
	}
	const head = new Head(rendered.head, !!state.prerendering);
	let body = rendered.html;
	/** @param {string} path */
	const prefixed = (path) => {
		if (path.startsWith("/")) return base + path;
		return `${assets$1}/${path}`;
	};
	const style = client?.inline ? client.inline?.style : Array.from(inline_styles.values()).join("\n");
	if (style) {
		const attributes = [];
		if (csp.style_needs_nonce) attributes.push(`nonce="${csp.nonce}"`);
		csp.add_style(style);
		head.add_style(style, attributes);
	}
	for (const dep of stylesheets) {
		const path = prefixed(dep);
		const attributes = ["rel=\"stylesheet\""];
		if (inline_styles.has(dep)) attributes.push("disabled", "media=\"(max-width: 0)\"");
		else if (resolve_opts.preload({
			type: "css",
			path
		})) link_headers.add(`<${encodeURI(path)}>; rel="preload"; as="style"; nopush`);
		head.add_stylesheet(path, attributes);
	}
	for (const dep of fonts) {
		const path = prefixed(dep);
		if (resolve_opts.preload({
			type: "font",
			path
		})) {
			const ext = dep.slice(dep.lastIndexOf(".") + 1);
			head.add_link_tag(path, [
				"rel=\"preload\"",
				"as=\"font\"",
				`type="font/${ext}"`,
				"crossorigin"
			]);
			link_headers.add(`<${encodeURI(path)}>; rel="preload"; as="font"; type="font/${ext}"; crossorigin; nopush`);
		}
	}
	const global = get_global_name(options);
	const { data, chunks } = data_serializer.get_data(csp);
	if (page_config.ssr && page_config.csr) body += `\n\t\t\t${fetched.map((item) => serialize_data(item, resolve_opts.filterSerializedResponseHeaders, !!state.prerendering)).join("\n			")}`;
	if (page_config.csr && client) {
		const route = client.routes?.find((r) => r.id === event.route.id) ?? null;
		const load_env_eagerly = client.uses_env_dynamic_public && !!state.prerendering;
		if (load_env_eagerly) modulepreloads.add(`${app_dir}/env.js`);
		if (!client.inline) {
			const included_modulepreloads = Array.from(modulepreloads, (dep) => prefixed(dep)).filter((path) => resolve_opts.preload({
				type: "js",
				path
			}));
			for (const path of included_modulepreloads) {
				link_headers.add(`<${encodeURI(path)}>; rel="modulepreload"; nopush`);
				if (options.preload_strategy !== "modulepreload") head.add_script_preload(path);
				else head.add_link_tag(path, ["rel=\"modulepreload\""]);
			}
		}
		if (client.routes && state.prerendering && !state.prerendering.fallback) {
			const pathname = add_resolution_suffix(event.url.pathname);
			state.prerendering.dependencies.set(pathname, create_server_routing_response(route, event.params, new URL(pathname, event.url), client));
		}
		const blocks = [];
		const properties = [`base: ${base_expression}`];
		if (assets) properties.push(`assets: ${s(assets)}`);
		if (client.uses_env_dynamic_public) properties.push(`env: ${load_env_eagerly ? "null" : s(public_env)}`);
		if (chunks) {
			blocks.push("const deferred = new Map();");
			properties.push(`defer: (id) => new Promise((fulfil, reject) => {
							deferred.set(id, { fulfil, reject });
						})`);
			let app_declaration = "";
			if (Object.keys(options.hooks.transport).length > 0) if (client.inline) app_declaration = `const app = ${global}.app.app;`;
			else if (client.app) app_declaration = `const app = await import(${s(prefixed(client.app))});`;
			else app_declaration = `const { app } = await import(${s(prefixed(client.start))});`;
			const prelude = app_declaration ? `${app_declaration}
							const [data, error] = fn(app);` : `const [data, error] = fn();`;
			properties.push(`resolve: async (id, fn) => {
							${prelude}

							const try_to_resolve = () => {
								if (!deferred.has(id)) {
									setTimeout(try_to_resolve, 0);
									return;
								}
								const { fulfil, reject } = deferred.get(id);
								deferred.delete(id);
								if (error) reject(error);
								else fulfil(data);
							}
							try_to_resolve();
						}`);
		}
		blocks.push(`${global} = {
						${properties.join(",\n						")}
					};`);
		const args = ["element"];
		blocks.push("const element = document.currentScript.parentElement;");
		if (page_config.ssr) {
			const serialized = {
				form: "null",
				error: "null"
			};
			if (form_value) serialized.form = uneval_action_response(form_value, event.route.id, options.hooks.transport);
			if (error) serialized.error = uneval(error);
			const hydrate = [
				`node_ids: [${branch.map(({ node }) => node.index).join(", ")}]`,
				`data: ${data}`,
				`form: ${serialized.form}`,
				`error: ${serialized.error}`
			];
			if (status !== 200) hydrate.push(`status: ${status}`);
			if (client.routes) {
				if (route) {
					const stringified = generate_route_object(route, event.url, client).replaceAll("\n", "\n							");
					hydrate.push(`params: ${uneval(event.params)}`, `server_route: ${stringified}`);
				}
			} else if (options.embedded) hydrate.push(`params: ${uneval(event.params)}`, `route: ${s(event.route)}`);
			const indent = "	".repeat(load_env_eagerly ? 7 : 6);
			args.push(`{\n${indent}\t${hydrate.join(`,\n${indent}\t`)}\n${indent}}`);
		}
		const remote_data = await collect_remote_data({}, event, event_state, options);
		const serialized_data = Object.keys(remote_data).length > 0 ? `${global}.data = ${uneval(remote_data, create_replacer(options.hooks.transport))};\n\n\t\t\t\t\t\t` : "";
		const boot = client.inline ? `${client.inline.script}

					${serialized_data}${global}.app.start(${args.join(", ")});` : client.app ? `Promise.all([
						import(${s(prefixed(client.start))}),
						import(${s(prefixed(client.app))})
					]).then(([kit, app]) => {
						${serialized_data}kit.start(app, ${args.join(", ")});
					});` : `import(${s(prefixed(client.start))}).then((app) => {
						${serialized_data}app.start(${args.join(", ")})
					});`;
		if (load_env_eagerly) blocks.push(`import(${s(`${base$1}/${app_dir}/env.js`)}).then(({ env }) => {
						${global}.env = env;

						${boot.replace(/\n/g, "\n	")}
					});`);
		else blocks.push(boot);
		if (options.service_worker) {
			let opts = "";
			if (options.service_worker_options != null) opts = `, ${s({ ...options.service_worker_options })}`;
			blocks.push(`if ('serviceWorker' in navigator) {
						const script_url = '${prefixed("service-worker.js")}';
						const policy = globalThis?.window?.trustedTypes?.createPolicy(
							'sveltekit-trusted-url',
							{ createScriptURL(url) { return url; } }
						);
						const sanitised = policy?.createScriptURL(script_url) ?? script_url;
						addEventListener('load', function () {
							navigator.serviceWorker.register(sanitised${opts});
						});
					}`);
		}
		const init_app = `
				{
					${blocks.join("\n\n					")}
				}
			`;
		csp.add_script(init_app);
		body += `\n\t\t\t<script${csp.script_needs_nonce ? ` nonce="${csp.nonce}"` : ""}>${init_app}<\/script>\n\t\t`;
	}
	const headers = new Headers({
		"x-sveltekit-page": "true",
		"content-type": "text/html"
	});
	if (state.prerendering) {
		const csp_headers = csp.csp_provider.get_meta();
		if (csp_headers) head.add_http_equiv(csp_headers);
		if (state.prerendering.cache) head.add_http_equiv(`<meta http-equiv="cache-control" content="${state.prerendering.cache}">`);
	} else {
		const csp_header = csp.csp_provider.get_header();
		if (csp_header) headers.set("content-security-policy", csp_header);
		const report_only_header = csp.report_only_provider.get_header();
		if (report_only_header) headers.set("content-security-policy-report-only", report_only_header);
		if (link_headers.size) headers.set("link", Array.from(link_headers).join(", "));
	}
	const html = options.templates.app({
		head: head.build(),
		body,
		assets: assets$1,
		nonce: csp.nonce,
		env: public_env
	});
	const transformed = await resolve_opts.transformPageChunk({
		html,
		done: true
	}) || "";
	if (!chunks) headers.set("etag", `"${hash(transformed)}"`);
	return !chunks ? text(transformed, {
		status,
		headers
	}) : new Response(new ReadableStream({
		async start(controller) {
			controller.enqueue(text_encoder.encode(transformed + "\n"));
			for await (const chunk of chunks) if (chunk.length) controller.enqueue(text_encoder.encode(chunk));
			controller.close();
		},
		type: "bytes"
	}), { headers });
}
var Head = class {
	#rendered;
	#prerendering;
	/** @type {string[]} */
	#http_equiv = [];
	/** @type {string[]} */
	#link_tags = [];
	/** @type {string[]} */
	#script_preloads = [];
	/** @type {string[]} */
	#style_tags = [];
	/** @type {string[]} */
	#stylesheet_links = [];
	/**
	* @param {string} rendered
	* @param {boolean} prerendering
	*/
	constructor(rendered, prerendering) {
		this.#rendered = rendered;
		this.#prerendering = prerendering;
	}
	build() {
		return [
			...this.#http_equiv,
			...this.#link_tags,
			...this.#script_preloads,
			this.#rendered,
			...this.#style_tags,
			...this.#stylesheet_links
		].join("\n		");
	}
	/**
	* @param {string} style
	* @param {string[]} attributes
	*/
	add_style(style, attributes) {
		this.#style_tags.push(`<style${attributes.length ? " " + attributes.join(" ") : ""}>${style}</style>`);
	}
	/**
	* @param {string} href
	* @param {string[]} attributes
	*/
	add_stylesheet(href, attributes) {
		this.#stylesheet_links.push(`<link href="${href}" ${attributes.join(" ")}>`);
	}
	/** @param {string} href */
	add_script_preload(href) {
		this.#script_preloads.push(`<link rel="preload" as="script" crossorigin="anonymous" href="${href}">`);
	}
	/**
	* @param {string} href
	* @param {string[]} attributes
	*/
	add_link_tag(href, attributes) {
		if (!this.#prerendering) return;
		this.#link_tags.push(`<link href="${href}" ${attributes.join(" ")}>`);
	}
	/** @param {string} tag */
	add_http_equiv(tag) {
		if (!this.#prerendering) return;
		this.#http_equiv.push(tag);
	}
};
//#endregion
//#region ../../node_modules/.bun/@sveltejs+kit@2.69.3+ab726ce7a871e72d/node_modules/@sveltejs/kit/src/utils/page_nodes.js
var PageNodes = class {
	/** All layout nodes and the page node, if any */
	data;
	/**
	* @param {Array<import('types').SSRNode | undefined>} nodes
	*/
	constructor(nodes) {
		this.data = nodes;
	}
	layouts() {
		return this.data.slice(0, -1);
	}
	page() {
		return this.data.at(-1);
	}
	validate() {
		for (const layout of this.layouts()) if (layout) {
			validate_layout_server_exports(layout.server, layout.server_id);
			validate_layout_exports(layout.universal, layout.universal_id);
		}
		const page = this.page();
		if (page) {
			validate_page_server_exports(page.server, page.server_id);
			validate_page_exports(page.universal, page.universal_id);
		}
	}
	/**
	* @template {'prerender' | 'ssr' | 'csr' | 'trailingSlash'} Option
	* @param {Option} option
	* @returns {Value | undefined}
	*/
	#get_option(option) {
		/** @typedef {(import('types').UniversalNode | import('types').ServerNode)[Option]} Value */
		return this.data.reduce((value, node) => {
			return node?.universal?.[option] ?? node?.server?.[option] ?? value;
		}, void 0);
	}
	csr() {
		return this.#get_option("csr") ?? true;
	}
	ssr() {
		return this.#get_option("ssr") ?? true;
	}
	prerender() {
		return this.#get_option("prerender") ?? false;
	}
	trailing_slash() {
		return this.#get_option("trailingSlash") ?? "never";
	}
	get_config() {
		/** @type {any} */
		let current = {};
		for (const node of this.data) {
			if (!node?.universal?.config && !node?.server?.config) continue;
			current = {
				...current,
				...node?.universal?.config,
				...node?.server?.config
			};
		}
		return Object.keys(current).length ? current : void 0;
	}
	should_prerender_data() {
		return this.data.some((node) => node?.server?.load || node?.server?.trailingSlash !== void 0);
	}
};
//#endregion
//#region ../../node_modules/.bun/@sveltejs+kit@2.69.3+ab726ce7a871e72d/node_modules/@sveltejs/kit/src/runtime/server/page/respond_with_error.js
/**
* @typedef {import('./types.js').Loaded} Loaded
*/
/**
* @param {{
*   event: import('@sveltejs/kit').RequestEvent;
*   event_state: import('types').RequestState;
*   options: import('types').SSROptions;
*   manifest: import('@sveltejs/kit').SSRManifest;
*   state: import('types').SSRState;
*   status: number;
*   error: unknown;
*   resolve_opts: import('types').RequiredResolveOptions;
* }} opts
*/
async function respond_with_error({ event, event_state, options, manifest, state, status, error, resolve_opts }) {
	if (event.request.headers.get("x-sveltekit-error")) return static_error_page(
		options,
		status,
		/** @type {Error} */
		error.message
	);
	/** @type {import('./types.js').Fetched[]} */
	const fetched = [];
	try {
		const branch = [];
		const default_layout = await manifest._.nodes[0]();
		const nodes = new PageNodes([default_layout]);
		const ssr = nodes.ssr();
		const csr = nodes.csr();
		const data_serializer = server_data_serializer(event, event_state, options);
		if (ssr) {
			state.error = true;
			const server_data_promise = load_server_data({
				event,
				event_state,
				state,
				node: default_layout,
				parent: async () => ({})
			});
			const server_data = await server_data_promise;
			data_serializer.add_node(0, server_data);
			const data = await load_data({
				event,
				event_state,
				fetched,
				node: default_layout,
				parent: async () => ({}),
				resolve_opts,
				server_data_promise,
				state,
				csr
			});
			branch.push({
				node: default_layout,
				server_data,
				data
			}, {
				node: await manifest._.nodes[1](),
				data: null,
				server_data: null
			});
		}
		return await render_response({
			options,
			manifest,
			state,
			page_config: {
				ssr,
				csr
			},
			status,
			error: await handle_error_and_jsonify(event, event_state, options, error),
			branch,
			error_components: [],
			fetched,
			event,
			event_state,
			resolve_opts,
			data_serializer
		});
	} catch (e) {
		if (e instanceof Redirect) return redirect_response(e.status, e.location);
		return static_error_page(options, get_status(e), (await handle_error_and_jsonify(event, event_state, options, e)).message);
	}
}
//#endregion
//#region ../../node_modules/.bun/@sveltejs+kit@2.69.3+ab726ce7a871e72d/node_modules/@sveltejs/kit/src/runtime/server/page/index.js
/** @import { ActionResult, RequestEvent, SSRManifest } from '@sveltejs/kit' */
/** @import { PageNodeIndexes, RequestState, RequiredResolveOptions, ServerDataNode, SSRComponent, SSRNode, SSROptions, SSRState } from 'types' */
/**
* The maximum request depth permitted before assuming we're stuck in an infinite loop
*/
var MAX_DEPTH = 10;
/**
* @param {RequestEvent} event
* @param {RequestState} event_state
* @param {PageNodeIndexes} page
* @param {SSROptions} options
* @param {SSRManifest} manifest
* @param {SSRState} state
* @param {import('../../../utils/page_nodes.js').PageNodes} nodes
* @param {RequiredResolveOptions} resolve_opts
* @returns {Promise<Response>}
*/
async function render_page(event, event_state, page, options, manifest, state, nodes, resolve_opts) {
	if (state.depth > MAX_DEPTH) return text(`Not found: ${event.url.pathname}`, { status: 404 });
	if (is_action_json_request(event)) return handle_action_json_request(event, event_state, options, (await manifest._.nodes[page.leaf]())?.server);
	try {
		const leaf_node = nodes.page();
		let status = 200;
		/** @type {ActionResult | undefined} */
		let action_result = void 0;
		if (is_action_request(event)) {
			const remote_id = get_remote_action(event.url);
			if (remote_id) action_result = await handle_remote_form_post(event, event_state, manifest, remote_id);
			else action_result = await handle_action_request(event, event_state, leaf_node.server);
			if (action_result?.type === "redirect") return redirect_response(action_result.status, action_result.location);
			if (action_result?.type === "error") status = get_status(action_result.error);
			if (action_result?.type === "failure") status = action_result.status;
		}
		const should_prerender = nodes.prerender();
		if (should_prerender) {
			if (leaf_node.server?.actions) throw new Error("Cannot prerender pages with actions");
		} else if (state.prerendering) return new Response(void 0, { status: 204 });
		state.prerender_default = should_prerender;
		const should_prerender_data = nodes.should_prerender_data();
		const data_pathname = add_data_suffix(event.url.pathname);
		/** @type {import('./types.js').Fetched[]} */
		const fetched = [];
		const ssr = nodes.ssr();
		const csr = nodes.csr();
		if (ssr === false && !(state.prerendering && should_prerender_data)) return await render_response({
			branch: compact(nodes.data).map((node) => {
				return {
					node,
					data: null,
					server_data: null
				};
			}),
			fetched,
			page_config: {
				ssr: false,
				csr
			},
			status,
			error: null,
			event,
			event_state,
			options,
			manifest,
			state,
			resolve_opts,
			data_serializer: server_data_serializer(event, event_state, options)
		});
		/** @type {Array<import('./types.js').Loaded | null>} */
		const branch = [];
		/** @type {Error | null} */
		let load_error = null;
		const data_serializer = server_data_serializer(event, event_state, options);
		const data_serializer_json = state.prerendering && should_prerender_data ? server_data_serializer_json(event, event_state, options) : null;
		/** @type {Array<Promise<ServerDataNode | null>>} */
		const server_promises = nodes.data.map((node, i) => {
			if (load_error) throw load_error;
			return Promise.resolve().then(async () => {
				try {
					if (node === leaf_node && action_result?.type === "error") throw action_result.error;
					const server_data = await load_server_data({
						event,
						event_state,
						state,
						node,
						parent: async () => {
							/** @type {Record<string, any>} */
							const data = {};
							for (let j = 0; j < i; j += 1) {
								const parent = await server_promises[j];
								if (parent) Object.assign(data, parent.data);
							}
							return data;
						}
					});
					if (node) data_serializer.add_node(i, server_data);
					data_serializer_json?.add_node(i, server_data);
					return server_data;
				} catch (e) {
					load_error = e;
					throw load_error;
				}
			});
		});
		/** @type {Array<Promise<Record<string, any> | null>>} */
		const load_promises = nodes.data.map((node, i) => {
			if (load_error) throw load_error;
			return Promise.resolve().then(async () => {
				try {
					return await load_data({
						event,
						event_state,
						fetched,
						node,
						parent: async () => {
							const data = {};
							for (let j = 0; j < i; j += 1) Object.assign(data, await load_promises[j]);
							return data;
						},
						resolve_opts,
						server_data_promise: server_promises[i],
						state,
						csr
					});
				} catch (e) {
					load_error = e;
					throw load_error;
				}
			});
		});
		for (const p of server_promises) p.catch(noop);
		for (const p of load_promises) p.catch(noop);
		for (let i = 0; i < nodes.data.length; i += 1) {
			const node = nodes.data[i];
			if (node) try {
				const server_data = await server_promises[i];
				const data = await load_promises[i];
				branch.push({
					node,
					server_data,
					data
				});
			} catch (e) {
				const err = normalize_error(e);
				if (err instanceof Redirect) {
					if (state.prerendering && should_prerender_data) {
						const body = JSON.stringify({
							type: "redirect",
							location: err.location
						});
						state.prerendering.dependencies.set(data_pathname, {
							response: text(body),
							body
						});
					}
					return redirect_response(err.status, err.location);
				}
				const status = get_status(err);
				const error = await handle_error_and_jsonify(event, event_state, options, err);
				while (i--) if (page.errors[i]) {
					const index = page.errors[i];
					const node = await manifest._.nodes[index]();
					let j = i;
					while (!branch[j]) j -= 1;
					data_serializer.set_max_nodes(j + 1);
					const layouts = compact(branch.slice(0, j + 1));
					const nodes = new PageNodes(layouts.map((layout) => layout.node));
					const error_branch = layouts.concat({
						node,
						data: null,
						server_data: null
					});
					return await render_response({
						event,
						event_state,
						options,
						manifest,
						state,
						resolve_opts,
						page_config: {
							ssr: nodes.ssr(),
							csr: nodes.csr()
						},
						status,
						error,
						error_components: await load_error_components(options, ssr, error_branch, page, manifest),
						branch: error_branch,
						fetched,
						data_serializer
					});
				}
				return static_error_page(options, status, error.message);
			}
			else branch.push(null);
		}
		if (state.prerendering && data_serializer_json) {
			let { data, chunks } = data_serializer_json.get_data();
			if (chunks) for await (const chunk of chunks) data += chunk;
			state.prerendering.dependencies.set(data_pathname, {
				response: text(data),
				body: data
			});
		}
		return await render_response({
			event,
			event_state,
			options,
			manifest,
			state,
			resolve_opts,
			page_config: {
				csr,
				ssr
			},
			status,
			error: null,
			branch: compact(branch),
			action_result,
			fetched,
			data_serializer: !ssr ? server_data_serializer(event, event_state, options) : data_serializer,
			error_components: await load_error_components(options, ssr, branch, page, manifest)
		});
	} catch (e) {
		if (e instanceof Redirect) return redirect_response(e.status, e.location);
		return await respond_with_error({
			event,
			event_state,
			options,
			manifest,
			state,
			status: e instanceof HttpError ? e.status : 500,
			error: e,
			resolve_opts
		});
	}
}
/**
*
* @param {SSROptions} options
* @param {boolean} ssr
* @param {Array<import('./types.js').Loaded | null>} branch
* @param {PageNodeIndexes} page
* @param {SSRManifest} manifest
*/
async function load_error_components(options, ssr, branch, page, manifest) {
	/** @type {Array<SSRComponent | undefined> | undefined} */
	let error_components;
	if (options.server_error_boundaries && ssr) {
		let last_idx = -1;
		error_components = await Promise.all(branch.map((b, i) => {
			if (i === 0) return void 0;
			if (!b) return null;
			i--;
			while (i > last_idx + 1 && page.errors[i] === void 0) i -= 1;
			last_idx = i;
			const idx = page.errors[i];
			if (idx == null) return void 0;
			return manifest._.nodes[idx]?.().then((e) => e.component?.()).catch(() => void 0);
		}).filter((e) => e !== null));
	}
	return error_components;
}
//#endregion
//#region ../../node_modules/.bun/@sveltejs+kit@2.69.3+ab726ce7a871e72d/node_modules/@sveltejs/kit/src/runtime/server/data/index.js
/**
* @param {import('@sveltejs/kit').RequestEvent} event
* @param {import('types').RequestState} event_state
* @param {import('types').SSRRoute} route
* @param {import('types').SSROptions} options
* @param {import('@sveltejs/kit').SSRManifest} manifest
* @param {import('types').SSRState} state
* @param {boolean[] | undefined} invalidated_data_nodes
* @param {import('types').TrailingSlash} trailing_slash
* @returns {Promise<Response>}
*/
async function render_data(event, event_state, route, options, manifest, state, invalidated_data_nodes, trailing_slash) {
	if (!route.page) return new Response(void 0, { status: 404 });
	try {
		const node_ids = [...route.page.layouts, route.page.leaf];
		const invalidated = invalidated_data_nodes ?? node_ids.map(() => true);
		let aborted = false;
		const url = new URL(event.url);
		url.pathname = normalize_path(url.pathname, trailing_slash);
		const new_event = {
			...event,
			url
		};
		const functions = node_ids.map((n, i) => {
			return once(async () => {
				try {
					if (aborted) return { type: "skip" };
					const node = n == void 0 ? n : await manifest._.nodes[n]();
					return load_server_data({
						event: new_event,
						event_state,
						state,
						node,
						parent: async () => {
							/** @type {Record<string, any>} */
							const data = {};
							for (let j = 0; j < i; j += 1) {
								const parent = await functions[j]();
								if (parent) Object.assign(data, parent.data);
							}
							return data;
						}
					});
				} catch (e) {
					aborted = true;
					throw e;
				}
			});
		});
		const promises = functions.map(async (fn, i) => {
			if (!invalidated[i]) return { type: "skip" };
			return fn();
		});
		let length = promises.length;
		const nodes = await Promise.all(promises.map((p, i) => p.catch(async (error) => {
			if (error instanceof Redirect) throw error;
			length = Math.min(length, i + 1);
			return {
				type: "error",
				error: await handle_error_and_jsonify(event, event_state, options, error),
				status: error instanceof HttpError || error instanceof SvelteKitError ? error.status : void 0
			};
		})));
		const data_serializer = server_data_serializer_json(event, event_state, options);
		for (let i = 0; i < nodes.length; i++) data_serializer.add_node(i, nodes[i]);
		const { data, chunks } = data_serializer.get_data();
		if (!chunks) return json_response(data);
		return new Response(new ReadableStream({
			async start(controller) {
				controller.enqueue(text_encoder.encode(data));
				for await (const chunk of chunks) controller.enqueue(text_encoder.encode(chunk));
				controller.close();
			},
			type: "bytes"
		}), { headers: {
			"content-type": "text/sveltekit-data",
			"cache-control": "private, no-store"
		} });
	} catch (e) {
		const error = normalize_error(e);
		if (error instanceof Redirect) return redirect_json_response(error);
		else return json_response(await handle_error_and_jsonify(event, event_state, options, error), 500);
	}
}
/**
* @param {Record<string, any> | string} json
* @param {number} [status]
*/
function json_response(json, status = 200) {
	return text(typeof json === "string" ? json : JSON.stringify(json), {
		status,
		headers: {
			"content-type": "application/json",
			"cache-control": "private, no-store"
		}
	});
}
/**
* @param {Redirect} redirect
*/
function redirect_json_response(redirect) {
	return json_response({
		type: "redirect",
		location: redirect.location
	});
}
/*!
* cookie
* Copyright(c) 2012-2014 Roman Shtylman
* Copyright(c) 2015 Douglas Christopher Wilson
* MIT Licensed
*/
//#endregion
//#region ../../node_modules/.bun/@sveltejs+kit@2.69.3+ab726ce7a871e72d/node_modules/@sveltejs/kit/src/runtime/server/cookie.js
var import_cookie = (/* @__PURE__ */ __commonJSMin(((exports) => {
	/**
	* Module exports.
	* @public
	*/
	exports.parse = parse;
	exports.serialize = serialize;
	/**
	* Module variables.
	* @private
	*/
	var __toString = Object.prototype.toString;
	/**
	* RegExp to match field-content in RFC 7230 sec 3.2
	*
	* field-content = field-vchar [ 1*( SP / HTAB ) field-vchar ]
	* field-vchar   = VCHAR / obs-text
	* obs-text      = %x80-FF
	*/
	var fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
	/**
	* Parse a cookie header.
	*
	* Parse the given cookie header string into an object
	* The object has the various cookies as keys(names) => values
	*
	* @param {string} str
	* @param {object} [options]
	* @return {object}
	* @public
	*/
	function parse(str, options) {
		if (typeof str !== "string") throw new TypeError("argument str must be a string");
		var obj = {};
		var dec = (options || {}).decode || decode;
		var index = 0;
		while (index < str.length) {
			var eqIdx = str.indexOf("=", index);
			if (eqIdx === -1) break;
			var endIdx = str.indexOf(";", index);
			if (endIdx === -1) endIdx = str.length;
			else if (endIdx < eqIdx) {
				index = str.lastIndexOf(";", eqIdx - 1) + 1;
				continue;
			}
			var key = str.slice(index, eqIdx).trim();
			if (void 0 === obj[key]) {
				var val = str.slice(eqIdx + 1, endIdx).trim();
				if (val.charCodeAt(0) === 34) val = val.slice(1, -1);
				obj[key] = tryDecode(val, dec);
			}
			index = endIdx + 1;
		}
		return obj;
	}
	/**
	* Serialize data into a cookie header.
	*
	* Serialize the a name value pair into a cookie string suitable for
	* http headers. An optional options object specified cookie parameters.
	*
	* serialize('foo', 'bar', { httpOnly: true })
	*   => "foo=bar; httpOnly"
	*
	* @param {string} name
	* @param {string} val
	* @param {object} [options]
	* @return {string}
	* @public
	*/
	function serialize(name, val, options) {
		var opt = options || {};
		var enc = opt.encode || encode;
		if (typeof enc !== "function") throw new TypeError("option encode is invalid");
		if (!fieldContentRegExp.test(name)) throw new TypeError("argument name is invalid");
		var value = enc(val);
		if (value && !fieldContentRegExp.test(value)) throw new TypeError("argument val is invalid");
		var str = name + "=" + value;
		if (null != opt.maxAge) {
			var maxAge = opt.maxAge - 0;
			if (isNaN(maxAge) || !isFinite(maxAge)) throw new TypeError("option maxAge is invalid");
			str += "; Max-Age=" + Math.floor(maxAge);
		}
		if (opt.domain) {
			if (!fieldContentRegExp.test(opt.domain)) throw new TypeError("option domain is invalid");
			str += "; Domain=" + opt.domain;
		}
		if (opt.path) {
			if (!fieldContentRegExp.test(opt.path)) throw new TypeError("option path is invalid");
			str += "; Path=" + opt.path;
		}
		if (opt.expires) {
			var expires = opt.expires;
			if (!isDate(expires) || isNaN(expires.valueOf())) throw new TypeError("option expires is invalid");
			str += "; Expires=" + expires.toUTCString();
		}
		if (opt.httpOnly) str += "; HttpOnly";
		if (opt.secure) str += "; Secure";
		if (opt.partitioned) str += "; Partitioned";
		if (opt.priority) switch (typeof opt.priority === "string" ? opt.priority.toLowerCase() : opt.priority) {
			case "low":
				str += "; Priority=Low";
				break;
			case "medium":
				str += "; Priority=Medium";
				break;
			case "high":
				str += "; Priority=High";
				break;
			default: throw new TypeError("option priority is invalid");
		}
		if (opt.sameSite) switch (typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite) {
			case true:
				str += "; SameSite=Strict";
				break;
			case "lax":
				str += "; SameSite=Lax";
				break;
			case "strict":
				str += "; SameSite=Strict";
				break;
			case "none":
				str += "; SameSite=None";
				break;
			default: throw new TypeError("option sameSite is invalid");
		}
		return str;
	}
	/**
	* URL-decode string value. Optimized to skip native call when no %.
	*
	* @param {string} str
	* @returns {string}
	*/
	function decode(str) {
		return str.indexOf("%") !== -1 ? decodeURIComponent(str) : str;
	}
	/**
	* URL-encode value.
	*
	* @param {string} val
	* @returns {string}
	*/
	function encode(val) {
		return encodeURIComponent(val);
	}
	/**
	* Determine if value is a Date.
	*
	* @param {*} val
	* @private
	*/
	function isDate(val) {
		return __toString.call(val) === "[object Date]" || val instanceof Date;
	}
	/**
	* Try decoding a string using a decoding function.
	*
	* @param {string} str
	* @param {function} decode
	* @private
	*/
	function tryDecode(str, decode) {
		try {
			return decode(str);
		} catch (e) {
			return str;
		}
	}
})))();
var INVALID_COOKIE_CHARACTER_REGEX = /[\x00-\x1F\x7F()<>@,;:"/[\]?={} \t]/;
/** @param {import('./page/types.js').Cookie['options']} options */
function validate_options(options) {
	if (options?.path === void 0) throw new Error("You must specify a `path` when setting, deleting or serializing cookies");
}
/**
* Generates a unique key for a cookie based on its domain, path, and name in
* the format: `<domain>/<path>?<name>`.
* If domain is undefined, it will be omitted.
* For example: `/?name`, `example.com/foo?name`.
*
* @param {string | undefined} domain
* @param {string} path
* @param {string} name
* @returns {string}
*/
function generate_cookie_key(domain, path, name) {
	return `${domain || ""}${path}?${encodeURIComponent(name)}`;
}
/**
* @param {Request} request
* @param {URL} url
*/
function get_cookies(request, url) {
	const header = request.headers.get("cookie") ?? "";
	const initial_cookies = (0, import_cookie.parse)(header, { decode: (value) => value });
	/** @type {string | undefined} */
	let normalized_url;
	/** @type {Map<string, import('./page/types.js').Cookie>} */
	const new_cookies = /* @__PURE__ */ new Map();
	/** @type {import('cookie').CookieSerializeOptions} */
	const defaults = {
		httpOnly: true,
		sameSite: "lax",
		secure: url.hostname === "localhost" && url.protocol === "http:" ? false : true
	};
	/** @type {import('@sveltejs/kit').Cookies} */
	const cookies = {
		/**
		* @param {string} name
		* @param {import('cookie').CookieParseOptions} [opts]
		*/
		get(name, opts) {
			const best_match = Array.from(new_cookies.values()).filter((c) => {
				return c.name === name && domain_matches(url.hostname, c.options.domain) && path_matches(url.pathname, c.options.path);
			}).sort((a, b) => b.options.path.length - a.options.path.length)[0];
			if (best_match) return best_match.options.maxAge === 0 ? void 0 : best_match.value;
			return (0, import_cookie.parse)(header, { decode: opts?.decode })[name];
		},
		/**
		* @param {import('cookie').CookieParseOptions} [opts]
		*/
		getAll(opts) {
			const cookies = (0, import_cookie.parse)(header, { decode: opts?.decode });
			const lookup = /* @__PURE__ */ new Map();
			for (const c of new_cookies.values()) if (domain_matches(url.hostname, c.options.domain) && path_matches(url.pathname, c.options.path)) {
				const existing = lookup.get(c.name);
				if (!existing || c.options.path.length > existing.options.path.length) lookup.set(c.name, c);
			}
			for (const c of lookup.values()) cookies[c.name] = c.value;
			return Object.entries(cookies).map(([name, value]) => ({
				name,
				value
			}));
		},
		/**
		* @param {string} name
		* @param {string} value
		* @param {import('./page/types.js').Cookie['options']} options
		*/
		set(name, value, options) {
			const illegal_characters = name.match(INVALID_COOKIE_CHARACTER_REGEX);
			if (illegal_characters) console.warn(`The cookie name "${name}" will be invalid in SvelteKit 3.0 as it contains ${illegal_characters.join(" and ")}. See RFC 2616 for more details https://datatracker.ietf.org/doc/html/rfc2616#section-2.2`);
			validate_options(options);
			set_internal(name, value, {
				...defaults,
				...options
			});
		},
		/**
		* @param {string} name
		*  @param {import('./page/types.js').Cookie['options']} options
		*/
		delete(name, options) {
			validate_options(options);
			cookies.set(name, "", {
				...options,
				maxAge: 0
			});
		},
		/**
		* @param {string} name
		* @param {string} value
		*  @param {import('./page/types.js').Cookie['options']} options
		*/
		serialize(name, value, options) {
			validate_options(options);
			let path = options.path;
			if (!options.domain || options.domain === url.hostname) {
				if (!normalized_url) throw new Error("Cannot serialize cookies until after the route is determined");
				path = resolve(normalized_url, path);
			}
			return (0, import_cookie.serialize)(name, value, {
				...defaults,
				...options,
				path
			});
		}
	};
	/**
	* @param {URL} destination
	* @param {string | null} header
	*/
	function get_cookie_header(destination, header) {
		/** @type {Record<string, string>} */
		const combined_cookies = { ...initial_cookies };
		for (const cookie of new_cookies.values()) {
			if (!domain_matches(destination.hostname, cookie.options.domain)) continue;
			if (!path_matches(destination.pathname, cookie.options.path)) continue;
			const encoder = cookie.options.encode || encodeURIComponent;
			combined_cookies[cookie.name] = encoder(cookie.value);
		}
		if (header) {
			const parsed = (0, import_cookie.parse)(header, { decode: (value) => value });
			for (const name in parsed) combined_cookies[name] = parsed[name];
		}
		return Object.entries(combined_cookies).map(([name, value]) => `${name}=${value}`).join("; ");
	}
	/** @type {Array<() => void>} */
	const internal_queue = [];
	/**
	* @param {string} name
	* @param {string} value
	* @param {import('./page/types.js').Cookie['options']} options
	*/
	function set_internal(name, value, options) {
		if (!normalized_url) {
			internal_queue.push(() => set_internal(name, value, options));
			return;
		}
		let path = options.path;
		if (!options.domain || options.domain === url.hostname) path = resolve(normalized_url, path);
		const cookie_key = generate_cookie_key(options.domain, path, name);
		const cookie = {
			name,
			value,
			options: {
				...options,
				path
			}
		};
		new_cookies.set(cookie_key, cookie);
	}
	/**
	* @param {import('types').TrailingSlash} trailing_slash
	*/
	function set_trailing_slash(trailing_slash) {
		normalized_url = normalize_path(url.pathname, trailing_slash);
		internal_queue.forEach((fn) => fn());
	}
	return {
		cookies,
		new_cookies,
		get_cookie_header,
		set_internal,
		set_trailing_slash
	};
}
/**
* @param {string} hostname
* @param {string} [constraint]
*/
function domain_matches(hostname, constraint) {
	if (!constraint) return true;
	const normalized = constraint[0] === "." ? constraint.slice(1) : constraint;
	if (hostname === normalized) return true;
	return hostname.endsWith("." + normalized);
}
/**
* @param {string} path
* @param {string} [constraint]
*/
function path_matches(path, constraint) {
	if (!constraint) return true;
	const normalized = constraint.endsWith("/") ? constraint.slice(0, -1) : constraint;
	if (path === normalized) return true;
	return path.startsWith(normalized + "/");
}
/**
* @param {Headers} headers
* @param {MapIterator<import('./page/types.js').Cookie>} cookies
*/
function add_cookies_to_headers(headers, cookies) {
	for (const new_cookie of cookies) {
		const { name, value, options } = new_cookie;
		headers.append("set-cookie", (0, import_cookie.serialize)(name, value, options));
		if (options.path.endsWith(".html")) {
			const path = add_data_suffix(options.path);
			headers.append("set-cookie", (0, import_cookie.serialize)(name, value, {
				...options,
				path
			}));
		}
	}
}
//#endregion
//#region ../../node_modules/.bun/@sveltejs+kit@2.69.3+ab726ce7a871e72d/node_modules/@sveltejs/kit/src/runtime/server/fetch.js
/**
* @param {{
*   event: import('@sveltejs/kit').RequestEvent;
*   options: import('types').SSROptions;
*   manifest: import('@sveltejs/kit').SSRManifest;
*   state: import('types').SSRState;
*   get_cookie_header: (url: URL, header: string | null) => string;
*   set_internal: (name: string, value: string, opts: import('./page/types.js').Cookie['options']) => void;
* }} opts
* @returns {typeof fetch}
*/
function create_fetch({ event, options, manifest, state, get_cookie_header, set_internal }) {
	/**
	* @type {typeof fetch}
	*/
	const server_fetch = async (info, init) => {
		const original_request = normalize_fetch_input(info, init, event.url);
		let mode = (info instanceof Request ? info.mode : init?.mode) ?? "cors";
		let credentials = (info instanceof Request ? info.credentials : init?.credentials) ?? "same-origin";
		return options.hooks.handleFetch({
			event,
			request: original_request,
			fetch: async (info, init) => {
				const request = normalize_fetch_input(info, init, event.url);
				const url = new URL(request.url);
				if (!request.headers.has("origin")) request.headers.set("origin", event.url.origin);
				if (info !== original_request) {
					mode = (info instanceof Request ? info.mode : init?.mode) ?? "cors";
					credentials = (info instanceof Request ? info.credentials : init?.credentials) ?? "same-origin";
				}
				if ((request.method === "GET" || request.method === "HEAD") && (mode === "no-cors" && url.origin !== event.url.origin || url.origin === event.url.origin)) request.headers.delete("origin");
				const decoded = decodeURIComponent(url.pathname);
				if (url.origin !== event.url.origin || base && decoded !== base && !decoded.startsWith(`${base}/`)) {
					if (`.${url.hostname}`.endsWith(`.${event.url.hostname}`) && credentials !== "omit") {
						const cookie = get_cookie_header(url, request.headers.get("cookie"));
						if (cookie) request.headers.set("cookie", cookie);
					}
					return fetch(request);
				}
				const prefix = assets || base;
				const filename = (decoded.startsWith(prefix) ? decoded.slice(prefix.length) : decoded).slice(1);
				const filename_html = `${filename}/index.html`;
				const is_asset = manifest.assets.has(filename) || filename in manifest._.server_assets;
				const is_asset_html = manifest.assets.has(filename_html) || filename_html in manifest._.server_assets;
				if (is_asset || is_asset_html) {
					const file = is_asset ? filename : filename_html;
					if (state.read) {
						const type = is_asset ? manifest.mimeTypes[filename.slice(filename.lastIndexOf("."))] : "text/html";
						return new Response(state.read(file), { headers: type ? { "content-type": type } : {} });
					} else if (read_implementation && file in manifest._.server_assets) {
						const length = manifest._.server_assets[file];
						const type = manifest.mimeTypes[file.slice(file.lastIndexOf("."))];
						return new Response(read_implementation(file), { headers: {
							"Content-Length": "" + length,
							"Content-Type": type
						} });
					}
					return await fetch(request);
				}
				if (has_prerendered_path(manifest, base + decoded)) return await fetch(request);
				if (credentials !== "omit") {
					const cookie = get_cookie_header(url, request.headers.get("cookie"));
					if (cookie) request.headers.set("cookie", cookie);
					const authorization = event.request.headers.get("authorization");
					if (authorization && !request.headers.has("authorization")) request.headers.set("authorization", authorization);
				}
				if (!request.headers.has("accept")) request.headers.set("accept", "*/*");
				if (!request.headers.has("accept-language")) request.headers.set("accept-language", event.request.headers.get("accept-language"));
				const response = await internal_fetch(request, options, manifest, state);
				for (const str of get_set_cookies(response.headers)) {
					const { name, value, ...options } = parseString(str, { decodeValues: false });
					set_internal(name, value, {
						path: options.path ?? (url.pathname.split("/").slice(0, -1).join("/") || "/"),
						encode: (value) => value,
						...options
					});
				}
				return response;
			}
		});
	};
	return (input, init) => {
		const response = server_fetch(input, init);
		response.catch(noop);
		return response;
	};
}
/**
* @param {RequestInfo | URL} info
* @param {RequestInit | undefined} init
* @param {URL} url
*/
function normalize_fetch_input(info, init, url) {
	if (info instanceof Request) return info;
	return new Request(typeof info === "string" ? new URL(info, url) : info, init);
}
/**
* @param {Request} request
* @param {import('types').SSROptions} options
* @param {import('@sveltejs/kit').SSRManifest} manifest
* @param {import('types').SSRState} state
* @returns {Promise<Response>}
*/
async function internal_fetch(request, options, manifest, state) {
	if (request.signal) {
		if (request.signal.aborted) throw new DOMException("The operation was aborted.", "AbortError");
		let remove_abort_listener = noop;
		/** @type {Promise<never>} */
		const abort_promise = new Promise((_, reject) => {
			const on_abort = () => {
				reject(new DOMException("The operation was aborted.", "AbortError"));
			};
			request.signal.addEventListener("abort", on_abort, { once: true });
			remove_abort_listener = () => request.signal.removeEventListener("abort", on_abort);
		});
		const result = await Promise.race([respond(request, options, manifest, {
			...state,
			depth: state.depth + 1
		}), abort_promise]);
		remove_abort_listener();
		return result;
	} else return await respond(request, options, manifest, {
		...state,
		depth: state.depth + 1
	});
}
//#endregion
//#region ../../node_modules/.bun/@sveltejs+kit@2.69.3+ab726ce7a871e72d/node_modules/@sveltejs/kit/src/runtime/server/env_module.js
/** @type {string} */
var payload;
/** @type {string} */
var etag;
/** @type {Headers} */
var headers;
/**
* @param {Request} request
* @returns {Response}
*/
function get_public_env(request) {
	const script = request.url.endsWith(".script.js");
	payload ??= uneval(public_env);
	etag ??= `W/${Date.now()}`;
	headers ??= new Headers({
		"content-type": "application/javascript; charset=utf-8",
		etag
	});
	if (request.headers.get("if-none-match") === etag) return new Response(void 0, {
		status: 304,
		headers
	});
	if (script) return new Response(`globalThis.__sveltekit_sw={env:${payload}}`, { headers });
	return new Response(`export const env=${payload}`, { headers });
}
//#endregion
//#region ../../node_modules/.bun/@sveltejs+kit@2.69.3+ab726ce7a871e72d/node_modules/@sveltejs/kit/src/runtime/server/respond.js
/** @import { RequestState, SSRNode } from 'types' */
/** @type {import('types').RequiredResolveOptions['transformPageChunk']} */
var default_transform = ({ html }) => html;
/** @type {import('types').RequiredResolveOptions['filterSerializedResponseHeaders']} */
var default_filter = () => false;
/** @type {import('types').RequiredResolveOptions['preload']} */
var default_preload = ({ type }) => type === "js" || type === "css";
var page_methods = /* @__PURE__ */ new Set([
	"GET",
	"HEAD",
	"POST"
]);
var allowed_page_methods = /* @__PURE__ */ new Set([
	"GET",
	"HEAD",
	"OPTIONS"
]);
var respond = propagate_context(internal_respond);
/**
* @param {Request} request
* @param {import('types').SSROptions} options
* @param {import('@sveltejs/kit').SSRManifest} manifest
* @param {import('types').SSRState} state
* @returns {Promise<Response>}
*/
async function internal_respond(request, options, manifest, state) {
	/** URL but stripped from the potential `/__data.json` suffix and its search param  */
	const url = new URL(request.url);
	const is_route_resolution_request = has_resolution_suffix(url.pathname);
	const is_data_request = has_data_suffix(url.pathname);
	const remote_id = get_remote_id(url);
	{
		const request_origin = request.headers.get("origin");
		if (remote_id) {
			if (request.method !== "GET" && request_origin !== url.origin) return json({ message: "Cross-site remote requests are forbidden" }, { status: 403 });
		} else if (options.csrf_check_origin) {
			if (is_form_content_type(request) && (request.method === "POST" || request.method === "PUT" || request.method === "PATCH" || request.method === "DELETE") && request_origin !== url.origin && (!request_origin || !options.csrf_trusted_origins.includes(request_origin))) {
				const message = `Cross-site ${request.method} form submissions are forbidden`;
				const opts = { status: 403 };
				if (request.headers.get("accept") === "application/json") return json({ message }, opts);
				return text(message, opts);
			}
		}
	}
	if (options.hash_routing && url.pathname !== base + "/" && url.pathname !== "/[fallback]") return text("Not found", { status: 404 });
	/** @type {boolean[] | undefined} */
	let invalidated_data_nodes;
	if (is_route_resolution_request)
 /**
	* If the request is for a route resolution, first modify the URL, then continue as normal
	* for path resolution, then return the route object as a JS file.
	*/
	url.pathname = strip_resolution_suffix(url.pathname);
	else if (is_data_request) {
		url.pathname = strip_data_suffix(url.pathname) + (url.searchParams.get("x-sveltekit-trailing-slash") === "1" ? "/" : "") || "/";
		url.searchParams.delete(TRAILING_SLASH_PARAM);
		invalidated_data_nodes = url.searchParams.get(INVALIDATED_PARAM)?.split("").map((node) => node === "1");
		url.searchParams.delete(INVALIDATED_PARAM);
	} else if (remote_id) {
		url.pathname = request.headers.get("x-sveltekit-pathname") ?? base;
		url.search = request.headers.get("x-sveltekit-search") ?? "";
	}
	/** @type {Record<string, string>} */
	const headers = {};
	const { cookies, new_cookies, get_cookie_header, set_internal, set_trailing_slash } = get_cookies(request, url);
	/** @type {RequestState} */
	const event_state = {
		prerendering: state.prerendering,
		transport: options.hooks.transport,
		handleValidationError: options.hooks.handleValidationError,
		tracing: { record_span },
		remote: {
			data: null,
			explicit: null,
			implicit: null,
			forms: null,
			requested: null,
			batches: null,
			live_iterators: null
		},
		is_in_remote_function: false,
		is_in_remote_form_or_command: false,
		is_in_remote_query: false,
		is_in_render: false,
		is_in_universal_load: false
	};
	/** @type {import('@sveltejs/kit').RequestEvent} */
	const event = {
		cookies,
		fetch: null,
		getClientAddress: state.getClientAddress || (() => {
			throw new Error(`@sveltejs/adapter-node does not specify getClientAddress. Please raise an issue`);
		}),
		locals: {},
		params: {},
		platform: state.platform,
		request,
		route: { id: null },
		setHeaders: (new_headers) => {
			for (const key in new_headers) {
				const lower = key.toLowerCase();
				const value = new_headers[key];
				if (lower === "set-cookie") throw new Error("Use `event.cookies.set(name, value, options)` instead of `event.setHeaders` to set cookies");
				else if (lower in headers) if (lower === "server-timing") headers[lower] += ", " + value;
				else throw new Error(`"${key}" header is already set`);
				else {
					headers[lower] = value;
					if (state.prerendering && lower === "cache-control") state.prerendering.cache = value;
				}
			}
		},
		url,
		isDataRequest: is_data_request,
		isSubRequest: state.depth > 0,
		isRemoteRequest: !!remote_id
	};
	event.fetch = create_fetch({
		event,
		options,
		manifest,
		state,
		get_cookie_header,
		set_internal
	});
	if (state.emulator?.platform) event.platform = await state.emulator.platform({
		config: {},
		prerender: !!state.prerendering?.fallback
	});
	/** @type {string | null} */
	let resolved_path = url.pathname;
	if (!remote_id) {
		const prerendering_reroute_state = state.prerendering?.inside_reroute;
		try {
			if (state.prerendering) state.prerendering.inside_reroute = true;
			resolved_path = await options.hooks.reroute({
				url: new URL(url),
				fetch: event.fetch
			}) ?? url.pathname;
		} catch {
			return text("Internal Server Error", { status: 500 });
		} finally {
			if (state.prerendering) state.prerendering.inside_reroute = prerendering_reroute_state;
		}
	}
	/** @type {import('types').RequiredResolveOptions} */
	let resolve_opts = {
		transformPageChunk: default_transform,
		filterSerializedResponseHeaders: default_filter,
		preload: default_preload
	};
	/** @type {import('types').TrailingSlash} */
	let trailing_slash = "never";
	/** @type {PageNodes | undefined} */
	let page_nodes;
	try {
		resolved_path = decode_pathname(resolved_path);
	} catch {
		resolved_path = null;
		return await handle();
	}
	if (resolved_path !== decode_pathname(url.pathname) && !state.prerendering?.fallback && has_prerendered_path(manifest, resolved_path)) {
		const url = new URL(request.url);
		url.pathname = is_data_request ? add_data_suffix(resolved_path) : is_route_resolution_request ? add_resolution_suffix(resolved_path) : resolved_path;
		try {
			const response = await fetch(url, request);
			const headers = new Headers(response.headers);
			if (headers.has("content-encoding")) {
				headers.delete("content-encoding");
				headers.delete("content-length");
			}
			return new Response(response.body, {
				headers,
				status: response.status,
				statusText: response.statusText
			});
		} catch (error) {
			return await handle_fatal_error(event, event_state, options, error);
		}
	}
	/** @type {import('types').SSRRoute | null} */
	let route = null;
	if (base && !state.prerendering?.fallback) {
		if (!resolved_path.startsWith(base)) return text("Not found", { status: 404 });
		resolved_path = resolved_path.slice(base.length) || "/";
	}
	if (is_route_resolution_request) return resolve_route(resolved_path, new URL(request.url), manifest);
	if (resolved_path === `/_app/env.js` || resolved_path === `/_app/env.script.js`) return get_public_env(request);
	if (!remote_id && resolved_path.startsWith(`/_app`)) {
		const headers = new Headers();
		headers.set("cache-control", "public, max-age=0, must-revalidate");
		return text("Not found", {
			status: 404,
			headers
		});
	}
	if (!state.prerendering?.fallback) {
		const matchers = await manifest._.matchers();
		const result = find_route(resolved_path, manifest._.routes, matchers);
		if (result) {
			route = result.route;
			event.route = { id: route.id };
			event.params = result.params;
		}
	}
	try {
		page_nodes = route?.page ? new PageNodes(await load_page_nodes(route.page, manifest)) : void 0;
		if (route && !remote_id) {
			if (url.pathname === base || url.pathname === base + "/") trailing_slash = "always";
			else if (page_nodes) trailing_slash = page_nodes.trailing_slash();
			else if (route.endpoint) trailing_slash = (await route.endpoint()).trailingSlash ?? "never";
			if (!is_data_request) {
				const normalized = normalize_path(url.pathname, trailing_slash);
				if (normalized !== url.pathname && !state.prerendering?.fallback) return new Response(void 0, {
					status: 308,
					headers: {
						"x-sveltekit-normalize": "1",
						location: (normalized.startsWith("//") ? url.origin + normalized : normalized) + (url.search === "?" ? "" : url.search)
					}
				});
			}
			if (state.before_handle || state.emulator?.platform) {
				let config = {};
				/** @type {import('types').PrerenderOption} */
				let prerender = false;
				if (route.endpoint) {
					const node = await route.endpoint();
					config = node.config ?? config;
					prerender = node.prerender ?? prerender;
				} else if (page_nodes) {
					config = page_nodes.get_config() ?? config;
					prerender = page_nodes.prerender();
				}
				if (state.emulator?.platform) event.platform = await state.emulator.platform({
					config,
					prerender
				});
				if (state.before_handle) return await state.before_handle(event, config, prerender, handle);
			}
		}
		return await handle();
	} catch (e) {
		if (e instanceof Redirect) try {
			const response = is_data_request || remote_id ? redirect_json_response(e) : route?.page && is_action_json_request(event) ? action_json_redirect(e) : redirect_response(e.status, e.location);
			add_cookies_to_headers(response.headers, new_cookies.values());
			return response;
		} catch (err) {
			return await handle_fatal_error(event, event_state, options, err);
		}
		return await handle_fatal_error(event, event_state, options, e);
	}
	async function handle() {
		set_trailing_slash(trailing_slash);
		if (state.prerendering && !state.prerendering.fallback && !state.prerendering.inside_reroute) disable_search(url);
		const response = await record_span({
			name: "sveltekit.handle.root",
			attributes: {
				"http.route": event.route.id || "unknown",
				"http.method": event.request.method,
				"http.url": event.url.href,
				"sveltekit.is_sub_request": event.isSubRequest
			},
			fn: async (root_span) => {
				const traced_event = {
					...event,
					tracing: {
						enabled: false,
						root: root_span,
						current: root_span
					}
				};
				return await with_request_store({
					event: traced_event,
					state: event_state
				}, () => options.hooks.handle({
					event: traced_event,
					resolve: (event, opts) => {
						return record_span({
							name: "sveltekit.resolve",
							attributes: { "http.route": event.route.id || "unknown" },
							fn: (resolve_span) => {
								return with_request_store(null, () => resolve(merge_tracing(event, resolve_span), page_nodes, opts).then((response) => {
									for (const key in headers) {
										const value = headers[key];
										response.headers.set(key, value);
									}
									add_cookies_to_headers(response.headers, new_cookies.values());
									if (state.prerendering && event.route.id !== null) response.headers.set("x-sveltekit-routeid", encodeURI(event.route.id));
									resolve_span.setAttributes({
										"http.response.status_code": response.status,
										"http.response.body.size": response.headers.get("content-length") || "unknown"
									});
									return response;
								}));
							}
						});
					}
				}));
			}
		});
		if (response.status === 200 && response.headers.has("etag")) {
			let if_none_match_value = request.headers.get("if-none-match");
			if (if_none_match_value?.startsWith("W/\"")) if_none_match_value = if_none_match_value.substring(2);
			const etag = response.headers.get("etag");
			if (if_none_match_value === etag) {
				const headers = new Headers({ etag });
				for (const key of [
					"cache-control",
					"content-location",
					"date",
					"expires",
					"vary"
				]) {
					const value = response.headers.get(key);
					if (value) headers.set(key, value);
				}
				for (const cookie of get_set_cookies(response.headers)) headers.append("set-cookie", cookie);
				return new Response(void 0, {
					status: 304,
					headers
				});
			}
		}
		if (is_data_request && response.status >= 300 && response.status <= 308) {
			const location = response.headers.get("location");
			if (location) return redirect_json_response(new Redirect(response.status, location));
		}
		return response;
	}
	/**
	* @param {import('@sveltejs/kit').RequestEvent} event
	* @param {PageNodes | undefined} page_nodes
	* @param {import('@sveltejs/kit').ResolveOptions} [opts]
	*/
	async function resolve(event, page_nodes, opts) {
		try {
			if (opts) resolve_opts = {
				transformPageChunk: opts.transformPageChunk || default_transform,
				filterSerializedResponseHeaders: opts.filterSerializedResponseHeaders || default_filter,
				preload: opts.preload || default_preload
			};
			if (resolved_path === null) return await respond_with_error({
				event,
				event_state,
				options,
				manifest,
				state,
				status: 400,
				error: new SvelteKitError(400, "Malformed URI", `Failed to decode URI: ${event.url.pathname}`),
				resolve_opts
			});
			if (options.hash_routing || state.prerendering?.fallback) return await render_response({
				event,
				event_state,
				options,
				manifest,
				state,
				page_config: {
					ssr: false,
					csr: true
				},
				status: 200,
				error: null,
				branch: [{
					node: await manifest._.nodes[0](),
					data: null,
					server_data: null
				}],
				fetched: [],
				resolve_opts,
				data_serializer: server_data_serializer(event, event_state, options)
			});
			if (remote_id) return await handle_remote_call(event, event_state, options, manifest, remote_id);
			if (route) {
				const method = event.request.method;
				/** @type {Response} */
				let response;
				if (is_data_request) response = await render_data(event, event_state, route, options, manifest, state, invalidated_data_nodes, trailing_slash);
				else if (route.endpoint && (!route.page || !state.prerendering && is_endpoint_request(event))) response = await render_endpoint(event, event_state, await route.endpoint(), state);
				else if (route.page) if (!page_nodes) throw new Error("page_nodes not found. This should never happen");
				else if (page_methods.has(method)) response = await render_page(event, event_state, route.page, options, manifest, state, page_nodes, resolve_opts);
				else {
					const allowed_methods = new Set(allowed_page_methods);
					if ((await manifest._.nodes[route.page.leaf]())?.server?.actions) allowed_methods.add("POST");
					if (method === "OPTIONS") response = new Response(null, {
						status: 204,
						headers: { allow: Array.from(allowed_methods.values()).join(", ") }
					});
					else response = method_not_allowed([...allowed_methods].reduce((acc, curr) => {
						acc[curr] = true;
						return acc;
					}, {}), method);
				}
				else throw new Error("Route is neither page nor endpoint. This should never happen");
				if (request.method === "GET" && route.page && route.endpoint) {
					const vary = response.headers.get("vary")?.split(",")?.map((v) => v.trim().toLowerCase());
					if (!(vary?.includes("accept") || vary?.includes("*"))) {
						response = new Response(response.body, {
							status: response.status,
							statusText: response.statusText,
							headers: new Headers(response.headers)
						});
						response.headers.append("Vary", "Accept");
					}
				}
				return response;
			}
			if (state.error && event.isSubRequest) {
				const headers = new Headers(request.headers);
				headers.set("x-sveltekit-error", "true");
				return await fetch(request, { headers });
			}
			if (state.error) return text("Internal Server Error", { status: 500 });
			if (state.depth === 0) return await respond_with_error({
				event,
				event_state,
				options,
				manifest,
				state,
				status: 404,
				error: new SvelteKitError(404, "Not Found", `Not found: ${event.url.pathname}`),
				resolve_opts
			});
			if (state.prerendering) return text("not found", { status: 404 });
			const response = await fetch(request);
			return new Response(response.body, response);
		} catch (e) {
			return await handle_fatal_error(event, event_state, options, e);
		} finally {
			event.cookies.set = () => {
				throw new Error("Cannot use `cookies.set(...)` after the response has been generated");
			};
			event.setHeaders = () => {
				throw new Error("Cannot use `setHeaders(...)` after the response has been generated");
			};
		}
	}
}
/**
* @param {import('types').PageNodeIndexes} page
* @param {import('@sveltejs/kit').SSRManifest} manifest
*/
function load_page_nodes(page, manifest) {
	return Promise.all([...page.layouts.map((n) => n == void 0 ? n : manifest._.nodes[n]()), manifest._.nodes[page.leaf]()]);
}
/**
* It's likely that, in a distributed system, there are spans starting outside the SvelteKit server -- eg.
* started on the frontend client, or in a service that calls the SvelteKit server. There are standardized
* ways to represent this context in HTTP headers, so we can extract that context and run our tracing inside of it
* so that when our traces are exported, they are associated with the correct parent context.
* @param {typeof internal_respond} fn
* @returns {typeof internal_respond}
*/
function propagate_context(fn) {
	return async (req, ...rest) => {
		return fn(req, ...rest);
	};
}
//#endregion
//#region ../../node_modules/.bun/@sveltejs+kit@2.69.3+ab726ce7a871e72d/node_modules/@sveltejs/kit/src/utils/env.js
/**
* @param {Record<string, string>} env
* @param {string} allowed
* @param {string} disallowed
* @returns {Record<string, string>}
*/
function filter_env(env, allowed, disallowed) {
	return Object.fromEntries(Object.entries(env).filter(([k]) => k.startsWith(allowed) && (disallowed === "" || !k.startsWith(disallowed))));
}
//#endregion
//#region ../../node_modules/.bun/@sveltejs+kit@2.69.3+ab726ce7a871e72d/node_modules/@sveltejs/kit/src/runtime/server/index.js
/** @import { PromiseWithResolvers } from '../../utils/promise.js' */
/** @type {Promise<any>} */
var init_promise;
/** @type {Promise<void> | null} */
var current = null;
var Server = class {
	/** @type {import('types').SSROptions} */
	#options;
	/** @type {import('@sveltejs/kit').SSRManifest} */
	#manifest;
	/** @param {import('@sveltejs/kit').SSRManifest} manifest */
	constructor(manifest) {
		/** @type {import('types').SSROptions} */
		this.#options = options;
		this.#manifest = manifest;
		if (IN_WEBCONTAINER) {
			const respond = this.respond.bind(this);
			/** @type {typeof respond} */
			this.respond = async (...args) => {
				const { promise, resolve } = with_resolvers();
				const previous = current;
				current = promise;
				await previous;
				return respond(...args).finally(resolve);
			};
		}
	}
	/**
	* @param {import('@sveltejs/kit').ServerInitOptions} opts
	*/
	async init({ env, read }) {
		const { env_public_prefix, env_private_prefix } = this.#options;
		set_private_env(filter_env(env, env_private_prefix, env_public_prefix));
		set_public_env(filter_env(env, env_public_prefix, env_private_prefix));
		if (read) {
			/** @param {string} file */
			const wrapped_read = (file) => {
				const result = read(file);
				if (result instanceof ReadableStream) return result;
				else return new ReadableStream({ async start(controller) {
					try {
						const stream = await Promise.resolve(result);
						if (!stream) {
							controller.close();
							return;
						}
						const reader = stream.getReader();
						while (true) {
							const { done, value } = await reader.read();
							if (done) break;
							controller.enqueue(value);
						}
						controller.close();
					} catch (error) {
						controller.error(error);
					}
				} });
			};
			set_read_implementation(wrapped_read);
		}
		await (init_promise ??= (async () => {
			try {
				const module = await get_hooks();
				this.#options.hooks = {
					handle: module.handle || (({ event, resolve }) => resolve(event)),
					handleError: module.handleError || (({ status, error, event }) => {
						const error_message = format_server_error(status, error, event);
						console.error(error_message);
					}),
					handleFetch: module.handleFetch || (({ request, fetch }) => fetch(request)),
					handleValidationError: module.handleValidationError || (({ issues }) => {
						console.error("Remote function schema validation failed:", issues);
						return { message: "Bad Request" };
					}),
					reroute: module.reroute || noop,
					transport: module.transport || {}
				};
				module.transport && Object.fromEntries(Object.entries(module.transport).map(([k, v]) => [k, v.decode]));
				if (module.init) await module.init();
			} catch (e) {
				throw e;
			}
		})());
	}
	/**
	* @param {Request} request
	* @param {import('types').RequestOptions} options
	*/
	async respond(request, options) {
		return respond(request, this.#options, this.#manifest, {
			...options,
			error: false,
			depth: 0
		});
	}
};

export { Dialog as $, Tooltip_trigger as A, Tooltip_content as B, Tooltip_arrow as C, Menu as D, Menu_trigger as E, Dropdown_menu_content as F, Menu_separator as G, Menu_item as H, Menu_group as I, Menu_sub as J, Menu_sub_trigger as K, Menu_sub_content as L, MediaQuery as M, Command as N, Command_input as O, Portal as P, Command_list as Q, Command_empty as R, Separator as S, Tooltip_provider as T, Command_group as U, useId as V, Command_group_heading as W, Command_group_items as X, Command_separator as Y, Command_item as Z, __exportAll as _, attributes as a, Dialog_trigger as a0, Dialog_content as a1, Dialog_close as a2, Dialog_overlay as a3, Dialog_title as a4, Dialog_description as a5, Scroll_area as a6, Scroll_area_viewport as a7, Scroll_area_corner as a8, Scroll_area_scrollbar as a9, Select as aA, Select_trigger as aB, Select_content as aC, Select_viewport as aD, Select_scroll_up_button as aE, Select_scroll_down_button as aF, Select_group as aG, Select_item as aH, redirect as aI, hasContext as aJ, tick as aK, snapshot as aL, clsx as aM, derived$1 as aN, SvelteKitError as aO, Server as aP, Scroll_area_thumb as aa, Avatar as ab, Avatar_image as ac, Avatar_fallback as ad, attr_style as ae, onDestroy as af, SvelteSet as ag, Label as ah, Tabs as ai, Tabs_list as aj, Tabs_content as ak, Tabs_trigger as al, store_get as am, unsubscribe_stores as an, Accordion as ao, store_set as ap, Accordion_item as aq, Accordion_header as ar, Accordion_content as as, Accordion_trigger as at, Popover as au, Popover_trigger as av, Popover_content as aw, get$2 as ax, Radio_group as ay, Radio_group_item as az, ensure_array_like as b, clsx$1 as c, element as d, error as e, derived as f, getContext as g, public_env as h, attr as i, json as j, head as k, html as l, createSubscriber as m, index_server_exports as n, noop$1 as o, private_env as p, escape_html$1 as q, run$1 as r, spread_props as s, bind_props as t, setContext as u, stringify$2 as v, writable as w, attr_class as x, mergeProps as y, Tooltip as z };
//# sourceMappingURL=index.js-CxPEndTa.js.map
