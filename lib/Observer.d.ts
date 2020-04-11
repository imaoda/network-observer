import Events from "mmevents";
declare type ISocketCreator = () => WebSocket;
export interface IProps {
    pingUrl?: string;
    checkInterval?: number;
    socket?: string | ISocketCreator;
}
export default class Observer extends Events {
    private pingUrl;
    private checkInterval;
    private websocketRetryInterval;
    private pingSocketInterval;
    private onlineStatus;
    private socketCreator;
    private socketInst;
    constructor(props?: IProps);
    /**
     * 通过 imgPing 的方式检查网络是否 ok
     */
    getNetworkStatus(): Promise<{}>;
    /**
     * 获取当前最新维护的网络状态
     */
    isOnline(): boolean;
    isSocketOk(): boolean | null;
    send(data: string): void;
    close(): void;
    isSocketConnecting(): boolean | null;
    private init;
    private establishSocketIfNeeded;
}
export {};
