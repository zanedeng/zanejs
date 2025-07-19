# zane-menu

<!-- Auto Generated Below -->

## Overview

多功能菜单容器组件

## Properties

| Property | Attribute | Description | Type | Default |
| --- | --- | --- | --- | --- |
| `empty` | `empty` | 空状态标识 | `boolean` | `false` |
| `emptyStateDescription` | `empty-state-description` | 空状态描述文本 | `string` | `'There are no items to display'` |
| `emptyStateHeadline` | `empty-state-headline` | 空状态标题文本 | `string` | `'No items'` |
| `layer` | `layer` | UI层级样式 | `"01" \| "02" \| "background"` | `undefined` |
| `showLoader` | `show-loader` | 加载状态标识 | `boolean` | `false` |
| `size` | `size` | 菜单尺寸 | `"lg" \| "md" \| "sm"` | `'md'` |
| `value` | `value` | 当前选中值 | `number \| string` | `undefined` |

## Methods

### `setFocus() => Promise<void>`

设置初始焦点

#### Returns

Type: `Promise<void>`

## CSS Custom Properties

| Name                     | Description                  |
| ------------------------ | ---------------------------- |
| `--zane-menu-background` | Background color of the menu |
| `--zane-menu-max-height` | Maximum height of the menu   |
| `--zane-menu-shadow`     | Shadow of the menu           |

## Dependencies

### Used by

- [zane-dropdown-menu](../../dropdown/dropdown-menu)
- [zane-html-editor](../../html-editor)
- [zane-select](../../select)

### Depends on

- [zane-empty-state](../../application/empty-state)

### Graph

```mermaid
graph TD;
  zane-menu --> zane-empty-state
  zane-empty-state --> zane-svg
  zane-empty-state --> zane-button
  zane-button --> zane-spinner
  zane-button --> zane-icon
  zane-dropdown-menu --> zane-menu
  zane-html-editor --> zane-menu
  zane-select --> zane-menu
  style zane-menu fill:#f9f,stroke:#333,stroke-width:4px
```

---

_Built with [StencilJS](https://stenciljs.com/)_
