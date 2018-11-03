module zanejs {

    export function onVisibilityChange(callback: (visibilityState: string) => void): void {
        // 各种浏览器兼容
        let state: string, visibilityChange: string, doc: any = document;
        if (typeof doc.hidden !== 'undefined') {
            visibilityChange = 'visibilitychange';
            state = 'visibilityState';
        } else if (typeof doc.mozHidden !== 'undefined') {
            visibilityChange = 'mozvisibilitychange';
            state = 'mozVisibilityState';
        } else if (typeof doc.msHidden !== 'undefined') {
            visibilityChange = 'msvisibilitychange';
            state = 'msVisibilityState';
        } else if (typeof doc.webkitHidden !== 'undefined') {
            visibilityChange = 'webkitvisibilitychange';
            state = 'webkitVisibilityState';
        }

        // 添加监听器，在title里显示状态变化
        doc.addEventListener(
            visibilityChange,
            () => {
                if (callback) {
                    callback(document[state]);
                }
            },
            false);
    }
}
