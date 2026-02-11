"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttrImpl = void 0;
const interfaces_1 = require("./interfaces");
const NodeImpl_1 = require("./NodeImpl");
const algorithm_1 = require("../algorithm");
const WebIDLAlgorithm_1 = require("../algorithm/WebIDLAlgorithm");
/**
 * Represents an attribute of an element node.
 */
class AttrImpl extends NodeImpl_1.NodeImpl {
    _nodeType = interfaces_1.NodeType.Attribute;
    _localName;
    _namespace = null;
    _namespacePrefix = null;
    _element = null;
    _value = '';
    /**
     * Initializes a new instance of `Attr`.
     *
     * @param localName - local name
     */
    constructor(localName) {
        super();
        this._localName = localName;
    }
    /** @inheritdoc */
    specified;
    /** @inheritdoc */
    get ownerElement() { return this._element; }
    /** @inheritdoc */
    get namespaceURI() { return this._namespace; }
    /** @inheritdoc */
    get prefix() { return this._namespacePrefix; }
    /** @inheritdoc */
    get localName() { return this._localName; }
    /** @inheritdoc */
    get name() { return this._qualifiedName; }
    /** @inheritdoc */
    get value() { return this._value; }
    set value(value) {
        /**
         * The value attribute’s setter must set an existing attribute value with
         * context object and the given value.
         */
        (0, algorithm_1.attr_setAnExistingAttributeValue)(this, value);
    }
    /**
     * Returns the qualified name.
     */
    get _qualifiedName() {
        /**
         * An attribute’s qualified name is its local name if its namespace prefix
         * is null, and its namespace prefix, followed by ":", followed by its
         * local name, otherwise.
         */
        return (this._namespacePrefix !== null ?
            this._namespacePrefix + ':' + this._localName :
            this._localName);
    }
    /**
     * Creates an `Attr`.
     *
     * @param document - owner document
     * @param localName - local name
     */
    static _create(document, localName) {
        const node = new AttrImpl(localName);
        node._nodeDocument = document;
        return node;
    }
}
exports.AttrImpl = AttrImpl;
/**
 * Initialize prototype properties
 */
(0, WebIDLAlgorithm_1.idl_defineConst)(AttrImpl.prototype, "_nodeType", interfaces_1.NodeType.Attribute);
(0, WebIDLAlgorithm_1.idl_defineConst)(AttrImpl.prototype, "specified", true);
//# sourceMappingURL=AttrImpl.js.map