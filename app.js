'use strict';

class AppBootHook {
    constructor(app) {
        this.app = app;
    }

    configWillLoad() {
        // 此时 config 文件已经被读取并合并，但是还并未生效
        // 这是应用层修改配置的最后时机
        // 注意：此函数只支持同步调用

        // 例如：参数中的密码是加密的，在此处进行解密
        // 例如：插入一个中间件到框架的 coreMiddleware 之间
    }

    async didLoad() {
        // 所有的配置已经加载完毕
        // 可以用来加载应用自定义的文件，启动自定义的服务

        // 例如：创建自定义应用的示例

        // 例如：加载自定义的目录
    }

    async willReady() {
        // require('./app/util/sofaRpcServer');
        // 所有的插件都已启动完毕，但是应用整体还未 ready
        // 可以做一些数据初始化等操作，这些操作成功才会启动应用

        // 例如：从数据库加载数据到内存缓存
        // const PROTO_FILE_PATH = __dirname + '/app/proto/action.proto'; // proto文件位置
        // const PORT = ':50052'; // RPC服务端端口

        // const grpc = require('grpc');
        // const protoLoader = require('@grpc/proto-loader');

        // // 新建一个grpc服务器
        // const server = new grpc.Server();

        // // 异步加载服务
        // protoLoader.load(PROTO_FILE_PATH).then(packageDefinition => {
        //     // 获取proto
        //     const actionProto = grpc.loadPackageDefinition(packageDefinition);

        //     // 获取package
        //     const actionPackage = actionProto.actionPackage;

        //     // 定义HelloService的SayHello实现
        //     const show = (params, callback) => {
        //         console.log(this.app);
        //         // 响应客户端
        //         callback(null, {
        //             code: '0',
        //             msg: '来自Node服务端的OK',
        //         });
        //     };
        //     console.log('-------------------------------------------------');
        //     // 将sayHello方法作为HelloService的实现放入grpc服务器中
        //     server.addService(actionPackage.RegService.service, { show });

        //     // 启动服务监听
        //     server.bind(`0.0.0.0${PORT}`, grpc.ServerCredentials.createInsecure());
        //     server.start();
        // });

    }

    async didReady() {
        // 应用已经启动完毕
    }

    async serverDidReady() {
        // http / https server 已启动，开始接受外部请求
        // 此时可以从 app.server 拿到 server 的实例
    }
}

module.exports = AppBootHook;
