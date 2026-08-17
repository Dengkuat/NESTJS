What a guard actually is?

- A guard is just a class decorated with `@injectable` that implements the CanActive interface
- It decides whether given requests gets handled by the route handler or not, based on conditions such as permissions roles, so simply authorised

Why not just use middleware like we did in express?

- Middleware do the same thing and worked perfect in express, but it doesn’t know which handler is about to run next,
- A guard can access the Execution context, so it knows exactly what about to be excited, which lets it make smatter or context aware decisions

Where do guards sit in the request lifeCycle?

!image.png

- So guards run after all middleware such as logging and cors and before the pipe that validate and transform arguments within the route handlers

What is the CanActive interface?

- Every guards must implement one method which is the `CanActive` interface

```jsx
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return validateRequest(request);
  }
}
```

- The return values can be sync or async, (promise or observable) and nest reacts with a boolean expression of either

→ true for request proceeds to the handler

→ false for nest denying the request and throws a 403 error which is a forbiddenException 

- We can also create our new exception, unauthorizedException instead of running false, if we want to return to the client a different status or message

Execution context 

`canActive()` receives one argument, which is the execution context

- It extends the argument ArgumentsHost, same thing used in the exception filters, so `context.switchToHttp().getRequest()` works the same way there
- Because it extends `arguementHost` it adds extra helper methods on top, so most important `context.getHandler()` returns reference to the route handler method while `context.getClass()` returns the controller class, this lets us to read custom metadata attached to a specific controller and route
- It gives you a context way to reach the request whether its in HTTP, web sockets, or GraphSQL

Binding Guards 

Three scopes

1. Controller scoped
- Applies to every route in that controller

```jsx
@Controller('cats')
@UseGuards(RolesGuard)
export class CatsController {}
```

1. Method scoped

Put `@useGuards` directly above a single handler, global two way to distinguish

```jsx
// Way 1: instance-based, set up outside any module
const app = await NestFactory.create(AppModule);
app.useGlobalGuards(new RolesGuard());
```

```jsx
// Way 2: DI-aware, registered from within a module
@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
```

Custom meta data

A guard returns boolean values of either true or false, the real pattern is attached to a route, then read the meta data inside the route via a reflector 

**Step 1 — create a decorator to attach metadata:**

```jsx
import { Reflector } from '@nestjs/core';
export const Roles = Reflector.createDecorator<string[]>();
```

**Step 2 — tag a handler with it:**

```jsx
@Post()
@Roles(['admin'])
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```

Step 3 — read it inside the guard, using `Reflector` + `context.getHandler()`:

```jsx
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles) {
      return true; // no roles required → allow
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user; // typically attached by an earlier auth guard/middleware
    return matchRoles(roles, user.roles);
  }
}
```

### 7. Quick self-check

1. Why can't middleware do what guards do?
2. What's the exact position of guards in the request lifecycle?
3. What does a guard return, and what happens for each return value?
4. What's the difference between `useGlobalGuards()` and registering via `APP_GUARD`, and why does it matter?
5. How would you make one route in a globally-guarded controller public? *(hint: this is exactly the metadata + `Reflector` pattern above, just inverted — you'd check `reflector.getAllAndOverride<boolean>('isPublic', [context.getHandler(), context.getClass()])` and return `true` early if it's public)*
6. What exception does Nest throw by default when a guard returns `false`, and how do you override it?