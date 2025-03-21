/**
 * Metadata collected by Reflect Metadata for a class
 */
export interface ReflectedClassMetadata {
  /**
   * Types of the constructor parameters
   */
  paramTypes: any[];
}

/**
 * Metadata collected by Reflect Metadata for a method
 */
export interface ReflectedMethodMetadata {
  /**
   * Types of the method parameters
   */
  paramTypes: any[];

  /**
   * Return type of the method
   */
  returnType: any;
}

/**
 * Enhanced metadata with reflection information for a class
 */
export type EnhancedClassMetadata<T> = T & {
  __reflected?: ReflectedClassMetadata;
};

/**
 * Enhanced metadata with reflection information for a method
 */
export type EnhancedMethodMetadata<T> = T & {
  __reflected?: ReflectedMethodMetadata;
};
