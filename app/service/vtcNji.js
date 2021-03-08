'use strict';

const BaseBackupCls = require('./baseBackupCls');

// 继承备份服务Service类
class VtcNjiService extends BaseBackupCls {
    constructor(props) {
        super(props);
        this.collectionName = 'source';
        this.tagNamedb = 'source';
        this.tag = 'njiInfo';
        this.ownerSource = this.ctx.model.VtcNjiOwner;
        this.selfServiceName = 'vtcNji';
        this.contentName = 'njiContent';
    }

    /**
     * 根据unionid获取公司已备份过的实例
     * @param {string} unionid unionid
     */
    async getCpySnListByUnionid(unionid) {
        const totalUnionidArr = await this.service.member.getCpyMemberListByUnionid(unionid);
        const result = await this.ownerSource.find({
            unionid: { $in: totalUnionidArr },
        });
        let snArr = [];
        result.forEach(items => {
            const { products } = items;
            products.forEach(it => snArr.push(Number(it.sn)));
        });
        snArr = [ ...new Set(snArr) ];
        snArr = snArr.sort((a, b) => (a - b));
        return { code: 200, data: snArr };
    }
}

module.exports = VtcNjiService;
