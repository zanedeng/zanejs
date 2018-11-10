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
         * 指定收到的二进制数据的格式
         */
        private _binaryType: string;

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
         * 心跳包发送处理函数
         * @type {Function}
         * @private
         */
        private _heartBeatHandler: Function;

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
        private _autoReconnect: boolean;

        constructor(url: string, protocols: string | string[] = [], options: any = {}) {
            this._url = url;
            this._protocols = protocols as string[];
            this._websocket = null;
            this._binaryType = 'blob';
            this._reconnectLock = false; // 心跳检测频率锁
            this._heartBeatTime = 60000; // 心跳频率
            this._heartBeatHandler = null;   // 心跳处理函数
            this._timeout = 10000; // 重连频率
            this._heartBeatTimer = null;
            this._closeTimer = null;
            this._header = null;
            this._onclose = null;
            this._onerror = null;
            this._onopen = null;
            this._onmessage = null;
            this._autoReconnect = true;
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
         * 重新创建一个 WebSocket 连接
         */
        public reconnect(): void {
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
                        if (this._autoReconnect) this.reconnect();
                    };
                    this._websocket.onError = (errMsg: string) => {
                        if (this._onerror) this._onerror(errMsg);
                        if (this._autoReconnect) this.reconnect();
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
                    this._websocket.binaryType = this._binaryType;
                    this._websocket.onclose = (evt) => {
                        if (this._onclose) this._onclose(evt);
                        if (this._autoReconnect) this.reconnect();
                    };
                    this._websocket.onerror = (evt) => {
                        if (this._onerror) this._onerror(evt);
                        if (this._autoReconnect) this.reconnect();
                    };
                    this._websocket.onopen = (evt) => {
                        if (this._onopen) this._onopen(evt);
                        this.heartCheck();
                    };
                    this._websocket.onmessage = (evt) => {
                        if (this._onmessage) this._onmessage(evt.data);
                        this.heartCheck();
                    };
                }
            } catch (e) {
                if (this._autoReconnect) this.reconnect();
            }
        }

        /**
         * 检测心跳
         */
        private heartCheck(): void {
            clearTimeout(this._closeTimer);
            clearTimeout(this._heartBeatTimer);
            this._heartBeatTimer = setTimeout(
                () => {
                    if (this._heartBeatHandler) {
                        this._heartBeatHandler();
                    }
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
