Where do middleware sit in the request lifecycle?

- Directly from the client the middleware runs first and has access to the req, res and next

What are middleware?

- Middleware is the earliest point where we can touch a request before the routing continues to the controller to handle it, before guards check permission, before piples validate, we apply logging of request, parshing cookies, checking header exist, rate limiting, CORS handling

NEST middleware is directly built on express middleware, but nest wraps it with classes, dependency injection and declarative way to bind it per-module 

Core terminologies

NEST Middleware - a class implements this to became a middleware, requires one req, res, and next

Function middleware - A plain function instead of a class, when we don’t need dependency injection 

next() - you must call this to pass control to the next middleware or the route handler, the request hands forever if we don’t hang this

MiddlewareConsumer - the object your module uses to register middleware via its config() method

forRoutes() - tells the consumer which routes the middleware applies to, accepts a path a wildcard 

exclude() - chains onto apply() to exclude specific routes from an otherwise broad middleware binding 

NEST Module interface - a module implements this and defines configure(consumer: MiddlewareConsumer) to wire up its middleware

```jsx
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
  }
}
```

`@injectable()`  - lets us to inject other providers into the consumer

Binding in a module

Functional middleware

```jsx
export function logger(req: Request, res: Response, next: NextFunction) {
  console.log(`Request...`);
  next();
}
```

Global middleware

```jsx
const app = await NestFactory.create(AppModule);
app.use(logger); // only functional middleware works here — no DI, since it's outside module context
```

### Common real-world uses

- **Request logging** — log method, URL, timing for every request.
- **Raw auth checks** — verify a token exists / is well-formed before it even reaches a guard.
- **CORS, helmet, body-parsing** — typically applied as global middleware.
- **Request enrichment** — attach a `req.requestId` or `req.tenant` that later guards/pipes/handlers rely on.