import dns from 'node:dns';
import util from 'node:util';
import ms from 'ms';
import { setTimeout } from 'timers/promises';
import validator from 'validator';
import { isDisposableDomain } from './disposable-domains.js';
import { ErrorCode, ErrorMessages, EmailValidationError } from './errors.js';
import { createDebugLogger } from './debug-logger.js';
import { globalMxCache, } from './mx-cache.js';
// Convert the callback-based dns.resolveMx function into a promise-based one
const resolveMx = util.promisify(dns.resolveMx);
/**
 * Validates an email address against the RFC 5322 standard.
 *
 * @param {string | unknown} email - The email address to validate.
 * @return {{ valid: boolean, reason?: string }} - Validation result with optional reason.
 */
const validateRfc5322 = (email) => {
    if (typeof email !== 'string') {
        return {
            valid: false,
            reason: ErrorMessages[ErrorCode.EMAIL_MUST_BE_STRING],
            errorCode: ErrorCode.EMAIL_MUST_BE_STRING,
        };
    }
    if (!email) {
        return {
            valid: false,
            reason: ErrorMessages[ErrorCode.EMAIL_CANNOT_BE_EMPTY],
            errorCode: ErrorCode.EMAIL_CANNOT_BE_EMPTY,
        };
    }
    if (!validator.isEmail(email)) {
        return {
            valid: false,
            reason: ErrorMessages[ErrorCode.INVALID_EMAIL_FORMAT],
            errorCode: ErrorCode.INVALID_EMAIL_FORMAT,
        };
    }
    return { valid: true };
};
/**
 * Determines if an error is a DNS lookup failure or MX lookup failure.
 * DNS failures: connection/resolution issues (ENOTFOUND, ECONNREFUSED, etc.)
 * MX failures: network unreachable (ENETUNREACH) or other errors
 */
const classifyDnsError = (error) => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorCode = error?.code;
    // Check for specific DNS error codes
    // We check both errorCode and errorMessage because:
    // 1. errorCode is more reliable when available (e.g., system errors)
    // 2. errorMessage fallback handles cases where code is missing or custom errors
    const isDnsError = 
    // Check error codes first (most reliable)
    errorCode === 'ENOTFOUND' ||
        errorCode === 'ENODATA' ||
        errorCode === 'ECONNREFUSED' ||
        errorCode === 'ETIMEDOUT' ||
        // Fallback to message checking for compatibility
        errorMessage.includes('ENOTFOUND') ||
        errorMessage.includes('ENODATA') ||
        errorMessage.includes('ECONNREFUSED') ||
        errorMessage.includes('ETIMEDOUT') ||
        errorMessage.includes('getaddrinfo') ||
        errorMessage.includes('DNS lookup failed');
    // ENETUNREACH should be treated as MX lookup failure, not DNS failure
    const isNetworkError = errorCode === 'ENETUNREACH' || errorMessage.includes('ENETUNREACH');
    // If it's a mock error message that specifically says "DNS lookup failed", treat it as DNS error
    const isMockDnsError = errorMessage === 'DNS lookup failed';
    return {
        isDnsLookupFailure: (isDnsError || isMockDnsError) && !isNetworkError,
    };
};
/**
 * Checks if the domain has valid MX records.
 *
 * @param {string} domain - The domain to check.
 * @param {InternalEmailValidatorOptions} options - Validation options.
 * @return {Promise<{ mxRecords: any[], valid: boolean, reason?: string }>} - MX record validation result.
 */
const checkMxRecords = async (domain, options) => {
    // Check cache first if caching is enabled
    if (options.isCachingEnabled) {
        const cachedRecords = globalMxCache.get(domain);
        if (cachedRecords !== null) {
            return {
                mxRecords: cachedRecords,
                valid: cachedRecords.length > 0,
                cached: true,
                ...(cachedRecords.length === 0 && {
                    reason: ErrorMessages[ErrorCode.NO_MX_RECORDS],
                    errorCode: ErrorCode.NO_MX_RECORDS,
                }),
            };
        }
    }
    try {
        const _resolveMx = options._resolveMx || resolveMx;
        const mxRecords = await _resolveMx(domain);
        // Cache the result if caching is enabled
        if (options.isCachingEnabled && options.cache) {
            globalMxCache.set(domain, mxRecords || [], options.cache.defaultTtl);
        }
        if (mxRecords && mxRecords.length > 0) {
            return { mxRecords, valid: true, cached: false };
        }
        else {
            return {
                mxRecords: [],
                valid: false,
                reason: ErrorMessages[ErrorCode.NO_MX_RECORDS],
                errorCode: ErrorCode.NO_MX_RECORDS,
                cached: false,
            };
        }
    }
    catch (error) {
        const { isDnsLookupFailure } = classifyDnsError(error);
        return {
            mxRecords: [],
            valid: false,
            reason: isDnsLookupFailure
                ? ErrorMessages[ErrorCode.DNS_LOOKUP_FAILED]
                : ErrorMessages[ErrorCode.MX_LOOKUP_FAILED],
            errorCode: isDnsLookupFailure
                ? ErrorCode.DNS_LOOKUP_FAILED
                : ErrorCode.MX_LOOKUP_FAILED,
            cached: false,
        };
    }
};
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
async function emailValidator(email, options) {
    // Handle backward compatibility: convert boolean to options object
    let opts;
    if (typeof options === 'boolean') {
        opts = { checkMx: options };
    }
    else {
        opts = options || {};
    }
    // Default values
    const checkMx = opts.checkMx !== false; // default true
    const checkDisposable = opts.checkDisposable === true; // default false
    const detailed = opts.detailed === true; // default false
    const debug = opts.debug === true; // default false
    const timeout = opts.timeout !== undefined ? opts.timeout : '10s';
    // Merge default cache options with user-provided values for consistency
    const cacheOptions = mergeCacheOptions(opts.cache);
    const isCachingEnabled = cacheOptions.enabled;
    // Create debug logger
    const logger = createDebugLogger(debug, email);
    // Log validation start
    const endValidation = logger.startPhase('validation_start', {
        checkMx,
        checkDisposable,
        detailed,
        timeout,
    });
    // Convert timeout to milliseconds
    // Initialize to NaN as a sentinel value - this will always be reassigned with a valid timeout
    // or the function will throw via handleInvalidTimeout() before timeoutMs is ever used
    let timeoutMs = NaN;
    // Helper function to handle invalid timeout
    const handleInvalidTimeout = () => {
        const error = new EmailValidationError(ErrorCode.INVALID_TIMEOUT_VALUE, `Invalid timeout value: ${timeout}`);
        logger.logError('timeout_validation', error);
        endValidation();
        throw error;
    };
    if (typeof timeout === 'number') {
        if (timeout <= 0 || !Number.isFinite(timeout)) {
            handleInvalidTimeout();
        }
        timeoutMs = timeout;
    }
    else {
        try {
            // ms() throws an error for invalid string formats (e.g., 'abc', empty string)
            const parsed = ms(timeout);
            if (parsed === undefined || parsed <= 0) {
                handleInvalidTimeout();
            }
            timeoutMs = parsed;
        }
        catch {
            // Catch ms() parsing errors and treat as invalid timeout
            handleInvalidTimeout();
        }
    }
    // Validate RFC 5322 format
    const endFormatCheck = logger.startPhase('format_validation');
    const formatResult = validateRfc5322(email);
    endFormatCheck();
    if (!formatResult.valid) {
        logger.log({
            phase: 'format_validation_failed',
            data: { reason: formatResult.reason, errorCode: formatResult.errorCode },
        });
        endValidation();
        if (detailed) {
            return {
                valid: false,
                email: String(email),
                format: formatResult,
                errorCode: formatResult.errorCode,
            };
        }
        return false;
    }
    // Extract domain from email
    const domain = email.split('@')[1];
    // Check if disposable (if enabled)
    let disposableResult;
    if (checkDisposable) {
        const endDisposableCheck = logger.startPhase('disposable_check', {
            domain,
        });
        const isDisposable = isDisposableDomain(domain);
        endDisposableCheck();
        if (isDisposable) {
            logger.log({
                phase: 'disposable_email_detected',
                data: { domain, provider: domain },
            });
            disposableResult = {
                valid: false,
                provider: domain,
                reason: ErrorMessages[ErrorCode.DISPOSABLE_EMAIL],
                errorCode: ErrorCode.DISPOSABLE_EMAIL,
            };
            if (!detailed) {
                endValidation();
                return false;
            }
        }
        else {
            disposableResult = { valid: true, provider: null };
        }
    }
    // Check MX records (if enabled)
    let mxResult;
    if (checkMx) {
        // Skip MX check for disposable emails that already failed
        if (checkDisposable && disposableResult && !disposableResult.valid) {
            mxResult = {
                valid: false,
                records: [],
                reason: ErrorMessages[ErrorCode.MX_SKIPPED_DISPOSABLE],
                errorCode: ErrorCode.MX_SKIPPED_DISPOSABLE,
            };
        }
        else {
            const endMxCheck = logger.startPhase('mx_record_check', {
                domain,
                timeoutMs,
            });
            try {
                // Create a race between the MX check and timeout with proper cleanup
                const abortController = new AbortController();
                // Pass merged cache options to checkMxRecords to ensure global cache
                // is updated with DNS results according to user configuration
                const mxCheckPromise = checkMxRecords(domain, {
                    ...opts,
                    cache: cacheOptions,
                    isCachingEnabled,
                });
                const timeoutPromise = setTimeout(timeoutMs, undefined, {
                    signal: abortController.signal,
                }).then(() => {
                    throw new EmailValidationError(ErrorCode.DNS_LOOKUP_TIMEOUT);
                });
                const result = await Promise.race([mxCheckPromise, timeoutPromise]);
                // Cancel the timeout to prevent hanging handles
                abortController.abort();
                endMxCheck();
                logger.log({
                    phase: 'mx_records_found',
                    data: {
                        valid: result.valid,
                        recordCount: result.mxRecords?.length || 0,
                        records: result.mxRecords,
                    },
                });
                mxResult = {
                    valid: result.valid,
                    records: result.mxRecords,
                    ...(result.cached !== undefined && { cached: result.cached }),
                    ...(result.reason && {
                        reason: result.reason,
                        errorCode: result.errorCode,
                    }),
                };
                if (!result.valid) {
                    logger.log({
                        phase: 'mx_validation_failed',
                        data: { reason: result.reason, errorCode: result.errorCode },
                    });
                    endValidation();
                    if (detailed) {
                        return {
                            valid: false,
                            email,
                            format: { valid: true },
                            mx: mxResult,
                            ...(checkDisposable && { disposable: disposableResult }),
                            errorCode: result.errorCode,
                        };
                    }
                    return false;
                }
            }
            catch (error) {
                // End the MX check phase before handling the error
                endMxCheck();
                logger.logError('mx_record_check', error);
                // Always ensure cleanup happens before returning or re-throwing
                if (error instanceof EmailValidationError) {
                    endValidation();
                    throw error; // Re-throw timeout errors
                }
                // Handle other errors
                const errorResult = {
                    valid: false,
                    records: [],
                    reason: ErrorMessages[ErrorCode.MX_LOOKUP_FAILED],
                    errorCode: ErrorCode.MX_LOOKUP_FAILED,
                };
                endValidation();
                if (detailed) {
                    return {
                        valid: false,
                        email,
                        format: { valid: true },
                        mx: errorResult,
                        ...(checkDisposable && { disposable: disposableResult }),
                        errorCode: ErrorCode.MX_LOOKUP_FAILED,
                    };
                }
                return false;
            }
        }
    }
    // If we get here, build the final result
    const hasFailure = (checkDisposable && disposableResult && !disposableResult.valid) ||
        (checkMx && mxResult && !mxResult.valid);
    let finalResult;
    if (detailed) {
        const result = {
            valid: !hasFailure,
            email,
            format: { valid: true },
        };
        if (checkMx && mxResult) {
            result.mx = mxResult;
        }
        if (checkDisposable && disposableResult) {
            result.disposable = disposableResult;
        }
        // Add cache statistics if cache is enabled
        if (isCachingEnabled) {
            result.cacheStats = globalMxCache.getStatistics();
        }
        // Set top-level error code to the first failure
        if (hasFailure) {
            if (checkDisposable && disposableResult && !disposableResult.valid) {
                result.errorCode = ErrorCode.DISPOSABLE_EMAIL;
            }
            else if (checkMx && mxResult && !mxResult.valid) {
                result.errorCode = mxResult.errorCode;
            }
        }
        finalResult = result;
    }
    else {
        finalResult = !hasFailure;
    }
    // Determine errorCode for logging if applicable
    const logErrorCode = hasFailure && detailed
        ? finalResult.errorCode
        : undefined;
    // Log validation complete with appropriate data
    logger.log({
        phase: 'validation_complete',
        data: {
            valid: !hasFailure,
            ...(logErrorCode && { errorCode: logErrorCode }),
        },
    });
    endValidation();
    return finalResult;
}
/**
 * Merges default cache options with user-provided options.
 * @param userOptions - User-provided cache options (optional)
 * @returns Merged cache options with defaults
 */
function mergeCacheOptions(userOptions) {
    // Define default cache configuration values
    const defaultCacheOptions = {
        enabled: true, // Enable caching by default
        defaultTtl: 300000, // 5 minutes default TTL
        maxSize: 1000, // Maximum 1000 entries
        cleanupEnabled: true, // Enable periodic cleanup
        cleanupProbability: 0.1, // 10% chance of cleanup per operation
    };
    // Validate user options to prevent misconfiguration
    if (userOptions) {
        if (userOptions.defaultTtl !== undefined) {
            if (typeof userOptions.defaultTtl !== 'number' ||
                isNaN(userOptions.defaultTtl)) {
                throw new Error('Cache defaultTtl must be a valid number');
            }
            if (userOptions.defaultTtl <= 0) {
                throw new Error('Cache defaultTtl must be positive');
            }
        }
        if (userOptions.cleanupProbability !== undefined) {
            if (typeof userOptions.cleanupProbability !== 'number' ||
                isNaN(userOptions.cleanupProbability)) {
                throw new Error('Cache cleanupProbability must be a valid number');
            }
            if (userOptions.cleanupProbability < 0 ||
                userOptions.cleanupProbability > 1) {
                throw new Error('Cache cleanupProbability must be between 0 and 1');
            }
        }
        if (userOptions.maxSize !== undefined) {
            if (typeof userOptions.maxSize !== 'number' ||
                isNaN(userOptions.maxSize)) {
                throw new Error('Cache maxSize must be a valid number');
            }
            if (userOptions.maxSize <= 0) {
                throw new Error('Cache maxSize must be positive');
            }
        }
    }
    // Merge user options with defaults, user options take precedence
    return { ...defaultCacheOptions, ...userOptions };
}
export default emailValidator;
// Re-export error types and utilities for public API
export { ErrorCode, EmailValidationError, isEmailValidationError, } from './errors.js';
// Re-export cache utilities
export { globalMxCache } from './mx-cache.js';
