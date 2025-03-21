import { MetadataRegistryError } from './errors/metadata-registry.error';
import { ClassConstructor } from './types/class-constructor.type';

/**
 * Factory for managing metadata registries
 * @internal This class is primarily used internally by MetadataFactory
 */
export class RegistryFactory {
  /**
   * Global registry map storing all metadata registries
   * @internal
   */
  static registryMap = new Map<
    string,
    {
      classMetadata: Map<ClassConstructor, unknown[]>;
      methodMetadata: Map<object, Map<string | symbol, unknown[]>>;
    }
  >();

  /**
   * Retrieves a registry by its ID
   *
   * @param {string} id - The unique identifier for the registry
   * @throws {MetadataRegistryError} If the registry with the given ID is not found
   * @returns The registry object containing class and method metadata
   */
  static getRegistry(id: string) {
    const registry = this.registryMap.get(id);
    if (!registry) {
      throw new MetadataRegistryError(`Registry with ID "${id}" not found.`);
    }
    return registry;
  }
}
