/**
 * 解析 URL，返回其组成部分
 *
 * example 1: parse_url('http://user:pass@host/path?a=v#a')
 * returns 1: {scheme: 'http', host: 'host', user: 'user', pass: 'pass', path: '/path', query: 'a=v', fragment: 'a'}
 *
 * example 2: parse_url('http://en.wikipedia.org/wiki/%22@%22_%28album%29')
 * returns 2: {scheme: 'http', host: 'en.wikipedia.org', path: '/wiki/%22@%22_%28album%29'}
 *
 * example 3: parse_url('https://host.domain.tld/a@b.c/folder')
 * returns 3: {scheme: 'https', host: 'host.domain.tld', path: '/a@b.c/folder'}
 *
 * example 4: parse_url('https://gooduser:secretpassword@www.example.com/a@b.c/folder?foo=bar')
 * returns 4: { scheme: 'https', host: 'www.example.com', path: '/a@b.c/folder',
 * query: 'foo=bar', user: 'gooduser', pass: 'secretpassword' }
 *
 * @param str - 要解析的 URL。无效字符将使用 _ 来替换。
 * @param component - 指定 PHP_URL_SCHEME、 PHP_URL_HOST、 PHP_URL_PORT、 PHP_URL_USER、 PHP_URL_PASS、
 * PHP_URL_PATH、 PHP_URL_QUERY 或 PHP_URL_FRAGMENT 的其中一个来获取 URL 中指定的部分的 string。
 * @param mode
 * @returns {*}
 */
export default function parse_url (str: string, component: string, mode: string = 'php') {
    let query;
    let key = [
        'source',
        'scheme',
        'authority',
        'userInfo',
        'user',
        'pass',
        'host',
        'port',
        'relative',
        'path',
        'directory',
        'file',
        'query',
        'fragment'
    ];

    // For loose we added one optional slash to post-scheme to catch file:/// (should restrict this)
    let parser: any = {
        php: new RegExp([
            '(?:([^:\\/?#]+):)?',
            '(?:\\/\\/()(?:(?:()(?:([^:@\\/]*):?([^:@\\/]*))?@)?([^:\\/?#]*)(?::(\\d*))?))?',
            '()',
            '(?:(()(?:(?:[^?#\\/]*\\/)*)()(?:[^?#]*))(?:\\?([^#]*))?(?:#(.*))?)'
        ].join('')),
        strict: new RegExp([
            '(?:([^:\\/?#]+):)?',
            '(?:\\/\\/((?:(([^:@\\/]*):?([^:@\\/]*))?@)?([^:\\/?#]*)(?::(\\d*))?))?',
            '((((?:[^?#\\/]*\\/)*)([^?#]*))(?:\\?([^#]*))?(?:#(.*))?)'
        ].join('')),
        loose: new RegExp([
            '(?:(?![^:@]+:[^:@\\/]*@)([^:\\/?#.]+):)?',
            '(?:\\/\\/\\/?)?',
            '((?:(([^:@\\/]*):?([^:@\\/]*))?@)?([^:\\/?#]*)(?::(\\d*))?)',
            '(((\\/(?:[^?#](?![^?#\\/]*\\.[^?#\\/.]+(?:[?#]|$)))*\\/?)?([^?#\\/]*))',
            '(?:\\?([^#]*))?(?:#(.*))?)'
        ].join(''))
    };

    let m = parser[mode].exec(str);
    let uri: any = {};
    let i = 14;

    while (i--) {
        if (m[i]) {
            uri[key[i]] = m[i];
        }
    }

    if (component) {
        return uri[component.replace('PHP_URL_', '').toLowerCase()];
    }

    if (mode !== 'php') {
        let name = 'queryKey';
        parser = /(?:^|&)([^&=]*)=?([^&]*)/g;
        uri[name] = {};
        query = uri[key[12]] || '';
        query.replace(parser, function ($0: any, $1: any, $2: any)
        {
            if ($1) {
                uri[name][$1] = $2;
            }
        });
    }

    delete uri.source;
    return uri;
}
