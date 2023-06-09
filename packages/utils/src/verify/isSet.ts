import { is } from './is'

export const isSet = (val: unknown): val is Set<any> => is(val, 'Set')
