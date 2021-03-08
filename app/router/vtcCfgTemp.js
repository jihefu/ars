'use strict';

/**
 * @param {Egg.Application} app - vtcCfgTemp
 */
module.exports = app => {
    const { router, controller, middleware } = app;
    const auth = middleware.checkAuth();
    const replaceDot = middleware.replaceDot();

    // 所有客户
    router.get('/vtc/cfgTemp/getAllCusList', controller.vtcCfgTemp.getAllCusList);

    // 试验机机型列表
    router.get('/vtc/cfgTemp/suitableProductList', controller.vtcCfgTemp.factoryModel);

    // 解决方案列表
    router.get('/vtc/cfgTemp/machineType', controller.vtcCfgTemp.solutionType);

    // 列表
    router.get('/vtc/cfgTemp', replaceDot, controller.vtcCfgTemp.index);
    router.get('/vtc/cfgTemp/self', auth, replaceDot, controller.vtcCfgTemp.selfIndex);

    // 打包下载资源集合和标签集合
    router.get('/vtc/cfgTemp/buildPublic', replaceDot, controller.vtcCfgTemp.buildPublic);
    router.get('/vtc/cfgTemp/buildSelf', auth, replaceDot, controller.vtcCfgTemp.buildSelf);

    // 获取指定配置文件
    router.get('/vtc/cfgTemp/:id', replaceDot, controller.vtcCfgTemp.show);
    // 获取指定公共配置文件的标签
    router.get('/vtc/cfgTemp/label/:name', replaceDot, controller.vtcCfgTemp.showLabel);

    // 更新公共配置文件
    router.put('/vtc/cfgTemp/public/:name', auth, replaceDot, controller.vtcCfgTemp.updatePublic);

    // 删除公共配置文件
    router.delete('/vtc/cfgTemp/public/:name', auth, replaceDot, controller.vtcCfgTemp.destoryPublic);

    // 更新私有配置文件
    router.put('/vtc/cfgTemp/self/:name', auth, replaceDot, controller.vtcCfgTemp.updateSelf);

    // 删除私有配置文件
    router.delete('/vtc/cfgTemp/self/:name', auth, replaceDot, controller.vtcCfgTemp.destorySelf);

    // 通知mongodb的模板标签库，把MachineType为变为其它
    router.put('/vtc/cfgTemp/label/updateMachineTypeToOtherId', auth, replaceDot, controller.vtcCfgTemp.updateMachineTypeToOtherId);
};
