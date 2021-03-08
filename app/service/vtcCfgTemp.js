'use strict';

const Service = require('egg').Service;
const Member = require('../sequelize').Member;
const ObjectID = require('mongodb').ObjectID;
const iconv = require('iconv-lite');
const CFGDB = 'source';

class VtcCfgTemp extends Service {

    async index(params) {
        const { unionid } = params;
        const where = { isdel: 0 };
        let model = 'VtcCfgTemp';
        if (unionid) {
            model = 'VtcCfgTempSelf';
            where.author = unionid;
        }
        const listEntity = await this.app.mongo.get(CFGDB).find(model, {
            query: where,
            sort: [[ 'createdAt', -1 ]],
        });
        // 转换author
        const memberMapper = await this.service.vtcCfgTemp.getMemberMapper();
        listEntity.forEach((items, index) => {
            try {
                listEntity[index].authorName = memberMapper[items.author].name;
            } catch (e) {
                listEntity[index].authorName = '未知';
            }
        });
        return {
            code: 200,
            msg: '查询成功',
            data: listEntity,
        };
    }

    async show(id) {
        const entity = await this.app.mongo.get(CFGDB).findOne('virCfgContent', {
            query: {
                _id: ObjectID(id),
            },
        });
        return {
            code: 200,
            msg: '查询成功',
            data: entity,
        };
    }

    async showLabel(name) {
        const entity = await this.app.mongo.get(CFGDB).findOne('VtcCfgTemp', {
            query: {
                name,
                isdel: 0,
            },
        });
        if (entity) {
            const memberEntity = await Member.findOne({ where: { unionid: entity.author } });
            try {
                entity.authorName = memberEntity.dataValues.name;
            } catch (e) {
                entity.authorName = '';
            }
        }
        return {
            code: 200,
            msg: '查询成功',
            data: entity,
        };
    }

    async destory(unionid, name, isPublic) {
        const updateWhere = { name, isdel: 0 };
        let model = 'VtcCfgTemp';
        if (!isPublic) {
            model = 'VtcCfgTempSelf';
            updateWhere.author = unionid;
        }
        // 检查是否非法访问
        const result = await this.service.vtcCfgTemp.checkHasPowerModify(name, unionid, model);
        if (result.code !== 200) return result;
        await this.app.mongo.get(CFGDB).updateMany(model, {
            filter: updateWhere,
            update: {
                $set: { isdel: 1 },
            },
        });
        // const entity = await this.ctx.model[model].updateOne(updateWhere, {
        //     isdel: 1,
        // });
        return {
            code: 200,
            msg: '删除成功',
            data: [],
        };
    }

    async update(params, name, isPublic) {
        const { unionid } = params;
        const updateWhere = { name, isdel: 0 };
        let model = 'VtcCfgTemp';
        if (!isPublic) {
            model = 'VtcCfgTempSelf';
            updateWhere.author = unionid;
        }

        // 检查是否非法访问
        const result = await this.service.vtcCfgTemp.checkHasPowerModify(name, unionid, model);
        // 这两行适配原接口
        let content = params.config;
        params = params.info;
        // 20210121新增delete
        delete params._id;
        delete params.authorName;
        delete params.contentId;
        if (result.code === 404) {
            delete content._id;
            // 资源不存在，需要创建
            params.author = unionid;
            params.name = name;
            // 读取部分属性
            const extendsProps = this.service.vtcCfgTemp.parseInfoFromContent(content);
            params = { ...params, ...extendsProps };
            content = await this.service.vtcCfgTemp.transToUtf8(content);
            const contentResult = await this.app.mongo.get(CFGDB).insertOne('virCfgContent', {
                doc: content,
            });
            params.contentId = contentResult.insertedId;
            params.createdAt = this.app.TIME();
            params.updatedAt = this.app.TIME();
            params.updatedPerson = unionid;
            params.isdel = 0;
            params.updateCount = 0;
            params.suitableProductList = params.suitableProductList ? params.suitableProductList : [];
            const entity = await this.app.mongo.get(CFGDB).insertOne(model, {
                doc: params,
            });
            // const entity = await this.ctx.model[model].create(params);
            return {
                code: 200,
                msg: '新增成功',
                data: entity,
            };
        } else if (result.code === 401) {
            return result;
        }
        // 更新资源
        // 需要判断是否私有模板20210121新增
        let prevEntity;
        if (isPublic) {
            prevEntity = await this.app.mongo.get(CFGDB).findOne(model, { query: { isdel: 0, name } });
        } else {
            prevEntity = await this.app.mongo.get(CFGDB).findOne(model, { query: { isdel: 0, name, author: unionid } });
        }
        let { updateCount, contentId } = prevEntity;
        updateCount++;
        params.updateCount = updateCount;
        if (content) {
            delete content._id;
            content = await this.service.vtcCfgTemp.transToUtf8(content);
            await this.app.mongo.get(CFGDB).updateMany('virCfgContent', {
                filter: {
                    _id: contentId,
                },
                update: {
                    $set: content,
                },
            });
            // 读取部分属性
            const extendsProps = this.service.vtcCfgTemp.parseInfoFromContent(content);
            params = { ...params, ...extendsProps };
        }
        params.updatedAt = this.app.TIME();
        params.updatedPerson = unionid;
        delete params.author;
        await this.app.mongo.get(CFGDB).updateMany(model, {
            filter: updateWhere,
            update: {
                $set: params,
            },
        });
        // const resultEntity = await this.ctx.model[model].updateOne(updateWhere, params);
        return {
            code: 200,
            msg: '更新成功',
            data: [],
        };
    }

    async updateMachineTypeToOtherId(params) {
        let { otherTypeId, isdelMachineTypeIdArr } = params;
        isdelMachineTypeIdArr = isdelMachineTypeIdArr.map(items => Number(items));
        await this.app.mongo.get(CFGDB).updateMany('VtcCfgTemp', {
            filter: {
                machineType: { $in: isdelMachineTypeIdArr },
            },
            update: {
                $set: {
                    machineType: otherTypeId,
                },
            },
        });
        return {
            code: 200,
            msg: '更新成功',
            data: [],
        };
    }

    async buildDownload(unionid) {
        let model = 'VtcCfgTemp';
        const where = { isdel: 0 };
        if (unionid) {
            model = 'VtcCfgTempSelf';
            where.author = unionid;
        }
        const labelResult = await this.app.mongo.get(CFGDB).find(model, {
            query: where,
            sort: [[ 'createdAt', -1 ]],
        });
        // 转换author
        const memberMapper = await this.service.vtcCfgTemp.getMemberMapper();
        labelResult.forEach((items, index) => {
            try {
                labelResult[index].authorName = memberMapper[items.author].name;
            } catch (e) {
                labelResult[index].authorName = '未知';
            }
        });
        // eslint-disable-next-line one-var-declaration-per-line
        const _p = [], resArr = [];
        labelResult.forEach((items, index) => {
            const i = index;
            _p[index] = new Promise(async resolve => {
                const content = await this.app.mongo.get(CFGDB).findOne('virCfgContent', {
                    query: {
                        _id: items.contentId,
                    },
                });
                resArr[i] = {
                    info: labelResult[i],
                    config: content,
                };
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

    // 检查是否非法访问
    async checkHasPowerModify(name, unionid, model) {
        if (model === 'VtcCfgTemp') {
            // 判断是否为朗杰员工
            const memberResult = await this.service.member.selfInfo(unionid);
            const { company } = memberResult.data.dataValues;
            if (company !== '杭州朗杰测控技术开发有限公司') {
                return this.ctx.response.CommonError.unauthorizedAccess('无权限操作');
            }
            const result = await this.app.mongo.get(CFGDB).findOne(model, {
                query: { name, isdel: 0 },
            });
            if (!result) return this.ctx.response.CommonError.notExist('该资源不存在');
        } else {
            // 判断是否为该资源的所有者
            const result = await this.app.mongo.get(CFGDB).findOne(model, {
                query: { name, author: unionid, isdel: 0 },
            });
            if (!result) return this.ctx.response.CommonError.notExist('该资源不存在');
            // const { author } = result;
            // if (unionid !== author) {
            //     return this.ctx.response.CommonError.unauthorizedAccess('无权限操作');
            // }
        }
        return { code: 200 };
    }

    // 解析配置文件里面的摘要信息
    parseInfoFromContent(params) {
        const formData = {};
        try {
            formData.channelNum = params.vinChnls.length;
        } catch (e) {
            formData.channelNum = 0;
        }
        try {
            formData.axiosNum = params.controllers.length;
        } catch (e) {
            formData.axiosNum = 0;
        }
        try {
            formData.cardNum = params.virCards.length;
        } catch (e) {
            formData.cardNum = 0;
        }
        try {
            formData.remarks = params.remarks;
        } catch (error) {
            formData.remarks = [];
        }
        try {
            const actuatorClassArr = params.actuators[0].class.split('.');
            formData.actuator = actuatorClassArr[ actuatorClassArr.length - 1 ];
        } catch (e) {
            formData.actuator = '';
        }
        return formData;
    }

    // 获取unionid的映射表
    async getMemberMapper() {
        const result = await Member.findAll({
            attributes: [ 'unionid', 'name' ],
        });
        const hashMapper = {};
        result.forEach(items => {
            hashMapper[items.dataValues.unionid] = items.dataValues;
        });
        return hashMapper;
    }

    async transToUtf8(content) {
        content = typeof content === 'string' ? content : JSON.stringify(content);
        const buf = Buffer.from(content);
        const contentStr = iconv.encode(buf, 'utf8');
        return JSON.parse(contentStr);
    }
}

module.exports = VtcCfgTemp;
