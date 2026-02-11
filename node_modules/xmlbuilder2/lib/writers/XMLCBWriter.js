"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XMLCBWriter = void 0;
const BaseCBWriter_1 = require("./BaseCBWriter");
/**
 * Serializes XML nodes.
 */
class XMLCBWriter extends BaseCBWriter_1.BaseCBWriter {
    _lineLength = 0;
    /**
     * Initializes a new instance of `XMLCBWriter`.
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
        let markup = this._beginLine() + "<?xml";
        markup += " version=\"" + version + "\"";
        if (encoding !== undefined) {
            markup += " encoding=\"" + encoding + "\"";
        }
        if (standalone !== undefined) {
            markup += " standalone=\"" + (standalone ? "yes" : "no") + "\"";
        }
        markup += "?>";
        return markup;
    }
    /** @inheritdoc */
    docType(name, publicId, systemId) {
        let markup = this._beginLine();
        if (publicId && systemId) {
            markup += "<!DOCTYPE " + name + " PUBLIC \"" + publicId + "\" \"" + systemId + "\">";
        }
        else if (publicId) {
            markup += "<!DOCTYPE " + name + " PUBLIC \"" + publicId + "\">";
        }
        else if (systemId) {
            markup += "<!DOCTYPE " + name + " SYSTEM \"" + systemId + "\">";
        }
        else {
            markup += "<!DOCTYPE " + name + ">";
        }
        return markup;
    }
    /** @inheritdoc */
    comment(data) {
        return this._beginLine() + "<!--" + data + "-->";
    }
    /** @inheritdoc */
    text(data) {
        return data;
    }
    /** @inheritdoc */
    instruction(target, data) {
        if (data) {
            return this._beginLine() + "<?" + target + " " + data + "?>";
        }
        else {
            return this._beginLine() + "<?" + target + "?>";
        }
    }
    /** @inheritdoc */
    cdata(data) {
        return this._beginLine() + "<![CDATA[" + data + "]]>";
    }
    /** @inheritdoc */
    openTagBegin(name) {
        this._lineLength += 1 + name.length;
        return this._beginLine() + "<" + name;
    }
    /** @inheritdoc */
    openTagEnd(name, selfClosing, voidElement) {
        if (voidElement) {
            return " />";
        }
        else if (selfClosing) {
            if (this._writerOptions.allowEmptyTags) {
                return "></" + name + ">";
            }
            else if (this._writerOptions.spaceBeforeSlash) {
                return " />";
            }
            else {
                return "/>";
            }
        }
        else {
            return ">";
        }
    }
    /** @inheritdoc */
    closeTag(name, hasTextPayload) {
        const ending = hasTextPayload ? '' : this._beginLine();
        return ending + "</" + name + ">";
    }
    /** @inheritdoc */
    attribute(name, value) {
        let str = name + "=\"" + value + "\"";
        if (this._writerOptions.prettyPrint && this._writerOptions.width > 0 &&
            this._lineLength + 1 + str.length > this._writerOptions.width) {
            str = this._beginLine() + this._indent(1) + str;
            this._lineLength = str.length;
            return str;
        }
        else {
            this._lineLength += 1 + str.length;
            return " " + str;
        }
    }
    /** @inheritdoc */
    beginElement(name) { }
    /** @inheritdoc */
    endElement(name) { }
    /**
     * Produces characters to be prepended to a line of string in pretty-print
     * mode.
     */
    _beginLine() {
        if (this._writerOptions.prettyPrint) {
            const str = (this.hasData ? this._writerOptions.newline : "") +
                this._indent(this._writerOptions.offset + this.level);
            this._lineLength = str.length;
            return str;
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
        if (level <= 0) {
            return "";
        }
        else {
            return this._writerOptions.indent.repeat(level);
        }
    }
}
exports.XMLCBWriter = XMLCBWriter;
//# sourceMappingURL=XMLCBWriter.js.map