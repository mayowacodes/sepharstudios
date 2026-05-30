import { B as BaseError, L as LruMap, K as parseAccount } from './polygon-D78JtxJX.js';
import { m as ChainNotFoundError, l as ChainMismatchError, G as assertRequest, aK as recoverAuthorizationAddress, an as getAction, ar as getChainId, af as formatTransactionRequest, Q as concat, a9 as extract, aG as prepareTransactionRequest, _ as defaultParameters, aL as sendRawTransaction, aw as getTransactionError, a2 as encodeFunctionData, as as getContractError } from './sendRawTransaction-DWMVY9UD.js';

class AccountNotFoundError extends BaseError {
    constructor({ docsPath } = {}) {
        super([
            'Could not find an Account to execute with this Action.',
            'Please provide an Account with the `account` argument on the Action, or by supplying an `account` to the Client.',
        ].join('\n'), {
            docsPath,
            docsSlug: 'account',
            name: 'AccountNotFoundError',
        });
    }
}
class AccountTypeNotSupportedError extends BaseError {
    constructor({ docsPath, metaMessages, type, }) {
        super(`Account type "${type}" is not supported.`, {
            docsPath,
            metaMessages,
            name: 'AccountTypeNotSupportedError',
        });
    }
}

function assertCurrentChain({ chain, currentChainId, }) {
    if (!chain)
        throw new ChainNotFoundError();
    if (currentChainId !== chain.id)
        throw new ChainMismatchError({ chain, currentChainId });
}

const supportsWalletNamespace = new LruMap(128);
/**
 * Creates, signs, and sends a new transaction to the network.
 *
 * - Docs: https://viem.sh/docs/actions/wallet/sendTransaction
 * - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/transactions_sending-transactions
 * - JSON-RPC Methods:
 *   - JSON-RPC Accounts: [`eth_sendTransaction`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_sendtransaction)
 *   - Local Accounts: [`eth_sendRawTransaction`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_sendrawtransaction)
 *
 * @param client - Client to use
 * @param parameters - {@link SendTransactionParameters}
 * @returns The [Transaction](https://viem.sh/docs/glossary/terms#transaction) hash. {@link SendTransactionReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { sendTransaction } from 'viem/wallet'
 *
 * const client = createWalletClient({
 *   chain: mainnet,
 *   transport: custom(window.ethereum),
 * })
 * const hash = await sendTransaction(client, {
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
 * import { sendTransaction } from 'viem/wallet'
 *
 * const client = createWalletClient({
 *   account: privateKeyToAccount('0x…'),
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const hash = await sendTransaction(client, {
 *   to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
 *   value: 1000000000000000000n,
 * })
 */
async function sendTransaction(client, parameters) {
    const { account: account_ = client.account, assertChainId = true, chain = client.chain, accessList, authorizationList, blobs, data, dataSuffix = typeof client.dataSuffix === 'string'
        ? client.dataSuffix
        : client.dataSuffix?.value, gas, gasPrice, maxFeePerBlobGas, maxFeePerGas, maxPriorityFeePerGas, nonce, type, value, ...rest } = parameters;
    if (typeof account_ === 'undefined')
        throw new AccountNotFoundError({
            docsPath: '/docs/actions/wallet/sendTransaction',
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
                    return await client
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
                    });
                }
                throw error;
            }
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
            return await getAction(client, sendRawTransaction, 'sendRawTransaction')({
                serializedTransaction,
            });
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
            docsPath: '/docs/actions/wallet/sendTransaction',
            type: account?.type,
        });
    }
    catch (err) {
        if (err instanceof AccountTypeNotSupportedError)
            throw err;
        if (nonceManagerParameters)
            account?.nonceManager?.reset(nonceManagerParameters);
        throw getTransactionError(err, {
            ...parameters,
            account,
            chain: parameters.chain || undefined,
        });
    }
}

/**
 * Executes a write function on a contract.
 *
 * - Docs: https://viem.sh/docs/contract/writeContract
 * - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/contracts_writing-to-contracts
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
 * const hash = await writeContract(client, {
 *   address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
 *   abi: parseAbi(['function mint(uint32 tokenId) nonpayable']),
 *   functionName: 'mint',
 *   args: [69420],
 * })
 *
 * @example
 * // With Validation
 * import { createWalletClient, http, parseAbi } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { simulateContract, writeContract } from 'viem/contract'
 *
 * const client = createWalletClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const { request } = await simulateContract(client, {
 *   address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
 *   abi: parseAbi(['function mint(uint32 tokenId) nonpayable']),
 *   functionName: 'mint',
 *   args: [69420],
 * }
 * const hash = await writeContract(client, request)
 */
async function writeContract(client, parameters) {
    return writeContract.internal(client, sendTransaction, 'sendTransaction', parameters);
}
(function (writeContract) {
    async function internal(client, actionFn, name, parameters) {
        const { abi, account: account_ = client.account, address, args, functionName, ...request } = parameters;
        if (typeof account_ === 'undefined')
            throw new AccountNotFoundError({
                docsPath: '/docs/contract/writeContract',
            });
        const account = account_ ? parseAccount(account_) : null;
        const data = encodeFunctionData({
            abi,
            args,
            functionName,
        });
        try {
            return await getAction(client, actionFn, name)({
                data,
                to: address,
                account,
                ...request,
            });
        }
        catch (error) {
            throw getContractError(error, {
                abi,
                address,
                args,
                docsPath: '/docs/contract/writeContract',
                functionName,
                sender: account?.address,
            });
        }
    }
    writeContract.internal = internal;
})(writeContract || (writeContract = {}));

class InvalidDecimalNumberError extends BaseError {
    constructor({ value }) {
        super(`Number \`${value}\` is not a valid decimal number.`, {
            name: 'InvalidDecimalNumberError',
        });
    }
}

/**
 * Multiplies a string representation of a number by a given exponent of base 10 (10exponent).
 *
 * - Docs: https://viem.sh/docs/utilities/parseUnits
 *
 * @example
 * import { parseUnits } from 'viem'
 *
 * parseUnits('420', 9)
 * // 420000000000n
 */
function parseUnits(value, decimals) {
    if (!/^(-?)([0-9]*)\.?([0-9]*)$/.test(value))
        throw new InvalidDecimalNumberError({ value });
    let [integer, fraction = '0'] = value.split('.');
    const negative = integer.startsWith('-');
    if (negative)
        integer = integer.slice(1);
    // trim trailing zeros.
    fraction = fraction.replace(/(0+)$/, '');
    // round off if the fraction is larger than the number of decimals.
    if (decimals === 0) {
        if (Math.round(Number(`.${fraction}`)) === 1)
            integer = `${BigInt(integer) + 1n}`;
        fraction = '';
    }
    else if (fraction.length > decimals) {
        const [left, unit, right] = [
            fraction.slice(0, decimals - 1),
            fraction.slice(decimals - 1, decimals),
            fraction.slice(decimals),
        ];
        const rounded = Math.round(Number(`${unit}.${right}`));
        if (rounded > 9)
            fraction = `${BigInt(left) + BigInt(1)}0`.padStart(left.length + 1, '0');
        else
            fraction = `${left}${rounded}`;
        if (fraction.length > decimals) {
            fraction = fraction.slice(1);
            integer = `${BigInt(integer) + 1n}`;
        }
        fraction = fraction.slice(0, decimals);
    }
    else {
        fraction = fraction.padEnd(decimals, '0');
    }
    return BigInt(`${negative ? '-' : ''}${integer}${fraction}`);
}

export { AccountNotFoundError as A, AccountTypeNotSupportedError as a, assertCurrentChain as b, parseUnits as p, sendTransaction as s, writeContract as w };
//# sourceMappingURL=parseUnits-CO0kRdLR.js.map
