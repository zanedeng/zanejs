module zanejs {

    /**
     * 设置cookie
     * @param {string} name
     * @param value
     * @param {number} seconds
     */
    export function setCookie(name: string, value: any, seconds: number): void {
        var expires;
        if (typeof(seconds) !== 'undefined') {
            let date = new Date();
            date.setTime(date.getTime() + (seconds * 1000));
            expires = '; expires=' + date.toUTCString();
        } else {
            expires = '';
        }

        document.cookie = name + '=' + value + expires + '; path=/';
    }
}
