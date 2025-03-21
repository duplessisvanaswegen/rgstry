/**
 * Error thrown when operations on metadata registries fail
 *
 * @example
 * ```typescript
 * try {
 *   const registry = RegistryFactory.getRegistry('non-existent-id');
 * } catch (error) {
 *   if (error instanceof MetadataRegistryError) {
 *     console.error('Registry error:', error.message);
 *   }
 * }
 * ```
 */
export class MetadataRegistryError extends Error {
  /**
   * Creates a new MetadataRegistryError
   *
   * @param {string} message - The error message
   */
  constructor(message: string) {
    super(message);
    this.name = 'MetadataRegistryError';
  }
}
