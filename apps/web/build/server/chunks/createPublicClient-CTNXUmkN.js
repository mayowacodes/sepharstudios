import { F as wait, b as InvalidInputRpcError, G as withResolvers, K as withRetry, t as createClient } from './http-DCIt3x9N.js';
import { Y as getAbiItem, ar as toEventSelector, y as encodeFunctionData, Z as getAction, H as estimateGas, a2 as getContractError, r as decodeAbiParameters, a7 as isAddressEqual, j as assertSize$1, ab as padRight$1, B as BaseError$1, V as fromBytes$1, at as toNumber$1, aq as toBigInt$1, p as call, t as decodeFunctionResult, ax as transactionType, d as ContractFunctionRevertedError, a0 as getChainContractAddress, h as addressResolverAbi, ay as universalResolverResolveAbi, ae as readContract, ap as textResolverAbi, az as universalResolverReverseAbi, i as assertRequest, Q as formatTransactionRequest, K as extract$1, $ as getCallError, O as formatBlockParameter, a8 as multicall3Abi, b as BlockNotFoundError, ag as recoverAuthorizationAddress, al as size$2, W as fromNumber, q as concat$1, aa as padLeft, U as fromBoolean, I as IntegerOutOfRangeError, X as fromString$1, am as slice$2, ao as stringify$1, T as from$7, P as formatTransaction, a9 as multicall3Bytecode, R as RawContractError, au as toRpc, ak as serializeStateOverride, N as formatBlock, a4 as getNodeError, aA as validate$3, v as deploylessCallViaBytecodeBytecode, af as recoverAddress, x as encodeDeployData, C as CallExecutionError, z as erc1271Abi, c as ContractFunctionExecutionError, D as erc6492SignatureValidatorAbi, F as erc6492SignatureValidatorByteCode, _ as getBlock, aj as sendRawTransaction, ad as prepareTransactionRequest, a5 as getTransactionCount, L as fillTransaction, J as estimateMaxPriorityFeePerGas, a3 as getGasPrice, G as estimateFeesPerGas, a1 as getChainId } from './sendRawTransaction-C51V1yWv.js';
import { B as BaseError, s as keccak256$1, F as toBytes, v as numberToHex, z as parseAccount, A as size$1, E as stringify, p as hexToNumber, r as isHex, j as bytesToHex, C as stringToBytes, G as toHex, H as trim$1, l as getAddress, t as keccak_256, m as hexToBigInt, n as hexToBool, q as isAddress } from './stringify-CbXG6ciN.js';
import { b as localBatchGatewayUrl } from './localBatchGatewayRequest-Dfgi4jpN.js';
import { j as AbiEventNotFoundError, aa as formatAbiItem, a8 as encodeAbiParameters, k as AbiEventSignatureEmptyTopicsError, l as AbiEventSignatureNotFoundError, t as DecodeLogTopicsMismatch, b as AbiDecodingDataSizeTooSmallError, S as PositionOutOfBoundsError$1, D as DecodeLogDataMismatch, a4 as concat, an as slice$1, V as TransactionNotFoundError, W as TransactionReceiptNotFoundError, c as AbiDecodingZeroDataError, Z as UnknownNodeError, a6 as concatHex, _ as WaitForTransactionReceiptTimeoutError, X as TransactionReceiptRevertedError } from './chain-Bx4XJ_Uj.js';
import { a as parseAbiParameters, p as parseAbiItem } from './parseAbiParameters-quw_kf-z.js';
import { k as formatAbiParameters, j as formatAbiItem$1 } from './parseAbi-DF0R0BTC.js';
import { s as serializeSignature, c as hashMessage, e as hashTypedData } from './serializeSignature-D75oUNUr.js';

class FilterTypeNotSupportedError extends BaseError {
    constructor(type) {
        super(`Filter type "${type}" is not supported.`, {
            name: 'FilterTypeNotSupportedError',
        });
    }
}

const docsPath$1 = '/docs/contract/encodeEventTopics';
function encodeEventTopics(parameters) {
    const { abi, eventName, args } = parameters;
    let abiItem = abi[0];
    if (eventName) {
        const item = getAbiItem({ abi, name: eventName });
        if (!item)
            throw new AbiEventNotFoundError(eventName, { docsPath: docsPath$1 });
        abiItem = item;
    }
    if (abiItem.type !== 'event')
        throw new AbiEventNotFoundError(undefined, { docsPath: docsPath$1 });
    let topics = [];
    if (args && 'inputs' in abiItem) {
        const indexedInputs = abiItem.inputs?.filter((param) => 'indexed' in param && param.indexed);
        const args_ = Array.isArray(args)
            ? args
            : Object.values(args).length > 0
                ? (indexedInputs?.map((x) => args[x.name]) ?? [])
                : [];
        if (args_.length > 0) {
            topics =
                indexedInputs?.map((param, i) => {
                    if (Array.isArray(args_[i]))
                        return args_[i].map((_, j) => encodeArg({ param, value: args_[i][j] }));
                    return typeof args_[i] !== 'undefined' && args_[i] !== null
                        ? encodeArg({ param, value: args_[i] })
                        : null;
                }) ?? [];
        }
    }
    // Anonymous events are not identified by a signature topic, so the event
    // selector must not be prepended.
    if (abiItem.anonymous)
        return topics;
    const definition = formatAbiItem(abiItem);
    const signature = toEventSelector(definition);
    return [signature, ...topics];
}
function encodeArg({ param, value, }) {
    if (param.type === 'string' || param.type === 'bytes')
        return keccak256$1(toBytes(value));
    if (param.type === 'tuple' || param.type.match(/^(.*)\[(\d+)?\]$/))
        throw new FilterTypeNotSupportedError(param.type);
    return encodeAbiParameters([param], [value]);
}

/**
 * Scopes `request` to the filter ID. If the client is a fallback, it will
 * listen for responses and scope the child transport `request` function
 * to the successful filter ID.
 */
function createFilterRequestScope(client, { method }) {
    const requestMap = {};
    if (client.transport.type === 'fallback')
        client.transport.onResponse?.(({ method: method_, response: id, status, transport, }) => {
            if (status === 'success' && method === method_)
                requestMap[id] = transport.request;
        });
    return ((id) => requestMap[id] || client.request);
}

/**
 * Creates a Filter to retrieve event logs that can be used with [`getFilterChanges`](https://viem.sh/docs/actions/public/getFilterChanges) or [`getFilterLogs`](https://viem.sh/docs/actions/public/getFilterLogs).
 *
 * - Docs: https://viem.sh/docs/contract/createContractEventFilter
 *
 * @param client - Client to use
 * @param parameters - {@link CreateContractEventFilterParameters}
 * @returns [`Filter`](https://viem.sh/docs/glossary/types#filter). {@link CreateContractEventFilterReturnType}
 *
 * @example
 * import { createPublicClient, http, parseAbi } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { createContractEventFilter } from 'viem/contract'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const filter = await createContractEventFilter(client, {
 *   abi: parseAbi(['event Transfer(address indexed, address indexed, uint256)']),
 * })
 */
async function createContractEventFilter(client, parameters) {
    const { address, abi, args, eventName, fromBlock, strict, toBlock } = parameters;
    const getRequest = createFilterRequestScope(client, {
        method: 'eth_newFilter',
    });
    const topics = eventName
        ? encodeEventTopics({
            abi,
            args,
            eventName,
        })
        : undefined;
    const id = await client.request({
        method: 'eth_newFilter',
        params: [
            {
                address,
                fromBlock: typeof fromBlock === 'bigint' ? numberToHex(fromBlock) : fromBlock,
                toBlock: typeof toBlock === 'bigint' ? numberToHex(toBlock) : toBlock,
                topics,
            },
        ],
    });
    return {
        abi,
        args,
        eventName,
        id,
        request: getRequest(id),
        strict: Boolean(strict),
        type: 'event',
    };
}

/**
 * Estimates the gas required to successfully execute a contract write function call.
 *
 * - Docs: https://viem.sh/docs/contract/estimateContractGas
 *
 * Internally, uses a [Public Client](https://viem.sh/docs/clients/public) to call the [`estimateGas` action](https://viem.sh/docs/actions/public/estimateGas) with [ABI-encoded `data`](https://viem.sh/docs/contract/encodeFunctionData).
 *
 * @param client - Client to use
 * @param parameters - {@link EstimateContractGasParameters}
 * @returns The gas estimate (in wei). {@link EstimateContractGasReturnType}
 *
 * @example
 * import { createPublicClient, http, parseAbi } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { estimateContractGas } from 'viem/contract'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const gas = await estimateContractGas(client, {
 *   address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
 *   abi: parseAbi(['function mint() public']),
 *   functionName: 'mint',
 *   account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
 * })
 */
async function estimateContractGas(client, parameters) {
    const { abi, address, args, functionName, dataSuffix = typeof client.dataSuffix === 'string'
        ? client.dataSuffix
        : client.dataSuffix?.value, ...request } = parameters;
    const data = encodeFunctionData({
        abi,
        args,
        functionName,
    });
    try {
        const gas = await getAction(client, estimateGas, 'estimateGas')({
            data: `${data}${dataSuffix ? dataSuffix.replace('0x', '') : ''}`,
            to: address,
            ...request,
        });
        return gas;
    }
    catch (error) {
        const account = request.account ? parseAccount(request.account) : undefined;
        throw getContractError(error, {
            abi,
            address,
            args,
            docsPath: '/docs/contract/estimateContractGas',
            functionName,
            sender: account?.address,
        });
    }
}

function formatLog(log, { args, eventName, } = {}) {
    return {
        ...log,
        blockHash: log.blockHash ? log.blockHash : null,
        blockNumber: log.blockNumber ? BigInt(log.blockNumber) : null,
        blockTimestamp: log.blockTimestamp
            ? BigInt(log.blockTimestamp)
            : log.blockTimestamp === null
                ? null
                : undefined,
        logIndex: log.logIndex ? Number(log.logIndex) : null,
        transactionHash: log.transactionHash ? log.transactionHash : null,
        transactionIndex: log.transactionIndex
            ? Number(log.transactionIndex)
            : null,
        ...(eventName ? { args, eventName } : {}),
    };
}

const docsPath = '/docs/contract/decodeEventLog';
function decodeEventLog(parameters) {
    const { abi, data, strict: strict_, topics, } = parameters;
    const strict = strict_ ?? true;
    const [signature, ...argTopics] = topics;
    if (!signature)
        throw new AbiEventSignatureEmptyTopicsError({ docsPath });
    const abiItem = abi.find((x) => x.type === 'event' &&
        signature === toEventSelector(formatAbiItem(x)));
    if (!(abiItem && 'name' in abiItem) || abiItem.type !== 'event')
        throw new AbiEventSignatureNotFoundError(signature, { docsPath });
    const { name, inputs } = abiItem;
    const isUnnamed = inputs?.some((x) => !('name' in x && x.name));
    const args = isUnnamed ? [] : {};
    // Decode topics (indexed args).
    const indexedInputs = inputs
        .map((x, i) => [x, i])
        .filter(([x]) => 'indexed' in x && x.indexed);
    const missingIndexedInputs = [];
    for (let i = 0; i < indexedInputs.length; i++) {
        const [param, argIndex] = indexedInputs[i];
        const topic = argTopics[i];
        if (!topic) {
            if (strict)
                throw new DecodeLogTopicsMismatch({
                    abiItem,
                    param: param,
                });
            // Track missing indexed inputs to decode from data when strict is false
            missingIndexedInputs.push([param, argIndex]);
            continue;
        }
        args[isUnnamed ? argIndex : param.name || argIndex] = decodeTopic({
            param,
            value: topic,
        });
    }
    // Decode data (non-indexed args + missing indexed args when strict is false).
    const nonIndexedInputs = inputs.filter((x) => !('indexed' in x && x.indexed));
    // When strict is false, missing indexed inputs should be decoded from data
    const inputsToDecode = strict
        ? nonIndexedInputs
        : [...missingIndexedInputs.map(([param]) => param), ...nonIndexedInputs];
    if (inputsToDecode.length > 0) {
        if (data && data !== '0x') {
            try {
                const decodedData = decodeAbiParameters(inputsToDecode, data);
                if (decodedData) {
                    let dataIndex = 0;
                    // First, assign missing indexed parameters (when strict is false)
                    if (!strict) {
                        for (const [param, argIndex] of missingIndexedInputs) {
                            args[isUnnamed ? argIndex : param.name || argIndex] =
                                decodedData[dataIndex++];
                        }
                    }
                    // Then, assign non-indexed parameters
                    if (isUnnamed) {
                        for (let i = 0; i < inputs.length; i++)
                            if (args[i] === undefined && dataIndex < decodedData.length)
                                args[i] = decodedData[dataIndex++];
                    }
                    else
                        for (let i = 0; i < nonIndexedInputs.length; i++)
                            args[nonIndexedInputs[i].name] = decodedData[dataIndex++];
                }
            }
            catch (err) {
                if (strict) {
                    if (err instanceof AbiDecodingDataSizeTooSmallError ||
                        err instanceof PositionOutOfBoundsError$1)
                        throw new DecodeLogDataMismatch({
                            abiItem,
                            data: data,
                            params: inputsToDecode,
                            size: size$1(data),
                        });
                    throw err;
                }
            }
        }
        else if (strict) {
            throw new DecodeLogDataMismatch({
                abiItem,
                data: '0x',
                params: inputsToDecode,
                size: 0,
            });
        }
    }
    return {
        eventName: name,
        args: Object.values(args).length > 0 ? args : undefined,
    };
}
function decodeTopic({ param, value }) {
    if (param.type === 'string' ||
        param.type === 'bytes' ||
        param.type === 'tuple' ||
        param.type.match(/^(.*)\[(\d+)?\]$/))
        return value;
    const decodedArg = decodeAbiParameters([param], value) || [];
    return decodedArg[0];
}

// TODO(v3): checksum address.
/**
 * Extracts & decodes logs matching the provided signature(s) (`abi` + optional `eventName`)
 * from a set of opaque logs.
 *
 * @param parameters - {@link ParseEventLogsParameters}
 * @returns The logs. {@link ParseEventLogsReturnType}
 *
 * @example
 * import { createClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { parseEventLogs } from 'viem/op-stack'
 *
 * const client = createClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 *
 * const receipt = await getTransactionReceipt(client, {
 *   hash: '0xec23b2ba4bc59ba61554507c1b1bc91649e6586eb2dd00c728e8ed0db8bb37ea',
 * })
 *
 * const logs = parseEventLogs({ logs: receipt.logs })
 * // [{ args: { ... }, eventName: 'TransactionDeposited', ... }, ...]
 */
function parseEventLogs(parameters) {
    const { abi, args, logs, strict = true } = parameters;
    const eventName = (() => {
        if (!parameters.eventName)
            return undefined;
        if (Array.isArray(parameters.eventName))
            return parameters.eventName;
        return [parameters.eventName];
    })();
    const abiTopics = abi
        .filter((abiItem) => abiItem.type === 'event')
        .map((abiItem) => ({
        abi: abiItem,
        selector: toEventSelector(abiItem),
    }));
    return logs
        .map((log) => {
        // Normalize RpcLog (hex-encoded quantities) to Log (bigint/number).
        // When logs come directly from an RPC response (e.g. eth_getLogs),
        // fields like blockNumber are hex strings instead of bigints.
        const formattedLog = typeof log.blockNumber === 'string' ? formatLog(log) : log;
        // Find all matching ABI items with the same selector.
        // Multiple events can share the same selector but differ in indexed parameters
        // (e.g., ERC20 vs ERC721 Transfer events).
        const abiItems = abiTopics.filter((abiTopic) => formattedLog.topics[0] === abiTopic.selector);
        if (abiItems.length === 0)
            return null;
        // Try each matching ABI item until one successfully decodes.
        let event;
        let abiItem;
        for (const item of abiItems) {
            try {
                event = decodeEventLog({
                    ...formattedLog,
                    abi: [item.abi],
                    strict: true,
                });
                abiItem = item;
                break;
            }
            catch {
                // Try next ABI item
            }
        }
        // If strict decoding failed for all, and we're in non-strict mode,
        // fall back to the first matching ABI item.
        if (!event && !strict) {
            abiItem = abiItems[0];
            try {
                event = decodeEventLog({
                    data: formattedLog.data,
                    topics: formattedLog.topics,
                    abi: [abiItem.abi],
                    strict: false,
                });
            }
            catch {
                // If decoding still fails, return partial log in non-strict mode.
                const isUnnamed = abiItem.abi.inputs?.some((x) => !('name' in x && x.name));
                return {
                    ...formattedLog,
                    args: isUnnamed ? [] : {},
                    eventName: abiItem.abi.name,
                };
            }
        }
        // If no event was found, return null.
        if (!event || !abiItem)
            return null;
        // Check that the decoded event name matches the provided event name.
        if (eventName && !eventName.includes(event.eventName))
            return null;
        // Check that the decoded event args match the provided args.
        if (!includesArgs({
            args: event.args,
            inputs: abiItem.abi.inputs,
            matchArgs: args,
        }))
            return null;
        return { ...event, ...formattedLog };
    })
        .filter(Boolean);
}
function includesArgs(parameters) {
    const { args, inputs, matchArgs } = parameters;
    if (!matchArgs)
        return true;
    if (!args)
        return false;
    function isEqual(input, value, arg) {
        try {
            if (input.type === 'address')
                return isAddressEqual(value, arg);
            if (input.type === 'string' || input.type === 'bytes')
                return keccak256$1(toBytes(value)) === arg;
            return value === arg;
        }
        catch {
            return false;
        }
    }
    if (Array.isArray(args) && Array.isArray(matchArgs)) {
        return matchArgs.every((value, index) => {
            if (value === null || value === undefined)
                return true;
            const input = inputs[index];
            if (!input)
                return false;
            const value_ = Array.isArray(value) ? value : [value];
            return value_.some((value) => isEqual(input, value, args[index]));
        });
    }
    if (typeof args === 'object' &&
        !Array.isArray(args) &&
        typeof matchArgs === 'object' &&
        !Array.isArray(matchArgs))
        return Object.entries(matchArgs).every(([key, value]) => {
            if (value === null || value === undefined)
                return true;
            const input = inputs.find((input) => input.name === key);
            if (!input)
                return false;
            const value_ = Array.isArray(value) ? value : [value];
            return value_.some((value) => isEqual(input, value, args[key]));
        });
    return false;
}

/**
 * Returns a list of event logs matching the provided parameters.
 *
 * - Docs: https://viem.sh/docs/actions/public/getLogs
 * - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/logs_event-logs
 * - JSON-RPC Methods: [`eth_getLogs`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getlogs)
 *
 * @param client - Client to use
 * @param parameters - {@link GetLogsParameters}
 * @returns A list of event logs. {@link GetLogsReturnType}
 *
 * @example
 * import { createPublicClient, http, parseAbiItem } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { getLogs } from 'viem/public'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const logs = await getLogs(client)
 */
async function getLogs(client, { address, blockHash, fromBlock, toBlock, event, events: events_, args, strict: strict_, } = {}) {
    const strict = strict_ ?? false;
    const events = events_ ?? (event ? [event] : undefined);
    let topics = [];
    if (events) {
        const encoded = events.flatMap((event) => encodeEventTopics({
            abi: [event],
            eventName: event.name,
            args: events_ ? undefined : args,
        }));
        // TODO: Clean up type casting
        topics = [encoded];
        if (event)
            topics = topics[0];
    }
    let logs;
    if (blockHash) {
        logs = await client.request({
            method: 'eth_getLogs',
            params: [{ address, topics, blockHash }],
        });
    }
    else {
        logs = await client.request({
            method: 'eth_getLogs',
            params: [
                {
                    address,
                    topics,
                    fromBlock: typeof fromBlock === 'bigint' ? numberToHex(fromBlock) : fromBlock,
                    toBlock: typeof toBlock === 'bigint' ? numberToHex(toBlock) : toBlock,
                },
            ],
        });
    }
    const formattedLogs = logs.map((log) => formatLog(log));
    if (!events)
        return formattedLogs;
    return parseEventLogs({
        abi: events,
        args: args,
        logs: formattedLogs,
        strict,
    });
}

/**
 * Returns a list of event logs emitted by a contract.
 *
 * - Docs: https://viem.sh/docs/contract/getContractEvents#getcontractevents
 * - JSON-RPC Methods: [`eth_getLogs`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getlogs)
 *
 * @param client - Client to use
 * @param parameters - {@link GetContractEventsParameters}
 * @returns A list of event logs. {@link GetContractEventsReturnType}
 *
 * @example
 * import { createClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { getContractEvents } from 'viem/public'
 * import { wagmiAbi } from './abi'
 *
 * const client = createClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const logs = await getContractEvents(client, {
 *  address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
 *  abi: wagmiAbi,
 *  eventName: 'Transfer'
 * })
 */
async function getContractEvents(client, parameters) {
    const { abi, address, args, blockHash, eventName, fromBlock, toBlock, strict, } = parameters;
    const event = eventName
        ? getAbiItem({ abi, name: eventName })
        : undefined;
    const events = !event
        ? abi.filter((x) => x.type === 'event')
        : undefined;
    return getAction(client, getLogs, 'getLogs')({
        address,
        args,
        blockHash,
        event,
        events,
        fromBlock,
        toBlock,
        strict,
    });
}

/** @internal */
function assertSize(bytes, size_) {
    if (size(bytes) > size_)
        throw new SizeOverflowError({
            givenSize: size(bytes),
            maxSize: size_,
        });
}
/** @internal */
const charCodeMap = {
    zero: 48,
    nine: 57,
    A: 65,
    F: 70,
    a: 97,
    f: 102,
};
/** @internal */
function charCodeToBase16(char) {
    if (char >= charCodeMap.zero && char <= charCodeMap.nine)
        return char - charCodeMap.zero;
    if (char >= charCodeMap.A && char <= charCodeMap.F)
        return char - (charCodeMap.A - 10);
    if (char >= charCodeMap.a && char <= charCodeMap.f)
        return char - (charCodeMap.a - 10);
    return undefined;
}
/** @internal */
function pad(bytes, options = {}) {
    const { dir, size = 32 } = options;
    if (size === 0)
        return bytes;
    if (bytes.length > size)
        throw new SizeExceedsPaddingSizeError({
            size: bytes.length,
            targetSize: size,
            type: 'Bytes',
        });
    const paddedBytes = new Uint8Array(size);
    for (let i = 0; i < size; i++) {
        const padEnd = dir === 'right';
        paddedBytes[padEnd ? i : size - i - 1] =
            bytes[padEnd ? i : bytes.length - i - 1];
    }
    return paddedBytes;
}
/** @internal */
function trim(value, options = {}) {
    const { dir = 'left' } = options;
    let data = value;
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
    return data;
}

const decoder = /*#__PURE__*/ new TextDecoder();
const encoder = /*#__PURE__*/ new TextEncoder();
/**
 * Instantiates a {@link ox#Bytes.Bytes} value from a `Uint8Array`, a hex string, or an array of unsigned 8-bit integers.
 *
 * :::tip
 *
 * To instantiate from a **Boolean**, **String**, or **Number**, use one of the following:
 *
 * - `Bytes.fromBoolean`
 *
 * - `Bytes.fromString`
 *
 * - `Bytes.fromNumber`
 *
 * :::
 *
 * @example
 * ```ts twoslash
 * // @noErrors
 * import { Bytes } from 'ox'
 *
 * const data = Bytes.from([255, 124, 5, 4])
 * // @log: Uint8Array([255, 124, 5, 4])
 *
 * const data = Bytes.from('0xdeadbeef')
 * // @log: Uint8Array([222, 173, 190, 239])
 * ```
 *
 * @param value - Value to convert.
 * @returns A {@link ox#Bytes.Bytes} instance.
 */
function from$6(value) {
    if (value instanceof Uint8Array)
        return value;
    if (typeof value === 'string')
        return fromHex$1(value);
    return fromArray(value);
}
/**
 * Converts an array of unsigned 8-bit integers into {@link ox#Bytes.Bytes}.
 *
 * @example
 * ```ts twoslash
 * import { Bytes } from 'ox'
 *
 * const data = Bytes.fromArray([255, 124, 5, 4])
 * // @log: Uint8Array([255, 124, 5, 4])
 * ```
 *
 * @param value - Value to convert.
 * @returns A {@link ox#Bytes.Bytes} instance.
 */
function fromArray(value) {
    return value instanceof Uint8Array ? value : new Uint8Array(value);
}
/**
 * Encodes a {@link ox#Hex.Hex} value into {@link ox#Bytes.Bytes}.
 *
 * @example
 * ```ts twoslash
 * import { Bytes } from 'ox'
 *
 * const data = Bytes.fromHex('0x48656c6c6f20776f726c6421')
 * // @log: Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33])
 * ```
 *
 * @example
 * ```ts twoslash
 * import { Bytes } from 'ox'
 *
 * const data = Bytes.fromHex('0x48656c6c6f20776f726c6421', { size: 32 })
 * // @log: Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
 * ```
 *
 * @param value - {@link ox#Hex.Hex} value to encode.
 * @param options - Encoding options.
 * @returns Encoded {@link ox#Bytes.Bytes}.
 */
function fromHex$1(value, options = {}) {
    const { size } = options;
    let hex = value;
    if (size) {
        assertSize$1(value, size);
        hex = padRight$1(value, size);
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
        bytes[index] = (nibbleLeft << 4) | nibbleRight;
    }
    return bytes;
}
/**
 * Encodes a string into {@link ox#Bytes.Bytes}.
 *
 * @example
 * ```ts twoslash
 * import { Bytes } from 'ox'
 *
 * const data = Bytes.fromString('Hello world!')
 * // @log: Uint8Array([72, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100, 33])
 * ```
 *
 * @example
 * ```ts twoslash
 * import { Bytes } from 'ox'
 *
 * const data = Bytes.fromString('Hello world!', { size: 32 })
 * // @log: Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
 * ```
 *
 * @param value - String to encode.
 * @param options - Encoding options.
 * @returns Encoded {@link ox#Bytes.Bytes}.
 */
function fromString(value, options = {}) {
    const { size } = options;
    const bytes = encoder.encode(value);
    if (typeof size === 'number') {
        assertSize(bytes, size);
        return padRight(bytes, size);
    }
    return bytes;
}
/**
 * Pads a {@link ox#Bytes.Bytes} value to the right with zero bytes until it reaches the given `size` (default: 32 bytes).
 *
 * @example
 * ```ts twoslash
 * import { Bytes } from 'ox'
 *
 * Bytes.padRight(Bytes.from([1]), 4)
 * // @log: Uint8Array([1, 0, 0, 0])
 * ```
 *
 * @param value - {@link ox#Bytes.Bytes} value to pad.
 * @param size - Size to pad the {@link ox#Bytes.Bytes} value to.
 * @returns Padded {@link ox#Bytes.Bytes} value.
 */
function padRight(value, size) {
    return pad(value, { dir: 'right', size });
}
/**
 * Retrieves the size of a {@link ox#Bytes.Bytes} value.
 *
 * @example
 * ```ts twoslash
 * import { Bytes } from 'ox'
 *
 * Bytes.size(Bytes.from([1, 2, 3, 4]))
 * // @log: 4
 * ```
 *
 * @param value - {@link ox#Bytes.Bytes} value.
 * @returns Size of the {@link ox#Bytes.Bytes} value.
 */
function size(value) {
    return value.length;
}
/**
 * Returns a section of a {@link ox#Bytes.Bytes} value given a start/end bytes offset.
 *
 * @example
 * ```ts twoslash
 * import { Bytes } from 'ox'
 *
 * Bytes.slice(
 *   Bytes.from([1, 2, 3, 4, 5, 6, 7, 8, 9]),
 *   1,
 *   4,
 * )
 * // @log: Uint8Array([2, 3, 4])
 * ```
 *
 * @param value - The {@link ox#Bytes.Bytes} value.
 * @param start - Start offset.
 * @param end - End offset.
 * @param options - Slice options.
 * @returns Sliced {@link ox#Bytes.Bytes} value.
 */
function slice(value, start, end, options = {}) {
    const { strict } = options;
    const value_ = value.slice(start, end);
    return value_;
}
/**
 * Decodes a {@link ox#Bytes.Bytes} into a bigint.
 *
 * @example
 * ```ts
 * import { Bytes } from 'ox'
 *
 * Bytes.toBigInt(Bytes.from([1, 164]))
 * // @log: 420n
 * ```
 *
 * @param bytes - The {@link ox#Bytes.Bytes} to decode.
 * @param options - Decoding options.
 * @returns Decoded bigint.
 */
function toBigInt(bytes, options = {}) {
    const { size } = options;
    if (typeof size !== 'undefined')
        assertSize(bytes, size);
    const hex = fromBytes$1(bytes, options);
    return toBigInt$1(hex, options);
}
/**
 * Decodes a {@link ox#Bytes.Bytes} into a boolean.
 *
 * @example
 * ```ts
 * import { Bytes } from 'ox'
 *
 * Bytes.toBoolean(Bytes.from([1]))
 * // @log: true
 * ```
 *
 * @param bytes - The {@link ox#Bytes.Bytes} to decode.
 * @param options - Decoding options.
 * @returns Decoded boolean.
 */
function toBoolean(bytes, options = {}) {
    const { size } = options;
    let bytes_ = bytes;
    if (typeof size !== 'undefined') {
        assertSize(bytes_, size);
        bytes_ = trimLeft(bytes_);
    }
    if (bytes_.length > 1 || bytes_[0] > 1)
        throw new InvalidBytesBooleanError(bytes_);
    return Boolean(bytes_[0]);
}
/**
 * Decodes a {@link ox#Bytes.Bytes} into a number.
 *
 * @example
 * ```ts twoslash
 * import { Bytes } from 'ox'
 *
 * Bytes.toNumber(Bytes.from([1, 164]))
 * // @log: 420
 * ```
 */
function toNumber(bytes, options = {}) {
    const { size } = options;
    if (typeof size !== 'undefined')
        assertSize(bytes, size);
    const hex = fromBytes$1(bytes, options);
    return toNumber$1(hex, options);
}
/**
 * Decodes a {@link ox#Bytes.Bytes} into a string.
 *
 * @example
 * ```ts twoslash
 * import { Bytes } from 'ox'
 *
 * const data = Bytes.toString(Bytes.from([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33]))
 * // @log: 'Hello world'
 * ```
 *
 * @param bytes - The {@link ox#Bytes.Bytes} to decode.
 * @param options - Options.
 * @returns Decoded string.
 */
function toString(bytes, options = {}) {
    const { size } = options;
    let bytes_ = bytes;
    if (typeof size !== 'undefined') {
        assertSize(bytes_, size);
        bytes_ = trimRight(bytes_);
    }
    return decoder.decode(bytes_);
}
/**
 * Trims leading zeros from a {@link ox#Bytes.Bytes} value.
 *
 * @example
 * ```ts twoslash
 * import { Bytes } from 'ox'
 *
 * Bytes.trimLeft(Bytes.from([0, 0, 0, 0, 1, 2, 3]))
 * // @log: Uint8Array([1, 2, 3])
 * ```
 *
 * @param value - {@link ox#Bytes.Bytes} value.
 * @returns Trimmed {@link ox#Bytes.Bytes} value.
 */
function trimLeft(value) {
    return trim(value, { dir: 'left' });
}
/**
 * Trims trailing zeros from a {@link ox#Bytes.Bytes} value.
 *
 * @example
 * ```ts twoslash
 * import { Bytes } from 'ox'
 *
 * Bytes.trimRight(Bytes.from([1, 2, 3, 0, 0, 0, 0]))
 * // @log: Uint8Array([1, 2, 3])
 * ```
 *
 * @param value - {@link ox#Bytes.Bytes} value.
 * @returns Trimmed {@link ox#Bytes.Bytes} value.
 */
function trimRight(value) {
    return trim(value, { dir: 'right' });
}
/**
 * Thrown when the bytes value cannot be represented as a boolean.
 *
 * @example
 * ```ts twoslash
 * import { Bytes } from 'ox'
 *
 * Bytes.toBoolean(Bytes.from([5]))
 * // @error: Bytes.InvalidBytesBooleanError: Bytes value `[5]` is not a valid boolean.
 * // @error: The bytes array must contain a single byte of either a `0` or `1` value.
 * ```
 */
class InvalidBytesBooleanError extends BaseError$1 {
    constructor(bytes) {
        super(`Bytes value \`${bytes}\` is not a valid boolean.`, {
            metaMessages: [
                'The bytes array must contain a single byte of either a `0` or `1` value.',
            ],
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'Bytes.InvalidBytesBooleanError'
        });
    }
}
/**
 * Thrown when a size exceeds the maximum allowed size.
 *
 * @example
 * ```ts twoslash
 * import { Bytes } from 'ox'
 *
 * Bytes.fromString('Hello World!', { size: 8 })
 * // @error: Bytes.SizeOverflowError: Size cannot exceed `8` bytes. Given size: `12` bytes.
 * ```
 */
class SizeOverflowError extends BaseError$1 {
    constructor({ givenSize, maxSize }) {
        super(`Size cannot exceed \`${maxSize}\` bytes. Given size: \`${givenSize}\` bytes.`);
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'Bytes.SizeOverflowError'
        });
    }
}
/**
 * Thrown when a the padding size exceeds the maximum allowed size.
 *
 * @example
 * ```ts twoslash
 * import { Bytes } from 'ox'
 *
 * Bytes.padLeft(Bytes.fromString('Hello World!'), 8)
 * // @error: [Bytes.SizeExceedsPaddingSizeError: Bytes size (`12`) exceeds padding size (`8`).
 * ```
 */
class SizeExceedsPaddingSizeError extends BaseError$1 {
    constructor({ size, targetSize, type, }) {
        super(`${type.charAt(0).toUpperCase()}${type
            .slice(1)
            .toLowerCase()} size (\`${size}\`) exceeds padding size (\`${targetSize}\`).`);
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'Bytes.SizeExceedsPaddingSizeError'
        });
    }
}

/**
 * Simulates/validates a contract interaction. This is useful for retrieving **return data** and **revert reasons** of contract write functions.
 *
 * - Docs: https://viem.sh/docs/contract/simulateContract
 * - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/contracts_writing-to-contracts
 *
 * This function does not require gas to execute and _**does not**_ change the state of the blockchain. It is almost identical to [`readContract`](https://viem.sh/docs/contract/readContract), but also supports contract write functions.
 *
 * Internally, uses a [Public Client](https://viem.sh/docs/clients/public) to call the [`call` action](https://viem.sh/docs/actions/public/call) with [ABI-encoded `data`](https://viem.sh/docs/contract/encodeFunctionData).
 *
 * @param client - Client to use
 * @param parameters - {@link SimulateContractParameters}
 * @returns The simulation result and write request. {@link SimulateContractReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { simulateContract } from 'viem/contract'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const result = await simulateContract(client, {
 *   address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
 *   abi: parseAbi(['function mint(uint32) view returns (uint32)']),
 *   functionName: 'mint',
 *   args: ['69420'],
 *   account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
 * })
 */
async function simulateContract(client, parameters) {
    const { abi, address, args, functionName, dataSuffix = typeof client.dataSuffix === 'string'
        ? client.dataSuffix
        : client.dataSuffix?.value, ...callRequest } = parameters;
    const account = callRequest.account
        ? parseAccount(callRequest.account)
        : client.account;
    const calldata = encodeFunctionData({ abi, args, functionName });
    try {
        const { data } = await getAction(client, call, 'call')({
            batch: false,
            data: `${calldata}${dataSuffix ? dataSuffix.replace('0x', '') : ''}`,
            to: address,
            ...callRequest,
            account,
        });
        const result = decodeFunctionResult({
            abi,
            args,
            functionName,
            data: data || '0x',
        });
        const minimizedAbi = abi.filter((abiItem) => 'name' in abiItem && abiItem.name === parameters.functionName);
        return {
            result,
            request: {
                abi: minimizedAbi,
                address,
                args,
                dataSuffix,
                functionName,
                ...callRequest,
                account,
            },
        };
    }
    catch (error) {
        throw getContractError(error, {
            abi,
            address,
            args,
            docsPath: '/docs/contract/simulateContract',
            functionName,
            sender: account?.address,
        });
    }
}

/** @internal */
const listenersCache = /*#__PURE__*/ new Map();
/** @internal */
const cleanupCache = /*#__PURE__*/ new Map();
let callbackCount = 0;
/**
 * @description Sets up an observer for a given function. If another function
 * is set up under the same observer id, the function will only be called once
 * for both instances of the observer.
 */
function observe(observerId, callbacks, fn) {
    const callbackId = ++callbackCount;
    const getListeners = () => listenersCache.get(observerId) || [];
    const unsubscribe = () => {
        const listeners = getListeners();
        const nextListeners = listeners.filter((cb) => cb.id !== callbackId);
        if (nextListeners.length === 0) {
            listenersCache.delete(observerId);
            cleanupCache.delete(observerId);
            return;
        }
        listenersCache.set(observerId, nextListeners);
    };
    const unwatch = () => {
        const listeners = getListeners();
        if (!listeners.some((cb) => cb.id === callbackId))
            return;
        const cleanup = cleanupCache.get(observerId);
        if (listeners.length === 1 && cleanup) {
            const p = cleanup();
            if (p instanceof Promise)
                p.catch(() => { });
        }
        unsubscribe();
    };
    const listeners = getListeners();
    listenersCache.set(observerId, [
        ...listeners,
        { id: callbackId, fns: callbacks },
    ]);
    if (listeners && listeners.length > 0)
        return unwatch;
    const emit = {};
    for (const key in callbacks) {
        emit[key] = ((...args) => {
            const listeners = getListeners();
            if (listeners.length === 0)
                return;
            for (const listener of listeners)
                listener.fns[key]?.(...args);
        });
    }
    const cleanup = fn(emit);
    if (typeof cleanup === 'function')
        cleanupCache.set(observerId, cleanup);
    return unwatch;
}

/**
 * @description Polls a function at a specified interval.
 */
function poll(fn, { emitOnBegin, initialWaitTime, interval }) {
    let active = true;
    const unwatch = () => (active = false);
    const watch = async () => {
        let data;
        if (emitOnBegin)
            data = await fn({ unpoll: unwatch });
        const initialWait = (await initialWaitTime?.(data)) ?? interval;
        await wait(initialWait);
        const poll = async () => {
            if (!active)
                return;
            await fn({ unpoll: unwatch });
            await wait(interval);
            poll();
        };
        poll();
    };
    watch();
    return unwatch;
}

/** @internal */
const promiseCache = /*#__PURE__*/ new Map();
/** @internal */
const responseCache = /*#__PURE__*/ new Map();
function getCache(cacheKey) {
    const buildCache = (cacheKey, cache) => ({
        clear: () => cache.delete(cacheKey),
        get: () => cache.get(cacheKey),
        set: (data) => cache.set(cacheKey, data),
    });
    const promise = buildCache(cacheKey, promiseCache);
    const response = buildCache(cacheKey, responseCache);
    return {
        clear: () => {
            promise.clear();
            response.clear();
        },
        promise,
        response,
    };
}
/**
 * @description Returns the result of a given promise, and caches the result for
 * subsequent invocations against a provided cache key.
 */
async function withCache(fn, { cacheKey, cacheTime = Number.POSITIVE_INFINITY }) {
    const cache = getCache(cacheKey);
    // If a response exists in the cache, and it's not expired, return it
    // and do not invoke the promise.
    // If the max age is 0, the cache is disabled.
    const response = cache.response.get();
    if (response && cacheTime > 0) {
        const age = Date.now() - response.created.getTime();
        if (age < cacheTime)
            return response.data;
    }
    let promise = cache.promise.get();
    if (!promise) {
        promise = fn();
        // Store the promise in the cache so that subsequent invocations
        // will wait for the same promise to resolve (deduping).
        cache.promise.set(promise);
    }
    try {
        const data = await promise;
        // Store the response in the cache so that subsequent invocations
        // will return the same response.
        cache.response.set({ created: new Date(), data });
        return data;
    }
    finally {
        // Clear the promise cache so that subsequent invocations will
        // invoke the promise again.
        cache.promise.clear();
    }
}

const cacheKey = (id) => `blockNumber.${id}`;
/**
 * Returns the number of the most recent block seen.
 *
 * - Docs: https://viem.sh/docs/actions/public/getBlockNumber
 * - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/blocks_fetching-blocks
 * - JSON-RPC Methods: [`eth_blockNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_blocknumber)
 *
 * @param client - Client to use
 * @param parameters - {@link GetBlockNumberParameters}
 * @returns The number of the block. {@link GetBlockNumberReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { getBlockNumber } from 'viem/public'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const blockNumber = await getBlockNumber(client)
 * // 69420n
 */
async function getBlockNumber(client, { cacheTime = client.cacheTime } = {}) {
    const blockNumberHex = await withCache(() => client.request({
        method: 'eth_blockNumber',
    }), { cacheKey: cacheKey(client.uid), cacheTime });
    return BigInt(blockNumberHex);
}

/**
 * Returns a list of logs or hashes based on a [Filter](/docs/glossary/terms#filter) since the last time it was called.
 *
 * - Docs: https://viem.sh/docs/actions/public/getFilterChanges
 * - JSON-RPC Methods: [`eth_getFilterChanges`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getfilterchanges)
 *
 * A Filter can be created from the following actions:
 *
 * - [`createBlockFilter`](https://viem.sh/docs/actions/public/createBlockFilter)
 * - [`createContractEventFilter`](https://viem.sh/docs/contract/createContractEventFilter)
 * - [`createEventFilter`](https://viem.sh/docs/actions/public/createEventFilter)
 * - [`createPendingTransactionFilter`](https://viem.sh/docs/actions/public/createPendingTransactionFilter)
 *
 * Depending on the type of filter, the return value will be different:
 *
 * - If the filter was created with `createContractEventFilter` or `createEventFilter`, it returns a list of logs.
 * - If the filter was created with `createPendingTransactionFilter`, it returns a list of transaction hashes.
 * - If the filter was created with `createBlockFilter`, it returns a list of block hashes.
 *
 * @param client - Client to use
 * @param parameters - {@link GetFilterChangesParameters}
 * @returns Logs or hashes. {@link GetFilterChangesReturnType}
 *
 * @example
 * // Blocks
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { createBlockFilter, getFilterChanges } from 'viem/public'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const filter = await createBlockFilter(client)
 * const hashes = await getFilterChanges(client, { filter })
 *
 * @example
 * // Contract Events
 * import { createPublicClient, http, parseAbi } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { createContractEventFilter, getFilterChanges } from 'viem/public'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const filter = await createContractEventFilter(client, {
 *   address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
 *   abi: parseAbi(['event Transfer(address indexed, address indexed, uint256)']),
 *   eventName: 'Transfer',
 * })
 * const logs = await getFilterChanges(client, { filter })
 *
 * @example
 * // Raw Events
 * import { createPublicClient, http, parseAbiItem } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { createEventFilter, getFilterChanges } from 'viem/public'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const filter = await createEventFilter(client, {
 *   address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
 *   event: parseAbiItem('event Transfer(address indexed, address indexed, uint256)'),
 * })
 * const logs = await getFilterChanges(client, { filter })
 *
 * @example
 * // Transactions
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { createPendingTransactionFilter, getFilterChanges } from 'viem/public'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const filter = await createPendingTransactionFilter(client)
 * const hashes = await getFilterChanges(client, { filter })
 */
async function getFilterChanges(_client, { filter, }) {
    const strict = 'strict' in filter && filter.strict;
    const logs = await filter.request({
        method: 'eth_getFilterChanges',
        params: [filter.id],
    });
    if (typeof logs[0] === 'string')
        return logs;
    const formattedLogs = logs.map((log) => formatLog(log));
    if (!('abi' in filter) || !filter.abi)
        return formattedLogs;
    return parseEventLogs({
        abi: filter.abi,
        logs: formattedLogs,
        strict,
    });
}

/**
 * Destroys a [`Filter`](https://viem.sh/docs/glossary/types#filter).
 *
 * - Docs: https://viem.sh/docs/actions/public/uninstallFilter
 * - JSON-RPC Methods: [`eth_uninstallFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_uninstallFilter)
 *
 * Destroys a Filter that was created from one of the following Actions:
 * - [`createBlockFilter`](https://viem.sh/docs/actions/public/createBlockFilter)
 * - [`createEventFilter`](https://viem.sh/docs/actions/public/createEventFilter)
 * - [`createPendingTransactionFilter`](https://viem.sh/docs/actions/public/createPendingTransactionFilter)
 *
 * @param client - Client to use
 * @param parameters - {@link UninstallFilterParameters}
 * @returns A boolean indicating if the Filter was successfully uninstalled. {@link UninstallFilterReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { createPendingTransactionFilter, uninstallFilter } from 'viem/public'
 *
 * const filter = await createPendingTransactionFilter(client)
 * const uninstalled = await uninstallFilter(client, { filter })
 * // true
 */
async function uninstallFilter(_client, { filter }) {
    return filter.request({
        method: 'eth_uninstallFilter',
        params: [filter.id],
    });
}

/**
 * Watches and returns emitted contract event logs.
 *
 * - Docs: https://viem.sh/docs/contract/watchContractEvent
 *
 * This Action will batch up all the event logs found within the [`pollingInterval`](https://viem.sh/docs/contract/watchContractEvent#pollinginterval-optional), and invoke them via [`onLogs`](https://viem.sh/docs/contract/watchContractEvent#onLogs).
 *
 * `watchContractEvent` will attempt to create an [Event Filter](https://viem.sh/docs/contract/createContractEventFilter) and listen to changes to the Filter per polling interval, however, if the RPC Provider does not support Filters (e.g. `eth_newFilter`), then `watchContractEvent` will fall back to using [`getLogs`](https://viem.sh/docs/actions/public/getLogs) instead.
 *
 * @param client - Client to use
 * @param parameters - {@link WatchContractEventParameters}
 * @returns A function that can be invoked to stop watching for new event logs. {@link WatchContractEventReturnType}
 *
 * @example
 * import { createPublicClient, http, parseAbi } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { watchContractEvent } from 'viem/contract'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const unwatch = watchContractEvent(client, {
 *   address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
 *   abi: parseAbi(['event Transfer(address indexed from, address indexed to, uint256 value)']),
 *   eventName: 'Transfer',
 *   args: { from: '0xc961145a54C96E3aE9bAA048c4F4D6b04C13916b' },
 *   onLogs: (logs) => console.log(logs),
 * })
 */
function watchContractEvent(client, parameters) {
    const { abi, address, args, batch = true, eventName, fromBlock, onError, onLogs, poll: poll_, pollingInterval = client.pollingInterval, strict: strict_, } = parameters;
    const enablePolling = (() => {
        if (typeof poll_ !== 'undefined')
            return poll_;
        if (typeof fromBlock === 'bigint')
            return true;
        if (client.transport.type === 'webSocket' ||
            client.transport.type === 'ipc')
            return false;
        if (client.transport.type === 'fallback' &&
            (client.transport.transports[0].config.type === 'webSocket' ||
                client.transport.transports[0].config.type === 'ipc'))
            return false;
        return true;
    })();
    const pollContractEvent = () => {
        const strict = strict_ ?? false;
        const observerId = stringify([
            'watchContractEvent',
            address,
            args,
            batch,
            client.uid,
            eventName,
            pollingInterval,
            strict,
            fromBlock,
        ]);
        return observe(observerId, { onLogs, onError }, (emit) => {
            let previousBlockNumber;
            if (fromBlock !== undefined)
                previousBlockNumber = fromBlock - 1n;
            let filter;
            let initialized = false;
            const unwatch = poll(async () => {
                if (!initialized) {
                    try {
                        filter = (await getAction(client, createContractEventFilter, 'createContractEventFilter')({
                            abi,
                            address,
                            args: args,
                            eventName: eventName,
                            strict: strict,
                            fromBlock,
                        }));
                    }
                    catch { }
                    initialized = true;
                    return;
                }
                try {
                    let logs;
                    if (filter) {
                        logs = await getAction(client, getFilterChanges, 'getFilterChanges')({ filter });
                    }
                    else {
                        // If the filter doesn't exist, we will fall back to use `getLogs`.
                        // The fall back exists because some RPC Providers do not support filters.
                        // Fetch the block number to use for `getLogs`.
                        const blockNumber = await getAction(client, getBlockNumber, 'getBlockNumber')({});
                        // If the block number has changed, we will need to fetch the logs.
                        // If the block number doesn't exist, we are yet to reach the first poll interval,
                        // so do not emit any logs.
                        if (previousBlockNumber && previousBlockNumber < blockNumber) {
                            logs = await getAction(client, getContractEvents, 'getContractEvents')({
                                abi,
                                address,
                                args,
                                eventName,
                                fromBlock: previousBlockNumber + 1n,
                                toBlock: blockNumber,
                                strict,
                            });
                        }
                        else {
                            logs = [];
                        }
                        previousBlockNumber = blockNumber;
                    }
                    if (logs.length === 0)
                        return;
                    if (batch)
                        emit.onLogs(logs);
                    else
                        for (const log of logs)
                            emit.onLogs([log]);
                }
                catch (err) {
                    // If a filter has been set and gets uninstalled, providers will throw an InvalidInput error.
                    // Reinitialize the filter when this occurs
                    if (filter && err instanceof InvalidInputRpcError)
                        initialized = false;
                    emit.onError?.(err);
                }
            }, {
                emitOnBegin: true,
                interval: pollingInterval,
            });
            return async () => {
                if (filter)
                    await getAction(client, uninstallFilter, 'uninstallFilter')({ filter });
                unwatch();
            };
        });
    };
    const subscribeContractEvent = () => {
        const strict = strict_ ?? false;
        const observerId = stringify([
            'watchContractEvent',
            address,
            args,
            batch,
            client.uid,
            eventName,
            pollingInterval,
            strict,
        ]);
        let active = true;
        let unsubscribe = () => (active = false);
        return observe(observerId, { onLogs, onError }, (emit) => {
            (async () => {
                try {
                    const transport = (() => {
                        if (client.transport.type === 'fallback') {
                            const transport = client.transport.transports.find((transport) => transport.config.type === 'webSocket' ||
                                transport.config.type === 'ipc');
                            if (!transport)
                                return client.transport;
                            return transport.value;
                        }
                        return client.transport;
                    })();
                    const topics = eventName
                        ? encodeEventTopics({
                            abi: abi,
                            eventName: eventName,
                            args,
                        })
                        : [];
                    const { unsubscribe: unsubscribe_ } = await transport.subscribe({
                        params: ['logs', { address, topics }],
                        onData(data) {
                            if (!active)
                                return;
                            const log = data.result;
                            try {
                                const { eventName, args } = decodeEventLog({
                                    abi: abi,
                                    data: log.data,
                                    topics: log.topics,
                                    strict: strict_,
                                });
                                const formatted = formatLog(log, {
                                    args,
                                    eventName: eventName,
                                });
                                emit.onLogs([formatted]);
                            }
                            catch (err) {
                                let eventName;
                                let isUnnamed;
                                if (err instanceof DecodeLogDataMismatch ||
                                    err instanceof DecodeLogTopicsMismatch) {
                                    // If strict mode is on, and log data/topics do not match event definition, skip.
                                    if (strict_)
                                        return;
                                    eventName = err.abiItem.name;
                                    isUnnamed = err.abiItem.inputs?.some((x) => !('name' in x && x.name));
                                }
                                // Set args to empty if there is an error decoding (e.g. indexed/non-indexed params mismatch).
                                const formatted = formatLog(log, {
                                    args: isUnnamed ? [] : {},
                                    eventName,
                                });
                                emit.onLogs([formatted]);
                            }
                        },
                        onError(error) {
                            emit.onError?.(error);
                        },
                    });
                    unsubscribe = unsubscribe_;
                    if (!active)
                        unsubscribe();
                }
                catch (err) {
                    onError?.(err);
                }
            })();
            return () => unsubscribe();
        });
    };
    return enablePolling ? pollContractEvent() : subscribeContractEvent();
}

const receiptStatuses = {
    '0x0': 'reverted',
    '0x1': 'success',
};
function formatTransactionReceipt(transactionReceipt, _) {
    const receipt = {
        ...transactionReceipt,
        blockNumber: transactionReceipt.blockNumber
            ? BigInt(transactionReceipt.blockNumber)
            : null,
        contractAddress: transactionReceipt.contractAddress
            ? transactionReceipt.contractAddress
            : null,
        cumulativeGasUsed: transactionReceipt.cumulativeGasUsed
            ? BigInt(transactionReceipt.cumulativeGasUsed)
            : null,
        effectiveGasPrice: transactionReceipt.effectiveGasPrice
            ? BigInt(transactionReceipt.effectiveGasPrice)
            : null,
        gasUsed: transactionReceipt.gasUsed
            ? BigInt(transactionReceipt.gasUsed)
            : null,
        logs: transactionReceipt.logs
            ? transactionReceipt.logs.map((log) => formatLog(log))
            : null,
        to: transactionReceipt.to ? transactionReceipt.to : null,
        transactionIndex: transactionReceipt.transactionIndex
            ? hexToNumber(transactionReceipt.transactionIndex)
            : null,
        status: transactionReceipt.status
            ? receiptStatuses[transactionReceipt.status]
            : null,
        type: transactionReceipt.type
            ? transactionType[transactionReceipt.type] || transactionReceipt.type
            : null,
    };
    if (transactionReceipt.blobGasPrice)
        receipt.blobGasPrice = BigInt(transactionReceipt.blobGasPrice);
    if (transactionReceipt.blobGasUsed)
        receipt.blobGasUsed = BigInt(transactionReceipt.blobGasUsed);
    return receipt;
}

/*
 * @description Checks if error is a valid null result UniversalResolver error
 */
function isNullUniversalResolverError(err) {
    if (!(err instanceof BaseError))
        return false;
    const cause = err.walk((e) => e instanceof ContractFunctionRevertedError);
    if (!(cause instanceof ContractFunctionRevertedError))
        return false;
    if (cause.data?.errorName === 'HttpError')
        return true;
    if (cause.data?.errorName === 'ResolverError')
        return true;
    if (cause.data?.errorName === 'ResolverNotContract')
        return true;
    if (cause.data?.errorName === 'ResolverNotFound')
        return true;
    if (cause.data?.errorName === 'ReverseAddressMismatch')
        return true;
    if (cause.data?.errorName === 'UnsupportedResolverProfile')
        return true;
    return false;
}

function encodedLabelToLabelhash(label) {
    if (label.length !== 66)
        return null;
    if (label.indexOf('[') !== 0)
        return null;
    if (label.indexOf(']') !== 65)
        return null;
    const hash = `0x${label.slice(1, 65)}`;
    if (!isHex(hash))
        return null;
    return hash;
}

/**
 * @description Hashes ENS name
 *
 * - Since ENS names prohibit certain forbidden characters (e.g. underscore) and have other validation rules, you likely want to [normalize ENS names](https://docs.ens.domains/contract-api-reference/name-processing#normalising-names) with [UTS-46 normalization](https://unicode.org/reports/tr46) before passing them to `namehash`. You can use the built-in [`normalize`](https://viem.sh/docs/ens/utilities/normalize) function for this.
 *
 * @example
 * namehash('wevm.eth')
 * '0x08c85f2f4059e930c45a6aeff9dcd3bd95dc3c5c1cddef6a0626b31152248560'
 *
 * @link https://eips.ethereum.org/EIPS/eip-137
 */
function namehash(name) {
    let result = new Uint8Array(32).fill(0);
    if (!name)
        return bytesToHex(result);
    const labels = name.split('.');
    // Iterate in reverse order building up hash
    for (let i = labels.length - 1; i >= 0; i -= 1) {
        const hashFromEncodedLabel = encodedLabelToLabelhash(labels[i]);
        const hashed = hashFromEncodedLabel
            ? toBytes(hashFromEncodedLabel)
            : keccak256$1(stringToBytes(labels[i]), 'bytes');
        result = keccak256$1(concat([result, hashed]), 'bytes');
    }
    return bytesToHex(result);
}

function encodeLabelhash(hash) {
    return `[${hash.slice(2)}]`;
}

/**
 * @description Hashes ENS label
 *
 * - Since ENS labels prohibit certain forbidden characters (e.g. underscore) and have other validation rules, you likely want to [normalize ENS labels](https://docs.ens.domains/contract-api-reference/name-processing#normalising-names) with [UTS-46 normalization](https://unicode.org/reports/tr46) before passing them to `labelhash`. You can use the built-in [`normalize`](https://viem.sh/docs/ens/utilities/normalize) function for this.
 *
 * @example
 * labelhash('eth')
 * '0x4f5b812789fc606be1b3b16908db13fc7a9adf7ca72641f84d75b47069d3d7f0'
 */
function labelhash(label) {
    const result = new Uint8Array(32).fill(0);
    if (!label)
        return bytesToHex(result);
    return encodedLabelToLabelhash(label) || keccak256$1(stringToBytes(label));
}

/*
 * @description Encodes a DNS packet into a ByteArray containing a UDP payload.
 *
 * @example
 * packetToBytes('awkweb.eth')
 * '0x0661776b7765620365746800'
 *
 * @see https://docs.ens.domains/resolution/names#dns
 *
 */
function packetToBytes(packet) {
    // strip leading and trailing `.`
    const value = packet.replace(/^\.|\.$/gm, '');
    if (value.length === 0)
        return new Uint8Array(1);
    const bytes = new Uint8Array(stringToBytes(value).byteLength + 2);
    let offset = 0;
    const list = value.split('.');
    for (let i = 0; i < list.length; i++) {
        let encoded = stringToBytes(list[i]);
        // if the length is > 255, make the encoded label value a labelhash
        // this is compatible with the universal resolver
        if (encoded.byteLength > 255)
            encoded = stringToBytes(encodeLabelhash(labelhash(list[i])));
        bytes[offset] = encoded.length;
        bytes.set(encoded, offset + 1);
        offset += encoded.length + 1;
    }
    if (bytes.byteLength !== offset + 1)
        return bytes.slice(0, offset + 1);
    return bytes;
}

/**
 * Gets address for ENS name.
 *
 * - Docs: https://viem.sh/docs/ens/actions/getEnsAddress
 * - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/ens
 *
 * Calls `resolve(bytes, bytes)` on ENS Universal Resolver Contract.
 *
 * Since ENS names prohibit certain forbidden characters (e.g. underscore) and have other validation rules, you likely want to [normalize ENS names](https://docs.ens.domains/contract-api-reference/name-processing#normalising-names) with [UTS-46 normalization](https://unicode.org/reports/tr46) before passing them to `getEnsAddress`. You can use the built-in [`normalize`](https://viem.sh/docs/ens/utilities/normalize) function for this.
 *
 * @param client - Client to use
 * @param parameters - {@link GetEnsAddressParameters}
 * @returns Address for ENS name or `null` if not found. {@link GetEnsAddressReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { getEnsAddress, normalize } from 'viem/ens'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const ensAddress = await getEnsAddress(client, {
 *   name: normalize('wevm.eth'),
 * })
 * // '0xd2135CfB216b74109775236E36d4b433F1DF507B'
 */
async function getEnsAddress(client, parameters) {
    const { blockNumber, blockTag, coinType, name, gatewayUrls, strict } = parameters;
    const { chain } = client;
    const universalResolverAddress = (() => {
        if (parameters.universalResolverAddress)
            return parameters.universalResolverAddress;
        if (!chain)
            throw new Error('client chain not configured. universalResolverAddress is required.');
        return getChainContractAddress({
            blockNumber,
            chain,
            contract: 'ensUniversalResolver',
        });
    })();
    const tlds = chain?.ensTlds;
    if (tlds && !tlds.some((tld) => name.endsWith(tld)))
        return null;
    const args = (() => {
        if (coinType != null)
            return [namehash(name), BigInt(coinType)];
        return [namehash(name)];
    })();
    try {
        const functionData = encodeFunctionData({
            abi: addressResolverAbi,
            functionName: 'addr',
            args,
        });
        const readContractParameters = {
            address: universalResolverAddress,
            abi: universalResolverResolveAbi,
            functionName: 'resolveWithGateways',
            args: [
                toHex(packetToBytes(name)),
                functionData,
                gatewayUrls ?? [localBatchGatewayUrl],
            ],
            blockNumber,
            blockTag,
        };
        const readContractAction = getAction(client, readContract, 'readContract');
        const res = await readContractAction(readContractParameters);
        if (res[0] === '0x')
            return null;
        const address = decodeAddress$1({ coinType, data: res[0], args });
        if (address === '0x')
            return null;
        if (trim$1(address) === '0x00')
            return null;
        return address;
    }
    catch (err) {
        if (strict)
            throw err;
        if (isNullUniversalResolverError(err))
            return null;
        throw err;
    }
}
function decodeAddress$1({ coinType, data, args, }) {
    try {
        return decodeFunctionResult({
            abi: addressResolverAbi,
            args,
            functionName: 'addr',
            data,
        });
    }
    catch (err) {
        if (coinType == null)
            throw err;
        const address = trim$1(data);
        if (size$1(address) === 20)
            return getAddress(address);
        throw err;
    }
}

class EnsAvatarInvalidMetadataError extends BaseError {
    constructor({ data }) {
        super('Unable to extract image from metadata. The metadata may be malformed or invalid.', {
            metaMessages: [
                '- Metadata must be a JSON object with at least an `image`, `image_url` or `image_data` property.',
                '',
                `Provided data: ${JSON.stringify(data)}`,
            ],
            name: 'EnsAvatarInvalidMetadataError',
        });
    }
}
class EnsAvatarInvalidNftUriError extends BaseError {
    constructor({ reason }) {
        super(`ENS NFT avatar URI is invalid. ${reason}`, {
            name: 'EnsAvatarInvalidNftUriError',
        });
    }
}
class EnsAvatarUriResolutionError extends BaseError {
    constructor({ uri }) {
        super(`Unable to resolve ENS avatar URI "${uri}". The URI may be malformed, invalid, or does not respond with a valid image.`, { name: 'EnsAvatarUriResolutionError' });
    }
}
class EnsAvatarUnsupportedNamespaceError extends BaseError {
    constructor({ namespace }) {
        super(`ENS NFT avatar namespace "${namespace}" is not supported. Must be "erc721" or "erc1155".`, { name: 'EnsAvatarUnsupportedNamespaceError' });
    }
}

const networkRegex = /(?<protocol>https?:\/\/[^/]*|ipfs:\/|ipns:\/|ar:\/)?(?<root>\/)?(?<subpath>ipfs\/|ipns\/)?(?<target>[\w\-.]+)(?<subtarget>\/.*)?/;
const ipfsHashRegex = /^(Qm[1-9A-HJ-NP-Za-km-z]{44,}|b[A-Za-z2-7]{58,}|B[A-Z2-7]{58,}|z[1-9A-HJ-NP-Za-km-z]{48,}|F[0-9A-F]{50,})(\/(?<target>[\w\-.]+))?(?<subtarget>\/.*)?$/;
const base64Regex = /^data:([a-zA-Z\-/+]*);base64,([^"].*)/;
const dataURIRegex = /^data:([a-zA-Z\-/+]*)?(;[a-zA-Z0-9].*?)?(,)/;
/** @internal */
async function isImageUri(uri) {
    try {
        const res = await fetch(uri, { method: 'HEAD' });
        // retrieve content type header to check if content is image
        if (res.status === 200) {
            const contentType = res.headers.get('content-type');
            return contentType?.startsWith('image/');
        }
        return false;
    }
    catch (error) {
        // if error is not cors related then fail
        if (typeof error === 'object' && typeof error.response !== 'undefined') {
            return false;
        }
        // fail in NodeJS, since the error is not cors but any other network issue
        if (!Object.hasOwn(globalThis, 'Image'))
            return false;
        // in case of cors, use image api to validate if given url is an actual image
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                resolve(true);
            };
            img.onerror = () => {
                resolve(false);
            };
            img.src = uri;
        });
    }
}
/** @internal */
function getGateway(custom, defaultGateway) {
    if (!custom)
        return defaultGateway;
    if (custom.endsWith('/'))
        return custom.slice(0, -1);
    return custom;
}
function resolveAvatarUri({ uri, gatewayUrls, }) {
    const isEncoded = base64Regex.test(uri);
    if (isEncoded)
        return { uri, isOnChain: true, isEncoded };
    const ipfsGateway = getGateway(gatewayUrls?.ipfs, 'https://ipfs.io');
    const arweaveGateway = getGateway(gatewayUrls?.arweave, 'https://arweave.net');
    const networkRegexMatch = uri.match(networkRegex);
    const { protocol, subpath, target, subtarget = '', } = networkRegexMatch?.groups || {};
    const isIPNS = protocol === 'ipns:/' || subpath === 'ipns/';
    const isIPFS = protocol === 'ipfs:/' || subpath === 'ipfs/' || ipfsHashRegex.test(uri);
    if (uri.startsWith('http') && !isIPNS && !isIPFS) {
        let replacedUri = uri;
        if (gatewayUrls?.arweave)
            replacedUri = uri.replace(/https:\/\/arweave.net/g, gatewayUrls?.arweave);
        return { uri: replacedUri, isOnChain: false, isEncoded: false };
    }
    if ((isIPNS || isIPFS) && target) {
        return {
            uri: `${ipfsGateway}/${isIPNS ? 'ipns' : 'ipfs'}/${target}${subtarget}`,
            isOnChain: false,
            isEncoded: false,
        };
    }
    if (protocol === 'ar:/' && target) {
        return {
            uri: `${arweaveGateway}/${target}${subtarget || ''}`,
            isOnChain: false,
            isEncoded: false,
        };
    }
    let parsedUri = uri.replace(dataURIRegex, '');
    if (parsedUri.startsWith('<svg')) {
        // if svg, base64 encode
        parsedUri = `data:image/svg+xml;base64,${btoa(parsedUri)}`;
    }
    if (parsedUri.startsWith('data:') || parsedUri.startsWith('{')) {
        return {
            uri: parsedUri,
            isOnChain: true,
            isEncoded: false,
        };
    }
    throw new EnsAvatarUriResolutionError({ uri });
}
function getJsonImage(data) {
    // validation check for json data, must include one of theses properties
    if (typeof data !== 'object' ||
        (!('image' in data) && !('image_url' in data) && !('image_data' in data))) {
        throw new EnsAvatarInvalidMetadataError({ data });
    }
    return data.image || data.image_url || data.image_data;
}
async function getMetadataAvatarUri({ gatewayUrls, uri, }) {
    try {
        const res = await fetch(uri).then((res) => res.json());
        const image = await parseAvatarUri({
            gatewayUrls,
            uri: getJsonImage(res),
        });
        return image;
    }
    catch {
        throw new EnsAvatarUriResolutionError({ uri });
    }
}
async function parseAvatarUri({ gatewayUrls, uri, }) {
    const { uri: resolvedURI, isOnChain } = resolveAvatarUri({ uri, gatewayUrls });
    if (isOnChain)
        return resolvedURI;
    // check if resolvedURI is an image, if it is return the url
    const isImage = await isImageUri(resolvedURI);
    if (isImage)
        return resolvedURI;
    throw new EnsAvatarUriResolutionError({ uri });
}
function parseNftUri(uri_) {
    let uri = uri_;
    // parse valid nft spec (CAIP-22/CAIP-29)
    // @see: https://github.com/ChainAgnostic/CAIPs/tree/master/CAIPs
    if (uri.startsWith('did:nft:')) {
        // convert DID to CAIP
        uri = uri.replace('did:nft:', '').replace(/_/g, '/');
    }
    const [reference, asset_namespace, tokenID] = uri.split('/');
    const [eip_namespace, chainID] = reference.split(':');
    const [erc_namespace, contractAddress] = asset_namespace.split(':');
    if (!eip_namespace || eip_namespace.toLowerCase() !== 'eip155')
        throw new EnsAvatarInvalidNftUriError({ reason: 'Only EIP-155 supported' });
    if (!chainID)
        throw new EnsAvatarInvalidNftUriError({ reason: 'Chain ID not found' });
    if (!contractAddress)
        throw new EnsAvatarInvalidNftUriError({
            reason: 'Contract address not found',
        });
    if (!tokenID)
        throw new EnsAvatarInvalidNftUriError({ reason: 'Token ID not found' });
    if (!erc_namespace)
        throw new EnsAvatarInvalidNftUriError({ reason: 'ERC namespace not found' });
    return {
        chainID: Number.parseInt(chainID, 10),
        namespace: erc_namespace.toLowerCase(),
        contractAddress: contractAddress,
        tokenID,
    };
}
async function getNftTokenUri(client, { nft }) {
    if (nft.namespace === 'erc721') {
        return readContract(client, {
            address: nft.contractAddress,
            abi: [
                {
                    name: 'tokenURI',
                    type: 'function',
                    stateMutability: 'view',
                    inputs: [{ name: 'tokenId', type: 'uint256' }],
                    outputs: [{ name: '', type: 'string' }],
                },
            ],
            functionName: 'tokenURI',
            args: [BigInt(nft.tokenID)],
        });
    }
    if (nft.namespace === 'erc1155') {
        return readContract(client, {
            address: nft.contractAddress,
            abi: [
                {
                    name: 'uri',
                    type: 'function',
                    stateMutability: 'view',
                    inputs: [{ name: '_id', type: 'uint256' }],
                    outputs: [{ name: '', type: 'string' }],
                },
            ],
            functionName: 'uri',
            args: [BigInt(nft.tokenID)],
        });
    }
    throw new EnsAvatarUnsupportedNamespaceError({ namespace: nft.namespace });
}

/*
 * @description Parses an ENS avatar record.
 *
 * @example
 * parseAvatarRecord('eip155:1/erc1155:0xb32979486938aa9694bfc898f35dbed459f44424/10063')
 * 'https://ipfs.io/ipfs/QmSP4nq9fnN9dAiCj42ug9Wa79rqmQerZXZch82VqpiH7U/image.gif'
 *
 * @see https://docs.ens.domains/web/avatars
 *
 */
async function parseAvatarRecord(client, { gatewayUrls, record, }) {
    if (/eip155:/i.test(record))
        return parseNftAvatarUri(client, { gatewayUrls, record });
    return parseAvatarUri({ uri: record, gatewayUrls });
}
async function parseNftAvatarUri(client, { gatewayUrls, record, }) {
    // parse NFT URI into properties
    const nft = parseNftUri(record);
    // fetch tokenURI from the NFT contract
    const nftUri = await getNftTokenUri(client, { nft });
    // resolve the URI from the fetched tokenURI
    const { uri: resolvedNftUri, isOnChain, isEncoded, } = resolveAvatarUri({ uri: nftUri, gatewayUrls });
    // if the resolved URI is on chain, return the data
    if (isOnChain &&
        (resolvedNftUri.includes('data:application/json;base64,') ||
            resolvedNftUri.startsWith('{'))) {
        const encodedJson = isEncoded
            ? // if it is encoded, decode it
                atob(resolvedNftUri.replace('data:application/json;base64,', ''))
            : // if it isn't encoded assume it is a JSON string, but it could be anything (it will error if it is)
                resolvedNftUri;
        const decoded = JSON.parse(encodedJson);
        return parseAvatarUri({ uri: getJsonImage(decoded), gatewayUrls });
    }
    let uriTokenId = nft.tokenID;
    if (nft.namespace === 'erc1155')
        uriTokenId = uriTokenId.replace('0x', '').padStart(64, '0');
    return getMetadataAvatarUri({
        gatewayUrls,
        uri: resolvedNftUri.replace(/(?:0x)?{id}/, uriTokenId),
    });
}

/**
 * Gets a text record for specified ENS name.
 *
 * - Docs: https://viem.sh/docs/ens/actions/getEnsResolver
 * - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/ens
 *
 * Calls `resolve(bytes, bytes)` on ENS Universal Resolver Contract.
 *
 * Since ENS names prohibit certain forbidden characters (e.g. underscore) and have other validation rules, you likely want to [normalize ENS names](https://docs.ens.domains/contract-api-reference/name-processing#normalising-names) with [UTS-46 normalization](https://unicode.org/reports/tr46) before passing them to `getEnsAddress`. You can use the built-in [`normalize`](https://viem.sh/docs/ens/utilities/normalize) function for this.
 *
 * @param client - Client to use
 * @param parameters - {@link GetEnsTextParameters}
 * @returns Address for ENS resolver. {@link GetEnsTextReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { getEnsText, normalize } from 'viem/ens'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const twitterRecord = await getEnsText(client, {
 *   name: normalize('wevm.eth'),
 *   key: 'com.twitter',
 * })
 * // 'wevm_dev'
 */
async function getEnsText(client, parameters) {
    const { blockNumber, blockTag, key, name, gatewayUrls, strict } = parameters;
    const { chain } = client;
    const universalResolverAddress = (() => {
        if (parameters.universalResolverAddress)
            return parameters.universalResolverAddress;
        if (!chain)
            throw new Error('client chain not configured. universalResolverAddress is required.');
        return getChainContractAddress({
            blockNumber,
            chain,
            contract: 'ensUniversalResolver',
        });
    })();
    const tlds = chain?.ensTlds;
    if (tlds && !tlds.some((tld) => name.endsWith(tld)))
        return null;
    try {
        const readContractParameters = {
            address: universalResolverAddress,
            abi: universalResolverResolveAbi,
            args: [
                toHex(packetToBytes(name)),
                encodeFunctionData({
                    abi: textResolverAbi,
                    functionName: 'text',
                    args: [namehash(name), key],
                }),
                gatewayUrls ?? [localBatchGatewayUrl],
            ],
            functionName: 'resolveWithGateways',
            blockNumber,
            blockTag,
        };
        const readContractAction = getAction(client, readContract, 'readContract');
        const res = await readContractAction(readContractParameters);
        if (res[0] === '0x')
            return null;
        const record = decodeFunctionResult({
            abi: textResolverAbi,
            functionName: 'text',
            data: res[0],
        });
        return record === '' ? null : record;
    }
    catch (err) {
        if (strict)
            throw err;
        if (isNullUniversalResolverError(err))
            return null;
        throw err;
    }
}

/**
 * Gets the avatar of an ENS name.
 *
 * - Docs: https://viem.sh/docs/ens/actions/getEnsAvatar
 * - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/ens
 *
 * Calls [`getEnsText`](https://viem.sh/docs/ens/actions/getEnsText) with `key` set to `'avatar'`.
 *
 * Since ENS names prohibit certain forbidden characters (e.g. underscore) and have other validation rules, you likely want to [normalize ENS names](https://docs.ens.domains/contract-api-reference/name-processing#normalising-names) with [UTS-46 normalization](https://unicode.org/reports/tr46) before passing them to `getEnsAddress`. You can use the built-in [`normalize`](https://viem.sh/docs/ens/utilities/normalize) function for this.
 *
 * @param client - Client to use
 * @param parameters - {@link GetEnsAvatarParameters}
 * @returns Avatar URI or `null` if not found. {@link GetEnsAvatarReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { getEnsAvatar, normalize } from 'viem/ens'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const ensAvatar = await getEnsAvatar(client, {
 *   name: normalize('wevm.eth'),
 * })
 * // 'https://ipfs.io/ipfs/Qma8mnp6xV3J2cRNf3mTth5C8nV11CAnceVinc3y8jSbio'
 */
async function getEnsAvatar(client, { blockNumber, blockTag, assetGatewayUrls, name, gatewayUrls, strict, universalResolverAddress, }) {
    const record = await getAction(client, getEnsText, 'getEnsText')({
        blockNumber,
        blockTag,
        key: 'avatar',
        name,
        universalResolverAddress,
        gatewayUrls,
        strict,
    });
    if (!record)
        return null;
    try {
        return await parseAvatarRecord(client, {
            record,
            gatewayUrls: assetGatewayUrls,
        });
    }
    catch {
        return null;
    }
}

/**
 * Gets primary name for specified address.
 *
 * - Docs: https://viem.sh/docs/ens/actions/getEnsName
 * - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/ens
 *
 * Calls `reverse(bytes)` on ENS Universal Resolver Contract to "reverse resolve" the address to the primary ENS name.
 *
 * @param client - Client to use
 * @param parameters - {@link GetEnsNameParameters}
 * @returns Name or `null` if not found. {@link GetEnsNameReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { getEnsName } from 'viem/ens'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const ensName = await getEnsName(client, {
 *   address: '0xd2135CfB216b74109775236E36d4b433F1DF507B',
 * })
 * // 'wevm.eth'
 */
async function getEnsName(client, parameters) {
    const { address, blockNumber, blockTag, coinType = 60n, gatewayUrls, strict, } = parameters;
    const { chain } = client;
    const universalResolverAddress = (() => {
        if (parameters.universalResolverAddress)
            return parameters.universalResolverAddress;
        if (!chain)
            throw new Error('client chain not configured. universalResolverAddress is required.');
        return getChainContractAddress({
            blockNumber,
            chain,
            contract: 'ensUniversalResolver',
        });
    })();
    try {
        const readContractParameters = {
            address: universalResolverAddress,
            abi: universalResolverReverseAbi,
            args: [address, coinType, gatewayUrls ?? [localBatchGatewayUrl]],
            functionName: 'reverseWithGateways',
            blockNumber,
            blockTag,
        };
        const readContractAction = getAction(client, readContract, 'readContract');
        const [name] = await readContractAction(readContractParameters);
        return name || null;
    }
    catch (err) {
        if (strict)
            throw err;
        if (isNullUniversalResolverError(err))
            return null;
        throw err;
    }
}

/**
 * Gets resolver for ENS name.
 *
 * - Docs: https://viem.sh/docs/ens/actions/getEnsResolver
 * - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/ens
 *
 * Calls `findResolver(bytes)` on ENS Universal Resolver Contract to retrieve the resolver of an ENS name.
 *
 * Since ENS names prohibit certain forbidden characters (e.g. underscore) and have other validation rules, you likely want to [normalize ENS names](https://docs.ens.domains/contract-api-reference/name-processing#normalising-names) with [UTS-46 normalization](https://unicode.org/reports/tr46) before passing them to `getEnsAddress`. You can use the built-in [`normalize`](https://viem.sh/docs/ens/utilities/normalize) function for this.
 *
 * @param client - Client to use
 * @param parameters - {@link GetEnsResolverParameters}
 * @returns Address for ENS resolver. {@link GetEnsResolverReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { getEnsResolver, normalize } from 'viem/ens'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const resolverAddress = await getEnsResolver(client, {
 *   name: normalize('wevm.eth'),
 * })
 * // '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41'
 */
async function getEnsResolver(client, parameters) {
    const { blockNumber, blockTag, name } = parameters;
    const { chain } = client;
    const universalResolverAddress = (() => {
        if (parameters.universalResolverAddress)
            return parameters.universalResolverAddress;
        if (!chain)
            throw new Error('client chain not configured. universalResolverAddress is required.');
        return getChainContractAddress({
            blockNumber,
            chain,
            contract: 'ensUniversalResolver',
        });
    })();
    const tlds = chain?.ensTlds;
    if (tlds && !tlds.some((tld) => name.endsWith(tld)))
        throw new Error(`${name} is not a valid ENS TLD (${tlds?.join(', ')}) for chain "${chain.name}" (id: ${chain.id}).`);
    const [resolverAddress] = await getAction(client, readContract, 'readContract')({
        address: universalResolverAddress,
        abi: [
            {
                inputs: [{ type: 'bytes' }],
                name: 'findResolver',
                outputs: [
                    { type: 'address' },
                    { type: 'bytes32' },
                    { type: 'uint256' },
                ],
                stateMutability: 'view',
                type: 'function',
            },
        ],
        functionName: 'findResolver',
        args: [toHex(packetToBytes(name))],
        blockNumber,
        blockTag,
    });
    return resolverAddress;
}

/**
 * Creates an EIP-2930 access list.
 *
 * - Docs: https://viem.sh/docs/actions/public/createAccessList
 * - JSON-RPC Methods: `eth_createAccessList`
 *
 * @param client - Client to use
 * @param parameters - {@link CreateAccessListParameters}
 * @returns The access list. {@link CreateAccessListReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { createAccessList } from 'viem/public'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const data = await createAccessList(client, {
 *   account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
 *   data: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
 *   to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
 * })
 */
async function createAccessList(client, args) {
    const { account: account_ = client.account, blockNumber, blockTag = 'latest', blobs, data, gas, gasPrice, maxFeePerBlobGas, maxFeePerGas, maxPriorityFeePerGas, to, value, ...rest } = args;
    const account = account_ ? parseAccount(account_) : undefined;
    try {
        assertRequest(args);
        const blockNumberHex = typeof blockNumber === 'bigint' ? numberToHex(blockNumber) : undefined;
        const block = blockNumberHex || blockTag;
        const chainFormat = client.chain?.formatters?.transactionRequest?.format;
        const format = chainFormat || formatTransactionRequest;
        const request = format({
            // Pick out extra data that might exist on the chain's transaction request type.
            ...extract$1(rest, { format: chainFormat }),
            account,
            blobs,
            data,
            gas,
            gasPrice,
            maxFeePerBlobGas,
            maxFeePerGas,
            maxPriorityFeePerGas,
            to,
            value,
        }, 'createAccessList');
        const response = await client.request({
            method: 'eth_createAccessList',
            params: [request, block],
        });
        if (response.error)
            throw new BaseError(response.error, { details: response.error });
        return {
            accessList: response.accessList,
            gasUsed: BigInt(response.gasUsed),
        };
    }
    catch (err) {
        throw getCallError(err, {
            ...args,
            account,
            chain: client.chain,
        });
    }
}

/**
 * Creates a [`Filter`](https://viem.sh/docs/glossary/types#filter) to listen for new block hashes that can be used with [`getFilterChanges`](https://viem.sh/docs/actions/public/getFilterChanges).
 *
 * - Docs: https://viem.sh/docs/actions/public/createBlockFilter
 * - JSON-RPC Methods: [`eth_newBlockFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_newBlockFilter)
 *
 * @param client - Client to use
 * @returns [`Filter`](https://viem.sh/docs/glossary/types#filter). {@link CreateBlockFilterReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { createBlockFilter } from 'viem/public'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const filter = await createBlockFilter(client)
 * // { id: "0x345a6572337856574a76364e457a4366", type: 'block' }
 */
async function createBlockFilter(client) {
    const getRequest = createFilterRequestScope(client, {
        method: 'eth_newBlockFilter',
    });
    const id = await client.request({
        method: 'eth_newBlockFilter',
    });
    return { id, request: getRequest(id), type: 'block' };
}

/**
 * Creates a [`Filter`](https://viem.sh/docs/glossary/types#filter) to listen for new events that can be used with [`getFilterChanges`](https://viem.sh/docs/actions/public/getFilterChanges).
 *
 * - Docs: https://viem.sh/docs/actions/public/createEventFilter
 * - JSON-RPC Methods: [`eth_newFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_newfilter)
 *
 * @param client - Client to use
 * @param parameters - {@link CreateEventFilterParameters}
 * @returns [`Filter`](https://viem.sh/docs/glossary/types#filter). {@link CreateEventFilterReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { createEventFilter } from 'viem/public'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const filter = await createEventFilter(client, {
 *   address: '0xfba3912ca04dd458c843e2ee08967fc04f3579c2',
 * })
 */
async function createEventFilter(client, { address, args, event, events: events_, fromBlock, strict, toBlock, } = {}) {
    const events = events_ ?? (event ? [event] : undefined);
    const getRequest = createFilterRequestScope(client, {
        method: 'eth_newFilter',
    });
    let topics = [];
    if (events) {
        const encoded = events.flatMap((event) => encodeEventTopics({
            abi: [event],
            eventName: event.name,
            args,
        }));
        // TODO: Clean up type casting
        topics = [encoded];
        if (event)
            topics = topics[0];
    }
    const id = await client.request({
        method: 'eth_newFilter',
        params: [
            {
                address,
                fromBlock: typeof fromBlock === 'bigint' ? numberToHex(fromBlock) : fromBlock,
                toBlock: typeof toBlock === 'bigint' ? numberToHex(toBlock) : toBlock,
                ...(topics.length ? { topics } : {}),
            },
        ],
    });
    return {
        abi: events,
        args,
        eventName: event ? event.name : undefined,
        fromBlock,
        id,
        request: getRequest(id),
        strict: Boolean(strict),
        toBlock,
        type: 'event',
    };
}

/**
 * Creates a Filter to listen for new pending transaction hashes that can be used with [`getFilterChanges`](https://viem.sh/docs/actions/public/getFilterChanges).
 *
 * - Docs: https://viem.sh/docs/actions/public/createPendingTransactionFilter
 * - JSON-RPC Methods: [`eth_newPendingTransactionFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_newpendingtransactionfilter)
 *
 * @param client - Client to use
 * @returns [`Filter`](https://viem.sh/docs/glossary/types#filter). {@link CreateBlockFilterReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { createPendingTransactionFilter } from 'viem/public'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const filter = await createPendingTransactionFilter(client)
 * // { id: "0x345a6572337856574a76364e457a4366", type: 'transaction' }
 */
async function createPendingTransactionFilter(client) {
    const getRequest = createFilterRequestScope(client, {
        method: 'eth_newPendingTransactionFilter',
    });
    const id = await client.request({
        method: 'eth_newPendingTransactionFilter',
    });
    return { id, request: getRequest(id), type: 'transaction' };
}

/**
 * Returns the balance of an address in wei.
 *
 * - Docs: https://viem.sh/docs/actions/public/getBalance
 * - JSON-RPC Methods: [`eth_getBalance`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getbalance)
 *
 * You can convert the balance to ether units with [`formatEther`](https://viem.sh/docs/utilities/formatEther).
 *
 * ```ts
 * const balance = await getBalance(client, {
 *   address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
 *   blockTag: 'safe'
 * })
 * const balanceAsEther = formatEther(balance)
 * // "6.942"
 * ```
 *
 * @param client - Client to use
 * @param parameters - {@link GetBalanceParameters}
 * @returns The balance of the address in wei. {@link GetBalanceReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { getBalance } from 'viem/public'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const balance = await getBalance(client, {
 *   address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
 * })
 * // 10000000000000000000000n (wei)
 */
async function getBalance(client, { address, blockHash, blockNumber, blockTag = client.experimental_blockTag ?? 'latest', requireCanonical, }) {
    const block = formatBlockParameter({
        blockHash,
        blockNumber,
        blockTag,
        requireCanonical,
    });
    if (client.batch?.multicall && client.chain?.contracts?.multicall3) {
        const multicall3Address = client.chain.contracts.multicall3.address;
        const calldata = encodeFunctionData({
            abi: multicall3Abi,
            functionName: 'getEthBalance',
            args: [address],
        });
        const { data } = await getAction(client, call, 'call')({
            to: multicall3Address,
            data: calldata,
            blockHash,
            blockNumber,
            blockTag,
            requireCanonical,
        });
        return decodeFunctionResult({
            abi: multicall3Abi,
            functionName: 'getEthBalance',
            args: [address],
            data: data || '0x',
        });
    }
    const balance = await client.request({
        method: 'eth_getBalance',
        params: [address, block],
    });
    return BigInt(balance);
}

/**
 * Returns the base fee per blob gas in wei.
 *
 * - Docs: https://viem.sh/docs/actions/public/getBlobBaseFee
 * - JSON-RPC Methods: [`eth_blobBaseFee`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_blobBaseFee)
 *
 * @param client - Client to use
 * @returns The blob base fee (in wei). {@link GetBlobBaseFeeReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { getBlobBaseFee } from 'viem/public'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const blobBaseFee = await getBlobBaseFee(client)
 */
async function getBlobBaseFee(client) {
    const baseFee = await client.request({
        method: 'eth_blobBaseFee',
    });
    return BigInt(baseFee);
}

/**
 * Returns the transaction receipts of a block at a block number, hash, or tag.
 *
 * - Docs: https://viem.sh/docs/actions/public/getBlockReceipts
 * - JSON-RPC Methods: [`eth_getBlockReceipts`](https://ethereum.github.io/execution-apis/api/methods/eth_getBlockReceipts/)
 *
 * @param client - Client to use
 * @param parameters - {@link GetBlockReceiptsParameters}
 * @returns The transaction receipts. {@link GetBlockReceiptsReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { getBlockReceipts } from 'viem/public'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const receipts = await getBlockReceipts(client, {
 *   blockNumber: 69420n,
 * })
 */
async function getBlockReceipts(client, { blockHash, blockNumber, blockTag = client.experimental_blockTag ?? 'latest', } = {}) {
    const blockNumberHex = blockNumber !== undefined ? numberToHex(blockNumber) : undefined;
    const receipts = await client.request({
        method: 'eth_getBlockReceipts',
        params: [blockHash || blockNumberHex || blockTag],
    }, { dedupe: Boolean(blockHash || blockNumberHex) });
    if (!receipts)
        throw new BlockNotFoundError({ blockHash, blockNumber });
    const format = client.chain?.formatters?.transactionReceipt?.format ||
        formatTransactionReceipt;
    return receipts.map((receipt) => format(receipt, 'getBlockReceipts'));
}

/**
 * Returns the number of Transactions at a block number, hash, or tag.
 *
 * - Docs: https://viem.sh/docs/actions/public/getBlockTransactionCount
 * - JSON-RPC Methods:
 *   - Calls [`eth_getBlockTransactionCountByNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getblocktransactioncountbynumber) for `blockNumber` & `blockTag`.
 *   - Calls [`eth_getBlockTransactionCountByHash`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getblocktransactioncountbyhash) for `blockHash`.
 *
 * @param client - Client to use
 * @param parameters - {@link GetBlockTransactionCountParameters}
 * @returns The block transaction count. {@link GetBlockTransactionCountReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { getBlockTransactionCount } from 'viem/public'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const count = await getBlockTransactionCount(client)
 */
async function getBlockTransactionCount(client, { blockHash, blockNumber, blockTag = 'latest', } = {}) {
    const blockNumberHex = blockNumber !== undefined ? numberToHex(blockNumber) : undefined;
    let count;
    if (blockHash) {
        count = await client.request({
            method: 'eth_getBlockTransactionCountByHash',
            params: [blockHash],
        }, { dedupe: true });
    }
    else {
        count = await client.request({
            method: 'eth_getBlockTransactionCountByNumber',
            params: [blockNumberHex || blockTag],
        }, { dedupe: Boolean(blockNumberHex) });
    }
    return hexToNumber(count);
}

/**
 * Retrieves the bytecode at an address.
 *
 * - Docs: https://viem.sh/docs/contract/getCode
 * - JSON-RPC Methods: [`eth_getCode`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getcode)
 *
 * @param client - Client to use
 * @param parameters - {@link GetCodeParameters}
 * @returns The contract's bytecode. {@link GetCodeReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { getCode } from 'viem/contract'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const code = await getCode(client, {
 *   address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
 * })
 */
async function getCode(client, { address, blockHash, blockNumber, blockTag = 'latest', requireCanonical, }) {
    const block = formatBlockParameter({
        blockHash,
        blockNumber,
        blockTag,
        requireCanonical,
    });
    const hex = await client.request({
        method: 'eth_getCode',
        params: [address, block],
    }, {
        dedupe: typeof blockNumber === 'bigint' || blockHash !== undefined,
    });
    if (hex === '0x')
        return undefined;
    return hex;
}

/**
 * Returns the address that an account has delegated to via EIP-7702.
 *
 * - Docs: https://viem.sh/docs/actions/public/getDelegation
 *
 * @param client - Client to use
 * @param parameters - {@link GetDelegationParameters}
 * @returns The delegated address, or undefined if not delegated. {@link GetDelegationReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { getDelegation } from 'viem/actions'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const delegation = await getDelegation(client, {
 *   address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
 * })
 */
async function getDelegation(client, { address, blockNumber, blockTag = 'latest' }) {
    const code = await getCode(client, {
        address,
        ...(blockNumber !== undefined ? { blockNumber } : { blockTag }),
    });
    if (!code)
        return undefined;
    // EIP-7702 delegation designator: 0xef0100 prefix (3 bytes) + address (20 bytes) = 23 bytes
    if (size$1(code) !== 23)
        return undefined;
    // Check for EIP-7702 delegation designator prefix
    if (!code.startsWith('0xef0100'))
        return undefined;
    // Extract the delegated address (bytes 3-23) and checksum it
    return getAddress(slice$1(code, 3, 23));
}

class Eip712DomainNotFoundError extends BaseError {
    constructor({ address }) {
        super(`No EIP-712 domain found on contract "${address}".`, {
            metaMessages: [
                'Ensure that:',
                `- The contract is deployed at the address "${address}".`,
                '- `eip712Domain()` function exists on the contract.',
                '- `eip712Domain()` function matches signature to ERC-5267 specification.',
            ],
            name: 'Eip712DomainNotFoundError',
        });
    }
}

/**
 * Reads the EIP-712 domain from a contract, based on the ERC-5267 specification.
 *
 * @param client - A {@link Client} instance.
 * @param parameters - The parameters of the action. {@link GetEip712DomainParameters}
 * @returns The EIP-712 domain, fields, and extensions. {@link GetEip712DomainReturnType}
 *
 * @example
 * ```ts
 * import { createPublicClient, http, getEip712Domain } from 'viem'
 * import { mainnet } from 'viem/chains'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 *
 * const domain = await getEip712Domain(client, {
 *   address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
 * })
 * // {
 * //   domain: {
 * //     name: 'ExampleContract',
 * //     version: '1',
 * //     chainId: 1,
 * //     verifyingContract: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
 * //   },
 * //   fields: '0x0f',
 * //   extensions: [],
 * // }
 * ```
 */
async function getEip712Domain(client, parameters) {
    const { address, factory, factoryData } = parameters;
    try {
        const [fields, name, version, chainId, verifyingContract, salt, extensions,] = await getAction(client, readContract, 'readContract')({
            abi,
            address,
            functionName: 'eip712Domain',
            factory,
            factoryData,
        });
        return {
            domain: {
                name,
                version,
                chainId: Number(chainId),
                verifyingContract,
                salt,
            },
            extensions,
            fields,
        };
    }
    catch (e) {
        const error = e;
        if (error.name === 'ContractFunctionExecutionError' &&
            error.cause.name === 'ContractFunctionZeroDataError') {
            throw new Eip712DomainNotFoundError({ address });
        }
        throw error;
    }
}
const abi = [
    {
        inputs: [],
        name: 'eip712Domain',
        outputs: [
            { name: 'fields', type: 'bytes1' },
            { name: 'name', type: 'string' },
            { name: 'version', type: 'string' },
            { name: 'chainId', type: 'uint256' },
            { name: 'verifyingContract', type: 'address' },
            { name: 'salt', type: 'bytes32' },
            { name: 'extensions', type: 'uint256[]' },
        ],
        stateMutability: 'view',
        type: 'function',
    },
];

function formatFeeHistory(feeHistory) {
    return {
        baseFeePerGas: feeHistory.baseFeePerGas.map((value) => BigInt(value)),
        gasUsedRatio: feeHistory.gasUsedRatio,
        oldestBlock: BigInt(feeHistory.oldestBlock),
        reward: feeHistory.reward?.map((reward) => reward.map((value) => BigInt(value))),
    };
}

/**
 * Returns a collection of historical gas information.
 *
 * - Docs: https://viem.sh/docs/actions/public/getFeeHistory
 * - JSON-RPC Methods: [`eth_feeHistory`](https://docs.alchemy.com/reference/eth-feehistory)
 *
 * @param client - Client to use
 * @param parameters - {@link GetFeeHistoryParameters}
 * @returns The gas estimate (in wei). {@link GetFeeHistoryReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { getFeeHistory } from 'viem/public'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const feeHistory = await getFeeHistory(client, {
 *   blockCount: 4,
 *   rewardPercentiles: [25, 75],
 * })
 */
async function getFeeHistory(client, { blockCount, blockNumber, blockTag = 'latest', rewardPercentiles, }) {
    const blockNumberHex = typeof blockNumber === 'bigint' ? numberToHex(blockNumber) : undefined;
    const feeHistory = await client.request({
        method: 'eth_feeHistory',
        params: [
            numberToHex(blockCount),
            blockNumberHex || blockTag,
            rewardPercentiles,
        ],
    }, { dedupe: Boolean(blockNumberHex) });
    return formatFeeHistory(feeHistory);
}

/**
 * Returns a list of event logs since the filter was created.
 *
 * - Docs: https://viem.sh/docs/actions/public/getFilterLogs
 * - JSON-RPC Methods: [`eth_getFilterLogs`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getfilterlogs)
 *
 * `getFilterLogs` is only compatible with **event filters**.
 *
 * @param client - Client to use
 * @param parameters - {@link GetFilterLogsParameters}
 * @returns A list of event logs. {@link GetFilterLogsReturnType}
 *
 * @example
 * import { createPublicClient, http, parseAbiItem } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { createEventFilter, getFilterLogs } from 'viem/public'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const filter = await createEventFilter(client, {
 *   address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
 *   event: parseAbiItem('event Transfer(address indexed, address indexed, uint256)'),
 * })
 * const logs = await getFilterLogs(client, { filter })
 */
async function getFilterLogs(_client, { filter, }) {
    const strict = filter.strict ?? false;
    const logs = await filter.request({
        method: 'eth_getFilterLogs',
        params: [filter.id],
    });
    const formattedLogs = logs.map((log) => formatLog(log));
    if (!filter.abi)
        return formattedLogs;
    return parseEventLogs({
        abi: filter.abi,
        logs: formattedLogs,
        strict,
    });
}

/**
 * Verify that an Authorization object was signed by the provided address.
 *
 * - Docs {@link https://viem.sh/docs/utilities/verifyAuthorization}
 *
 * @param parameters - {@link VerifyAuthorizationParameters}
 * @returns Whether or not the signature is valid. {@link VerifyAuthorizationReturnType}
 */
async function verifyAuthorization({ address, authorization, signature, }) {
    return isAddressEqual(getAddress(address), await recoverAuthorizationAddress({
        authorization,
        signature,
    }));
}

/**
 * @internal
 *
 * Map with a LRU (Least recently used) policy.
 * @see https://en.wikipedia.org/wiki/Cache_replacement_policies#LRU
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

const caches = {
    checksum: /*#__PURE__*/ new LruMap(8192),
};
const checksum$1 = caches.checksum;

/**
 * Calculates the [Keccak256](https://en.wikipedia.org/wiki/SHA-3) hash of a {@link ox#Bytes.Bytes} or {@link ox#Hex.Hex} value.
 *
 * This function is a re-export of `keccak_256` from [`@noble/hashes`](https://github.com/paulmillr/noble-hashes), an audited & minimal JS hashing library.
 *
 * @example
 * ```ts twoslash
 * import { Hash } from 'ox'
 *
 * Hash.keccak256('0xdeadbeef')
 * // @log: '0xd4fd4e189132273036449fc9e11198c739161b4c0116a9a2dccdfa1c492006f1'
 * ```
 *
 * @example
 * ### Calculate Hash of a String
 *
 * ```ts twoslash
 * import { Hash, Hex } from 'ox'
 *
 * Hash.keccak256(Hex.fromString('hello world'))
 * // @log: '0x3ea2f1d0abf3fc66cf29eebb70cbd4e7fe762ef8a09bcc06c8edf641230afec0'
 * ```
 *
 * @example
 * ### Configure Return Type
 *
 * ```ts twoslash
 * import { Hash } from 'ox'
 *
 * Hash.keccak256('0xdeadbeef', { as: 'Bytes' })
 * // @log: Uint8Array [...]
 * ```
 *
 * @param value - {@link ox#Bytes.Bytes} or {@link ox#Hex.Hex} value.
 * @param options - Options.
 * @returns Keccak256 hash.
 */
function keccak256(value, options = {}) {
    const { as = typeof value === 'string' ? 'Hex' : 'Bytes' } = options;
    const bytes = keccak_256(from$6(value));
    if (as === 'Bytes')
        return bytes;
    return fromBytes$1(bytes);
}

const addressRegex = /^0x[a-fA-F0-9]{40}$/;
/**
 * Asserts that the given value is a valid {@link ox#Address.Address}.
 *
 * @example
 * ```ts twoslash
 * import { Address } from 'ox'
 *
 * Address.assert('0xA0Cf798816D4b9b9866b5330EEa46a18382f251e')
 * ```
 *
 * @example
 * ```ts twoslash
 * import { Address } from 'ox'
 *
 * Address.assert('0xdeadbeef')
 * // @error: InvalidAddressError: Address "0xdeadbeef" is invalid.
 * ```
 *
 * @param value - Value to assert if it is a valid address.
 * @param options - Assertion options.
 */
function assert$3(value, options = {}) {
    const { strict = true } = options;
    if (!addressRegex.test(value))
        throw new InvalidAddressError({
            address: value,
            cause: new InvalidInputError(),
        });
    if (strict) {
        if (value.toLowerCase() === value)
            return;
        if (checksum(value) !== value)
            throw new InvalidAddressError({
                address: value,
                cause: new InvalidChecksumError(),
            });
    }
}
/**
 * Computes the checksum address for the given {@link ox#Address.Address}.
 *
 * @example
 * ```ts twoslash
 * import { Address } from 'ox'
 *
 * Address.checksum('0xa0cf798816d4b9b9866b5330eea46a18382f251e')
 * // @log: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e'
 * ```
 *
 * @param address - The address to compute the checksum for.
 * @returns The checksummed address.
 */
function checksum(address) {
    if (checksum$1.has(address))
        return checksum$1.get(address);
    assert$3(address, { strict: false });
    const hexAddress = address.substring(2).toLowerCase();
    const hash = keccak256(fromString(hexAddress), { as: 'Bytes' });
    const characters = hexAddress.split('');
    for (let i = 0; i < 40; i += 2) {
        if (hash[i >> 1] >> 4 >= 8 && characters[i]) {
            characters[i] = characters[i].toUpperCase();
        }
        if ((hash[i >> 1] & 0x0f) >= 8 && characters[i + 1]) {
            characters[i + 1] = characters[i + 1].toUpperCase();
        }
    }
    const result = `0x${characters.join('')}`;
    checksum$1.set(address, result);
    return result;
}
/**
 * Checks if the given address is a valid {@link ox#Address.Address}.
 *
 * @example
 * ```ts twoslash
 * import { Address } from 'ox'
 *
 * Address.validate('0xA0Cf798816D4b9b9866b5330EEa46a18382f251e')
 * // @log: true
 * ```
 *
 * @example
 * ```ts twoslash
 * import { Address } from 'ox'
 *
 * Address.validate('0xdeadbeef')
 * // @log: false
 * ```
 *
 * @param address - Value to check if it is a valid address.
 * @param options - Check options.
 * @returns Whether the address is a valid address.
 */
function validate$2(address, options = {}) {
    const { strict = true } = options ?? {};
    try {
        assert$3(address, { strict });
        return true;
    }
    catch {
        return false;
    }
}
/**
 * Thrown when an address is invalid.
 *
 * @example
 * ```ts twoslash
 * import { Address } from 'ox'
 *
 * Address.from('0x123')
 * // @error: Address.InvalidAddressError: Address `0x123` is invalid.
 * ```
 */
class InvalidAddressError extends BaseError$1 {
    constructor({ address, cause }) {
        super(`Address "${address}" is invalid.`, {
            cause,
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'Address.InvalidAddressError'
        });
    }
}
/** Thrown when an address is not a 20 byte (40 hexadecimal character) value. */
class InvalidInputError extends BaseError$1 {
    constructor() {
        super('Address is not a 20 byte (40 hexadecimal character) value.');
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'Address.InvalidInputError'
        });
    }
}
/** Thrown when an address does not match its checksum counterpart. */
class InvalidChecksumError extends BaseError$1 {
    constructor() {
        super('Address does not match its checksum counterpart.');
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'Address.InvalidChecksumError'
        });
    }
}

const arrayRegex = /^(.*)\[([0-9]*)\]$/;
// `bytes<M>`: binary type of `M` bytes, `0 < M <= 32`
// https://regexr.com/6va55
const bytesRegex = /^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/;
// `(u)int<M>`: (un)signed integer type of `M` bits, `0 < M <= 256`, `M % 8 == 0`
// https://regexr.com/6v8hp
const integerRegex = /^(u?int)(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/;
const maxUint256 = 2n ** 256n - 1n;

/** @internal */
function decodeParameter(cursor, param, options) {
    const { checksumAddress, staticPosition } = options;
    const arrayComponents = getArrayComponents(param.type);
    if (arrayComponents) {
        const [length, type] = arrayComponents;
        return decodeArray(cursor, { ...param, type }, { checksumAddress, length, staticPosition });
    }
    if (param.type === 'tuple')
        return decodeTuple(cursor, param, {
            checksumAddress,
            staticPosition,
        });
    if (param.type === 'address')
        return decodeAddress(cursor, { checksum: checksumAddress });
    if (param.type === 'bool')
        return decodeBool(cursor);
    if (param.type.startsWith('bytes'))
        return decodeBytes(cursor, param, { staticPosition });
    if (param.type.startsWith('uint') || param.type.startsWith('int'))
        return decodeNumber(cursor, param);
    if (param.type === 'string')
        return decodeString(cursor, { staticPosition });
    throw new InvalidTypeError(param.type);
}
const sizeOfLength = 32;
const sizeOfOffset = 32;
/** @internal */
function decodeAddress(cursor, options = {}) {
    const { checksum: checksum$1 = false } = options;
    const value = cursor.readBytes(32);
    const wrap = (address) => checksum$1 ? checksum(address) : address;
    return [wrap(fromBytes$1(slice(value, -20))), 32];
}
/** @internal */
function decodeArray(cursor, param, options) {
    const { checksumAddress, length, staticPosition } = options;
    // If the length of the array is not known in advance (dynamic array),
    // this means we will need to wonder off to the pointer and decode.
    if (!length) {
        // Dealing with a dynamic type, so get the offset of the array data.
        const offset = toNumber(cursor.readBytes(sizeOfOffset));
        // Start is the static position of current slot + offset.
        const start = staticPosition + offset;
        const startOfData = start + sizeOfLength;
        // Get the length of the array from the offset.
        cursor.setPosition(start);
        const length = toNumber(cursor.readBytes(sizeOfLength));
        // Check if the array has any dynamic children.
        const dynamicChild = hasDynamicChild(param);
        let consumed = 0;
        const value = [];
        for (let i = 0; i < length; ++i) {
            // If any of the children is dynamic, then all elements will be offset pointer, thus size of one slot (32 bytes).
            // Otherwise, elements will be the size of their encoding (consumed bytes).
            cursor.setPosition(startOfData + (dynamicChild ? i * 32 : consumed));
            const [data, consumed_] = decodeParameter(cursor, param, {
                checksumAddress,
                staticPosition: startOfData,
            });
            consumed += consumed_;
            value.push(data);
        }
        // As we have gone wondering, restore to the original position + next slot.
        cursor.setPosition(staticPosition + 32);
        return [value, 32];
    }
    // If the length of the array is known in advance,
    // and the length of an element deeply nested in the array is not known,
    // we need to decode the offset of the array data.
    if (hasDynamicChild(param)) {
        // Dealing with dynamic types, so get the offset of the array data.
        const offset = toNumber(cursor.readBytes(sizeOfOffset));
        // Start is the static position of current slot + offset.
        const start = staticPosition + offset;
        const value = [];
        for (let i = 0; i < length; ++i) {
            // Move cursor along to the next slot (next offset pointer).
            cursor.setPosition(start + i * 32);
            const [data] = decodeParameter(cursor, param, {
                checksumAddress,
                staticPosition: start,
            });
            value.push(data);
        }
        // As we have gone wondering, restore to the original position + next slot.
        cursor.setPosition(staticPosition + 32);
        return [value, 32];
    }
    // If the length of the array is known in advance and the array is deeply static,
    // then we can just decode each element in sequence.
    let consumed = 0;
    const value = [];
    for (let i = 0; i < length; ++i) {
        const [data, consumed_] = decodeParameter(cursor, param, {
            checksumAddress,
            staticPosition: staticPosition + consumed,
        });
        consumed += consumed_;
        value.push(data);
    }
    return [value, consumed];
}
/** @internal */
function decodeBool(cursor) {
    return [toBoolean(cursor.readBytes(32), { size: 32 }), 32];
}
/** @internal */
function decodeBytes(cursor, param, { staticPosition }) {
    const [_, size] = param.type.split('bytes');
    if (!size) {
        // Dealing with dynamic types, so get the offset of the bytes data.
        const offset = toNumber(cursor.readBytes(32));
        // Set position of the cursor to start of bytes data.
        cursor.setPosition(staticPosition + offset);
        const length = toNumber(cursor.readBytes(32));
        // If there is no length, we have zero data.
        if (length === 0) {
            // As we have gone wondering, restore to the original position + next slot.
            cursor.setPosition(staticPosition + 32);
            return ['0x', 32];
        }
        const data = cursor.readBytes(length);
        // As we have gone wondering, restore to the original position + next slot.
        cursor.setPosition(staticPosition + 32);
        return [fromBytes$1(data), 32];
    }
    const value = fromBytes$1(cursor.readBytes(Number.parseInt(size, 10), 32));
    return [value, 32];
}
/** @internal */
function decodeNumber(cursor, param) {
    const signed = param.type.startsWith('int');
    const size = Number.parseInt(param.type.split('int')[1] || '256', 10);
    const value = cursor.readBytes(32);
    return [
        size > 48
            ? toBigInt(value, { signed })
            : toNumber(value, { signed }),
        32,
    ];
}
/** @internal */
function decodeTuple(cursor, param, options) {
    const { checksumAddress, staticPosition } = options;
    // Tuples can have unnamed components (i.e. they are arrays), so we must
    // determine whether the tuple is named or unnamed. In the case of a named
    // tuple, the value will be an object where each property is the name of the
    // component. In the case of an unnamed tuple, the value will be an array.
    const hasUnnamedChild = param.components.length === 0 || param.components.some(({ name }) => !name);
    // Initialize the value to an object or an array, depending on whether the
    // tuple is named or unnamed.
    const value = hasUnnamedChild ? [] : {};
    let consumed = 0;
    // If the tuple has a dynamic child, we must first decode the offset to the
    // tuple data.
    if (hasDynamicChild(param)) {
        // Dealing with dynamic types, so get the offset of the tuple data.
        const offset = toNumber(cursor.readBytes(sizeOfOffset));
        // Start is the static position of referencing slot + offset.
        const start = staticPosition + offset;
        for (let i = 0; i < param.components.length; ++i) {
            const component = param.components[i];
            cursor.setPosition(start + consumed);
            const [data, consumed_] = decodeParameter(cursor, component, {
                checksumAddress,
                staticPosition: start,
            });
            consumed += consumed_;
            value[hasUnnamedChild ? i : component?.name] = data;
        }
        // As we have gone wondering, restore to the original position + next slot.
        cursor.setPosition(staticPosition + 32);
        return [value, 32];
    }
    // If the tuple has static children, we can just decode each component
    // in sequence.
    for (let i = 0; i < param.components.length; ++i) {
        const component = param.components[i];
        const [data, consumed_] = decodeParameter(cursor, component, {
            checksumAddress,
            staticPosition,
        });
        value[hasUnnamedChild ? i : component?.name] = data;
        consumed += consumed_;
    }
    return [value, consumed];
}
/** @internal */
function decodeString(cursor, { staticPosition }) {
    // Get offset to start of string data.
    const offset = toNumber(cursor.readBytes(32));
    // Start is the static position of current slot + offset.
    const start = staticPosition + offset;
    cursor.setPosition(start);
    const length = toNumber(cursor.readBytes(32));
    // If there is no length, we have zero data (empty string).
    if (length === 0) {
        cursor.setPosition(staticPosition + 32);
        return ['', 32];
    }
    const data = cursor.readBytes(length, 32);
    const value = toString(trimLeft(data));
    // As we have gone wondering, restore to the original position + next slot.
    cursor.setPosition(staticPosition + 32);
    return [value, 32];
}
/** @internal */
function prepareParameters({ checksumAddress, parameters, values, }) {
    const preparedParameters = [];
    for (let i = 0; i < parameters.length; i++) {
        preparedParameters.push(prepareParameter({
            checksumAddress,
            parameter: parameters[i],
            value: values[i],
        }));
    }
    return preparedParameters;
}
/** @internal */
function prepareParameter({ checksumAddress = false, parameter: parameter_, value, }) {
    const parameter = parameter_;
    const arrayComponents = getArrayComponents(parameter.type);
    if (arrayComponents) {
        const [length, type] = arrayComponents;
        return encodeArray(value, {
            checksumAddress,
            length,
            parameter: {
                ...parameter,
                type,
            },
        });
    }
    if (parameter.type === 'tuple') {
        return encodeTuple(value, {
            checksumAddress,
            parameter: parameter,
        });
    }
    if (parameter.type === 'address') {
        return encodeAddress(value, {
            checksum: checksumAddress,
        });
    }
    if (parameter.type === 'bool') {
        return encodeBoolean(value);
    }
    if (parameter.type.startsWith('uint') || parameter.type.startsWith('int')) {
        const signed = parameter.type.startsWith('int');
        const [, , size = '256'] = integerRegex.exec(parameter.type) ?? [];
        return encodeNumber(value, {
            signed,
            size: Number(size),
        });
    }
    if (parameter.type.startsWith('bytes')) {
        return encodeBytes(value, { type: parameter.type });
    }
    if (parameter.type === 'string') {
        return encodeString(value);
    }
    throw new InvalidTypeError(parameter.type);
}
/** @internal */
function encode$2(preparedParameters) {
    // 1. Compute the size of the static part of the parameters.
    let staticSize = 0;
    for (let i = 0; i < preparedParameters.length; i++) {
        const { dynamic, encoded } = preparedParameters[i];
        if (dynamic)
            staticSize += 32;
        else
            staticSize += size$2(encoded);
    }
    // 2. Split the parameters into static and dynamic parts.
    const staticParameters = [];
    const dynamicParameters = [];
    let dynamicSize = 0;
    for (let i = 0; i < preparedParameters.length; i++) {
        const { dynamic, encoded } = preparedParameters[i];
        if (dynamic) {
            staticParameters.push(fromNumber(staticSize + dynamicSize, { size: 32 }));
            dynamicParameters.push(encoded);
            dynamicSize += size$2(encoded);
        }
        else {
            staticParameters.push(encoded);
        }
    }
    // 3. Concatenate static and dynamic parts.
    return concat$1(...staticParameters, ...dynamicParameters);
}
/** @internal */
function encodeAddress(value, options) {
    const { checksum = false } = options;
    assert$3(value, { strict: checksum });
    return {
        dynamic: false,
        encoded: padLeft(value.toLowerCase()),
    };
}
/** @internal */
function encodeArray(value, options) {
    const { checksumAddress, length, parameter } = options;
    const dynamic = length === null;
    if (!Array.isArray(value))
        throw new InvalidArrayError(value);
    if (!dynamic && value.length !== length)
        throw new ArrayLengthMismatchError({
            expectedLength: length,
            givenLength: value.length,
            type: `${parameter.type}[${length}]`,
        });
    let dynamicChild = false;
    const preparedParameters = [];
    for (let i = 0; i < value.length; i++) {
        const preparedParam = prepareParameter({
            checksumAddress,
            parameter,
            value: value[i],
        });
        if (preparedParam.dynamic)
            dynamicChild = true;
        preparedParameters.push(preparedParam);
    }
    if (dynamic || dynamicChild) {
        const data = encode$2(preparedParameters);
        if (dynamic) {
            const length = fromNumber(preparedParameters.length, { size: 32 });
            return {
                dynamic: true,
                encoded: preparedParameters.length > 0 ? concat$1(length, data) : length,
            };
        }
        if (dynamicChild)
            return { dynamic: true, encoded: data };
    }
    return {
        dynamic: false,
        encoded: concat$1(...preparedParameters.map(({ encoded }) => encoded)),
    };
}
/** @internal */
function encodeBytes(value, { type }) {
    const [, parametersize] = type.split('bytes');
    const bytesSize = size$2(value);
    if (!parametersize) {
        let value_ = value;
        // If the size is not divisible by 32 bytes, pad the end
        // with empty bytes to the ceiling 32 bytes.
        if (bytesSize % 32 !== 0)
            value_ = padRight$1(value_, Math.ceil((value.length - 2) / 2 / 32) * 32);
        return {
            dynamic: true,
            encoded: concat$1(padLeft(fromNumber(bytesSize, { size: 32 })), value_),
        };
    }
    if (bytesSize !== Number.parseInt(parametersize, 10))
        throw new BytesSizeMismatchError({
            expectedSize: Number.parseInt(parametersize, 10),
            value,
        });
    return { dynamic: false, encoded: padRight$1(value) };
}
/** @internal */
function encodeBoolean(value) {
    if (typeof value !== 'boolean')
        throw new BaseError$1(`Invalid boolean value: "${value}" (type: ${typeof value}). Expected: \`true\` or \`false\`.`);
    return { dynamic: false, encoded: padLeft(fromBoolean(value)) };
}
/** @internal */
function encodeNumber(value, { signed, size }) {
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
        encoded: fromNumber(value, {
            size: 32,
            signed,
        }),
    };
}
/** @internal */
function encodeString(value) {
    const hexValue = fromString$1(value);
    const partsLength = Math.ceil(size$2(hexValue) / 32);
    const parts = [];
    for (let i = 0; i < partsLength; i++) {
        parts.push(padRight$1(slice$2(hexValue, i * 32, (i + 1) * 32)));
    }
    return {
        dynamic: true,
        encoded: concat$1(padRight$1(fromNumber(size$2(hexValue), { size: 32 })), ...parts),
    };
}
/** @internal */
function encodeTuple(value, options) {
    const { checksumAddress, parameter } = options;
    let dynamic = false;
    const preparedParameters = [];
    for (let i = 0; i < parameter.components.length; i++) {
        const param_ = parameter.components[i];
        const index = Array.isArray(value) ? i : param_.name;
        const preparedParam = prepareParameter({
            checksumAddress,
            parameter: param_,
            value: value[index],
        });
        preparedParameters.push(preparedParam);
        if (preparedParam.dynamic)
            dynamic = true;
    }
    return {
        dynamic,
        encoded: dynamic
            ? encode$2(preparedParameters)
            : concat$1(...preparedParameters.map(({ encoded }) => encoded)),
    };
}
/** @internal */
function getArrayComponents(type) {
    const matches = type.match(/^(.*)\[(\d+)?\]$/);
    return matches
        ? // Return `null` if the array is dynamic.
            [matches[2] ? Number(matches[2]) : null, matches[1]]
        : undefined;
}
/** @internal */
function hasDynamicChild(param) {
    const { type } = param;
    if (type === 'string')
        return true;
    if (type === 'bytes')
        return true;
    if (type.endsWith('[]'))
        return true;
    if (type === 'tuple')
        return param.components?.some(hasDynamicChild);
    const arrayComponents = getArrayComponents(param.type);
    if (arrayComponents &&
        hasDynamicChild({
            ...param,
            type: arrayComponents[1],
        }))
        return true;
    return false;
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
/** @internal */
function create(bytes, { recursiveReadLimit = 8_192 } = {}) {
    const cursor = Object.create(staticCursor);
    cursor.bytes = bytes;
    cursor.dataView = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    cursor.positionReadCount = new Map();
    cursor.recursiveReadLimit = recursiveReadLimit;
    return cursor;
}
/** @internal */
class NegativeOffsetError extends BaseError$1 {
    constructor({ offset }) {
        super(`Offset \`${offset}\` cannot be negative.`);
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'Cursor.NegativeOffsetError'
        });
    }
}
/** @internal */
class PositionOutOfBoundsError extends BaseError$1 {
    constructor({ length, position }) {
        super(`Position \`${position}\` is out of bounds (\`0 < position < ${length}\`).`);
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'Cursor.PositionOutOfBoundsError'
        });
    }
}
/** @internal */
class RecursiveReadLimitExceededError extends BaseError$1 {
    constructor({ count, limit }) {
        super(`Recursive read limit of \`${limit}\` exceeded (recursive read count: \`${count}\`).`);
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'Cursor.RecursiveReadLimitExceededError'
        });
    }
}

// eslint-disable-next-line jsdoc/require-jsdoc
function decode(parameters, data, options = {}) {
    const { as = 'Array', checksumAddress = false } = options;
    const bytes = typeof data === 'string' ? fromHex$1(data) : data;
    const cursor = create(bytes);
    if (size(bytes) === 0 && parameters.length > 0)
        throw new ZeroDataError();
    if (size(bytes) && size(bytes) < 32)
        throw new DataSizeTooSmallError({
            data: typeof data === 'string' ? data : fromBytes$1(data),
            parameters: parameters,
            size: size(bytes),
        });
    let consumed = 0;
    const values = as === 'Array' ? [] : {};
    for (let i = 0; i < parameters.length; ++i) {
        const param = parameters[i];
        cursor.setPosition(consumed);
        const [data, consumed_] = decodeParameter(cursor, param, {
            checksumAddress,
            staticPosition: 0,
        });
        consumed += consumed_;
        if (as === 'Array')
            values.push(data);
        else
            values[param.name ?? i] = data;
    }
    return values;
}
/**
 * Encodes primitive values into ABI encoded data as per the [Application Binary Interface (ABI) Specification](https://docs.soliditylang.org/en/latest/abi-spec).
 *
 * @example
 * ```ts twoslash
 * import { AbiParameters } from 'ox'
 *
 * const data = AbiParameters.encode(
 *   AbiParameters.from(['string', 'uint', 'bool']),
 *   ['wagmi', 420n, true],
 * )
 * ```
 *
 * @example
 * ### JSON Parameters
 *
 * Specify **JSON ABI** Parameters as schema:
 *
 * ```ts twoslash
 * import { AbiParameters } from 'ox'
 *
 * const data = AbiParameters.encode(
 *   [
 *     { type: 'string', name: 'name' },
 *     { type: 'uint', name: 'age' },
 *     { type: 'bool', name: 'isOwner' },
 *   ],
 *   ['wagmi', 420n, true],
 * )
 * ```
 *
 * @param parameters - The set of ABI parameters to encode, in the shape of the `inputs` or `outputs` attribute of an ABI Item. These parameters must include valid [ABI types](https://docs.soliditylang.org/en/latest/types.html).
 * @param values - The set of primitive values that correspond to the ABI types defined in `parameters`.
 * @returns ABI encoded data.
 */
function encode$1(parameters, values, options) {
    const { checksumAddress = false } = {};
    if (parameters.length !== values.length)
        throw new LengthMismatchError({
            expectedLength: parameters.length,
            givenLength: values.length,
        });
    // Prepare the parameters to determine dynamic types to encode.
    const preparedParameters = prepareParameters({
        checksumAddress,
        parameters: parameters,
        values: values,
    });
    const data = encode$2(preparedParameters);
    if (data.length === 0)
        return '0x';
    return data;
}
/**
 * Encodes an array of primitive values to a [packed ABI encoding](https://docs.soliditylang.org/en/latest/abi-spec.html#non-standard-packed-mode).
 *
 * @example
 * ```ts twoslash
 * import { AbiParameters } from 'ox'
 *
 * const encoded = AbiParameters.encodePacked(
 *   ['address', 'string'],
 *   ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045', 'hello world'],
 * )
 * // @log: '0xd8da6bf26964af9d7eed9e03e53415d37aa9604568656c6c6f20776f726c64'
 * ```
 *
 * @param types - Set of ABI types to pack encode.
 * @param values - The set of primitive values that correspond to the ABI types defined in `types`.
 * @returns The encoded packed data.
 */
function encodePacked(types, values) {
    if (types.length !== values.length)
        throw new LengthMismatchError({
            expectedLength: types.length,
            givenLength: values.length,
        });
    const data = [];
    for (let i = 0; i < types.length; i++) {
        const type = types[i];
        const value = values[i];
        data.push(encodePacked.encode(type, value));
    }
    return concat$1(...data);
}
(function (encodePacked) {
    // eslint-disable-next-line jsdoc/require-jsdoc
    function encode(type, value, isArray = false) {
        if (type === 'address') {
            const address = value;
            assert$3(address);
            return padLeft(address.toLowerCase(), isArray ? 32 : 0);
        }
        if (type === 'string')
            return fromString$1(value);
        if (type === 'bytes')
            return value;
        if (type === 'bool')
            return padLeft(fromBoolean(value), isArray ? 32 : 1);
        const intMatch = type.match(integerRegex);
        if (intMatch) {
            const [_type, baseType, bits = '256'] = intMatch;
            const size = Number.parseInt(bits, 10) / 8;
            return fromNumber(value, {
                size: isArray ? 32 : size,
                signed: baseType === 'int',
            });
        }
        const bytesMatch = type.match(bytesRegex);
        if (bytesMatch) {
            const [_type, size] = bytesMatch;
            if (Number.parseInt(size, 10) !== (value.length - 2) / 2)
                throw new BytesSizeMismatchError({
                    expectedSize: Number.parseInt(size, 10),
                    value: value,
                });
            return padRight$1(value, isArray ? 32 : 0);
        }
        const arrayMatch = type.match(arrayRegex);
        if (arrayMatch && Array.isArray(value)) {
            const [_type, childType] = arrayMatch;
            const data = [];
            for (let i = 0; i < value.length; i++) {
                data.push(encode(childType, value[i], true));
            }
            if (data.length === 0)
                return '0x';
            return concat$1(...data);
        }
        throw new InvalidTypeError(type);
    }
    encodePacked.encode = encode;
})(encodePacked || (encodePacked = {}));
/**
 * Parses arbitrary **JSON ABI Parameters** or **Human Readable ABI Parameters** into typed {@link ox#AbiParameters.AbiParameters}.
 *
 * @example
 * ### JSON Parameters
 *
 * ```ts twoslash
 * import { AbiParameters } from 'ox'
 *
 * const parameters = AbiParameters.from([
 *   {
 *     name: 'spender',
 *     type: 'address',
 *   },
 *   {
 *     name: 'amount',
 *     type: 'uint256',
 *   },
 * ])
 *
 * parameters
 * //^?
 *
 *
 *
 *
 *
 *
 *
 * ```
 *
 * @example
 * ### Human Readable Parameters
 *
 * Human Readable ABI Parameters can be parsed into a typed {@link ox#AbiParameters.AbiParameters}:
 *
 * ```ts twoslash
 * import { AbiParameters } from 'ox'
 *
 * const parameters = AbiParameters.from('address spender, uint256 amount')
 *
 * parameters
 * //^?
 *
 *
 *
 *
 *
 *
 *
 * ```
 *
 * @example
 * It is possible to specify `struct`s along with your definitions:
 *
 * ```ts twoslash
 * import { AbiParameters } from 'ox'
 *
 * const parameters = AbiParameters.from([
 *   'struct Foo { address spender; uint256 amount; }', // [!code hl]
 *   'Foo foo, address bar',
 * ])
 *
 * parameters
 * //^?
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 * ```
 *
 *
 *
 * @param parameters - The ABI Parameters to parse.
 * @returns The typed ABI Parameters.
 */
function from$5(parameters) {
    if (Array.isArray(parameters) && typeof parameters[0] === 'string')
        return parseAbiParameters(parameters);
    if (typeof parameters === 'string')
        return parseAbiParameters(parameters);
    return parameters;
}
/**
 * Throws when the data size is too small for the given parameters.
 *
 * @example
 * ```ts twoslash
 * import { AbiParameters } from 'ox'
 *
 * AbiParameters.decode([{ type: 'uint256' }], '0x010f')
 * //                                             ↑ ❌ 2 bytes
 * // @error: AbiParameters.DataSizeTooSmallError: Data size of 2 bytes is too small for given parameters.
 * // @error: Params: (uint256)
 * // @error: Data:   0x010f (2 bytes)
 * ```
 *
 * ### Solution
 *
 * Pass a valid data size.
 *
 * ```ts twoslash
 * import { AbiParameters } from 'ox'
 *
 * AbiParameters.decode([{ type: 'uint256' }], '0x00000000000000000000000000000000000000000000000000000000000010f')
 * //                                             ↑ ✅ 32 bytes
 * ```
 */
class DataSizeTooSmallError extends BaseError$1 {
    constructor({ data, parameters, size, }) {
        super(`Data size of ${size} bytes is too small for given parameters.`, {
            metaMessages: [
                `Params: (${formatAbiParameters(parameters)})`,
                `Data:   ${data} (${size} bytes)`,
            ],
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'AbiParameters.DataSizeTooSmallError'
        });
    }
}
/**
 * Throws when zero data is provided, but data is expected.
 *
 * @example
 * ```ts twoslash
 * import { AbiParameters } from 'ox'
 *
 * AbiParameters.decode([{ type: 'uint256' }], '0x')
 * //                                           ↑ ❌ zero data
 * // @error: AbiParameters.DataSizeTooSmallError: Data size of 2 bytes is too small for given parameters.
 * // @error: Params: (uint256)
 * // @error: Data:   0x010f (2 bytes)
 * ```
 *
 * ### Solution
 *
 * Pass valid data.
 *
 * ```ts twoslash
 * import { AbiParameters } from 'ox'
 *
 * AbiParameters.decode([{ type: 'uint256' }], '0x00000000000000000000000000000000000000000000000000000000000010f')
 * //                                             ↑ ✅ 32 bytes
 * ```
 */
class ZeroDataError extends BaseError$1 {
    constructor() {
        super('Cannot decode zero data ("0x") with ABI parameters.');
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'AbiParameters.ZeroDataError'
        });
    }
}
/**
 * The length of the array value does not match the length specified in the corresponding ABI parameter.
 *
 * ### Example
 *
 * ```ts twoslash
 * // @noErrors
 * import { AbiParameters } from 'ox'
 * // ---cut---
 * AbiParameters.encode(AbiParameters.from('uint256[3]'), [[69n, 420n]])
 * //                                               ↑ expected: 3  ↑ ❌ length: 2
 * // @error: AbiParameters.ArrayLengthMismatchError: ABI encoding array length mismatch
 * // @error: for type `uint256[3]`. Expected: `3`. Given: `2`.
 * ```
 *
 * ### Solution
 *
 * Pass an array of the correct length.
 *
 * ```ts twoslash
 * import { AbiParameters } from 'ox'
 * // ---cut---
 * AbiParameters.encode(AbiParameters.from(['uint256[3]']), [[69n, 420n, 69n]])
 * //                                                         ↑ ✅ length: 3
 * ```
 */
class ArrayLengthMismatchError extends BaseError$1 {
    constructor({ expectedLength, givenLength, type, }) {
        super(`Array length mismatch for type \`${type}\`. Expected: \`${expectedLength}\`. Given: \`${givenLength}\`.`);
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'AbiParameters.ArrayLengthMismatchError'
        });
    }
}
/**
 * The size of the bytes value does not match the size specified in the corresponding ABI parameter.
 *
 * ### Example
 *
 * ```ts twoslash
 * // @noErrors
 * import { AbiParameters } from 'ox'
 * // ---cut---
 * AbiParameters.encode(AbiParameters.from('bytes8'), [['0xdeadbeefdeadbeefdeadbeef']])
 * //                                            ↑ expected: 8 bytes  ↑ ❌ size: 12 bytes
 * // @error: BytesSizeMismatchError: Size of bytes "0xdeadbeefdeadbeefdeadbeef"
 * // @error: (bytes12) does not match expected size (bytes8).
 * ```
 *
 * ### Solution
 *
 * Pass a bytes value of the correct size.
 *
 * ```ts twoslash
 * import { AbiParameters } from 'ox'
 * // ---cut---
 * AbiParameters.encode(AbiParameters.from(['bytes8']), ['0xdeadbeefdeadbeef'])
 * //                                                       ↑ ✅ size: 8 bytes
 * ```
 */
class BytesSizeMismatchError extends BaseError$1 {
    constructor({ expectedSize, value, }) {
        super(`Size of bytes "${value}" (bytes${size$2(value)}) does not match expected size (bytes${expectedSize}).`);
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'AbiParameters.BytesSizeMismatchError'
        });
    }
}
/**
 * The length of the values to encode does not match the length of the ABI parameters.
 *
 * ### Example
 *
 * ```ts twoslash
 * // @noErrors
 * import { AbiParameters } from 'ox'
 * // ---cut---
 * AbiParameters.encode(AbiParameters.from(['string', 'uint256']), ['hello'])
 * // @error: LengthMismatchError: ABI encoding params/values length mismatch.
 * // @error: Expected length (params): 2
 * // @error: Given length (values): 1
 * ```
 *
 * ### Solution
 *
 * Pass the correct number of values to encode.
 *
 * ### Solution
 *
 * Pass a [valid ABI type](https://docs.soliditylang.org/en/develop/abi-spec.html#types).
 */
class LengthMismatchError extends BaseError$1 {
    constructor({ expectedLength, givenLength, }) {
        super([
            'ABI encoding parameters/values length mismatch.',
            `Expected length (parameters): ${expectedLength}`,
            `Given length (values): ${givenLength}`,
        ].join('\n'));
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'AbiParameters.LengthMismatchError'
        });
    }
}
/**
 * The value provided is not a valid array as specified in the corresponding ABI parameter.
 *
 * ### Example
 *
 * ```ts twoslash
 * // @noErrors
 * import { AbiParameters } from 'ox'
 * // ---cut---
 * AbiParameters.encode(AbiParameters.from(['uint256[3]']), [69])
 * ```
 *
 * ### Solution
 *
 * Pass an array value.
 */
class InvalidArrayError extends BaseError$1 {
    constructor(value) {
        super(`Value \`${value}\` is not a valid array.`);
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'AbiParameters.InvalidArrayError'
        });
    }
}
/**
 * Throws when the ABI parameter type is invalid.
 *
 * @example
 * ```ts twoslash
 * import { AbiParameters } from 'ox'
 *
 * AbiParameters.decode([{ type: 'lol' }], '0x00000000000000000000000000000000000000000000000000000000000010f')
 * //                             ↑ ❌ invalid type
 * // @error: AbiParameters.InvalidTypeError: Type `lol` is not a valid ABI Type.
 * ```
 */
class InvalidTypeError extends BaseError$1 {
    constructor(type) {
        super(`Type \`${type}\` is not a valid ABI Type.`);
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'AbiParameters.InvalidTypeError'
        });
    }
}

/**
 * Asserts that a Signature is valid.
 *
 * @example
 * ```ts twoslash
 * import { Signature } from 'ox'
 *
 * Signature.assert({
 *   r: -49782753348462494199823712700004552394425719014458918871452329774910450607807n,
 *   s: 33726695977844476214676913201140481102225469284307016937915595756355928419768n,
 *   yParity: 1,
 * })
 * // @error: InvalidSignatureRError:
 * // @error: Value `-549...n` is an invalid r value.
 * // @error: r must be a positive integer less than 2^256.
 * ```
 *
 * @param signature - The signature object to assert.
 */
function assert$2(signature, options = {}) {
    const { recovered } = options;
    if (typeof signature.r === 'undefined')
        throw new MissingPropertiesError({ signature });
    if (typeof signature.s === 'undefined')
        throw new MissingPropertiesError({ signature });
    if (recovered && typeof signature.yParity === 'undefined')
        throw new MissingPropertiesError({ signature });
    if (signature.r < 0n || signature.r > maxUint256)
        throw new InvalidRError({ value: signature.r });
    if (signature.s < 0n || signature.s > maxUint256)
        throw new InvalidSError({ value: signature.s });
    if (typeof signature.yParity === 'number' &&
        signature.yParity !== 0 &&
        signature.yParity !== 1)
        throw new InvalidYParityError({ value: signature.yParity });
}
/**
 * Deserializes a {@link ox#Bytes.Bytes} signature into a structured {@link ox#Signature.Signature}.
 *
 * @example
 * ```ts twoslash
 * // @noErrors
 * import { Signature } from 'ox'
 *
 * Signature.fromBytes(new Uint8Array([128, 3, 131, ...]))
 * // @log: { r: 5231...n, s: 3522...n, yParity: 0 }
 * ```
 *
 * @param signature - The serialized signature.
 * @returns The deserialized {@link ox#Signature.Signature}.
 */
function fromBytes(signature) {
    return fromHex(fromBytes$1(signature));
}
/**
 * Deserializes a {@link ox#Hex.Hex} signature into a structured {@link ox#Signature.Signature}.
 *
 * @example
 * ```ts twoslash
 * import { Signature } from 'ox'
 *
 * Signature.fromHex('0x6e100a352ec6ad1b70802290e18aeed190704973570f3b8ed42cb9808e2ea6bf4a90a229a244495b41890987806fcbd2d5d23fc0dbe5f5256c2613c039d76db81c')
 * // @log: { r: 5231...n, s: 3522...n, yParity: 0 }
 * ```
 *
 * @param serialized - The serialized signature.
 * @returns The deserialized {@link ox#Signature.Signature}.
 */
function fromHex(signature) {
    if (signature.length !== 130 && signature.length !== 132)
        throw new InvalidSerializedSizeError({ signature });
    const r = BigInt(slice$2(signature, 0, 32));
    const s = BigInt(slice$2(signature, 32, 64));
    const yParity = (() => {
        const yParity = Number(`0x${signature.slice(130)}`);
        if (Number.isNaN(yParity))
            return undefined;
        try {
            return vToYParity(yParity);
        }
        catch {
            throw new InvalidYParityError({ value: yParity });
        }
    })();
    if (typeof yParity === 'undefined')
        return {
            r,
            s,
        };
    return {
        r,
        s,
        yParity,
    };
}
/**
 * Extracts a {@link ox#Signature.Signature} from an arbitrary object that may include signature properties.
 *
 * @example
 * ```ts twoslash
 * // @noErrors
 * import { Signature } from 'ox'
 *
 * Signature.extract({
 *   baz: 'barry',
 *   foo: 'bar',
 *   r: 49782753348462494199823712700004552394425719014458918871452329774910450607807n,
 *   s: 33726695977844476214676913201140481102225469284307016937915595756355928419768n,
 *   yParity: 1,
 *   zebra: 'stripes',
 * })
 * // @log: {
 * // @log:   r: 49782753348462494199823712700004552394425719014458918871452329774910450607807n,
 * // @log:   s: 33726695977844476214676913201140481102225469284307016937915595756355928419768n,
 * // @log:   yParity: 1
 * // @log: }
 * ```
 *
 * @param value - The arbitrary object to extract the signature from.
 * @returns The extracted {@link ox#Signature.Signature}.
 */
function extract(value) {
    if (typeof value.r === 'undefined')
        return undefined;
    if (typeof value.s === 'undefined')
        return undefined;
    return from$4(value);
}
/**
 * Instantiates a typed {@link ox#Signature.Signature} object from a {@link ox#Signature.Signature}, {@link ox#Signature.Legacy}, {@link ox#Bytes.Bytes}, or {@link ox#Hex.Hex}.
 *
 * @example
 * ```ts twoslash
 * import { Signature } from 'ox'
 *
 * Signature.from({
 *   r: 49782753348462494199823712700004552394425719014458918871452329774910450607807n,
 *   s: 33726695977844476214676913201140481102225469284307016937915595756355928419768n,
 *   yParity: 1,
 * })
 * // @log: {
 * // @log:   r: 49782753348462494199823712700004552394425719014458918871452329774910450607807n,
 * // @log:   s: 33726695977844476214676913201140481102225469284307016937915595756355928419768n,
 * // @log:   yParity: 1
 * // @log: }
 * ```
 *
 * @example
 * ### From Serialized
 *
 * ```ts twoslash
 * import { Signature } from 'ox'
 *
 * Signature.from('0x6e100a352ec6ad1b70802290e18aeed190704973570f3b8ed42cb9808e2ea6bf4a90a229a244495b41890987806fcbd2d5d23fc0dbe5f5256c2613c039d76db801')
 * // @log: {
 * // @log:   r: 49782753348462494199823712700004552394425719014458918871452329774910450607807n,
 * // @log:   s: 33726695977844476214676913201140481102225469284307016937915595756355928419768n,
 * // @log:   yParity: 1,
 * // @log: }
 * ```
 *
 * @example
 * ### From Legacy
 *
 * ```ts twoslash
 * import { Signature } from 'ox'
 *
 * Signature.from({
 *   r: 47323457007453657207889730243826965761922296599680473886588287015755652701072n,
 *   s: 57228803202727131502949358313456071280488184270258293674242124340113824882788n,
 *   v: 27,
 * })
 * // @log: {
 * // @log:   r: 47323457007453657207889730243826965761922296599680473886588287015755652701072n,
 * // @log:   s: 57228803202727131502949358313456071280488184270258293674242124340113824882788n,
 * // @log:   yParity: 0
 * // @log: }
 * ```
 *
 * @param signature - The signature value to instantiate.
 * @returns The instantiated {@link ox#Signature.Signature}.
 */
function from$4(signature) {
    const signature_ = (() => {
        if (typeof signature === 'string')
            return fromHex(signature);
        if (signature instanceof Uint8Array)
            return fromBytes(signature);
        if (typeof signature.r === 'string')
            return fromRpc$1(signature);
        if (signature.v)
            return fromLegacy(signature);
        return {
            r: signature.r,
            s: signature.s,
            ...(typeof signature.yParity !== 'undefined'
                ? { yParity: signature.yParity }
                : {}),
        };
    })();
    assert$2(signature_);
    return signature_;
}
/**
 * Converts a {@link ox#Signature.Legacy} into a {@link ox#Signature.Signature}.
 *
 * @example
 * ```ts twoslash
 * import { Signature } from 'ox'
 *
 * const legacy = Signature.fromLegacy({ r: 1n, s: 2n, v: 28 })
 * // @log: { r: 1n, s: 2n, yParity: 1 }
 * ```
 *
 * @param signature - The {@link ox#Signature.Legacy} to convert.
 * @returns The converted {@link ox#Signature.Signature}.
 */
function fromLegacy(signature) {
    return {
        r: signature.r,
        s: signature.s,
        yParity: vToYParity(signature.v),
    };
}
/**
 * Converts a {@link ox#Signature.Rpc} into a {@link ox#Signature.Signature}.
 *
 * @example
 * ```ts twoslash
 * import { Signature } from 'ox'
 *
 * const signature = Signature.fromRpc({
 *   r: '0x635dc2033e60185bb36709c29c75d64ea51dfbd91c32ef4be198e4ceb169fb4d',
 *   s: '0x50c2667ac4c771072746acfdcf1f1483336dcca8bd2df47cd83175dbe60f0540',
 *   yParity: '0x0',
 * })
 * ```
 *
 * @param signature - The {@link ox#Signature.Rpc} to convert.
 * @returns The converted {@link ox#Signature.Signature}.
 */
function fromRpc$1(signature) {
    const yParity = (() => {
        const v = signature.v ? Number(signature.v) : undefined;
        let yParity = signature.yParity ? Number(signature.yParity) : undefined;
        if (typeof v === 'number' && typeof yParity !== 'number')
            yParity = vToYParity(v);
        if (typeof yParity !== 'number')
            throw new InvalidYParityError({ value: signature.yParity });
        return yParity;
    })();
    return {
        r: BigInt(signature.r),
        s: BigInt(signature.s),
        yParity,
    };
}
/**
 * Converts a ECDSA `v` value to a `yParity` value.
 *
 * @example
 * ```ts twoslash
 * import { Signature } from 'ox'
 *
 * const yParity = Signature.vToYParity(28)
 * // @log: 1
 * ```
 *
 * @param v - The ECDSA `v` value to convert.
 * @returns The `yParity` value.
 */
function vToYParity(v) {
    if (v === 0 || v === 27)
        return 0;
    if (v === 1 || v === 28)
        return 1;
    if (v >= 35)
        return v % 2 === 0 ? 1 : 0;
    throw new InvalidVError({ value: v });
}
/** Thrown when the serialized signature is of an invalid size. */
class InvalidSerializedSizeError extends BaseError$1 {
    constructor({ signature }) {
        super(`Value \`${signature}\` is an invalid signature size.`, {
            metaMessages: [
                'Expected: 64 bytes or 65 bytes.',
                `Received ${size$2(from$7(signature))} bytes.`,
            ],
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'Signature.InvalidSerializedSizeError'
        });
    }
}
/** Thrown when the signature is missing either an `r`, `s`, or `yParity` property. */
class MissingPropertiesError extends BaseError$1 {
    constructor({ signature }) {
        super(`Signature \`${stringify$1(signature)}\` is missing either an \`r\`, \`s\`, or \`yParity\` property.`);
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'Signature.MissingPropertiesError'
        });
    }
}
/** Thrown when the signature has an invalid `r` value. */
class InvalidRError extends BaseError$1 {
    constructor({ value }) {
        super(`Value \`${value}\` is an invalid r value. r must be a positive integer less than 2^256.`);
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'Signature.InvalidRError'
        });
    }
}
/** Thrown when the signature has an invalid `s` value. */
class InvalidSError extends BaseError$1 {
    constructor({ value }) {
        super(`Value \`${value}\` is an invalid s value. s must be a positive integer less than 2^256.`);
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'Signature.InvalidSError'
        });
    }
}
/** Thrown when the signature has an invalid `yParity` value. */
class InvalidYParityError extends BaseError$1 {
    constructor({ value }) {
        super(`Value \`${value}\` is an invalid y-parity value. Y-parity must be 0 or 1.`);
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'Signature.InvalidYParityError'
        });
    }
}
/** Thrown when the signature has an invalid `v` value. */
class InvalidVError extends BaseError$1 {
    constructor({ value }) {
        super(`Value \`${value}\` is an invalid v value. v must be 27, 28 or >=35.`);
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'Signature.InvalidVError'
        });
    }
}

/**
 * Converts an [EIP-7702](https://eips.ethereum.org/EIPS/eip-7702) Authorization object into a typed {@link ox#Authorization.Authorization}.
 *
 * @example
 * An Authorization can be instantiated from an [EIP-7702](https://eips.ethereum.org/EIPS/eip-7702) Authorization tuple in object format.
 *
 * ```ts twoslash
 * import { Authorization } from 'ox'
 *
 * const authorization = Authorization.from({
 *   address: '0x1234567890abcdef1234567890abcdef12345678',
 *   chainId: 1,
 *   nonce: 69n,
 * })
 * ```
 *
 * @example
 * ### Attaching Signatures
 *
 * A {@link ox#Signature.Signature} can be attached with the `signature` option. The example below demonstrates signing
 * an Authorization with {@link ox#Secp256k1.(sign:function)}.
 *
 * ```ts twoslash
 * import { Authorization, Secp256k1 } from 'ox'
 *
 * const authorization = Authorization.from({
 *   address: '0xbe95c3f554e9fc85ec51be69a3d807a0d55bcf2c',
 *   chainId: 1,
 *   nonce: 40n,
 * })
 *
 * const signature = Secp256k1.sign({
 *   payload: Authorization.getSignPayload(authorization),
 *   privateKey: '0x...',
 * })
 *
 * const authorization_signed = Authorization.from(authorization, { signature }) // [!code focus]
 * ```
 *
 * @param authorization - An [EIP-7702](https://eips.ethereum.org/EIPS/eip-7702) Authorization tuple in object format.
 * @param options - Authorization options.
 * @returns The {@link ox#Authorization.Authorization}.
 */
function from$3(authorization, options = {}) {
    if (typeof authorization.chainId === 'string')
        return fromRpc(authorization);
    return { ...authorization, ...options.signature };
}
/**
 * Converts an {@link ox#Authorization.Rpc} to an {@link ox#Authorization.Authorization}.
 *
 * @example
 * ```ts twoslash
 * import { Authorization } from 'ox'
 *
 * const authorization = Authorization.fromRpc({
 *   address: '0x0000000000000000000000000000000000000000',
 *   chainId: '0x1',
 *   nonce: '0x1',
 *   r: '0x635dc2033e60185bb36709c29c75d64ea51dfbd91c32ef4be198e4ceb169fb4d',
 *   s: '0x50c2667ac4c771072746acfdcf1f1483336dcca8bd2df47cd83175dbe60f0540',
 *   yParity: '0x0',
 * })
 * ```
 *
 * @param authorization - The RPC-formatted Authorization.
 * @returns A signed {@link ox#Authorization.Authorization}.
 */
function fromRpc(authorization) {
    const { address, chainId, nonce } = authorization;
    const signature = extract(authorization);
    return {
        address,
        chainId: Number(chainId),
        nonce: BigInt(nonce),
        ...signature,
    };
}

/**
 * Magic bytes used to identify ERC-8010 wrapped signatures.
 */
const magicBytes$1 = '0x8010801080108010801080108010801080108010801080108010801080108010';
/** Suffix ABI parameters for the ERC-8010 wrapped signature. */
const suffixParameters = from$5('(uint256 chainId, address delegation, uint256 nonce, uint8 yParity, uint256 r, uint256 s), address to, bytes data');
/**
 * Asserts that the wrapped signature is valid.
 *
 * @example
 * ```ts twoslash
 * import { SignatureErc8010 } from 'ox/erc8010'
 *
 * SignatureErc8010.assert('0xdeadbeef')
 * // @error: InvalidWrappedSignatureError: Value `0xdeadbeef` is an invalid ERC-8010 wrapped signature.
 * ```
 *
 * @param value - The value to assert.
 */
function assert$1(value) {
    if (typeof value === 'string') {
        if (slice$2(value, -32) !== magicBytes$1)
            throw new InvalidWrappedSignatureError$1(value);
    }
    else
        assert$2(value.authorization);
}
/**
 * Unwraps an [ERC-8010 wrapped signature](https://github.com/jxom/ERCs/blob/16f7e3891fff2e1e9c25dea0485497739db8a816/ERCS/erc-8010.md) into its constituent parts.
 *
 * @example
 * ```ts twoslash
 * import { SignatureErc8010 } from 'ox/erc8010'
 *
 * const { authorization, data, signature } = SignatureErc8010.unwrap('0x...')
 * ```
 *
 * @param wrapped - Wrapped signature to unwrap.
 * @returns Unwrapped signature.
 */
function unwrap(wrapped) {
    assert$1(wrapped);
    const suffixLength = toNumber$1(slice$2(wrapped, -64, -32));
    const suffix = slice$2(wrapped, -suffixLength - 64, -64);
    const signature = slice$2(wrapped, 0, -suffixLength - 64);
    const [auth, to, data] = decode(suffixParameters, suffix);
    const authorization = from$3({
        address: auth.delegation,
        chainId: Number(auth.chainId),
        nonce: auth.nonce,
        yParity: auth.yParity,
        r: auth.r,
        s: auth.s,
    });
    return {
        authorization,
        signature,
        ...(data && data !== '0x' ? { data, to } : {}),
    };
}
/**
 * Validates a wrapped signature. Returns `true` if the wrapped signature is valid, `false` otherwise.
 *
 * @example
 * ```ts twoslash
 * import { SignatureErc8010 } from 'ox/erc8010'
 *
 * const valid = SignatureErc8010.validate('0xdeadbeef')
 * // @log: false
 * ```
 *
 * @param value - The value to validate.
 * @returns `true` if the value is valid, `false` otherwise.
 */
function validate$1(value) {
    try {
        assert$1(value);
        return true;
    }
    catch {
        return false;
    }
}
/** Thrown when the ERC-8010 wrapped signature is invalid. */
let InvalidWrappedSignatureError$1 = class InvalidWrappedSignatureError extends BaseError$1 {
    constructor(wrapped) {
        super(`Value \`${wrapped}\` is an invalid ERC-8010 wrapped signature.`);
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'SignatureErc8010.InvalidWrappedSignatureError'
        });
    }
};

function formatStorageProof(storageProof) {
    return storageProof.map((proof) => ({
        ...proof,
        value: BigInt(proof.value),
    }));
}
function formatProof(proof) {
    return {
        ...proof,
        balance: proof.balance ? BigInt(proof.balance) : undefined,
        nonce: proof.nonce ? hexToNumber(proof.nonce) : undefined,
        storageProof: proof.storageProof
            ? formatStorageProof(proof.storageProof)
            : undefined,
    };
}

/**
 * Returns the account and storage values of the specified account including the Merkle-proof.
 *
 * - Docs: https://viem.sh/docs/actions/public/getProof
 * - JSON-RPC Methods:
 *   - Calls [`eth_getProof`](https://eips.ethereum.org/EIPS/eip-1186)
 *
 * @param client - Client to use
 * @param parameters - {@link GetProofParameters}
 * @returns Proof data. {@link GetProofReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { getProof } from 'viem/public'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const block = await getProof(client, {
 *  address: '0x...',
 *  storageKeys: ['0x...'],
 * })
 */
async function getProof(client, { address, blockHash, blockNumber, blockTag = 'latest', requireCanonical, storageKeys, }) {
    const block = formatBlockParameter({
        blockHash,
        blockNumber,
        blockTag,
        requireCanonical,
    });
    const proof = await client.request({
        method: 'eth_getProof',
        params: [address, storageKeys, block],
    });
    return formatProof(proof);
}

/**
 * Returns the value from a storage slot at a given address.
 *
 * - Docs: https://viem.sh/docs/contract/getStorageAt
 * - JSON-RPC Methods: [`eth_getStorageAt`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getstorageat)
 *
 * @param client - Client to use
 * @param parameters - {@link GetStorageAtParameters}
 * @returns The value of the storage slot. {@link GetStorageAtReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { getStorageAt } from 'viem/contract'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const code = await getStorageAt(client, {
 *   address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
 *   slot: toHex(0),
 * })
 */
async function getStorageAt(client, { address, blockHash, blockNumber, blockTag = 'latest', requireCanonical, slot, }) {
    const block = formatBlockParameter({
        blockHash,
        blockNumber,
        blockTag,
        requireCanonical,
    });
    const data = await client.request({
        method: 'eth_getStorageAt',
        params: [address, slot, block],
    });
    return data;
}

/**
 * Returns information about a [Transaction](https://viem.sh/docs/glossary/terms#transaction) given a hash or block identifier.
 *
 * - Docs: https://viem.sh/docs/actions/public/getTransaction
 * - Example: https://stackblitz.com/github/wevm/viem/tree/main/examples/transactions_fetching-transactions
 * - JSON-RPC Methods: [`eth_getTransactionByHash`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getTransactionByHash)
 *
 * @param client - Client to use
 * @param parameters - {@link GetTransactionParameters}
 * @returns The transaction information. {@link GetTransactionReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { getTransaction } from 'viem/public'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const transaction = await getTransaction(client, {
 *   hash: '0x4ca7ee652d57678f26e887c149ab0735f41de37bcad58c9f6d3ed5824f15b74d',
 * })
 */
async function getTransaction(client, { blockHash, blockNumber, blockTag: blockTag_, hash, index, sender, nonce, }) {
    const blockTag = blockTag_ || 'latest';
    const blockNumberHex = blockNumber !== undefined ? numberToHex(blockNumber) : undefined;
    let transaction = null;
    if (hash) {
        transaction = await client.request({
            method: 'eth_getTransactionByHash',
            params: [hash],
        }, { dedupe: true });
    }
    else if (blockHash) {
        transaction = await client.request({
            method: 'eth_getTransactionByBlockHashAndIndex',
            params: [blockHash, numberToHex(index)],
        }, { dedupe: true });
    }
    else if (typeof index === 'number') {
        transaction = await client.request({
            method: 'eth_getTransactionByBlockNumberAndIndex',
            params: [blockNumberHex || blockTag, numberToHex(index)],
        }, { dedupe: Boolean(blockNumberHex) });
    }
    else if (sender && typeof nonce === 'number') {
        transaction = await client.request({
            method: 'eth_getTransactionBySenderAndNonce',
            params: [sender, numberToHex(nonce)],
        }, { dedupe: true });
    }
    if (!transaction)
        throw new TransactionNotFoundError({
            blockHash,
            blockNumber,
            blockTag,
            hash,
            index,
        });
    const format = client.chain?.formatters?.transaction?.format || formatTransaction;
    return format(transaction, 'getTransaction');
}

/**
 * Returns the number of blocks passed (confirmations) since the transaction was processed on a block.
 *
 * - Docs: https://viem.sh/docs/actions/public/getTransactionConfirmations
 * - Example: https://stackblitz.com/github/wevm/viem/tree/main/examples/transactions_fetching-transactions
 * - JSON-RPC Methods: [`eth_getTransactionConfirmations`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getTransactionConfirmations)
 *
 * @param client - Client to use
 * @param parameters - {@link GetTransactionConfirmationsParameters}
 * @returns The number of blocks passed since the transaction was processed. If confirmations is 0, then the Transaction has not been confirmed & processed yet. {@link GetTransactionConfirmationsReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { getTransactionConfirmations } from 'viem/public'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const confirmations = await getTransactionConfirmations(client, {
 *   hash: '0x4ca7ee652d57678f26e887c149ab0735f41de37bcad58c9f6d3ed5824f15b74d',
 * })
 */
async function getTransactionConfirmations(client, { hash, transactionReceipt }) {
    const [blockNumber, transaction] = await Promise.all([
        getAction(client, getBlockNumber, 'getBlockNumber')({}),
        hash
            ? getAction(client, getTransaction, 'getTransaction')({ hash })
            : undefined,
    ]);
    const transactionBlockNumber = transactionReceipt?.blockNumber || transaction?.blockNumber;
    if (!transactionBlockNumber)
        return 0n;
    return blockNumber - transactionBlockNumber + 1n;
}

/**
 * Returns the [Transaction Receipt](https://viem.sh/docs/glossary/terms#transaction-receipt) given a [Transaction](https://viem.sh/docs/glossary/terms#transaction) hash.
 *
 * - Docs: https://viem.sh/docs/actions/public/getTransactionReceipt
 * - Example: https://stackblitz.com/github/wevm/viem/tree/main/examples/transactions_fetching-transactions
 * - JSON-RPC Methods: [`eth_getTransactionReceipt`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_gettransactionreceipt)
 *
 * @param client - Client to use
 * @param parameters - {@link GetTransactionReceiptParameters}
 * @returns The transaction receipt. {@link GetTransactionReceiptReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { getTransactionReceipt } from 'viem/public'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const transactionReceipt = await getTransactionReceipt(client, {
 *   hash: '0x4ca7ee652d57678f26e887c149ab0735f41de37bcad58c9f6d3ed5824f15b74d',
 * })
 */
async function getTransactionReceipt(client, { hash }) {
    const receipt = await client.request({
        method: 'eth_getTransactionReceipt',
        params: [hash],
    }, { dedupe: true });
    if (!receipt)
        throw new TransactionReceiptNotFoundError({ hash });
    const format = client.chain?.formatters?.transactionReceipt?.format ||
        formatTransactionReceipt;
    return format(receipt, 'getTransactionReceipt');
}

/**
 * Similar to [`readContract`](https://viem.sh/docs/contract/readContract), but batches up multiple functions on a contract in a single RPC call via the [`multicall3` contract](https://github.com/mds1/multicall).
 *
 * - Docs: https://viem.sh/docs/contract/multicall
 *
 * @param client - Client to use
 * @param parameters - {@link MulticallParameters}
 * @returns An array of results with accompanying status. {@link MulticallReturnType}
 *
 * @example
 * import { createPublicClient, http, parseAbi } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { multicall } from 'viem/contract'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const abi = parseAbi([
 *   'function balanceOf(address) view returns (uint256)',
 *   'function totalSupply() view returns (uint256)',
 * ])
 * const results = await multicall(client, {
 *   contracts: [
 *     {
 *       address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
 *       abi,
 *       functionName: 'balanceOf',
 *       args: ['0xA0Cf798816D4b9b9866b5330EEa46a18382f251e'],
 *     },
 *     {
 *       address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
 *       abi,
 *       functionName: 'totalSupply',
 *     },
 *   ],
 * })
 * // [{ result: 424122n, status: 'success' }, { result: 1000000n, status: 'success' }]
 */
async function multicall(client, parameters) {
    const { account, authorizationList, allowFailure = true, blockHash, blockNumber, blockOverrides, blockTag, requireCanonical, stateOverride, } = parameters;
    const contracts = parameters.contracts;
    const { batchSize = parameters.batchSize ?? 1024, deployless = parameters.deployless ?? false, } = typeof client.batch?.multicall === 'object' ? client.batch.multicall : {};
    const multicallAddress = (() => {
        if (parameters.multicallAddress)
            return parameters.multicallAddress;
        if (deployless)
            return null;
        if (client.chain) {
            return getChainContractAddress({
                blockNumber,
                chain: client.chain,
                contract: 'multicall3',
            });
        }
        throw new Error('client chain not configured. multicallAddress is required.');
    })();
    const chunkedCalls = [[]];
    let currentChunk = 0;
    let currentChunkSize = 0;
    for (let i = 0; i < contracts.length; i++) {
        const { abi, address, args, functionName } = contracts[i];
        try {
            const callData = encodeFunctionData({ abi, args, functionName });
            currentChunkSize += (callData.length - 2) / 2;
            // Check to see if we need to create a new chunk.
            if (
            // Check if batching is enabled.
            batchSize > 0 &&
                // Check if the current size of the batch exceeds the size limit.
                currentChunkSize > batchSize &&
                // Check if the current chunk is not already empty.
                chunkedCalls[currentChunk].length > 0) {
                currentChunk++;
                currentChunkSize = (callData.length - 2) / 2;
                chunkedCalls[currentChunk] = [];
            }
            chunkedCalls[currentChunk] = [
                ...chunkedCalls[currentChunk],
                {
                    allowFailure: true,
                    callData,
                    target: address,
                },
            ];
        }
        catch (err) {
            const error = getContractError(err, {
                abi,
                address,
                args,
                docsPath: '/docs/contract/multicall',
                functionName,
                sender: account,
            });
            if (!allowFailure)
                throw error;
            chunkedCalls[currentChunk] = [
                ...chunkedCalls[currentChunk],
                {
                    allowFailure: true,
                    callData: '0x',
                    target: address,
                },
            ];
        }
    }
    const aggregate3Results = await Promise.allSettled(chunkedCalls.map((calls) => getAction(client, readContract, 'readContract')({
        ...(multicallAddress === null
            ? { code: multicall3Bytecode }
            : { address: multicallAddress }),
        abi: multicall3Abi,
        account,
        args: [calls],
        authorizationList,
        blockHash,
        blockNumber,
        blockOverrides,
        blockTag,
        functionName: 'aggregate3',
        requireCanonical,
        stateOverride,
    })));
    const results = [];
    for (let i = 0; i < aggregate3Results.length; i++) {
        const result = aggregate3Results[i];
        // If an error occurred in a `readContract` invocation (ie. network error),
        // then append the failure reason to each contract result.
        if (result.status === 'rejected') {
            if (!allowFailure)
                throw result.reason;
            for (let j = 0; j < chunkedCalls[i].length; j++) {
                results.push({
                    status: 'failure',
                    error: result.reason,
                    result: undefined,
                });
            }
            continue;
        }
        // If the `readContract` call was successful, then decode the results.
        const aggregate3Result = result.value;
        for (let j = 0; j < aggregate3Result.length; j++) {
            // Extract the response from `readContract`
            const { returnData, success } = aggregate3Result[j];
            // Extract the request call data from the original call.
            const { callData } = chunkedCalls[i][j];
            // Extract the contract config for this call from the `contracts` argument
            // for decoding.
            const { abi, address, functionName, args } = contracts[results.length];
            try {
                if (callData === '0x')
                    throw new AbiDecodingZeroDataError();
                if (!success)
                    throw new RawContractError({ data: returnData });
                const result = decodeFunctionResult({
                    abi,
                    args,
                    data: returnData,
                    functionName,
                });
                results.push(allowFailure ? { result, status: 'success' } : result);
            }
            catch (err) {
                const error = getContractError(err, {
                    abi,
                    address,
                    args,
                    docsPath: '/docs/contract/multicall',
                    functionName,
                });
                if (!allowFailure)
                    throw error;
                results.push({ error, result: undefined, status: 'failure' });
            }
        }
    }
    if (results.length !== contracts.length)
        throw new BaseError('multicall results mismatch');
    return results;
}

/**
 * Simulates a set of calls on block(s) with optional block and state overrides.
 *
 * @example
 * ```ts
 * import { createClient, http, parseEther } from 'viem'
 * import { simulate } from 'viem/actions'
 * import { mainnet } from 'viem/chains'
 *
 * const client = createClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 *
 * const result = await simulate(client, {
 *   blocks: [{
 *     blockOverrides: {
 *       number: 69420n,
 *     },
 *     calls: [{
 *       {
 *         account: '0x5a0b54d5dc17e482fe8b0bdca5320161b95fb929',
 *         data: '0xdeadbeef',
 *         to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
 *       },
 *       {
 *         account: '0x5a0b54d5dc17e482fe8b0bdca5320161b95fb929',
 *         to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
 *         value: parseEther('1'),
 *       },
 *     }],
 *     stateOverrides: [{
 *       address: '0x5a0b54d5dc17e482fe8b0bdca5320161b95fb929',
 *       balance: parseEther('10'),
 *     }],
 *   }]
 * })
 * ```
 *
 * @param client - Client to use.
 * @param parameters - {@link SimulateBlocksParameters}
 * @returns Simulated blocks. {@link SimulateBlocksReturnType}
 */
async function simulateBlocks(client, parameters) {
    const { blockNumber, blockTag = client.experimental_blockTag ?? 'latest', blocks, returnFullTransactions, traceTransfers, validation, } = parameters;
    try {
        const blockStateCalls = [];
        for (const block of blocks) {
            const blockOverrides = block.blockOverrides
                ? toRpc(block.blockOverrides)
                : undefined;
            const calls = block.calls.map((call_) => {
                const call = call_;
                const account = call.account ? parseAccount(call.account) : undefined;
                const data = call.abi ? encodeFunctionData(call) : call.data;
                const request = {
                    ...call,
                    account,
                    data: call.dataSuffix
                        ? concat([data || '0x', call.dataSuffix])
                        : data,
                    from: call.from ?? account?.address,
                };
                assertRequest(request);
                return formatTransactionRequest(request);
            });
            const stateOverrides = block.stateOverrides
                ? serializeStateOverride(block.stateOverrides)
                : undefined;
            blockStateCalls.push({
                blockOverrides,
                calls,
                stateOverrides,
            });
        }
        const blockNumberHex = typeof blockNumber === 'bigint' ? numberToHex(blockNumber) : undefined;
        const block = blockNumberHex || blockTag;
        const result = await client.request({
            method: 'eth_simulateV1',
            params: [
                { blockStateCalls, returnFullTransactions, traceTransfers, validation },
                block,
            ],
        });
        return result.map((block, i) => ({
            ...formatBlock(block),
            calls: block.calls.map((call, j) => {
                const { abi, args, functionName, to } = blocks[i].calls[j];
                const data = call.error?.data ?? call.returnData;
                const gasUsed = BigInt(call.gasUsed);
                const logs = call.logs?.map((log) => formatLog(log));
                const status = call.status === '0x1' ? 'success' : 'failure';
                const result = abi && status === 'success' && data !== '0x'
                    ? decodeFunctionResult({
                        abi,
                        data,
                        functionName,
                    })
                    : null;
                const error = (() => {
                    if (status === 'success')
                        return undefined;
                    let error;
                    if (data === '0x')
                        error = new AbiDecodingZeroDataError();
                    else if (data)
                        error = new RawContractError({ data });
                    if (!error)
                        return undefined;
                    return getContractError(error, {
                        abi: (abi ?? []),
                        address: to ?? '0x',
                        args,
                        functionName: functionName ?? '<unknown>',
                    });
                })();
                return {
                    data,
                    gasUsed,
                    logs,
                    status,
                    ...(status === 'success'
                        ? {
                            result,
                        }
                        : {
                            error,
                        }),
                };
            }),
        }));
    }
    catch (e) {
        const cause = e;
        const error = getNodeError(cause, {});
        if (error instanceof UnknownNodeError)
            throw cause;
        throw error;
    }
}

/** @internal */
function normalizeSignature(signature) {
    let active = true;
    let current = '';
    let level = 0;
    let result = '';
    let valid = false;
    for (let i = 0; i < signature.length; i++) {
        const char = signature[i];
        // If the character is a separator, we want to reactivate.
        if (['(', ')', ','].includes(char))
            active = true;
        // If the character is a "level" token, we want to increment/decrement.
        if (char === '(')
            level++;
        if (char === ')')
            level--;
        // If we aren't active, we don't want to mutate the result.
        if (!active)
            continue;
        // If level === 0, we are at the definition level.
        if (level === 0) {
            if (char === ' ' && ['event', 'function', 'error', ''].includes(result))
                result = '';
            else {
                result += char;
                // If we are at the end of the definition, we must be finished.
                if (char === ')') {
                    valid = true;
                    break;
                }
            }
            continue;
        }
        // Ignore spaces
        if (char === ' ') {
            // If the previous character is a separator, and the current section isn't empty, we want to deactivate.
            if (signature[i - 1] !== ',' && current !== ',' && current !== ',(') {
                current = '';
                active = false;
            }
            continue;
        }
        result += char;
        current += char;
    }
    if (!valid)
        throw new BaseError$1('Unable to normalize signature.');
    return result;
}
/** @internal */
function isArgOfType(arg, abiParameter) {
    const argType = typeof arg;
    const abiParameterType = abiParameter.type;
    switch (abiParameterType) {
        case 'address':
            return validate$2(arg, { strict: false });
        case 'bool':
            return argType === 'boolean';
        case 'function':
            return argType === 'string';
        case 'string':
            return argType === 'string';
        default: {
            if (abiParameterType === 'tuple' && 'components' in abiParameter)
                return Object.values(abiParameter.components).every((component, index) => {
                    return isArgOfType(Object.values(arg)[index], component);
                });
            // `(u)int<M>`: (un)signed integer type of `M` bits, `0 < M <= 256`, `M % 8 == 0`
            // https://regexr.com/6v8hp
            if (/^u?int(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/.test(abiParameterType))
                return argType === 'number' || argType === 'bigint';
            // `bytes<M>`: binary type of `M` bytes, `0 < M <= 32`
            // https://regexr.com/6va55
            if (/^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/.test(abiParameterType))
                return argType === 'string' || arg instanceof Uint8Array;
            // fixed-length (`<type>[M]`) and dynamic (`<type>[]`) arrays
            // https://regexr.com/6va6i
            if (/[a-z]+[1-9]{0,3}(\[[0-9]{0,}\])+$/.test(abiParameterType)) {
                return (Array.isArray(arg) &&
                    arg.every((x) => isArgOfType(x, {
                        ...abiParameter,
                        // Pop off `[]` or `[M]` from end of type
                        type: abiParameterType.replace(/(\[[0-9]{0,}\])$/, ''),
                    })));
            }
            return false;
        }
    }
}
/** @internal */
function getAmbiguousTypes(sourceParameters, targetParameters, args) {
    for (const parameterIndex in sourceParameters) {
        const sourceParameter = sourceParameters[parameterIndex];
        const targetParameter = targetParameters[parameterIndex];
        if (sourceParameter.type === 'tuple' &&
            targetParameter.type === 'tuple' &&
            'components' in sourceParameter &&
            'components' in targetParameter)
            return getAmbiguousTypes(sourceParameter.components, targetParameter.components, args[parameterIndex]);
        const types = [sourceParameter.type, targetParameter.type];
        const ambiguous = (() => {
            if (types.includes('address') && types.includes('bytes20'))
                return true;
            if (types.includes('address') && types.includes('string'))
                return validate$2(args[parameterIndex], {
                    strict: false,
                });
            if (types.includes('address') && types.includes('bytes'))
                return validate$2(args[parameterIndex], {
                    strict: false,
                });
            return false;
        })();
        if (ambiguous)
            return types;
    }
    return;
}

/**
 * Parses an arbitrary **JSON ABI Item** or **Human Readable ABI Item** into a typed {@link ox#AbiItem.AbiItem}.
 *
 * @example
 * ### JSON ABIs
 *
 * ```ts twoslash
 * import { AbiItem } from 'ox'
 *
 * const abiItem = AbiItem.from({
 *   type: 'function',
 *   name: 'approve',
 *   stateMutability: 'nonpayable',
 *   inputs: [
 *     {
 *       name: 'spender',
 *       type: 'address',
 *     },
 *     {
 *       name: 'amount',
 *       type: 'uint256',
 *     },
 *   ],
 *   outputs: [{ type: 'bool' }],
 * })
 *
 * abiItem
 * //^?
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 * ```
 *
 * @example
 * ### Human Readable ABIs
 *
 * A Human Readable ABI can be parsed into a typed ABI object:
 *
 * ```ts twoslash
 * import { AbiItem } from 'ox'
 *
 * const abiItem = AbiItem.from(
 *   'function approve(address spender, uint256 amount) returns (bool)' // [!code hl]
 * )
 *
 * abiItem
 * //^?
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 * ```
 *
 * @example
 * It is possible to specify `struct`s along with your definitions:
 *
 * ```ts twoslash
 * import { AbiItem } from 'ox'
 *
 * const abiItem = AbiItem.from([
 *   'struct Foo { address spender; uint256 amount; }', // [!code hl]
 *   'function approve(Foo foo) returns (bool)',
 * ])
 *
 * abiItem
 * //^?
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 * ```
 *
 *
 *
 * @param abiItem - The ABI Item to parse.
 * @returns The typed ABI Item.
 */
function from$2(abiItem, options = {}) {
    const { prepare = true } = options;
    const item = (() => {
        if (Array.isArray(abiItem))
            return parseAbiItem(abiItem);
        if (typeof abiItem === 'string')
            return parseAbiItem(abiItem);
        return abiItem;
    })();
    return {
        ...item,
        ...(prepare ? { hash: getSignatureHash(item) } : {}),
    };
}
/**
 * Extracts an {@link ox#AbiItem.AbiItem} from an {@link ox#Abi.Abi} given a name and optional arguments.
 *
 * @example
 * ABI Items can be extracted by their name using the `name` option:
 *
 * ```ts twoslash
 * import { Abi, AbiItem } from 'ox'
 *
 * const abi = Abi.from([
 *   'function foo()',
 *   'event Transfer(address owner, address to, uint256 tokenId)',
 *   'function bar(string a) returns (uint256 x)',
 * ])
 *
 * const item = AbiItem.fromAbi(abi, 'Transfer') // [!code focus]
 * //    ^?
 *
 *
 *
 *
 *
 *
 * ```
 *
 * @example
 * ### Extracting by Selector
 *
 * ABI Items can be extract by their selector when {@link ox#Hex.Hex} is provided to `name`.
 *
 * ```ts twoslash
 * import { Abi, AbiItem } from 'ox'
 *
 * const abi = Abi.from([
 *   'function foo()',
 *   'event Transfer(address owner, address to, uint256 tokenId)',
 *   'function bar(string a) returns (uint256 x)',
 * ])
 * const item = AbiItem.fromAbi(abi, '0x095ea7b3') // [!code focus]
 * //    ^?
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 * ```
 *
 * :::note
 *
 * Extracting via a hex selector is useful when extracting an ABI Item from an `eth_call` RPC response,
 * a Transaction `input`, or from Event Log `topics`.
 *
 * :::
 *
 * @param abi - The ABI to extract from.
 * @param name - The name (or selector) of the ABI item to extract.
 * @param options - Extraction options.
 * @returns The ABI item.
 */
function fromAbi$2(abi, name, options) {
    const { args = [], prepare = true } = (options ??
        {});
    const isSelector = validate$3(name, { strict: false });
    const abiItems = abi.filter((abiItem) => {
        if (isSelector) {
            if (abiItem.type === 'function' || abiItem.type === 'error')
                return getSelector$1(abiItem) === slice$2(name, 0, 4);
            if (abiItem.type === 'event')
                return getSignatureHash(abiItem) === name;
            return false;
        }
        return 'name' in abiItem && abiItem.name === name;
    });
    if (abiItems.length === 0)
        throw new NotFoundError({ name: name });
    if (abiItems.length === 1)
        return {
            ...abiItems[0],
            ...(prepare ? { hash: getSignatureHash(abiItems[0]) } : {}),
        };
    let matchedAbiItem;
    for (const abiItem of abiItems) {
        if (!('inputs' in abiItem))
            continue;
        if (!args || args.length === 0) {
            if (!abiItem.inputs || abiItem.inputs.length === 0)
                return {
                    ...abiItem,
                    ...(prepare ? { hash: getSignatureHash(abiItem) } : {}),
                };
            continue;
        }
        if (!abiItem.inputs)
            continue;
        if (abiItem.inputs.length === 0)
            continue;
        if (abiItem.inputs.length !== args.length)
            continue;
        const matched = args.every((arg, index) => {
            const abiParameter = 'inputs' in abiItem && abiItem.inputs[index];
            if (!abiParameter)
                return false;
            return isArgOfType(arg, abiParameter);
        });
        if (matched) {
            // Check for ambiguity against already matched parameters (e.g. `address` vs `bytes20`).
            if (matchedAbiItem &&
                'inputs' in matchedAbiItem &&
                matchedAbiItem.inputs) {
                const ambiguousTypes = getAmbiguousTypes(abiItem.inputs, matchedAbiItem.inputs, args);
                if (ambiguousTypes)
                    throw new AmbiguityError({
                        abiItem,
                        type: ambiguousTypes[0],
                    }, {
                        abiItem: matchedAbiItem,
                        type: ambiguousTypes[1],
                    });
            }
            matchedAbiItem = abiItem;
        }
    }
    const abiItem = (() => {
        if (matchedAbiItem)
            return matchedAbiItem;
        const [abiItem, ...overloads] = abiItems;
        return { ...abiItem, overloads };
    })();
    if (!abiItem)
        throw new NotFoundError({ name: name });
    return {
        ...abiItem,
        ...(prepare ? { hash: getSignatureHash(abiItem) } : {}),
    };
}
// eslint-disable-next-line jsdoc/require-jsdoc
function getSelector$1(...parameters) {
    const abiItem = (() => {
        if (Array.isArray(parameters[0])) {
            const [abi, name] = parameters;
            return fromAbi$2(abi, name);
        }
        return parameters[0];
    })();
    return slice$2(getSignatureHash(abiItem), 0, 4);
}
// eslint-disable-next-line jsdoc/require-jsdoc
function getSignature(...parameters) {
    const abiItem = (() => {
        if (Array.isArray(parameters[0])) {
            const [abi, name] = parameters;
            return fromAbi$2(abi, name);
        }
        return parameters[0];
    })();
    const signature = (() => {
        if (typeof abiItem === 'string')
            return abiItem;
        return formatAbiItem$1(abiItem);
    })();
    return normalizeSignature(signature);
}
// eslint-disable-next-line jsdoc/require-jsdoc
function getSignatureHash(...parameters) {
    const abiItem = (() => {
        if (Array.isArray(parameters[0])) {
            const [abi, name] = parameters;
            return fromAbi$2(abi, name);
        }
        return parameters[0];
    })();
    if (typeof abiItem !== 'string' && 'hash' in abiItem && abiItem.hash)
        return abiItem.hash;
    return keccak256(fromString$1(getSignature(abiItem)));
}
/**
 * Throws when ambiguous types are found on overloaded ABI items.
 *
 * @example
 * ```ts twoslash
 * import { Abi, AbiFunction } from 'ox'
 *
 * const foo = Abi.from(['function foo(address)', 'function foo(bytes20)'])
 * AbiFunction.fromAbi(foo, 'foo', {
 *   args: ['0xA0Cf798816D4b9b9866b5330EEa46a18382f251e'],
 * })
 * // @error: AbiItem.AmbiguityError: Found ambiguous types in overloaded ABI Items.
 * // @error: `bytes20` in `foo(bytes20)`, and
 * // @error: `address` in `foo(address)`
 * // @error: These types encode differently and cannot be distinguished at runtime.
 * // @error: Remove one of the ambiguous items in the ABI.
 * ```
 *
 * ### Solution
 *
 * Remove one of the ambiguous types from the ABI.
 *
 * ```ts twoslash
 * import { Abi, AbiFunction } from 'ox'
 *
 * const foo = Abi.from([
 *   'function foo(address)',
 *   'function foo(bytes20)' // [!code --]
 * ])
 * AbiFunction.fromAbi(foo, 'foo', {
 *   args: ['0xA0Cf798816D4b9b9866b5330EEa46a18382f251e'],
 * })
 * // @error: AbiItem.AmbiguityError: Found ambiguous types in overloaded ABI Items.
 * // @error: `bytes20` in `foo(bytes20)`, and
 * // @error: `address` in `foo(address)`
 * // @error: These types encode differently and cannot be distinguished at runtime.
 * // @error: Remove one of the ambiguous items in the ABI.
 * ```
 */
class AmbiguityError extends BaseError$1 {
    constructor(x, y) {
        super('Found ambiguous types in overloaded ABI Items.', {
            metaMessages: [
                // TODO: abitype to add support for signature-formatted ABI items.
                `\`${x.type}\` in \`${normalizeSignature(formatAbiItem$1(x.abiItem))}\`, and`,
                `\`${y.type}\` in \`${normalizeSignature(formatAbiItem$1(y.abiItem))}\``,
                '',
                'These types encode differently and cannot be distinguished at runtime.',
                'Remove one of the ambiguous items in the ABI.',
            ],
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'AbiItem.AmbiguityError'
        });
    }
}
/**
 * Throws when an ABI item is not found in the ABI.
 *
 * @example
 * ```ts twoslash
 * // @noErrors
 * import { Abi, AbiFunction } from 'ox'
 *
 * const foo = Abi.from([
 *   'function foo(address)',
 *   'function bar(uint)'
 * ])
 * AbiFunction.fromAbi(foo, 'baz')
 * // @error: AbiItem.NotFoundError: ABI function with name "baz" not found.
 * ```
 *
 * ### Solution
 *
 * Ensure the ABI item exists on the ABI.
 *
 * ```ts twoslash
 * // @noErrors
 * import { Abi, AbiFunction } from 'ox'
 *
 * const foo = Abi.from([
 *   'function foo(address)',
 *   'function bar(uint)',
 *   'function baz(bool)' // [!code ++]
 * ])
 * AbiFunction.fromAbi(foo, 'baz')
 * ```
 */
class NotFoundError extends BaseError$1 {
    constructor({ name, data, type = 'item', }) {
        const selector = (() => {
            if (name)
                return ` with name "${name}"`;
            if (data)
                return ` with data "${data}"`;
            return '';
        })();
        super(`ABI ${type}${selector} not found.`);
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'AbiItem.NotFoundError'
        });
    }
}

// eslint-disable-next-line jsdoc/require-jsdoc
function encode(...parameters) {
    const [abiConstructor, options] = (() => {
        if (Array.isArray(parameters[0])) {
            const [abi, options] = parameters;
            return [fromAbi$1(abi), options];
        }
        return parameters;
    })();
    const { bytecode, args } = options;
    return concat$1(bytecode, abiConstructor.inputs?.length && args?.length
        ? encode$1(abiConstructor.inputs, args)
        : '0x');
}
/** @internal */
function from$1(abiConstructor) {
    return from$2(abiConstructor);
}
/** @internal */
function fromAbi$1(abi) {
    const item = abi.find((item) => item.type === 'constructor');
    if (!item)
        throw new NotFoundError({ name: 'constructor' });
    return item;
}

// eslint-disable-next-line jsdoc/require-jsdoc
function encodeData(...parameters) {
    const [abiFunction, args = []] = (() => {
        if (Array.isArray(parameters[0])) {
            const [abi, name, args] = parameters;
            return [fromAbi(abi, name, { args }), args];
        }
        const [abiFunction, args] = parameters;
        return [abiFunction, args];
    })();
    const { overloads } = abiFunction;
    const item = overloads
        ? fromAbi([abiFunction, ...overloads], abiFunction.name, {
            args,
        })
        : abiFunction;
    const selector = getSelector(item);
    const data = args.length > 0 ? encode$1(item.inputs, args) : undefined;
    return data ? concat$1(selector, data) : selector;
}
/**
 * Parses an arbitrary **JSON ABI Function** or **Human Readable ABI Function** into a typed {@link ox#AbiFunction.AbiFunction}.
 *
 * @example
 * ### JSON ABIs
 *
 * ```ts twoslash
 * import { AbiFunction } from 'ox'
 *
 * const approve = AbiFunction.from({
 *   type: 'function',
 *   name: 'approve',
 *   stateMutability: 'nonpayable',
 *   inputs: [
 *     {
 *       name: 'spender',
 *       type: 'address',
 *     },
 *     {
 *       name: 'amount',
 *       type: 'uint256',
 *     },
 *   ],
 *   outputs: [{ type: 'bool' }],
 * })
 *
 * approve
 * //^?
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 * ```
 *
 * @example
 * ### Human Readable ABIs
 *
 * A Human Readable ABI can be parsed into a typed ABI object:
 *
 * ```ts twoslash
 * import { AbiFunction } from 'ox'
 *
 * const approve = AbiFunction.from(
 *   'function approve(address spender, uint256 amount) returns (bool)' // [!code hl]
 * )
 *
 * approve
 * //^?
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 * ```
 *
 * @example
 * It is possible to specify `struct`s along with your definitions:
 *
 * ```ts twoslash
 * import { AbiFunction } from 'ox'
 *
 * const approve = AbiFunction.from([
 *   'struct Foo { address spender; uint256 amount; }', // [!code hl]
 *   'function approve(Foo foo) returns (bool)',
 * ])
 *
 * approve
 * //^?
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 * ```
 *
 *
 *
 * @param abiFunction - The ABI Function to parse.
 * @returns Typed ABI Function.
 */
function from(abiFunction, options = {}) {
    return from$2(abiFunction, options);
}
/**
 * Extracts an {@link ox#AbiFunction.AbiFunction} from an {@link ox#Abi.Abi} given a name and optional arguments.
 *
 * @example
 * ### Extracting by Name
 *
 * ABI Functions can be extracted by their name using the `name` option:
 *
 * ```ts twoslash
 * import { Abi, AbiFunction } from 'ox'
 *
 * const abi = Abi.from([
 *   'function foo()',
 *   'event Transfer(address owner, address to, uint256 tokenId)',
 *   'function bar(string a) returns (uint256 x)',
 * ])
 *
 * const item = AbiFunction.fromAbi(abi, 'foo') // [!code focus]
 * //    ^?
 *
 *
 *
 *
 *
 *
 * ```
 *
 * @example
 * ### Extracting by Selector
 *
 * ABI Functions can be extract by their selector when {@link ox#Hex.Hex} is provided to `name`.
 *
 * ```ts twoslash
 * import { Abi, AbiFunction } from 'ox'
 *
 * const abi = Abi.from([
 *   'function foo()',
 *   'event Transfer(address owner, address to, uint256 tokenId)',
 *   'function bar(string a) returns (uint256 x)',
 * ])
 * const item = AbiFunction.fromAbi(abi, '0x095ea7b3') // [!code focus]
 * //    ^?
 *
 *
 *
 *
 *
 *
 *
 *
 *
 * ```
 *
 * :::note
 *
 * Extracting via a hex selector is useful when extracting an ABI Function from an `eth_call` RPC response or
 * from a Transaction `input`.
 *
 * :::
 *
 * @param abi - The ABI to extract from.
 * @param name - The name (or selector) of the ABI item to extract.
 * @param options - Extraction options.
 * @returns The ABI item.
 */
function fromAbi(abi, name, options) {
    const item = fromAbi$2(abi, name, options);
    if (item.type !== 'function')
        throw new NotFoundError({ name, type: 'function' });
    return item;
}
/**
 * Computes the [4-byte selector](https://solidity-by-example.org/function-selector/) for an {@link ox#AbiFunction.AbiFunction}.
 *
 * Useful for computing function selectors for calldata.
 *
 * @example
 * ```ts twoslash
 * import { AbiFunction } from 'ox'
 *
 * const selector = AbiFunction.getSelector('function ownerOf(uint256 tokenId)')
 * // @log: '0x6352211e'
 * ```
 *
 * @example
 * ```ts twoslash
 * import { AbiFunction } from 'ox'
 *
 * const selector = AbiFunction.getSelector({
 *   inputs: [{ type: 'uint256' }],
 *   name: 'ownerOf',
 *   outputs: [],
 *   stateMutability: 'view',
 *   type: 'function'
 * })
 * // @log: '0x6352211e'
 * ```
 *
 * @param abiItem - The ABI item to compute the selector for.
 * @returns The first 4 bytes of the {@link ox#Hash.(keccak256:function)} hash of the function signature.
 */
function getSelector(abiItem) {
    return getSelector$1(abiItem);
}

const ethAddress = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
const zeroAddress = '0x0000000000000000000000000000000000000000';

const getBalanceCode = '0x6080604052348015600e575f80fd5b5061016d8061001c5f395ff3fe608060405234801561000f575f80fd5b5060043610610029575f3560e01c8063f8b2cb4f1461002d575b5f80fd5b610047600480360381019061004291906100db565b61005d565b604051610054919061011e565b60405180910390f35b5f8173ffffffffffffffffffffffffffffffffffffffff16319050919050565b5f80fd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f6100aa82610081565b9050919050565b6100ba816100a0565b81146100c4575f80fd5b50565b5f813590506100d5816100b1565b92915050565b5f602082840312156100f0576100ef61007d565b5b5f6100fd848285016100c7565b91505092915050565b5f819050919050565b61011881610106565b82525050565b5f6020820190506101315f83018461010f565b9291505056fea26469706673582212203b9fe929fe995c7cf9887f0bdba8a36dd78e8b73f149b17d2d9ad7cd09d2dc6264736f6c634300081a0033';
/**
 * Simulates execution of a batch of calls.
 *
 * @param client - Client to use
 * @param parameters - {@link SimulateCallsParameters}
 * @returns Results. {@link SimulateCallsReturnType}
 *
 * @example
 * ```ts
 * import { createPublicClient, http, parseEther } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { simulateCalls } from 'viem/actions'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 *
 * const result = await simulateCalls(client, {
 *   account: '0x5a0b54d5dc17e482fe8b0bdca5320161b95fb929',
 *   calls: [{
 *     {
 *       data: '0xdeadbeef',
 *       to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
 *     },
 *     {
 *       to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
 *       value: parseEther('1'),
 *     },
 *   ]
 * })
 * ```
 */
async function simulateCalls(client, parameters) {
    const { blockNumber, blockTag, calls, stateOverrides, traceAssetChanges, traceTransfers, validation, } = parameters;
    const account = parameters.account
        ? parseAccount(parameters.account)
        : undefined;
    if (traceAssetChanges && !account)
        throw new BaseError('`account` is required when `traceAssetChanges` is true');
    // Derive bytecode to extract ETH balance via a contract call.
    const getBalanceData = account
        ? encode(from$1('constructor(bytes, bytes)'), {
            bytecode: deploylessCallViaBytecodeBytecode,
            args: [
                getBalanceCode,
                encodeData(from('function getBalance(address)'), [account.address]),
            ],
        })
        : undefined;
    // Fetch ERC20/721 addresses that were "touched" from the calls.
    const assetAddresses = traceAssetChanges
        ? await Promise.all(parameters.calls.map(async (call) => {
            if (!call.data && !call.abi)
                return;
            const { accessList } = await createAccessList(client, {
                account: account.address,
                ...call,
                data: call.abi ? encodeFunctionData(call) : call.data,
            });
            return accessList.map(({ address, storageKeys }) => storageKeys.length > 0 ? address : null);
        })).then((x) => x.flat().filter(Boolean))
        : [];
    const blocks = await simulateBlocks(client, {
        blockNumber,
        blockTag: blockTag,
        blocks: [
            ...(traceAssetChanges
                ? [
                    // ETH pre balances
                    {
                        calls: [{ data: getBalanceData }],
                        stateOverrides,
                    },
                    // Asset pre balances
                    {
                        calls: assetAddresses.map((address, i) => ({
                            abi: [
                                from('function balanceOf(address) returns (uint256)'),
                            ],
                            functionName: 'balanceOf',
                            args: [account.address],
                            to: address,
                            from: zeroAddress,
                            nonce: i,
                        })),
                        stateOverrides: [
                            {
                                address: zeroAddress,
                                nonce: 0,
                            },
                        ],
                    },
                ]
                : []),
            {
                calls: [...calls, { to: zeroAddress }].map((call) => ({
                    ...call,
                    from: account?.address,
                })),
                stateOverrides,
            },
            ...(traceAssetChanges
                ? [
                    // ETH post balances
                    {
                        calls: [{ data: getBalanceData }],
                    },
                    // Asset post balances
                    {
                        calls: assetAddresses.map((address, i) => ({
                            abi: [
                                from('function balanceOf(address) returns (uint256)'),
                            ],
                            functionName: 'balanceOf',
                            args: [account.address],
                            to: address,
                            from: zeroAddress,
                            nonce: i,
                        })),
                        stateOverrides: [
                            {
                                address: zeroAddress,
                                nonce: 0,
                            },
                        ],
                    },
                    // Decimals
                    {
                        calls: assetAddresses.map((address, i) => ({
                            to: address,
                            abi: [
                                from('function decimals() returns (uint256)'),
                            ],
                            functionName: 'decimals',
                            from: zeroAddress,
                            nonce: i,
                        })),
                        stateOverrides: [
                            {
                                address: zeroAddress,
                                nonce: 0,
                            },
                        ],
                    },
                    // Token URI
                    {
                        calls: assetAddresses.map((address, i) => ({
                            to: address,
                            abi: [
                                from('function tokenURI(uint256) returns (string)'),
                            ],
                            functionName: 'tokenURI',
                            args: [0n],
                            from: zeroAddress,
                            nonce: i,
                        })),
                        stateOverrides: [
                            {
                                address: zeroAddress,
                                nonce: 0,
                            },
                        ],
                    },
                    // Symbols
                    {
                        calls: assetAddresses.map((address, i) => ({
                            to: address,
                            abi: [from('function symbol() returns (string)')],
                            functionName: 'symbol',
                            from: zeroAddress,
                            nonce: i,
                        })),
                        stateOverrides: [
                            {
                                address: zeroAddress,
                                nonce: 0,
                            },
                        ],
                    },
                ]
                : []),
        ],
        traceTransfers,
        validation,
    });
    const block_results = traceAssetChanges ? blocks[2] : blocks[0];
    const [block_ethPre, block_assetsPre, , block_ethPost, block_assetsPost, block_decimals, block_tokenURI, block_symbols,] = traceAssetChanges ? blocks : [];
    // Extract call results from the simulation.
    const { calls: block_calls, ...block } = block_results;
    const results = block_calls.slice(0, -1) ?? [];
    // Extract pre-execution ETH and asset balances.
    const ethPre = block_ethPre?.calls ?? [];
    const assetsPre = block_assetsPre?.calls ?? [];
    const balancesPre = [...ethPre, ...assetsPre].map((call) => call.status === 'success' ? hexToBigInt(call.data) : null);
    // Extract post-execution ETH and asset balances.
    const ethPost = block_ethPost?.calls ?? [];
    const assetsPost = block_assetsPost?.calls ?? [];
    const balancesPost = [...ethPost, ...assetsPost].map((call) => call.status === 'success' ? hexToBigInt(call.data) : null);
    // Extract asset symbols & decimals.
    const decimals = (block_decimals?.calls ?? []).map((x) => x.status === 'success' ? x.result : null);
    const symbols = (block_symbols?.calls ?? []).map((x) => x.status === 'success' ? x.result : null);
    const tokenURI = (block_tokenURI?.calls ?? []).map((x) => x.status === 'success' ? x.result : null);
    const changes = [];
    for (const [i, balancePost] of balancesPost.entries()) {
        const balancePre = balancesPre[i];
        if (typeof balancePost !== 'bigint')
            continue;
        if (typeof balancePre !== 'bigint')
            continue;
        const decimals_ = decimals[i - 1];
        const symbol_ = symbols[i - 1];
        const tokenURI_ = tokenURI[i - 1];
        const token = (() => {
            if (i === 0)
                return {
                    address: ethAddress,
                    decimals: 18,
                    symbol: 'ETH',
                };
            return {
                address: assetAddresses[i - 1],
                decimals: tokenURI_ || decimals_ ? Number(decimals_ ?? 1) : undefined,
                symbol: symbol_ ?? undefined,
            };
        })();
        if (changes.some((change) => change.token.address === token.address))
            continue;
        changes.push({
            token,
            value: {
                pre: balancePre,
                post: balancePost,
                diff: balancePost - balancePre,
            },
        });
    }
    return {
        assetChanges: changes,
        block,
        results,
    };
}

/**
 * Magic bytes used to identify ERC-6492 wrapped signatures.
 */
const magicBytes = '0x6492649264926492649264926492649264926492649264926492649264926492';
/**
 * Asserts that the wrapped signature is valid.
 *
 * @example
 * ```ts twoslash
 * import { SignatureErc6492 } from 'ox/erc6492'
 *
 * SignatureErc6492.assert('0xdeadbeef')
 * // @error: InvalidWrappedSignatureError: Value `0xdeadbeef` is an invalid ERC-6492 wrapped signature.
 * ```
 *
 * @param wrapped - The wrapped signature to assert.
 */
function assert(wrapped) {
    if (slice$2(wrapped, -32) !== magicBytes)
        throw new InvalidWrappedSignatureError(wrapped);
}
/**
 * Serializes an [ERC-6492 wrapped signature](https://eips.ethereum.org/EIPS/eip-6492#specification).
 *
 * @example
 * ```ts twoslash
 * import { Secp256k1, Signature } from 'ox'
 * import { SignatureErc6492 } from 'ox/erc6492' // [!code focus]
 *
 * const signature = Secp256k1.sign({
 *   payload: '0x...',
 *   privateKey: '0x...',
 * })
 *
 * const wrapped = SignatureErc6492.wrap({ // [!code focus]
 *   data: '0xdeadbeef', // [!code focus]
 *   signature: Signature.toHex(signature), // [!code focus]
 *   to: '0x00000000219ab540356cBB839Cbe05303d7705Fa', // [!code focus]
 * }) // [!code focus]
 * ```
 *
 * @param value - Wrapped signature to serialize.
 * @returns Serialized wrapped signature.
 */
function wrap(value) {
    const { data, signature, to } = value;
    return concat$1(encode$1(from$5('address, bytes, bytes'), [
        to,
        data,
        signature,
    ]), magicBytes);
}
/**
 * Validates a wrapped signature. Returns `true` if the wrapped signature is valid, `false` otherwise.
 *
 * @example
 * ```ts twoslash
 * import { SignatureErc6492 } from 'ox/erc6492'
 *
 * const valid = SignatureErc6492.validate('0xdeadbeef')
 * // @log: false
 * ```
 *
 * @param wrapped - The wrapped signature to validate.
 * @returns `true` if the wrapped signature is valid, `false` otherwise.
 */
function validate(wrapped) {
    try {
        assert(wrapped);
        return true;
    }
    catch {
        return false;
    }
}
/** Thrown when the ERC-6492 wrapped signature is invalid. */
class InvalidWrappedSignatureError extends BaseError$1 {
    constructor(wrapped) {
        super(`Value \`${wrapped}\` is an invalid ERC-6492 wrapped signature.`);
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'SignatureErc6492.InvalidWrappedSignatureError'
        });
    }
}

/**
 * Verifies a message hash onchain using ERC-6492.
 *
 * @param client - Client to use.
 * @param parameters - {@link VerifyHashParameters}
 * @returns Whether or not the signature is valid. {@link VerifyHashReturnType}
 */
async function verifyHash(client, parameters) {
    const { address, chain = client.chain, hash, erc6492VerifierAddress: verifierAddress = parameters.universalSignatureVerifierAddress ??
        chain?.contracts?.erc6492Verifier?.address, multicallAddress = parameters.multicallAddress ??
        chain?.contracts?.multicall3?.address, mode = 'auto', } = parameters;
    if (chain?.verifyHash)
        return await chain.verifyHash(client, parameters);
    const signature = (() => {
        const signature = parameters.signature;
        if (isHex(signature))
            return signature;
        if (typeof signature === 'object' && 'r' in signature && 's' in signature)
            return serializeSignature(signature);
        return bytesToHex(signature);
    })();
    try {
        if (mode === 'eoa') {
            try {
                const verified = isAddressEqual(getAddress(address), await recoverAddress({ hash, signature }));
                if (verified)
                    return true;
            }
            catch { }
        }
        if (validate$1(signature))
            return await verifyErc8010(client, {
                ...parameters,
                multicallAddress,
                signature,
            });
        return await verifyErc6492(client, {
            ...parameters,
            verifierAddress,
            signature,
        });
    }
    catch (error) {
        if (mode !== 'eoa') {
            // Fallback attempt to verify the signature via ECDSA recovery.
            try {
                const verified = isAddressEqual(getAddress(address), await recoverAddress({ hash, signature }));
                if (verified)
                    return true;
            }
            catch { }
        }
        if (error instanceof VerificationError) {
            // if the execution fails, the signature was not valid and an internal method inside of the validator reverted
            // this can happen for many reasons, for example if signer can not be recovered from the signature
            // or if the signature has no valid format
            return false;
        }
        throw error;
    }
}
/** @internal */
async function verifyErc8010(client, parameters) {
    const { address, blockNumber, blockTag, hash, multicallAddress } = parameters;
    const { authorization: authorization_ox, data: initData, signature, to, } = unwrap(parameters.signature);
    // Check if already delegated
    const code = await getCode(client, {
        address,
        blockNumber,
        blockTag,
    });
    // If already delegated, perform standard ERC-1271 verification.
    if (code === concatHex(['0xef0100', authorization_ox.address]))
        return await verifyErc1271(client, {
            address,
            blockNumber,
            blockTag,
            hash,
            signature,
        });
    const authorization = {
        address: authorization_ox.address,
        chainId: Number(authorization_ox.chainId),
        nonce: Number(authorization_ox.nonce),
        r: numberToHex(authorization_ox.r, { size: 32 }),
        s: numberToHex(authorization_ox.s, { size: 32 }),
        yParity: authorization_ox.yParity,
    };
    const valid = await verifyAuthorization({
        address,
        authorization,
    });
    if (!valid)
        throw new VerificationError();
    // Deployless verification.
    const results = await getAction(client, readContract, 'readContract')({
        ...(multicallAddress
            ? { address: multicallAddress }
            : { code: multicall3Bytecode }),
        authorizationList: [authorization],
        abi: multicall3Abi,
        blockNumber,
        blockTag: 'pending',
        functionName: 'aggregate3',
        args: [
            [
                ...(initData
                    ? [
                        {
                            allowFailure: true,
                            target: to ?? address,
                            callData: initData,
                        },
                    ]
                    : []),
                {
                    allowFailure: true,
                    target: address,
                    callData: encodeFunctionData({
                        abi: erc1271Abi,
                        functionName: 'isValidSignature',
                        args: [hash, signature],
                    }),
                },
            ],
        ],
    });
    const data = results[results.length - 1]?.returnData;
    if (data?.startsWith('0x1626ba7e'))
        return true;
    throw new VerificationError();
}
/** @internal */
// biome-ignore lint/correctness/noUnusedVariables: _
async function verifyErc6492(client, parameters) {
    const { address, factory, factoryData, hash, signature, verifierAddress, ...rest } = parameters;
    const wrappedSignature = await (async () => {
        // If no `factory` or `factoryData` is provided, it is assumed that the
        // address is not a Smart Account, or the Smart Account is already deployed.
        if (!factory && !factoryData)
            return signature;
        // If the signature is already wrapped, return the signature.
        if (validate(signature))
            return signature;
        // If the Smart Account is not deployed, wrap the signature with a 6492 wrapper
        // to perform counterfactual validation.
        return wrap({
            data: factoryData,
            signature,
            to: factory,
        });
    })();
    const args = verifierAddress
        ? {
            to: verifierAddress,
            data: encodeFunctionData({
                abi: erc6492SignatureValidatorAbi,
                functionName: 'isValidSig',
                args: [address, hash, wrappedSignature],
            }),
            ...rest,
        }
        : {
            data: encodeDeployData({
                abi: erc6492SignatureValidatorAbi,
                args: [address, hash, wrappedSignature],
                bytecode: erc6492SignatureValidatorByteCode,
            }),
            ...rest,
        };
    const { data } = await getAction(client, call, 'call')(args).catch((error) => {
        if (error instanceof CallExecutionError)
            throw new VerificationError();
        throw error;
    });
    if (hexToBool(data ?? '0x0'))
        return true;
    throw new VerificationError();
}
/** @internal */
async function verifyErc1271(client, parameters) {
    const { address, blockNumber, blockTag, hash, signature } = parameters;
    const result = await getAction(client, readContract, 'readContract')({
        address,
        abi: erc1271Abi,
        args: [hash, signature],
        blockNumber,
        blockTag,
        functionName: 'isValidSignature',
    }).catch((error) => {
        if (error instanceof ContractFunctionExecutionError)
            throw new VerificationError();
        throw error;
    });
    if (result.startsWith('0x1626ba7e'))
        return true;
    throw new VerificationError();
}
class VerificationError extends Error {
}

/**
 * Verify that a message was signed by the provided address.
 *
 * Compatible with Smart Contract Accounts & Externally Owned Accounts via [ERC-6492](https://eips.ethereum.org/EIPS/eip-6492).
 *
 * - Docs {@link https://viem.sh/docs/actions/public/verifyMessage}
 *
 * @param client - Client to use.
 * @param parameters - {@link VerifyMessageParameters}
 * @returns Whether or not the signature is valid. {@link VerifyMessageReturnType}
 */
async function verifyMessage(client, { address, message, factory, factoryData, signature, ...callRequest }) {
    const hash = hashMessage(message);
    return getAction(client, verifyHash, 'verifyHash')({
        address,
        factory: factory,
        factoryData: factoryData,
        hash,
        signature,
        ...callRequest,
    });
}

/**
 * Verify that typed data was signed by the provided address.
 *
 * - Docs {@link https://viem.sh/docs/actions/public/verifyTypedData}
 *
 * @param client - Client to use.
 * @param parameters - {@link VerifyTypedDataParameters}
 * @returns Whether or not the signature is valid. {@link VerifyTypedDataReturnType}
 */
async function verifyTypedData(client, parameters) {
    const { address, factory, factoryData, signature, message, primaryType, types, domain, ...callRequest } = parameters;
    const hash = hashTypedData({ message, primaryType, types, domain });
    return getAction(client, verifyHash, 'verifyHash')({
        address,
        factory: factory,
        factoryData: factoryData,
        hash,
        signature,
        ...callRequest,
    });
}

/**
 * Watches and returns incoming block numbers.
 *
 * - Docs: https://viem.sh/docs/actions/public/watchBlockNumber
 * - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/blocks_watching-blocks
 * - JSON-RPC Methods:
 *   - When `poll: true`, calls [`eth_blockNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_blocknumber) on a polling interval.
 *   - When `poll: false` & WebSocket Transport, uses a WebSocket subscription via [`eth_subscribe`](https://docs.alchemy.com/reference/eth-subscribe-polygon) and the `"newHeads"` event.
 *
 * @param client - Client to use
 * @param parameters - {@link WatchBlockNumberParameters}
 * @returns A function that can be invoked to stop watching for new block numbers. {@link WatchBlockNumberReturnType}
 *
 * @example
 * import { createPublicClient, watchBlockNumber, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const unwatch = watchBlockNumber(client, {
 *   onBlockNumber: (blockNumber) => console.log(blockNumber),
 * })
 */
function watchBlockNumber(client, { emitOnBegin = false, emitMissed = false, onBlockNumber, onError, poll: poll_, pollingInterval = client.pollingInterval, }) {
    const enablePolling = (() => {
        if (typeof poll_ !== 'undefined')
            return poll_;
        if (client.transport.type === 'webSocket' ||
            client.transport.type === 'ipc')
            return false;
        if (client.transport.type === 'fallback' &&
            (client.transport.transports[0].config.type === 'webSocket' ||
                client.transport.transports[0].config.type === 'ipc'))
            return false;
        return true;
    })();
    let prevBlockNumber;
    const pollBlockNumber = () => {
        const observerId = stringify([
            'watchBlockNumber',
            client.uid,
            emitOnBegin,
            emitMissed,
            pollingInterval,
        ]);
        return observe(observerId, { onBlockNumber, onError }, (emit) => poll(async () => {
            try {
                const blockNumber = await getAction(client, getBlockNumber, 'getBlockNumber')({ cacheTime: 0 });
                if (prevBlockNumber !== undefined) {
                    // If the current block number is the same as the previous,
                    // we can skip.
                    if (blockNumber === prevBlockNumber)
                        return;
                    // If we have missed out on some previous blocks, and the
                    // `emitMissed` flag is truthy, let's emit those blocks.
                    if (blockNumber - prevBlockNumber > 1 && emitMissed) {
                        for (let i = prevBlockNumber + 1n; i < blockNumber; i++) {
                            emit.onBlockNumber(i, prevBlockNumber);
                            prevBlockNumber = i;
                        }
                    }
                }
                // If the next block number is greater than the previous,
                // it is not in the past, and we can emit the new block number.
                if (prevBlockNumber === undefined ||
                    blockNumber > prevBlockNumber) {
                    emit.onBlockNumber(blockNumber, prevBlockNumber);
                    prevBlockNumber = blockNumber;
                }
            }
            catch (err) {
                emit.onError?.(err);
            }
        }, {
            emitOnBegin,
            interval: pollingInterval,
        }));
    };
    const subscribeBlockNumber = () => {
        const observerId = stringify([
            'watchBlockNumber',
            client.uid,
            emitOnBegin,
            emitMissed,
        ]);
        return observe(observerId, { onBlockNumber, onError }, (emit) => {
            let active = true;
            let unsubscribe = () => (active = false);
            (async () => {
                try {
                    const transport = (() => {
                        if (client.transport.type === 'fallback') {
                            const transport = client.transport.transports.find((transport) => transport.config.type === 'webSocket' ||
                                transport.config.type === 'ipc');
                            if (!transport)
                                return client.transport;
                            return transport.value;
                        }
                        return client.transport;
                    })();
                    const { unsubscribe: unsubscribe_ } = await transport.subscribe({
                        params: ['newHeads'],
                        onData(data) {
                            if (!active)
                                return;
                            const blockNumber = hexToBigInt(data.result?.number);
                            emit.onBlockNumber(blockNumber, prevBlockNumber);
                            prevBlockNumber = blockNumber;
                        },
                        onError(error) {
                            emit.onError?.(error);
                        },
                    });
                    unsubscribe = unsubscribe_;
                    if (!active)
                        unsubscribe();
                }
                catch (err) {
                    onError?.(err);
                }
            })();
            return () => unsubscribe();
        });
    };
    return enablePolling ? pollBlockNumber() : subscribeBlockNumber();
}

/**
 * Waits for the [Transaction](https://viem.sh/docs/glossary/terms#transaction) to be included on a [Block](https://viem.sh/docs/glossary/terms#block) (one confirmation), and then returns the [Transaction Receipt](https://viem.sh/docs/glossary/terms#transaction-receipt).
 *
 * - Docs: https://viem.sh/docs/actions/public/waitForTransactionReceipt
 * - Example: https://stackblitz.com/github/wevm/viem/tree/main/examples/transactions_sending-transactions
 * - JSON-RPC Methods:
 *   - Polls [`eth_getTransactionReceipt`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getTransactionReceipt) on each block until it has been processed.
 *   - If a Transaction has been replaced:
 *     - Calls [`eth_getBlockByNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getblockbynumber) and extracts the transactions
 *     - Checks if one of the Transactions is a replacement
 *     - If so, calls [`eth_getTransactionReceipt`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getTransactionReceipt).
 *
 * The `waitForTransactionReceipt` action additionally supports Replacement detection (e.g. sped up Transactions).
 *
 * Transactions can be replaced when a user modifies their transaction in their wallet (to speed up or cancel). Transactions are replaced when they are sent from the same nonce.
 *
 * There are 3 types of Transaction Replacement reasons:
 *
 * - `repriced`: The gas price has been modified (e.g. different `maxFeePerGas`)
 * - `cancelled`: The Transaction has been cancelled (e.g. `value === 0n`)
 * - `replaced`: The Transaction has been replaced (e.g. different `value` or `data`)
 *
 * @param client - Client to use
 * @param parameters - {@link WaitForTransactionReceiptParameters}
 * @returns The transaction receipt. {@link WaitForTransactionReceiptReturnType}
 *
 * @example
 * import { createPublicClient, waitForTransactionReceipt, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const transactionReceipt = await waitForTransactionReceipt(client, {
 *   hash: '0x4ca7ee652d57678f26e887c149ab0735f41de37bcad58c9f6d3ed5824f15b74d',
 * })
 */
async function waitForTransactionReceipt(client, parameters) {
    const { checkReplacement = true, confirmations = 1, hash, onReplaced, retryCount = 6, retryDelay = ({ count }) => ~~(1 << count) * 200, // exponential backoff
    timeout = 180_000, } = parameters;
    const observerId = stringify(['waitForTransactionReceipt', client.uid, hash]);
    const pollingInterval = (() => {
        if (parameters.pollingInterval)
            return parameters.pollingInterval;
        if (client.chain?.experimental_preconfirmationTime)
            return client.chain.experimental_preconfirmationTime;
        return client.pollingInterval;
    })();
    let transaction;
    let replacedTransaction;
    let receipt;
    let retrying = false;
    let _unobserve;
    let _unwatch;
    const { promise, resolve, reject } = withResolvers();
    const timer = timeout
        ? setTimeout(() => {
            _unwatch?.();
            _unobserve?.();
            reject(new WaitForTransactionReceiptTimeoutError({ hash }));
        }, timeout)
        : undefined;
    _unobserve = observe(observerId, { onReplaced, resolve, reject }, async (emit) => {
        receipt = await getAction(client, getTransactionReceipt, 'getTransactionReceipt')({ hash }).catch(() => undefined);
        if (receipt && confirmations <= 1) {
            clearTimeout(timer);
            emit.resolve(receipt);
            _unobserve?.();
            return;
        }
        _unwatch = getAction(client, watchBlockNumber, 'watchBlockNumber')({
            emitMissed: true,
            emitOnBegin: true,
            poll: true,
            pollingInterval,
            async onBlockNumber(blockNumber_) {
                const done = (fn) => {
                    clearTimeout(timer);
                    _unwatch?.();
                    fn();
                    _unobserve?.();
                };
                let blockNumber = blockNumber_;
                if (retrying)
                    return;
                try {
                    // If we already have a valid receipt, let's check if we have enough
                    // confirmations. If we do, then we can resolve.
                    if (receipt) {
                        if (confirmations > 1 &&
                            (!receipt.blockNumber ||
                                blockNumber - receipt.blockNumber + 1n < confirmations))
                            return;
                        done(() => emit.resolve(receipt));
                        return;
                    }
                    // Get the transaction to check if it's been replaced.
                    // We need to retry as some RPC Providers may be slow to sync
                    // up mined transactions.
                    if (checkReplacement && !transaction) {
                        retrying = true;
                        await withRetry(async () => {
                            transaction = (await getAction(client, getTransaction, 'getTransaction')({ hash }));
                            if (transaction.blockNumber)
                                blockNumber = transaction.blockNumber;
                        }, {
                            delay: retryDelay,
                            retryCount,
                        });
                        retrying = false;
                    }
                    // Get the receipt to check if it's been processed.
                    receipt = await getAction(client, getTransactionReceipt, 'getTransactionReceipt')({ hash });
                    // Check if we have enough confirmations. If not, continue polling.
                    if (confirmations > 1 &&
                        (!receipt.blockNumber ||
                            blockNumber - receipt.blockNumber + 1n < confirmations))
                        return;
                    done(() => emit.resolve(receipt));
                }
                catch (err) {
                    // If the receipt is not found, the transaction will be pending.
                    // We need to check if it has potentially been replaced.
                    if (err instanceof TransactionNotFoundError ||
                        err instanceof TransactionReceiptNotFoundError) {
                        if (!transaction) {
                            retrying = false;
                            return;
                        }
                        try {
                            replacedTransaction = transaction;
                            // Let's retrieve the transactions from the current block.
                            // We need to retry as some RPC Providers may be slow to sync
                            // up mined blocks.
                            retrying = true;
                            const block = await withRetry(() => getAction(client, getBlock, 'getBlock')({
                                blockNumber,
                                includeTransactions: true,
                            }), {
                                delay: retryDelay,
                                retryCount,
                                shouldRetry: ({ error }) => error instanceof BlockNotFoundError,
                            });
                            retrying = false;
                            const replacementTransaction = block.transactions.find(({ from, nonce }) => from === replacedTransaction.from &&
                                nonce === replacedTransaction.nonce);
                            // If we couldn't find a replacement transaction, continue polling.
                            if (!replacementTransaction)
                                return;
                            // If we found a replacement transaction, return it's receipt.
                            receipt = await getAction(client, getTransactionReceipt, 'getTransactionReceipt')({
                                hash: replacementTransaction.hash,
                            });
                            // Check if we have enough confirmations. If not, continue polling.
                            if (confirmations > 1 &&
                                (!receipt.blockNumber ||
                                    blockNumber - receipt.blockNumber + 1n < confirmations))
                                return;
                            let reason = 'replaced';
                            if (replacementTransaction.to === replacedTransaction.to &&
                                replacementTransaction.value === replacedTransaction.value &&
                                replacementTransaction.input === replacedTransaction.input) {
                                reason = 'repriced';
                            }
                            else if (replacementTransaction.from === replacementTransaction.to &&
                                replacementTransaction.value === 0n) {
                                reason = 'cancelled';
                            }
                            done(() => {
                                emit.onReplaced?.({
                                    reason,
                                    replacedTransaction: replacedTransaction,
                                    transaction: replacementTransaction,
                                    transactionReceipt: receipt,
                                });
                                emit.resolve(receipt);
                            });
                        }
                        catch (err_) {
                            done(() => emit.reject(err_));
                        }
                    }
                    else {
                        done(() => emit.reject(err));
                    }
                }
            },
        });
    });
    return promise;
}

/**
 * Watches and returns information for incoming blocks.
 *
 * - Docs: https://viem.sh/docs/actions/public/watchBlocks
 * - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/blocks_watching-blocks
 * - JSON-RPC Methods:
 *   - When `poll: true`, calls [`eth_getBlockByNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getBlockByNumber) on a polling interval.
 *   - When `poll: false` & WebSocket Transport, uses a WebSocket subscription via [`eth_subscribe`](https://docs.alchemy.com/reference/eth-subscribe-polygon) and the `"newHeads"` event.
 *
 * @param client - Client to use
 * @param parameters - {@link WatchBlocksParameters}
 * @returns A function that can be invoked to stop watching for new block numbers. {@link WatchBlocksReturnType}
 *
 * @example
 * import { createPublicClient, watchBlocks, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const unwatch = watchBlocks(client, {
 *   onBlock: (block) => console.log(block),
 * })
 */
function watchBlocks(client, { blockTag = client.experimental_blockTag ?? 'latest', emitMissed = false, emitOnBegin = false, onBlock, onError, includeTransactions: includeTransactions_, poll: poll_, pollingInterval = client.pollingInterval, }) {
    const enablePolling = (() => {
        if (typeof poll_ !== 'undefined')
            return poll_;
        if (client.transport.type === 'webSocket' ||
            client.transport.type === 'ipc')
            return false;
        if (client.transport.type === 'fallback' &&
            (client.transport.transports[0].config.type === 'webSocket' ||
                client.transport.transports[0].config.type === 'ipc'))
            return false;
        return true;
    })();
    const includeTransactions = includeTransactions_ ?? false;
    let prevBlock;
    const pollBlocks = () => {
        const observerId = stringify([
            'watchBlocks',
            client.uid,
            blockTag,
            emitMissed,
            emitOnBegin,
            includeTransactions,
            pollingInterval,
        ]);
        return observe(observerId, { onBlock, onError }, (emit) => poll(async () => {
            try {
                const block = await getAction(client, getBlock, 'getBlock')({
                    blockTag,
                    includeTransactions,
                });
                if (block.number !== null && prevBlock?.number != null) {
                    // If the current block number is the same as the previous,
                    // we can skip.
                    if (block.number === prevBlock.number)
                        return;
                    // If we have missed out on some previous blocks, and the
                    // `emitMissed` flag is truthy, let's emit those blocks.
                    if (block.number - prevBlock.number > 1 && emitMissed) {
                        for (let i = prevBlock?.number + 1n; i < block.number; i++) {
                            const block = (await getAction(client, getBlock, 'getBlock')({
                                blockNumber: i,
                                includeTransactions,
                            }));
                            emit.onBlock(block, prevBlock);
                            prevBlock = block;
                        }
                    }
                }
                if (
                // If no previous block exists, emit.
                prevBlock?.number == null ||
                    // If the block tag is "pending" with no block number, emit.
                    (blockTag === 'pending' && block?.number == null) ||
                    // If the next block number is greater than the previous block number, emit.
                    // We don't want to emit blocks in the past.
                    (block.number !== null && block.number > prevBlock.number)) {
                    emit.onBlock(block, prevBlock);
                    prevBlock = block;
                }
            }
            catch (err) {
                emit.onError?.(err);
            }
        }, {
            emitOnBegin,
            interval: pollingInterval,
        }));
    };
    const subscribeBlocks = () => {
        let active = true;
        let emitFetched = true;
        let unsubscribe = () => (active = false);
        (async () => {
            try {
                if (emitOnBegin) {
                    getAction(client, getBlock, 'getBlock')({
                        blockTag,
                        includeTransactions,
                    })
                        .then((block) => {
                        if (!active)
                            return;
                        if (!emitFetched)
                            return;
                        onBlock(block, undefined);
                        emitFetched = false;
                    })
                        .catch(onError);
                }
                const transport = (() => {
                    if (client.transport.type === 'fallback') {
                        const transport = client.transport.transports.find((transport) => transport.config.type === 'webSocket' ||
                            transport.config.type === 'ipc');
                        if (!transport)
                            return client.transport;
                        return transport.value;
                    }
                    return client.transport;
                })();
                const { unsubscribe: unsubscribe_ } = await transport.subscribe({
                    params: ['newHeads'],
                    async onData(data) {
                        if (!active)
                            return;
                        const block = (await getAction(client, getBlock, 'getBlock')({
                            blockNumber: data.result?.number,
                            includeTransactions,
                        }).catch(() => { }));
                        if (!active)
                            return;
                        onBlock(block, prevBlock);
                        emitFetched = false;
                        prevBlock = block;
                    },
                    onError(error) {
                        onError?.(error);
                    },
                });
                unsubscribe = unsubscribe_;
                if (!active)
                    unsubscribe();
            }
            catch (err) {
                onError?.(err);
            }
        })();
        return () => unsubscribe();
    };
    return enablePolling ? pollBlocks() : subscribeBlocks();
}

/**
 * Watches and returns emitted [Event Logs](https://viem.sh/docs/glossary/terms#event-log).
 *
 * - Docs: https://viem.sh/docs/actions/public/watchEvent
 * - JSON-RPC Methods:
 *   - **RPC Provider supports `eth_newFilter`:**
 *     - Calls [`eth_newFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_newfilter) to create a filter (called on initialize).
 *     - On a polling interval, it will call [`eth_getFilterChanges`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getfilterchanges).
 *   - **RPC Provider does not support `eth_newFilter`:**
 *     - Calls [`eth_getLogs`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getlogs) for each block between the polling interval.
 *
 * This Action will batch up all the Event Logs found within the [`pollingInterval`](https://viem.sh/docs/actions/public/watchEvent#pollinginterval-optional), and invoke them via [`onLogs`](https://viem.sh/docs/actions/public/watchEvent#onLogs).
 *
 * `watchEvent` will attempt to create an [Event Filter](https://viem.sh/docs/actions/public/createEventFilter) and listen to changes to the Filter per polling interval, however, if the RPC Provider does not support Filters (e.g. `eth_newFilter`), then `watchEvent` will fall back to using [`getLogs`](https://viem.sh/docs/actions/public/getLogs) instead.
 *
 * @param client - Client to use
 * @param parameters - {@link WatchEventParameters}
 * @returns A function that can be invoked to stop watching for new Event Logs. {@link WatchEventReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { watchEvent } from 'viem/public'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const unwatch = watchEvent(client, {
 *   onLogs: (logs) => console.log(logs),
 * })
 */
function watchEvent(client, { address, args, batch = true, event, events, fromBlock, onError, onLogs, poll: poll_, pollingInterval = client.pollingInterval, strict: strict_, }) {
    const enablePolling = (() => {
        if (typeof poll_ !== 'undefined')
            return poll_;
        if (typeof fromBlock === 'bigint')
            return true;
        if (client.transport.type === 'webSocket' ||
            client.transport.type === 'ipc')
            return false;
        if (client.transport.type === 'fallback' &&
            (client.transport.transports[0].config.type === 'webSocket' ||
                client.transport.transports[0].config.type === 'ipc'))
            return false;
        return true;
    })();
    const strict = strict_ ?? false;
    const pollEvent = () => {
        const observerId = stringify([
            'watchEvent',
            address,
            args,
            batch,
            client.uid,
            event,
            pollingInterval,
            fromBlock,
        ]);
        return observe(observerId, { onLogs, onError }, (emit) => {
            let previousBlockNumber;
            if (fromBlock !== undefined)
                previousBlockNumber = fromBlock - 1n;
            let filter;
            let initialized = false;
            const unwatch = poll(async () => {
                if (!initialized) {
                    try {
                        filter = (await getAction(client, createEventFilter, 'createEventFilter')({
                            address,
                            args,
                            event: event,
                            events,
                            strict,
                            fromBlock,
                        }));
                    }
                    catch { }
                    initialized = true;
                    return;
                }
                try {
                    let logs;
                    if (filter) {
                        logs = await getAction(client, getFilterChanges, 'getFilterChanges')({ filter });
                    }
                    else {
                        // If the filter doesn't exist, we will fall back to use `getLogs`.
                        // The fall back exists because some RPC Providers do not support filters.
                        // Fetch the block number to use for `getLogs`.
                        const blockNumber = await getAction(client, getBlockNumber, 'getBlockNumber')({});
                        // If the block number has changed, we will need to fetch the logs.
                        // If the block number doesn't exist, we are yet to reach the first poll interval,
                        // so do not emit any logs.
                        if (previousBlockNumber && previousBlockNumber !== blockNumber) {
                            logs = await getAction(client, getLogs, 'getLogs')({
                                address,
                                args,
                                event: event,
                                events,
                                fromBlock: previousBlockNumber + 1n,
                                toBlock: blockNumber,
                            });
                        }
                        else {
                            logs = [];
                        }
                        previousBlockNumber = blockNumber;
                    }
                    if (logs.length === 0)
                        return;
                    if (batch)
                        emit.onLogs(logs);
                    else
                        for (const log of logs)
                            emit.onLogs([log]);
                }
                catch (err) {
                    // If a filter has been set and gets uninstalled, providers will throw an InvalidInput error.
                    // Reinitialize the filter when this occurs
                    if (filter && err instanceof InvalidInputRpcError)
                        initialized = false;
                    emit.onError?.(err);
                }
            }, {
                emitOnBegin: true,
                interval: pollingInterval,
            });
            return async () => {
                if (filter)
                    await getAction(client, uninstallFilter, 'uninstallFilter')({ filter });
                unwatch();
            };
        });
    };
    const subscribeEvent = () => {
        let active = true;
        let unsubscribe = () => (active = false);
        (async () => {
            try {
                const transport = (() => {
                    if (client.transport.type === 'fallback') {
                        const transport = client.transport.transports.find((transport) => transport.config.type === 'webSocket' ||
                            transport.config.type === 'ipc');
                        if (!transport)
                            return client.transport;
                        return transport.value;
                    }
                    return client.transport;
                })();
                const events_ = events ?? (event ? [event] : undefined);
                let topics = [];
                if (events_) {
                    const encoded = events_.flatMap((event) => encodeEventTopics({
                        abi: [event],
                        eventName: event.name,
                        args,
                    }));
                    // TODO: Clean up type casting
                    topics = [encoded];
                    if (event)
                        topics = topics[0];
                }
                const { unsubscribe: unsubscribe_ } = await transport.subscribe({
                    params: ['logs', { address, topics }],
                    onData(data) {
                        if (!active)
                            return;
                        const log = data.result;
                        try {
                            const { eventName, args } = decodeEventLog({
                                abi: events_ ?? [],
                                data: log.data,
                                topics: log.topics,
                                strict,
                            });
                            const formatted = formatLog(log, { args, eventName });
                            onLogs([formatted]);
                        }
                        catch (err) {
                            let eventName;
                            let isUnnamed;
                            if (err instanceof DecodeLogDataMismatch ||
                                err instanceof DecodeLogTopicsMismatch) {
                                // If strict mode is on, and log data/topics do not match event definition, skip.
                                if (strict_)
                                    return;
                                eventName = err.abiItem.name;
                                isUnnamed = err.abiItem.inputs?.some((x) => !('name' in x && x.name));
                            }
                            // Set args to empty if there is an error decoding (e.g. indexed/non-indexed params mismatch).
                            const formatted = formatLog(log, {
                                args: isUnnamed ? [] : {},
                                eventName,
                            });
                            onLogs([formatted]);
                        }
                    },
                    onError(error) {
                        onError?.(error);
                    },
                });
                unsubscribe = unsubscribe_;
                if (!active)
                    unsubscribe();
            }
            catch (err) {
                onError?.(err);
            }
        })();
        return () => unsubscribe();
    };
    return enablePolling ? pollEvent() : subscribeEvent();
}

/**
 * Watches and returns pending transaction hashes.
 *
 * - Docs: https://viem.sh/docs/actions/public/watchPendingTransactions
 * - JSON-RPC Methods:
 *   - When `poll: true`
 *     - Calls [`eth_newPendingTransactionFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_newpendingtransactionfilter) to initialize the filter.
 *     - Calls [`eth_getFilterChanges`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getFilterChanges) on a polling interval.
 *   - When `poll: false` & WebSocket Transport, uses a WebSocket subscription via [`eth_subscribe`](https://docs.alchemy.com/reference/eth-subscribe-polygon) and the `"newPendingTransactions"` event.
 *
 * This Action will batch up all the pending transactions found within the [`pollingInterval`](https://viem.sh/docs/actions/public/watchPendingTransactions#pollinginterval-optional), and invoke them via [`onTransactions`](https://viem.sh/docs/actions/public/watchPendingTransactions#ontransactions).
 *
 * @param client - Client to use
 * @param parameters - {@link WatchPendingTransactionsParameters}
 * @returns A function that can be invoked to stop watching for new pending transaction hashes. {@link WatchPendingTransactionsReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { watchPendingTransactions } from 'viem/public'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const unwatch = await watchPendingTransactions(client, {
 *   onTransactions: (hashes) => console.log(hashes),
 * })
 */
function watchPendingTransactions(client, { batch = true, onError, onTransactions, poll: poll_, pollingInterval = client.pollingInterval, }) {
    const enablePolling = typeof poll_ !== 'undefined'
        ? poll_
        : client.transport.type !== 'webSocket' && client.transport.type !== 'ipc';
    const pollPendingTransactions = () => {
        const observerId = stringify([
            'watchPendingTransactions',
            client.uid,
            batch,
            pollingInterval,
        ]);
        return observe(observerId, { onTransactions, onError }, (emit) => {
            let filter;
            const unwatch = poll(async () => {
                try {
                    if (!filter) {
                        try {
                            filter = await getAction(client, createPendingTransactionFilter, 'createPendingTransactionFilter')({});
                            return;
                        }
                        catch (err) {
                            unwatch();
                            throw err;
                        }
                    }
                    const hashes = await getAction(client, getFilterChanges, 'getFilterChanges')({ filter });
                    if (hashes.length === 0)
                        return;
                    if (batch)
                        emit.onTransactions(hashes);
                    else
                        for (const hash of hashes)
                            emit.onTransactions([hash]);
                }
                catch (err) {
                    emit.onError?.(err);
                }
            }, {
                emitOnBegin: true,
                interval: pollingInterval,
            });
            return async () => {
                if (filter)
                    await getAction(client, uninstallFilter, 'uninstallFilter')({ filter });
                unwatch();
            };
        });
    };
    const subscribePendingTransactions = () => {
        let active = true;
        let unsubscribe = () => (active = false);
        (async () => {
            try {
                const { unsubscribe: unsubscribe_ } = await client.transport.subscribe({
                    params: ['newPendingTransactions'],
                    onData(data) {
                        if (!active)
                            return;
                        const transaction = data.result;
                        onTransactions([transaction]);
                    },
                    onError(error) {
                        onError?.(error);
                    },
                });
                unsubscribe = unsubscribe_;
                if (!active)
                    unsubscribe();
            }
            catch (err) {
                onError?.(err);
            }
        })();
        return () => unsubscribe();
    };
    return enablePolling
        ? pollPendingTransactions()
        : subscribePendingTransactions();
}

/**
 * @description Parses EIP-4361 formatted message into message fields object.
 *
 * @see https://eips.ethereum.org/EIPS/eip-4361
 *
 * @returns EIP-4361 fields object
 */
function parseSiweMessage(message) {
    const { scheme, statement, ...prefix } = (message.match(prefixRegex)
        ?.groups ?? {});
    const { chainId, expirationTime, issuedAt, notBefore, requestId, ...suffix } = (message.match(suffixRegex)?.groups ?? {});
    const resources = message.split('Resources:')[1]?.split('\n- ').slice(1);
    return {
        ...prefix,
        ...suffix,
        ...(chainId ? { chainId: Number(chainId) } : {}),
        ...(expirationTime ? { expirationTime: new Date(expirationTime) } : {}),
        ...(issuedAt ? { issuedAt: new Date(issuedAt) } : {}),
        ...(notBefore ? { notBefore: new Date(notBefore) } : {}),
        ...(requestId ? { requestId } : {}),
        ...(resources ? { resources } : {}),
        ...(scheme ? { scheme } : {}),
        ...(statement ? { statement } : {}),
    };
}
// https://regexr.com/80gdj
const prefixRegex = /^(?:(?<scheme>[a-zA-Z][a-zA-Z0-9+-.]*):\/\/)?(?<domain>[a-zA-Z0-9+-.]*(?::[0-9]{1,5})?) (?:wants you to sign in with your Ethereum account:\n)(?<address>0x[a-fA-F0-9]{40})\n\n(?:(?<statement>.*)\n\n)?/;
// https://regexr.com/80gf9
const suffixRegex = /(?:URI: (?<uri>.+))\n(?:Version: (?<version>.+))\n(?:Chain ID: (?<chainId>\d+))\n(?:Nonce: (?<nonce>[a-zA-Z0-9]+))\n(?:Issued At: (?<issuedAt>.+))(?:\nExpiration Time: (?<expirationTime>.+))?(?:\nNot Before: (?<notBefore>.+))?(?:\nRequest ID: (?<requestId>.+))?/;

/**
 * @description Validates EIP-4361 message.
 *
 * @see https://eips.ethereum.org/EIPS/eip-4361
 */
function validateSiweMessage(parameters) {
    const { address, domain, message, nonce, scheme, time = new Date(), } = parameters;
    if (domain && message.domain !== domain)
        return false;
    if (nonce && message.nonce !== nonce)
        return false;
    if (scheme && message.scheme !== scheme)
        return false;
    if (message.expirationTime && time >= message.expirationTime)
        return false;
    if (message.notBefore && time < message.notBefore)
        return false;
    try {
        if (!message.address)
            return false;
        if (!isAddress(message.address, { strict: false }))
            return false;
        if (address && !isAddressEqual(message.address, address))
            return false;
    }
    catch {
        return false;
    }
    return true;
}

/**
 * Verifies [EIP-4361](https://eips.ethereum.org/EIPS/eip-4361) formatted message was signed.
 *
 * Compatible with Smart Contract Accounts & Externally Owned Accounts via [ERC-6492](https://eips.ethereum.org/EIPS/eip-6492).
 *
 * - Docs {@link https://viem.sh/docs/siwe/actions/verifySiweMessage}
 *
 * @param client - Client to use.
 * @param parameters - {@link VerifySiweMessageParameters}
 * @returns Whether or not the signature is valid. {@link VerifySiweMessageReturnType}
 */
async function verifySiweMessage(client, parameters) {
    const { address, domain, message, nonce, scheme, signature, time = new Date(), ...callRequest } = parameters;
    const parsed = parseSiweMessage(message);
    if (!parsed.address)
        return false;
    const isValid = validateSiweMessage({
        address,
        domain,
        message: parsed,
        nonce,
        scheme,
        time,
    });
    if (!isValid)
        return false;
    const hash = hashMessage(message);
    return verifyHash(client, {
        address: parsed.address,
        hash,
        signature,
        ...callRequest,
    });
}

/**
 * Sends a **signed** transaction to the network synchronously,
 * and waits for the transaction to be included in a block.
 *
 * - Docs: https://viem.sh/docs/actions/wallet/sendRawTransactionSync
 * - JSON-RPC Method: [`eth_sendRawTransactionSync`](https://eips.ethereum.org/EIPS/eip-7966)
 *
 * @param client - Client to use
 * @param parameters - {@link SendRawTransactionParameters}
 * @returns The transaction receipt. {@link SendRawTransactionSyncReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { sendRawTransactionSync } from 'viem/wallet'
 *
 * const client = createWalletClient({
 *   chain: mainnet,
 *   transport: custom(window.ethereum),
 * })
 *
 * const receipt = await sendRawTransactionSync(client, {
 *   serializedTransaction: '0x02f850018203118080825208808080c080a04012522854168b27e5dc3d5839bab5e6b39e1a0ffd343901ce1622e3d64b48f1a04e00902ae0502c4728cbf12156290df99c3ed7de85b1dbfe20b5c36931733a33'
 * })
 */
async function sendRawTransactionSync(client, { serializedTransaction, throwOnReceiptRevert, timeout, }) {
    const receipt = await client.request({
        method: 'eth_sendRawTransactionSync',
        params: timeout
            ? [serializedTransaction, timeout]
            : [serializedTransaction],
    }, { retryCount: 0 });
    const format = client.chain?.formatters?.transactionReceipt?.format ||
        formatTransactionReceipt;
    const formatted = format(receipt);
    if (formatted.status === 'reverted' && throwOnReceiptRevert)
        throw new TransactionReceiptRevertedError({ receipt: formatted });
    return formatted;
}

function publicActions(client) {
    return {
        call: (args) => call(client, args),
        createAccessList: (args) => createAccessList(client, args),
        createBlockFilter: () => createBlockFilter(client),
        createContractEventFilter: (args) => createContractEventFilter(client, args),
        createEventFilter: (args) => createEventFilter(client, args),
        createPendingTransactionFilter: () => createPendingTransactionFilter(client),
        estimateContractGas: (args) => estimateContractGas(client, args),
        estimateGas: (args) => estimateGas(client, args),
        getBalance: (args) => getBalance(client, args),
        getBlobBaseFee: () => getBlobBaseFee(client),
        getBlock: (args) => getBlock(client, args),
        getBlockNumber: (args) => getBlockNumber(client, args),
        getBlockReceipts: (args) => getBlockReceipts(client, args),
        getBlockTransactionCount: (args) => getBlockTransactionCount(client, args),
        getBytecode: (args) => getCode(client, args),
        getChainId: () => getChainId(client),
        getCode: (args) => getCode(client, args),
        getContractEvents: (args) => getContractEvents(client, args),
        getDelegation: (args) => getDelegation(client, args),
        getEip712Domain: (args) => getEip712Domain(client, args),
        getEnsAddress: (args) => getEnsAddress(client, args),
        getEnsAvatar: (args) => getEnsAvatar(client, args),
        getEnsName: (args) => getEnsName(client, args),
        getEnsResolver: (args) => getEnsResolver(client, args),
        getEnsText: (args) => getEnsText(client, args),
        getFeeHistory: (args) => getFeeHistory(client, args),
        estimateFeesPerGas: (args) => estimateFeesPerGas(client, args),
        getFilterChanges: (args) => getFilterChanges(client, args),
        getFilterLogs: (args) => getFilterLogs(client, args),
        getGasPrice: () => getGasPrice(client),
        getLogs: (args) => getLogs(client, args),
        getProof: (args) => getProof(client, args),
        estimateMaxPriorityFeePerGas: (args) => estimateMaxPriorityFeePerGas(client, args),
        fillTransaction: (args) => fillTransaction(client, args),
        getStorageAt: (args) => getStorageAt(client, args),
        getTransaction: (args) => getTransaction(client, args),
        getTransactionConfirmations: (args) => getTransactionConfirmations(client, args),
        getTransactionCount: (args) => getTransactionCount(client, args),
        getTransactionReceipt: (args) => getTransactionReceipt(client, args),
        multicall: (args) => multicall(client, args),
        prepareTransactionRequest: (args) => prepareTransactionRequest(client, args),
        readContract: (args) => readContract(client, args),
        sendRawTransaction: (args) => sendRawTransaction(client, args),
        sendRawTransactionSync: (args) => sendRawTransactionSync(client, args),
        simulate: (args) => simulateBlocks(client, args),
        simulateBlocks: (args) => simulateBlocks(client, args),
        simulateCalls: (args) => simulateCalls(client, args),
        simulateContract: (args) => simulateContract(client, args),
        verifyHash: (args) => verifyHash(client, args),
        verifyMessage: (args) => verifyMessage(client, args),
        verifySiweMessage: (args) => verifySiweMessage(client, args),
        verifyTypedData: (args) => verifyTypedData(client, args),
        uninstallFilter: (args) => uninstallFilter(client, args),
        waitForTransactionReceipt: (args) => waitForTransactionReceipt(client, args),
        watchBlocks: (args) => watchBlocks(client, args),
        watchBlockNumber: (args) => watchBlockNumber(client, args),
        watchContractEvent: (args) => watchContractEvent(client, args),
        watchEvent: (args) => watchEvent(client, args),
        watchPendingTransactions: (args) => watchPendingTransactions(client, args),
    };
}

/**
 * Creates a Public Client with a given [Transport](https://viem.sh/docs/clients/intro) configured for a [Chain](https://viem.sh/docs/clients/chains).
 *
 * - Docs: https://viem.sh/docs/clients/public
 *
 * A Public Client is an interface to "public" [JSON-RPC API](https://ethereum.org/en/developers/docs/apis/json-rpc/) methods such as retrieving block numbers, transactions, reading from smart contracts, etc through [Public Actions](/docs/actions/public/introduction).
 *
 * @param config - {@link PublicClientConfig}
 * @returns A Public Client. {@link PublicClient}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 */
function createPublicClient(parameters) {
    const { key = 'public', name = 'Public Client' } = parameters;
    const client = createClient({
        ...parameters,
        key,
        name,
        type: 'publicClient',
    });
    return client.extend(publicActions);
}

export { EnsAvatarInvalidNftUriError as E, FilterTypeNotSupportedError as F, EnsAvatarUnsupportedNamespaceError as a, EnsAvatarUriResolutionError as b, createPublicClient as c, decodeEventLog as d, encodeEventTopics as e, ethAddress as f, formatLog as g, formatTransactionReceipt as h, poll as i, publicActions as j, withCache as k, labelhash as l, namehash as n, observe as o, parseEventLogs as p, receiptStatuses as r, sendRawTransactionSync as s, waitForTransactionReceipt as w, zeroAddress as z };
//# sourceMappingURL=createPublicClient-CTNXUmkN.js.map
