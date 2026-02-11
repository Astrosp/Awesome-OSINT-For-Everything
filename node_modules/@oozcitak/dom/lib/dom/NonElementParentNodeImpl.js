"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NonElementParentNodeImpl = void 0;
const util_1 = require("../util");
const algorithm_1 = require("../algorithm");
/**
 * Represents a mixin that extends non-element parent nodes. This mixin
 * is implemented by {@link Document} and {@link DocumentFragment}.
 */
class NonElementParentNodeImpl {
    /** @inheritdoc */
    getElementById(id) {
        /**
         * The getElementById(elementId) method, when invoked, must return the first
         * element, in tree order, within the context object’s descendants,
         * whose ID is elementId, and null if there is no such element otherwise.
         */
        let ele = (0, algorithm_1.tree_getFirstDescendantNode)(util_1.Cast.asNode(this), false, false, (e) => util_1.Guard.isElementNode(e));
        while (ele !== null) {
            if (ele._uniqueIdentifier === id) {
                return ele;
            }
            ele = (0, algorithm_1.tree_getNextDescendantNode)(util_1.Cast.asNode(this), ele, false, false, (e) => util_1.Guard.isElementNode(e));
        }
        return null;
    }
}
exports.NonElementParentNodeImpl = NonElementParentNodeImpl;
//# sourceMappingURL=NonElementParentNodeImpl.js.map