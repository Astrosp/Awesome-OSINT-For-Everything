export { FixedSizeSet } from './FixedSizeSet.js';
export { ObjectCache } from './ObjectCache.js';
export { CompareCache } from './CompareCache.js';
export { Lazy } from './Lazy.js';
export { StringWalker } from './StringWalker.js';
/**
 * Applies the mixin to a given class.
 *
 * @param baseClass - class to receive the mixin
 * @param mixinClass - mixin class
 * @param overrides - an array with names of function overrides. Base class
 * functions whose names are in this array will be kept by prepending an
 * underscore to their names.
 */
export declare function applyMixin(baseClass: any, mixinClass: any, ...overrides: string[]): void;
/**
 * Applies default values to the given object.
 *
 * @param obj - an object
 * @param defaults - an object with default values
 * @param overwrite - if set to `true` defaults object always overwrites object
 * values, whether they are `undefined` or not.
 */
export declare function applyDefaults(obj: {
    [key: string]: unknown;
} | undefined, defaults: {
    [key: string]: any;
}, overwrite?: boolean): any;
/**
 * Iterates over items of an array or set.
 *
 * @param arr - array or set to iterate
 * @param callback - a callback function which receives each array item as its
 * single argument
 * @param thisArg - the value of this inside callback
 */
export declare function forEachArray<T>(arr: Array<T> | Set<T>, callback: ((item: T) => void), thisArg?: any): void;
/**
 * Iterates over key/value pairs of a map or object.
 *
 * @param obj - map or object to iterate
 * @param callback - a callback function which receives object key as its first
 * argument and object value as its second argument
 * @param thisArg - the value of this inside callback
 */
export declare function forEachObject<T>(obj: Map<string, T> | {
    [key: string]: T;
}, callback: ((key: string, item: T) => void), thisArg?: any): void;
/**
 * Returns the number of entries in an array or set.
 *
 * @param arr - array or set
 */
export declare function arrayLength<T = unknown>(obj: T[] | Set<T>): number;
/**
 * Returns the number of entries in a map or object.
 *
 * @param obj - map or object
 */
export declare function objectLength(obj: Map<string, any> | {
    [key: string]: any;
}): number;
/**
 * Gets the value of a key from a map or object.
 *
 * @param obj - map or object
 * @param key - the key to retrieve
 */
export declare function getObjectValue<T>(obj: Map<string, T> | {
    [key: string]: T;
}, key: string): T | undefined;
/**
 * Removes a property from a map or object.
 *
 * @param obj - map or object
 * @param key - the key to remove
 */
export declare function removeObjectValue<T>(obj: Map<string, T> | {
    [key: string]: T;
}, key: string): void;
/**
 * Deep clones the given object.
 *
 * @param obj - an object
 */
export declare function clone<T extends string | number | boolean | null | undefined | unknown | Function | any[] | {
    [key: string]: unknown;
}>(obj: T): any;
/**
 * Type guard for boolean types
 *
 * @param x - a variable to type check
 */
export declare function isBoolean(x: any): x is boolean;
/**
 * Type guard for numeric types
 *
 * @param x - a variable to type check
 */
export declare function isNumber(x: any): x is number;
/**
 * Type guard for strings
 *
 * @param x - a variable to type check
 */
export declare function isString(x: any): x is string;
/**
 * Type guard for function objects
 *
 * @param x - a variable to type check
 */
export declare function isFunction<T = unknown>(x: any): x is ((...args: any[]) => T);
/**
 * Type guard for JS objects
 *
 * _Note:_ Functions are objects too
 *
 * @param x - a variable to type check
 */
export declare function isObject<T = unknown>(x: any): x is ({
    [key: string]: T;
});
/**
 * Type guard for arrays
 *
 * @param x - a variable to type check
 */
export declare function isArray<T = unknown>(x: any): x is T[];
/**
 * Type guard for sets.
 *
 * @param x - a variable to check
 */
export declare function isSet<T = unknown>(x: any): x is Set<T>;
/**
 * Type guard for maps.
 *
 * @param x - a variable to check
 */
export declare function isMap<T = unknown>(x: any): x is Map<string, T>;
/**
 * Determines if `x` is an empty Array or an Object with no own properties.
 *
 * @param x - a variable to check
 */
export declare function isEmpty(x: any): boolean;
/**
 * Determines if `x` is a plain Object.
 *
 * @param x - a variable to check
 */
export declare function isPlainObject<T = unknown>(x: any): x is ({
    [key: string]: T;
});
/**
 * Determines if `x` is an iterable Object.
 *
 * @param x - a variable to check
 */
export declare function isIterable<T = unknown>(x: any): Iterable<T>;
/**
 * Gets the primitive value of an object.
 */
export declare function getValue(obj: any): any;
/**
 * UTF-8 encodes the given string.
 *
 * @param input - a string
 */
export declare function utf8Encode(input: string): Uint8Array<ArrayBuffer>;
/**
 * UTF-8 decodes the given byte sequence into a string.
 *
 * @param bytes - a byte sequence
 */
export declare function utf8Decode(bytes: Uint8Array): string;
