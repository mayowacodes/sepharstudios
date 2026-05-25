import { B as BaseError, p as parseAccount, L as LruMap, o as createTransport, q as ConnectorUnavailableReconnectingError, u as ConnectorNotConnectedError, v as ConnectorChainMismatchError, x as getAddress, y as ConnectorAccountNotFoundError, z as createClient, A as getContractAddresses, d as config } from './config-DiSGGbdB.js';
import { C as ChainNotFoundError, p as ChainMismatchError, q as AccountNotFoundError, r as assertRequest, u as recoverAuthorizationAddress, v as getAction$1, w as getChainId$1, x as formatTransactionRequest, a as concat, y as extract, z as prepareTransactionRequest, B as defaultParameters, D as sendRawTransaction, E as AccountTypeNotSupportedError, F as getTransactionError, G as encodeFunctionData, H as getContractError, J as readContract$1 } from './sendRawTransaction-hYphdCNk.js';
import { f as formatUnits } from './node-DdUQjS54.js';
import { g as getAccount } from './getAccount-CAZUvBhV.js';

function assertCurrentChain({ chain, currentChainId, }) {
    if (!chain)
        throw new ChainNotFoundError();
    if (currentChainId !== chain.id)
        throw new ChainMismatchError({ chain, currentChainId });
}

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
                chainId = await getAction$1(client, getChainId$1, 'getChainId')({});
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
                data: data ? concat([data, dataSuffix ?? '0x']) : data,
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
            // Prepare the request for signing (assign appropriate fees, etc.)
            const request = await getAction$1(client, prepareTransactionRequest, 'prepareTransactionRequest')({
                account,
                accessList,
                authorizationList,
                blobs,
                chain,
                data: data ? concat([data, dataSuffix ?? '0x']) : data,
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
            return await getAction$1(client, sendRawTransaction, 'sendRawTransaction')({
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
async function writeContract$1(client, parameters) {
    return writeContract$1.internal(client, sendTransaction, 'sendTransaction', parameters);
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
            return await getAction$1(client, actionFn, name)({
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
})(writeContract$1 || (writeContract$1 = {}));

/**
 * Retrieves and returns an action from the client (if exists), and falls
 * back to the tree-shakable action.
 *
 * Useful for extracting overridden actions from a client (ie. if a consumer
 * wants to override the `sendTransaction` implementation).
 */
function getAction(client, actionFn, 
// Some minifiers drop `Function.prototype.name`, or replace it with short letters,
// meaning that `actionFn.name` will not always work. For that case, the consumer
// needs to pass the name explicitly.
name) {
    const action_implicit = client[actionFn.name];
    if (typeof action_implicit === 'function')
        return action_implicit;
    const action_explicit = client[name];
    if (typeof action_explicit === 'function')
        return action_explicit;
    return (params) => actionFn(client, params);
}

/**
 * @description Creates a custom transport given an EIP-1193 compliant `request` attribute.
 */
function custom(provider, config = {}) {
    const { key = 'custom', methods, name = 'Custom Provider', retryDelay, } = config;
    return ({ retryCount: defaultRetryCount }) => createTransport({
        key,
        methods,
        name,
        request: provider.request.bind(provider),
        retryCount: config.retryCount ?? defaultRetryCount,
        retryDelay,
        type: 'custom',
    });
}

/** https://wagmi.sh/core/api/actions/getConnectorClient */
async function getConnectorClient(config, parameters = {}) {
    const { assertChainId = true } = parameters;
    // Get connection
    let connection;
    if (parameters.connector) {
        const { connector } = parameters;
        if (config.state.status === 'reconnecting' &&
            !connector.getAccounts &&
            !connector.getChainId)
            throw new ConnectorUnavailableReconnectingError({ connector });
        const [accounts, chainId] = await Promise.all([
            connector.getAccounts().catch((e) => {
                if (parameters.account === null)
                    return [];
                throw e;
            }),
            connector.getChainId(),
        ]);
        connection = {
            accounts: accounts,
            chainId,
            connector,
        };
    }
    else
        connection = config.state.connections.get(config.state.current);
    if (!connection)
        throw new ConnectorNotConnectedError();
    const chainId = parameters.chainId ?? connection.chainId;
    // Check connector using same chainId as connection
    const connectorChainId = await connection.connector.getChainId();
    if (assertChainId && connectorChainId !== chainId)
        throw new ConnectorChainMismatchError({
            connectionChainId: chainId,
            connectorChainId,
        });
    const connector = connection.connector;
    if (connector.getClient)
        return connector.getClient({ chainId });
    // Default using `custom` transport
    const account = parseAccount(parameters.account ?? connection.accounts[0]);
    if (account)
        account.address = getAddress(account.address); // TODO: Checksum address as part of `parseAccount`?
    // If account was provided, check that it exists on the connector
    if (parameters.account &&
        !connection.accounts.some((x) => x.toLowerCase() === account.address.toLowerCase()))
        throw new ConnectorAccountNotFoundError({
            address: account.address,
            connector,
        });
    const chain = config.chains.find((chain) => chain.id === chainId);
    const provider = (await connection.connector.getProvider({ chainId }));
    return createClient({
        account,
        chain,
        name: 'Connector Client',
        transport: (opts) => custom(provider)({ ...opts, retryCount: 0 }),
    });
}

/** https://wagmi.sh/core/api/actions/readContract */
function readContract(config, parameters) {
    const { chainId, ...rest } = parameters;
    const client = config.getClient({ chainId });
    const action = getAction(client, readContract$1, 'readContract');
    return action(rest);
}

/** https://wagmi.sh/core/api/actions/getChainId */
function getChainId(config) {
    return config.state.chainId;
}

/** https://wagmi.sh/core/api/actions/writeContract */
async function writeContract(config, parameters) {
    const { account, chainId, connector, ...request } = parameters;
    let client;
    if (typeof account === 'object' && account?.type === 'local')
        client = config.getClient({ chainId });
    else
        client = await getConnectorClient(config, {
            account: account ?? undefined,
            assertChainId: false,
            chainId,
            connector,
        });
    const action = getAction(client, writeContract$1, 'writeContract');
    const hash = await action({
        ...request,
        ...(account ? { account } : {}),
        chain: chainId ? { id: chainId } : null,
    });
    return hash;
}

const STUDIO_CHAIN_TOKEN_ABI = [
  // Basic ERC20 functions
  "function balanceOf(address owner) view returns (uint256)",
  "function totalSupply() view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  // Staking functions
  "function stakeForDiscount(uint256 amount, uint256 lockPeriod)",
  "function addToStake(uint256 additionalAmount)",
  "function unstake()",
  "function getUserDiscount(address user) view returns (uint256)",
  "function getStakingInfo(address user) view returns (uint256 amount, uint256 stakingTime, uint256 lockPeriod, uint256 discountTier, bool isUnlocked)",
  // Reward functions
  "function rewardUser(address user, uint256 amount, string memory rewardType)",
  "function userRewardsEarned(address user) view returns (uint256)",
  // Events
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event TokensStaked(address indexed user, uint256 amount, uint256 lockPeriod)",
  "event TokensUnstaked(address indexed user, uint256 amount)",
  "event RewardClaimed(address indexed user, uint256 amount, string rewardType)"
];
const STUDIO_CHAIN_SUBSCRIPTION_ABI = [
  // NFT functions
  "function balanceOf(address owner) view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  // Subscription functions
  "function mintSubscription(address subscriber, uint8 tier, uint256 amountPaid, uint256 duration) returns (uint256)",
  "function renewSubscription(address subscriber, uint256 additionalDuration) returns (uint256)",
  "function getSubscriptionStatus(address subscriber) view returns (bool isActive, uint256 tokenId, uint256 expiryDate)",
  "function getSubscriptionDetails(uint256 tokenId) view returns (address subscriber, uint8 tier, uint256 amountPaid, uint256 startDate, uint256 expiryDate, bool isActive, uint256 renewalCount, uint256 totalRevenue)",
  "function hasActiveSubscription(address user) view returns (bool hasAccess, uint8 tier)",
  // STC subscription
  "function mintSubscriptionWithSTC() returns (uint256)",
  "function getSTCCooldownStatus(address user) view returns (uint256 secondsRemaining, uint256 nextCooldownDays)",
  "function stcSubscriptionAmount() view returns (uint256)",
  "function stcSubUsage(address user) view returns (uint256 redemptionCount, uint256 lastRedemptionTime)",
  // Events
  "event SubscriptionMinted(address indexed subscriber, uint256 indexed tokenId, uint8 tier, uint256 expiryDate)",
  "event SubscriptionRenewed(address indexed subscriber, uint256 indexed tokenId, uint256 newExpiryDate)",
  "event SubscriptionMintedWithSTC(address indexed subscriber, uint256 indexed tokenId, uint256 stcAmount, uint256 nextCooldownDays)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
];
const TOKEN_AMM_ABI = [
  // Liquidity functions
  "function addLiquidity(uint256 stcAmount, uint256 usdcAmount, uint256 minLiquidity) returns (uint256)",
  "function removeLiquidity(uint256 liquidityTokens, uint256 minStc, uint256 minUsdc) returns (uint256 stcAmount, uint256 usdcAmount)",
  // Trading functions
  "function swapSTCForUSDC(uint256 stcAmountIn, uint256 minUsdcOut) returns (uint256)",
  "function swapUSDCForSTC(uint256 usdcAmountIn, uint256 minStcOut) returns (uint256)",
  "function getSTCPrice() view returns (uint256)",
  "function getStcAmountOut(uint256 usdcAmount) view returns (uint256)",
  // Pool information
  "function getPoolInfo() view returns (uint256 stcBalance, uint256 usdcBalance, uint256 totalLiq, uint256 currentPrice, uint256 revenue)",
  "function stcReserve() view returns (uint256)",
  "function usdcReserve() view returns (uint256)",
  "function totalLiquidity() view returns (uint256)",
  "function liquidityProviders(address provider) view returns (uint256)",
  // Platform functions
  "function executeBuyback(uint256 usdcAmount)",
  "function updatePlatformRevenue(uint256 newRevenue)",
  "function monthlyPlatformRevenue() view returns (uint256)",
  // Events
  "event LiquidityAdded(address indexed provider, uint256 stcAmount, uint256 usdcAmount, uint256 liquidityTokens)",
  "event LiquidityRemoved(address indexed provider, uint256 stcAmount, uint256 usdcAmount, uint256 liquidityTokens)",
  "event TokenSwapped(address indexed trader, address indexed tokenIn, address indexed tokenOut, uint256 amountIn, uint256 amountOut)",
  "event BuybackExecuted(uint256 usdcAmount, uint256 stcAmount)",
  "event RevenueUpdated(uint256 newRevenue, uint256 timestamp)"
];
const USDC_ABI = [
  // Standard ERC20 functions
  "function balanceOf(address owner) view returns (uint256)",
  "function totalSupply() view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)",
  // Events
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)"
];
class STCTokenContract {
  getAddress() {
    const chainId = getChainId(config);
    return getContractAddresses(chainId).studioToken;
  }
  async balanceOf(address) {
    const balance = await readContract(config, {
      address: this.getAddress(),
      abi: STUDIO_CHAIN_TOKEN_ABI,
      functionName: "balanceOf",
      args: [address]
    });
    return formatUnits(balance, 18);
  }
  async getUserDiscount(address) {
    const discount = await readContract(config, {
      address: this.getAddress(),
      abi: STUDIO_CHAIN_TOKEN_ABI,
      functionName: "getUserDiscount",
      args: [address]
    });
    return Number(discount);
  }
  async getStakingInfo(address) {
    const stakingInfo = await readContract(config, {
      address: this.getAddress(),
      abi: STUDIO_CHAIN_TOKEN_ABI,
      functionName: "getStakingInfo",
      args: [address]
    });
    const [amount, stakingTime, lockPeriod, discountTier, isUnlocked] = stakingInfo;
    return {
      amount: formatUnits(amount, 18),
      stakingTime: Number(stakingTime),
      lockPeriod: Number(lockPeriod),
      discountTier: Number(discountTier),
      isUnlocked
    };
  }
  async stakeForDiscount(amount, lockPeriod) {
    const account = getAccount(config);
    if (!account.address) throw new Error("No account connected");
    return await writeContract(config, {
      address: this.getAddress(),
      abi: STUDIO_CHAIN_TOKEN_ABI,
      functionName: "stakeForDiscount",
      args: [parseUnits(amount, 18), BigInt(lockPeriod)]
    });
  }
  async addToStake(additionalAmount) {
    const account = getAccount(config);
    if (!account.address) throw new Error("No account connected");
    return await writeContract(config, {
      address: this.getAddress(),
      abi: STUDIO_CHAIN_TOKEN_ABI,
      functionName: "addToStake",
      args: [parseUnits(additionalAmount, 18)]
    });
  }
  async unstake() {
    const account = getAccount(config);
    if (!account.address) throw new Error("No account connected");
    return await writeContract(config, {
      address: this.getAddress(),
      abi: STUDIO_CHAIN_TOKEN_ABI,
      functionName: "unstake",
      args: []
    });
  }
  async totalSupply() {
    try {
      const supply = await readContract(config, {
        address: this.getAddress(),
        abi: STUDIO_CHAIN_TOKEN_ABI,
        functionName: "totalSupply",
        args: []
      });
      return formatUnits(supply, 18);
    } catch (error) {
      console.error("Error getting total supply:", error);
      return "10000000";
    }
  }
  async approve(spender, amount) {
    return await writeContract(config, {
      address: this.getAddress(),
      abi: STUDIO_CHAIN_TOKEN_ABI,
      functionName: "approve",
      args: [spender, parseUnits(amount, 18)]
    });
  }
  async allowance(owner, spender) {
    const allowance = await readContract(config, {
      address: this.getAddress(),
      abi: STUDIO_CHAIN_TOKEN_ABI,
      functionName: "allowance",
      args: [owner, spender]
    });
    return formatUnits(allowance, 18);
  }
  contractAddress() {
    return this.getAddress();
  }
}
class SubscriptionContract {
  getAddress() {
    const chainId = getChainId(config);
    return getContractAddresses(chainId).sepharSubscription;
  }
  async getSubscriptionStatus(address) {
    const status = await readContract(config, {
      address: this.getAddress(),
      abi: STUDIO_CHAIN_SUBSCRIPTION_ABI,
      functionName: "getSubscriptionStatus",
      args: [address]
    });
    const [isActive, tokenId, expiryDate] = status;
    return {
      isActive,
      tokenId: Number(tokenId),
      expiryDate: Number(expiryDate)
    };
  }
  async hasActiveSubscription(address) {
    const result = await readContract(config, {
      address: this.getAddress(),
      abi: STUDIO_CHAIN_SUBSCRIPTION_ABI,
      functionName: "hasActiveSubscription",
      args: [address]
    });
    const [hasAccess, tier] = result;
    return {
      hasAccess,
      tier
    };
  }
  async getSubscriptionDetails(tokenId) {
    const details = await readContract(config, {
      address: this.getAddress(),
      abi: STUDIO_CHAIN_SUBSCRIPTION_ABI,
      functionName: "getSubscriptionDetails",
      args: [BigInt(tokenId)]
    });
    const [subscriber, tier, amountPaid, startDate, expiryDate, isActive, renewalCount, totalRevenue] = details;
    return {
      subscriber,
      tier,
      amountPaid: Number(amountPaid),
      // in USD cents
      startDate: Number(startDate),
      expiryDate: Number(expiryDate),
      isActive,
      renewalCount: Number(renewalCount),
      totalRevenue: Number(totalRevenue)
    };
  }
  async balanceOf(address) {
    const balance = await readContract(config, {
      address: this.getAddress(),
      abi: STUDIO_CHAIN_SUBSCRIPTION_ABI,
      functionName: "balanceOf",
      args: [address]
    });
    return Number(balance);
  }
  async mintSubscriptionWithSTC() {
    const account = getAccount(config);
    if (!account.address) throw new Error("No account connected");
    return await writeContract(config, {
      address: this.getAddress(),
      abi: STUDIO_CHAIN_SUBSCRIPTION_ABI,
      functionName: "mintSubscriptionWithSTC",
      args: []
    });
  }
  async getSTCSubscriptionAmount() {
    const amount = await readContract(config, {
      address: this.getAddress(),
      abi: STUDIO_CHAIN_SUBSCRIPTION_ABI,
      functionName: "stcSubscriptionAmount",
      args: []
    });
    return formatUnits(amount, 18);
  }
  async getSTCCooldownStatus(address) {
    const result = await readContract(config, {
      address: this.getAddress(),
      abi: STUDIO_CHAIN_SUBSCRIPTION_ABI,
      functionName: "getSTCCooldownStatus",
      args: [address]
    });
    const [secondsRemaining, nextCooldownDays] = result;
    return {
      secondsRemaining: Number(secondsRemaining),
      nextCooldownDays: Number(nextCooldownDays)
    };
  }
  contractAddress() {
    return this.getAddress();
  }
}
class TokenAMMContract {
  getAddress() {
    const chainId = getChainId(config);
    return getContractAddresses(chainId).tokenAMM;
  }
  async getSTCPrice() {
    const price = await readContract(config, {
      address: this.getAddress(),
      abi: TOKEN_AMM_ABI,
      functionName: "getSTCPrice",
      args: []
    });
    return formatUnits(price, 6);
  }
  async getPoolInfo() {
    const poolInfo = await readContract(config, {
      address: this.getAddress(),
      abi: TOKEN_AMM_ABI,
      functionName: "getPoolInfo",
      args: []
    });
    const [stcBalance, usdcBalance, totalLiq, currentPrice, revenue] = poolInfo;
    return {
      stcBalance: formatUnits(stcBalance, 18),
      usdcBalance: formatUnits(usdcBalance, 6),
      totalLiquidity: Number(totalLiq),
      currentPrice: formatUnits(currentPrice, 6),
      monthlyRevenue: formatUnits(revenue, 6)
    };
  }
  async swapSTCForUSDC(stcAmount, minUsdcOut) {
    return await writeContract(config, {
      address: this.getAddress(),
      abi: TOKEN_AMM_ABI,
      functionName: "swapSTCForUSDC",
      args: [parseUnits(stcAmount, 18), parseUnits(minUsdcOut, 6)]
    });
  }
  async swapUSDCForSTC(usdcAmount, minStcOut) {
    return await writeContract(config, {
      address: this.getAddress(),
      abi: TOKEN_AMM_ABI,
      functionName: "swapUSDCForSTC",
      args: [parseUnits(usdcAmount, 6), parseUnits(minStcOut, 18)]
    });
  }
  contractAddress() {
    return this.getAddress();
  }
  async addLiquidity(stcAmount, usdcAmount, minLiquidity = 0) {
    return await writeContract(config, {
      address: this.getAddress(),
      abi: TOKEN_AMM_ABI,
      functionName: "addLiquidity",
      args: [parseUnits(stcAmount, 18), parseUnits(usdcAmount, 6), BigInt(minLiquidity)]
    });
  }
}
class USDCContract {
  getAddress() {
    const chainId = getChainId(config);
    return getContractAddresses(chainId).usdcToken;
  }
  async balanceOf(address) {
    const balance = await readContract(config, {
      address: this.getAddress(),
      abi: USDC_ABI,
      functionName: "balanceOf",
      args: [address]
    });
    return formatUnits(balance, 6);
  }
  async approve(spender, amount) {
    return await writeContract(config, {
      address: this.getAddress(),
      abi: USDC_ABI,
      functionName: "approve",
      args: [spender, parseUnits(amount, 6)]
    });
  }
  async allowance(owner, spender) {
    const allowance = await readContract(config, {
      address: this.getAddress(),
      abi: USDC_ABI,
      functionName: "allowance",
      args: [owner, spender]
    });
    return formatUnits(allowance, 6);
  }
}
const stcToken = new STCTokenContract();
const subscriptionContract = new SubscriptionContract();
const tokenAMM = new TokenAMMContract();
const usdcToken = new USDCContract();

export { subscriptionContract as a, stcToken as s, tokenAMM as t, usdcToken as u };
//# sourceMappingURL=contracts-DFOg1rza.js.map
