'use strict';

module.exports = {
  socket: {
    path: '/ws',
    enable: true, // 是否开启 websocket 模块
    intercept: false // 是否开启 websocket 的鉴权拦截器
  }
};