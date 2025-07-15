# zane-empty-state

<!-- Auto Generated Below -->

## Properties

| Property | Attribute | Description | Type | Default |
| --- | --- | --- | --- | --- |
| `action` | `action` |  | `string` | `undefined` |
| `actionDisabled` | `action-disabled` |  | `boolean` | `false` |
| `actionUrl` | `action-url` |  | `string` | `undefined` |
| `actionVariant` | `action-variant` |  | `"default" \| "ghost" \| "outline"` | `'default'` |
| `description` | `description` |  | `string` | `undefined` |
| `headline` | `headline` |  | `string` | `undefined` |
| `illustration` | `illustration` |  | `string` | `'no-document'` |

## Dependencies

### Used by

- [zane-menu](../../menu/menu)
- [zane-sidenav-menu](../sidenav/sidenav-menu)
- [zane-table](../../table)
- [zane-tree](../../tree/tree)

### Depends on

- [zane-svg](../../svg)
- [zane-button](../../button/button)

### Graph

```mermaid
graph TD;
  zane-empty-state --> zane-svg
  zane-empty-state --> zane-button
  zane-button --> zane-spinner
  zane-button --> zane-icon
  zane-menu --> zane-empty-state
  zane-sidenav-menu --> zane-empty-state
  zane-table --> zane-empty-state
  zane-tree --> zane-empty-state
  style zane-empty-state fill:#f9f,stroke:#333,stroke-width:4px
```

---

_Built with [StencilJS](https://stenciljs.com/)_
