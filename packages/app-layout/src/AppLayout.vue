<template>
  <div style="position: relative">
    <div ref="GLRoot" style="position: absolute; width: 100%; height: 100%">
      <!-- Root dom for Golden-Layout manager -->
    </div>
  </div>
</template>
<script setup lang="ts">
import { type PropType, getCurrentInstance, onMounted, ref } from 'vue'
import { VirtualLayout } from 'golden-layout'
import type { LayoutConfig, ResolvedLayoutConfig } from 'golden-layout'

const props = defineProps({
  config: {
    type: Object as PropType<LayoutConfig | ResolvedLayoutConfig>,
    default: () => ({}),
  },
})

const instance = getCurrentInstance()
const GLRoot = ref<null | HTMLElement>(null)

let GLayout: VirtualLayout

onMounted(() => {
  if (GLRoot.value == null)
    throw new Error("Golden Layout can't find the root DOM!")

  const onResize = () => {
    const dom = GLRoot.value
    const width = dom ? dom.offsetWidth : 0
    const height = dom ? dom.offsetHeight : 0
    GLayout.setSize(width, height)
  }

  window.addEventListener('resize', onResize, { passive: true })

  /**
   *
   * @param container
   * @param itemConfig
   */
  const bindComponentEventListener = (
    container: ComponentContainer,
    itemConfig: ResolvedComponentItemConfig,
  ): ComponentContainer.BindableComponent => {
    // todo
  }

  /**
   *
   * @param container
   */
  const unbindComponentEventListener = (
    container: ComponentContainer,
  ): void => {
    // todo
  }

  GLayout = new VirtualLayout(
    GLRoot.value as HTMLElement,
    bindComponentEventListener,
    unbindComponentEventListener,
  )
})
</script>
