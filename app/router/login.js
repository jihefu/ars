'use strict';

/**
 * @param {Egg.Application} app - login
 */
module.exports = app => {
    const { router, controller, middleware } = app;
    const auth = middleware.checkAuth();
    router.post('/login/getVerCode', controller.login.getVerCode);
    router.post('/login/checkVerCode', controller.login.checkVerCode);
    router.get('/login/poll/:sn([0-9]+)', controller.login.poll);
    router.post('/login/saveTokenInfo/:sn([0-9]+)', controller.login.saveTokenInfo);
    router.post('/login/qrcodeImage/:sn([0-9]+)', controller.login.downloadQrcodeImage);
    router.post('/login/getTokenByUnionid', auth, controller.login.getTokenByUnionid);
    // 同一token生成验证
    router.post('/login/openCreateToken', controller.login.openCreateToken);
    router.post('/login/openCheckToken', controller.login.openCheckToken);
};
