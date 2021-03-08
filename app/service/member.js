'use strict';

const Service = require('egg').Service;
const Member = require('../sequelize').Member;

class MemberService extends Service {

    /**
     * 会员信息
     * @param { string } unionid - unionid
     */
    async selfInfo(unionid) {
        const memberEntity = await Member.findOne({
            attributes: [ 'name', 'phone', 'gender', 'birth', 'portrait', 'addr', 'college', 'major', 'company', 'job', 'open_id', 'checked' ],
            where: { unionid },
        });
        if (memberEntity) {
            const accessResult = await this.ctx.curl(this.app.config.wxStaticUrl + '/wx/getToken', {
                dataType: 'json',
            });
            const infoResult = await this.ctx.curl(this.app.config.wxStaticUrl + '/wx/getUserInfo', {
                dataType: 'json',
                data: {
                    access_token: accessResult.data.access_token,
                    openid: memberEntity.open_id,
                },
            });
            memberEntity.dataValues.nickname = infoResult.data.nickname;
            const headImg = infoResult.data.headimgurl;
            if (headImg) {
                memberEntity.dataValues.portrait = headImg;
            } else {
                if (memberEntity.dataValues.portrait) {
                    memberEntity.dataValues.portrait = this.app.config.wxStaticUrl + '/img/member/' + memberEntity.dataValues.portrait;
                } else {
                    memberEntity.dataValues.portrait = this.app.config.wxStaticUrl + '/img/default_member2.jpg';
                }
            }
        }
        return {
            code: 200,
            msg: '查询成功',
            data: memberEntity,
        };
    }

    async basicInfo(unionid) {
        const memberEntity = await Member.findOne({
            attributes: [ 'name', 'phone', 'gender', 'birth', 'portrait', 'addr', 'college', 'major', 'company', 'job', 'open_id', 'checked' ],
            where: { unionid },
        });
        return {
            code: 200,
            msg: '',
            data: memberEntity,
        };
    }

    /**
     * 根据unionid获取公司所有人的unionid
     * @param {string} unionid unionid
     */
    async getCpyMemberListByUnionid(unionid) {
        const memberEntity = await Member.findOne({
            attributes: [ 'company', 'isUser' ],
            where: { unionid },
        });
        const { company, isUser } = memberEntity.dataValues;
        if (isUser) {
            return [ unionid ];
        }
        const memberList = await Member.findAll({
            attributes: [ 'unionid' ],
            where: { company, isUser: 0, checked: 1, check_company: 1, check_job: 1 },
        });
        const unionidArr = memberList.map(items => items.dataValues.unionid);
        return unionidArr;
    }

    async getVirtualCtrlBySn(sn, fullInfo) {
        // 获取tar文件实例
        const tarInstance = await this.service.tarInstance.show(sn);
        const vtcInstance = await this.service.vtcNji.show(sn, true);
        const atsEntityList = await this.service.ats.index(sn);
        if (tarInstance.code === 404) {
            return tarInstance;
        }
        const ats_list = atsEntityList.data.map(items => {
            return {
                ats_id: items.contentId,
                ats_name: items.atsName,
            };
        });
        let resultData;
        if (fullInfo) {
            resultData = {
                tar: tarInstance.data,
                vtc: vtcInstance.data,
                ats_list,
            };
        } else {
            resultData = {
                tar: tarInstance ? tarInstance.data.config : null,
                vtc_id: vtcInstance ? vtcInstance.data.config._id : null,
                ats_list,
            };
        }
        return {
            code: 200,
            msg: '',
            data: resultData,
        };
    }
}

module.exports = MemberService;
