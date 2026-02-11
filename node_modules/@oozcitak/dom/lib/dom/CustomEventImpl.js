"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomEventImpl = void 0;
const EventImpl_1 = require("./EventImpl");
const algorithm_1 = require("../algorithm");
/**
 * Represents and event that carries custom data.
 */
class CustomEventImpl extends EventImpl_1.EventImpl {
    _detail = null;
    /**
     * Initializes a new instance of `CustomEvent`.
     */
    constructor(type, eventInit) {
        super(type, eventInit);
        this._detail = (eventInit && eventInit.detail) || null;
    }
    /** @inheritdoc */
    get detail() { return this._detail; }
    /** @inheritdoc */
    initCustomEvent(type, bubbles = false, cancelable = false, detail = null) {
        /**
         * 1. If the context object’s dispatch flag is set, then return.
         */
        if (this._dispatchFlag)
            return;
        /**
         * 2. Initialize the context object with type, bubbles, and cancelable.
         */
        (0, algorithm_1.event_initialize)(this, type, bubbles, cancelable);
        /**
         * 3. Set the context object’s detail attribute to detail.
         */
        this._detail = detail;
    }
}
exports.CustomEventImpl = CustomEventImpl;
//# sourceMappingURL=CustomEventImpl.js.map