"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cast = void 0;
const Guard_1 = require("./Guard");
/**
 * Contains type casts for DOM objects.
 */
class Cast {
    /**
     * Casts the given object to a `Node`.
     *
     * @param a - the object to cast
     */
    static asNode(a) {
        if (Guard_1.Guard.isNode(a)) {
            return a;
        }
        else {
            throw new Error("Invalid object. Node expected.");
        }
    }
}
exports.Cast = Cast;
//# sourceMappingURL=Cast.js.map