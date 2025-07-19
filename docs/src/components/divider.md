# 分割线 Divider

分隔线‌可用于‌垂直或水平‌分割内容。

## 演示

### 基本用法

:::demo src=examples/divider/divider-1.vue :::

## API

### 属性

| 属性名 | HTML 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- |
| `color` | `color` |  | `"error" \| "helper" \| "inverse" \| "on-color" \| "primary" \| "secondary" \| "tertiary"` | `'primary'` |
| `configAria` | `config-aria` |  | `any` | `{}` |
| `expressive` | `expressive` |  | `boolean` | `false` |
| `headingLevel` | `heading-level` |  | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | `undefined` |
| `headingSize` | `heading-size` |  | `1 \| 2 \| 3 \| 4 \| 5 \| 6 \| 7` | `undefined` |
| `inline` | `inline` |  | `boolean` | `false` |
| `type` | `type` |  | `"body" \| "body-compact" \| "code" \| "fluid-heading" \| "heading" \| "heading-compact" \| "helper-text" \| "label" \| "legal"` | `'body'` |

### 依赖项

#### 使用者

- [breadcrumb-item](../breadcrumb)
- [footer-copyright](./footer-copyright)
- [modal](./modal)
- [select](./select)
- [table](./table)
