# zane-header-brand

<!-- Auto Generated Below -->

## Properties

| Property   | Attribute   | Description | Type     | Default     |
| ---------- | ----------- | ----------- | -------- | ----------- |
| `href`     | `href`      |             | `string` | `'#'`       |
| `logo`     | `logo`      |             | `string` | `undefined` |
| `name`     | `name`      |             | `string` | `undefined` |
| `subTitle` | `sub-title` |             | `string` | `undefined` |

## Methods

### `setColor(color: string) => Promise<void>`

#### Parameters

| Name    | Type     | Description |
| ------- | -------- | ----------- |
| `color` | `string` |             |

#### Returns

Type: `Promise<void>`

## Dependencies

### Depends on

- [zane-button](../../../button/button)
- [zane-svg](../../../svg)
- [zane-divider](../../../divider)

### Graph

```mermaid
graph TD;
  zane-header-brand --> zane-button
  zane-header-brand --> zane-svg
  zane-header-brand --> zane-divider
  zane-button --> zane-spinner
  zane-button --> zane-icon
  style zane-header-brand fill:#f9f,stroke:#333,stroke-width:4px
```

---

_Built with [StencilJS](https://stenciljs.com/)_
