'use strict';

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const conn = app.mongooseDB.get('source');

    const VtcNjiOwnerSchema = new Schema({
        unionid: {
            type: String,
        },
        products: {
            type: Schema.Types.Mixed,
        },
    }, {
        timestamps: true,
    });

    return conn.model('NjiOwner', VtcNjiOwnerSchema);
};
