import isAbsoluteUrl from 'is-absolute-url';

export default function isRelativeUrl(url, options = {}) {
	const {allowProtocolRelative = true} = options;

	// Check if it's a protocol-relative URL (starts with //)
	if (!allowProtocolRelative && typeof url === 'string' && url.startsWith('//')) {
		return false;
	}

	return !isAbsoluteUrl(url);
}
