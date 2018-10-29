/**
 * 产生一个可存储的值的表示
 * serialize() 返回字符串，此字符串包含了表示 value 的字节流，可以存储于任何地方。
 * 这有利于存储或传递 PHP 的值，同时不丢失其类型和结构。
 * 想要将已序列化的字符串变回 PHP 的值，可使用 unserialize()。
 *
 * example 1: serialize(['Kevin', 'van', 'Zonneveld'])
 * returns 1: 'a:3:{i:0;s:5:"Kevin";i:1;s:3:"van";i:2;s:9:"Zonneveld";}'
 *
 * example 2: serialize({firstName: 'Kevin', midName: 'van'})
 * returns 2: 'a:2:{s:9:"firstName";s:5:"Kevin";s:7:"midName";s:3:"van";}'
 *
 * @param mixedValue
 * @returns {*}
 */
export default function serialize (mixedValue: any) {
    let val, key, okey;
    let ktype = '';
    let vals = '';
    let count = 0;

    let _utf8Size = function (str: string) {
        let size = 0;
        let i = 0;
        let l = str.length;
        let code = 0;
        for (i = 0; i < l; i++) {
            code = str.charCodeAt(i);
            if (code < 0x0080) {
                size += 1;
            } else if (code < 0x0800) {
                size += 2;
            } else {
                size += 3;
            }
        }
        return size;
    };

    let _getType = function (inp: any) {
        let match;
        let key1;
        let cons;
        let types;
        let type1: string = typeof(inp);

        if (type1 === 'object' && !inp) {
            return 'null';
        }

        if (type1 === 'object') {
            if (!inp.constructor) {
                return 'object';
            }
            cons = inp.constructor.toString();
            match = cons.match(/(\w+)\(/);
            if (match) {
                cons = match[1].toLowerCase();
            }
            types = ['boolean', 'number', 'string', 'array'];
            for (key1 in types) {
                if (cons === types[key1]) {
                    type1 = types[key1];
                    break;
                }
            }
        }
        return type1;
    };

    let type = _getType(mixedValue);

    switch (type) {
        case 'function':
            val = '';
            break;
        case 'boolean':
            val = 'b:' + (mixedValue ? '1' : '0');
            break;
        case 'number':
            val = (Math.round(mixedValue) === mixedValue ? 'i' : 'd') + ':' + mixedValue;
            break;
        case 'string':
            val = 's:' + _utf8Size(mixedValue) + ':"' + mixedValue + '"';
            break;
        case 'array':
        case 'object':
            val = 'a';
            /*
             if (type === 'object') {
             var objname = mixedValue.constructor.toString().match(/(\w+)\(\)/);
             if (objname === undefined) {
             return;
             }
             objname[1] = serialize(objname[1]);
             val = 'O' + objname[1].substring(1, objname[1].length - 1);
             }
             */
            for (key in mixedValue) {
                if (mixedValue.hasOwnProperty(key)) {
                    ktype = _getType(mixedValue[key]);
                    if (ktype === 'function') {
                        continue;
                    }

                    okey = (key.match(/^[0-9]+$/) ? parseInt(key, 10) : key);
                    vals += serialize(okey) + serialize(mixedValue[key]);
                    count++;
                }
            }
            val += ':' + count + ':{' + vals + '}';
            break;
        case 'undefined':
        default:
            // Fall-through
            // if the JS object has a property which contains a null value,
            // the string cannot be unserialized by PHP
            val = 'N';
            break;
    }
    if (type !== 'object' && type !== 'array') {
        val += ';';
    }
    return val;
}
