"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParentNodeImpl = void 0;
const util_1 = require("../util");
const algorithm_1 = require("../algorithm");
/**
 * Represents a mixin that extends parent nodes that can have children.
 * This mixin is implemented by {@link Element}, {@link Document} and
 * {@link DocumentFragment}.
 */
class ParentNodeImpl {
    /** @inheritdoc */
    get children() {
        /**
         * The children attribute’s getter must return an HTMLCollection collection
         * rooted at context object matching only element children.
         */
        return (0, algorithm_1.create_htmlCollection)(util_1.Cast.asNode(this));
    }
    /** @inheritdoc */
    get firstElementChild() {
        /**
         * The firstElementChild attribute’s getter must return the first child
         * that is an element, and null otherwise.
         */
        let node = util_1.Cast.asNode(this)._firstChild;
        while (node) {
            if (util_1.Guard.isElementNode(node))
                return node;
            else
                node = node._nextSibling;
        }
        return null;
    }
    /** @inheritdoc */
    get lastElementChild() {
        /**
         * The lastElementChild attribute’s getter must return the last child that
         * is an element, and null otherwise.
         */
        let node = util_1.Cast.asNode(this)._lastChild;
        while (node) {
            if (util_1.Guard.isElementNode(node))
                return node;
            else
                node = node._previousSibling;
        }
        return null;
    }
    /** @inheritdoc */
    get childElementCount() {
        /**
         * The childElementCount attribute’s getter must return the number of
         * children of context object that are elements.
         */
        let count = 0;
        for (const childNode of util_1.Cast.asNode(this)._children) {
            if (util_1.Guard.isElementNode(childNode))
                count++;
        }
        return count;
    }
    /** @inheritdoc */
    prepend(...nodes) {
        /**
         * 1. Let node be the result of converting nodes into a node given nodes
         * and context object’s node document.
         * 2. Pre-insert node into context object before the context object’s first
         * child.
         */
        const node = util_1.Cast.asNode(this);
        const childNode = (0, algorithm_1.parentNode_convertNodesIntoANode)(nodes, node._nodeDocument);
        (0, algorithm_1.mutation_preInsert)(childNode, node, node._firstChild);
    }
    /** @inheritdoc */
    append(...nodes) {
        /**
         * 1. Let node be the result of converting nodes into a node given nodes
         * and context object’s node document.
         * 2. Append node to context object.
         */
        const node = util_1.Cast.asNode(this);
        const childNode = (0, algorithm_1.parentNode_convertNodesIntoANode)(nodes, node._nodeDocument);
        (0, algorithm_1.mutation_append)(childNode, node);
    }
    /** @inheritdoc */
    querySelector(selectors) {
        /**
         * The querySelector(selectors) method, when invoked, must return the first
         * result of running scope-match a selectors string selectors against
         * context object, if the result is not an empty list, and null otherwise.
         */
        const node = util_1.Cast.asNode(this);
        const result = (0, algorithm_1.selectors_scopeMatchASelectorsString)(selectors, node);
        return (result.length === 0 ? null : result[0]);
    }
    /** @inheritdoc */
    querySelectorAll(selectors) {
        /**
         * The querySelectorAll(selectors) method, when invoked, must return the
         * static result of running scope-match a selectors string selectors against
         * context object.
         */
        const node = util_1.Cast.asNode(this);
        const result = (0, algorithm_1.selectors_scopeMatchASelectorsString)(selectors, node);
        return (0, algorithm_1.create_nodeListStatic)(node, result);
    }
}
exports.ParentNodeImpl = ParentNodeImpl;
//# sourceMappingURL=ParentNodeImpl.js.map