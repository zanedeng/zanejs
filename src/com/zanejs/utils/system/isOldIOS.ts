module zanejs {

    function _isOldIOS() {
        let win: any = window;
        let ver: string = '' + (/CPU.*OS ([0-9_]{3,4})[0-9_]{0,1}|(CPU like).*AppleWebKit.*Mobile/i.exec(ua)
            || [0, ''])[1];
        ver = ver
            .replace('undefined', '3_2')
            .replace('_', '.')
            .replace('_', '');
        return parseFloat(ver) < 10 && !win.MSStream;
    }

    /**
     * 10以下的IOS系统版本
     * @type {boolean}
     */
    export let isOldIOS: boolean = _isOldIOS();
}
