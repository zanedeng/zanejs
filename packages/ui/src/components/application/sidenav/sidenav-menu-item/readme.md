# zane-sidenav-menu-item

<!-- Auto Generated Below -->

## Overview

侧边导航菜单项组件

## Properties

| Property | Attribute | Description | Type | Default |
| --- | --- | --- | --- | --- |
| `disabled` | `disabled` | 是否禁用菜单项 | `boolean` | `false` |
| `selected` | `selected` | 选中状态 | `boolean` | `false` |
| `value` | `value` | 菜单项值，支持null/数字/字符串类型 | `number \| string` | `undefined` |

## Events

| Event                          | Description    | Type               |
| ------------------------------ | -------------- | ------------------ |
| `zane:sidenav-menu-item-click` | 菜单项点击事件 | `CustomEvent<any>` |

## Methods

### `setBlur() => Promise<void>`

移除焦点

#### Returns

Type: `Promise<void>`

### `setFocus() => Promise<void>`

设置焦点

#### Returns

Type: `Promise<void>`

---

_Built with [StencilJS](https://stenciljs.com/)_
