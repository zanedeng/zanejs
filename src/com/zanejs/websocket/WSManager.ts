module zanejs {

    export class WSManager {

        public static connections: any = {};

        /**
         * 订阅一个websocket连接
         * @param url
         * @param protocols
         * @param options
         */
        public static subscribe(url: string, protocols: string | string[] = [], options: any = {}): WS {
            if (!WSManager.connections[url]) {
                WSManager.connections[url] = new WS(url, protocols, options);
            }
            return WSManager.connections[url];
        }

        /**
         * 取消订阅
         * @param url
         * @param code
         * @param reason
         */
        public static unSubscribe(url: string, code?: number, reason?: string) {
            let ws: WS = WSManager.connections[url];
            if (ws) {
                ws.close(code, reason);
            }
        }

        /**
         * 获取一个订阅的websocket连接
         * @param url
         */
        public static getConnectionsFrom(url: string): WS {
            return WSManager.connections[url];
        }

        constructor() {
            throw new Error('This is a STATIC CLASS and should not be instantiated.');
        }
    }
}
