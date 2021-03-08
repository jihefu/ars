'use strict';

const BaseBackupCls = require('./baseBackupCls');

// 继承备份服务Controller类
class IniController extends BaseBackupCls {
    constructor(props) {
        super(props);
        this.serviceName = this.service.ini;
    }
}

module.exports = IniController;
