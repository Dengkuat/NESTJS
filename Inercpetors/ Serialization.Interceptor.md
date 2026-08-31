What does serialization mean?

- The process that happens right before a response is sent
- Where an object is converted in to the exact JSON shape we want to expose, hiding fields, renaming them, applying transforms based on rules attached to the class

What is the difference between serialisation and validation pipes 

validation pipes {class-validator and class-transformer} deal with validating and transforming incoming data

Serialization deals with shaping the outgoing data,  still under class-transformer package, but they do the same thing but completely opposite one handles requests shape and another handles response shape

Why do we need serlization?

Serlization lets us control or rule out field to be stripped automatically, everywhere without manually deleting it in every handler 

The core decorators

```jsx
import { Exclude, Expose, Transform } from 'class-transformer';

export class UserEntity {
  id: number;
  firstName: string;
  lastName: string;

  @Exclude()
  password: string;

  @Expose({ name: 'fullName' })
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  @Transform(({ value }) => value.toISOString())
  createdAt: Date;
}
```

`@Exclude` - never include the property in the serialized output

`@Expose()` - include it, default behavior for all fields unless you flip the strategy, we could also rename a field

`@Transform` - run a function over the value before output, formating, dates, masking data

How we can hook up this action

```jsx
//method level
@UseInterceptors(ClassSerializerInterceptor)
@Get(':id')
findOne(@Param('id') id: string) {
  return this.usersService.findOne(id); // returns a UserEntity instance
}

//controller level
@Controller()

//global level via the module
providers: [
  { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
],
```

When to use DTO with class-validator and class-transformer or serlization decorator

- DTO defines shapes for incoming and outgoing data, they use class-validator to check and class-transformer to convert data, while serlization defines and controls what the API should response back to the client