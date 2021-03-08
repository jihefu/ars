'use strict';

const Service = require('egg').Service;
const Member = require('../sequelize').Member;
const { sendMQ } = require('../util/rabbitmq');

class LoginService extends Service {

    /**
     * 公开的
     * 生成token
     * @param {object} params 参数
     */
    openCreateToken(params) {
        const { expiresion } = params;
        const payload = typeof params.payload === 'string' ? JSON.parse(params.payload) : params.payload;
        const result = new this.ctx.helper.TokenUtils({ expiresion }).create(payload);
        return { code: 200, msg: '登陆成功', data: result };
    }

    /**
     * 公开的
     * 检查token
     * @param {string} token token
     */
    openCheckToken(token) {
        const result = new this.ctx.helper.TokenUtils({}).check(token);
        return result;
    }

    /**
     * 验证手机号码是否是会员
     * @param {string} phone 手机号码
     */
    async checkMemberExist(phone) {
        const memberRes = await Member.findOne({ where: { phone, isdel: 0 } });
        if (!memberRes) return this.ctx.response.CommonError.unauthorizedAccess('不存在该会员');
        return { code: 200 };
    }

    /**
     * 根据phone生成token
     * @param {Object} params 参数
     */
    async createToken(params) {
        const { phone, appName } = params;
        const memberRes = await Member.findOne({ where: { phone, isdel: 0 } });
        if (!memberRes) return this.ctx.response.CommonError.unauthorizedAccess('不存在该会员');
        let { unionid } = memberRes.dataValues;
        // 判断unionid是否为代理unionid
        // 请求老服务器，获取有效的unionid
        const idResult = await this.ctx.curl(this.app.config.langjieServerUrl + '/open/member/getEffectUnionid/' + unionid, {
            dataType: 'json',
        });
        unionid = idResult.data.data.unionid;
        return await this.service.login.getTokenByUnionid(unionid, appName);
    }

    /**
     * 根据unionid生成token
     * @param {string} unionid unionid
     * @param {string} appName appName
     */
    async getTokenByUnionid(unionid, appName) {
        const result = this.service.login.openCreateToken({ payload: { unionid } });
        const memberEntity = await Member.findOne({ where: { unionid } });
        result.data.unionid = unionid;
        result.data.name = memberEntity.dataValues.name;
        result.data.phone = memberEntity.dataValues.phone;
        result.data.company = memberEntity.dataValues.company;
        this.sendLoginMq(unionid, appName);
        return {
            code: 200,
            msg: '验证成功',
            data: result.data,
        };
    }

    /**
     * 发送云登录mq消息  private
     * @param {string} unionid unionid
     * @param {string} appName appName
     */
    async sendLoginMq(unionid, appName) {
        appName = appName ? appName : '';
        sendMQ.sendQueueMsg('memberActivity', JSON.stringify({
            _class: 'login',
            unionid,
            appName,
        }), () => {});
    }

    /**
     * 客户端轮询
     * @param {number} sn 序列号
     */
    async poll(sn) {
        let result = await this.app.redis.get('qrcode_' + sn);
        if (result) {
            result = JSON.parse(result);
            // 发送云登录消息
            this.sendLoginMq(result.data.unionid, result.data.appName);
            return result;
        }
        return {
            code: 404,
            msg: '不存在',
        };
    }

    /**
     * 补未录入系统的序列号
     * @param {number} serialNo 序列号
     */
    async postCardFromClient(serialNo) {
        const { token } = this.service.login.openCreateToken({ payload: {} }).data;
        const result = await this.ctx.curl(this.app.config.langjieServerUrl + '/home/virProducts/postCardFromClient', {
            dataType: 'json',
            data: {
                serialNo,
            },
            headers: {
                token,
            },
            method: 'POST',
        });
        return result.data;
    }
}

module.exports = LoginService;
