import { User } from '../../models/User/user';
import { Document, WithId } from 'mongodb';

export interface IUserRepository {
	create: (user: User) => Promise<WithId<Document> | null>;
	find: (email: string) => Promise<WithId<Document> | null>;
}
