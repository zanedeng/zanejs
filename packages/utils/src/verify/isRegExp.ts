import { is } from './is'

export const isRegExp = (val: unknown): val is RegExp => is(val, 'RegExp')
