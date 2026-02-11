"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbortControllerImpl = void 0;
const algorithm_1 = require("../algorithm");
/**
 * Represents a controller that allows to abort DOM requests.
 */
class AbortControllerImpl {
    _signal;
    /**
     * Initializes a new instance of `AbortController`.
     */
    constructor() {
        /**
         * 1. Let signal be a new AbortSignal object.
         * 2. Let controller be a new AbortController object whose signal is signal.
         * 3. Return controller.
         */
        this._signal = (0, algorithm_1.create_abortSignal)();
    }
    /** @inheritdoc */
    get signal() { return this._signal; }
    /** @inheritdoc */
    abort() {
        (0, algorithm_1.abort_signalAbort)(this._signal);
    }
}
exports.AbortControllerImpl = AbortControllerImpl;
//# sourceMappingURL=AbortControllerImpl.js.map