export interface IUser {
	email: string;
	username: string;
	password: string;
	setPassword: (password: string, salt: number) => void;
}
