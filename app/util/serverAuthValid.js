'use strict';
const crypto = require('crypto');

const AUTH_PRIMARY_KEY = 'langjie@network';

module.exports = {
    validate: (aesStr, sn) => {
		const signature = crypto.createHash('md5').update(sn + AUTH_PRIMARY_KEY).digest('hex');
        if (signature === aesStr) return true;
        return false;
    },
};
