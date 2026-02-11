"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentFragmentImpl = void 0;
const interfaces_1 = require("./interfaces");
const NodeImpl_1 = require("./NodeImpl");
const WebIDLAlgorithm_1 = require("../algorithm/WebIDLAlgorithm");
/**
 * Represents a document fragment in the XML tree.
 */
class DocumentFragmentImpl extends NodeImpl_1.NodeImpl {
    _nodeType = interfaces_1.NodeType.DocumentFragment;
    _children = new Set();
    _host;
    /**
     * Initializes a new instance of `DocumentFragment`.
     *
     * @param host - shadow root's host element
     */
    constructor(host = null) {
        super();
        this._host = host;
    }
    // MIXIN: NonElementParentNode
    /* istanbul ignore next */
    getElementById(elementId) { throw new Error("Mixin: NonElementParentNode not implemented."); }
    // MIXIN: ParentNode
    /* istanbul ignore next */
    get children() { throw new Error("Mixin: ParentNode not implemented."); }
    /* istanbul ignore next */
    get firstElementChild() { throw new Error("Mixin: ParentNode not implemented."); }
    /* istanbul ignore next */
    get lastElementChild() { throw new Error("Mixin: ParentNode not implemented."); }
    /* istanbul ignore next */
    get childElementCount() { throw new Error("Mixin: ParentNode not implemented."); }
    /* istanbul ignore next */
    prepend(...nodes) { throw new Error("Mixin: ParentNode not implemented."); }
    /* istanbul ignore next */
    append(...nodes) { throw new Error("Mixin: ParentNode not implemented."); }
    /* istanbul ignore next */
    querySelector(selectors) { throw new Error("Mixin: ParentNode not implemented."); }
    /* istanbul ignore next */
    querySelectorAll(selectors) { throw new Error("Mixin: ParentNode not implemented."); }
    /**
     * Creates a new `DocumentFragment`.
     *
     * @param document - owner document
     * @param host - shadow root's host element
     */
    static _create(document, host = null) {
        const node = new DocumentFragmentImpl(host);
        node._nodeDocument = document;
        return node;
    }
}
exports.DocumentFragmentImpl = DocumentFragmentImpl;
/**
 * Initialize prototype properties
 */
(0, WebIDLAlgorithm_1.idl_defineConst)(DocumentFragmentImpl.prototype, "_nodeType", interfaces_1.NodeType.DocumentFragment);
//# sourceMappingURL=DocumentFragmentImpl.js.map