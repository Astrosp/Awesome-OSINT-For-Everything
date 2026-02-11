"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixedSizeSet = void 0;
/**
 * Represents a set of objects with a size limit.
 */
class FixedSizeSet {
    _limit;
    _items = new Set();
    /**
     * Initializes a new instance of `FixedSizeSet`.
     *
     * @param limit - maximum number of items to keep in the set. When the limit
     * is exceeded the first item is removed from the set.
     */
    constructor(limit = 1000) {
        this._limit = limit;
    }
    /**
     * Adds a new item to the set.
     *
     * @param item - an item
     */
    add(item) {
        this._items.add(item);
        if (this._items.size > this._limit) {
            const it = this._items.values().next();
            /* istanbul ignore else */
            if (!it.done) {
                this._items.delete(it.value);
            }
        }
        return this;
    }
    /**
     * Removes an item from the set.
     *
     * @param item - an item
     */
    delete(item) {
        return this._items.delete(item);
    }
    /**
     * Determines if an item is in the set.
     *
     * @param item - an item
     */
    has(item) {
        return this._items.has(item);
    }
    /**
     * Removes all items from the set.
     */
    clear() {
        this._items.clear();
    }
    /**
     * Gets the number of items in the set.
     */
    get size() { return this._items.size; }
    /**
     * Applies the given callback function to all elements of the set.
     */
    forEach(callback, thisArg) {
        this._items.forEach(e => callback.call(thisArg, e, e, this));
    }
    /**
     * Iterates through the items in the set.
     */
    *keys() {
        yield* this._items.keys();
    }
    /**
     * Iterates through the items in the set.
     */
    *values() {
        yield* this._items.values();
    }
    /**
     * Iterates through the items in the set.
     */
    *entries() {
        yield* this._items.entries();
    }
    /**
     * Iterates through the items in the set.
     */
    *[Symbol.iterator]() {
        yield* this._items;
    }
    /**
     * Returns the string tag of the set.
     */
    get [Symbol.toStringTag]() {
        return "FixedSizeSet";
    }
}
exports.FixedSizeSet = FixedSizeSet;
//# sourceMappingURL=FixedSizeSet.js.map