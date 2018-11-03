module zanejs {

    /**
     * 检查由参数构成的日期的合法性。如果每个参数都正确定义了则会被认为是有效的。
     *
     * example 1: checkdate(12, 31, 2000)
     * returns 1: true
     *
     * example 2: checkdate(2, 29, 2001)
     * returns 2: false
     *
     * example 3: checkdate(3, 31, 2008)
     * returns 3: true
     *
     * example 4: checkdate(1, 390, 2000)
     * returns 4: false
     *
     * @param m  - m值是从 1 到 12。
     * @param d  - d 的值在给定的 m 所应该具有的天数范围之内，闰年已经考虑进去了。
     * @param y  - y 的值是从 1 到 32767。
     * @returns {boolean} 如果给出的日期有效则返回 TRUE，否则返回 FALSE。
     */
    export function checkdate (m: number, d: number, y: number) {
        return m > 0 && m < 13 && y > 0 && y < 32768 && d > 0 && d <= (new Date(y, m, 0))
            .getDate();
    }
}
