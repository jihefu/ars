'use strict';

const Controller = require('egg').Controller;

class VtcCfgTemp extends Controller {

    // 公共模板
    async index() {
        const params = this.ctx.query;
        const result = await this.service.vtcCfgTemp.index(params);
        this.ctx.body = result;
    }

    // 私有模板
    async selfIndex() {
        const params = this.ctx.query;
        const { unionid } = this.ctx.session;
        params.unionid = unionid;
        const result = await this.service.vtcCfgTemp.index(params);
        this.ctx.body = result;
    }

    async show() {
        const { id } = this.ctx.params;
        const result = await this.service.vtcCfgTemp.show(id);
        this.ctx.body = result;
    }

    async showLabel() {
        const { name } = this.ctx.params;
        const result = await this.service.vtcCfgTemp.showLabel(name);
        this.ctx.body = result;
    }

    async destorySelf() {
        const { name } = this.ctx.params;
        const { unionid } = this.ctx.session;
        const result = await this.service.vtcCfgTemp.destory(unionid, name, false);
        this.ctx.body = result;
    }

    async updateSelf() {
        const params = this.ctx.request.body;
        const { name } = this.ctx.params;
        const { unionid } = this.ctx.session;
        params.unionid = unionid;
        const result = await this.service.vtcCfgTemp.update(params, name, false);
        this.ctx.body = result;
    }

    async destoryPublic() {
        const { name } = this.ctx.params;
        const { unionid } = this.ctx.session;
        const result = await this.service.vtcCfgTemp.destory(unionid, name, true);
        this.ctx.body = result;
    }

    async updatePublic() {
        const params = this.ctx.request.body;
        const { name } = this.ctx.params;
        const { unionid } = this.ctx.session;
        params.unionid = unionid;
        const result = await this.service.vtcCfgTemp.update(params, name, true);
        this.ctx.body = result;
    }

    async updateMachineTypeToOtherId() {
        const params = this.ctx.request.body;
        const result = await this.service.vtcCfgTemp.updateMachineTypeToOtherId(params);
        this.ctx.body = result;
    }

    async buildPublic() {
        const result = await this.service.vtcCfgTemp.buildDownload();
        this.ctx.body = result;
    }

    async buildSelf() {
        const { unionid } = this.ctx.session;
        const result = await this.service.vtcCfgTemp.buildDownload(unionid);
        this.ctx.body = result;
    }

    async factoryModel() {
        const url = this.ctx.app.config.langjieServerUrl + '/open/action/factoryModel';
        const result = await this.ctx.curl(url, {
            // 自动解析 JSON response
            dataType: 'json',
            // 3 秒超时
            timeout: 3000,
        });
        this.ctx.body = result.data;
    }

    async solutionType() {
        const url = this.ctx.app.config.langjieServerUrl + '/open/action/solutionType';
        const result = await this.ctx.curl(url, {
            // 自动解析 JSON response
            dataType: 'json',
            // 3 秒超时
            timeout: 3000,
        });
        this.ctx.body = result.data;
    }

    async getAllCusList() {
        const url = this.ctx.app.config.langjieServerUrl + '/open/action/getAllCusList';
        const result = await this.ctx.curl(url, {
            // 自动解析 JSON response
            dataType: 'json',
            // 3 秒超时
            timeout: 3000,
        });
        this.ctx.body = result.data;
    }
}

module.exports = VtcCfgTemp;
