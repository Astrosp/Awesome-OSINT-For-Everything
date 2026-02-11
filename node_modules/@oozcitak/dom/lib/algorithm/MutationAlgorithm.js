"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mutation_ensurePreInsertionValidity = mutation_ensurePreInsertionValidity;
exports.mutation_preInsert = mutation_preInsert;
exports.mutation_insert = mutation_insert;
exports.mutation_append = mutation_append;
exports.mutation_replace = mutation_replace;
exports.mutation_replaceAll = mutation_replaceAll;
exports.mutation_preRemove = mutation_preRemove;
exports.mutation_remove = mutation_remove;
const DOMImpl_1 = require("../dom/DOMImpl");
const DOMException_1 = require("../dom/DOMException");
const interfaces_1 = require("../dom/interfaces");
const util_1 = require("../util");
const util_2 = require("@oozcitak/util");
const infra_1 = require("@oozcitak/infra");
const CustomElementAlgorithm_1 = require("./CustomElementAlgorithm");
const TreeAlgorithm_1 = require("./TreeAlgorithm");
const NodeIteratorAlgorithm_1 = require("./NodeIteratorAlgorithm");
const ShadowTreeAlgorithm_1 = require("./ShadowTreeAlgorithm");
const MutationObserverAlgorithm_1 = require("./MutationObserverAlgorithm");
const DOMAlgorithm_1 = require("./DOMAlgorithm");
const DocumentAlgorithm_1 = require("./DocumentAlgorithm");
/**
 * Ensures pre-insertion validity of a node into a parent before a
 * child.
 *
 * @param node - node to insert
 * @param parent - parent node to receive node
 * @param child - child node to insert node before
 */
function mutation_ensurePreInsertionValidity(node, parent, child) {
    const parentNodeType = parent._nodeType;
    const nodeNodeType = node._nodeType;
    const childNodeType = child ? child._nodeType : null;
    /**
     * 1. If parent is not a Document, DocumentFragment, or Element node,
     * throw a "HierarchyRequestError" DOMException.
     */
    if (parentNodeType !== interfaces_1.NodeType.Document &&
        parentNodeType !== interfaces_1.NodeType.DocumentFragment &&
        parentNodeType !== interfaces_1.NodeType.Element)
        throw new DOMException_1.HierarchyRequestError(`Only document, document fragment and element nodes can contain child nodes. Parent node is ${parent.nodeName}.`);
    /**
     * 2. If node is a host-including inclusive ancestor of parent, throw a
     * "HierarchyRequestError" DOMException.
     */
    if ((0, TreeAlgorithm_1.tree_isHostIncludingAncestorOf)(parent, node, true))
        throw new DOMException_1.HierarchyRequestError(`The node to be inserted cannot be an inclusive ancestor of parent node. Node is ${node.nodeName}, parent node is ${parent.nodeName}.`);
    /**
     * 3. If child is not null and its parent is not parent, then throw a
     * "NotFoundError" DOMException.
     */
    if (child !== null && child._parent !== parent)
        throw new DOMException_1.NotFoundError(`The reference child node cannot be found under parent node. Child node is ${child.nodeName}, parent node is ${parent.nodeName}.`);
    /**
     * 4. If node is not a DocumentFragment, DocumentType, Element, Text,
     * ProcessingInstruction, or Comment node, throw a "HierarchyRequestError"
     * DOMException.
     */
    if (nodeNodeType !== interfaces_1.NodeType.DocumentFragment &&
        nodeNodeType !== interfaces_1.NodeType.DocumentType &&
        nodeNodeType !== interfaces_1.NodeType.Element &&
        nodeNodeType !== interfaces_1.NodeType.Text &&
        nodeNodeType !== interfaces_1.NodeType.ProcessingInstruction &&
        nodeNodeType !== interfaces_1.NodeType.CData &&
        nodeNodeType !== interfaces_1.NodeType.Comment)
        throw new DOMException_1.HierarchyRequestError(`Only document fragment, document type, element, text, processing instruction, cdata section or comment nodes can be inserted. Node is ${node.nodeName}.`);
    /**
     * 5. If either node is a Text node and parent is a document, or node is a
     * doctype and parent is not a document, throw a "HierarchyRequestError"
     * DOMException.
     */
    if (nodeNodeType === interfaces_1.NodeType.Text &&
        parentNodeType === interfaces_1.NodeType.Document)
        throw new DOMException_1.HierarchyRequestError(`Cannot insert a text node as a child of a document node. Node is ${node.nodeName}.`);
    if (nodeNodeType === interfaces_1.NodeType.DocumentType &&
        parentNodeType !== interfaces_1.NodeType.Document)
        throw new DOMException_1.HierarchyRequestError(`A document type node can only be inserted under a document node. Parent node is ${parent.nodeName}.`);
    /**
     * 6. If parent is a document, and any of the statements below, switched on
     * node, are true, throw a "HierarchyRequestError" DOMException.
     * - DocumentFragment node
     * If node has more than one element child or has a Text node child.
     * Otherwise, if node has one element child and either parent has an element
     * child, child is a doctype, or child is not null and a doctype is
     * following child.
     * - element
     * parent has an element child, child is a doctype, or child is not null and
     * a doctype is following child.
     * - doctype
     * parent has a doctype child, child is non-null and an element is preceding
     * child, or child is null and parent has an element child.
     */
    if (parentNodeType === interfaces_1.NodeType.Document) {
        if (nodeNodeType === interfaces_1.NodeType.DocumentFragment) {
            let eleCount = 0;
            for (const childNode of node._children) {
                if (childNode._nodeType === interfaces_1.NodeType.Element)
                    eleCount++;
                else if (childNode._nodeType === interfaces_1.NodeType.Text)
                    throw new DOMException_1.HierarchyRequestError(`Cannot insert text a node as a child of a document node. Node is ${childNode.nodeName}.`);
            }
            if (eleCount > 1) {
                throw new DOMException_1.HierarchyRequestError(`A document node can only have one document element node. Document fragment to be inserted has ${eleCount} element nodes.`);
            }
            else if (eleCount === 1) {
                for (const ele of parent._children) {
                    if (ele._nodeType === interfaces_1.NodeType.Element)
                        throw new DOMException_1.HierarchyRequestError(`The document node already has a document element node.`);
                }
                if (child) {
                    if (childNodeType === interfaces_1.NodeType.DocumentType)
                        throw new DOMException_1.HierarchyRequestError(`Cannot insert an element node before a document type node.`);
                    let doctypeChild = child._nextSibling;
                    while (doctypeChild) {
                        if (doctypeChild._nodeType === interfaces_1.NodeType.DocumentType)
                            throw new DOMException_1.HierarchyRequestError(`Cannot insert an element node before a document type node.`);
                        doctypeChild = doctypeChild._nextSibling;
                    }
                }
            }
        }
        else if (nodeNodeType === interfaces_1.NodeType.Element) {
            for (const ele of parent._children) {
                if (ele._nodeType === interfaces_1.NodeType.Element)
                    throw new DOMException_1.HierarchyRequestError(`Document already has a document element node. Node is ${node.nodeName}.`);
            }
            if (child) {
                if (childNodeType === interfaces_1.NodeType.DocumentType)
                    throw new DOMException_1.HierarchyRequestError(`Cannot insert an element node before a document type node. Node is ${node.nodeName}.`);
                let doctypeChild = child._nextSibling;
                while (doctypeChild) {
                    if (doctypeChild._nodeType === interfaces_1.NodeType.DocumentType)
                        throw new DOMException_1.HierarchyRequestError(`Cannot insert an element node before a document type node. Node is ${node.nodeName}.`);
                    doctypeChild = doctypeChild._nextSibling;
                }
            }
        }
        else if (nodeNodeType === interfaces_1.NodeType.DocumentType) {
            for (const ele of parent._children) {
                if (ele._nodeType === interfaces_1.NodeType.DocumentType)
                    throw new DOMException_1.HierarchyRequestError(`Document already has a document type node. Node is ${node.nodeName}.`);
            }
            if (child) {
                let elementChild = child._previousSibling;
                while (elementChild) {
                    if (elementChild._nodeType === interfaces_1.NodeType.Element)
                        throw new DOMException_1.HierarchyRequestError(`Cannot insert a document type node before an element node. Node is ${node.nodeName}.`);
                    elementChild = elementChild._previousSibling;
                }
            }
            else {
                let elementChild = parent._firstChild;
                while (elementChild) {
                    if (elementChild._nodeType === interfaces_1.NodeType.Element)
                        throw new DOMException_1.HierarchyRequestError(`Cannot insert a document type node before an element node. Node is ${node.nodeName}.`);
                    elementChild = elementChild._nextSibling;
                }
            }
        }
    }
}
/**
 * Ensures pre-insertion validity of a node into a parent before a
 * child, then adopts the node to the tree and inserts it.
 *
 * @param node - node to insert
 * @param parent - parent node to receive node
 * @param child - child node to insert node before
 */
function mutation_preInsert(node, parent, child) {
    /**
     * 1. Ensure pre-insertion validity of node into parent before child.
     * 2. Let reference child be child.
     * 3. If reference child is node, set it to node’s next sibling.
     * 4. Adopt node into parent’s node document.
     * 5. Insert node into parent before reference child.
     * 6. Return node.
     */
    mutation_ensurePreInsertionValidity(node, parent, child);
    let referenceChild = child;
    if (referenceChild === node)
        referenceChild = node._nextSibling;
    (0, DocumentAlgorithm_1.document_adopt)(node, parent._nodeDocument);
    mutation_insert(node, parent, referenceChild);
    return node;
}
/**
 * Inserts a node into a parent node before the given child node.
 *
 * @param node - node to insert
 * @param parent - parent node to receive node
 * @param child - child node to insert node before
 * @param suppressObservers - whether to notify observers
 */
function mutation_insert(node, parent, child, suppressObservers) {
    // Optimized common case
    if (child === null && node._nodeType !== interfaces_1.NodeType.DocumentFragment) {
        mutation_insert_single(node, parent, suppressObservers);
        return;
    }
    /**
     * 1. Let count be the number of children of node if it is a
     * DocumentFragment node, and one otherwise.
     */
    const count = (node._nodeType === interfaces_1.NodeType.DocumentFragment ?
        node._children.size : 1);
    /**
     * 2. If child is non-null, then:
     */
    if (child !== null) {
        /**
         * 2.1. For each live range whose start node is parent and start
         * offset is greater than child's index, increase its start
         * offset by count.
         * 2.2. For each live range whose end node is parent and end
         * offset is greater than child's index, increase its end
         * offset by count.
         */
        if (DOMImpl_1.dom.rangeList.size !== 0) {
            const index = (0, TreeAlgorithm_1.tree_index)(child);
            for (const range of DOMImpl_1.dom.rangeList) {
                if (range._start[0] === parent && range._start[1] > index) {
                    range._start[1] += count;
                }
                if (range._end[0] === parent && range._end[1] > index) {
                    range._end[1] += count;
                }
            }
        }
    }
    /**
     * 3. Let nodes be node’s children, if node is a DocumentFragment node;
     * otherwise « node ».
     */
    const nodes = node._nodeType === interfaces_1.NodeType.DocumentFragment ?
        new Array(...node._children) : [node];
    /**
     * 4. If node is a DocumentFragment node, remove its children with the
     * suppress observers flag set.
     */
    if (node._nodeType === interfaces_1.NodeType.DocumentFragment) {
        while (node._firstChild) {
            mutation_remove(node._firstChild, node, true);
        }
    }
    /**
     * 5. If node is a DocumentFragment node, then queue a tree mutation record
     * for node with « », nodes, null, and null.
     */
    if (DOMImpl_1.dom.features.mutationObservers) {
        if (node._nodeType === interfaces_1.NodeType.DocumentFragment) {
            (0, MutationObserverAlgorithm_1.observer_queueTreeMutationRecord)(node, [], nodes, null, null);
        }
    }
    /**
     * 6. Let previousSibling be child’s previous sibling or parent’s last
     * child if child is null.
     */
    const previousSibling = (child ? child._previousSibling : parent._lastChild);
    let index = child === null ? -1 : (0, TreeAlgorithm_1.tree_index)(child);
    /**
     * 7. For each node in nodes, in tree order:
     */
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (util_1.Guard.isElementNode(node)) {
            // set document element node
            if (util_1.Guard.isDocumentNode(parent)) {
                parent._documentElement = node;
            }
            // mark that the document has namespaces
            if (!node._nodeDocument._hasNamespaces && (node._namespace !== null ||
                node._namespacePrefix !== null)) {
                node._nodeDocument._hasNamespaces = true;
            }
        }
        /**
         * 7.1. If child is null, then append node to parent’s children.
         * 7.2. Otherwise, insert node into parent’s children before child’s
         * index.
         */
        node._parent = parent;
        if (child === null) {
            infra_1.set.append(parent._children, node);
        }
        else {
            infra_1.set.insert(parent._children, node, index);
            index++;
        }
        // assign siblings and children for quick lookups
        if (parent._firstChild === null) {
            node._previousSibling = null;
            node._nextSibling = null;
            parent._firstChild = node;
            parent._lastChild = node;
        }
        else {
            const prev = (child ? child._previousSibling : parent._lastChild);
            const next = (child ? child : null);
            node._previousSibling = prev;
            node._nextSibling = next;
            if (prev)
                prev._nextSibling = node;
            if (next)
                next._previousSibling = node;
            if (!prev)
                parent._firstChild = node;
            if (!next)
                parent._lastChild = node;
        }
        /**
         * 7.3. If parent is a shadow host and node is a slotable, then
         * assign a slot for node.
         */
        if (DOMImpl_1.dom.features.slots) {
            if (parent._shadowRoot !== null && util_1.Guard.isSlotable(node)) {
                (0, ShadowTreeAlgorithm_1.shadowTree_assignASlot)(node);
            }
        }
        /**
         * 7.4. If node is a Text node, run the child text content change
         * steps for parent.
         */
        if (DOMImpl_1.dom.features.steps) {
            if (util_1.Guard.isTextNode(node)) {
                (0, DOMAlgorithm_1.dom_runChildTextContentChangeSteps)(parent);
            }
        }
        /**
         * 7.5. If parent's root is a shadow root, and parent is a slot
         * whose assigned nodes is the empty list, then run signal
         * a slot change for parent.
         */
        if (DOMImpl_1.dom.features.slots) {
            if (util_1.Guard.isShadowRoot((0, TreeAlgorithm_1.tree_rootNode)(parent)) &&
                util_1.Guard.isSlot(parent) && (0, util_2.isEmpty)(parent._assignedNodes)) {
                (0, ShadowTreeAlgorithm_1.shadowTree_signalASlotChange)(parent);
            }
        }
        /**
         * 7.6. Run assign slotables for a tree with node's root.
         */
        if (DOMImpl_1.dom.features.slots) {
            (0, ShadowTreeAlgorithm_1.shadowTree_assignSlotablesForATree)((0, TreeAlgorithm_1.tree_rootNode)(node));
        }
        /**
         * 7.7. For each shadow-including inclusive descendant
         * inclusiveDescendant of node, in shadow-including tree
         * order:
         */
        let inclusiveDescendant = (0, TreeAlgorithm_1.tree_getFirstDescendantNode)(node, true, true);
        while (inclusiveDescendant !== null) {
            /**
             * 7.7.1. Run the insertion steps with inclusiveDescendant.
             */
            if (DOMImpl_1.dom.features.steps) {
                (0, DOMAlgorithm_1.dom_runInsertionSteps)(inclusiveDescendant);
            }
            if (DOMImpl_1.dom.features.customElements) {
                /**
                 * 7.7.2. If inclusiveDescendant is connected, then:
                 */
                if (util_1.Guard.isElementNode(inclusiveDescendant) &&
                    (0, ShadowTreeAlgorithm_1.shadowTree_isConnected)(inclusiveDescendant)) {
                    if (util_1.Guard.isCustomElementNode(inclusiveDescendant)) {
                        /**
                         * 7.7.2.1. If inclusiveDescendant is custom, then enqueue a custom
                         * element callback reaction with inclusiveDescendant, callback name
                         * "connectedCallback", and an empty argument list.
                         */
                        (0, CustomElementAlgorithm_1.customElement_enqueueACustomElementCallbackReaction)(inclusiveDescendant, "connectedCallback", []);
                    }
                    else {
                        /**
                         * 7.7.2.2. Otherwise, try to upgrade inclusiveDescendant.
                         */
                        (0, CustomElementAlgorithm_1.customElement_tryToUpgrade)(inclusiveDescendant);
                    }
                }
            }
            inclusiveDescendant = (0, TreeAlgorithm_1.tree_getNextDescendantNode)(node, inclusiveDescendant, true, true);
        }
    }
    /**
     * 8. If suppress observers flag is unset, then queue a tree mutation record
     * for parent with nodes, « », previousSibling, and child.
     */
    if (DOMImpl_1.dom.features.mutationObservers) {
        if (!suppressObservers) {
            (0, MutationObserverAlgorithm_1.observer_queueTreeMutationRecord)(parent, nodes, [], previousSibling, child);
        }
    }
}
/**
 * Inserts a node into a parent node. Optimized routine for the common case where
 * node is not a document fragment node and it has no child nodes.
 *
 * @param node - node to insert
 * @param parent - parent node to receive node
 * @param suppressObservers - whether to notify observers
 */
function mutation_insert_single(node, parent, suppressObservers) {
    /**
     * 1. Let count be the number of children of node if it is a
     * DocumentFragment node, and one otherwise.
     * 2. If child is non-null, then:
     * 2.1. For each live range whose start node is parent and start
     * offset is greater than child's index, increase its start
     * offset by count.
     * 2.2. For each live range whose end node is parent and end
     * offset is greater than child's index, increase its end
     * offset by count.
     * 3. Let nodes be node’s children, if node is a DocumentFragment node;
     * otherwise « node ».
     * 4. If node is a DocumentFragment node, remove its children with the
     * suppress observers flag set.
     * 5. If node is a DocumentFragment node, then queue a tree mutation record
     * for node with « », nodes, null, and null.
     */
    /**
     * 6. Let previousSibling be child’s previous sibling or parent’s last
     * child if child is null.
     */
    const previousSibling = parent._lastChild;
    // set document element node
    if (util_1.Guard.isElementNode(node)) {
        // set document element node
        if (util_1.Guard.isDocumentNode(parent)) {
            parent._documentElement = node;
        }
        // mark that the document has namespaces
        if (!node._nodeDocument._hasNamespaces && (node._namespace !== null ||
            node._namespacePrefix !== null)) {
            node._nodeDocument._hasNamespaces = true;
        }
    }
    /**
     * 7. For each node in nodes, in tree order:
     * 7.1. If child is null, then append node to parent’s children.
     * 7.2. Otherwise, insert node into parent’s children before child’s
     * index.
     */
    node._parent = parent;
    parent._children.add(node);
    // assign siblings and children for quick lookups
    if (parent._firstChild === null) {
        node._previousSibling = null;
        node._nextSibling = null;
        parent._firstChild = node;
        parent._lastChild = node;
    }
    else {
        const prev = parent._lastChild;
        node._previousSibling = prev;
        node._nextSibling = null;
        if (prev)
            prev._nextSibling = node;
        if (!prev)
            parent._firstChild = node;
        parent._lastChild = node;
    }
    /**
     * 7.3. If parent is a shadow host and node is a slotable, then
     * assign a slot for node.
     */
    if (DOMImpl_1.dom.features.slots) {
        if (parent._shadowRoot !== null && util_1.Guard.isSlotable(node)) {
            (0, ShadowTreeAlgorithm_1.shadowTree_assignASlot)(node);
        }
    }
    /**
     * 7.4. If node is a Text node, run the child text content change
     * steps for parent.
     */
    if (DOMImpl_1.dom.features.steps) {
        if (util_1.Guard.isTextNode(node)) {
            (0, DOMAlgorithm_1.dom_runChildTextContentChangeSteps)(parent);
        }
    }
    /**
     * 7.5. If parent's root is a shadow root, and parent is a slot
     * whose assigned nodes is the empty list, then run signal
     * a slot change for parent.
     */
    if (DOMImpl_1.dom.features.slots) {
        if (util_1.Guard.isShadowRoot((0, TreeAlgorithm_1.tree_rootNode)(parent)) &&
            util_1.Guard.isSlot(parent) && (0, util_2.isEmpty)(parent._assignedNodes)) {
            (0, ShadowTreeAlgorithm_1.shadowTree_signalASlotChange)(parent);
        }
    }
    /**
     * 7.6. Run assign slotables for a tree with node's root.
     */
    if (DOMImpl_1.dom.features.slots) {
        (0, ShadowTreeAlgorithm_1.shadowTree_assignSlotablesForATree)((0, TreeAlgorithm_1.tree_rootNode)(node));
    }
    /**
     * 7.7. For each shadow-including inclusive descendant
     * inclusiveDescendant of node, in shadow-including tree
     * order:
     * 7.7.1. Run the insertion steps with inclusiveDescendant.
     */
    if (DOMImpl_1.dom.features.steps) {
        (0, DOMAlgorithm_1.dom_runInsertionSteps)(node);
    }
    if (DOMImpl_1.dom.features.customElements) {
        /**
         * 7.7.2. If inclusiveDescendant is connected, then:
         */
        if (util_1.Guard.isElementNode(node) &&
            (0, ShadowTreeAlgorithm_1.shadowTree_isConnected)(node)) {
            if (util_1.Guard.isCustomElementNode(node)) {
                /**
                 * 7.7.2.1. If inclusiveDescendant is custom, then enqueue a custom
                 * element callback reaction with inclusiveDescendant, callback name
                 * "connectedCallback", and an empty argument list.
                 */
                (0, CustomElementAlgorithm_1.customElement_enqueueACustomElementCallbackReaction)(node, "connectedCallback", []);
            }
            else {
                /**
                 * 7.7.2.2. Otherwise, try to upgrade inclusiveDescendant.
                 */
                (0, CustomElementAlgorithm_1.customElement_tryToUpgrade)(node);
            }
        }
    }
    /**
     * 8. If suppress observers flag is unset, then queue a tree mutation record
     * for parent with nodes, « », previousSibling, and child.
     */
    if (DOMImpl_1.dom.features.mutationObservers) {
        if (!suppressObservers) {
            (0, MutationObserverAlgorithm_1.observer_queueTreeMutationRecord)(parent, [node], [], previousSibling, null);
        }
    }
}
/**
 * Appends a node to the children of a parent node.
 *
 * @param node - a node
 * @param parent - the parent to receive node
 */
function mutation_append(node, parent) {
    /**
     * To append a node to a parent, pre-insert node into parent before null.
     */
    return mutation_preInsert(node, parent, null);
}
/**
 * Replaces a node with another node.
 *
 * @param child - child node to remove
 * @param node - node to insert
 * @param parent - parent node to receive node
 */
function mutation_replace(child, node, parent) {
    /**
     * 1. If parent is not a Document, DocumentFragment, or Element node,
     * throw a "HierarchyRequestError" DOMException.
     */
    if (parent._nodeType !== interfaces_1.NodeType.Document &&
        parent._nodeType !== interfaces_1.NodeType.DocumentFragment &&
        parent._nodeType !== interfaces_1.NodeType.Element)
        throw new DOMException_1.HierarchyRequestError(`Only document, document fragment and element nodes can contain child nodes. Parent node is ${parent.nodeName}.`);
    /**
     * 2. If node is a host-including inclusive ancestor of parent, throw a
     * "HierarchyRequestError" DOMException.
     */
    if ((0, TreeAlgorithm_1.tree_isHostIncludingAncestorOf)(parent, node, true))
        throw new DOMException_1.HierarchyRequestError(`The node to be inserted cannot be an ancestor of parent node. Node is ${node.nodeName}, parent node is ${parent.nodeName}.`);
    /**
     * 3. If child’s parent is not parent, then throw a "NotFoundError"
     * DOMException.
     */
    if (child._parent !== parent)
        throw new DOMException_1.NotFoundError(`The reference child node cannot be found under parent node. Child node is ${child.nodeName}, parent node is ${parent.nodeName}.`);
    /**
     * 4. If node is not a DocumentFragment, DocumentType, Element, Text,
     * ProcessingInstruction, or Comment node, throw a "HierarchyRequestError"
     * DOMException.
     */
    if (node._nodeType !== interfaces_1.NodeType.DocumentFragment &&
        node._nodeType !== interfaces_1.NodeType.DocumentType &&
        node._nodeType !== interfaces_1.NodeType.Element &&
        node._nodeType !== interfaces_1.NodeType.Text &&
        node._nodeType !== interfaces_1.NodeType.ProcessingInstruction &&
        node._nodeType !== interfaces_1.NodeType.CData &&
        node._nodeType !== interfaces_1.NodeType.Comment)
        throw new DOMException_1.HierarchyRequestError(`Only document fragment, document type, element, text, processing instruction, cdata section or comment nodes can be inserted. Node is ${node.nodeName}.`);
    /**
     * 5. If either node is a Text node and parent is a document, or node is a
     * doctype and parent is not a document, throw a "HierarchyRequestError"
     * DOMException.
     */
    if (node._nodeType === interfaces_1.NodeType.Text &&
        parent._nodeType === interfaces_1.NodeType.Document)
        throw new DOMException_1.HierarchyRequestError(`Cannot insert a text node as a child of a document node. Node is ${node.nodeName}.`);
    if (node._nodeType === interfaces_1.NodeType.DocumentType &&
        parent._nodeType !== interfaces_1.NodeType.Document)
        throw new DOMException_1.HierarchyRequestError(`A document type node can only be inserted under a document node. Parent node is ${parent.nodeName}.`);
    /**
     * 6. If parent is a document, and any of the statements below, switched on
     * node, are true, throw a "HierarchyRequestError" DOMException.
     * - DocumentFragment node
     * If node has more than one element child or has a Text node child.
     * Otherwise, if node has one element child and either parent has an element
     * child that is not child or a doctype is following child.
     * - element
     * parent has an element child that is not child or a doctype is
     * following child.
     * - doctype
     * parent has a doctype child that is not child, or an element is
     * preceding child.
     */
    if (parent._nodeType === interfaces_1.NodeType.Document) {
        if (node._nodeType === interfaces_1.NodeType.DocumentFragment) {
            let eleCount = 0;
            for (const childNode of node._children) {
                if (childNode._nodeType === interfaces_1.NodeType.Element)
                    eleCount++;
                else if (childNode._nodeType === interfaces_1.NodeType.Text)
                    throw new DOMException_1.HierarchyRequestError(`Cannot insert text a node as a child of a document node. Node is ${childNode.nodeName}.`);
            }
            if (eleCount > 1) {
                throw new DOMException_1.HierarchyRequestError(`A document node can only have one document element node. Document fragment to be inserted has ${eleCount} element nodes.`);
            }
            else if (eleCount === 1) {
                for (const ele of parent._children) {
                    if (ele._nodeType === interfaces_1.NodeType.Element && ele !== child)
                        throw new DOMException_1.HierarchyRequestError(`The document node already has a document element node.`);
                }
                let doctypeChild = child._nextSibling;
                while (doctypeChild) {
                    if (doctypeChild._nodeType === interfaces_1.NodeType.DocumentType)
                        throw new DOMException_1.HierarchyRequestError(`Cannot insert an element node before a document type node.`);
                    doctypeChild = doctypeChild._nextSibling;
                }
            }
        }
        else if (node._nodeType === interfaces_1.NodeType.Element) {
            for (const ele of parent._children) {
                if (ele._nodeType === interfaces_1.NodeType.Element && ele !== child)
                    throw new DOMException_1.HierarchyRequestError(`Document already has a document element node. Node is ${node.nodeName}.`);
            }
            let doctypeChild = child._nextSibling;
            while (doctypeChild) {
                if (doctypeChild._nodeType === interfaces_1.NodeType.DocumentType)
                    throw new DOMException_1.HierarchyRequestError(`Cannot insert an element node before a document type node. Node is ${node.nodeName}.`);
                doctypeChild = doctypeChild._nextSibling;
            }
        }
        else if (node._nodeType === interfaces_1.NodeType.DocumentType) {
            for (const ele of parent._children) {
                if (ele._nodeType === interfaces_1.NodeType.DocumentType && ele !== child)
                    throw new DOMException_1.HierarchyRequestError(`Document already has a document type node. Node is ${node.nodeName}.`);
            }
            let elementChild = child._previousSibling;
            while (elementChild) {
                if (elementChild._nodeType === interfaces_1.NodeType.Element)
                    throw new DOMException_1.HierarchyRequestError(`Cannot insert a document type node before an element node. Node is ${node.nodeName}.`);
                elementChild = elementChild._previousSibling;
            }
        }
    }
    /**
     * 7. Let reference child be child’s next sibling.
     * 8. If reference child is node, set it to node’s next sibling.
     * 8. Let previousSibling be child’s previous sibling.
     */
    let referenceChild = child._nextSibling;
    if (referenceChild === node)
        referenceChild = node._nextSibling;
    let previousSibling = child._previousSibling;
    /**
     * 10. Adopt node into parent’s node document.
     * 11. Let removedNodes be the empty list.
     */
    (0, DocumentAlgorithm_1.document_adopt)(node, parent._nodeDocument);
    const removedNodes = [];
    /**
     * 12. If child’s parent is not null, then:
     */
    if (child._parent !== null) {
        /**
         * 12.1. Set removedNodes to [child].
         * 12.2. Remove child from its parent with the suppress observers flag
         * set.
         */
        removedNodes.push(child);
        mutation_remove(child, child._parent, true);
    }
    /**
     * 13. Let nodes be node’s children if node is a DocumentFragment node;
     * otherwise [node].
     */
    let nodes = [];
    if (node._nodeType === interfaces_1.NodeType.DocumentFragment) {
        nodes = Array.from(node._children);
    }
    else {
        nodes.push(node);
    }
    /**
     * 14. Insert node into parent before reference child with the suppress
     * observers flag set.
     */
    mutation_insert(node, parent, referenceChild, true);
    /**
     * 15. Queue a tree mutation record for parent with nodes, removedNodes,
     * previousSibling, and reference child.
     */
    if (DOMImpl_1.dom.features.mutationObservers) {
        (0, MutationObserverAlgorithm_1.observer_queueTreeMutationRecord)(parent, nodes, removedNodes, previousSibling, referenceChild);
    }
    /**
     * 16. Return child.
     */
    return child;
}
/**
 * Replaces all nodes of a parent with the given node.
 *
 * @param node - node to insert
 * @param parent - parent node to receive node
 */
function mutation_replaceAll(node, parent) {
    /**
     * 1. If node is not null, adopt node into parent’s node document.
     */
    if (node !== null) {
        (0, DocumentAlgorithm_1.document_adopt)(node, parent._nodeDocument);
    }
    /**
     * 2. Let removedNodes be parent’s children.
     */
    const removedNodes = Array.from(parent._children);
    /**
     * 3. Let addedNodes be the empty list.
     * 4. If node is DocumentFragment node, then set addedNodes to node’s
     * children.
     * 5. Otherwise, if node is non-null, set addedNodes to [node].
     */
    let addedNodes = [];
    if (node && node._nodeType === interfaces_1.NodeType.DocumentFragment) {
        addedNodes = Array.from(node._children);
    }
    else if (node !== null) {
        addedNodes.push(node);
    }
    /**
     * 6. Remove all parent’s children, in tree order, with the suppress
     * observers flag set.
     */
    for (const childNode of removedNodes) {
        mutation_remove(childNode, parent, true);
    }
    /**
     * 7. If node is not null, then insert node into parent before null with the
     * suppress observers flag set.
     */
    if (node !== null) {
        mutation_insert(node, parent, null, true);
    }
    /**
     * 8. Queue a tree mutation record for parent with addedNodes, removedNodes,
     * null, and null.
     */
    if (DOMImpl_1.dom.features.mutationObservers) {
        (0, MutationObserverAlgorithm_1.observer_queueTreeMutationRecord)(parent, addedNodes, removedNodes, null, null);
    }
}
/**
 * Ensures pre-removal validity of a child node from a parent, then
 * removes it.
 *
 * @param child - child node to remove
 * @param parent - parent node
 */
function mutation_preRemove(child, parent) {
    /**
     * 1. If child’s parent is not parent, then throw a "NotFoundError"
     * DOMException.
     * 2. Remove child from parent.
     * 3. Return child.
     */
    if (child._parent !== parent)
        throw new DOMException_1.NotFoundError(`The child node cannot be found under parent node. Child node is ${child.nodeName}, parent node is ${parent.nodeName}.`);
    mutation_remove(child, parent);
    return child;
}
/**
 * Removes a child node from its parent.
 *
 * @param node - node to remove
 * @param parent - parent node
 * @param suppressObservers - whether to notify observers
 */
function mutation_remove(node, parent, suppressObservers) {
    if (DOMImpl_1.dom.rangeList.size !== 0) {
        /**
         * 1. Let index be node’s index.
         */
        const index = (0, TreeAlgorithm_1.tree_index)(node);
        /**
         * 2. For each live range whose start node is an inclusive descendant of
         * node, set its start to (parent, index).
         * 3. For each live range whose end node is an inclusive descendant of
         * node, set its end to (parent, index).
         */
        for (const range of DOMImpl_1.dom.rangeList) {
            if ((0, TreeAlgorithm_1.tree_isDescendantOf)(node, range._start[0], true)) {
                range._start = [parent, index];
            }
            if ((0, TreeAlgorithm_1.tree_isDescendantOf)(node, range._end[0], true)) {
                range._end = [parent, index];
            }
            if (range._start[0] === parent && range._start[1] > index) {
                range._start[1]--;
            }
            if (range._end[0] === parent && range._end[1] > index) {
                range._end[1]--;
            }
        }
        /**
         * 4. For each live range whose start node is parent and start offset is
         * greater than index, decrease its start offset by 1.
         * 5. For each live range whose end node is parent and end offset is greater
         * than index, decrease its end offset by 1.
         */
        for (const range of DOMImpl_1.dom.rangeList) {
            if (range._start[0] === parent && range._start[1] > index) {
                range._start[1] -= 1;
            }
            if (range._end[0] === parent && range._end[1] > index) {
                range._end[1] -= 1;
            }
        }
    }
    /**
     * 6. For each NodeIterator object iterator whose root’s node document is
     * node’s node document, run the NodeIterator pre-removing steps given node
     * and iterator.
     */
    if (DOMImpl_1.dom.features.steps) {
        for (const iterator of (0, NodeIteratorAlgorithm_1.nodeIterator_iteratorList)()) {
            if (iterator._root._nodeDocument === node._nodeDocument) {
                (0, DOMAlgorithm_1.dom_runNodeIteratorPreRemovingSteps)(iterator, node);
            }
        }
    }
    /**
     * 7. Let oldPreviousSibling be node’s previous sibling.
     * 8. Let oldNextSibling be node’s next sibling.
     */
    const oldPreviousSibling = node._previousSibling;
    const oldNextSibling = node._nextSibling;
    // set document element node
    if (util_1.Guard.isDocumentNode(parent) && util_1.Guard.isElementNode(node)) {
        parent._documentElement = null;
    }
    /**
     * 9. Remove node from its parent’s children.
     */
    node._parent = null;
    parent._children.delete(node);
    // assign siblings and children for quick lookups
    const prev = node._previousSibling;
    const next = node._nextSibling;
    node._previousSibling = null;
    node._nextSibling = null;
    if (prev)
        prev._nextSibling = next;
    if (next)
        next._previousSibling = prev;
    if (!prev)
        parent._firstChild = next;
    if (!next)
        parent._lastChild = prev;
    /**
     * 10. If node is assigned, then run assign slotables for node’s assigned
     * slot.
     */
    if (DOMImpl_1.dom.features.slots) {
        if (util_1.Guard.isSlotable(node) && node._assignedSlot !== null && (0, ShadowTreeAlgorithm_1.shadowTree_isAssigned)(node)) {
            (0, ShadowTreeAlgorithm_1.shadowTree_assignSlotables)(node._assignedSlot);
        }
    }
    /**
     * 11. If parent’s root is a shadow root, and parent is a slot whose
     * assigned nodes is the empty list, then run signal a slot change for
     * parent.
     */
    if (DOMImpl_1.dom.features.slots) {
        if (util_1.Guard.isShadowRoot((0, TreeAlgorithm_1.tree_rootNode)(parent)) &&
            util_1.Guard.isSlot(parent) && (0, util_2.isEmpty)(parent._assignedNodes)) {
            (0, ShadowTreeAlgorithm_1.shadowTree_signalASlotChange)(parent);
        }
    }
    /**
     * 12. If node has an inclusive descendant that is a slot, then:
     * 12.1. Run assign slotables for a tree with parent's root.
     * 12.2. Run assign slotables for a tree with node.
     */
    if (DOMImpl_1.dom.features.slots) {
        const descendant = (0, TreeAlgorithm_1.tree_getFirstDescendantNode)(node, true, false, (e) => util_1.Guard.isSlot(e));
        if (descendant !== null) {
            (0, ShadowTreeAlgorithm_1.shadowTree_assignSlotablesForATree)((0, TreeAlgorithm_1.tree_rootNode)(parent));
            (0, ShadowTreeAlgorithm_1.shadowTree_assignSlotablesForATree)(node);
        }
    }
    /**
     * 13. Run the removing steps with node and parent.
     */
    if (DOMImpl_1.dom.features.steps) {
        (0, DOMAlgorithm_1.dom_runRemovingSteps)(node, parent);
    }
    /**
     * 14. If node is custom, then enqueue a custom element callback
     * reaction with node, callback name "disconnectedCallback",
     * and an empty argument list.
     */
    if (DOMImpl_1.dom.features.customElements) {
        if (util_1.Guard.isCustomElementNode(node)) {
            (0, CustomElementAlgorithm_1.customElement_enqueueACustomElementCallbackReaction)(node, "disconnectedCallback", []);
        }
    }
    /**
     * 15. For each shadow-including descendant descendant of node,
     * in shadow-including tree order, then:
     */
    let descendant = (0, TreeAlgorithm_1.tree_getFirstDescendantNode)(node, false, true);
    while (descendant !== null) {
        /**
         * 15.1. Run the removing steps with descendant.
         */
        if (DOMImpl_1.dom.features.steps) {
            (0, DOMAlgorithm_1.dom_runRemovingSteps)(descendant, node);
        }
        /**
         * 15.2. If descendant is custom, then enqueue a custom element
         * callback reaction with descendant, callback name
         * "disconnectedCallback", and an empty argument list.
         */
        if (DOMImpl_1.dom.features.customElements) {
            if (util_1.Guard.isCustomElementNode(descendant)) {
                (0, CustomElementAlgorithm_1.customElement_enqueueACustomElementCallbackReaction)(descendant, "disconnectedCallback", []);
            }
        }
        descendant = (0, TreeAlgorithm_1.tree_getNextDescendantNode)(node, descendant, false, true);
    }
    /**
     * 16. For each inclusive ancestor inclusiveAncestor of parent, and
     * then for each registered of inclusiveAncestor's registered
     * observer list, if registered's options's subtree is true,
     * then append a new transient registered observer whose
     * observer is registered's observer, options is registered's
     * options, and source is registered to node's registered
     * observer list.
     */
    if (DOMImpl_1.dom.features.mutationObservers) {
        let inclusiveAncestor = (0, TreeAlgorithm_1.tree_getFirstAncestorNode)(parent, true);
        while (inclusiveAncestor !== null) {
            for (const registered of inclusiveAncestor._registeredObserverList) {
                if (registered.options.subtree) {
                    node._registeredObserverList.push({
                        observer: registered.observer,
                        options: registered.options,
                        source: registered
                    });
                }
            }
            inclusiveAncestor = (0, TreeAlgorithm_1.tree_getNextAncestorNode)(parent, inclusiveAncestor, true);
        }
    }
    /**
     * 17. If suppress observers flag is unset, then queue a tree mutation
     * record for parent with « », « node », oldPreviousSibling, and
     * oldNextSibling.
     */
    if (DOMImpl_1.dom.features.mutationObservers) {
        if (!suppressObservers) {
            (0, MutationObserverAlgorithm_1.observer_queueTreeMutationRecord)(parent, [], [node], oldPreviousSibling, oldNextSibling);
        }
    }
    /**
     * 18. If node is a Text node, then run the child text content change steps
     * for parent.
     */
    if (DOMImpl_1.dom.features.steps) {
        if (util_1.Guard.isTextNode(node)) {
            (0, DOMAlgorithm_1.dom_runChildTextContentChangeSteps)(parent);
        }
    }
}
//# sourceMappingURL=MutationAlgorithm.js.map