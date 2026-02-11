"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElementImpl = void 0;
const interfaces_1 = require("./interfaces");
const NodeImpl_1 = require("./NodeImpl");
const DOMException_1 = require("./DOMException");
const infra_1 = require("@oozcitak/infra");
const algorithm_1 = require("../algorithm");
const WebIDLAlgorithm_1 = require("../algorithm/WebIDLAlgorithm");
/**
 * Represents an element node.
 */
class ElementImpl extends NodeImpl_1.NodeImpl {
    _nodeType = interfaces_1.NodeType.Element;
    _children = new Set();
    _namespace = null;
    _namespacePrefix = null;
    _localName = "";
    _customElementState = "undefined";
    _customElementDefinition = null;
    _is = null;
    _shadowRoot = null;
    _attributeList = (0, algorithm_1.create_namedNodeMap)(this);
    _uniqueIdentifier;
    _attributeChangeSteps = [];
    _name = '';
    _assignedSlot = null;
    /**
     * Initializes a new instance of `Element`.
     */
    constructor() {
        super();
    }
    /** @inheritdoc */
    get namespaceURI() { return this._namespace; }
    /** @inheritdoc */
    get prefix() { return this._namespacePrefix; }
    /** @inheritdoc */
    get localName() { return this._localName; }
    /** @inheritdoc */
    get tagName() { return this._htmlUppercasedQualifiedName; }
    /** @inheritdoc */
    get id() {
        return (0, algorithm_1.element_getAnAttributeValue)(this, "id");
    }
    set id(value) {
        (0, algorithm_1.element_setAnAttributeValue)(this, "id", value);
    }
    /** @inheritdoc */
    get className() {
        return (0, algorithm_1.element_getAnAttributeValue)(this, "class");
    }
    set className(value) {
        (0, algorithm_1.element_setAnAttributeValue)(this, "class", value);
    }
    /** @inheritdoc */
    get classList() {
        let attr = (0, algorithm_1.element_getAnAttributeByName)("class", this);
        if (attr === null) {
            attr = (0, algorithm_1.create_attr)(this._nodeDocument, "class");
        }
        return (0, algorithm_1.create_domTokenList)(this, attr);
    }
    /** @inheritdoc */
    get slot() {
        return (0, algorithm_1.element_getAnAttributeValue)(this, "slot");
    }
    set slot(value) {
        (0, algorithm_1.element_setAnAttributeValue)(this, "slot", value);
    }
    /** @inheritdoc */
    hasAttributes() {
        return this._attributeList.length !== 0;
    }
    /** @inheritdoc */
    get attributes() { return this._attributeList; }
    /** @inheritdoc */
    getAttributeNames() {
        /**
         * The getAttributeNames() method, when invoked, must return the qualified
         * names of the attributes in context object’s attribute list, in order,
         * and a new list otherwise.
         */
        const names = [];
        for (const attr of this._attributeList) {
            names.push(attr._qualifiedName);
        }
        return names;
    }
    /** @inheritdoc */
    getAttribute(qualifiedName) {
        /**
         * 1. Let attr be the result of getting an attribute given qualifiedName
         * and the context object.
         * 2. If attr is null, return null.
         * 3. Return attr’s value.
         */
        const attr = (0, algorithm_1.element_getAnAttributeByName)(qualifiedName, this);
        return (attr ? attr._value : null);
    }
    /** @inheritdoc */
    getAttributeNS(namespace, localName) {
        /**
         * 1. Let attr be the result of getting an attribute given namespace,
         * localName, and the context object.
         * 2. If attr is null, return null.
         * 3. Return attr’s value.
         */
        const attr = (0, algorithm_1.element_getAnAttributeByNamespaceAndLocalName)(namespace, localName, this);
        return (attr ? attr._value : null);
    }
    /** @inheritdoc */
    setAttribute(qualifiedName, value) {
        /**
         * 1. If qualifiedName does not match the Name production in XML, then
         * throw an "InvalidCharacterError" DOMException.
         */
        if (!(0, algorithm_1.xml_isName)(qualifiedName))
            throw new DOMException_1.InvalidCharacterError();
        /**
         * 2. If the context object is in the HTML namespace and its node document
         * is an HTML document, then set qualifiedName to qualifiedName in ASCII
         * lowercase.
         */
        if (this._namespace === infra_1.namespace.HTML && this._nodeDocument._type === "html") {
            qualifiedName = qualifiedName.toLowerCase();
        }
        /**
         * 3. Let attribute be the first attribute in context object’s attribute
         * list whose qualified name is qualifiedName, and null otherwise.
         */
        let attribute = null;
        for (let i = 0; i < this._attributeList.length; i++) {
            const attr = this._attributeList[i];
            if (attr._qualifiedName === qualifiedName) {
                attribute = attr;
                break;
            }
        }
        /**
         * 4. If attribute is null, create an attribute whose local name is
         * qualifiedName, value is value, and node document is context object’s
         * node document, then append this attribute to context object, and
         * then return.
         */
        if (attribute === null) {
            attribute = (0, algorithm_1.create_attr)(this._nodeDocument, qualifiedName);
            attribute._value = value;
            (0, algorithm_1.element_append)(attribute, this);
            return;
        }
        /**
         * 5. Change attribute from context object to value.
         */
        (0, algorithm_1.element_change)(attribute, this, value);
    }
    /** @inheritdoc */
    setAttributeNS(namespace, qualifiedName, value) {
        /**
         * 1. Let namespace, prefix, and localName be the result of passing
         * namespace and qualifiedName to validate and extract.
         * 2. Set an attribute value for the context object using localName, value,
         * and also prefix and namespace.
         */
        const [ns, prefix, localName] = (0, algorithm_1.namespace_validateAndExtract)(namespace, qualifiedName);
        (0, algorithm_1.element_setAnAttributeValue)(this, localName, value, prefix, ns);
    }
    /** @inheritdoc */
    removeAttribute(qualifiedName) {
        /**
         * The removeAttribute(qualifiedName) method, when invoked, must remove an
         * attribute given qualifiedName and the context object, and then return
         * undefined.
         */
        (0, algorithm_1.element_removeAnAttributeByName)(qualifiedName, this);
    }
    /** @inheritdoc */
    removeAttributeNS(namespace, localName) {
        /**
         * The removeAttributeNS(namespace, localName) method, when invoked, must
         * remove an attribute given namespace, localName, and context object, and
         * then return undefined.
         */
        (0, algorithm_1.element_removeAnAttributeByNamespaceAndLocalName)(namespace, localName, this);
    }
    /** @inheritdoc */
    hasAttribute(qualifiedName) {
        /**
         * 1. If the context object is in the HTML namespace and its node document
         * is an HTML document, then set qualifiedName to qualifiedName in ASCII
         * lowercase.
         * 2. Return true if the context object has an attribute whose qualified
         * name is qualifiedName, and false otherwise.
         */
        if (this._namespace === infra_1.namespace.HTML && this._nodeDocument._type === "html") {
            qualifiedName = qualifiedName.toLowerCase();
        }
        for (let i = 0; i < this._attributeList.length; i++) {
            const attr = this._attributeList[i];
            if (attr._qualifiedName === qualifiedName) {
                return true;
            }
        }
        return false;
    }
    /** @inheritdoc */
    toggleAttribute(qualifiedName, force) {
        /**
         * 1. If qualifiedName does not match the Name production in XML, then
         * throw an "InvalidCharacterError" DOMException.
         */
        if (!(0, algorithm_1.xml_isName)(qualifiedName))
            throw new DOMException_1.InvalidCharacterError();
        /**
         * 2. If the context object is in the HTML namespace and its node document
         * is an HTML document, then set qualifiedName to qualifiedName in ASCII
         * lowercase.
         */
        if (this._namespace === infra_1.namespace.HTML && this._nodeDocument._type === "html") {
            qualifiedName = qualifiedName.toLowerCase();
        }
        /**
         * 3. Let attribute be the first attribute in the context object’s attribute
         * list whose qualified name is qualifiedName, and null otherwise.
         */
        let attribute = null;
        for (let i = 0; i < this._attributeList.length; i++) {
            const attr = this._attributeList[i];
            if (attr._qualifiedName === qualifiedName) {
                attribute = attr;
                break;
            }
        }
        if (attribute === null) {
            /**
             * 4. If attribute is null, then:
             * 4.1. If force is not given or is true, create an attribute whose local
             * name is qualifiedName, value is the empty string, and node document is
             * the context object’s node document, then append this attribute to the
             * context object, and then return true.
             * 4.2. Return false.
             */
            if (force === undefined || force === true) {
                attribute = (0, algorithm_1.create_attr)(this._nodeDocument, qualifiedName);
                attribute._value = '';
                (0, algorithm_1.element_append)(attribute, this);
                return true;
            }
            return false;
        }
        else if (force === undefined || force === false) {
            /**
             * 5. Otherwise, if force is not given or is false, remove an attribute
             * given qualifiedName and the context object, and then return false.
             */
            (0, algorithm_1.element_removeAnAttributeByName)(qualifiedName, this);
            return false;
        }
        /**
         * 6. Return true.
         */
        return true;
    }
    /** @inheritdoc */
    hasAttributeNS(namespace, localName) {
        /**
         * 1. If namespace is the empty string, set it to null.
         * 2. Return true if the context object has an attribute whose namespace is
         * namespace and local name is localName, and false otherwise.
         */
        const ns = namespace || null;
        for (let i = 0; i < this._attributeList.length; i++) {
            const attr = this._attributeList[i];
            if (attr._namespace === ns && attr._localName === localName) {
                return true;
            }
        }
        return false;
    }
    /** @inheritdoc */
    getAttributeNode(qualifiedName) {
        /**
         * The getAttributeNode(qualifiedName) method, when invoked, must return the
         * result of getting an attribute given qualifiedName and context object.
         */
        return (0, algorithm_1.element_getAnAttributeByName)(qualifiedName, this);
    }
    /** @inheritdoc */
    getAttributeNodeNS(namespace, localName) {
        /**
         * The getAttributeNodeNS(namespace, localName) method, when invoked, must
         * return the result of getting an attribute given namespace, localName, and
         * the context object.
         */
        return (0, algorithm_1.element_getAnAttributeByNamespaceAndLocalName)(namespace, localName, this);
    }
    /** @inheritdoc */
    setAttributeNode(attr) {
        /**
         * The setAttributeNode(attr) and setAttributeNodeNS(attr) methods, when
         * invoked, must return the result of setting an attribute given attr and
         * the context object.
         */
        return (0, algorithm_1.element_setAnAttribute)(attr, this);
    }
    /** @inheritdoc */
    setAttributeNodeNS(attr) {
        return (0, algorithm_1.element_setAnAttribute)(attr, this);
    }
    /** @inheritdoc */
    removeAttributeNode(attr) {
        /**
         * 1. If context object’s attribute list does not contain attr, then throw
         * a "NotFoundError" DOMException.
         * 2. Remove attr from context object.
         * 3. Return attr.
         */
        let found = false;
        for (let i = 0; i < this._attributeList.length; i++) {
            const attribute = this._attributeList[i];
            if (attribute === attr) {
                found = true;
                break;
            }
        }
        if (!found)
            throw new DOMException_1.NotFoundError();
        (0, algorithm_1.element_remove)(attr, this);
        return attr;
    }
    /** @inheritdoc */
    attachShadow(init) {
        /**
         * 1. If context object’s namespace is not the HTML namespace, then throw a
         * "NotSupportedError" DOMException.
         */
        if (this._namespace !== infra_1.namespace.HTML)
            throw new DOMException_1.NotSupportedError();
        /**
         * 2. If context object’s local name is not a valid custom element name,
         * "article", "aside", "blockquote", "body", "div", "footer", "h1", "h2",
         * "h3", "h4", "h5", "h6", "header", "main" "nav", "p", "section",
         * or "span", then throw a "NotSupportedError" DOMException.
         */
        if (!(0, algorithm_1.customElement_isValidCustomElementName)(this._localName) &&
            !(0, algorithm_1.customElement_isValidShadowHostName)(this._localName))
            throw new DOMException_1.NotSupportedError();
        /**
         * 3. If context object’s local name is a valid custom element name,
         * or context object’s is value is not null, then:
         * 3.1. Let definition be the result of looking up a custom element
         * definition given context object’s node document, its namespace, its
         * local name, and its is value.
         * 3.2. If definition is not null and definition’s disable shadow is true,
         *  then throw a "NotSupportedError" DOMException.
         */
        if ((0, algorithm_1.customElement_isValidCustomElementName)(this._localName) || this._is !== null) {
            const definition = (0, algorithm_1.customElement_lookUpACustomElementDefinition)(this._nodeDocument, this._namespace, this._localName, this._is);
            if (definition !== null && definition.disableShadow === true) {
                throw new DOMException_1.NotSupportedError();
            }
        }
        /**
         * 4. If context object is a shadow host, then throw an "NotSupportedError"
         * DOMException.
         */
        if (this._shadowRoot !== null)
            throw new DOMException_1.NotSupportedError();
        /**
         * 5. Let shadow be a new shadow root whose node document is context
         * object’s node document, host is context object, and mode is init’s mode.
         * 6. Set context object’s shadow root to shadow.
         * 7. Return shadow.
         */
        const shadow = (0, algorithm_1.create_shadowRoot)(this._nodeDocument, this);
        shadow._mode = init.mode;
        this._shadowRoot = shadow;
        return shadow;
    }
    /** @inheritdoc */
    get shadowRoot() {
        /**
         * 1. Let shadow be context object’s shadow root.
         * 2. If shadow is null or its mode is "closed", then return null.
         * 3. Return shadow.
         */
        const shadow = this._shadowRoot;
        if (shadow === null || shadow.mode === "closed")
            return null;
        else
            return shadow;
    }
    /** @inheritdoc */
    closest(selectors) {
        /**
         * TODO: Selectors
         * 1. Let s be the result of parse a selector from selectors. [SELECTORS4]
         * 2. If s is failure, throw a "SyntaxError" DOMException.
         * 3. Let elements be context object’s inclusive ancestors that are
         * elements, in reverse tree order.
         * 4. For each element in elements, if match a selector against an element,
         * using s, element, and :scope element context object, returns success,
         * return element. [SELECTORS4]
         * 5. Return null.
         */
        throw new DOMException_1.NotImplementedError();
    }
    /** @inheritdoc */
    matches(selectors) {
        /**
         * TODO: Selectors
         * 1. Let s be the result of parse a selector from selectors. [SELECTORS4]
         * 2. If s is failure, throw a "SyntaxError" DOMException.
         * 3. Return true if the result of match a selector against an element,
         * using s, element, and :scope element context object, returns success,
         * and false otherwise. [SELECTORS4]
         */
        throw new DOMException_1.NotImplementedError();
    }
    /** @inheritdoc */
    webkitMatchesSelector(selectors) {
        return this.matches(selectors);
    }
    /** @inheritdoc */
    getElementsByTagName(qualifiedName) {
        /**
         * The getElementsByTagName(qualifiedName) method, when invoked, must return
         * the list of elements with qualified name qualifiedName for context
         * object.
         */
        return (0, algorithm_1.node_listOfElementsWithQualifiedName)(qualifiedName, this);
    }
    /** @inheritdoc */
    getElementsByTagNameNS(namespace, localName) {
        /**
         * The getElementsByTagNameNS(namespace, localName) method, when invoked,
         * must return the list of elements with namespace namespace and local name
         * localName for context object.
         */
        return (0, algorithm_1.node_listOfElementsWithNamespace)(namespace, localName, this);
    }
    /** @inheritdoc */
    getElementsByClassName(classNames) {
        /**
         * The getElementsByClassName(classNames) method, when invoked, must return
         * the list of elements with class names classNames for context object.
         */
        return (0, algorithm_1.node_listOfElementsWithClassNames)(classNames, this);
    }
    /** @inheritdoc */
    insertAdjacentElement(where, element) {
        /**
         * The insertAdjacentElement(where, element) method, when invoked, must
         * return the result of running insert adjacent, given context object,
         *  where, and element.
         */
        return (0, algorithm_1.element_insertAdjacent)(this, where, element);
    }
    /** @inheritdoc */
    insertAdjacentText(where, data) {
        /**
         * 1. Let text be a new Text node whose data is data and node document is
         * context object’s node document.
         * 2. Run insert adjacent, given context object, where, and text.
         */
        const text = (0, algorithm_1.create_text)(this._nodeDocument, data);
        (0, algorithm_1.element_insertAdjacent)(this, where, text);
    }
    /**
     * Returns the qualified name.
     */
    get _qualifiedName() {
        /**
         * An element’s qualified name is its local name if its namespace prefix is
         * null, and its namespace prefix, followed by ":", followed by its
         * local name, otherwise.
         */
        return (this._namespacePrefix ?
            this._namespacePrefix + ':' + this._localName :
            this._localName);
    }
    /**
     * Returns the upper-cased qualified name for a html element.
     */
    get _htmlUppercasedQualifiedName() {
        /**
         * 1. Let qualifiedName be context object’s qualified name.
         * 2. If the context object is in the HTML namespace and its node document
         * is an HTML document, then set qualifiedName to qualifiedName in ASCII
         * uppercase.
         * 3. Return qualifiedName.
         */
        let qualifiedName = this._qualifiedName;
        if (this._namespace === infra_1.namespace.HTML && this._nodeDocument._type === "html") {
            qualifiedName = qualifiedName.toUpperCase();
        }
        return qualifiedName;
    }
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
    // MIXIN: NonDocumentTypeChildNode
    /* istanbul ignore next */
    get previousElementSibling() { throw new Error("Mixin: NonDocumentTypeChildNode not implemented."); }
    /* istanbul ignore next */
    get nextElementSibling() { throw new Error("Mixin: NonDocumentTypeChildNode not implemented."); }
    // MIXIN: ChildNode
    /* istanbul ignore next */
    before(...nodes) { throw new Error("Mixin: ChildNode not implemented."); }
    /* istanbul ignore next */
    after(...nodes) { throw new Error("Mixin: ChildNode not implemented."); }
    /* istanbul ignore next */
    replaceWith(...nodes) { throw new Error("Mixin: ChildNode not implemented."); }
    /* istanbul ignore next */
    remove() { throw new Error("Mixin: ChildNode not implemented."); }
    // MIXIN: Slotable
    /* istanbul ignore next */
    get assignedSlot() { throw new Error("Mixin: Slotable not implemented."); }
    /**
     * Creates a new `Element`.
     *
     * @param document - owner document
     * @param localName - local name
     * @param namespace - namespace
     * @param prefix - namespace prefix
     */
    static _create(document, localName, namespace = null, namespacePrefix = null) {
        const node = new ElementImpl();
        node._localName = localName;
        node._namespace = namespace;
        node._namespacePrefix = namespacePrefix;
        node._nodeDocument = document;
        return node;
    }
}
exports.ElementImpl = ElementImpl;
/**
 * Initialize prototype properties
 */
(0, WebIDLAlgorithm_1.idl_defineConst)(ElementImpl.prototype, "_nodeType", interfaces_1.NodeType.Element);
//# sourceMappingURL=ElementImpl.js.map