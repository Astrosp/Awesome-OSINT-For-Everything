"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.text_contiguousTextNodes = text_contiguousTextNodes;
exports.text_contiguousExclusiveTextNodes = text_contiguousExclusiveTextNodes;
exports.text_descendantTextContent = text_descendantTextContent;
exports.text_split = text_split;
const DOMImpl_1 = require("../dom/DOMImpl");
const util_1 = require("../util");
const DOMException_1 = require("../dom/DOMException");
const CreateAlgorithm_1 = require("./CreateAlgorithm");
const TreeAlgorithm_1 = require("./TreeAlgorithm");
const CharacterDataAlgorithm_1 = require("./CharacterDataAlgorithm");
const MutationAlgorithm_1 = require("./MutationAlgorithm");
/**
 * Returns node with its adjacent text and cdata node siblings.
 *
 * @param node - a node
 * @param self - whether to include node itself
 */
function text_contiguousTextNodes(node, self = false) {
    /**
     * The contiguous Text nodes of a node node are node, node’s previous
     * sibling Text node, if any, and its contiguous Text nodes, and node’s next
     * sibling Text node, if any, and its contiguous Text nodes, avoiding any
     * duplicates.
     */
    return {
        [Symbol.iterator]() {
            let currentNode = node;
            while (currentNode && util_1.Guard.isTextNode(currentNode._previousSibling)) {
                currentNode = currentNode._previousSibling;
            }
            return {
                next() {
                    if (currentNode && (!self && currentNode === node)) {
                        if (util_1.Guard.isTextNode(currentNode._nextSibling)) {
                            currentNode = currentNode._nextSibling;
                        }
                        else {
                            currentNode = null;
                        }
                    }
                    if (currentNode === null) {
                        return { done: true, value: null };
                    }
                    else {
                        const result = { done: false, value: currentNode };
                        if (util_1.Guard.isTextNode(currentNode._nextSibling)) {
                            currentNode = currentNode._nextSibling;
                        }
                        else {
                            currentNode = null;
                        }
                        return result;
                    }
                }
            };
        }
    };
}
/**
 * Returns node with its adjacent text node siblings.
 *
 * @param node - a node
 * @param self - whether to include node itself
 */
function text_contiguousExclusiveTextNodes(node, self = false) {
    /**
     * The contiguous exclusive Text nodes of a node node are node, node’s
     * previous sibling exclusive Text node, if any, and its contiguous
     * exclusive Text nodes, and node’s next sibling exclusive Text node,
     * if any, and its contiguous exclusive Text nodes, avoiding any duplicates.
     */
    return {
        [Symbol.iterator]() {
            let currentNode = node;
            while (currentNode && util_1.Guard.isExclusiveTextNode(currentNode._previousSibling)) {
                currentNode = currentNode._previousSibling;
            }
            return {
                next() {
                    if (currentNode && (!self && currentNode === node)) {
                        if (util_1.Guard.isExclusiveTextNode(currentNode._nextSibling)) {
                            currentNode = currentNode._nextSibling;
                        }
                        else {
                            currentNode = null;
                        }
                    }
                    if (currentNode === null) {
                        return { done: true, value: null };
                    }
                    else {
                        const result = { done: false, value: currentNode };
                        if (util_1.Guard.isExclusiveTextNode(currentNode._nextSibling)) {
                            currentNode = currentNode._nextSibling;
                        }
                        else {
                            currentNode = null;
                        }
                        return result;
                    }
                }
            };
        }
    };
}
/**
 * Returns the concatenation of the data of all the Text node descendants of
 * node, in tree order.
 *
 * @param node - a node
 */
function text_descendantTextContent(node) {
    /**
     * The descendant text content of a node node is the concatenation of the
     * data of all the Text node descendants of node, in tree order.
     */
    let contents = '';
    let text = (0, TreeAlgorithm_1.tree_getFirstDescendantNode)(node, false, false, (e) => util_1.Guard.isTextNode(e));
    while (text !== null) {
        contents += text._data;
        text = (0, TreeAlgorithm_1.tree_getNextDescendantNode)(node, text, false, false, (e) => util_1.Guard.isTextNode(e));
    }
    return contents;
}
/**
 * Splits data at the given offset and returns the remainder as a text
 * node.
 *
 * @param node - a text node
 * @param offset - the offset at which to split the nodes.
 */
function text_split(node, offset) {
    /**
     * 1. Let length be node’s length.
     * 2. If offset is greater than length, then throw an "IndexSizeError"
     * DOMException.
     */
    const length = node._data.length;
    if (offset > length) {
        throw new DOMException_1.IndexSizeError();
    }
    /**
     * 3. Let count be length minus offset.
     * 4. Let new data be the result of substringing data with node node,
     * offset offset, and count count.
     * 5. Let new node be a new Text node, with the same node document as node.
     * Set new node’s data to new data.
     * 6. Let parent be node’s parent.
     * 7. If parent is not null, then:
     */
    const count = length - offset;
    const newData = (0, CharacterDataAlgorithm_1.characterData_substringData)(node, offset, count);
    const newNode = (0, CreateAlgorithm_1.create_text)(node._nodeDocument, newData);
    const parent = node._parent;
    if (parent !== null) {
        /**
         * 7.1. Insert new node into parent before node’s next sibling.
         */
        (0, MutationAlgorithm_1.mutation_insert)(newNode, parent, node._nextSibling);
        /**
         * 7.2. For each live range whose start node is node and start offset is
         * greater than offset, set its start node to new node and decrease its
         * start offset by offset.
         * 7.3. For each live range whose end node is node and end offset is greater
         * than offset, set its end node to new node and decrease its end offset
         * by offset.
         * 7.4. For each live range whose start node is parent and start offset is
         * equal to the index of node plus 1, increase its start offset by 1.
         * 7.5. For each live range whose end node is parent and end offset is equal
         * to the index of node plus 1, increase its end offset by 1.
         */
        for (const range of DOMImpl_1.dom.rangeList) {
            if (range._start[0] === node && range._start[1] > offset) {
                range._start[0] = newNode;
                range._start[1] -= offset;
            }
            if (range._end[0] === node && range._end[1] > offset) {
                range._end[0] = newNode;
                range._end[1] -= offset;
            }
            const index = (0, TreeAlgorithm_1.tree_index)(node);
            if (range._start[0] === parent && range._start[1] === index + 1) {
                range._start[1]++;
            }
            if (range._end[0] === parent && range._end[1] === index + 1) {
                range._end[1]++;
            }
        }
    }
    /**
     * 8. Replace data with node node, offset offset, count count, and data
     * the empty string.
     * 9. Return new node.
     */
    (0, CharacterDataAlgorithm_1.characterData_replaceData)(node, offset, count, '');
    return newNode;
}
//# sourceMappingURL=TextAlgorithm.js.map