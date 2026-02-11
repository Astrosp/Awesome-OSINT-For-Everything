"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.document_elementInterface = document_elementInterface;
exports.document_internalCreateElementNS = document_internalCreateElementNS;
exports.document_adopt = document_adopt;
const DOMImpl_1 = require("../dom/DOMImpl");
const util_1 = require("../util");
const util_2 = require("@oozcitak/util");
const ElementImpl_1 = require("../dom/ElementImpl");
const CustomElementAlgorithm_1 = require("./CustomElementAlgorithm");
const TreeAlgorithm_1 = require("./TreeAlgorithm");
const NamespaceAlgorithm_1 = require("./NamespaceAlgorithm");
const DOMAlgorithm_1 = require("./DOMAlgorithm");
const ElementAlgorithm_1 = require("./ElementAlgorithm");
const MutationAlgorithm_1 = require("./MutationAlgorithm");
/**
 * Returns an element interface for the given name and namespace.
 *
 * @param name - element name
 * @param namespace - namespace
 */
function document_elementInterface(name, namespace) {
    return ElementImpl_1.ElementImpl;
}
/**
 * Creates a new element node.
 * See: https://dom.spec.whatwg.org/#internal-createelementns-steps
 *
 * @param document - owner document
 * @param namespace - element namespace
 * @param qualifiedName - qualified name
 * @param options - element options
 */
function document_internalCreateElementNS(document, namespace, qualifiedName, options) {
    /**
     * 1. Let namespace, prefix, and localName be the result of passing
     * namespace and qualifiedName to validate and extract.
     * 2. Let is be null.
     * 3. If options is a dictionary and options’s is is present, then set
     * is to it.
     * 4. Return the result of creating an element given document, localName,
     * namespace, prefix, is, and with the synchronous custom elements flag set.
     */
    const [ns, prefix, localName] = (0, NamespaceAlgorithm_1.namespace_validateAndExtract)(namespace, qualifiedName);
    let is = null;
    if (options !== undefined) {
        if ((0, util_2.isString)(options)) {
            is = options;
        }
        else {
            is = options.is;
        }
    }
    return (0, ElementAlgorithm_1.element_createAnElement)(document, localName, ns, prefix, is, true);
}
/**
 * Removes `node` and its subtree from its document and changes
 * its owner document to `document` so that it can be inserted
 * into `document`.
 *
 * @param node - the node to move
 * @param document - document to receive the node and its subtree
 */
function document_adopt(node, document) {
    // Optimize for common case of inserting a fresh node
    if (node._nodeDocument === document && node._parent === null) {
        return;
    }
    /**
     * 1. Let oldDocument be node’s node document.
     * 2. If node’s parent is not null, remove node from its parent.
     */
    const oldDocument = node._nodeDocument;
    if (node._parent)
        (0, MutationAlgorithm_1.mutation_remove)(node, node._parent);
    /**
     * 3. If document is not oldDocument, then:
     */
    if (document !== oldDocument) {
        /**
         * 3.1. For each inclusiveDescendant in node’s shadow-including inclusive
         * descendants:
         */
        let inclusiveDescendant = (0, TreeAlgorithm_1.tree_getFirstDescendantNode)(node, true, true);
        while (inclusiveDescendant !== null) {
            /**
             * 3.1.1. Set inclusiveDescendant’s node document to document.
             * 3.1.2. If inclusiveDescendant is an element, then set the node
             * document of each attribute in inclusiveDescendant’s attribute list
             * to document.
             */
            inclusiveDescendant._nodeDocument = document;
            if (util_1.Guard.isElementNode(inclusiveDescendant)) {
                for (const attr of inclusiveDescendant._attributeList._asArray()) {
                    attr._nodeDocument = document;
                }
            }
            /**
             * 3.2. For each inclusiveDescendant in node's shadow-including
             * inclusive descendants that is custom, enqueue a custom
             * element callback reaction with inclusiveDescendant,
             * callback name "adoptedCallback", and an argument list
             * containing oldDocument and document.
             */
            if (DOMImpl_1.dom.features.customElements) {
                if (util_1.Guard.isElementNode(inclusiveDescendant) &&
                    inclusiveDescendant._customElementState === "custom") {
                    (0, CustomElementAlgorithm_1.customElement_enqueueACustomElementCallbackReaction)(inclusiveDescendant, "adoptedCallback", [oldDocument, document]);
                }
            }
            /**
             * 3.3. For each inclusiveDescendant in node’s shadow-including
             * inclusive descendants, in shadow-including tree order, run the
             * adopting steps with inclusiveDescendant and oldDocument.
             */
            if (DOMImpl_1.dom.features.steps) {
                (0, DOMAlgorithm_1.dom_runAdoptingSteps)(inclusiveDescendant, oldDocument);
            }
            inclusiveDescendant = (0, TreeAlgorithm_1.tree_getNextDescendantNode)(node, inclusiveDescendant, true, true);
        }
    }
}
//# sourceMappingURL=DocumentAlgorithm.js.map