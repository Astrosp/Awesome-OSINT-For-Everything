"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.node_stringReplaceAll = node_stringReplaceAll;
exports.node_clone = node_clone;
exports.node_equals = node_equals;
exports.node_listOfElementsWithQualifiedName = node_listOfElementsWithQualifiedName;
exports.node_listOfElementsWithNamespace = node_listOfElementsWithNamespace;
exports.node_listOfElementsWithClassNames = node_listOfElementsWithClassNames;
exports.node_locateANamespacePrefix = node_locateANamespacePrefix;
exports.node_locateANamespace = node_locateANamespace;
const DOMImpl_1 = require("../dom/DOMImpl");
const util_1 = require("../util");
const infra_1 = require("@oozcitak/infra");
const CreateAlgorithm_1 = require("./CreateAlgorithm");
const OrderedSetAlgorithm_1 = require("./OrderedSetAlgorithm");
const DOMAlgorithm_1 = require("./DOMAlgorithm");
const MutationAlgorithm_1 = require("./MutationAlgorithm");
const ElementAlgorithm_1 = require("./ElementAlgorithm");
/**
 * Replaces the contents of the given node with a single text node.
 *
 * @param string - node contents
 * @param parent - a node
 */
function node_stringReplaceAll(str, parent) {
    /**
     * 1. Let node be null.
     * 2. If string is not the empty string, then set node to a new Text node
     * whose data is string and node document is parent’s node document.
     * 3. Replace all with node within parent.
     */
    let node = null;
    if (str !== '') {
        node = (0, CreateAlgorithm_1.create_text)(parent._nodeDocument, str);
    }
    (0, MutationAlgorithm_1.mutation_replaceAll)(node, parent);
}
/**
 * Clones a node.
 *
 * @param node - a node to clone
 * @param document - the document to own the cloned node
 * @param cloneChildrenFlag - whether to clone node's children
 */
function node_clone(node, document = null, cloneChildrenFlag = false) {
    /**
     * 1. If document is not given, let document be node’s node document.
     */
    if (document === null)
        document = node._nodeDocument;
    let copy;
    if (util_1.Guard.isElementNode(node)) {
        /**
         * 2. If node is an element, then:
         * 2.1. Let copy be the result of creating an element, given document,
         * node’s local name, node’s namespace, node’s namespace prefix,
         * and node’s is value, with the synchronous custom elements flag unset.
         * 2.2. For each attribute in node’s attribute list:
         * 2.2.1. Let copyAttribute be a clone of attribute.
         * 2.2.2. Append copyAttribute to copy.
         */
        copy = (0, ElementAlgorithm_1.element_createAnElement)(document, node._localName, node._namespace, node._namespacePrefix, node._is, false);
        for (const attribute of node._attributeList) {
            const copyAttribute = node_clone(attribute, document);
            (0, ElementAlgorithm_1.element_append)(copyAttribute, copy);
        }
    }
    else {
        /**
         * 3. Otherwise, let copy be a node that implements the same interfaces as
         * node, and fulfills these additional requirements, switching on node:
         * - Document
         * Set copy’s encoding, content type, URL, origin, type, and mode, to those
         * of node.
         * - DocumentType
         * Set copy’s name, public ID, and system ID, to those of node.
         * - Attr
         * Set copy’s namespace, namespace prefix, local name, and value, to
         * those of node.
         * - Text
         * - Comment
         * Set copy’s data, to that of node.
         * - ProcessingInstruction
         * Set copy’s target and data to those of node.
         * - Any other node
         */
        if (util_1.Guard.isDocumentNode(node)) {
            const doc = (0, CreateAlgorithm_1.create_document)();
            doc._encoding = node._encoding;
            doc._contentType = node._contentType;
            doc._URL = node._URL;
            doc._origin = node._origin;
            doc._type = node._type;
            doc._mode = node._mode;
            copy = doc;
        }
        else if (util_1.Guard.isDocumentTypeNode(node)) {
            const doctype = (0, CreateAlgorithm_1.create_documentType)(document, node._name, node._publicId, node._systemId);
            copy = doctype;
        }
        else if (util_1.Guard.isAttrNode(node)) {
            const attr = (0, CreateAlgorithm_1.create_attr)(document, node.localName);
            attr._namespace = node._namespace;
            attr._namespacePrefix = node._namespacePrefix;
            attr._value = node._value;
            copy = attr;
        }
        else if (util_1.Guard.isExclusiveTextNode(node)) {
            copy = (0, CreateAlgorithm_1.create_text)(document, node._data);
        }
        else if (util_1.Guard.isCDATASectionNode(node)) {
            copy = (0, CreateAlgorithm_1.create_cdataSection)(document, node._data);
        }
        else if (util_1.Guard.isCommentNode(node)) {
            copy = (0, CreateAlgorithm_1.create_comment)(document, node._data);
        }
        else if (util_1.Guard.isProcessingInstructionNode(node)) {
            copy = (0, CreateAlgorithm_1.create_processingInstruction)(document, node._target, node._data);
        }
        else if (util_1.Guard.isDocumentFragmentNode(node)) {
            copy = (0, CreateAlgorithm_1.create_documentFragment)(document);
        }
        else {
            copy = Object.create(node);
        }
    }
    /**
     * 4. Set copy’s node document and document to copy, if copy is a document,
     * and set copy’s node document to document otherwise.
     */
    if (util_1.Guard.isDocumentNode(copy)) {
        copy._nodeDocument = copy;
        document = copy;
    }
    else {
        copy._nodeDocument = document;
    }
    /**
     * 5. Run any cloning steps defined for node in other applicable
     * specifications and pass copy, node, document and the clone children flag
     * if set, as parameters.
     */
    if (DOMImpl_1.dom.features.steps) {
        (0, DOMAlgorithm_1.dom_runCloningSteps)(copy, node, document, cloneChildrenFlag);
    }
    /**
     * 6. If the clone children flag is set, clone all the children of node and
     * append them to copy, with document as specified and the clone children
     * flag being set.
     */
    if (cloneChildrenFlag) {
        for (const child of node._children) {
            const childCopy = node_clone(child, document, true);
            (0, MutationAlgorithm_1.mutation_append)(childCopy, copy);
        }
    }
    /**
     * 7. Return copy.
     */
    return copy;
}
/**
 * Determines if two nodes can be considered equal.
 *
 * @param a - node to compare
 * @param b - node to compare
 */
function node_equals(a, b) {
    /**
     * 1. A and B’s nodeType attribute value is identical.
     */
    if (a._nodeType !== b._nodeType)
        return false;
    /**
     * 2. The following are also equal, depending on A:
     * - DocumentType
     * Its name, public ID, and system ID.
     * - Element
     * Its namespace, namespace prefix, local name, and its attribute list’s size.
     * - Attr
     * Its namespace, local name, and value.
     * - ProcessingInstruction
     * Its target and data.
     * - Text
     * - Comment
     * Its data.
     */
    if (util_1.Guard.isDocumentTypeNode(a) && util_1.Guard.isDocumentTypeNode(b)) {
        if (a._name !== b._name || a._publicId !== b._publicId ||
            a._systemId !== b._systemId)
            return false;
    }
    else if (util_1.Guard.isElementNode(a) && util_1.Guard.isElementNode(b)) {
        if (a._namespace !== b._namespace || a._namespacePrefix !== b._namespacePrefix ||
            a._localName !== b._localName ||
            a._attributeList.length !== b._attributeList.length)
            return false;
    }
    else if (util_1.Guard.isAttrNode(a) && util_1.Guard.isAttrNode(b)) {
        if (a._namespace !== b._namespace || a._localName !== b._localName ||
            a._value !== b._value)
            return false;
    }
    else if (util_1.Guard.isProcessingInstructionNode(a) && util_1.Guard.isProcessingInstructionNode(b)) {
        if (a._target !== b._target || a._data !== b._data)
            return false;
    }
    else if (util_1.Guard.isCharacterDataNode(a) && util_1.Guard.isCharacterDataNode(b)) {
        if (a._data !== b._data)
            return false;
    }
    /**
     * 3. If A is an element, each attribute in its attribute list has an attribute
     * that equals an attribute in B’s attribute list.
     */
    if (util_1.Guard.isElementNode(a) && util_1.Guard.isElementNode(b)) {
        const attrMap = {};
        for (const attrA of a._attributeList) {
            attrMap[attrA._localName] = attrA;
        }
        for (const attrB of b._attributeList) {
            const attrA = attrMap[attrB._localName];
            if (!attrA)
                return false;
            if (!node_equals(attrA, attrB))
                return false;
        }
    }
    /**
     * 4. A and B have the same number of children.
     * 5. Each child of A equals the child of B at the identical index.
     */
    if (a._children.size !== b._children.size)
        return false;
    const itA = a._children[Symbol.iterator]();
    const itB = b._children[Symbol.iterator]();
    let resultA = itA.next();
    let resultB = itB.next();
    while (!resultA.done && !resultB.done) {
        const child1 = resultA.value;
        const child2 = resultB.value;
        if (!node_equals(child1, child2))
            return false;
        resultA = itA.next();
        resultB = itB.next();
    }
    return true;
}
/**
 * Returns a collection of elements with the given qualified name which are
 * descendants of the given root node.
 * See: https://dom.spec.whatwg.org/#concept-getelementsbytagname
 *
 * @param qualifiedName - qualified name
 * @param root - root node
 */
function node_listOfElementsWithQualifiedName(qualifiedName, root) {
    /**
     * 1. If qualifiedName is "*" (U+002A), return a HTMLCollection rooted at
     * root, whose filter matches only descendant elements.
     * 2. Otherwise, if root’s node document is an HTML document, return a
     * HTMLCollection rooted at root, whose filter matches the following
     * descendant elements:
     * 2.1. Whose namespace is the HTML namespace and whose qualified name is
     * qualifiedName, in ASCII lowercase.
     * 2.2. Whose namespace is not the HTML namespace and whose qualified name
     * is qualifiedName.
     * 3. Otherwise, return a HTMLCollection rooted at root, whose filter
     * matches descendant elements whose qualified name is qualifiedName.
     */
    if (qualifiedName === "*") {
        return (0, CreateAlgorithm_1.create_htmlCollection)(root);
    }
    else if (root._nodeDocument._type === "html") {
        return (0, CreateAlgorithm_1.create_htmlCollection)(root, function (ele) {
            if (ele._namespace === infra_1.namespace.HTML &&
                ele._qualifiedName === qualifiedName.toLowerCase()) {
                return true;
            }
            else if (ele._namespace !== infra_1.namespace.HTML &&
                ele._qualifiedName === qualifiedName) {
                return true;
            }
            else {
                return false;
            }
        });
    }
    else {
        return (0, CreateAlgorithm_1.create_htmlCollection)(root, function (ele) {
            return (ele._qualifiedName === qualifiedName);
        });
    }
}
/**
 * Returns a collection of elements with the given namespace which are
 * descendants of the given root node.
 * See: https://dom.spec.whatwg.org/#concept-getelementsbytagnamens
 *
 * @param namespace - element namespace
 * @param localName - local name
 * @param root - root node
 */
function node_listOfElementsWithNamespace(namespace, localName, root) {
    /**
     * 1. If namespace is the empty string, set it to null.
     * 2. If both namespace and localName are "*" (U+002A), return a
     * HTMLCollection rooted at root, whose filter matches descendant elements.
     * 3. Otherwise, if namespace is "*" (U+002A), return a HTMLCollection
     * rooted at root, whose filter matches descendant elements whose local
     * name is localName.
     * 4. Otherwise, if localName is "*" (U+002A), return a HTMLCollection
     * rooted at root, whose filter matches descendant elements whose
     * namespace is namespace.
     * 5. Otherwise, return a HTMLCollection rooted at root, whose filter
     * matches descendant elements whose namespace is namespace and local
     * name is localName.
     */
    if (namespace === '')
        namespace = null;
    if (namespace === "*" && localName === "*") {
        return (0, CreateAlgorithm_1.create_htmlCollection)(root);
    }
    else if (namespace === "*") {
        return (0, CreateAlgorithm_1.create_htmlCollection)(root, function (ele) {
            return (ele._localName === localName);
        });
    }
    else if (localName === "*") {
        return (0, CreateAlgorithm_1.create_htmlCollection)(root, function (ele) {
            return (ele._namespace === namespace);
        });
    }
    else {
        return (0, CreateAlgorithm_1.create_htmlCollection)(root, function (ele) {
            return (ele._localName === localName && ele._namespace === namespace);
        });
    }
}
/**
 * Returns a collection of elements with the given class names which are
 * descendants of the given root node.
 * See: https://dom.spec.whatwg.org/#concept-getelementsbyclassname
 *
 * @param namespace - element namespace
 * @param localName - local name
 * @param root - root node
 */
function node_listOfElementsWithClassNames(classNames, root) {
    /**
     * 1. Let classes be the result of running the ordered set parser
     * on classNames.
     * 2. If classes is the empty set, return an empty HTMLCollection.
     * 3. Return a HTMLCollection rooted at root, whose filter matches
     * descendant elements that have all their classes in classes.
     * The comparisons for the classes must be done in an ASCII case-insensitive
     * manner if root’s node document’s mode is "quirks", and in a
     * case-sensitive manner otherwise.
     */
    const classes = (0, OrderedSetAlgorithm_1.orderedSet_parse)(classNames);
    if (classes.size === 0) {
        return (0, CreateAlgorithm_1.create_htmlCollection)(root, () => false);
    }
    const caseSensitive = (root._nodeDocument._mode !== "quirks");
    return (0, CreateAlgorithm_1.create_htmlCollection)(root, function (ele) {
        const eleClasses = ele.classList;
        return (0, OrderedSetAlgorithm_1.orderedSet_contains)(eleClasses._tokenSet, classes, caseSensitive);
    });
}
/**
 * Searches for a namespace prefix associated with the given namespace
 * starting from the given element through its ancestors.
 *
 * @param element - an element node to start searching at
 * @param namespace - namespace to search for
 */
function node_locateANamespacePrefix(element, namespace) {
    /**
     * 1. If element’s namespace is namespace and its namespace prefix is not
     * null, then return its namespace prefix.
     */
    if (element._namespace === namespace && element._namespacePrefix !== null) {
        return element._namespacePrefix;
    }
    /**
     * 2. If element has an attribute whose namespace prefix is "xmlns" and
     * value is namespace, then return element’s first such attribute’s
     * local name.
     */
    for (let i = 0; i < element._attributeList.length; i++) {
        const attr = element._attributeList[i];
        if (attr._namespacePrefix === "xmlns" && attr._value === namespace) {
            return attr._localName;
        }
    }
    /**
     * 3. If element’s parent element is not null, then return the result of
     * running locate a namespace prefix on that element using namespace.
     */
    if (element._parent && util_1.Guard.isElementNode(element._parent)) {
        return node_locateANamespacePrefix(element._parent, namespace);
    }
    /**
     * 4. Return null.
     */
    return null;
}
/**
 * Searches for a namespace associated with the given namespace prefix
 * starting from the given node through its ancestors.
 *
 * @param node - a node to start searching at
 * @param prefix - namespace prefix to search for
 */
function node_locateANamespace(node, prefix) {
    if (util_1.Guard.isElementNode(node)) {
        /**
         * 1. If its namespace is not null and its namespace prefix is prefix,
         * then return namespace.
         */
        if (node._namespace !== null && node._namespacePrefix === prefix) {
            return node._namespace;
        }
        /**
         * 2. If it has an attribute whose namespace is the XMLNS namespace,
         * namespace prefix is "xmlns", and local name is prefix, or if prefix
         * is null and it has an attribute whose namespace is the XMLNS namespace,
         * namespace prefix is null, and local name is "xmlns", then return its
         * value if it is not the empty string, and null otherwise.
         */
        for (let i = 0; i < node._attributeList.length; i++) {
            const attr = node._attributeList[i];
            if (attr._namespace === infra_1.namespace.XMLNS &&
                attr._namespacePrefix === "xmlns" &&
                attr._localName === prefix) {
                return attr._value || null;
            }
            if (prefix === null && attr._namespace === infra_1.namespace.XMLNS &&
                attr._namespacePrefix === null && attr._localName === "xmlns") {
                return attr._value || null;
            }
        }
        /**
         * 3. If its parent element is null, then return null.
         */
        if (node.parentElement === null)
            return null;
        /**
         * 4. Return the result of running locate a namespace on its parent
         * element using prefix.
         */
        return node_locateANamespace(node.parentElement, prefix);
    }
    else if (util_1.Guard.isDocumentNode(node)) {
        /**
         * 1. If its document element is null, then return null.
         * 2. Return the result of running locate a namespace on its document
         * element using prefix.
         */
        if (node.documentElement === null)
            return null;
        return node_locateANamespace(node.documentElement, prefix);
    }
    else if (util_1.Guard.isDocumentTypeNode(node) || util_1.Guard.isDocumentFragmentNode(node)) {
        return null;
    }
    else if (util_1.Guard.isAttrNode(node)) {
        /**
         * 1. If its element is null, then return null.
         * 2. Return the result of running locate a namespace on its element
         * using prefix.
         */
        if (node._element === null)
            return null;
        return node_locateANamespace(node._element, prefix);
    }
    else {
        /**
         * 1. If its parent element is null, then return null.
         * 2. Return the result of running locate a namespace on its parent
         * element using prefix.
         */
        if (!node._parent || !util_1.Guard.isElementNode(node._parent))
            return null;
        return node_locateANamespace(node._parent, prefix);
    }
}
//# sourceMappingURL=NodeAlgorithm.js.map