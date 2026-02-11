"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lazy = void 0;
/**
 * Represents an object with lazy initialization.
 */
class Lazy {
    _initialized = false;
    _initFunc;
    _value;
    /**
     * Initializes a new instance of `Lazy`.
     *
     * @param initFunc - initializer function
     */
    constructor(initFunc) {
        this._value = undefined;
        this._initFunc = initFunc;
    }
    /**
     * Gets the value of the object.
     */
    get value() {
        if (!this._initialized) {
            this._value = this._initFunc();
            this._initialized = true;
        }
        return this._value;
    }
}
exports.Lazy = Lazy;
//# sourceMappingURL=Lazy.js.map