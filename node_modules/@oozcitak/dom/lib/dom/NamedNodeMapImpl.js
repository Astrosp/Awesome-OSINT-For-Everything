"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NamedNodeMapImpl = void 0;
const DOMException_1 = require("./DOMException");
const algorithm_1 = require("../algorithm");
/**
 * Represents a collection of attributes.
 */
class NamedNodeMapImpl extends Array {
    _element;
    /**
     * Initializes a new instance of `NamedNodeMap`.
     *
     * @param element - parent element
     */
    constructor(element) {
        super();
        this._element = element;
        // TODO: This workaround is needed to extend Array in ES5
        Object.setPrototypeOf(this, NamedNodeMapImpl.prototype);
    }
    _asArray() { return this; }
    /** @inheritdoc */
    item(index) {
        /**
         * 1. If index is equal to or greater than context object’s attribute list’s
         * size, then return null.
         * 2. Otherwise, return context object’s attribute list[index].
         *
         */
        return this[index] || null;
    }
    /** @inheritdoc */
    getNamedItem(qualifiedName) {
        /**
         * The getNamedItem(qualifiedName) method, when invoked, must return the
         * result of getting an attribute given qualifiedName and element.
         */
        return (0, algorithm_1.element_getAnAttributeByName)(qualifiedName, this._element);
    }
    /** @inheritdoc */
    getNamedItemNS(namespace, localName) {
        /**
         * The getNamedItemNS(namespace, localName) method, when invoked, must
         * return the result of getting an attribute given namespace, localName,
         * and element.
         */
        return (0, algorithm_1.element_getAnAttributeByNamespaceAndLocalName)(namespace || '', localName, this._element);
    }
    /** @inheritdoc */
    setNamedItem(attr) {
        /**
         * The setNamedItem(attr) and setNamedItemNS(attr) methods, when invoked,
         * must return the result of setting an attribute given attr and element.
         */
        return (0, algorithm_1.element_setAnAttribute)(attr, this._element);
    }
    /** @inheritdoc */
    setNamedItemNS(attr) {
        return (0, algorithm_1.element_setAnAttribute)(attr, this._element);
    }
    /** @inheritdoc */
    removeNamedItem(qualifiedName) {
        /**
         * 1. Let attr be the result of removing an attribute given qualifiedName
         * and element.
         * 2. If attr is null, then throw a "NotFoundError" DOMException.
         * 3. Return attr.
         */
        const attr = (0, algorithm_1.element_removeAnAttributeByName)(qualifiedName, this._element);
        if (attr === null)
            throw new DOMException_1.NotFoundError();
        return attr;
    }
    /** @inheritdoc */
    removeNamedItemNS(namespace, localName) {
        /**
         * 1. Let attr be the result of removing an attribute given namespace,
         * localName, and element.
         * 2. If attr is null, then throw a "NotFoundError" DOMException.
         * 3. Return attr.
         */
        const attr = (0, algorithm_1.element_removeAnAttributeByNamespaceAndLocalName)(namespace || '', localName, this._element);
        if (attr === null)
            throw new DOMException_1.NotFoundError();
        return attr;
    }
    /**
     * Creates a new `NamedNodeMap`.
     *
     * @param element - parent element
     */
    static _create(element) {
        return new NamedNodeMapImpl(element);
    }
}
exports.NamedNodeMapImpl = NamedNodeMapImpl;
//# sourceMappingURL=NamedNodeMapImpl.js.map