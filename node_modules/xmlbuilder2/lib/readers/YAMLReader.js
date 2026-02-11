"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YAMLReader = void 0;
const ObjectReader_1 = require("./ObjectReader");
const BaseReader_1 = require("./BaseReader");
const js_yaml_1 = require("js-yaml");
/**
 * Parses XML nodes from a YAML string.
 */
class YAMLReader extends BaseReader_1.BaseReader {
    /**
     * Parses the given document representation.
     *
     * @param node - node receive parsed XML nodes
     * @param str - YAML string to parse
     */
    _parse(node, str) {
        const result = (0, js_yaml_1.load)(str);
        /* istanbul ignore next */
        if (result === undefined) {
            throw new Error("Unable to parse YAML document.");
        }
        return new ObjectReader_1.ObjectReader(this._builderOptions).parse(node, result);
    }
}
exports.YAMLReader = YAMLReader;
//# sourceMappingURL=YAMLReader.js.map