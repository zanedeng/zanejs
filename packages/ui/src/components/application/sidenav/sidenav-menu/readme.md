# zane-sidenav-menu

<!-- Auto Generated Below -->

## Properties

| Property | Attribute | Description | Type | Default |
| --- | --- | --- | --- | --- |
| `empty` | `empty` |  | `boolean` | `false` |
| `emptyState` | `empty-state` |  | `any` | `` `{     "headline": "No items",     "description": "There are no items to display"   }` `` |
| `showLoader` | `show-loader` |  | `boolean` | `false` |
| `value` | `value` |  | `number \| string` | `undefined` |

## Methods

### `setFocus() => Promise<void>`

Sets focus on first menu item. Use this method instead of the global `element.focus()`.

#### Returns

Type: `Promise<void>`

## Dependencies

### Depends on

- [zane-empty-state](../../empty-state)

### Graph

```mermaid
graph TD;
  zane-sidenav-menu --> zane-empty-state
  zane-empty-state --> zane-svg
  zane-empty-state --> zane-button
  zane-button --> zane-spinner
  zane-button --> zane-icon
  style zane-sidenav-menu fill:#f9f,stroke:#333,stroke-width:4px
```

---

_Built with [StencilJS](https://stenciljs.com/)_
