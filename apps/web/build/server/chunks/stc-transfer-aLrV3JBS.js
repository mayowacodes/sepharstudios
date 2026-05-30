import { p as private_env, a as public_env } from './shared-server-DUDL94jl.js';
import { B as BaseError, G as numberToHex, U as UnsupportedNonOptionalCapabilityError, A as AtomicityNotSupportedError, u as hexToBigInt, K as parseAccount, x as hexToNumber, W as trim, Q as stringify, Y as withResolvers, Z as withRetry, C as isAddress, b as InvalidAddressError, N as size, k as bytesToHex, V as toHex, l as checksumAddress, r as getAddress, L as LruMap, P as stringToHex, n as createClient, D as isHex, w as hexToBytes, E as keccak256, y as http, M as polygon } from './polygon-D78JtxJX.js';
import { s as sendTransaction, A as AccountNotFoundError, b as assertCurrentChain, a as AccountTypeNotSupportedError, w as writeContract, p as parseUnits } from './parseUnits-CO0kRdLR.js';
import { a2 as encodeFunctionData, Q as concat, aw as getTransactionError, aQ as sliceHex, an as getAction, r as InvalidChainIdError, aB as maxUint256, F as FeeCapTooHighError, T as TipAboveFeeCapError, E as EmptyBlobError, aO as slice, u as InvalidVersionedHashSizeError, b3 as versionedHashVersionKzg, v as InvalidVersionedHashVersionError, t as InvalidStorageKeySizeError, ax as getTransactionType, V as concatHex, aZ as toRlp, K as blobsToCommitments, O as commitmentsToVersionedHashes, L as blobsToProofs, aV as toBlobSidecars, s as InvalidLegacyVError, a1 as encodeDeployData, ar as getChainId, av as getTransactionCount, aA as isAddressEqual, G as assertRequest, aK as recoverAuthorizationAddress, af as formatTransactionRequest, a9 as extract, y as TransactionReceiptRevertedError, aG as prepareTransactionRequest, _ as defaultParameters, aL as sendRawTransaction, aa as fillTransaction, ay as hashAuthorization, aH as publicKeyToAddress, ag as formatUnits } from './sendRawTransaction-DWMVY9UD.js';
import { p as parseAbi } from './parseAbi-CHRXt4jW.js';
import { secp256k1 } from './secp256k1-eLPjhWhb.js';
import { r as receiptStatuses, o as observe, p as poll, w as waitForTransactionReceipt, s as sendRawTransactionSync, g as getTypesForEIP712Domain, v as validateTypedData, e as serializeTypedData, d as serializeSignature, h as hashMessage, a as hashTypedData, c as createPublicClient, b as polygonAmoy } from './polygonAmoy-CXyEQt1S.js';

class BundleFailedError extends BaseError {
    constructor(result) {
        super(`Call bundle failed with status: ${result.statusCode}`, {
            name: 'BundleFailedError',
        });
        Object.defineProperty(this, "result", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.result = result;
    }
}

const fallbackMagicIdentifier = '0x5792579257925792579257925792579257925792579257925792579257925792';
const fallbackTransactionErrorMagicIdentifier = numberToHex(0, {
    size: 32,
});
/**
 * Requests the connected wallet to send a batch of calls.
 *
 * - Docs: https://viem.sh/docs/actions/wallet/sendCalls
 * - JSON-RPC Methods: [`wallet_sendCalls`](https://eips.ethereum.org/EIPS/eip-5792)
 *
 * @param client - Client to use
 * @returns Transaction identifier. {@link SendCallsReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { sendCalls } from 'viem/actions'
 *
 * const client = createWalletClient({
 *   chain: mainnet,
 *   transport: custom(window.ethereum),
 * })
 * const id = await sendCalls(client, {
 *   account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
 *   calls: [
 *     {
 *       data: '0xdeadbeef',
 *       to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
 *     },
 *     {
 *       to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
 *       value: 69420n,
 *     },
 *   ],
 * })
 */
async function sendCalls(client, parameters) {
    const { account: account_ = client.account, chain = client.chain, experimental_fallback, experimental_fallbackDelay = 32, forceAtomic = false, id, version = '2.0.0', } = parameters;
    const account = account_ ? parseAccount(account_) : null;
    let capabilities = parameters.capabilities;
    if (client.dataSuffix && !parameters.capabilities?.dataSuffix) {
        if (typeof client.dataSuffix === 'string')
            capabilities = {
                ...parameters.capabilities,
                dataSuffix: { value: client.dataSuffix, optional: true },
            };
        else
            capabilities = {
                ...parameters.capabilities,
                dataSuffix: {
                    value: client.dataSuffix.value,
                    ...(client.dataSuffix.required ? {} : { optional: true }),
                },
            };
    }
    const calls = parameters.calls.map((call_) => {
        const call = call_;
        const data = call.abi
            ? encodeFunctionData({
                abi: call.abi,
                functionName: call.functionName,
                args: call.args,
            })
            : call.data;
        return {
            data: call.dataSuffix && data ? concat([data, call.dataSuffix]) : data,
            to: call.to,
            value: call.value ? numberToHex(call.value) : undefined,
        };
    });
    try {
        const response = await client.request({
            method: 'wallet_sendCalls',
            params: [
                {
                    atomicRequired: forceAtomic,
                    calls,
                    capabilities,
                    chainId: numberToHex(chain.id),
                    from: account?.address,
                    id,
                    version,
                },
            ],
        }, { retryCount: 0 });
        if (typeof response === 'string')
            return { id: response };
        return response;
    }
    catch (err) {
        const error = err;
        // If the transport does not support EIP-5792, fall back to
        // `eth_sendTransaction`.
        if (experimental_fallback &&
            (error.name === 'MethodNotFoundRpcError' ||
                error.name === 'MethodNotSupportedRpcError' ||
                error.name === 'UnknownRpcError' ||
                error.details
                    .toLowerCase()
                    .includes('does not exist / is not available') ||
                error.details.toLowerCase().includes('missing or invalid. request()') ||
                error.details
                    .toLowerCase()
                    .includes('did not match any variant of untagged enum') ||
                error.details
                    .toLowerCase()
                    .includes('account upgraded to unsupported contract') ||
                error.details.toLowerCase().includes('eip-7702 not supported') ||
                error.details.toLowerCase().includes('unsupported wc_ method') ||
                // magic.link
                error.details
                    .toLowerCase()
                    .includes('feature toggled misconfigured') ||
                // Trust Wallet
                error.details
                    .toLowerCase()
                    .includes('jsonrpcengine: response has no error or result for request'))) {
            if (capabilities) {
                const hasNonOptionalCapability = Object.values(capabilities).some((capability) => !capability.optional);
                if (hasNonOptionalCapability) {
                    const message = 'non-optional `capabilities` are not supported on fallback to `eth_sendTransaction`.';
                    throw new UnsupportedNonOptionalCapabilityError(new BaseError(message, {
                        details: message,
                    }));
                }
            }
            if (forceAtomic && calls.length > 1) {
                const message = '`forceAtomic` is not supported on fallback to `eth_sendTransaction`.';
                throw new AtomicityNotSupportedError(new BaseError(message, {
                    details: message,
                }));
            }
            const results = [];
            for (const call of calls) {
                try {
                    const value = await sendTransaction(client, {
                        account,
                        chain,
                        data: call.data,
                        to: call.to,
                        value: call.value ? hexToBigInt(call.value) : undefined,
                    });
                    results.push({ status: 'fulfilled', value });
                }
                catch (reason) {
                    results.push({ reason, status: 'rejected' });
                }
                // Note: some browser wallets require a small delay between transactions
                // to prevent duplicate JSON-RPC requests.
                if (experimental_fallbackDelay > 0)
                    await new Promise((resolve) => setTimeout(resolve, experimental_fallbackDelay));
            }
            if (results.every((r) => r.status === 'rejected'))
                throw results[0].reason;
            const hashes = results.map((result) => {
                if (result.status === 'fulfilled')
                    return result.value;
                return fallbackTransactionErrorMagicIdentifier;
            });
            return {
                id: concat([
                    ...hashes,
                    numberToHex(chain.id, { size: 32 }),
                    fallbackMagicIdentifier,
                ]),
            };
        }
        throw getTransactionError(err, {
            ...parameters,
            account,
            chain: parameters.chain,
        });
    }
}

/**
 * Returns the status of a call batch that was sent via `sendCalls`.
 *
 * - Docs: https://viem.sh/docs/actions/wallet/getCallsStatus
 * - JSON-RPC Methods: [`wallet_getCallsStatus`](https://eips.ethereum.org/EIPS/eip-5792)
 *
 * @param client - Client to use
 * @returns Status of the calls. {@link GetCallsStatusReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { getCallsStatus } from 'viem/actions'
 *
 * const client = createWalletClient({
 *   chain: mainnet,
 *   transport: custom(window.ethereum),
 * })
 * const { receipts, status } = await getCallsStatus(client, { id: '0xdeadbeef' })
 */
async function getCallsStatus(client, parameters) {
    async function getStatus(id) {
        const isTransactions = id.endsWith(fallbackMagicIdentifier.slice(2));
        if (isTransactions) {
            const chainId = trim(sliceHex(id, -64, -32));
            const hashes = sliceHex(id, 0, -64)
                .slice(2)
                .match(/.{1,64}/g);
            const receipts = await Promise.all(hashes.map((hash) => fallbackTransactionErrorMagicIdentifier.slice(2) !== hash
                ? client.request({
                    method: 'eth_getTransactionReceipt',
                    params: [`0x${hash}`],
                }, { dedupe: true })
                : undefined));
            const status = (() => {
                if (receipts.some((r) => r === null))
                    return 100; // pending
                if (receipts.every((r) => r?.status === '0x1'))
                    return 200; // success
                if (receipts.every((r) => r?.status === '0x0'))
                    return 500; // complete failure
                return 600; // partial failure
            })();
            return {
                atomic: false,
                chainId: hexToNumber(chainId),
                receipts: receipts.filter(Boolean),
                status,
                version: '2.0.0',
            };
        }
        return client.request({
            method: 'wallet_getCallsStatus',
            params: [id],
        });
    }
    const { atomic = false, chainId, receipts, version = '2.0.0', ...response } = await getStatus(parameters.id);
    const [status, statusCode] = (() => {
        const statusCode = response.status;
        if (statusCode >= 100 && statusCode < 200)
            return ['pending', statusCode];
        if (statusCode >= 200 && statusCode < 300)
            return ['success', statusCode];
        if (statusCode >= 300 && statusCode < 700)
            return ['failure', statusCode];
        // @ts-expect-error: for backwards compatibility
        if (statusCode === 'CONFIRMED')
            return ['success', 200];
        // @ts-expect-error: for backwards compatibility
        if (statusCode === 'PENDING')
            return ['pending', 100];
        return [undefined, statusCode];
    })();
    return {
        ...response,
        atomic,
        // @ts-expect-error: for backwards compatibility
        chainId: chainId ? hexToNumber(chainId) : undefined,
        receipts: receipts?.map((receipt) => ({
            ...receipt,
            blockNumber: hexToBigInt(receipt.blockNumber),
            gasUsed: hexToBigInt(receipt.gasUsed),
            status: receiptStatuses[receipt.status],
        })) ?? [],
        statusCode,
        status,
        version,
    };
}

/**
 * Waits for the status & receipts of a call bundle that was sent via `sendCalls`.
 *
 * - Docs: https://viem.sh/docs/actions/wallet/waitForCallsStatus
 * - JSON-RPC Methods: [`wallet_getCallsStatus`](https://eips.ethereum.org/EIPS/eip-5792)
 *
 * @param client - Client to use
 * @param parameters - {@link WaitForCallsStatusParameters}
 * @returns Status & receipts of the call bundle. {@link WaitForCallsStatusReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { waitForCallsStatus } from 'viem/actions'
 *
 * const client = createWalletClient({
 *   chain: mainnet,
 *   transport: custom(window.ethereum),
 * })
 *
 * const { receipts, status } = await waitForCallsStatus(client, { id: '0xdeadbeef' })
 */
async function waitForCallsStatus(client, parameters) {
    const { id, pollingInterval = client.pollingInterval, status = ({ statusCode }) => statusCode === 200 || statusCode >= 300, retryCount = 4, retryDelay = ({ count }) => ~~(1 << count) * 200, // exponential backoff
    timeout = 60_000, throwOnFailure = false, } = parameters;
    const observerId = stringify(['waitForCallsStatus', client.uid, id]);
    const { promise, resolve, reject } = withResolvers();
    let timer;
    const unobserve = observe(observerId, { resolve, reject }, (emit) => {
        const unpoll = poll(async () => {
            const done = (fn) => {
                clearTimeout(timer);
                unpoll();
                fn();
                unobserve();
            };
            try {
                const result = await withRetry(async () => {
                    const result = await getAction(client, getCallsStatus, 'getCallsStatus')({ id });
                    if (throwOnFailure && result.status === 'failure')
                        throw new BundleFailedError(result);
                    return result;
                }, {
                    retryCount,
                    delay: retryDelay,
                });
                if (!status(result))
                    return;
                done(() => emit.resolve(result));
            }
            catch (error) {
                done(() => emit.reject(error));
            }
        }, {
            interval: pollingInterval,
            emitOnBegin: true,
        });
        return unpoll;
    });
    timer = timeout
        ? setTimeout(() => {
            unobserve();
            clearTimeout(timer);
            reject(new WaitForCallsStatusTimeoutError({ id }));
        }, timeout)
        : undefined;
    return await promise;
}
class WaitForCallsStatusTimeoutError extends BaseError {
    constructor({ id }) {
        super(`Timed out while waiting for call bundle with id "${id}" to be confirmed.`, { name: 'WaitForCallsStatusTimeoutError' });
    }
}

function assertTransactionEIP7702(transaction) {
    const { authorizationList } = transaction;
    if (authorizationList) {
        for (const authorization of authorizationList) {
            const { chainId } = authorization;
            const address = authorization.address;
            if (!isAddress(address))
                throw new InvalidAddressError({ address });
            if (chainId < 0)
                throw new InvalidChainIdError({ chainId });
        }
    }
    assertTransactionEIP1559(transaction);
}
function assertTransactionEIP4844(transaction) {
    const { blobVersionedHashes } = transaction;
    if (blobVersionedHashes) {
        if (blobVersionedHashes.length === 0)
            throw new EmptyBlobError();
        for (const hash of blobVersionedHashes) {
            const size_ = size(hash);
            const version = hexToNumber(slice(hash, 0, 1));
            if (size_ !== 32)
                throw new InvalidVersionedHashSizeError({ hash, size: size_ });
            if (version !== versionedHashVersionKzg)
                throw new InvalidVersionedHashVersionError({
                    hash,
                    version,
                });
        }
    }
    assertTransactionEIP1559(transaction);
}
function assertTransactionEIP1559(transaction) {
    const { chainId, maxPriorityFeePerGas, maxFeePerGas, to } = transaction;
    if (chainId <= 0)
        throw new InvalidChainIdError({ chainId });
    if (to && !isAddress(to))
        throw new InvalidAddressError({ address: to });
    if (maxFeePerGas && maxFeePerGas > maxUint256)
        throw new FeeCapTooHighError({ maxFeePerGas });
    if (maxPriorityFeePerGas &&
        maxFeePerGas &&
        maxPriorityFeePerGas > maxFeePerGas)
        throw new TipAboveFeeCapError({ maxFeePerGas, maxPriorityFeePerGas });
}
function assertTransactionEIP2930(transaction) {
    const { chainId, maxPriorityFeePerGas, gasPrice, maxFeePerGas, to } = transaction;
    if (chainId <= 0)
        throw new InvalidChainIdError({ chainId });
    if (to && !isAddress(to))
        throw new InvalidAddressError({ address: to });
    if (maxPriorityFeePerGas || maxFeePerGas)
        throw new BaseError('`maxFeePerGas`/`maxPriorityFeePerGas` is not a valid EIP-2930 Transaction attribute.');
    if (gasPrice && gasPrice > maxUint256)
        throw new FeeCapTooHighError({ maxFeePerGas: gasPrice });
}
function assertTransactionLegacy(transaction) {
    const { chainId, maxPriorityFeePerGas, gasPrice, maxFeePerGas, to } = transaction;
    if (to && !isAddress(to))
        throw new InvalidAddressError({ address: to });
    if (typeof chainId !== 'undefined' && chainId <= 0)
        throw new InvalidChainIdError({ chainId });
    if (maxPriorityFeePerGas || maxFeePerGas)
        throw new BaseError('`maxFeePerGas`/`maxPriorityFeePerGas` is not a valid Legacy Transaction attribute.');
    if (gasPrice && gasPrice > maxUint256)
        throw new FeeCapTooHighError({ maxFeePerGas: gasPrice });
}

/*
 * Serialize an  EIP-2930 access list
 * @remarks
 * Use to create a transaction serializer with support for EIP-2930 access lists
 *
 * @param accessList - Array of objects of address and arrays of Storage Keys
 * @throws InvalidAddressError, InvalidStorageKeySizeError
 * @returns Array of hex strings
 */
function serializeAccessList(accessList) {
    if (!accessList || accessList.length === 0)
        return [];
    const serializedAccessList = [];
    for (let i = 0; i < accessList.length; i++) {
        const { address, storageKeys } = accessList[i];
        for (let j = 0; j < storageKeys.length; j++) {
            if (storageKeys[j].length - 2 !== 64) {
                throw new InvalidStorageKeySizeError({ storageKey: storageKeys[j] });
            }
        }
        if (!isAddress(address, { strict: false })) {
            throw new InvalidAddressError({ address });
        }
        serializedAccessList.push([address, storageKeys]);
    }
    return serializedAccessList;
}

function serializeTransaction(transaction, signature) {
    const type = getTransactionType(transaction);
    if (type === 'eip1559')
        return serializeTransactionEIP1559(transaction, signature);
    if (type === 'eip2930')
        return serializeTransactionEIP2930(transaction, signature);
    if (type === 'eip4844')
        return serializeTransactionEIP4844(transaction, signature);
    if (type === 'eip7702')
        return serializeTransactionEIP7702(transaction, signature);
    return serializeTransactionLegacy(transaction, signature);
}
function serializeTransactionEIP7702(transaction, signature) {
    const { authorizationList, chainId, gas, nonce, to, value, maxFeePerGas, maxPriorityFeePerGas, accessList, data, } = transaction;
    assertTransactionEIP7702(transaction);
    const serializedAccessList = serializeAccessList(accessList);
    const serializedAuthorizationList = serializeAuthorizationList(authorizationList);
    return concatHex([
        '0x04',
        toRlp([
            numberToHex(chainId),
            nonce ? numberToHex(nonce) : '0x',
            maxPriorityFeePerGas ? numberToHex(maxPriorityFeePerGas) : '0x',
            maxFeePerGas ? numberToHex(maxFeePerGas) : '0x',
            gas ? numberToHex(gas) : '0x',
            to ?? '0x',
            value ? numberToHex(value) : '0x',
            data ?? '0x',
            serializedAccessList,
            serializedAuthorizationList,
            ...toYParitySignatureArray(transaction, signature),
        ]),
    ]);
}
function serializeTransactionEIP4844(transaction, signature) {
    const { chainId, gas, nonce, to, value, maxFeePerBlobGas, maxFeePerGas, maxPriorityFeePerGas, accessList, data, } = transaction;
    assertTransactionEIP4844(transaction);
    let blobVersionedHashes = transaction.blobVersionedHashes;
    let sidecars = transaction.sidecars;
    // If `blobs` are passed, we will need to compute the KZG commitments & proofs.
    if (transaction.blobs &&
        (typeof blobVersionedHashes === 'undefined' ||
            typeof sidecars === 'undefined')) {
        const blobs = (typeof transaction.blobs[0] === 'string'
            ? transaction.blobs
            : transaction.blobs.map((x) => bytesToHex(x)));
        const kzg = transaction.kzg;
        const commitments = blobsToCommitments({
            blobs,
            kzg,
        });
        if (typeof blobVersionedHashes === 'undefined')
            blobVersionedHashes = commitmentsToVersionedHashes({
                commitments,
            });
        if (typeof sidecars === 'undefined') {
            const proofs = blobsToProofs({ blobs, commitments, kzg });
            sidecars = toBlobSidecars({ blobs, commitments, proofs });
        }
    }
    const serializedAccessList = serializeAccessList(accessList);
    const serializedTransaction = [
        numberToHex(chainId),
        nonce ? numberToHex(nonce) : '0x',
        maxPriorityFeePerGas ? numberToHex(maxPriorityFeePerGas) : '0x',
        maxFeePerGas ? numberToHex(maxFeePerGas) : '0x',
        gas ? numberToHex(gas) : '0x',
        to ?? '0x',
        value ? numberToHex(value) : '0x',
        data ?? '0x',
        serializedAccessList,
        maxFeePerBlobGas ? numberToHex(maxFeePerBlobGas) : '0x',
        blobVersionedHashes ?? [],
        ...toYParitySignatureArray(transaction, signature),
    ];
    const blobs = [];
    const commitments = [];
    const proofs = [];
    if (sidecars)
        for (let i = 0; i < sidecars.length; i++) {
            const { blob, commitment, proof } = sidecars[i];
            blobs.push(blob);
            commitments.push(commitment);
            proofs.push(proof);
        }
    return concatHex([
        '0x03',
        sidecars
            ? // If sidecars are enabled, envelope turns into a "wrapper":
                toRlp([serializedTransaction, blobs, commitments, proofs])
            : // If sidecars are disabled, standard envelope is used:
                toRlp(serializedTransaction),
    ]);
}
function serializeTransactionEIP1559(transaction, signature) {
    const { chainId, gas, nonce, to, value, maxFeePerGas, maxPriorityFeePerGas, accessList, data, } = transaction;
    assertTransactionEIP1559(transaction);
    const serializedAccessList = serializeAccessList(accessList);
    const serializedTransaction = [
        numberToHex(chainId),
        nonce ? numberToHex(nonce) : '0x',
        maxPriorityFeePerGas ? numberToHex(maxPriorityFeePerGas) : '0x',
        maxFeePerGas ? numberToHex(maxFeePerGas) : '0x',
        gas ? numberToHex(gas) : '0x',
        to ?? '0x',
        value ? numberToHex(value) : '0x',
        data ?? '0x',
        serializedAccessList,
        ...toYParitySignatureArray(transaction, signature),
    ];
    return concatHex([
        '0x02',
        toRlp(serializedTransaction),
    ]);
}
function serializeTransactionEIP2930(transaction, signature) {
    const { chainId, gas, data, nonce, to, value, accessList, gasPrice } = transaction;
    assertTransactionEIP2930(transaction);
    const serializedAccessList = serializeAccessList(accessList);
    const serializedTransaction = [
        numberToHex(chainId),
        nonce ? numberToHex(nonce) : '0x',
        gasPrice ? numberToHex(gasPrice) : '0x',
        gas ? numberToHex(gas) : '0x',
        to ?? '0x',
        value ? numberToHex(value) : '0x',
        data ?? '0x',
        serializedAccessList,
        ...toYParitySignatureArray(transaction, signature),
    ];
    return concatHex([
        '0x01',
        toRlp(serializedTransaction),
    ]);
}
function serializeTransactionLegacy(transaction, signature) {
    const { chainId = 0, gas, data, nonce, to, value, gasPrice } = transaction;
    assertTransactionLegacy(transaction);
    let serializedTransaction = [
        nonce ? numberToHex(nonce) : '0x',
        gasPrice ? numberToHex(gasPrice) : '0x',
        gas ? numberToHex(gas) : '0x',
        to ?? '0x',
        value ? numberToHex(value) : '0x',
        data ?? '0x',
    ];
    if (signature) {
        const v = (() => {
            // EIP-155 (inferred chainId)
            if (signature.v >= 35n) {
                const inferredChainId = (signature.v - 35n) / 2n;
                if (inferredChainId > 0)
                    return signature.v;
                return 27n + (signature.v === 35n ? 0n : 1n);
            }
            // EIP-155 (explicit chainId)
            if (chainId > 0)
                return BigInt(chainId * 2) + BigInt(35n + signature.v - 27n);
            // Pre-EIP-155 (no chainId)
            const v = 27n + (signature.v === 27n ? 0n : 1n);
            if (signature.v !== v)
                throw new InvalidLegacyVError({ v: signature.v });
            return v;
        })();
        const r = trim(signature.r);
        const s = trim(signature.s);
        serializedTransaction = [
            ...serializedTransaction,
            numberToHex(v),
            r === '0x00' ? '0x' : r,
            s === '0x00' ? '0x' : s,
        ];
    }
    else if (chainId > 0) {
        serializedTransaction = [
            ...serializedTransaction,
            numberToHex(chainId),
            '0x',
            '0x',
        ];
    }
    return toRlp(serializedTransaction);
}
function toYParitySignatureArray(transaction, signature_) {
    const signature = signature_ ?? transaction;
    const { v, yParity } = signature;
    if (typeof signature.r === 'undefined')
        return [];
    if (typeof signature.s === 'undefined')
        return [];
    if (typeof v === 'undefined' && typeof yParity === 'undefined')
        return [];
    const r = trim(signature.r);
    const s = trim(signature.s);
    const yParity_ = (() => {
        if (typeof yParity === 'number')
            return yParity ? numberToHex(1) : '0x';
        if (v === 0n)
            return '0x';
        if (v === 1n)
            return numberToHex(1);
        return v === 27n ? '0x' : numberToHex(1);
    })();
    return [yParity_, r === '0x00' ? '0x' : r, s === '0x00' ? '0x' : s];
}

/*
 * Serializes an EIP-7702 authorization list.
 */
function serializeAuthorizationList(authorizationList) {
    if (!authorizationList || authorizationList.length === 0)
        return [];
    const serializedAuthorizationList = [];
    for (const authorization of authorizationList) {
        const { chainId, nonce, ...signature } = authorization;
        const contractAddress = authorization.address;
        serializedAuthorizationList.push([
            chainId ? toHex(chainId) : '0x',
            contractAddress,
            nonce ? toHex(nonce) : '0x',
            ...toYParitySignatureArray({}, signature),
        ]);
    }
    return serializedAuthorizationList;
}

/**
 * Adds an EVM chain to the wallet.
 *
 * - Docs: https://viem.sh/docs/actions/wallet/addChain
 * - JSON-RPC Methods: [`eth_addEthereumChain`](https://eips.ethereum.org/EIPS/eip-3085)
 *
 * @param client - Client to use
 * @param parameters - {@link AddChainParameters}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { optimism } from 'viem/chains'
 * import { addChain } from 'viem/wallet'
 *
 * const client = createWalletClient({
 *   transport: custom(window.ethereum),
 * })
 * await addChain(client, { chain: optimism })
 */
async function addChain(client, { chain }) {
    const { id, name, nativeCurrency, rpcUrls, blockExplorers } = chain;
    await client.request({
        method: 'wallet_addEthereumChain',
        params: [
            {
                chainId: numberToHex(id),
                chainName: name,
                nativeCurrency,
                rpcUrls: rpcUrls.default.http,
                blockExplorerUrls: blockExplorers
                    ? Object.values(blockExplorers).map(({ url }) => url)
                    : undefined,
            },
        ],
    }, { dedupe: true, retryCount: 0 });
}

/**
 * Deploys a contract to the network, given bytecode and constructor arguments.
 *
 * - Docs: https://viem.sh/docs/contract/deployContract
 * - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/contracts_deploying-contracts
 *
 * @param client - Client to use
 * @param parameters - {@link DeployContractParameters}
 * @returns The [Transaction](https://viem.sh/docs/glossary/terms#transaction) hash. {@link DeployContractReturnType}
 *
 * @example
 * import { createWalletClient, http } from 'viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 * import { mainnet } from 'viem/chains'
 * import { deployContract } from 'viem/contract'
 *
 * const client = createWalletClient({
 *   account: privateKeyToAccount('0x…'),
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const hash = await deployContract(client, {
 *   abi: [],
 *   account: '0x…,
 *   bytecode: '0x608060405260405161083e38038061083e833981016040819052610...',
 * })
 */
function deployContract(walletClient, parameters) {
    const { abi, args, bytecode, ...request } = parameters;
    const calldata = encodeDeployData({ abi, args, bytecode });
    return sendTransaction(walletClient, {
        ...request,
        ...(request.authorizationList ? { to: null } : {}),
        data: calldata,
    });
}

/**
 * Returns a list of account addresses owned by the wallet or client.
 *
 * - Docs: https://viem.sh/docs/actions/wallet/getAddresses
 * - JSON-RPC Methods: [`eth_accounts`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_accounts)
 *
 * @param client - Client to use
 * @returns List of account addresses owned by the wallet or client. {@link GetAddressesReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { getAddresses } from 'viem/wallet'
 *
 * const client = createWalletClient({
 *   chain: mainnet,
 *   transport: custom(window.ethereum),
 * })
 * const accounts = await getAddresses(client)
 */
async function getAddresses(client) {
    if (client.account?.type === 'local')
        return [client.account.address];
    const addresses = await client.request({ method: 'eth_accounts' }, { dedupe: true });
    return addresses.map((address) => checksumAddress(address));
}

/**
 * Extract capabilities that a connected wallet supports (e.g. paymasters, session keys, etc).
 *
 * - Docs: https://viem.sh/docs/actions/wallet/getCapabilities
 * - JSON-RPC Methods: [`wallet_getCapabilities`](https://eips.ethereum.org/EIPS/eip-5792)
 *
 * @param client - Client to use
 * @returns The wallet's capabilities. {@link GetCapabilitiesReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { getCapabilities } from 'viem/actions'
 *
 * const client = createWalletClient({
 *   chain: mainnet,
 *   transport: custom(window.ethereum),
 * })
 * const capabilities = await getCapabilities(client)
 */
async function getCapabilities(client, parameters = {}) {
    const { account = client.account, chainId } = parameters;
    const account_ = account ? parseAccount(account) : undefined;
    const params = chainId
        ? [account_?.address, [numberToHex(chainId)]]
        : [account_?.address];
    const capabilities_raw = await client.request({
        method: 'wallet_getCapabilities',
        params,
    });
    const capabilities = {};
    for (const [chainId, capabilities_] of Object.entries(capabilities_raw)) {
        capabilities[Number(chainId)] = {};
        for (let [key, value] of Object.entries(capabilities_)) {
            if (key === 'addSubAccount')
                key = 'unstable_addSubAccount';
            capabilities[Number(chainId)][key] = value;
        }
    }
    return (typeof chainId === 'number' ? capabilities[chainId] : capabilities);
}

/**
 * Gets the wallets current permissions.
 *
 * - Docs: https://viem.sh/docs/actions/wallet/getPermissions
 * - JSON-RPC Methods: [`wallet_getPermissions`](https://eips.ethereum.org/EIPS/eip-2255)
 *
 * @param client - Client to use
 * @returns The wallet permissions. {@link GetPermissionsReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { getPermissions } from 'viem/wallet'
 *
 * const client = createWalletClient({
 *   chain: mainnet,
 *   transport: custom(window.ethereum),
 * })
 * const permissions = await getPermissions(client)
 */
async function getPermissions(client) {
    const permissions = await client.request({ method: 'wallet_getPermissions' }, { dedupe: true });
    return permissions;
}

/**
 * Prepares an [EIP-7702 Authorization](https://eips.ethereum.org/EIPS/eip-7702) object for signing.
 * This Action will fill the required fields of the Authorization object if they are not provided (e.g. `nonce` and `chainId`).
 *
 * With the prepared Authorization object, you can use [`signAuthorization`](https://viem.sh/docs/eip7702/signAuthorization) to sign over the Authorization object.
 *
 * @param client - Client to use
 * @param parameters - {@link PrepareAuthorizationParameters}
 * @returns The prepared Authorization object. {@link PrepareAuthorizationReturnType}
 *
 * @example
 * import { createClient, http } from 'viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 * import { mainnet } from 'viem/chains'
 * import { prepareAuthorization } from 'viem/experimental'
 *
 * const client = createClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const authorization = await prepareAuthorization(client, {
 *   account: privateKeyToAccount('0x..'),
 *   contractAddress: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
 * })
 *
 * @example
 * // Account Hoisting
 * import { createClient, http } from 'viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 * import { mainnet } from 'viem/chains'
 * import { prepareAuthorization } from 'viem/experimental'
 *
 * const client = createClient({
 *   account: privateKeyToAccount('0x…'),
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const authorization = await prepareAuthorization(client, {
 *   contractAddress: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
 * })
 */
async function prepareAuthorization(client, parameters) {
    const { account: account_ = client.account, chainId, nonce } = parameters;
    if (!account_)
        throw new AccountNotFoundError({
            docsPath: '/docs/eip7702/prepareAuthorization',
        });
    const account = parseAccount(account_);
    const executor = (() => {
        if (!parameters.executor)
            return undefined;
        if (parameters.executor === 'self')
            return parameters.executor;
        return parseAccount(parameters.executor);
    })();
    const authorization = {
        address: parameters.contractAddress ?? parameters.address,
        chainId,
        nonce,
    };
    if (typeof authorization.chainId === 'undefined')
        authorization.chainId =
            client.chain?.id ??
                (await getAction(client, getChainId, 'getChainId')({}));
    if (typeof authorization.nonce === 'undefined') {
        authorization.nonce = await getAction(client, getTransactionCount, 'getTransactionCount')({
            address: account.address,
            blockTag: 'pending',
        });
        if (executor === 'self' ||
            (executor?.address && isAddressEqual(executor.address, account.address)))
            authorization.nonce += 1;
    }
    return authorization;
}

/**
 * Requests a list of accounts managed by a wallet.
 *
 * - Docs: https://viem.sh/docs/actions/wallet/requestAddresses
 * - JSON-RPC Methods: [`eth_requestAccounts`](https://eips.ethereum.org/EIPS/eip-1102)
 *
 * Sends a request to the wallet, asking for permission to access the user's accounts. After the user accepts the request, it will return a list of accounts (addresses).
 *
 * This API can be useful for dapps that need to access the user's accounts in order to execute transactions or interact with smart contracts.
 *
 * @param client - Client to use
 * @returns List of accounts managed by a wallet {@link RequestAddressesReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { requestAddresses } from 'viem/wallet'
 *
 * const client = createWalletClient({
 *   chain: mainnet,
 *   transport: custom(window.ethereum),
 * })
 * const accounts = await requestAddresses(client)
 */
async function requestAddresses(client) {
    const addresses = await client.request({ method: 'eth_requestAccounts' }, { dedupe: true, retryCount: 0 });
    return addresses.map((address) => getAddress(address));
}

/**
 * Requests permissions for a wallet.
 *
 * - Docs: https://viem.sh/docs/actions/wallet/requestPermissions
 * - JSON-RPC Methods: [`wallet_requestPermissions`](https://eips.ethereum.org/EIPS/eip-2255)
 *
 * @param client - Client to use
 * @param parameters - {@link RequestPermissionsParameters}
 * @returns The wallet permissions. {@link RequestPermissionsReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { requestPermissions } from 'viem/wallet'
 *
 * const client = createWalletClient({
 *   chain: mainnet,
 *   transport: custom(window.ethereum),
 * })
 * const permissions = await requestPermissions(client, {
 *   eth_accounts: {}
 * })
 */
async function requestPermissions(client, permissions) {
    return client.request({
        method: 'wallet_requestPermissions',
        params: [permissions],
    }, { retryCount: 0 });
}

/**
 * Requests the connected wallet to send a batch of calls, and waits for the calls to be included in a block.
 *
 * - Docs: https://viem.sh/docs/actions/wallet/sendCallsSync
 * - JSON-RPC Methods: [`wallet_sendCalls`](https://eips.ethereum.org/EIPS/eip-5792)
 *
 * @param client - Client to use
 * @returns Calls status. {@link SendCallsSyncReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { sendCalls } from 'viem/actions'
 *
 * const client = createWalletClient({
 *   chain: mainnet,
 *   transport: custom(window.ethereum),
 * })
 * const status = await sendCallsSync(client, {
 *   account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
 *   calls: [
 *     {
 *       data: '0xdeadbeef',
 *       to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
 *     },
 *     {
 *       to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
 *       value: 69420n,
 *     },
 *   ],
 * })
 */
async function sendCallsSync(client, parameters) {
    const { chain = client.chain } = parameters;
    const timeout = parameters.timeout ?? Math.max((chain?.blockTime ?? 0) * 3, 5_000);
    const result = await getAction(client, sendCalls, 'sendCalls')(parameters);
    const status = await getAction(client, waitForCallsStatus, 'waitForCallsStatus')({
        ...parameters,
        id: result.id,
        timeout,
    });
    return status;
}

const supportsWalletNamespace = new LruMap(128);
/**
 * Creates, signs, and sends a new transaction to the network synchronously.
 * Returns the transaction receipt.
 *
 * @param client - Client to use
 * @param parameters - {@link SendTransactionSyncParameters}
 * @returns The transaction receipt. {@link SendTransactionSyncReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { sendTransactionSync } from 'viem/wallet'
 *
 * const client = createWalletClient({
 *   chain: mainnet,
 *   transport: custom(window.ethereum),
 * })
 * const receipt = await sendTransactionSync(client, {
 *   account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
 *   to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
 *   value: 1000000000000000000n,
 * })
 *
 * @example
 * // Account Hoisting
 * import { createWalletClient, http } from 'viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 * import { mainnet } from 'viem/chains'
 * import { sendTransactionSync } from 'viem/wallet'
 *
 * const client = createWalletClient({
 *   account: privateKeyToAccount('0x…'),
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const receipt = await sendTransactionSync(client, {
 *   to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
 *   value: 1000000000000000000n,
 * })
 */
async function sendTransactionSync(client, parameters) {
    const { account: account_ = client.account, assertChainId = true, chain = client.chain, accessList, authorizationList, blobs, data, dataSuffix = typeof client.dataSuffix === 'string'
        ? client.dataSuffix
        : client.dataSuffix?.value, gas, gasPrice, maxFeePerBlobGas, maxFeePerGas, maxPriorityFeePerGas, nonce, pollingInterval, throwOnReceiptRevert, type, value, ...rest } = parameters;
    const timeout = parameters.timeout ?? Math.max((chain?.blockTime ?? 0) * 3, 5_000);
    if (typeof account_ === 'undefined')
        throw new AccountNotFoundError({
            docsPath: '/docs/actions/wallet/sendTransactionSync',
        });
    const account = account_ ? parseAccount(account_) : null;
    let nonceManagerParameters;
    try {
        assertRequest(parameters);
        const to = await (async () => {
            // If `to` exists on the parameters, use that.
            if (parameters.to)
                return parameters.to;
            // If `to` is null, we are sending a deployment transaction.
            if (parameters.to === null)
                return undefined;
            // If no `to` exists, and we are sending a EIP-7702 transaction, use the
            // address of the first authorization in the list.
            if (authorizationList && authorizationList.length > 0)
                return await recoverAuthorizationAddress({
                    authorization: authorizationList[0],
                }).catch(() => {
                    throw new BaseError('`to` is required. Could not infer from `authorizationList`.');
                });
            // Otherwise, we are sending a deployment transaction.
            return undefined;
        })();
        if (account?.type === 'json-rpc' || account === null) {
            let chainId;
            if (chain !== null) {
                chainId = await getAction(client, getChainId, 'getChainId')({});
                if (assertChainId)
                    assertCurrentChain({
                        currentChainId: chainId,
                        chain,
                    });
            }
            const chainFormat = client.chain?.formatters?.transactionRequest?.format;
            const format = chainFormat || formatTransactionRequest;
            const request = format({
                // Pick out extra data that might exist on the chain's transaction request type.
                ...extract(rest, { format: chainFormat }),
                accessList,
                account,
                authorizationList,
                blobs,
                chainId,
                data: dataSuffix ? concat([data ?? '0x', dataSuffix]) : data,
                gas,
                gasPrice,
                maxFeePerBlobGas,
                maxFeePerGas,
                maxPriorityFeePerGas,
                nonce,
                to,
                type,
                value,
            }, 'sendTransaction');
            const isWalletNamespaceSupported = supportsWalletNamespace.get(client.uid);
            const method = isWalletNamespaceSupported
                ? 'wallet_sendTransaction'
                : 'eth_sendTransaction';
            const hash = await (async () => {
                try {
                    return await client.request({
                        method,
                        params: [request],
                    }, { retryCount: 0 });
                }
                catch (e) {
                    if (isWalletNamespaceSupported === false)
                        throw e;
                    const error = e;
                    // If the transport does not support the method or input, attempt to use the
                    // `wallet_sendTransaction` method.
                    if (error.name === 'InvalidInputRpcError' ||
                        error.name === 'InvalidParamsRpcError' ||
                        error.name === 'MethodNotFoundRpcError' ||
                        error.name === 'MethodNotSupportedRpcError') {
                        return (await client
                            .request({
                            method: 'wallet_sendTransaction',
                            params: [request],
                        }, { retryCount: 0 })
                            .then((hash) => {
                            supportsWalletNamespace.set(client.uid, true);
                            return hash;
                        })
                            .catch((e) => {
                            const walletNamespaceError = e;
                            if (walletNamespaceError.name === 'MethodNotFoundRpcError' ||
                                walletNamespaceError.name === 'MethodNotSupportedRpcError') {
                                supportsWalletNamespace.set(client.uid, false);
                                throw error;
                            }
                            throw walletNamespaceError;
                        }));
                    }
                    throw error;
                }
            })();
            const receipt = await getAction(client, waitForTransactionReceipt, 'waitForTransactionReceipt')({
                checkReplacement: false,
                hash,
                pollingInterval,
                timeout,
            });
            if (throwOnReceiptRevert && receipt.status === 'reverted')
                throw new TransactionReceiptRevertedError({ receipt });
            return receipt;
        }
        if (account?.type === 'local') {
            if (account.nonceManager && typeof nonce === 'undefined') {
                const requestChainId = rest.chainId;
                const chainId = await (async () => {
                    if (typeof requestChainId === 'number')
                        return requestChainId;
                    if (chain)
                        return chain.id;
                    return getAction(client, getChainId, 'getChainId')({});
                })();
                nonceManagerParameters = { address: account.address, chainId };
            }
            // Prepare the request for signing (assign appropriate fees, etc.)
            const request = await getAction(client, prepareTransactionRequest, 'prepareTransactionRequest')({
                account,
                accessList,
                authorizationList,
                blobs,
                chain,
                data: dataSuffix ? concat([data ?? '0x', dataSuffix]) : data,
                gas,
                gasPrice,
                maxFeePerBlobGas,
                maxFeePerGas,
                maxPriorityFeePerGas,
                nonce,
                nonceManager: account.nonceManager,
                parameters: [...defaultParameters, 'sidecars'],
                type,
                value,
                ...rest,
                to,
            });
            const serializer = chain?.serializers?.transaction;
            const serializedTransaction = (await account.signTransaction(request, {
                serializer,
            }));
            return (await getAction(client, sendRawTransactionSync, 'sendRawTransactionSync')({
                serializedTransaction,
                throwOnReceiptRevert,
                timeout: parameters.timeout,
            }));
        }
        if (account?.type === 'smart')
            throw new AccountTypeNotSupportedError({
                metaMessages: [
                    'Consider using the `sendUserOperation` Action instead.',
                ],
                docsPath: '/docs/actions/bundler/sendUserOperation',
                type: 'smart',
            });
        throw new AccountTypeNotSupportedError({
            docsPath: '/docs/actions/wallet/sendTransactionSync',
            type: account?.type,
        });
    }
    catch (err) {
        if (err instanceof AccountTypeNotSupportedError)
            throw err;
        if (nonceManagerParameters &&
            !(err instanceof TransactionReceiptRevertedError))
            account?.nonceManager?.reset(nonceManagerParameters);
        throw getTransactionError(err, {
            ...parameters,
            account,
            chain: parameters.chain || undefined,
        });
    }
}

/**
 * Requests for the wallet to show information about a call batch
 * that was sent via `sendCalls`.
 *
 * - Docs: https://viem.sh/docs/actions/wallet/showCallsStatus
 * - JSON-RPC Methods: [`wallet_showCallsStatus`](https://eips.ethereum.org/EIPS/eip-5792)
 *
 * @param client - Client to use
 * @returns Status of the calls. {@link ShowCallsStatusReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { showCallsStatus } from 'viem/actions'
 *
 * const client = createWalletClient({
 *   chain: mainnet,
 *   transport: custom(window.ethereum),
 * })
 * await showCallsStatus(client, { id: '0xdeadbeef' })
 */
async function showCallsStatus(client, parameters) {
    const { id } = parameters;
    await client.request({
        method: 'wallet_showCallsStatus',
        params: [id],
    });
    return;
}

/**
 * Signs an [EIP-7702 Authorization](https://eips.ethereum.org/EIPS/eip-7702) object.
 *
 * With the calculated signature, you can:
 * - use [`verifyAuthorization`](https://viem.sh/docs/eip7702/verifyAuthorization) to verify the signed Authorization object,
 * - use [`recoverAuthorizationAddress`](https://viem.sh/docs/eip7702/recoverAuthorizationAddress) to recover the signing address from the signed Authorization object.
 *
 * @param client - Client to use
 * @param parameters - {@link SignAuthorizationParameters}
 * @returns The signed Authorization object. {@link SignAuthorizationReturnType}
 *
 * @example
 * import { createClient, http } from 'viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 * import { mainnet } from 'viem/chains'
 * import { signAuthorization } from 'viem/experimental'
 *
 * const client = createClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const signature = await signAuthorization(client, {
 *   account: privateKeyToAccount('0x..'),
 *   contractAddress: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
 * })
 *
 * @example
 * // Account Hoisting
 * import { createClient, http } from 'viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 * import { mainnet } from 'viem/chains'
 * import { signAuthorization } from 'viem/experimental'
 *
 * const client = createClient({
 *   account: privateKeyToAccount('0x…'),
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const signature = await signAuthorization(client, {
 *   contractAddress: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
 * })
 */
async function signAuthorization$1(client, parameters) {
    const { account: account_ = client.account } = parameters;
    if (!account_)
        throw new AccountNotFoundError({
            docsPath: '/docs/eip7702/signAuthorization',
        });
    const account = parseAccount(account_);
    if (!account.signAuthorization)
        throw new AccountTypeNotSupportedError({
            docsPath: '/docs/eip7702/signAuthorization',
            metaMessages: [
                'The `signAuthorization` Action does not support JSON-RPC Accounts.',
            ],
            type: account.type,
        });
    const authorization = await prepareAuthorization(client, parameters);
    return account.signAuthorization(authorization);
}

/**
 * Calculates an Ethereum-specific signature in [EIP-191 format](https://eips.ethereum.org/EIPS/eip-191): `keccak256("\x19Ethereum Signed Message:\n" + len(message) + message))`.
 *
 * - Docs: https://viem.sh/docs/actions/wallet/signMessage
 * - JSON-RPC Methods:
 *   - JSON-RPC Accounts: [`personal_sign`](https://docs.metamask.io/guide/signing-data#personal-sign)
 *   - Local Accounts: Signs locally. No JSON-RPC request.
 *
 * With the calculated signature, you can:
 * - use [`verifyMessage`](https://viem.sh/docs/utilities/verifyMessage) to verify the signature,
 * - use [`recoverMessageAddress`](https://viem.sh/docs/utilities/recoverMessageAddress) to recover the signing address from a signature.
 *
 * @param client - Client to use
 * @param parameters - {@link SignMessageParameters}
 * @returns The signed message. {@link SignMessageReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { signMessage } from 'viem/wallet'
 *
 * const client = createWalletClient({
 *   chain: mainnet,
 *   transport: custom(window.ethereum),
 * })
 * const signature = await signMessage(client, {
 *   account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
 *   message: 'hello world',
 * })
 *
 * @example
 * // Account Hoisting
 * import { createWalletClient, custom } from 'viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 * import { mainnet } from 'viem/chains'
 * import { signMessage } from 'viem/wallet'
 *
 * const client = createWalletClient({
 *   account: privateKeyToAccount('0x…'),
 *   chain: mainnet,
 *   transport: custom(window.ethereum),
 * })
 * const signature = await signMessage(client, {
 *   message: 'hello world',
 * })
 */
async function signMessage$1(client, { account: account_ = client.account, message, }) {
    if (!account_)
        throw new AccountNotFoundError({
            docsPath: '/docs/actions/wallet/signMessage',
        });
    const account = parseAccount(account_);
    if (account.signMessage)
        return account.signMessage({ message });
    const message_ = (() => {
        if (typeof message === 'string')
            return stringToHex(message);
        if (message.raw instanceof Uint8Array)
            return toHex(message.raw);
        return message.raw;
    })();
    return client.request({
        method: 'personal_sign',
        params: [message_, account.address],
    }, { retryCount: 0 });
}

/**
 * Signs a transaction.
 *
 * - Docs: https://viem.sh/docs/actions/wallet/signTransaction
 * - JSON-RPC Methods:
 *   - JSON-RPC Accounts: [`eth_signTransaction`](https://ethereum.github.io/execution-apis/api-documentation/)
 *   - Local Accounts: Signs locally. No JSON-RPC request.
 *
 * @param args - {@link SignTransactionParameters}
 * @returns The signed serialized transaction. {@link SignTransactionReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { signTransaction } from 'viem/actions'
 *
 * const client = createWalletClient({
 *   chain: mainnet,
 *   transport: custom(window.ethereum),
 * })
 * const signature = await signTransaction(client, {
 *   account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
 *   to: '0x0000000000000000000000000000000000000000',
 *   value: 1n,
 * })
 *
 * @example
 * // Account Hoisting
 * import { createWalletClient, http } from 'viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 * import { mainnet } from 'viem/chains'
 * import { signTransaction } from 'viem/actions'
 *
 * const client = createWalletClient({
 *   account: privateKeyToAccount('0x…'),
 *   chain: mainnet,
 *   transport: custom(window.ethereum),
 * })
 * const signature = await signTransaction(client, {
 *   to: '0x0000000000000000000000000000000000000000',
 *   value: 1n,
 * })
 */
async function signTransaction$1(client, parameters) {
    const { account: account_ = client.account, chain = client.chain, ...transaction } = parameters;
    if (!account_)
        throw new AccountNotFoundError({
            docsPath: '/docs/actions/wallet/signTransaction',
        });
    const account = parseAccount(account_);
    assertRequest({
        account,
        ...parameters,
    });
    const chainId = await getAction(client, getChainId, 'getChainId')({});
    if (chain !== null)
        assertCurrentChain({
            currentChainId: chainId,
            chain,
        });
    const formatters = chain?.formatters || client.chain?.formatters;
    const format = formatters?.transactionRequest?.format || formatTransactionRequest;
    if (account.signTransaction)
        return account.signTransaction({
            ...transaction,
            account,
            chainId,
        }, { serializer: client.chain?.serializers?.transaction });
    return await client.request({
        method: 'eth_signTransaction',
        params: [
            {
                ...format({
                    ...transaction,
                    account,
                }, 'signTransaction'),
                chainId: numberToHex(chainId),
                from: account.address,
            },
        ],
    }, { retryCount: 0 });
}

/**
 * Signs typed data and calculates an Ethereum-specific signature in [https://eips.ethereum.org/EIPS/eip-712](https://eips.ethereum.org/EIPS/eip-712): `sign(keccak256("\x19\x01" ‖ domainSeparator ‖ hashStruct(message)))`
 *
 * - Docs: https://viem.sh/docs/actions/wallet/signTypedData
 * - JSON-RPC Methods:
 *   - JSON-RPC Accounts: [`eth_signTypedData_v4`](https://docs.metamask.io/guide/signing-data#signtypeddata-v4)
 *   - Local Accounts: Signs locally. No JSON-RPC request.
 *
 * @param client - Client to use
 * @param parameters - {@link SignTypedDataParameters}
 * @returns The signed data. {@link SignTypedDataReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { signTypedData } from 'viem/wallet'
 *
 * const client = createWalletClient({
 *   chain: mainnet,
 *   transport: custom(window.ethereum),
 * })
 * const signature = await signTypedData(client, {
 *   account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
 *   domain: {
 *     name: 'Ether Mail',
 *     version: '1',
 *     chainId: 1,
 *     verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
 *   },
 *   types: {
 *     Person: [
 *       { name: 'name', type: 'string' },
 *       { name: 'wallet', type: 'address' },
 *     ],
 *     Mail: [
 *       { name: 'from', type: 'Person' },
 *       { name: 'to', type: 'Person' },
 *       { name: 'contents', type: 'string' },
 *     ],
 *   },
 *   primaryType: 'Mail',
 *   message: {
 *     from: {
 *       name: 'Cow',
 *       wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
 *     },
 *     to: {
 *       name: 'Bob',
 *       wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
 *     },
 *     contents: 'Hello, Bob!',
 *   },
 * })
 *
 * @example
 * // Account Hoisting
 * import { createWalletClient, http } from 'viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 * import { mainnet } from 'viem/chains'
 * import { signTypedData } from 'viem/wallet'
 *
 * const client = createWalletClient({
 *   account: privateKeyToAccount('0x…'),
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const signature = await signTypedData(client, {
 *   domain: {
 *     name: 'Ether Mail',
 *     version: '1',
 *     chainId: 1,
 *     verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
 *   },
 *   types: {
 *     Person: [
 *       { name: 'name', type: 'string' },
 *       { name: 'wallet', type: 'address' },
 *     ],
 *     Mail: [
 *       { name: 'from', type: 'Person' },
 *       { name: 'to', type: 'Person' },
 *       { name: 'contents', type: 'string' },
 *     ],
 *   },
 *   primaryType: 'Mail',
 *   message: {
 *     from: {
 *       name: 'Cow',
 *       wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
 *     },
 *     to: {
 *       name: 'Bob',
 *       wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
 *     },
 *     contents: 'Hello, Bob!',
 *   },
 * })
 */
async function signTypedData$1(client, parameters) {
    const { account: account_ = client.account, domain, message, primaryType, } = parameters;
    if (!account_)
        throw new AccountNotFoundError({
            docsPath: '/docs/actions/wallet/signTypedData',
        });
    const account = parseAccount(account_);
    const types = {
        EIP712Domain: getTypesForEIP712Domain({ domain }),
        ...parameters.types,
    };
    // Need to do a runtime validation check on addresses, byte ranges, integer ranges, etc
    // as we can't statically check this with TypeScript.
    validateTypedData({ domain, message, primaryType, types });
    if (account.signTypedData)
        return account.signTypedData({ domain, message, primaryType, types });
    const typedData = serializeTypedData({ domain, message, primaryType, types });
    return client.request({
        method: 'eth_signTypedData_v4',
        params: [account.address, typedData],
    }, { retryCount: 0 });
}

/**
 * Switch the target chain in a wallet.
 *
 * - Docs: https://viem.sh/docs/actions/wallet/switchChain
 * - JSON-RPC Methods: [`wallet_switchEthereumChain`](https://eips.ethereum.org/EIPS/eip-3326)
 *
 * @param client - Client to use
 * @param parameters - {@link SwitchChainParameters}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet, optimism } from 'viem/chains'
 * import { switchChain } from 'viem/wallet'
 *
 * const client = createWalletClient({
 *   chain: mainnet,
 *   transport: custom(window.ethereum),
 * })
 * await switchChain(client, { id: optimism.id })
 */
async function switchChain(client, { id }) {
    await client.request({
        method: 'wallet_switchEthereumChain',
        params: [
            {
                chainId: numberToHex(id),
            },
        ],
    }, { retryCount: 0 });
}

/**
 * Adds an EVM chain to the wallet.
 *
 * - Docs: https://viem.sh/docs/actions/wallet/watchAsset
 * - JSON-RPC Methods: [`eth_switchEthereumChain`](https://eips.ethereum.org/EIPS/eip-747)
 *
 * @param client - Client to use
 * @param parameters - {@link WatchAssetParameters}
 * @returns Boolean indicating if the token was successfully added. {@link WatchAssetReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { watchAsset } from 'viem/wallet'
 *
 * const client = createWalletClient({
 *   chain: mainnet,
 *   transport: custom(window.ethereum),
 * })
 * const success = await watchAsset(client, {
 *   type: 'ERC20',
 *   options: {
 *     address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
 *     decimals: 18,
 *     symbol: 'WETH',
 *   },
 * })
 */
async function watchAsset(client, params) {
    const added = await client.request({
        method: 'wallet_watchAsset',
        params,
    }, { retryCount: 0 });
    return added;
}

/**
 * Executes a write function on a contract synchronously.
 * Returns the transaction receipt.
 *
 * - Docs: https://viem.sh/docs/contract/writeContractSync
 *
 * A "write" function on a Solidity contract modifies the state of the blockchain. These types of functions require gas to be executed, and hence a [Transaction](https://viem.sh/docs/glossary/terms) is needed to be broadcast in order to change the state.
 *
 * Internally, uses a [Wallet Client](https://viem.sh/docs/clients/wallet) to call the [`sendTransaction` action](https://viem.sh/docs/actions/wallet/sendTransaction) with [ABI-encoded `data`](https://viem.sh/docs/contract/encodeFunctionData).
 *
 * __Warning: The `write` internally sends a transaction – it does not validate if the contract write will succeed (the contract may throw an error). It is highly recommended to [simulate the contract write with `contract.simulate`](https://viem.sh/docs/contract/writeContract#usage) before you execute it.__
 *
 * @param client - Client to use
 * @param parameters - {@link WriteContractParameters}
 * @returns A [Transaction Hash](https://viem.sh/docs/glossary/terms#hash). {@link WriteContractReturnType}
 *
 * @example
 * import { createWalletClient, custom, parseAbi } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { writeContract } from 'viem/contract'
 *
 * const client = createWalletClient({
 *   chain: mainnet,
 *   transport: custom(window.ethereum),
 * })
 * const receipt = await writeContractSync(client, {
 *   address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
 *   abi: parseAbi(['function mint(uint32 tokenId) nonpayable']),
 *   functionName: 'mint',
 *   args: [69420],
 * })
 */
async function writeContractSync(client, parameters) {
    return writeContract.internal(client, sendTransactionSync, 'sendTransactionSync', parameters);
}

function walletActions(client) {
    return {
        addChain: (args) => addChain(client, args),
        deployContract: (args) => deployContract(client, args),
        fillTransaction: (args) => fillTransaction(client, args),
        getAddresses: () => getAddresses(client),
        getCallsStatus: (args) => getCallsStatus(client, args),
        getCapabilities: (args) => getCapabilities(client, args),
        getChainId: () => getChainId(client),
        getPermissions: () => getPermissions(client),
        prepareAuthorization: (args) => prepareAuthorization(client, args),
        prepareTransactionRequest: (args) => prepareTransactionRequest(client, args),
        requestAddresses: () => requestAddresses(client),
        requestPermissions: (args) => requestPermissions(client, args),
        sendCalls: (args) => sendCalls(client, args),
        sendCallsSync: (args) => sendCallsSync(client, args),
        sendRawTransaction: (args) => sendRawTransaction(client, args),
        sendRawTransactionSync: (args) => sendRawTransactionSync(client, args),
        sendTransaction: (args) => sendTransaction(client, args),
        sendTransactionSync: (args) => sendTransactionSync(client, args),
        showCallsStatus: (args) => showCallsStatus(client, args),
        signAuthorization: (args) => signAuthorization$1(client, args),
        signMessage: (args) => signMessage$1(client, args),
        signTransaction: (args) => signTransaction$1(client, args),
        signTypedData: (args) => signTypedData$1(client, args),
        switchChain: (args) => switchChain(client, args),
        waitForCallsStatus: (args) => waitForCallsStatus(client, args),
        watchAsset: (args) => watchAsset(client, args),
        writeContract: (args) => writeContract(client, args),
        writeContractSync: (args) => writeContractSync(client, args),
    };
}

function createWalletClient(parameters) {
    const { key = 'wallet', name = 'Wallet Client', transport } = parameters;
    const client = createClient({
        ...parameters,
        key,
        name,
        transport,
        type: 'walletClient',
    });
    return client.extend(walletActions);
}

// TODO(v3): Rename to `toLocalAccount` + add `source` property to define source (privateKey, mnemonic, hdKey, etc).
/**
 * @description Creates an Account from a custom signing implementation.
 *
 * @returns A Local Account.
 */
function toAccount(source) {
    if (typeof source === 'string') {
        if (!isAddress(source, { strict: false }))
            throw new InvalidAddressError({ address: source });
        return {
            address: source,
            type: 'json-rpc',
        };
    }
    if (!isAddress(source.address, { strict: false }))
        throw new InvalidAddressError({ address: source.address });
    return {
        address: source.address,
        nonceManager: source.nonceManager,
        sign: source.sign,
        signAuthorization: source.signAuthorization,
        signMessage: source.signMessage,
        signTransaction: source.signTransaction,
        signTypedData: source.signTypedData,
        source: 'custom',
        type: 'local',
    };
}

// TODO(v3): Convert to sync.
let extraEntropy = false;
/**
 * @description Signs a hash with a given private key.
 *
 * @param hash The hash to sign.
 * @param privateKey The private key to sign with.
 *
 * @returns The signature.
 */
async function sign({ hash, privateKey, to = 'object', }) {
    const { r, s, recovery } = secp256k1.sign(hash.slice(2), privateKey.slice(2), {
        lowS: true,
        extraEntropy: isHex(extraEntropy, { strict: false })
            ? hexToBytes(extraEntropy)
            : extraEntropy,
    });
    const signature = {
        r: numberToHex(r, { size: 32 }),
        s: numberToHex(s, { size: 32 }),
        v: recovery ? 28n : 27n,
        yParity: recovery,
    };
    return (() => {
        if (to === 'bytes' || to === 'hex')
            return serializeSignature({ ...signature, to });
        return signature;
    })();
}

/**
 * Signs an Authorization hash in [EIP-7702 format](https://eips.ethereum.org/EIPS/eip-7702): `keccak256('0x05' || rlp([chain_id, address, nonce]))`.
 */
async function signAuthorization(parameters) {
    const { chainId, nonce, privateKey, to = 'object' } = parameters;
    const address = parameters.contractAddress ?? parameters.address;
    const signature = await sign({
        hash: hashAuthorization({ address, chainId, nonce }),
        privateKey,
        to,
    });
    if (to === 'object')
        return {
            address,
            chainId,
            nonce,
            ...signature,
        };
    return signature;
}

/**
 * @description Calculates an Ethereum-specific signature in [EIP-191 format](https://eips.ethereum.org/EIPS/eip-191):
 * `keccak256("\x19Ethereum Signed Message:\n" + len(message) + message))`.
 *
 * @returns The signature.
 */
async function signMessage({ message, privateKey, }) {
    return await sign({ hash: hashMessage(message), privateKey, to: 'hex' });
}

async function signTransaction(parameters) {
    const { privateKey, transaction, serializer = serializeTransaction, } = parameters;
    const signableTransaction = (() => {
        // For EIP-4844 Transactions, we want to sign the transaction payload body (tx_payload_body) without the sidecars (ie. without the network wrapper).
        // See: https://github.com/ethereum/EIPs/blob/e00f4daa66bd56e2dbd5f1d36d09fd613811a48b/EIPS/eip-4844.md#networking
        if (transaction.type === 'eip4844')
            return {
                ...transaction,
                sidecars: false,
            };
        return transaction;
    })();
    const signature = await sign({
        hash: keccak256(await serializer(signableTransaction)),
        privateKey,
    });
    return (await serializer(transaction, signature));
}

/**
 * @description Signs typed data and calculates an Ethereum-specific signature in [https://eips.ethereum.org/EIPS/eip-712](https://eips.ethereum.org/EIPS/eip-712):
 * `sign(keccak256("\x19\x01" ‖ domainSeparator ‖ hashStruct(message)))`.
 *
 * @returns The signature.
 */
async function signTypedData(parameters) {
    const { privateKey, ...typedData } = parameters;
    return await sign({
        hash: hashTypedData(typedData),
        privateKey,
        to: 'hex',
    });
}

/**
 * @description Creates an Account from a private key.
 *
 * @returns A Private Key Account.
 */
function privateKeyToAccount(privateKey, options = {}) {
    const { nonceManager } = options;
    const publicKey = toHex(secp256k1.getPublicKey(privateKey.slice(2), false));
    const address = publicKeyToAddress(publicKey);
    const account = toAccount({
        address,
        nonceManager,
        async sign({ hash }) {
            return sign({ hash, privateKey, to: 'hex' });
        },
        async signAuthorization(authorization) {
            return signAuthorization({ ...authorization, privateKey });
        },
        async signMessage({ message }) {
            return signMessage({ message, privateKey });
        },
        async signTransaction(transaction, { serializer } = {}) {
            return signTransaction({ privateKey, transaction, serializer });
        },
        async signTypedData(typedData) {
            return signTypedData({ ...typedData, privateKey });
        },
    });
    return {
        ...account,
        publicKey,
        source: 'privateKey',
    };
}

//#region src/lib/server/stc-transfer.ts
/**
* Server-side STC token transfer client.
*
* ⚠️  SECURITY ⚠️
* This module reads a raw treasury private key from `TREASURY_PRIVATE_KEY` env.
* That is an antipattern for production — see docs/treasury-custody.md for the
* production path (AWS KMS / Fireblocks / multisig). The env-key implementation
* is the test-net path: small treasuries, controlled exposure, easy to rotate.
*
* The public API of this module — `transferStc(toAddress, amount)` — stays the
* same when you swap in a KMS-backed signer. Only the wallet-client builder
* needs to change.
*/
var STC_TOKEN_ABI = parseAbi([
	"function transfer(address to, uint256 amount) returns (bool)",
	"function balanceOf(address owner) view returns (uint256)",
	"function decimals() view returns (uint8)"
]);
var STC_DECIMALS = Number(private_env.STC_TOKEN_DECIMALS ?? "18");
var TreasuryNotConfiguredError = class extends Error {
	constructor() {
		super("Treasury wallet is not configured. Set TREASURY_PRIVATE_KEY and PUBLIC_STC_TOKEN_AMOY (or _POLYGON).");
		this.name = "TreasuryNotConfiguredError";
	}
};
var TreasuryBalanceLowError = class extends Error {
	constructor(have, need) {
		super(`Treasury STC balance too low: have ${formatUnits(have, STC_DECIMALS)}, need ${formatUnits(need, STC_DECIMALS)}.`);
		this.name = "TreasuryBalanceLowError";
	}
};
/** Choose chain + token address based on env. Defaults to Amoy testnet. */
function resolveChain() {
	const network = (private_env.STC_NETWORK ?? "amoy").toLowerCase();
	if (network === "polygon" || network === "mainnet") return {
		chain: polygon,
		rpcUrl: private_env.POLYGON_RPC_URL ?? "https://polygon-rpc.com",
		tokenAddress: public_env.PUBLIC_STC_TOKEN_POLYGON
	};
	return {
		chain: polygonAmoy,
		rpcUrl: private_env.AMOY_RPC_URL ?? "https://rpc-amoy.polygon.technology",
		tokenAddress: public_env.PUBLIC_STC_TOKEN_AMOY
	};
}
var cachedClients = null;
function buildClients() {
	const { chain, rpcUrl, tokenAddress } = resolveChain();
	const pk = private_env.TREASURY_PRIVATE_KEY;
	if (!pk || !tokenAddress) return null;
	if (!pk.startsWith("0x") || pk.length !== 66) {
		console.error("[stc-transfer] TREASURY_PRIVATE_KEY is malformed — expected 0x + 64 hex chars");
		return null;
	}
	if (!isAddress(tokenAddress)) {
		console.error("[stc-transfer] STC token address is malformed:", tokenAddress);
		return null;
	}
	const account = privateKeyToAccount(pk);
	const transport = http(rpcUrl);
	const publicClient = createPublicClient({
		chain,
		transport
	});
	const walletClient = createWalletClient({
		account,
		chain,
		transport
	});
	console.info(`[stc-transfer] initialised on ${chain.name} for treasury ${account.address}`);
	return {
		chain,
		account,
		tokenAddress,
		publicClient,
		walletClient
	};
}
function getClients() {
	if (cachedClients) return cachedClients;
	cachedClients = buildClients();
	return cachedClients;
}
/**
* Transfer STC from the treasury wallet to a user wallet.
*
* @param toAddress  recipient's EVM address
* @param amount     amount in whole STC units (will be scaled by STC_DECIMALS)
* @returns          { txHash } on success
*
* Throws:
*   - TreasuryNotConfiguredError if env is missing
*   - TreasuryBalanceLowError if treasury can't cover the transfer
*   - Standard viem errors for RPC / signing / chain issues
*/
async function transferStc(toAddress, amount) {
	const clients = getClients();
	if (!clients) throw new TreasuryNotConfiguredError();
	if (!isAddress(toAddress)) throw new Error(`Recipient address is invalid: ${toAddress}`);
	if (amount <= 0) throw new Error(`Transfer amount must be positive: ${amount}`);
	const { account, tokenAddress, publicClient, walletClient } = clients;
	const scaled = parseUnits(amount.toString(), STC_DECIMALS);
	const treasuryBalance = await publicClient.readContract({
		address: tokenAddress,
		abi: STC_TOKEN_ABI,
		functionName: "balanceOf",
		args: [account.address]
	});
	if (treasuryBalance < scaled) throw new TreasuryBalanceLowError(treasuryBalance, scaled);
	const txHash = await walletClient.writeContract({
		address: tokenAddress,
		abi: STC_TOKEN_ABI,
		functionName: "transfer",
		args: [toAddress, scaled]
	});
	if ((await publicClient.waitForTransactionReceipt({
		hash: txHash,
		timeout: 6e4
	})).status !== "success") throw new Error(`STC transfer reverted on-chain: ${txHash}`);
	return { txHash };
}
/** Are we configured to actually send transfers? Lets callers fail fast. */
function isTreasuryReady() {
	return getClients() !== null;
}

export { TreasuryBalanceLowError as T, TreasuryNotConfiguredError as a, isTreasuryReady as i, transferStc as t };
//# sourceMappingURL=stc-transfer-aLrV3JBS.js.map
