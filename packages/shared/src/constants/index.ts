// Shared constants across the StudioChain application

export const APP_NAME = 'StudioChain';
export const APP_VERSION = '1.0.0';

// Content tiers
export const CONTENT_TIERS = {
  FREE: {
    name: 'Free',
    tokenRequirement: 0,
    features: ['Basic content access', 'Limited viewing']
  },
  BASIC: {
    name: 'Basic',
    tokenRequirement: 100,
    features: ['Premium content', 'HD streaming', 'Mobile downloads']
  },
  PREMIUM: {
    name: 'Premium',
    tokenRequirement: 1000,
    features: ['All content', '4K streaming', 'Offline viewing', 'Early access']
  },
  CREATOR: {
    name: 'Creator',
    tokenRequirement: 5000,
    features: ['Upload content', 'Analytics dashboard', 'Revenue sharing']
  }
} as const;

// Supported chains
export const SUPPORTED_CHAINS = {
  POLYGON: {
    id: 137,
    name: 'Polygon',
    rpcUrl: 'https://polygon-rpc.com/',
    blockExplorer: 'https://polygonscan.com/'
  },
  MUMBAI: {
    id: 80001,
    name: 'Mumbai Testnet',
    rpcUrl: 'https://rpc-mumbai.maticvigil.com/',
    blockExplorer: 'https://mumbai.polygonscan.com/'
  },
  LOCALHOST: {
    id: 31337,
    name: 'Localhost',
    rpcUrl: 'http://127.0.0.1:8545/',
    blockExplorer: 'http://localhost:8545/'
  }
} as const;

// API endpoints
export const API_ENDPOINTS = {
  AUTH: '/api/auth',
  CONTENT: '/api/content',
  USER: '/api/user',
  ANALYTICS: '/api/analytics',
  CLERK_WEBHOOK: '/api/clerk'
} as const;

// Media categories
export const MEDIA_CATEGORIES = [
  'Documentary',
  'Movie',
  'TV Show',
  'Short Film',
  'Educational',
  'Kids',
  'Teens'
] as const;

// Upload constraints
export const UPLOAD_CONSTRAINTS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024 * 1024, // 5GB
  ALLOWED_FORMATS: ['mp4', 'mov', 'avi', 'mkv'],
  MAX_DURATION: 10800, // 3 hours in seconds
  THUMBNAIL_SIZE: 1920 * 1080
} as const;

export type MediaCategory = typeof MEDIA_CATEGORIES[number];
export type SupportedChain = keyof typeof SUPPORTED_CHAINS;