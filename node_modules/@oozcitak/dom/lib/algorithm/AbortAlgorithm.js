"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.abort_add = abort_add;
exports.abort_remove = abort_remove;
exports.abort_signalAbort = abort_signalAbort;
const EventAlgorithm_1 = require("./EventAlgorithm");
/**
 * Adds an algorithm to the given abort signal.
 *
 * @param algorithm - an algorithm
 * @param signal - abort signal
 */
function abort_add(algorithm, signal) {
    /**
     * 1. If signal’s aborted flag is set, then return.
     * 2. Append algorithm to signal’s abort algorithms.
     */
    if (signal._abortedFlag)
        return;
    signal._abortAlgorithms.add(algorithm);
}
/**
 * Removes an algorithm from the given abort signal.
 *
 * @param algorithm - an algorithm
 * @param signal - abort signal
 */
function abort_remove(algorithm, signal) {
    /**
     * To remove an algorithm algorithm from an AbortSignal signal, remove
     * algorithm from signal’s abort algorithms.
     */
    signal._abortAlgorithms.delete(algorithm);
}
/**
 * Signals abort on the given abort signal.
 *
 * @param signal - abort signal
 */
function abort_signalAbort(signal) {
    /**
     * 1. If signal’s aborted flag is set, then return.
     * 2. Set signal’s aborted flag.
     * 3. For each algorithm in signal’s abort algorithms: run algorithm.
     * 4. Empty signal’s abort algorithms.
     * 5. Fire an event named abort at signal.
     */
    if (signal._abortedFlag)
        return;
    signal._abortedFlag = true;
    for (const algorithm of signal._abortAlgorithms) {
        algorithm.call(signal);
    }
    signal._abortAlgorithms.clear();
    (0, EventAlgorithm_1.event_fireAnEvent)("abort", signal);
}
//# sourceMappingURL=AbortAlgorithm.js.map