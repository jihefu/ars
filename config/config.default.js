/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
	/**
	 * built-in config
	 * @type {Egg.EggAppConfig}
	 **/
	const config = exports = {
		debug: true,
		mysqlHost: '127.0.0.1',
		mysqlDataBase: 'lj_node',
		mysqlUser: 'root',
		mysqlPwd: '437612langjie',
		smsVerCodeUrl: 'https://wx.langjie.com/sms/v_code',
		wxStaticUrl: 'https://wx.langjie.com',
		langjieServerUrl: 'http://192.168.50.230:8090',
		rabbitMQHost: 'localhost',
		rabbitMQAccount: 'zlg',
		rabbitMQPassword: 'langjie2017',
	};

	// use for cookie sign key, should change to your own and keep security
	config.keys = appInfo.name + '_1560478533012_8089';

	// add your middleware config here
	config.middleware = [ 'actionAuth', 'resWare', 'notfoundHandler' ];

	// 安可迅注册操作身份验证
	config.actionAuth = {
		match(ctx) {
			if (/^\/action\/reg/.test(ctx.request.url) && ctx.method !== 'GET') return true;
			return false;
		},
	};

	// add your user config here
	const userConfig = {};

	// mongodb配置
	config.mongo = {
		clients: {
			source: {
				host: '127.0.0.1',
				port: '27017',
				name: 'source',
				user: 'zlg',
				password: '437612langjie',
			},
		},
	};

	// mongoose配置
	config.mongoose = {
		clients: {
			source: {
				url: 'mongodb://127.0.0.1:27017/source',
				options: {
					user: 'zlg',
					pass: '437612langjie',
				},
			},
		},
	};

	// redis配置
	config.redis = {
		client: {
			port: 6379,
			host: 'localhost',
			password: '',
			db: 3,
		},
		agent: true,
	};

	// session配置
	config.session = {
		maxAge: 60 * 60 * 6 * 1000,
		renew: true,
	};

	// 配置服务器端口
	config.cluster = {
		listen: {
			port: Number(process.env.NODE_PORT) || 8001,
		},
	};

	// 错误异常处理
	config.onerror = {
		html(err, ctx) {
			ctx.body = '<h3>' + err + '</h3>';
			ctx.status = ctx.response.status;
		},
		json(err, ctx) {
			const data = err.errors ? err.errors : [];
			const code = ctx.response.status ? ctx.response.status : 500;
			ctx.body = {
				code,
				msg: err.message,
				data,
				responseTime: ctx.app.TIME(),
			};
			if (code === 500) {
				// log处理
				ctx.logger.error(err);
			}
		},
	};

	// 跨域安全配置
	config.security = {
		csrf: {
			enable: false,
			ignoreJSON: true,
		},
	};

	config.cors = {
		origin: '*',
		allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
	};

	config.sofaRpc = {
		registry: {
			address: '127.0.0.1:2181', // configure your real zk address
		},
		server: {
			namespace: 'com.langjie.sofa.rpc',
		},
		client: {
			responseTimeout: 3000,
		},
	};

	return {
		...config,
		...userConfig,
	};
};
