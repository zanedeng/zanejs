module zanejs {

    /**
     * 通过指定一个阀值，随机布尔值
     * @returns {boolean}
     */
    export function randomChance(percent: number): boolean {
        return Math.random() < percent;
    }
}
