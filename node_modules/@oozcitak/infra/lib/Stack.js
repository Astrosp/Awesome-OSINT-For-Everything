"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.push = push;
exports.pop = pop;
/**
 * Pushes the given item to the stack.
 *
 * @param list - a list
 * @param item - an item
 */
function push(list, item) {
    list.push(item);
}
/**
 * Pops and returns an item from the stack.
 *
 * @param list - a list
 */
function pop(list) {
    return list.pop() || null;
}
//# sourceMappingURL=Stack.js.map