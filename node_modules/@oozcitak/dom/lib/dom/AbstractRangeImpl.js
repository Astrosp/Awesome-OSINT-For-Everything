"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractRangeImpl = void 0;
/**
 * Represents an abstract range with a start and end boundary point.
 */
class AbstractRangeImpl {
    get _startNode() { return this._start[0]; }
    get _startOffset() { return this._start[1]; }
    get _endNode() { return this._end[0]; }
    get _endOffset() { return this._end[1]; }
    get _collapsed() {
        return (this._start[0] === this._end[0] &&
            this._start[1] === this._end[1]);
    }
    /** @inheritdoc */
    get startContainer() { return this._startNode; }
    /** @inheritdoc */
    get startOffset() { return this._startOffset; }
    /** @inheritdoc */
    get endContainer() { return this._endNode; }
    /** @inheritdoc */
    get endOffset() { return this._endOffset; }
    /** @inheritdoc */
    get collapsed() { return this._collapsed; }
}
exports.AbstractRangeImpl = AbstractRangeImpl;
//# sourceMappingURL=AbstractRangeImpl.js.map