module zanejs {

    /**
     * 生成更好的随机数
     * example 1: mt_rand(1, 1)
     * returns 1: 1
     *
     * @param min
     * @param max
     * @returns {number}
     */
    export function mt_rand (min: number, max: number) {
        let argc = arguments.length;
        if (argc === 0) {
            min = 0;
            max = 2147483647;
        } else if (argc === 1) {
            throw new Error('Warning: mt_rand() expects exactly 2 parameters, 1 given');
        } else {
            min = parseInt(String(min), 10);
            max = parseInt(String(max), 10);
        }
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
