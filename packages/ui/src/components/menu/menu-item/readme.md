# zane-menu-item

<!-- Auto Generated Below -->

## Properties

| Property | Attribute | Description | Type | Default |
| --- | --- | --- | --- | --- |
| `color` | `color` |  | `"black" \| "danger" \| "default" \| "primary" \| "secondary" \| "success" \| "warning" \| "white"` | `'default'` |
| `disabled` | `disabled` | If true, the user cannot interact with the button. Defaults to `false`. | `boolean` | `false` |
| `href` | `href` | Hyperlink to navigate to on click. | `string` | `undefined` |
| `layer` | `layer` |  | `"01" \| "02" \| "background"` | `undefined` |
| `selectable` | `selectable` |  | `boolean` | `false` |
| `selected` | `selected` | Menu item selection state. | `boolean` | `false` |
| `target` | `target` | Sets or retrieves the window or frame at which to target content. | `string` | `'_self'` |
| `value` | `value` | The menu item value. | `number \| string` | `undefined` |

## Events

| Event | Description | Type |
| --- | --- | --- |
| `zane-menu-item--click` | Emitted when the menu item is clicked. | `CustomEvent<any>` |

## Methods

### `setBlur() => Promise<void>`

Sets blur on the native `input` in `zane-input`. Use this method instead of the global `input.blur()`.

#### Returns

Type: `Promise<void>`

### `setFocus() => Promise<void>`

Sets focus on the native `input` in `zane-input`. Use this method instead of the global `input.focus()`.

#### Returns

Type: `Promise<void>`

## Dependencies

### Used by

- [zane-html-editor](../../html-editor)
- [zane-select](../../select)

### Depends on

- [zane-icon](../../icon)

### Graph

```mermaid
graph TD;
  zane-menu-item --> zane-icon
  zane-html-editor --> zane-menu-item
  zane-select --> zane-menu-item
  style zane-menu-item fill:#f9f,stroke:#333,stroke-width:4px
```

---

_Built with [StencilJS](https://stenciljs.com/)_
