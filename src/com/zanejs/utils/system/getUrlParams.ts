module zanejs {

    /**
     * 获取URL传递的参数
     * @param url
     * @returns {Object}
     */
    export function getUrlParams(url: string) {
        url = url.split('?')[1];
        let pl = /\+/g;
        let search = /([^&=]+)=?([^&]*)/g;
        let decode = function(s: string) { return decodeURIComponent(s.replace(pl, ' ')); };
        let urlParams = {};
        let match;
        while (match = search.exec(url)) {
            urlParams[decode(match[1])] = decode(match[2]);
        }
        return urlParams;
    }
}
