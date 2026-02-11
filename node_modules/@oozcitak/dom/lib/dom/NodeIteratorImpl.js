"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeIteratorImpl = void 0;
const TraverserImpl_1 = require("./TraverserImpl");
const algorithm_1 = require("../algorithm");
/**
 * Represents an object which can be used to iterate through the nodes
 * of a subtree.
 */
class NodeIteratorImpl extends TraverserImpl_1.TraverserImpl {
    _iteratorCollection;
    _reference;
    _pointerBeforeReference;
    /**
     * Initializes a new instance of `NodeIterator`.
     */
    constructor(root, reference, pointerBeforeReference) {
        super(root);
        this._iteratorCollection = undefined;
        this._reference = reference;
        this._pointerBeforeReference = pointerBeforeReference;
        (0, algorithm_1.nodeIterator_iteratorList)().add(this);
    }
    /** @inheritdoc */
    get referenceNode() { return this._reference; }
    /** @inheritdoc */
    get pointerBeforeReferenceNode() { return this._pointerBeforeReference; }
    /** @inheritdoc */
    nextNode() {
        /**
         * The nextNode() method, when invoked, must return the result of
         * traversing with the context object and next.
         */
        return (0, algorithm_1.nodeIterator_traverse)(this, true);
    }
    /** @inheritdoc */
    previousNode() {
        /**
         * The previousNode() method, when invoked, must return the result of
         * traversing with the context object and previous.
         */
        return (0, algorithm_1.nodeIterator_traverse)(this, false);
    }
    /** @inheritdoc */
    detach() {
        /**
         * The detach() method, when invoked, must do nothing.
         *
         * since JS lacks weak references, we still use detach
         */
        (0, algorithm_1.nodeIterator_iteratorList)().delete(this);
    }
    /**
     * Creates a new `NodeIterator`.
     *
     * @param root - iterator's root node
     * @param reference - reference node
     * @param pointerBeforeReference - whether the iterator is before or after the
     * reference node
     */
    static _create(root, reference, pointerBeforeReference) {
        return new NodeIteratorImpl(root, reference, pointerBeforeReference);
    }
}
exports.NodeIteratorImpl = NodeIteratorImpl;
//# sourceMappingURL=NodeIteratorImpl.js.map