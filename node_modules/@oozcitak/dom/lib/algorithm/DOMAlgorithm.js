"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dom_runRemovingSteps = dom_runRemovingSteps;
exports.dom_runCloningSteps = dom_runCloningSteps;
exports.dom_runAdoptingSteps = dom_runAdoptingSteps;
exports.dom_runAttributeChangeSteps = dom_runAttributeChangeSteps;
exports.dom_runInsertionSteps = dom_runInsertionSteps;
exports.dom_runNodeIteratorPreRemovingSteps = dom_runNodeIteratorPreRemovingSteps;
exports.dom_hasSupportedTokens = dom_hasSupportedTokens;
exports.dom_getSupportedTokens = dom_getSupportedTokens;
exports.dom_runEventConstructingSteps = dom_runEventConstructingSteps;
exports.dom_runChildTextContentChangeSteps = dom_runChildTextContentChangeSteps;
const DOMImpl_1 = require("../dom/DOMImpl");
const TreeAlgorithm_1 = require("./TreeAlgorithm");
const util_1 = require("../util");
const ShadowTreeAlgorithm_1 = require("./ShadowTreeAlgorithm");
const supportedTokens = new Map();
/**
 * Runs removing steps for node.
 *
 * @param removedNode - removed node
 * @param oldParent - old parent node
 */
function dom_runRemovingSteps(removedNode, oldParent) {
    // No steps defined
}
/**
 * Runs cloning steps for node.
 *
 * @param copy - node clone
 * @param node - node
 * @param document - document to own the cloned node
 * @param cloneChildrenFlag - whether child nodes are cloned
 */
function dom_runCloningSteps(copy, node, document, cloneChildrenFlag) {
    // No steps defined
}
/**
 * Runs adopting steps for node.
 *
 * @param node - node
 * @param oldDocument - old document
 */
function dom_runAdoptingSteps(node, oldDocument) {
    // No steps defined
}
/**
 * Runs attribute change steps for an element node.
 *
 * @param element - element node owning the attribute
 * @param localName - attribute's local name
 * @param oldValue - attribute's old value
 * @param value - attribute's new value
 * @param namespace - attribute's namespace
 */
function dom_runAttributeChangeSteps(element, localName, oldValue, value, namespace) {
    // run default steps
    if (DOMImpl_1.dom.features.slots) {
        updateASlotablesName.call(element, element, localName, oldValue, value, namespace);
        updateASlotsName.call(element, element, localName, oldValue, value, namespace);
    }
    updateAnElementID.call(element, element, localName, value, namespace);
    // run custom steps
    for (const step of element._attributeChangeSteps) {
        step.call(element, element, localName, oldValue, value, namespace);
    }
}
/**
 * Runs insertion steps for a node.
 *
 * @param insertedNode - inserted node
 */
function dom_runInsertionSteps(insertedNode) {
    // No steps defined
}
/**
 * Runs pre-removing steps for a node iterator and node.
 *
 * @param nodeIterator - a node iterator
 * @param toBeRemoved - node to be removed
 */
function dom_runNodeIteratorPreRemovingSteps(nodeIterator, toBeRemoved) {
    removeNodeIterator.call(nodeIterator, nodeIterator, toBeRemoved);
}
/**
 * Determines if there are any supported tokens defined for the given
 * attribute name.
 *
 * @param attributeName - an attribute name
 */
function dom_hasSupportedTokens(attributeName) {
    return supportedTokens.has(attributeName);
}
/**
 * Returns the set of supported tokens defined for the given attribute name.
 *
 * @param attributeName - an attribute name
 */
function dom_getSupportedTokens(attributeName) {
    return supportedTokens.get(attributeName) || new Set();
}
/**
 * Runs event construction steps.
 *
 * @param event - an event
 */
function dom_runEventConstructingSteps(event) {
    // No steps defined
}
/**
 * Runs child text content change steps for a parent node.
 *
 * @param parent - parent node with text node child nodes
 */
function dom_runChildTextContentChangeSteps(parent) {
    // No steps defined
}
/**
 * Defines pre-removing steps for a node iterator.
 */
function removeNodeIterator(nodeIterator, toBeRemovedNode) {
    /**
     * 1. If toBeRemovedNode is not an inclusive ancestor of nodeIterator’s
     * reference, or toBeRemovedNode is nodeIterator’s root, then return.
     */
    if (toBeRemovedNode === nodeIterator._root ||
        !(0, TreeAlgorithm_1.tree_isAncestorOf)(nodeIterator._reference, toBeRemovedNode, true)) {
        return;
    }
    /**
     * 2. If nodeIterator’s pointer before reference is true, then:
     */
    if (nodeIterator._pointerBeforeReference) {
        /**
         * 2.1. Let next be toBeRemovedNode’s first following node that is an
         * inclusive descendant of nodeIterator’s root and is not an inclusive
         * descendant of toBeRemovedNode, and null if there is no such node.
         */
        while (true) {
            const nextNode = (0, TreeAlgorithm_1.tree_getFollowingNode)(nodeIterator._root, toBeRemovedNode);
            if (nextNode !== null &&
                (0, TreeAlgorithm_1.tree_isDescendantOf)(nodeIterator._root, nextNode, true) &&
                !(0, TreeAlgorithm_1.tree_isDescendantOf)(toBeRemovedNode, nextNode, true)) {
                /**
                 * 2.2. If next is non-null, then set nodeIterator’s reference to next
                 * and return.
                 */
                nodeIterator._reference = nextNode;
                return;
            }
            else if (nextNode === null) {
                /**
                 * 2.3. Otherwise, set nodeIterator’s pointer before reference to false.
                 */
                nodeIterator._pointerBeforeReference = false;
                return;
            }
        }
    }
    /**
     * 3. Set nodeIterator’s reference to toBeRemovedNode’s parent, if
     * toBeRemovedNode’s previous sibling is null, and to the inclusive
     * descendant of toBeRemovedNode’s previous sibling that appears last in
     * tree order otherwise.
     */
    if (toBeRemovedNode._previousSibling === null) {
        if (toBeRemovedNode._parent !== null) {
            nodeIterator._reference = toBeRemovedNode._parent;
        }
    }
    else {
        let referenceNode = toBeRemovedNode._previousSibling;
        let childNode = (0, TreeAlgorithm_1.tree_getFirstDescendantNode)(toBeRemovedNode._previousSibling, true, false);
        while (childNode !== null) {
            if (childNode !== null) {
                referenceNode = childNode;
            }
            // loop through to get the last descendant node
            childNode = (0, TreeAlgorithm_1.tree_getNextDescendantNode)(toBeRemovedNode._previousSibling, childNode, true, false);
        }
        nodeIterator._reference = referenceNode;
    }
}
/**
 * Defines attribute change steps to update a slot’s name.
 */
function updateASlotsName(element, localName, oldValue, value, namespace) {
    /**
     * 1. If element is a slot, localName is name, and namespace is null, then:
     * 1.1. If value is oldValue, then return.
     * 1.2. If value is null and oldValue is the empty string, then return.
     * 1.3. If value is the empty string and oldValue is null, then return.
     * 1.4. If value is null or the empty string, then set element’s name to the
     * empty string.
     * 1.5. Otherwise, set element’s name to value.
     * 1.6. Run assign slotables for a tree with element’s root.
     */
    if (util_1.Guard.isSlot(element) && localName === "name" && namespace === null) {
        if (value === oldValue)
            return;
        if (value === null && oldValue === '')
            return;
        if (value === '' && oldValue === null)
            return;
        if ((value === null || value === '')) {
            element._name = '';
        }
        else {
            element._name = value;
        }
        (0, ShadowTreeAlgorithm_1.shadowTree_assignSlotablesForATree)((0, TreeAlgorithm_1.tree_rootNode)(element));
    }
}
/**
 * Defines attribute change steps to update a slotable’s name.
 */
function updateASlotablesName(element, localName, oldValue, value, namespace) {
    /**
     * 1. If localName is slot and namespace is null, then:
     * 1.1. If value is oldValue, then return.
     * 1.2. If value is null and oldValue is the empty string, then return.
     * 1.3. If value is the empty string and oldValue is null, then return.
     * 1.4. If value is null or the empty string, then set element’s name to
     * the empty string.
     * 1.5. Otherwise, set element’s name to value.
     * 1.6. If element is assigned, then run assign slotables for element’s
     * assigned slot.
     * 1.7. Run assign a slot for element.
     */
    if (util_1.Guard.isSlotable(element) && localName === "slot" && namespace === null) {
        if (value === oldValue)
            return;
        if (value === null && oldValue === '')
            return;
        if (value === '' && oldValue === null)
            return;
        if ((value === null || value === '')) {
            element._name = '';
        }
        else {
            element._name = value;
        }
        if ((0, ShadowTreeAlgorithm_1.shadowTree_isAssigned)(element)) {
            (0, ShadowTreeAlgorithm_1.shadowTree_assignSlotables)(element._assignedSlot);
        }
        (0, ShadowTreeAlgorithm_1.shadowTree_assignASlot)(element);
    }
}
/**
 * Defines attribute change steps to update an element's ID.
 */
function updateAnElementID(element, localName, value, namespace) {
    /**
     * 1. If localName is id, namespace is null, and value is null or the empty
     * string, then unset element’s ID.
     * 2. Otherwise, if localName is id, namespace is null, then set element’s
     * ID to value.
     */
    if (localName === "id" && namespace === null) {
        if (!value)
            element._uniqueIdentifier = undefined;
        else
            element._uniqueIdentifier = value;
    }
}
//# sourceMappingURL=DOMAlgorithm.js.map