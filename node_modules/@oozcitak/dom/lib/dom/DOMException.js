"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidCharacterError = exports.SyntaxError = exports.IndexSizeError = exports.NotFoundError = exports.HierarchyRequestError = exports.NotImplementedError = exports.DataCloneError = exports.InvalidNodeTypeError = exports.TimeoutError = exports.QuotaExceededError = exports.URLMismatchError = exports.AbortError = exports.NetworkError = exports.SecurityError = exports.TypeMismatchError = exports.ValidationError = exports.InvalidAccessError = exports.NamespaceError = exports.InvalidModificationError = exports.InvalidStateError = exports.InUseAttributeError = exports.NotSupportedError = exports.NoModificationAllowedError = exports.NoDataAllowedError = exports.WrongDocumentError = exports.DOMStringSizeError = exports.DOMException = void 0;
/**
 * Represents the base class of `Error` objects used by this module.
 */
class DOMException extends Error {
    /**
     * Returns the name of the error message.
     */
    name;
    /**
     *
     * @param name - message name
     * @param message - error message
     */
    constructor(name, message = "") {
        super(message);
        this.name = name;
    }
}
exports.DOMException = DOMException;
class DOMStringSizeError extends DOMException {
    /**
    * @param message - error message
    */
    constructor(message = "") {
        super("DOMStringSizeError", message);
    }
}
exports.DOMStringSizeError = DOMStringSizeError;
class WrongDocumentError extends DOMException {
    /**
    * @param message - error message
    */
    constructor(message = "") {
        super("WrongDocumentError", "The object is in the wrong document. " + message);
    }
}
exports.WrongDocumentError = WrongDocumentError;
class NoDataAllowedError extends DOMException {
    /**
    * @param message - error message
    */
    constructor(message = "") {
        super("NoDataAllowedError", message);
    }
}
exports.NoDataAllowedError = NoDataAllowedError;
class NoModificationAllowedError extends DOMException {
    /**
    * @param message - error message
    */
    constructor(message = "") {
        super("NoModificationAllowedError", "The object can not be modified. " + message);
    }
}
exports.NoModificationAllowedError = NoModificationAllowedError;
class NotSupportedError extends DOMException {
    /**
    * @param message - error message
    */
    constructor(message = "") {
        super("NotSupportedError", "The operation is not supported. " + message);
    }
}
exports.NotSupportedError = NotSupportedError;
class InUseAttributeError extends DOMException {
    /**
    * @param message - error message
    */
    constructor(message = "") {
        super("InUseAttributeError", message);
    }
}
exports.InUseAttributeError = InUseAttributeError;
class InvalidStateError extends DOMException {
    /**
    * @param message - error message
    */
    constructor(message = "") {
        super("InvalidStateError", "The object is in an invalid state. " + message);
    }
}
exports.InvalidStateError = InvalidStateError;
class InvalidModificationError extends DOMException {
    /**
    * @param message - error message
    */
    constructor(message = "") {
        super("InvalidModificationError", "The object can not be modified in this way. " + message);
    }
}
exports.InvalidModificationError = InvalidModificationError;
class NamespaceError extends DOMException {
    /**
    * @param message - error message
    */
    constructor(message = "") {
        super("NamespaceError", "The operation is not allowed by Namespaces in XML. [XMLNS] " + message);
    }
}
exports.NamespaceError = NamespaceError;
class InvalidAccessError extends DOMException {
    /**
    * @param message - error message
    */
    constructor(message = "") {
        super("InvalidAccessError", "The object does not support the operation or argument. " + message);
    }
}
exports.InvalidAccessError = InvalidAccessError;
class ValidationError extends DOMException {
    /**
    * @param message - error message
    */
    constructor(message = "") {
        super("ValidationError", message);
    }
}
exports.ValidationError = ValidationError;
class TypeMismatchError extends DOMException {
    /**
    * @param message - error message
    */
    constructor(message = "") {
        super("TypeMismatchError", message);
    }
}
exports.TypeMismatchError = TypeMismatchError;
class SecurityError extends DOMException {
    /**
    * @param message - error message
    */
    constructor(message = "") {
        super("SecurityError", "The operation is insecure. " + message);
    }
}
exports.SecurityError = SecurityError;
class NetworkError extends DOMException {
    /**
    * @param message - error message
    */
    constructor(message = "") {
        super("NetworkError", "A network error occurred. " + message);
    }
}
exports.NetworkError = NetworkError;
class AbortError extends DOMException {
    /**
    * @param message - error message
    */
    constructor(message = "") {
        super("AbortError", "The operation was aborted. " + message);
    }
}
exports.AbortError = AbortError;
class URLMismatchError extends DOMException {
    /**
    * @param message - error message
    */
    constructor(message = "") {
        super("URLMismatchError", "The given URL does not match another URL. " + message);
    }
}
exports.URLMismatchError = URLMismatchError;
class QuotaExceededError extends DOMException {
    /**
    * @param message - error message
    */
    constructor(message = "") {
        super("QuotaExceededError", "The quota has been exceeded. " + message);
    }
}
exports.QuotaExceededError = QuotaExceededError;
class TimeoutError extends DOMException {
    /**
    * @param message - error message
    */
    constructor(message = "") {
        super("TimeoutError", "The operation timed out. " + message);
    }
}
exports.TimeoutError = TimeoutError;
class InvalidNodeTypeError extends DOMException {
    /**
    * @param message - error message
    */
    constructor(message = "") {
        super("InvalidNodeTypeError", "The supplied node is incorrect or has an incorrect ancestor for this operation. " + message);
    }
}
exports.InvalidNodeTypeError = InvalidNodeTypeError;
class DataCloneError extends DOMException {
    /**
    * @param message - error message
    */
    constructor(message = "") {
        super("DataCloneError", "The object can not be cloned. " + message);
    }
}
exports.DataCloneError = DataCloneError;
class NotImplementedError extends DOMException {
    /**
    * @param message - error message
    */
    constructor(message = "") {
        super("NotImplementedError", "The DOM method is not implemented by this module. " + message);
    }
}
exports.NotImplementedError = NotImplementedError;
class HierarchyRequestError extends DOMException {
    /**
     * @param message - error message
     */
    constructor(message = "") {
        super("HierarchyRequestError", "The operation would yield an incorrect node tree. " + message);
    }
}
exports.HierarchyRequestError = HierarchyRequestError;
class NotFoundError extends DOMException {
    /**
     * @param message - error message
     */
    constructor(message = "") {
        super("NotFoundError", "The object can not be found here. " + message);
    }
}
exports.NotFoundError = NotFoundError;
class IndexSizeError extends DOMException {
    /**
     * @param message - error message
     */
    constructor(message = "") {
        super("IndexSizeError", "The index is not in the allowed range. " + message);
    }
}
exports.IndexSizeError = IndexSizeError;
class SyntaxError extends DOMException {
    /**
     * @param message - error message
     */
    constructor(message = "") {
        super("SyntaxError", "The string did not match the expected pattern. " + message);
    }
}
exports.SyntaxError = SyntaxError;
class InvalidCharacterError extends DOMException {
    /**
     * @param message - error message
     */
    constructor(message = "") {
        super("InvalidCharacterError", "The string contains invalid characters. " + message);
    }
}
exports.InvalidCharacterError = InvalidCharacterError;
//# sourceMappingURL=DOMException.js.map