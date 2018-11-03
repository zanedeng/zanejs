module zanejs {

    /**
     * 打开新窗口
     * @example
     * <a href="/index.html" title="example" onclick="return openWindow(this, {width:790,height:450,center:true})">
     *     open window example
     * </a>
     * @param {string} anchor
     * @param options
     * @returns {boolean}
     */
    export function openWindow(anchor: string, options: any): boolean {
        var args = '';
        if (typeof(options) === 'undefined') {
            options = {};
        }

        if (typeof(options.name) === 'undefined') {
            options.name = 'win' + Math.round(Math.random() * 100000);
        }

        if (typeof(options.height) !== 'undefined' && typeof(options.fullscreen) === 'undefined') {
            args += 'height=' + options.height + ',';
        }

        if (typeof(options.width) !== 'undefined' && typeof(options.fullscreen) === 'undefined') {
            args += 'width=' + options.width + ',';
        }

        if (typeof(options.fullscreen) !== 'undefined') {
            args += 'width=' + screen.availWidth + ',';
            args += 'height=' + screen.availHeight + ',';
        }

        if (typeof(options.center) === 'undefined') {
            options.x = 0;
            options.y = 0;
            args += 'screenx=' + options.x + ',';
            args += 'screeny=' + options.y + ',';
            args += 'left=' + options.x + ',';
            args += 'top=' + options.y + ',';
        }

        if (typeof(options.center) !== 'undefined' && typeof(options.fullscreen) === 'undefined') {
            options.y = Math.floor((screen.availHeight - (options.height || screen.height)) / 2)
                - (screen.height - screen.availHeight);
            options.x = Math.floor((screen.availWidth - (options.width || screen.width)) / 2)
                - (screen.width - screen.availWidth);
            args += 'screenx=' + options.x + ',';
            args += 'screeny=' + options.y + ',';
            args += 'left='    + options.x + ',';
            args += 'top='     + options.y + ',';
        }

        if (typeof(options.scrollbars) !== 'undefined') { args += 'scrollbars=1,'; }
        if (typeof(options.menubar) !== 'undefined') { args += 'menubar=1,'; }
        if (typeof(options.locationbar) !== 'undefined') { args += 'location=1,'; }
        if (typeof(options.resizable) !== 'undefined') { args += 'resizable=1,'; }
        var win = window.open(anchor, options.name, args);
        return false;
    }
}
