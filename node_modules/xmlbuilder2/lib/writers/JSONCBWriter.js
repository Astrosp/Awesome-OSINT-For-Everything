"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONCBWriter = void 0;
const BaseCBWriter_1 = require("./BaseCBWriter");
/**
 * Serializes XML nodes.
 */
class JSONCBWriter extends BaseCBWriter_1.BaseCBWriter {
    _hasChildren = [];
    _additionalLevel = 0;
    /**
     * Initializes a new instance of `JSONCBWriter`.
     *
     * @param builderOptions - XML builder options
     */
    constructor(builderOptions) {
        super(builderOptions);
    }
    /** @inheritdoc */
    frontMatter() {
        return "";
    }
    /** @inheritdoc */
    declaration(version, encoding, standalone) {
        return "";
    }
    /** @inheritdoc */
    docType(name, publicId, systemId) {
        return "";
    }
    /** @inheritdoc */
    comment(data) {
        // { "!": "hello" }
        return this._comma() + this._beginLine() + "{" + this._sep() +
            this._key(this._builderOptions.convert.comment) + this._sep() +
            this._val(data) + this._sep() + "}";
    }
    /** @inheritdoc */
    text(data) {
        // { "#": "hello" }
        return this._comma() + this._beginLine() + "{" + this._sep() +
            this._key(this._builderOptions.convert.text) + this._sep() +
            this._val(data) + this._sep() + "}";
    }
    /** @inheritdoc */
    instruction(target, data) {
        // { "?": "target hello" }
        return this._comma() + this._beginLine() + "{" + this._sep() +
            this._key(this._builderOptions.convert.ins) + this._sep() +
            this._val(data ? target + " " + data : target) + this._sep() + "}";
    }
    /** @inheritdoc */
    cdata(data) {
        // { "$": "hello" }
        return this._comma() + this._beginLine() + "{" + this._sep() +
            this._key(this._builderOptions.convert.cdata) + this._sep() +
            this._val(data) + this._sep() + "}";
    }
    /** @inheritdoc */
    attribute(name, value) {
        // { "@name": "val" }
        return this._comma() + this._beginLine(1) + "{" + this._sep() +
            this._key(this._builderOptions.convert.att + name) + this._sep() +
            this._val(value) + this._sep() + "}";
    }
    /** @inheritdoc */
    openTagBegin(name) {
        // { "node": { "#": [
        let str = this._comma() + this._beginLine() + "{" + this._sep() + this._key(name) + this._sep() + "{";
        this._additionalLevel++;
        this.hasData = true;
        str += this._beginLine() + this._key(this._builderOptions.convert.text) + this._sep() + "[";
        this._hasChildren.push(false);
        return str;
    }
    /** @inheritdoc */
    openTagEnd(name, selfClosing, voidElement) {
        if (selfClosing) {
            let str = this._sep() + "]";
            this._additionalLevel--;
            str += this._beginLine() + "}" + this._sep() + "}";
            return str;
        }
        else {
            return "";
        }
    }
    /** @inheritdoc */
    closeTag(name) {
        // ] } }
        let str = this._beginLine() + "]";
        this._additionalLevel--;
        str += this._beginLine() + "}" + this._sep() + "}";
        return str;
    }
    /** @inheritdoc */
    beginElement(name) { }
    /** @inheritdoc */
    endElement(name) { this._hasChildren.pop(); }
    /**
     * Produces characters to be prepended to a line of string in pretty-print
     * mode.
     */
    _beginLine(additionalOffset = 0) {
        if (this._writerOptions.prettyPrint) {
            return (this.hasData ? this._writerOptions.newline : "") +
                this._indent(this._writerOptions.offset + this.level + additionalOffset);
        }
        else {
            return "";
        }
    }
    /**
     * Produces an indentation string.
     *
     * @param level - depth of the tree
     */
    _indent(level) {
        if (level + this._additionalLevel <= 0) {
            return "";
        }
        else {
            return this._writerOptions.indent.repeat(level + this._additionalLevel);
        }
    }
    /**
     * Produces a comma before a child node if it has previous siblings.
     */
    _comma() {
        const str = (this._hasChildren[this._hasChildren.length - 1] ? "," : "");
        if (this._hasChildren.length > 0) {
            this._hasChildren[this._hasChildren.length - 1] = true;
        }
        return str;
    }
    /**
     * Produces a separator string.
     */
    _sep() {
        return (this._writerOptions.prettyPrint ? " " : "");
    }
    /**
     * Produces a JSON key string delimited with double quotes.
     */
    _key(key) {
        return "\"" + key + "\":";
    }
    /**
     * Produces a JSON value string delimited with double quotes.
     */
    _val(val) {
        return JSON.stringify(val);
    }
}
exports.JSONCBWriter = JSONCBWriter;
//# sourceMappingURL=JSONCBWriter.js.map