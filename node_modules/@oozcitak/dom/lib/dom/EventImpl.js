"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventImpl = void 0;
const interfaces_1 = require("./interfaces");
const algorithm_1 = require("../algorithm");
const WebIDLAlgorithm_1 = require("../algorithm/WebIDLAlgorithm");
/**
 * Represents a DOM event.
 */
class EventImpl {
    static NONE = 0;
    static CAPTURING_PHASE = 1;
    static AT_TARGET = 2;
    static BUBBLING_PHASE = 3;
    NONE = 0;
    CAPTURING_PHASE = 1;
    AT_TARGET = 2;
    BUBBLING_PHASE = 3;
    _target = null;
    _relatedTarget = null;
    _touchTargetList = [];
    _path = [];
    _currentTarget = null;
    _eventPhase = interfaces_1.EventPhase.None;
    _stopPropagationFlag = false;
    _stopImmediatePropagationFlag = false;
    _canceledFlag = false;
    _inPassiveListenerFlag = false;
    _composedFlag = false;
    _initializedFlag = false;
    _dispatchFlag = false;
    _isTrusted = false;
    _type;
    _bubbles = false;
    _cancelable = false;
    _timeStamp;
    /**
     * Initializes a new instance of `Event`.
     */
    constructor(type, eventInit) {
        /**
         * When a constructor of the Event interface, or of an interface that
         * inherits from the Event interface, is invoked, these steps must be run,
         * given the arguments type and eventInitDict:
         * 1. Let event be the result of running the inner event creation steps with
         * this interface, null, now, and eventInitDict.
         * 2. Initialize event’s type attribute to type.
         * 3. Return event.
         */
        this._type = type;
        if (eventInit) {
            this._bubbles = eventInit.bubbles || false;
            this._cancelable = eventInit.cancelable || false;
            this._composedFlag = eventInit.composed || false;
        }
        this._initializedFlag = true;
        this._timeStamp = new Date().getTime();
    }
    /** @inheritdoc */
    get type() { return this._type; }
    /** @inheritdoc */
    get target() { return this._target; }
    /** @inheritdoc */
    get srcElement() { return this._target; }
    /** @inheritdoc */
    get currentTarget() { return this._currentTarget; }
    /** @inheritdoc */
    composedPath() {
        /**
         * 1. Let composedPath be an empty list.
         * 2. Let path be the context object’s path.
         * 3. If path is empty, then return composedPath.
         * 4. Let currentTarget be the context object’s currentTarget attribute
         * value.
         * 5. Append currentTarget to composedPath.
         * 6. Let currentTargetIndex be 0.
         * 7. Let currentTargetHiddenSubtreeLevel be 0.
         */
        const composedPath = [];
        const path = this._path;
        if (path.length === 0)
            return composedPath;
        const currentTarget = this._currentTarget;
        if (currentTarget === null) {
            throw new Error("Event currentTarget is null.");
        }
        composedPath.push(currentTarget);
        let currentTargetIndex = 0;
        let currentTargetHiddenSubtreeLevel = 0;
        /**
         * 8. Let index be path’s size − 1.
         * 9. While index is greater than or equal to 0:
         */
        let index = path.length - 1;
        while (index >= 0) {
            /**
             * 9.1. If path[index]'s root-of-closed-tree is true, then increase
             * currentTargetHiddenSubtreeLevel by 1.
             * 9.2. If path[index]'s invocation target is currentTarget, then set
             * currentTargetIndex to index and break.
             * 9.3. If path[index]'s slot-in-closed-tree is true, then decrease
             * currentTargetHiddenSubtreeLevel by 1.
             * 9.4. Decrease index by 1.
             */
            if (path[index].rootOfClosedTree) {
                currentTargetHiddenSubtreeLevel++;
            }
            if (path[index].invocationTarget === currentTarget) {
                currentTargetIndex = index;
                break;
            }
            if (path[index].slotInClosedTree) {
                currentTargetHiddenSubtreeLevel--;
            }
            index--;
        }
        /**
         * 10. Let currentHiddenLevel and maxHiddenLevel be
         * currentTargetHiddenSubtreeLevel.
         */
        let currentHiddenLevel = currentTargetHiddenSubtreeLevel;
        let maxHiddenLevel = currentTargetHiddenSubtreeLevel;
        /**
         * 11. Set index to currentTargetIndex − 1.
         * 12. While index is greater than or equal to 0:
         */
        index = currentTargetIndex - 1;
        while (index >= 0) {
            /**
             * 12.1. If path[index]'s root-of-closed-tree is true, then increase
             * currentHiddenLevel by 1.
             * 12.2. If currentHiddenLevel is less than or equal to maxHiddenLevel,
             * then prepend path[index]'s invocation target to composedPath.
             */
            if (path[index].rootOfClosedTree) {
                currentHiddenLevel++;
            }
            if (currentHiddenLevel <= maxHiddenLevel) {
                composedPath.unshift(path[index].invocationTarget);
            }
            /**
             * 12.3. If path[index]'s slot-in-closed-tree is true, then:
             */
            if (path[index].slotInClosedTree) {
                /**
                 * 12.3.1. Decrease currentHiddenLevel by 1.
                 * 12.3.2. If currentHiddenLevel is less than maxHiddenLevel, then set
                 * maxHiddenLevel to currentHiddenLevel.
                 */
                currentHiddenLevel--;
                if (currentHiddenLevel < maxHiddenLevel) {
                    maxHiddenLevel = currentHiddenLevel;
                }
            }
            /**
             * 12.4. Decrease index by 1.
             */
            index--;
        }
        /**
         * 13. Set currentHiddenLevel and maxHiddenLevel to
         * currentTargetHiddenSubtreeLevel.
         */
        currentHiddenLevel = currentTargetHiddenSubtreeLevel;
        maxHiddenLevel = currentTargetHiddenSubtreeLevel;
        /**
         * 14. Set index to currentTargetIndex + 1.
         * 15. While index is less than path’s size:
         */
        index = currentTargetIndex + 1;
        while (index < path.length) {
            /**
             * 15.1. If path[index]'s slot-in-closed-tree is true, then increase
             * currentHiddenLevel by 1.
             * 15.2. If currentHiddenLevel is less than or equal to maxHiddenLevel,
             * then append path[index]'s invocation target to composedPath.
             */
            if (path[index].slotInClosedTree) {
                currentHiddenLevel++;
            }
            if (currentHiddenLevel <= maxHiddenLevel) {
                composedPath.push(path[index].invocationTarget);
            }
            /**
             * 15.3. If path[index]'s root-of-closed-tree is true, then:
             */
            if (path[index].rootOfClosedTree) {
                /**
                 * 15.3.1. Decrease currentHiddenLevel by 1.
                 * 15.3.2. If currentHiddenLevel is less than maxHiddenLevel, then set
                 * maxHiddenLevel to currentHiddenLevel.
                 */
                currentHiddenLevel--;
                if (currentHiddenLevel < maxHiddenLevel) {
                    maxHiddenLevel = currentHiddenLevel;
                }
            }
            /**
             * 15.4. Increase index by 1.
             */
            index++;
        }
        /**
         * 16. Return composedPath.
         */
        return composedPath;
    }
    /** @inheritdoc */
    get eventPhase() { return this._eventPhase; }
    /** @inheritdoc */
    stopPropagation() { this._stopPropagationFlag = true; }
    /** @inheritdoc */
    get cancelBubble() { return this._stopPropagationFlag; }
    set cancelBubble(value) { if (value)
        this.stopPropagation(); }
    /** @inheritdoc */
    stopImmediatePropagation() {
        this._stopPropagationFlag = true;
        this._stopImmediatePropagationFlag = true;
    }
    /** @inheritdoc */
    get bubbles() { return this._bubbles; }
    /** @inheritdoc */
    get cancelable() { return this._cancelable; }
    /** @inheritdoc */
    get returnValue() { return !this._canceledFlag; }
    set returnValue(value) {
        if (!value) {
            (0, algorithm_1.event_setTheCanceledFlag)(this);
        }
    }
    /** @inheritdoc */
    preventDefault() {
        (0, algorithm_1.event_setTheCanceledFlag)(this);
    }
    /** @inheritdoc */
    get defaultPrevented() { return this._canceledFlag; }
    /** @inheritdoc */
    get composed() { return this._composedFlag; }
    /** @inheritdoc */
    get isTrusted() { return this._isTrusted; }
    /** @inheritdoc */
    get timeStamp() { return this._timeStamp; }
    /** @inheritdoc */
    initEvent(type, bubbles = false, cancelable = false) {
        /**
         * 1. If the context object’s dispatch flag is set, then return.
         */
        if (this._dispatchFlag)
            return;
        /**
         * 2. Initialize the context object with type, bubbles, and cancelable.
         */
        (0, algorithm_1.event_initialize)(this, type, bubbles, cancelable);
    }
}
exports.EventImpl = EventImpl;
/**
 * Define constants on prototype.
 */
(0, WebIDLAlgorithm_1.idl_defineConst)(EventImpl.prototype, "NONE", 0);
(0, WebIDLAlgorithm_1.idl_defineConst)(EventImpl.prototype, "CAPTURING_PHASE", 1);
(0, WebIDLAlgorithm_1.idl_defineConst)(EventImpl.prototype, "AT_TARGET", 2);
(0, WebIDLAlgorithm_1.idl_defineConst)(EventImpl.prototype, "BUBBLING_PHASE", 3);
//# sourceMappingURL=EventImpl.js.map