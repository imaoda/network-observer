## 介绍

- 监听当前的网络是否 ok，并在网络变更时派发事件
- 保障

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

## 对 socket 进行保障

```js
```
