import { is } from './is'

export const isBoolean = (val: unknown): val is Boolean => is(val, 'Boolean')
