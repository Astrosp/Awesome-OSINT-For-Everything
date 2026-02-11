"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeWalkerImpl = void 0;
const interfaces_1 = require("./interfaces");
const TraverserImpl_1 = require("./TraverserImpl");
const algorithm_1 = require("../algorithm");
/**
 * Represents the nodes of a subtree and a position within them.
 */
class TreeWalkerImpl extends TraverserImpl_1.TraverserImpl {
    _current;
    /**
     * Initializes a new instance of `TreeWalker`.
     */
    constructor(root, current) {
        super(root);
        this._current = current;
    }
    /** @inheritdoc */
    get currentNode() { return this._current; }
    set currentNode(value) { this._current = value; }
    /** @inheritdoc */
    parentNode() {
        /**
         * 1. Let node be the context object’s current.
         * 2. While node is non-null and is not the context object’s root:
         */
        let node = this._current;
        while (node !== null && node !== this._root) {
            /**
             * 2.1. Set node to node’s parent.
             * 2.2. If node is non-null and filtering node within the context object
             * returns FILTER_ACCEPT, then set the context object’s current to node
             * and return node.
             */
            node = node._parent;
            if (node !== null &&
                (0, algorithm_1.traversal_filter)(this, node) === interfaces_1.FilterResult.Accept) {
                this._current = node;
                return node;
            }
        }
        /**
         * 3. Return null.
         */
        return null;
    }
    /** @inheritdoc */
    firstChild() {
        /**
         * The firstChild() method, when invoked, must traverse children with the
         * context object and first.
         */
        return (0, algorithm_1.treeWalker_traverseChildren)(this, true);
    }
    /** @inheritdoc */
    lastChild() {
        /**
         * The lastChild() method, when invoked, must traverse children with the
         * context object and last.
         */
        return (0, algorithm_1.treeWalker_traverseChildren)(this, false);
    }
    /** @inheritdoc */
    nextSibling() {
        /**
         * The nextSibling() method, when invoked, must traverse siblings with the
         * context object and next.
         */
        return (0, algorithm_1.treeWalker_traverseSiblings)(this, true);
    }
    /** @inheritdoc */
    previousNode() {
        /**
         * 1. Let node be the context object’s current.
         * 2. While node is not the context object’s root:
         */
        let node = this._current;
        while (node !== this._root) {
            /**
             * 2.1. Let sibling be node’s previous sibling.
             * 2.2. While sibling is non-null:
             */
            let sibling = node._previousSibling;
            while (sibling) {
                /**
                 * 2.2.1. Set node to sibling.
                 * 2.2.2. Let result be the result of filtering node within the context
                 * object.
                 */
                node = sibling;
                let result = (0, algorithm_1.traversal_filter)(this, node);
                /**
                 * 2.2.3. While result is not FILTER_REJECT and node has a child:
                 */
                while (result !== interfaces_1.FilterResult.Reject && node._lastChild) {
                    /**
                     * 2.2.3.1. Set node to node’s last child.
                     * 2.2.3.2. Set result to the result of filtering node within the
                     * context object.
                     */
                    node = node._lastChild;
                    result = (0, algorithm_1.traversal_filter)(this, node);
                }
                /**
                 * 2.2.4. If result is FILTER_ACCEPT, then set the context object’s
                 * current to node and return node.
                 */
                if (result === interfaces_1.FilterResult.Accept) {
                    this._current = node;
                    return node;
                }
                /**
                 * 2.2.5. Set sibling to node’s previous sibling.
                 */
                sibling = node._previousSibling;
            }
            /**
             * 2.3. If node is the context object’s root or node’s parent is null,
             * then return null.
             */
            if (node === this._root || node._parent === null) {
                return null;
            }
            /**
             * 2.4. Set node to node’s parent.
             */
            node = node._parent;
            /**
             * 2.5. If the return value of filtering node within the context object is
             * FILTER_ACCEPT, then set the context object’s current to node and
             * return node.
             */
            if ((0, algorithm_1.traversal_filter)(this, node) === interfaces_1.FilterResult.Accept) {
                this._current = node;
                return node;
            }
        }
        /**
         * 3. Return null.
         */
        return null;
    }
    /** @inheritdoc */
    previousSibling() {
        /**
         * The previousSibling() method, when invoked, must traverse siblings with
         * the context object and previous.
         */
        return (0, algorithm_1.treeWalker_traverseSiblings)(this, false);
    }
    /** @inheritdoc */
    nextNode() {
        /**
         * 1. Let node be the context object’s current.
         * 2. Let result be FILTER_ACCEPT.
         * 3. While true:
         */
        let node = this._current;
        let result = interfaces_1.FilterResult.Accept;
        while (true) {
            /**
             * 3.1. While result is not FILTER_REJECT and node has a child:
             */
            while (result !== interfaces_1.FilterResult.Reject && node._firstChild) {
                /**
                 * 3.1.1. Set node to its first child.
                 * 3.1.2. Set result to the result of filtering node within the context
                 * object.
                 * 3.1.3. If result is FILTER_ACCEPT, then set the context object’s
                 * current to node and return node.
                 */
                node = node._firstChild;
                result = (0, algorithm_1.traversal_filter)(this, node);
                if (result === interfaces_1.FilterResult.Accept) {
                    this._current = node;
                    return node;
                }
            }
            /**
             * 3.2. Let sibling be null.
             * 3.3. Let temporary be node.
             * 3.4. While temporary is non-null:
             */
            let sibling = null;
            let temporary = node;
            while (temporary !== null) {
                /**
                 * 3.4.1. If temporary is the context object’s root, then return null.
                 */
                if (temporary === this._root) {
                    return null;
                }
                /**
                 * 3.4.2. Set sibling to temporary’s next sibling.
                 * 3.4.3. If sibling is non-null, then break.
                 */
                sibling = temporary._nextSibling;
                if (sibling !== null) {
                    node = sibling;
                    break;
                }
                /**
                 * 3.4.4. Set temporary to temporary’s parent.
                 */
                temporary = temporary._parent;
            }
            /**
             * 3.5. Set result to the result of filtering node within the context object.
             * 3.6. If result is FILTER_ACCEPT, then set the context object’s current
             * to node and return node.
             */
            result = (0, algorithm_1.traversal_filter)(this, node);
            if (result === interfaces_1.FilterResult.Accept) {
                this._current = node;
                return node;
            }
        }
    }
    /**
     * Creates a new `TreeWalker`.
     *
     * @param root - iterator's root node
     * @param current - current node
     */
    static _create(root, current) {
        return new TreeWalkerImpl(root, current);
    }
}
exports.TreeWalkerImpl = TreeWalkerImpl;
//# sourceMappingURL=TreeWalkerImpl.js.map