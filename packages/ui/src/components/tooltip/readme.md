# zane-tooltip

<!-- Auto Generated Below -->

## Properties

| Property | Attribute | Description | Type | Default |
| --- | --- | --- | --- | --- |
| `content` | `content` | The content of the tooltip. | `string` | `''` |
| `placements` | `placements` | The placement of the popover relative to the trigger element. Possible values are: - `"top"`: The popover is placed above the trigger element. - `"right"`: The popover is placed to the right of the trigger element. - `"bottom"`: The popover is placed below the trigger element. - `"left"`: The popover is placed to the left of the trigger element. | `string` | `'top,bottom,right,left'` |
| `trigger` | `trigger` | If true, the tooltip will be managed by the parent component. | `"hover" \| "manual"` | `'hover'` |

## Dependencies

### Used by

- [zane-code-highlighter](../code-highlighter)
- [zane-input](../input)
- [zane-slider](../slider)

### Depends on

- [zane-popover](../popover/popover)
- [zane-popover-content](../popover/popover-content)

### Graph

```mermaid
graph TD;
  zane-tooltip --> zane-popover
  zane-tooltip --> zane-popover-content
  zane-code-highlighter --> zane-tooltip
  zane-input --> zane-tooltip
  zane-slider --> zane-tooltip
  style zane-tooltip fill:#f9f,stroke:#333,stroke-width:4px
```

---

_Built with [StencilJS](https://stenciljs.com/)_
