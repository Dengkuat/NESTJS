What problem do validators solve?

- Validators solve the problem of invalid enpoints sections from a nest route, that could crush the application
- This also reduces the size of the controller, where now the controller don’t have to check everything manually

```jsx
if (!email.includes('@')) ...
if (typeof name !== 'string') ...
if (typeof age !== 'number') ...
```

That why the validators comes in

Where do they sit in a nest application?

- The sit on top of attributes as a decorator

```jsx
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsInt()
  @Min(18)
  age: number;
}
```

- Now nest can automatically validate the incoming data against the rules

The major concepts how the validation piples work ?

```jsx
Incoming HTTP request
        ↓
      DTO
        ↓
ValidationPipe
        ↓
class-validator
        ↓
Valid? ─────── No → 400 Bad Request
  │
 Yes
  ↓
Controller
```

DTO → Data transfer object

- They define what the data should look like, they are jus tike interface but exist even after compile time when typescript is removed from javascript

Class-Validators

- This provides decorators such as

```jsx
@IsEmail()
@IsString()
@IsInt()
@IsNotEmpty()
@Min()
@Max()
@Length()
```

Installing validators

```jsx
npm install class-Validators class-transformer
```

Why?

Class-Validators

- Actually perform the validations

```jsx
@IsEmail()
@IsString()
@MinLength(8)
```

Class-transformer

- Help transform incoming plain javascript into class instances and perform transformation that validation can depend on

How to connect it to the main.ts

```jsx
import {ValidationPipe} from '@nests/common'

async function bootstrap(){
	const app = await NestFactory.create(AppModule);
	
	app.useGlobalPipes(
		new ValidationPipe({
			whiteList:true,
			forbidenNonWhitelist:true,
			transform:true,
		}),
	)
	wait app.listen(process.env.PORT??3000)
}
```