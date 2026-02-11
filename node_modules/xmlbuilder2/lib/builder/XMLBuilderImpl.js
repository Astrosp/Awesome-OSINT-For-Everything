"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XMLBuilderImpl = void 0;
const interfaces_1 = require("../interfaces");
const util_1 = require("@oozcitak/util");
const writers_1 = require("../writers");
const interfaces_2 = require("@oozcitak/dom/lib/dom/interfaces");
const util_2 = require("@oozcitak/dom/lib/util");
const algorithm_1 = require("@oozcitak/dom/lib/algorithm");
const dom_1 = require("./dom");
const infra_1 = require("@oozcitak/infra");
const readers_1 = require("../readers");
/**
 * Represents a wrapper that extends XML nodes to implement easy to use and
 * chainable document builder methods.
 */
class XMLBuilderImpl {
    _domNode;
    /**
     * Initializes a new instance of `XMLBuilderNodeImpl`.
     *
     * @param domNode - the DOM node to wrap
     */
    constructor(domNode) {
        this._domNode = domNode;
    }
    /** @inheritdoc */
    get node() { return this._domNode; }
    /** @inheritdoc */
    get options() { return this._options; }
    /** @inheritdoc */
    set(options) {
        this._options = (0, util_1.applyDefaults)((0, util_1.applyDefaults)(this._options, options, true), // apply user settings
        interfaces_1.DefaultBuilderOptions); // provide defaults
        return this;
    }
    /** @inheritdoc */
    ele(p1, p2, p3) {
        let namespace;
        let name;
        let attributes;
        if ((0, util_1.isObject)(p1)) {
            // ele(obj: ExpandObject)
            return new readers_1.ObjectReader(this._options).parse(this, p1);
        }
        else if ((0, util_1.isString)(p1) && p1 !== null && /^\s*</.test(p1)) {
            // parse XML document string
            return new readers_1.XMLReader(this._options).parse(this, p1);
        }
        else if ((0, util_1.isString)(p1) && p1 !== null && /^\s*[\{\[]/.test(p1)) {
            // parse JSON string
            return new readers_1.JSONReader(this._options).parse(this, p1);
        }
        else if ((0, util_1.isString)(p1) && p1 !== null && /^(\s*|(#.*)|(%.*))*---/.test(p1)) {
            // parse YAML string
            return new readers_1.YAMLReader(this._options).parse(this, p1);
        }
        if ((p1 === null || (0, util_1.isString)(p1)) && (0, util_1.isString)(p2)) {
            // ele(namespace: string, name: string, attributes?: AttributesObject)
            [namespace, name, attributes] = [p1, p2, p3];
        }
        else if (p1 !== null) {
            // ele(name: string, attributes?: AttributesObject)
            [namespace, name, attributes] = [undefined, p1, (0, util_1.isObject)(p2) ? p2 : undefined];
        }
        else {
            throw new Error("Element name cannot be null. " + this._debugInfo());
        }
        if (attributes) {
            attributes = (0, util_1.getValue)(attributes);
        }
        [namespace, name] = this._extractNamespace((0, dom_1.sanitizeInput)(namespace, this._options.invalidCharReplacement), (0, dom_1.sanitizeInput)(name, this._options.invalidCharReplacement), true);
        // inherit namespace from parent
        if (namespace === undefined) {
            const [prefix] = (0, algorithm_1.namespace_extractQName)(name);
            namespace = this.node.lookupNamespaceURI(prefix);
        }
        // create a child element node
        const childNode = (namespace !== undefined && namespace !== null ?
            this._doc.createElementNS(namespace, name) :
            this._doc.createElement(name));
        this.node.appendChild(childNode);
        const builder = new XMLBuilderImpl(childNode);
        // update doctype node if the new node is the document element node
        const oldDocType = this._doc.doctype;
        if (childNode === this._doc.documentElement && oldDocType !== null) {
            const docType = this._doc.implementation.createDocumentType(this._doc.documentElement.tagName, oldDocType.publicId, oldDocType.systemId);
            this._doc.replaceChild(docType, oldDocType);
        }
        // create attributes
        if (attributes && !(0, util_1.isEmpty)(attributes)) {
            builder.att(attributes);
        }
        return builder;
    }
    /** @inheritdoc */
    remove() {
        const parent = this.up();
        parent.node.removeChild(this.node);
        return parent;
    }
    /** @inheritdoc */
    att(p1, p2, p3) {
        if ((0, util_1.isMap)(p1) || (0, util_1.isObject)(p1)) {
            // att(obj: AttributesObject)
            // expand if object
            (0, util_1.forEachObject)(p1, (attName, attValue) => this.att(attName, attValue), this);
            return this;
        }
        // get primitive values
        if (p1 !== undefined && p1 !== null)
            p1 = (0, util_1.getValue)(p1 + "");
        if (p2 !== undefined && p2 !== null)
            p2 = (0, util_1.getValue)(p2 + "");
        if (p3 !== undefined && p3 !== null)
            p3 = (0, util_1.getValue)(p3 + "");
        let namespace;
        let name;
        let value;
        if ((p1 === null || (0, util_1.isString)(p1)) && (0, util_1.isString)(p2) && (p3 === null || (0, util_1.isString)(p3))) {
            // att(namespace: string, name: string, value: string)
            [namespace, name, value] = [p1, p2, p3];
        }
        else if ((0, util_1.isString)(p1) && (p2 == null || (0, util_1.isString)(p2))) {
            // ele(name: string, value: string)
            [namespace, name, value] = [undefined, p1, p2];
        }
        else {
            throw new Error("Attribute name and value not specified. " + this._debugInfo());
        }
        if (this._options.keepNullAttributes && (value == null)) {
            // keep null attributes
            value = "";
        }
        else if (value == null) {
            // skip null|undefined attributes
            return this;
        }
        if (!util_2.Guard.isElementNode(this.node)) {
            throw new Error("An attribute can only be assigned to an element node.");
        }
        let ele = this.node;
        [namespace, name] = this._extractNamespace(namespace, name, false);
        name = (0, dom_1.sanitizeInput)(name, this._options.invalidCharReplacement);
        namespace = (0, dom_1.sanitizeInput)(namespace, this._options.invalidCharReplacement);
        value = (0, dom_1.sanitizeInput)(value, this._options.invalidCharReplacement);
        const [prefix, localName] = (0, algorithm_1.namespace_extractQName)(name);
        const [elePrefix] = (0, algorithm_1.namespace_extractQName)(ele.prefix ? ele.prefix + ':' + ele.localName : ele.localName);
        // check if this is a namespace declaration attribute
        // assign a new element namespace if it wasn't previously assigned
        let eleNamespace = null;
        if (prefix === "xmlns") {
            namespace = infra_1.namespace.XMLNS;
            if (ele.namespaceURI === null && elePrefix === localName) {
                eleNamespace = value;
            }
        }
        else if (prefix === null && localName === "xmlns" && elePrefix === null) {
            namespace = infra_1.namespace.XMLNS;
            eleNamespace = value;
        }
        // re-create the element node if its namespace changed
        // we can't simply change the namespaceURI since its read-only
        if (eleNamespace !== null) {
            this._updateNamespace(eleNamespace);
            ele = this.node;
        }
        if (namespace !== undefined) {
            ele.setAttributeNS(namespace, name, value);
        }
        else {
            ele.setAttribute(name, value);
        }
        return this;
    }
    /** @inheritdoc */
    removeAtt(p1, p2) {
        if (!util_2.Guard.isElementNode(this.node)) {
            throw new Error("An attribute can only be removed from an element node.");
        }
        // get primitive values
        p1 = (0, util_1.getValue)(p1);
        if (p2 !== undefined) {
            p2 = (0, util_1.getValue)(p2);
        }
        let namespace;
        let name;
        if (p1 !== null && p2 === undefined) {
            name = p1;
        }
        else if ((p1 === null || (0, util_1.isString)(p1)) && p2 !== undefined) {
            namespace = p1;
            name = p2;
        }
        else {
            throw new Error("Attribute namespace must be a string. " + this._debugInfo());
        }
        if ((0, util_1.isArray)(name) || (0, util_1.isSet)(name)) {
            // removeAtt(names: string[])
            // removeAtt(namespace: string, names: string[])
            (0, util_1.forEachArray)(name, attName => namespace === undefined ? this.removeAtt(attName) : this.removeAtt(namespace, attName), this);
        }
        else if (namespace !== undefined) {
            // removeAtt(namespace: string, name: string)
            name = (0, dom_1.sanitizeInput)(name, this._options.invalidCharReplacement);
            namespace = (0, dom_1.sanitizeInput)(namespace, this._options.invalidCharReplacement);
            this.node.removeAttributeNS(namespace, name);
        }
        else {
            // removeAtt(name: string)
            name = (0, dom_1.sanitizeInput)(name, this._options.invalidCharReplacement);
            this.node.removeAttribute(name);
        }
        return this;
    }
    /** @inheritdoc */
    txt(content) {
        if (content === null || content === undefined) {
            if (this._options.keepNullNodes) {
                // keep null nodes
                content = "";
            }
            else {
                // skip null|undefined nodes
                return this;
            }
        }
        const child = this._doc.createTextNode((0, dom_1.sanitizeInput)(content, this._options.invalidCharReplacement));
        this.node.appendChild(child);
        return this;
    }
    /** @inheritdoc */
    com(content) {
        if (content === null || content === undefined) {
            if (this._options.keepNullNodes) {
                // keep null nodes
                content = "";
            }
            else {
                // skip null|undefined nodes
                return this;
            }
        }
        const child = this._doc.createComment((0, dom_1.sanitizeInput)(content, this._options.invalidCharReplacement));
        this.node.appendChild(child);
        return this;
    }
    /** @inheritdoc */
    dat(content) {
        if (content === null || content === undefined) {
            if (this._options.keepNullNodes) {
                // keep null nodes
                content = "";
            }
            else {
                // skip null|undefined nodes
                return this;
            }
        }
        const child = this._doc.createCDATASection((0, dom_1.sanitizeInput)(content, this._options.invalidCharReplacement));
        this.node.appendChild(child);
        return this;
    }
    /** @inheritdoc */
    ins(target, content = '') {
        if (content === null || content === undefined) {
            if (this._options.keepNullNodes) {
                // keep null nodes
                content = "";
            }
            else {
                // skip null|undefined nodes
                return this;
            }
        }
        if ((0, util_1.isArray)(target) || (0, util_1.isSet)(target)) {
            (0, util_1.forEachArray)(target, item => {
                item += "";
                const insIndex = item.indexOf(' ');
                const insTarget = (insIndex === -1 ? item : item.substr(0, insIndex));
                const insValue = (insIndex === -1 ? '' : item.substr(insIndex + 1));
                this.ins(insTarget, insValue);
            }, this);
        }
        else if ((0, util_1.isMap)(target) || (0, util_1.isObject)(target)) {
            (0, util_1.forEachObject)(target, (insTarget, insValue) => this.ins(insTarget, insValue), this);
        }
        else {
            const child = this._doc.createProcessingInstruction((0, dom_1.sanitizeInput)(target, this._options.invalidCharReplacement), (0, dom_1.sanitizeInput)(content, this._options.invalidCharReplacement));
            this.node.appendChild(child);
        }
        return this;
    }
    /** @inheritdoc */
    dec(options) {
        this._options.version = options.version || "1.0";
        this._options.encoding = options.encoding;
        this._options.standalone = options.standalone;
        return this;
    }
    /** @inheritdoc */
    dtd(options) {
        const name = (0, dom_1.sanitizeInput)((options && options.name) || (this._doc.documentElement ? this._doc.documentElement.tagName : "ROOT"), this._options.invalidCharReplacement);
        const pubID = (0, dom_1.sanitizeInput)((options && options.pubID) || "", this._options.invalidCharReplacement);
        const sysID = (0, dom_1.sanitizeInput)((options && options.sysID) || "", this._options.invalidCharReplacement);
        // name must match document element
        if (this._doc.documentElement !== null && name !== this._doc.documentElement.tagName) {
            throw new Error("DocType name does not match document element name.");
        }
        // create doctype node
        const docType = this._doc.implementation.createDocumentType(name, pubID, sysID);
        if (this._doc.doctype !== null) {
            // replace existing doctype
            this._doc.replaceChild(docType, this._doc.doctype);
        }
        else {
            // insert before document element node or append to end
            this._doc.insertBefore(docType, this._doc.documentElement);
        }
        return this;
    }
    /** @inheritdoc */
    import(node) {
        const hostNode = this._domNode;
        const hostDoc = this._doc;
        const importedNode = node.node;
        const updateImportedNodeNs = (clone) => {
            // update namespace of imported node only when not specified
            if (!clone._namespace) {
                const [prefix] = (0, algorithm_1.namespace_extractQName)(clone.prefix ? clone.prefix + ':' + clone.localName : clone.localName);
                const namespace = hostNode.lookupNamespaceURI(prefix);
                new XMLBuilderImpl(clone)._updateNamespace(namespace);
            }
        };
        if (util_2.Guard.isDocumentNode(importedNode)) {
            // import document node
            const elementNode = importedNode.documentElement;
            if (elementNode === null) {
                throw new Error("Imported document has no document element node. " + this._debugInfo());
            }
            const clone = hostDoc.importNode(elementNode, true);
            hostNode.appendChild(clone);
            updateImportedNodeNs(clone);
        }
        else if (util_2.Guard.isDocumentFragmentNode(importedNode)) {
            // import child nodes
            for (const childNode of importedNode.childNodes) {
                const clone = hostDoc.importNode(childNode, true);
                hostNode.appendChild(clone);
                if (util_2.Guard.isElementNode(clone)) {
                    updateImportedNodeNs(clone);
                }
            }
        }
        else {
            // import node
            const clone = hostDoc.importNode(importedNode, true);
            hostNode.appendChild(clone);
            if (util_2.Guard.isElementNode(clone)) {
                updateImportedNodeNs(clone);
            }
        }
        return this;
    }
    /** @inheritdoc */
    doc() {
        if (this._doc._isFragment) {
            let node = this.node;
            while (node && node.nodeType !== interfaces_2.NodeType.DocumentFragment) {
                node = node.parentNode;
            }
            /* istanbul ignore next */
            if (node === null) {
                throw new Error("Node has no parent node while searching for document fragment ancestor. " + this._debugInfo());
            }
            return new XMLBuilderImpl(node);
        }
        else {
            return new XMLBuilderImpl(this._doc);
        }
    }
    /** @inheritdoc */
    root() {
        const ele = this._doc.documentElement;
        if (!ele) {
            throw new Error("Document root element is null. " + this._debugInfo());
        }
        return new XMLBuilderImpl(ele);
    }
    /** @inheritdoc */
    up() {
        const parent = this._domNode.parentNode;
        if (!parent) {
            throw new Error("Parent node is null. " + this._debugInfo());
        }
        return new XMLBuilderImpl(parent);
    }
    /** @inheritdoc */
    prev() {
        const node = this._domNode.previousSibling;
        if (!node) {
            throw new Error("Previous sibling node is null. " + this._debugInfo());
        }
        return new XMLBuilderImpl(node);
    }
    /** @inheritdoc */
    next() {
        const node = this._domNode.nextSibling;
        if (!node) {
            throw new Error("Next sibling node is null. " + this._debugInfo());
        }
        return new XMLBuilderImpl(node);
    }
    /** @inheritdoc */
    first() {
        const node = this._domNode.firstChild;
        if (!node) {
            throw new Error("First child node is null. " + this._debugInfo());
        }
        return new XMLBuilderImpl(node);
    }
    /** @inheritdoc */
    last() {
        const node = this._domNode.lastChild;
        if (!node) {
            throw new Error("Last child node is null. " + this._debugInfo());
        }
        return new XMLBuilderImpl(node);
    }
    /** @inheritdoc */
    each(callback, self = false, recursive = false, thisArg) {
        let result = this._getFirstDescendantNode(this._domNode, self, recursive);
        while (result[0]) {
            const nextResult = this._getNextDescendantNode(this._domNode, result[0], recursive, result[1], result[2]);
            callback.call(thisArg, new XMLBuilderImpl(result[0]), result[1], result[2]);
            result = nextResult;
        }
        return this;
    }
    /** @inheritdoc */
    map(callback, self = false, recursive = false, thisArg) {
        let result = [];
        this.each((node, index, level) => result.push(callback.call(thisArg, node, index, level)), self, recursive);
        return result;
    }
    /** @inheritdoc */
    reduce(callback, initialValue, self = false, recursive = false, thisArg) {
        let value = initialValue;
        this.each((node, index, level) => value = callback.call(thisArg, value, node, index, level), self, recursive);
        return value;
    }
    /** @inheritdoc */
    find(predicate, self = false, recursive = false, thisArg) {
        let result = this._getFirstDescendantNode(this._domNode, self, recursive);
        while (result[0]) {
            const builder = new XMLBuilderImpl(result[0]);
            if (predicate.call(thisArg, builder, result[1], result[2])) {
                return builder;
            }
            result = this._getNextDescendantNode(this._domNode, result[0], recursive, result[1], result[2]);
        }
        return undefined;
    }
    /** @inheritdoc */
    filter(predicate, self = false, recursive = false, thisArg) {
        let result = [];
        this.each((node, index, level) => {
            if (predicate.call(thisArg, node, index, level)) {
                result.push(node);
            }
        }, self, recursive);
        return result;
    }
    /** @inheritdoc */
    every(predicate, self = false, recursive = false, thisArg) {
        let result = this._getFirstDescendantNode(this._domNode, self, recursive);
        while (result[0]) {
            const builder = new XMLBuilderImpl(result[0]);
            if (!predicate.call(thisArg, builder, result[1], result[2])) {
                return false;
            }
            result = this._getNextDescendantNode(this._domNode, result[0], recursive, result[1], result[2]);
        }
        return true;
    }
    /** @inheritdoc */
    some(predicate, self = false, recursive = false, thisArg) {
        let result = this._getFirstDescendantNode(this._domNode, self, recursive);
        while (result[0]) {
            const builder = new XMLBuilderImpl(result[0]);
            if (predicate.call(thisArg, builder, result[1], result[2])) {
                return true;
            }
            result = this._getNextDescendantNode(this._domNode, result[0], recursive, result[1], result[2]);
        }
        return false;
    }
    /** @inheritdoc */
    toArray(self = false, recursive = false) {
        let result = [];
        this.each(node => result.push(node), self, recursive);
        return result;
    }
    /** @inheritdoc */
    toString(writerOptions) {
        writerOptions = writerOptions || {};
        if (writerOptions.format === undefined) {
            writerOptions.format = "xml";
        }
        return this._serialize(writerOptions);
    }
    /** @inheritdoc */
    toObject(writerOptions) {
        writerOptions = writerOptions || {};
        if (writerOptions.format === undefined) {
            writerOptions.format = "object";
        }
        return this._serialize(writerOptions);
    }
    /** @inheritdoc */
    end(writerOptions) {
        writerOptions = writerOptions || {};
        if (writerOptions.format === undefined) {
            writerOptions.format = "xml";
        }
        return this.doc()._serialize(writerOptions);
    }
    /**
     * Gets the next descendant of the given node of the tree rooted at `root`
     * in depth-first pre-order. Returns a three-tuple with
     * [descendant, descendant_index, descendant_level].
     *
     * @param root - root node of the tree
     * @param self - whether to visit the current node along with child nodes
     * @param recursive - whether to visit all descendant nodes in tree-order or
     * only the immediate child nodes
     */
    _getFirstDescendantNode(root, self, recursive) {
        if (self)
            return [this._domNode, 0, 0];
        else if (recursive)
            return this._getNextDescendantNode(root, root, recursive, 0, 0);
        else
            return [this._domNode.firstChild, 0, 1];
    }
    /**
     * Gets the next descendant of the given node of the tree rooted at `root`
     * in depth-first pre-order. Returns a three-tuple with
     * [descendant, descendant_index, descendant_level].
     *
     * @param root - root node of the tree
     * @param node - current node
     * @param recursive - whether to visit all descendant nodes in tree-order or
     * only the immediate child nodes
     * @param index - child node index
     * @param level - current depth of the XML tree
     */
    _getNextDescendantNode(root, node, recursive, index, level) {
        if (recursive) {
            // traverse child nodes
            if (node.firstChild)
                return [node.firstChild, 0, level + 1];
            if (node === root)
                return [null, -1, -1];
            // traverse siblings
            if (node.nextSibling)
                return [node.nextSibling, index + 1, level];
            // traverse parent's next sibling
            let parent = node.parentNode;
            while (parent && parent !== root) {
                if (parent.nextSibling)
                    return [parent.nextSibling, (0, algorithm_1.tree_index)(parent.nextSibling), level - 1];
                parent = parent.parentNode;
                level--;
            }
        }
        else {
            if (root === node)
                return [node.firstChild, 0, level + 1];
            else
                return [node.nextSibling, index + 1, level];
        }
        return [null, -1, -1];
    }
    /**
     * Converts the node into its string or object representation.
     *
     * @param options - serialization options
     */
    _serialize(writerOptions) {
        if (writerOptions.format === "xml") {
            const writer = new writers_1.XMLWriter(this._options, writerOptions);
            return writer.serialize(this.node);
        }
        else if (writerOptions.format === "map") {
            const writer = new writers_1.MapWriter(this._options, writerOptions);
            return writer.serialize(this.node);
        }
        else if (writerOptions.format === "object") {
            const writer = new writers_1.ObjectWriter(this._options, writerOptions);
            return writer.serialize(this.node);
        }
        else if (writerOptions.format === "json") {
            const writer = new writers_1.JSONWriter(this._options, writerOptions);
            return writer.serialize(this.node);
        }
        else if (writerOptions.format === "yaml") {
            const writer = new writers_1.YAMLWriter(this._options, writerOptions);
            return writer.serialize(this.node);
        }
        else {
            throw new Error("Invalid writer format: " + writerOptions.format + ". " + this._debugInfo());
        }
    }
    /**
     * Extracts a namespace and name from the given string.
     *
     * @param namespace - namespace
     * @param name - a string containing both a name and namespace separated by an
     * `'@'` character
     * @param ele - `true` if this is an element namespace; otherwise `false`
     */
    _extractNamespace(namespace, name, ele) {
        // extract from name
        const atIndex = name.indexOf("@");
        if (atIndex > 0) {
            if (namespace === undefined)
                namespace = name.slice(atIndex + 1);
            name = name.slice(0, atIndex);
        }
        if (namespace === undefined) {
            // look-up default namespace
            namespace = (ele ? this._options.defaultNamespace.ele : this._options.defaultNamespace.att);
        }
        else if (namespace !== null && namespace[0] === "@") {
            // look-up namespace aliases
            const alias = namespace.slice(1);
            namespace = this._options.namespaceAlias[alias];
            if (namespace === undefined) {
                throw new Error("Namespace alias `" + alias + "` is not defined. " + this._debugInfo());
            }
        }
        return [namespace, name];
    }
    /**
     * Updates the element's namespace.
     *
     * @param ns - new namespace
     */
    _updateNamespace(ns) {
        const ele = this._domNode;
        if (util_2.Guard.isElementNode(ele) && ns !== null && ele.namespaceURI !== ns) {
            const [elePrefix, eleLocalName] = (0, algorithm_1.namespace_extractQName)(ele.prefix ? ele.prefix + ':' + ele.localName : ele.localName);
            // re-create the element node if its namespace changed
            // we can't simply change the namespaceURI since its read-only
            const newEle = (0, algorithm_1.create_element)(this._doc, eleLocalName, ns, elePrefix);
            for (const attr of ele.attributes) {
                const attrQName = attr.prefix ? attr.prefix + ':' + attr.localName : attr.localName;
                const [attrPrefix] = (0, algorithm_1.namespace_extractQName)(attrQName);
                let newAttrNS = attr.namespaceURI;
                if (newAttrNS === null && attrPrefix !== null) {
                    newAttrNS = ele.lookupNamespaceURI(attrPrefix);
                }
                if (newAttrNS === null) {
                    newEle.setAttribute(attrQName, attr.value);
                }
                else {
                    newEle.setAttributeNS(newAttrNS, attrQName, attr.value);
                }
            }
            // replace the new node in parent node
            const parent = ele.parentNode;
            /* istanbul ignore next */
            if (parent === null) {
                throw new Error("Parent node is null." + this._debugInfo());
            }
            parent.replaceChild(newEle, ele);
            this._domNode = newEle;
            // check child nodes
            for (const childNode of ele.childNodes) {
                const newChildNode = childNode.cloneNode(true);
                newEle.appendChild(newChildNode);
                if (util_2.Guard.isElementNode(newChildNode) && !newChildNode._namespace) {
                    const [newChildNodePrefix] = (0, algorithm_1.namespace_extractQName)(newChildNode.prefix ? newChildNode.prefix + ':' + newChildNode.localName : newChildNode.localName);
                    const newChildNodeNS = newEle.lookupNamespaceURI(newChildNodePrefix);
                    new XMLBuilderImpl(newChildNode)._updateNamespace(newChildNodeNS);
                }
            }
        }
    }
    /**
     * Returns the document owning this node.
     */
    get _doc() {
        const node = this.node;
        if (util_2.Guard.isDocumentNode(node)) {
            return node;
        }
        else {
            const docNode = node.ownerDocument;
            /* istanbul ignore next */
            if (!docNode)
                throw new Error("Owner document is null. " + this._debugInfo());
            return docNode;
        }
    }
    /**
     * Returns debug information for this node.
     *
     * @param name - node name
     */
    _debugInfo(name) {
        const node = this.node;
        const parentNode = node.parentNode;
        name = name || node.nodeName;
        const parentName = parentNode ? parentNode.nodeName : '';
        if (!parentName) {
            return "node: <" + name + ">";
        }
        else {
            return "node: <" + name + ">, parent: <" + parentName + ">";
        }
    }
    /**
     * Gets or sets builder options.
     */
    get _options() {
        const doc = this._doc;
        /* istanbul ignore next */
        if (doc._xmlBuilderOptions === undefined) {
            throw new Error("Builder options is not set.");
        }
        return doc._xmlBuilderOptions;
    }
    set _options(value) {
        const doc = this._doc;
        doc._xmlBuilderOptions = value;
    }
}
exports.XMLBuilderImpl = XMLBuilderImpl;
//# sourceMappingURL=XMLBuilderImpl.js.map