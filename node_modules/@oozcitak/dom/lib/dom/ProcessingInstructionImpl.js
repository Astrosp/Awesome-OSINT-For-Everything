"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessingInstructionImpl = void 0;
const interfaces_1 = require("./interfaces");
const CharacterDataImpl_1 = require("./CharacterDataImpl");
const WebIDLAlgorithm_1 = require("../algorithm/WebIDLAlgorithm");
/**
 * Represents a processing instruction node.
 */
class ProcessingInstructionImpl extends CharacterDataImpl_1.CharacterDataImpl {
    _nodeType = interfaces_1.NodeType.ProcessingInstruction;
    _target;
    /**
     * Initializes a new instance of `ProcessingInstruction`.
     */
    constructor(target, data) {
        super(data);
        this._target = target;
    }
    /**
     * Gets the target of the {@link ProcessingInstruction} node.
     */
    get target() { return this._target; }
    /**
     * Creates a new `ProcessingInstruction`.
     *
     * @param document - owner document
     * @param target - instruction target
     * @param data - node contents
     */
    static _create(document, target, data) {
        const node = new ProcessingInstructionImpl(target, data);
        node._nodeDocument = document;
        return node;
    }
}
exports.ProcessingInstructionImpl = ProcessingInstructionImpl;
/**
 * Initialize prototype properties
 */
(0, WebIDLAlgorithm_1.idl_defineConst)(ProcessingInstructionImpl.prototype, "_nodeType", interfaces_1.NodeType.ProcessingInstruction);
//# sourceMappingURL=ProcessingInstructionImpl.js.map