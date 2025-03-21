/**
 * TypeScript type definitions for Reflect Metadata
 * This allows us to use Reflect Metadata without requiring a dependency,
 * while still providing TypeScript types for proper type checking.
 */

// Extend the global Reflect object with Reflect Metadata methods
declare namespace Reflect {
  /**
   * Get metadata value for a key from an object or property
   *
   * @param metadataKey - Key for the metadata
   * @param target - Target object
   * @param propertyKey - Optional property key
   */
  function getMetadata(metadataKey: string, target: object, propertyKey?: string | symbol): any;

  /**
   * Define metadata value for a key on an object or property
   *
   * @param metadataKey - Key for the metadata
   * @param metadataValue - Value to store
   * @param target - Target object
   * @param propertyKey - Optional property key
   */
  function defineMetadata(
    metadataKey: string,
    metadataValue: any,
    target: object,
    propertyKey?: string | symbol
  ): void;

  /**
   * Check if metadata exists for a key on an object or property
   *
   * @param metadataKey - Key for the metadata
   * @param target - Target object
   * @param propertyKey - Optional property key
   */
  function hasMetadata(metadataKey: string, target: object, propertyKey?: string | symbol): boolean;

  /**
   * Get all metadata keys from an object or property
   *
   * @param target - Target object
   * @param propertyKey - Optional property key
   */
  function getMetadataKeys(target: object, propertyKey?: string | symbol): string[];
}
