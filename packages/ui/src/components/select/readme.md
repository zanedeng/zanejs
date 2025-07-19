# zane-select

<!-- Auto Generated Below -->

## Overview

基于 Floating UI 的增强型下拉选择组件

## Properties

| Property | Attribute | Description | Type | Default |
| --- | --- | --- | --- | --- |
| `clearable` | `clearable` | 是否显示清除按钮 | `boolean` | `false` |
| `configAria` | `config-aria` | ARIA属性配置对象 | `any` | `{}` |
| `debounce` | `debounce` | 搜索输入防抖时间（毫秒） | `number` | `300` |
| `disabled` | `disabled` |  | `boolean` | `false` |
| `helperText` | `helper-text` |  | `string` | `undefined` |
| `hideDropdownIcon` | `hide-dropdown-icon` |  | `boolean` | `false` |
| `inline` | `inline` |  | `boolean` | `false` |
| `invalid` | `invalid` |  | `boolean` | `false` |
| `invalidText` | `invalid-text` |  | `string` | `undefined` |
| `items` | `items` |  | `{ icon?: string; label: string \| number; value: string \| number; }[]` | `[]` |
| `label` | `label` |  | `string` | `undefined` |
| `layer` | `layer` | 视觉层级配置 | `"01" \| "02" \| "background"` | `undefined` |
| `multiple` | `multiple` |  | `boolean` | `false` |
| `name` | `name` |  | `string` | `` `zane-input-${this.gid}` `` |
| `open` | `open` |  | `boolean` | `false` |
| `placeholder` | `placeholder` |  | `string` | `undefined` |
| `placements` | `placements` | 下拉菜单定位策略配置 | `string` | `'bottom-start,top-start,bottom-end,top-end'` |
| `readonly` | `readonly` |  | `boolean` | `false` |
| `required` | `required` |  | `boolean` | `false` |
| `search` | `search` | 搜索模式配置 | `"contains" \| "initial" \| "managed" \| "none"` | `'none'` |
| `showLoader` | `show-loader` |  | `boolean` | `false` |
| `size` | `size` | 组件尺寸选项 | `"lg" \| "md" \| "sm"` | `'md'` |
| `state` | `state` | 组件状态标识 | `"default" \| "error" \| "success" \| "warning"` | `'default'` |
| `value` | `value` |  | `number \| string` | `''` |
| `warn` | `warn` |  | `boolean` | `false` |
| `warnText` | `warn-text` |  | `string` | `undefined` |

## Events

| Event                 | Description            | Type               |
| --------------------- | ---------------------- | ------------------ |
| `zane-select--change` | 值变更事件             | `CustomEvent<any>` |
| `zane-select--enter`  | 搜索回车确认事件       | `CustomEvent<any>` |
| `zane-select--search` | 搜索输入事件（带防抖） | `CustomEvent<any>` |

## Methods

### `getComponentId() => Promise<string>`

#### Returns

Type: `Promise<string>`

### `openSelectList() => Promise<void>`

#### Returns

Type: `Promise<void>`

### `setBlur() => Promise<void>`

#### Returns

Type: `Promise<void>`

### `setFocus() => Promise<void>`

#### Returns

Type: `Promise<void>`

## Dependencies

### Used by

- [zane-table](../table)

### Depends on

- [zane-button](../button/button)
- [zane-tag](../tag)
- [zane-icon](../icon)
- [zane-spinner](../spinner)
- [zane-menu](../menu/menu)
- [zane-text](../text)
- [zane-menu-item](../menu/menu-item)

### Graph

```mermaid
graph TD;
  zane-select --> zane-button
  zane-select --> zane-tag
  zane-select --> zane-icon
  zane-select --> zane-spinner
  zane-select --> zane-menu
  zane-select --> zane-text
  zane-select --> zane-menu-item
  zane-button --> zane-spinner
  zane-button --> zane-icon
  zane-tag --> zane-icon
  zane-menu --> zane-empty-state
  zane-empty-state --> zane-svg
  zane-empty-state --> zane-button
  zane-menu-item --> zane-icon
  zane-table --> zane-select
  style zane-select fill:#f9f,stroke:#333,stroke-width:4px
```

---

_Built with [StencilJS](https://stenciljs.com/)_
