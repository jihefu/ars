'use strict';

/**
 * @param {Egg.Application} app - actionReg
 */
module.exports = app => {
    const { router, controller } = app;
    router.resources('actionReg', '/action/reg', controller.actionReg);
};
