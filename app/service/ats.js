'use strict';

const Service = require('egg').Service;

class AtsService extends Service {
    constructor(props) {
        super(props);
        this.db = 'source';
        this.infoCollection = 'atsInfo';
        this.contentCollection = 'atsContent';
    }

    async index(sn) {
        const atsTotalList = await this.app.mongo.get(this.db).find(this.infoCollection, {
            query: {
                sn,
                isdel: 0,
            },
            sort: [[ 'createdAt', -1 ]],
        });
        const atsNameMapper = {};
        for (let i = 0; i < atsTotalList.length; i++) {
            const { atsName } = atsTotalList[i];
            if (!atsNameMapper[atsName]) {
                atsNameMapper[atsName] = [];
            }
            atsNameMapper[atsName].push(atsTotalList[i]);
        }
        for (const entries of Object.entries(atsNameMapper)) {
            atsNameMapper[entries[0]] = entries[1].sort((a, b) => b.versionNo - a.versionNo);
        }
        const resList = [];
        for (const values of Object.values(atsNameMapper)) {
            resList.push(values[0]);
        }
        return { code: 200, msg: '查询成功', data: resList };
    }

    async show(sn, atsName) {
        const atsList = await this.app.mongo.get(this.db).find(this.infoCollection, {
            query: {
                sn,
                atsName,
                isdel: 0,
            },
            limit: 1,
            skip: 0,
            sort: [[ 'createdAt', -1 ]],
        });
        if (atsList.length === 0) return this.ctx.response.CommonError.notExist('不存在'); // 不存在
        const info = atsList[0];
        const { contentId } = info;
        const config = await this.app.mongo.get(this.db).findOne(this.contentCollection, {
            query: {
                _id: contentId,
            },
        });
        delete config._id;
        return {
            code: 200,
            msg: '查询成功',
            data: {
                info,
                config,
            },
        };
    }

    async create(formData) {
        let { sn, atsName, unionid, info, config } = formData;
        config = typeof config === 'string' ? JSON.parse(config) : config;
        info.isdel = 0;
        info.createdAt = this.app.TIME();
        let num = await this.app.mongo.get(this.db).count(this.infoCollection, {
            query: { sn, atsName },
        });
        info.versionNo = ++num;
        // 新增资源
        const atsEntity = await this.app.mongo.get(this.db).insertOne(this.contentCollection, {
            doc: config,
        });
        // 新增标签
        info.contentId = atsEntity.insertedId;
        info.sn = sn;
        info.atsName = atsName;
        info.unionid = unionid;
        const infoEntity = await this.app.mongo.get(this.db).insertOne(this.infoCollection, {
            doc: info,
        });
        return {
            code: 200,
            msg: '创建成功',
            data: infoEntity.insertedId,
        };
    }
}

module.exports = AtsService;
