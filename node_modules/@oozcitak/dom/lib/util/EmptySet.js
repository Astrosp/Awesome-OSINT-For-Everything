"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmptySet = void 0;
class EmptySet {
    get size() {
        return 0;
    }
    add(value) {
        throw new Error("Cannot add to an empty set.");
    }
    clear() {
        // no-op
    }
    delete(value) {
        return false;
    }
    forEach(callbackfn, thisArg) {
        // no-op
    }
    has(value) {
        return false;
    }
    [Symbol.iterator]() {
        return new EmptySetIterator();
    }
    entries() {
        return new EmptySetIterator();
    }
    keys() {
        return new EmptySetIterator();
    }
    values() {
        return new EmptySetIterator();
    }
    get [Symbol.toStringTag]() {
        return "EmptySet";
    }
}
exports.EmptySet = EmptySet;
class EmptySetIterator {
    [Symbol.iterator]() {
        return this;
    }
    next() {
        return { done: true, value: null };
    }
}
//# sourceMappingURL=EmptySet.js.map