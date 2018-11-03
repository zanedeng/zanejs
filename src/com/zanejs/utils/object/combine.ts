module zanejs {

    /**
     * 联合两个对象的属性值, 如果第二个参数和第一个参数存在相同的属性，那么第二个参数的属性值将覆盖第一个属性的值。
     * @param defaultVars
     * @param additionalVars
     */
    export function combine(defaultVars: any, additionalVars: any): any {
        let combinedObject = {};
        Object.keys(defaultVars).map(key => {
            combinedObject[key] = defaultVars[key];
        });
        Object.keys(additionalVars).map(key => {
            combinedObject[key] = additionalVars[key];
        });
        return combinedObject;
    }
}
