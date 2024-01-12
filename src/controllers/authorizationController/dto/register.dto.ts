import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
	@IsEmail({}, { message: 'Email is not correct.' })
	email: string;

	@MinLength(8, { message: 'Password is too short' })
	@IsString({ message: 'Password is not correct.' })
	password: string;

	@MinLength(2, { message: 'Username is too short' })
	@IsString({ message: 'Name is not correct.' })
	username: string;
}
