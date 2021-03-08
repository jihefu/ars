'use strict';

const Controller = require('egg').Controller;
const qr = require('qr-image');

class LoginController extends Controller {

    /**
     * 公开的
     * 生成token
     */
    async openCreateToken() {
        const params = this.ctx.request.body;
        const result = await this.service.login.openCreateToken(params);
        this.ctx.body = result;
    }

    /**
     * 公开的
     * 检查token
     */
    async openCheckToken() {
        const { token } = this.ctx.request.body;
        const result = await this.service.login.openCheckToken(token);
        this.ctx.body = result;
    }

    /**
     * 获取验证码
     */
    async getVerCode() {
        const params = this.ctx.request.body;
        const { phone } = params;
        if (phone.length !== 11) {
            this.ctx.body = this.ctx.response.CommonError.notAllowed('手机号码格式错误');
            return false;
        }
        // 验证手机号码是否是会员
        const checkRes = await this.service.login.checkMemberExist(phone);
        if (checkRes.code !== 200) {
            this.ctx.body = checkRes;
            return false;
        }
        const code = createCode();
        // redis存下该手机号对应的验证码，有效时间为10分钟
        await this.ctx.app.redis.set(phone, code);
        await this.ctx.app.redis.expire(phone, 60 * 10);
        console.log(code);
        const result = await this.ctx.curl(this.app.config.smsVerCodeUrl, {
            method: 'GET',
            contentType: 'json',
            data: {
                code,
                mobile: phone,
            },
            dataType: 'json',
        });
        this.ctx.body = result.data;

        // 创建随机6位数验证码
        function createCode() {
            let _code = '';
            const codeLength = 4;
            const codeChars = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
            for (let i = 0; i < codeLength; i++) {
                const charNum = Math.floor(Math.random() * 10);
                _code += codeChars[charNum];
            }
            _code = Number(_code);
            return _code;
        }
    }

    /**
     * 登陆校验
     */
    async checkVerCode() {
        const params = this.ctx.request.body;
        const { phone, verCode, appName } = params;
        const result = await this.ctx.app.redis.get(phone);
        if (result && verCode === result) {
            // 生成token返回
            const result = await this.service.login.createToken({
                phone,
                appName,
            });
            this.ctx.body = result;
        } else {
            if (!result) {
                // 验证码已过期
                this.ctx.body = this.ctx.response.CommonError.unauthorizedAccess('验证码已过期');
            } else {
                // 验证码错误
                this.ctx.body = this.ctx.response.CommonError.unauthorizedAccess('验证码错误');
            }
        }
    }

    /**
     * 直接通过unionid获取token
     */
    async getTokenByUnionid() {
        const { unionid, appName } = this.ctx.request.body;
        const result = await this.service.login.getTokenByUnionid(unionid, appName);
        this.ctx.body = result;
    }

    /**
     * 下载客户端登陆二维码
     */
    async downloadQrcodeImage() {
        const { sn } = this.ctx.params;
        this.service.login.postCardFromClient(sn);
        let { appName } = this.ctx.query;
        appName = appName ? appName : '';
        const qrUrl = this.app.config.langjieServerUrl + '/service/product/client/' + sn + '?timestamp=' + Date.now() + '&appName=' + appName;
        const qrPng = qr.image(qrUrl, { type: 'png' });
        this.ctx.set('content-type', 'image/png');
        this.ctx.body = qrPng;
    }

    /**
     * 客户端登陆轮询
     */
    async poll() {
        const { sn } = this.ctx.params;
        const result = await this.service.login.poll(sn);
        this.ctx.body = result;
    }

    async saveTokenInfo() {
        const { sn } = this.ctx.params;
        const { data } = this.ctx.request.body;
        this.app.redis.set('qrcode_' + sn, data);
        this.app.redis.expire('qrcode_' + sn, 10);
        this.ctx.body = {
            code: 200,
            msg: '已存储',
        };
    }
}

module.exports = LoginController;
