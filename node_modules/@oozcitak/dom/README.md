# DOM
A Javascript implementation of the [DOM Living Standard](https://dom.spec.whatwg.org/).

[![License](http://img.shields.io/npm/l/@oozcitak/dom.svg?style=flat-square)](http://opensource.org/licenses/MIT)
[![NPM Version](https://img.shields.io/npm/v/@oozcitak/dom?logo=npm&style=flat-square)](https://www.npmjs.com/package/@oozcitak/dom)

[![Node.js CI](https://github.com/oozcitak/dom/workflows/build/badge.svg)](https://github.com/oozcitak/dom/actions)
[![Code Coverage](https://codecov.io/gh/oozcitak/dom/branch/master/graph/badge.svg)](https://codecov.io/gh/oozcitak/dom)

# Version
Current version implements the standard as of commit [57512fa](https://dom.spec.whatwg.org/commit-snapshots/57512fac17cf2f1c4c85be4aec178c8086ee5ee4/) (Last Updated 24 September 2019).

This DOM implementation is for _XML documents only_.

# Installation
```
npm install @oozcitak/dom
```

# Usage
Create an instance of the [`DOMImplementation`](https://dom.spec.whatwg.org/#interface-domimplementation) class to construct the DOM tree.

```js
const { DOMImplementation } = require("@oozcitak/dom");

const dom = new DOMImplementation();
const doc = dom.createDocument('ns', 'root');
```

The module also exports [`DOMParser`](https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#domparser) and [`XMLSerializer`](https://w3c.github.io/DOM-Parsing/#the-xmlserializer-interface) classes as in the browser.
