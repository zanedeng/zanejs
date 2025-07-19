# 手风琴 Accordion

手风琴组件‌通过‌渐进式布局‌，在小空间内呈现大量内容。其‌标题栏‌为用户提供内容‌总览‌，帮助用户决定需要阅读哪些部分。

手风琴可以提升信息处理和发现的效率。然而，它也会向用户‌隐藏内容‌。至关重要的是，需要考虑用户可能‌不会注意到或阅读所有内容‌的风险。如果用户‌需要阅读所有内容‌，则‌不应使用手风琴‌，因为这‌增加了额外的点击成本‌；此时，应使用带有常规标题的‌整页滚动布局‌。

## 演示

### 基本用法

:::demo src=examples/accordion/accordion-1.vue :::

### 展开多个面板

:::demo src=examples/accordion/accordion-2.vue :::

## API

### Accordion 属性

| 属性名 | HTML 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- |
| `align` | `align` | 手风琴项目下拉对齐。 | `"end" \| "start"` | `'end'` |
| `multiple` | `multiple` | 是否只允许展开多个面板 | `boolean` | `false` |
| `size` | `size` | 手风琴尺寸 | `"lg" \| "md" \| "sm"` | `'md'` |

### Accordion Item 属性

| 属性名 | HTML 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- |
| `disabled` | `disabled` | 如果是 `true`，用户将无法与按钮进行交互。默认为 `false`。 | `boolean` | `false` |
| `heading` | `heading` | 菜单项值。 | `string` | `undefined` |
| `open` | `open` | 菜单项选择状态。 | `boolean` | `false` |

### 事件

| 事件名 | 说明 | 事件类型 |
| --- | --- | --- |
| `zane-accordion-item--click` | Emitted when the menu item is clicked. | `CustomEvent<any>` |

### 阴影部分

| 部位    | 说明 |
| ------- | ---- |
| `title` |      |

### CSS 自定义属性

| 属性名 | 说明 |
| --- | --- |
| `--zane-accordion-item-heading-background` | 手风琴项目标头的背景颜色 |
| `--zane-accordion-item-heading-background-hover` | 悬停在手风琴项目标头的背景颜色 |
| `--zane-accordion-item-title-align` | 手风琴标题的对齐方式 |

### 依赖项

#### 依赖于

- [icon](./icon)
