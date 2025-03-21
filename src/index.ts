export { MetadataFactory as Rgstry } from './metadata-factory';

// Re-export type definitions directly
import type { ClassConstructor } from './types/class-constructor.type';
import type { MetadataRegistryConfig } from './types/metadata-registry-config.type';
import type {
  ReflectedClassMetadata,
  ReflectedMethodMetadata,
  EnhancedClassMetadata,
  EnhancedMethodMetadata,
} from './types/reflected-metadata.type';
import type { BaseRegistry, ReflectRegistry, RegistryResult } from './types/registry-result.type';

// Export types
export type {
  ClassConstructor,
  MetadataRegistryConfig,
  ReflectedClassMetadata,
  ReflectedMethodMetadata,
  EnhancedClassMetadata,
  EnhancedMethodMetadata,
  BaseRegistry,
  ReflectRegistry,
  RegistryResult,
};
