Where do interceptors sit in the request lifecycle?

- Interceptors run after the guards and before the piples so it lies in between guards and piples
- Interceptors also run after the route handler in the response cycle after the route handler

What the interceptors main purpose?

- They wrap around the handler entirely, so teh can act before and after the communication between route and route handler

Why do we need them?

- Logging how long request took
- Transforming the shape of a response
- Caching a response
- Mapping errors into a different format
- Adding extra fields to the response after the handler runs
- Timing out a request if it takes too long

So interceptors remove repetition of codes inside the controller each time, so we write it once and apply it to every controller 

We we wrap it around the route handler and it will add behavior without us actually touching the code, which is called AOP - Aspect-Oriented-Programming

Core Terminology

1. NEST interceptor - the interface every interceptor class implements
2. Intercept(context, next) - the one method you must implement, where all the logic lives
3. Execution Context - same things we saw in guard, gives us access to the request, response, handler and class
4. Call Handler - Represents the actual route handler thats about to run, uses the handle()
5. handle() - calling this actually invokes the route handler and return an observable of the response
6. Observable - this is the biggest concept compared to guards and piples, interceptors work with RxJS observable, not plain promises becuase that gives you operations like map, tap, catchError, timeout to manipulate the response stream

```jsx
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
// 1️⃣ code here runs BEFORE the route handler
console.log('Before...');

const now = Date.now();

return next.handle().pipe(
// 2️⃣ code here runs AFTER the route handler returns
tap(() => console.log(`After... ${Date.now() - now}ms`)),
);
}
```

If you *don't* call `next.handle()`, the route handler never runs at all — similar to how a guard returning `false` blocks the request. That's a subtle but important power interceptors have.

That's the foundation: **what** they are, **why** they exist (cross-cutting concerns, AOP), and **where** they sit (wrapping the handler, before + after, using RxJS).