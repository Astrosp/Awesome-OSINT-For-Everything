"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parentNode_convertNodesIntoANode = parentNode_convertNodesIntoANode;
const util_1 = require("@oozcitak/util");
const CreateAlgorithm_1 = require("./CreateAlgorithm");
/**
 * Converts the given nodes or strings into a node (if `nodes` has
 * only one element) or a document fragment.
 *
 * @param nodes - the array of nodes or strings,
 * @param document - owner document
 */
function parentNode_convertNodesIntoANode(nodes, document) {
    /**
     * 1. Let node be null.
     * 2. Replace each string in nodes with a new Text node whose data is the
     * string and node document is document.
     */
    let node = null;
    for (let i = 0; i < nodes.length; i++) {
        const item = nodes[i];
        if ((0, util_1.isString)(item)) {
            const text = (0, CreateAlgorithm_1.create_text)(document, item);
            nodes[i] = text;
        }
    }
    /**
     * 3. If nodes contains one node, set node to that node.
     * 4. Otherwise, set node to a new DocumentFragment whose node document is
     * document, and then append each node in nodes, if any, to it.
     */
    if (nodes.length === 1) {
        node = nodes[0];
    }
    else {
        node = (0, CreateAlgorithm_1.create_documentFragment)(document);
        const ns = node;
        for (const item of nodes) {
            ns.appendChild(item);
        }
    }
    /**
     * 5. Return node.
     */
    return node;
}
//# sourceMappingURL=ParentNodeAlgorithm.js.map