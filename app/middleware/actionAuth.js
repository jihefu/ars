'use strict';
const serverAuthValid = require('../util/serverAuthValid');

module.exports = () => {
    return async function actionAuth(ctx, next) {
        if (auth(ctx)) await next();
    };
};

function auth(ctx) {
    const method = ctx.method.toUpperCase();
    const { aesStr } = ctx.request.body;
    let sn;
    if (method === 'POST') {
        sn = ctx.request.body.sn;
    } else {
        const routeArr = ctx.request.url.split('/');
        sn = routeArr[routeArr.length - 1];
    }
    const validRes = serverAuthValid.validate(aesStr, sn);
    if (!validRes) {
        ctx.body = ctx.response.CommonError.unauthorizedAccess();
        return false;
    }
    return true;
}
