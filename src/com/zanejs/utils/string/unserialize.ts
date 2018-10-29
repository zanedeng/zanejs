/**
 * 从已存储的表示中创建 PHP 的值
 *
 * example 1: unserialize('a:3:{i:0;s:5:"Kevin";i:1;s:3:"van";i:2;s:9:"Zonneveld";}')
 * returns 1: ['Kevin', 'van', 'Zonneveld']
 *
 * example 2: unserialize('a:2:{s:9:"firstName";s:5:"Kevin";s:7:"midName";s:3:"van";}')
 * returns 2: {firstName: 'Kevin', midName: 'van'}
 *
 * example 3: unserialize('a:3:{s:2:"ü";s:2:"ü";s:3:"四";s:3:"四";s:4:"𠜎";s:4:"𠜎";}')
 * returns 3: {'ü': 'ü', '四': '四', '𠜎': '𠜎'}
 *
 * @param data
 * @returns {*}
 */
export default function unserialize (data: any) {
    let utf8Overhead = function (str: string)
    {
        let s = str.length;
        for (let i = str.length - 1; i >= 0; i--) {
            let code = str.charCodeAt(i);
            if (code > 0x7f && code <= 0x7ff) {
                s++;
            } else if (code > 0x7ff && code <= 0xffff) {
                s += 2;
            }
            // trail surrogate
            if (code >= 0xDC00 && code <= 0xDFFF) {
                i--;
            }
        }
        return s - 1;
    };
    let error = function (type: string, msg: string, filename: string = '', line: number = 0)
    {
        console.log(msg, filename, line);
    };

    let readUntil = function ($data: any, offset: any, stopchr: any)
    {
        let i = 2;
        let buf = [];
        let $chr = $data.slice(offset, offset + 1);

        while ($chr !== stopchr) {
            if ((i + offset) > $data.length) {
                error('Error', 'Invalid');
            }
            buf.push($chr);
            $chr = $data.slice(offset + (i - 1), offset + i);
            i += 1;
        }
        return [buf.length, buf.join('')];
    };

    let readChrs = function ($data: any, offset: any, length: number)
    {
        let i, $chr, buf;

        buf = [];
        for (i = 0; i < length; i++) {
            $chr = $data.slice(offset + (i - 1), offset + i);
            buf.push($chr);
            length -= utf8Overhead($chr);
        }
        return [buf.length, buf.join('')];
    };

    function _unserialize ($data: any, offset: any) {
        let dtype;
        let dataoffset;
        let keyandchrs;
        let keys: any;
        let contig;
        let length;
        let array;
        let readdata: any;
        let readData;
        let ccount;
        let stringlength: any;
        let i;
        let key;
        let kprops;
        let kchrs;
        let vprops;
        let vchrs;
        let value;
        let chrs: any = 0;
        let typeconvert = function (x: string): any {
            return x;
        };

        if (!offset) {
            offset = 0;
        }

        dtype = ($data.slice(offset, offset + 1)).toLowerCase();

        dataoffset = offset + 2;

        switch (dtype) {
            case 'i':
                typeconvert = function (x: string)
                {
                    return parseInt(x, 10);
                };
                readData = readUntil($data, dataoffset, ';');
                chrs = readData[0];
                readdata = readData[1];
                dataoffset += chrs + 1;
                break;
            case 'b':
                typeconvert = function (x: string)
                {
                    return parseInt(x, 10) !== 0;
                };
                readData = readUntil($data, dataoffset, ';');
                chrs = readData[0];
                readdata = readData[1];
                dataoffset += chrs + 1;
                break;
            case 'd':
                typeconvert = function (x: string) {
                    return parseFloat(x);
                };
                readData = readUntil($data, dataoffset, ';');
                chrs = readData[0];
                readdata = readData[1];
                dataoffset += chrs + 1;
                break;
            case 'n':
                readdata = null;
                break;
            case 's':
                ccount = readUntil($data, dataoffset, ':');
                chrs = ccount[0];
                stringlength = ccount[1];
                dataoffset += chrs + 2;

                readData = readChrs($data, dataoffset + 1, parseInt(stringlength, 10));
                chrs = readData[0];
                readdata = readData[1];
                dataoffset += chrs + 2;
                if (chrs !== parseInt(stringlength, 10) && chrs !== readdata.length) {
                    error('SyntaxError', 'String length mismatch');
                }
                break;
            case 'a':
                readdata = {};

                keyandchrs = readUntil($data, dataoffset, ':');
                chrs = keyandchrs[0];
                keys = keyandchrs[1];
                dataoffset += chrs + 2;
                length = parseInt(keys, 10);
                contig = true;

                for (i = 0; i < length; i++) {
                    kprops = _unserialize($data, dataoffset);
                    kchrs = kprops[1];
                    key = kprops[2];
                    dataoffset += kchrs;

                    vprops = _unserialize($data, dataoffset);
                    vchrs = vprops[1];
                    value = vprops[2];
                    dataoffset += vchrs;

                    if (key !== i) {
                        contig = false;
                    }

                    readdata[key] = value;
                }

                if (contig) {
                    array = new Array(length);
                    for (i = 0; i < length; i++) {
                        array[i] = readdata[i];
                    }
                    readdata = array;
                }

                dataoffset += 1;
                break;
            default:
                error('SyntaxError', 'Unknown / Unhandled data type(s): ' + dtype);
                break;
        }
        return [dtype, dataoffset - offset, typeconvert(readdata)];
    }

    return _unserialize((data + ''), 0)[2];
}
