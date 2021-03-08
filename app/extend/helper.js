'use strict';
const jwt = require('jsonwebtoken');

/**
 * token工具类
 */
const PRIMARYKEY = 'langjie@network';
const EXPIRESIN = 3600 * 1; // 1小时
class TokenUtils {
	constructor(params) {
        this.expiresion = params.expiresion ? params.expiresion : EXPIRESIN;
        this.primarykey = params.primarykey ? params.primarykey : PRIMARYKEY;
	}

    // 生成token
    create(payload) {
        const { expiresion, primarykey } = this;
        const token = jwt.sign(payload, primarykey, {
            expiresIn: expiresion,
        });
        return {
            token,
            expiresion,
        };
    }

    // 检查token合法性
    check(token) {
        try {
            const payload = jwt.decode(token);
			jwt.verify(token, PRIMARYKEY);
            return {
                code: 200,
                msg: 'token有效',
                data: payload,
            };
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return {
                    code: 401,
                    msg: '身份过期',
                };
            } else if (error.name === 'JsonWebTokenError') {
                return {
                    code: 401,
                    msg: '非法签名',
                };
            }
            return {
                code: 401,
                msg: 'token出错',
            };
        }
    }
}

exports.TokenUtils = TokenUtils;
