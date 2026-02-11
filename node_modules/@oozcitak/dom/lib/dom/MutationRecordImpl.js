"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MutationRecordImpl = void 0;
/**
 * Represents a mutation record.
 */
class MutationRecordImpl {
    _type;
    _target;
    _addedNodes;
    _removedNodes;
    _previousSibling;
    _nextSibling;
    _attributeName;
    _attributeNamespace;
    _oldValue;
    /**
     * Initializes a new instance of `MutationRecord`.
     *
     * @param type - type of mutation: `"attributes"` for an attribute
     * mutation, `"characterData"` for a mutation to a CharacterData node
     * and `"childList"` for a mutation to the tree of nodes.
     * @param target - node affected by the mutation.
     * @param addedNodes - list of added nodes.
     * @param removedNodes - list of removed nodes.
     * @param previousSibling - previous sibling of added or removed nodes.
     * @param nextSibling - next sibling of added or removed nodes.
     * @param attributeName - local name of the changed attribute,
     * and `null` otherwise.
     * @param attributeNamespace - namespace of the changed attribute,
     * and `null` otherwise.
     * @param oldValue - value before mutation: attribute value for an attribute
     * mutation, node `data` for a mutation to a CharacterData node and `null`
     * for a mutation to the tree of nodes.
     */
    constructor(type, target, addedNodes, removedNodes, previousSibling, nextSibling, attributeName, attributeNamespace, oldValue) {
        this._type = type;
        this._target = target;
        this._addedNodes = addedNodes;
        this._removedNodes = removedNodes;
        this._previousSibling = previousSibling;
        this._nextSibling = nextSibling;
        this._attributeName = attributeName;
        this._attributeNamespace = attributeNamespace;
        this._oldValue = oldValue;
    }
    /** @inheritdoc */
    get type() { return this._type; }
    /** @inheritdoc */
    get target() { return this._target; }
    /** @inheritdoc */
    get addedNodes() { return this._addedNodes; }
    /** @inheritdoc */
    get removedNodes() { return this._removedNodes; }
    /** @inheritdoc */
    get previousSibling() { return this._previousSibling; }
    /** @inheritdoc */
    get nextSibling() { return this._nextSibling; }
    /** @inheritdoc */
    get attributeName() { return this._attributeName; }
    /** @inheritdoc */
    get attributeNamespace() { return this._attributeNamespace; }
    /** @inheritdoc */
    get oldValue() { return this._oldValue; }
    /**
     * Creates a new `MutationRecord`.
     *
     * @param type - type of mutation: `"attributes"` for an attribute
     * mutation, `"characterData"` for a mutation to a CharacterData node
     * and `"childList"` for a mutation to the tree of nodes.
     * @param target - node affected by the mutation.
     * @param addedNodes - list of added nodes.
     * @param removedNodes - list of removed nodes.
     * @param previousSibling - previous sibling of added or removed nodes.
     * @param nextSibling - next sibling of added or removed nodes.
     * @param attributeName - local name of the changed attribute,
     * and `null` otherwise.
     * @param attributeNamespace - namespace of the changed attribute,
     * and `null` otherwise.
     * @param oldValue - value before mutation: attribute value for an attribute
     * mutation, node `data` for a mutation to a CharacterData node and `null`
     * for a mutation to the tree of nodes.
     */
    static _create(type, target, addedNodes, removedNodes, previousSibling, nextSibling, attributeName, attributeNamespace, oldValue) {
        return new MutationRecordImpl(type, target, addedNodes, removedNodes, previousSibling, nextSibling, attributeName, attributeNamespace, oldValue);
    }
}
exports.MutationRecordImpl = MutationRecordImpl;
//# sourceMappingURL=MutationRecordImpl.js.map