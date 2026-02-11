"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enqueue = enqueue;
exports.dequeue = dequeue;
/**
 * Appends the given item to the queue.
 *
 * @param list - a list
 * @param item - an item
 */
function enqueue(list, item) {
    list.push(item);
}
/**
 * Removes and returns an item from the queue.
 *
 * @param list - a list
 */
function dequeue(list) {
    return list.shift() || null;
}
//# sourceMappingURL=Queue.js.map