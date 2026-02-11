export declare const disposableDomains: Set<string>;
/**
 * Checks if an email domain is from a known disposable email provider
 * @param domain - The domain to check
 * @returns true if the domain is disposable, false otherwise
 */
export declare const isDisposableDomain: (domain: string) => boolean;
