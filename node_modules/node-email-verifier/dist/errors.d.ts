/**
 * Error codes for email validation failures
 */
export declare enum ErrorCode {
    EMAIL_MUST_BE_STRING = "EMAIL_MUST_BE_STRING",
    EMAIL_CANNOT_BE_EMPTY = "EMAIL_CANNOT_BE_EMPTY",
    INVALID_EMAIL_FORMAT = "INVALID_EMAIL_FORMAT",
    NO_MX_RECORDS = "NO_MX_RECORDS",
    DNS_LOOKUP_FAILED = "DNS_LOOKUP_FAILED",
    DNS_LOOKUP_TIMEOUT = "DNS_LOOKUP_TIMEOUT",
    MX_SKIPPED_DISPOSABLE = "MX_SKIPPED_DISPOSABLE",
    MX_LOOKUP_FAILED = "MX_LOOKUP_FAILED",
    DISPOSABLE_EMAIL = "DISPOSABLE_EMAIL",
    INVALID_TIMEOUT_VALUE = "INVALID_TIMEOUT_VALUE",
    UNKNOWN_ERROR = "UNKNOWN_ERROR"
}
/**
 * Error messages mapping for consistent error messages
 */
export declare const ErrorMessages: Record<ErrorCode, string>;
/**
 * Custom error class for email validation errors
 */
export declare class EmailValidationError extends Error {
    readonly code: ErrorCode;
    readonly originalError?: Error;
    constructor(code: ErrorCode, message?: string, originalError?: Error);
}
/**
 * Helper function to create validation errors with consistent formatting
 * @param code - The error code
 * @param details - Optional additional details to append to the error message
 * @param originalError - Optional original error that caused this error
 * @returns EmailValidationError instance
 */
export declare function createValidationError(code: ErrorCode, details?: string, originalError?: Error): EmailValidationError;
/**
 * Type guard to check if an error is an EmailValidationError
 * @param error - The error to check
 * @returns true if the error is an EmailValidationError
 */
export declare function isEmailValidationError(error: unknown): error is EmailValidationError;
/**
 * Extract error code from various error types
 *
 * NOTE: For more reliable error handling, prefer using createValidationError()
 * to create EmailValidationError instances with deterministic error codes.
 * This function uses string matching as a fallback for external errors.
 *
 * @param error - The error to extract code from
 * @returns The error code
 */
export declare function extractErrorCode(error: unknown): ErrorCode;
