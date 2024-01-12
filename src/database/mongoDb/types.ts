import { Db } from 'mongodb';

export interface IMongoService {
	connect: () => Promise<void>;
	db: Db;
}

export enum DataBaseCollections {
	USERS = 'users',
}
