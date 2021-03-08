'use strict';

const ObjectID = require('mongodb').ObjectID;
const Service = require('egg').Service;

class BaseBackupService extends Service {
    constructor(props) {
        super(props);
        this.collectionName;
        this.tagNamedb;
        this.tag;
        this.ownerSource;
        this.self;
        this.infoName;
        this.contentName;
    }

    // 20200622
    // 根据sn和_id获取资源
    async getSourceById(sn, contentId) {
        const sourceEntity = await this.app.mongo.get(this.collectionName).findOne(this.contentName, {
            query: {
                _id: contentId,
            },
        });
        return sourceEntity;
    }

    /**
     * 20200622
     * 指定sn的所有版本
     * @param {object} params 参数
     */
    async index(params) {
        const { sn } = params;
        const njiInfoList = await this.app.mongo.get(this.tagNamedb).find(this.tag, {
            query: {
                sn,
                isdel: 0,
            },
            sort: [[ 'createdAt', -1 ]],
        });
        for (let i = 0; i < njiInfoList.length; i++) {
            const result = await this.service.member.basicInfo(njiInfoList[i].unionid);
            njiInfoList[i].name = result.data.name;
        }
        return {
            code: 200,
            msg: '查询成功',
            data: njiInfoList,
        };
    }

    /**
     * 20200622
     * @param {object} params 参数
     */
    async indexAll(params) {
        const { sn } = params;
        const njiInfoList = await this.app.mongo.get(this.tagNamedb).find(this.tag, {
            query: {
                sn,
                isdel: 0,
            },
            sort: [[ 'createdAt', -1 ]],
        });
        const _p = [];
        const resArr = [];
        njiInfoList.forEach((items, index) => {
            _p[index] = new Promise(async resolve => {
                const { contentId } = items;
                const i = index;
                const sourceEntity = await this.service[this.selfServiceName].getSourceById(sn, contentId);
                delete items._id;
                delete sourceEntity._id;
                resArr[i] = {};
                resArr[i].info = items;
                resArr[i].config = sourceEntity;
                resolve();
            });
        });
        await Promise.all(_p);
        return {
            code: 200,
            msg: '查询成功',
            data: resArr,
        };
    }

    /**
     * 20200622
     * 根据资源id获取资源
     * @param {object} params 参数
     */
    async targetBackupInfo(params) {
        const { _id } = params;
        const njiEntity = await this.app.mongo.get(this.collectionName).findOne(this.contentName, {
            query: {
                _id: ObjectID(_id),
            },
        });
        if (njiEntity) delete njiEntity._id;
        return {
            code: 200,
            msg: '查询成功',
            data: njiEntity,
        };
    }

    // 20200622
    // 根据标签id获取信息和资源
    async targetSourceContainInfo(params) {
        const { sn, _id } = params;
        const njiInfoList = await this.app.mongo.get(this.tagNamedb).find(this.tag, {
            query: {
                _id: ObjectID(_id),
                isdel: 0,
            },
        });
        if (njiInfoList.length === 0) return this.ctx.response.CommonError.notExist('不存在'); // 不存在
        const njiInfo = njiInfoList[0];
        const njiConfig = await this.service[this.selfServiceName].getSourceById(sn, njiInfo.contentId);
        delete njiInfo._id;
        delete njiConfig._id;
        return {
            code: 200,
            msg: '查询成功',
            data: {
                info: njiInfo,
                config: njiConfig,
            },
        };
    }

    /**
     * 20200622
     * 指定sn的最新版本
     * @param {string} sn 序列号
     * @param {boolean} keepId 保留id
     */
    async show(sn, keepId) {
        const njiInfoList = await this.app.mongo.get(this.tagNamedb).find(this.tag, {
            query: {
                sn,
                isdel: 0,
            },
            limit: 1,
            skip: 0,
            sort: [[ 'createdAt', -1 ]],
        });
        if (njiInfoList.length === 0) return this.ctx.response.CommonError.notExist('不存在'); // 不存在
        const njiInfo = njiInfoList[0];
        const njiConfig = await this.service[this.selfServiceName].getSourceById(sn, njiInfo.contentId);
        // delete njiInfo._id; /**20210208*/
        if (!keepId) {
            delete njiConfig._id;
        }
        return {
            code: 200,
            msg: '查询成功',
            data: {
                info: njiInfo,
                config: njiConfig,
            },
        };
    }

    /**
     * 20200622
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
        info.uploadFrom = info.uploadFrom ? info.uploadFrom : '软件';
        const infoEntity = await this.app.mongo.get(this.tagNamedb).insertOne(this.tag, {
            doc: info,
        });
        // 新增关系
        this.service[this.selfServiceName].receiveNewItem({
            sn,
            unionid,
            mongoId: infoEntity.insertedId,
        });
        return {
            code: 200,
            msg: '创建成功',
            data: njiEntity.insertedId,
        };
    }

    /**
     * 删除
     * @param {object} params 参数
     */
    async destroy(params) {
        const { sn, _id, unionid } = params;
        const njiTagEntity = await this.app.mongo.get(this.tagNamedb).findOne(this.tag, {
            query: {
                sn,
                isdel: 0,
                _id: ObjectID(_id),
            },
        });
        if (!njiTagEntity) return this.ctx.response.CommonError.notExist('不存在或已删除'); // 不存在
        if (unionid !== njiTagEntity.unionid) return this.ctx.response.CommonError.notAllowed('无权限删除'); // 无权限删除
        await this.app.mongo.get(this.tagNamedb).updateMany(this.tag, {
            filter: {
                _id: ObjectID(_id),
            },
            update: {
                $set: {
                    isdel: 1,
                },
            },
        });
        this.service[this.selfServiceName].receiveRemoveItem({
            unionid,
            _id,
        });
        return {
            code: 200,
            msg: '删除成功',
            data: [],
        };
    }

    /**
     * 20200622
     * 获取我的所有产品
     * @param {string} unionid 身份标识
     */
    async selfList(unionid) {
        const njiEntity = await this.ownerSource.findOne({
            unionid,
        });
        const snHashMapper = {};
        if (njiEntity) {
            for (let i = 0; i < njiEntity.products.length; i++) {
                const items = njiEntity.products[i];
                if (!snHashMapper[items.sn]) snHashMapper[items.sn] = [];
                const result = await this.service[this.selfServiceName].targetSourceContainInfo({ sn: items.sn, _id: items._id });
                snHashMapper[items.sn].unshift(result.data);
            }
        }
        const resArr = [];
        for (const key in snHashMapper) {
            const o = {};
            o[key] = snHashMapper[key];
            resArr.push(o);
        }
        return {
            code: 200,
            msg: '查询成功',
            data: resArr,
        };
    }

    /**
     * 收到新增模板的消息
     * 配合create方法
     * @param {object} params 参数
     */
    async receiveNewItem(params) {
        const { sn, mongoId, unionid } = params;
        const result = await this.ownerSource.findOne({
            unionid,
        });
        if (result) {
            const { products } = result;
            products.push({
                _id: mongoId,
                sn,
            });
            await this.ownerSource.updateOne({
                _id: result._id,
            }, {
                products,
            });
        } else {
            await this.ownerSource.create({
                unionid,
                products: [{ _id: mongoId, sn }],
            });
        }
    }

    /**
     * 收到移除模板的消息
     * 配合destroy方法
     * @param {object} params 参数
     */
    async receiveRemoveItem(params) {
        const { _id, unionid } = params;
        const result = await this.ownerSource.findOne({
            unionid,
        });
        let { products } = result;
        products = products.filter(items => String(items._id).toString() !== _id);
        await this.ownerSource.updateOne({
            _id: result._id,
        }, {
            products,
        });
    }
}

module.exports = BaseBackupService;
