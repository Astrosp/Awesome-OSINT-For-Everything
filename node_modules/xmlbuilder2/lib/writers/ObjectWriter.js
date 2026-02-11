"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectWriter = void 0;
const util_1 = require("@oozcitak/util");
const interfaces_1 = require("@oozcitak/dom/lib/dom/interfaces");
const BaseWriter_1 = require("./BaseWriter");
/**
 * Serializes XML nodes into objects and arrays.
 */
class ObjectWriter extends BaseWriter_1.BaseWriter {
    _currentList;
    _currentIndex;
    _listRegister;
    /**
     * Initializes a new instance of `ObjectWriter`.
     *
     * @param builderOptions - XML builder options
     * @param writerOptions - serialization options
     */
    constructor(builderOptions, writerOptions) {
        super(builderOptions);
        this._writerOptions = (0, util_1.applyDefaults)(writerOptions, {
            format: "object",
            wellFormed: false,
            group: false,
            verbose: false
        });
    }
    /**
     * Produces an XML serialization of the given node.
     *
     * @param node - node to serialize
     */
    serialize(node) {
        this._currentList = [];
        this._currentIndex = 0;
        this._listRegister = [this._currentList];
        /**
         * First pass, serialize nodes
         * This creates a list of nodes grouped under node types while preserving
         * insertion order. For example:
         * [
         *   root: [
         *     node: [
         *       { "@" : { "att1": "val1", "att2": "val2" }
         *       { "#": "node text" }
         *       { childNode: [] }
         *       { "#": "more text" }
         *     ],
         *     node: [
         *       { "@" : { "att": "val" }
         *       { "#": [ "text line1", "text line2" ] }
         *     ]
         *   ]
         * ]
         */
        this.serializeNode(node, this._writerOptions.wellFormed);
        /**
         * Second pass, process node lists. Above example becomes:
         * {
         *   root: {
         *     node: [
         *       {
         *         "@att1": "val1",
         *         "@att2": "val2",
         *         "#1": "node text",
         *         childNode: {},
         *         "#2": "more text"
         *       },
         *       {
         *         "@att": "val",
         *         "#": [ "text line1", "text line2" ]
         *       }
         *     ]
         *   }
         * }
         */
        return this._process(this._currentList, this._writerOptions);
    }
    _process(items, options) {
        if (items.length === 0)
            return {};
        // determine if there are non-unique element names
        const namesSeen = {};
        let hasNonUniqueNames = false;
        let textCount = 0;
        let commentCount = 0;
        let instructionCount = 0;
        let cdataCount = 0;
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const key = Object.keys(item)[0];
            switch (key) {
                case "@":
                    continue;
                case "#":
                    textCount++;
                    break;
                case "!":
                    commentCount++;
                    break;
                case "?":
                    instructionCount++;
                    break;
                case "$":
                    cdataCount++;
                    break;
                default:
                    if (namesSeen[key]) {
                        hasNonUniqueNames = true;
                    }
                    else {
                        namesSeen[key] = true;
                    }
                    break;
            }
        }
        const defAttrKey = this._getAttrKey();
        const defTextKey = this._getNodeKey(interfaces_1.NodeType.Text);
        const defCommentKey = this._getNodeKey(interfaces_1.NodeType.Comment);
        const defInstructionKey = this._getNodeKey(interfaces_1.NodeType.ProcessingInstruction);
        const defCdataKey = this._getNodeKey(interfaces_1.NodeType.CData);
        if (textCount === 1 && items.length === 1 && (0, util_1.isString)(items[0]["#"])) {
            // special case of an element node with a single text node
            return items[0]["#"];
        }
        else if (hasNonUniqueNames) {
            const obj = {};
            // process attributes first
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                const key = Object.keys(item)[0];
                if (key === "@") {
                    const attrs = item["@"];
                    const attrKeys = Object.keys(attrs);
                    if (!options.group || attrKeys.length === 1) {
                        for (const attrName in attrs) {
                            obj[defAttrKey + attrName] = attrs[attrName];
                        }
                    }
                    else {
                        obj[defAttrKey] = attrs;
                    }
                }
            }
            // list contains element nodes with non-unique names
            // return an array with mixed content notation
            const result = [];
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                const key = Object.keys(item)[0];
                switch (key) {
                    case "@":
                        // attributes were processed above
                        break;
                    case "#":
                        result.push({ [defTextKey]: item["#"] });
                        break;
                    case "!":
                        result.push({ [defCommentKey]: item["!"] });
                        break;
                    case "?":
                        result.push({ [defInstructionKey]: item["?"] });
                        break;
                    case "$":
                        result.push({ [defCdataKey]: item["$"] });
                        break;
                    default:
                        // element node
                        const ele = item;
                        if (ele[key].length !== 0 && (0, util_1.isArray)(ele[key][0])) {
                            // group of element nodes
                            const eleGroup = [];
                            const listOfLists = ele[key];
                            for (let i = 0; i < listOfLists.length; i++) {
                                eleGroup.push(this._process(listOfLists[i], options));
                            }
                            result.push({ [key]: eleGroup });
                        }
                        else {
                            // single element node
                            if (options.verbose) {
                                result.push({ [key]: [this._process(ele[key], options)] });
                            }
                            else {
                                result.push({ [key]: this._process(ele[key], options) });
                            }
                        }
                        break;
                }
            }
            obj[defTextKey] = result;
            return obj;
        }
        else {
            // all element nodes have unique names
            // return an object while prefixing data node keys
            let textId = 1;
            let commentId = 1;
            let instructionId = 1;
            let cdataId = 1;
            const obj = {};
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                const key = Object.keys(item)[0];
                switch (key) {
                    case "@":
                        const attrs = item["@"];
                        const attrKeys = Object.keys(attrs);
                        if (!options.group || attrKeys.length === 1) {
                            for (const attrName in attrs) {
                                obj[defAttrKey + attrName] = attrs[attrName];
                            }
                        }
                        else {
                            obj[defAttrKey] = attrs;
                        }
                        break;
                    case "#":
                        textId = this._processSpecItem(item["#"], obj, options.group, defTextKey, textCount, textId);
                        break;
                    case "!":
                        commentId = this._processSpecItem(item["!"], obj, options.group, defCommentKey, commentCount, commentId);
                        break;
                    case "?":
                        instructionId = this._processSpecItem(item["?"], obj, options.group, defInstructionKey, instructionCount, instructionId);
                        break;
                    case "$":
                        cdataId = this._processSpecItem(item["$"], obj, options.group, defCdataKey, cdataCount, cdataId);
                        break;
                    default:
                        // element node
                        const ele = item;
                        if (ele[key].length !== 0 && (0, util_1.isArray)(ele[key][0])) {
                            // group of element nodes
                            const eleGroup = [];
                            const listOfLists = ele[key];
                            for (let i = 0; i < listOfLists.length; i++) {
                                eleGroup.push(this._process(listOfLists[i], options));
                            }
                            obj[key] = eleGroup;
                        }
                        else {
                            // single element node
                            if (options.verbose) {
                                obj[key] = [this._process(ele[key], options)];
                            }
                            else {
                                obj[key] = this._process(ele[key], options);
                            }
                        }
                        break;
                }
            }
            return obj;
        }
    }
    _processSpecItem(item, obj, group, defKey, count, id) {
        if (!group && (0, util_1.isArray)(item) && count + item.length > 2) {
            for (const subItem of item) {
                const key = defKey + (id++).toString();
                obj[key] = subItem;
            }
        }
        else {
            const key = count > 1 ? defKey + (id++).toString() : defKey;
            obj[key] = item;
        }
        return id;
    }
    /** @inheritdoc */
    beginElement(name) {
        const childItems = [];
        if (this._currentList.length === 0) {
            this._currentList.push({ [name]: childItems });
        }
        else {
            const lastItem = this._currentList[this._currentList.length - 1];
            if (this._isElementNode(lastItem, name)) {
                if (lastItem[name].length !== 0 && (0, util_1.isArray)(lastItem[name][0])) {
                    const listOfLists = lastItem[name];
                    listOfLists.push(childItems);
                }
                else {
                    lastItem[name] = [lastItem[name], childItems];
                }
            }
            else {
                this._currentList.push({ [name]: childItems });
            }
        }
        this._currentIndex++;
        if (this._listRegister.length > this._currentIndex) {
            this._listRegister[this._currentIndex] = childItems;
        }
        else {
            this._listRegister.push(childItems);
        }
        this._currentList = childItems;
    }
    /** @inheritdoc */
    endElement() {
        this._currentList = this._listRegister[--this._currentIndex];
    }
    /** @inheritdoc */
    attribute(name, value) {
        if (this._currentList.length === 0) {
            this._currentList.push({ "@": { [name]: value } });
        }
        else {
            const lastItem = this._currentList[this._currentList.length - 1];
            /* istanbul ignore else */
            if (this._isAttrNode(lastItem)) {
                lastItem["@"][name] = value;
            }
            else {
                this._currentList.push({ "@": { [name]: value } });
            }
        }
    }
    /** @inheritdoc */
    comment(data) {
        if (this._currentList.length === 0) {
            this._currentList.push({ "!": data });
        }
        else {
            const lastItem = this._currentList[this._currentList.length - 1];
            if (this._isCommentNode(lastItem)) {
                if ((0, util_1.isArray)(lastItem["!"])) {
                    lastItem["!"].push(data);
                }
                else {
                    lastItem["!"] = [lastItem["!"], data];
                }
            }
            else {
                this._currentList.push({ "!": data });
            }
        }
    }
    /** @inheritdoc */
    text(data) {
        if (this._currentList.length === 0) {
            this._currentList.push({ "#": data });
        }
        else {
            const lastItem = this._currentList[this._currentList.length - 1];
            if (this._isTextNode(lastItem)) {
                if ((0, util_1.isArray)(lastItem["#"])) {
                    lastItem["#"].push(data);
                }
                else {
                    lastItem["#"] = [lastItem["#"], data];
                }
            }
            else {
                this._currentList.push({ "#": data });
            }
        }
    }
    /** @inheritdoc */
    instruction(target, data) {
        const value = (data === "" ? target : target + " " + data);
        if (this._currentList.length === 0) {
            this._currentList.push({ "?": value });
        }
        else {
            const lastItem = this._currentList[this._currentList.length - 1];
            if (this._isInstructionNode(lastItem)) {
                if ((0, util_1.isArray)(lastItem["?"])) {
                    lastItem["?"].push(value);
                }
                else {
                    lastItem["?"] = [lastItem["?"], value];
                }
            }
            else {
                this._currentList.push({ "?": value });
            }
        }
    }
    /** @inheritdoc */
    cdata(data) {
        if (this._currentList.length === 0) {
            this._currentList.push({ "$": data });
        }
        else {
            const lastItem = this._currentList[this._currentList.length - 1];
            if (this._isCDATANode(lastItem)) {
                if ((0, util_1.isArray)(lastItem["$"])) {
                    lastItem["$"].push(data);
                }
                else {
                    lastItem["$"] = [lastItem["$"], data];
                }
            }
            else {
                this._currentList.push({ "$": data });
            }
        }
    }
    _isAttrNode(x) {
        return "@" in x;
    }
    _isTextNode(x) {
        return "#" in x;
    }
    _isCommentNode(x) {
        return "!" in x;
    }
    _isInstructionNode(x) {
        return "?" in x;
    }
    _isCDATANode(x) {
        return "$" in x;
    }
    _isElementNode(x, name) {
        return name in x;
    }
    /**
     * Returns an object key for an attribute or namespace declaration.
     */
    _getAttrKey() {
        return this._builderOptions.convert.att;
    }
    /**
     * Returns an object key for the given node type.
     *
     * @param nodeType - node type to get a key for
     */
    _getNodeKey(nodeType) {
        switch (nodeType) {
            case interfaces_1.NodeType.Comment:
                return this._builderOptions.convert.comment;
            case interfaces_1.NodeType.Text:
                return this._builderOptions.convert.text;
            case interfaces_1.NodeType.ProcessingInstruction:
                return this._builderOptions.convert.ins;
            case interfaces_1.NodeType.CData:
                return this._builderOptions.convert.cdata;
            /* istanbul ignore next */
            default:
                throw new Error("Invalid node type.");
        }
    }
}
exports.ObjectWriter = ObjectWriter;
//# sourceMappingURL=ObjectWriter.js.map