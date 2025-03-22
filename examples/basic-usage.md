# Basic Usage of rgstry

This guide demonstrates how to use `rgstry` for creating type-safe metadata registries.

## Creating a Registry

First, we'll create a basic string metadata registry for adding a label to classes:

```typescript
import { Rgstry } from 'rgstry';

// Create a registry for string metadata
const LabelRegistry = Rgstry.create<string>({
  id: 'label-registry',
});

// Deconstruct the decorators and helper methods
const {
  // Decorators
  classMetadata,

  // Metadata helper methods
  getClassMetadata,
  getInstanceMetadata,
  hasClassMetadata,
  hasInstanceMetadata,
  getAllClassMetadata,
} = LabelRegistry;

// Export a nicely named decorator
export const Label = classMetadata;
```

## Setting Up Helper Functions

For better readability, we can rename the methods to match our use case:

```typescript
/**
 * Retrieves metadata for a class decorated with @Label
 */
export const getLabelMetadata = getClassMetadata;

/**
 * Retrieves metadata for an instance of a class decorated with @Label
 */
export const getLabelInstanceMetadata = getInstanceMetadata;

/**
 * Checks if a class has Label metadata
 */
export const hasLabelMetadata = hasClassMetadata;

/**
 * Checks if an instance has Label metadata
 */
export const hasLabelInstanceMetadata = hasInstanceMetadata;

/**
 * Gets all class metadata from the Label registry
 */
export const getAllLabelMetadata = getAllClassMetadata;
```

## Applying Decorators

Now we can use our decorator to tag classes with metadata:

```typescript
import { Label } from './your-registry-file';

@Label('test-1')
export class Test1 {
  test = 1;
}

@Label('test-2')
export class Test2 {
  test = 2;
}
```

## Retrieving Metadata

### From Class Types

```typescript
import { getLabelMetadata } from './your-registry-file';
import { Test1, Test2 } from './your-classes-file';

// Get metadata directly from class types
const meta1 = getLabelMetadata(Test1); // ['test-1']
const meta2 = getLabelMetadata(Test2); // ['test-2']

console.log('Class metadata for Test1:', meta1);
```

### From Class Instances

```typescript
import { getLabelInstanceMetadata } from './your-registry-file';
import { Test1, Test2 } from './your-classes-file';

// Create instances
const instance1 = new Test1();
const instance2 = new Test2();

// Get metadata from instances
const instanceMeta1 = getLabelInstanceMetadata(instance1); // ['test-1']
const instanceMeta2 = getLabelInstanceMetadata(instance2); // ['test-2']

console.log('Instance metadata for instance1:', instanceMeta1);
```

## Checking for Metadata

You can check if a class or instance has metadata:

```typescript
import { hasLabelMetadata, hasLabelInstanceMetadata } from './your-registry-file';

// Check classes
const hasTest1Meta = hasLabelMetadata(Test1); // true
const hasOtherClassMeta = hasLabelMetadata(SomeUndecoratedClass); // false

// Check instances
const hasInstance1Meta = hasLabelInstanceMetadata(instance1); // true
const hasOtherInstanceMeta = hasLabelInstanceMetadata(new SomeUndecoratedClass()); // false
```

## Getting All Metadata

To get all metadata in the registry:

```typescript
import { getAllLabelMetadata } from './your-registry-file';

// Get a map of all registered classes and their metadata
const allMetadata = getAllLabelMetadata();

// Iterate through all registered classes
for (const [classConstructor, metadata] of allMetadata.entries()) {
  console.log(`Class: ${classConstructor.name}, Metadata: ${JSON.stringify(metadata)}`);
}
```
