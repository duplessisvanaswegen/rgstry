/**
 * Configuration options for metadata registries
 */
export type MetadataRegistryConfig = {
  /**
   * If true, new metadata will be added to existing metadata.
   * If false, new metadata will replace existing metadata.
   * @default false
   */
  merge?: boolean;

  /**
   * Unique identifier for the registry.
   * If not provided, a random ID will be generated.
   */
  id?: string;

  /**
   * If true and reflect-metadata is available, the registry will use it to enhance
   * type information for decorators. This requires the reflect-metadata package
   * to be installed and imported in your project.
   * @default false
   */
  useReflectMetadata?: boolean;
};
