"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.append = append;
exports.extend = extend;
exports.prepend = prepend;
exports.replace = replace;
exports.insert = insert;
exports.remove = remove;
exports.empty = empty;
exports.contains = contains;
exports.size = size;
exports.isEmpty = isEmpty;
exports.forEach = forEach;
exports.clone = clone;
exports.sortInAscendingOrder = sortInAscendingOrder;
exports.sortInDescendingOrder = sortInDescendingOrder;
exports.isSubsetOf = isSubsetOf;
exports.isSupersetOf = isSupersetOf;
exports.intersection = intersection;
exports.union = union;
exports.range = range;
const util_1 = require("@oozcitak/util");
/**
 * Adds the given item to the end of the set.
 *
 * @param set - a set
 * @param item - an item
 */
function append(set, item) {
    set.add(item);
}
/**
 * Extends a set by appending all items from another set.
 *
 * @param setA - a list to extend
 * @param setB - a list containing items to append to `setA`
 */
function extend(setA, setB) {
    setB.forEach(setA.add, setA);
}
/**
 * Inserts the given item to the start of the set.
 *
 * @param set - a set
 * @param item - an item
 */
function prepend(set, item) {
    const cloned = new Set(set);
    set.clear();
    set.add(item);
    cloned.forEach(set.add, set);
}
/**
 * Replaces the given item or all items matching condition with a new item.
 *
 * @param set - a set
 * @param conditionOrItem - an item to replace or a condition matching items
 * to replace
 * @param item - an item
 */
function replace(set, conditionOrItem, newItem) {
    const newSet = new Set();
    for (const oldItem of set) {
        if ((0, util_1.isFunction)(conditionOrItem)) {
            if (!!conditionOrItem.call(null, oldItem)) {
                newSet.add(newItem);
            }
            else {
                newSet.add(oldItem);
            }
        }
        else if (oldItem === conditionOrItem) {
            newSet.add(newItem);
        }
        else {
            newSet.add(oldItem);
        }
    }
    set.clear();
    newSet.forEach(set.add, set);
}
/**
 * Inserts the given item before the given index.
 *
 * @param set - a set
 * @param item - an item
 */
function insert(set, item, index) {
    const newSet = new Set();
    let i = 0;
    for (const oldItem of set) {
        if (i === index)
            newSet.add(item);
        newSet.add(oldItem);
        i++;
    }
    set.clear();
    newSet.forEach(set.add, set);
}
/**
 * Removes the given item or all items matching condition.
 *
 * @param set - a set
 * @param conditionOrItem - an item to remove or a condition matching items
 * to remove
 */
function remove(set, conditionOrItem) {
    if (!(0, util_1.isFunction)(conditionOrItem)) {
        set.delete(conditionOrItem);
    }
    else {
        const toRemove = [];
        for (const item of set) {
            if (!!conditionOrItem.call(null, item)) {
                toRemove.push(item);
            }
        }
        for (const oldItem of toRemove) {
            set.delete(oldItem);
        }
    }
}
/**
 * Removes all items from the set.
 */
function empty(set) {
    set.clear();
}
/**
 * Determines if the set contains the given item or any items matching
 * condition.
 *
 * @param set - a set
 * @param conditionOrItem - an item to a condition to match
 */
function contains(set, conditionOrItem) {
    if (!(0, util_1.isFunction)(conditionOrItem)) {
        return set.has(conditionOrItem);
    }
    else {
        for (const oldItem of set) {
            if (!!conditionOrItem.call(null, oldItem)) {
                return true;
            }
        }
    }
    return false;
}
/**
 * Returns the count of items in the set matching the given condition.
 *
 * @param set - a set
 * @param condition - an optional condition to match
 */
function size(set, condition) {
    if (condition === undefined) {
        return set.size;
    }
    else {
        let count = 0;
        for (const item of set) {
            if (!!condition.call(null, item)) {
                count++;
            }
        }
        return count;
    }
}
/**
 * Determines if the set is empty.
 *
 * @param set - a set
 */
function isEmpty(set) {
    return set.size === 0;
}
/**
 * Returns an iterator for the items of the set.
 *
 * @param set - a set
 * @param condition - an optional condition to match
 */
function* forEach(set, condition) {
    if (condition === undefined) {
        yield* set;
    }
    else {
        for (const item of set) {
            if (!!condition.call(null, item)) {
                yield item;
            }
        }
    }
}
/**
 * Creates and returns a shallow clone of set.
 *
 * @param set - a set
 */
function clone(set) {
    return new Set(set);
}
/**
 * Returns a new set containing items from the set sorted in ascending
 * order.
 *
 * @param set - a set
 * @param lessThanAlgo - a function that returns `true` if its first argument
 * is less than its second argument, and `false` otherwise.
 */
function sortInAscendingOrder(set, lessThanAlgo) {
    const list = new Array(...set);
    list.sort((itemA, itemB) => lessThanAlgo.call(null, itemA, itemB) ? -1 : 1);
    return new Set(list);
}
/**
 * Returns a new set containing items from the set sorted in descending
 * order.
 *
 * @param set - a set
 * @param lessThanAlgo - a function that returns `true` if its first argument
 * is less than its second argument, and `false` otherwise.
 */
function sortInDescendingOrder(set, lessThanAlgo) {
    const list = new Array(...set);
    list.sort((itemA, itemB) => lessThanAlgo.call(null, itemA, itemB) ? 1 : -1);
    return new Set(list);
}
/**
 * Determines if a set is a subset of another set.
 *
 * @param subset - a set
 * @param superset - a superset possibly containing all items from `subset`.
 */
function isSubsetOf(subset, superset) {
    for (const item of subset) {
        if (!superset.has(item))
            return false;
    }
    return true;
}
/**
 * Determines if a set is a superset of another set.
 *
 * @param superset - a set
 * @param subset - a subset possibly contained within `superset`.
 */
function isSupersetOf(superset, subset) {
    return isSubsetOf(subset, superset);
}
/**
 * Returns a new set with items that are contained in both sets.
 *
 * @param setA - a set
 * @param setB - a set
 */
function intersection(setA, setB) {
    const newSet = new Set();
    for (const item of setA) {
        if (setB.has(item))
            newSet.add(item);
    }
    return newSet;
}
/**
 * Returns a new set with items from both sets.
 *
 * @param setA - a set
 * @param setB - a set
 */
function union(setA, setB) {
    const newSet = new Set(setA);
    setB.forEach(newSet.add, newSet);
    return newSet;
}
/**
 * Returns a set of integers from `n` to `m` inclusive.
 *
 * @param n - starting number
 * @param m - ending number
 */
function range(n, m) {
    const newSet = new Set();
    for (let i = n; i <= m; i++) {
        newSet.add(i);
    }
    return newSet;
}
//# sourceMappingURL=Set.js.map