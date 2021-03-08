'use strict';

const Controller = require('egg').Controller;

class BaseBackupCls extends Controller {

    constructor(props) {
        super(props);
        this.serviceName;
    }

    async index() {
        const { sn } = this.ctx.params;
        const params = this.ctx.query;
        params.sn = sn;
        const res = await this.serviceName.index(params);
        this.ctx.body = res;
    }

    async indexAll() {
        const { sn } = this.ctx.params;
        const params = this.ctx.query;
        params.sn = sn;
        const res = await this.serviceName.indexAll(params);
        this.ctx.body = res;
    }

    async show() {
        const { sn } = this.ctx.params;
        const res = await this.serviceName.show(sn);
        this.ctx.body = res;
    }

    async create() {
        const { sn } = this.ctx.params;
        const params = this.ctx.request.body;
        const unionid = this.ctx.session.unionid;
        // params.sn = sn;
        // params.unionid = unionid;
        const res = await this.serviceName.create(params, {
            sn,
            unionid,
        });
        this.ctx.body = res;
    }

    async destroy() {
        const { sn, _id } = this.ctx.params;
        const unionid = this.ctx.session.unionid;
        const res = await this.serviceName.destroy({
            sn,
            _id,
            unionid,
        });
        this.ctx.body = res;
    }

    async selfList() {
        const unionid = this.ctx.session.unionid;
        const res = await this.serviceName.selfList(unionid);
        this.ctx.body = res;
    }

    async targetBackupInfo() {
        const { _id, sn } = this.ctx.params;
        const res = await this.serviceName.targetBackupInfo({
            sn,
            _id,
        });
        this.ctx.body = res;
    }

    async targetSourceContainInfo() {
        const { _id, sn } = this.ctx.params;
        const res = await this.serviceName.targetSourceContainInfo({
            sn,
            _id,
        });
        this.ctx.body = res;
    }
}

module.exports = BaseBackupCls;
