"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShadowRootImpl = void 0;
const DocumentFragmentImpl_1 = require("./DocumentFragmentImpl");
const util_1 = require("@oozcitak/util");
const algorithm_1 = require("../algorithm");
/**
 * Represents a shadow root.
 */
class ShadowRootImpl extends DocumentFragmentImpl_1.DocumentFragmentImpl {
    _host;
    _mode;
    /**
     * Initializes a new instance of `ShadowRoot`.
     *
     * @param host - shadow root's host element
     * @param mode - shadow root's mode
     */
    constructor(host, mode) {
        super();
        this._host = host;
        this._mode = mode;
    }
    /** @inheritdoc */
    get mode() { return this._mode; }
    /** @inheritdoc */
    get host() { return this._host; }
    /**
     * Gets the parent event target for the given event.
     *
     * @param event - an event
     */
    _getTheParent(event) {
        /**
         * A shadow root’s get the parent algorithm, given an event, returns null
         * if event’s composed flag is unset and shadow root is the root of
         * event’s path’s first struct’s invocation target, and shadow root’s host
         * otherwise.
         */
        if (!event._composedFlag && !(0, util_1.isEmpty)(event._path) &&
            (0, algorithm_1.tree_rootNode)(event._path[0].invocationTarget) === this) {
            return null;
        }
        else {
            return this._host;
        }
    }
    // MIXIN: DocumentOrShadowRoot
    // No elements
    /**
     * Creates a new `ShadowRoot`.
     *
     * @param document - owner document
     * @param host - shadow root's host element
     */
    static _create(document, host) {
        return new ShadowRootImpl(host, "closed");
    }
}
exports.ShadowRootImpl = ShadowRootImpl;
//# sourceMappingURL=ShadowRootImpl.js.map