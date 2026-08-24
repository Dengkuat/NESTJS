What are the exception filter and what do they solve?

- In nest app, code throws exceptions, could be bad input, missing records and failed BD callas, without a structure and in express we used try/catch block
- So in nest if we used the try/catch then we would have to use them in every controller and service which each format returns different response than the other
- Code would be inconsistent, hard to maintain, and mix error handling with logic which is out of the box of nest architecture

They solve

- NEST uses the exception filters, a piece of request pipeline whose only job is to catch unhandled exceptions thrown anywhere in the application and turn them into proper consistent HTTP response in a JSON format

Where do the exception filter sit in the lifecycle?

- After the Route handler executes and throws an exception, nest exception filter layer runs and catches the thrown exception, either by custom filters or default exception filter an returns a HTTP response to the client back

Terminologies accros exception layer?

1. Exception filter - filter implements this and it requires one method with 2 arguments catch(exception, host)
2. catch() decorator, placed on a class to tell nest which exception type that filter handles, so catch(HttpException) catches only HTTP exceptions while catch() with no argument catches everything thrown from the route handler
3. HttpException - Nest base exception class for HTTP errors, carrying a status code and response body which subclasses such as `BadRequestException`, `NotFoundException`, `UnauthorizedException`, `ForbiddenException`, `ConflictException`, `InternalServerErrorException.` 
4. BaseExceptionFilter - the default filter nest uses internally if we don’t provide one, it catches anything unhandled and formats a generic JSON response 
5. Binding scope - where you attach a filter, method, controller or global scope that controls which part of the app the filter applies to

```jsx
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.getResponse(),
    });
  }
}
```

Walk through it: `@Catch(HttpException)` says "only give me `HttpException`s." `host.switchToHttp()` unwraps the platform-specific request/response. `exception.getStatus()` and `.getResponse()` pull the status code and message off the exception. You control the exact JSON shape sent back.

Binding a filter 

1. Method scope
- Applies to a single route handler

```jsx
@Post()
@UseFilters(HTTPExceptionFilter)
create(@Body() dto:CreateCatDto){...}
```

1. Controller scope
- Applies to every rout in that controller

```jsx
@useFilter(HTTPEceptionFilter)
@Controller('cats')
export class CatController{...}
```

1. Global scope
- Applies to the whole nest application, two ways to this

```jsx
// Way A: in main.ts — simple, but can't inject dependencies
app.useGlobalFilters(new HttpExceptionFilter());
```

```jsx
// Way B: via the module providers — supports dependency injection
import { APP_FILTER } from '@nestjs/core';

@Module({
  providers: [
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
export class AppModule {}
```

Catching everything vs catching a specific type of exception

- catch() with no argument catch any thrown value,

```jsx
import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    if (exception instanceof SomeSpecialError) {
      // handle it your way
      return;
    }
    super.catch(exception, host); // fall back to default handling
  }
}
```