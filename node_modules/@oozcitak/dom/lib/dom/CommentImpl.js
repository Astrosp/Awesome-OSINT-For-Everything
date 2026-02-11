"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentImpl = void 0;
const interfaces_1 = require("./interfaces");
const CharacterDataImpl_1 = require("./CharacterDataImpl");
const WebIDLAlgorithm_1 = require("../algorithm/WebIDLAlgorithm");
/**
 * Represents a comment node.
 */
class CommentImpl extends CharacterDataImpl_1.CharacterDataImpl {
    _nodeType = interfaces_1.NodeType.Comment;
    /**
     * Initializes a new instance of `Comment`.
     *
     * @param data - the text content
     */
    constructor(data = '') {
        super(data);
    }
    /**
     * Creates a new `Comment`.
     *
     * @param document - owner document
     * @param data - node contents
     */
    static _create(document, data = '') {
        const node = new CommentImpl(data);
        node._nodeDocument = document;
        return node;
    }
}
exports.CommentImpl = CommentImpl;
/**
 * Initialize prototype properties
 */
(0, WebIDLAlgorithm_1.idl_defineConst)(CommentImpl.prototype, "_nodeType", interfaces_1.NodeType.Comment);
//# sourceMappingURL=CommentImpl.js.map