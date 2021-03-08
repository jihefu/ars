'use strict';

/**
 * @param {Egg.Application} app - ats
 */
module.exports = app => {
    const { router, controller, middleware } = app;
    const auth = middleware.checkAuth();
    router.get('/ats/instance/:sn([0-9]+)', controller.ats.index);
    router.get('/ats/instance/:sn([0-9]+)/:atsName', controller.ats.show);
    router.post('/ats/instance/:sn([0-9]+)/:atsName', auth, controller.ats.create);
};
