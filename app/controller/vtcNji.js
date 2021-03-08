'use strict';

const BaseBackupCls = require('./baseBackupCls');

// 继承备份服务Controller类
class VtcNjiController extends BaseBackupCls {
    constructor(props) {
        super(props);
        this.serviceName = this.service.vtcNji;
    }

    async getCpySnListByUnionid() {
        const unionid = this.ctx.session.unionid;
        const res = await this.serviceName.getCpySnListByUnionid(unionid);
        this.ctx.body = res;
    }
}

module.exports = VtcNjiController;
