import { secp256k1 } from './secp256k1-eLPjhWhb.js';
import { q as isAddress, a as InvalidAddressError, r as isHex, o as hexToBytes, v as numberToHex, s as keccak256, G as toHex } from './stringify-CbXG6ciN.js';
import { ah as hashAuthorization, al as publicKeyToAddress } from './chain-Bx4XJ_Uj.js';
import { s as serializeSignature, c as hashMessage, e as hashTypedData } from './serializeSignature-D75oUNUr.js';
import { d as serializeTransaction } from './serializeAuthorizationList-BL8JUsZH.js';

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

export { signAuthorization as a, signMessage as b, signTransaction as c, signTypedData as d, privateKeyToAccount as p, sign as s, toAccount as t };
//# sourceMappingURL=privateKeyToAccount-DUKyWGys.js.map
