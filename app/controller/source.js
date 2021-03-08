'use strict';

const Controller = require('egg').Controller;

class SourceController extends Controller {
    async ctrlInfo() {
        const params = this.ctx.query;
        const { sn } = this.ctx.params;
        const result = await this.service.source.ctrlInfo(sn, params);
        this.ctx.body = result;
    }
}

module.exports = SourceController;
