
export default function merge(base: any, extend: any): any {
    let merged: any = {};
    Object.keys(base).map(key => {
        merged[key] = base[key];
    });
    Object.keys(extend).map(prop => {
        merged[prop] = extend[prop];
    });
    return merged;
}
