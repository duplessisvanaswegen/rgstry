import { ClassConstructor } from './class-constructor.type';
import { EnhancedClassMetadata, EnhancedMethodMetadata } from './reflected-metadata.type';

/**
 * Base registry interface with standard methods
 */
export interface BaseRegistry<TClassMeta, TMethodMeta> {
  /** Class decorator factory */
  classMetadata: (metadata: TClassMeta) => <T>(target: ClassConstructor<T>) => void;

  /** Method decorator factory */
  methodMetadata: (
    metadata: TMethodMeta
  ) => (
    target: object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ) => void;

  /** Get metadata for a class */
  getClassMetadata: <T>(target: ClassConstructor<T>) => TClassMeta[];

  /** Get metadata for a class instance */
  getInstanceMetadata: <T extends object>(instance: T) => TClassMeta[];

  /** Get metadata for a method */
  getMethodMetadata: (target: object, propertyKey: string | symbol) => TMethodMeta[];

  /** Get all class metadata */
  getAllClassMetadata: () => Map<ClassConstructor, TClassMeta[]>;

  /** Get all method metadata */
  getAllMethodMetadata: () => Map<object, Map<string | symbol, TMethodMeta[]>>;

  /** Check if a class has metadata */
  hasClassMetadata: <T>(target: ClassConstructor<T>) => boolean;

  /** Check if a class instance has metadata */
  hasInstanceMetadata: <T extends object>(instance: T) => boolean;

  /** Check if a method has metadata */
  hasMethodMetadata: (target: object, propertyKey: string | symbol) => boolean;

  /** Registry unique ID */
  registryId: string;
}

/**
 * Extended registry with Reflect Metadata support
 */
export interface ReflectRegistry<TClassMeta, TMethodMeta>
  extends BaseRegistry<TClassMeta, TMethodMeta> {
  /** Class decorator factory with reflection */
  reflectClassMetadata: (
    metadata?: Partial<TClassMeta>
  ) => <T extends { new (...args: any[]): any }>(target: T) => T;

  /** Method decorator factory with reflection */
  reflectMethodMetadata: (
    metadata?: Partial<TMethodMeta>
  ) => (
    target: object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ) => TypedPropertyDescriptor<any>;

  /** Get parameter types for a class constructor */
  getClassParamTypes: <T>(target: ClassConstructor<T>) => any[][];

  /** Get parameter types for a method */
  getMethodParamTypes: (target: object, propertyKey: string | symbol) => any[][];

  /** Get return type for a method */
  getMethodReturnType: (target: object, propertyKey: string | symbol) => any[];
}

/**
 * Registry result type that can be either a base registry or a reflect-enhanced registry
 */
export type RegistryResult<TClassMeta, TMethodMeta> =
  | BaseRegistry<TClassMeta, TMethodMeta>
  | ReflectRegistry<TClassMeta, TMethodMeta>;
