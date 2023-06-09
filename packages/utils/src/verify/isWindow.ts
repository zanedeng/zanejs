import { is } from './is'

export const isWindow = (val: any): val is Window =>
  typeof window !== 'undefined' && is(val, 'Window')
