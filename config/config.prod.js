'use strict';

module.exports = () => {
    const config = exports = {};
    config.mysqlHost = 'www.langjie.com';
    config.debug = false;
    config.langjieServerUrl = 'https://wx.langjie.com';
    config.rabbitMQHost = 'wx.langjie.com';

    return config;
};
