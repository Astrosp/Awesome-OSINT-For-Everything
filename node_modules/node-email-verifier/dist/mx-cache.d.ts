/**
 * MX Record Cache implementation for node-email-verifier
 * Provides TTL-based caching of MX records to improve performance
 */
import { MxRecord } from './types.js';
/**
 * Cache statistics for monitoring cache performance
 */
export interface CacheStatistics {
    /** Total number of cache hits */
    hits: number;
    /** Total number of cache misses */
    misses: number;
    /** Total number of entries currently in cache */
    size: number;
    /** Total number of entries evicted due to TTL expiry */
    evictions: number;
    /** Cache hit rate as a percentage (0-100) */
    hitRate: number;
}
/**
 * Configuration options for MX cache
 */
export interface MxCacheOptions {
    /** Whether caching is enabled. Defaults to true */
    enabled?: boolean;
    /** Default TTL in milliseconds. Defaults to 300000 (5 minutes) */
    defaultTtl?: number;
    /** Maximum number of entries in cache. Defaults to 1000 */
    maxSize?: number;
    /** Whether to enable periodic cleanup of expired entries. Defaults to true. Set to false for deterministic behavior in tests */
    cleanupEnabled?: boolean;
    /** Probability of running cleanup on each set operation (0-1). Defaults to 0.1 (10%) */
    cleanupProbability?: number;
}
/**
 * MX Record Cache with TTL support and statistics
 */
export declare class MxCache {
    private cache;
    private statistics;
    private readonly options;
    constructor(options?: MxCacheOptions);
    /**
     * Get MX records from cache if available and not expired
     * @param domain - The domain to look up
     * @returns Cached MX records or null if not found/expired
     */
    get(domain: string): MxRecord[] | null;
    /**
     * Store MX records in cache
     * @param domain - The domain to cache
     * @param records - The MX records to cache
     * @param ttl - Optional TTL in milliseconds (uses default if not provided)
     */
    set(domain: string, records: MxRecord[], ttl?: number): void;
    /**
     * Clear all entries from the cache
     */
    flush(): void;
    /**
     * Clear specific domain from cache
     * @param domain - The domain to remove from cache
     * @returns true if entry was removed, false if not found
     */
    delete(domain: string): boolean;
    /**
     * Get current cache statistics
     * @returns Cache statistics including hit rate
     */
    getStatistics(): CacheStatistics;
    /**
     * Reset cache statistics (does not clear cache entries)
     */
    resetStatistics(): void;
    /**
     * Check if caching is enabled
     * @returns true if cache is enabled
     */
    isEnabled(): boolean;
    /**
     * Clean up expired entries from cache
     * This is called automatically on get() but can be called manually
     * @returns Number of entries removed
     */
    cleanExpired(): number;
}
export declare const globalMxCache: MxCache;
