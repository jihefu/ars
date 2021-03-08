'use strict';

module.exports = () => {
    return async function notFoundHandler(ctx, next) {
        await next();
        if (ctx.status === 404 && !ctx.body) {
            if (ctx.acceptJSON) {
                ctx.body = {
                    code: 404,
                    msg: 'Not Found',
                    data: [],
                };
            } else {
                ctx.body = '<h1>Page Not Found</h1>';
            }
        }
    };
};
