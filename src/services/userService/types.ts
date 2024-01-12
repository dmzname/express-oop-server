import { Document, WithId } from 'mongodb';
import { UserDataDto } from '../../models/User/dto/UserData.dto';

export interface IUserService {
	createUser: (dto: UserDataDto) => Promise<WithId<Document> | null>;
}
