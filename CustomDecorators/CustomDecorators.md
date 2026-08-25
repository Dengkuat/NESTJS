What are custom providers?

- They exist in nest because the default provider:[service] is just a shorthand for a more explicit configuration, so we need a way to control the providers

The core idea

```jsx
providers:[userService]
```

- Nest now expands it to something more like this

```jsx
providers: [
	{
		provide:userService,
		useClass:userService,
	},
]
```

- Now every provider is an object with a token provide and how to build it either with useValue, useClass, useFactory, useExisting

1. useValue
- use when you already have a value, no construction needed

```jsx
const mockUserService = {
	findAll: () => ['deng', 'kuat'],
}

@Module({()
provider:[
	{
		provide:userService,
		useValue:mockUserService
	},
]
})
```

When do we use them 

- injecting a mock test in the providers
- injecting a known config object
- Injecting a third party client manually

1. useClass
- When we want nest to instantiate a class for us, but the class should depend on something usually an environment

```jsx
@Module({
  providers: [
    {
      provide: ConfigService,
      useClass: process.env.NODE_ENV === 'development'
        ? DevelopmentConfigService
        : ProductionConfigService,
    },
  ],
})
export class ConfigModule {}
```

1. useFactory
- Use when building the value that requires logic, computation, conditions or other providers

```jsx
@Module({
  providers: [
    {
      provide: 'CONNECTION_OPTIONS',
      useFactory: (configService: ConfigService) => {
        return {
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
        };
      },
      inject: [ConfigService],
    },
  ],
})
export class DatabaseModule {}
```

1. useExisting
- use to create an alias, one token pointing to the same instance as another token, without creating a second instance

```jsx
@Injectable()
class LoggerService {}

const providers = [
  LoggerService,
  {
    provide: 'AliasedLoggerService',
    useExisting: LoggerService,
  },
];
```

Qn: Difference between dependency injection and dependency inversion

- **Dependency Injection is a technique where a class receives the dependencies it needs from outside instead of creating them itself. In NestJS, we usually do this through the constructor, and Nest’s dependency injection container creates and provides those dependencies.**
- **Dependency Inversion is a design principle where high-level code depends on abstractions rather than concrete implementations. This means I can change the underlying implementation without having to change the business logic that depends on it.**
- **So, Dependency Injection is about how a dependency gets into a class, while Dependency Inversion is about what the class should depend on. NestJS’s dependency injection system makes it easier to apply Dependency Inversion.**

The @inject() decorator

Whenever the token isn’t a class could be an interface, repository, we must then explicitly tell nest which token to solve

```jsx
constructor(@Inject('CONNECTION_OPTIONS') private options: any) {}
```

**Exporting custom providers**
If another module needs to inject a custom provider, you must export the **token**, not just declare the provider: