"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotableImpl = void 0;
const algorithm_1 = require("../algorithm");
/**
 * Represents a mixin that allows nodes to become the contents of
 * a <slot> element. This mixin is implemented by {@link Element} and
 * {@link Text}.
 */
class SlotableImpl {
    __name;
    __assignedSlot;
    get _name() { return this.__name || ''; }
    set _name(val) { this.__name = val; }
    get _assignedSlot() { return this.__assignedSlot || null; }
    set _assignedSlot(val) { this.__assignedSlot = val; }
    /** @inheritdoc */
    get assignedSlot() {
        return (0, algorithm_1.shadowTree_findASlot)(this, true);
    }
}
exports.SlotableImpl = SlotableImpl;
//# sourceMappingURL=SlotableImpl.js.map