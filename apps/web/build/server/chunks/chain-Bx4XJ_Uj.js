import { B as BaseError, A as size, r as isHex, f as SliceOffsetOutOfBoundsError, v as numberToHex, q as isAddress, a as InvalidAddressError, y as padHex, i as boolToHex, I as IntegerOutOfRangeError, D as stringToHex, s as keccak256, k as checksumAddress, j as bytesToHex, o as hexToBytes, F as toBytes } from './stringify-CbXG6ciN.js';
import { s as sha256$2 } from './sha2-Cn2-4DsP.js';

function formatAbiItem(abiItem, { includeName = false } = {}) {
    if (abiItem.type !== 'function' &&
        abiItem.type !== 'event' &&
        abiItem.type !== 'error')
        throw new InvalidDefinitionTypeError(abiItem.type);
    return `${abiItem.name}(${formatAbiParams(abiItem.inputs, { includeName })})`;
}
function formatAbiParams(params, { includeName = false } = {}) {
    if (!params)
        return '';
    return params
        .map((param) => formatAbiParam(param, { includeName }))
        .join(includeName ? ', ' : ',');
}
function formatAbiParam(param, { includeName }) {
    if (param.type.startsWith('tuple')) {
        return `(${formatAbiParams(param.components, { includeName })})${param.type.slice('tuple'.length)}`;
    }
    return param.type + (includeName && param.name ? ` ${param.name}` : '');
}

class AbiConstructorNotFoundError extends BaseError {
    constructor({ docsPath }) {
        super([
            'A constructor was not found on the ABI.',
            'Make sure you are using the correct ABI and that the constructor exists on it.',
        ].join('\n'), {
            docsPath,
            name: 'AbiConstructorNotFoundError',
        });
    }
}
class AbiConstructorParamsNotFoundError extends BaseError {
    constructor({ docsPath }) {
        super([
            'Constructor arguments were provided (`args`), but a constructor parameters (`inputs`) were not found on the ABI.',
            'Make sure you are using the correct ABI, and that the `inputs` attribute on the constructor exists.',
        ].join('\n'), {
            docsPath,
            name: 'AbiConstructorParamsNotFoundError',
        });
    }
}
class AbiDecodingDataSizeTooSmallError extends BaseError {
    constructor({ data, params, size, }) {
        super([`Data size of ${size} bytes is too small for given parameters.`].join('\n'), {
            metaMessages: [
                `Params: (${formatAbiParams(params, { includeName: true })})`,
                `Data:   ${data} (${size} bytes)`,
            ],
            name: 'AbiDecodingDataSizeTooSmallError',
        });
        Object.defineProperty(this, "data", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "params", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "size", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.data = data;
        this.params = params;
        this.size = size;
    }
}
class AbiDecodingZeroDataError extends BaseError {
    constructor({ cause } = {}) {
        super('Cannot decode zero data ("0x") with ABI parameters.', {
            name: 'AbiDecodingZeroDataError',
            cause,
        });
    }
}
class AbiEncodingArrayLengthMismatchError extends BaseError {
    constructor({ expectedLength, givenLength, type, }) {
        super([
            `ABI encoding array length mismatch for type ${type}.`,
            `Expected length: ${expectedLength}`,
            `Given length: ${givenLength}`,
        ].join('\n'), { name: 'AbiEncodingArrayLengthMismatchError' });
    }
}
class AbiEncodingBytesSizeMismatchError extends BaseError {
    constructor({ expectedSize, value }) {
        super(`Size of bytes "${value}" (bytes${size(value)}) does not match expected size (bytes${expectedSize}).`, { name: 'AbiEncodingBytesSizeMismatchError' });
    }
}
class AbiEncodingLengthMismatchError extends BaseError {
    constructor({ expectedLength, givenLength, }) {
        super([
            'ABI encoding params/values length mismatch.',
            `Expected length (params): ${expectedLength}`,
            `Given length (values): ${givenLength}`,
        ].join('\n'), { name: 'AbiEncodingLengthMismatchError' });
    }
}
class AbiErrorInputsNotFoundError extends BaseError {
    constructor(errorName, { docsPath }) {
        super([
            `Arguments (\`args\`) were provided to "${errorName}", but "${errorName}" on the ABI does not contain any parameters (\`inputs\`).`,
            'Cannot encode error result without knowing what the parameter types are.',
            'Make sure you are using the correct ABI and that the inputs exist on it.',
        ].join('\n'), {
            docsPath,
            name: 'AbiErrorInputsNotFoundError',
        });
    }
}
class AbiErrorNotFoundError extends BaseError {
    constructor(errorName, { docsPath } = {}) {
        super([
            `Error ${errorName ? `"${errorName}" ` : ''}not found on ABI.`,
            'Make sure you are using the correct ABI and that the error exists on it.',
        ].join('\n'), {
            docsPath,
            name: 'AbiErrorNotFoundError',
        });
    }
}
class AbiErrorSignatureNotFoundError extends BaseError {
    constructor(signature, { docsPath, cause, }) {
        super([
            `Encoded error signature "${signature}" not found on ABI.`,
            'Make sure you are using the correct ABI and that the error exists on it.',
            `You can look up the decoded signature here: https://4byte.sourcify.dev/?q=${signature}.`,
        ].join('\n'), {
            docsPath,
            name: 'AbiErrorSignatureNotFoundError',
            cause,
        });
        Object.defineProperty(this, "signature", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.signature = signature;
    }
}
class AbiEventSignatureEmptyTopicsError extends BaseError {
    constructor({ docsPath }) {
        super('Cannot extract event signature from empty topics.', {
            docsPath,
            name: 'AbiEventSignatureEmptyTopicsError',
        });
    }
}
class AbiEventSignatureNotFoundError extends BaseError {
    constructor(signature, { docsPath }) {
        super([
            `Encoded event signature "${signature}" not found on ABI.`,
            'Make sure you are using the correct ABI and that the event exists on it.',
            `You can look up the signature here: https://4byte.sourcify.dev/?q=${signature}.`,
        ].join('\n'), {
            docsPath,
            name: 'AbiEventSignatureNotFoundError',
        });
    }
}
class AbiEventNotFoundError extends BaseError {
    constructor(eventName, { docsPath } = {}) {
        super([
            `Event ${eventName ? `"${eventName}" ` : ''}not found on ABI.`,
            'Make sure you are using the correct ABI and that the event exists on it.',
        ].join('\n'), {
            docsPath,
            name: 'AbiEventNotFoundError',
        });
    }
}
class AbiFunctionNotFoundError extends BaseError {
    constructor(functionName, { docsPath } = {}) {
        super([
            `Function ${functionName ? `"${functionName}" ` : ''}not found on ABI.`,
            'Make sure you are using the correct ABI and that the function exists on it.',
        ].join('\n'), {
            docsPath,
            name: 'AbiFunctionNotFoundError',
        });
    }
}
class AbiFunctionOutputsNotFoundError extends BaseError {
    constructor(functionName, { docsPath }) {
        super([
            `Function "${functionName}" does not contain any \`outputs\` on ABI.`,
            'Cannot decode function result without knowing what the parameter types are.',
            'Make sure you are using the correct ABI and that the function exists on it.',
        ].join('\n'), {
            docsPath,
            name: 'AbiFunctionOutputsNotFoundError',
        });
    }
}
class AbiFunctionSignatureNotFoundError extends BaseError {
    constructor(signature, { docsPath }) {
        super([
            `Encoded function signature "${signature}" not found on ABI.`,
            'Make sure you are using the correct ABI and that the function exists on it.',
            `You can look up the signature here: https://4byte.sourcify.dev/?q=${signature}.`,
        ].join('\n'), {
            docsPath,
            name: 'AbiFunctionSignatureNotFoundError',
        });
    }
}
class AbiItemAmbiguityError extends BaseError {
    constructor(x, y) {
        super('Found ambiguous types in overloaded ABI items.', {
            metaMessages: [
                `\`${x.type}\` in \`${formatAbiItem(x.abiItem)}\`, and`,
                `\`${y.type}\` in \`${formatAbiItem(y.abiItem)}\``,
                '',
                'These types encode differently and cannot be distinguished at runtime.',
                'Remove one of the ambiguous items in the ABI.',
            ],
            name: 'AbiItemAmbiguityError',
        });
    }
}
class BytesSizeMismatchError extends BaseError {
    constructor({ expectedSize, givenSize, }) {
        super(`Expected bytes${expectedSize}, got bytes${givenSize}.`, {
            name: 'BytesSizeMismatchError',
        });
    }
}
class DecodeLogDataMismatch extends BaseError {
    constructor({ abiItem, data, params, size, }) {
        super([
            `Data size of ${size} bytes is too small for non-indexed event parameters.`,
        ].join('\n'), {
            metaMessages: [
                `Params: (${formatAbiParams(params, { includeName: true })})`,
                `Data:   ${data} (${size} bytes)`,
            ],
            name: 'DecodeLogDataMismatch',
        });
        Object.defineProperty(this, "abiItem", {
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
        Object.defineProperty(this, "params", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "size", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.abiItem = abiItem;
        this.data = data;
        this.params = params;
        this.size = size;
    }
}
class DecodeLogTopicsMismatch extends BaseError {
    constructor({ abiItem, param, }) {
        super([
            `Expected a topic for indexed event parameter${param.name ? ` "${param.name}"` : ''} on event "${formatAbiItem(abiItem, { includeName: true })}".`,
        ].join('\n'), { name: 'DecodeLogTopicsMismatch' });
        Object.defineProperty(this, "abiItem", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.abiItem = abiItem;
    }
}
class InvalidAbiEncodingTypeError extends BaseError {
    constructor(type, { docsPath }) {
        super([
            `Type "${type}" is not a valid encoding type.`,
            'Please provide a valid ABI type.',
        ].join('\n'), { docsPath, name: 'InvalidAbiEncodingType' });
    }
}
class InvalidAbiDecodingTypeError extends BaseError {
    constructor(type, { docsPath }) {
        super([
            `Type "${type}" is not a valid decoding type.`,
            'Please provide a valid ABI type.',
        ].join('\n'), { docsPath, name: 'InvalidAbiDecodingType' });
    }
}
class InvalidArrayError extends BaseError {
    constructor(value) {
        super([`Value "${value}" is not a valid array.`].join('\n'), {
            name: 'InvalidArrayError',
        });
    }
}
class InvalidDefinitionTypeError extends BaseError {
    constructor(type) {
        super([
            `"${type}" is not a valid definition type.`,
            'Valid types: "function", "event", "error"',
        ].join('\n'), { name: 'InvalidDefinitionTypeError' });
    }
}

function concat(values) {
    if (typeof values[0] === 'string')
        return concatHex(values);
    return concatBytes(values);
}
function concatBytes(values) {
    let length = 0;
    for (const arr of values) {
        length += arr.length;
    }
    const result = new Uint8Array(length);
    let offset = 0;
    for (const arr of values) {
        result.set(arr, offset);
        offset += arr.length;
    }
    return result;
}
function concatHex(values) {
    return `0x${values.reduce((acc, x) => acc + x.replace('0x', ''), '')}`;
}

/**
 * @description Returns a section of the hex or byte array given a start/end bytes offset.
 *
 * @param value The hex or byte array to slice.
 * @param start The start offset (in bytes).
 * @param end The end offset (in bytes).
 */
function slice(value, start, end, { strict } = {}) {
    if (isHex(value, { strict: false }))
        return sliceHex(value, start, end, {
            strict,
        });
    return sliceBytes(value, start, end, {
        strict,
    });
}
function assertStartOffset(value, start) {
    if (typeof start === 'number' && start > 0 && start > size(value) - 1)
        throw new SliceOffsetOutOfBoundsError({
            offset: start,
            position: 'start',
            size: size(value),
        });
}
function assertEndOffset(value, start, end) {
    if (typeof start === 'number' &&
        typeof end === 'number' &&
        size(value) !== end - start) {
        throw new SliceOffsetOutOfBoundsError({
            offset: end,
            position: 'end',
            size: size(value),
        });
    }
}
/**
 * @description Returns a section of the byte array given a start/end bytes offset.
 *
 * @param value The byte array to slice.
 * @param start The start offset (in bytes).
 * @param end The end offset (in bytes).
 */
function sliceBytes(value_, start, end, { strict } = {}) {
    assertStartOffset(value_, start);
    const value = value_.slice(start, end);
    if (strict)
        assertEndOffset(value, start, end);
    return value;
}
/**
 * @description Returns a section of the hex value given a start/end bytes offset.
 *
 * @param value The hex value to slice.
 * @param start The start offset (in bytes).
 * @param end The end offset (in bytes).
 */
function sliceHex(value_, start, end, { strict } = {}) {
    assertStartOffset(value_, start);
    const value = `0x${value_
        .replace('0x', '')
        .slice((start ?? 0) * 2, (end ?? value_.length) * 2)}`;
    if (strict)
        assertEndOffset(value, start, end);
    return value;
}

// `bytes<M>`: binary type of `M` bytes, `0 < M <= 32`
// https://regexr.com/6va55
const bytesRegex = /^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/;
// `(u)int<M>`: (un)signed integer type of `M` bits, `0 < M <= 256`, `M % 8 == 0`
// https://regexr.com/6v8hp
const integerRegex = /^(u?int)(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/;

/**
 * @description Encodes a list of primitive values into an ABI-encoded hex value.
 *
 * - Docs: https://viem.sh/docs/abi/encodeAbiParameters#encodeabiparameters
 *
 *   Generates ABI encoded data using the [ABI specification](https://docs.soliditylang.org/en/latest/abi-spec), given a set of ABI parameters (inputs/outputs) and their corresponding values.
 *
 * @param params - a set of ABI Parameters (params), that can be in the shape of the inputs or outputs attribute of an ABI Item.
 * @param values - a set of values (values) that correspond to the given params.
 * @example
 * ```typescript
 * import { encodeAbiParameters } from 'viem'
 *
 * const encodedData = encodeAbiParameters(
 *   [
 *     { name: 'x', type: 'string' },
 *     { name: 'y', type: 'uint' },
 *     { name: 'z', type: 'bool' }
 *   ],
 *   ['wagmi', 420n, true]
 * )
 * ```
 *
 * You can also pass in Human Readable parameters with the parseAbiParameters utility.
 *
 * @example
 * ```typescript
 * import { encodeAbiParameters, parseAbiParameters } from 'viem'
 *
 * const encodedData = encodeAbiParameters(
 *   parseAbiParameters('string x, uint y, bool z'),
 *   ['wagmi', 420n, true]
 * )
 * ```
 */
function encodeAbiParameters(params, values) {
    if (params.length !== values.length)
        throw new AbiEncodingLengthMismatchError({
            expectedLength: params.length,
            givenLength: values.length,
        });
    // Prepare the parameters to determine dynamic types to encode.
    const preparedParams = prepareParams({
        params: params,
        values: values,
    });
    const data = encodeParams(preparedParams);
    if (data.length === 0)
        return '0x';
    return data;
}
function prepareParams({ params, values, }) {
    const preparedParams = [];
    for (let i = 0; i < params.length; i++) {
        preparedParams.push(prepareParam({ param: params[i], value: values[i] }));
    }
    return preparedParams;
}
function prepareParam({ param, value, }) {
    const arrayComponents = getArrayComponents(param.type);
    if (arrayComponents) {
        const [length, type] = arrayComponents;
        return encodeArray(value, { length, param: { ...param, type } });
    }
    if (param.type === 'tuple') {
        return encodeTuple(value, {
            param: param,
        });
    }
    if (param.type === 'address') {
        return encodeAddress(value);
    }
    if (param.type === 'bool') {
        return encodeBool(value);
    }
    if (param.type.startsWith('uint') || param.type.startsWith('int')) {
        const signed = param.type.startsWith('int');
        const [, , size = '256'] = integerRegex.exec(param.type) ?? [];
        return encodeNumber(value, {
            signed,
            size: Number(size),
        });
    }
    if (param.type.startsWith('bytes')) {
        return encodeBytes(value, { param });
    }
    if (param.type === 'string') {
        return encodeString(value);
    }
    throw new InvalidAbiEncodingTypeError(param.type, {
        docsPath: '/docs/contract/encodeAbiParameters',
    });
}
function encodeParams(preparedParams) {
    // 1. Compute the size of the static part of the parameters.
    let staticSize = 0;
    for (let i = 0; i < preparedParams.length; i++) {
        const { dynamic, encoded } = preparedParams[i];
        if (dynamic)
            staticSize += 32;
        else
            staticSize += size(encoded);
    }
    // 2. Split the parameters into static and dynamic parts.
    const staticParams = [];
    const dynamicParams = [];
    let dynamicSize = 0;
    for (let i = 0; i < preparedParams.length; i++) {
        const { dynamic, encoded } = preparedParams[i];
        if (dynamic) {
            staticParams.push(numberToHex(staticSize + dynamicSize, { size: 32 }));
            dynamicParams.push(encoded);
            dynamicSize += size(encoded);
        }
        else {
            staticParams.push(encoded);
        }
    }
    // 3. Concatenate static and dynamic parts.
    return concat([...staticParams, ...dynamicParams]);
}
function encodeAddress(value) {
    if (!isAddress(value))
        throw new InvalidAddressError({ address: value });
    return { dynamic: false, encoded: padHex(value.toLowerCase()) };
}
function encodeArray(value, { length, param, }) {
    const dynamic = length === null;
    if (!Array.isArray(value))
        throw new InvalidArrayError(value);
    if (!dynamic && value.length !== length)
        throw new AbiEncodingArrayLengthMismatchError({
            expectedLength: length,
            givenLength: value.length,
            type: `${param.type}[${length}]`,
        });
    let dynamicChild = false;
    const preparedParams = [];
    for (let i = 0; i < value.length; i++) {
        const preparedParam = prepareParam({ param, value: value[i] });
        if (preparedParam.dynamic)
            dynamicChild = true;
        preparedParams.push(preparedParam);
    }
    if (dynamic || dynamicChild) {
        const data = encodeParams(preparedParams);
        if (dynamic) {
            const length = numberToHex(preparedParams.length, { size: 32 });
            return {
                dynamic: true,
                encoded: preparedParams.length > 0 ? concat([length, data]) : length,
            };
        }
        if (dynamicChild)
            return { dynamic: true, encoded: data };
    }
    return {
        dynamic: false,
        encoded: concat(preparedParams.map(({ encoded }) => encoded)),
    };
}
function encodeBytes(value, { param }) {
    const [, paramSize] = param.type.split('bytes');
    const bytesSize = size(value);
    if (!paramSize) {
        let value_ = value;
        // If the size is not divisible by 32 bytes, pad the end
        // with empty bytes to the ceiling 32 bytes.
        if (bytesSize % 32 !== 0)
            value_ = padHex(value_, {
                dir: 'right',
                size: Math.ceil((value.length - 2) / 2 / 32) * 32,
            });
        return {
            dynamic: true,
            encoded: concat([padHex(numberToHex(bytesSize, { size: 32 })), value_]),
        };
    }
    if (bytesSize !== Number.parseInt(paramSize, 10))
        throw new AbiEncodingBytesSizeMismatchError({
            expectedSize: Number.parseInt(paramSize, 10),
            value,
        });
    return { dynamic: false, encoded: padHex(value, { dir: 'right' }) };
}
function encodeBool(value) {
    if (typeof value !== 'boolean')
        throw new BaseError(`Invalid boolean value: "${value}" (type: ${typeof value}). Expected: \`true\` or \`false\`.`);
    return { dynamic: false, encoded: padHex(boolToHex(value)) };
}
function encodeNumber(value, { signed, size = 256 }) {
    if (typeof size === 'number') {
        const max = 2n ** (BigInt(size) - (signed ? 1n : 0n)) - 1n;
        const min = signed ? -max - 1n : 0n;
        if (value > max || value < min)
            throw new IntegerOutOfRangeError({
                max: max.toString(),
                min: min.toString(),
                signed,
                size: size / 8,
                value: value.toString(),
            });
    }
    return {
        dynamic: false,
        encoded: numberToHex(value, {
            size: 32,
            signed,
        }),
    };
}
function encodeString(value) {
    const hexValue = stringToHex(value);
    const partsLength = Math.ceil(size(hexValue) / 32);
    const parts = [];
    for (let i = 0; i < partsLength; i++) {
        parts.push(padHex(slice(hexValue, i * 32, (i + 1) * 32), {
            dir: 'right',
        }));
    }
    return {
        dynamic: true,
        encoded: concat([
            padHex(numberToHex(size(hexValue), { size: 32 })),
            ...parts,
        ]),
    };
}
function encodeTuple(value, { param }) {
    let dynamic = false;
    const preparedParams = [];
    for (let i = 0; i < param.components.length; i++) {
        const param_ = param.components[i];
        const index = Array.isArray(value) ? i : param_.name;
        const preparedParam = prepareParam({
            param: param_,
            value: value[index],
        });
        preparedParams.push(preparedParam);
        if (preparedParam.dynamic)
            dynamic = true;
    }
    return {
        dynamic,
        encoded: dynamic
            ? encodeParams(preparedParams)
            : concat(preparedParams.map(({ encoded }) => encoded)),
    };
}
function getArrayComponents(type) {
    const matches = type.match(/^(.*)\[(\d+)?\]$/);
    return matches
        ? // Return `null` if the array is dynamic.
            [matches[2] ? Number(matches[2]) : null, matches[1]]
        : undefined;
}

class NegativeOffsetError extends BaseError {
    constructor({ offset }) {
        super(`Offset \`${offset}\` cannot be negative.`, {
            name: 'NegativeOffsetError',
        });
    }
}
class PositionOutOfBoundsError extends BaseError {
    constructor({ length, position }) {
        super(`Position \`${position}\` is out of bounds (\`0 < position < ${length}\`).`, { name: 'PositionOutOfBoundsError' });
    }
}
class RecursiveReadLimitExceededError extends BaseError {
    constructor({ count, limit }) {
        super(`Recursive read limit of \`${limit}\` exceeded (recursive read count: \`${count}\`).`, { name: 'RecursiveReadLimitExceededError' });
    }
}

const staticCursor = {
    bytes: new Uint8Array(),
    dataView: new DataView(new ArrayBuffer(0)),
    position: 0,
    positionReadCount: new Map(),
    recursiveReadCount: 0,
    recursiveReadLimit: Number.POSITIVE_INFINITY,
    assertReadLimit() {
        if (this.recursiveReadCount >= this.recursiveReadLimit)
            throw new RecursiveReadLimitExceededError({
                count: this.recursiveReadCount + 1,
                limit: this.recursiveReadLimit,
            });
    },
    assertPosition(position) {
        if (position < 0 || position > this.bytes.length - 1)
            throw new PositionOutOfBoundsError({
                length: this.bytes.length,
                position,
            });
    },
    decrementPosition(offset) {
        if (offset < 0)
            throw new NegativeOffsetError({ offset });
        const position = this.position - offset;
        this.assertPosition(position);
        this.position = position;
    },
    getReadCount(position) {
        return this.positionReadCount.get(position || this.position) || 0;
    },
    incrementPosition(offset) {
        if (offset < 0)
            throw new NegativeOffsetError({ offset });
        const position = this.position + offset;
        this.assertPosition(position);
        this.position = position;
    },
    inspectByte(position_) {
        const position = position_ ?? this.position;
        this.assertPosition(position);
        return this.bytes[position];
    },
    inspectBytes(length, position_) {
        const position = position_ ?? this.position;
        this.assertPosition(position + length - 1);
        return this.bytes.subarray(position, position + length);
    },
    inspectUint8(position_) {
        const position = position_ ?? this.position;
        this.assertPosition(position);
        return this.bytes[position];
    },
    inspectUint16(position_) {
        const position = position_ ?? this.position;
        this.assertPosition(position + 1);
        return this.dataView.getUint16(position);
    },
    inspectUint24(position_) {
        const position = position_ ?? this.position;
        this.assertPosition(position + 2);
        return ((this.dataView.getUint16(position) << 8) +
            this.dataView.getUint8(position + 2));
    },
    inspectUint32(position_) {
        const position = position_ ?? this.position;
        this.assertPosition(position + 3);
        return this.dataView.getUint32(position);
    },
    pushByte(byte) {
        this.assertPosition(this.position);
        this.bytes[this.position] = byte;
        this.position++;
    },
    pushBytes(bytes) {
        this.assertPosition(this.position + bytes.length - 1);
        this.bytes.set(bytes, this.position);
        this.position += bytes.length;
    },
    pushUint8(value) {
        this.assertPosition(this.position);
        this.bytes[this.position] = value;
        this.position++;
    },
    pushUint16(value) {
        this.assertPosition(this.position + 1);
        this.dataView.setUint16(this.position, value);
        this.position += 2;
    },
    pushUint24(value) {
        this.assertPosition(this.position + 2);
        this.dataView.setUint16(this.position, value >> 8);
        this.dataView.setUint8(this.position + 2, value & 255);
        this.position += 3;
    },
    pushUint32(value) {
        this.assertPosition(this.position + 3);
        this.dataView.setUint32(this.position, value);
        this.position += 4;
    },
    readByte() {
        this.assertReadLimit();
        this._touch();
        const value = this.inspectByte();
        this.position++;
        return value;
    },
    readBytes(length, size) {
        this.assertReadLimit();
        this._touch();
        const value = this.inspectBytes(length);
        this.position += size ?? length;
        return value;
    },
    readUint8() {
        this.assertReadLimit();
        this._touch();
        const value = this.inspectUint8();
        this.position += 1;
        return value;
    },
    readUint16() {
        this.assertReadLimit();
        this._touch();
        const value = this.inspectUint16();
        this.position += 2;
        return value;
    },
    readUint24() {
        this.assertReadLimit();
        this._touch();
        const value = this.inspectUint24();
        this.position += 3;
        return value;
    },
    readUint32() {
        this.assertReadLimit();
        this._touch();
        const value = this.inspectUint32();
        this.position += 4;
        return value;
    },
    get remaining() {
        return this.bytes.length - this.position;
    },
    setPosition(position) {
        const oldPosition = this.position;
        this.assertPosition(position);
        this.position = position;
        return () => (this.position = oldPosition);
    },
    _touch() {
        if (this.recursiveReadLimit === Number.POSITIVE_INFINITY)
            return;
        const count = this.getReadCount();
        this.positionReadCount.set(this.position, count + 1);
        if (count > 0)
            this.recursiveReadCount++;
    },
};
function createCursor(bytes, { recursiveReadLimit = 8_192 } = {}) {
    const cursor = Object.create(staticCursor);
    cursor.bytes = bytes;
    cursor.dataView = new DataView(bytes.buffer ?? bytes, bytes.byteOffset, bytes.byteLength);
    cursor.positionReadCount = new Map();
    cursor.recursiveReadLimit = recursiveReadLimit;
    return cursor;
}

const etherUnits = {
    gwei: 9,
    wei: 18,
};
const gweiUnits = {
    ether: -9,
    wei: 9,
};

/**
 *  Divides a number by a given exponent of base 10 (10exponent), and formats it into a string representation of the number..
 *
 * - Docs: https://viem.sh/docs/utilities/formatUnits
 *
 * @example
 * import { formatUnits } from 'viem'
 *
 * formatUnits(420000000000n, 9)
 * // '420'
 */
function formatUnits(value, decimals) {
    let display = value.toString();
    const negative = display.startsWith('-');
    if (negative)
        display = display.slice(1);
    display = display.padStart(decimals, '0');
    let [integer, fraction] = [
        display.slice(0, display.length - decimals),
        display.slice(display.length - decimals),
    ];
    fraction = fraction.replace(/(0+)$/, '');
    return `${negative ? '-' : ''}${integer || '0'}${fraction ? `.${fraction}` : ''}`;
}

/**
 * Converts numerical wei to a string representation of ether.
 *
 * - Docs: https://viem.sh/docs/utilities/formatEther
 *
 * @example
 * import { formatEther } from 'viem'
 *
 * formatEther(1000000000000000000n)
 * // '1'
 */
function formatEther(wei, unit = 'wei') {
    return formatUnits(wei, etherUnits[unit]);
}

/**
 * Converts numerical wei to a string representation of gwei.
 *
 * - Docs: https://viem.sh/docs/utilities/formatGwei
 *
 * @example
 * import { formatGwei } from 'viem'
 *
 * formatGwei(1000000000n)
 * // '1'
 */
function formatGwei(wei, unit = 'wei') {
    return formatUnits(wei, gweiUnits[unit]);
}

function prettyPrint(args) {
    const entries = Object.entries(args)
        .map(([key, value]) => {
        if (value === undefined || value === false)
            return null;
        return [key, value];
    })
        .filter(Boolean);
    const maxLength = entries.reduce((acc, [key]) => Math.max(acc, key.length), 0);
    return entries
        .map(([key, value]) => `  ${`${key}:`.padEnd(maxLength + 1)}  ${value}`)
        .join('\n');
}
class InvalidLegacyVError extends BaseError {
    constructor({ v }) {
        super(`Invalid \`v\` value "${v}". Expected 27 or 28.`, {
            name: 'InvalidLegacyVError',
        });
    }
}
class InvalidSerializableTransactionError extends BaseError {
    constructor({ transaction }) {
        super('Cannot infer a transaction type from provided transaction.', {
            metaMessages: [
                'Provided Transaction:',
                '{',
                prettyPrint(transaction),
                '}',
                '',
                'To infer the type, either provide:',
                '- a `type` to the Transaction, or',
                '- an EIP-1559 Transaction with `maxFeePerGas`, or',
                '- an EIP-2930 Transaction with `gasPrice` & `accessList`, or',
                '- an EIP-4844 Transaction with `blobs`, `blobVersionedHashes`, `sidecars`, or',
                '- an EIP-7702 Transaction with `authorizationList`, or',
                '- a Legacy Transaction with `gasPrice`',
            ],
            name: 'InvalidSerializableTransactionError',
        });
    }
}
class InvalidStorageKeySizeError extends BaseError {
    constructor({ storageKey }) {
        super(`Size for storage key "${storageKey}" is invalid. Expected 32 bytes. Got ${Math.floor((storageKey.length - 2) / 2)} bytes.`, { name: 'InvalidStorageKeySizeError' });
    }
}
class TransactionExecutionError extends BaseError {
    constructor(cause, { account, docsPath, chain, data, gas, gasPrice, maxFeePerGas, maxPriorityFeePerGas, nonce, to, value, }) {
        const prettyArgs = prettyPrint({
            chain: chain && `${chain?.name} (id: ${chain?.id})`,
            from: account?.address,
            to,
            value: typeof value !== 'undefined' &&
                `${formatEther(value)} ${chain?.nativeCurrency?.symbol || 'ETH'}`,
            data,
            gas,
            gasPrice: typeof gasPrice !== 'undefined' && `${formatGwei(gasPrice)} gwei`,
            maxFeePerGas: typeof maxFeePerGas !== 'undefined' &&
                `${formatGwei(maxFeePerGas)} gwei`,
            maxPriorityFeePerGas: typeof maxPriorityFeePerGas !== 'undefined' &&
                `${formatGwei(maxPriorityFeePerGas)} gwei`,
            nonce,
        });
        super(cause.shortMessage, {
            cause,
            docsPath,
            metaMessages: [
                ...(cause.metaMessages ? [...cause.metaMessages, ' '] : []),
                'Request Arguments:',
                prettyArgs,
            ].filter(Boolean),
            name: 'TransactionExecutionError',
        });
        Object.defineProperty(this, "cause", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.cause = cause;
    }
}
class TransactionNotFoundError extends BaseError {
    constructor({ blockHash, blockNumber, blockTag, hash, index, }) {
        let identifier = 'Transaction';
        if (blockTag && index !== undefined)
            identifier = `Transaction at block time "${blockTag}" at index "${index}"`;
        if (blockHash && index !== undefined)
            identifier = `Transaction at block hash "${blockHash}" at index "${index}"`;
        if (blockNumber && index !== undefined)
            identifier = `Transaction at block number "${blockNumber}" at index "${index}"`;
        if (hash)
            identifier = `Transaction with hash "${hash}"`;
        super(`${identifier} could not be found.`, {
            name: 'TransactionNotFoundError',
        });
    }
}
class TransactionReceiptNotFoundError extends BaseError {
    constructor({ hash }) {
        super(`Transaction receipt with hash "${hash}" could not be found. The Transaction may not be processed on a block yet.`, {
            name: 'TransactionReceiptNotFoundError',
        });
    }
}
class TransactionReceiptRevertedError extends BaseError {
    constructor({ receipt }) {
        super(`Transaction with hash "${receipt.transactionHash}" reverted.`, {
            metaMessages: [
                'The receipt marked the transaction as "reverted". This could mean that the function on the contract you are trying to call threw an error.',
                ' ',
                'You can attempt to extract the revert reason by:',
                '- calling the `simulateContract` or `simulateCalls` Action with the `abi` and `functionName` of the contract',
                '- using the `call` Action with raw `data`',
            ],
            name: 'TransactionReceiptRevertedError',
        });
        Object.defineProperty(this, "receipt", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.receipt = receipt;
    }
}
class WaitForTransactionReceiptTimeoutError extends BaseError {
    constructor({ hash }) {
        super(`Timed out while waiting for transaction with hash "${hash}" to be confirmed.`, { name: 'WaitForTransactionReceiptTimeoutError' });
    }
}

/**
 * @description Converts an ECDSA public key to an address.
 *
 * @param publicKey The public key to convert.
 *
 * @returns The address.
 */
function publicKeyToAddress(publicKey) {
    const address = keccak256(`0x${publicKey.substring(4)}`).substring(26);
    return checksumAddress(`0x${address}`);
}

function toRlp(bytes, to = 'hex') {
    const encodable = getEncodable(bytes);
    const cursor = createCursor(new Uint8Array(encodable.length));
    encodable.encode(cursor);
    if (to === 'hex')
        return bytesToHex(cursor.bytes);
    return cursor.bytes;
}
function getEncodable(bytes) {
    if (Array.isArray(bytes))
        return getEncodableList(bytes.map((x) => getEncodable(x)));
    return getEncodableBytes(bytes);
}
function getEncodableList(list) {
    const bodyLength = list.reduce((acc, x) => acc + x.length, 0);
    const sizeOfBodyLength = getSizeOfLength(bodyLength);
    const length = (() => {
        if (bodyLength <= 55)
            return 1 + bodyLength;
        return 1 + sizeOfBodyLength + bodyLength;
    })();
    return {
        length,
        encode(cursor) {
            if (bodyLength <= 55) {
                cursor.pushByte(0xc0 + bodyLength);
            }
            else {
                cursor.pushByte(0xc0 + 55 + sizeOfBodyLength);
                if (sizeOfBodyLength === 1)
                    cursor.pushUint8(bodyLength);
                else if (sizeOfBodyLength === 2)
                    cursor.pushUint16(bodyLength);
                else if (sizeOfBodyLength === 3)
                    cursor.pushUint24(bodyLength);
                else
                    cursor.pushUint32(bodyLength);
            }
            for (const { encode } of list) {
                encode(cursor);
            }
        },
    };
}
function getEncodableBytes(bytesOrHex) {
    const bytes = typeof bytesOrHex === 'string' ? hexToBytes(bytesOrHex) : bytesOrHex;
    const sizeOfBytesLength = getSizeOfLength(bytes.length);
    const length = (() => {
        if (bytes.length === 1 && bytes[0] < 0x80)
            return 1;
        if (bytes.length <= 55)
            return 1 + bytes.length;
        return 1 + sizeOfBytesLength + bytes.length;
    })();
    return {
        length,
        encode(cursor) {
            if (bytes.length === 1 && bytes[0] < 0x80) {
                cursor.pushBytes(bytes);
            }
            else if (bytes.length <= 55) {
                cursor.pushByte(0x80 + bytes.length);
                cursor.pushBytes(bytes);
            }
            else {
                cursor.pushByte(0x80 + 55 + sizeOfBytesLength);
                if (sizeOfBytesLength === 1)
                    cursor.pushUint8(bytes.length);
                else if (sizeOfBytesLength === 2)
                    cursor.pushUint16(bytes.length);
                else if (sizeOfBytesLength === 3)
                    cursor.pushUint24(bytes.length);
                else
                    cursor.pushUint32(bytes.length);
                cursor.pushBytes(bytes);
            }
        },
    };
}
function getSizeOfLength(length) {
    if (length < 2 ** 8)
        return 1;
    if (length < 2 ** 16)
        return 2;
    if (length < 2 ** 24)
        return 3;
    if (length < 2 ** 32)
        return 4;
    throw new BaseError('Length is too large.');
}

/**
 * Computes an Authorization hash in [EIP-7702 format](https://eips.ethereum.org/EIPS/eip-7702): `keccak256('0x05' || rlp([chain_id, address, nonce]))`.
 */
function hashAuthorization(parameters) {
    const { chainId, nonce, to } = parameters;
    const address = parameters.contractAddress ?? parameters.address;
    const hash = keccak256(concatHex([
        '0x05',
        toRlp([
            chainId ? numberToHex(chainId) : '0x',
            address,
            nonce ? numberToHex(nonce) : '0x',
        ]),
    ]));
    if (to === 'bytes')
        return hexToBytes(hash);
    return hash;
}

class ExecutionRevertedError extends BaseError {
    constructor({ cause, message, } = {}) {
        const reason = message
            ?.replace('execution reverted: ', '')
            ?.replace('execution reverted', '');
        super(`Execution reverted ${reason ? `with reason: ${reason}` : 'for an unknown reason'}.`, {
            cause,
            name: 'ExecutionRevertedError',
        });
    }
}
Object.defineProperty(ExecutionRevertedError, "code", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 3
});
Object.defineProperty(ExecutionRevertedError, "nodeMessage", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: /execution reverted|gas required exceeds allowance/
});
class FeeCapTooHighError extends BaseError {
    constructor({ cause, maxFeePerGas, } = {}) {
        super(`The fee cap (\`maxFeePerGas\`${maxFeePerGas ? ` = ${formatGwei(maxFeePerGas)} gwei` : ''}) cannot be higher than the maximum allowed value (2^256-1).`, {
            cause,
            name: 'FeeCapTooHighError',
        });
    }
}
Object.defineProperty(FeeCapTooHighError, "nodeMessage", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: /max fee per gas higher than 2\^256-1|fee cap higher than 2\^256-1/
});
class FeeCapTooLowError extends BaseError {
    constructor({ cause, maxFeePerGas, } = {}) {
        super(`The fee cap (\`maxFeePerGas\`${maxFeePerGas ? ` = ${formatGwei(maxFeePerGas)}` : ''} gwei) cannot be lower than the block base fee.`, {
            cause,
            name: 'FeeCapTooLowError',
        });
    }
}
Object.defineProperty(FeeCapTooLowError, "nodeMessage", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: /max fee per gas less than block base fee|fee cap less than block base fee|transaction is outdated/
});
class NonceTooHighError extends BaseError {
    constructor({ cause, nonce, } = {}) {
        super(`Nonce provided for the transaction ${nonce ? `(${nonce}) ` : ''}is higher than the next one expected.`, { cause, name: 'NonceTooHighError' });
    }
}
Object.defineProperty(NonceTooHighError, "nodeMessage", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: /nonce too high/
});
class NonceTooLowError extends BaseError {
    constructor({ cause, nonce, } = {}) {
        super([
            `Nonce provided for the transaction ${nonce ? `(${nonce}) ` : ''}is lower than the current nonce of the account.`,
            'Try increasing the nonce or find the latest nonce with `getTransactionCount`.',
        ].join('\n'), { cause, name: 'NonceTooLowError' });
    }
}
Object.defineProperty(NonceTooLowError, "nodeMessage", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: /nonce too low|transaction already imported|already known/
});
class NonceMaxValueError extends BaseError {
    constructor({ cause, nonce, } = {}) {
        super(`Nonce provided for the transaction ${nonce ? `(${nonce}) ` : ''}exceeds the maximum allowed nonce.`, { cause, name: 'NonceMaxValueError' });
    }
}
Object.defineProperty(NonceMaxValueError, "nodeMessage", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: /nonce has max value/
});
class InsufficientFundsError extends BaseError {
    constructor({ cause } = {}) {
        super([
            'The total cost (gas * gas fee + value) of executing this transaction exceeds the balance of the account.',
        ].join('\n'), {
            cause,
            metaMessages: [
                'This error could arise when the account does not have enough funds to:',
                ' - pay for the total gas fee,',
                ' - pay for the value to send.',
                ' ',
                'The cost of the transaction is calculated as `gas * gas fee + value`, where:',
                ' - `gas` is the amount of gas needed for transaction to execute,',
                ' - `gas fee` is the gas fee,',
                ' - `value` is the amount of ether to send to the recipient.',
            ],
            name: 'InsufficientFundsError',
        });
    }
}
Object.defineProperty(InsufficientFundsError, "nodeMessage", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: /insufficient funds|exceeds transaction sender account balance/
});
class IntrinsicGasTooHighError extends BaseError {
    constructor({ cause, gas, } = {}) {
        super(`The amount of gas ${gas ? `(${gas}) ` : ''}provided for the transaction exceeds the limit allowed for the block.`, {
            cause,
            name: 'IntrinsicGasTooHighError',
        });
    }
}
Object.defineProperty(IntrinsicGasTooHighError, "nodeMessage", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: /intrinsic gas too high|gas limit reached/
});
class IntrinsicGasTooLowError extends BaseError {
    constructor({ cause, gas, } = {}) {
        super(`The amount of gas ${gas ? `(${gas}) ` : ''}provided for the transaction is too low.`, {
            cause,
            name: 'IntrinsicGasTooLowError',
        });
    }
}
Object.defineProperty(IntrinsicGasTooLowError, "nodeMessage", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: /intrinsic gas too low/
});
class TransactionTypeNotSupportedError extends BaseError {
    constructor({ cause }) {
        super('The transaction type is not supported for this chain.', {
            cause,
            name: 'TransactionTypeNotSupportedError',
        });
    }
}
Object.defineProperty(TransactionTypeNotSupportedError, "nodeMessage", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: /transaction type not valid/
});
class TipAboveFeeCapError extends BaseError {
    constructor({ cause, maxPriorityFeePerGas, maxFeePerGas, } = {}) {
        super([
            `The provided tip (\`maxPriorityFeePerGas\`${maxPriorityFeePerGas
                ? ` = ${formatGwei(maxPriorityFeePerGas)} gwei`
                : ''}) cannot be higher than the fee cap (\`maxFeePerGas\`${maxFeePerGas ? ` = ${formatGwei(maxFeePerGas)} gwei` : ''}).`,
        ].join('\n'), {
            cause,
            name: 'TipAboveFeeCapError',
        });
    }
}
Object.defineProperty(TipAboveFeeCapError, "nodeMessage", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: /max priority fee per gas higher than max fee per gas|tip higher than fee cap/
});
class UnknownNodeError extends BaseError {
    constructor({ cause }) {
        super(`An error occurred while executing: ${cause?.shortMessage}`, {
            cause,
            name: 'UnknownNodeError',
        });
    }
}

const maxUint256 = 2n ** 256n - 1n;

/**
 * Compute commitments from a list of blobs.
 *
 * @example
 * ```ts
 * import { blobsToCommitments, toBlobs } from 'viem'
 * import { kzg } from './kzg'
 *
 * const blobs = toBlobs({ data: '0x1234' })
 * const commitments = blobsToCommitments({ blobs, kzg })
 * ```
 */
function blobsToCommitments(parameters) {
    const { kzg } = parameters;
    const to = parameters.to ?? (typeof parameters.blobs[0] === 'string' ? 'hex' : 'bytes');
    const blobs = (typeof parameters.blobs[0] === 'string'
        ? parameters.blobs.map((x) => hexToBytes(x))
        : parameters.blobs);
    const commitments = [];
    for (const blob of blobs)
        commitments.push(Uint8Array.from(kzg.blobToKzgCommitment(blob)));
    return (to === 'bytes'
        ? commitments
        : commitments.map((x) => bytesToHex(x)));
}

/**
 * Compute the proofs for a list of blobs and their commitments.
 *
 * @example
 * ```ts
 * import {
 *   blobsToCommitments,
 *   toBlobs
 * } from 'viem'
 * import { kzg } from './kzg'
 *
 * const blobs = toBlobs({ data: '0x1234' })
 * const commitments = blobsToCommitments({ blobs, kzg })
 * const proofs = blobsToProofs({ blobs, commitments, kzg })
 * ```
 */
function blobsToProofs(parameters) {
    const { kzg } = parameters;
    const to = parameters.to ?? (typeof parameters.blobs[0] === 'string' ? 'hex' : 'bytes');
    const blobs = (typeof parameters.blobs[0] === 'string'
        ? parameters.blobs.map((x) => hexToBytes(x))
        : parameters.blobs);
    const commitments = (typeof parameters.commitments[0] === 'string'
        ? parameters.commitments.map((x) => hexToBytes(x))
        : parameters.commitments);
    const proofs = [];
    for (let i = 0; i < blobs.length; i++) {
        const blob = blobs[i];
        const commitment = commitments[i];
        proofs.push(Uint8Array.from(kzg.computeBlobKzgProof(blob, commitment)));
    }
    return (to === 'bytes'
        ? proofs
        : proofs.map((x) => bytesToHex(x)));
}

/**
 * SHA2-256 a.k.a. sha256. In JS, it is the fastest hash, even faster than Blake3.
 *
 * To break sha256 using birthday attack, attackers need to try 2^128 hashes.
 * BTC network is doing 2^70 hashes/sec (2^95 hashes/year) as per 2025.
 *
 * Check out [FIPS 180-4](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf).
 * @module
 * @deprecated
 */
/** @deprecated Use import from `noble/hashes/sha2` module */
const sha256$1 = sha256$2;

function sha256(value, to_) {
    const bytes = sha256$1(isHex(value, { strict: false }) ? toBytes(value) : value);
    return bytes;
}

/**
 * Transform a commitment to it's versioned hash.
 *
 * @example
 * ```ts
 * import {
 *   blobsToCommitments,
 *   commitmentToVersionedHash,
 *   toBlobs
 * } from 'viem'
 * import { kzg } from './kzg'
 *
 * const blobs = toBlobs({ data: '0x1234' })
 * const [commitment] = blobsToCommitments({ blobs, kzg })
 * const versionedHash = commitmentToVersionedHash({ commitment })
 * ```
 */
function commitmentToVersionedHash(parameters) {
    const { commitment, version = 1 } = parameters;
    const to = parameters.to ?? (typeof commitment === 'string' ? 'hex' : 'bytes');
    const versionedHash = sha256(commitment);
    versionedHash.set([version], 0);
    return (to === 'bytes' ? versionedHash : bytesToHex(versionedHash));
}

/**
 * Transform a list of commitments to their versioned hashes.
 *
 * @example
 * ```ts
 * import {
 *   blobsToCommitments,
 *   commitmentsToVersionedHashes,
 *   toBlobs
 * } from 'viem'
 * import { kzg } from './kzg'
 *
 * const blobs = toBlobs({ data: '0x1234' })
 * const commitments = blobsToCommitments({ blobs, kzg })
 * const versionedHashes = commitmentsToVersionedHashes({ commitments })
 * ```
 */
function commitmentsToVersionedHashes(parameters) {
    const { commitments, version } = parameters;
    const to = parameters.to ?? (typeof commitments[0] === 'string' ? 'hex' : 'bytes');
    const hashes = [];
    for (const commitment of commitments) {
        hashes.push(commitmentToVersionedHash({
            commitment,
            to,
            version,
        }));
    }
    return hashes;
}

// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-4844.md#parameters
/** Blob limit per transaction. */
const blobsPerTransaction = 6;
/** The number of bytes in a BLS scalar field element. */
const bytesPerFieldElement = 32;
/** The number of field elements in a blob. */
const fieldElementsPerBlob = 4096;
/** The number of bytes in a blob. */
const bytesPerBlob = bytesPerFieldElement * fieldElementsPerBlob;
/** Blob bytes limit per transaction. */
const maxBytesPerTransaction = bytesPerBlob * blobsPerTransaction -
    // terminator byte (0x80).
    1 -
    // zero byte (0x00) appended to each field element.
    1 * fieldElementsPerBlob * blobsPerTransaction;

// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-4844.md#parameters
const versionedHashVersionKzg = 1;

class BlobSizeTooLargeError extends BaseError {
    constructor({ maxSize, size }) {
        super('Blob size is too large.', {
            metaMessages: [`Max: ${maxSize} bytes`, `Given: ${size} bytes`],
            name: 'BlobSizeTooLargeError',
        });
    }
}
class EmptyBlobError extends BaseError {
    constructor() {
        super('Blob data must not be empty.', { name: 'EmptyBlobError' });
    }
}
class InvalidVersionedHashSizeError extends BaseError {
    constructor({ hash, size, }) {
        super(`Versioned hash "${hash}" size is invalid.`, {
            metaMessages: ['Expected: 32', `Received: ${size}`],
            name: 'InvalidVersionedHashSizeError',
        });
    }
}
class InvalidVersionedHashVersionError extends BaseError {
    constructor({ hash, version, }) {
        super(`Versioned hash "${hash}" version is invalid.`, {
            metaMessages: [
                `Expected: ${versionedHashVersionKzg}`,
                `Received: ${version}`,
            ],
            name: 'InvalidVersionedHashVersionError',
        });
    }
}

/**
 * Transforms arbitrary data to blobs.
 *
 * @example
 * ```ts
 * import { toBlobs, stringToHex } from 'viem'
 *
 * const blobs = toBlobs({ data: stringToHex('hello world') })
 * ```
 */
function toBlobs(parameters) {
    const to = parameters.to ?? (typeof parameters.data === 'string' ? 'hex' : 'bytes');
    const data = (typeof parameters.data === 'string'
        ? hexToBytes(parameters.data)
        : parameters.data);
    const size_ = size(data);
    if (!size_)
        throw new EmptyBlobError();
    if (size_ > maxBytesPerTransaction)
        throw new BlobSizeTooLargeError({
            maxSize: maxBytesPerTransaction,
            size: size_,
        });
    const blobs = [];
    let active = true;
    let position = 0;
    while (active) {
        const blob = createCursor(new Uint8Array(bytesPerBlob));
        let size = 0;
        while (size < fieldElementsPerBlob) {
            const bytes = data.slice(position, position + (bytesPerFieldElement - 1));
            // Push a zero byte so the field element doesn't overflow the BLS modulus.
            blob.pushByte(0x00);
            // Push the current segment of data bytes.
            blob.pushBytes(bytes);
            // If we detect that the current segment of data bytes is less than 31 bytes,
            // we can stop processing and push a terminator byte to indicate the end of the blob.
            if (bytes.length < 31) {
                blob.pushByte(0x80);
                active = false;
                break;
            }
            size++;
            position += 31;
        }
        blobs.push(blob);
    }
    return (to === 'bytes'
        ? blobs.map((x) => x.bytes)
        : blobs.map((x) => bytesToHex(x.bytes)));
}

/**
 * Transforms arbitrary data (or blobs, commitments, & proofs) into a sidecar array.
 *
 * @example
 * ```ts
 * import { toBlobSidecars, stringToHex } from 'viem'
 *
 * const sidecars = toBlobSidecars({ data: stringToHex('hello world') })
 * ```
 *
 * @example
 * ```ts
 * import {
 *   blobsToCommitments,
 *   toBlobs,
 *   blobsToProofs,
 *   toBlobSidecars,
 *   stringToHex
 * } from 'viem'
 *
 * const blobs = toBlobs({ data: stringToHex('hello world') })
 * const commitments = blobsToCommitments({ blobs, kzg })
 * const proofs = blobsToProofs({ blobs, commitments, kzg })
 *
 * const sidecars = toBlobSidecars({ blobs, commitments, proofs })
 * ```
 */
function toBlobSidecars(parameters) {
    const { data, kzg, to } = parameters;
    const blobs = parameters.blobs ?? toBlobs({ data: data, to });
    const commitments = parameters.commitments ?? blobsToCommitments({ blobs, kzg: kzg, to });
    const proofs = parameters.proofs ?? blobsToProofs({ blobs, commitments, kzg: kzg, to });
    const sidecars = [];
    for (let i = 0; i < blobs.length; i++)
        sidecars.push({
            blob: blobs[i],
            commitment: commitments[i],
            proof: proofs[i],
        });
    return sidecars;
}

function getTransactionType(transaction) {
    if (transaction.type)
        return transaction.type;
    if (typeof transaction.authorizationList !== 'undefined')
        return 'eip7702';
    if (typeof transaction.blobs !== 'undefined' ||
        typeof transaction.blobVersionedHashes !== 'undefined' ||
        typeof transaction.maxFeePerBlobGas !== 'undefined' ||
        typeof transaction.sidecars !== 'undefined')
        return 'eip4844';
    if (typeof transaction.maxFeePerGas !== 'undefined' ||
        typeof transaction.maxPriorityFeePerGas !== 'undefined') {
        return 'eip1559';
    }
    if (typeof transaction.gasPrice !== 'undefined') {
        if (typeof transaction.accessList !== 'undefined')
            return 'eip2930';
        return 'legacy';
    }
    throw new InvalidSerializableTransactionError({ transaction });
}

class ChainDoesNotSupportContract extends BaseError {
    constructor({ blockNumber, chain, contract, }) {
        super(`Chain "${chain.name}" does not support contract "${contract.name}".`, {
            metaMessages: [
                'This could be due to any of the following:',
                ...(blockNumber &&
                    contract.blockCreated &&
                    contract.blockCreated > blockNumber
                    ? [
                        `- The contract "${contract.name}" was not deployed until block ${contract.blockCreated} (current block ${blockNumber}).`,
                    ]
                    : [
                        `- The chain does not have the contract "${contract.name}" configured.`,
                    ]),
            ],
            name: 'ChainDoesNotSupportContract',
        });
    }
}
class ChainMismatchError extends BaseError {
    constructor({ chain, currentChainId, }) {
        super(`The current chain of the wallet (id: ${currentChainId}) does not match the target chain for the transaction (id: ${chain.id} – ${chain.name}).`, {
            metaMessages: [
                `Current Chain ID:  ${currentChainId}`,
                `Expected Chain ID: ${chain.id} – ${chain.name}`,
            ],
            name: 'ChainMismatchError',
        });
    }
}
class ChainNotFoundError extends BaseError {
    constructor() {
        super([
            'No chain was provided to the request.',
            'Please provide a chain with the `chain` argument on the Action, or by supplying a `chain` to WalletClient.',
        ].join('\n'), {
            name: 'ChainNotFoundError',
        });
    }
}
class ClientChainNotConfiguredError extends BaseError {
    constructor() {
        super('No chain was provided to the Client.', {
            name: 'ClientChainNotConfiguredError',
        });
    }
}
class InvalidChainIdError extends BaseError {
    constructor({ chainId }) {
        super(typeof chainId === 'number'
            ? `Chain ID "${chainId}" is invalid.`
            : 'Chain ID is invalid.', { name: 'InvalidChainIdError' });
    }
}

export { blobsToCommitments as $, AbiConstructorNotFoundError as A, BytesSizeMismatchError as B, ChainDoesNotSupportContract as C, DecodeLogDataMismatch as D, EmptyBlobError as E, FeeCapTooHighError as F, InvalidArrayError as G, InvalidChainIdError as H, InsufficientFundsError as I, InvalidDefinitionTypeError as J, InvalidLegacyVError as K, InvalidSerializableTransactionError as L, InvalidStorageKeySizeError as M, InvalidVersionedHashSizeError as N, InvalidVersionedHashVersionError as O, NonceMaxValueError as P, NonceTooHighError as Q, NonceTooLowError as R, PositionOutOfBoundsError as S, TipAboveFeeCapError as T, TransactionExecutionError as U, TransactionNotFoundError as V, TransactionReceiptNotFoundError as W, TransactionReceiptRevertedError as X, TransactionTypeNotSupportedError as Y, UnknownNodeError as Z, WaitForTransactionReceiptTimeoutError as _, AbiConstructorParamsNotFoundError as a, blobsToProofs as a0, bytesRegex as a1, commitmentToVersionedHash as a2, commitmentsToVersionedHashes as a3, concat as a4, concatBytes as a5, concatHex as a6, createCursor as a7, encodeAbiParameters as a8, etherUnits as a9, formatAbiItem as aa, formatEther as ab, formatGwei as ac, formatUnits as ad, getArrayComponents as ae, getTransactionType as af, gweiUnits as ag, hashAuthorization as ah, integerRegex as ai, maxUint256 as aj, prettyPrint as ak, publicKeyToAddress as al, sha256 as am, slice as an, sliceBytes as ao, sliceHex as ap, toBlobSidecars as aq, toBlobs as ar, toRlp as as, versionedHashVersionKzg as at, AbiDecodingDataSizeTooSmallError as b, AbiDecodingZeroDataError as c, AbiEncodingArrayLengthMismatchError as d, AbiEncodingBytesSizeMismatchError as e, AbiEncodingLengthMismatchError as f, AbiErrorInputsNotFoundError as g, AbiErrorNotFoundError as h, AbiErrorSignatureNotFoundError as i, AbiEventNotFoundError as j, AbiEventSignatureEmptyTopicsError as k, AbiEventSignatureNotFoundError as l, AbiFunctionNotFoundError as m, AbiFunctionOutputsNotFoundError as n, AbiFunctionSignatureNotFoundError as o, AbiItemAmbiguityError as p, ChainMismatchError as q, ChainNotFoundError as r, ClientChainNotConfiguredError as s, DecodeLogTopicsMismatch as t, ExecutionRevertedError as u, FeeCapTooLowError as v, IntrinsicGasTooHighError as w, IntrinsicGasTooLowError as x, InvalidAbiDecodingTypeError as y, InvalidAbiEncodingTypeError as z };
//# sourceMappingURL=chain-Bx4XJ_Uj.js.map
