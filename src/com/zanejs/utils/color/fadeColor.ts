module zanejs {

    /**
     *
     * @param startColor
     * @param endColor
     * @param position
     */
    export function fadeColor(startColor: number, endColor: number, position: number): number {
        let r: number = startColor >> 16;
        let g: number = startColor >> 8 & 0xFF;
        let b: number = startColor & 0xFF;
        r += ((endColor >> 16) - r) * position;
        g += ((endColor >> 8 & 0xFF) - g) * position;
        b += ((endColor & 0xFF) - b) * position;
        return (r << 16 | g << 8 | b);
    }
}
