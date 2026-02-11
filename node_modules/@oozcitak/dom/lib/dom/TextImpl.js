"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextImpl = void 0;
const interfaces_1 = require("./interfaces");
const CharacterDataImpl_1 = require("./CharacterDataImpl");
const algorithm_1 = require("../algorithm");
const WebIDLAlgorithm_1 = require("../algorithm/WebIDLAlgorithm");
/**
 * Represents a text node.
 */
class TextImpl extends CharacterDataImpl_1.CharacterDataImpl {
    _nodeType = interfaces_1.NodeType.Text;
    _name = '';
    _assignedSlot = null;
    /**
     * Initializes a new instance of `Text`.
     *
     * @param data - the text content
     */
    constructor(data = '') {
        super(data);
    }
    /** @inheritdoc */
    get wholeText() {
        /**
         * The wholeText attribute’s getter must return the concatenation of the
         * data of the contiguous Text nodes of the context object, in tree order.
         */
        let text = '';
        for (const node of (0, algorithm_1.text_contiguousTextNodes)(this, true)) {
            text = text + node._data;
        }
        return text;
    }
    /** @inheritdoc */
    splitText(offset) {
        /**
         * The splitText(offset) method, when invoked, must split context object
         * with offset offset.
         */
        return (0, algorithm_1.text_split)(this, offset);
    }
    // MIXIN: Slotable
    /* istanbul ignore next */
    get assignedSlot() { throw new Error("Mixin: Slotable not implemented."); }
    /**
     * Creates a `Text`.
     *
     * @param document - owner document
     * @param data - the text content
     */
    static _create(document, data = '') {
        const node = new TextImpl(data);
        node._nodeDocument = document;
        return node;
    }
}
exports.TextImpl = TextImpl;
/**
 * Initialize prototype properties
 */
(0, WebIDLAlgorithm_1.idl_defineConst)(TextImpl.prototype, "_nodeType", interfaces_1.NodeType.Text);
//# sourceMappingURL=TextImpl.js.map