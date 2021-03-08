'use strict';

// 异常统一处理
const errorFactory = (code, msg, data) => {
    const err = new Error(msg);
    err.code = code ? code : 500;
    err.message = msg;
    err.errors = data ? data : [];
    return {
        code,
        msg: err.message,
        data,
    };
};

module.exports = {
    ErrorFactory: errorFactory,
    CommonError: {
        invalidParams: (msg, data) => {
            msg = msg ? msg : '参数不合法';
            return errorFactory(422, msg, data);
        },
        notExist: (msg, data) => {
            msg = msg ? msg : '不存在';
            return errorFactory(404, msg, data);
        },
        isExist: (msg, data) => {
            msg = msg ? msg : '已存在';
            return errorFactory(403, msg, data);
        },
        notAllowed: (msg, data) => {
            msg = msg ? msg : '不允许';
            return errorFactory(403, msg, data);
        },
        unauthorizedAccess: (msg, data) => {
            msg = msg ? msg : '非法访问';
            return errorFactory(401, msg, data);
        },
    },
};
