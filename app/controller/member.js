'use strict';

const Controller = require('egg').Controller;

class MemberController extends Controller {
    /**
     * 自身会员信息
     */
    async selfInfo() {
        const { unionid } = this.ctx.session;
        const result = await this.service.member.selfInfo(unionid);
        this.ctx.body = result;
    }

    async show() {
        const { unionid } = this.ctx.params;
        const result = await this.service.member.selfInfo(unionid);
        this.ctx.body = result;
    }

    async getVirtualCtrlBySn() {
        const { sn } = this.ctx.params;
        const { fullInfo } = this.ctx.query;
        const result = await this.service.member.getVirtualCtrlBySn(sn, fullInfo);
        this.ctx.body = result;
    }
}

module.exports = MemberController;
