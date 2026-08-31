what problem does caching solve?

- It solves repeated work, when we have to make database calls for data everything that could take time

What is caching?

- A temporary space where you keep something you might need again soon

Why does caching matter?

- Some operation are expensive, examples backend where nest application ask for data from the database then the database has to search for the resource can take some amount of time and uses database resources

Where does the cache live?

- A cache is really just a key-value store like a JS object

```jsx
{
  "/tasks": [ {id:1, title:"Buy milk"}, {id:2, title:"Walk dog"} ],
  "/users": [ {id:1, name:"Alice"} ]
}
```

- The value is whatever the handler returned the last time, nest wraps it in a cache-manager, and by default it just keeps it there

Install it

```jsx
npm install @nestjs/cache-manager cache-manager
```

Rejester the cache in the app module

This is where we set up the cache store for the whole app to use it

```jsx
// app.module.ts
import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({
      ttl: 10000, // how long (in ms) a cached value stays valid — 10 seconds here
    }),
    UsersModule,
    TasksModule,
  ],
  // ...
})
export class AppModule {}
```

`ttl` = **time to live**. After 10 seconds, that cached entry is thrown away and the next request goes to the real handler again, refreshing the cache.

The cache process in the route level

```jsx
// task.controller.ts
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @UseInterceptors(CacheInterceptor)
  @Get()
  findAll() {
    console.log('Hitting the database...'); // add this temporarily
    return this.taskService.findAll();
  }
}
```