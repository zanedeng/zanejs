module zanejs {

    export function distance(p1: PIXI.Point, p2: PIXI.Point): number {
        return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
    }
}
