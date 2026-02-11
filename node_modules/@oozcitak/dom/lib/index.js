"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XMLSerializer = exports.DOMParser = exports.DOMImplementation = void 0;
const dom_1 = require("./dom");
dom_1.dom.setFeatures(true);
var dom_2 = require("./dom");
Object.defineProperty(exports, "DOMImplementation", { enumerable: true, get: function () { return dom_2.DOMImplementation; } });
var parser_1 = require("./parser");
Object.defineProperty(exports, "DOMParser", { enumerable: true, get: function () { return parser_1.DOMParser; } });
var serializer_1 = require("./serializer");
Object.defineProperty(exports, "XMLSerializer", { enumerable: true, get: function () { return serializer_1.XMLSerializer; } });
//# sourceMappingURL=index.js.map