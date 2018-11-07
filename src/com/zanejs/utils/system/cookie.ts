module zanejs {

    export function cookie(name: string, value: any = void 0, options: any = void 0) {

        if (typeof value !== 'undefined') {

            options = options || {};
            if (value === null) {
                value = '';
                options = merge({}, options);
                options.expires = -1;
            }
            let expires = '';
            if (options.expires && (typeof options.expires === 'number' || options.expires.toUTCString)) {
                let date;
                if (typeof options.expires === 'number') {
                    date = new Date();
                    date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
                } else {
                    date = options.expires;
                }
                expires = '; expires=' + date.toUTCString();
            }
            let path = options.path ? '; path=' + (options.path) : '';
            let domain = options.domain ? '; domain=' + (options.domain) : '';
            let secure = options.secure ? '; secure' : '';
            document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');

        } else {

            let cookieValue = null;
            if (document.cookie && document.cookie !== '') {
                let cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    let _cookie = trim(cookies[i]);
                    if (_cookie.substring(0, name.length + 1) === (name + '=')) {
                        cookieValue = decodeURIComponent(_cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }
    }
}
