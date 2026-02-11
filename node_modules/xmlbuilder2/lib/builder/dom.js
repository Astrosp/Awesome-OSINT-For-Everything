"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDocument = createDocument;
exports.sanitizeInput = sanitizeInput;
const dom_1 = require("@oozcitak/dom");
const dom_2 = require("@oozcitak/dom/lib/dom");
const util_1 = require("@oozcitak/util");
dom_2.dom.setFeatures(false);
/**
 * Creates an XML document without any child nodes.
 */
function createDocument() {
    const impl = new dom_1.DOMImplementation();
    const doc = impl.createDocument(null, 'root', null);
    /* istanbul ignore else */
    if (doc.documentElement) {
        doc.removeChild(doc.documentElement);
    }
    return doc;
}
/**
 * Sanitizes input strings with user supplied replacement characters.
 *
 * @param str - input string
 * @param replacement - replacement character or function
 */
function sanitizeInput(str, replacement) {
    if (str == null) {
        return str;
    }
    else if (replacement === undefined) {
        return str + "";
    }
    else {
        let result = "";
        str = str + "";
        for (let i = 0; i < str.length; i++) {
            let n = str.charCodeAt(i);
            // #x9 | #xA | #xD | [#x20-#xD7FF] | [#xE000-#xFFFD] | [#x10000-#x10FFFF]
            if (n === 0x9 || n === 0xA || n === 0xD ||
                (n >= 0x20 && n <= 0xD7FF) ||
                (n >= 0xE000 && n <= 0xFFFD)) {
                // valid character - not surrogate pair
                result += str.charAt(i);
            }
            else if (n >= 0xD800 && n <= 0xDBFF && i < str.length - 1) {
                const n2 = str.charCodeAt(i + 1);
                if (n2 >= 0xDC00 && n2 <= 0xDFFF) {
                    // valid surrogate pair
                    n = (n - 0xD800) * 0x400 + n2 - 0xDC00 + 0x10000;
                    result += String.fromCodePoint(n);
                    i++;
                }
                else {
                    // invalid lone surrogate
                    result += (0, util_1.isString)(replacement) ? replacement : replacement(str.charAt(i), i, str);
                }
            }
            else {
                // invalid character
                result += (0, util_1.isString)(replacement) ? replacement : replacement(str.charAt(i), i, str);
            }
        }
        return result;
    }
}
//# sourceMappingURL=dom.js.map