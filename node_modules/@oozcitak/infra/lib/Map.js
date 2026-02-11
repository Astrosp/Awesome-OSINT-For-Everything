"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = get;
exports.set = set;
exports.remove = remove;
exports.contains = contains;
exports.keys = keys;
exports.values = values;
exports.size = size;
exports.isEmpty = isEmpty;
exports.forEach = forEach;
exports.clone = clone;
exports.sortInAscendingOrder = sortInAscendingOrder;
exports.sortInDescendingOrder = sortInDescendingOrder;
const util_1 = require("@oozcitak/util");
/**
 * Gets the value corresponding to the given key.
 *
 * @param map - a map
 * @param key - a key
 */
function get(map, key) {
    return map.get(key);
}
/**
 * Sets the value corresponding to the given key.
 *
 * @param map - a map
 * @param key - a key
 * @param val - a value
 */
function set(map, key, val) {
    map.set(key, val);
}
/**
 * Removes the item with the given key or all items matching condition.
 *
 * @param map - a map
 * @param conditionOrItem - the key of an item to remove or a condition matching
 * items to remove
 */
function remove(map, conditionOrItem) {
    if (!(0, util_1.isFunction)(conditionOrItem)) {
        map.delete(conditionOrItem);
    }
    else {
        const toRemove = [];
        for (const item of map) {
            if (!!conditionOrItem.call(null, item)) {
                toRemove.push(item[0]);
            }
        }
        for (const key of toRemove) {
            map.delete(key);
        }
    }
}
/**
 * Determines if the map contains a value with the given key.
 *
 * @param map - a map
 * @param conditionOrItem - the key of an item to match or a condition matching
 * items
 */
function contains(map, conditionOrItem) {
    if (!(0, util_1.isFunction)(conditionOrItem)) {
        return map.has(conditionOrItem);
    }
    else {
        for (const item of map) {
            if (!!conditionOrItem.call(null, item)) {
                return true;
            }
        }
        return false;
    }
}
/**
 * Gets the keys of the map.
 *
 * @param map - a map
 */
function keys(map) {
    return new Set(map.keys());
}
/**
 * Gets the values of the map.
 *
 * @param map - a map
 */
function values(map) {
    return [...map.values()];
}
/**
 * Gets the size of the map.
 *
 * @param map - a map
 * @param condition - an optional condition to match
 */
function size(map, condition) {
    if (condition === undefined) {
        return map.size;
    }
    else {
        let count = 0;
        for (const item of map) {
            if (!!condition.call(null, item)) {
                count++;
            }
        }
        return count;
    }
}
/**
 * Determines if the map is empty.
 *
 * @param map - a map
 */
function isEmpty(map) {
    return map.size === 0;
}
/**
 * Returns an iterator for the items of the map.
 *
 * @param map - a map
 * @param condition - an optional condition to match
 */
function* forEach(map, condition) {
    if (condition === undefined) {
        yield* map;
    }
    else {
        for (const item of map) {
            if (!!condition.call(null, item)) {
                yield item;
            }
        }
    }
}
/**
 * Creates and returns a shallow clone of map.
 *
 * @param map - a map
 */
function clone(map) {
    return new Map(map);
}
/**
 * Returns a new map containing items from the map sorted in ascending
 * order.
 *
 * @param map - a map
 * @param lessThanAlgo - a function that returns `true` if its first argument
 * is less than its second argument, and `false` otherwise.
 */
function sortInAscendingOrder(map, lessThanAlgo) {
    const list = new Array(...map);
    list.sort((itemA, itemB) => lessThanAlgo.call(null, itemA, itemB) ? -1 : 1);
    return new Map(list);
}
/**
 * Returns a new map containing items from the map sorted in descending
 * order.
 *
 * @param map - a map
 * @param lessThanAlgo - a function that returns `true` if its first argument
 * is less than its second argument, and `false` otherwise.
 */
function sortInDescendingOrder(map, lessThanAlgo) {
    const list = new Array(...map);
    list.sort((itemA, itemB) => lessThanAlgo.call(null, itemA, itemB) ? 1 : -1);
    return new Map(list);
}
//# sourceMappingURL=Map.js.map