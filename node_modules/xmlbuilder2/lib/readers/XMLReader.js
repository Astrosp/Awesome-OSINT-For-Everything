"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XMLReader = void 0;
const XMLStringLexer_1 = require("@oozcitak/dom/lib/parser/XMLStringLexer");
const interfaces_1 = require("@oozcitak/dom/lib/parser/interfaces");
const interfaces_2 = require("@oozcitak/dom/lib/dom/interfaces");
const infra_1 = require("@oozcitak/infra");
const algorithm_1 = require("@oozcitak/dom/lib/algorithm");
const BaseReader_1 = require("./BaseReader");
/**
 * Parses XML nodes from an XML document string.
 */
class XMLReader extends BaseReader_1.BaseReader {
    /**
     * Parses the given document representation.
     *
     * @param node - node receive parsed XML nodes
     * @param str - XML document string to parse
     */
    _parse(node, str) {
        const lexer = new XMLStringLexer_1.XMLStringLexer(str, { skipWhitespaceOnlyText: this._builderOptions.skipWhitespaceOnlyText });
        let lastChild = node;
        let context = node;
        let token = lexer.nextToken();
        while (token.type !== interfaces_1.TokenType.EOF) {
            switch (token.type) {
                case interfaces_1.TokenType.Declaration:
                    const declaration = token;
                    const version = this.sanitize(declaration.version);
                    if (version !== "1.0") {
                        throw new Error("Invalid xml version: " + version);
                    }
                    const builderOptions = {
                        version: version
                    };
                    if (declaration.encoding) {
                        builderOptions.encoding = this.sanitize(declaration.encoding);
                    }
                    if (declaration.standalone) {
                        builderOptions.standalone = (this.sanitize(declaration.standalone) === "yes");
                    }
                    context.set(builderOptions);
                    break;
                case interfaces_1.TokenType.DocType:
                    const doctype = token;
                    context = this.docType(context, this.sanitize(doctype.name), this.sanitize(doctype.pubId), this.sanitize(doctype.sysId)) || context;
                    break;
                case interfaces_1.TokenType.CDATA:
                    const cdata = token;
                    context = this.cdata(context, this.sanitize(cdata.data)) || context;
                    break;
                case interfaces_1.TokenType.Comment:
                    const comment = token;
                    context = this.comment(context, this.sanitize(comment.data)) || context;
                    break;
                case interfaces_1.TokenType.PI:
                    const pi = token;
                    context = this.instruction(context, this.sanitize(pi.target), this.sanitize(pi.data)) || context;
                    break;
                case interfaces_1.TokenType.Text:
                    if (context.node.nodeType === interfaces_2.NodeType.Document)
                        break;
                    const text = token;
                    context = this.text(context, this._decodeText(this.sanitize(text.data))) || context;
                    break;
                case interfaces_1.TokenType.Element:
                    const element = token;
                    const elementName = this.sanitize(element.name);
                    // inherit namespace from parent
                    const [prefix] = (0, algorithm_1.namespace_extractQName)(elementName);
                    let namespace = context.node.lookupNamespaceURI(prefix);
                    // override namespace if there is a namespace declaration
                    // attribute
                    // also lookup namespace declaration attributes
                    const nsDeclarations = {};
                    for (let [attName, attValue] of element.attributes) {
                        attName = this.sanitize(attName);
                        attValue = this.sanitize(attValue);
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
                        this.element(context, namespace, elementName) :
                        this.element(context, undefined, elementName));
                    if (elementNode === undefined)
                        break;
                    if (context.node === node.node)
                        lastChild = elementNode;
                    // assign attributes
                    for (let [attName, attValue] of element.attributes) {
                        attName = this.sanitize(attName);
                        attValue = this.sanitize(attValue);
                        const [attPrefix, attLocalName] = (0, algorithm_1.namespace_extractQName)(attName);
                        let attNamespace = null;
                        if (attPrefix === "xmlns" || (attPrefix === null && attLocalName === "xmlns")) {
                            // namespace declaration attribute
                            attNamespace = infra_1.namespace.XMLNS;
                        }
                        else {
                            attNamespace = elementNode.node.lookupNamespaceURI(attPrefix);
                            if (attNamespace !== null && elementNode.node.isDefaultNamespace(attNamespace)) {
                                attNamespace = null;
                            }
                            else if (attNamespace === null && attPrefix !== null) {
                                attNamespace = nsDeclarations[attPrefix] || null;
                            }
                        }
                        if (attNamespace !== null)
                            this.attribute(elementNode, attNamespace, attName, this._decodeAttributeValue(attValue));
                        else
                            this.attribute(elementNode, undefined, attName, this._decodeAttributeValue(attValue));
                    }
                    if (!element.selfClosing) {
                        context = elementNode;
                    }
                    break;
                case interfaces_1.TokenType.ClosingTag:
                    /* istanbul ignore else */
                    if (context.node.parentNode) {
                        context = context.up();
                    }
                    break;
            }
            token = lexer.nextToken();
        }
        return lastChild;
    }
}
exports.XMLReader = XMLReader;
//# sourceMappingURL=XMLReader.js.map