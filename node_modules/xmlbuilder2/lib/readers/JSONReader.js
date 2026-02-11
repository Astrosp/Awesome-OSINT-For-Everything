"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONReader = void 0;
const ObjectReader_1 = require("./ObjectReader");
const BaseReader_1 = require("./BaseReader");
/**
 * Parses XML nodes from a JSON string.
 */
class JSONReader extends BaseReader_1.BaseReader {
    /**
     * Parses the given document representation.
     *
     * @param node - node receive parsed XML nodes
     * @param str - JSON string to parse
     */
    _parse(node, str) {
        return new ObjectReader_1.ObjectReader(this._builderOptions).parse(node, JSON.parse(str));
    }
}
exports.JSONReader = JSONReader;
//# sourceMappingURL=JSONReader.js.map