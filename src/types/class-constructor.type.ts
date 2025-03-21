/**
 * Represents a class constructor function that can be instantiated with 'new'
 *
 * @template T - The type of the instance that will be created
 */
export type ClassConstructor<T = unknown> = new (...args: any[]) => T;
