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
const util_1 = require("@oozcitak/util");
/**
 * Adds the given item to the end of the list.
 *
 * @param list - a list
 * @param item - an item
 */
function append(list, item) {
    list.push(item);
}
/**
 * Extends a list by appending all items from another list.
 *
 * @param listA - a list to extend
 * @param listB - a list containing items to append to `listA`
 */
function extend(listA, listB) {
    listA.push(...listB);
}
/**
 * Inserts the given item to the start of the list.
 *
 * @param list - a list
 * @param item - an item
 */
function prepend(list, item) {
    list.unshift(item);
}
/**
 * Replaces the given item or all items matching condition with a new item.
 *
 * @param list - a list
 * @param conditionOrItem - an item to replace or a condition matching items
 * to replace
 * @param item - an item
 */
function replace(list, conditionOrItem, newItem) {
    let i = 0;
    for (const oldItem of list) {
        if ((0, util_1.isFunction)(conditionOrItem)) {
            if (!!conditionOrItem.call(null, oldItem)) {
                list[i] = newItem;
            }
        }
        else if (oldItem === conditionOrItem) {
            list[i] = newItem;
            return;
        }
        i++;
    }
}
/**
 * Inserts the given item before the given index.
 *
 * @param list - a list
 * @param item - an item
 */
function insert(list, item, index) {
    list.splice(index, 0, item);
}
/**
 * Removes the given item or all items matching condition.
 *
 * @param list - a list
 * @param conditionOrItem - an item to remove or a condition matching items
 * to remove
 */
function remove(list, conditionOrItem) {
    let i = list.length;
    while (i--) {
        const oldItem = list[i];
        if ((0, util_1.isFunction)(conditionOrItem)) {
            if (!!conditionOrItem.call(null, oldItem)) {
                list.splice(i, 1);
            }
        }
        else if (oldItem === conditionOrItem) {
            list.splice(i, 1);
            return;
        }
    }
}
/**
 * Removes all items from the list.
 */
function empty(list) {
    list.length = 0;
}
/**
 * Determines if the list contains the given item or any items matching
 * condition.
 *
 * @param list - a list
 * @param conditionOrItem - an item to a condition to match
 */
function contains(list, conditionOrItem) {
    for (const oldItem of list) {
        if ((0, util_1.isFunction)(conditionOrItem)) {
            if (!!conditionOrItem.call(null, oldItem)) {
                return true;
            }
        }
        else if (oldItem === conditionOrItem) {
            return true;
        }
    }
    return false;
}
/**
 * Returns the count of items in the list matching the given condition.
 *
 * @param list - a list
 * @param condition - an optional condition to match
 */
function size(list, condition) {
    if (condition === undefined) {
        return list.length;
    }
    else {
        let count = 0;
        for (const item of list) {
            if (!!condition.call(null, item)) {
                count++;
            }
        }
        return count;
    }
}
/**
 * Determines if the list is empty.
 *
 * @param list - a list
 */
function isEmpty(list) {
    return list.length === 0;
}
/**
 * Returns an iterator for the items of the list.
 *
 * @param list - a list
 * @param condition - an optional condition to match
 */
function* forEach(list, condition) {
    if (condition === undefined) {
        yield* list;
    }
    else {
        for (const item of list) {
            if (!!condition.call(null, item)) {
                yield item;
            }
        }
    }
}
/**
 * Creates and returns a shallow clone of list.
 *
 * @param list - a list
 */
function clone(list) {
    return new Array(...list);
}
/**
 * Returns a new list containing items from the list sorted in ascending
 * order.
 *
 * @param list - a list
 * @param lessThanAlgo - a function that returns `true` if its first argument
 * is less than its second argument, and `false` otherwise.
 */
function sortInAscendingOrder(list, lessThanAlgo) {
    return list.sort((itemA, itemB) => lessThanAlgo.call(null, itemA, itemB) ? -1 : 1);
}
/**
 * Returns a new list containing items from the list sorted in descending
 * order.
 *
 * @param list - a list
 * @param lessThanAlgo - a function that returns `true` if its first argument
 * is less than its second argument, and `false` otherwise.
 */
function sortInDescendingOrder(list, lessThanAlgo) {
    return list.sort((itemA, itemB) => lessThanAlgo.call(null, itemA, itemB) ? 1 : -1);
}
//# sourceMappingURL=List.js.map