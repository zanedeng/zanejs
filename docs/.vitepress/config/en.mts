import type { DefaultTheme } from 'vitepress';

import { defineConfig } from 'vitepress';

import { version } from '../../package.json';

const nav: DefaultTheme.NavItem[] = [
  {
    text: `v${version}`,
    items: [
      {
        link: 'https://github.com/zanedeng/zanejs/releases',
        text: 'Release Notes',
      },
      {
        component: 'RainbowAnimationSwitcher',
        props: {
          text: 'Rainbow Animation',
        },
      },
    ],
  },
];

const SidebarComponents: DefaultTheme.SidebarItem[] = [
  {
    text: 'Overview',
    link: '/components/'
  },
  {
    text: 'Common (9)',
    items: [
      { link: '/en/components/avatar', text: 'Avatar' },
      { link: '/en/components/button', text: 'Button' },
      { link: '/en/components/card', text: 'Card' },
      { link: '/en/components/accordion', text: 'Accordion' },
      { link: '/en/components/divider', text: 'Divider' },
      { link: '/en/components/dropdown', text: 'Dropdown' },
      { link: '/en/components/icon', text: 'Icon' },
      { link: '/en/components/tag', text: 'Tag' },
      { link: '/en/components/text', text: 'Text' },
    ],
  },
  {
    text: 'Data Input (9)',
    items: [
      { link: '/en/components/checkbox', text: 'Checkbox' },
      { link: '/en/components/date-picker', text: 'Date Picker' },
      { link: '/en/components/input', text: 'Input' },
      { link: '/en/components/input-number', text: 'Input Number' },
      { link: '/en/components/input-url', text: 'Input Url' },
      { link: '/en/components/select', text: 'Select' },
      { link: '/en/components/slider', text: 'Slider' },
      { link: '/en/components/toggle', text: 'Toggle' },
      { link: '/en/components/time-picker', text: 'Time Picker' },
      { link: '/en/components/code-editor', text: 'Code editor' },
      { link: '/en/components/html-editor', text: 'Html editor' },
    ],
  },
  {
    text: 'Data Display (7)',
    items: [
      { link: '/en/components/code-highlighter', text: 'Code' },
      { link: '/en/components/empty', text: 'Empty' },
      { link: '/en/components/image', text: 'Image' },
      { link: '/en/components/svg', text: 'Svg' },
      { link: '/en/components/table', text: 'Table' },
      { link: '/en/components/current-time', text: 'Time' },
      { link: '/en/components/tree', text: 'Tree' },
    ],
  },
  {
    text: 'Navigation (3)',
    items: [
      { link: '/en/components/breadcrumb', text: 'Breadcrumb' },
      { link: '/en/components/menu', text: 'Menu' },
      { link: '/en/components/tabs', text: 'Tabs' },
    ],
  },
  {
    text: 'Feedback (7)',
    items: [
      { link: '/en/components/badge', text: 'Badge' },
      { link: '/en/components/modal', text: 'Modal' },
      { link: '/en/components/notification', text: 'Notification' },
      { link: '/en/components/popover', text: 'Popover' },
      { link: '/en/components/progress', text: 'Progress' },
      { link: '/en/components/spinner', text: 'Spinner' },
      { link: '/en/components/tooltip', text: 'Tooltip' },
    ],
  },
];

export const en = defineConfig({
  description: '',
  lang: 'en-US',
  themeConfig: {
    darkModeSwitchLabel: 'Theme',
    darkModeSwitchTitle: 'Switch to Dark Mode',
    docFooter: {
      next: 'Next Page',
      prev: 'Previous Page',
    },
    editLink: {
      pattern: 'https://github.com/zanedeng/zanejs/edit/main/docs/src/:path',
      text: 'Edit this page on GitHub',
    },
    footer: {
      copyright: `Copyright © 2020-${new Date().getFullYear()} ZaneJS`,
      message: 'Released under the MIT License.',
    },
    langMenuLabel: 'Language',
    lastUpdated: {
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium',
      },
      text: 'Last updated on',
    },
    lightModeSwitchTitle: 'Switch to Light Mode',
    nav,
    outline: {
      label: 'Navigate',
      level: [2, 3],
    },
    returnToTopLabel: 'Back to top',
    sidebar: {
      '/en/components/': SidebarComponents,
    },
  },
});
