'use strict';

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const conn = app.mongooseDB.get('source');

    const RegInfoSchema = new Schema({
        sn: {
            type: Number,
        },
        mid: {
            type: Number,
        },
        regCode: {
            type: Number,
        },
        authOperKey: {
            type: Number,
        },
        validDate: {
            type: String,
        },
        regDate: {
            type: Date,
        },
        regPerson: {
            type: String,
        },
        appRegCode: {
            type: Number,
        },
        appAuthOperKey: {
            type: Number,
        },
        appValidDate: {
            type: String,
        },
        appRegDate: {
            type: Date,
        },
        appRegPerson: {
            type: String,
        },
        resourceInfo: {
            type: Schema.Types.ObjectId,
            ref: 'ResourceManager',
        },
    }, {
        timestamps: true,
    });

    // 创建资源和资源管理信息
    RegInfoSchema.statics.createResource = async function(formData) {
        const res = await app.model.ResourceManager.create({
            category: 'action.reg',
            resourceId: formData.sn,
        });
        formData.resourceInfo = res._id;
        return await this.create(formData);
    };

    // 查找资源和资源管理信息
    RegInfoSchema.statics.findResource = async function(sn) {
        return await this.findOne({ sn }).populate('resourceInfo');
    };

    // 永久删除资源和资源管理信息
    RegInfoSchema.statics.deleteResource = async function(sn) {
        const res = await this.findResource(sn);
        const infoId = res.resourceInfo._id;
        await app.model.ResourceManager.remove({ _id: infoId });
        return await this.remove({ sn });
    };

    // 软删除资源
    RegInfoSchema.statics.destroyResource = async function(sn) {
        const res = await this.findResource(sn);
        const infoId = res.resourceInfo._id;
        return await app.model.ResourceManager.updateOne({
            _id: infoId,
        }, {
            $set: {
                'summary.updateTime': app.TIME(),
                'state.isdel': 1,
            },
        });
    };

    // 更新资源
    RegInfoSchema.statics.updateResource = async function(params) {
        const { sn } = params;
        const res = await this.findResource(sn);
        const infoId = res.resourceInfo._id;
        await this.updateOne({
            sn,
        }, params);
        return await app.model.ResourceManager.updateOne({
            _id: infoId,
        }, {
            $set: {
                'summary.updateTime': app.TIME(),
            },
        });
    };

    return conn.model('RegInfo', RegInfoSchema);
};
