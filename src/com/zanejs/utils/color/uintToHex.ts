module zanejs {

    /**
     * 将颜色转换为十六进制
     * @param u
     */
    export function uintToHex(u: number) {
        return '#' + u.toString(16).toUpperCase();
    }
}
