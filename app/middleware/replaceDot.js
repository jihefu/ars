'use strict';

module.exports = () => {
    return async (ctx, next) => {
        try {
            if (ctx.request.body.config) {
                if (typeof ctx.request.body.config === 'string') {
                    ctx.request.body.config = JSON.parse(ctx.request.body.config);
                }
            }
        } catch (e) {
            console.log(e);
        }
        try {
            ctx.request.body = replaceDot(ctx.request.body, /\./ig, '!');
        } catch (e) {
            console.log(e);
        }
        await next();
        try {
            ctx.response.body.data = replaceDot(ctx.response.body.data, /!/ig, '.');
        } catch (e) {
            console.log(e);
        }
    };
};

function replaceDot(params, reg, c, count) {
    count = count ? count : 0;
    if (count > 100) {
        throw new Error();
    }
    if (!params) {
        return params;
    }
    if (typeof params === 'symbol' || typeof params === 'boolean' || typeof params === 'string' || typeof params === 'number' || typeof params === 'function' || Buffer.isBuffer(params) || params instanceof Date) {
        return params;
    }
    if (params instanceof Array) {
        for (let i = 0; i < params.length; i++) {
            params[i] = replaceDot(params[i], reg, c, count + 1);
        }
        return params;
    }
    const newObj = {};
    for (const key in params) {
        const value = params[key];
        const newKey = key.replace(reg, c);
        newObj[newKey] = replaceDot(value, reg, c, count + 1);
    }
    return newObj;
}
