# zane-dropdown

<!-- Auto Generated Below -->

## Overview

下拉菜单组件

## Properties

| Property | Attribute | Description | Type | Default |
| --- | --- | --- | --- | --- |
| `disabled` | `disabled` | 是否禁用下拉菜单 | `boolean` | `false` |
| `managed` | `managed` | 是否为受控模式 在受控模式下，组件的状态完全由外部控制 | `boolean` | `false` |
| `open` | `open` | 下拉菜单是否打开 | `boolean` | `false` |
| `placements` | `placements` | 下拉菜单位置选项 多个位置用逗号分隔，按优先级排序 | `string` | `'bottom-start,top-start,bottom-end,top-end'` |
| `trigger` | `trigger` | 触发下拉菜单的方式 - 'click': 点击触发 - 'hover': 悬停触发 - 'manual': 手动控制 | `"click" \| "hover" \| "manual"` | `'click'` |

## Events

| Event                       | Description      | Type               |
| --------------------------- | ---------------- | ------------------ |
| `zane-dropdown--close`      | 下拉菜单关闭事件 | `CustomEvent<any>` |
| `zane-dropdown--item-click` | 菜单项点击事件   | `CustomEvent<any>` |
| `zane-dropdown--open`       | 下拉菜单打开事件 | `CustomEvent<any>` |

## Methods

### `setFocus() => Promise<void>`

设置焦点的公共方法

#### Returns

Type: `Promise<void>`

---

_Built with [StencilJS](https://stenciljs.com/)_
