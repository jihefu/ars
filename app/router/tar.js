'use strict';

/**
 * @param {Egg.Application} app - tarInstance
 */
module.exports = app => {
    const { router, controller } = app;
    router.get('/tar/instance/:sn([0-9]+)', controller.tarInstance.show); // 指定sn的最新版本
    router.post('/tar/instance/:sn([0-9]+)', controller.tarInstance.create);
};
