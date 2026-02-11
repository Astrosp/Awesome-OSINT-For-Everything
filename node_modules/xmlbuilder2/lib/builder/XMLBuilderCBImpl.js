"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XMLBuilderCBImpl = void 0;
const interfaces_1 = require("../interfaces");
const util_1 = require("@oozcitak/util");
const BuilderFunctions_1 = require("./BuilderFunctions");
const algorithm_1 = require("@oozcitak/dom/lib/algorithm");
const infra_1 = require("@oozcitak/infra");
const NamespacePrefixMap_1 = require("@oozcitak/dom/lib/serializer/NamespacePrefixMap");
const LocalNameSet_1 = require("@oozcitak/dom/lib/serializer/LocalNameSet");
const util_2 = require("@oozcitak/dom/lib/util");
const XMLCBWriter_1 = require("../writers/XMLCBWriter");
const JSONCBWriter_1 = require("../writers/JSONCBWriter");
const YAMLCBWriter_1 = require("../writers/YAMLCBWriter");
const events_1 = require("events");
/**
 * Represents a readable XML document stream.
 */
class XMLBuilderCBImpl extends events_1.EventEmitter {
    static _VoidElementNames = new Set(['area', 'base', 'basefont',
        'bgsound', 'br', 'col', 'embed', 'frame', 'hr', 'img', 'input', 'keygen',
        'link', 'menuitem', 'meta', 'param', 'source', 'track', 'wbr']);
    _options;
    _builderOptions;
    _writer;
    _fragment;
    _hasDeclaration = false;
    _docTypeName = "";
    _hasDocumentElement = false;
    _currentElement;
    _currentElementSerialized = false;
    _openTags = [];
    _prefixMap;
    _prefixIndex;
    _ended = false;
    /**
     * Initializes a new instance of `XMLStream`.
     *
     * @param options - stream writer options
     * @param fragment - whether to create fragment stream or a document stream
     *
     * @returns XML stream
     */
    constructor(options, fragment = false) {
        super();
        this._fragment = fragment;
        // provide default options
        this._options = (0, util_1.applyDefaults)(options || {}, interfaces_1.DefaultXMLBuilderCBOptions);
        this._builderOptions = {
            defaultNamespace: this._options.defaultNamespace,
            namespaceAlias: this._options.namespaceAlias
        };
        if (this._options.format === "json") {
            this._writer = new JSONCBWriter_1.JSONCBWriter(this._options);
        }
        else if (this._options.format === "yaml") {
            this._writer = new YAMLCBWriter_1.YAMLCBWriter(this._options);
        }
        else {
            this._writer = new XMLCBWriter_1.XMLCBWriter(this._options);
        }
        // automatically create listeners for callbacks passed via options
        if (this._options.data !== undefined) {
            this.on("data", this._options.data);
        }
        if (this._options.end !== undefined) {
            this.on("end", this._options.end);
        }
        if (this._options.error !== undefined) {
            this.on("error", this._options.error);
        }
        this._prefixMap = new NamespacePrefixMap_1.NamespacePrefixMap();
        this._prefixMap.set("xml", infra_1.namespace.XML);
        this._prefixIndex = { value: 1 };
        this._push(this._writer.frontMatter());
    }
    /** @inheritdoc */
    ele(p1, p2, p3) {
        // parse if JS object or XML or JSON string
        if ((0, util_1.isObject)(p1) || ((0, util_1.isString)(p1) && (/^\s*</.test(p1) || /^\s*[\{\[]/.test(p1) || /^(\s*|(#.*)|(%.*))*---/.test(p1)))) {
            const frag = (0, BuilderFunctions_1.fragment)().set(this._options);
            try {
                frag.ele(p1);
            }
            catch (err) {
                this.emit("error", err);
                return this;
            }
            for (const node of frag.node.childNodes) {
                this._fromNode(node);
            }
            return this;
        }
        this._serializeOpenTag(true);
        if (!this._fragment && this._hasDocumentElement && this._writer.level === 0) {
            this.emit("error", new Error("Document cannot have multiple document element nodes."));
            return this;
        }
        try {
            this._currentElement = (0, BuilderFunctions_1.fragment)(this._builderOptions).ele(p1, p2, p3);
        }
        catch (err) {
            this.emit("error", err);
            return this;
        }
        if (!this._fragment && !this._hasDocumentElement && this._docTypeName !== ""
            && this._currentElement.node._qualifiedName !== this._docTypeName) {
            this.emit("error", new Error("Document element name does not match DocType declaration name."));
            return this;
        }
        this._currentElementSerialized = false;
        if (!this._fragment) {
            this._hasDocumentElement = true;
        }
        return this;
    }
    /** @inheritdoc */
    att(p1, p2, p3) {
        if (this._currentElement === undefined) {
            this.emit("error", new Error("Cannot insert an attribute node as child of a document node."));
            return this;
        }
        try {
            this._currentElement.att(p1, p2, p3);
        }
        catch (err) {
            this.emit("error", err);
            return this;
        }
        return this;
    }
    /** @inheritdoc */
    com(content) {
        this._serializeOpenTag(true);
        let node;
        try {
            node = (0, BuilderFunctions_1.fragment)(this._builderOptions).com(content).first().node;
        }
        catch (err) {
            /* istanbul ignore next */
            this.emit("error", err);
            /* istanbul ignore next */
            return this;
        }
        if (this._options.wellFormed && (!(0, algorithm_1.xml_isLegalChar)(node.data) ||
            node.data.indexOf("--") !== -1 || node.data.endsWith("-"))) {
            this.emit("error", new Error("Comment data contains invalid characters (well-formed required)."));
            return this;
        }
        this._push(this._writer.comment(node.data));
        return this;
    }
    /** @inheritdoc */
    txt(content) {
        if (!this._fragment && this._currentElement === undefined) {
            this.emit("error", new Error("Cannot insert a text node as child of a document node."));
            return this;
        }
        this._serializeOpenTag(true);
        let node;
        try {
            node = (0, BuilderFunctions_1.fragment)(this._builderOptions).txt(content).first().node;
        }
        catch (err) {
            /* istanbul ignore next */
            this.emit("error", err);
            /* istanbul ignore next */
            return this;
        }
        if (this._options.wellFormed && !(0, algorithm_1.xml_isLegalChar)(node.data)) {
            this.emit("error", new Error("Text data contains invalid characters (well-formed required)."));
            return this;
        }
        const markup = node.data.replace(/(?!&(lt|gt|amp|apos|quot);)&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        this._push(this._writer.text(markup));
        const lastEl = this._openTags[this._openTags.length - 1];
        // edge case: text on top level.
        if (lastEl) {
            lastEl[lastEl.length - 1] = true;
        }
        return this;
    }
    /** @inheritdoc */
    ins(target, content = '') {
        this._serializeOpenTag(true);
        let node;
        try {
            node = (0, BuilderFunctions_1.fragment)(this._builderOptions).ins(target, content).first().node;
        }
        catch (err) {
            /* istanbul ignore next */
            this.emit("error", err);
            /* istanbul ignore next */
            return this;
        }
        if (this._options.wellFormed && (node.target.indexOf(":") !== -1 || (/^xml$/i).test(node.target))) {
            this.emit("error", new Error("Processing instruction target contains invalid characters (well-formed required)."));
            return this;
        }
        if (this._options.wellFormed && !(0, algorithm_1.xml_isLegalChar)(node.data)) {
            this.emit("error", Error("Processing instruction data contains invalid characters (well-formed required)."));
            return this;
        }
        this._push(this._writer.instruction(node.target, node.data));
        return this;
    }
    /** @inheritdoc */
    dat(content) {
        this._serializeOpenTag(true);
        let node;
        try {
            node = (0, BuilderFunctions_1.fragment)(this._builderOptions).dat(content).first().node;
        }
        catch (err) {
            this.emit("error", err);
            return this;
        }
        this._push(this._writer.cdata(node.data));
        return this;
    }
    /** @inheritdoc */
    dec(options = { version: "1.0" }) {
        if (this._fragment) {
            this.emit("error", Error("Cannot insert an XML declaration into a document fragment."));
            return this;
        }
        if (this._hasDeclaration) {
            this.emit("error", Error("XML declaration is already inserted."));
            return this;
        }
        this._push(this._writer.declaration(options.version || "1.0", options.encoding, options.standalone));
        this._hasDeclaration = true;
        return this;
    }
    /** @inheritdoc */
    dtd(options) {
        if (this._fragment) {
            this.emit("error", Error("Cannot insert a DocType declaration into a document fragment."));
            return this;
        }
        if (this._docTypeName !== "") {
            this.emit("error", new Error("DocType declaration is already inserted."));
            return this;
        }
        if (this._hasDocumentElement) {
            this.emit("error", new Error("Cannot insert DocType declaration after document element."));
            return this;
        }
        let node;
        try {
            node = (0, BuilderFunctions_1.create)().dtd(options).first().node;
        }
        catch (err) {
            this.emit("error", err);
            return this;
        }
        if (this._options.wellFormed && !(0, algorithm_1.xml_isPubidChar)(node.publicId)) {
            this.emit("error", new Error("DocType public identifier does not match PubidChar construct (well-formed required)."));
            return this;
        }
        if (this._options.wellFormed &&
            (!(0, algorithm_1.xml_isLegalChar)(node.systemId) ||
                (node.systemId.indexOf('"') !== -1 && node.systemId.indexOf("'") !== -1))) {
            this.emit("error", new Error("DocType system identifier contains invalid characters (well-formed required)."));
            return this;
        }
        this._docTypeName = options.name;
        this._push(this._writer.docType(options.name, node.publicId, node.systemId));
        return this;
    }
    /** @inheritdoc */
    import(node) {
        const frag = (0, BuilderFunctions_1.fragment)().set(this._options);
        try {
            frag.import(node);
        }
        catch (err) {
            this.emit("error", err);
            return this;
        }
        for (const node of frag.node.childNodes) {
            this._fromNode(node);
        }
        return this;
    }
    /** @inheritdoc */
    up() {
        this._serializeOpenTag(false);
        this._serializeCloseTag();
        return this;
    }
    /** @inheritdoc */
    end() {
        this._serializeOpenTag(false);
        while (this._openTags.length > 0) {
            this._serializeCloseTag();
        }
        this._push(null);
        return this;
    }
    /**
     * Serializes the opening tag of an element node.
     *
     * @param hasChildren - whether the element node has child nodes
     */
    _serializeOpenTag(hasChildren) {
        if (this._currentElementSerialized)
            return;
        if (this._currentElement === undefined)
            return;
        const node = this._currentElement.node;
        if (this._options.wellFormed && (node.localName.indexOf(":") !== -1 ||
            !(0, algorithm_1.xml_isName)(node.localName))) {
            this.emit("error", new Error("Node local name contains invalid characters (well-formed required)."));
            return;
        }
        let qualifiedName = "";
        let ignoreNamespaceDefinitionAttribute = false;
        let map = this._prefixMap.copy();
        let localPrefixesMap = {};
        let localDefaultNamespace = this._recordNamespaceInformation(node, map, localPrefixesMap);
        let inheritedNS = this._openTags.length === 0 ? null : this._openTags[this._openTags.length - 1][1];
        let ns = node.namespaceURI;
        if (ns === null)
            ns = inheritedNS;
        if (inheritedNS === ns) {
            if (localDefaultNamespace !== null) {
                ignoreNamespaceDefinitionAttribute = true;
            }
            if (ns === infra_1.namespace.XML) {
                qualifiedName = "xml:" + node.localName;
            }
            else {
                qualifiedName = node.localName;
            }
            this._writer.beginElement(qualifiedName);
            this._push(this._writer.openTagBegin(qualifiedName));
        }
        else {
            let prefix = node.prefix;
            let candidatePrefix = null;
            if (prefix !== null || ns !== localDefaultNamespace) {
                candidatePrefix = map.get(prefix, ns);
            }
            if (prefix === "xmlns") {
                if (this._options.wellFormed) {
                    this.emit("error", new Error("An element cannot have the 'xmlns' prefix (well-formed required)."));
                    return;
                }
                candidatePrefix = prefix;
            }
            if (candidatePrefix !== null) {
                qualifiedName = candidatePrefix + ':' + node.localName;
                if (localDefaultNamespace !== null && localDefaultNamespace !== infra_1.namespace.XML) {
                    inheritedNS = localDefaultNamespace || null;
                }
                this._writer.beginElement(qualifiedName);
                this._push(this._writer.openTagBegin(qualifiedName));
            }
            else if (prefix !== null) {
                if (prefix in localPrefixesMap) {
                    prefix = this._generatePrefix(ns, map, this._prefixIndex);
                }
                map.set(prefix, ns);
                qualifiedName += prefix + ':' + node.localName;
                this._writer.beginElement(qualifiedName);
                this._push(this._writer.openTagBegin(qualifiedName));
                this._push(this._writer.attribute("xmlns:" + prefix, this._serializeAttributeValue(ns, this._options.wellFormed)));
                if (localDefaultNamespace !== null) {
                    inheritedNS = localDefaultNamespace || null;
                }
            }
            else if (localDefaultNamespace === null ||
                (localDefaultNamespace !== null && localDefaultNamespace !== ns)) {
                ignoreNamespaceDefinitionAttribute = true;
                qualifiedName += node.localName;
                inheritedNS = ns;
                this._writer.beginElement(qualifiedName);
                this._push(this._writer.openTagBegin(qualifiedName));
                this._push(this._writer.attribute("xmlns", this._serializeAttributeValue(ns, this._options.wellFormed)));
            }
            else {
                qualifiedName += node.localName;
                inheritedNS = ns;
                this._writer.beginElement(qualifiedName);
                this._push(this._writer.openTagBegin(qualifiedName));
            }
        }
        this._serializeAttributes(node, map, this._prefixIndex, localPrefixesMap, ignoreNamespaceDefinitionAttribute, this._options.wellFormed);
        const isHTML = (ns === infra_1.namespace.HTML);
        if (isHTML && !hasChildren &&
            XMLBuilderCBImpl._VoidElementNames.has(node.localName)) {
            this._push(this._writer.openTagEnd(qualifiedName, true, true));
            this._writer.endElement(qualifiedName);
        }
        else if (!isHTML && !hasChildren) {
            this._push(this._writer.openTagEnd(qualifiedName, true, false));
            this._writer.endElement(qualifiedName);
        }
        else {
            this._push(this._writer.openTagEnd(qualifiedName, false, false));
        }
        this._currentElementSerialized = true;
        /**
         * Save qualified name, original inherited ns, original prefix map, and
         * hasChildren flag.
         */
        this._openTags.push([qualifiedName, inheritedNS, this._prefixMap, hasChildren, undefined]);
        /**
         * New values of inherited namespace and prefix map will be used while
         * serializing child nodes. They will be returned to their original values
         * when this node is closed using the _openTags array item we saved above.
         */
        if (this._isPrefixMapModified(this._prefixMap, map)) {
            this._prefixMap = map;
        }
        /**
         * Calls following this will either serialize child nodes or close this tag.
         */
        this._writer.level++;
    }
    /**
     * Serializes the closing tag of an element node.
     */
    _serializeCloseTag() {
        this._writer.level--;
        const lastEle = this._openTags.pop();
        /* istanbul ignore next */
        if (lastEle === undefined) {
            this.emit("error", new Error("Last element is undefined."));
            return;
        }
        const [qualifiedName, ns, map, hasChildren, hasTextPayload] = lastEle;
        /**
         * Restore original values of inherited namespace and prefix map.
         */
        this._prefixMap = map;
        if (!hasChildren)
            return;
        this._push(this._writer.closeTag(qualifiedName, hasTextPayload));
        this._writer.endElement(qualifiedName);
    }
    /**
     * Pushes data to internal buffer.
     *
     * @param data - data
     */
    _push(data) {
        if (data === null) {
            this._ended = true;
            this.emit("end");
        }
        else if (this._ended) {
            this.emit("error", new Error("Cannot push to ended stream."));
        }
        else if (data.length !== 0) {
            this._writer.hasData = true;
            this.emit("data", data, this._writer.level);
        }
    }
    /**
     * Reads and serializes an XML tree.
     *
     * @param node - root node
     */
    _fromNode(node) {
        if (util_2.Guard.isElementNode(node)) {
            const name = node.prefix ? node.prefix + ":" + node.localName : node.localName;
            if (node.namespaceURI !== null) {
                this.ele(node.namespaceURI, name);
            }
            else {
                this.ele(name);
            }
            for (const attr of node.attributes) {
                const name = attr.prefix ? attr.prefix + ":" + attr.localName : attr.localName;
                if (attr.namespaceURI !== null) {
                    this.att(attr.namespaceURI, name, attr.value);
                }
                else {
                    this.att(name, attr.value);
                }
            }
            for (const child of node.childNodes) {
                this._fromNode(child);
            }
            this.up();
        }
        else if (util_2.Guard.isExclusiveTextNode(node) && node.data) {
            this.txt(node.data);
        }
        else if (util_2.Guard.isCommentNode(node)) {
            this.com(node.data);
        }
        else if (util_2.Guard.isCDATASectionNode(node)) {
            this.dat(node.data);
        }
        else if (util_2.Guard.isProcessingInstructionNode(node)) {
            this.ins(node.target, node.data);
        }
    }
    /**
     * Produces an XML serialization of the attributes of an element node.
     *
     * @param node - node to serialize
     * @param map - namespace prefix map
     * @param prefixIndex - generated namespace prefix index
     * @param localPrefixesMap - local prefixes map
     * @param ignoreNamespaceDefinitionAttribute - whether to ignore namespace
     * attributes
     * @param requireWellFormed - whether to check conformance
     */
    _serializeAttributes(node, map, prefixIndex, localPrefixesMap, ignoreNamespaceDefinitionAttribute, requireWellFormed) {
        const localNameSet = requireWellFormed ? new LocalNameSet_1.LocalNameSet() : undefined;
        for (const attr of node.attributes) {
            // Optimize common case
            if (!requireWellFormed && !ignoreNamespaceDefinitionAttribute && attr.namespaceURI === null) {
                this._push(this._writer.attribute(attr.localName, this._serializeAttributeValue(attr.value, this._options.wellFormed)));
                continue;
            }
            if (requireWellFormed && localNameSet && localNameSet.has(attr.namespaceURI, attr.localName)) {
                this.emit("error", new Error("Element contains duplicate attributes (well-formed required)."));
                return;
            }
            if (requireWellFormed && localNameSet)
                localNameSet.set(attr.namespaceURI, attr.localName);
            let attributeNamespace = attr.namespaceURI;
            let candidatePrefix = null;
            if (attributeNamespace !== null) {
                candidatePrefix = map.get(attr.prefix, attributeNamespace);
                if (attributeNamespace === infra_1.namespace.XMLNS) {
                    if (attr.value === infra_1.namespace.XML ||
                        (attr.prefix === null && ignoreNamespaceDefinitionAttribute) ||
                        (attr.prefix !== null && (!(attr.localName in localPrefixesMap) ||
                            localPrefixesMap[attr.localName] !== attr.value) &&
                            map.has(attr.localName, attr.value)))
                        continue;
                    if (requireWellFormed && attr.value === infra_1.namespace.XMLNS) {
                        this.emit("error", new Error("XMLNS namespace is reserved (well-formed required)."));
                        return;
                    }
                    if (requireWellFormed && attr.value === '') {
                        this.emit("error", new Error("Namespace prefix declarations cannot be used to undeclare a namespace (well-formed required)."));
                        return;
                    }
                    if (attr.prefix === 'xmlns')
                        candidatePrefix = 'xmlns';
                    /**
                     * _Note:_ The (candidatePrefix === null) check is not in the spec.
                     * We deviate from the spec here. Otherwise a prefix is generated for
                     * all attributes with namespaces.
                     */
                }
                else if (candidatePrefix === null) {
                    if (attr.prefix !== null &&
                        (!map.hasPrefix(attr.prefix) ||
                            map.has(attr.prefix, attributeNamespace))) {
                        /**
                         * Check if we can use the attribute's own prefix.
                         * We deviate from the spec here.
                         * TODO: This is not an efficient way of searching for prefixes.
                         * Follow developments to the spec.
                         */
                        candidatePrefix = attr.prefix;
                    }
                    else {
                        candidatePrefix = this._generatePrefix(attributeNamespace, map, prefixIndex);
                    }
                    this._push(this._writer.attribute("xmlns:" + candidatePrefix, this._serializeAttributeValue(attributeNamespace, this._options.wellFormed)));
                }
            }
            if (requireWellFormed && (attr.localName.indexOf(":") !== -1 ||
                !(0, algorithm_1.xml_isName)(attr.localName) ||
                (attr.localName === "xmlns" && attributeNamespace === null))) {
                this.emit("error", new Error("Attribute local name contains invalid characters (well-formed required)."));
                return;
            }
            this._push(this._writer.attribute((candidatePrefix !== null ? candidatePrefix + ":" : "") + attr.localName, this._serializeAttributeValue(attr.value, this._options.wellFormed)));
        }
    }
    /**
     * Produces an XML serialization of an attribute value.
     *
     * @param value - attribute value
     * @param requireWellFormed - whether to check conformance
     */
    _serializeAttributeValue(value, requireWellFormed) {
        if (requireWellFormed && value !== null && !(0, algorithm_1.xml_isLegalChar)(value)) {
            this.emit("error", new Error("Invalid characters in attribute value."));
            return "";
        }
        if (value === null)
            return "";
        return value.replace(/(?!&(lt|gt|amp|apos|quot);)&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }
    /**
     * Records namespace information for the given element and returns the
     * default namespace attribute value.
     *
     * @param node - element node to process
     * @param map - namespace prefix map
     * @param localPrefixesMap - local prefixes map
     */
    _recordNamespaceInformation(node, map, localPrefixesMap) {
        let defaultNamespaceAttrValue = null;
        for (const attr of node.attributes) {
            let attributeNamespace = attr.namespaceURI;
            let attributePrefix = attr.prefix;
            if (attributeNamespace === infra_1.namespace.XMLNS) {
                if (attributePrefix === null) {
                    defaultNamespaceAttrValue = attr.value;
                    continue;
                }
                else {
                    let prefixDefinition = attr.localName;
                    let namespaceDefinition = attr.value;
                    if (namespaceDefinition === infra_1.namespace.XML) {
                        continue;
                    }
                    if (namespaceDefinition === '') {
                        namespaceDefinition = null;
                    }
                    if (map.has(prefixDefinition, namespaceDefinition)) {
                        continue;
                    }
                    map.set(prefixDefinition, namespaceDefinition);
                    localPrefixesMap[prefixDefinition] = namespaceDefinition || '';
                }
            }
        }
        return defaultNamespaceAttrValue;
    }
    /**
     * Generates a new prefix for the given namespace.
     *
     * @param newNamespace - a namespace to generate prefix for
     * @param prefixMap - namespace prefix map
     * @param prefixIndex - generated namespace prefix index
     */
    _generatePrefix(newNamespace, prefixMap, prefixIndex) {
        let generatedPrefix = "ns" + prefixIndex.value;
        prefixIndex.value++;
        prefixMap.set(generatedPrefix, newNamespace);
        return generatedPrefix;
    }
    /**
     * Determines if the namespace prefix map was modified from its original.
     *
     * @param originalMap - original namespace prefix map
     * @param newMap - new namespace prefix map
     */
    _isPrefixMapModified(originalMap, newMap) {
        const items1 = originalMap._items;
        const items2 = newMap._items;
        const nullItems1 = originalMap._nullItems;
        const nullItems2 = newMap._nullItems;
        for (const key in items2) {
            const arr1 = items1[key];
            if (arr1 === undefined)
                return true;
            const arr2 = items2[key];
            if (arr1.length !== arr2.length)
                return true;
            for (let i = 0; i < arr1.length; i++) {
                if (arr1[i] !== arr2[i])
                    return true;
            }
        }
        if (nullItems1.length !== nullItems2.length)
            return true;
        for (let i = 0; i < nullItems1.length; i++) {
            if (nullItems1[i] !== nullItems2[i])
                return true;
        }
        return false;
    }
}
exports.XMLBuilderCBImpl = XMLBuilderCBImpl;
//# sourceMappingURL=XMLBuilderCBImpl.js.map