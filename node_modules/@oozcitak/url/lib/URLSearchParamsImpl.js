"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.URLSearchParamsImpl = void 0;
const util_1 = require("@oozcitak/util");
const URLAlgorithm_1 = require("./URLAlgorithm");
/**
 * Represents URL query parameters.
 */
class URLSearchParamsImpl {
    _list = [];
    _urlObject = null;
    /**
     * Initializes a new `URLSearchParams`.
     *
     * @param init - initial values of query parameters
     */
    constructor(init = "") {
        /**
         * 1. Let query be a new URLSearchParams object.
         * 2. If init is a sequence, then for each pair in init:
         * 3. If pair does not contain exactly two items, then throw a TypeError.
         * 4. Append a new name-value pair whose name is pair’s first item, and
         * value is pair’s second item, to query’s list.
         * 5. Otherwise, if init is a record, then for each name → value in init,
         * append a new name-value pair whose name is name and value is value, to
         * query’s list.
         * 6. Otherwise, init is a string, then set query’s list to the result of
         * parsing init.
         * 7. Return query.
         */
        if ((0, util_1.isArray)(init)) {
            for (const item of init) {
                if (item.length !== 2) {
                    throw new TypeError("Each item of init must be a two-tuple.");
                }
                this._list.push([item[0], item[1]]);
            }
        }
        else if ((0, util_1.isObject)(init)) {
            for (const name in init) {
                /* istanbul ignore else */
                if (init.hasOwnProperty(name)) {
                    this._list.push([name, init[name]]);
                }
            }
        }
        else {
            this._list = (0, URLAlgorithm_1.urlEncodedStringParser)(init);
        }
    }
    /**
     * Runs the update steps.
     */
    _updateSteps() {
        /**
         * 1. Let query be the serialization of URLSearchParams object’s list.
         * 2. If query is the empty string, then set query to null.
         * 3. Set url object’s url’s query to query.
         */
        let query = (0, URLAlgorithm_1.urlEncodedSerializer)(this._list);
        if (query === "")
            query = null;
        if (this._urlObject !== null)
            this._urlObject._url.query = query;
    }
    /** @inheritdoc */
    append(name, value) {
        /**
         * 1. Append a new name-value pair whose name is name and value is value,
         * to list.
         * 2. Run the update steps.
         */
        this._list.push([name, value]);
        this._updateSteps();
    }
    /** @inheritdoc */
    delete(name) {
        /**
         * 1. Remove all name-value pairs whose name is name from list.
         * 2. Run the update steps.
         */
        for (let i = this._list.length - 1; i >= 0; i--) {
            if (this._list[i][0] === name)
                this._list.splice(i, 1);
        }
        this._updateSteps();
    }
    /** @inheritdoc */
    get(name) {
        /**
         * The get(name) method, when invoked, must return the value of the
         * first name-value pair whose name is name in list, if there is such
         * a pair, and null otherwise.
         */
        for (const item of this._list) {
            if (item[0] === name)
                return item[1];
        }
        return null;
    }
    /** @inheritdoc */
    getAll(name) {
        /**
         * The getAll(name) method, when invoked, must return the values of all
         * name-value pairs whose name is name, in list, in list order, and the
         * empty sequence otherwise.
         */
        const values = [];
        for (const item of this._list) {
            if (item[0] === name)
                values.push(item[1]);
        }
        return values;
    }
    /** @inheritdoc */
    has(name) {
        /**
         * The has(name) method, when invoked, must return true if there is
         * a name-value pair whose name is name in list, and false otherwise.
         */
        for (const item of this._list) {
            if (item[0] === name)
                return true;
        }
        return false;
    }
    /** @inheritdoc */
    set(name, value) {
        /**
         * 1. If there are any name-value pairs whose name is name, in list,
         * set the value of the first such name-value pair to value and remove
         * the others.
         * 2. Otherwise, append a new name-value pair whose name is name and value
         * is value, to list.
         * 3. Run the update steps.
         */
        const toRemove = [];
        let found = false;
        for (let i = 0; i < this._list.length; i++) {
            if (this._list[i][0] === name) {
                if (!found) {
                    found = true;
                    this._list[i][1] = value;
                }
                else {
                    toRemove.push(i);
                }
            }
        }
        if (!found) {
            this._list.push([name, value]);
        }
        for (const i of toRemove) {
            this._list.splice(i, 1);
        }
    }
    /** @inheritdoc */
    sort() {
        /**
         * 1. Sort all name-value pairs, if any, by their names. Sorting must be
         * done by comparison of code units. The relative order between name-value
         * pairs with equal names must be preserved.
         * 2. Run the update steps.
         */
        this._list.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
        this._updateSteps();
    }
    /** @inheritdoc */
    *[Symbol.iterator]() {
        /**
         * The value pairs to iterate over are the list name-value pairs with the
         * key being the name and the value being the value.
         */
        for (const item of this._list) {
            yield item;
        }
    }
    /** @inheritdoc */
    toString() {
        return (0, URLAlgorithm_1.urlEncodedSerializer)(this._list);
    }
}
exports.URLSearchParamsImpl = URLSearchParamsImpl;
//# sourceMappingURL=URLSearchParamsImpl.js.map