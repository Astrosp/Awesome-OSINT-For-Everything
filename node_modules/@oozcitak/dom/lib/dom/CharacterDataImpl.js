"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharacterDataImpl = void 0;
const NodeImpl_1 = require("./NodeImpl");
const algorithm_1 = require("../algorithm");
/**
 * Represents a generic text node.
 */
class CharacterDataImpl extends NodeImpl_1.NodeImpl {
    _data;
    /**
     * Initializes a new instance of `CharacterData`.
     *
     * @param data - the text content
     */
    constructor(data) {
        super();
        this._data = data;
    }
    /** @inheritdoc */
    get data() { return this._data; }
    set data(value) {
        (0, algorithm_1.characterData_replaceData)(this, 0, this._data.length, value);
    }
    /** @inheritdoc */
    get length() { return this._data.length; }
    /** @inheritdoc */
    substringData(offset, count) {
        /**
         * The substringData(offset, count) method, when invoked, must return the
         * result of running substring data with node context object, offset offset, and count count.
         */
        return (0, algorithm_1.characterData_substringData)(this, offset, count);
    }
    /** @inheritdoc */
    appendData(data) {
        /**
         * The appendData(data) method, when invoked, must replace data with node
         * context object, offset context object’s length, count 0, and data data.
         */
        return (0, algorithm_1.characterData_replaceData)(this, this._data.length, 0, data);
    }
    /** @inheritdoc */
    insertData(offset, data) {
        /**
         * The insertData(offset, data) method, when invoked, must replace data with
         * node context object, offset offset, count 0, and data data.
         */
        (0, algorithm_1.characterData_replaceData)(this, offset, 0, data);
    }
    /** @inheritdoc */
    deleteData(offset, count) {
        /**
         * The deleteData(offset, count) method, when invoked, must replace data
         * with node context object, offset offset, count count, and data the
         * empty string.
         */
        (0, algorithm_1.characterData_replaceData)(this, offset, count, '');
    }
    /** @inheritdoc */
    replaceData(offset, count, data) {
        /**
         * The replaceData(offset, count, data) method, when invoked, must replace
         * data with node context object, offset offset, count count, and data data.
         */
        (0, algorithm_1.characterData_replaceData)(this, offset, count, data);
    }
    // MIXIN: NonDocumentTypeChildNode
    /* istanbul ignore next */
    get previousElementSibling() { throw new Error("Mixin: NonDocumentTypeChildNode not implemented."); }
    /* istanbul ignore next */
    get nextElementSibling() { throw new Error("Mixin: NonDocumentTypeChildNode not implemented."); }
    // MIXIN: ChildNode
    /* istanbul ignore next */
    before(...nodes) { throw new Error("Mixin: ChildNode not implemented."); }
    /* istanbul ignore next */
    after(...nodes) { throw new Error("Mixin: ChildNode not implemented."); }
    /* istanbul ignore next */
    replaceWith(...nodes) { throw new Error("Mixin: ChildNode not implemented."); }
    /* istanbul ignore next */
    remove() { throw new Error("Mixin: ChildNode not implemented."); }
}
exports.CharacterDataImpl = CharacterDataImpl;
//# sourceMappingURL=CharacterDataImpl.js.map