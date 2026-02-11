"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dom = void 0;
const util_1 = require("@oozcitak/util");
const CreateAlgorithm_1 = require("../algorithm/CreateAlgorithm");
/**
 * Represents an object implementing DOM algorithms.
 */
class DOMImpl {
    static _instance;
    _features = {
        mutationObservers: true,
        customElements: true,
        slots: true,
        steps: true
    };
    _window = null;
    _compareCache;
    _rangeList;
    /**
     * Initializes a new instance of `DOM`.
     */
    constructor() {
        this._compareCache = new util_1.CompareCache();
        this._rangeList = new util_1.FixedSizeSet();
    }
    /**
     * Sets DOM algorithm features.
     *
     * @param features - DOM features supported by algorithms. All features are
     * enabled by default unless explicity disabled.
     */
    setFeatures(features) {
        if (features === undefined)
            features = true;
        if ((0, util_1.isObject)(features)) {
            for (const key in features) {
                this._features[key] = features[key] || false;
            }
        }
        else {
            // enable/disable all features
            for (const key in this._features) {
                this._features[key] = features;
            }
        }
    }
    /**
     * Gets DOM algorithm features.
     */
    get features() { return this._features; }
    /**
     * Gets the DOM window.
     */
    get window() {
        if (this._window === null) {
            this._window = (0, CreateAlgorithm_1.create_window)();
        }
        return this._window;
    }
    /**
     * Gets the global node compare cache.
     */
    get compareCache() { return this._compareCache; }
    /**
     * Gets the global range list.
     */
    get rangeList() { return this._rangeList; }
    /**
     * Returns the instance of `DOM`.
     */
    static get instance() {
        if (!DOMImpl._instance) {
            DOMImpl._instance = new DOMImpl();
        }
        return DOMImpl._instance;
    }
}
/**
 * Represents an object implementing DOM algorithms.
 */
exports.dom = DOMImpl.instance;
//# sourceMappingURL=DOMImpl.js.map