module zanejs {

    /**
     * 是否支持触屏事件
     * @returns {boolean}
     */
    export function touchSupported() {
        let win: any = window;
        let doc: any = document;
        return (('ontouchstart' in win) ||
            ('undefined' !== typeof win.TouchEvent) ||
            ('undefined' !== typeof doc.createTouch));
    }
}
