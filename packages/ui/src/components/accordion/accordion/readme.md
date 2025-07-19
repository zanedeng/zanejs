# zane-accordion

<!-- Auto Generated Below -->

## Overview

可折叠面板(Accordion)容器组件

提供可折叠内容区域的容器组件，管理多个折叠项的状态和交互。支持单开/多开模式、多种尺寸和图标位置配置。

## Properties

| Property | Attribute | Description | Type | Default |
| --- | --- | --- | --- | --- |
| `align` | `align` | 控制折叠指示图标的位置 1. `end`: 图标显示在面板标题的末尾(右侧)(默认值) 2. `start`: 图标显示在面板标题的开头(左侧) | `"end" \| "start"` | `'end'` |
| `multiple` | `multiple` | 是否允许多个面板同时展开 - true: 允许多个面板同时保持展开状态 - false: 同一时间只能展开一个面板(默认值) | `boolean` | `false` |
| `size` | `size` | 控制折叠面板的尺寸变体 - 'lg': 大尺寸，适合需要突出显示的内容 - 'md': 中等尺寸(默认值)，通用尺寸 - 'sm': 小尺寸，适合紧凑布局 | `"lg" \| "md" \| "sm"` | `'md'` |

## Slots

| Slot        | Description |
| ----------- | ----------- |
| `"default"` | 默认插槽    |

---

_Built with [StencilJS](https://stenciljs.com/)_
