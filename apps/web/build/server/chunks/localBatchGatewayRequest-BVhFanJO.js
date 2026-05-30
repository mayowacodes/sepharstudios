import { aO as slice, aX as toFunctionSelector, ab as formatAbiItem, i as AbiFunctionSignatureNotFoundError, X as decodeAbiParameters, am as getAbiItem, c as AbiErrorNotFoundError, b as AbiErrorInputsNotFoundError, a0 as encodeAbiParameters, V as concatHex, g as AbiFunctionNotFoundError, h as AbiFunctionOutputsNotFoundError, q as InvalidArrayError, J as batchGatewayAbi, aR as solidityError } from './sendRawTransaction-DWMVY9UD.js';

function decodeFunctionData(parameters) {
    const { abi, data } = parameters;
    const signature = slice(data, 0, 4);
    const description = abi.find((x) => x.type === 'function' &&
        signature === toFunctionSelector(formatAbiItem(x)));
    if (!description)
        throw new AbiFunctionSignatureNotFoundError(signature, {
            docsPath: '/docs/contract/decodeFunctionData',
        });
    return {
        functionName: description.name,
        args: ('inputs' in description &&
            description.inputs &&
            description.inputs.length > 0
            ? decodeAbiParameters(description.inputs, slice(data, 4))
            : undefined),
    };
}

const docsPath$1 = '/docs/contract/encodeErrorResult';
function encodeErrorResult(parameters) {
    const { abi, errorName, args } = parameters;
    let abiItem = abi[0];
    if (errorName) {
        const item = getAbiItem({ abi, args, name: errorName });
        if (!item)
            throw new AbiErrorNotFoundError(errorName, { docsPath: docsPath$1 });
        abiItem = item;
    }
    if (abiItem.type !== 'error')
        throw new AbiErrorNotFoundError(undefined, { docsPath: docsPath$1 });
    const definition = formatAbiItem(abiItem);
    const signature = toFunctionSelector(definition);
    let data = '0x';
    if (args && args.length > 0) {
        if (!abiItem.inputs)
            throw new AbiErrorInputsNotFoundError(abiItem.name, { docsPath: docsPath$1 });
        data = encodeAbiParameters(abiItem.inputs, args);
    }
    return concatHex([signature, data]);
}

const docsPath = '/docs/contract/encodeFunctionResult';
function encodeFunctionResult(parameters) {
    const { abi, functionName, result } = parameters;
    let abiItem = abi[0];
    if (functionName) {
        const item = getAbiItem({ abi, name: functionName });
        if (!item)
            throw new AbiFunctionNotFoundError(functionName, { docsPath });
        abiItem = item;
    }
    if (abiItem.type !== 'function')
        throw new AbiFunctionNotFoundError(undefined, { docsPath });
    if (!abiItem.outputs)
        throw new AbiFunctionOutputsNotFoundError(abiItem.name, { docsPath });
    const values = (() => {
        if (abiItem.outputs.length === 0)
            return [];
        if (abiItem.outputs.length === 1)
            return [result];
        if (Array.isArray(result))
            return result;
        throw new InvalidArrayError(result);
    })();
    return encodeAbiParameters(abiItem.outputs, values);
}

const localBatchGatewayUrl = 'x-batch-gateway:true';
async function localBatchGatewayRequest(parameters) {
    const { data, ccipRequest } = parameters;
    const { args: [queries], } = decodeFunctionData({ abi: batchGatewayAbi, data });
    const failures = [];
    const responses = [];
    await Promise.all(queries.map(async (query, i) => {
        try {
            responses[i] = query.urls.includes(localBatchGatewayUrl)
                ? await localBatchGatewayRequest({ data: query.data, ccipRequest })
                : await ccipRequest(query);
            failures[i] = false;
        }
        catch (err) {
            failures[i] = true;
            responses[i] = encodeError(err);
        }
    }));
    return encodeFunctionResult({
        abi: batchGatewayAbi,
        functionName: 'query',
        result: [failures, responses],
    });
}
function encodeError(error) {
    if (error.name === 'HttpRequestError' && error.status)
        return encodeErrorResult({
            abi: batchGatewayAbi,
            errorName: 'HttpError',
            args: [error.status, error.shortMessage],
        });
    return encodeErrorResult({
        abi: [solidityError],
        errorName: 'Error',
        args: ['shortMessage' in error ? error.shortMessage : error.message],
    });
}

export { localBatchGatewayUrl as a, localBatchGatewayRequest as l };
//# sourceMappingURL=localBatchGatewayRequest-BVhFanJO.js.map
