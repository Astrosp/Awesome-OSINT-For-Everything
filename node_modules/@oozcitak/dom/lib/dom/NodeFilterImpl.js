"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeFilterImpl = void 0;
const interfaces_1 = require("./interfaces");
const WebIDLAlgorithm_1 = require("../algorithm/WebIDLAlgorithm");
/**
 * Represents a node filter.
 */
class NodeFilterImpl {
    static FILTER_ACCEPT = 1;
    static FILTER_REJECT = 2;
    static FILTER_SKIP = 3;
    static SHOW_ALL = 0xffffffff;
    static SHOW_ELEMENT = 0x1;
    static SHOW_ATTRIBUTE = 0x2;
    static SHOW_TEXT = 0x4;
    static SHOW_CDATA_SECTION = 0x8;
    static SHOW_ENTITY_REFERENCE = 0x10;
    static SHOW_ENTITY = 0x20;
    static SHOW_PROCESSING_INSTRUCTION = 0x40;
    static SHOW_COMMENT = 0x80;
    static SHOW_DOCUMENT = 0x100;
    static SHOW_DOCUMENT_TYPE = 0x200;
    static SHOW_DOCUMENT_FRAGMENT = 0x400;
    static SHOW_NOTATION = 0x800;
    FILTER_ACCEPT = 1;
    FILTER_REJECT = 2;
    FILTER_SKIP = 3;
    SHOW_ALL = 0xffffffff;
    SHOW_ELEMENT = 0x1;
    SHOW_ATTRIBUTE = 0x2;
    SHOW_TEXT = 0x4;
    SHOW_CDATA_SECTION = 0x8;
    SHOW_ENTITY_REFERENCE = 0x10;
    SHOW_ENTITY = 0x20;
    SHOW_PROCESSING_INSTRUCTION = 0x40;
    SHOW_COMMENT = 0x80;
    SHOW_DOCUMENT = 0x100;
    SHOW_DOCUMENT_TYPE = 0x200;
    SHOW_DOCUMENT_FRAGMENT = 0x400;
    SHOW_NOTATION = 0x800;
    /**
     * Initializes a new instance of `NodeFilter`.
     */
    constructor() {
    }
    /**
     * Callback function.
     */
    acceptNode(node) {
        return interfaces_1.FilterResult.Accept;
    }
    /**
     * Creates a new `NodeFilter`.
     */
    static _create() {
        return new NodeFilterImpl();
    }
}
exports.NodeFilterImpl = NodeFilterImpl;
/**
 * Define constants on prototype.
 */
(0, WebIDLAlgorithm_1.idl_defineConst)(NodeFilterImpl.prototype, "FILTER_ACCEPT", 1);
(0, WebIDLAlgorithm_1.idl_defineConst)(NodeFilterImpl.prototype, "FILTER_REJECT", 2);
(0, WebIDLAlgorithm_1.idl_defineConst)(NodeFilterImpl.prototype, "FILTER_SKIP", 3);
(0, WebIDLAlgorithm_1.idl_defineConst)(NodeFilterImpl.prototype, "SHOW_ALL", 0xffffffff);
(0, WebIDLAlgorithm_1.idl_defineConst)(NodeFilterImpl.prototype, "SHOW_ELEMENT", 0x1);
(0, WebIDLAlgorithm_1.idl_defineConst)(NodeFilterImpl.prototype, "SHOW_ATTRIBUTE", 0x2);
(0, WebIDLAlgorithm_1.idl_defineConst)(NodeFilterImpl.prototype, "SHOW_TEXT", 0x4);
(0, WebIDLAlgorithm_1.idl_defineConst)(NodeFilterImpl.prototype, "SHOW_CDATA_SECTION", 0x8);
(0, WebIDLAlgorithm_1.idl_defineConst)(NodeFilterImpl.prototype, "SHOW_ENTITY_REFERENCE", 0x10);
(0, WebIDLAlgorithm_1.idl_defineConst)(NodeFilterImpl.prototype, "SHOW_ENTITY", 0x20);
(0, WebIDLAlgorithm_1.idl_defineConst)(NodeFilterImpl.prototype, "SHOW_PROCESSING_INSTRUCTION", 0x40);
(0, WebIDLAlgorithm_1.idl_defineConst)(NodeFilterImpl.prototype, "SHOW_COMMENT", 0x80);
(0, WebIDLAlgorithm_1.idl_defineConst)(NodeFilterImpl.prototype, "SHOW_DOCUMENT", 0x100);
(0, WebIDLAlgorithm_1.idl_defineConst)(NodeFilterImpl.prototype, "SHOW_DOCUMENT_TYPE", 0x200);
(0, WebIDLAlgorithm_1.idl_defineConst)(NodeFilterImpl.prototype, "SHOW_DOCUMENT_FRAGMENT", 0x400);
(0, WebIDLAlgorithm_1.idl_defineConst)(NodeFilterImpl.prototype, "SHOW_NOTATION", 0x800);
//# sourceMappingURL=NodeFilterImpl.js.map