"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create_domImplementation = create_domImplementation;
exports.create_window = create_window;
exports.create_xmlDocument = create_xmlDocument;
exports.create_document = create_document;
exports.create_abortController = create_abortController;
exports.create_abortSignal = create_abortSignal;
exports.create_documentType = create_documentType;
exports.create_element = create_element;
exports.create_htmlElement = create_htmlElement;
exports.create_htmlUnknownElement = create_htmlUnknownElement;
exports.create_documentFragment = create_documentFragment;
exports.create_shadowRoot = create_shadowRoot;
exports.create_attr = create_attr;
exports.create_text = create_text;
exports.create_cdataSection = create_cdataSection;
exports.create_comment = create_comment;
exports.create_processingInstruction = create_processingInstruction;
exports.create_htmlCollection = create_htmlCollection;
exports.create_nodeList = create_nodeList;
exports.create_nodeListStatic = create_nodeListStatic;
exports.create_namedNodeMap = create_namedNodeMap;
exports.create_range = create_range;
exports.create_nodeIterator = create_nodeIterator;
exports.create_treeWalker = create_treeWalker;
exports.create_nodeFilter = create_nodeFilter;
exports.create_mutationRecord = create_mutationRecord;
exports.create_domTokenList = create_domTokenList;
const DOMImplementationImpl_1 = require("../dom/DOMImplementationImpl");
const WindowImpl_1 = require("../dom/WindowImpl");
const XMLDocumentImpl_1 = require("../dom/XMLDocumentImpl");
const DocumentImpl_1 = require("../dom/DocumentImpl");
const AbortControllerImpl_1 = require("../dom/AbortControllerImpl");
const AbortSignalImpl_1 = require("../dom/AbortSignalImpl");
const DocumentTypeImpl_1 = require("../dom/DocumentTypeImpl");
const ElementImpl_1 = require("../dom/ElementImpl");
const DocumentFragmentImpl_1 = require("../dom/DocumentFragmentImpl");
const ShadowRootImpl_1 = require("../dom/ShadowRootImpl");
const AttrImpl_1 = require("../dom/AttrImpl");
const TextImpl_1 = require("../dom/TextImpl");
const CDATASectionImpl_1 = require("../dom/CDATASectionImpl");
const CommentImpl_1 = require("../dom/CommentImpl");
const ProcessingInstructionImpl_1 = require("../dom/ProcessingInstructionImpl");
const HTMLCollectionImpl_1 = require("../dom/HTMLCollectionImpl");
const NodeListImpl_1 = require("../dom/NodeListImpl");
const NodeListStaticImpl_1 = require("../dom/NodeListStaticImpl");
const NamedNodeMapImpl_1 = require("../dom/NamedNodeMapImpl");
const RangeImpl_1 = require("../dom/RangeImpl");
const NodeIteratorImpl_1 = require("../dom/NodeIteratorImpl");
const TreeWalkerImpl_1 = require("../dom/TreeWalkerImpl");
const NodeFilterImpl_1 = require("../dom/NodeFilterImpl");
const MutationRecordImpl_1 = require("../dom/MutationRecordImpl");
const DOMTokenListImpl_1 = require("../dom/DOMTokenListImpl");
/**
 * Creates a `DOMImplementation`.
 *
 * @param document - associated document
 */
function create_domImplementation(document) {
    return DOMImplementationImpl_1.DOMImplementationImpl._create(document);
}
/**
 * Creates a `Window` node.
 */
function create_window() {
    return WindowImpl_1.WindowImpl._create();
}
/**
 * Creates an `XMLDocument` node.
 */
function create_xmlDocument() {
    return new XMLDocumentImpl_1.XMLDocumentImpl();
}
/**
 * Creates a `Document` node.
 */
function create_document() {
    return new DocumentImpl_1.DocumentImpl();
}
/**
 * Creates an `AbortController`.
 */
function create_abortController() {
    return new AbortControllerImpl_1.AbortControllerImpl();
}
/**
 * Creates an `AbortSignal`.
 */
function create_abortSignal() {
    return AbortSignalImpl_1.AbortSignalImpl._create();
}
/**
 * Creates a `DocumentType` node.
 *
 * @param document - owner document
 * @param name - name of the node
 * @param publicId - `PUBLIC` identifier
 * @param systemId - `SYSTEM` identifier
 */
function create_documentType(document, name, publicId, systemId) {
    return DocumentTypeImpl_1.DocumentTypeImpl._create(document, name, publicId, systemId);
}
/**
 * Creates a new `Element` node.
 *
 * @param document - owner document
 * @param localName - local name
 * @param namespace - namespace
 * @param prefix - namespace prefix
 */
function create_element(document, localName, namespace, prefix) {
    return ElementImpl_1.ElementImpl._create(document, localName, namespace, prefix);
}
/**
 * Creates a new `HTMLElement` node.
 *
 * @param document - owner document
 * @param localName - local name
 * @param namespace - namespace
 * @param prefix - namespace prefix
 */
function create_htmlElement(document, localName, namespace, prefix) {
    // TODO: Implement in HTML DOM
    return ElementImpl_1.ElementImpl._create(document, localName, namespace, prefix);
}
/**
 * Creates a new `HTMLUnknownElement` node.
 *
 * @param document - owner document
 * @param localName - local name
 * @param namespace - namespace
 * @param prefix - namespace prefix
 */
function create_htmlUnknownElement(document, localName, namespace, prefix) {
    // TODO: Implement in HTML DOM
    return ElementImpl_1.ElementImpl._create(document, localName, namespace, prefix);
}
/**
 * Creates a new `DocumentFragment` node.
 *
 * @param document - owner document
 */
function create_documentFragment(document) {
    return DocumentFragmentImpl_1.DocumentFragmentImpl._create(document);
}
/**
 * Creates a new `ShadowRoot` node.
 *
 * @param document - owner document
 * @param host - shadow root's host element node
 */
function create_shadowRoot(document, host) {
    return ShadowRootImpl_1.ShadowRootImpl._create(document, host);
}
/**
 * Creates a new `Attr` node.
 *
 * @param document - owner document
 * @param localName - local name
 */
function create_attr(document, localName) {
    return AttrImpl_1.AttrImpl._create(document, localName);
}
/**
 * Creates a new `Text` node.
 *
 * @param document - owner document
 * @param data - node contents
 */
function create_text(document, data) {
    return TextImpl_1.TextImpl._create(document, data);
}
/**
 * Creates a new `CDATASection` node.
 *
 * @param document - owner document
 * @param data - node contents
 */
function create_cdataSection(document, data) {
    return CDATASectionImpl_1.CDATASectionImpl._create(document, data);
}
/**
 * Creates a new `Comment` node.
 *
 * @param document - owner document
 * @param data - node contents
 */
function create_comment(document, data) {
    return CommentImpl_1.CommentImpl._create(document, data);
}
/**
 * Creates a new `ProcessingInstruction` node.
 *
 * @param document - owner document
 * @param target - instruction target
 * @param data - node contents
 */
function create_processingInstruction(document, target, data) {
    return ProcessingInstructionImpl_1.ProcessingInstructionImpl._create(document, target, data);
}
/**
 * Creates a new `HTMLCollection`.
 *
 * @param root - root node
 * @param filter - node filter
 */
function create_htmlCollection(root, filter = (() => true)) {
    return HTMLCollectionImpl_1.HTMLCollectionImpl._create(root, filter);
}
/**
 * Creates a new live `NodeList`.
 *
 * @param root - root node
 */
function create_nodeList(root) {
    return NodeListImpl_1.NodeListImpl._create(root);
}
/**
 * Creates a new static `NodeList`.
 *
 * @param root - root node
 * @param items - a list of items to initialize the list
 */
function create_nodeListStatic(root, items) {
    return NodeListStaticImpl_1.NodeListStaticImpl._create(root, items);
}
/**
 * Creates a new `NamedNodeMap`.
 *
 * @param element - parent element
 */
function create_namedNodeMap(element) {
    return NamedNodeMapImpl_1.NamedNodeMapImpl._create(element);
}
/**
 * Creates a new `Range`.
 *
 * @param start - start point
 * @param end - end point
 */
function create_range(start, end) {
    return RangeImpl_1.RangeImpl._create(start, end);
}
/**
 * Creates a new `NodeIterator`.
 *
 * @param root - iterator's root node
 * @param reference - reference node
 * @param pointerBeforeReference - whether the iterator is before or after the
 * reference node
 */
function create_nodeIterator(root, reference, pointerBeforeReference) {
    return NodeIteratorImpl_1.NodeIteratorImpl._create(root, reference, pointerBeforeReference);
}
/**
 * Creates a new `TreeWalker`.
 *
 * @param root - iterator's root node
 * @param current - current node
 */
function create_treeWalker(root, current) {
    return TreeWalkerImpl_1.TreeWalkerImpl._create(root, current);
}
/**
 * Creates a new `NodeFilter`.
 */
function create_nodeFilter() {
    return NodeFilterImpl_1.NodeFilterImpl._create();
}
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
function create_mutationRecord(type, target, addedNodes, removedNodes, previousSibling, nextSibling, attributeName, attributeNamespace, oldValue) {
    return MutationRecordImpl_1.MutationRecordImpl._create(type, target, addedNodes, removedNodes, previousSibling, nextSibling, attributeName, attributeNamespace, oldValue);
}
/**
 * Creates a new `DOMTokenList`.
 *
 * @param element - associated element
 * @param attribute - associated attribute
 */
function create_domTokenList(element, attribute) {
    return DOMTokenListImpl_1.DOMTokenListImpl._create(element, attribute);
}
//# sourceMappingURL=CreateAlgorithm.js.map