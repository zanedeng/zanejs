module zanejs {

    let fn: any = (function () {
        let val;
        let fnMap = [
            [
                'requestFullscreen', 'exitFullscreen', 'fullscreenElement',
                'fullscreenEnabled', 'fullscreenchange', 'fullscreenerror'
            ],
            // New WebKit
            [
                'webkitRequestFullscreen', 'webkitExitFullscreen', 'webkitFullscreenElement',
                'webkitFullscreenEnabled', 'webkitfullscreenchange', 'webkitfullscreenerror'

            ],
            // Old WebKit (Safari 5.1)
            [
                'webkitRequestFullScreen', 'webkitCancelFullScreen', 'webkitCurrentFullScreenElement',
                'webkitCancelFullScreen', 'webkitfullscreenchange', 'webkitfullscreenerror'
            ],
            [
                'mozRequestFullScreen', 'mozCancelFullScreen', 'mozFullScreenElement',
                'mozFullScreenEnabled', 'mozfullscreenchange', 'mozfullscreenerror'
            ],
            [
                'msRequestFullscreen', 'msExitFullscreen', 'msFullscreenElement',
                'msFullscreenEnabled', 'MSFullscreenChange', 'MSFullscreenError'
            ]
        ];

        let ret = {};
        for (let i = 0, l = fnMap.length; i < l; i++) {
            val = fnMap[i];
            if (val && val[1] in document) {
                for (i = 0; i < val.length; i++) {
                    ret[fnMap[0][i]] = val[i];
                }
                return ret;
            }
        }

        return false;
    })();

    let keyboardAllowed = typeof Element !== 'undefined' && 'ALLOW_KEYBOARD_INPUT' in Element;

    /**
     * 请求全屏
     * @param {HTMLElement} elem
     */
    export function requestFullscreen(elem: HTMLElement = null) {
        let request = fn.requestFullscreen;
        elem = elem || document.documentElement;
        if (/ Version\/5\.1(?:\.\d+)? Safari\//.test(navigator.userAgent)) {
            elem[request]();
        } else {
            let el: any = Element;
            elem[request](keyboardAllowed && el.ALLOW_KEYBOARD_INPUT);
        }
    }

    /**
     * 退出全屏
     */
    export function exitFullscreen() {
        document[fn.exitFullscreen]();
    }

    /**
     * 是否全屏
     * @returns {boolean}
     */
    export function isFullscreen(): boolean {
        return Boolean(document[fn.fullscreenElement]);
    }

    /**
     *
     * @param {HTMLElement} elem
     */
    export function toggleFullscreen(elem: HTMLElement = null) {
        if (isFullscreen()) {
            this.exitFullscreen();
        } else {
            this.requestFullscreen(elem);
        }
    }

    /**
     *
     * @param {(evt: any) => any} callback
     */
    export function onFullscreenChange(callback: (evt: DocumentEvent) => any): void {
        document.addEventListener(fn.fullscreenchange, callback, false);
    }

    /**
     *
     * @param {(evt: DocumentEvent) => any} callback
     */
    export function onFullscreenError(callback: (evt: DocumentEvent) => any): void {
        document.addEventListener(fn.fullscreenerror, callback, false);
    }
}
