# zane-notification-manager

<!-- Auto Generated Below -->

## Properties

| Property | Attribute | Description | Type | Default |
| --- | --- | --- | --- | --- |
| `name` | `name` |  | `string` | `'global'` |
| `position` | `position` |  | `"bottom-left" \| "bottom-right" \| "top-left" \| "top-right"` | `'bottom-right'` |

## Dependencies

### Depends on

- [zane-notification](../notification)

### Graph

```mermaid
graph TD;
  zane-notification-manager --> zane-notification
  zane-notification --> zane-icon
  zane-notification --> zane-button
  zane-button --> zane-spinner
  zane-button --> zane-icon
  style zane-notification-manager fill:#f9f,stroke:#333,stroke-width:4px
```

---

_Built with [StencilJS](https://stenciljs.com/)_
