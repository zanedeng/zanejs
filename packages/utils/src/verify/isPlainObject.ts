import { is } from './is'

export const isPlainObject = (val: unknown): val is object => is(val, 'Object')
