# zane-image

<!-- Auto Generated Below -->

## Overview

自适应主题图片组件（zane-image）该组件能够根据当前系统的明暗主题自动切换显示的图片资源。当检测到处于暗色模式时，优先使用 darkSrc 指定的暗色主题图片；否则使用 src 指定的默认图片。组件内部通过监听主题变化事件实现实时切换，无需手动刷新。

## Properties

| Property | Attribute | Description | Type | Default |
| --- | --- | --- | --- | --- |
| `darkSrc` | `dark-src` | 暗色主题下的图片地址。 当系统处于暗色模式且该值存在时，将优先渲染此图片。 | `string` | `undefined` |
| `imageTitle` | `image-title` | 图片的替代文本（alt 属性）。 用于无障碍访问及图片加载失败时的占位说明。 | `string` | `undefined` |
| `src` | `src` |  | `string` | `undefined` |

---

_Built with [StencilJS](https://stenciljs.com/)_
