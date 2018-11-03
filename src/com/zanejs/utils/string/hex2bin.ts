module zanejs {

    /**
     *
     * example 1: hex2bin('44696d61')
     * returns 1: 'Dima'
     *
     * example 2: hex2bin('00')
     * returns 2: '\x00'
     *
     * example 3: hex2bin('2f1q')
     * returns 3: false
     *
     * @param s
     * @returns {*}
     */
    export function hex2bin (s: string): any {
        let ret = [];
        let i = 0;
        let l;
        s += '';
        for (l = s.length; i < l; i += 2) {
            let c = parseInt(s.substr(i, 1), 16);
            let k = parseInt(s.substr(i + 1, 1), 16);
            if (isNaN(c) || isNaN(k)) {
                return false;
            }
            ret.push((c << 4) | k);
        }
        return String.fromCharCode.apply(String, ret);
    }
}
