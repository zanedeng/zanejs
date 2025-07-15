# zane-dropdown-menu

<!-- Auto Generated Below -->

## Methods

### `setFocus() => Promise<void>`

Sets focus on first menu item. Use this method instead of the global `element.focus()`.

#### Returns

Type: `Promise<void>`

## CSS Custom Properties

| Name                              | Description                |
| --------------------------------- | -------------------------- |
| `--zane-dropdown-menu-max-height` | Maximum height of the menu |

## Dependencies

### Depends on

- [zane-menu](../../menu/menu)

### Graph

```mermaid
graph TD;
  zane-dropdown-menu --> zane-menu
  zane-menu --> zane-empty-state
  zane-empty-state --> zane-svg
  zane-empty-state --> zane-button
  zane-button --> zane-spinner
  zane-button --> zane-icon
  style zane-dropdown-menu fill:#f9f,stroke:#333,stroke-width:4px
```

---

_Built with [StencilJS](https://stenciljs.com/)_
