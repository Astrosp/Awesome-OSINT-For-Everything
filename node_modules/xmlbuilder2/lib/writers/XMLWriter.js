"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XMLWriter = void 0;
const util_1 = require("@oozcitak/util");
const interfaces_1 = require("@oozcitak/dom/lib/dom/interfaces");
const BaseWriter_1 = require("./BaseWriter");
const util_2 = require("@oozcitak/dom/lib/util");
/**
 * Serializes XML nodes into strings.
 */
class XMLWriter extends BaseWriter_1.BaseWriter {
    _refs;
    _indentation = {};
    _lengthToLastNewline = 0;
    /**
     * Initializes a new instance of `XMLWriter`.
     *
     * @param builderOptions - XML builder options
     * @param writerOptions - serialization options
     */
    constructor(builderOptions, writerOptions) {
        super(builderOptions);
        // provide default options
        this._writerOptions = (0, util_1.applyDefaults)(writerOptions, {
            wellFormed: false,
            headless: false,
            prettyPrint: false,
            indent: "  ",
            newline: "\n",
            offset: 0,
            width: 0,
            allowEmptyTags: false,
            indentTextOnlyNodes: false,
            spaceBeforeSlash: false
        });
    }
    /**
     * Produces an XML serialization of the given node.
     *
     * @param node - node to serialize
     */
    serialize(node) {
        this._refs = { suppressPretty: false, emptyNode: false, markup: "" };
        // Serialize XML declaration
        if (node.nodeType === interfaces_1.NodeType.Document && !this._writerOptions.headless) {
            this.declaration(this._builderOptions.version, this._builderOptions.encoding, this._builderOptions.standalone);
        }
        // recursively serialize node
        this.serializeNode(node, this._writerOptions.wellFormed);
        // remove trailing newline
        if (this._writerOptions.prettyPrint &&
            this._refs.markup.slice(-this._writerOptions.newline.length) === this._writerOptions.newline) {
            this._refs.markup = this._refs.markup.slice(0, -this._writerOptions.newline.length);
        }
        return this._refs.markup;
    }
    /** @inheritdoc */
    declaration(version, encoding, standalone) {
        this._beginLine();
        this._refs.markup += "<?xml version=\"" + version + "\"";
        if (encoding !== undefined) {
            this._refs.markup += " encoding=\"" + encoding + "\"";
        }
        if (standalone !== undefined) {
            this._refs.markup += " standalone=\"" + (standalone ? "yes" : "no") + "\"";
        }
        this._refs.markup += "?>";
        this._endLine();
    }
    /** @inheritdoc */
    docType(name, publicId, systemId) {
        this._beginLine();
        if (publicId && systemId) {
            this._refs.markup += "<!DOCTYPE " + name + " PUBLIC \"" + publicId + "\" \"" + systemId + "\">";
        }
        else if (publicId) {
            this._refs.markup += "<!DOCTYPE " + name + " PUBLIC \"" + publicId + "\">";
        }
        else if (systemId) {
            this._refs.markup += "<!DOCTYPE " + name + " SYSTEM \"" + systemId + "\">";
        }
        else {
            this._refs.markup += "<!DOCTYPE " + name + ">";
        }
        this._endLine();
    }
    /** @inheritdoc */
    openTagBegin(name) {
        this._beginLine();
        this._refs.markup += "<" + name;
    }
    /** @inheritdoc */
    openTagEnd(name, selfClosing, voidElement) {
        // do not indent text only elements or elements with empty text nodes
        this._refs.suppressPretty = false;
        this._refs.emptyNode = false;
        if (this._writerOptions.prettyPrint && !selfClosing && !voidElement) {
            let textOnlyNode = true;
            let emptyNode = true;
            let childNode = this.currentNode.firstChild;
            let cdataCount = 0;
            let textCount = 0;
            while (childNode) {
                if (util_2.Guard.isExclusiveTextNode(childNode)) {
                    textCount++;
                }
                else if (util_2.Guard.isCDATASectionNode(childNode)) {
                    cdataCount++;
                }
                else {
                    textOnlyNode = false;
                    emptyNode = false;
                    break;
                }
                if (childNode.data !== '') {
                    emptyNode = false;
                }
                childNode = childNode.nextSibling;
            }
            this._refs.suppressPretty = !this._writerOptions.indentTextOnlyNodes && textOnlyNode && ((cdataCount <= 1 && textCount === 0) || cdataCount === 0);
            this._refs.emptyNode = emptyNode;
        }
        if ((voidElement || selfClosing || this._refs.emptyNode) && this._writerOptions.allowEmptyTags) {
            this._refs.markup += "></" + name + ">";
        }
        else {
            this._refs.markup += voidElement ? " />" :
                (selfClosing || this._refs.emptyNode) ? (this._writerOptions.spaceBeforeSlash ? " />" : "/>") : ">";
        }
        this._endLine();
    }
    /** @inheritdoc */
    closeTag(name) {
        if (!this._refs.emptyNode) {
            this._beginLine();
            this._refs.markup += "</" + name + ">";
        }
        this._refs.suppressPretty = false;
        this._refs.emptyNode = false;
        this._endLine();
    }
    /** @inheritdoc */
    attribute(name, value) {
        const str = name + "=\"" + value + "\"";
        if (this._writerOptions.prettyPrint && this._writerOptions.width > 0 &&
            this._refs.markup.length - this._lengthToLastNewline + 1 + str.length > this._writerOptions.width) {
            this._endLine();
            this._beginLine();
            this._refs.markup += this._indent(1) + str;
        }
        else {
            this._refs.markup += " " + str;
        }
    }
    /** @inheritdoc */
    text(data) {
        if (data !== '') {
            this._beginLine();
            this._refs.markup += data;
            this._endLine();
        }
    }
    /** @inheritdoc */
    cdata(data) {
        if (data !== '') {
            this._beginLine();
            this._refs.markup += "<![CDATA[" + data + "]]>";
            this._endLine();
        }
    }
    /** @inheritdoc */
    comment(data) {
        this._beginLine();
        this._refs.markup += "<!--" + data + "-->";
        this._endLine();
    }
    /** @inheritdoc */
    instruction(target, data) {
        this._beginLine();
        this._refs.markup += "<?" + (data === "" ? target : target + " " + data) + "?>";
        this._endLine();
    }
    /**
     * Produces characters to be prepended to a line of string in pretty-print
     * mode.
     */
    _beginLine() {
        if (this._writerOptions.prettyPrint && !this._refs.suppressPretty) {
            this._refs.markup += this._indent(this._writerOptions.offset + this.level);
        }
    }
    /**
     * Produces characters to be appended to a line of string in pretty-print
     * mode.
     */
    _endLine() {
        if (this._writerOptions.prettyPrint && !this._refs.suppressPretty) {
            this._refs.markup += this._writerOptions.newline;
            this._lengthToLastNewline = this._refs.markup.length;
        }
    }
    /**
     * Produces an indentation string.
     *
     * @param level - depth of the tree
     */
    _indent(level) {
        if (level <= 0) {
            return "";
        }
        else if (this._indentation[level] !== undefined) {
            return this._indentation[level];
        }
        else {
            const str = this._writerOptions.indent.repeat(level);
            this._indentation[level] = str;
            return str;
        }
    }
}
exports.XMLWriter = XMLWriter;
//# sourceMappingURL=XMLWriter.js.map