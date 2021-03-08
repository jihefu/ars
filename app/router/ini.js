'use strict';

/**
 * @param {Egg.Application} app - ini
 */
module.exports = app => {
    const { router, controller, middleware } = app;
    const auth = middleware.checkAuth();
    router.get('/maxtest/ini/list/self', auth, controller.ini.selfList); // 获取我的所有序列号产品
    router.get('/maxtest/ini/list/:sn([0-9]+)', controller.ini.index); // 指定sn的所有版本
    router.get('/maxtest/ini/list/:sn([0-9]+)/all', auth, controller.ini.indexAll); // 指定sn的所有版本(包括所有)

    router.get('/maxtest/ini/:sn([0-9]+)', controller.ini.show); // 指定sn的最新版本
    router.get('/maxtest/ini/:sn([0-9]+)/:_id', controller.ini.targetBackupInfo); // 指定sn的指定ini
    router.get('/maxtest/ini/:sn([0-9]+)/:_id/all', controller.ini.targetSourceContainInfo); // 指定sn的指定nji(包括所有)

    router.post('/maxtest/ini/:sn([0-9]+)', auth, controller.ini.create);
    router.put('/maxtest/ini/:sn([0-9]+)', auth, controller.ini.create);
    router.delete('/maxtest/ini/:sn([0-9]+)/:_id', auth, controller.ini.destroy);
};
