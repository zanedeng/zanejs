import type { HeadConfig } from 'vitepress';

import { fileURLToPath } from 'node:url';

import {
  demoPreviewPlugin,
  viteDemoPreviewPlugin,
} from '@vitepress-code-preview/plugin';
import UnoCSS from 'unocss/vite';
import { defineConfig } from 'vitepress';
import {
  groupIconMdPlugin,
  groupIconVitePlugin,
} from 'vitepress-plugin-group-icons';

import { search } from './search.mts';

const ogUrl = 'https://www.zanejs.com/';
const ogImage = `${ogUrl}og.png#1`;
const title = 'ZaneJS';
const description = '';

const Head: HeadConfig[] = [
  ['link', { href: '/logo.svg', rel: 'icon', type: 'image/svg+xml' }],
  [
    'link',
    {
      href: '/favicon.ico',
      rel: 'alternate icon',
      sizes: '16x16',
      type: 'image/png',
    },
  ],
  ['meta', { content: 'Zane Deng', name: 'author' }],
  ['meta', { content: 'website', property: 'og:type' }],
  ['meta', { content: title, name: 'og:title' }],
  ['meta', { content: description, name: 'og:description' }],
  ['meta', { content: ogImage, property: 'og:image' }],
  ['meta', { content: title, name: 'twitter:title' }],
  ['meta', { content: 'summary_large_image', name: 'twitter:card' }],
  ['meta', { content: ogImage, name: 'twitter:image' }],
  ['meta', { content: '@zanedeng', name: 'twitter:site' }],
  ['meta', { content: ogUrl, name: 'twitter:url' }],
  [
    'link',
    {
      href: '/search.xml',
      rel: 'search',
      title: 'ZaneJs',
      type: 'application/opensearchdescription+xml',
    },
  ],
];

export const shared = defineConfig({
  appearance: 'dark',
  ignoreDeadLinks: true, // 完全禁用死链检查
  description,
  head: Head,
  markdown: {
    codeTransformers: [],
    config(md) {
      const docRoot = fileURLToPath(new URL('../../src/', import.meta.url));
      md.use(demoPreviewPlugin, { docRoot });
      md.use(groupIconMdPlugin);
    },
    theme: {
      dark: 'vitesse-dark',
      light: 'vitesse-light',
    },
  },
  srcDir: 'src',
  themeConfig: {
    i18nRouting: true,
    logo: '/logo.svg',
    search: {
      options: {
        locales: {
          ...search,
        },
      },
      provider: 'local',
    },
    siteTitle: 'ZaneJS',
    socialLinks: [
      { icon: 'github', link: 'https://github.com/zanedeng/zanejs' },
    ],
  },
  title,
  titleTemplate: title,
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: tag => tag.startsWith('zane-')
      }
    }
  },
  vite: {
    build: {
      chunkSizeWarningLimit: Infinity,
      minify: 'terser',
    },
    resolve: {
      // 确保 Vite 能正确解析 monorepo 依赖
      preserveSymlinks: true,
    },
    plugins: [
      groupIconVitePlugin({
        customIcon: {
          postcss: 'vscode-icons:file-type-postcss',
        },
      }),
      UnoCSS(),
      viteDemoPreviewPlugin() as any,
    ],
  },
});
