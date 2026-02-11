"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseReader = void 0;
const dom_1 = require("../builder/dom");
/**
 * Parses XML nodes.
 */
class BaseReader {
    _builderOptions;
    static _entityTable = {
        "lt": "<",
        "gt": ">",
        "amp": "&",
        "quot": '"',
        "apos": "'",
    };
    /**
     * Initializes a new instance of `BaseReader`.
     *
     * @param builderOptions - XML builder options
     */
    constructor(builderOptions) {
        this._builderOptions = builderOptions;
        if (builderOptions.parser) {
            Object.assign(this, builderOptions.parser);
        }
    }
    _docType(parent, name, publicId, systemId) {
        return parent.dtd({ name: name, pubID: publicId, sysID: systemId });
    }
    _comment(parent, data) {
        return parent.com(data);
    }
    _text(parent, data) {
        return parent.txt(data);
    }
    _instruction(parent, target, data) {
        return parent.ins(target, data);
    }
    _cdata(parent, data) {
        return parent.dat(data);
    }
    _element(parent, namespace, name) {
        return (namespace === undefined ? parent.ele(name) : parent.ele(namespace, name));
    }
    _attribute(parent, namespace, name, value) {
        return (namespace === undefined ? parent.att(name, value) : parent.att(namespace, name, value));
    }
    _sanitize(str) {
        return (0, dom_1.sanitizeInput)(str, this._builderOptions.invalidCharReplacement);
    }
    /**
     * Decodes serialized text.
     *
     * @param text - text value to serialize
     */
    _decodeText(text) {
        if (text == null)
            return text;
        return text.replace(/&(quot|amp|apos|lt|gt);/g, (_match, tag) => BaseReader._entityTable[tag]).replace(/&#(?:x([a-fA-F0-9]+)|([0-9]+));/g, (_match, hexStr, numStr) => String.fromCodePoint(parseInt(hexStr || numStr, hexStr ? 16 : 10)));
    }
    /**
     * Decodes serialized attribute value.
     *
     * @param text - attribute value to serialize
     */
    _decodeAttributeValue(text) {
        return this._decodeText(text);
    }
    /**
     * Main parser function which parses the given object and returns an XMLBuilder.
     *
     * @param node - node to recieve parsed content
     * @param obj - object to parse
     */
    parse(node, obj) {
        return this._parse(node, obj);
    }
    /**
     * Creates a DocType node.
     * The node will be skipped if the function returns `undefined`.
     *
     * @param name - node name
     * @param publicId - public identifier
     * @param systemId - system identifier
     */
    docType(parent, name, publicId, systemId) {
        return this._docType(parent, name, publicId, systemId);
    }
    /**
     * Creates a comment node.
     * The node will be skipped if the function returns `undefined`.
     *
     * @param parent - parent node
     * @param data - node data
     */
    comment(parent, data) {
        return this._comment(parent, data);
    }
    /**
     * Creates a text node.
     * The node will be skipped if the function returns `undefined`.
     *
     * @param parent - parent node
     * @param data - node data
     */
    text(parent, data) {
        return this._text(parent, data);
    }
    /**
     * Creates a processing instruction node.
     * The node will be skipped if the function returns `undefined`.
     *
     * @param parent - parent node
     * @param target - instruction target
     * @param data - node data
     */
    instruction(parent, target, data) {
        return this._instruction(parent, target, data);
    }
    /**
     * Creates a CData section node.
     * The node will be skipped if the function returns `undefined`.
     *
     * @param parent - parent node
     * @param data - node data
     */
    cdata(parent, data) {
        return this._cdata(parent, data);
    }
    /**
     * Creates an element node.
     * The node will be skipped if the function returns `undefined`.
     *
     * @param parent - parent node
     * @param namespace - node namespace
     * @param name - node name
     */
    element(parent, namespace, name) {
        return this._element(parent, namespace, name);
    }
    /**
     * Creates an attribute or namespace declaration.
     * The node will be skipped if the function returns `undefined`.
     *
     * @param parent - parent node
     * @param namespace - node namespace
     * @param name - node name
     * @param value - node value
     */
    attribute(parent, namespace, name, value) {
        return this._attribute(parent, namespace, name, value);
    }
    /**
     * Sanitizes input strings.
     *
     * @param str - input string
     */
    sanitize(str) {
        return this._sanitize(str);
    }
}
exports.BaseReader = BaseReader;
//# sourceMappingURL=BaseReader.js.map