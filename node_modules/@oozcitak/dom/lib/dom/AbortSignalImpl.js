"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbortSignalImpl = void 0;
const EventTargetImpl_1 = require("./EventTargetImpl");
const algorithm_1 = require("../algorithm");
/**
 * Represents a signal object that communicates with a DOM request and abort
 * it through an AbortController.
 */
class AbortSignalImpl extends EventTargetImpl_1.EventTargetImpl {
    _abortedFlag = false;
    _abortAlgorithms = new Set();
    /**
     * Initializes a new instance of `AbortSignal`.
     */
    constructor() {
        super();
    }
    /** @inheritdoc */
    get aborted() { return this._abortedFlag; }
    /** @inheritdoc */
    get onabort() {
        return (0, algorithm_1.event_getterEventHandlerIDLAttribute)(this, "onabort");
    }
    set onabort(val) {
        (0, algorithm_1.event_setterEventHandlerIDLAttribute)(this, "onabort", val);
    }
    /**
     * Creates a new `AbortSignal`.
     */
    static _create() {
        return new AbortSignalImpl();
    }
}
exports.AbortSignalImpl = AbortSignalImpl;
//# sourceMappingURL=AbortSignalImpl.js.map