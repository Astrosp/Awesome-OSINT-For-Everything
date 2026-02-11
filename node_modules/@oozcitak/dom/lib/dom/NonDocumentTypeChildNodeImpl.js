"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NonDocumentTypeChildNodeImpl = void 0;
const util_1 = require("../util");
/**
 * Represents a mixin that extends child nodes that can have siblings
 * other than doctypes. This mixin is implemented by {@link Element} and
 * {@link CharacterData}.
 */
class NonDocumentTypeChildNodeImpl {
    /** @inheritdoc */
    get previousElementSibling() {
        /**
         * The previousElementSibling attribute’s getter must return the first
         * preceding sibling that is an element, and null otherwise.
         */
        let node = util_1.Cast.asNode(this)._previousSibling;
        while (node) {
            if (util_1.Guard.isElementNode(node))
                return node;
            else
                node = node._previousSibling;
        }
        return null;
    }
    /** @inheritdoc */
    get nextElementSibling() {
        /**
         * The nextElementSibling attribute’s getter must return the first
         * following sibling that is an element, and null otherwise.
         */
        let node = util_1.Cast.asNode(this)._nextSibling;
        while (node) {
            if (util_1.Guard.isElementNode(node))
                return node;
            else
                node = node._nextSibling;
        }
        return null;
    }
}
exports.NonDocumentTypeChildNodeImpl = NonDocumentTypeChildNodeImpl;
//# sourceMappingURL=NonDocumentTypeChildNodeImpl.js.map