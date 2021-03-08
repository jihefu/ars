'use strict';

const BaseBackupCls = require('./baseBackupCls');

// 继承备份服务Controller类
class TarInstanceController extends BaseBackupCls {
    constructor(props) {
        super(props);
        this.serviceName = this.service.tarInstance;
    }
}

module.exports = TarInstanceController;
