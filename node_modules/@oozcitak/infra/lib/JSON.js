"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseJSONFromBytes = parseJSONFromBytes;
exports.serializeJSONToBytes = serializeJSONToBytes;
exports.parseJSONIntoInfraValues = parseJSONIntoInfraValues;
exports.convertAJSONDerivedJavaScriptValueToAnInfraValue = convertAJSONDerivedJavaScriptValueToAnInfraValue;
const util_1 = require("@oozcitak/util");
/**
 * Parses the given byte sequence representing a JSON string into an object.
 *
 * @param bytes - a byte sequence
 */
function parseJSONFromBytes(bytes) {
    /**
     * 1. Let jsonText be the result of running UTF-8 decode on bytes. [ENCODING]
     * 2. Return ? Call(%JSONParse%, undefined, « jsonText »).
     */
    const jsonText = (0, util_1.utf8Decode)(bytes);
    return JSON.parse.call(undefined, jsonText);
}
/**
 * Serialize the given JavaScript value into a byte sequence.
 *
 * @param value - a JavaScript value
 */
function serializeJSONToBytes(value) {
    /**
     * 1. Let jsonString be ? Call(%JSONStringify%, undefined, « value »).
     * 2. Return the result of running UTF-8 encode on jsonString. [ENCODING]
     */
    const jsonString = JSON.stringify.call(undefined, value);
    return (0, util_1.utf8Encode)(jsonString);
}
/**
 * Parses the given JSON string into a Realm-independent JavaScript value.
 *
 * @param jsonText - a JSON string
 */
function parseJSONIntoInfraValues(jsonText) {
    /**
     * 1. Let jsValue be ? Call(%JSONParse%, undefined, « jsonText »).
     * 2. Return the result of converting a JSON-derived JavaScript value to an
     * Infra value, given jsValue.
     */
    const jsValue = JSON.parse.call(undefined, jsonText);
    return convertAJSONDerivedJavaScriptValueToAnInfraValue(jsValue);
}
/**
 * Parses the value into a Realm-independent JavaScript value.
 *
 * @param jsValue - a JavaScript value
 */
function convertAJSONDerivedJavaScriptValueToAnInfraValue(jsValue) {
    /**
     * 1. If Type(jsValue) is Null, String, or Number, then return jsValue.
     */
    if (jsValue === null || (0, util_1.isString)(jsValue) || (0, util_1.isNumber)(jsValue))
        return jsValue;
    /**
     * 2. If IsArray(jsValue) is true, then:
     * 2.1. Let result be an empty list.
     * 2.2. Let length be ! ToLength(! Get(jsValue, "length")).
     * 2.3. For each index of the range 0 to length − 1, inclusive:
     * 2.3.1. Let indexName be ! ToString(index).
     * 2.3.2. Let jsValueAtIndex be ! Get(jsValue, indexName).
     * 2.3.3. Let infraValueAtIndex be the result of converting a JSON-derived
     * JavaScript value to an Infra value, given jsValueAtIndex.
     * 2.3.4. Append infraValueAtIndex to result.
     * 2.8. Return result.
     */
    if ((0, util_1.isArray)(jsValue)) {
        const result = new Array();
        for (const jsValueAtIndex of jsValue) {
            result.push(convertAJSONDerivedJavaScriptValueToAnInfraValue(jsValueAtIndex));
        }
        return result;
    }
    else if ((0, util_1.isObject)(jsValue)) {
        /**
         * 3. Let result be an empty ordered map.
         * 4. For each key of ! jsValue.[[OwnPropertyKeys]]():
         * 4.1. Let jsValueAtKey be ! Get(jsValue, key).
         * 4.2. Let infraValueAtKey be the result of converting a JSON-derived
         * JavaScript value to an Infra value, given jsValueAtKey.
         * 4.3. Set result[key] to infraValueAtKey.
         * 5. Return result.
         */
        const result = new Map();
        for (const key in jsValue) {
            /* istanbul ignore else */
            if (jsValue.hasOwnProperty(key)) {
                const jsValueAtKey = jsValue[key];
                result.set(key, convertAJSONDerivedJavaScriptValueToAnInfraValue(jsValueAtKey));
            }
        }
        return result;
    }
    /* istanbul ignore next */
    return jsValue;
}
//# sourceMappingURL=JSON.js.map