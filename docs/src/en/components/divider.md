# Divider

A divider can be used to segment content vertically or horizontally.

## Demo

### Basic Usage

:::demo src=examples/divider/divider-1.vue :::

# API

## Properties

| Property | Attribute | Description | Type | Default |
| --- | --- | --- | --- | --- |
| `color` | `color` |  | `"error" \| "helper" \| "inverse" \| "on-color" \| "primary" \| "secondary" \| "tertiary"` | `'primary'` |
| `configAria` | `config-aria` |  | `any` | `{}` |
| `expressive` | `expressive` |  | `boolean` | `false` |
| `headingLevel` | `heading-level` |  | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | `undefined` |
| `headingSize` | `heading-size` |  | `1 \| 2 \| 3 \| 4 \| 5 \| 6 \| 7` | `undefined` |
| `inline` | `inline` |  | `boolean` | `false` |
| `type` | `type` |  | `"body" \| "body-compact" \| "code" \| "fluid-heading" \| "heading" \| "heading-compact" \| "helper-text" \| "label" \| "legal"` | `'body'` |

## Dependencies

### Used by

- [breadcrumb-item](../breadcrumb)
- [footer-copyright](./footer-copyright)
- [modal](./modal)
- [select](./select)
- [table](./table)
