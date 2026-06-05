import { o as parseSignature, q as parseStructs, l as isStructSignature, I as InvalidAbiItemError, s as splitParameters, n as parseAbiParameter, m as modifiers, a as InvalidAbiParametersError } from './parseAbi-DF0R0BTC.js';

/**
 * Parses human-readable ABI item (e.g. error, event, function) into {@link Abi} item
 *
 * @param signature - Human-readable ABI item
 * @returns Parsed {@link Abi} item
 *
 * @example
 * const abiItem = parseAbiItem('function balanceOf(address owner) view returns (uint256)')
 * //    ^? const abiItem: { name: "balanceOf"; type: "function"; stateMutability: "view";...
 *
 * @example
 * const abiItem = parseAbiItem([
 *   //  ^? const abiItem: { name: "foo"; type: "function"; stateMutability: "view"; inputs:...
 *   'function foo(Baz bar) view returns (string)',
 *   'struct Baz { string name; }',
 * ])
 */
function parseAbiItem(signature) {
    let abiItem;
    if (typeof signature === 'string')
        abiItem = parseSignature(signature);
    else {
        const structs = parseStructs(signature);
        const length = signature.length;
        for (let i = 0; i < length; i++) {
            const signature_ = signature[i];
            if (isStructSignature(signature_))
                continue;
            abiItem = parseSignature(signature_, structs);
            break;
        }
    }
    if (!abiItem)
        throw new InvalidAbiItemError({ signature });
    return abiItem;
}

/**
 * Parses human-readable ABI parameters into {@link AbiParameter}s
 *
 * @param params - Human-readable ABI parameters
 * @returns Parsed {@link AbiParameter}s
 *
 * @example
 * const abiParameters = parseAbiParameters('address from, address to, uint256 amount')
 * //    ^? const abiParameters: [{ type: "address"; name: "from"; }, { type: "address";...
 *
 * @example
 * const abiParameters = parseAbiParameters([
 *   //  ^? const abiParameters: [{ type: "tuple"; components: [{ type: "string"; name:...
 *   'Baz bar',
 *   'struct Baz { string name; }',
 * ])
 */
function parseAbiParameters(params) {
    const abiParameters = [];
    if (typeof params === 'string') {
        const parameters = splitParameters(params);
        const length = parameters.length;
        for (let i = 0; i < length; i++) {
            abiParameters.push(parseAbiParameter(parameters[i], { modifiers }));
        }
    }
    else {
        const structs = parseStructs(params);
        const length = params.length;
        for (let i = 0; i < length; i++) {
            const signature = params[i];
            if (isStructSignature(signature))
                continue;
            const parameters = splitParameters(signature);
            const length = parameters.length;
            for (let k = 0; k < length; k++) {
                abiParameters.push(parseAbiParameter(parameters[k], { modifiers, structs }));
            }
        }
    }
    if (abiParameters.length === 0)
        throw new InvalidAbiParametersError({ params });
    return abiParameters;
}

export { parseAbiParameters as a, parseAbiItem as p };
//# sourceMappingURL=parseAbiParameters-quw_kf-z.js.map
