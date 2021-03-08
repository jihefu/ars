'use strict';
const amqp = require('amqplib');
const defaultConfig = require('../../config/config.default.js')({});
const prodConfig = require('../../config/config.prod.js')({});
let { rabbitMQAccount, rabbitMQPassword, rabbitMQHost } = defaultConfig;

if (process.env.NODE_ENV === 'production') {
    rabbitMQHost = prodConfig.rabbitMQHost ? prodConfig.rabbitMQHost : rabbitMQHost;
    rabbitMQAccount = prodConfig.rabbitMQAccount ? prodConfig.rabbitMQAccount : rabbitMQAccount;
    rabbitMQPassword = prodConfig.rabbitMQPassword ? prodConfig.rabbitMQPassword : rabbitMQPassword;
}
const amqpUrl = 'amqp://' + rabbitMQAccount + ':' + rabbitMQPassword + '@' + rabbitMQHost + ':5672';

class RabbitMQ {
    constructor() {
        this.open = amqp.connect(amqpUrl);
    }

    sendQueueMsg(queueName, msg, callBack) {
        const self = this;

        self.open
            .then(conn => conn.createChannel())
            .then(channel => {
                return channel.assertQueue(queueName, { durable: true }).then(() => {
                    return channel.sendToQueue(queueName, new Buffer(msg), {
                        persistent: true,
                    });
                })
                .then(data => {
                    if (data) {
                        callBack && callBack({
                            code: 200,
                            msg: '发送成功',
                            data: msg,
                        });
                        channel.close();
                    }
                })
                .catch(e => {
                    callBack && callBack({
                        code: -1,
                        msg: '发送失败',
                        data: e.stack,
                    });
                    setTimeout(() => {
                        if (channel) channel.close();
                    }, 500);
                });
            });
    }
}

const sendMQ = new RabbitMQ();
exports.sendMQ = sendMQ;
