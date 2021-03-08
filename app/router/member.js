'use strict';

/**
 * @param {Egg.Application} app - member
 */
module.exports = app => {
    const { router, controller, middleware } = app;
    const auth = middleware.checkAuth();
    router.get('/member/selfInfo/', auth, controller.member.selfInfo);
    router.get('/member/info/:unionid', controller.member.show);
    router.get('/member/virtualCtrl/:sn([0-9]+)', controller.member.getVirtualCtrlBySn);
};
