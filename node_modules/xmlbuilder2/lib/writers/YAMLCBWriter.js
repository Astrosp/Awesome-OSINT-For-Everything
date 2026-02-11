"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YAMLCBWriter = void 0;
const BaseCBWriter_1 = require("./BaseCBWriter");
/**
 * Serializes XML nodes.
 */
class YAMLCBWriter extends BaseCBWriter_1.BaseCBWriter {
    _rootWritten = false;
    _additionalLevel = 0;
    /**
     * Initializes a new instance of `BaseCBWriter`.
     *
     * @param builderOptions - XML builder options
     */
    constructor(builderOptions) {
        super(builderOptions);
        if (builderOptions.indent.length < 2) {
            throw new Error("YAML indententation string must be at least two characters long.");
        }
        if (builderOptions.offset < 0) {
            throw new Error("YAML offset should be zero or a positive number.");
        }
    }
    /** @inheritdoc */
    frontMatter() {
        return this._beginLine() + "---";
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
        // "!": "hello"
        return this._beginLine() +
            this._key(this._builderOptions.convert.comment) + " " +
            this._val(data);
    }
    /** @inheritdoc */
    text(data) {
        // "#": "hello"
        return this._beginLine() +
            this._key(this._builderOptions.convert.text) + " " +
            this._val(data);
    }
    /** @inheritdoc */
    instruction(target, data) {
        // "?": "target hello"
        return this._beginLine() +
            this._key(this._builderOptions.convert.ins) + " " +
            this._val(data ? target + " " + data : target);
    }
    /** @inheritdoc */
    cdata(data) {
        // "$": "hello"
        return this._beginLine() +
            this._key(this._builderOptions.convert.cdata) + " " +
            this._val(data);
    }
    /** @inheritdoc */
    attribute(name, value) {
        // "@name": "val"
        this._additionalLevel++;
        const str = this._beginLine() +
            this._key(this._builderOptions.convert.att + name) + " " +
            this._val(value);
        this._additionalLevel--;
        return str;
    }
    /** @inheritdoc */
    openTagBegin(name) {
        // "node":
        //   "#":
        //   -
        let str = this._beginLine() + this._key(name);
        if (!this._rootWritten) {
            this._rootWritten = true;
        }
        this.hasData = true;
        this._additionalLevel++;
        str += this._beginLine(true) + this._key(this._builderOptions.convert.text);
        return str;
    }
    /** @inheritdoc */
    openTagEnd(name, selfClosing, voidElement) {
        if (selfClosing) {
            return " " + this._val("");
        }
        return "";
    }
    /** @inheritdoc */
    closeTag(name) {
        this._additionalLevel--;
        return "";
    }
    /** @inheritdoc */
    beginElement(name) { }
    /** @inheritdoc */
    endElement(name) { }
    /**
     * Produces characters to be prepended to a line of string in pretty-print
     * mode.
     */
    _beginLine(suppressArray = false) {
        return (this.hasData ? this._writerOptions.newline : "") +
            this._indent(this._writerOptions.offset + this.level, suppressArray);
    }
    /**
     * Produces an indentation string.
     *
     * @param level - depth of the tree
     * @param suppressArray - whether the suppress array marker
     */
    _indent(level, suppressArray) {
        if (level + this._additionalLevel <= 0) {
            return "";
        }
        else {
            const chars = this._writerOptions.indent.repeat(level + this._additionalLevel);
            if (!suppressArray && this._rootWritten) {
                return chars.substr(0, chars.length - 2) + '-' + chars.substr(-1, 1);
            }
            return chars;
        }
    }
    /**
     * Produces a YAML key string delimited with double quotes.
     */
    _key(key) {
        return "\"" + key + "\":";
    }
    /**
     * Produces a YAML value string delimited with double quotes.
     */
    _val(val) {
        return JSON.stringify(val);
    }
}
exports.YAMLCBWriter = YAMLCBWriter;
//# sourceMappingURL=YAMLCBWriter.js.map