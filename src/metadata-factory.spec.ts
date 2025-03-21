import { MetadataFactory } from './metadata-factory';
import { RegistryFactory } from './registry-factory';

describe('MetadataFactory', () => {
  beforeEach(() => {
    RegistryFactory.registryMap.clear();
  });

  test('should create a registry with a unique ID', () => {
    const factory = MetadataFactory.create();
    expect(factory.registryId).toBeDefined();
    expect(RegistryFactory.getRegistry(factory.registryId)).toBeDefined();
  });

  test('should create a registry with a custom ID', () => {
    const factory = MetadataFactory.create({ id: 'custom-id' });
    expect(factory.registryId).toBe('custom-id');
    expect(RegistryFactory.getRegistry('custom-id')).toBeDefined();
  });

  test('should store class metadata with proper typing', () => {
    interface ClassMetadata {
      role: string;
    }

    const factory = MetadataFactory.create<ClassMetadata>();
    const SecuredClass = factory.classMetadata;

    // Type-safe decorator usage
    @SecuredClass({ role: 'admin' })
    class TestClass {}

    const registry = RegistryFactory.getRegistry(factory.registryId);
    expect(registry.classMetadata.has(TestClass)).toBe(true);
    expect(registry.classMetadata.get(TestClass)).toEqual([{ role: 'admin' }]);
  });

  test('should store method metadata with proper typing', () => {
    interface MethodMetadata {
      role: string;
    }

    const factory = MetadataFactory.create<unknown, MethodMetadata>();
    const SecuredMethod = factory.methodMetadata;

    class TestClass {
      // Type-safe decorator usage
      @SecuredMethod({ role: 'user' })
      testMethod() {}
    }

    const registry = RegistryFactory.getRegistry(factory.registryId);
    expect(registry.methodMetadata.has(TestClass.prototype)).toBe(true);
    expect(registry.methodMetadata.get(TestClass.prototype)?.get('testMethod')).toEqual([
      { role: 'user' },
    ]);
  });

  test('should merge metadata if merge is enabled with proper typing', () => {
    interface ClassMetadata {
      role?: string;
      level?: number;
    }

    interface MethodMetadata {
      role?: string;
      permission?: string;
    }

    const factory = MetadataFactory.create<ClassMetadata, MethodMetadata>({ merge: true });
    const SecuredClass = factory.classMetadata;
    const SecuredMethod = factory.methodMetadata;

    @SecuredClass({ role: 'admin' })
    @SecuredClass({ level: 5 })
    class TestClass {}

    class TestMethods {
      @SecuredMethod({ role: 'user' })
      @SecuredMethod({ permission: 'read' })
      testMethod() {}
    }

    const registry = RegistryFactory.getRegistry(factory.registryId);
    // In TypeScript, decorators are applied bottom-to-top, so the metadata is stored in reverse order
    expect(registry.classMetadata.get(TestClass)).toEqual([{ level: 5 }, { role: 'admin' }]);
    expect(registry.methodMetadata.get(TestMethods.prototype)?.get('testMethod')).toEqual([
      { permission: 'read' },
      { role: 'user' },
    ]);
  });

  test('should replace metadata if merge is disabled with proper typing', () => {
    interface ClassMetadata {
      role?: string;
      level?: number;
    }

    interface MethodMetadata {
      role?: string;
      permission?: string;
    }

    const factory = MetadataFactory.create<ClassMetadata, MethodMetadata>({ merge: false });
    const SecuredClass = factory.classMetadata;
    const SecuredMethod = factory.methodMetadata;

    @SecuredClass({ role: 'admin' })
    @SecuredClass({ level: 5 }) // Should replace the previous metadata
    class TestClass {}

    class TestMethods {
      @SecuredMethod({ role: 'user' })
      @SecuredMethod({ permission: 'read' }) // Should replace previous metadata
      testMethod() {}
    }

    const registry = RegistryFactory.getRegistry(factory.registryId);
    // In TypeScript, decorators are applied bottom-to-top, so the last one we see in code is applied first
    expect(registry.classMetadata.get(TestClass)).toEqual([{ role: 'admin' }]);
    expect(registry.methodMetadata.get(TestMethods.prototype)?.get('testMethod')).toEqual([
      { role: 'user' },
    ]);
  });

  test('should retrieve class metadata via instance', () => {
    interface ClassMetadata {
      role: string;
    }

    const factory = MetadataFactory.create<ClassMetadata>();
    const SecuredClass = factory.classMetadata;
    const getMetadata = factory.getClassMetadata;
    const getInstanceMetadata = factory.getInstanceMetadata;

    @SecuredClass({ role: 'admin' })
    class TestClass {
      property = 'value';
    }

    // Create an instance of the class
    const instance = new TestClass();

    // Verify we can get metadata from the class directly
    const classMetadata = getMetadata(TestClass);
    expect(classMetadata).toEqual([{ role: 'admin' }]);

    // Verify we can get metadata from an instance
    const instanceMetadata = getInstanceMetadata(instance);
    expect(instanceMetadata).toEqual([{ role: 'admin' }]);

    // The metadata from class and instance should be identical
    expect(instanceMetadata).toEqual(classMetadata);
  });

  test('should check if instance has metadata', () => {
    interface ClassMetadata {
      role: string;
    }

    const factory = MetadataFactory.create<ClassMetadata>();
    const SecuredClass = factory.classMetadata;
    const hasClassMeta = factory.hasClassMetadata;
    const hasInstanceMeta = factory.hasInstanceMetadata;

    @SecuredClass({ role: 'admin' })
    class DecoratedClass {}

    class UndecoratedClass {}

    // Create instances
    const decoratedInstance = new DecoratedClass();
    const undecoratedInstance = new UndecoratedClass();

    // Verify class checks work
    expect(hasClassMeta(DecoratedClass)).toBe(true);
    expect(hasClassMeta(UndecoratedClass)).toBe(false);

    // Verify instance checks work
    expect(hasInstanceMeta(decoratedInstance)).toBe(true);
    expect(hasInstanceMeta(undecoratedInstance)).toBe(false);
  });
});
