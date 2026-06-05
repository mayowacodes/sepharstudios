import { u as createTransport } from './http-DCIt3x9N.js';

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

export { custom as c };
//# sourceMappingURL=custom-1B_Soxgv.js.map
