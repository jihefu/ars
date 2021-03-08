'use strict';
const Sequelize = require('sequelize');
const defaultConfig = require('../../config/config.default.js')({});
const prodConfig = require('../../config/config.prod.js')({});

exports.sequelize = () => {
	const config = {
		mysqlHost: defaultConfig.mysqlHost,
		mysqlDataBase: defaultConfig.mysqlDataBase,
		mysqlUser: defaultConfig.mysqlUser,
		mysqlPwd: defaultConfig.mysqlPwd,
	};
	if (process.env.NODE_ENV === 'production') config.mysqlHost = prodConfig.mysqlHost;
	return new Sequelize(
		config.mysqlDataBase,
		config.mysqlUser,
		config.mysqlPwd,
		{
			dialect: 'mysql',
			host: config.mysqlHost,
			port: 3306,
			pool: {
				max: 10,
				min: 0,
				idle: 10000,
			},
			logging: false,
			timezone: '+08:00', // 东八时区
		}
	);
};
