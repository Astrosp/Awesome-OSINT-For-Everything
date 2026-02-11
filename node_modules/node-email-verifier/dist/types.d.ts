/**
 * Type definitions for node-email-verifier
 */
/**
 * Represents an MX (Mail Exchange) record returned by DNS lookup
 */
export interface MxRecord {
    /** The mail server hostname */
    exchange: string;
    /** The priority of the mail server (lower values have higher priority) */
    priority: number;
}
