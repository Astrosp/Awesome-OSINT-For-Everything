"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventTarget_flatten = eventTarget_flatten;
exports.eventTarget_flattenMore = eventTarget_flattenMore;
exports.eventTarget_addEventListener = eventTarget_addEventListener;
exports.eventTarget_removeEventListener = eventTarget_removeEventListener;
exports.eventTarget_removeAllEventListeners = eventTarget_removeAllEventListeners;
const util_1 = require("@oozcitak/util");
/**
 * Flattens the given options argument.
 *
 * @param options - options argument
 */
function eventTarget_flatten(options) {
    /**
     * 1. If options is a boolean, then return options.
     * 2. Return options’s capture.
     */
    if ((0, util_1.isBoolean)(options)) {
        return options;
    }
    else {
        return options.capture || false;
    }
}
/**
 * Flattens the given options argument.
 *
 * @param options - options argument
 */
function eventTarget_flattenMore(options) {
    /**
     * 1. Let capture be the result of flattening options.
     * 2. Let once and passive be false.
     * 3. If options is a dictionary, then set passive to options’s passive and
     * once to options’s once.
     * 4. Return capture, passive, and once.
     */
    const capture = eventTarget_flatten(options);
    let once = false;
    let passive = false;
    if (!(0, util_1.isBoolean)(options)) {
        once = options.once || false;
        passive = options.passive || false;
    }
    return [capture, passive, once];
}
/**
 * Adds a new event listener.
 *
 * @param eventTarget - event target
 * @param listener - event listener
 */
function eventTarget_addEventListener(eventTarget, listener) {
    /**
     * 1. If eventTarget is a ServiceWorkerGlobalScope object, its service
     * worker’s script resource’s has ever been evaluated flag is set, and
     * listener’s type matches the type attribute value of any of the service
     * worker events, then report a warning to the console that this might not
     * give the expected results. [SERVICE-WORKERS]
     */
    // TODO: service worker
    /**
     * 2. If listener’s callback is null, then return.
     */
    if (listener.callback === null)
        return;
    /**
     * 3. If eventTarget’s event listener list does not contain an event listener
     * whose type is listener’s type, callback is listener’s callback, and capture
     * is listener’s capture, then append listener to eventTarget’s event listener
     * list.
     */
    for (let i = 0; i < eventTarget._eventListenerList.length; i++) {
        const entry = eventTarget._eventListenerList[i];
        if (entry.type === listener.type && entry.callback.handleEvent === listener.callback.handleEvent
            && entry.capture === listener.capture) {
            return;
        }
    }
    eventTarget._eventListenerList.push(listener);
}
/**
 * Removes an event listener.
 *
 * @param eventTarget - event target
 * @param listener - event listener
 */
function eventTarget_removeEventListener(eventTarget, listener, index) {
    /**
     * 1. If eventTarget is a ServiceWorkerGlobalScope object and its service
     * worker’s set of event types to handle contains type, then report a
     * warning to the console that this might not give the expected results.
     * [SERVICE-WORKERS]
     */
    // TODO: service worker
    /**
     * 2. Set listener’s removed to true and remove listener from eventTarget’s
     * event listener list.
     */
    listener.removed = true;
    eventTarget._eventListenerList.splice(index, 1);
}
/**
 * Removes all event listeners.
 *
 * @param eventTarget - event target
 */
function eventTarget_removeAllEventListeners(eventTarget) {
    /**
     * To remove all event listeners, given an EventTarget object eventTarget,
     * for each listener of eventTarget’s event listener list, remove an event
     * listener with eventTarget and listener.
     */
    for (const e of eventTarget._eventListenerList) {
        e.removed = true;
    }
    eventTarget._eventListenerList.length = 0;
}
//# sourceMappingURL=EventTargetAlgorithm.js.map