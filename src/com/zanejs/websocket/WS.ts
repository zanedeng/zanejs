module zanejs {

    export class WS {

        /**
         * 开发者服务器 wss 接口地址
         * @type {string}
         * @private
         */
        private _url: string;

        /**
         * 子协议数组
         * @type {array}
         * @private
         */
        private _protocols: string[];

        /**
         * WebSocket 连接
         * @type {WebSocket}
         * @private
         */
        private _websocket: any;

        /**
         * 重连锁
         * @type {boolean}
         * @private
         */
        private _reconnectLock: boolean;

        /**
         * 心跳时间
         * @type {number}
         * @private
         */
        private _heartBeatTime: number;

        /**
         * 心跳包数据
         * @type {string|ArrayBuffer}
         * @private
         */
        private _heartBeatData: any;

        /**
         * 创建 WebSocket 连接超时时间
         * @type {number}
         * @private
         */
        private _timeout: number;

        /**
         * 心跳计时器
         * @type {number}
         * @private
         */
        private _heartBeatTimer: any;

        /**
         * 关闭 WebSocket 连接的定时器
         * @type {number}
         * @private
         */
        private _closeTimer: any;

        /**
         *
         * @type {Header}
         * @private
         */
        private _header: any;
        private _onclose: any;
        private _onerror: any;
        private _onopen: any;
        private _onmessage: any;

        constructor(url: string, protocols: string | string[] = [], options: any = {}) {
            this._url = url;
            this._protocols = protocols as string[];
            this._websocket = null;
            this._reconnectLock = false; // 心跳检测频率锁
            this._heartBeatTime = 60000; // 心跳频率
            this._heartBeatData = '';   // 心跳包数据
            this._timeout = 10000; // 重连频率
            this._heartBeatTimer = null;
            this._closeTimer = null;
            Object.keys(options).forEach(key => {
                let _key = '_' + key;
                if (this.hasOwnProperty(_key)) {
                    this[_key] = options[key];
                }
            });
            this.initWebsocket();
        }

        /**
         * 通过 WebSocket 连接发送数据
         * @param data
         */
        public send(data: any): void {
            let $ws: any = (window as any).wx;
            if ($ws) {
                this._websocket.send({
                    data: data
                });
            } else {
                this._websocket.send(data);
            }
        }

        /**
         * 关闭 WebSocket 连接
         * @param code
         * @param reason
         */
        public close(code?: number, reason?: string): void {
            let $ws: any = (window as any).wx;
            if ($ws) {
                this._websocket.close({
                    code: code,
                    reason: reason
                });
            } else {
                this._websocket.close(code, reason);
            }
        }

        /**
         * 初始化 WebSocket 连接
         */
        private initWebsocket(): void {
            try {
                let $ws: any = (window as any).wx;
                if ($ws) {
                    this._websocket = $ws.connectSocket({
                        url: this._url,
                        protocols: this._protocols,
                        header: this._header
                    });
                    this._websocket.onClose = () => {
                        if (this._onclose) this._onclose();
                        this.reconnect();
                    };
                    this._websocket.onError = (errMsg: string) => {
                        if (this._onerror) this._onerror(errMsg);
                        this.reconnect();
                    };
                    this._websocket.onOpen = (header: any) => {
                        if (this._onopen) this._onopen(header);
                        this.heartCheck();
                    };
                    this._websocket.onMessage = (data) => {
                        if (this._onmessage) this._onmessage(data);
                        this.heartCheck();
                    };
                } else {
                    this._websocket = new WebSocket(this._url, this._protocols);
                    this._websocket.onclose = () => {
                        if (this._onclose) this._onclose();
                        this.reconnect();
                    };
                    this._websocket.onerror = () => {
                        if (this._onerror) this._onerror();
                        this.reconnect();
                    };
                    this._websocket.onopen = () => {
                        if (this._onopen) this._onopen();
                        this.heartCheck();
                    };
                    this._websocket.onmessage = (evt) => {
                        if (this._onmessage) this._onmessage(evt.data);
                        this.heartCheck();
                    };
                }
            } catch (e) {
                this.reconnect();
            }
        }

        /**
         * 重新创建一个 WebSocket 连接
         */
        private reconnect(): void {
            if (this._reconnectLock) return;
            this._reconnectLock = true;
            setTimeout(
                () => {
                    this.initWebsocket();
                    this._reconnectLock = false;
                },
                this._timeout
            );
        }

        /**
         * 检测心跳
         */
        private heartCheck(): void {
            clearTimeout(this._closeTimer);
            clearTimeout(this._heartBeatTimer);
            this._heartBeatTimer = setTimeout(
                () => {
                    this._websocket.send('');
                    this._closeTimer = setTimeout(
                        () => {
                            this._websocket.close();
                            this._websocket = null;
                        },
                        this._heartBeatTime
                    );
                },
                this._heartBeatTime
            );
        }
    }

}
