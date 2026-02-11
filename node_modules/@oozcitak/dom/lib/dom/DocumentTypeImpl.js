"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentTypeImpl = void 0;
const interfaces_1 = require("./interfaces");
const NodeImpl_1 = require("./NodeImpl");
const WebIDLAlgorithm_1 = require("../algorithm/WebIDLAlgorithm");
/**
 * Represents an object providing methods which are not dependent on
 * any particular document
 */
class DocumentTypeImpl extends NodeImpl_1.NodeImpl {
    _nodeType = interfaces_1.NodeType.DocumentType;
    _name = '';
    _publicId = '';
    _systemId = '';
    /**
     * Initializes a new instance of `DocumentType`.
     *
     * @param name - name of the node
     * @param publicId - `PUBLIC` identifier
     * @param systemId - `SYSTEM` identifier
     */
    constructor(name, publicId, systemId) {
        super();
        this._name = name;
        this._publicId = publicId;
        this._systemId = systemId;
    }
    /** @inheritdoc */
    get name() { return this._name; }
    /** @inheritdoc */
    get publicId() { return this._publicId; }
    /** @inheritdoc */
    get systemId() { return this._systemId; }
    // MIXIN: ChildNode
    /* istanbul ignore next */
    before(...nodes) { throw new Error("Mixin: ChildNode not implemented."); }
    /* istanbul ignore next */
    after(...nodes) { throw new Error("Mixin: ChildNode not implemented."); }
    /* istanbul ignore next */
    replaceWith(...nodes) { throw new Error("Mixin: ChildNode not implemented."); }
    /* istanbul ignore next */
    remove() { throw new Error("Mixin: ChildNode not implemented."); }
    /**
     * Creates a new `DocumentType`.
     *
     * @param document - owner document
     * @param name - name of the node
     * @param publicId - `PUBLIC` identifier
     * @param systemId - `SYSTEM` identifier
     */
    static _create(document, name, publicId = '', systemId = '') {
        const node = new DocumentTypeImpl(name, publicId, systemId);
        node._nodeDocument = document;
        return node;
    }
}
exports.DocumentTypeImpl = DocumentTypeImpl;
/**
 * Initialize prototype properties
 */
(0, WebIDLAlgorithm_1.idl_defineConst)(DocumentTypeImpl.prototype, "_nodeType", interfaces_1.NodeType.DocumentType);
//# sourceMappingURL=DocumentTypeImpl.js.map