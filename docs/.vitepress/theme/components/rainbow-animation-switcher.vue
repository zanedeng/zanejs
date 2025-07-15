<script lang="ts" setup>
import { computed, watch } from 'vue';

import { useLocalStorage, useMediaQuery } from '@vueuse/core';
import { inBrowser } from 'vitepress';

import RainbowSwitcher from './rainbow-switcher.vue';

defineProps<{ screenMenu?: boolean; text?: string }>();

const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)').value;

const animated = useLocalStorage(
  'animate-rainbow',
  inBrowser ? !reduceMotion : true,
);

function toggleRainbow() {
  animated.value = !animated.value;
}

watch(
  animated,
  (anim) => {
    document.documentElement.classList.remove('rainbow');
    if (anim) {
      document.documentElement.classList.add('rainbow');
    }
  },
  { flush: 'post', immediate: inBrowser },
);

const switchTitle = computed(() => {
  return animated.value
    ? 'Disable rainbow animation'
    : 'Enable rainbow animation';
});
</script>

<template>
  <ClientOnly>
    <div class="group" :class="{ mobile: screenMenu }">
      <div class="NavScreenRainbowAnimation">
        <p class="text">
          {{ text ?? 'Rainbow Animation' }}
        </p>
        <RainbowSwitcher
          :title="switchTitle"
          class="RainbowAnimationSwitcher"
          :aria-checked="animated ? 'true' : 'false'"
          @click="toggleRainbow"
        >
          <span class="i-tabler:rainbow animated"></span>
          <span class="i-tabler:rainbow-off non-animated"></span>
        </RainbowSwitcher>
      </div>
    </div>
  </ClientOnly>
</template>

<style scoped>
.group {
  padding-top: 10px;
  margin-top: 1rem !important;
  border-top: 1px solid var(--vp-c-divider);
}

.group.mobile {
  margin-top: 24px;
  border: none !important;
}

.group.mobile .NavScreenRainbowAnimation {
  background-color: var(--vp-c-bg-soft);
}

.group.mobile .NavScreenRainbowAnimation::before {
  max-width: unset;
  margin-top: 16px;
  background-color: var(--vp-c-bg);
}

@media (min-width: 960px) {
  .group:not(.mobile) {
    width: 220px;
    padding-top: 0;
    margin-top: 10px !important;
    margin-bottom: -10px;
  }
}

.NavScreenRainbowAnimation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 220px;
  padding: 12px;
  background-color: var(--vp-c-bg-elv);
  border-radius: 8px;
}

.text {
  font-size: 12px;
  font-weight: 500;
  line-height: 24px;
  color: var(--vp-c-text-2);
}

.animated {
  opacity: 1;
}

.non-animated {
  opacity: 0;
}

.RainbowAnimationSwitcher[aria-checked='false'] .non-animated {
  opacity: 1;
}

.RainbowAnimationSwitcher[aria-checked='true'] .animated {
  opacity: 1;
}

.RainbowAnimationSwitcher[aria-checked='false'] :deep(.check) {
  transform: translateX(18px);
}
</style>
