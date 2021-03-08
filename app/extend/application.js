'use strict';

const moment = require('moment');

module.exports = {
    TIME: t => moment(t).format('YYYY-MM-DD HH:mm:ss'),
};
