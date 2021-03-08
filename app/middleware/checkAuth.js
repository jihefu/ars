'use strict';

module.exports = () => {
    return async function checkAuth(ctx, next) {
        if (auth(ctx)) await next();
    };
};

function auth(ctx) {
    // 验证是否是内部服务器
    if (ctx.headers.primaryunionid) {
        ctx.session.unionid = ctx.headers.primaryunionid;
        return true;
    }
    const token = ctx.headers.token;
    const result = ctx.service.login.openCheckToken(token);
    if (result.code === 200) {
        ctx.session.unionid = result.data.unionid;
        return true;
    }
    ctx.body = errorFactory(401, result.msg);
    return false;
}

function errorFactory(code, msg, data) {
    const err = new Error(msg);
    err.code = code ? code : 500;
    err.message = msg;
    err.errors = data ? data : [];
    return {
        code,
        msg: err.message,
        data,
    };
}
