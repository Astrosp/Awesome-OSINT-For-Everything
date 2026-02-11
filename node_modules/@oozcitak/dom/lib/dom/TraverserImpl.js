"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TraverserImpl = void 0;
const interfaces_1 = require("./interfaces");
/**
 * Represents an object which can be used to iterate through the nodes
 * of a subtree.
 */
class TraverserImpl {
    _activeFlag;
    _root;
    _whatToShow;
    _filter;
    /**
     * Initializes a new instance of `Traverser`.
     *
     * @param root - root node
     */
    constructor(root) {
        this._activeFlag = false;
        this._root = root;
        this._whatToShow = interfaces_1.WhatToShow.All;
        this._filter = null;
    }
    /** @inheritdoc */
    get root() { return this._root; }
    /** @inheritdoc */
    get whatToShow() { return this._whatToShow; }
    /** @inheritdoc */
    get filter() { return this._filter; }
}
exports.TraverserImpl = TraverserImpl;
//# sourceMappingURL=TraverserImpl.js.map