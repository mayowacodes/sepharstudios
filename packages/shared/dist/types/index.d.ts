export interface User {
    id: string;
    email: string;
    name: string;
    bio?: string;
    walletAddress?: string;
}
export interface ContentTier {
    name: string;
    tokenRequirement: number;
    features: string[];
}
export interface MediaContent {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    duration?: number;
    category: string;
    tier: 'free' | 'basic' | 'premium';
}
export interface AccessControl {
    contentId: string;
    tokenRequirement: number;
    tierName: string;
}
export interface WalletConnection {
    address: string;
    chainId: number;
    isConnected: boolean;
}
export interface TokenBalance {
    balance: string;
    decimals: number;
    symbol: string;
}
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
}
