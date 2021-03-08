'use strict';

const Service = require('egg').Service;

class ActionRegService extends Service {

	async show(sn) {
        const regEntity = await this.ctx.model.ActionReg.findResource(sn);
        if (!regEntity || regEntity.resourceInfo.state.isdel === 1) return this.ctx.response.CommonError.notExist('暂无该序列号注册信息', sn);
        return {
            code: 200,
            msg: '查询成功',
            data: {
                sn: regEntity.sn,
                mid: regEntity.mid,
                regCode: regEntity.regCode ? regEntity.regCode : '',
                authOperKey: regEntity.authOperKey ? regEntity.authOperKey : '',
                validDate: regEntity.validDate ? regEntity.validDate : '',
                regDate: regEntity.regDate ? regEntity.regDate : '',
                regPerson: regEntity.regPerson ? regEntity.regPerson : '',
                appRegCode: regEntity.appRegCode ? regEntity.appRegCode : '',
                appAuthOperKey: regEntity.appAuthOperKey ? regEntity.appAuthOperKey : '',
                appValidDate: regEntity.appValidDate ? regEntity.appValidDate : '',
                appRegDate: regEntity.appRegDate ? regEntity.appRegDate : '',
                appRegPerson: regEntity.appRegPerson ? regEntity.appRegPerson : '',
            },
        };
    }

    async create(params) {
        const { sn } = params;
        const regEntity = await this.ctx.model.ActionReg.findResource(sn);
        // 已经存在
        if (regEntity && regEntity.resourceInfo.state.isdel === 0) {
            return this.ctx.response.CommonError.isExist('已存在该序列号', sn);
        }
        // 软删除
        if (regEntity && regEntity.resourceInfo.state.isdel === 1) {
            // 把资源和资源信息永久删除
            await this.ctx.model.ActionReg.deleteResource(sn);
        }
        await this.ctx.model.ActionReg.createResource(params);
        return {
            code: 200,
            msg: '新增成功',
            data: [],
        };
    }

    async update(params) {
        await this.ctx.model.ActionReg.updateResource(params);
        return {
            code: 200,
            msg: '更新成功',
            data: [],
        };
    }

    async destroy(sn) {
        await this.ctx.model.ActionReg.destroyResource(sn);
        return {
            code: 200,
            msg: '删除成功',
            data: [],
        };
    }
}

module.exports = ActionRegService;
