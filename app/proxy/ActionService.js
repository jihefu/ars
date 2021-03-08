// Don't modified this file, it's auto created by egg-rpc-tool

'use strict';

// const path = require('path');

/* eslint-disable */
/* istanbul ignore next */
module.exports = app => {
  const consumer = app.sofaRpcClient.createConsumer({
    interfaceName: 'com.langjie.sofa.rpc.ActionService',
    targetAppName: 'sofaAction',
    version: '1.0',
    group: 'SOFA',
    proxyName: 'ActionService',
  });

  if (!consumer) {
    // `app.config['sofaAction.rpc.service.enable'] = false` will disable this consumer
    return;
  }

  app.beforeStart(async() => {
    await consumer.ready();
  });

  class ActionService extends app.Proxy {
    constructor(ctx) {
      super(ctx, consumer);
    }

    async show(req) {
      return await consumer.invoke('show', [ req ], { 
        ctx: this.ctx,
        codecType: 'protobuf',
      });
    }

    async update(req) {
      return await consumer.invoke('update', [ req ], { 
        ctx: this.ctx,
        codecType: 'protobuf',
      });
    }

    async create(req) {
      return await consumer.invoke('create', [ req ], { 
        ctx: this.ctx,
        codecType: 'protobuf',
      });
    }

    async destroy(req) {
      return await consumer.invoke('destroy', [ req ], { 
        ctx: this.ctx,
        codecType: 'protobuf',
      });
    }
  }

  return ActionService;
};
/* eslint-enable */

