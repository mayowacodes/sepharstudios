export declare const APP_NAME = "StudioChain";
export declare const APP_VERSION = "1.0.0";
export declare const CONTENT_TIERS: {
    readonly FREE: {
        readonly name: "Free";
        readonly tokenRequirement: 0;
        readonly features: readonly ["Basic content access", "Limited viewing"];
    };
    readonly BASIC: {
        readonly name: "Basic";
        readonly tokenRequirement: 100;
        readonly features: readonly ["Premium content", "HD streaming", "Mobile downloads"];
    };
    readonly PREMIUM: {
        readonly name: "Premium";
        readonly tokenRequirement: 1000;
        readonly features: readonly ["All content", "4K streaming", "Offline viewing", "Early access"];
    };
    readonly CREATOR: {
        readonly name: "Creator";
        readonly tokenRequirement: 5000;
        readonly features: readonly ["Upload content", "Analytics dashboard", "Revenue sharing"];
    };
};
export declare const SUPPORTED_CHAINS: {
    readonly POLYGON: {
        readonly id: 137;
        readonly name: "Polygon";
        readonly rpcUrl: "https://polygon-rpc.com/";
        readonly blockExplorer: "https://polygonscan.com/";
    };
    readonly MUMBAI: {
        readonly id: 80001;
        readonly name: "Mumbai Testnet";
        readonly rpcUrl: "https://rpc-mumbai.maticvigil.com/";
        readonly blockExplorer: "https://mumbai.polygonscan.com/";
    };
    readonly LOCALHOST: {
        readonly id: 31337;
        readonly name: "Localhost";
        readonly rpcUrl: "http://127.0.0.1:8545/";
        readonly blockExplorer: "http://localhost:8545/";
    };
};
export declare const API_ENDPOINTS: {
    readonly AUTH: "/api/auth";
    readonly CONTENT: "/api/content";
    readonly USER: "/api/user";
    readonly ANALYTICS: "/api/analytics";
    readonly CLERK_WEBHOOK: "/api/clerk";
};
export declare const MEDIA_CATEGORIES: readonly ["Documentary", "Movie", "TV Show", "Short Film", "Educational", "Kids", "Teens"];
export declare const UPLOAD_CONSTRAINTS: {
    readonly MAX_FILE_SIZE: number;
    readonly ALLOWED_FORMATS: readonly ["mp4", "mov", "avi", "mkv"];
    readonly MAX_DURATION: 10800;
    readonly THUMBNAIL_SIZE: number;
};
export type MediaCategory = typeof MEDIA_CATEGORIES[number];
export type SupportedChain = keyof typeof SUPPORTED_CHAINS;
