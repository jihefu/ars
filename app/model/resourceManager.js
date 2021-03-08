'use strict';

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const conn = app.mongooseDB.get('source');

    const ResourceManagerSchema = new Schema({
        category: String,
        resourceId: Schema.Types.Mixed,
        summary: {
            title: String,
            img: String,
            smallImg: String,
            author: String,
            createPerson: String,
            createTime: { type: Date, default: Date.now() },
            updatePerson: String,
            updateTime: { type: Date, default: Date.now() },
        },
        state: {
            operStatus: String,
            isdel: { type: Number, default: 0 },
            mark: { type: Number, default: 0 },
            isTop: { type: Number, default: 0 },
        },
        powerRange: {
            read: Schema.Types.Mixed,
            write: Schema.Types.Mixed,
        },
    }, {
        timestamps: true,
    });

    return conn.model('ResourceManager', ResourceManagerSchema);
};
