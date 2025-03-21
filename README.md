# rgstry

A type-safe metadata registry library for TypeScript decorators with optional runtime type inference.

## Overview

`rgstry` provides a simple, type-safe way to create and manage metadata registries for TypeScript applications. It's particularly useful for creating decorators that need to store and retrieve metadata from classes and methods, with special support for dependency injection, routing, validation, and other decorator-based systems.

## Features

- Type-safe metadata registration and retrieval
- Support for both class and method decorators
- Metadata access for both class types and class instances
- Multiple independent registries with unique IDs
- Zero dependencies by default
- Configurable metadata merging strategy
- Advanced type inference with optional Reflect Metadata integration
- Runtime parameter and return type detection

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

## Quick Examples

### Basic Usage

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

### With Reflect Metadata (Automatic Type Inference)

```typescript
import 'reflect-metadata';
import { Rgstry, ReflectRegistry } from 'rgstry';

// Create a registry with Reflect Metadata enabled
const routes = Rgstry.create<RouteMetadata>({
  useReflectMetadata: true
}) as ReflectRegistry<RouteMetadata, any>;

// Service for dependency injection demo
class UserService {
  getUser(id: number): User {
    return { id, name: 'John' };
  }
}

// Controller with enhanced decorators that capture type information
class UserController {
  constructor(private userService: UserService) {}

  @routes.reflectMethodMetadata({ path: '/users/:id', method: 'GET' })
  getUser(id: number): User {
    return this.userService.getUser(id);
  }
}

// Get parameter types - automatically detects [Number]
const paramTypes = routes.getMethodParamTypes(UserController.prototype, 'getUser')[0];

// Get return type - automatically detects User
const returnType = routes.getMethodReturnType(UserController.prototype, 'getUser')[0];

// Get constructor parameter types - detects [UserService]
const constructorParams = routes.getClassParamTypes(UserController)[0];
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

## Advanced Features

### Using Type Inference with Reflect Metadata

When you enable Reflect Metadata integration, you gain access to enhanced decorators and type inspection methods:

```typescript
// Create registry with Reflect Metadata enabled
const registry = Rgstry.create({
  useReflectMetadata: true
}) as ReflectRegistry<any, any>;

// Enhanced decorators with type inference
@registry.reflectClassMetadata({ /* your metadata */ })
class MyService {
  @registry.reflectMethodMetadata({ /* your metadata */ })
  myMethod(param1: string, param2: number): boolean {
    return true;
  }
}

// Type inspection methods
registry.getClassParamTypes(MyService);        // Get constructor parameter types
registry.getMethodParamTypes(proto, 'method'); // Get method parameter types
registry.getMethodReturnType(proto, 'method'); // Get method return type
```

This is particularly useful for building:
- Dependency injection containers
- API routing systems
- Validation frameworks
- ORM entity definitions

### Why Two Approaches?

We designed `rgstry` with a core implementation that has zero dependencies, while offering an optional integration with Reflect Metadata for enhanced functionality.

#### Core Implementation (Default)

**Advantages:**
- ✅ Zero dependencies
- ✅ Works in any TypeScript/JavaScript environment
- ✅ No compiler flag requirements
- ✅ Smaller bundle size
- ✅ Explicit metadata (nothing "magical")

#### Reflect Metadata Integration (Optional)

**Advantages:**
- ✅ Automatic type inference at runtime
- ✅ Less boilerplate code
- ✅ Integration with TypeScript's type system
- ✅ Better ecosystem compatibility with NestJS, TypeORM, etc.

We prioritized offering flexibility to users, allowing them to choose the approach that best fits their needs. Both approaches use the same core registry system, so you can mix and match as needed.

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
