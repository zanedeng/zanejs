# zane-footer

<!-- Auto Generated Below -->

## Overview

页脚(Footer)组件

提供可定制的页脚布局，支持多种变体和插槽内容

## Properties

| Property | Attribute | Description | Type | Default |
| --- | --- | --- | --- | --- |
| `variant` | `variant` | 页脚样式变体 通过CSS类名控制不同样式变体 默认值'simple'会生成'variant-simple'类名 | `string` | `'simple'` |
| `year` | `year` | 版权年份 默认为当前年份，可通过属性覆盖 | `number` | `new Date().getFullYear()` |

## Slots

| Slot                   | Description |
| ---------------------- | ----------- |
| `"end 右侧内容插槽"`   |             |
| `"start 左侧内容插槽"` |             |

---

_Built with [StencilJS](https://stenciljs.com/)_
