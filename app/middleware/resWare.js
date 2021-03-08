'use strict';

// 返回结果统一格式
module.exports = () => {
    return async (ctx, next) => {
        await next();
        if (ctx.acceptJSON) {
            ctx.body.responseTime = ctx.app.TIME();
            ctx.status = ctx.body.code ? ctx.body.code : 200;
        }
    };
};

