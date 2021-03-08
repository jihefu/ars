'use strict';

const Service = require('egg').Service;

class SourceService extends Service {

    /**
     * 产品相关资源
     * @param { string } sn - 序列号
     * @param { object } params - 参数
     */
    async ctrlInfo(sn, params) {
        const tokenRes = this.service.login.openCreateToken({
            payload: {},
        });
        const { token } = tokenRes.data;
        const result = await this.ctx.curl(this.app.config.langjieServerUrl + '/home/source/product/' + sn, {
            dataType: 'json',
            headers: {
                token,
            },
        });
        if (result.data.code === 401) {
            return result.data;
        }
        if (result.data.code === -1) {
            result.data.code = 400;
            return result.data;
        }
        const data = result.data.data;
        // 获取nji数据
        const njiList = await this.service.vtcNji.index({ sn });
        data.vtc = njiList.data;
        // 获取ini数据
        const iniList = await this.service.ini.index({ sn });
        data.ini = iniList.data;
        for (const key in params) {
            if (data[key] && (data[key] instanceof Array) && data[key].length !== 0 && data[key][0].column_name) {
                const o = {};
                for (let i = 0; i < data[key].length; i++) {
                    o[data[key][i].column_name] = data[key][i].val;
                }
                params[key] = o;
            } else {
                params[key] = data[key];
            }
        }
        return {
            code: 200,
            msg: '查询成功',
            data: params,
        };
    }
}

module.exports = SourceService;
