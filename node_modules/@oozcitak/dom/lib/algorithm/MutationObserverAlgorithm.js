"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.observer_queueAMutationObserverMicrotask = observer_queueAMutationObserverMicrotask;
exports.observer_notifyMutationObservers = observer_notifyMutationObservers;
exports.observer_queueMutationRecord = observer_queueMutationRecord;
exports.observer_queueTreeMutationRecord = observer_queueTreeMutationRecord;
exports.observer_queueAttributeMutationRecord = observer_queueAttributeMutationRecord;
const DOMImpl_1 = require("../dom/DOMImpl");
const util_1 = require("../util");
const infra_1 = require("@oozcitak/infra");
const CreateAlgorithm_1 = require("./CreateAlgorithm");
const TreeAlgorithm_1 = require("./TreeAlgorithm");
const EventAlgorithm_1 = require("./EventAlgorithm");
/**
 * Queues a mutation observer microtask to the surrounding agent’s mutation
 * observers.
 */
function observer_queueAMutationObserverMicrotask() {
    /**
     * 1. If the surrounding agent’s mutation observer microtask queued is true,
     * then return.
     * 2. Set the surrounding agent’s mutation observer microtask queued to true.
     * 3. Queue a microtask to notify mutation observers.
     */
    const window = DOMImpl_1.dom.window;
    if (window._mutationObserverMicrotaskQueued)
        return;
    window._mutationObserverMicrotaskQueued = true;
    Promise.resolve().then(() => { observer_notifyMutationObservers(); });
}
/**
 * Notifies the surrounding agent’s mutation observers.
 */
function observer_notifyMutationObservers() {
    /**
     * 1. Set the surrounding agent’s mutation observer microtask queued to false.
     * 2. Let notifySet be a clone of the surrounding agent’s mutation observers.
     * 3. Let signalSet be a clone of the surrounding agent’s signal slots.
     * 4. Empty the surrounding agent’s signal slots.
     */
    const window = DOMImpl_1.dom.window;
    window._mutationObserverMicrotaskQueued = false;
    const notifySet = infra_1.set.clone(window._mutationObservers);
    const signalSet = infra_1.set.clone(window._signalSlots);
    infra_1.set.empty(window._signalSlots);
    /**
     * 5. For each mo of notifySet:
     */
    for (const mo of notifySet) {
        /**
         * 5.1. Let records be a clone of mo’s record queue.
         * 5.2. Empty mo’s record queue.
         */
        const records = infra_1.list.clone(mo._recordQueue);
        infra_1.list.empty(mo._recordQueue);
        /**
         * 5.3. For each node of mo’s node list, remove all transient registered
         * observers whose observer is mo from node’s registered observer list.
         */
        for (let i = 0; i < mo._nodeList.length; i++) {
            const node = mo._nodeList[i];
            infra_1.list.remove(node._registeredObserverList, (observer) => {
                return util_1.Guard.isTransientRegisteredObserver(observer) && observer.observer === mo;
            });
        }
        /**
         * 5.4. If records is not empty, then invoke mo’s callback with « records,
         * mo », and mo. If this throws an exception, then report the exception.
         */
        if (!infra_1.list.isEmpty(records)) {
            try {
                mo._callback.call(mo, records, mo);
            }
            catch (err) {
                // TODO: Report the exception
            }
        }
    }
    /**
     * 6. For each slot of signalSet, fire an event named slotchange, with its
     * bubbles attribute set to true, at slot.
     */
    if (DOMImpl_1.dom.features.slots) {
        for (const slot of signalSet) {
            (0, EventAlgorithm_1.event_fireAnEvent)("slotchange", slot, undefined, { bubbles: true });
        }
    }
}
/**
 * Queues a mutation record of the given type for target.
 *
 * @param type - mutation record type
 * @param target - target node
 * @param name - name before mutation
 * @param namespace - namespace before mutation
 * @param oldValue - attribute value before mutation
 * @param addedNodes - a list od added nodes
 * @param removedNodes - a list of removed nodes
 * @param previousSibling - previous sibling of target before mutation
 * @param nextSibling - next sibling of target before mutation
 */
function observer_queueMutationRecord(type, target, name, namespace, oldValue, addedNodes, removedNodes, previousSibling, nextSibling) {
    /**
     * 1. Let interestedObservers be an empty map.
     * 2. Let nodes be the inclusive ancestors of target.
     * 3. For each node in nodes, and then for each registered of node’s
     * registered observer list:
     */
    const interestedObservers = new Map();
    let node = (0, TreeAlgorithm_1.tree_getFirstAncestorNode)(target, true);
    while (node !== null) {
        for (let i = 0; i < node._registeredObserverList.length; i++) {
            const registered = node._registeredObserverList[i];
            /**
             * 3.1. Let options be registered’s options.
             * 3.2. If none of the following are true
             * - node is not target and options’s subtree is false
             * - type is "attributes" and options’s attributes is not true
             * - type is "attributes", options’s attributeFilter is present, and
             * options’s attributeFilter does not contain name or namespace is
             * non-null
             * - type is "characterData" and options’s characterData is not true
             * - type is "childList" and options’s childList is false
             */
            const options = registered.options;
            if (node !== target && !options.subtree)
                continue;
            if (type === "attributes" && !options.attributes)
                continue;
            if (type === "attributes" && options.attributeFilter &&
                (!options.attributeFilter.indexOf(name || '') || namespace !== null))
                continue;
            if (type === "characterData" && !options.characterData)
                continue;
            if (type === "childList" && !options.childList)
                continue;
            /**
             * then:
             * 3.2.1. Let mo be registered’s observer.
             * 3.2.2. If interestedObservers[mo] does not exist, then set
             * interestedObservers[mo] to null.
             * 3.2.3. If either type is "attributes" and options’s attributeOldValue
             * is true, or type is "characterData" and options’s
             * characterDataOldValue is true, then set interestedObservers[mo]
             * to oldValue.
             */
            const mo = registered.observer;
            if (!interestedObservers.has(mo)) {
                interestedObservers.set(mo, null);
            }
            if ((type === "attributes" && options.attributeOldValue) ||
                (type === "characterData" && options.characterDataOldValue)) {
                interestedObservers.set(mo, oldValue);
            }
        }
        node = (0, TreeAlgorithm_1.tree_getNextAncestorNode)(target, node, true);
    }
    /**
     * 4. For each observer → mappedOldValue of interestedObservers:
     */
    for (const [observer, mappedOldValue] of interestedObservers) {
        /**
         * 4.1. Let record be a new MutationRecord object with its type set to
         * type, target set to target, attributeName set to name,
         * attributeNamespace set to namespace, oldValue set to mappedOldValue,
         * addedNodes set to addedNodes, removedNodes set to removedNodes,
         * previousSibling set to previousSibling, and nextSibling set to
         * nextSibling.
         * 4.2. Enqueue record to observer’s record queue.
         */
        const record = (0, CreateAlgorithm_1.create_mutationRecord)(type, target, (0, CreateAlgorithm_1.create_nodeListStatic)(target, addedNodes), (0, CreateAlgorithm_1.create_nodeListStatic)(target, removedNodes), previousSibling, nextSibling, name, namespace, mappedOldValue);
        const queue = observer._recordQueue;
        queue.push(record);
    }
    /**
     * 5. Queue a mutation observer microtask.
     */
    observer_queueAMutationObserverMicrotask();
}
/**
 * Queues a tree mutation record for target.
 *
 * @param target - target node
 * @param addedNodes - a list od added nodes
 * @param removedNodes - a list of removed nodes
 * @param previousSibling - previous sibling of target before mutation
 * @param nextSibling - next sibling of target before mutation
 */
function observer_queueTreeMutationRecord(target, addedNodes, removedNodes, previousSibling, nextSibling) {
    /**
     * To queue a tree mutation record for target with addedNodes, removedNodes,
     * previousSibling, and nextSibling, queue a mutation record of "childList"
     * for target with null, null, null, addedNodes, removedNodes,
     * previousSibling, and nextSibling.
     */
    observer_queueMutationRecord("childList", target, null, null, null, addedNodes, removedNodes, previousSibling, nextSibling);
}
/**
 * Queues an attribute mutation record for target.
 *
 * @param target - target node
 * @param name - name before mutation
 * @param namespace - namespace before mutation
 * @param oldValue - attribute value before mutation
 */
function observer_queueAttributeMutationRecord(target, name, namespace, oldValue) {
    /**
     * To queue an attribute mutation record for target with name, namespace,
     * and oldValue, queue a mutation record of "attributes" for target with
     * name, namespace, oldValue, « », « », null, and null.
     */
    observer_queueMutationRecord("attributes", target, name, namespace, oldValue, [], [], null, null);
}
//# sourceMappingURL=MutationObserverAlgorithm.js.map