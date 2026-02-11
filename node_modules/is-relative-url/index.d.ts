export interface Options {
	/**
	Allow protocol-relative URLs (e.g., `//example.com`) to be considered relative.

	When set to `false`, protocol-relative URLs are treated as absolute, which can be useful for security purposes when you want to ensure a URL won't redirect to an external domain.

	__Note:__ Protocol-relative URLs are [technically relative](https://datatracker.ietf.org/doc/html/rfc3986#section-4.2) according to [RFC 3986](https://datatracker.ietf.org/doc/html/rfc3986), as they require the current page's protocol to resolve into absolute URLs. However, they can still navigate to external domains, which may be a security concern in certain contexts (e.g., preventing open redirects).

	@default true

	@example
	```
	import isRelativeUrl from 'is-relative-url';

	// Default behavior (allowProtocolRelative: true)
	isRelativeUrl('//example.com');
	//=> true

	// Strict mode (allowProtocolRelative: false)
	isRelativeUrl('//example.com', {allowProtocolRelative: false});
	//=> false
	```
	*/
	readonly allowProtocolRelative?: boolean;
}

/**
Check if a URL is relative.

@param url - The URL to check.

@example
```
import isRelativeUrl from 'is-relative-url';

isRelativeUrl('foo/bar');
//=> true

isRelativeUrl('https://sindresorhus.com/foo/bar');
//=> false

isRelativeUrl('//sindresorhus.com');
//=> true
```
*/
export default function isRelativeUrl(url: string, options?: Options): boolean;
