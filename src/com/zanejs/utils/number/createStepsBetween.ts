module zanejs {

    /**
     * 从 begin 和 end 两个数字之间创建均匀分布的数字递增。
     * createStepsBetween(0, 5, 4); // Traces 1,2,3,4
     * createStepsBetween(1, 3, 3); // Traces 1.5,2,2.5
     * @param begin
     * @param end
     * @param steps
     * @returns {number[]}
     */
    export function createStepsBetween(begin: number, end: number, steps: number): number[] {
        steps++;
        let i: number = 0;
        let stepsBetween: number[] = [];
        let increment: number = (end - begin) / steps;

        while (++i < steps) {
            stepsBetween.push((i * increment) + begin);
        }

        return stepsBetween;
    }
}
