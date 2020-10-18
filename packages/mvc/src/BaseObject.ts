import EventEmitter from 'eventemitter3';

export class BaseObject extends EventEmitter {

    private static hashCodeCounter: number = 0;

    private _hashCode: number;

    constructor() {
        super();
        this._hashCode = BaseObject.hashCodeCounter++;
    }

    get hashCode() {
        return this._hashCode;
    }

    dispose() {
        this.onDispose();
        pool.recycle(this);
    }

    onDispose() {
        // overwrite
    }
}

export class ObjectPool {

    private poolsMap: WeakMap<any, any[]> = new WeakMap();
    private poolMaxCountMap: WeakMap<any, number> = new WeakMap();

    /**
     * 通过pool创建对象，如果pool可取对象，则从pool中取出，否则新建一个对象
     * @param clazz {{new (): any}}
     */
    public create(clazz: { new(): any }): any {
        const pool: any[] = this.poolsMap.get(clazz);
        if (pool && pool.length) {
            return pool.pop();
        }
        return new clazz();
    }

    /**
     * 回收对象，安全起见，不要直接调用，必须由对象自身的dispose调用
     * @param {*} obj
     */
    recycle(obj: any) {
        if (!this.poolsMap.has(obj.constructor)) {
            this.poolsMap.set(obj.constructor, []);
        }
        const pool = this.poolsMap.get(obj.constructor);
        if (pool.indexOf(obj) !== -1) {
            throw new Error('该对象已经存在在对象池中！');
        }
        pool.push(obj);
    }

    /**
     * 设置对象池的大小
     * @param {{new (): any}} clazz
     * @param {number} maxCount
     */
    setMaxCount(clazz: { new(): any }, maxCount: number = 0) {
        if (maxCount < 0) {
            maxCount = 0;
        }
        this.poolMaxCountMap.set(clazz, maxCount);
    }

    /**
     * 填充对象池，用于程序控制内存的创建
     * @param {{ new(): any }} clazz
     * @param {number} maxCount
     */
    fullFill(clazz: { new(): any }, maxCount: number = -1) {
        if (!this.poolsMap.has(clazz)) {
            this.poolsMap.set(clazz, []);
        }
        const pool = this.poolsMap.get(clazz);
        if (maxCount < 0) {
            maxCount = this.poolMaxCountMap.has(clazz) ? this.poolMaxCountMap.get(clazz) : 0;
        }
        let i = pool.length;
        for (; i < maxCount; i++) {
            pool.push(new clazz());
        }
    }

    /**
     * 释放对象池，用于程序控制内存的释放
     * @param {{ new(): any }} clazz
     * @param {number} maxCount
     */
    release(clazz: { new(): any }, maxCount: number = -1) {
        if (!this.poolsMap.has(clazz)) {
            this.poolsMap.set(clazz, []);
        }
        const pool = this.poolsMap.get(clazz);
        if (maxCount < 0) {
            maxCount = this.poolMaxCountMap.has(clazz) ? this.poolMaxCountMap.get(clazz) : 0;
        }
        const len = pool.length;
        if (len > maxCount) {
            pool.length = maxCount;
        }
    }

    /**
     * 释放所有对象池
     * @param {number} maxCount
     */
    releaseAll() {
        this.poolsMap = new WeakMap();
    }
}

export const pool = new ObjectPool();
