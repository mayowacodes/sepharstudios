import { w as defineChain } from './http-D5cER_a5.js';

const polygon = /*#__PURE__*/ defineChain({
    id: 137,
    name: 'Polygon',
    blockTime: 2000,
    nativeCurrency: { name: 'POL', symbol: 'POL', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://polygon.drpc.org'],
        },
    },
    blockExplorers: {
        default: {
            name: 'PolygonScan',
            url: 'https://polygonscan.com',
            apiUrl: 'https://api.etherscan.io/v2/api',
        },
    },
    contracts: {
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
            blockCreated: 25770160,
        },
    },
});

const polygonAmoy = /*#__PURE__*/ defineChain({
    id: 80_002,
    name: 'Polygon Amoy',
    nativeCurrency: { name: 'POL', symbol: 'POL', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://rpc-amoy.polygon.technology'],
        },
    },
    blockExplorers: {
        default: {
            name: 'PolygonScan',
            url: 'https://amoy.polygonscan.com',
            apiUrl: 'https://api.etherscan.io/v2/api',
        },
    },
    contracts: {
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
            blockCreated: 3127388,
        },
    },
    testnet: true,
});

export { polygonAmoy as a, polygon as p };
//# sourceMappingURL=polygonAmoy-PO2ITH37.js.map
