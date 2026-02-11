"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentImpl = void 0;
const DOMImpl_1 = require("./DOMImpl");
const interfaces_1 = require("./interfaces");
const DOMException_1 = require("./DOMException");
const NodeImpl_1 = require("./NodeImpl");
const util_1 = require("../util");
const util_2 = require("@oozcitak/util");
const infra_1 = require("@oozcitak/infra");
const URLAlgorithm_1 = require("@oozcitak/url/lib/URLAlgorithm");
const algorithm_1 = require("../algorithm");
const WebIDLAlgorithm_1 = require("../algorithm/WebIDLAlgorithm");
/**
 * Represents a document node.
 */
class DocumentImpl extends NodeImpl_1.NodeImpl {
    _nodeType = interfaces_1.NodeType.Document;
    _children = new Set();
    _encoding = {
        name: "UTF-8",
        labels: ["unicode-1-1-utf-8", "utf-8", "utf8"]
    };
    _contentType = 'application/xml';
    _URL = {
        scheme: "about",
        username: "",
        password: "",
        host: null,
        port: null,
        path: ["blank"],
        query: null,
        fragment: null,
        _cannotBeABaseURLFlag: true,
        _blobURLEntry: null
    };
    _origin = null;
    _type = "xml";
    _mode = "no-quirks";
    _implementation;
    _documentElement = null;
    _hasNamespaces = false;
    _nodeDocumentOverwrite = null;
    get _nodeDocument() { return this._nodeDocumentOverwrite || this; }
    set _nodeDocument(val) { this._nodeDocumentOverwrite = val; }
    /**
     * Initializes a new instance of `Document`.
     */
    constructor() {
        super();
    }
    /** @inheritdoc */
    get implementation() {
        /**
         * The implementation attribute’s getter must return the DOMImplementation
         * object that is associated with the document.
         */
        return this._implementation || (this._implementation = (0, algorithm_1.create_domImplementation)(this));
    }
    /** @inheritdoc */
    get URL() {
        /**
         * The URL attribute’s getter and documentURI attribute’s getter must return
         * the URL, serialized.
         * See: https://url.spec.whatwg.org/#concept-url-serializer
         */
        return (0, URLAlgorithm_1.urlSerializer)(this._URL);
    }
    /** @inheritdoc */
    get documentURI() { return this.URL; }
    /** @inheritdoc */
    get origin() {
        return "null";
    }
    /** @inheritdoc */
    get compatMode() {
        /**
         * The compatMode attribute’s getter must return "BackCompat" if context
         * object’s mode is "quirks", and "CSS1Compat" otherwise.
         */
        return this._mode === "quirks" ? "BackCompat" : "CSS1Compat";
    }
    /** @inheritdoc */
    get characterSet() {
        /**
         * The characterSet attribute’s getter, charset attribute’s getter, and
         * inputEncoding attribute’s getter, must return context object’s
         * encoding’s name.
         */
        return this._encoding.name;
    }
    /** @inheritdoc */
    get charset() { return this._encoding.name; }
    /** @inheritdoc */
    get inputEncoding() { return this._encoding.name; }
    /** @inheritdoc */
    get contentType() {
        /**
         * The contentType attribute’s getter must return the content type.
         */
        return this._contentType;
    }
    /** @inheritdoc */
    get doctype() {
        /**
         * The doctype attribute’s getter must return the child of the document
         * that is a doctype, and null otherwise.
         */
        for (const child of this._children) {
            if (util_1.Guard.isDocumentTypeNode(child))
                return child;
        }
        return null;
    }
    /** @inheritdoc */
    get documentElement() {
        /**
         * The documentElement attribute’s getter must return the document element.
         */
        return this._documentElement;
    }
    /** @inheritdoc */
    getElementsByTagName(qualifiedName) {
        /**
         * The getElementsByTagName(qualifiedName) method, when invoked, must return
         * the list of elements with qualified name qualifiedName for the context object.
         */
        return (0, algorithm_1.node_listOfElementsWithQualifiedName)(qualifiedName, this);
    }
    /** @inheritdoc */
    getElementsByTagNameNS(namespace, localName) {
        /**
         * The getElementsByTagNameNS(namespace, localName) method, when invoked,
         * must return the list of elements with namespace namespace and local name
         * localName for the context object.
         */
        return (0, algorithm_1.node_listOfElementsWithNamespace)(namespace, localName, this);
    }
    /** @inheritdoc */
    getElementsByClassName(classNames) {
        /**
         * The getElementsByClassName(classNames) method, when invoked, must return
         * the list of elements with class names classNames for the context object.
         */
        return (0, algorithm_1.node_listOfElementsWithClassNames)(classNames, this);
    }
    /** @inheritdoc */
    createElement(localName, options) {
        /**
         * 1. If localName does not match the Name production, then throw an
         * "InvalidCharacterError" DOMException.
         * 2. If the context object is an HTML document, then set localName to
         * localName in ASCII lowercase.
         * 3. Let is be null.
         * 4. If options is a dictionary and options’s is is present, then set is
         * to it.
         * 5. Let namespace be the HTML namespace, if the context object is an
         * HTML document or context object’s content type is
         * "application/xhtml+xml", and null otherwise.
         * 6. Return the result of creating an element given the context object,
         * localName, namespace, null, is, and with the synchronous custom elements
         * flag set.
         */
        if (!(0, algorithm_1.xml_isName)(localName))
            throw new DOMException_1.InvalidCharacterError();
        if (this._type === "html")
            localName = localName.toLowerCase();
        let is = null;
        if (options !== undefined) {
            if ((0, util_2.isString)(options)) {
                is = options;
            }
            else {
                is = options.is;
            }
        }
        const namespace = (this._type === "html" || this._contentType === "application/xhtml+xml") ?
            infra_1.namespace.HTML : null;
        return (0, algorithm_1.element_createAnElement)(this, localName, namespace, null, is, true);
    }
    /** @inheritdoc */
    createElementNS(namespace, qualifiedName, options) {
        /**
         * The createElementNS(namespace, qualifiedName, options) method, when
         * invoked, must return the result of running the internal createElementNS
         * steps, given context object, namespace, qualifiedName, and options.
         */
        return (0, algorithm_1.document_internalCreateElementNS)(this, namespace, qualifiedName, options);
    }
    /** @inheritdoc */
    createDocumentFragment() {
        /**
         * The createDocumentFragment() method, when invoked, must return a new
         * DocumentFragment node with its node document set to the context object.
         */
        return (0, algorithm_1.create_documentFragment)(this);
    }
    /** @inheritdoc */
    createTextNode(data) {
        /**
         * The createTextNode(data) method, when invoked, must return a new Text
         * node with its data set to data and node document set to the context object.
         */
        return (0, algorithm_1.create_text)(this, data);
    }
    /** @inheritdoc */
    createCDATASection(data) {
        /**
         * 1. If context object is an HTML document, then throw a
         * "NotSupportedError" DOMException.
         * 2. If data contains the string "]]>", then throw an
         * "InvalidCharacterError" DOMException.
         * 3. Return a new CDATASection node with its data set to data and node
         * document set to the context object.
         */
        if (this._type === "html")
            throw new DOMException_1.NotSupportedError();
        if (data.indexOf(']]>') !== -1)
            throw new DOMException_1.InvalidCharacterError();
        return (0, algorithm_1.create_cdataSection)(this, data);
    }
    /** @inheritdoc */
    createComment(data) {
        /**
         * The createComment(data) method, when invoked, must return a new Comment
         * node with its data set to data and node document set to the context object.
         */
        return (0, algorithm_1.create_comment)(this, data);
    }
    /** @inheritdoc */
    createProcessingInstruction(target, data) {
        /**
         * 1. If target does not match the Name production, then throw an
         * "InvalidCharacterError" DOMException.
         * 2. If data contains the string "?>", then throw an
         * "InvalidCharacterError" DOMException.
         * 3. Return a new ProcessingInstruction node, with target set to target,
         * data set to data, and node document set to the context object.
         */
        if (!(0, algorithm_1.xml_isName)(target))
            throw new DOMException_1.InvalidCharacterError();
        if (data.indexOf("?>") !== -1)
            throw new DOMException_1.InvalidCharacterError();
        return (0, algorithm_1.create_processingInstruction)(this, target, data);
    }
    /** @inheritdoc */
    importNode(node, deep = false) {
        /**
         * 1. If node is a document or shadow root, then throw a "NotSupportedError" DOMException.
         */
        if (util_1.Guard.isDocumentNode(node) || util_1.Guard.isShadowRoot(node))
            throw new DOMException_1.NotSupportedError();
        /**
         * 2. Return a clone of node, with context object and the clone children flag set if deep is true.
         */
        return (0, algorithm_1.node_clone)(node, this, deep);
    }
    /** @inheritdoc */
    adoptNode(node) {
        /**
         * 1. If node is a document, then throw a "NotSupportedError" DOMException.
         */
        if (util_1.Guard.isDocumentNode(node))
            throw new DOMException_1.NotSupportedError();
        /**
         * 2. If node is a shadow root, then throw a "HierarchyRequestError" DOMException.
         */
        if (util_1.Guard.isShadowRoot(node))
            throw new DOMException_1.HierarchyRequestError();
        /**
         * 3. Adopt node into the context object.
         * 4. Return node.
         */
        (0, algorithm_1.document_adopt)(node, this);
        return node;
    }
    /** @inheritdoc */
    createAttribute(localName) {
        /**
         * 1. If localName does not match the Name production in XML, then throw
         * an "InvalidCharacterError" DOMException.
         * 2. If the context object is an HTML document, then set localName to
         * localName in ASCII lowercase.
         * 3. Return a new attribute whose local name is localName and node document
         * is context object.
         */
        if (!(0, algorithm_1.xml_isName)(localName))
            throw new DOMException_1.InvalidCharacterError();
        if (this._type === "html") {
            localName = localName.toLowerCase();
        }
        const attr = (0, algorithm_1.create_attr)(this, localName);
        return attr;
    }
    /** @inheritdoc */
    createAttributeNS(namespace, qualifiedName) {
        /**
         * 1. Let namespace, prefix, and localName be the result of passing
         * namespace and qualifiedName to validate and extract.
         * 2. Return a new attribute whose namespace is namespace, namespace prefix
         * is prefix, local name is localName, and node document is context object.
         */
        const [ns, prefix, localName] = (0, algorithm_1.namespace_validateAndExtract)(namespace, qualifiedName);
        const attr = (0, algorithm_1.create_attr)(this, localName);
        attr._namespace = ns;
        attr._namespacePrefix = prefix;
        return attr;
    }
    /** @inheritdoc */
    createEvent(eventInterface) {
        return (0, algorithm_1.event_createLegacyEvent)(eventInterface);
    }
    /** @inheritdoc */
    createRange() {
        /**
         * The createRange() method, when invoked, must return a new live range
         * with (context object, 0) as its start and end.
         */
        const range = (0, algorithm_1.create_range)();
        range._start = [this, 0];
        range._end = [this, 0];
        return range;
    }
    /** @inheritdoc */
    createNodeIterator(root, whatToShow = interfaces_1.WhatToShow.All, filter = null) {
        /**
         * 1. Let iterator be a new NodeIterator object.
         * 2. Set iterator’s root and iterator’s reference to root.
         * 3. Set iterator’s pointer before reference to true.
         * 4. Set iterator’s whatToShow to whatToShow.
         * 5. Set iterator’s filter to filter.
         * 6. Return iterator.
         */
        const iterator = (0, algorithm_1.create_nodeIterator)(root, root, true);
        iterator._whatToShow = whatToShow;
        iterator._iteratorCollection = (0, algorithm_1.create_nodeList)(root);
        if ((0, util_2.isFunction)(filter)) {
            iterator._filter = (0, algorithm_1.create_nodeFilter)();
            iterator._filter.acceptNode = filter;
        }
        else {
            iterator._filter = filter;
        }
        return iterator;
    }
    /** @inheritdoc */
    createTreeWalker(root, whatToShow = interfaces_1.WhatToShow.All, filter = null) {
        /**
         * 1. Let walker be a new TreeWalker object.
         * 2. Set walker’s root and walker’s current to root.
         * 3. Set walker’s whatToShow to whatToShow.
         * 4. Set walker’s filter to filter.
         * 5. Return walker.
         */
        const walker = (0, algorithm_1.create_treeWalker)(root, root);
        walker._whatToShow = whatToShow;
        if ((0, util_2.isFunction)(filter)) {
            walker._filter = (0, algorithm_1.create_nodeFilter)();
            walker._filter.acceptNode = filter;
        }
        else {
            walker._filter = filter;
        }
        return walker;
    }
    /**
     * Gets the parent event target for the given event.
     *
     * @param event - an event
     */
    _getTheParent(event) {
        /**
         * TODO: Implement realms
         * A document’s get the parent algorithm, given an event, returns null if
         * event’s type attribute value is "load" or document does not have a
         * browsing context, and the document’s relevant global object otherwise.
         */
        if (event._type === "load") {
            return null;
        }
        else {
            return DOMImpl_1.dom.window;
        }
    }
    // MIXIN: NonElementParentNode
    /* istanbul ignore next */
    getElementById(elementId) { throw new Error("Mixin: NonElementParentNode not implemented."); }
    // MIXIN: DocumentOrShadowRoot
    // No elements
    // MIXIN: ParentNode
    /* istanbul ignore next */
    get children() { throw new Error("Mixin: ParentNode not implemented."); }
    /* istanbul ignore next */
    get firstElementChild() { throw new Error("Mixin: ParentNode not implemented."); }
    /* istanbul ignore next */
    get lastElementChild() { throw new Error("Mixin: ParentNode not implemented."); }
    /* istanbul ignore next */
    get childElementCount() { throw new Error("Mixin: ParentNode not implemented."); }
    /* istanbul ignore next */
    prepend(...nodes) { throw new Error("Mixin: ParentNode not implemented."); }
    /* istanbul ignore next */
    append(...nodes) { throw new Error("Mixin: ParentNode not implemented."); }
    /* istanbul ignore next */
    querySelector(selectors) { throw new Error("Mixin: ParentNode not implemented."); }
    /* istanbul ignore next */
    querySelectorAll(selectors) { throw new Error("Mixin: ParentNode not implemented."); }
}
exports.DocumentImpl = DocumentImpl;
/**
 * Initialize prototype properties
 */
(0, WebIDLAlgorithm_1.idl_defineConst)(DocumentImpl.prototype, "_nodeType", interfaces_1.NodeType.Document);
//# sourceMappingURL=DocumentImpl.js.map