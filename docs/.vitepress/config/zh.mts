import type { DefaultTheme } from 'vitepress';

import { defineConfig } from 'vitepress';

import { version } from '../../package.json';

const nav: DefaultTheme.NavItem[] = [
  {
    link: '/components/',
    text: '组件库',
  },
  {
    text: `v${version}`,
    items: [
      {
        link: 'https://github.com/zanedeng/zanejs/releases',
        text: '发行说明',
      },
      {
        component: 'RainbowAnimationSwitcher',
        props: {
          text: '彩虹动画',
        },
      },
    ],
  },
];

const SidebarComponents: DefaultTheme.SidebarItem[] = [];

export const zh = defineConfig({
  description: '',
  lang: 'zh-Hans',
  themeConfig: {
    darkModeSwitchLabel: '主题',
    darkModeSwitchTitle: '切换到深色模式',
    docFooter: {
      next: '下一页',
      prev: '上一页',
    },
    editLink: {
      pattern: 'https://github.com/zanedeng/zanejs/edit/main/docs/src/:path',
      text: '在 GitHub 上编辑此页面',
    },
    footer: {
      copyright: `Copyright © 2020-${new Date().getFullYear()} ZaneJS`,
      message: '基于 MIT 许可发布.',
    },
    langMenuLabel: '多语言',
    lastUpdated: {
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium',
      },
      text: '最后更新于',
    },
    lightModeSwitchTitle: '切换到浅色模式',
    nav,

    outline: {
      label: '页面导航',
    },
    returnToTopLabel: '回到顶部',

    sidebar: {
      '/components/': SidebarComponents,
    },
    sidebarMenuLabel: '菜单',
  },
});
