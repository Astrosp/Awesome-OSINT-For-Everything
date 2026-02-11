"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeListImpl = void 0;
const DOMImpl_1 = require("./DOMImpl");
const util_1 = require("@oozcitak/util");
const algorithm_1 = require("../algorithm");
/**
 * Represents an ordered set of nodes.
 */
class NodeListImpl {
    _live = true;
    _root;
    _filter = null;
    _length = 0;
    /**
     * Initializes a new instance of `NodeList`.
     *
     * @param root - root node
     */
    constructor(root) {
        this._root = root;
        return new Proxy(this, this);
    }
    /** @inheritdoc */
    get length() {
        /**
         * The length attribute must return the number of nodes represented
         * by the collection.
         */
        return this._root._children.size;
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
        if (index < this.length / 2) {
            let i = 0;
            let node = this._root._firstChild;
            while (node !== null && i !== index) {
                node = node._nextSibling;
                i++;
            }
            return node;
        }
        else {
            let i = this.length - 1;
            let node = this._root._lastChild;
            while (node !== null && i !== index) {
                node = node._previousSibling;
                i--;
            }
            return node;
        }
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
        return this._root._children[Symbol.iterator]();
    }
    /** @inheritdoc */
    forEach(callback, thisArg) {
        if (thisArg === undefined) {
            thisArg = DOMImpl_1.dom.window;
        }
        let index = 0;
        for (const node of this._root._children) {
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
        return target.item(index) || undefined;
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
        const node = target.item(index) || undefined;
        if (!node)
            return false;
        if (node._parent) {
            (0, algorithm_1.mutation_replace)(node, value, node._parent);
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
     */
    static _create(root) {
        return new NodeListImpl(root);
    }
}
exports.NodeListImpl = NodeListImpl;
//# sourceMappingURL=NodeListImpl.js.map