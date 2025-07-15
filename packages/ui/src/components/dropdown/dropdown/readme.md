# zane-dropdown

<!-- Auto Generated Below -->

## Properties

| Property | Attribute | Description | Type | Default |
| --- | --- | --- | --- | --- |
| `disabled` | `disabled` | If true, the user cannot interact with the button. Defaults to `false`. | `boolean` | `false` |
| `managed` | `managed` |  | `boolean` | `false` |
| `open` | `open` |  | `boolean` | `false` |
| `placements` | `placements` |  | `string` | `'bottom-start,top-start,bottom-end,top-end'` |
| `trigger` | `trigger` |  | `"click" \| "hover" \| "manual"` | `'click'` |

## Events

| Event | Description | Type |
| --- | --- | --- |
| `zane-dropdown--close` | Emitted when the dropdown is closed. | `CustomEvent<any>` |
| `zane-dropdown--item-click` |  | `CustomEvent<any>` |
| `zane-dropdown--open` | Emitted when the dropdown is opened. | `CustomEvent<any>` |

## Methods

### `setFocus() => Promise<void>`

#### Returns

Type: `Promise<void>`

---

_Built with [StencilJS](https://stenciljs.com/)_
