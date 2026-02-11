/**
 * Debug logger module for AI-assisted debugging and observability.
 * Provides structured JSON logging with timing and memory usage information.
 */
export declare const DEBUG_LOG_TYPE = "email-validator-debug";
export interface DebugLogEntry {
    timestamp: string;
    phase: string;
    email?: string;
    data?: Record<string, unknown>;
    timing?: {
        start: number;
        end?: number;
        duration?: number;
    };
    memory?: {
        heapUsed: number;
        heapTotal: number;
        rss: number;
        external: number;
    };
    error?: {
        code?: string;
        message: string;
        stack?: string;
    };
}
/**
 * Interface for structured debug logging throughout email validation.
 * Provides methods to track validation phases with timing and memory metrics.
 */
export interface DebugLogger {
    /**
     * Logs a debug entry with optional partial data.
     * Core fields (timestamp, phase, email) are automatically added.
     * @param entry - Partial debug log entry to be merged with defaults
     */
    log(entry: Partial<DebugLogEntry>): void;
    /**
     * Starts a new validation phase and returns a function to end it.
     * Automatically logs phase start with timing and memory snapshot.
     * @param phase - Name of the validation phase (e.g., 'format_validation')
     * @param data - Optional additional data to log with the phase
     * @returns Function to call when the phase completes
     */
    startPhase(phase: string, data?: Record<string, unknown>): () => void;
    /**
     * Logs an error that occurred during a validation phase.
     * @param phase - Name of the phase where the error occurred
     * @param error - The error object to log
     */
    logError(phase: string, error: Error): void;
}
/**
 * Creates a debug logger instance for structured logging.
 * @param enabled Whether debug logging is enabled
 * @param email The email being validated (optional)
 * @returns A debug logger instance
 */
export declare function createDebugLogger(enabled: boolean, email?: string): DebugLogger;
