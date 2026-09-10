import { v as createTransport } from './http-D5cER_a5.js';

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
//# sourceMappingURL=custom-C62mJWby.js.map
