import { is } from './is'

export const isDate = (val: unknown): val is Date => is(val, 'Date')
