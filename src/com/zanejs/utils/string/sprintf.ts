module zanejs {

    let re = {
        not_string: /[^s]/,
        not_bool: /[^t]/,
        not_type: /[^T]/,
        not_primitive: /[^v]/,
        number: /[diefg]/,
        numeric_arg: /[bcdiefguxX]/,
        json: /[j]/,
        not_json: /[^j]/,
        text: /^[^\x25]+/,
        modulo: /^\x25{2}/,
        placeholder: /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-gijostTuvxX])/,
        key: /^([a-z_][a-z_\d]*)/i,
        key_access: /^\.([a-z_][a-z_\d]*)/i,
        index_access: /^\[(\d+)\]/,
        sign: /^[\+\-]/
    };

    let sprintfCache: any = {};

    function sprintfParse(fmt: string) {
        if (sprintfCache[fmt]) {
            return sprintfCache[fmt];
        }

        let _fmt = fmt, match, parseTree = [], argNames = 0;
        while (_fmt) {
            if ((match = re.text.exec(_fmt)) !== null) {

                parseTree.push(match[0]);

            } else if ((match = re.modulo.exec(_fmt)) !== null) {

                parseTree.push('%');

            } else if ((match = re.placeholder.exec(_fmt)) !== null) {

                if (match[2]) {

                    argNames |= 1;

                    let fieldList = [], replacementField = match[2], fieldMatch = [];

                    if ((fieldMatch = re.key.exec(replacementField)) !== null) {
                        fieldList.push(fieldMatch[1]);
                        while ((replacementField = replacementField.substring(fieldMatch[0].length)) !== '') {
                            if ((fieldMatch = re.key_access.exec(replacementField)) !== null) {
                                fieldList.push(fieldMatch[1]);
                            } else if ((fieldMatch = re.index_access.exec(replacementField)) !== null) {
                                fieldList.push(fieldMatch[1]);
                            } else {
                                throw new SyntaxError('[sprintf] failed to parse named argument key');
                            }
                        }
                    } else {
                        throw new SyntaxError('[sprintf] failed to parse named argument key');
                    }
                    match[2] = fieldList;
                } else {
                    argNames |= 2;
                }
                if (argNames === 3) {
                    throw new Error('[sprintf] mixing positional and named placeholders is not (yet) supported');
                }

                parseTree.push({
                    placeholder: match[0],
                    param_no:    match[1],
                    keys:        match[2],
                    sign:        match[3],
                    pad_char:    match[4],
                    align:       match[5],
                    width:       match[6],
                    precision:   match[7],
                    type:        match[8]
                });

            } else {
                throw new SyntaxError('[sprintf] unexpected placeholder');
            }
            _fmt = _fmt.substring(match[0].length);
        }
        return sprintfCache[fmt] = parseTree;
    }

    function sprintfFormat(parseTree: any[], argv: any[]) {
        let cursor = 0,
            treeLength = parseTree.length,
            arg,
            output = '',
            i, k, ph, pad, padCharacter, padLength, isPositive, sign;

        for (i = 0; i < treeLength; i++) {
            if (typeof parseTree[i] === 'string') {

                output += parseTree[i];

            } else if (typeof parseTree[i] === 'object') {

                ph = parseTree[i]; // convenience purposes only
                if (ph.keys) { // keyword argument
                    arg = argv[cursor];
                    for (k = 0; k < ph.keys.length; k++) {
                        if (arg === undefined) {
                            throw new Error(
                                sprintf(
                                    '[sprintf] Cannot access property "%s" of undefined value "%s"',
                                    ph.keys[k],
                                    ph.keys[k - 1]
                                )
                            );
                        }
                        arg = arg[ph.keys[k]];
                    }
                } else if (ph.param_no) { // positional argument (explicit)

                    arg = argv[ph.param_no];

                } else { // positional argument (implicit)

                    arg = argv[cursor++];
                }

                if (re.not_type.test(ph.type) &&
                    re.not_primitive.test(ph.type) &&
                    arg instanceof Function) {
                    arg = arg();
                }

                if (re.numeric_arg.test(ph.type) &&
                    (typeof arg !== 'number' && isNaN(arg))) {
                    throw new TypeError(sprintf('[sprintf] expecting number but found %T', arg));
                }

                if (re.number.test(ph.type)) {
                    isPositive = arg >= 0;
                }

                switch (ph.type) {
                    // 二进制数
                    case 'b':
                        arg = parseInt(arg, 10).toString(2);
                        break;
                    // ASCII 值对应的字符
                    case 'c':
                        arg = String.fromCharCode(parseInt(arg, 10));
                        break;
                    // 包含正负号的十进制数（负数、0、正数）
                    case 'd':
                    case 'i':
                        arg = parseInt(arg, 10);
                        break;
                    // 将JavaScript对象或数组生成为JSON编码的字符串
                    case 'j':
                        arg = JSON.stringify(
                            arg, null,
                            ph.width ? parseInt(ph.width, 10) : 0
                        );
                        break;
                    // 使用小写的科学计数法（例如 1.2e+2）
                    case 'e':
                        arg = ph.precision
                            ? parseFloat(arg).toExponential(ph.precision)
                            : parseFloat(arg).toExponential();
                        break;
                    // 浮点数（非本地设置）
                    case 'f':
                        arg = ph.precision
                            ? parseFloat(arg).toFixed(ph.precision)
                            : parseFloat(arg);
                        break;
                    // 较短的 %e 和 %f
                    case 'g':
                        arg = ph.precision
                            ? String(Number(arg.toPrecision(ph.precision)))
                            : parseFloat(arg);
                        break;
                    // 八进制数
                    case 'o':
                        arg = (parseInt(arg, 10) >>> 0).toString(8);
                        break;
                    // 字符串
                    case 's':
                        arg = String(arg);
                        arg = (ph.precision ? arg.substring(0, ph.precision) : arg);
                        break;
                    // 收益率true或false
                    case 't':
                        arg = String(!!arg);
                        arg = (ph.precision ? arg.substring(0, ph.precision) : arg);
                        break;
                    // 参数的类型
                    case 'T':
                        arg = Object.prototype.toString.call(arg).slice(8, -1).toLowerCase();
                        arg = (ph.precision ? arg.substring(0, ph.precision) : arg);
                        break;
                    // 无符号十进制数
                    case 'u':
                        arg = parseInt(arg, 10) >>> 0;
                        break;
                    // 原始值
                    case 'v':
                        arg = arg.valueOf();
                        arg = (ph.precision ? arg.substring(0, ph.precision) : arg);
                        break;
                    // 十六进制数（小写字母）
                    case 'x':
                        arg = (parseInt(arg, 10) >>> 0).toString(16);
                        break;
                    // 十六进制数（大写字母）
                    case 'X':
                        arg = (parseInt(arg, 10) >>> 0).toString(16).toUpperCase();
                        break;
                    default:

                }
                if (re.json.test(ph.type)) {

                    output += arg;

                } else {

                    if (re.number.test(ph.type) && (!isPositive || ph.sign)) {

                        sign = isPositive ? '+' : '-';
                        arg = arg.toString().replace(re.sign, '');

                    } else {

                        sign = '';
                    }
                    padCharacter = ph.pad_char ? ph.pad_char === '0' ? '0' : ph.pad_char.charAt(1) : ' ';
                    padLength = ph.width - (sign + arg).length;
                    pad = ph.width ? (padLength > 0 ? padCharacter.repeat(padLength) : '') : '';
                    output += ph.align
                        ? sign + arg + pad
                        : (padCharacter === '0'
                            ? sign + pad + arg
                            : pad + sign + arg);
                }
            }
        }
        return output;
    }

    /**
     * 输出格式化字符串
     * @param fmt 必需。规定字符串以及如何格式化其中的变量。
     * 可能的格式值：
     * %% - 返回一个百分号 %
     * %b - 二进制数
     * %c - ASCII 值对应的字符
     * %d - 包含正负号的十进制数（负数、0、正数）
     * %e - 使用小写的科学计数法（例如 1.2e+2）
     * %u - 不包含正负号的十进制数（大于等于 0）
     * %f - 浮点数（本地设置）
     * %g - 较短的 %e 和 %f
     * %o - 八进制数
     * %s - 字符串
     * %x - 十六进制数（小写字母）
     * %X - 十六进制数（大写字母）
     * 附加的格式值。必需放置在 % 和字母之间（例如 %.2f）：
     * 1) + （在数字前面加上 + 或 - 来定义数字的正负性。默认情况下，只有负数才做标记，正数不做标记）
     * 2) ' （规定使用什么作为填充，默认是空格。它必须与宽度指定器一起使用。例如：%'x20s（使用 "x" 作为填充））
     * 3) - （左调整变量值）
     * 4) [0-9] （规定变量值的最小宽度）
     * 5) .[0-9] （规定小数位数或最大字符串长度）
     *
     * 注释：如果使用多个上述的格式值，它们必须按照以上顺序使用。
     *
     * @param args
     * @example
     *
     * sprintf('%2$s %3$s a %1$s', 'cracker', 'Polly', 'wants')
     *
     * var user = {
     *      name: 'Dolly',
     * }
     * sprintf('Hello %(name)s', user)
     * // Hello Dolly
     *
     */
    export function sprintf(fmt: string, ...args: any[]) {
        return sprintfFormat(sprintfParse(fmt), args);
    }

    /**
     * 输出格式化字符串
     * @param fmt
     * @param argv
     * @example
     *
     * var users = [
     *      {name: 'Dolly'},
     *      {name: 'Molly'},
     *      {name: 'Polly'},
     * ]
     * sprintf('Hello %(users[0].name)s, %(users[1].name)s and %(users[2].name)s', {users: users})
     * // Hello Dolly, Molly and Polly
     *
     */
    export function vsprintf(fmt: string, argv: any) {
        return sprintf.apply(null, [fmt].concat(argv || []));
    }
}
