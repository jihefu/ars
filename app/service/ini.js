'use strict';

const BaseBackupCls = require('./baseBackupCls');

// 继承备份服务Service类
class IniService extends BaseBackupCls {
    constructor(props) {
        super(props);
        this.collectionName = 'source';
        this.tagNamedb = 'source';
        this.tag = 'iniInfo';
        this.ownerSource = this.ctx.model.IniOwner;
        this.selfServiceName = 'ini';
        this.contentName = 'iniContent';
    }
}

module.exports = IniService;
