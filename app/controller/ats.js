'use strict';

const Controller = require('egg').Controller;

class AtsController extends Controller {
    async index() {
        const { sn } = this.ctx.params;
        const result = await this.service.ats.index(sn);
        this.ctx.body = result;
    }

    async show() {
        const { sn, atsName } = this.ctx.params;
        const result = await this.service.ats.show(sn, atsName);
        this.ctx.body = result;
    }

    async create() {
        const formData = this.ctx.request.body;
        const { sn, atsName } = this.ctx.params;
        const { unionid } = this.ctx.session;
        formData.sn = sn;
        formData.atsName = atsName;
        formData.unionid = unionid;
        const result = await this.service.ats.create(formData);
        this.ctx.body = result;
    }
}

module.exports = AtsController;
