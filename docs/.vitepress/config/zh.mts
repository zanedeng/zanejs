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

const SidebarComponents: DefaultTheme.SidebarItem[] = [
  {
    text: '通用组件 (9)',
    items: [
      { link: '/components/avatar', text: '头像 Avatar' },
      { link: '/components/button', text: '按钮 Button' },
      { link: '/components/card', text: '卡片 Card' },
      { link: '/components/accordion', text: '手风琴 Accordion' },
      { link: '/components/divider', text: '分割线 Divider' },
      { link: '/components/dropdown', text: '下拉菜单 Dropdown' },
      { link: '/components/icon', text: '图标 Icon' },
      { link: '/components/tag', text: '标签 Tag' },
      { link: '/components/text', text: '文本 Text' },
    ],
  },
  {
    text: '数据录入组件 (9)',
    items: [
      { link: '/components/checkbox', text: '复选框 Checkbox' },
      { link: '/components/date-picker', text: '日期选择器 Date Picker' },
      { link: '/components/input', text: '文本输入 Input' },
      { link: '/components/input-number', text: '数字输入 Input Number' },
      { link: '/components/input-url', text: '网址输入 Input Url' },
      { link: '/components/select', text: '选择器 Select' },
      { link: '/components/slider', text: '滑动选择 Slider' },
      { link: '/components/toggle', text: '开关 Toggle' },
      { link: '/components/time-picker', text: '时间选择器 Time Picker' },
      { link: '/components/code-editor', text: '代码编辑器 Code editor' },
      { link: '/components/html-editor', text: 'Html编辑器 Html editor' },
    ],
  },
  {
    text: '数据展示组件 (7)',
    items: [
      { link: '/components/code-highlighter', text: '代码 Code' },
      { link: '/components/empty', text: '无内容 Empty' },
      { link: '/components/image', text: '图像 Image' },
      { link: '/components/svg', text: '矢量图 Svg' },
      { link: '/components/table', text: '表格 Table' },
      { link: '/components/current-time', text: '时间 Time' },
      { link: '/components/tree', text: '树 Tree' },
    ],
  },
  {
    text: '导航组件 (3)',
    items: [
      { link: '/components/breadcrumb', text: '面包屑 Breadcrumb' },
      { link: '/components/menu', text: '菜单 Menu' },
      { link: '/components/tabs', text: '标签页 Tabs' },
    ],
  },
  {
    text: '反馈组件 (7)',
    items: [
      { link: '/components/badge', text: '标记 Badge' },
      { link: '/components/modal', text: '模态框 Modal' },
      { link: '/components/notification', text: '通知 Notification' },
      { link: '/components/popover', text: '弹出信息 Popover' },
      { link: '/components/progress', text: '进度 Progress' },
      { link: '/components/spinner', text: '加载 Spinner' },
      { link: '/components/tooltip', text: '弹出提示 Tooltip' },
    ],
  },
];

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
      level: [2, 3],
    },
    returnToTopLabel: '回到顶部',

    sidebar: {
      '/components/': SidebarComponents,
    },
    sidebarMenuLabel: '菜单',
  },
});
