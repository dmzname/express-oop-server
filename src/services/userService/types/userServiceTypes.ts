import { Document, WithId } from 'mongodb';
import { UserDataDto } from '../../../models/User/dto/UserData.dto';
import { LoginDto } from '../../../controllers/authorizationController/dto/login.dto';
import { IUser } from '../../../models/User/types';

export interface IUserService {
	createUser: (dto: UserDataDto) => Promise<WithId<Document> | null>;
	loginValidateUser: (dto: LoginDto) => Promise<IUser | null>;
}
