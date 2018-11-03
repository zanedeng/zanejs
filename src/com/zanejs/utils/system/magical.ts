module zanejs {

    /**
     * PHP 中有 __get 、 __set 和 __call 三个强大的魔术方法，可以实现对不存在的属性的读写和方法调用。
     * 在新的 ES 标准中添加了 Proxy 类，它可以构造 Proxy 对象，用来“重载”对象的属性和方法读写，
     * 从而实现类似于 PHP 的魔术方法：
     * class Foo {
     *      __set(key, value) {
     *          this[key] = value * 2;
     *      }
     *
     *      __get(key) {
     *          return this.b;
     *      }
     *
     *      __call(key, ...args){
     *          console.log(`call method ${key} with ${args}`);
     *      }
     *
     *      b(...args){
     *          console.log(`b exists: ${args}`);
     *      }
     * }
     *
     * Foo = Magical(Foo);
     * var f = new Foo();
     * f.b(1,2,3);
     * f.a(4,5,6);
     * f.c = 3;
     * console.log(f.c);
     * 上面的例子里，我们在对象构造的时候，分别“代理”对象实例的属性 get 和 set 方法，
     * 如果对象上已存在某个属性或方法，代理直接返回或操作该属性。
     * 否则，判断对象上是否有 __get、__set 或者 __call 方法，有的话，做相应的处理。
     * 这里我们使用装饰器模式，定义了一个 Magical 装饰器函数，让它来处理希望使用 Magical 的类。
     *
     * @param Class
     * @returns {(...args: any[]) => Object}
     * @constructor
     */
    export function magical(Class: any) {
        return function(...args: any[]){
            return new (<any> window).Proxy(new Class(...args), {
                get: function(target: any, key: string, receiver: any) {
                    if (typeof target[key] !== 'undefined') {
                        return target[key];
                    }

                    if (typeof target.__get === 'function') {
                        return target.__get(key);
                    } else if (typeof target.__call === 'function') {
                        return function(...$args: any[]){
                            target.__call.apply(this, [key, ...$args]);
                        };
                    }
                },
                set: function(target: any, key: string, value: any, receiver: any){
                    if (typeof target[key] !== 'undefined') {
                        target[key] = value;
                        return;
                    }

                    if (typeof target.__set === 'function') {
                        target.__set(key, value);
                        return;
                    }
                }
            });
        };
    }
}
