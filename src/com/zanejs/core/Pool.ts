module zanejs {

    let Symbol = (window as any).Symbol;
    let idCounter = 0;

    if (!Symbol) {
        Symbol = (key: string) => {
            return `__${key}_${Math.floor(Math.random() * 1e9)}_${++idCounter}__`;
        };

        Symbol.iterator = Symbol('Symbol.iterator');
    }

    (window as any).Symbol = Symbol;

    const __ = {
        poolDic: Symbol('poolDic')
    };

    export class Pool {

        constructor() {
            this[__.poolDic] = {};
        }

        /**
         * 根据对象标识符
         * 获取对应的对象池
         */
        public getPoolBySign(name: string) {
            return this[__.poolDic][name] || (this[__.poolDic][name] = []);
        }

        /**
         * 根据传入的对象标识符，查询对象池
         * 对象池为空创建新的类，否则从对象池中取
         */
        public getItemByClass(name: string, ClassName: any) {
            let pool = this.getPoolBySign(name);

            let result = (pool.length ?
                pool.shift() :
                new ClassName());

            return result;
        }

        /**
         * 将对象回收到对象池
         * 方便后续继续使用
         */
        public recover(name: string, instance: any) {
            this.getPoolBySign(name).push(instance);
        }
    }

    export let pool = new Pool();
}
