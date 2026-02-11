"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.URLImpl = void 0;
const URLSearchParamsImpl_1 = require("./URLSearchParamsImpl");
const interfaces_1 = require("./interfaces");
const URLAlgorithm_1 = require("./URLAlgorithm");
/**
 * Represents an URL.
 */
class URLImpl {
    _url;
    _queryObject;
    /**
     * Initializes a new `URL`.
     *
     * @param url - an URL string
     * @param base - a base URL string
     */
    constructor(url, baseURL) {
        /**
         * 1. Let parsedBase be null.
         * 2. If base is given, then:
         * 2.1. Let parsedBase be the result of running the basic URL parser on base.
         * 2.2. If parsedBase is failure, then throw a TypeError.
         */
        let parsedBase = null;
        if (baseURL !== undefined) {
            parsedBase = (0, URLAlgorithm_1.basicURLParser)(baseURL);
            if (parsedBase === null) {
                throw new TypeError(`Invalid base URL: '${baseURL}'.`);
            }
        }
        /**
         * 3. Let parsedURL be the result of running the basic URL parser on url
         * with parsedBase.
         * 4. If parsedURL is failure, then throw a TypeError.
         */
        const parsedURL = (0, URLAlgorithm_1.basicURLParser)(url, parsedBase);
        if (parsedURL === null) {
            throw new TypeError(`Invalid URL: '${url}'.`);
        }
        /**
         * 5. Let query be parsedURL’s query, if that is non-null, and the empty
         * string otherwise.
         * 6. Let result be a new URL object.
         * 7. Set result’s url to parsedURL.
         * 8. Set result’s query object to a new URLSearchParams object using query,
         * and then set that query object’s url object to result.
         * 9. Return result.
         */
        const query = parsedURL.query || "";
        this._url = parsedURL;
        this._queryObject = new URLSearchParamsImpl_1.URLSearchParamsImpl(query);
        this._queryObject._urlObject = this;
    }
    /** @inheritdoc */
    get href() {
        /**
         * The href attribute’s getter and the toJSON() method, when invoked, must
         * return the serialization of context object’s url.
         */
        return (0, URLAlgorithm_1.urlSerializer)(this._url);
    }
    set href(value) {
        /**
         * 1. Let parsedURL be the result of running the basic URL parser on the
         * given value.
         * 2. If parsedURL is failure, then throw a TypeError.
         */
        const parsedURL = (0, URLAlgorithm_1.basicURLParser)(value);
        if (parsedURL === null) {
            throw new TypeError(`Invalid URL: '${value}'.`);
        }
        /**
         * 3. Set context object’s url to parsedURL.
         * 4. Empty context object’s query object’s list.
         * 5. Let query be context object’s url’s query.
         * 6. If query is non-null, then set context object’s query object’s list to
         * the result of parsing query.
         */
        this._url = parsedURL;
        this._queryObject._list = [];
        const query = this._url.query;
        if (query !== null) {
            this._queryObject._list = (0, URLAlgorithm_1.urlEncodedStringParser)(query);
        }
    }
    /** @inheritdoc */
    get origin() {
        /**
         * The origin attribute’s getter must return the serialization of context
         * object’s url’s origin. [HTML]
         */
        return (0, URLAlgorithm_1.asciiSerializationOfAnOrigin)((0, URLAlgorithm_1.origin)(this._url));
    }
    /** @inheritdoc */
    get protocol() {
        /**
         * The protocol attribute’s getter must return context object url’s scheme,
         * followed by U+003A (:).
         */
        return this._url.scheme + ':';
    }
    set protocol(val) {
        /**
         * The protocol attribute’s setter must basic URL parse the given value,
         * followed by U+003A (:), with context object’s url as url and scheme start
         * state as state override.
         */
        (0, URLAlgorithm_1.basicURLParser)(val + ':', undefined, undefined, this._url, interfaces_1.ParserState.SchemeStart);
    }
    /** @inheritdoc */
    get username() {
        /**
         * The username attribute’s getter must return context object’s url’s
         * username.
         */
        return this._url.username;
    }
    set username(val) {
        /**
         * 1. If context object’s url cannot have a username/password/port, then
         * return.
         * 2. Set the username given context object’s url and the given value.
         */
        if ((0, URLAlgorithm_1.cannotHaveAUsernamePasswordPort)(this._url))
            return;
        (0, URLAlgorithm_1.setTheUsername)(this._url, val);
    }
    /** @inheritdoc */
    get password() {
        /**
         * The password attribute’s getter must return context object’s url’s
         * password.
         */
        return this._url.password;
    }
    set password(val) {
        /**
         * 1. If context object’s url cannot have a username/password/port, then
         * return.
         * 2. Set the password given context object’s url and the given value.
         */
        if ((0, URLAlgorithm_1.cannotHaveAUsernamePasswordPort)(this._url))
            return;
        (0, URLAlgorithm_1.setThePassword)(this._url, val);
    }
    /** @inheritdoc */
    get host() {
        /**
         * 1. Let url be context object’s url.
         * 2. If url’s host is null, return the empty string.
         * 3. If url’s port is null, return url’s host, serialized.
         * 4. Return url’s host, serialized, followed by U+003A (:) and url’s port,
         * serialized.
         */
        if (this._url.host === null) {
            return "";
        }
        else if (this._url.port === null) {
            return (0, URLAlgorithm_1.hostSerializer)(this._url.host);
        }
        else {
            return (0, URLAlgorithm_1.hostSerializer)(this._url.host) + ':' + this._url.port.toString();
        }
    }
    set host(val) {
        /**
         * 1. If context object’s url’s cannot-be-a-base-URL flag is set, then
         * return.
         * 2. Basic URL parse the given value with context object’s url as url and
         * host state as state override.
         */
        if (this._url._cannotBeABaseURLFlag)
            return;
        (0, URLAlgorithm_1.basicURLParser)(val, undefined, undefined, this._url, interfaces_1.ParserState.Host);
    }
    /** @inheritdoc */
    get hostname() {
        /**
         * 1. If context object’s url’s host is null, return the empty string.
         * 2. Return context object’s url’s host, serialized.
         */
        if (this._url.host === null)
            return "";
        return (0, URLAlgorithm_1.hostSerializer)(this._url.host);
    }
    set hostname(val) {
        /**
         * 1. If context object’s url’s cannot-be-a-base-URL flag is set, then
         * return.
         * 2. Basic URL parse the given value with context object’s url as url and
         * hostname state as state override.
         */
        if (this._url._cannotBeABaseURLFlag)
            return;
        (0, URLAlgorithm_1.basicURLParser)(val, undefined, undefined, this._url, interfaces_1.ParserState.Hostname);
    }
    /** @inheritdoc */
    get port() {
        /**
         * 1. If context object’s url’s port is null, return the empty string.
         * 2. Return context object’s url’s port, serialized.
         */
        if (this._url.port === null)
            return "";
        return this._url.port.toString();
    }
    set port(val) {
        /**
         * 1. If context object’s url cannot have a username/password/port, then
         * return.
         * 2. If the given value is the empty string, then set context object’s
         * url’s port to null.
         * 3. Otherwise, basic URL parse the given value with context object’s url
         * as url and port state as state override.
         */
        if ((0, URLAlgorithm_1.cannotHaveAUsernamePasswordPort)(this._url))
            return;
        if (val === "") {
            this._url.port = null;
        }
        else {
            (0, URLAlgorithm_1.basicURLParser)(val, undefined, undefined, this._url, interfaces_1.ParserState.Port);
        }
    }
    /** @inheritdoc */
    get pathname() {
        /**
         * 1. If context object’s url’s cannot-be-a-base-URL flag is set, then
         * return context object’s url’s path[0].
         * 2. If context object’s url’s path is empty, then return the empty string.
         * 3. Return U+002F (/), followed by the strings in context object’s url’s
         * path (including empty strings), if any, separated from each other by
         * U+002F (/).
         */
        if (this._url._cannotBeABaseURLFlag)
            return this._url.path[0];
        if (this._url.path.length === 0)
            return "";
        return '/' + this._url.path.join('/');
    }
    set pathname(val) {
        /**
         * 1. If context object’s url’s cannot-be-a-base-URL flag is set, then return.
         * 2. Empty context object’s url’s path.
         * 3. Basic URL parse the given value with context object’s url as url and
         * path start state as state override.
         */
        if (this._url._cannotBeABaseURLFlag)
            return;
        this._url.path = [];
        (0, URLAlgorithm_1.basicURLParser)(val, undefined, undefined, this._url, interfaces_1.ParserState.PathStart);
    }
    /** @inheritdoc */
    get search() {
        /**
         * 1. If context object’s url’s query is either null or the empty string,
         * return the empty string.
         * 2. Return U+003F (?), followed by context object’s url’s query.
         */
        if (this._url.query === null || this._url.query === "")
            return "";
        return '?' + this._url.query;
    }
    set search(val) {
        /**
         * 1. Let url be context object’s url.
         * 2. If the given value is the empty string, set url’s query to null,
         * empty context object’s query object’s list, and then return.
         * 3. Let input be the given value with a single leading U+003F (?) removed,
         * if any.
         * 4. Set url’s query to the empty string.
         * 5. Basic URL parse input with url as url and query state as state
         * override.
         * 6. Set context object’s query object’s list to the result of parsing
         * input.
         */
        const url = this._url;
        if (val === "") {
            url.query = null;
            this._queryObject._list.length = 0;
            return;
        }
        if (val.startsWith('?'))
            val = val.substr(1);
        url.query = "";
        (0, URLAlgorithm_1.basicURLParser)(val, undefined, undefined, url, interfaces_1.ParserState.Query);
        this._queryObject._list = (0, URLAlgorithm_1.urlEncodedStringParser)(val);
    }
    /** @inheritdoc */
    get searchParams() { return this._queryObject; }
    /** @inheritdoc */
    get hash() {
        /**
         * 1. If context object’s url’s fragment is either null or the empty string,
         * return the empty string.
         * 2. Return U+0023 (#), followed by context object’s url’s fragment.
         */
        if (this._url.fragment === null || this._url.fragment === "")
            return "";
        return '#' + this._url.fragment;
    }
    set hash(val) {
        /**
         * 1. If the given value is the empty string, then set context object’s
         * url’s fragment to null and return.
         * 2. Let input be the given value with a single leading U+0023 (#) removed,
         * if any.
         * 3. Set context object’s url’s fragment to the empty string.
         * 4. Basic URL parse input with context object’s url as url and fragment
         * state as state override.
         */
        if (val === "") {
            this._url.fragment = null;
            return;
        }
        if (val.startsWith('#'))
            val = val.substr(1);
        this._url.fragment = "";
        (0, URLAlgorithm_1.basicURLParser)(val, undefined, undefined, this._url, interfaces_1.ParserState.Fragment);
    }
    /** @inheritdoc */
    toJSON() { return (0, URLAlgorithm_1.urlSerializer)(this._url); }
    /** @inheritdoc */
    toString() {
        return this.href;
    }
}
exports.URLImpl = URLImpl;
//# sourceMappingURL=URLImpl.js.map