"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapWriter = void 0;
const util_1 = require("@oozcitak/util");
const ObjectWriter_1 = require("./ObjectWriter");
const BaseWriter_1 = require("./BaseWriter");
/**
 * Serializes XML nodes into ES6 maps and arrays.
 */
class MapWriter extends BaseWriter_1.BaseWriter {
    /**
     * Initializes a new instance of `MapWriter`.
     *
     * @param builderOptions - XML builder options
     * @param writerOptions - serialization options
     */
    constructor(builderOptions, writerOptions) {
        super(builderOptions);
        // provide default options
        this._writerOptions = (0, util_1.applyDefaults)(writerOptions, {
            format: "map",
            wellFormed: false,
            group: false,
            verbose: false
        });
    }
    /**
     * Produces an XML serialization of the given node.
     *
     * @param node - node to serialize
     */
    serialize(node) {
        // convert to object
        const objectWriterOptions = (0, util_1.applyDefaults)(this._writerOptions, {
            format: "object",
            wellFormed: false,
            verbose: false
        });
        const objectWriter = new ObjectWriter_1.ObjectWriter(this._builderOptions, objectWriterOptions);
        const val = objectWriter.serialize(node);
        // recursively convert object into Map
        return this._convertObject(val);
    }
    /**
     * Recursively converts a JS object into an ES5 map.
     *
     * @param obj - a JS object
     */
    _convertObject(obj) {
        if ((0, util_1.isArray)(obj)) {
            for (let i = 0; i < obj.length; i++) {
                obj[i] = this._convertObject(obj[i]);
            }
            return obj;
        }
        else if ((0, util_1.isObject)(obj)) {
            const map = new Map();
            for (const key in obj) {
                map.set(key, this._convertObject(obj[key]));
            }
            return map;
        }
        else {
            return obj;
        }
    }
}
exports.MapWriter = MapWriter;
//# sourceMappingURL=MapWriter.js.map