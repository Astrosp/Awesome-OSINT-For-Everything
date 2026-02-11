"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XMLParserImpl = void 0;
const XMLStringLexer_1 = require("./XMLStringLexer");
const interfaces_1 = require("./interfaces");
const infra_1 = require("@oozcitak/infra");
const algorithm_1 = require("../algorithm");
const LocalNameSet_1 = require("../serializer/LocalNameSet");
/**
 * Represents a parser for XML content.
 *
 * See: https://html.spec.whatwg.org/#xml-parser
 */
class XMLParserImpl {
    /**
     * Parses XML content.
     *
     * @param source - a string containing XML content
     */
    parse(source) {
        const lexer = new XMLStringLexer_1.XMLStringLexer(source, { skipWhitespaceOnlyText: true });
        const doc = (0, algorithm_1.create_document)();
        let context = doc;
        let token = lexer.nextToken();
        while (token.type !== interfaces_1.TokenType.EOF) {
            switch (token.type) {
                case interfaces_1.TokenType.Declaration:
                    const declaration = token;
                    if (declaration.version !== "1.0") {
                        throw new Error("Invalid xml version: " + declaration.version);
                    }
                    break;
                case interfaces_1.TokenType.DocType:
                    const doctype = token;
                    if (!(0, algorithm_1.xml_isPubidChar)(doctype.pubId)) {
                        throw new Error("DocType public identifier does not match PubidChar construct.");
                    }
                    if (!(0, algorithm_1.xml_isLegalChar)(doctype.sysId) ||
                        (doctype.sysId.indexOf('"') !== -1 && doctype.sysId.indexOf("'") !== -1)) {
                        throw new Error("DocType system identifier contains invalid characters.");
                    }
                    context.appendChild(doc.implementation.createDocumentType(doctype.name, doctype.pubId, doctype.sysId));
                    break;
                case interfaces_1.TokenType.CDATA:
                    const cdata = token;
                    if (!(0, algorithm_1.xml_isLegalChar)(cdata.data) ||
                        cdata.data.indexOf("]]>") !== -1) {
                        throw new Error("CDATA contains invalid characters.");
                    }
                    context.appendChild(doc.createCDATASection(cdata.data));
                    break;
                case interfaces_1.TokenType.Comment:
                    const comment = token;
                    if (!(0, algorithm_1.xml_isLegalChar)(comment.data) ||
                        comment.data.indexOf("--") !== -1 || comment.data.endsWith("-")) {
                        throw new Error("Comment data contains invalid characters.");
                    }
                    context.appendChild(doc.createComment(comment.data));
                    break;
                case interfaces_1.TokenType.PI:
                    const pi = token;
                    if (pi.target.indexOf(":") !== -1 || (/^xml$/i).test(pi.target)) {
                        throw new Error("Processing instruction target contains invalid characters.");
                    }
                    if (!(0, algorithm_1.xml_isLegalChar)(pi.data) || pi.data.indexOf("?>") !== -1) {
                        throw new Error("Processing instruction data contains invalid characters.");
                    }
                    context.appendChild(doc.createProcessingInstruction(pi.target, pi.data));
                    break;
                case interfaces_1.TokenType.Text:
                    const text = token;
                    if (!(0, algorithm_1.xml_isLegalChar)(text.data)) {
                        throw new Error("Text data contains invalid characters.");
                    }
                    context.appendChild(doc.createTextNode(this._decodeText(text.data)));
                    break;
                case interfaces_1.TokenType.Element:
                    const element = token;
                    // inherit namespace from parent
                    const [prefix, localName] = (0, algorithm_1.namespace_extractQName)(element.name);
                    if (localName.indexOf(":") !== -1 || !(0, algorithm_1.xml_isName)(localName)) {
                        throw new Error("Node local name contains invalid characters.");
                    }
                    if (prefix === "xmlns") {
                        throw new Error("An element cannot have the 'xmlns' prefix.");
                    }
                    let namespace = context.lookupNamespaceURI(prefix);
                    // override namespace if there is a namespace declaration
                    // attribute
                    // also lookup namespace declaration attributes
                    const nsDeclarations = {};
                    for (const [attName, attValue] of element.attributes) {
                        if (attName === "xmlns") {
                            namespace = attValue;
                        }
                        else {
                            const [attPrefix, attLocalName] = (0, algorithm_1.namespace_extractQName)(attName);
                            if (attPrefix === "xmlns") {
                                if (attLocalName === prefix) {
                                    namespace = attValue;
                                }
                                nsDeclarations[attLocalName] = attValue;
                            }
                        }
                    }
                    // create the DOM element node
                    const elementNode = (namespace !== null ?
                        doc.createElementNS(namespace, element.name) :
                        doc.createElement(element.name));
                    context.appendChild(elementNode);
                    // assign attributes
                    const localNameSet = new LocalNameSet_1.LocalNameSet();
                    for (const [attName, attValue] of element.attributes) {
                        const [attPrefix, attLocalName] = (0, algorithm_1.namespace_extractQName)(attName);
                        let attNamespace = null;
                        if (attPrefix === "xmlns" || (attPrefix === null && attLocalName === "xmlns")) {
                            // namespace declaration attribute
                            attNamespace = infra_1.namespace.XMLNS;
                        }
                        else {
                            attNamespace = elementNode.lookupNamespaceURI(attPrefix);
                            if (attNamespace !== null && elementNode.isDefaultNamespace(attNamespace)) {
                                attNamespace = null;
                            }
                            else if (attNamespace === null && attPrefix !== null) {
                                attNamespace = nsDeclarations[attPrefix] || null;
                            }
                        }
                        if (localNameSet.has(attNamespace, attLocalName)) {
                            throw new Error("Element contains duplicate attributes.");
                        }
                        localNameSet.set(attNamespace, attLocalName);
                        if (attNamespace === infra_1.namespace.XMLNS) {
                            if (attValue === infra_1.namespace.XMLNS) {
                                throw new Error("XMLNS namespace is reserved.");
                            }
                        }
                        if (attLocalName.indexOf(":") !== -1 || !(0, algorithm_1.xml_isName)(attLocalName)) {
                            throw new Error("Attribute local name contains invalid characters.");
                        }
                        if (attPrefix === "xmlns" && attValue === "") {
                            throw new Error("Empty XML namespace is not allowed.");
                        }
                        if (attNamespace !== null)
                            elementNode.setAttributeNS(attNamespace, attName, this._decodeAttributeValue(attValue));
                        else
                            elementNode.setAttribute(attName, this._decodeAttributeValue(attValue));
                    }
                    if (!element.selfClosing) {
                        context = elementNode;
                    }
                    break;
                case interfaces_1.TokenType.ClosingTag:
                    const closingTag = token;
                    if (closingTag.name !== context.nodeName) {
                        throw new Error('Closing tag name does not match opening tag name.');
                    }
                    /* istanbul ignore else */
                    if (context._parent) {
                        context = context._parent;
                    }
                    break;
            }
            token = lexer.nextToken();
        }
        return doc;
    }
    /**
     * Decodes serialized text.
     *
     * @param text - text value to serialize
     */
    _decodeText(text) {
        return text == null ? text : text.replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&');
    }
    /**
     * Decodes serialized attribute value.
     *
     * @param text - attribute value to serialize
     */
    _decodeAttributeValue(text) {
        return text == null ? text : text.replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&');
    }
}
exports.XMLParserImpl = XMLParserImpl;
//# sourceMappingURL=XMLParserImpl.js.map