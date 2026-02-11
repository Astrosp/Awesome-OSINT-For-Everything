"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.boundaryPoint_position = boundaryPoint_position;
const interfaces_1 = require("../dom/interfaces");
const TreeAlgorithm_1 = require("./TreeAlgorithm");
/**
 * Defines the position of a boundary point relative to another.
 *
 * @param bp - a boundary point
 * @param relativeTo - a boundary point to compare to
 */
function boundaryPoint_position(bp, relativeTo) {
    const nodeA = bp[0];
    const offsetA = bp[1];
    const nodeB = relativeTo[0];
    const offsetB = relativeTo[1];
    /**
     * 1. Assert: nodeA and nodeB have the same root.
     */
    console.assert((0, TreeAlgorithm_1.tree_rootNode)(nodeA) === (0, TreeAlgorithm_1.tree_rootNode)(nodeB), "Boundary points must share the same root node.");
    /**
     * 2. If nodeA is nodeB, then return equal if offsetA is offsetB, before
     * if offsetA is less than offsetB, and after if offsetA is greater than
     * offsetB.
     */
    if (nodeA === nodeB) {
        if (offsetA === offsetB) {
            return interfaces_1.BoundaryPosition.Equal;
        }
        else if (offsetA < offsetB) {
            return interfaces_1.BoundaryPosition.Before;
        }
        else {
            return interfaces_1.BoundaryPosition.After;
        }
    }
    /**
     * 3. If nodeA is following nodeB, then if the position of (nodeB, offsetB)
     * relative to (nodeA, offsetA) is before, return after, and if it is after,
     * return before.
     */
    if ((0, TreeAlgorithm_1.tree_isFollowing)(nodeB, nodeA)) {
        const pos = boundaryPoint_position([nodeB, offsetB], [nodeA, offsetA]);
        if (pos === interfaces_1.BoundaryPosition.Before) {
            return interfaces_1.BoundaryPosition.After;
        }
        else if (pos === interfaces_1.BoundaryPosition.After) {
            return interfaces_1.BoundaryPosition.Before;
        }
    }
    /**
     * 4. If nodeA is an ancestor of nodeB:
     */
    if ((0, TreeAlgorithm_1.tree_isAncestorOf)(nodeB, nodeA)) {
        /**
         * 4.1. Let child be nodeB.
         * 4.2. While child is not a child of nodeA, set child to its parent.
         * 4.3. If child’s index is less than offsetA, then return after.
         */
        let child = nodeB;
        while (!(0, TreeAlgorithm_1.tree_isChildOf)(nodeA, child)) {
            /* istanbul ignore else */
            if (child._parent !== null) {
                child = child._parent;
            }
        }
        if ((0, TreeAlgorithm_1.tree_index)(child) < offsetA) {
            return interfaces_1.BoundaryPosition.After;
        }
    }
    /**
     * 5. Return before.
     */
    return interfaces_1.BoundaryPosition.Before;
}
//# sourceMappingURL=BoundaryPointAlgorithm.js.map