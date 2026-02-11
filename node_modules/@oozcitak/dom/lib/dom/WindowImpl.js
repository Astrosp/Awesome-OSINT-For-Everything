"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WindowImpl = void 0;
const EventTargetImpl_1 = require("./EventTargetImpl");
const util_1 = require("@oozcitak/util");
const algorithm_1 = require("../algorithm");
/**
 * Represents a window containing a DOM document.
 */
class WindowImpl extends EventTargetImpl_1.EventTargetImpl {
    _currentEvent;
    _signalSlots = new Set();
    _mutationObserverMicrotaskQueued = false;
    _mutationObservers = new Set();
    _associatedDocument;
    _iteratorList = new util_1.FixedSizeSet();
    /**
     * Initializes a new instance of `Window`.
     */
    constructor() {
        super();
        this._associatedDocument = (0, algorithm_1.create_document)();
    }
    /** @inheritdoc */
    get document() { return this._associatedDocument; }
    /** @inheritdoc */
    get event() { return this._currentEvent; }
    /**
     * Creates a new window with a blank document.
     */
    static _create() {
        return new WindowImpl();
    }
}
exports.WindowImpl = WindowImpl;
//# sourceMappingURL=WindowImpl.js.map