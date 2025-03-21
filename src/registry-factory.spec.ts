import { MetadataRegistryError } from './errors/metadata-registry.error';
import { RegistryFactory } from './registry-factory';

describe('RegistryFactory', () => {
  beforeEach(() => {
    // Reset registry map before each test
    RegistryFactory.registryMap.clear();
  });

  test('should store and retrieve a registry by ID', () => {
    const registryId = 'test-registry';
    RegistryFactory.registryMap.set(registryId, {
      classMetadata: new Map(),
      methodMetadata: new Map(),
    });

    const retrievedRegistry = RegistryFactory.getRegistry(registryId);
    expect(retrievedRegistry).toBeDefined();
    expect(retrievedRegistry.classMetadata).toBeInstanceOf(Map);
    expect(retrievedRegistry.methodMetadata).toBeInstanceOf(Map);
  });

  test('should throw an error when retrieving a non-existent registry', () => {
    expect(() => RegistryFactory.getRegistry('non-existent')).toThrow(MetadataRegistryError);
    expect(() => RegistryFactory.getRegistry('non-existent')).toThrow(
      'Registry with ID "non-existent" not found.'
    );
  });
});
