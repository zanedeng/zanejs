/**
 * 生成 URL-encode 之后的请求字符串
 *
 * example 1: http_build_query({foo: 'bar', php: 'hypertext processor', baz: 'boom', cow: 'milk'}, '', '&amp;')
 * returns 1: 'foo=bar&amp;php=hypertext+processor&amp;baz=boom&amp;cow=milk'
 *
 * example 2: http_build_query({'php': 'hypertext processor',
 * 0: 'foo', 1: 'bar', 2: 'baz', 3: 'boom', 'cow': 'milk'}, 'myvar_')
 * returns 2: 'myvar_0=foo&myvar_1=bar&myvar_2=baz&myvar_3=boom&php=hypertext+processor&cow=milk'
 *
 * @param formData - 可以是数组或包含属性的对象。
 * @param numericPrefix - 如果在基础数组中使用了数字下标同时给出了该参数，此参数值将会作为基础数组中的数字下标元素的前缀。
 * @param argSeparator - 除非指定并使用了这个参数，否则会用 arg_separator.output 来分隔参数。
 * @returns {string}
 */
import urlencode from './urlencode';

export function http_build_query (formData: any, numericPrefix: string = '', argSeparator: string = '') {

    let _httpBuildQueryHelper: any =  (key: string, val: any, $argSeparator: string) => {
        let k;
        let $tmp = [];
        if (val === true) {
            val = '1';
        } else if (val === false) {
            val = '0';
        }
        if (val !== null) {
            if (typeof val === 'object') {
                for (k in val) {
                    if (val[k] !== null) {
                        $tmp.push(_httpBuildQueryHelper(key + '[' + k + ']', val[k], $argSeparator));
                    }
                }
                return $tmp.join($argSeparator);
            } else if (typeof val !== 'function') {
                return urlencode(key) + '=' + urlencode(val);
            } else {
                throw new Error('There was an error processing for http_build_query().');
            }
        } else {
            return '';
        }
    };

    if (!argSeparator) {
        argSeparator = '&';
    }

    let tmp: any = [];
    Object.keys(formData).map(key => {
        let value = formData[key];
        if (numericPrefix && !isNaN(Number(key))) {
            key = String(numericPrefix) + key;
        }
        let query = _httpBuildQueryHelper(key, value, argSeparator);
        if (query !== '') {
            tmp.push(query);
        }
    });
    return tmp.join(argSeparator);
}
