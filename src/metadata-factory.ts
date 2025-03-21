import { RegistryFactory } from './registry-factory';
import { ClassConstructor } from './types/class-constructor.type';
import { MetadataRegistryConfig } from './types/metadata-registry-config.type';
import { EnhancedClassMetadata, EnhancedMethodMetadata } from './types/reflected-metadata.type';
import { RegistryResult } from './types/registry-result.type';

/**
 * Factory for creating type-safe metadata registries to be used with decorators
 */
export class MetadataFactory {
  /**
   * Creates a new metadata registry with class and method decorator factories
   *
   * @template TClassMeta - Type for the class decorator metadata
   * @template TMethodMeta - Type for the method decorator metadata
   * @param {MetadataRegistryConfig} [config={}] - Configuration options for the registry
   * @returns An object containing decorator factories, metadata retrieval methods, and the registry ID
   *
   * @example
   * ```typescript
   * interface AuthMetadata {
   *   role: string;
   *   permissions?: string[];
   * }
   *
   * const auth = MetadataFactory.create<AuthMetadata>();
   *
   * @auth.classMetadata({ role: 'admin' })
   * class AdminController {}
   *
   * // Retrieve metadata
   * const metadata = auth.getClassMetadata(AdminController);
   * ```
   */
  static create<TClassMeta = unknown, TMethodMeta = unknown>(
    config: MetadataRegistryConfig = {}
  ): RegistryResult<TClassMeta, TMethodMeta> {
    const registryId = config.id || `registry-${Math.random().toString(36).substr(2, 9)}`;

    if (!RegistryFactory.registryMap.has(registryId)) {
      RegistryFactory.registryMap.set(registryId, {
        classMetadata: new Map<ClassConstructor, unknown[]>(),
        methodMetadata: new Map<object, Map<string | symbol, unknown[]>>(),
      });
    }

    // Create base registry with standard methods
    const baseRegistry = {
      classMetadata: this.createClassMetadata<TClassMeta>(config, registryId),
      methodMetadata: this.createMethodMetadata<TMethodMeta>(config, registryId),
      getClassMetadata: this.getClassMetadata<TClassMeta>(registryId),
      getInstanceMetadata: this.getInstanceMetadata<TClassMeta>(registryId),
      getMethodMetadata: this.getMethodMetadata<TMethodMeta>(registryId),
      getAllClassMetadata: this.getAllClassMetadata<TClassMeta>(registryId),
      getAllMethodMetadata: this.getAllMethodMetadata<TMethodMeta>(registryId),
      hasClassMetadata: this.hasClassMetadata(registryId),
      hasInstanceMetadata: this.hasInstanceMetadata(registryId),
      hasMethodMetadata: this.hasMethodMetadata(registryId),
      registryId,
    };

    // If user wants to use Reflect Metadata and it's available
    if (config.useReflectMetadata) {
      // Check if Reflect Metadata is available
      const hasReflectMetadata =
        typeof Reflect !== 'undefined' && typeof Reflect.getMetadata === 'function';

      if (!hasReflectMetadata) {
        console.warn(
          'Reflect Metadata is not available, but useReflectMetadata is set to true. ' +
            'Make sure you have installed the "reflect-metadata" package and imported it ' +
            'at the entry point of your application.'
        );
        return baseRegistry;
      }

      // Return enhanced registry with Reflect Metadata capabilities
      return {
        ...baseRegistry,

        // Enhanced class decorator that uses reflection
        reflectClassMetadata: (metadata?: Partial<TClassMeta>) => {
          return function <T extends { new (...args: any[]): any }>(target: T): T {
            // Get parameter types using Reflect Metadata
            const paramTypes = Reflect.getMetadata('design:paramtypes', target) || [];

            // Create enhanced metadata with reflection information
            const enhancedMetadata = {
              ...(metadata as object),
              __reflected: {
                paramTypes,
              },
            } as EnhancedClassMetadata<TClassMeta>;

            // Apply the original decorator
            baseRegistry.classMetadata(enhancedMetadata as TClassMeta)(target);
            return target;
          };
        },

        // Enhanced method decorator that uses reflection
        reflectMethodMetadata: (metadata?: Partial<TMethodMeta>) => {
          return function (
            target: object,
            propertyKey: string | symbol,
            descriptor: TypedPropertyDescriptor<any>
          ): TypedPropertyDescriptor<any> {
            // Get parameter and return types using Reflect Metadata
            const paramTypes = Reflect.getMetadata('design:paramtypes', target, propertyKey) || [];
            const returnType = Reflect.getMetadata('design:returntype', target, propertyKey);

            // Create enhanced metadata with reflection information
            const enhancedMetadata = {
              ...(metadata as object),
              __reflected: {
                paramTypes,
                returnType,
              },
            } as EnhancedMethodMetadata<TMethodMeta>;

            // Apply the original decorator
            baseRegistry.methodMetadata(enhancedMetadata as TMethodMeta)(
              target,
              propertyKey,
              descriptor
            );

            return descriptor;
          };
        },

        // Helper method to get parameter types for a class
        getClassParamTypes: <T>(target: ClassConstructor<T>): any[][] => {
          const metadataList = baseRegistry.getClassMetadata(target);
          return metadataList.map(
            (meta) => (meta as EnhancedClassMetadata<TClassMeta>).__reflected?.paramTypes || []
          );
        },

        // Helper method to get parameter types for a method
        getMethodParamTypes: (target: object, propertyKey: string | symbol): any[][] => {
          const metadataList = baseRegistry.getMethodMetadata(target, propertyKey);
          return metadataList.map(
            (meta) => (meta as EnhancedMethodMetadata<TMethodMeta>).__reflected?.paramTypes || []
          );
        },

        // Helper method to get return type for a method
        getMethodReturnType: (target: object, propertyKey: string | symbol): any[] => {
          const metadataList = baseRegistry.getMethodMetadata(target, propertyKey);
          return metadataList.map(
            (meta) => (meta as EnhancedMethodMetadata<TMethodMeta>).__reflected?.returnType
          );
        },
      };
    }

    // Return standard registry if Reflect Metadata not requested
    return baseRegistry;
  }

  private static createClassMetadata<TMeta>(config: MetadataRegistryConfig, registryId: string) {
    return function (metadata: TMeta) {
      return function <T>(target: ClassConstructor<T>) {
        const registry = RegistryFactory.getRegistry(registryId);
        const classMetadata = registry.classMetadata;

        if (!classMetadata.has(target)) {
          classMetadata.set(target, []);
        }

        const existingMetadata = classMetadata.get(target)!;
        if (existingMetadata.length > 0) {
          if (config.merge) {
            existingMetadata.push(metadata);
          } else {
            classMetadata.set(target, [metadata]);
          }
        } else {
          classMetadata.set(target, [metadata]);
        }
      };
    };
  }

  private static createMethodMetadata<TMeta>(config: MetadataRegistryConfig, registryId: string) {
    return function (metadata: TMeta) {
      return function (
        target: object,
        propertyKey: string | symbol,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
        _descriptor: TypedPropertyDescriptor<any>
      ) {
        const registry = RegistryFactory.getRegistry(registryId);
        const methodMetadata = registry.methodMetadata;

        if (!methodMetadata.has(target)) {
          methodMetadata.set(target, new Map());
        }

        const methods = methodMetadata.get(target)!;
        const existingMetadata = methods.get(propertyKey);

        if (existingMetadata) {
          if (config.merge) {
            existingMetadata.push(metadata);
          } else {
            methods.set(propertyKey, [metadata]);
          }
        } else {
          methods.set(propertyKey, [metadata]);
        }
      };
    };
  }

  /**
   * Creates a function that retrieves metadata for a specific class
   *
   * @template TMeta - Type of the class metadata
   * @param registryId - The ID of the registry to retrieve metadata from
   * @returns A function that takes a class constructor and returns its metadata
   */
  private static getClassMetadata<TMeta>(registryId: string) {
    return function <T>(target: ClassConstructor<T>): TMeta[] {
      const registry = RegistryFactory.getRegistry(registryId);
      return (registry.classMetadata.get(target) || []) as TMeta[];
    };
  }

  /**
   * Creates a function that retrieves metadata for a specific method
   *
   * @template TMeta - Type of the method metadata
   * @param registryId - The ID of the registry to retrieve metadata from
   * @returns A function that takes a prototype and method name and returns its metadata
   */
  private static getMethodMetadata<TMeta>(registryId: string) {
    return function (target: object, propertyKey: string | symbol): TMeta[] {
      const registry = RegistryFactory.getRegistry(registryId);
      const methodMap = registry.methodMetadata.get(target);
      if (!methodMap) return [];
      return (methodMap.get(propertyKey) || []) as TMeta[];
    };
  }

  /**
   * Creates a function that retrieves all class metadata from the registry
   *
   * @template TMeta - Type of the class metadata
   * @param registryId - The ID of the registry to retrieve metadata from
   * @returns A function that returns a map of all class metadata
   */
  private static getAllClassMetadata<TMeta>(registryId: string) {
    return function (): Map<ClassConstructor, TMeta[]> {
      const registry = RegistryFactory.getRegistry(registryId);
      return registry.classMetadata as Map<ClassConstructor, TMeta[]>;
    };
  }

  /**
   * Creates a function that retrieves all method metadata from the registry
   *
   * @template TMeta - Type of the method metadata
   * @param registryId - The ID of the registry to retrieve metadata from
   * @returns A function that returns a map of all method metadata
   */
  private static getAllMethodMetadata<TMeta>(registryId: string) {
    return function (): Map<object, Map<string | symbol, TMeta[]>> {
      const registry = RegistryFactory.getRegistry(registryId);
      return registry.methodMetadata as Map<object, Map<string | symbol, TMeta[]>>;
    };
  }

  /**
   * Creates a function that checks if a class has metadata
   *
   * @param registryId - The ID of the registry to check
   * @returns A function that takes a class constructor and returns a boolean
   */
  private static hasClassMetadata(registryId: string) {
    return function <T>(target: ClassConstructor<T>): boolean {
      const registry = RegistryFactory.getRegistry(registryId);
      const metadata = registry.classMetadata.get(target);
      return !!metadata && metadata.length > 0;
    };
  }

  /**
   * Creates a function that checks if a method has metadata
   *
   * @param registryId - The ID of the registry to check
   * @returns A function that takes a prototype and method name and returns a boolean
   */
  private static hasMethodMetadata(registryId: string) {
    return function (target: object, propertyKey: string | symbol): boolean {
      const registry = RegistryFactory.getRegistry(registryId);
      const methodMap = registry.methodMetadata.get(target);
      if (!methodMap) return false;
      const metadata = methodMap.get(propertyKey);
      return !!metadata && metadata.length > 0;
    };
  }

  /**
   * Creates a function that retrieves metadata for a class instance
   *
   * @template TMeta - Type of the class metadata
   * @param registryId - The ID of the registry to retrieve metadata from
   * @returns A function that takes a class instance and returns its metadata
   */
  private static getInstanceMetadata<TMeta>(registryId: string) {
    return function <T extends object>(instance: T): TMeta[] {
      const registry = RegistryFactory.getRegistry(registryId);
      const constructor = instance.constructor as ClassConstructor;
      return (registry.classMetadata.get(constructor) || []) as TMeta[];
    };
  }

  /**
   * Creates a function that checks if a class instance has metadata
   *
   * @param registryId - The ID of the registry to check
   * @returns A function that takes a class instance and returns a boolean
   */
  private static hasInstanceMetadata(registryId: string) {
    return function <T extends object>(instance: T): boolean {
      const registry = RegistryFactory.getRegistry(registryId);
      const constructor = instance.constructor as ClassConstructor;
      const metadata = registry.classMetadata.get(constructor);
      return !!metadata && metadata.length > 0;
    };
  }
}
