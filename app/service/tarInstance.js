'use strict';

const BaseBackupCls = require('./baseBackupCls');

// 继承备份服务Service类
class TarInstanceService extends BaseBackupCls {
    constructor(props) {
        super(props);
        this.collectionName = 'source';
        this.tagNamedb = 'source';
        this.tag = 'tarInfo';
        this.ownerSource;
        this.selfServiceName = 'tarInstance';
        this.contentName = 'tarInstance';
    }

    /**
     * 创建指定sn版本
     * @param {object} params 参数
     * @param {onject} payload 其他参数
     */
    async create(params, payload) {
        const { sn, unionid } = payload;
        let { info, config } = params;
        config = typeof config === 'string' ? JSON.parse(config) : config;
        info.isdel = 0;
        info.createdAt = this.app.TIME();
        let num = await this.app.mongo.get(this.collectionName).count(this.tag, {
            query: { sn },
        });
        info.versionNo = ++num;
        // 新增资源
        const njiEntity = await this.app.mongo.get(this.collectionName).insertOne(this.contentName, {
            doc: config,
        });
        // 新增标签
        info.contentId = njiEntity.insertedId;
        info.sn = sn;
        info.unionid = unionid;
        await this.app.mongo.get(this.tagNamedb).insertOne(this.tag, {
            doc: info,
        });
        return {
            code: 200,
            msg: '创建成功',
            data: njiEntity.insertedId,
        };
    }
}

module.exports = TarInstanceService;
