# Release Notes

## v1.0.1 (2025-03-21)

This release focuses on improving the project infrastructure and automation.

### What's New

- **Automated Publishing**: Added GitHub Actions workflow to automatically publish to npm when releases are created
- **Continuous Integration**: Added CI workflow to test PRs and commits to main branch
- **Improved Documentation**: Enhanced examples and documentation structure
- **Issue Templates**: Added templates for bug reports and feature requests

### Technical Improvements

- Fixed npm publishing configuration
- Added GitHub Actions workflows for CI/CD
- Added comprehensive release process documentation

---

## v1.0.0 (2025-03-21)

Initial release of `rgstry`, a type-safe metadata registry library for TypeScript decorators with optional runtime type inference.

### Features

- **Type-safe metadata registration and retrieval**: Create strongly-typed decorators with full TypeScript support
- **Support for both class and method decorators**: Apply metadata at different levels of granularity
- **Metadata access for both class types and class instances**: Retrieve metadata from both constructors and instances
- **Multiple independent registries**: Create separate registries for different concerns
- **Zero dependencies by default**: Core implementation has no external dependencies
- **Configurable metadata merging**: Choose whether to merge or replace existing metadata
- **Advanced type inference**: Optional Reflect Metadata integration for runtime type information
- **ESM and TypeScript support**: Modern module format with comprehensive type definitions

### Getting Started

#### Basic Installation

```bash
npm install rgstry
```

#### With Reflect Metadata (Optional)

```bash
npm install rgstry reflect-metadata
```

And add this to your entry point:

```typescript
import 'reflect-metadata';
```

### Usage Examples

#### Basic Usage

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

// Retrieve metadata
const metadata = auth.getClassMetadata(AdminController);
// [{ role: 'admin', permissions: ['read', 'write'] }]

// Retrieve from instance
const instance = new AdminController();
const instanceMetadata = auth.getInstanceMetadata(instance);
```

#### With Reflect Metadata

```typescript
import 'reflect-metadata';
import { Rgstry, ReflectRegistry } from 'rgstry';

// Create registry with Reflect Metadata enabled
const routes = Rgstry.create<RouteMetadata>({
  useReflectMetadata: true
}) as ReflectRegistry<RouteMetadata, any>;

// Decorator will automatically capture parameter and return types
@routes.reflectMethodMetadata({ path: '/users/:id' })
getUser(id: number): User {
  return this.userService.getUser(id);
}

// Access type information
const paramTypes = routes.getMethodParamTypes(UserController.prototype, 'getUser');
const returnType = routes.getMethodReturnType(UserController.prototype, 'getUser');
```

### Documentation

For more detailed examples and API documentation, please refer to:
- [Basic Usage Guide](./examples/basic-usage.md)
- [Reflect Metadata Guide](./examples/reflect-metadata-example.md)
- [API Documentation](./README.md)