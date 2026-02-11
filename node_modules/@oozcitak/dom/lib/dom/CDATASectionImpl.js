"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CDATASectionImpl = void 0;
const TextImpl_1 = require("./TextImpl");
const interfaces_1 = require("./interfaces");
const WebIDLAlgorithm_1 = require("../algorithm/WebIDLAlgorithm");
/**
 * Represents a CDATA node.
 */
class CDATASectionImpl extends TextImpl_1.TextImpl {
    _nodeType = interfaces_1.NodeType.CData;
    /**
     * Initializes a new instance of `CDATASection`.
     *
     * @param data - node contents
     */
    constructor(data) {
        super(data);
    }
    /**
     * Creates a new `CDATASection`.
     *
     * @param document - owner document
     * @param data - node contents
     */
    static _create(document, data = '') {
        const node = new CDATASectionImpl(data);
        node._nodeDocument = document;
        return node;
    }
}
exports.CDATASectionImpl = CDATASectionImpl;
/**
 * Initialize prototype properties
 */
(0, WebIDLAlgorithm_1.idl_defineConst)(CDATASectionImpl.prototype, "_nodeType", interfaces_1.NodeType.CData);
//# sourceMappingURL=CDATASectionImpl.js.map