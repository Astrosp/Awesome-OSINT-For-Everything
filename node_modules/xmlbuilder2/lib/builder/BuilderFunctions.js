"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.builder = builder;
exports.create = create;
exports.fragment = fragment;
exports.convert = convert;
const interfaces_1 = require("../interfaces");
const util_1 = require("@oozcitak/util");
const util_2 = require("@oozcitak/dom/lib/util");
const _1 = require(".");
const dom_1 = require("../builder/dom");
/** @inheritdoc */
function builder(p1, p2) {
    const options = formatBuilderOptions(isXMLBuilderCreateOptions(p1) ? p1 : interfaces_1.DefaultBuilderOptions);
    const nodes = util_2.Guard.isNode(p1) || (0, util_1.isArray)(p1) ? p1 : p2;
    if (nodes === undefined) {
        throw new Error("Invalid arguments.");
    }
    if ((0, util_1.isArray)(nodes)) {
        const builders = [];
        for (let i = 0; i < nodes.length; i++) {
            const builder = new _1.XMLBuilderImpl(nodes[i]);
            builder.set(options);
            builders.push(builder);
        }
        return builders;
    }
    else {
        const builder = new _1.XMLBuilderImpl(nodes);
        builder.set(options);
        return builder;
    }
}
/** @inheritdoc */
function create(p1, p2) {
    const options = formatBuilderOptions(p1 === undefined || isXMLBuilderCreateOptions(p1) ?
        p1 : interfaces_1.DefaultBuilderOptions);
    const contents = isXMLBuilderCreateOptions(p1) ? p2 : p1;
    const doc = (0, dom_1.createDocument)();
    setOptions(doc, options);
    const builder = new _1.XMLBuilderImpl(doc);
    if (contents !== undefined) {
        // parse contents
        builder.ele(contents);
    }
    return builder;
}
/** @inheritdoc */
function fragment(p1, p2) {
    const options = formatBuilderOptions(p1 === undefined || isXMLBuilderCreateOptions(p1) ?
        p1 : interfaces_1.DefaultBuilderOptions);
    const contents = isXMLBuilderCreateOptions(p1) ? p2 : p1;
    const doc = (0, dom_1.createDocument)();
    setOptions(doc, options, true);
    const builder = new _1.XMLBuilderImpl(doc.createDocumentFragment());
    if (contents !== undefined) {
        // parse contents
        builder.ele(contents);
    }
    return builder;
}
/** @inheritdoc */
function convert(p1, p2, p3) {
    let builderOptions;
    let contents;
    let convertOptions;
    if (isXMLBuilderCreateOptions(p1) && p2 !== undefined) {
        builderOptions = p1;
        contents = p2;
        convertOptions = p3;
    }
    else {
        builderOptions = interfaces_1.DefaultBuilderOptions;
        contents = p1;
        convertOptions = p2 || undefined;
    }
    return create(builderOptions, contents).end(convertOptions);
}
function isXMLBuilderCreateOptions(obj) {
    if (!(0, util_1.isPlainObject)(obj))
        return false;
    for (const key in obj) {
        /* istanbul ignore else */
        if (obj.hasOwnProperty(key)) {
            if (!interfaces_1.XMLBuilderOptionKeys.has(key))
                return false;
        }
    }
    return true;
}
function formatBuilderOptions(createOptions = {}) {
    const options = (0, util_1.applyDefaults)(createOptions, interfaces_1.DefaultBuilderOptions);
    if (options.convert.att.length === 0 ||
        options.convert.ins.length === 0 ||
        options.convert.text.length === 0 ||
        options.convert.cdata.length === 0 ||
        options.convert.comment.length === 0) {
        throw new Error("JS object converter strings cannot be zero length.");
    }
    return options;
}
function setOptions(doc, options, isFragment) {
    const docWithSettings = doc;
    docWithSettings._xmlBuilderOptions = options;
    docWithSettings._isFragment = isFragment;
}
//# sourceMappingURL=BuilderFunctions.js.map