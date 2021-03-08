'use strict';

/** @type Egg.EggPlugin */
module.exports = {
	// had enabled by egg
	// static: {
	//   enable: true,
	// }

	// 跨域安全
	cors: {
		enable: true,
		package: 'egg-cors',
	},

	// mongodb
	mongoose: {
		enable: true,
		package: 'egg-mongoose',
	},

	mongo: {
		enable: true,
		package: 'egg-mongo-native',
	},

	// redis
	redis: {
		enable: true,
		package: 'egg-redis',
	},

	// sessionRedis
	sessionRedis: {
		enable: true,
		package: 'egg-session-redis',
	},

	// 验证表单
	validate: {
		enable: true,
		package: 'egg-validate',
	},

	sofaRpc: {
		enable: false,
		package: 'egg-sofa-rpc',
	},
};
