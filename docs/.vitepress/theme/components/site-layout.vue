<script lang="ts" setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

import mediumZoom from 'medium-zoom';
import { inBrowser, useRoute } from 'vitepress';
import DefaultTheme from 'vitepress/theme';

const { Layout } = DefaultTheme;
const route = useRoute();

const initZoom = () => {
  mediumZoom('.VPContent img', { background: 'var(--vp-c-bg)' });
};

const isDark = ref(true);

watch(
  () => route.path,
  () => nextTick(() => initZoom()),
);

watch(
  isDark,
  (v) => {
    const htmlElement = document?.documentElement;
    if (htmlElement) {
      htmlElement.dataset.theme = v ? 'dark' : 'light';
    }
  },
  {
    flush: 'post',
    immediate: inBrowser,
  },
);

onMounted(() => {
  initZoom();
});

// 使用该函数
const observer = watchDarkModeChange((dark) => {
  isDark.value = dark;
});

onBeforeUnmount(() => {
  observer?.disconnect();
});

function watchDarkModeChange(callback: (isDark: boolean) => void) {
  if (typeof window === 'undefined') {
    return;
  }
  const htmlElement = document.documentElement;

  const observer = new MutationObserver(() => {
    const isDark = htmlElement.classList.contains('dark');
    callback(isDark);
  });

  observer.observe(htmlElement, {
    attributeFilter: ['class'],
    attributes: true,
  });

  const initialIsDark = htmlElement.classList.contains('dark');
  callback(initialIsDark);

  return observer;
}
</script>

<template>
  <Layout />
</template>

<style>
.medium-zoom-overlay,
.medium-zoom-image--opened {
  z-index: 2147483647;
}
</style>
