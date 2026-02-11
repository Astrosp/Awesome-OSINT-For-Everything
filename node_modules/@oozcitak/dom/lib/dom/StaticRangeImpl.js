"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticRangeImpl = void 0;
const AbstractRangeImpl_1 = require("./AbstractRangeImpl");
const DOMException_1 = require("./DOMException");
const util_1 = require("../util");
/**
 * Represents a static range.
 */
class StaticRangeImpl extends AbstractRangeImpl_1.AbstractRangeImpl {
    _start;
    _end;
    /**
     * Initializes a new instance of `StaticRange`.
     */
    constructor(init) {
        super();
        /**
         * 1. If init’s startContainer or endContainer is a DocumentType or Attr
         * node, then throw an "InvalidNodeTypeError" DOMException.
         * 2. Let staticRange be a new StaticRange object.
         * 3. Set staticRange’s start to (init’s startContainer, init’s startOffset)
         * and end to (init’s endContainer, init’s endOffset).
         * 4. Return staticRange.
         */
        if (util_1.Guard.isDocumentTypeNode(init.startContainer) || util_1.Guard.isAttrNode(init.startContainer) ||
            util_1.Guard.isDocumentTypeNode(init.endContainer) || util_1.Guard.isAttrNode(init.endContainer)) {
            throw new DOMException_1.InvalidNodeTypeError();
        }
        this._start = [init.startContainer, init.startOffset];
        this._end = [init.endContainer, init.endOffset];
    }
}
exports.StaticRangeImpl = StaticRangeImpl;
//# sourceMappingURL=StaticRangeImpl.js.map