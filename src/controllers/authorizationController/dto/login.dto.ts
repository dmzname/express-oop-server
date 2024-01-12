import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
	@IsEmail({}, { message: 'Email or password is not correct.' })
	email: string;

	@MinLength(8, { message: 'Email or password is not correct.' })
	@IsString({ message: 'Email or password is not correct.' })
	password: string;
}
