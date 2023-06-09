import { is } from './is'

export const isNumber = (val: unknown): val is Number => is(val, 'Number')
