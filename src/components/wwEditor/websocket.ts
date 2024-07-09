let websocket: any;
let timer: any = null;
let lockReconnect = false;
// 记录心跳包
let heartbeatStatus = "waiting";

function startHeartbeat() {
  setTimeout(() => {
    // 将状态改为等待应答，并发送心跳包
    heartbeatStatus = "waiting";
    websocket.send("heartbeat");
    // 启动定时任务来检测刚才服务器有没有应答
    waitHeartbeat();
  }, 15000);
}

function waitHeartbeat() {
  setTimeout(() => {
    console.log("检测服务器有没有应答过心跳包，当前状态", heartbeatStatus);
    if (heartbeatStatus === "waiting") {
      // 心跳应答超时
      websocket.close();
    } else {
      // 启动下一轮心跳检测
      startHeartbeat();
    }
  }, 1500);
}
// 重连请求
let reconnect = (url: string) => {
  if (lockReconnect) return; //没连接上会一直重连，设置延迟避免请求过多
  setTimeout(function () {
    createWebSocket(url);
    lockReconnect = false;
  }, 4000);
};
let heartCheck = {
  timeout: 60000, //60秒
  timeoutObj: null,
  reset: function () {
    clearInterval(timer);
    return this;
  },
  start: function () {
    // timer = setInterval(function () {
    //   //这里发送一个心跳，后端收到后，返回一个心跳消息，
    //   //onmessage拿到返回的心跳就说明连接正常
    //   // 设置心跳间隔和超时时间
    //   if (websocket.readyState === WebSocket.OPEN) {
    //     websocket.ping(null, false, 30000); // 30秒心跳间隔，不发送数据
    //   } else {
    //     console.error("websocket 心跳机制断开了......");
    //   }
    // }, this.timeout);
  },
};

let createWebSocket = (url: string) => {
  websocket = new WebSocket(url);
  websocket.onopen = function () {
    heartCheck.reset().start();
    // 启动成功后开启心跳检测
    startHeartbeat();
  };
  websocket.onerror = function () {
    reconnect(url);
  };
  websocket.onclose = function (e: any) {
    console.log(
      "websocket 断开: " + e.code + " " + e.reason + " " + e.wasClean
    );
  };
  websocket.onmessage = function (event: any) {
    const { data } = event;
    console.log("心跳应答了，要把状态改为已收到应答", data);
    if (data === "heartbeat") {
      heartbeatStatus = "received";
    }
    lockReconnect = true; //event 为服务端传输的消息，在这里可以处理
  };
};

//关闭连接
let closeWebSocket = () => {
  websocket && websocket.close();
};

export { websocket, createWebSocket, closeWebSocket };
