"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeImpl = void 0;
const DOMImpl_1 = require("./DOMImpl");
const interfaces_1 = require("./interfaces");
const EventTargetImpl_1 = require("./EventTargetImpl");
const util_1 = require("../util");
const DOMException_1 = require("./DOMException");
const algorithm_1 = require("../algorithm");
const URLAlgorithm_1 = require("@oozcitak/url/lib/URLAlgorithm");
const WebIDLAlgorithm_1 = require("../algorithm/WebIDLAlgorithm");
/**
 * Represents a generic XML node.
 */
class NodeImpl extends EventTargetImpl_1.EventTargetImpl {
    static ELEMENT_NODE = 1;
    static ATTRIBUTE_NODE = 2;
    static TEXT_NODE = 3;
    static CDATA_SECTION_NODE = 4;
    static ENTITY_REFERENCE_NODE = 5;
    static ENTITY_NODE = 6;
    static PROCESSING_INSTRUCTION_NODE = 7;
    static COMMENT_NODE = 8;
    static DOCUMENT_NODE = 9;
    static DOCUMENT_TYPE_NODE = 10;
    static DOCUMENT_FRAGMENT_NODE = 11;
    static NOTATION_NODE = 12;
    static DOCUMENT_POSITION_DISCONNECTED = 0x01;
    static DOCUMENT_POSITION_PRECEDING = 0x02;
    static DOCUMENT_POSITION_FOLLOWING = 0x04;
    static DOCUMENT_POSITION_CONTAINS = 0x08;
    static DOCUMENT_POSITION_CONTAINED_BY = 0x10;
    static DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC = 0x20;
    ELEMENT_NODE = 1;
    ATTRIBUTE_NODE = 2;
    TEXT_NODE = 3;
    CDATA_SECTION_NODE = 4;
    ENTITY_REFERENCE_NODE = 5;
    ENTITY_NODE = 6;
    PROCESSING_INSTRUCTION_NODE = 7;
    COMMENT_NODE = 8;
    DOCUMENT_NODE = 9;
    DOCUMENT_TYPE_NODE = 10;
    DOCUMENT_FRAGMENT_NODE = 11;
    NOTATION_NODE = 12;
    DOCUMENT_POSITION_DISCONNECTED = 0x01;
    DOCUMENT_POSITION_PRECEDING = 0x02;
    DOCUMENT_POSITION_FOLLOWING = 0x04;
    DOCUMENT_POSITION_CONTAINS = 0x08;
    DOCUMENT_POSITION_CONTAINED_BY = 0x10;
    DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC = 0x20;
    __childNodes;
    get _childNodes() {
        return this.__childNodes || (this.__childNodes = (0, algorithm_1.create_nodeList)(this));
    }
    _nodeDocumentOverride;
    get _nodeDocument() { return this._nodeDocumentOverride || DOMImpl_1.dom.window._associatedDocument; }
    set _nodeDocument(val) { this._nodeDocumentOverride = val; }
    __registeredObserverList;
    get _registeredObserverList() {
        return this.__registeredObserverList || (this.__registeredObserverList = []);
    }
    _parent = null;
    _children = new util_1.EmptySet;
    _firstChild = null;
    _lastChild = null;
    _previousSibling = null;
    _nextSibling = null;
    /**
     * Initializes a new instance of `Node`.
     */
    constructor() {
        super();
    }
    /** @inheritdoc */
    get nodeType() { return this._nodeType; }
    /**
     * Returns a string appropriate for the type of node.
     */
    get nodeName() {
        if (util_1.Guard.isElementNode(this)) {
            return this._htmlUppercasedQualifiedName;
        }
        else if (util_1.Guard.isAttrNode(this)) {
            return this._qualifiedName;
        }
        else if (util_1.Guard.isExclusiveTextNode(this)) {
            return "#text";
        }
        else if (util_1.Guard.isCDATASectionNode(this)) {
            return "#cdata-section";
        }
        else if (util_1.Guard.isProcessingInstructionNode(this)) {
            return this._target;
        }
        else if (util_1.Guard.isCommentNode(this)) {
            return "#comment";
        }
        else if (util_1.Guard.isDocumentNode(this)) {
            return "#document";
        }
        else if (util_1.Guard.isDocumentTypeNode(this)) {
            return this._name;
        }
        else if (util_1.Guard.isDocumentFragmentNode(this)) {
            return "#document-fragment";
        }
        else {
            return "";
        }
    }
    /**
     * Gets the absolute base URL of the node.
     */
    get baseURI() {
        /**
         * The baseURI attribute’s getter must return node document’s document
         * base URL, serialized.
         * TODO: Implement in HTML DOM
         * https://html.spec.whatwg.org/multipage/urls-and-fetching.html#document-base-url
         */
        return (0, URLAlgorithm_1.urlSerializer)(this._nodeDocument._URL);
    }
    /**
     * Returns whether the node is rooted to a document node.
     */
    get isConnected() {
        /**
         * The isConnected attribute’s getter must return true, if context object
         * is connected, and false otherwise.
         */
        return util_1.Guard.isElementNode(this) && (0, algorithm_1.shadowTree_isConnected)(this);
    }
    /**
     * Returns the parent document.
     */
    get ownerDocument() {
        /**
         * The ownerDocument attribute’s getter must return null, if the context
         * object is a document, and the context object’s node document otherwise.
         * _Note:_ The node document of a document is that document itself. All
         * nodes have a node document at all times.
         */
        if (this._nodeType === interfaces_1.NodeType.Document)
            return null;
        else
            return this._nodeDocument;
    }
    /**
     * Returns the root node.
     *
     * @param options - if options has `composed = true` this function
     * returns the node's shadow-including root, otherwise it returns
     * the node's root node.
     */
    getRootNode(options) {
        /**
         * The getRootNode(options) method, when invoked, must return context
         * object’s shadow-including root if options’s composed is true,
         * and context object’s root otherwise.
         */
        return (0, algorithm_1.tree_rootNode)(this, !!options && options.composed);
    }
    /**
     * Returns the parent node.
     */
    get parentNode() {
        /**
         * The parentNode attribute’s getter must return the context object’s parent.
         * _Note:_ An Attr node has no parent.
         */
        if (this._nodeType === interfaces_1.NodeType.Attribute) {
            return null;
        }
        else {
            return this._parent;
        }
    }
    /**
     * Returns the parent element.
     */
    get parentElement() {
        /**
         * The parentElement attribute’s getter must return the context object’s
         * parent element.
         */
        if (this._parent && util_1.Guard.isElementNode(this._parent)) {
            return this._parent;
        }
        else {
            return null;
        }
    }
    /**
     * Determines whether a node has any children.
     */
    hasChildNodes() {
        /**
         * The hasChildNodes() method, when invoked, must return true if the context
         * object has children, and false otherwise.
         */
        return (this._firstChild !== null);
    }
    /**
     * Returns a {@link NodeList} of child nodes.
     */
    get childNodes() {
        /**
         * The childNodes attribute’s getter must return a NodeList rooted at the
         * context object matching only children.
         */
        return this._childNodes;
    }
    /**
     * Returns the first child node.
     */
    get firstChild() {
        /**
         * The firstChild attribute’s getter must return the context object’s first
         * child.
         */
        return this._firstChild;
    }
    /**
     * Returns the last child node.
     */
    get lastChild() {
        /**
         * The lastChild attribute’s getter must return the context object’s last
         * child.
         */
        return this._lastChild;
    }
    /**
     * Returns the previous sibling node.
     */
    get previousSibling() {
        /**
         * The previousSibling attribute’s getter must return the context object’s
         * previous sibling.
         * _Note:_ An Attr node has no siblings.
         */
        return this._previousSibling;
    }
    /**
     * Returns the next sibling node.
     */
    get nextSibling() {
        /**
         * The nextSibling attribute’s getter must return the context object’s
         * next sibling.
         */
        return this._nextSibling;
    }
    /**
     * Gets or sets the data associated with a {@link CharacterData} node or the
     * value of an {@link @Attr} node. For other node types returns `null`.
     */
    get nodeValue() {
        if (util_1.Guard.isAttrNode(this)) {
            return this._value;
        }
        else if (util_1.Guard.isCharacterDataNode(this)) {
            return this._data;
        }
        else {
            return null;
        }
    }
    set nodeValue(value) {
        if (value === null) {
            value = '';
        }
        if (util_1.Guard.isAttrNode(this)) {
            (0, algorithm_1.attr_setAnExistingAttributeValue)(this, value);
        }
        else if (util_1.Guard.isCharacterDataNode(this)) {
            (0, algorithm_1.characterData_replaceData)(this, 0, this._data.length, value);
        }
    }
    /**
     * Returns the concatenation of data of all the {@link Text}
     * node descendants in tree order. When set, replaces the text
     * contents of the node with the given value.
     */
    get textContent() {
        if (util_1.Guard.isDocumentFragmentNode(this) || util_1.Guard.isElementNode(this)) {
            return (0, algorithm_1.text_descendantTextContent)(this);
        }
        else if (util_1.Guard.isAttrNode(this)) {
            return this._value;
        }
        else if (util_1.Guard.isCharacterDataNode(this)) {
            return this._data;
        }
        else {
            return null;
        }
    }
    set textContent(value) {
        if (value === null) {
            value = '';
        }
        if (util_1.Guard.isDocumentFragmentNode(this) || util_1.Guard.isElementNode(this)) {
            (0, algorithm_1.node_stringReplaceAll)(value, this);
        }
        else if (util_1.Guard.isAttrNode(this)) {
            (0, algorithm_1.attr_setAnExistingAttributeValue)(this, value);
        }
        else if (util_1.Guard.isCharacterDataNode(this)) {
            (0, algorithm_1.characterData_replaceData)(this, 0, (0, algorithm_1.tree_nodeLength)(this), value);
        }
    }
    /**
     * Puts all {@link Text} nodes in the full depth of the sub-tree
     * underneath this node into a "normal" form where only markup
     * (e.g., tags, comments, processing instructions, CDATA sections,
     * and entity references) separates {@link Text} nodes, i.e., there
     * are no adjacent Text nodes.
     */
    normalize() {
        /**
         * The normalize() method, when invoked, must run these steps for each
         * descendant exclusive Text node node of context object:
         */
        const descendantNodes = [];
        let node = (0, algorithm_1.tree_getFirstDescendantNode)(this, false, false, (e) => util_1.Guard.isExclusiveTextNode(e));
        while (node !== null) {
            descendantNodes.push(node);
            node = (0, algorithm_1.tree_getNextDescendantNode)(this, node, false, false, (e) => util_1.Guard.isExclusiveTextNode(e));
        }
        for (let i = 0; i < descendantNodes.length; i++) {
            const node = descendantNodes[i];
            if (node._parent === null)
                continue;
            /**
             * 1. Let length be node’s length.
             * 2. If length is zero, then remove node and continue with the next
             * exclusive Text node, if any.
             */
            let length = (0, algorithm_1.tree_nodeLength)(node);
            if (length === 0) {
                (0, algorithm_1.mutation_remove)(node, node._parent);
                continue;
            }
            /**
             * 3. Let data be the concatenation of the data of node’s contiguous
             * exclusive Text nodes (excluding itself), in tree order.
             */
            const textSiblings = [];
            let data = '';
            for (const sibling of (0, algorithm_1.text_contiguousExclusiveTextNodes)(node)) {
                textSiblings.push(sibling);
                data += sibling._data;
            }
            /**
             * 4. Replace data with node node, offset length, count 0, and data data.
             */
            (0, algorithm_1.characterData_replaceData)(node, length, 0, data);
            /**
             * 5. Let currentNode be node’s next sibling.
             * 6. While currentNode is an exclusive Text node:
             */
            if (DOMImpl_1.dom.rangeList.size !== 0) {
                let currentNode = node._nextSibling;
                while (currentNode !== null && util_1.Guard.isExclusiveTextNode(currentNode)) {
                    /**
                     * 6.1. For each live range whose start node is currentNode, add length
                     * to its start offset and set its start node to node.
                     * 6.2. For each live range whose end node is currentNode, add length to
                     * its end offset and set its end node to node.
                     * 6.3. For each live range whose start node is currentNode’s parent and
                     * start offset is currentNode’s index, set its start node to node and
                     * its start offset to length.
                     * 6.4. For each live range whose end node is currentNode’s parent and
                     * end offset is currentNode’s index, set its end node to node and its
                     * end offset to length.
                     */
                    const cn = currentNode;
                    const index = (0, algorithm_1.tree_index)(cn);
                    for (const range of DOMImpl_1.dom.rangeList) {
                        if (range._start[0] === cn) {
                            range._start[0] = node;
                            range._start[1] += length;
                        }
                        if (range._end[0] === cn) {
                            range._end[0] = node;
                            range._end[1] += length;
                        }
                        if (range._start[0] === cn._parent && range._start[1] === index) {
                            range._start[0] = node;
                            range._start[1] = length;
                        }
                        if (range._end[0] === cn._parent && range._end[1] === index) {
                            range._end[0] = node;
                            range._end[1] = length;
                        }
                    }
                    /**
                     * 6.5. Add currentNode’s length to length.
                     * 6.6. Set currentNode to its next sibling.
                     */
                    length += (0, algorithm_1.tree_nodeLength)(currentNode);
                    currentNode = currentNode._nextSibling;
                }
            }
            /**
             * 7. Remove node’s contiguous exclusive Text nodes (excluding itself),
             * in tree order.
             */
            for (let i = 0; i < textSiblings.length; i++) {
                const sibling = textSiblings[i];
                if (sibling._parent === null)
                    continue;
                (0, algorithm_1.mutation_remove)(sibling, sibling._parent);
            }
        }
    }
    /**
     * Returns a duplicate of this node, i.e., serves as a generic copy
     * constructor for nodes. The duplicate node has no parent
     * ({@link parentNode} returns `null`).
     *
     * @param deep - if `true`, recursively clone the subtree under the
     * specified node. If `false`, clone only the node itself (and its
     * attributes, if it is an {@link Element}).
     */
    cloneNode(deep = false) {
        /**
         * 1. If context object is a shadow root, then throw a "NotSupportedError"
         * DOMException.
         * 2. Return a clone of the context object, with the clone children flag set
         * if deep is true.
         */
        if (util_1.Guard.isShadowRoot(this))
            throw new DOMException_1.NotSupportedError();
        return (0, algorithm_1.node_clone)(this, null, deep);
    }
    /**
     * Determines if the given node is equal to this one.
     *
     * @param node - the node to compare with
     */
    isEqualNode(node = null) {
        /**
         * The isEqualNode(otherNode) method, when invoked, must return true if
         * otherNode is non-null and context object equals otherNode, and false
         * otherwise.
         */
        return (node !== null && (0, algorithm_1.node_equals)(this, node));
    }
    /**
     * Determines if the given node is reference equal to this one.
     *
     * @param node - the node to compare with
     */
    isSameNode(node = null) {
        /**
         * The isSameNode(otherNode) method, when invoked, must return true if
         * otherNode is context object, and false otherwise.
         */
        return (this === node);
    }
    /**
     * Returns a bitmask indicating the position of the given `node`
     * relative to this node.
     */
    compareDocumentPosition(other) {
        /**
         * 1. If context object is other, then return zero.
         * 2. Let node1 be other and node2 be context object.
         * 3. Let attr1 and attr2 be null.
         * attr1’s element.
         */
        if (other === this)
            return interfaces_1.Position.SameNode;
        let node1 = other;
        let node2 = this;
        let attr1 = null;
        let attr2 = null;
        /**
         * 4. If node1 is an attribute, then set attr1 to node1 and node1 to
         * attr1’s element.
         */
        if (util_1.Guard.isAttrNode(node1)) {
            attr1 = node1;
            node1 = attr1._element;
        }
        /**
         * 5. If node2 is an attribute, then:
         */
        if (util_1.Guard.isAttrNode(node2)) {
            /**
             * 5.1. Set attr2 to node2 and node2 to attr2’s element.
             */
            attr2 = node2;
            node2 = attr2._element;
            /**
             * 5.2. If attr1 and node1 are non-null, and node2 is node1, then:
             */
            if (attr1 && node1 && (node1 === node2)) {
                /**
                 * 5.2. For each attr in node2’s attribute list:
                 */
                for (let i = 0; i < node2._attributeList.length; i++) {
                    const attr = node2._attributeList[i];
                    /**
                     * 5.2.1. If attr equals attr1, then return the result of adding
                     * DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC and
                     * DOCUMENT_POSITION_PRECEDING.
                     * 5.2.2. If attr equals attr2, then return the result of adding
                     * DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC and
                     * DOCUMENT_POSITION_FOLLOWING.
                     */
                    if ((0, algorithm_1.node_equals)(attr, attr1)) {
                        return interfaces_1.Position.ImplementationSpecific | interfaces_1.Position.Preceding;
                    }
                    else if ((0, algorithm_1.node_equals)(attr, attr2)) {
                        return interfaces_1.Position.ImplementationSpecific | interfaces_1.Position.Following;
                    }
                }
            }
        }
        /**
         * 6. If node1 or node2 is null, or node1’s root is not node2’s root, then
         * return the result of adding DOCUMENT_POSITION_DISCONNECTED,
         * DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC, and either
         * DOCUMENT_POSITION_PRECEDING or DOCUMENT_POSITION_FOLLOWING,
         * with the constraint that this is to be consistent, together.
         */
        if (node1 === null || node2 === null ||
            (0, algorithm_1.tree_rootNode)(node1) !== (0, algorithm_1.tree_rootNode)(node2)) {
            // nodes are disconnected
            // return a random result but cache the value for consistency
            return interfaces_1.Position.Disconnected | interfaces_1.Position.ImplementationSpecific |
                (DOMImpl_1.dom.compareCache.check(this, other) ? interfaces_1.Position.Preceding : interfaces_1.Position.Following);
        }
        /**
         * 7. If node1 is an ancestor of node2 and attr1 is null, or node1 is node2
         * and attr2 is non-null, then return the result of adding
         * DOCUMENT_POSITION_CONTAINS to DOCUMENT_POSITION_PRECEDING.
         */
        if ((!attr1 && (0, algorithm_1.tree_isAncestorOf)(node2, node1)) ||
            (attr2 && (node1 === node2))) {
            return interfaces_1.Position.Contains | interfaces_1.Position.Preceding;
        }
        /**
         * 8. If node1 is a descendant of node2 and attr2 is null, or node1 is node2
         * and attr1 is non-null, then return the result of adding
         * DOCUMENT_POSITION_CONTAINED_BY to DOCUMENT_POSITION_FOLLOWING.
         */
        if ((!attr2 && (0, algorithm_1.tree_isDescendantOf)(node2, node1)) ||
            (attr1 && (node1 === node2))) {
            return interfaces_1.Position.ContainedBy | interfaces_1.Position.Following;
        }
        /**
         * 9. If node1 is preceding node2, then return DOCUMENT_POSITION_PRECEDING.
         */
        if ((0, algorithm_1.tree_isPreceding)(node2, node1))
            return interfaces_1.Position.Preceding;
        /**
         * 10. Return DOCUMENT_POSITION_FOLLOWING.
         */
        return interfaces_1.Position.Following;
    }
    /**
     * Returns `true` if given node is an inclusive descendant of this
     * node, and `false` otherwise (including when other node is `null`).
     *
     * @param other - the node to check
     */
    contains(other) {
        /**
         * The contains(other) method, when invoked, must return true if other is an
         * inclusive descendant of context object, and false otherwise (including
         * when other is null).
         */
        if (other === null)
            return false;
        return (0, algorithm_1.tree_isDescendantOf)(this, other, true);
    }
    /**
     * Returns the prefix for a given namespace URI, if present, and
     * `null` if not.
     *
     * @param namespace - the namespace to search
     */
    lookupPrefix(namespace) {
        /**
         * 1. If namespace is null or the empty string, then return null.
         * 2. Switch on the context object:
         */
        if (!namespace)
            return null;
        if (util_1.Guard.isElementNode(this)) {
            /**
             * Return the result of locating a namespace prefix for it using
             * namespace.
             */
            return (0, algorithm_1.node_locateANamespacePrefix)(this, namespace);
        }
        else if (util_1.Guard.isDocumentNode(this)) {
            /**
             * Return the result of locating a namespace prefix for its document
             * element, if its document element is non-null, and null otherwise.
             */
            if (this.documentElement === null) {
                return null;
            }
            else {
                return (0, algorithm_1.node_locateANamespacePrefix)(this.documentElement, namespace);
            }
        }
        else if (util_1.Guard.isDocumentTypeNode(this) || util_1.Guard.isDocumentFragmentNode(this)) {
            return null;
        }
        else if (util_1.Guard.isAttrNode(this)) {
            /**
             * Return the result of locating a namespace prefix for its element,
             * if its element is non-null, and null otherwise.
             */
            if (this._element === null) {
                return null;
            }
            else {
                return (0, algorithm_1.node_locateANamespacePrefix)(this._element, namespace);
            }
        }
        else {
            /**
             * Return the result of locating a namespace prefix for its parent
             * element, if its parent element is non-null, and null otherwise.
             */
            if (this._parent !== null && util_1.Guard.isElementNode(this._parent)) {
                return (0, algorithm_1.node_locateANamespacePrefix)(this._parent, namespace);
            }
            else {
                return null;
            }
        }
    }
    /**
     * Returns the namespace URI for a given prefix if present, and `null`
     * if not.
     *
     * @param prefix - the prefix to search
     */
    lookupNamespaceURI(prefix) {
        /**
         * 1. If prefix is the empty string, then set it to null.
         * 2. Return the result of running locate a namespace for the context object
         * using prefix.
         */
        return (0, algorithm_1.node_locateANamespace)(this, prefix || null);
    }
    /**
     * Returns `true` if the namespace is the default namespace on this
     * node or `false` if not.
     *
     * @param namespace - the namespace to check
     */
    isDefaultNamespace(namespace) {
        /**
         * 1. If namespace is the empty string, then set it to null.
         * 2. Let defaultNamespace be the result of running locate a namespace for
         * context object using null.
         * 3. Return true if defaultNamespace is the same as namespace, and false otherwise.
         */
        if (!namespace)
            namespace = null;
        const defaultNamespace = (0, algorithm_1.node_locateANamespace)(this, null);
        return (defaultNamespace === namespace);
    }
    /**
     * Inserts the node `newChild` before the existing child node
     * `refChild`. If `refChild` is `null`, inserts `newChild` at the end
     * of the list of children.
     *
     * If `newChild` is a {@link DocumentFragment} object, all of its
     * children are inserted, in the same order, before `refChild`.
     *
     * If `newChild` is already in the tree, it is first removed.
     *
     * @param newChild - the node to insert
     * @param refChild - the node before which the new node must be
     *   inserted
     *
     * @returns the newly inserted child node
     */
    insertBefore(newChild, refChild) {
        /**
         * The insertBefore(node, child) method, when invoked, must return the
         * result of pre-inserting node into context object before child.
         */
        return (0, algorithm_1.mutation_preInsert)(newChild, this, refChild);
    }
    /**
     * Adds the node `newChild` to the end of the list of children of this
     * node, and returns it. If `newChild` is already in the tree, it is
     * first removed.
     *
     * If `newChild` is a {@link DocumentFragment} object, the entire
     * contents of the document fragment are moved into the child list of
     * this node.
     *
     * @param newChild - the node to add
     *
     * @returns the newly inserted child node
     */
    appendChild(newChild) {
        /**
         * The appendChild(node) method, when invoked, must return the result of
         * appending node to context object.
         */
        return (0, algorithm_1.mutation_append)(newChild, this);
    }
    /**
     * Replaces the child node `oldChild` with `newChild` in the list of
     * children, and returns the `oldChild` node. If `newChild` is already
     * in the tree, it is first removed.
     *
     * @param newChild - the new node to put in the child list
     * @param oldChild - the node being replaced in the list
     *
     * @returns the removed child node
     */
    replaceChild(newChild, oldChild) {
        /**
         * The replaceChild(node, child) method, when invoked, must return the
         * result of replacing child with node within context object.
         */
        return (0, algorithm_1.mutation_replace)(oldChild, newChild, this);
    }
    /**
    * Removes the child node indicated by `oldChild` from the list of
    * children, and returns it.
    *
    * @param oldChild - the node being removed from the list
    *
    * @returns the removed child node
    */
    removeChild(oldChild) {
        /**
         * The removeChild(child) method, when invoked, must return the result of
         * pre-removing child from context object.
         */
        return (0, algorithm_1.mutation_preRemove)(oldChild, this);
    }
    /**
     * Gets the parent event target for the given event.
     *
     * @param event - an event
     */
    _getTheParent(event) {
        /**
         * A node’s get the parent algorithm, given an event, returns the node’s
         * assigned slot, if node is assigned, and node’s parent otherwise.
         */
        if (util_1.Guard.isSlotable(this) && (0, algorithm_1.shadowTree_isAssigned)(this)) {
            return this._assignedSlot;
        }
        else {
            return this._parent;
        }
    }
}
exports.NodeImpl = NodeImpl;
/**
 * A performance tweak to share an empty set between all node classes. This will
 * be overwritten by element, document and document fragment nodes to supply an
 * actual set of nodes.
 */
NodeImpl.prototype._children = new util_1.EmptySet();
/**
 * Define constants on prototype.
 */
(0, WebIDLAlgorithm_1.idl_defineConst)(NodeImpl.prototype, "ELEMENT_NODE", 1);
(0, WebIDLAlgorithm_1.idl_defineConst)(NodeImpl.prototype, "ATTRIBUTE_NODE", 2);
(0, WebIDLAlgorithm_1.idl_defineConst)(NodeImpl.prototype, "TEXT_NODE", 3);
(0, WebIDLAlgorithm_1.idl_defineConst)(NodeImpl.prototype, "CDATA_SECTION_NODE", 4);
(0, WebIDLAlgorithm_1.idl_defineConst)(NodeImpl.prototype, "ENTITY_REFERENCE_NODE", 5);
(0, WebIDLAlgorithm_1.idl_defineConst)(NodeImpl.prototype, "ENTITY_NODE", 6);
(0, WebIDLAlgorithm_1.idl_defineConst)(NodeImpl.prototype, "PROCESSING_INSTRUCTION_NODE", 7);
(0, WebIDLAlgorithm_1.idl_defineConst)(NodeImpl.prototype, "COMMENT_NODE", 8);
(0, WebIDLAlgorithm_1.idl_defineConst)(NodeImpl.prototype, "DOCUMENT_NODE", 9);
(0, WebIDLAlgorithm_1.idl_defineConst)(NodeImpl.prototype, "DOCUMENT_TYPE_NODE", 10);
(0, WebIDLAlgorithm_1.idl_defineConst)(NodeImpl.prototype, "DOCUMENT_FRAGMENT_NODE", 11);
(0, WebIDLAlgorithm_1.idl_defineConst)(NodeImpl.prototype, "NOTATION_NODE", 12);
(0, WebIDLAlgorithm_1.idl_defineConst)(NodeImpl.prototype, "DOCUMENT_POSITION_DISCONNECTED", 0x01);
(0, WebIDLAlgorithm_1.idl_defineConst)(NodeImpl.prototype, "DOCUMENT_POSITION_PRECEDING", 0x02);
(0, WebIDLAlgorithm_1.idl_defineConst)(NodeImpl.prototype, "DOCUMENT_POSITION_FOLLOWING", 0x04);
(0, WebIDLAlgorithm_1.idl_defineConst)(NodeImpl.prototype, "DOCUMENT_POSITION_CONTAINS", 0x08);
(0, WebIDLAlgorithm_1.idl_defineConst)(NodeImpl.prototype, "DOCUMENT_POSITION_CONTAINED_BY", 0x10);
(0, WebIDLAlgorithm_1.idl_defineConst)(NodeImpl.prototype, "DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC", 0x20);
//# sourceMappingURL=NodeImpl.js.map