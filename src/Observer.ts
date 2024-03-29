import Events from "mmevents";

type ISocketCreator = () => WebSocket;
export interface IProps {
  pingUrl?: string; // 监测网络可用的 url
  checkInterval?: number; // 监测网络的间隔
  socket?: string | ISocketCreator; // 如需创建 socket 则可配置，支持字符串的 socket url，或者函数返回 url
}

export default class Observer extends Events {
  private pingUrl = "https://static.yximgs.com/udata/pkg/IS-DOCS-MD/ping.gif";

  private checkInterval = 10000;

  private websocketRetryInterval = 5000;

  private pingSocketInterval = 12000;

  private onlineStatus: boolean = true;

  private socketCreator: null | ISocketCreator = null;

  private socketInst: null | WebSocket = null;

  socketOpenPromise = new Promise(() => {});

  constructor(props?: IProps) {
    super();
    if (props) {
      const { pingUrl, checkInterval, socket } = props;
      if (pingUrl) this.pingUrl = pingUrl;
      if (checkInterval) this.checkInterval = checkInterval;
      if (socket) {
        if (typeof socket === "string") {
          this.socketCreator = () => new WebSocket(socket);
        } else {
          this.socketCreator = socket;
        }
      }
    }

    this.init();
  }

  /**
   * 通过 imgPing 的方式检查网络是否 ok
   */
  public getNetworkStatus() {
    return new Promise((resolve, reject) => {
      fetch(this.pingUrl + "?t=" + Date.now())
        .then(() => {
          if (!this.onlineStatus) {
            this.onlineStatus = true;
            this.emit("online");
            this.establishSocketIfNeeded();
          }
          resolve(true);
        })
        .catch(() => {
          if (this.onlineStatus) {
            this.onlineStatus = false;
            this.emit("offline");
          }
          resolve(false);
        });
    });
  }

  /**
   * 获取当前最新维护的网络状态
   */
  public isOnline() {
    return this.onlineStatus;
  }

  public isSocketOk() {
    return (
      this.socketInst && this.socketInst.readyState === this.socketInst.OPEN
    );
  }

  public send(data: string) {
    this.socketOpenPromise.then(() => {
      this.socketInst && this.socketInst.send(data);
    });
  }

  public close() {
    if (this.socketInst) {
      this.socketInst.close();
    }
  }

  public isSocketConnecting() {
    return (
      this.socketInst &&
      this.socketInst.readyState === this.socketInst.CONNECTING
    );
  }

  private init() {
    window.addEventListener("online", () => {
      this.getNetworkStatus();
    });
    window.addEventListener("offline", () => {
      this.getNetworkStatus();
    });
    this.getNetworkStatus();
    setInterval(() => {
      this.getNetworkStatus();
    }, this.checkInterval);

    if (this.socketCreator) {
      this.establishSocketIfNeeded();
    }

    setInterval(() => {
      if (this.socketInst) {
        this.socketInst.send("ping");
      }
    }, this.pingSocketInterval);
  }

  private establishSocketIfNeeded() {
    if (this.isSocketOk() || this.isSocketConnecting()) {
      return;
    }
    if (this.socketCreator) {
      this.socketInst = this.socketCreator();
      let resolve: any;
      this.socketOpenPromise = new Promise(resl => {
        resolve = resl;
      });
      this.socketInst.onclose = () => {
        this.emit("close");
        this.socketInst = null;
        // 尝试重启
        setTimeout(() => {
          this.establishSocketIfNeeded();
        }, this.websocketRetryInterval);
      };
      this.socketInst.onerror = () => {
        this.emit("error");
      };
      this.socketInst.onmessage = e => {
        let msg = e.data;
        try {
          msg = JSON.parse(msg);
        } catch (error) {}
        this.emit("message", msg);
      };
      this.socketInst.onopen = () => {
        resolve && resolve();
        this.emit("open");
      };
    }
  }
}
