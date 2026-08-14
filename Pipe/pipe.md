**What are pipe?**

- Pipe is a class implementing pipeTransform that intercepts an argument before it reaches your route handler, it’s exactly one method:
- Pipes are annotated with the @injectable  decorator, which implements the pipeTransformation interface

**Piples are typical for this two use cases:**

- **Transformation** → Transform input data to the desired form , such as from string to number, vice versa
- **Validation** → Evaluate input data and if valid, otherwise it will throw an exception error that ends the execution

**NOTE:** pipes seats under guards, just right before the handler runs, so before the controller methods execute, the piples have already parsed, transformed and validated the data, other wise the pipes will through an error then the handler will never run

**NEST js comes in with two types of pipes?**

1. Build-in pipes
2. Custom piples

NOTE: piples run inside the exception zone, so when they throw an error it is handled by the execution layer 

**Built-in pipes**

**validation pipe**
Validates and transform a whole DTO object using the class-validator and class-transformer decorators 

```jsx
@post()
create(@Body(new validation pipe()) dto:createUserDto){}
```

**parseIntPipe**
This transforms a string into an integer

```jsx
@Get('id')
findOne(@Param('id', parseIntPipe) id:number){}
```

**parseFloatPipe**
This turns a string into a float, for decimal number or values such as prices and coordinates 

```jsx
@Get()
search(@Query('lat', ParseFloatPipe) lat:number){}
```

**ParseBoolPipe**
This turns a string into boolean values of either true or false

```jsx
@Get()
findAll(@Query('active', ParseboolPipe) active:boolean){}
```

**ParseArrayPipe**
Turns a string in to comma separated array of strings

```jsx
@Get()
findById(@Query('ids', new ParseArrayPipe){item:Number, separator:","})ids:number[]
```

**ParseUUIDPipe**
Validates a string is a proper UUID

```jsx
@Get('id')
findOne(@Param('id', new ParseUUIDPipe) id:string){}
```

**ParseEnumPipe**
Validates a string is one of a TS enum’s value

```jsx
enum Role {Admin = 'admin', user = 'user'}

@Get()
findByRole(@Query('role', new ParseEnumPipe(Role) role:Role)){}
```

**ParseFilePipe**
Validates an uploaded file(size and type) via a validator array used in @uploadedFile()

```jsx
@Post('upload')
@UseInterceptors(FileInterceptor('file'))
upload(@UploadedFile(
  new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({ maxSize: 1000000 }),
      new FileTypeValidator({ fileType: 'image/jpeg' }),
    ],
  }),
) file: Express.Multer.File) {}
```

**ParseDatePipe**
Parses a string into a date object,  

```jsx
@Get()
findByDate(@Query('from', ParseDatePipe) from: Date) {}
```

**Custom pipes**
Comming soon!!!!!


**Applying pipes, all the four levels **

**parameter level**

This applies only to one parameter

```jsx
@Get('id')
findOne(@Param('id', ParseIntPipe) id:number){}
```

**Handler level**

Use the @usePipe() decorator on a method, applies to all parameter of the one method 

```jsx
@Post()
@UsePipes(new ValidationPipe())
create(@Body() dto: CreateUserDto) {}
```

**Controller level**

Use the @usePipe() decorator on a class, applies to every handler in the controller

```jsx
@UsePipes(new ValidationPipe())
@Controller('users')
export class UsersController { ... }
```

**Global level**

This applies to every route in entire application, two way can do it 

**first**

```jsx
// main.ts — simple, but this instance is NOT part of the DI container
app.useGlobalPipes(new ValidationPipe());
```

**second**

```jsx
// app.module.ts — DI-aware; use this if your pipe needs injected dependencies
import { APP_PIPE } from '@nestjs/core';

@Module({
  providers: [
    { provide: APP_PIPE, useClass: ValidationPipe },
  ],
})
export class AppModule {}
```