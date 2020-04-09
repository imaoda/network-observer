import Events from "mmevents";
export interface IProps {
    pingUrl?: string;
    checkInterval?: number;
}
export default class Observer extends Events {
    private pingUrl;
    private checkInterval;
    private onlineStatus;
    constructor(props?: IProps);
    /**
     * 通过 imgPing 的方式检查网络是否 ok
     */
    getNetworkStatus(): Promise<{}>;
    /**
     * 获取当前最新维护的网络状态
     */
    isOnline(): boolean;
    private init;
}
