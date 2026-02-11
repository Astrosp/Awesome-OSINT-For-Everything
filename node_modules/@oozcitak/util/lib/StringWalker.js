"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringWalker = void 0;
/**
 * Walks through the code points of a string.
 */
class StringWalker {
    _chars;
    _length;
    _pointer = 0;
    _codePoint;
    _c;
    _remaining;
    _substring;
    /**
     * Initializes a new `StringWalker`.
     *
     * @param input - input string
     */
    constructor(input) {
        this._chars = Array.from(input);
        this._length = this._chars.length;
    }
    /**
     * Determines if the current position is beyond the end of string.
     */
    get eof() { return this._pointer >= this._length; }
    /**
     * Returns the number of code points in the input string.
     */
    get length() { return this._length; }
    /**
     * Returns the current code point. Returns `-1` if the position is beyond
     * the end of string.
     */
    codePoint() {
        if (this._codePoint === undefined) {
            if (this.eof) {
                this._codePoint = -1;
            }
            else {
                const cp = this._chars[this._pointer].codePointAt(0);
                /* istanbul ignore else */
                if (cp !== undefined) {
                    this._codePoint = cp;
                }
                else {
                    this._codePoint = -1;
                }
            }
        }
        return this._codePoint;
    }
    /**
     * Returns the current character. Returns an empty string if the position is
     * beyond the end of string.
     */
    c() {
        if (this._c === undefined) {
            this._c = (this.eof ? "" : this._chars[this._pointer]);
        }
        return this._c;
    }
    /**
     * Returns the remaining string.
     */
    remaining() {
        if (this._remaining === undefined) {
            this._remaining = (this.eof ?
                "" : this._chars.slice(this._pointer + 1).join(''));
        }
        return this._remaining;
    }
    /**
     * Returns the substring from the current character to the end of string.
     */
    substring() {
        if (this._substring === undefined) {
            this._substring = (this.eof ?
                "" : this._chars.slice(this._pointer).join(''));
        }
        return this._substring;
    }
    /**
     * Gets or sets the current position.
     */
    get pointer() { return this._pointer; }
    set pointer(val) {
        if (val === this._pointer)
            return;
        this._pointer = val;
        this._codePoint = undefined;
        this._c = undefined;
        this._remaining = undefined;
        this._substring = undefined;
    }
}
exports.StringWalker = StringWalker;
//# sourceMappingURL=StringWalker.js.map