"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONWriter = void 0;
const ObjectWriter_1 = require("./ObjectWriter");
const util_1 = require("@oozcitak/util");
const BaseWriter_1 = require("./BaseWriter");
/**
 * Serializes XML nodes into a JSON string.
 */
class JSONWriter extends BaseWriter_1.BaseWriter {
    /**
     * Initializes a new instance of `JSONWriter`.
     *
     * @param builderOptions - XML builder options
     * @param writerOptions - serialization options
     */
    constructor(builderOptions, writerOptions) {
        super(builderOptions);
        // provide default options
        this._writerOptions = (0, util_1.applyDefaults)(writerOptions, {
            wellFormed: false,
            prettyPrint: false,
            indent: '  ',
            newline: '\n',
            offset: 0,
            group: false,
            verbose: false
        });
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
        // recursively convert object into JSON string
        return this._beginLine(this._writerOptions, 0) + this._convertObject(val, this._writerOptions);
    }
    /**
     * Produces an XML serialization of the given object.
     *
     * @param obj - object to serialize
     * @param options - serialization options
     * @param level - depth of the XML tree
     */
    _convertObject(obj, options, level = 0) {
        let markup = '';
        const isLeaf = this._isLeafNode(obj);
        if ((0, util_1.isArray)(obj)) {
            markup += '[';
            const len = obj.length;
            let i = 0;
            for (const val of obj) {
                markup += this._endLine(options, level + 1) +
                    this._beginLine(options, level + 1) +
                    this._convertObject(val, options, level + 1);
                if (i < len - 1) {
                    markup += ',';
                }
                i++;
            }
            markup += this._endLine(options, level) + this._beginLine(options, level);
            markup += ']';
        }
        else if ((0, util_1.isObject)(obj)) {
            markup += '{';
            const len = (0, util_1.objectLength)(obj);
            let i = 0;
            (0, util_1.forEachObject)(obj, (key, val) => {
                if (isLeaf && options.prettyPrint) {
                    markup += ' ';
                }
                else {
                    markup += this._endLine(options, level + 1) + this._beginLine(options, level + 1);
                }
                markup += this._key(key);
                if (options.prettyPrint) {
                    markup += ' ';
                }
                markup += this._convertObject(val, options, level + 1);
                if (i < len - 1) {
                    markup += ',';
                }
                i++;
            }, this);
            if (isLeaf && options.prettyPrint) {
                markup += ' ';
            }
            else {
                markup += this._endLine(options, level) + this._beginLine(options, level);
            }
            markup += '}';
        }
        else {
            markup += this._val(obj);
        }
        return markup;
    }
    /**
     * Produces characters to be prepended to a line of string in pretty-print
     * mode.
     *
     * @param options - serialization options
     * @param level - current depth of the XML tree
     */
    _beginLine(options, level) {
        if (!options.prettyPrint) {
            return '';
        }
        else {
            const indentLevel = options.offset + level + 1;
            if (indentLevel > 0) {
                return new Array(indentLevel).join(options.indent);
            }
        }
        return '';
    }
    /**
     * Produces characters to be appended to a line of string in pretty-print
     * mode.
     *
     * @param options - serialization options
     * @param level - current depth of the XML tree
     */
    _endLine(options, level) {
        if (!options.prettyPrint) {
            return '';
        }
        else {
            return options.newline;
        }
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
    /**
     * Determines if an object is a leaf node.
     *
     * @param obj
     */
    _isLeafNode(obj) {
        return this._descendantCount(obj) <= 1;
    }
    /**
     * Counts the number of descendants of the given object.
     *
     * @param obj
     * @param count
     */
    _descendantCount(obj, count = 0) {
        if ((0, util_1.isArray)(obj)) {
            (0, util_1.forEachArray)(obj, val => count += this._descendantCount(val, count), this);
        }
        else if ((0, util_1.isObject)(obj)) {
            (0, util_1.forEachObject)(obj, (key, val) => count += this._descendantCount(val, count), this);
        }
        else {
            count++;
        }
        return count;
    }
}
exports.JSONWriter = JSONWriter;
//# sourceMappingURL=JSONWriter.js.map