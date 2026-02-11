"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Guard = void 0;
const interfaces_1 = require("../dom/interfaces");
/**
 * Contains user-defined type guards for DOM objects.
 */
class Guard {
    /**
     * Determines if the given object is a `Node`.
     *
     * @param a - the object to check
     */
    static isNode(a) {
        return (!!a && a._nodeType !== undefined);
    }
    /**
     * Determines if the given object is a `Document`.
     *
     * @param a - the object to check
     */
    static isDocumentNode(a) {
        return (Guard.isNode(a) && a._nodeType === interfaces_1.NodeType.Document);
    }
    /**
     * Determines if the given object is a `DocumentType`.
     *
     * @param a - the object to check
     */
    static isDocumentTypeNode(a) {
        return (Guard.isNode(a) && a._nodeType === interfaces_1.NodeType.DocumentType);
    }
    /**
     * Determines if the given object is a `DocumentFragment`.
     *
     * @param a - the object to check
     */
    static isDocumentFragmentNode(a) {
        return (Guard.isNode(a) && a._nodeType === interfaces_1.NodeType.DocumentFragment);
    }
    /**
     * Determines if the given object is a `Attr`.
     *
     * @param a - the object to check
     */
    static isAttrNode(a) {
        return (Guard.isNode(a) && a._nodeType === interfaces_1.NodeType.Attribute);
    }
    /**
     * Determines if the given node is a `CharacterData` node.
     *
     * @param a - the object to check
     */
    static isCharacterDataNode(a) {
        if (!Guard.isNode(a))
            return false;
        const type = a._nodeType;
        return (type === interfaces_1.NodeType.Text ||
            type === interfaces_1.NodeType.ProcessingInstruction ||
            type === interfaces_1.NodeType.Comment ||
            type === interfaces_1.NodeType.CData);
    }
    /**
     * Determines if the given object is a `Text` or a `CDATASection`.
     *
     * @param a - the object to check
     */
    static isTextNode(a) {
        return (Guard.isNode(a) && (a._nodeType === interfaces_1.NodeType.Text || a._nodeType === interfaces_1.NodeType.CData));
    }
    /**
     * Determines if the given object is a `Text`.
     *
     * @param a - the object to check
     */
    static isExclusiveTextNode(a) {
        return (Guard.isNode(a) && a._nodeType === interfaces_1.NodeType.Text);
    }
    /**
     * Determines if the given object is a `CDATASection`.
     *
     * @param a - the object to check
     */
    static isCDATASectionNode(a) {
        return (Guard.isNode(a) && a._nodeType === interfaces_1.NodeType.CData);
    }
    /**
     * Determines if the given object is a `Comment`.
     *
     * @param a - the object to check
     */
    static isCommentNode(a) {
        return (Guard.isNode(a) && a._nodeType === interfaces_1.NodeType.Comment);
    }
    /**
     * Determines if the given object is a `ProcessingInstruction`.
     *
     * @param a - the object to check
     */
    static isProcessingInstructionNode(a) {
        return (Guard.isNode(a) && a._nodeType === interfaces_1.NodeType.ProcessingInstruction);
    }
    /**
     * Determines if the given object is an `Element`.
     *
     * @param a - the object to check
     */
    static isElementNode(a) {
        return (Guard.isNode(a) && a._nodeType === interfaces_1.NodeType.Element);
    }
    /**
     * Determines if the given object is a custom `Element`.
     *
     * @param a - the object to check
     */
    static isCustomElementNode(a) {
        return (Guard.isElementNode(a) && a._customElementState === "custom");
    }
    /**
     * Determines if the given object is a `ShadowRoot`.
     *
     * @param a - the object to check
     */
    static isShadowRoot(a) {
        return (!!a && a.host !== undefined);
    }
    /**
     * Determines if the given object is a `MouseEvent`.
     *
     * @param a - the object to check
     */
    static isMouseEvent(a) {
        return (!!a && a.screenX !== undefined && a.screenY != undefined);
    }
    /**
     * Determines if the given object is a slotable.
     *
     * Element and Text nodes are slotables. A slotable has an associated name
     * (a string).
     *
     * @param a - the object to check
     */
    static isSlotable(a) {
        return (!!a && a._name !== undefined && a._assignedSlot !== undefined &&
            (Guard.isTextNode(a) || Guard.isElementNode(a)));
    }
    /**
     * Determines if the given object is a slot.
     *
     * @param a - the object to check
     */
    static isSlot(a) {
        return (!!a && a._name !== undefined && a._assignedNodes !== undefined &&
            Guard.isElementNode(a));
    }
    /**
     * Determines if the given object is a `Window`.
     *
     * @param a - the object to check
     */
    static isWindow(a) {
        return (!!a && a.navigator !== undefined);
    }
    /**
     * Determines if the given object is an `EventListener`.
     *
     * @param a - the object to check
     */
    static isEventListener(a) {
        return (!!a && a.handleEvent !== undefined);
    }
    /**
     * Determines if the given object is a `RegisteredObserver`.
     *
     * @param a - the object to check
     */
    static isRegisteredObserver(a) {
        return (!!a && a.observer !== undefined && a.options !== undefined);
    }
    /**
   * Determines if the given object is a `TransientRegisteredObserver`.
   *
   * @param a - the object to check
   */
    static isTransientRegisteredObserver(a) {
        return (!!a && a.source !== undefined && Guard.isRegisteredObserver(a));
    }
}
exports.Guard = Guard;
//# sourceMappingURL=Guard.js.map