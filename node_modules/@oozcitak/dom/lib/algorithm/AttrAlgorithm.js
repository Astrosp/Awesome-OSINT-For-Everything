"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attr_setAnExistingAttributeValue = attr_setAnExistingAttributeValue;
const ElementAlgorithm_1 = require("./ElementAlgorithm");
/**
 * Changes the value of an existing attribute.
 *
 * @param attribute - an attribute node
 * @param value - attribute value
 */
function attr_setAnExistingAttributeValue(attribute, value) {
    /**
     * 1. If attribute’s element is null, then set attribute’s value to value.
     * 2. Otherwise, change attribute from attribute’s element to value.
     */
    if (attribute._element === null) {
        attribute._value = value;
    }
    else {
        (0, ElementAlgorithm_1.element_change)(attribute, attribute._element, value);
    }
}
//# sourceMappingURL=AttrAlgorithm.js.map