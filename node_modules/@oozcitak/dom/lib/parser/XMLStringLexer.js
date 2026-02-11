"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XMLStringLexer = void 0;
const interfaces_1 = require("./interfaces");
/**
 * Represents a lexer for XML content in a string.
 */
class XMLStringLexer {
    _str;
    _index;
    _length;
    _options = {
        skipWhitespaceOnlyText: false
    };
    err = { line: -1, col: -1, index: -1, str: "" };
    /**
     * Initializes a new instance of `XMLStringLexer`.
     *
     * @param str - the string to tokenize and lex
     * @param options - lexer options
     */
    constructor(str, options) {
        this._str = str;
        this._index = 0;
        this._length = str.length;
        if (options) {
            this._options.skipWhitespaceOnlyText = options.skipWhitespaceOnlyText || false;
        }
    }
    /**
     * Returns the next token.
     */
    nextToken() {
        if (this.eof()) {
            return { type: interfaces_1.TokenType.EOF };
        }
        let token = (this.skipIfStartsWith('<') ? this.openBracket() : this.text());
        if (this._options.skipWhitespaceOnlyText) {
            if (token.type === interfaces_1.TokenType.Text &&
                XMLStringLexer.isWhiteSpaceToken(token)) {
                token = this.nextToken();
            }
        }
        return token;
    }
    /**
     * Branches from an opening bracket (`<`).
     */
    openBracket() {
        if (this.skipIfStartsWith('?')) {
            if (this.skipIfStartsWith('xml')) {
                if (XMLStringLexer.isSpace(this._str[this._index])) {
                    return this.declaration();
                }
                else {
                    // a processing instruction starting with xml. e.g. <?xml-stylesheet href="doc.xsl" type="text/xsl"?>
                    this.seek(-3);
                    return this.pi();
                }
            }
            else {
                return this.pi();
            }
        }
        else if (this.skipIfStartsWith('!')) {
            if (this.skipIfStartsWith('--')) {
                return this.comment();
            }
            else if (this.skipIfStartsWith('[CDATA[')) {
                return this.cdata();
            }
            else if (this.skipIfStartsWith('DOCTYPE')) {
                return this.doctype();
            }
            else {
                this.throwError("Invalid '!' in opening tag.");
            }
        }
        else if (this.skipIfStartsWith('/')) {
            return this.closeTag();
        }
        else {
            return this.openTag();
        }
    }
    /**
     * Produces an XML declaration token.
     */
    declaration() {
        let version = '';
        let encoding = '';
        let standalone = '';
        while (!this.eof()) {
            this.skipSpace();
            if (this.skipIfStartsWith('?>')) {
                return { type: interfaces_1.TokenType.Declaration, version: version, encoding: encoding, standalone: standalone };
            }
            else {
                // attribute name
                const [attName, attValue] = this.attribute();
                if (attName === 'version')
                    version = attValue;
                else if (attName === 'encoding')
                    encoding = attValue;
                else if (attName === 'standalone')
                    standalone = attValue;
                else
                    this.throwError('Invalid attribute name: ' + attName);
            }
        }
        this.throwError('Missing declaration end symbol `?>`');
    }
    /**
     * Produces a doc type token.
     */
    doctype() {
        let pubId = '';
        let sysId = '';
        // name
        this.skipSpace();
        const name = this.takeUntil2('[', '>', true);
        this.skipSpace();
        if (this.skipIfStartsWith('PUBLIC')) {
            pubId = this.quotedString();
            sysId = this.quotedString();
        }
        else if (this.skipIfStartsWith('SYSTEM')) {
            sysId = this.quotedString();
        }
        // skip internal subset
        this.skipSpace();
        if (this.skipIfStartsWith('[')) {
            // skip internal subset nodes
            this.skipUntil(']');
            if (!this.skipIfStartsWith(']')) {
                this.throwError('Missing end bracket of DTD internal subset');
            }
        }
        this.skipSpace();
        if (!this.skipIfStartsWith('>')) {
            this.throwError('Missing doctype end symbol `>`');
        }
        return { type: interfaces_1.TokenType.DocType, name: name, pubId: pubId, sysId: sysId };
    }
    /**
     * Produces a processing instruction token.
     */
    pi() {
        const target = this.takeUntilStartsWith('?>', true);
        if (this.eof()) {
            this.throwError('Missing processing instruction end symbol `?>`');
        }
        this.skipSpace();
        if (this.skipIfStartsWith('?>')) {
            return { type: interfaces_1.TokenType.PI, target: target, data: '' };
        }
        const data = this.takeUntilStartsWith('?>');
        if (this.eof()) {
            this.throwError('Missing processing instruction end symbol `?>`');
        }
        this.seek(2);
        return { type: interfaces_1.TokenType.PI, target: target, data: data };
    }
    /**
     * Produces a text token.
     *
     */
    text() {
        const data = this.takeUntil('<');
        return { type: interfaces_1.TokenType.Text, data: data };
    }
    /**
     * Produces a comment token.
     *
     */
    comment() {
        const data = this.takeUntilStartsWith('-->');
        if (this.eof()) {
            this.throwError('Missing comment end symbol `-->`');
        }
        this.seek(3);
        return { type: interfaces_1.TokenType.Comment, data: data };
    }
    /**
     * Produces a CDATA token.
     *
     */
    cdata() {
        const data = this.takeUntilStartsWith(']]>');
        if (this.eof()) {
            this.throwError('Missing CDATA end symbol `]>`');
        }
        this.seek(3);
        return { type: interfaces_1.TokenType.CDATA, data: data };
    }
    /**
     * Produces an element token.
     */
    openTag() {
        // element name
        this.skipSpace();
        const name = this.takeUntil2('>', '/', true);
        this.skipSpace();
        if (this.skipIfStartsWith('>')) {
            return { type: interfaces_1.TokenType.Element, name: name, attributes: [], selfClosing: false };
        }
        else if (this.skipIfStartsWith('/>')) {
            return { type: interfaces_1.TokenType.Element, name: name, attributes: [], selfClosing: true };
        }
        // attributes
        const attributes = [];
        while (!this.eof()) {
            // end tag
            this.skipSpace();
            if (this.skipIfStartsWith('>')) {
                return { type: interfaces_1.TokenType.Element, name: name, attributes: attributes, selfClosing: false };
            }
            else if (this.skipIfStartsWith('/>')) {
                return { type: interfaces_1.TokenType.Element, name: name, attributes: attributes, selfClosing: true };
            }
            const attr = this.attribute();
            attributes.push(attr);
        }
        this.throwError('Missing opening element tag end symbol `>`');
    }
    /**
     * Produces a closing tag token.
     *
     */
    closeTag() {
        this.skipSpace();
        const name = this.takeUntil('>', true);
        this.skipSpace();
        if (!this.skipIfStartsWith('>')) {
            this.throwError('Missing closing element tag end symbol `>`');
        }
        return { type: interfaces_1.TokenType.ClosingTag, name: name };
    }
    /**
     * Reads an attribute name, value pair
     */
    attribute() {
        // attribute name
        this.skipSpace();
        const name = this.takeUntil('=', true);
        this.skipSpace();
        if (!this.skipIfStartsWith('=')) {
            this.throwError('Missing equals sign before attribute value');
        }
        // attribute value
        const value = this.quotedString();
        return [name, value];
    }
    /**
     * Reads a string between double or single quotes.
     */
    quotedString() {
        this.skipSpace();
        const startQuote = this.take(1);
        if (!XMLStringLexer.isQuote(startQuote)) {
            this.throwError('Missing start quote character before quoted value');
        }
        const value = this.takeUntil(startQuote);
        if (!this.skipIfStartsWith(startQuote)) {
            this.throwError('Missing end quote character after quoted value');
        }
        return value;
    }
    /**
     * Determines if the current index is at or past the end of input string.
     */
    eof() { return this._index >= this._length; }
    /**
     * Skips the length of the given string if the string from current position
     * starts with the given string.
     *
     * @param str - the string to match
     */
    skipIfStartsWith(str) {
        const strLength = str.length;
        if (strLength === 1) {
            if (this._str[this._index] === str) {
                this._index++;
                return true;
            }
            else {
                return false;
            }
        }
        for (let i = 0; i < strLength; i++) {
            if (this._str[this._index + i] !== str[i])
                return false;
        }
        this._index += strLength;
        return true;
    }
    /**
     * Seeks a number of character codes.
     *
     * @param count - number of characters to skip
     */
    seek(count) {
        this._index += count;
        if (this._index < 0)
            this._index = 0;
        if (this._index > this._length)
            this._index = this._length;
    }
    /**
     * Skips space characters.
     */
    skipSpace() {
        while (!this.eof() && (XMLStringLexer.isSpace(this._str[this._index]))) {
            this._index++;
        }
    }
    /**
     * Takes a given number of characters.
     *
     * @param count - character count
     */
    take(count) {
        if (count === 1) {
            return this._str[this._index++];
        }
        const startIndex = this._index;
        this.seek(count);
        return this._str.slice(startIndex, this._index);
    }
    /**
     * Takes characters until the next character matches `char`.
     *
     * @param char - a character to match
     * @param space - whether a space character stops iteration
     */
    takeUntil(char, space = false) {
        const startIndex = this._index;
        while (this._index < this._length) {
            const c = this._str[this._index];
            if (c !== char && (!space || !XMLStringLexer.isSpace(c))) {
                this._index++;
            }
            else {
                break;
            }
        }
        return this._str.slice(startIndex, this._index);
    }
    /**
     * Takes characters until the next character matches `char1` or `char1`.
     *
     * @param char1 - a character to match
     * @param char2 - a character to match
     * @param space - whether a space character stops iteration
     */
    takeUntil2(char1, char2, space = false) {
        const startIndex = this._index;
        while (this._index < this._length) {
            const c = this._str[this._index];
            if (c !== char1 && c !== char2 && (!space || !XMLStringLexer.isSpace(c))) {
                this._index++;
            }
            else {
                break;
            }
        }
        return this._str.slice(startIndex, this._index);
    }
    /**
     * Takes characters until the next characters matches `str`.
     *
     * @param str - a string to match
     * @param space - whether a space character stops iteration
     */
    takeUntilStartsWith(str, space = false) {
        const startIndex = this._index;
        const strLength = str.length;
        while (this._index < this._length) {
            let match = true;
            for (let i = 0; i < strLength; i++) {
                const c = this._str[this._index + i];
                const char = str[i];
                if (space && XMLStringLexer.isSpace(c)) {
                    return this._str.slice(startIndex, this._index);
                }
                else if (c !== char) {
                    this._index++;
                    match = false;
                    break;
                }
            }
            if (match)
                return this._str.slice(startIndex, this._index);
        }
        this._index = this._length;
        return this._str.slice(startIndex);
    }
    /**
     * Skips characters until the next character matches `char`.
     *
     * @param char - a character to match
     */
    skipUntil(char) {
        while (this._index < this._length) {
            const c = this._str[this._index];
            if (c !== char) {
                this._index++;
            }
            else {
                break;
            }
        }
    }
    /**
     * Determines if the given token is entirely whitespace.
     *
     * @param token - the token to check
     */
    static isWhiteSpaceToken(token) {
        const str = token.data;
        for (let i = 0; i < str.length; i++) {
            const c = str[i];
            if (c !== ' ' && c !== '\n' && c !== '\r' && c !== '\t' && c !== '\f')
                return false;
        }
        return true;
    }
    /**
     * Determines if the given character is whitespace.
     *
     * @param char - the character to check
     */
    static isSpace(char) {
        return char === ' ' || char === '\n' || char === '\r' || char === '\t';
    }
    /**
     * Determines if the given character is a quote character.
     *
     * @param char - the character to check
     */
    static isQuote(char) {
        return (char === '"' || char === '\'');
    }
    /**
     * Throws a parser error and records the line and column numbers in the parsed
     * string.
     *
     * @param msg - error message
     */
    throwError(msg) {
        const regexp = /\r\n|\r|\n/g;
        let match = null;
        let line = 0;
        let firstNewLineIndex = 0;
        let lastNewlineIndex = this._str.length;
        while ((match = regexp.exec(this._str)) !== null) {
            if (match === null)
                break;
            line++;
            if (match.index < this._index)
                firstNewLineIndex = regexp.lastIndex;
            if (match.index > this._index) {
                lastNewlineIndex = match.index;
                break;
            }
        }
        this.err = {
            line: line,
            col: this._index - firstNewLineIndex,
            index: this._index,
            str: this._str.substring(firstNewLineIndex, lastNewlineIndex)
        };
        throw new Error(msg + "\nIndex: " + this.err.index +
            "\nLn: " + this.err.line + ", Col: " + this.err.col +
            "\nInput: " + this.err.str);
    }
    /**
     * Returns an iterator for the lexer.
     */
    [Symbol.iterator]() {
        this._index = 0;
        return {
            next: function () {
                const token = this.nextToken();
                if (token.type === interfaces_1.TokenType.EOF) {
                    return { done: true, value: null };
                }
                else {
                    return { done: false, value: token };
                }
            }.bind(this)
        };
    }
}
exports.XMLStringLexer = XMLStringLexer;
//# sourceMappingURL=XMLStringLexer.js.map