"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isASCIIByte = isASCIIByte;
/**
 * Determines if the given number is an ASCII byte.
 *
 * @param byte - a byte
 */
function isASCIIByte(byte) {
    /**
     * An ASCII byte is a byte in the range 0x00 (NUL) to 0x7F (DEL), inclusive.
     */
    return byte >= 0x00 && byte <= 0x7F;
}
//# sourceMappingURL=Byte.js.map