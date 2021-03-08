'use strict';

/**
 * @param {Egg.Application} app - member
 */
module.exports = app => {
    const { router, controller, middleware } = app;
    const auth = middleware.checkAuth();
    router.get('/source/ctrl/:sn([0-9]+)', auth, controller.source.ctrlInfo);
};
