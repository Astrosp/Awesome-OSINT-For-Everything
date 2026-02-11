/**
 * Error codes for email validation failures
 */
export var ErrorCode;
(function (ErrorCode) {
    // Format validation errors
    ErrorCode["EMAIL_MUST_BE_STRING"] = "EMAIL_MUST_BE_STRING";
    ErrorCode["EMAIL_CANNOT_BE_EMPTY"] = "EMAIL_CANNOT_BE_EMPTY";
    ErrorCode["INVALID_EMAIL_FORMAT"] = "INVALID_EMAIL_FORMAT";
    // MX record validation errors
    ErrorCode["NO_MX_RECORDS"] = "NO_MX_RECORDS";
    ErrorCode["DNS_LOOKUP_FAILED"] = "DNS_LOOKUP_FAILED";
    ErrorCode["DNS_LOOKUP_TIMEOUT"] = "DNS_LOOKUP_TIMEOUT";
    ErrorCode["MX_SKIPPED_DISPOSABLE"] = "MX_SKIPPED_DISPOSABLE";
    ErrorCode["MX_LOOKUP_FAILED"] = "MX_LOOKUP_FAILED";
    // Disposable email errors
    ErrorCode["DISPOSABLE_EMAIL"] = "DISPOSABLE_EMAIL";
    // Timeout configuration errors
    ErrorCode["INVALID_TIMEOUT_VALUE"] = "INVALID_TIMEOUT_VALUE";
    // Generic errors
    ErrorCode["UNKNOWN_ERROR"] = "UNKNOWN_ERROR";
})(ErrorCode || (ErrorCode = {}));
/**
 * Error messages mapping for consistent error messages
 */
export const ErrorMessages = {
    [ErrorCode.EMAIL_MUST_BE_STRING]: 'Email must be a string',
    [ErrorCode.EMAIL_CANNOT_BE_EMPTY]: 'Email cannot be empty',
    [ErrorCode.INVALID_EMAIL_FORMAT]: 'Invalid email format',
    [ErrorCode.NO_MX_RECORDS]: 'No MX records found',
    [ErrorCode.DNS_LOOKUP_FAILED]: 'DNS lookup failed',
    [ErrorCode.DNS_LOOKUP_TIMEOUT]: 'DNS lookup timed out',
    [ErrorCode.MX_SKIPPED_DISPOSABLE]: 'Skipped due to disposable email',
    [ErrorCode.MX_LOOKUP_FAILED]: 'MX lookup failed',
    [ErrorCode.DISPOSABLE_EMAIL]: 'Email from disposable provider',
    [ErrorCode.INVALID_TIMEOUT_VALUE]: 'Invalid timeout value',
    [ErrorCode.UNKNOWN_ERROR]: 'Unknown error',
};
/**
 * Custom error class for email validation errors
 */
export class EmailValidationError extends Error {
    constructor(code, message, originalError) {
        super(message || ErrorMessages[code]);
        this.name = 'EmailValidationError';
        this.code = code;
        this.originalError = originalError;
        // Maintains proper stack trace for where our error was thrown
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, EmailValidationError);
        }
    }
}
/**
 * Helper function to create validation errors with consistent formatting
 * @param code - The error code
 * @param details - Optional additional details to append to the error message
 * @param originalError - Optional original error that caused this error
 * @returns EmailValidationError instance
 */
export function createValidationError(code, details, originalError) {
    const baseMessage = ErrorMessages[code];
    const message = details ? `${baseMessage}: ${details}` : baseMessage;
    return new EmailValidationError(code, message, originalError);
}
/**
 * Type guard to check if an error is an EmailValidationError
 * @param error - The error to check
 * @returns true if the error is an EmailValidationError
 */
export function isEmailValidationError(error) {
    return error instanceof EmailValidationError;
}
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
export function extractErrorCode(error) {
    if (isEmailValidationError(error)) {
        return error.code;
    }
    if (error instanceof Error) {
        // Map common error messages to error codes (fallback for external errors)
        // NOTE: This relies on string matching and may misclassify edge cases
        const message = error.message.toLowerCase();
        // Check more specific patterns first to avoid misclassification
        if (message.includes('invalid timeout value')) {
            return ErrorCode.INVALID_TIMEOUT_VALUE;
        }
        if (message.includes('mx lookup failed')) {
            return ErrorCode.MX_LOOKUP_FAILED;
        }
        if (message.includes('dns lookup failed') ||
            message.includes('enotfound') ||
            message.includes('enodata')) {
            return ErrorCode.DNS_LOOKUP_FAILED;
        }
        if (message.includes('timed out') || message.includes('timeout')) {
            return ErrorCode.DNS_LOOKUP_TIMEOUT;
        }
    }
    return ErrorCode.UNKNOWN_ERROR;
}
