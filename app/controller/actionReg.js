'use strict';

const Controller = require('egg').Controller;

class ActionRegController extends Controller {

	async show() {
		const { ctx } = this;
		const { id } = ctx.params;
		if (!/^\d*$/.test(id)) {
			ctx.body = this.ctx.response.CommonError.invalidParams('序列号必须为数字', id);
			return;
		}
		const res = await this.service.actionReg.show(id);
		ctx.body = res;
	}

	async create() {
		const { ctx } = this;
		const params = this.ctx.request.body;
		const res = await this.service.actionReg.create(params);
		ctx.body = res;
	}

	async update() {
		const { ctx } = this;
		const params = this.ctx.request.body;
		const res = await this.service.actionReg.update(params);
		ctx.body = res;
	}

	async destroy() {
		const { ctx } = this;
		const sn = ctx.params.id;
		const res = await this.service.actionReg.destroy(sn);
		ctx.body = res;
	}
}

module.exports = ActionRegController;
