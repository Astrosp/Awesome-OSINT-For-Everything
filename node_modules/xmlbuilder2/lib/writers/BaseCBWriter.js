"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseCBWriter = void 0;
/**
 * Pre-serializes XML nodes.
 */
class BaseCBWriter {
    _builderOptions;
    _writerOptions;
    /**
     * Gets the current depth of the XML tree.
     */
    level = 0;
    /**
     * Determines whether any data has been written.
     */
    hasData;
    /**
     * Initializes a new instance of `BaseCBWriter`.
     *
     * @param builderOptions - XML builder options
     */
    constructor(builderOptions) {
        this._builderOptions = builderOptions;
        this._writerOptions = builderOptions;
    }
}
exports.BaseCBWriter = BaseCBWriter;
//# sourceMappingURL=BaseCBWriter.js.map