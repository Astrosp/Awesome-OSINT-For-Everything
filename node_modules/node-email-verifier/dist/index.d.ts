import ms from 'ms';
import { ErrorCode } from './errors.js';
import { type CacheStatistics, type MxCacheOptions } from './mx-cache.js';
import type { MxRecord } from './types.js';
/**
 * Detailed validation result returned when `detailed: true` option is used.
 * Provides comprehensive information about email validation including
 * specific failure reasons and error codes.
 */
export interface ValidationResult {
    /** Overall validation result - true only if all enabled checks pass */
    valid: boolean;
    /** The email address that was validated */
    email: string;
    /** Email format validation results */
    format: {
        /** Whether the email format is valid according to RFC 5322 */
        valid: boolean;
        /** Human-readable reason for validation failure */
        reason?: string;
        /** Machine-readable error code for programmatic handling */
        errorCode?: ErrorCode;
    };
    /** MX record validation results (only present when checkMx is enabled) */
    mx?: {
        /** Whether valid MX records were found */
        valid: boolean;
        /** Array of MX records found for the domain */
        records?: MxRecord[];
        /** Human-readable reason for validation failure */
        reason?: string;
        /** Machine-readable error code for programmatic handling */
        errorCode?: ErrorCode;
        /** Whether the result was served from cache */
        cached?: boolean;
    };
    /** Disposable email validation results (only present when checkDisposable is enabled) */
    disposable?: {
        /** Whether the email is NOT from a disposable provider */
        valid: boolean;
        /** The disposable email provider domain if detected */
        provider?: string | null;
        /** Human-readable reason for validation failure */
        reason?: string;
        /** Machine-readable error code for programmatic handling */
        errorCode?: ErrorCode;
    };
    /** Top-level error code for quick access to the first validation failure */
    errorCode?: ErrorCode;
    /** Cache statistics (only present when cache is enabled and detailed is true) */
    cacheStats?: CacheStatistics;
}
/**
 * Configuration options for email validation.
 * All options are optional and have sensible defaults.
 */
export interface EmailValidatorOptions {
    /** Whether to check for MX records. Defaults to true. */
    checkMx?: boolean;
    /**
     * Timeout for DNS lookups. Can be a number in milliseconds or a string
     * in ms format (e.g., '5s', '100ms', '1m'). Defaults to '10s'.
     */
    timeout?: ms.StringValue | number;
    /** Whether to check for disposable email providers. Defaults to false. */
    checkDisposable?: boolean;
    /**
     * Whether to return detailed validation results instead of a simple boolean.
     * When true, returns a ValidationResult object. Defaults to false.
     */
    detailed?: boolean;
    /**
     * Whether to enable debug mode with structured logging.
     * When true, logs detailed timing and memory usage information.
     * Defaults to false.
     */
    debug?: boolean;
    /** MX cache configuration options */
    cache?: MxCacheOptions;
}
/**
 * Checks if an email address is valid by verifying:
 * 1. The email follows RFC 5322 format
 * 2. (Optional) The domain has valid MX records
 * 3. (Optional) The email is not from a disposable provider
 *
 * @param {string} email - The email address to validate.
 * @param {EmailValidatorOptions | boolean} [options] - Validation options or boolean for backward compatibility.
 * @return {Promise<boolean | ValidationResult>} - Returns boolean by default, or ValidationResult if detailed is true.
 * @throws {EmailValidationError} When timeout is exceeded or invalid timeout value is provided.
 * @example
 * // Simple validation (boolean result)
 * const isValid = await emailValidator('test@example.com');
 *
 * // Detailed validation with error codes
 * const result = await emailValidator('test@example.com', { detailed: true });
 * if (!result.valid) {
 *   console.log('Error code:', result.errorCode);
 * }
 */
declare function emailValidator(email: string, options?: EmailValidatorOptions | boolean): Promise<boolean | ValidationResult>;
export default emailValidator;
export { ErrorCode, EmailValidationError, isEmailValidationError, } from './errors.js';
export type { MxRecord } from './types.js';
export { globalMxCache } from './mx-cache.js';
export type { CacheStatistics, MxCacheOptions } from './mx-cache.js';
