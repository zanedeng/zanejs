module zanejs {

    /**
     * 返回当前的 Unix 时间戳
     *
     * example 1: var $timeStamp = time()
     * example 1: var $result = $timeStamp > 1000000000 && $timeStamp < 2000000000
     * returns 1: true
     *
     * @returns {number}
     */
    export function time() {
        return Math.floor(new Date().getTime() / 1000);
    }
}
