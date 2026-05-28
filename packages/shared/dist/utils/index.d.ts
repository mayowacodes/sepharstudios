/**
 * Format a wallet address for display (shortened)
 */
export declare function formatAddress(address: string, length?: number): string;
/**
 * Format duration from seconds to human readable format
 */
export declare function formatDuration(seconds: number): string;
/**
 * Format file size to human readable format
 */
export declare function formatFileSize(bytes: number): string;
/**
 * Debounce function calls
 */
export declare function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void;
/**
 * Generate a random ID
 */
export declare function generateId(length?: number): string;
/**
 * Validate email format
 */
export declare function isValidEmail(email: string): boolean;
/**
 * Validate Ethereum address format
 */
export declare function isValidAddress(address: string): boolean;
/**
 * Sleep function for async delays
 */
export declare function sleep(ms: number): Promise<void>;
/**
 * Clamp a number between min and max values
 */
export declare function clamp(value: number, min: number, max: number): number;
/**
 * Check if code is running in browser
 */
export declare function isBrowser(): boolean;
/**
 * Parse error message from various error types
 */
export declare function parseErrorMessage(error: unknown): string;
