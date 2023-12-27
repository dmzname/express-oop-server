module.exports = {
	async up(db) {
		await db.createCollection('users');
	},

	async down(db, client) {
		await db.collection('users').drop();
	},
};
