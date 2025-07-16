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
    text: 'Common (9)',
    items: [
      { link: '/components/avatar', text: 'Avatar' },
      { link: '/components/button', text: 'Button' },
      { link: '/components/card', text: 'Card' },
      { link: '/components/accordion', text: 'Accordion' },
      { link: '/components/divider', text: 'Divider' },
      { link: '/components/dropdown', text: 'Dropdown' },
      { link: '/components/icon', text: 'Icon' },
      { link: '/components/tag', text: 'Tag' },
      { link: '/components/text', text: 'Text' },
    ],
  },
  {
    text: 'Data Input (9)',
    items: [
      { link: '/components/checkbox', text: 'Checkbox' },
      { link: '/components/date-picker', text: 'Date Picker' },
      { link: '/components/input', text: 'Input' },
      { link: '/components/input-number', text: 'Input Number' },
      { link: '/components/input-url', text: 'Input Url' },
      { link: '/components/select', text: 'Select' },
      { link: '/components/slider', text: 'Slider' },
      { link: '/components/toggle', text: 'Toggle' },
      { link: '/components/time-picker', text: 'Time Picker' },
      { link: '/components/code-editor', text: 'Code editor' },
      { link: '/components/html-editor', text: 'Html editor' },
    ],
  },
  {
    text: 'Data Display (7)',
    items: [
      { link: '/components/code-highlighter', text: 'Code' },
      { link: '/components/empty', text: 'Empty' },
      { link: '/components/image', text: 'Image' },
      { link: '/components/svg', text: 'Svg' },
      { link: '/components/table', text: 'Table' },
      { link: '/components/current-time', text: 'Time' },
      { link: '/components/tree', text: 'Tree' },
    ],
  },
  {
    text: 'Navigation (3)',
    items: [
      { link: '/components/breadcrumb', text: 'Breadcrumb' },
      { link: '/components/menu', text: 'Menu' },
      { link: '/components/tabs', text: 'Tabs' },
    ],
  },
  {
    text: 'Feedback (7)',
    items: [
      { link: '/components/badge', text: 'Badge' },
      { link: '/components/modal', text: 'Modal' },
      { link: '/components/notification', text: 'Notification' },
      { link: '/components/popover', text: 'Popover' },
      { link: '/components/progress', text: 'Progress' },
      { link: '/components/spinner', text: 'Spinner' },
      { link: '/components/tooltip', text: 'Tooltip' },
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
    },
    returnToTopLabel: 'Back to top',
    sidebar: {
      '/en/components/': SidebarComponents,
    },
  },
});
