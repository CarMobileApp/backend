const config = {
	API_PORT: process.env.API_PORT || 5000,
	MONGO_URL: process.env.MONGO_URL || 'mongodb+srv://gowty:mhDZ3juAdubkR6UG@carwashautomation.p3vtfpk.mongodb.net/car_wash_automation?retryWrites=true&w=majority',
	JWT_SECRET: process.env.JWT_SECRET || 'no_secret',
	JWT_PL_SECRET: process.env.JWT_PL_SECRET || 's3cr3t',
	JWT_SALT: process.env.JWT_SALT || 'tlas'
};

module.exports = config;
