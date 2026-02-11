"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeListStaticImpl = void 0;
const DOMImpl_1 = require("./DOMImpl");
const util_1 = require("@oozcitak/util");
/**
 * Represents an ordered list of nodes.
 * This is a static implementation of `NodeList`.
 */
class NodeListStaticImpl {
    _live = false;
    _root;
    _filter;
    _items = [];
    _length = 0;
    /**
     * Initializes a new instance of `NodeList`.
     *
     * @param root - root node
     */
    constructor(root) {
        this._root = root;
        this._items = [];
        this._filter = function (node) { return true; };
        return new Proxy(this, this);
    }
    /** @inheritdoc */
    get length() {
        /**
         * The length attribute must return the number of nodes represented by
         * the collection.
         */
        return this._items.length;
    }
    /** @inheritdoc */
    item(index) {
        /**
         * The item(index) method must return the indexth node in the collection.
         * If there is no indexth node in the collection, then the method must
         * return null.
         */
        if (index < 0 || index > this.length - 1)
            return null;
        return this._items[index];
    }
    /** @inheritdoc */
    keys() {
        return {
            [Symbol.iterator]: function () {
                let index = 0;
                return {
                    next: function () {
                        if (index === this.length) {
                            return { done: true, value: null };
                        }
                        else {
                            return { done: false, value: index++ };
                        }
                    }.bind(this)
                };
            }.bind(this)
        };
    }
    /** @inheritdoc */
    values() {
        return {
            [Symbol.iterator]: function () {
                const it = this[Symbol.iterator]();
                return {
                    next() {
                        return it.next();
                    }
                };
            }.bind(this)
        };
    }
    /** @inheritdoc */
    entries() {
        return {
            [Symbol.iterator]: function () {
                const it = this[Symbol.iterator]();
                let index = 0;
                return {
                    next() {
                        const itResult = it.next();
                        if (itResult.done) {
                            return { done: true, value: null };
                        }
                        else {
                            return { done: false, value: [index++, itResult.value] };
                        }
                    }
                };
            }.bind(this)
        };
    }
    /** @inheritdoc */
    [Symbol.iterator]() {
        const it = this._items[Symbol.iterator]();
        return {
            next() {
                return it.next();
            }
        };
    }
    /** @inheritdoc */
    forEach(callback, thisArg) {
        if (thisArg === undefined) {
            thisArg = DOMImpl_1.dom.window;
        }
        let index = 0;
        for (const node of this._items) {
            callback.call(thisArg, node, index++, this);
        }
    }
    /**
     * Implements a proxy get trap to provide array-like access.
     */
    get(target, key, receiver) {
        if (!(0, util_1.isString)(key)) {
            return Reflect.get(target, key, receiver);
        }
        const index = Number(key);
        if (isNaN(index)) {
            return Reflect.get(target, key, receiver);
        }
        return target._items[index] || undefined;
    }
    /**
     * Implements a proxy set trap to provide array-like access.
     */
    set(target, key, value, receiver) {
        if (!(0, util_1.isString)(key)) {
            return Reflect.set(target, key, value, receiver);
        }
        const index = Number(key);
        if (isNaN(index)) {
            return Reflect.set(target, key, value, receiver);
        }
        if (index >= 0 && index < target._items.length) {
            target._items[index] = value;
            return true;
        }
        else {
            return false;
        }
    }
    /**
     * Creates a new `NodeList`.
     *
     * @param root - root node
     * @param items - a list of items to initialize the list
     */
    static _create(root, items) {
        const list = new NodeListStaticImpl(root);
        list._items = items;
        return list;
    }
}
exports.NodeListStaticImpl = NodeListStaticImpl;
//# sourceMappingURL=NodeListStaticImpl.js.map