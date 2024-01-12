export const userSchema = {
	validator: {
		$jsonSchema: {
			bsonType: 'object',
			required: ['username', 'email', 'password'],
			properties: {
				username: {
					bsonType: 'string',
					minLength: 2,
					description: 'must be a string and is required',
				},
				email: {
					bsonType: 'string',
					description: 'must be a string and is required',
				},
				password: {
					bsonType: 'string',
					description: 'must be a string at least 8 characters long, and is required',
				},
			},
		},
	},
};
