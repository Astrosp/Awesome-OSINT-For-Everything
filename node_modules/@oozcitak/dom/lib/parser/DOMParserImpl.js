"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DOMParserImpl = void 0;
const algorithm_1 = require("../algorithm");
const XMLParserImpl_1 = require("./XMLParserImpl");
/**
 * Represents a parser for XML and HTML content.
 *
 * See: https://w3c.github.io/DOM-Parsing/#the-domparser-interface
 */
class DOMParserImpl {
    /** @inheritdoc */
    parseFromString(source, mimeType) {
        if (mimeType === "text/html")
            throw new Error('HTML parser not implemented.');
        try {
            const parser = new XMLParserImpl_1.XMLParserImpl();
            const doc = parser.parse(source);
            doc._contentType = mimeType;
            return doc;
        }
        catch (e) {
            const errorNS = "http://www.mozilla.org/newlayout/xml/parsererror.xml";
            const doc = (0, algorithm_1.create_xmlDocument)();
            const root = doc.createElementNS(errorNS, "parsererror");
            const ele = doc.createElementNS(errorNS, "error");
            ele.setAttribute("message", e.message);
            root.appendChild(ele);
            doc.appendChild(root);
            return doc;
        }
    }
}
exports.DOMParserImpl = DOMParserImpl;
//# sourceMappingURL=DOMParserImpl.js.map