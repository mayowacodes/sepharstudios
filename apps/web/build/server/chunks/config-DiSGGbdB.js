import * as nc from 'node:crypto';

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function getAugmentedNamespace(n) {
  if (Object.prototype.hasOwnProperty.call(n, '__esModule')) return n;
  var f = n.default;
	if (typeof f == "function") {
		var a = function a () {
			var isInstance = false;
      try {
        isInstance = this instanceof a;
      } catch {}
			if (isInstance) {
        return Reflect.construct(f, arguments, this.constructor);
			}
			return f.apply(this, arguments);
		};
		a.prototype = f.prototype;
  } else a = {};
  Object.defineProperty(a, '__esModule', {value: true});
	Object.keys(n).forEach(function (k) {
		var d = Object.getOwnPropertyDescriptor(n, k);
		Object.defineProperty(a, k, d.get ? d : {
			enumerable: true,
			get: function () {
				return n[k];
			}
		});
	});
	return a;
}

function isHex(value, { strict = true } = {}) {
    if (!value)
        return false;
    if (typeof value !== 'string')
        return false;
    return strict ? /^0x[0-9a-fA-F]*$/.test(value) : value.startsWith('0x');
}

/**
 * @description Retrieves the size of the value (in bytes).
 *
 * @param value The value (hex or byte array) to retrieve the size of.
 * @returns The size of the value (in bytes).
 */
function size$2(value) {
    if (isHex(value, { strict: false }))
        return Math.ceil((value.length - 2) / 2);
    return value.length;
}

const version$1 = '2.45.3';

let errorConfig = {
    getDocsUrl: ({ docsBaseUrl, docsPath = '', docsSlug, }) => docsPath
        ? `${docsBaseUrl ?? 'https://viem.sh'}${docsPath}${docsSlug ? `#${docsSlug}` : ''}`
        : undefined,
    version: `viem@${version$1}`,
};
let BaseError$1 = class BaseError extends Error {
    constructor(shortMessage, args = {}) {
        const details = (() => {
            if (args.cause instanceof BaseError)
                return args.cause.details;
            if (args.cause?.message)
                return args.cause.message;
            return args.details;
        })();
        const docsPath = (() => {
            if (args.cause instanceof BaseError)
                return args.cause.docsPath || args.docsPath;
            return args.docsPath;
        })();
        const docsUrl = errorConfig.getDocsUrl?.({ ...args, docsPath });
        const message = [
            shortMessage || 'An error occurred.',
            '',
            ...(args.metaMessages ? [...args.metaMessages, ''] : []),
            ...(docsUrl ? [`Docs: ${docsUrl}`] : []),
            ...(details ? [`Details: ${details}`] : []),
            ...(errorConfig.version ? [`Version: ${errorConfig.version}`] : []),
        ].join('\n');
        super(message, args.cause ? { cause: args.cause } : undefined);
        Object.defineProperty(this, "details", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "docsPath", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "metaMessages", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "shortMessage", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "version", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'BaseError'
        });
        this.details = details;
        this.docsPath = docsPath;
        this.metaMessages = args.metaMessages;
        this.name = args.name ?? this.name;
        this.shortMessage = shortMessage;
        this.version = version$1;
    }
    walk(fn) {
        return walk(this, fn);
    }
};
function walk(err, fn) {
    if (fn?.(err))
        return err;
    if (err &&
        typeof err === 'object' &&
        'cause' in err &&
        err.cause !== undefined)
        return walk(err.cause, fn);
    return fn ? null : err;
}

class InvalidAddressError extends BaseError$1 {
    constructor({ address }) {
        super(`Address "${address}" is invalid.`, {
            metaMessages: [
                '- Address must be a hex value of 20 bytes (40 hex characters).',
                '- Address must match its checksum counterpart.',
            ],
            name: 'InvalidAddressError',
        });
    }
}

class SliceOffsetOutOfBoundsError extends BaseError$1 {
    constructor({ offset, position, size, }) {
        super(`Slice ${position === 'start' ? 'starting' : 'ending'} at offset "${offset}" is out-of-bounds (size: ${size}).`, { name: 'SliceOffsetOutOfBoundsError' });
    }
}
class SizeExceedsPaddingSizeError extends BaseError$1 {
    constructor({ size, targetSize, type, }) {
        super(`${type.charAt(0).toUpperCase()}${type
            .slice(1)
            .toLowerCase()} size (${size}) exceeds padding size (${targetSize}).`, { name: 'SizeExceedsPaddingSizeError' });
    }
}
class InvalidBytesLengthError extends BaseError$1 {
    constructor({ size, targetSize, type, }) {
        super(`${type.charAt(0).toUpperCase()}${type
            .slice(1)
            .toLowerCase()} is expected to be ${targetSize} ${type} long, but is ${size} ${type} long.`, { name: 'InvalidBytesLengthError' });
    }
}

function pad(hexOrBytes, { dir, size = 32 } = {}) {
    if (typeof hexOrBytes === 'string')
        return padHex(hexOrBytes, { dir, size });
    return padBytes(hexOrBytes, { dir, size });
}
function padHex(hex_, { dir, size = 32 } = {}) {
    if (size === null)
        return hex_;
    const hex = hex_.replace('0x', '');
    if (hex.length > size * 2)
        throw new SizeExceedsPaddingSizeError({
            size: Math.ceil(hex.length / 2),
            targetSize: size,
            type: 'hex',
        });
    return `0x${hex[dir === 'right' ? 'padEnd' : 'padStart'](size * 2, '0')}`;
}
function padBytes(bytes, { dir, size = 32 } = {}) {
    if (size === null)
        return bytes;
    if (bytes.length > size)
        throw new SizeExceedsPaddingSizeError({
            size: bytes.length,
            targetSize: size,
            type: 'bytes',
        });
    const paddedBytes = new Uint8Array(size);
    for (let i = 0; i < size; i++) {
        const padEnd = dir === 'right';
        paddedBytes[padEnd ? i : size - i - 1] =
            bytes[padEnd ? i : bytes.length - i - 1];
    }
    return paddedBytes;
}

class IntegerOutOfRangeError extends BaseError$1 {
    constructor({ max, min, signed, size, value, }) {
        super(`Number "${value}" is not in safe ${size ? `${size * 8}-bit ${signed ? 'signed' : 'unsigned'} ` : ''}integer range ${max ? `(${min} to ${max})` : `(above ${min})`}`, { name: 'IntegerOutOfRangeError' });
    }
}
class InvalidBytesBooleanError extends BaseError$1 {
    constructor(bytes) {
        super(`Bytes value "${bytes}" is not a valid boolean. The bytes array must contain a single byte of either a 0 or 1 value.`, {
            name: 'InvalidBytesBooleanError',
        });
    }
}
class InvalidHexBooleanError extends BaseError$1 {
    constructor(hex) {
        super(`Hex value "${hex}" is not a valid boolean. The hex value must be "0x0" (false) or "0x1" (true).`, { name: 'InvalidHexBooleanError' });
    }
}
class SizeOverflowError extends BaseError$1 {
    constructor({ givenSize, maxSize }) {
        super(`Size cannot exceed ${maxSize} bytes. Given size: ${givenSize} bytes.`, { name: 'SizeOverflowError' });
    }
}

function trim(hexOrBytes, { dir = 'left' } = {}) {
    let data = typeof hexOrBytes === 'string' ? hexOrBytes.replace('0x', '') : hexOrBytes;
    let sliceLength = 0;
    for (let i = 0; i < data.length - 1; i++) {
        if (data[dir === 'left' ? i : data.length - i - 1].toString() === '0')
            sliceLength++;
        else
            break;
    }
    data =
        dir === 'left'
            ? data.slice(sliceLength)
            : data.slice(0, data.length - sliceLength);
    if (typeof hexOrBytes === 'string') {
        if (data.length === 1 && dir === 'right')
            data = `${data}0`;
        return `0x${data.length % 2 === 1 ? `0${data}` : data}`;
    }
    return data;
}

function assertSize(hexOrBytes, { size }) {
    if (size$2(hexOrBytes) > size)
        throw new SizeOverflowError({
            givenSize: size$2(hexOrBytes),
            maxSize: size,
        });
}
/**
 * Decodes a hex value into a bigint.
 *
 * - Docs: https://viem.sh/docs/utilities/fromHex#hextobigint
 *
 * @param hex Hex value to decode.
 * @param opts Options.
 * @returns BigInt value.
 *
 * @example
 * import { hexToBigInt } from 'viem'
 * const data = hexToBigInt('0x1a4', { signed: true })
 * // 420n
 *
 * @example
 * import { hexToBigInt } from 'viem'
 * const data = hexToBigInt('0x00000000000000000000000000000000000000000000000000000000000001a4', { size: 32 })
 * // 420n
 */
function hexToBigInt(hex, opts = {}) {
    const { signed } = opts;
    if (opts.size)
        assertSize(hex, { size: opts.size });
    const value = BigInt(hex);
    if (!signed)
        return value;
    const size = (hex.length - 2) / 2;
    const max = (1n << (BigInt(size) * 8n - 1n)) - 1n;
    if (value <= max)
        return value;
    return value - BigInt(`0x${'f'.padStart(size * 2, 'f')}`) - 1n;
}
/**
 * Decodes a hex value into a boolean.
 *
 * - Docs: https://viem.sh/docs/utilities/fromHex#hextobool
 *
 * @param hex Hex value to decode.
 * @param opts Options.
 * @returns Boolean value.
 *
 * @example
 * import { hexToBool } from 'viem'
 * const data = hexToBool('0x01')
 * // true
 *
 * @example
 * import { hexToBool } from 'viem'
 * const data = hexToBool('0x0000000000000000000000000000000000000000000000000000000000000001', { size: 32 })
 * // true
 */
function hexToBool(hex_, opts = {}) {
    let hex = hex_;
    if (opts.size) {
        assertSize(hex, { size: opts.size });
        hex = trim(hex);
    }
    if (trim(hex) === '0x00')
        return false;
    if (trim(hex) === '0x01')
        return true;
    throw new InvalidHexBooleanError(hex);
}
/**
 * Decodes a hex string into a number.
 *
 * - Docs: https://viem.sh/docs/utilities/fromHex#hextonumber
 *
 * @param hex Hex value to decode.
 * @param opts Options.
 * @returns Number value.
 *
 * @example
 * import { hexToNumber } from 'viem'
 * const data = hexToNumber('0x1a4')
 * // 420
 *
 * @example
 * import { hexToNumber } from 'viem'
 * const data = hexToBigInt('0x00000000000000000000000000000000000000000000000000000000000001a4', { size: 32 })
 * // 420
 */
function hexToNumber(hex, opts = {}) {
    const value = hexToBigInt(hex, opts);
    const number = Number(value);
    if (!Number.isSafeInteger(number))
        throw new IntegerOutOfRangeError({
            max: `${Number.MAX_SAFE_INTEGER}`,
            min: `${Number.MIN_SAFE_INTEGER}`,
            signed: opts.signed,
            size: opts.size,
            value: `${value}n`,
        });
    return number;
}
/**
 * Decodes a hex value into a UTF-8 string.
 *
 * - Docs: https://viem.sh/docs/utilities/fromHex#hextostring
 *
 * @param hex Hex value to decode.
 * @param opts Options.
 * @returns String value.
 *
 * @example
 * import { hexToString } from 'viem'
 * const data = hexToString('0x48656c6c6f20576f726c6421')
 * // 'Hello world!'
 *
 * @example
 * import { hexToString } from 'viem'
 * const data = hexToString('0x48656c6c6f20576f726c64210000000000000000000000000000000000000000', {
 *  size: 32,
 * })
 * // 'Hello world'
 */
function hexToString(hex, opts = {}) {
    let bytes = hexToBytes(hex);
    if (opts.size) {
        assertSize(bytes, { size: opts.size });
        bytes = trim(bytes, { dir: 'right' });
    }
    return new TextDecoder().decode(bytes);
}

const hexes = /*#__PURE__*/ Array.from({ length: 256 }, (_v, i) => i.toString(16).padStart(2, '0'));
/**
 * Encodes a string, number, bigint, or ByteArray into a hex string
 *
 * - Docs: https://viem.sh/docs/utilities/toHex
 * - Example: https://viem.sh/docs/utilities/toHex#usage
 *
 * @param value Value to encode.
 * @param opts Options.
 * @returns Hex value.
 *
 * @example
 * import { toHex } from 'viem'
 * const data = toHex('Hello world')
 * // '0x48656c6c6f20776f726c6421'
 *
 * @example
 * import { toHex } from 'viem'
 * const data = toHex(420)
 * // '0x1a4'
 *
 * @example
 * import { toHex } from 'viem'
 * const data = toHex('Hello world', { size: 32 })
 * // '0x48656c6c6f20776f726c64210000000000000000000000000000000000000000'
 */
function toHex(value, opts = {}) {
    if (typeof value === 'number' || typeof value === 'bigint')
        return numberToHex(value, opts);
    if (typeof value === 'string') {
        return stringToHex(value, opts);
    }
    if (typeof value === 'boolean')
        return boolToHex(value, opts);
    return bytesToHex(value, opts);
}
/**
 * Encodes a boolean into a hex string
 *
 * - Docs: https://viem.sh/docs/utilities/toHex#booltohex
 *
 * @param value Value to encode.
 * @param opts Options.
 * @returns Hex value.
 *
 * @example
 * import { boolToHex } from 'viem'
 * const data = boolToHex(true)
 * // '0x1'
 *
 * @example
 * import { boolToHex } from 'viem'
 * const data = boolToHex(false)
 * // '0x0'
 *
 * @example
 * import { boolToHex } from 'viem'
 * const data = boolToHex(true, { size: 32 })
 * // '0x0000000000000000000000000000000000000000000000000000000000000001'
 */
function boolToHex(value, opts = {}) {
    const hex = `0x${Number(value)}`;
    if (typeof opts.size === 'number') {
        assertSize(hex, { size: opts.size });
        return pad(hex, { size: opts.size });
    }
    return hex;
}
/**
 * Encodes a bytes array into a hex string
 *
 * - Docs: https://viem.sh/docs/utilities/toHex#bytestohex
 *
 * @param value Value to encode.
 * @param opts Options.
 * @returns Hex value.
 *
 * @example
 * import { bytesToHex } from 'viem'
 * const data = bytesToHex(Uint8Array.from([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33])
 * // '0x48656c6c6f20576f726c6421'
 *
 * @example
 * import { bytesToHex } from 'viem'
 * const data = bytesToHex(Uint8Array.from([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33]), { size: 32 })
 * // '0x48656c6c6f20576f726c64210000000000000000000000000000000000000000'
 */
function bytesToHex(value, opts = {}) {
    let string = '';
    for (let i = 0; i < value.length; i++) {
        string += hexes[value[i]];
    }
    const hex = `0x${string}`;
    if (typeof opts.size === 'number') {
        assertSize(hex, { size: opts.size });
        return pad(hex, { dir: 'right', size: opts.size });
    }
    return hex;
}
/**
 * Encodes a number or bigint into a hex string
 *
 * - Docs: https://viem.sh/docs/utilities/toHex#numbertohex
 *
 * @param value Value to encode.
 * @param opts Options.
 * @returns Hex value.
 *
 * @example
 * import { numberToHex } from 'viem'
 * const data = numberToHex(420)
 * // '0x1a4'
 *
 * @example
 * import { numberToHex } from 'viem'
 * const data = numberToHex(420, { size: 32 })
 * // '0x00000000000000000000000000000000000000000000000000000000000001a4'
 */
function numberToHex(value_, opts = {}) {
    const { signed, size } = opts;
    const value = BigInt(value_);
    let maxValue;
    if (size) {
        if (signed)
            maxValue = (1n << (BigInt(size) * 8n - 1n)) - 1n;
        else
            maxValue = 2n ** (BigInt(size) * 8n) - 1n;
    }
    else if (typeof value_ === 'number') {
        maxValue = BigInt(Number.MAX_SAFE_INTEGER);
    }
    const minValue = typeof maxValue === 'bigint' && signed ? -maxValue - 1n : 0;
    if ((maxValue && value > maxValue) || value < minValue) {
        const suffix = typeof value_ === 'bigint' ? 'n' : '';
        throw new IntegerOutOfRangeError({
            max: maxValue ? `${maxValue}${suffix}` : undefined,
            min: `${minValue}${suffix}`,
            signed,
            size,
            value: `${value_}${suffix}`,
        });
    }
    const hex = `0x${(signed && value < 0 ? (1n << BigInt(size * 8)) + BigInt(value) : value).toString(16)}`;
    if (size)
        return pad(hex, { size });
    return hex;
}
const encoder$1 = /*#__PURE__*/ new TextEncoder();
/**
 * Encodes a UTF-8 string into a hex string
 *
 * - Docs: https://viem.sh/docs/utilities/toHex#stringtohex
 *
 * @param value Value to encode.
 * @param opts Options.
 * @returns Hex value.
 *
 * @example
 * import { stringToHex } from 'viem'
 * const data = stringToHex('Hello World!')
 * // '0x48656c6c6f20576f726c6421'
 *
 * @example
 * import { stringToHex } from 'viem'
 * const data = stringToHex('Hello World!', { size: 32 })
 * // '0x48656c6c6f20576f726c64210000000000000000000000000000000000000000'
 */
function stringToHex(value_, opts = {}) {
    const value = encoder$1.encode(value_);
    return bytesToHex(value, opts);
}

const encoder = /*#__PURE__*/ new TextEncoder();
/**
 * Encodes a UTF-8 string, hex value, bigint, number or boolean to a byte array.
 *
 * - Docs: https://viem.sh/docs/utilities/toBytes
 * - Example: https://viem.sh/docs/utilities/toBytes#usage
 *
 * @param value Value to encode.
 * @param opts Options.
 * @returns Byte array value.
 *
 * @example
 * import { toBytes } from 'viem'
 * const data = toBytes('Hello world')
 * // Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33])
 *
 * @example
 * import { toBytes } from 'viem'
 * const data = toBytes(420)
 * // Uint8Array([1, 164])
 *
 * @example
 * import { toBytes } from 'viem'
 * const data = toBytes(420, { size: 4 })
 * // Uint8Array([0, 0, 1, 164])
 */
function toBytes$1(value, opts = {}) {
    if (typeof value === 'number' || typeof value === 'bigint')
        return numberToBytes(value, opts);
    if (typeof value === 'boolean')
        return boolToBytes(value, opts);
    if (isHex(value))
        return hexToBytes(value, opts);
    return stringToBytes(value, opts);
}
/**
 * Encodes a boolean into a byte array.
 *
 * - Docs: https://viem.sh/docs/utilities/toBytes#booltobytes
 *
 * @param value Boolean value to encode.
 * @param opts Options.
 * @returns Byte array value.
 *
 * @example
 * import { boolToBytes } from 'viem'
 * const data = boolToBytes(true)
 * // Uint8Array([1])
 *
 * @example
 * import { boolToBytes } from 'viem'
 * const data = boolToBytes(true, { size: 32 })
 * // Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1])
 */
function boolToBytes(value, opts = {}) {
    const bytes = new Uint8Array(1);
    bytes[0] = Number(value);
    if (typeof opts.size === 'number') {
        assertSize(bytes, { size: opts.size });
        return pad(bytes, { size: opts.size });
    }
    return bytes;
}
// We use very optimized technique to convert hex string to byte array
const charCodeMap = {
    zero: 48,
    nine: 57,
    A: 65,
    F: 70,
    a: 97,
    f: 102,
};
function charCodeToBase16(char) {
    if (char >= charCodeMap.zero && char <= charCodeMap.nine)
        return char - charCodeMap.zero;
    if (char >= charCodeMap.A && char <= charCodeMap.F)
        return char - (charCodeMap.A - 10);
    if (char >= charCodeMap.a && char <= charCodeMap.f)
        return char - (charCodeMap.a - 10);
    return undefined;
}
/**
 * Encodes a hex string into a byte array.
 *
 * - Docs: https://viem.sh/docs/utilities/toBytes#hextobytes
 *
 * @param hex Hex string to encode.
 * @param opts Options.
 * @returns Byte array value.
 *
 * @example
 * import { hexToBytes } from 'viem'
 * const data = hexToBytes('0x48656c6c6f20776f726c6421')
 * // Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33])
 *
 * @example
 * import { hexToBytes } from 'viem'
 * const data = hexToBytes('0x48656c6c6f20776f726c6421', { size: 32 })
 * // Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
 */
function hexToBytes(hex_, opts = {}) {
    let hex = hex_;
    if (opts.size) {
        assertSize(hex, { size: opts.size });
        hex = pad(hex, { dir: 'right', size: opts.size });
    }
    let hexString = hex.slice(2);
    if (hexString.length % 2)
        hexString = `0${hexString}`;
    const length = hexString.length / 2;
    const bytes = new Uint8Array(length);
    for (let index = 0, j = 0; index < length; index++) {
        const nibbleLeft = charCodeToBase16(hexString.charCodeAt(j++));
        const nibbleRight = charCodeToBase16(hexString.charCodeAt(j++));
        if (nibbleLeft === undefined || nibbleRight === undefined) {
            throw new BaseError$1(`Invalid byte sequence ("${hexString[j - 2]}${hexString[j - 1]}" in "${hexString}").`);
        }
        bytes[index] = nibbleLeft * 16 + nibbleRight;
    }
    return bytes;
}
/**
 * Encodes a number into a byte array.
 *
 * - Docs: https://viem.sh/docs/utilities/toBytes#numbertobytes
 *
 * @param value Number to encode.
 * @param opts Options.
 * @returns Byte array value.
 *
 * @example
 * import { numberToBytes } from 'viem'
 * const data = numberToBytes(420)
 * // Uint8Array([1, 164])
 *
 * @example
 * import { numberToBytes } from 'viem'
 * const data = numberToBytes(420, { size: 4 })
 * // Uint8Array([0, 0, 1, 164])
 */
function numberToBytes(value, opts) {
    const hex = numberToHex(value, opts);
    return hexToBytes(hex);
}
/**
 * Encodes a UTF-8 string into a byte array.
 *
 * - Docs: https://viem.sh/docs/utilities/toBytes#stringtobytes
 *
 * @param value String to encode.
 * @param opts Options.
 * @returns Byte array value.
 *
 * @example
 * import { stringToBytes } from 'viem'
 * const data = stringToBytes('Hello world!')
 * // Uint8Array([72, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100, 33])
 *
 * @example
 * import { stringToBytes } from 'viem'
 * const data = stringToBytes('Hello world!', { size: 32 })
 * // Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
 */
function stringToBytes(value, opts = {}) {
    const bytes = encoder.encode(value);
    if (typeof opts.size === 'number') {
        assertSize(bytes, { size: opts.size });
        return pad(bytes, { dir: 'right', size: opts.size });
    }
    return bytes;
}

/**
 * Internal helpers for u64. BigUint64Array is too slow as per 2025, so we implement it using Uint32Array.
 * @todo re-check https://issues.chromium.org/issues/42212588
 * @module
 */
const U32_MASK64 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
const _32n = /* @__PURE__ */ BigInt(32);
function fromBig(n, le = false) {
    if (le)
        return { h: Number(n & U32_MASK64), l: Number((n >> _32n) & U32_MASK64) };
    return { h: Number((n >> _32n) & U32_MASK64) | 0, l: Number(n & U32_MASK64) | 0 };
}
function split(lst, le = false) {
    const len = lst.length;
    let Ah = new Uint32Array(len);
    let Al = new Uint32Array(len);
    for (let i = 0; i < len; i++) {
        const { h, l } = fromBig(lst[i], le);
        [Ah[i], Al[i]] = [h, l];
    }
    return [Ah, Al];
}
// Left rotate for Shift in [1, 32)
const rotlSH = (h, l, s) => (h << s) | (l >>> (32 - s));
const rotlSL = (h, l, s) => (l << s) | (h >>> (32 - s));
// Left rotate for Shift in (32, 64), NOTE: 32 is special case.
const rotlBH = (h, l, s) => (l << (s - 32)) | (h >>> (64 - s));
const rotlBL = (h, l, s) => (h << (s - 32)) | (l >>> (64 - s));

/**
 * Internal webcrypto alias.
 * We prefer WebCrypto aka globalThis.crypto, which exists in node.js 16+.
 * Falls back to Node.js built-in crypto for Node.js <=v14.
 * See utils.ts for details.
 * @module
 */
// @ts-ignore
const crypto = nc && typeof nc === 'object' && 'webcrypto' in nc
    ? nc.webcrypto
    : nc && typeof nc === 'object' && 'randomBytes' in nc
        ? nc
        : undefined;

/**
 * Utilities for hex, bytes, CSPRNG.
 * @module
 */
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
// We use WebCrypto aka globalThis.crypto, which exists in browsers and node.js 16+.
// node.js versions earlier than v19 don't declare it in global scope.
// For node.js, package.json#exports field mapping rewrites import
// from `crypto` to `cryptoNode`, which imports native module.
// Makes the utils un-importable in browsers without a bundler.
// Once node.js 18 is deprecated (2025-04-30), we can just drop the import.
/** Checks if something is Uint8Array. Be careful: nodejs Buffer will return true. */
function isBytes(a) {
    return a instanceof Uint8Array || (ArrayBuffer.isView(a) && a.constructor.name === 'Uint8Array');
}
/** Asserts something is positive integer. */
function anumber(n) {
    if (!Number.isSafeInteger(n) || n < 0)
        throw new Error('positive integer expected, got ' + n);
}
/** Asserts something is Uint8Array. */
function abytes(b, ...lengths) {
    if (!isBytes(b))
        throw new Error('Uint8Array expected');
    if (lengths.length > 0 && !lengths.includes(b.length))
        throw new Error('Uint8Array expected of length ' + lengths + ', got length=' + b.length);
}
/** Asserts something is hash */
function ahash(h) {
    if (typeof h !== 'function' || typeof h.create !== 'function')
        throw new Error('Hash should be wrapped by utils.createHasher');
    anumber(h.outputLen);
    anumber(h.blockLen);
}
/** Asserts a hash instance has not been destroyed / finished */
function aexists(instance, checkFinished = true) {
    if (instance.destroyed)
        throw new Error('Hash instance has been destroyed');
    if (checkFinished && instance.finished)
        throw new Error('Hash#digest() has already been called');
}
/** Asserts output is properly-sized byte array */
function aoutput(out, instance) {
    abytes(out);
    const min = instance.outputLen;
    if (out.length < min) {
        throw new Error('digestInto() expects output buffer of length at least ' + min);
    }
}
/** Cast u8 / u16 / u32 to u32. */
function u32(arr) {
    return new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
}
/** Zeroize a byte array. Warning: JS provides no guarantees. */
function clean(...arrays) {
    for (let i = 0; i < arrays.length; i++) {
        arrays[i].fill(0);
    }
}
/** Create DataView of an array for easy byte-level manipulation. */
function createView(arr) {
    return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
}
/** The rotate right (circular right shift) operation for uint32 */
function rotr(word, shift) {
    return (word << (32 - shift)) | (word >>> shift);
}
/** Is current platform little-endian? Most are. Big-Endian platform: IBM */
const isLE = /* @__PURE__ */ (() => new Uint8Array(new Uint32Array([0x11223344]).buffer)[0] === 0x44)();
/** The byte swap operation for uint32 */
function byteSwap(word) {
    return (((word << 24) & 0xff000000) |
        ((word << 8) & 0xff0000) |
        ((word >>> 8) & 0xff00) |
        ((word >>> 24) & 0xff));
}
/** In place byte swap for Uint32Array */
function byteSwap32(arr) {
    for (let i = 0; i < arr.length; i++) {
        arr[i] = byteSwap(arr[i]);
    }
    return arr;
}
const swap32IfBE = isLE
    ? (u) => u
    : byteSwap32;
/**
 * Converts string to bytes using UTF8 encoding.
 * @example utf8ToBytes('abc') // Uint8Array.from([97, 98, 99])
 */
function utf8ToBytes(str) {
    if (typeof str !== 'string')
        throw new Error('string expected');
    return new Uint8Array(new TextEncoder().encode(str)); // https://bugzil.la/1681809
}
/**
 * Normalizes (non-hex) string or Uint8Array to Uint8Array.
 * Warning: when Uint8Array is passed, it would NOT get copied.
 * Keep in mind for future mutable operations.
 */
function toBytes(data) {
    if (typeof data === 'string')
        data = utf8ToBytes(data);
    abytes(data);
    return data;
}
/** Copies several Uint8Arrays into one. */
function concatBytes(...arrays) {
    let sum = 0;
    for (let i = 0; i < arrays.length; i++) {
        const a = arrays[i];
        abytes(a);
        sum += a.length;
    }
    const res = new Uint8Array(sum);
    for (let i = 0, pad = 0; i < arrays.length; i++) {
        const a = arrays[i];
        res.set(a, pad);
        pad += a.length;
    }
    return res;
}
/** For runtime check if class implements interface */
class Hash {
}
/** Wraps hash function, creating an interface on top of it */
function createHasher(hashCons) {
    const hashC = (msg) => hashCons().update(toBytes(msg)).digest();
    const tmp = hashCons();
    hashC.outputLen = tmp.outputLen;
    hashC.blockLen = tmp.blockLen;
    hashC.create = () => hashCons();
    return hashC;
}
/** Cryptographically secure PRNG. Uses internal OS-level `crypto.getRandomValues`. */
function randomBytes(bytesLength = 32) {
    if (crypto && typeof crypto.getRandomValues === 'function') {
        return crypto.getRandomValues(new Uint8Array(bytesLength));
    }
    // Legacy Node.js compatibility
    if (crypto && typeof crypto.randomBytes === 'function') {
        return Uint8Array.from(crypto.randomBytes(bytesLength));
    }
    throw new Error('crypto.getRandomValues must be defined');
}

/**
 * SHA3 (keccak) hash function, based on a new "Sponge function" design.
 * Different from older hashes, the internal state is bigger than output size.
 *
 * Check out [FIPS-202](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.202.pdf),
 * [Website](https://keccak.team/keccak.html),
 * [the differences between SHA-3 and Keccak](https://crypto.stackexchange.com/questions/15727/what-are-the-key-differences-between-the-draft-sha-3-standard-and-the-keccak-sub).
 *
 * Check out `sha3-addons` module for cSHAKE, k12, and others.
 * @module
 */
// No __PURE__ annotations in sha3 header:
// EVERYTHING is in fact used on every export.
// Various per round constants calculations
const _0n = BigInt(0);
const _1n = BigInt(1);
const _2n = BigInt(2);
const _7n = BigInt(7);
const _256n = BigInt(256);
const _0x71n = BigInt(0x71);
const SHA3_PI = [];
const SHA3_ROTL = [];
const _SHA3_IOTA = [];
for (let round = 0, R = _1n, x = 1, y = 0; round < 24; round++) {
    // Pi
    [x, y] = [y, (2 * x + 3 * y) % 5];
    SHA3_PI.push(2 * (5 * y + x));
    // Rotational
    SHA3_ROTL.push((((round + 1) * (round + 2)) / 2) % 64);
    // Iota
    let t = _0n;
    for (let j = 0; j < 7; j++) {
        R = ((R << _1n) ^ ((R >> _7n) * _0x71n)) % _256n;
        if (R & _2n)
            t ^= _1n << ((_1n << /* @__PURE__ */ BigInt(j)) - _1n);
    }
    _SHA3_IOTA.push(t);
}
const IOTAS = split(_SHA3_IOTA, true);
const SHA3_IOTA_H = IOTAS[0];
const SHA3_IOTA_L = IOTAS[1];
// Left rotation (without 0, 32, 64)
const rotlH = (h, l, s) => (s > 32 ? rotlBH(h, l, s) : rotlSH(h, l, s));
const rotlL = (h, l, s) => (s > 32 ? rotlBL(h, l, s) : rotlSL(h, l, s));
/** `keccakf1600` internal function, additionally allows to adjust round count. */
function keccakP(s, rounds = 24) {
    const B = new Uint32Array(5 * 2);
    // NOTE: all indices are x2 since we store state as u32 instead of u64 (bigints to slow in js)
    for (let round = 24 - rounds; round < 24; round++) {
        // Theta θ
        for (let x = 0; x < 10; x++)
            B[x] = s[x] ^ s[x + 10] ^ s[x + 20] ^ s[x + 30] ^ s[x + 40];
        for (let x = 0; x < 10; x += 2) {
            const idx1 = (x + 8) % 10;
            const idx0 = (x + 2) % 10;
            const B0 = B[idx0];
            const B1 = B[idx0 + 1];
            const Th = rotlH(B0, B1, 1) ^ B[idx1];
            const Tl = rotlL(B0, B1, 1) ^ B[idx1 + 1];
            for (let y = 0; y < 50; y += 10) {
                s[x + y] ^= Th;
                s[x + y + 1] ^= Tl;
            }
        }
        // Rho (ρ) and Pi (π)
        let curH = s[2];
        let curL = s[3];
        for (let t = 0; t < 24; t++) {
            const shift = SHA3_ROTL[t];
            const Th = rotlH(curH, curL, shift);
            const Tl = rotlL(curH, curL, shift);
            const PI = SHA3_PI[t];
            curH = s[PI];
            curL = s[PI + 1];
            s[PI] = Th;
            s[PI + 1] = Tl;
        }
        // Chi (χ)
        for (let y = 0; y < 50; y += 10) {
            for (let x = 0; x < 10; x++)
                B[x] = s[y + x];
            for (let x = 0; x < 10; x++)
                s[y + x] ^= ~B[(x + 2) % 10] & B[(x + 4) % 10];
        }
        // Iota (ι)
        s[0] ^= SHA3_IOTA_H[round];
        s[1] ^= SHA3_IOTA_L[round];
    }
    clean(B);
}
/** Keccak sponge function. */
class Keccak extends Hash {
    // NOTE: we accept arguments in bytes instead of bits here.
    constructor(blockLen, suffix, outputLen, enableXOF = false, rounds = 24) {
        super();
        this.pos = 0;
        this.posOut = 0;
        this.finished = false;
        this.destroyed = false;
        this.enableXOF = false;
        this.blockLen = blockLen;
        this.suffix = suffix;
        this.outputLen = outputLen;
        this.enableXOF = enableXOF;
        this.rounds = rounds;
        // Can be passed from user as dkLen
        anumber(outputLen);
        // 1600 = 5x5 matrix of 64bit.  1600 bits === 200 bytes
        // 0 < blockLen < 200
        if (!(0 < blockLen && blockLen < 200))
            throw new Error('only keccak-f1600 function is supported');
        this.state = new Uint8Array(200);
        this.state32 = u32(this.state);
    }
    clone() {
        return this._cloneInto();
    }
    keccak() {
        swap32IfBE(this.state32);
        keccakP(this.state32, this.rounds);
        swap32IfBE(this.state32);
        this.posOut = 0;
        this.pos = 0;
    }
    update(data) {
        aexists(this);
        data = toBytes(data);
        abytes(data);
        const { blockLen, state } = this;
        const len = data.length;
        for (let pos = 0; pos < len;) {
            const take = Math.min(blockLen - this.pos, len - pos);
            for (let i = 0; i < take; i++)
                state[this.pos++] ^= data[pos++];
            if (this.pos === blockLen)
                this.keccak();
        }
        return this;
    }
    finish() {
        if (this.finished)
            return;
        this.finished = true;
        const { state, suffix, pos, blockLen } = this;
        // Do the padding
        state[pos] ^= suffix;
        if ((suffix & 0x80) !== 0 && pos === blockLen - 1)
            this.keccak();
        state[blockLen - 1] ^= 0x80;
        this.keccak();
    }
    writeInto(out) {
        aexists(this, false);
        abytes(out);
        this.finish();
        const bufferOut = this.state;
        const { blockLen } = this;
        for (let pos = 0, len = out.length; pos < len;) {
            if (this.posOut >= blockLen)
                this.keccak();
            const take = Math.min(blockLen - this.posOut, len - pos);
            out.set(bufferOut.subarray(this.posOut, this.posOut + take), pos);
            this.posOut += take;
            pos += take;
        }
        return out;
    }
    xofInto(out) {
        // Sha3/Keccak usage with XOF is probably mistake, only SHAKE instances can do XOF
        if (!this.enableXOF)
            throw new Error('XOF is not possible for this instance');
        return this.writeInto(out);
    }
    xof(bytes) {
        anumber(bytes);
        return this.xofInto(new Uint8Array(bytes));
    }
    digestInto(out) {
        aoutput(out, this);
        if (this.finished)
            throw new Error('digest() was already called');
        this.writeInto(out);
        this.destroy();
        return out;
    }
    digest() {
        return this.digestInto(new Uint8Array(this.outputLen));
    }
    destroy() {
        this.destroyed = true;
        clean(this.state);
    }
    _cloneInto(to) {
        const { blockLen, suffix, outputLen, rounds, enableXOF } = this;
        to || (to = new Keccak(blockLen, suffix, outputLen, enableXOF, rounds));
        to.state32.set(this.state32);
        to.pos = this.pos;
        to.posOut = this.posOut;
        to.finished = this.finished;
        to.rounds = rounds;
        // Suffix can change in cSHAKE
        to.suffix = suffix;
        to.outputLen = outputLen;
        to.enableXOF = enableXOF;
        to.destroyed = this.destroyed;
        return to;
    }
}
const gen = (suffix, blockLen, outputLen) => createHasher(() => new Keccak(blockLen, suffix, outputLen));
/** keccak-256 hash function. Different from SHA3-256. */
const keccak_256 = /* @__PURE__ */ (() => gen(0x01, 136, 256 / 8))();

function keccak256(value, to_) {
    const to = to_ || 'hex';
    const bytes = keccak_256(isHex(value, { strict: false }) ? toBytes$1(value) : value);
    if (to === 'bytes')
        return bytes;
    return toHex(bytes);
}

/**
 * Map with a LRU (Least recently used) policy.
 *
 * @link https://en.wikipedia.org/wiki/Cache_replacement_policies#LRU
 */
class LruMap extends Map {
    constructor(size) {
        super();
        Object.defineProperty(this, "maxSize", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.maxSize = size;
    }
    get(key) {
        const value = super.get(key);
        if (super.has(key) && value !== undefined) {
            this.delete(key);
            super.set(key, value);
        }
        return value;
    }
    set(key, value) {
        super.set(key, value);
        if (this.maxSize && this.size > this.maxSize) {
            const firstKey = this.keys().next().value;
            if (firstKey)
                this.delete(firstKey);
        }
        return this;
    }
}

const addressRegex = /^0x[a-fA-F0-9]{40}$/;
/** @internal */
const isAddressCache = /*#__PURE__*/ new LruMap(8192);
function isAddress(address, options) {
    const { strict = true } = options ?? {};
    const cacheKey = `${address}.${strict}`;
    if (isAddressCache.has(cacheKey))
        return isAddressCache.get(cacheKey);
    const result = (() => {
        if (!addressRegex.test(address))
            return false;
        if (address.toLowerCase() === address)
            return true;
        if (strict)
            return checksumAddress(address) === address;
        return true;
    })();
    isAddressCache.set(cacheKey, result);
    return result;
}

const checksumAddressCache = /*#__PURE__*/ new LruMap(8192);
function checksumAddress(address_, 
/**
 * Warning: EIP-1191 checksum addresses are generally not backwards compatible with the
 * wider Ethereum ecosystem, meaning it will break when validated against an application/tool
 * that relies on EIP-55 checksum encoding (checksum without chainId).
 *
 * It is highly recommended to not use this feature unless you
 * know what you are doing.
 *
 * See more: https://github.com/ethereum/EIPs/issues/1121
 */
chainId) {
    if (checksumAddressCache.has(`${address_}.${chainId}`))
        return checksumAddressCache.get(`${address_}.${chainId}`);
    const hexAddress = address_.substring(2).toLowerCase();
    const hash = keccak256(stringToBytes(hexAddress), 'bytes');
    const address = (hexAddress).split('');
    for (let i = 0; i < 40; i += 2) {
        if (hash[i >> 1] >> 4 >= 8 && address[i]) {
            address[i] = address[i].toUpperCase();
        }
        if ((hash[i >> 1] & 0x0f) >= 8 && address[i + 1]) {
            address[i + 1] = address[i + 1].toUpperCase();
        }
    }
    const result = `0x${address.join('')}`;
    checksumAddressCache.set(`${address_}.${chainId}`, result);
    return result;
}
function getAddress(address, 
/**
 * Warning: EIP-1191 checksum addresses are generally not backwards compatible with the
 * wider Ethereum ecosystem, meaning it will break when validated against an application/tool
 * that relies on EIP-55 checksum encoding (checksum without chainId).
 *
 * It is highly recommended to not use this feature unless you
 * know what you are doing.
 *
 * See more: https://github.com/ethereum/EIPs/issues/1121
 */
chainId) {
    if (!isAddress(address, { strict: false }))
        throw new InvalidAddressError({ address });
    return checksumAddress(address, chainId);
}

function parseAccount(account) {
    if (typeof account === 'string')
        return { address: account, type: 'json-rpc' };
    return account;
}

const stringify = (value, replacer, space) => JSON.stringify(value, (key, value_) => {
    const value = typeof value_ === 'bigint' ? value_.toString() : value_;
    return value;
}, space);

const getContractAddress = (address) => address;
const getUrl = (url) => url;

class HttpRequestError extends BaseError$1 {
    constructor({ body, cause, details, headers, status, url, }) {
        super('HTTP request failed.', {
            cause,
            details,
            metaMessages: [
                status && `Status: ${status}`,
                `URL: ${getUrl(url)}`,
                body && `Request body: ${stringify(body)}`,
            ].filter(Boolean),
            name: 'HttpRequestError',
        });
        Object.defineProperty(this, "body", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "headers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "status", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "url", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.body = body;
        this.headers = headers;
        this.status = status;
        this.url = url;
    }
}
class RpcRequestError extends BaseError$1 {
    constructor({ body, error, url, }) {
        super('RPC Request failed.', {
            cause: error,
            details: error.message,
            metaMessages: [`URL: ${getUrl(url)}`, `Request body: ${stringify(body)}`],
            name: 'RpcRequestError',
        });
        Object.defineProperty(this, "code", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "data", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "url", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.code = error.code;
        this.data = error.data;
        this.url = url;
    }
}
class TimeoutError extends BaseError$1 {
    constructor({ body, url, }) {
        super('The request took too long to respond.', {
            details: 'The request timed out.',
            metaMessages: [`URL: ${getUrl(url)}`, `Request body: ${stringify(body)}`],
            name: 'TimeoutError',
        });
        Object.defineProperty(this, "url", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.url = url;
    }
}

const unknownErrorCode = -1;
class RpcError extends BaseError$1 {
    constructor(cause, { code, docsPath, metaMessages, name, shortMessage, }) {
        super(shortMessage, {
            cause,
            docsPath,
            metaMessages: metaMessages || cause?.metaMessages,
            name: name || 'RpcError',
        });
        Object.defineProperty(this, "code", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.name = name || cause.name;
        this.code = (cause instanceof RpcRequestError ? cause.code : (code ?? unknownErrorCode));
    }
}
class ProviderRpcError extends RpcError {
    constructor(cause, options) {
        super(cause, options);
        Object.defineProperty(this, "data", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.data = options.data;
    }
}
class ParseRpcError extends RpcError {
    constructor(cause) {
        super(cause, {
            code: ParseRpcError.code,
            name: 'ParseRpcError',
            shortMessage: 'Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text.',
        });
    }
}
Object.defineProperty(ParseRpcError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: -32700
});
class InvalidRequestRpcError extends RpcError {
    constructor(cause) {
        super(cause, {
            code: InvalidRequestRpcError.code,
            name: 'InvalidRequestRpcError',
            shortMessage: 'JSON is not a valid request object.',
        });
    }
}
Object.defineProperty(InvalidRequestRpcError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: -32600
});
class MethodNotFoundRpcError extends RpcError {
    constructor(cause, { method } = {}) {
        super(cause, {
            code: MethodNotFoundRpcError.code,
            name: 'MethodNotFoundRpcError',
            shortMessage: `The method${method ? ` "${method}"` : ''} does not exist / is not available.`,
        });
    }
}
Object.defineProperty(MethodNotFoundRpcError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: -32601
});
class InvalidParamsRpcError extends RpcError {
    constructor(cause) {
        super(cause, {
            code: InvalidParamsRpcError.code,
            name: 'InvalidParamsRpcError',
            shortMessage: [
                'Invalid parameters were provided to the RPC method.',
                'Double check you have provided the correct parameters.',
            ].join('\n'),
        });
    }
}
Object.defineProperty(InvalidParamsRpcError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: -32602
});
class InternalRpcError extends RpcError {
    constructor(cause) {
        super(cause, {
            code: InternalRpcError.code,
            name: 'InternalRpcError',
            shortMessage: 'An internal error was received.',
        });
    }
}
Object.defineProperty(InternalRpcError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: -32603
});
class InvalidInputRpcError extends RpcError {
    constructor(cause) {
        super(cause, {
            code: InvalidInputRpcError.code,
            name: 'InvalidInputRpcError',
            shortMessage: [
                'Missing or invalid parameters.',
                'Double check you have provided the correct parameters.',
            ].join('\n'),
        });
    }
}
Object.defineProperty(InvalidInputRpcError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: -32e3
});
class ResourceNotFoundRpcError extends RpcError {
    constructor(cause) {
        super(cause, {
            code: ResourceNotFoundRpcError.code,
            name: 'ResourceNotFoundRpcError',
            shortMessage: 'Requested resource not found.',
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'ResourceNotFoundRpcError'
        });
    }
}
Object.defineProperty(ResourceNotFoundRpcError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: -32001
});
class ResourceUnavailableRpcError extends RpcError {
    constructor(cause) {
        super(cause, {
            code: ResourceUnavailableRpcError.code,
            name: 'ResourceUnavailableRpcError',
            shortMessage: 'Requested resource not available.',
        });
    }
}
Object.defineProperty(ResourceUnavailableRpcError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: -32002
});
class TransactionRejectedRpcError extends RpcError {
    constructor(cause) {
        super(cause, {
            code: TransactionRejectedRpcError.code,
            name: 'TransactionRejectedRpcError',
            shortMessage: 'Transaction creation failed.',
        });
    }
}
Object.defineProperty(TransactionRejectedRpcError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: -32003
});
class MethodNotSupportedRpcError extends RpcError {
    constructor(cause, { method } = {}) {
        super(cause, {
            code: MethodNotSupportedRpcError.code,
            name: 'MethodNotSupportedRpcError',
            shortMessage: `Method${method ? ` "${method}"` : ''} is not supported.`,
        });
    }
}
Object.defineProperty(MethodNotSupportedRpcError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: -32004
});
class LimitExceededRpcError extends RpcError {
    constructor(cause) {
        super(cause, {
            code: LimitExceededRpcError.code,
            name: 'LimitExceededRpcError',
            shortMessage: 'Request exceeds defined limit.',
        });
    }
}
Object.defineProperty(LimitExceededRpcError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: -32005
});
class JsonRpcVersionUnsupportedError extends RpcError {
    constructor(cause) {
        super(cause, {
            code: JsonRpcVersionUnsupportedError.code,
            name: 'JsonRpcVersionUnsupportedError',
            shortMessage: 'Version of JSON-RPC protocol is not supported.',
        });
    }
}
Object.defineProperty(JsonRpcVersionUnsupportedError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: -32006
});
class UserRejectedRequestError extends ProviderRpcError {
    constructor(cause) {
        super(cause, {
            code: UserRejectedRequestError.code,
            name: 'UserRejectedRequestError',
            shortMessage: 'User rejected the request.',
        });
    }
}
Object.defineProperty(UserRejectedRequestError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 4001
});
class UnauthorizedProviderError extends ProviderRpcError {
    constructor(cause) {
        super(cause, {
            code: UnauthorizedProviderError.code,
            name: 'UnauthorizedProviderError',
            shortMessage: 'The requested method and/or account has not been authorized by the user.',
        });
    }
}
Object.defineProperty(UnauthorizedProviderError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 4100
});
class UnsupportedProviderMethodError extends ProviderRpcError {
    constructor(cause, { method } = {}) {
        super(cause, {
            code: UnsupportedProviderMethodError.code,
            name: 'UnsupportedProviderMethodError',
            shortMessage: `The Provider does not support the requested method${method ? ` " ${method}"` : ''}.`,
        });
    }
}
Object.defineProperty(UnsupportedProviderMethodError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 4200
});
class ProviderDisconnectedError extends ProviderRpcError {
    constructor(cause) {
        super(cause, {
            code: ProviderDisconnectedError.code,
            name: 'ProviderDisconnectedError',
            shortMessage: 'The Provider is disconnected from all chains.',
        });
    }
}
Object.defineProperty(ProviderDisconnectedError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 4900
});
class ChainDisconnectedError extends ProviderRpcError {
    constructor(cause) {
        super(cause, {
            code: ChainDisconnectedError.code,
            name: 'ChainDisconnectedError',
            shortMessage: 'The Provider is not connected to the requested chain.',
        });
    }
}
Object.defineProperty(ChainDisconnectedError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 4901
});
class SwitchChainError extends ProviderRpcError {
    constructor(cause) {
        super(cause, {
            code: SwitchChainError.code,
            name: 'SwitchChainError',
            shortMessage: 'An error occurred when attempting to switch chain.',
        });
    }
}
Object.defineProperty(SwitchChainError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 4902
});
class UnsupportedNonOptionalCapabilityError extends ProviderRpcError {
    constructor(cause) {
        super(cause, {
            code: UnsupportedNonOptionalCapabilityError.code,
            name: 'UnsupportedNonOptionalCapabilityError',
            shortMessage: 'This Wallet does not support a capability that was not marked as optional.',
        });
    }
}
Object.defineProperty(UnsupportedNonOptionalCapabilityError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 5700
});
class UnsupportedChainIdError extends ProviderRpcError {
    constructor(cause) {
        super(cause, {
            code: UnsupportedChainIdError.code,
            name: 'UnsupportedChainIdError',
            shortMessage: 'This Wallet does not support the requested chain ID.',
        });
    }
}
Object.defineProperty(UnsupportedChainIdError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 5710
});
class DuplicateIdError extends ProviderRpcError {
    constructor(cause) {
        super(cause, {
            code: DuplicateIdError.code,
            name: 'DuplicateIdError',
            shortMessage: 'There is already a bundle submitted with this ID.',
        });
    }
}
Object.defineProperty(DuplicateIdError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 5720
});
class UnknownBundleIdError extends ProviderRpcError {
    constructor(cause) {
        super(cause, {
            code: UnknownBundleIdError.code,
            name: 'UnknownBundleIdError',
            shortMessage: 'This bundle id is unknown / has not been submitted',
        });
    }
}
Object.defineProperty(UnknownBundleIdError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 5730
});
class BundleTooLargeError extends ProviderRpcError {
    constructor(cause) {
        super(cause, {
            code: BundleTooLargeError.code,
            name: 'BundleTooLargeError',
            shortMessage: 'The call bundle is too large for the Wallet to process.',
        });
    }
}
Object.defineProperty(BundleTooLargeError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 5740
});
class AtomicReadyWalletRejectedUpgradeError extends ProviderRpcError {
    constructor(cause) {
        super(cause, {
            code: AtomicReadyWalletRejectedUpgradeError.code,
            name: 'AtomicReadyWalletRejectedUpgradeError',
            shortMessage: 'The Wallet can support atomicity after an upgrade, but the user rejected the upgrade.',
        });
    }
}
Object.defineProperty(AtomicReadyWalletRejectedUpgradeError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 5750
});
class AtomicityNotSupportedError extends ProviderRpcError {
    constructor(cause) {
        super(cause, {
            code: AtomicityNotSupportedError.code,
            name: 'AtomicityNotSupportedError',
            shortMessage: 'The wallet does not support atomic execution but the request requires it.',
        });
    }
}
Object.defineProperty(AtomicityNotSupportedError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 5760
});
class WalletConnectSessionSettlementError extends ProviderRpcError {
    constructor(cause) {
        super(cause, {
            code: WalletConnectSessionSettlementError.code,
            name: 'WalletConnectSessionSettlementError',
            shortMessage: 'WalletConnect session settlement failed.',
        });
    }
}
Object.defineProperty(WalletConnectSessionSettlementError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 7000
});
class UnknownRpcError extends RpcError {
    constructor(cause) {
        super(cause, {
            name: 'UnknownRpcError',
            shortMessage: 'An unknown RPC error occurred.',
        });
    }
}

/** @internal */
function withResolvers() {
    let resolve = () => undefined;
    let reject = () => undefined;
    const promise = new Promise((resolve_, reject_) => {
        resolve = resolve_;
        reject = reject_;
    });
    return { promise, resolve, reject };
}

const schedulerCache = /*#__PURE__*/ new Map();
/** @internal */
function createBatchScheduler({ fn, id, shouldSplitBatch, wait = 0, sort, }) {
    const exec = async () => {
        const scheduler = getScheduler();
        flush();
        const args = scheduler.map(({ args }) => args);
        if (args.length === 0)
            return;
        fn(args)
            .then((data) => {
            if (sort && Array.isArray(data))
                data.sort(sort);
            for (let i = 0; i < scheduler.length; i++) {
                const { resolve } = scheduler[i];
                resolve?.([data[i], data]);
            }
        })
            .catch((err) => {
            for (let i = 0; i < scheduler.length; i++) {
                const { reject } = scheduler[i];
                reject?.(err);
            }
        });
    };
    const flush = () => schedulerCache.delete(id);
    const getBatchedArgs = () => getScheduler().map(({ args }) => args);
    const getScheduler = () => schedulerCache.get(id) || [];
    const setScheduler = (item) => schedulerCache.set(id, [...getScheduler(), item]);
    return {
        flush,
        async schedule(args) {
            const { promise, resolve, reject } = withResolvers();
            const split = shouldSplitBatch?.([...getBatchedArgs(), args]);
            if (split)
                exec();
            const hasActiveScheduler = getScheduler().length > 0;
            if (hasActiveScheduler) {
                setScheduler({ args, resolve, reject });
                return promise;
            }
            setScheduler({ args, resolve, reject });
            setTimeout(exec, wait);
            return promise;
        },
    };
}

/** @internal */
const promiseCache = /*#__PURE__*/ new LruMap(8192);
/** Deduplicates in-flight promises. */
function withDedupe(fn, { enabled = true, id }) {
    if (!enabled || !id)
        return fn();
    if (promiseCache.get(id))
        return promiseCache.get(id);
    const promise = fn().finally(() => promiseCache.delete(id));
    promiseCache.set(id, promise);
    return promise;
}

async function wait(time) {
    return new Promise((res) => setTimeout(res, time));
}

function withRetry(fn, { delay: delay_ = 100, retryCount = 2, shouldRetry = () => true, } = {}) {
    return new Promise((resolve, reject) => {
        const attemptRetry = async ({ count = 0 } = {}) => {
            const retry = async ({ error }) => {
                const delay = typeof delay_ === 'function' ? delay_({ count, error }) : delay_;
                if (delay)
                    await wait(delay);
                attemptRetry({ count: count + 1 });
            };
            try {
                const data = await fn();
                resolve(data);
            }
            catch (err) {
                if (count < retryCount &&
                    (await shouldRetry({ count, error: err })))
                    return retry({ error: err });
                reject(err);
            }
        };
        attemptRetry();
    });
}

function buildRequest(request, options = {}) {
    return async (args, overrideOptions = {}) => {
        const { dedupe = false, methods, retryDelay = 150, retryCount = 3, uid, } = {
            ...options,
            ...overrideOptions,
        };
        const { method } = args;
        if (methods?.exclude?.includes(method))
            throw new MethodNotSupportedRpcError(new Error('method not supported'), {
                method,
            });
        if (methods?.include && !methods.include.includes(method))
            throw new MethodNotSupportedRpcError(new Error('method not supported'), {
                method,
            });
        const requestId = dedupe
            ? stringToHex(`${uid}.${stringify(args)}`)
            : undefined;
        return withDedupe(() => withRetry(async () => {
            try {
                return await request(args);
            }
            catch (err_) {
                const err = err_;
                switch (err.code) {
                    // -32700
                    case ParseRpcError.code:
                        throw new ParseRpcError(err);
                    // -32600
                    case InvalidRequestRpcError.code:
                        throw new InvalidRequestRpcError(err);
                    // -32601
                    case MethodNotFoundRpcError.code:
                        throw new MethodNotFoundRpcError(err, { method: args.method });
                    // -32602
                    case InvalidParamsRpcError.code:
                        throw new InvalidParamsRpcError(err);
                    // -32603
                    case InternalRpcError.code:
                        throw new InternalRpcError(err);
                    // -32000
                    case InvalidInputRpcError.code:
                        throw new InvalidInputRpcError(err);
                    // -32001
                    case ResourceNotFoundRpcError.code:
                        throw new ResourceNotFoundRpcError(err);
                    // -32002
                    case ResourceUnavailableRpcError.code:
                        throw new ResourceUnavailableRpcError(err);
                    // -32003
                    case TransactionRejectedRpcError.code:
                        throw new TransactionRejectedRpcError(err);
                    // -32004
                    case MethodNotSupportedRpcError.code:
                        throw new MethodNotSupportedRpcError(err, {
                            method: args.method,
                        });
                    // -32005
                    case LimitExceededRpcError.code:
                        throw new LimitExceededRpcError(err);
                    // -32006
                    case JsonRpcVersionUnsupportedError.code:
                        throw new JsonRpcVersionUnsupportedError(err);
                    // 4001
                    case UserRejectedRequestError.code:
                        throw new UserRejectedRequestError(err);
                    // 4100
                    case UnauthorizedProviderError.code:
                        throw new UnauthorizedProviderError(err);
                    // 4200
                    case UnsupportedProviderMethodError.code:
                        throw new UnsupportedProviderMethodError(err);
                    // 4900
                    case ProviderDisconnectedError.code:
                        throw new ProviderDisconnectedError(err);
                    // 4901
                    case ChainDisconnectedError.code:
                        throw new ChainDisconnectedError(err);
                    // 4902
                    case SwitchChainError.code:
                        throw new SwitchChainError(err);
                    // 5700
                    case UnsupportedNonOptionalCapabilityError.code:
                        throw new UnsupportedNonOptionalCapabilityError(err);
                    // 5710
                    case UnsupportedChainIdError.code:
                        throw new UnsupportedChainIdError(err);
                    // 5720
                    case DuplicateIdError.code:
                        throw new DuplicateIdError(err);
                    // 5730
                    case UnknownBundleIdError.code:
                        throw new UnknownBundleIdError(err);
                    // 5740
                    case BundleTooLargeError.code:
                        throw new BundleTooLargeError(err);
                    // 5750
                    case AtomicReadyWalletRejectedUpgradeError.code:
                        throw new AtomicReadyWalletRejectedUpgradeError(err);
                    // 5760
                    case AtomicityNotSupportedError.code:
                        throw new AtomicityNotSupportedError(err);
                    // CAIP-25: User Rejected Error
                    // https://docs.walletconnect.com/2.0/specs/clients/sign/error-codes#rejected-caip-25
                    case 5000:
                        throw new UserRejectedRequestError(err);
                    // WalletConnect: Session Settlement Failed
                    // https://docs.walletconnect.com/2.0/specs/clients/sign/error-codes
                    case WalletConnectSessionSettlementError.code:
                        throw new WalletConnectSessionSettlementError(err);
                    default:
                        if (err_ instanceof BaseError$1)
                            throw err_;
                        throw new UnknownRpcError(err);
                }
            }
        }, {
            delay: ({ count, error }) => {
                // If we find a Retry-After header, let's retry after the given time.
                if (error && error instanceof HttpRequestError) {
                    const retryAfter = error?.headers?.get('Retry-After');
                    if (retryAfter?.match(/\d/))
                        return Number.parseInt(retryAfter, 10) * 1000;
                }
                // Otherwise, let's retry with an exponential backoff.
                return ~~(1 << count) * retryDelay;
            },
            retryCount,
            shouldRetry: ({ error }) => shouldRetry(error),
        }), { enabled: dedupe, id: requestId });
    };
}
/** @internal */
function shouldRetry(error) {
    if ('code' in error && typeof error.code === 'number') {
        if (error.code === -1)
            return true; // Unknown error
        if (error.code === LimitExceededRpcError.code)
            return true;
        if (error.code === InternalRpcError.code)
            return true;
        return false;
    }
    if (error instanceof HttpRequestError && error.status) {
        // Forbidden
        if (error.status === 403)
            return true;
        // Request Timeout
        if (error.status === 408)
            return true;
        // Request Entity Too Large
        if (error.status === 413)
            return true;
        // Too Many Requests
        if (error.status === 429)
            return true;
        // Internal Server Error
        if (error.status === 500)
            return true;
        // Bad Gateway
        if (error.status === 502)
            return true;
        // Service Unavailable
        if (error.status === 503)
            return true;
        // Gateway Timeout
        if (error.status === 504)
            return true;
        return false;
    }
    return true;
}

function defineChain(chain) {
    const chainInstance = {
        formatters: undefined,
        fees: undefined,
        serializers: undefined,
        ...chain,
    };
    function extend(base) {
        return (fnOrExtended) => {
            const properties = (typeof fnOrExtended === 'function' ? fnOrExtended(base) : fnOrExtended);
            const combined = { ...base, ...properties };
            return Object.assign(combined, { extend: extend(combined) });
        };
    }
    return Object.assign(chainInstance, {
        extend: extend(chainInstance),
    });
}

function withTimeout(fn, { errorInstance = new Error('timed out'), timeout, signal, }) {
    return new Promise((resolve, reject) => {
        (async () => {
            let timeoutId;
            try {
                const controller = new AbortController();
                if (timeout > 0) {
                    timeoutId = setTimeout(() => {
                        if (signal) {
                            controller.abort();
                        }
                        else {
                            reject(errorInstance);
                        }
                    }, timeout); // need to cast because bun globals.d.ts overrides @types/node
                }
                resolve(await fn({ signal: controller?.signal || null }));
            }
            catch (err) {
                if (err?.name === 'AbortError')
                    reject(errorInstance);
                reject(err);
            }
            finally {
                clearTimeout(timeoutId);
            }
        })();
    });
}

function createIdStore() {
    return {
        current: 0,
        take() {
            return this.current++;
        },
        reset() {
            this.current = 0;
        },
    };
}
const idCache = /*#__PURE__*/ createIdStore();

function getHttpRpcClient(url_, options = {}) {
    const { url, headers: headers_url } = parseUrl(url_);
    return {
        async request(params) {
            const { body, fetchFn = options.fetchFn ?? fetch, onRequest = options.onRequest, onResponse = options.onResponse, timeout = options.timeout ?? 10_000, } = params;
            const fetchOptions = {
                ...(options.fetchOptions ?? {}),
                ...(params.fetchOptions ?? {}),
            };
            const { headers, method, signal: signal_ } = fetchOptions;
            try {
                const response = await withTimeout(async ({ signal }) => {
                    const init = {
                        ...fetchOptions,
                        body: Array.isArray(body)
                            ? stringify(body.map((body) => ({
                                jsonrpc: '2.0',
                                id: body.id ?? idCache.take(),
                                ...body,
                            })))
                            : stringify({
                                jsonrpc: '2.0',
                                id: body.id ?? idCache.take(),
                                ...body,
                            }),
                        headers: {
                            ...headers_url,
                            'Content-Type': 'application/json',
                            ...headers,
                        },
                        method: method || 'POST',
                        signal: signal_ || (timeout > 0 ? signal : null),
                    };
                    const request = new Request(url, init);
                    const args = (await onRequest?.(request, init)) ?? { ...init, url };
                    const response = await fetchFn(args.url ?? url, args);
                    return response;
                }, {
                    errorInstance: new TimeoutError({ body, url }),
                    timeout,
                    signal: true,
                });
                if (onResponse)
                    await onResponse(response);
                let data;
                if (response.headers.get('Content-Type')?.startsWith('application/json'))
                    data = await response.json();
                else {
                    data = await response.text();
                    try {
                        data = JSON.parse(data || '{}');
                    }
                    catch (err) {
                        if (response.ok)
                            throw err;
                        data = { error: data };
                    }
                }
                if (!response.ok) {
                    throw new HttpRequestError({
                        body,
                        details: stringify(data.error) || response.statusText,
                        headers: response.headers,
                        status: response.status,
                        url,
                    });
                }
                return data;
            }
            catch (err) {
                if (err instanceof HttpRequestError)
                    throw err;
                if (err instanceof TimeoutError)
                    throw err;
                throw new HttpRequestError({
                    body,
                    cause: err,
                    url,
                });
            }
        },
    };
}
/** @internal */
function parseUrl(url_) {
    try {
        const url = new URL(url_);
        const result = (() => {
            // Handle Basic authentication credentials
            if (url.username) {
                const credentials = `${decodeURIComponent(url.username)}:${decodeURIComponent(url.password)}`;
                url.username = '';
                url.password = '';
                return {
                    url: url.toString(),
                    headers: { Authorization: `Basic ${btoa(credentials)}` },
                };
            }
            return;
        })();
        return { url: url.toString(), ...result };
    }
    catch {
        return { url: url_ };
    }
}

const version = '2.22.1';

const getVersion = () => `@wagmi/core@${version}`;

var __classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _BaseError_instances, _BaseError_walk;
class BaseError extends Error {
    get docsBaseUrl() {
        return 'https://wagmi.sh/core';
    }
    get version() {
        return getVersion();
    }
    constructor(shortMessage, options = {}) {
        super();
        _BaseError_instances.add(this);
        Object.defineProperty(this, "details", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "docsPath", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "metaMessages", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "shortMessage", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'WagmiCoreError'
        });
        const details = options.cause instanceof BaseError
            ? options.cause.details
            : options.cause?.message
                ? options.cause.message
                : options.details;
        const docsPath = options.cause instanceof BaseError
            ? options.cause.docsPath || options.docsPath
            : options.docsPath;
        this.message = [
            shortMessage || 'An error occurred.',
            '',
            ...(options.metaMessages ? [...options.metaMessages, ''] : []),
            ...(docsPath
                ? [
                    `Docs: ${this.docsBaseUrl}${docsPath}.html${options.docsSlug ? `#${options.docsSlug}` : ''}`,
                ]
                : []),
            ...(details ? [`Details: ${details}`] : []),
            `Version: ${this.version}`,
        ].join('\n');
        if (options.cause)
            this.cause = options.cause;
        this.details = details;
        this.docsPath = docsPath;
        this.metaMessages = options.metaMessages;
        this.shortMessage = shortMessage;
    }
    walk(fn) {
        return __classPrivateFieldGet(this, _BaseError_instances, "m", _BaseError_walk).call(this, this, fn);
    }
}
_BaseError_instances = new WeakSet(), _BaseError_walk = function _BaseError_walk(err, fn) {
    if (fn?.(err))
        return err;
    if (err.cause)
        return __classPrivateFieldGet(this, _BaseError_instances, "m", _BaseError_walk).call(this, err.cause, fn);
    return err;
};

class ChainNotConfiguredError extends BaseError {
    constructor() {
        super('Chain not configured.');
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'ChainNotConfiguredError'
        });
    }
}
class ConnectorAlreadyConnectedError extends BaseError {
    constructor() {
        super('Connector already connected.');
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'ConnectorAlreadyConnectedError'
        });
    }
}
class ConnectorNotConnectedError extends BaseError {
    constructor() {
        super('Connector not connected.');
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'ConnectorNotConnectedError'
        });
    }
}
class ConnectorAccountNotFoundError extends BaseError {
    constructor({ address, connector, }) {
        super(`Account "${address}" not found for connector "${connector.name}".`);
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'ConnectorAccountNotFoundError'
        });
    }
}
class ConnectorChainMismatchError extends BaseError {
    constructor({ connectionChainId, connectorChainId, }) {
        super(`The current chain of the connector (id: ${connectorChainId}) does not match the connection's chain (id: ${connectionChainId}).`, {
            metaMessages: [
                `Current Chain ID:  ${connectorChainId}`,
                `Expected Chain ID: ${connectionChainId}`,
            ],
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'ConnectorChainMismatchError'
        });
    }
}
class ConnectorUnavailableReconnectingError extends BaseError {
    constructor({ connector }) {
        super(`Connector "${connector.name}" unavailable while reconnecting.`, {
            details: [
                'During the reconnection step, the only connector methods guaranteed to be available are: `id`, `name`, `type`, `uid`.',
                'All other methods are not guaranteed to be available until reconnection completes and connectors are fully restored.',
                'This error commonly occurs for connectors that asynchronously inject after reconnection has already started.',
            ].join(' '),
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'ConnectorUnavailableReconnectingError'
        });
    }
}

const size$1 = 256;
let index$1 = size$1;
let buffer$1;
function uid$1(length = 11) {
    if (!buffer$1 || index$1 + length > size$1 * 2) {
        buffer$1 = '';
        index$1 = 0;
        for (let i = 0; i < size$1; i++) {
            buffer$1 += ((256 + Math.random() * 256) | 0).toString(16).substring(1);
        }
    }
    return buffer$1.substring(index$1, index$1++ + length);
}

function createClient(parameters) {
    const { batch, chain, ccipRead, dataSuffix, key = 'base', name = 'Base Client', type = 'base', } = parameters;
    const experimental_blockTag = parameters.experimental_blockTag ??
        (typeof chain?.experimental_preconfirmationTime === 'number'
            ? 'pending'
            : undefined);
    const blockTime = chain?.blockTime ?? 12_000;
    const defaultPollingInterval = Math.min(Math.max(Math.floor(blockTime / 2), 500), 4_000);
    const pollingInterval = parameters.pollingInterval ?? defaultPollingInterval;
    const cacheTime = parameters.cacheTime ?? pollingInterval;
    const account = parameters.account
        ? parseAccount(parameters.account)
        : undefined;
    const { config, request, value } = parameters.transport({
        account,
        chain,
        pollingInterval,
    });
    const transport = { ...config, ...value };
    const client = {
        account,
        batch,
        cacheTime,
        ccipRead,
        chain,
        dataSuffix,
        key,
        name,
        pollingInterval,
        request,
        transport,
        type,
        uid: uid$1(),
        ...(experimental_blockTag ? { experimental_blockTag } : {}),
    };
    function extend(base) {
        return (extendFn) => {
            const extended = extendFn(base);
            for (const key in client)
                delete extended[key];
            const combined = { ...base, ...extended };
            return Object.assign(combined, { extend: extend(combined) });
        };
    }
    return Object.assign(client, { extend: extend(client) });
}

/**
 * @description Creates an transport intended to be used with a client.
 */
function createTransport({ key, methods, name, request, retryCount = 3, retryDelay = 150, timeout, type, }, value) {
    const uid = uid$1();
    return {
        config: {
            key,
            methods,
            name,
            request,
            retryCount,
            retryDelay,
            timeout,
            type,
        },
        request: buildRequest(request, { methods, retryCount, retryDelay, uid }),
        value,
    };
}

class UrlRequiredError extends BaseError$1 {
    constructor() {
        super('No URL was provided to the Transport. Please provide a valid RPC URL to the Transport.', {
            docsPath: '/docs/clients/intro',
            name: 'UrlRequiredError',
        });
    }
}

/**
 * @description Creates a HTTP transport that connects to a JSON-RPC API.
 */
function http(
/** URL of the JSON-RPC API. Defaults to the chain's public RPC URL. */
url, config = {}) {
    const { batch, fetchFn, fetchOptions, key = 'http', methods, name = 'HTTP JSON-RPC', onFetchRequest, onFetchResponse, retryDelay, raw, } = config;
    return ({ chain, retryCount: retryCount_, timeout: timeout_ }) => {
        const { batchSize = 1000, wait = 0 } = typeof batch === 'object' ? batch : {};
        const retryCount = config.retryCount ?? retryCount_;
        const timeout = timeout_ ?? config.timeout ?? 10_000;
        const url_ = url || chain?.rpcUrls.default.http[0];
        if (!url_)
            throw new UrlRequiredError();
        const rpcClient = getHttpRpcClient(url_, {
            fetchFn,
            fetchOptions,
            onRequest: onFetchRequest,
            onResponse: onFetchResponse,
            timeout,
        });
        return createTransport({
            key,
            methods,
            name,
            async request({ method, params }) {
                const body = { method, params };
                const { schedule } = createBatchScheduler({
                    id: url_,
                    wait,
                    shouldSplitBatch(requests) {
                        return requests.length > batchSize;
                    },
                    fn: (body) => rpcClient.request({
                        body,
                    }),
                    sort: (a, b) => a.id - b.id,
                });
                const fn = async (body) => batch
                    ? schedule(body)
                    : [
                        await rpcClient.request({
                            body,
                        }),
                    ];
                const [{ error, result }] = await fn(body);
                if (raw)
                    return { error, result };
                if (error)
                    throw new RpcRequestError({
                        body,
                        error,
                        url: url_,
                    });
                return result;
            },
            retryCount,
            retryDelay,
            timeout,
            type: 'http',
        }, {
            fetchOptions,
            url: url_,
        });
    };
}

class ProviderNotFoundError extends BaseError {
    constructor() {
        super('Provider not found.');
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'ProviderNotFoundError'
        });
    }
}
class SwitchChainNotSupportedError extends BaseError {
    constructor({ connector }) {
        super(`"${connector.name}" does not support programmatic chain switching.`);
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'SwitchChainNotSupportedError'
        });
    }
}

function createConnector(createConnectorFn) {
    return createConnectorFn;
}

injected.type = 'injected';
function injected(parameters = {}) {
    const { shimDisconnect = true, unstable_shimAsyncInject } = parameters;
    function getTarget() {
        const target = parameters.target;
        if (typeof target === 'function') {
            const result = target();
            if (result)
                return result;
        }
        if (typeof target === 'object')
            return target;
        if (typeof target === 'string')
            return {
                ...(targetMap[target] ?? {
                    id: target,
                    name: `${target[0].toUpperCase()}${target.slice(1)}`,
                    provider: `is${target[0].toUpperCase()}${target.slice(1)}`,
                }),
            };
        return {
            id: 'injected',
            name: 'Injected',
            provider(window) {
                return window?.ethereum;
            },
        };
    }
    let accountsChanged;
    let chainChanged;
    let connect;
    let disconnect;
    return createConnector((config) => ({
        get icon() {
            return getTarget().icon;
        },
        get id() {
            return getTarget().id;
        },
        get name() {
            return getTarget().name;
        },
        /** @deprecated */
        get supportsSimulation() {
            return true;
        },
        type: injected.type,
        async setup() {
            const provider = await this.getProvider();
            // Only start listening for events if `target` is set, otherwise `injected()` will also receive events
            if (provider?.on && parameters.target) {
                if (!connect) {
                    connect = this.onConnect.bind(this);
                    provider.on('connect', connect);
                }
                // We shouldn't need to listen for `'accountsChanged'` here since the `'connect'` event should suffice (and wallet shouldn't be connected yet).
                // Some wallets, like MetaMask, do not implement the `'connect'` event and overload `'accountsChanged'` instead.
                if (!accountsChanged) {
                    accountsChanged = this.onAccountsChanged.bind(this);
                    provider.on('accountsChanged', accountsChanged);
                }
            }
        },
        async connect({ chainId, isReconnecting, withCapabilities } = {}) {
            const provider = await this.getProvider();
            if (!provider)
                throw new ProviderNotFoundError();
            let accounts = [];
            if (isReconnecting)
                accounts = await this.getAccounts().catch(() => []);
            else if (shimDisconnect) {
                // Attempt to show another prompt for selecting account if `shimDisconnect` flag is enabled
                try {
                    const permissions = await provider.request({
                        method: 'wallet_requestPermissions',
                        params: [{ eth_accounts: {} }],
                    });
                    accounts = permissions[0]?.caveats?.[0]?.value?.map((x) => getAddress(x));
                    // `'wallet_requestPermissions'` can return a different order of accounts than `'eth_accounts'`
                    // switch to `'eth_accounts'` ordering if more than one account is connected
                    // https://github.com/wevm/wagmi/issues/4140
                    if (accounts.length > 0) {
                        const sortedAccounts = await this.getAccounts();
                        accounts = sortedAccounts;
                    }
                }
                catch (err) {
                    const error = err;
                    // Not all injected providers support `wallet_requestPermissions` (e.g. MetaMask iOS).
                    // Only bubble up error if user rejects request
                    if (error.code === UserRejectedRequestError.code)
                        throw new UserRejectedRequestError(error);
                    // Or prompt is already open
                    if (error.code === ResourceUnavailableRpcError.code)
                        throw error;
                }
            }
            try {
                if (!accounts?.length && !isReconnecting) {
                    const requestedAccounts = await provider.request({
                        method: 'eth_requestAccounts',
                    });
                    accounts = requestedAccounts.map((x) => getAddress(x));
                }
                // Manage EIP-1193 event listeners
                // https://eips.ethereum.org/EIPS/eip-1193#events
                if (connect) {
                    provider.removeListener('connect', connect);
                    connect = undefined;
                }
                if (!accountsChanged) {
                    accountsChanged = this.onAccountsChanged.bind(this);
                    provider.on('accountsChanged', accountsChanged);
                }
                if (!chainChanged) {
                    chainChanged = this.onChainChanged.bind(this);
                    provider.on('chainChanged', chainChanged);
                }
                if (!disconnect) {
                    disconnect = this.onDisconnect.bind(this);
                    provider.on('disconnect', disconnect);
                }
                // Switch to chain if provided
                let currentChainId = await this.getChainId();
                if (chainId && currentChainId !== chainId) {
                    const chain = await this.switchChain({ chainId }).catch((error) => {
                        if (error.code === UserRejectedRequestError.code)
                            throw error;
                        return { id: currentChainId };
                    });
                    currentChainId = chain?.id ?? currentChainId;
                }
                // Remove disconnected shim if it exists
                if (shimDisconnect)
                    await config.storage?.removeItem(`${this.id}.disconnected`);
                // Add connected shim if no target exists
                if (!parameters.target)
                    await config.storage?.setItem('injected.connected', true);
                return {
                    accounts: (withCapabilities
                        ? accounts.map((address) => ({ address, capabilities: {} }))
                        : accounts),
                    chainId: currentChainId,
                };
            }
            catch (err) {
                const error = err;
                if (error.code === UserRejectedRequestError.code)
                    throw new UserRejectedRequestError(error);
                if (error.code === ResourceUnavailableRpcError.code)
                    throw new ResourceUnavailableRpcError(error);
                throw error;
            }
        },
        async disconnect() {
            const provider = await this.getProvider();
            if (!provider)
                throw new ProviderNotFoundError();
            // Manage EIP-1193 event listeners
            if (chainChanged) {
                provider.removeListener('chainChanged', chainChanged);
                chainChanged = undefined;
            }
            if (disconnect) {
                provider.removeListener('disconnect', disconnect);
                disconnect = undefined;
            }
            if (!connect) {
                connect = this.onConnect.bind(this);
                provider.on('connect', connect);
            }
            // Experimental support for MetaMask disconnect
            // https://github.com/MetaMask/metamask-improvement-proposals/blob/main/MIPs/mip-2.md
            try {
                // Adding timeout as not all wallets support this method and can hang
                // https://github.com/wevm/wagmi/issues/4064
                await withTimeout(() => 
                // TODO: Remove explicit type for viem@3
                provider.request({
                    // `'wallet_revokePermissions'` added in `viem@2.10.3`
                    method: 'wallet_revokePermissions',
                    params: [{ eth_accounts: {} }],
                }), { timeout: 100 });
            }
            catch { }
            // Add shim signalling connector is disconnected
            if (shimDisconnect) {
                await config.storage?.setItem(`${this.id}.disconnected`, true);
            }
            if (!parameters.target)
                await config.storage?.removeItem('injected.connected');
        },
        async getAccounts() {
            const provider = await this.getProvider();
            if (!provider)
                throw new ProviderNotFoundError();
            const accounts = await provider.request({ method: 'eth_accounts' });
            return accounts.map((x) => getAddress(x));
        },
        async getChainId() {
            const provider = await this.getProvider();
            if (!provider)
                throw new ProviderNotFoundError();
            const hexChainId = await provider.request({ method: 'eth_chainId' });
            return Number(hexChainId);
        },
        async getProvider() {
            if (typeof window === 'undefined')
                return undefined;
            let provider;
            const target = getTarget();
            if (typeof target.provider === 'function')
                provider = target.provider(window);
            else if (typeof target.provider === 'string')
                provider = findProvider(window, target.provider);
            else
                provider = target.provider;
            // Some wallets do not conform to EIP-1193 (e.g. Trust Wallet)
            // https://github.com/wevm/wagmi/issues/3526#issuecomment-1912683002
            if (provider && !provider.removeListener) {
                // Try using `off` handler if it exists, otherwise noop
                if ('off' in provider && typeof provider.off === 'function')
                    provider.removeListener =
                        provider.off;
                else
                    provider.removeListener = () => { };
            }
            return provider;
        },
        async isAuthorized() {
            try {
                const isDisconnected = shimDisconnect &&
                    // If shim exists in storage, connector is disconnected
                    (await config.storage?.getItem(`${this.id}.disconnected`));
                if (isDisconnected)
                    return false;
                // Don't allow injected connector to connect if no target is set and it hasn't already connected
                // (e.g. flag in storage is not set). This prevents a targetless injected connector from connecting
                // automatically whenever there is a targeted connector configured.
                if (!parameters.target) {
                    const connected = await config.storage?.getItem('injected.connected');
                    if (!connected)
                        return false;
                }
                const provider = await this.getProvider();
                if (!provider) {
                    if (unstable_shimAsyncInject !== undefined &&
                        unstable_shimAsyncInject !== false) {
                        // If no provider is found, check for async injection
                        // https://github.com/wevm/references/issues/167
                        // https://github.com/MetaMask/detect-provider
                        const handleEthereum = async () => {
                            if (typeof window !== 'undefined')
                                window.removeEventListener('ethereum#initialized', handleEthereum);
                            const provider = await this.getProvider();
                            return !!provider;
                        };
                        const timeout = typeof unstable_shimAsyncInject === 'number'
                            ? unstable_shimAsyncInject
                            : 1_000;
                        const res = await Promise.race([
                            ...(typeof window !== 'undefined'
                                ? [
                                    new Promise((resolve) => window.addEventListener('ethereum#initialized', () => resolve(handleEthereum()), { once: true })),
                                ]
                                : []),
                            new Promise((resolve) => setTimeout(() => resolve(handleEthereum()), timeout)),
                        ]);
                        if (res)
                            return true;
                    }
                    throw new ProviderNotFoundError();
                }
                // Use retry strategy as some injected wallets (e.g. MetaMask) fail to
                // immediately resolve JSON-RPC requests on page load.
                const accounts = await withRetry(() => this.getAccounts());
                return !!accounts.length;
            }
            catch {
                return false;
            }
        },
        async switchChain({ addEthereumChainParameter, chainId }) {
            const provider = await this.getProvider();
            if (!provider)
                throw new ProviderNotFoundError();
            const chain = config.chains.find((x) => x.id === chainId);
            if (!chain)
                throw new SwitchChainError(new ChainNotConfiguredError());
            const promise = new Promise((resolve) => {
                const listener = ((data) => {
                    if ('chainId' in data && data.chainId === chainId) {
                        config.emitter.off('change', listener);
                        resolve();
                    }
                });
                config.emitter.on('change', listener);
            });
            try {
                await Promise.all([
                    provider
                        .request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: numberToHex(chainId) }],
                    })
                        // During `'wallet_switchEthereumChain'`, MetaMask makes a `'net_version'` RPC call to the target chain.
                        // If this request fails, MetaMask does not emit the `'chainChanged'` event, but will still switch the chain.
                        // To counter this behavior, we request and emit the current chain ID to confirm the chain switch either via
                        // this callback or an externally emitted `'chainChanged'` event.
                        // https://github.com/MetaMask/metamask-extension/issues/24247
                        .then(async () => {
                        const currentChainId = await this.getChainId();
                        if (currentChainId === chainId)
                            config.emitter.emit('change', { chainId });
                    }),
                    promise,
                ]);
                return chain;
            }
            catch (err) {
                const error = err;
                // Indicates chain is not added to provider
                if (error.code === 4902 ||
                    // Unwrapping for MetaMask Mobile
                    // https://github.com/MetaMask/metamask-mobile/issues/2944#issuecomment-976988719
                    error
                        ?.data?.originalError?.code === 4902) {
                    try {
                        const { default: blockExplorer, ...blockExplorers } = chain.blockExplorers ?? {};
                        let blockExplorerUrls;
                        if (addEthereumChainParameter?.blockExplorerUrls)
                            blockExplorerUrls = addEthereumChainParameter.blockExplorerUrls;
                        else if (blockExplorer)
                            blockExplorerUrls = [
                                blockExplorer.url,
                                ...Object.values(blockExplorers).map((x) => x.url),
                            ];
                        let rpcUrls;
                        if (addEthereumChainParameter?.rpcUrls?.length)
                            rpcUrls = addEthereumChainParameter.rpcUrls;
                        else
                            rpcUrls = [chain.rpcUrls.default?.http[0] ?? ''];
                        const addEthereumChain = {
                            blockExplorerUrls,
                            chainId: numberToHex(chainId),
                            chainName: addEthereumChainParameter?.chainName ?? chain.name,
                            iconUrls: addEthereumChainParameter?.iconUrls,
                            nativeCurrency: addEthereumChainParameter?.nativeCurrency ??
                                chain.nativeCurrency,
                            rpcUrls,
                        };
                        await Promise.all([
                            provider
                                .request({
                                method: 'wallet_addEthereumChain',
                                params: [addEthereumChain],
                            })
                                .then(async () => {
                                const currentChainId = await this.getChainId();
                                if (currentChainId === chainId)
                                    config.emitter.emit('change', { chainId });
                                else
                                    throw new UserRejectedRequestError(new Error('User rejected switch after adding network.'));
                            }),
                            promise,
                        ]);
                        return chain;
                    }
                    catch (error) {
                        throw new UserRejectedRequestError(error);
                    }
                }
                if (error.code === UserRejectedRequestError.code)
                    throw new UserRejectedRequestError(error);
                throw new SwitchChainError(error);
            }
        },
        async onAccountsChanged(accounts) {
            // Disconnect if there are no accounts
            if (accounts.length === 0)
                this.onDisconnect();
            // Connect if emitter is listening for connect event (e.g. is disconnected and connects through wallet interface)
            else if (config.emitter.listenerCount('connect')) {
                const chainId = (await this.getChainId()).toString();
                this.onConnect({ chainId });
                // Remove disconnected shim if it exists
                if (shimDisconnect)
                    await config.storage?.removeItem(`${this.id}.disconnected`);
            }
            // Regular change event
            else
                config.emitter.emit('change', {
                    accounts: accounts.map((x) => getAddress(x)),
                });
        },
        onChainChanged(chain) {
            const chainId = Number(chain);
            config.emitter.emit('change', { chainId });
        },
        async onConnect(connectInfo) {
            const accounts = await this.getAccounts();
            if (accounts.length === 0)
                return;
            const chainId = Number(connectInfo.chainId);
            config.emitter.emit('connect', { accounts, chainId });
            // Manage EIP-1193 event listeners
            const provider = await this.getProvider();
            if (provider) {
                if (connect) {
                    provider.removeListener('connect', connect);
                    connect = undefined;
                }
                if (!accountsChanged) {
                    accountsChanged = this.onAccountsChanged.bind(this);
                    provider.on('accountsChanged', accountsChanged);
                }
                if (!chainChanged) {
                    chainChanged = this.onChainChanged.bind(this);
                    provider.on('chainChanged', chainChanged);
                }
                if (!disconnect) {
                    disconnect = this.onDisconnect.bind(this);
                    provider.on('disconnect', disconnect);
                }
            }
        },
        async onDisconnect(error) {
            const provider = await this.getProvider();
            // If MetaMask emits a `code: 1013` error, wait for reconnection before disconnecting
            // https://github.com/MetaMask/providers/pull/120
            if (error && error.code === 1013) {
                if (provider && !!(await this.getAccounts()).length)
                    return;
            }
            // No need to remove `${this.id}.disconnected` from storage because `onDisconnect` is typically
            // only called when the wallet is disconnected through the wallet's interface, meaning the wallet
            // actually disconnected and we don't need to simulate it.
            config.emitter.emit('disconnect');
            // Manage EIP-1193 event listeners
            if (provider) {
                if (chainChanged) {
                    provider.removeListener('chainChanged', chainChanged);
                    chainChanged = undefined;
                }
                if (disconnect) {
                    provider.removeListener('disconnect', disconnect);
                    disconnect = undefined;
                }
                if (!connect) {
                    connect = this.onConnect.bind(this);
                    provider.on('connect', connect);
                }
            }
        },
    }));
}
const targetMap = {
    coinbaseWallet: {
        id: 'coinbaseWallet',
        name: 'Coinbase Wallet',
        provider(window) {
            if (window?.coinbaseWalletExtension)
                return window.coinbaseWalletExtension;
            return findProvider(window, 'isCoinbaseWallet');
        },
    },
    metaMask: {
        id: 'metaMask',
        name: 'MetaMask',
        provider(window) {
            return findProvider(window, (provider) => {
                if (!provider.isMetaMask)
                    return false;
                // Brave tries to make itself look like MetaMask
                // Could also try RPC `web3_clientVersion` if following is unreliable
                if (provider.isBraveWallet && !provider._events && !provider._state)
                    return false;
                // Other wallets that try to look like MetaMask
                const flags = [
                    'isApexWallet',
                    'isAvalanche',
                    'isBitKeep',
                    'isBlockWallet',
                    'isKuCoinWallet',
                    'isMathWallet',
                    'isOkxWallet',
                    'isOKExWallet',
                    'isOneInchIOSWallet',
                    'isOneInchAndroidWallet',
                    'isOpera',
                    'isPhantom',
                    'isPortal',
                    'isRabby',
                    'isTokenPocket',
                    'isTokenary',
                    'isUniswapWallet',
                    'isZerion',
                ];
                for (const flag of flags)
                    if (provider[flag])
                        return false;
                return true;
            });
        },
    },
    phantom: {
        id: 'phantom',
        name: 'Phantom',
        provider(window) {
            if (window?.phantom?.ethereum)
                return window.phantom?.ethereum;
            return findProvider(window, 'isPhantom');
        },
    },
};
function findProvider(window, select) {
    function isProvider(provider) {
        if (typeof select === 'function')
            return select(provider);
        if (typeof select === 'string')
            return provider[select];
        return true;
    }
    const ethereum = window.ethereum;
    if (ethereum?.providers)
        return ethereum.providers.find((provider) => isProvider(provider));
    if (ethereum && isProvider(ethereum))
        return ethereum;
    return undefined;
}

/**
 * Announces an EIP-1193 Provider.
 */
/**
 * Watches for EIP-1193 Providers to be announced.
 */
function requestProviders(listener) {
    if (typeof window === 'undefined')
        return;
    const handler = (event) => listener(event.detail);
    window.addEventListener('eip6963:announceProvider', handler);
    window.dispatchEvent(new CustomEvent('eip6963:requestProvider'));
    return () => window.removeEventListener('eip6963:announceProvider', handler);
}

function createStore$1() {
    const listeners = new Set();
    let providerDetails = [];
    const request = () => requestProviders((providerDetail) => {
        if (providerDetails.some(({ info }) => info.uuid === providerDetail.info.uuid))
            return;
        providerDetails = [...providerDetails, providerDetail];
        listeners.forEach((listener) => listener(providerDetails, { added: [providerDetail] }));
    });
    let unwatch = request();
    return {
        _listeners() {
            return listeners;
        },
        clear() {
            listeners.forEach((listener) => listener([], { removed: [...providerDetails] }));
            providerDetails = [];
        },
        destroy() {
            this.clear();
            listeners.clear();
            unwatch?.();
        },
        findProvider({ rdns }) {
            return providerDetails.find((providerDetail) => providerDetail.info.rdns === rdns);
        },
        getProviders() {
            return providerDetails;
        },
        reset() {
            this.clear();
            unwatch?.();
            unwatch = request();
        },
        subscribe(listener, { emitImmediately } = {}) {
            listeners.add(listener);
            if (emitImmediately)
                listener(providerDetails, { added: providerDetails });
            return () => listeners.delete(listener);
        },
    };
}

const subscribeWithSelectorImpl = (fn) => (set, get, api) => {
  const origSubscribe = api.subscribe;
  api.subscribe = (selector, optListener, options) => {
    let listener = selector;
    if (optListener) {
      const equalityFn = (options == null ? void 0 : options.equalityFn) || Object.is;
      let currentSlice = selector(api.getState());
      listener = (state) => {
        const nextSlice = selector(state);
        if (!equalityFn(currentSlice, nextSlice)) {
          const previousSlice = currentSlice;
          optListener(currentSlice = nextSlice, previousSlice);
        }
      };
      if (options == null ? void 0 : options.fireImmediately) {
        optListener(currentSlice, currentSlice);
      }
    }
    return origSubscribe(listener);
  };
  const initialState = fn(set, get, api);
  return initialState;
};
const subscribeWithSelector = subscribeWithSelectorImpl;

function createJSONStorage(getStorage, options) {
  let storage;
  try {
    storage = getStorage();
  } catch (e) {
    return;
  }
  const persistStorage = {
    getItem: (name) => {
      var _a;
      const parse = (str2) => {
        if (str2 === null) {
          return null;
        }
        return JSON.parse(str2, void 0 );
      };
      const str = (_a = storage.getItem(name)) != null ? _a : null;
      if (str instanceof Promise) {
        return str.then(parse);
      }
      return parse(str);
    },
    setItem: (name, newValue) => storage.setItem(
      name,
      JSON.stringify(newValue, void 0 )
    ),
    removeItem: (name) => storage.removeItem(name)
  };
  return persistStorage;
}
const toThenable = (fn) => (input) => {
  try {
    const result = fn(input);
    if (result instanceof Promise) {
      return result;
    }
    return {
      then(onFulfilled) {
        return toThenable(onFulfilled)(result);
      },
      catch(_onRejected) {
        return this;
      }
    };
  } catch (e) {
    return {
      then(_onFulfilled) {
        return this;
      },
      catch(onRejected) {
        return toThenable(onRejected)(e);
      }
    };
  }
};
const persistImpl = (config, baseOptions) => (set, get, api) => {
  let options = {
    storage: createJSONStorage(() => localStorage),
    partialize: (state) => state,
    version: 0,
    merge: (persistedState, currentState) => ({
      ...currentState,
      ...persistedState
    }),
    ...baseOptions
  };
  let hasHydrated = false;
  const hydrationListeners = /* @__PURE__ */ new Set();
  const finishHydrationListeners = /* @__PURE__ */ new Set();
  let storage = options.storage;
  if (!storage) {
    return config(
      (...args) => {
        console.warn(
          `[zustand persist middleware] Unable to update item '${options.name}', the given storage is currently unavailable.`
        );
        set(...args);
      },
      get,
      api
    );
  }
  const setItem = () => {
    const state = options.partialize({ ...get() });
    return storage.setItem(options.name, {
      state,
      version: options.version
    });
  };
  const savedSetState = api.setState;
  api.setState = (state, replace) => {
    savedSetState(state, replace);
    void setItem();
  };
  const configResult = config(
    (...args) => {
      set(...args);
      void setItem();
    },
    get,
    api
  );
  api.getInitialState = () => configResult;
  let stateFromStorage;
  const hydrate = () => {
    var _a, _b;
    if (!storage) return;
    hasHydrated = false;
    hydrationListeners.forEach((cb) => {
      var _a2;
      return cb((_a2 = get()) != null ? _a2 : configResult);
    });
    const postRehydrationCallback = ((_b = options.onRehydrateStorage) == null ? void 0 : _b.call(options, (_a = get()) != null ? _a : configResult)) || void 0;
    return toThenable(storage.getItem.bind(storage))(options.name).then((deserializedStorageValue) => {
      if (deserializedStorageValue) {
        if (typeof deserializedStorageValue.version === "number" && deserializedStorageValue.version !== options.version) {
          if (options.migrate) {
            return [
              true,
              options.migrate(
                deserializedStorageValue.state,
                deserializedStorageValue.version
              )
            ];
          }
          console.error(
            `State loaded from storage couldn't be migrated since no migrate function was provided`
          );
        } else {
          return [false, deserializedStorageValue.state];
        }
      }
      return [false, void 0];
    }).then((migrationResult) => {
      var _a2;
      const [migrated, migratedState] = migrationResult;
      stateFromStorage = options.merge(
        migratedState,
        (_a2 = get()) != null ? _a2 : configResult
      );
      set(stateFromStorage, true);
      if (migrated) {
        return setItem();
      }
    }).then(() => {
      postRehydrationCallback == null ? void 0 : postRehydrationCallback(stateFromStorage, void 0);
      stateFromStorage = get();
      hasHydrated = true;
      finishHydrationListeners.forEach((cb) => cb(stateFromStorage));
    }).catch((e) => {
      postRehydrationCallback == null ? void 0 : postRehydrationCallback(void 0, e);
    });
  };
  api.persist = {
    setOptions: (newOptions) => {
      options = {
        ...options,
        ...newOptions
      };
      if (newOptions.storage) {
        storage = newOptions.storage;
      }
    },
    clearStorage: () => {
      storage == null ? void 0 : storage.removeItem(options.name);
    },
    getOptions: () => options,
    rehydrate: () => hydrate(),
    hasHydrated: () => hasHydrated,
    onHydrate: (cb) => {
      hydrationListeners.add(cb);
      return () => {
        hydrationListeners.delete(cb);
      };
    },
    onFinishHydration: (cb) => {
      finishHydrationListeners.add(cb);
      return () => {
        finishHydrationListeners.delete(cb);
      };
    }
  };
  if (!options.skipHydration) {
    hydrate();
  }
  return stateFromStorage || configResult;
};
const persist = persistImpl;

const createStoreImpl = (createState) => {
  let state;
  const listeners = /* @__PURE__ */ new Set();
  const setState = (partial, replace) => {
    const nextState = typeof partial === "function" ? partial(state) : partial;
    if (!Object.is(nextState, state)) {
      const previousState = state;
      state = (replace != null ? replace : typeof nextState !== "object" || nextState === null) ? nextState : Object.assign({}, state, nextState);
      listeners.forEach((listener) => listener(state, previousState));
    }
  };
  const getState = () => state;
  const getInitialState = () => initialState;
  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  const api = { setState, getState, getInitialState, subscribe };
  const initialState = state = createState(setState, getState, api);
  return api;
};
const createStore = (createState) => createState ? createStoreImpl(createState) : createStoreImpl;

var eventemitter3 = {exports: {}};

var hasRequiredEventemitter3;

function requireEventemitter3 () {
	if (hasRequiredEventemitter3) return eventemitter3.exports;
	hasRequiredEventemitter3 = 1;
	(function (module) {

		var has = Object.prototype.hasOwnProperty
		  , prefix = '~';

		/**
		 * Constructor to create a storage for our `EE` objects.
		 * An `Events` instance is a plain object whose properties are event names.
		 *
		 * @constructor
		 * @private
		 */
		function Events() {}

		//
		// We try to not inherit from `Object.prototype`. In some engines creating an
		// instance in this way is faster than calling `Object.create(null)` directly.
		// If `Object.create(null)` is not supported we prefix the event names with a
		// character to make sure that the built-in object properties are not
		// overridden or used as an attack vector.
		//
		if (Object.create) {
		  Events.prototype = Object.create(null);

		  //
		  // This hack is needed because the `__proto__` property is still inherited in
		  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
		  //
		  if (!new Events().__proto__) prefix = false;
		}

		/**
		 * Representation of a single event listener.
		 *
		 * @param {Function} fn The listener function.
		 * @param {*} context The context to invoke the listener with.
		 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
		 * @constructor
		 * @private
		 */
		function EE(fn, context, once) {
		  this.fn = fn;
		  this.context = context;
		  this.once = once || false;
		}

		/**
		 * Add a listener for a given event.
		 *
		 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
		 * @param {(String|Symbol)} event The event name.
		 * @param {Function} fn The listener function.
		 * @param {*} context The context to invoke the listener with.
		 * @param {Boolean} once Specify if the listener is a one-time listener.
		 * @returns {EventEmitter}
		 * @private
		 */
		function addListener(emitter, event, fn, context, once) {
		  if (typeof fn !== 'function') {
		    throw new TypeError('The listener must be a function');
		  }

		  var listener = new EE(fn, context || emitter, once)
		    , evt = prefix ? prefix + event : event;

		  if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
		  else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
		  else emitter._events[evt] = [emitter._events[evt], listener];

		  return emitter;
		}

		/**
		 * Clear event by name.
		 *
		 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
		 * @param {(String|Symbol)} evt The Event name.
		 * @private
		 */
		function clearEvent(emitter, evt) {
		  if (--emitter._eventsCount === 0) emitter._events = new Events();
		  else delete emitter._events[evt];
		}

		/**
		 * Minimal `EventEmitter` interface that is molded against the Node.js
		 * `EventEmitter` interface.
		 *
		 * @constructor
		 * @public
		 */
		function EventEmitter() {
		  this._events = new Events();
		  this._eventsCount = 0;
		}

		/**
		 * Return an array listing the events for which the emitter has registered
		 * listeners.
		 *
		 * @returns {Array}
		 * @public
		 */
		EventEmitter.prototype.eventNames = function eventNames() {
		  var names = []
		    , events
		    , name;

		  if (this._eventsCount === 0) return names;

		  for (name in (events = this._events)) {
		    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
		  }

		  if (Object.getOwnPropertySymbols) {
		    return names.concat(Object.getOwnPropertySymbols(events));
		  }

		  return names;
		};

		/**
		 * Return the listeners registered for a given event.
		 *
		 * @param {(String|Symbol)} event The event name.
		 * @returns {Array} The registered listeners.
		 * @public
		 */
		EventEmitter.prototype.listeners = function listeners(event) {
		  var evt = prefix ? prefix + event : event
		    , handlers = this._events[evt];

		  if (!handlers) return [];
		  if (handlers.fn) return [handlers.fn];

		  for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
		    ee[i] = handlers[i].fn;
		  }

		  return ee;
		};

		/**
		 * Return the number of listeners listening to a given event.
		 *
		 * @param {(String|Symbol)} event The event name.
		 * @returns {Number} The number of listeners.
		 * @public
		 */
		EventEmitter.prototype.listenerCount = function listenerCount(event) {
		  var evt = prefix ? prefix + event : event
		    , listeners = this._events[evt];

		  if (!listeners) return 0;
		  if (listeners.fn) return 1;
		  return listeners.length;
		};

		/**
		 * Calls each of the listeners registered for a given event.
		 *
		 * @param {(String|Symbol)} event The event name.
		 * @returns {Boolean} `true` if the event had listeners, else `false`.
		 * @public
		 */
		EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
		  var evt = prefix ? prefix + event : event;

		  if (!this._events[evt]) return false;

		  var listeners = this._events[evt]
		    , len = arguments.length
		    , args
		    , i;

		  if (listeners.fn) {
		    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

		    switch (len) {
		      case 1: return listeners.fn.call(listeners.context), true;
		      case 2: return listeners.fn.call(listeners.context, a1), true;
		      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
		      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
		      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
		      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
		    }

		    for (i = 1, args = new Array(len -1); i < len; i++) {
		      args[i - 1] = arguments[i];
		    }

		    listeners.fn.apply(listeners.context, args);
		  } else {
		    var length = listeners.length
		      , j;

		    for (i = 0; i < length; i++) {
		      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

		      switch (len) {
		        case 1: listeners[i].fn.call(listeners[i].context); break;
		        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
		        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
		        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
		        default:
		          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
		            args[j - 1] = arguments[j];
		          }

		          listeners[i].fn.apply(listeners[i].context, args);
		      }
		    }
		  }

		  return true;
		};

		/**
		 * Add a listener for a given event.
		 *
		 * @param {(String|Symbol)} event The event name.
		 * @param {Function} fn The listener function.
		 * @param {*} [context=this] The context to invoke the listener with.
		 * @returns {EventEmitter} `this`.
		 * @public
		 */
		EventEmitter.prototype.on = function on(event, fn, context) {
		  return addListener(this, event, fn, context, false);
		};

		/**
		 * Add a one-time listener for a given event.
		 *
		 * @param {(String|Symbol)} event The event name.
		 * @param {Function} fn The listener function.
		 * @param {*} [context=this] The context to invoke the listener with.
		 * @returns {EventEmitter} `this`.
		 * @public
		 */
		EventEmitter.prototype.once = function once(event, fn, context) {
		  return addListener(this, event, fn, context, true);
		};

		/**
		 * Remove the listeners of a given event.
		 *
		 * @param {(String|Symbol)} event The event name.
		 * @param {Function} fn Only remove the listeners that match this function.
		 * @param {*} context Only remove the listeners that have this context.
		 * @param {Boolean} once Only remove one-time listeners.
		 * @returns {EventEmitter} `this`.
		 * @public
		 */
		EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
		  var evt = prefix ? prefix + event : event;

		  if (!this._events[evt]) return this;
		  if (!fn) {
		    clearEvent(this, evt);
		    return this;
		  }

		  var listeners = this._events[evt];

		  if (listeners.fn) {
		    if (
		      listeners.fn === fn &&
		      (!once || listeners.once) &&
		      (!context || listeners.context === context)
		    ) {
		      clearEvent(this, evt);
		    }
		  } else {
		    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
		      if (
		        listeners[i].fn !== fn ||
		        (once && !listeners[i].once) ||
		        (context && listeners[i].context !== context)
		      ) {
		        events.push(listeners[i]);
		      }
		    }

		    //
		    // Reset the array, or remove it completely if we have no more listeners.
		    //
		    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
		    else clearEvent(this, evt);
		  }

		  return this;
		};

		/**
		 * Remove all listeners, or those of the specified event.
		 *
		 * @param {(String|Symbol)} [event] The event name.
		 * @returns {EventEmitter} `this`.
		 * @public
		 */
		EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
		  var evt;

		  if (event) {
		    evt = prefix ? prefix + event : event;
		    if (this._events[evt]) clearEvent(this, evt);
		  } else {
		    this._events = new Events();
		    this._eventsCount = 0;
		  }

		  return this;
		};

		//
		// Alias methods names because people roll like that.
		//
		EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
		EventEmitter.prototype.addListener = EventEmitter.prototype.on;

		//
		// Expose the prefix.
		//
		EventEmitter.prefixed = prefix;

		//
		// Allow `EventEmitter` to be imported as module namespace.
		//
		EventEmitter.EventEmitter = EventEmitter;

		//
		// Expose the module.
		//
		{
		  module.exports = EventEmitter;
		} 
	} (eventemitter3));
	return eventemitter3.exports;
}

var eventemitter3Exports = requireEventemitter3();
var EventEmitter = /*@__PURE__*/getDefaultExportFromCjs(eventemitter3Exports);

class Emitter {
    constructor(uid) {
        Object.defineProperty(this, "uid", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: uid
        });
        Object.defineProperty(this, "_emitter", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new EventEmitter()
        });
    }
    on(eventName, fn) {
        this._emitter.on(eventName, fn);
    }
    once(eventName, fn) {
        this._emitter.once(eventName, fn);
    }
    off(eventName, fn) {
        this._emitter.off(eventName, fn);
    }
    emit(eventName, ...params) {
        const data = params[0];
        this._emitter.emit(eventName, { uid: this.uid, ...data });
    }
    listenerCount(eventName) {
        return this._emitter.listenerCount(eventName);
    }
}
function createEmitter(uid) {
    return new Emitter(uid);
}

function deserialize(value, reviver) {
    return JSON.parse(value, (key, value_) => {
        let value = value_;
        if (value?.__type === 'bigint')
            value = BigInt(value.value);
        if (value?.__type === 'Map')
            value = new Map(value.value);
        return reviver?.(key, value) ?? value;
    });
}

/**
 * Get the reference key for the circular value
 *
 * @param keys the keys to build the reference key from
 * @param cutoff the maximum number of keys to include
 * @returns the reference key
 */
function getReferenceKey(keys, cutoff) {
    return keys.slice(0, cutoff).join('.') || '.';
}
/**
 * Faster `Array.prototype.indexOf` implementation build for slicing / splicing
 *
 * @param array the array to match the value in
 * @param value the value to match
 * @returns the matching index, or -1
 */
function getCutoff(array, value) {
    const { length } = array;
    for (let index = 0; index < length; ++index) {
        if (array[index] === value) {
            return index + 1;
        }
    }
    return 0;
}
/**
 * Create a replacer method that handles circular values
 *
 * @param [replacer] a custom replacer to use for non-circular values
 * @param [circularReplacer] a custom replacer to use for circular methods
 * @returns the value to stringify
 */
function createReplacer(replacer, circularReplacer) {
    const hasReplacer = typeof replacer === 'function';
    const hasCircularReplacer = typeof circularReplacer === 'function';
    const cache = [];
    const keys = [];
    return function replace(key, value) {
        if (typeof value === 'object') {
            if (cache.length) {
                const thisCutoff = getCutoff(cache, this);
                if (thisCutoff === 0) {
                    cache[cache.length] = this;
                }
                else {
                    cache.splice(thisCutoff);
                    keys.splice(thisCutoff);
                }
                keys[keys.length] = key;
                const valueCutoff = getCutoff(cache, value);
                if (valueCutoff !== 0) {
                    return hasCircularReplacer
                        ? circularReplacer.call(this, key, value, getReferenceKey(keys, valueCutoff))
                        : `[ref=${getReferenceKey(keys, valueCutoff)}]`;
                }
            }
            else {
                cache[0] = value;
                keys[0] = key;
            }
        }
        return hasReplacer ? replacer.call(this, key, value) : value;
    };
}
/**
 * Stringifier that handles circular values
 *
 * Forked from https://github.com/planttheidea/fast-stringify
 *
 * @param value to stringify
 * @param [replacer] a custom replacer function for handling standard values
 * @param [indent] the number of spaces to indent the output by
 * @param [circularReplacer] a custom replacer function for handling circular values
 * @returns the stringified output
 */
function serialize(value, replacer, indent, circularReplacer) {
    return JSON.stringify(value, createReplacer((key, value_) => {
        let value = value_;
        if (typeof value === 'bigint')
            value = { __type: 'bigint', value: value_.toString() };
        if (value instanceof Map)
            value = { __type: 'Map', value: Array.from(value_.entries()) };
        return replacer?.(key, value) ?? value;
    }, circularReplacer), indent ?? undefined);
}

function createStorage(parameters) {
    const { deserialize: deserialize$1 = deserialize, key: prefix = 'wagmi', serialize: serialize$1 = serialize, storage = noopStorage, } = parameters;
    function unwrap(value) {
        if (value instanceof Promise)
            return value.then((x) => x).catch(() => null);
        return value;
    }
    return {
        ...storage,
        key: prefix,
        async getItem(key, defaultValue) {
            const value = storage.getItem(`${prefix}.${key}`);
            const unwrapped = await unwrap(value);
            if (unwrapped)
                return deserialize$1(unwrapped) ?? null;
            return (defaultValue ?? null);
        },
        async setItem(key, value) {
            const storageKey = `${prefix}.${key}`;
            if (value === null)
                await unwrap(storage.removeItem(storageKey));
            else
                await unwrap(storage.setItem(storageKey, serialize$1(value)));
        },
        async removeItem(key) {
            await unwrap(storage.removeItem(`${prefix}.${key}`));
        },
    };
}
const noopStorage = {
    getItem: () => null,
    setItem: () => { },
    removeItem: () => { },
};
function getDefaultStorage() {
    const storage = (() => {
        // biome-ignore lint/complexity/useOptionalChain: _
        if (typeof window !== 'undefined' && window.localStorage)
            return window.localStorage;
        return noopStorage;
    })();
    return {
        getItem(key) {
            return storage.getItem(key);
        },
        removeItem(key) {
            storage.removeItem(key);
        },
        setItem(key, value) {
            try {
                storage.setItem(key, value);
                // silence errors by default (QuotaExceededError, SecurityError, etc.)
            }
            catch { }
        },
    };
}

const size = 256;
let index = size;
let buffer;
function uid(length = 11) {
    if (!buffer || index + length > size * 2) {
        buffer = '';
        index = 0;
        for (let i = 0; i < size; i++) {
            buffer += ((256 + Math.random() * 256) | 0).toString(16).substring(1);
        }
    }
    return buffer.substring(index, index++ + length);
}

function createConfig(parameters) {
    const { multiInjectedProviderDiscovery = true, storage = createStorage({
        storage: getDefaultStorage(),
    }), syncConnectedChain = true, ssr = false, ...rest } = parameters;
    /////////////////////////////////////////////////////////////////////////////////////////////////
    // Set up connectors, clients, etc.
    /////////////////////////////////////////////////////////////////////////////////////////////////
    const mipd = typeof window !== 'undefined' && multiInjectedProviderDiscovery
        ? createStore$1()
        : undefined;
    const chains = createStore(() => rest.chains);
    const connectors = createStore(() => {
        const collection = [];
        const rdnsSet = new Set();
        for (const connectorFns of rest.connectors ?? []) {
            const connector = setup(connectorFns);
            collection.push(connector);
            if (!ssr && connector.rdns) {
                const rdnsValues = typeof connector.rdns === 'string' ? [connector.rdns] : connector.rdns;
                for (const rdns of rdnsValues) {
                    rdnsSet.add(rdns);
                }
            }
        }
        if (!ssr && mipd) {
            const providers = mipd.getProviders();
            for (const provider of providers) {
                if (rdnsSet.has(provider.info.rdns))
                    continue;
                collection.push(setup(providerDetailToConnector(provider)));
            }
        }
        return collection;
    });
    function setup(connectorFn) {
        // Set up emitter with uid and add to connector so they are "linked" together.
        const emitter = createEmitter(uid());
        const connector = {
            ...connectorFn({
                emitter,
                chains: chains.getState(),
                storage,
                transports: rest.transports,
            }),
            emitter,
            uid: emitter.uid,
        };
        // Start listening for `connect` events on connector setup
        // This allows connectors to "connect" themselves without user interaction (e.g. MetaMask's "Manually connect to current site")
        emitter.on('connect', connect);
        connector.setup?.();
        return connector;
    }
    function providerDetailToConnector(providerDetail) {
        const { info } = providerDetail;
        const provider = providerDetail.provider;
        return injected({ target: { ...info, id: info.rdns, provider } });
    }
    const clients = new Map();
    function getClient(config = {}) {
        const chainId = config.chainId ?? store.getState().chainId;
        const chain = chains.getState().find((x) => x.id === chainId);
        // chainId specified and not configured
        if (config.chainId && !chain)
            throw new ChainNotConfiguredError();
        {
            const client = clients.get(store.getState().chainId);
            if (client && !chain)
                return client;
            if (!chain)
                throw new ChainNotConfiguredError();
        }
        // If a memoized client exists for a chain id, use that.
        {
            const client = clients.get(chainId);
            if (client)
                return client;
        }
        let client;
        if (rest.client)
            client = rest.client({ chain });
        else {
            const chainId = chain.id;
            const chainIds = chains.getState().map((x) => x.id);
            // Grab all properties off `rest` and resolve for use in `createClient`
            const properties = {};
            const entries = Object.entries(rest);
            for (const [key, value] of entries) {
                if (key === 'chains' ||
                    key === 'client' ||
                    key === 'connectors' ||
                    key === 'transports')
                    continue;
                if (typeof value === 'object') {
                    // check if value is chainId-specific since some values can be objects
                    // e.g. { batch: { multicall: { batchSize: 1024 } } }
                    if (chainId in value)
                        properties[key] = value[chainId];
                    else {
                        // check if value is chainId-specific, but does not have value for current chainId
                        const hasChainSpecificValue = chainIds.some((x) => x in value);
                        if (hasChainSpecificValue)
                            continue;
                        properties[key] = value;
                    }
                }
                else
                    properties[key] = value;
            }
            client = createClient({
                ...properties,
                chain,
                batch: properties.batch ?? { multicall: true },
                transport: (parameters) => rest.transports[chainId]({ ...parameters, connectors }),
            });
        }
        clients.set(chainId, client);
        return client;
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////
    // Create store
    /////////////////////////////////////////////////////////////////////////////////////////////////
    function getInitialState() {
        return {
            chainId: chains.getState()[0].id,
            connections: new Map(),
            current: null,
            status: 'disconnected',
        };
    }
    let currentVersion;
    const prefix = '0.0.0-canary-';
    if (version.startsWith(prefix))
        currentVersion = Number.parseInt(version.replace(prefix, ''), 10);
    // use package major version to version store
    else
        currentVersion = Number.parseInt(version.split('.')[0] ?? '0', 10);
    const store = createStore(subscribeWithSelector(
    // only use persist middleware if storage exists
    storage
        ? persist(getInitialState, {
            migrate(persistedState, version) {
                if (version === currentVersion)
                    return persistedState;
                const initialState = getInitialState();
                const chainId = validatePersistedChainId(persistedState, initialState.chainId);
                return { ...initialState, chainId };
            },
            name: 'store',
            partialize(state) {
                // Only persist "critical" store properties to preserve storage size.
                return {
                    connections: {
                        __type: 'Map',
                        value: Array.from(state.connections.entries()).map(([key, connection]) => {
                            const { id, name, type, uid } = connection.connector;
                            const connector = { id, name, type, uid };
                            return [key, { ...connection, connector }];
                        }),
                    },
                    chainId: state.chainId,
                    current: state.current,
                };
            },
            merge(persistedState, currentState) {
                // `status` should not be persisted as it messes with reconnection
                if (typeof persistedState === 'object' &&
                    persistedState &&
                    'status' in persistedState)
                    delete persistedState.status;
                // Make sure persisted `chainId` is valid
                const chainId = validatePersistedChainId(persistedState, currentState.chainId);
                return {
                    ...currentState,
                    ...persistedState,
                    chainId,
                };
            },
            skipHydration: ssr,
            storage: storage,
            version: currentVersion,
        })
        : getInitialState));
    store.setState(getInitialState());
    function validatePersistedChainId(persistedState, defaultChainId) {
        return persistedState &&
            typeof persistedState === 'object' &&
            'chainId' in persistedState &&
            typeof persistedState.chainId === 'number' &&
            chains.getState().some((x) => x.id === persistedState.chainId)
            ? persistedState.chainId
            : defaultChainId;
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////
    // Subscribe to changes
    /////////////////////////////////////////////////////////////////////////////////////////////////
    // Update default chain when connector chain changes
    if (syncConnectedChain)
        store.subscribe(({ connections, current }) => current ? connections.get(current)?.chainId : undefined, (chainId) => {
            // If chain is not configured, then don't switch over to it.
            const isChainConfigured = chains
                .getState()
                .some((x) => x.id === chainId);
            if (!isChainConfigured)
                return;
            return store.setState((x) => ({
                ...x,
                chainId: chainId ?? x.chainId,
            }));
        });
    // EIP-6963 subscribe for new wallet providers
    mipd?.subscribe((providerDetails) => {
        const connectorIdSet = new Set();
        const connectorRdnsSet = new Set();
        for (const connector of connectors.getState()) {
            connectorIdSet.add(connector.id);
            if (connector.rdns) {
                const rdnsValues = typeof connector.rdns === 'string' ? [connector.rdns] : connector.rdns;
                for (const rdns of rdnsValues) {
                    connectorRdnsSet.add(rdns);
                }
            }
        }
        const newConnectors = [];
        for (const providerDetail of providerDetails) {
            if (connectorRdnsSet.has(providerDetail.info.rdns))
                continue;
            const connector = setup(providerDetailToConnector(providerDetail));
            if (connectorIdSet.has(connector.id))
                continue;
            newConnectors.push(connector);
        }
        if (storage && !store.persist.hasHydrated())
            return;
        connectors.setState((x) => [...x, ...newConnectors], true);
    });
    /////////////////////////////////////////////////////////////////////////////////////////////////
    // Emitter listeners
    /////////////////////////////////////////////////////////////////////////////////////////////////
    function change(data) {
        store.setState((x) => {
            const connection = x.connections.get(data.uid);
            if (!connection)
                return x;
            return {
                ...x,
                connections: new Map(x.connections).set(data.uid, {
                    accounts: data.accounts ??
                        connection.accounts,
                    chainId: data.chainId ?? connection.chainId,
                    connector: connection.connector,
                }),
            };
        });
    }
    function connect(data) {
        // Disable handling if reconnecting/connecting
        if (store.getState().status === 'connecting' ||
            store.getState().status === 'reconnecting')
            return;
        store.setState((x) => {
            const connector = connectors.getState().find((x) => x.uid === data.uid);
            if (!connector)
                return x;
            if (connector.emitter.listenerCount('connect'))
                connector.emitter.off('connect', change);
            if (!connector.emitter.listenerCount('change'))
                connector.emitter.on('change', change);
            if (!connector.emitter.listenerCount('disconnect'))
                connector.emitter.on('disconnect', disconnect);
            return {
                ...x,
                connections: new Map(x.connections).set(data.uid, {
                    accounts: data.accounts,
                    chainId: data.chainId,
                    connector: connector,
                }),
                current: data.uid,
                status: 'connected',
            };
        });
    }
    function disconnect(data) {
        store.setState((x) => {
            const connection = x.connections.get(data.uid);
            if (connection) {
                const connector = connection.connector;
                if (connector.emitter.listenerCount('change'))
                    connection.connector.emitter.off('change', change);
                if (connector.emitter.listenerCount('disconnect'))
                    connection.connector.emitter.off('disconnect', disconnect);
                if (!connector.emitter.listenerCount('connect'))
                    connection.connector.emitter.on('connect', connect);
            }
            x.connections.delete(data.uid);
            if (x.connections.size === 0)
                return {
                    ...x,
                    connections: new Map(),
                    current: null,
                    status: 'disconnected',
                };
            const nextConnection = x.connections.values().next().value;
            return {
                ...x,
                connections: new Map(x.connections),
                current: nextConnection.connector.uid,
            };
        });
    }
    return {
        get chains() {
            return chains.getState();
        },
        get connectors() {
            return connectors.getState();
        },
        storage,
        getClient,
        get state() {
            return store.getState();
        },
        setState(value) {
            let newState;
            if (typeof value === 'function')
                newState = value(store.getState());
            else
                newState = value;
            // Reset state if it got set to something not matching the base state
            const initialState = getInitialState();
            if (typeof newState !== 'object')
                newState = initialState;
            const isCorrupt = Object.keys(initialState).some((x) => !(x in newState));
            if (isCorrupt)
                newState = initialState;
            store.setState(newState, true);
        },
        subscribe(selector, listener, options) {
            return store.subscribe(selector, listener, options
                ? {
                    ...options,
                    fireImmediately: options.emitImmediately,
                    // Workaround cast since Zustand does not support `'exactOptionalPropertyTypes'`
                }
                : undefined);
        },
        _internal: {
            mipd,
            async revalidate() {
                // Check connections to see if they are still active
                const state = store.getState();
                const connections = state.connections;
                let current = state.current;
                for (const [, connection] of connections) {
                    const connector = connection.connector;
                    // check if `connect.isAuthorized` exists
                    // partial connectors in storage do not have it
                    const isAuthorized = connector.isAuthorized
                        ? await connector.isAuthorized()
                        : false;
                    if (isAuthorized)
                        continue;
                    // Remove stale connection
                    connections.delete(connector.uid);
                    if (current === connector.uid)
                        current = null;
                }
                // set connections
                store.setState((x) => ({ ...x, connections, current }));
            },
            store,
            ssr: Boolean(ssr),
            syncConnectedChain,
            transports: rest.transports,
            chains: {
                setState(value) {
                    const nextChains = (typeof value === 'function' ? value(chains.getState()) : value);
                    if (nextChains.length === 0)
                        return;
                    return chains.setState(nextChains, true);
                },
                subscribe(listener) {
                    return chains.subscribe(listener);
                },
            },
            connectors: {
                providerDetailToConnector,
                setup: setup,
                setState(value) {
                    return connectors.setState(typeof value === 'function' ? value(connectors.getState()) : value, true);
                },
                subscribe(listener) {
                    return connectors.subscribe(listener);
                },
            },
            events: { change, connect, disconnect },
        },
    };
}

function extractRpcUrls(parameters) {
    const { chain } = parameters;
    const fallbackUrl = chain.rpcUrls.default.http[0];
    if (!parameters.transports)
        return [fallbackUrl];
    const transport = parameters.transports?.[chain.id]?.({ chain });
    const transports = transport?.value?.transports || [transport];
    return transports.map(({ value }) => value?.url || fallbackUrl);
}

const localhost = /*#__PURE__*/ defineChain({
    id: 1_337,
    name: 'Localhost',
    nativeCurrency: {
        decimals: 18,
        name: 'Ether',
        symbol: 'ETH',
    },
    rpcUrls: {
        default: { http: ['http://127.0.0.1:8545'] },
    },
});

const mainnet = /*#__PURE__*/ defineChain({
    id: 1,
    name: 'Ethereum',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockTime: 12_000,
    rpcUrls: {
        default: {
            http: ['https://eth.merkle.io'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Etherscan',
            url: 'https://etherscan.io',
            apiUrl: 'https://api.etherscan.io/api',
        },
    },
    contracts: {
        ensUniversalResolver: {
            address: '0xeeeeeeee14d718c2b47d9923deab1335e144eeee',
            blockCreated: 23_085_558,
        },
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
            blockCreated: 14_353_601,
        },
    },
});

const polygon = /*#__PURE__*/ defineChain({
    id: 137,
    name: 'Polygon',
    blockTime: 2000,
    nativeCurrency: { name: 'POL', symbol: 'POL', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://polygon-rpc.com'],
        },
    },
    blockExplorers: {
        default: {
            name: 'PolygonScan',
            url: 'https://polygonscan.com',
            apiUrl: 'https://api.etherscan.io/v2/api',
        },
    },
    contracts: {
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
            blockCreated: 25770160,
        },
    },
});

const polygonMumbai = /*#__PURE__*/ defineChain({
    id: 80_001,
    name: 'Polygon Mumbai',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://80001.rpc.thirdweb.com'],
        },
    },
    blockExplorers: {
        default: {
            name: 'PolygonScan',
            url: 'https://mumbai.polygonscan.com',
            apiUrl: 'https://api-testnet.polygonscan.com/api',
        },
    },
    contracts: {
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
            blockCreated: 25770160,
        },
    },
    testnet: true,
});

coinbaseWallet.type = 'coinbaseWallet';
function coinbaseWallet(parameters = {}) {
    if (parameters.version === '3' || parameters.headlessMode)
        return version3(parameters);
    return version4(parameters);
}
function version4(parameters) {
    let walletProvider;
    let accountsChanged;
    let chainChanged;
    let disconnect;
    return createConnector((config) => ({
        id: 'coinbaseWalletSDK',
        name: 'Coinbase Wallet',
        rdns: 'com.coinbase.wallet',
        type: coinbaseWallet.type,
        async connect({ chainId, withCapabilities, ...rest } = {}) {
            try {
                const provider = await this.getProvider();
                const accounts = (await provider.request({
                    method: 'eth_requestAccounts',
                    params: 'instantOnboarding' in rest && rest.instantOnboarding
                        ? [{ onboarding: 'instant' }]
                        : [],
                })).map((x) => getAddress(x));
                if (!accountsChanged) {
                    accountsChanged = this.onAccountsChanged.bind(this);
                    provider.on('accountsChanged', accountsChanged);
                }
                if (!chainChanged) {
                    chainChanged = this.onChainChanged.bind(this);
                    provider.on('chainChanged', chainChanged);
                }
                if (!disconnect) {
                    disconnect = this.onDisconnect.bind(this);
                    provider.on('disconnect', disconnect);
                }
                // Switch to chain if provided
                let currentChainId = await this.getChainId();
                if (chainId && currentChainId !== chainId) {
                    const chain = await this.switchChain({ chainId }).catch((error) => {
                        if (error.code === UserRejectedRequestError.code)
                            throw error;
                        return { id: currentChainId };
                    });
                    currentChainId = chain?.id ?? currentChainId;
                }
                return {
                    accounts: (withCapabilities
                        ? accounts.map((address) => ({ address, capabilities: {} }))
                        : accounts),
                    chainId: currentChainId,
                };
            }
            catch (error) {
                if (/(user closed modal|accounts received is empty|user denied account|request rejected)/i.test(error.message))
                    throw new UserRejectedRequestError(error);
                throw error;
            }
        },
        async disconnect() {
            const provider = await this.getProvider();
            if (accountsChanged) {
                provider.removeListener('accountsChanged', accountsChanged);
                accountsChanged = undefined;
            }
            if (chainChanged) {
                provider.removeListener('chainChanged', chainChanged);
                chainChanged = undefined;
            }
            if (disconnect) {
                provider.removeListener('disconnect', disconnect);
                disconnect = undefined;
            }
            provider.disconnect();
            provider.close?.();
        },
        async getAccounts() {
            const provider = await this.getProvider();
            return (await provider.request({
                method: 'eth_accounts',
            })).map((x) => getAddress(x));
        },
        async getChainId() {
            const provider = await this.getProvider();
            const chainId = (await provider.request({
                method: 'eth_chainId',
            }));
            return Number(chainId);
        },
        async getProvider() {
            if (!walletProvider) {
                const preference = (() => {
                    if (typeof parameters.preference === 'string')
                        return { options: parameters.preference };
                    return {
                        ...parameters.preference,
                        options: parameters.preference?.options ?? 'all',
                    };
                })();
                const { createCoinbaseWalletSDK } = await import('./index-DFR2i6iO.js');
                const sdk = createCoinbaseWalletSDK({
                    ...parameters,
                    appChainIds: config.chains.map((x) => x.id),
                    preference,
                });
                walletProvider = sdk.getProvider();
            }
            return walletProvider;
        },
        async isAuthorized() {
            try {
                const accounts = await this.getAccounts();
                return !!accounts.length;
            }
            catch {
                return false;
            }
        },
        async switchChain({ addEthereumChainParameter, chainId }) {
            const chain = config.chains.find((chain) => chain.id === chainId);
            if (!chain)
                throw new SwitchChainError(new ChainNotConfiguredError());
            const provider = await this.getProvider();
            try {
                await provider.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: numberToHex(chain.id) }],
                });
                return chain;
            }
            catch (error) {
                // Indicates chain is not added to provider
                if (error.code === 4902) {
                    try {
                        let blockExplorerUrls;
                        if (addEthereumChainParameter?.blockExplorerUrls)
                            blockExplorerUrls = addEthereumChainParameter.blockExplorerUrls;
                        else
                            blockExplorerUrls = chain.blockExplorers?.default.url
                                ? [chain.blockExplorers?.default.url]
                                : [];
                        let rpcUrls;
                        if (addEthereumChainParameter?.rpcUrls?.length)
                            rpcUrls = addEthereumChainParameter.rpcUrls;
                        else
                            rpcUrls = [chain.rpcUrls.default?.http[0] ?? ''];
                        const addEthereumChain = {
                            blockExplorerUrls,
                            chainId: numberToHex(chainId),
                            chainName: addEthereumChainParameter?.chainName ?? chain.name,
                            iconUrls: addEthereumChainParameter?.iconUrls,
                            nativeCurrency: addEthereumChainParameter?.nativeCurrency ??
                                chain.nativeCurrency,
                            rpcUrls,
                        };
                        await provider.request({
                            method: 'wallet_addEthereumChain',
                            params: [addEthereumChain],
                        });
                        return chain;
                    }
                    catch (error) {
                        throw new UserRejectedRequestError(error);
                    }
                }
                throw new SwitchChainError(error);
            }
        },
        onAccountsChanged(accounts) {
            if (accounts.length === 0)
                this.onDisconnect();
            else
                config.emitter.emit('change', {
                    accounts: accounts.map((x) => getAddress(x)),
                });
        },
        onChainChanged(chain) {
            const chainId = Number(chain);
            config.emitter.emit('change', { chainId });
        },
        async onDisconnect(_error) {
            config.emitter.emit('disconnect');
            const provider = await this.getProvider();
            if (accountsChanged) {
                provider.removeListener('accountsChanged', accountsChanged);
                accountsChanged = undefined;
            }
            if (chainChanged) {
                provider.removeListener('chainChanged', chainChanged);
                chainChanged = undefined;
            }
            if (disconnect) {
                provider.removeListener('disconnect', disconnect);
                disconnect = undefined;
            }
        },
    }));
}
function version3(parameters) {
    const reloadOnDisconnect = false;
    let sdk;
    let walletProvider;
    let accountsChanged;
    let chainChanged;
    let disconnect;
    return createConnector((config) => ({
        id: 'coinbaseWalletSDK',
        name: 'Coinbase Wallet',
        rdns: 'com.coinbase.wallet',
        type: coinbaseWallet.type,
        async connect({ chainId, withCapabilities } = {}) {
            try {
                const provider = await this.getProvider();
                const accounts = (await provider.request({
                    method: 'eth_requestAccounts',
                })).map((x) => getAddress(x));
                if (!accountsChanged) {
                    accountsChanged = this.onAccountsChanged.bind(this);
                    provider.on('accountsChanged', accountsChanged);
                }
                if (!chainChanged) {
                    chainChanged = this.onChainChanged.bind(this);
                    provider.on('chainChanged', chainChanged);
                }
                if (!disconnect) {
                    disconnect = this.onDisconnect.bind(this);
                    provider.on('disconnect', disconnect);
                }
                // Switch to chain if provided
                let currentChainId = await this.getChainId();
                if (chainId && currentChainId !== chainId) {
                    const chain = await this.switchChain({ chainId }).catch((error) => {
                        if (error.code === UserRejectedRequestError.code)
                            throw error;
                        return { id: currentChainId };
                    });
                    currentChainId = chain?.id ?? currentChainId;
                }
                return {
                    accounts: (withCapabilities
                        ? accounts.map((address) => ({ address, capabilities: {} }))
                        : accounts),
                    chainId: currentChainId,
                };
            }
            catch (error) {
                if (/(user closed modal|accounts received is empty|user denied account)/i.test(error.message))
                    throw new UserRejectedRequestError(error);
                throw error;
            }
        },
        async disconnect() {
            const provider = await this.getProvider();
            if (accountsChanged) {
                provider.removeListener('accountsChanged', accountsChanged);
                accountsChanged = undefined;
            }
            if (chainChanged) {
                provider.removeListener('chainChanged', chainChanged);
                chainChanged = undefined;
            }
            if (disconnect) {
                provider.removeListener('disconnect', disconnect);
                disconnect = undefined;
            }
            provider.disconnect();
            provider.close();
        },
        async getAccounts() {
            const provider = await this.getProvider();
            return (await provider.request({
                method: 'eth_accounts',
            })).map((x) => getAddress(x));
        },
        async getChainId() {
            const provider = await this.getProvider();
            const chainId = await provider.request({
                method: 'eth_chainId',
            });
            return Number(chainId);
        },
        async getProvider() {
            if (!walletProvider) {
                // Unwrapping import for Vite compatibility.
                // See: https://github.com/vitejs/vite/issues/9703
                const CoinbaseWalletSDK = await (async () => {
                    const { default: SDK } = await import('./index-BJPnQmy9.js').then(function (n) { return n.i; });
                    if (typeof SDK !== 'function' && typeof SDK.default === 'function')
                        return SDK.default;
                    return SDK;
                })();
                sdk = new CoinbaseWalletSDK({ ...parameters, reloadOnDisconnect });
                // Force types to retrieve private `walletExtension` method from the Coinbase Wallet SDK.
                const walletExtensionChainId = sdk.walletExtension?.getChainId();
                const chain = config.chains.find((chain) => parameters.chainId
                    ? chain.id === parameters.chainId
                    : chain.id === walletExtensionChainId) || config.chains[0];
                const chainId = parameters.chainId || chain?.id;
                const jsonRpcUrl = parameters.jsonRpcUrl || chain?.rpcUrls.default.http[0];
                walletProvider = sdk.makeWeb3Provider(jsonRpcUrl, chainId);
            }
            return walletProvider;
        },
        async isAuthorized() {
            try {
                const accounts = await this.getAccounts();
                return !!accounts.length;
            }
            catch {
                return false;
            }
        },
        async switchChain({ addEthereumChainParameter, chainId }) {
            const chain = config.chains.find((chain) => chain.id === chainId);
            if (!chain)
                throw new SwitchChainError(new ChainNotConfiguredError());
            const provider = await this.getProvider();
            try {
                await provider.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: numberToHex(chain.id) }],
                });
                return chain;
            }
            catch (error) {
                // Indicates chain is not added to provider
                if (error.code === 4902) {
                    try {
                        let blockExplorerUrls;
                        if (addEthereumChainParameter?.blockExplorerUrls)
                            blockExplorerUrls = addEthereumChainParameter.blockExplorerUrls;
                        else
                            blockExplorerUrls = chain.blockExplorers?.default.url
                                ? [chain.blockExplorers?.default.url]
                                : [];
                        let rpcUrls;
                        if (addEthereumChainParameter?.rpcUrls?.length)
                            rpcUrls = addEthereumChainParameter.rpcUrls;
                        else
                            rpcUrls = [chain.rpcUrls.default?.http[0] ?? ''];
                        const addEthereumChain = {
                            blockExplorerUrls,
                            chainId: numberToHex(chainId),
                            chainName: addEthereumChainParameter?.chainName ?? chain.name,
                            iconUrls: addEthereumChainParameter?.iconUrls,
                            nativeCurrency: addEthereumChainParameter?.nativeCurrency ??
                                chain.nativeCurrency,
                            rpcUrls,
                        };
                        await provider.request({
                            method: 'wallet_addEthereumChain',
                            params: [addEthereumChain],
                        });
                        return chain;
                    }
                    catch (error) {
                        throw new UserRejectedRequestError(error);
                    }
                }
                throw new SwitchChainError(error);
            }
        },
        onAccountsChanged(accounts) {
            if (accounts.length === 0)
                this.onDisconnect();
            else
                config.emitter.emit('change', {
                    accounts: accounts.map((x) => getAddress(x)),
                });
        },
        onChainChanged(chain) {
            const chainId = Number(chain);
            config.emitter.emit('change', { chainId });
        },
        async onDisconnect(_error) {
            config.emitter.emit('disconnect');
            const provider = await this.getProvider();
            if (accountsChanged) {
                provider.removeListener('accountsChanged', accountsChanged);
                accountsChanged = undefined;
            }
            if (chainChanged) {
                provider.removeListener('chainChanged', chainChanged);
                chainChanged = undefined;
            }
            if (disconnect) {
                provider.removeListener('disconnect', disconnect);
                disconnect = undefined;
            }
        },
    }));
}

walletConnect.type = 'walletConnect';
function walletConnect(parameters) {
    const isNewChainsStale = parameters.isNewChainsStale ?? true;
    let provider_;
    let providerPromise;
    const NAMESPACE = 'eip155';
    let accountsChanged;
    let chainChanged;
    let connect;
    let displayUri;
    let sessionDelete;
    let disconnect;
    return createConnector((config) => ({
        id: 'walletConnect',
        name: 'WalletConnect',
        type: walletConnect.type,
        async setup() {
            const provider = await this.getProvider().catch(() => null);
            if (!provider)
                return;
            if (!connect) {
                connect = this.onConnect.bind(this);
                provider.on('connect', connect);
            }
            if (!sessionDelete) {
                sessionDelete = this.onSessionDelete.bind(this);
                provider.on('session_delete', sessionDelete);
            }
        },
        async connect({ chainId, withCapabilities, ...rest } = {}) {
            try {
                const provider = await this.getProvider();
                if (!provider)
                    throw new ProviderNotFoundError();
                if (!displayUri) {
                    displayUri = this.onDisplayUri;
                    provider.on('display_uri', displayUri);
                }
                let targetChainId = chainId;
                if (!targetChainId) {
                    const state = (await config.storage?.getItem('state')) ?? {};
                    const isChainSupported = config.chains.some((x) => x.id === state.chainId);
                    if (isChainSupported)
                        targetChainId = state.chainId;
                    else
                        targetChainId = config.chains[0]?.id;
                }
                if (!targetChainId)
                    throw new Error('No chains found on connector.');
                const isChainsStale = await this.isChainsStale();
                // If there is an active session with stale chains, disconnect current session.
                if (provider.session && isChainsStale)
                    await provider.disconnect();
                // If there isn't an active session or chains are stale, connect.
                if (!provider.session || isChainsStale) {
                    const optionalChains = config.chains
                        .filter((chain) => chain.id !== targetChainId)
                        .map((optionalChain) => optionalChain.id);
                    await provider.connect({
                        optionalChains: [targetChainId, ...optionalChains],
                        ...('pairingTopic' in rest
                            ? { pairingTopic: rest.pairingTopic }
                            : {}),
                    });
                    this.setRequestedChainsIds(config.chains.map((x) => x.id));
                }
                // If session exists and chains are authorized, enable provider for required chain
                const accounts = (await provider.enable()).map((x) => getAddress(x));
                // Switch to chain if provided
                let currentChainId = await this.getChainId();
                if (chainId && currentChainId !== chainId) {
                    const chain = await this.switchChain({ chainId }).catch((error) => {
                        if (error.code === UserRejectedRequestError.code &&
                            error.cause?.message !==
                                'Missing or invalid. request() method: wallet_addEthereumChain')
                            throw error;
                        return { id: currentChainId };
                    });
                    currentChainId = chain?.id ?? currentChainId;
                }
                if (displayUri) {
                    provider.removeListener('display_uri', displayUri);
                    displayUri = undefined;
                }
                if (connect) {
                    provider.removeListener('connect', connect);
                    connect = undefined;
                }
                if (!accountsChanged) {
                    accountsChanged = this.onAccountsChanged.bind(this);
                    provider.on('accountsChanged', accountsChanged);
                }
                if (!chainChanged) {
                    chainChanged = this.onChainChanged.bind(this);
                    provider.on('chainChanged', chainChanged);
                }
                if (!disconnect) {
                    disconnect = this.onDisconnect.bind(this);
                    provider.on('disconnect', disconnect);
                }
                if (!sessionDelete) {
                    sessionDelete = this.onSessionDelete.bind(this);
                    provider.on('session_delete', sessionDelete);
                }
                return {
                    accounts: (withCapabilities
                        ? accounts.map((address) => ({ address, capabilities: {} }))
                        : accounts),
                    chainId: currentChainId,
                };
            }
            catch (error) {
                if (/(user rejected|connection request reset)/i.test(error?.message)) {
                    throw new UserRejectedRequestError(error);
                }
                throw error;
            }
        },
        async disconnect() {
            const provider = await this.getProvider();
            try {
                await provider?.disconnect();
            }
            catch (error) {
                if (!/No matching key/i.test(error.message))
                    throw error;
            }
            finally {
                if (chainChanged) {
                    provider?.removeListener('chainChanged', chainChanged);
                    chainChanged = undefined;
                }
                if (disconnect) {
                    provider?.removeListener('disconnect', disconnect);
                    disconnect = undefined;
                }
                if (!connect) {
                    connect = this.onConnect.bind(this);
                    provider?.on('connect', connect);
                }
                if (accountsChanged) {
                    provider?.removeListener('accountsChanged', accountsChanged);
                    accountsChanged = undefined;
                }
                if (sessionDelete) {
                    provider?.removeListener('session_delete', sessionDelete);
                    sessionDelete = undefined;
                }
                this.setRequestedChainsIds([]);
            }
        },
        async getAccounts() {
            const provider = await this.getProvider();
            return provider.accounts.map((x) => getAddress(x));
        },
        async getProvider({ chainId } = {}) {
            async function initProvider() {
                const optionalChains = config.chains.map((x) => x.id);
                if (!optionalChains.length)
                    return;
                const { EthereumProvider } = await import('./index.es-CGqpYBjs.js').then(function (n) { return n.V; });
                return await EthereumProvider.init({
                    ...parameters,
                    disableProviderPing: true,
                    optionalChains,
                    projectId: parameters.projectId,
                    rpcMap: Object.fromEntries(config.chains.map((chain) => {
                        const [url] = extractRpcUrls({
                            chain,
                            transports: config.transports,
                        });
                        return [chain.id, url];
                    })),
                    showQrModal: parameters.showQrModal ?? true,
                });
            }
            if (!provider_) {
                if (!providerPromise)
                    providerPromise = initProvider();
                provider_ = await providerPromise;
                provider_?.events.setMaxListeners(Number.POSITIVE_INFINITY);
            }
            if (chainId)
                await this.switchChain?.({ chainId });
            return provider_;
        },
        async getChainId() {
            const provider = await this.getProvider();
            return provider.chainId;
        },
        async isAuthorized() {
            try {
                const [accounts, provider] = await Promise.all([
                    this.getAccounts(),
                    this.getProvider(),
                ]);
                // If an account does not exist on the session, then the connector is unauthorized.
                if (!accounts.length)
                    return false;
                // If the chains are stale on the session, then the connector is unauthorized.
                const isChainsStale = await this.isChainsStale();
                if (isChainsStale && provider.session) {
                    await provider.disconnect().catch(() => { });
                    return false;
                }
                return true;
            }
            catch {
                return false;
            }
        },
        async switchChain({ addEthereumChainParameter, chainId }) {
            const provider = await this.getProvider();
            if (!provider)
                throw new ProviderNotFoundError();
            const chain = config.chains.find((x) => x.id === chainId);
            if (!chain)
                throw new SwitchChainError(new ChainNotConfiguredError());
            try {
                await Promise.all([
                    new Promise((resolve) => {
                        const listener = ({ chainId: currentChainId, }) => {
                            if (currentChainId === chainId) {
                                config.emitter.off('change', listener);
                                resolve();
                            }
                        };
                        config.emitter.on('change', listener);
                    }),
                    provider.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: numberToHex(chainId) }],
                    }),
                ]);
                const requestedChains = await this.getRequestedChainsIds();
                this.setRequestedChainsIds([...requestedChains, chainId]);
                return chain;
            }
            catch (err) {
                const error = err;
                if (/(user rejected)/i.test(error.message))
                    throw new UserRejectedRequestError(error);
                // Indicates chain is not added to provider
                try {
                    let blockExplorerUrls;
                    if (addEthereumChainParameter?.blockExplorerUrls)
                        blockExplorerUrls = addEthereumChainParameter.blockExplorerUrls;
                    else
                        blockExplorerUrls = chain.blockExplorers?.default.url
                            ? [chain.blockExplorers?.default.url]
                            : [];
                    let rpcUrls;
                    if (addEthereumChainParameter?.rpcUrls?.length)
                        rpcUrls = addEthereumChainParameter.rpcUrls;
                    else
                        rpcUrls = [...chain.rpcUrls.default.http];
                    const addEthereumChain = {
                        blockExplorerUrls,
                        chainId: numberToHex(chainId),
                        chainName: addEthereumChainParameter?.chainName ?? chain.name,
                        iconUrls: addEthereumChainParameter?.iconUrls,
                        nativeCurrency: addEthereumChainParameter?.nativeCurrency ?? chain.nativeCurrency,
                        rpcUrls,
                    };
                    await provider.request({
                        method: 'wallet_addEthereumChain',
                        params: [addEthereumChain],
                    });
                    const requestedChains = await this.getRequestedChainsIds();
                    this.setRequestedChainsIds([...requestedChains, chainId]);
                    return chain;
                }
                catch (error) {
                    throw new UserRejectedRequestError(error);
                }
            }
        },
        onAccountsChanged(accounts) {
            if (accounts.length === 0)
                this.onDisconnect();
            else
                config.emitter.emit('change', {
                    accounts: accounts.map((x) => getAddress(x)),
                });
        },
        onChainChanged(chain) {
            const chainId = Number(chain);
            config.emitter.emit('change', { chainId });
        },
        async onConnect(connectInfo) {
            const chainId = Number(connectInfo.chainId);
            const accounts = await this.getAccounts();
            config.emitter.emit('connect', { accounts, chainId });
        },
        async onDisconnect(_error) {
            this.setRequestedChainsIds([]);
            config.emitter.emit('disconnect');
            const provider = await this.getProvider();
            if (accountsChanged) {
                provider.removeListener('accountsChanged', accountsChanged);
                accountsChanged = undefined;
            }
            if (chainChanged) {
                provider.removeListener('chainChanged', chainChanged);
                chainChanged = undefined;
            }
            if (disconnect) {
                provider.removeListener('disconnect', disconnect);
                disconnect = undefined;
            }
            if (sessionDelete) {
                provider.removeListener('session_delete', sessionDelete);
                sessionDelete = undefined;
            }
            if (!connect) {
                connect = this.onConnect.bind(this);
                provider.on('connect', connect);
            }
        },
        onDisplayUri(uri) {
            config.emitter.emit('message', { type: 'display_uri', data: uri });
        },
        onSessionDelete() {
            this.onDisconnect();
        },
        getNamespaceChainsIds() {
            if (!provider_)
                return [];
            const chainIds = provider_.session?.namespaces[NAMESPACE]?.accounts?.map((account) => Number.parseInt(account.split(':')[1] || '', 10));
            return chainIds ?? [];
        },
        async getRequestedChainsIds() {
            return ((await config.storage?.getItem(this.requestedChainsStorageKey)) ?? []);
        },
        /**
         * Checks if the target chains match the chains that were
         * initially requested by the connector for the WalletConnect session.
         * If there is a mismatch, this means that the chains on the connector
         * are considered stale, and need to be revalidated at a later point (via
         * connection).
         *
         * There may be a scenario where a dapp adds a chain to the
         * connector later on, however, this chain will not have been approved or rejected
         * by the wallet. In this case, the chain is considered stale.
         */
        async isChainsStale() {
            if (!isNewChainsStale)
                return false;
            const connectorChains = config.chains.map((x) => x.id);
            const namespaceChains = this.getNamespaceChainsIds();
            if (namespaceChains.length &&
                !namespaceChains.some((id) => connectorChains.includes(id)))
                return false;
            const requestedChains = await this.getRequestedChainsIds();
            return !connectorChains.every((id) => requestedChains.includes(id));
        },
        async setRequestedChainsIds(chains) {
            await config.storage?.setItem(this.requestedChainsStorageKey, chains);
        },
        get requestedChainsStorageKey() {
            return `${this.id}.requestedChains`;
        },
    }));
}

const projectId = "bbcddcc5afbf6cd4b9daface6c2aa284";
const config = createConfig({
  chains: [polygon, polygonMumbai, localhost, mainnet],
  connectors: [
    injected(),
    walletConnect({
      projectId,
      metadata: {
        name: "Sephar Studios",
        description: "Premium streaming platform with Web3 integration",
        url: "https://sepharstudios.com",
        icons: ["https://sepharstudios.com/icon.png"]
      }
    }),
    coinbaseWallet({
      appName: "Sephar Studios",
      appLogoUrl: "https://sepharstudios.com/icon.png"
    })
  ],
  transports: {
    [polygon.id]: http("https://polygon-mainnet.g.alchemy.com/v2/jDZ151u9mGIroWRG3tE_9"),
    [polygonMumbai.id]: http("https://rpc-mumbai.maticvigil.com"),
    [localhost.id]: http("http://127.0.0.1:8545"),
    [mainnet.id]: http("https://eth.llamarpc.com")
  }
});
const CONTRACT_ADDRESSES = {
  [polygon.id]: {
    studioToken: "",
    sepharSubscription: "",
    creatorPayments: "",
    tokenAMM: "",
    usdcToken: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
    // Polygon USDC
  },
  [polygonMumbai.id]: {
    studioToken: "",
    sepharSubscription: "",
    creatorPayments: "",
    tokenAMM: "",
    usdcToken: "0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e"
    // Mumbai testnet USDC
  },
  [localhost.id]: {
    studioToken: "",
    sepharSubscription: "",
    creatorPayments: "",
    tokenAMM: "",
    usdcToken: ""
    // Will be deployed locally
  }
};
const DEFAULT_CHAIN = polygonMumbai;
function getContractAddresses(chainId) {
  return CONTRACT_ADDRESSES[chainId] || CONTRACT_ADDRESSES[polygonMumbai.id];
}

export { InvalidInputRpcError as $, getContractAddresses as A, BaseError$1 as B, ConnectorAlreadyConnectedError as C, DEFAULT_CHAIN as D, size$2 as E, SliceOffsetOutOfBoundsError as F, assertSize as G, HttpRequestError as H, InvalidAddressError as I, bytesToHex as J, hexToNumber as K, LruMap as L, trim as M, InvalidBytesBooleanError as N, hexToBigInt as O, numberToHex as P, padHex as Q, boolToHex as R, SwitchChainNotSupportedError as S, IntegerOutOfRangeError as T, stringToHex as U, hexToBytes as V, checksumAddress as W, keccak256 as X, toBytes$1 as Y, getContractAddress as Z, InternalRpcError as _, ChainNotConfiguredError as a, RpcRequestError as a0, InvalidBytesLengthError as a1, createBatchScheduler as a2, toHex as a3, createView as a4, aoutput as a5, createHasher as a6, rotr as a7, TransactionRejectedRpcError as a8, UserRejectedRequestError as a9, WalletConnectSessionSettlementError as aa, wait as ab, http as ac, getDefaultExportFromCjs as ad, getAugmentedNamespace as ae, commonjsGlobal as af, stringToBytes as ag, pad as ah, hexToBool as ai, withResolvers as aj, withRetry as ak, EventEmitter as al, defineChain as am, hexToString as an, requireEventemitter3 as ao, injected as b, coinbaseWallet as c, config as d, isAddress as e, Hash as f, getUrl as g, ahash as h, isHex as i, clean as j, aexists as k, abytes as l, anumber as m, concatBytes as n, createTransport as o, parseAccount as p, ConnectorUnavailableReconnectingError as q, randomBytes as r, stringify as s, toBytes as t, ConnectorNotConnectedError as u, ConnectorChainMismatchError as v, walletConnect as w, getAddress as x, ConnectorAccountNotFoundError as y, createClient as z };
//# sourceMappingURL=config-DiSGGbdB.js.map
