module zanejs {

    /**
     * 把 params 对象的属性值指派给 obj 对象
     * @param obj
     * @param params
     */
    export function assign(obj: any, params: any): any {
        Object.keys(params).map(name => {
            obj[name] = params[name];
        });
        return obj;
    }
}
