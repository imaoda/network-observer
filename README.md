## 介绍

- 监听当前的网络是否 ok，并在网络变更时派发事件
- 保障 socket 通信，自动心跳，自动重连，让业务无感知

## 快速开始

```js
import getObserver from "network-observer";

const networkObserver = getObserver();

// 监听网络变化
networkObserver.on("change", isOnline => {
  console.log(`网络${isOnline ? "已恢复" : "已断开"}`);
});

// 同步获取网络最新状态
networkObserver.isOnline();

// 异步获取网络最新状态 （触发 ping）
networkObserver.getNetworkStatus().then(isOnline => {
  console.log(`网络${isOnline ? "正常" : "已断开"}`);
});
```

## 利用 socket 进行通信

```js
import getObserver from "network-observer";

const networkObserver = getObserver({
  socket: "wss://xxx.com"
});

networkObserver.send("hello"); // 利用 socket 发送信息

networkObserver.on("message", data => {
  console.log(`收到信息`, data);
});
```

socket 配置支持传入回调，来动态生成

```js
const networkObserver = getObserver({
  socket: () => `wss://xxx.com?sid=${sid}&token=${token}`
});
```

## socket 的自我恢复机制

底层实现 socket 的保障，无需业务关心，其原理如下：

#### 自动 ping

每隔特定时间，向服务端发出 ping 消息，一方面保持心跳，避免被后端释放，另一方面在 socket 通道出现问题时能即时发现并恢复

#### 自动重连

当发现 socket 通道 close 时，自动重建，并能够「延续」上一个 socket 绑定的回调，无需业务关心

## 初始化参数

```js
export interface IProps {
  pingUrl?: string; // 监测网络可用的 url
  checkInterval?: number; // 监测网络的间隔
  socket?: string | ISocketCreator; // 如需创建 socket 则可配置，支持字符串的 socket url，或者函数返回 url
}
```
