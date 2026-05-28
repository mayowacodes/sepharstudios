// Shared utility functions across the StudioChain application
/**
 * Format a wallet address for display (shortened)
 */
export function formatAddress(address, length = 4) {
    if (!address)
        return '';
    return `${address.slice(0, 2 + length)}...${address.slice(-length)}`;
}
/**
 * Format duration from seconds to human readable format
 */
export function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}
/**
 * Format file size to human readable format
 */
export function formatFileSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0)
        return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}
/**
 * Debounce function calls
 */
export function debounce(func, wait) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}
/**
 * Generate a random ID
 */
export function generateId(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
/**
 * Validate email format
 */
export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
/**
 * Validate Ethereum address format
 */
export function isValidAddress(address) {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
}
/**
 * Sleep function for async delays
 */
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
/**
 * Clamp a number between min and max values
 */
export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
/**
 * Check if code is running in browser
 */
export function isBrowser() {
    return typeof window !== 'undefined';
}
/**
 * Parse error message from various error types
 */
export function parseErrorMessage(error) {
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === 'string') {
        return error;
    }
    return 'An unknown error occurred';
}
