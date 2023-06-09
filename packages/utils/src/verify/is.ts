export const objectToString = Object.prototype.toString

export const is = (value: unknown, type: string): boolean =>
  objectToString.call(value) === `[object ${type}]`
