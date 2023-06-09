import { is } from './is'

export const isMap = (val: unknown): val is Map<any, any> => is(val, 'Map')
