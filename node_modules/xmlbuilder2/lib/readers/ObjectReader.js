"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectReader = void 0;
const util_1 = require("@oozcitak/util");
const BaseReader_1 = require("./BaseReader");
/**
 * Parses XML nodes from objects and arrays.
 * ES6 maps and sets are also supoorted.
 */
class ObjectReader extends BaseReader_1.BaseReader {
    /**
     * Parses the given document representation.
     *
     * @param node - node receive parsed XML nodes
     * @param obj - object to parse
     */
    _parse(node, obj) {
        const options = this._builderOptions;
        let lastChild = null;
        if ((0, util_1.isFunction)(obj)) {
            // evaluate if function
            lastChild = this.parse(node, obj.call(this));
        }
        else if ((0, util_1.isArray)(obj) || (0, util_1.isSet)(obj)) {
            (0, util_1.forEachArray)(obj, item => lastChild = this.parse(node, item), this);
        }
        else if ((0, util_1.isMap)(obj) || (0, util_1.isObject)(obj)) {
            // expand if object
            (0, util_1.forEachObject)(obj, (key, val) => {
                if ((0, util_1.isFunction)(val)) {
                    // evaluate if function
                    val = val.call(this);
                }
                if (!options.ignoreConverters && key.indexOf(options.convert.att) === 0) {
                    // assign attributes
                    if (key === options.convert.att) {
                        if ((0, util_1.isArray)(val) || (0, util_1.isSet)(val)) {
                            throw new Error("Invalid attribute: " + val.toString() + ". " + node._debugInfo());
                        }
                        else /* if (isMap(val) || isObject(val)) */ {
                            (0, util_1.forEachObject)(val, (attrKey, attrVal) => {
                                lastChild = this.attribute(node, undefined, this.sanitize(attrKey), this._decodeAttributeValue(this.sanitize(attrVal))) || lastChild;
                            });
                        }
                    }
                    else {
                        lastChild = this.attribute(node, undefined, this.sanitize(key.substring(options.convert.att.length)), this._decodeAttributeValue(this.sanitize(val?.toString()))) || lastChild;
                    }
                }
                else if (!options.ignoreConverters && key.indexOf(options.convert.text) === 0) {
                    // text node
                    if ((0, util_1.isMap)(val) || (0, util_1.isObject)(val)) {
                        // if the key is #text expand child nodes under this node to support mixed content
                        lastChild = this.parse(node, val);
                    }
                    else {
                        lastChild = this.text(node, this._decodeText(this.sanitize(val?.toString()))) || lastChild;
                    }
                }
                else if (!options.ignoreConverters && key.indexOf(options.convert.cdata) === 0) {
                    // cdata node
                    if ((0, util_1.isArray)(val) || (0, util_1.isSet)(val)) {
                        (0, util_1.forEachArray)(val, item => lastChild = this.cdata(node, this.sanitize(item)) || lastChild, this);
                    }
                    else {
                        lastChild = this.cdata(node, this.sanitize(val?.toString())) || lastChild;
                    }
                }
                else if (!options.ignoreConverters && key.indexOf(options.convert.comment) === 0) {
                    // comment node
                    if ((0, util_1.isArray)(val) || (0, util_1.isSet)(val)) {
                        (0, util_1.forEachArray)(val, item => lastChild = this.comment(node, this.sanitize(item)) || lastChild, this);
                    }
                    else {
                        lastChild = this.comment(node, this.sanitize(val?.toString())) || lastChild;
                    }
                }
                else if (!options.ignoreConverters && key.indexOf(options.convert.ins) === 0) {
                    // processing instruction
                    if ((0, util_1.isString)(val)) {
                        const insIndex = val.indexOf(' ');
                        const insTarget = (insIndex === -1 ? val : val.substr(0, insIndex));
                        const insValue = (insIndex === -1 ? '' : val.substr(insIndex + 1));
                        lastChild = this.instruction(node, this.sanitize(insTarget), this.sanitize(insValue)) || lastChild;
                    }
                    else if ((0, util_1.isArray)(val) || (0, util_1.isSet)(val)) {
                        (0, util_1.forEachArray)(val, item => {
                            const insIndex = item.indexOf(' ');
                            const insTarget = (insIndex === -1 ? item : item.substr(0, insIndex));
                            const insValue = (insIndex === -1 ? '' : item.substr(insIndex + 1));
                            lastChild = this.instruction(node, this.sanitize(insTarget), this.sanitize(insValue)) || lastChild;
                        }, this);
                    }
                    else /* if (isMap(target) || isObject(target)) */ {
                        (0, util_1.forEachObject)(val, (insTarget, insValue) => lastChild = this.instruction(node, this.sanitize(insTarget), this.sanitize(insValue)) || lastChild, this);
                    }
                }
                else if (((0, util_1.isArray)(val) || (0, util_1.isSet)(val)) && (0, util_1.isEmpty)(val)) {
                    // skip empty arrays
                }
                else if (((0, util_1.isMap)(val) || (0, util_1.isObject)(val)) && (0, util_1.isEmpty)(val)) {
                    // empty objects produce one node
                    lastChild = this.element(node, undefined, this.sanitize(key)) || lastChild;
                }
                else if (!options.keepNullNodes && (val == null)) {
                    // skip null and undefined nodes
                }
                else if ((0, util_1.isArray)(val) || (0, util_1.isSet)(val)) {
                    // expand list by creating child nodes
                    (0, util_1.forEachArray)(val, item => {
                        const childNode = {};
                        childNode[key] = item;
                        lastChild = this.parse(node, childNode);
                    }, this);
                }
                else if ((0, util_1.isMap)(val) || (0, util_1.isObject)(val)) {
                    // create a parent node
                    const parent = this.element(node, undefined, this.sanitize(key));
                    if (parent) {
                        lastChild = parent;
                        // expand child nodes under parent
                        this.parse(parent, val);
                    }
                }
                else if (val != null && (!(0, util_1.isString)(val) || val !== '')) {
                    // leaf element node with a single text node
                    const parent = this.element(node, undefined, this.sanitize(key));
                    if (parent) {
                        lastChild = parent;
                        this.text(parent, this._decodeText(this.sanitize(val?.toString())));
                    }
                }
                else {
                    // leaf element node
                    lastChild = this.element(node, undefined, this.sanitize(key)) || lastChild;
                }
            }, this);
        }
        else if (!options.keepNullNodes && (obj == null)) {
            // skip null and undefined nodes
        }
        else {
            // text node
            lastChild = this.text(node, this._decodeText(this.sanitize(obj?.toString()))) || lastChild;
        }
        return lastChild || node;
    }
}
exports.ObjectReader = ObjectReader;
//# sourceMappingURL=ObjectReader.js.map