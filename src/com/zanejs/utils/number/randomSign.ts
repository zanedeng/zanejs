module zanejs {

    /**
     * 随机正负符号
     * @param chance 几率分界值。
     * @returns {number} 返回 1 或 -1
     */
    export function randomSign(chance: number = 0.5): number {
        return(Math.random() < chance) ? 1 : -1;
    }
}
