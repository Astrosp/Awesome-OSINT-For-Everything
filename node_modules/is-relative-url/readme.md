# is-relative-url

> Check if a URL is relative

## Install

```sh
npm install is-relative-url
```

## Usage

```js
import isRelativeUrl from 'is-relative-url';

isRelativeUrl('foo/bar');
//=> true

isRelativeUrl('https://sindresorhus.com/foo/bar');
//=> false

isRelativeUrl('//sindresorhus.com');
//=> true
```

## API

### isRelativeUrl(url, options?)

#### url

Type: `string`

The URL to check.

#### options

Type: `object`

##### allowProtocolRelative

Type: `boolean`\
Default: `true`

Allow [protocol-relative URLs](https://en.wikipedia.org/wiki/URL#Protocol-relative_URLs) (e.g., `//example.com`) to be considered relative.

Setting this to `false` will treat protocol-relative URLs as absolute, which can be useful for security purposes when you want to ensure a URL won't redirect to an external domain.

> [!NOTE]
> Protocol-relative URLs are [technically relative](https://datatracker.ietf.org/doc/html/rfc3986#section-4.2) according to [RFC 3986](https://datatracker.ietf.org/doc/html/rfc3986), as they require the current page's protocol to resolve into absolute URLs. However, they can still navigate to external domains, which may be a security concern in certain contexts (e.g., preventing open redirects).

## Related

See [is-absolute-url](https://github.com/sindresorhus/is-absolute-url) for the inverse.
