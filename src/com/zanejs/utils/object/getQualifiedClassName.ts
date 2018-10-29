/**
 * 返回对象的完全限定类名。
 * @param value 需要完全限定类名称的对象，可以将任何 JavaScript 值传递给此方法，包括所有可用的 JavaScript 类型、对象实例、原始类型
 * （如number)和类对象
 * @returns 包含完全限定类名称的字符串。
 */
export default function getQualifiedClassName(value: any): string {
    let type = typeof value;
    if (!value || (type !== 'object' && !value.prototype)) {
      return type;
    }
    let prototype: any = value.prototype ? value.prototype : Object.getPrototypeOf(value);
    if (prototype.hasOwnProperty('__class__')) {
      return prototype.__class__;
    }
    let constructorString: string = prototype.constructor.toString().trim();
    let index: number = constructorString.indexOf('(');
    let className: string = constructorString.substring(9, index);
    Object.defineProperty(prototype, '__class__', {
      value: className,
      enumerable: false,
      writable: true
    });
    return className;
}
