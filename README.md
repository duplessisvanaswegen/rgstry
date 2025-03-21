# rgstry

A type-safe metadata registry library for TypeScript decorators.

## Overview

`rgstry` provides a simple, type-safe way to create and manage metadata registries for TypeScript applications. It's particularly useful for creating decorators that need to store and retrieve metadata from classes and methods.

## Features

- Type-safe metadata registration and retrieval
- Support for both class and method decorators
- Metadata access for both class types and class instances
- Configurable metadata merging strategy
- Multiple independent registries with unique IDs
- Zero dependencies
- Optional Reflect Metadata integration for automatic type inference

## Installation

```bash
npm install rgstry
```

If you want to use the Reflect Metadata integration:

```bash
npm install rgstry reflect-metadata
```

And add this to your entry point (e.g., index.ts):

```typescript
import 'reflect-metadata';
```

Make sure your tsconfig.json has these options enabled:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

## Quick Example

```typescript
import { Rgstry } from 'rgstry';

// Create a type-safe metadata registry
interface AuthMetadata {
  role: string;
  permissions?: string[];
}

const auth = Rgstry.create<AuthMetadata>();

// Use the class decorator
@auth.classMetadata({ role: 'admin', permissions: ['read', 'write'] })
class AdminController {}

// Retrieve metadata from a class
const metadata = auth.getClassMetadata(AdminController);
// [{ role: 'admin', permissions: ['read', 'write'] }]

// Retrieve metadata from a class instance
const instance = new AdminController();
const instanceMetadata = auth.getInstanceMetadata(instance);
// [{ role: 'admin', permissions: ['read', 'write'] }]
```

## Documentation

For more detailed examples and usage information, see:
- [Basic Usage Guide](./examples/basic-usage.md)
- [Reflect Metadata Guide](./examples/reflect-metadata-example.md)

## Configuration Options

```typescript
const auth = Rgstry.create<AuthMetadata>({
  // Unique ID for the registry (auto-generated if not provided)
  id: 'auth-registry',
  
  // Whether to merge new metadata with existing metadata (default: false)
  merge: true,
  
  // Whether to use Reflect Metadata for type inference (default: false)
  // Requires reflect-metadata package to be installed and imported
  useReflectMetadata: false,
});
```

## Design Choices

### Core Implementation vs. Reflect Metadata

We designed `rgstry` with a core implementation that has zero dependencies, while offering an optional integration with Reflect Metadata for enhanced functionality.

#### Core Implementation (Default)

**Advantages:**
- ✅ Zero dependencies
- ✅ Works in any TypeScript/JavaScript environment
- ✅ No compiler flag requirements (`emitDecoratorMetadata`)
- ✅ Smaller bundle size
- ✅ Complete control over implementation
- ✅ Explicit metadata (nothing "magical")

**Disadvantages:**
- ❌ No automatic type inference
- ❌ Not using the proposed ECMAScript standard
- ❌ Manual implementation of storage

#### Reflect Metadata Integration (Optional)

**Advantages:**
- ✅ Uses a proposed ECMAScript standard API
- ✅ TypeScript has built-in support via compiler options
- ✅ Can automatically capture parameter/return types
- ✅ Better ecosystem compatibility with NestJS, TypeORM, etc.
- ✅ Potentially more optimized

**Disadvantages:**
- ❌ Additional dependency required
- ❌ Requires specific TypeScript compiler settings
- ❌ Slightly larger bundle size
- ❌ Less control over implementation details

We prioritized offering flexibility to users, allowing them to choose the approach that best fits their needs. By default, `rgstry` works with zero dependencies, but you can opt into Reflect Metadata integration when you need automatic type inference.

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

## License

ISC
