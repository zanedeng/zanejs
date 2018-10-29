
export let PI: number = Math.PI;
export let DEG_TO_RAD: number = PI / 180;
export let RAD_TO_DEG: number = 180 / PI;

/**
 * 角度转换为弧度
 * @param degree
 */
export default function degreeToRadians(degree: number): number {
    return degree * DEG_TO_RAD;
}
