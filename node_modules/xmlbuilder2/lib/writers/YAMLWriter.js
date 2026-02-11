"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YAMLWriter = void 0;
const ObjectWriter_1 = require("./ObjectWriter");
const util_1 = require("@oozcitak/util");
const BaseWriter_1 = require("./BaseWriter");
/**
 * Serializes XML nodes into a YAML string.
 */
class YAMLWriter extends BaseWriter_1.BaseWriter {
    /**
     * Initializes a new instance of `YAMLWriter`.
     *
     * @param builderOptions - XML builder options
     * @param writerOptions - serialization options
     */
    constructor(builderOptions, writerOptions) {
        super(builderOptions);
        // provide default options
        this._writerOptions = (0, util_1.applyDefaults)(writerOptions, {
            wellFormed: false,
            indent: '  ',
            newline: '\n',
            offset: 0,
            group: false,
            verbose: false
        });
        if (this._writerOptions.indent.length < 2) {
            throw new Error("YAML indententation string must be at least two characters long.");
        }
        if (this._writerOptions.offset < 0) {
            throw new Error("YAML offset should be zero or a positive number.");
        }
    }
    /**
     * Produces an XML serialization of the given node.
     *
     * @param node - node to serialize
     * @param writerOptions - serialization options
     */
    serialize(node) {
        // convert to object
        const objectWriterOptions = (0, util_1.applyDefaults)(this._writerOptions, {
            format: "object",
            wellFormed: false
        });
        const objectWriter = new ObjectWriter_1.ObjectWriter(this._builderOptions, objectWriterOptions);
        const val = objectWriter.serialize(node);
        let markup = this._beginLine(this._writerOptions, 0) + '---' + this._endLine(this._writerOptions) +
            this._convertObject(val, this._writerOptions, 0);
        // remove trailing newline
        /* istanbul ignore else */
        if (markup.slice(-this._writerOptions.newline.length) === this._writerOptions.newline) {
            markup = markup.slice(0, -this._writerOptions.newline.length);
        }
        return markup;
    }
    /**
     * Produces an XML serialization of the given object.
     *
     * @param obj - object to serialize
     * @param options - serialization options
     * @param level - depth of the XML tree
     * @param indentLeaf - indents leaf nodes
     */
    _convertObject(obj, options, level, suppressIndent = false) {
        let markup = '';
        if ((0, util_1.isArray)(obj)) {
            for (const val of obj) {
                markup += this._beginLine(options, level, true);
                if (!(0, util_1.isObject)(val)) {
                    markup += this._val(val) + this._endLine(options);
                }
                else if ((0, util_1.isEmpty)(val)) {
                    markup += '""' + this._endLine(options);
                }
                else {
                    markup += this._convertObject(val, options, level, true);
                }
            }
        }
        else /* if (isObject(obj)) */ {
            (0, util_1.forEachObject)(obj, (key, val) => {
                if (suppressIndent) {
                    markup += this._key(key);
                    suppressIndent = false;
                }
                else {
                    markup += this._beginLine(options, level) + this._key(key);
                }
                if (!(0, util_1.isObject)(val) && !(0, util_1.isArray)(val)) {
                    markup += ' ' + this._val(val) + this._endLine(options);
                }
                else if ((0, util_1.isEmpty)(val)) {
                    markup += ' ""' + this._endLine(options);
                }
                else {
                    markup += this._endLine(options) +
                        this._convertObject(val, options, level + 1);
                }
            }, this);
        }
        return markup;
    }
    /**
     * Produces characters to be prepended to a line of string in pretty-print
     * mode.
     *
     * @param options - serialization options
     * @param level - current depth of the XML tree
     * @param isArray - whether this line is an array item
     */
    _beginLine(options, level, isArray = false) {
        const indentLevel = options.offset + level + 1;
        const chars = new Array(indentLevel).join(options.indent);
        if (isArray) {
            return chars.substr(0, chars.length - 2) + '-' + chars.substr(-1, 1);
        }
        else {
            return chars;
        }
    }
    /**
     * Produces characters to be appended to a line of string in pretty-print
     * mode.
     *
     * @param options - serialization options
     */
    _endLine(options) {
        return options.newline;
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
exports.YAMLWriter = YAMLWriter;
//# sourceMappingURL=YAMLWriter.js.map