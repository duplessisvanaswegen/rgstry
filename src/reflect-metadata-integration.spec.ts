import { MetadataFactory } from './metadata-factory';
import { ReflectRegistry } from './types/registry-result.type';

describe('MetadataFactory with Reflect Metadata', () => {
  // Helper to mock Reflect.getMetadata for testing
  const setupReflectMetadataMock = () => {
    const originalGlobal = global as any;
    const originalReflect = originalGlobal.Reflect;

    // Create a mock Reflect if it doesn't exist
    if (!originalGlobal.Reflect) {
      originalGlobal.Reflect = {};
    }

    // Mock the getMetadata method
    originalGlobal.Reflect.getMetadata = jest.fn((key, target, propertyKey) => {
      if (key === 'design:paramtypes') {
        if (propertyKey) {
          // For methods, return mock parameter types
          return [String, Number];
        } else {
          // For classes, return mock constructor parameter types
          return [Object, String];
        }
      }
      if (key === 'design:returntype') {
        // Return mock return type
        return Boolean;
      }
      return undefined;
    });

    // Return cleanup function
    return () => {
      if (originalReflect) {
        originalGlobal.Reflect = originalReflect;
      } else {
        delete originalGlobal.Reflect;
      }
    };
  };

  describe('with mocked Reflect Metadata', () => {
    let cleanup: () => void;

    beforeEach(() => {
      // Setup mock before each test
      cleanup = setupReflectMetadataMock();
    });

    afterEach(() => {
      // Cleanup mock after each test
      if (cleanup) cleanup();
      jest.restoreAllMocks();
    });

    test('should create enhanced registry when useReflectMetadata is true', () => {
      const registry = MetadataFactory.create({ useReflectMetadata: true }) as ReflectRegistry<
        any,
        any
      >;
      expect(registry.reflectClassMetadata).toBeDefined();
      expect(registry.reflectMethodMetadata).toBeDefined();
      expect(registry.getClassParamTypes).toBeDefined();
      expect(registry.getMethodParamTypes).toBeDefined();
      expect(registry.getMethodReturnType).toBeDefined();
    });

    test('should return base registry when useReflectMetadata is false', () => {
      const registry = MetadataFactory.create({ useReflectMetadata: false });

      // Check if registry has reflect-specific methods (using hasOwnProperty for runtime check)
      expect((registry as any).reflectClassMetadata).toBeUndefined();
      expect((registry as any).reflectMethodMetadata).toBeUndefined();
      expect((registry as any).getClassParamTypes).toBeUndefined();
    });

    test('should capture parameter types from class decorator', () => {
      const registry = MetadataFactory.create<any>({ useReflectMetadata: true }) as ReflectRegistry<
        any,
        any
      >;

      @registry.reflectClassMetadata({ role: 'admin' })
      class TestClass {
        constructor(obj: object, name: string) {}
      }

      // Verify Reflect.getMetadata was called
      expect(Reflect.getMetadata).toHaveBeenCalledWith('design:paramtypes', TestClass);

      // Get the parameter types
      const paramTypes = registry.getClassParamTypes(TestClass)[0];
      expect(paramTypes).toEqual([Object, String]);
    });

    test('should capture parameter types from method decorator', () => {
      const registry = MetadataFactory.create<any, any>({
        useReflectMetadata: true,
      }) as ReflectRegistry<any, any>;

      class TestClass {
        @registry.reflectMethodMetadata({ permission: 'read' })
        testMethod(name: string, count: number): boolean {
          return true;
        }
      }

      // Get the parameter types
      const paramTypes = registry.getMethodParamTypes(TestClass.prototype, 'testMethod')[0];
      expect(paramTypes).toEqual([String, Number]);

      // Get the return type
      const returnType = registry.getMethodReturnType(TestClass.prototype, 'testMethod')[0];
      expect(returnType).toBe(Boolean);
    });

    test('should store metadata alongside reflection information', () => {
      const registry = MetadataFactory.create<any, any>({
        useReflectMetadata: true,
      }) as ReflectRegistry<any, any>;

      class TestClass {
        @registry.reflectMethodMetadata({ permission: 'write' })
        writeMethod(): void {}
      }

      // Get the original metadata
      const metadata = registry.getMethodMetadata(TestClass.prototype, 'writeMethod')[0];
      expect(metadata.permission).toBe('write');

      // Reflection data should be stored in __reflected property
      expect(metadata.__reflected).toBeDefined();
      expect(metadata.__reflected.paramTypes).toEqual([String, Number]);
      expect(metadata.__reflected.returnType).toBe(Boolean);
    });
  });
});
