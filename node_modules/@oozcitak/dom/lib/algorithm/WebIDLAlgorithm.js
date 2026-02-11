"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idl_defineConst = idl_defineConst;
/**
 * Defines a WebIDL `Const` property on the given object.
 *
 * @param o - object on which to add the property
 * @param name - property name
 * @param value - property value
 */
function idl_defineConst(o, name, value) {
    Object.defineProperty(o, name, { writable: false, enumerable: true, configurable: false, value: value });
}
//# sourceMappingURL=WebIDLAlgorithm.js.map