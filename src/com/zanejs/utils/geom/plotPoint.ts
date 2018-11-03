module zanejs {

    /**
     * 在 PIXI.Graphics 图形对象上绘制点
     * @param g
     * @param p
     * @param color
     * @param size
     */
    export function plotPoint(g: PIXI.Graphics, p: PIXI.Point,
                              color: number = 0xFF0000, size: number = 2) {
        g.beginFill(color);
        g.drawCircle(p.x, p.y , size);
        g.endFill();
    }
}
