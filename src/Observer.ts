import Events from "mmevents";

export interface IProps {
  pingUrl?: string;
  checkInterval?: number;
}

export default class Observer extends Events {
  private pingUrl = "https://static.yximgs.com/udata/pkg/IS-DOCS-MD/ping.gif";

  private checkInterval = 10000;

  private onlineStatus: boolean = true;

  constructor(props?: IProps) {
    super();
    if (props && props.pingUrl) this.pingUrl = props.pingUrl;
    if (props && props.checkInterval) this.checkInterval = props.checkInterval;
    this.init();
  }

  /**
   * 通过 imgPing 的方式检查网络是否 ok
   */
  public getNetworkStatus() {
    return new Promise((resolve, reject) => {
      fetch(this.pingUrl)
        .then(() => {
          if (!this.onlineStatus) {
            this.onlineStatus = true;
            this.emit("change", true);
          }
          resolve(true);
        })
        .catch(() => {
          if (this.onlineStatus) {
            this.onlineStatus = false;
            this.emit("change", false);
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
  }
}
