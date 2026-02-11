export declare class EmptySet<T> {
    get size(): number;
    add(value: T): this;
    clear(): void;
    delete(value: T): boolean;
    forEach(callbackfn: (value: T, value2: T, set: Set<T>) => void, thisArg?: any): void;
    has(value: T): boolean;
    [Symbol.iterator](): EmptySetIterator<T>;
    entries(): EmptySetIterator<[T, T]>;
    keys(): EmptySetIterator<T>;
    values(): EmptySetIterator<T>;
    get [Symbol.toStringTag](): string;
}
declare class EmptySetIterator<T> {
    [Symbol.iterator](): this;
    next(): {
        done: boolean;
        value: null;
    };
}
export {};
