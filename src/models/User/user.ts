import { hash } from 'bcryptjs';
import { IUser } from './types';

export class User implements IUser {
	private _password: string;

	constructor(
		private readonly _email: string,
		private readonly _username: string,
	) {}

	get email(): string {
		return this._email;
	}

	get username(): string {
		return this._username;
	}

	get password(): string {
		return this._password;
	}

	public async setPassword(password: string, salt: number): Promise<void> {
		this._password = await hash(password, salt);
	}
}
