# Using rgstry with Reflect Metadata

This example demonstrates how to use `rgstry` with Reflect Metadata to automatically collect type information.

## Setup

First, install the `reflect-metadata` package:

```bash
npm install reflect-metadata
```

Then import it at the entry point of your application (e.g., `index.ts`):

```typescript
import 'reflect-metadata';
```

Make sure your `tsconfig.json` has the following options enabled:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

## Creating a Registry with Reflect Metadata

```typescript
import { Rgstry, ReflectRegistry } from 'rgstry';

// Define your metadata type
interface RouteMetadata {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  roles?: string[];
}

// Create registry with Reflect Metadata enabled
const registry = Rgstry.create<RouteMetadata>({
  id: 'routes',
  useReflectMetadata: true
}) as ReflectRegistry<RouteMetadata, any>;
```

## Using Enhanced Decorators

```typescript
// Service class for dependency injection
class UserService {
  getUser(id: number): User {
    return { id, name: 'John Doe' };
  }
}

// Controller class with route decorator
class UserController {
  constructor(private userService: UserService) {}

  @registry.reflectMethodMetadata({
    path: '/users/:id',
    method: 'GET',
    roles: ['user']
  })
  getUser(id: number): User {
    return this.userService.getUser(id);
  }
}
```

## Accessing Parameter Types

```typescript
// Get parameter types from the getUser method
const paramTypes = registry.getMethodParamTypes(UserController.prototype, 'getUser')[0];
console.log('Parameter types for getUser:', paramTypes);
// Output: [Number]

// Get return type from the getUser method
const returnType = registry.getMethodReturnType(UserController.prototype, 'getUser')[0];
console.log('Return type for getUser:', returnType);
// Output: User

// Get constructor parameter types for dependency injection
const constructorParamTypes = registry.getClassParamTypes(UserController)[0];
console.log('Constructor parameter types:', constructorParamTypes);
// Output: [UserService]
```

## Creating a Dependency Injection Container

This is a simple example of how you could build a dependency injection container using the type information:

```typescript
class Container {
  private services = new Map<any, any>();

  register<T>(serviceType: new (...args: any[]) => T, instance: T): void {
    this.services.set(serviceType, instance);
  }

  resolve<T>(serviceType: new (...args: any[]) => T): T {
    const registry = Rgstry.create({ useReflectMetadata: true }) as ReflectRegistry<any, any>;
    
    // Check if service is already registered
    if (this.services.has(serviceType)) {
      return this.services.get(serviceType);
    }
    
    // Get constructor parameter types
    const paramTypes = registry.getClassParamTypes(serviceType)[0] || [];
    
    // Resolve dependencies recursively
    const dependencies = paramTypes.map(type => this.resolve(type));
    
    // Create and register instance
    const instance = new serviceType(...dependencies);
    this.services.set(serviceType, instance);
    
    return instance;
  }
}

// Usage
const container = new Container();
container.register(UserService, new UserService());

// Create UserController with automatic dependency injection
const controller = container.resolve(UserController);
```

## Building a Route Register

Here's how you could use the metadata to build a route registry:

```typescript
class RouteRegistry {
  private routes = new Map<string, {
    controller: any;
    method: string;
    handler: Function;
    roles: string[];
    paramTypes: any[];
  }>();

  registerController(controllerClass: any): void {
    const registry = Rgstry.create<RouteMetadata>({
      useReflectMetadata: true
    }) as ReflectRegistry<RouteMetadata, any>;
    
    // Create controller instance
    const controller = new controllerClass();
    
    // Get all methods
    const prototype = Object.getPrototypeOf(controller);
    const methodNames = Object.getOwnPropertyNames(prototype)
      .filter(name => name !== 'constructor' && typeof prototype[name] === 'function');
    
    // Register routes for each decorated method
    for (const methodName of methodNames) {
      const metadata = registry.getMethodMetadata(prototype, methodName)[0];
      
      if (metadata) {
        const paramTypes = registry.getMethodParamTypes(prototype, methodName)[0] || [];
        
        this.routes.set(`${metadata.method} ${metadata.path}`, {
          controller,
          method: methodName,
          handler: prototype[methodName],
          roles: metadata.roles || [],
          paramTypes
        });
        
        console.log(`Registered route: ${metadata.method} ${metadata.path}`);
      }
    }
  }
  
  getRouteHandler(method: string, path: string) {
    return this.routes.get(`${method} ${path}`);
  }
}

// Usage
const routeRegistry = new RouteRegistry();
routeRegistry.registerController(UserController);
```

## Benefits Over Manual Type Annotation

The key advantage is that parameter types and return types are automatically captured at runtime through TypeScript's decorator metadata emission. This means:

1. No duplication of type information
2. Types stay in sync with code changes
3. Reduced boilerplate
4. Runtime access to type information

Without Reflect Metadata, you would need to manually specify types like this:

```typescript
@Route({
  path: '/users/:id',
  method: 'GET',
  paramTypes: [Number], // Manual type annotation
  returnType: User,     // Manual type annotation
  roles: ['user']
})
getUser(id: number): User { ... }
```

With Reflect Metadata, this information is captured automatically: