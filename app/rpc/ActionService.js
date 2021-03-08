'use strict';

exports.show = async function(req) {
    const { sn } = req;
    const res = await this.service.actionReg.show(sn);
    try {
        res.data = JSON.stringify(res.data);
    } catch (e) {
        console.log(e);
    }
    return res;
};

exports.update = async function(req) {
    const res = await this.service.actionReg.update(req);
    try {
        res.data = JSON.stringify(res.data);
    } catch (e) {
        console.log(e);
    }
    return res;
};

exports.create = async function(req) {
    const res = await this.service.actionReg.create(req);
    try {
        res.data = JSON.stringify(res.data);
    } catch (e) {
        console.log(e);
    }
    return res;
};

exports.destroy = async function(req) {
    const { sn } = req;
    const res = await this.service.actionReg.destroy(sn);
    try {
        res.data = JSON.stringify(res.data);
    } catch (e) {
        console.log(e);
    }
    return res;
};
