# Basic Usage of rgstry

This guide demonstrates how to use `rgstry` for creating type-safe metadata registries.

## Creating a Registry

First, we'll create a basic string metadata registry:

```typescript
import { Rgstry } from 'rgstry';

// Create a registry with a unique ID
const BASIC_REGISTRY_ID = 'BASIC_REGISTRY_ID';

// Create a registry for string metadata
const {
  // Decorators
  classMetadata,
  
  // Metadata retrieval methods
  getClassMetadata,
  getInstanceMetadata,
  hasClassMetadata,
  hasInstanceMetadata,
  getAllClassMetadata,
} = Rgstry.create<string>({
  id: BASIC_REGISTRY_ID,
  merge: false, // Don't merge multiple decorators, replace instead
});

// Export a nicely named decorator
export const Basic = classMetadata;
```

## Setting Up Helper Functions

For better readability, we can rename the methods to match our use case:

```typescript
/**
 * Retrieves metadata for a class decorated with @Basic
 */
export const getBasicMetadata = getClassMetadata;

/**
 * Retrieves metadata for an instance of a class decorated with @Basic
 */
export const getBasicInstanceMetadata = getInstanceMetadata;

/**
 * Checks if a class has Basic metadata
 */
export const hasBasicMetadata = hasClassMetadata;

/**
 * Checks if an instance has Basic metadata
 */
export const hasBasicInstanceMetadata = hasInstanceMetadata;

/**
 * Gets all class metadata from the Basic registry
 */
export const getAllBasicMetadata = getAllClassMetadata;
```

## Applying Decorators

Now we can use our decorator to tag classes with metadata:

```typescript
import { Basic } from './your-registry-file';

@Basic('test-1')
export class Test1 {
  test = 1;
}

@Basic('test-2')
export class Test2 {
  test = 2;
}
```

## Retrieving Metadata

### From Class Types

```typescript
import { getBasicMetadata } from './your-registry-file';
import { Test1, Test2 } from './your-classes-file';

// Get metadata directly from class types
const meta1 = getBasicMetadata(Test1); // ['test-1']
const meta2 = getBasicMetadata(Test2); // ['test-2']

console.log('Class metadata for Test1:', meta1);
```

### From Class Instances

```typescript
import { getBasicInstanceMetadata } from './your-registry-file';
import { Test1, Test2 } from './your-classes-file';

// Create instances
const instance1 = new Test1();
const instance2 = new Test2();

// Get metadata from instances
const instanceMeta1 = getBasicInstanceMetadata(instance1); // ['test-1']
const instanceMeta2 = getBasicInstanceMetadata(instance2); // ['test-2']

console.log('Instance metadata for instance1:', instanceMeta1);
```

## Checking for Metadata

You can check if a class or instance has metadata:

```typescript
import { hasBasicMetadata, hasBasicInstanceMetadata } from './your-registry-file';

// Check classes
const hasTest1Meta = hasBasicMetadata(Test1); // true
const hasOtherClassMeta = hasBasicMetadata(SomeUndecoratedClass); // false

// Check instances
const hasInstance1Meta = hasBasicInstanceMetadata(instance1); // true
const hasOtherInstanceMeta = hasBasicInstanceMetadata(new SomeUndecoratedClass()); // false
```

## Getting All Metadata

To get all metadata in the registry:

```typescript
import { getAllBasicMetadata } from './your-registry-file';

// Get a map of all registered classes and their metadata
const allMetadata = getAllBasicMetadata();

// Iterate through all registered classes
for (const [classConstructor, metadata] of allMetadata.entries()) {
  console.log(`Class: ${classConstructor.name}, Metadata: ${JSON.stringify(metadata)}`);
}
```

## Complete Example

Here's a complete example demonstrating all the features above:

```typescript
import { Rgstry } from 'rgstry';

// Create registry
const { 
  classMetadata: Basic,
  getClassMetadata,
  getInstanceMetadata,
  hasClassMetadata,
  hasInstanceMetadata,
  getAllClassMetadata 
} = Rgstry.create<string>({ id: 'example-registry' });

// Decorate classes
@Basic('admin')
class AdminUser {
  name = 'Admin';
}

@Basic('regular')
class RegularUser {
  name = 'User';
}

class GuestUser {
  name = 'Guest';
}

// Create instances
const admin = new AdminUser();
const user = new RegularUser();
const guest = new GuestUser();

// Retrieve metadata from classes
console.log('Admin class metadata:', getClassMetadata(AdminUser));  // ['admin']
console.log('Regular class metadata:', getClassMetadata(RegularUser));  // ['regular']
console.log('Guest class metadata:', getClassMetadata(GuestUser));  // []

// Retrieve metadata from instances
console.log('Admin instance metadata:', getInstanceMetadata(admin));  // ['admin']
console.log('Regular instance metadata:', getInstanceMetadata(user));  // ['regular']
console.log('Guest instance metadata:', getInstanceMetadata(guest));  // []

// Check for metadata
console.log('Has admin class metadata:', hasClassMetadata(AdminUser));  // true
console.log('Has admin instance metadata:', hasInstanceMetadata(admin));  // true
console.log('Has guest class metadata:', hasClassMetadata(GuestUser));  // false
console.log('Has guest instance metadata:', hasInstanceMetadata(guest));  // false

// Get all metadata
const allMetadata = getAllClassMetadata();
console.log('Number of registered classes:', allMetadata.size);  // 2
```