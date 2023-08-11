import { onBeforeUpdate, ref } from 'vue'
import type { ComponentPublicInstance, Ref } from 'vue'

type RefType = HTMLElement | ComponentPublicInstance
type RefKey = number | string
type RefsValue<T extends RefType> = Map<RefKey, T>
export function useRefs<T extends RefType>(): [
  Ref<RefsValue<T>>,
  (key: RefKey) => (el: any) => void
] {
  const refs = ref<RefsValue<T>>(new Map())
  const setRefs = (index: RefKey) => (el: any) => {
    refs.value.set(index, el)
  }

  onBeforeUpdate(() => refs.value.clear())

  return [refs, setRefs]
}
