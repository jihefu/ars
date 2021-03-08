'use strict';

/**
 * @param {Egg.Application} app - vtcNji
 */
module.exports = app => {
    const { router, controller, middleware } = app;
    const auth = middleware.checkAuth();
    const replaceDot = middleware.replaceDot();

    router.get('/vtc/nji/list/self', auth, replaceDot, controller.vtcNji.selfList); // 获取我的所有序列号产品
    router.get('/vtc/nji/:sn([0-9]+)', replaceDot, controller.vtcNji.show); // 指定sn的最新版本

    router.get('/vtc/nji/list/:sn([0-9]+)', auth, replaceDot, controller.vtcNji.index); // 指定sn的所有版本
    router.get('/vtc/nji/list/:sn([0-9]+)/all', auth, replaceDot, controller.vtcNji.indexAll); // 指定sn的所有版本(包括所有)
    router.get('/vtc/nji/:sn([0-9]+)/:_id', replaceDot, controller.vtcNji.targetBackupInfo); // 指定sn的指定nji
    router.get('/vtc/nji/:sn([0-9]+)/:_id/all', replaceDot, controller.vtcNji.targetSourceContainInfo); // 指定sn的指定nji(包括所有)

    router.post('/vtc/nji/:sn([0-9]+)', auth, replaceDot, controller.vtcNji.create);
    router.put('/vtc/nji/:sn([0-9]+)', auth, replaceDot, controller.vtcNji.create);
    router.delete('/vtc/nji/:sn([0-9]+)/:_id', auth, replaceDot, controller.vtcNji.destroy);

    router.get('/vtc/nji/getCpySnListByUnionid', auth, controller.vtcNji.getCpySnListByUnionid);
};
