# Accordion

The accordion component delivers large amounts of content in a small space through progressive disclosure. The header title give the user a high level overview of the content allowing the user to decide which sections to read.

Accordions can make information processing and discovering more effective. However, it does hide content from users and it’s important to account for a user not noticing or reading all of the included content. If a user is likely to read all of the content then don’t use an accordion as it adds the burden of an extra click; instead use a full scrolling page with normal headers.

## Demo

### Basic Usage

:::demo src=examples/accordion/accordion-1.vue :::

### Multiple

:::demo src=examples/accordion/accordion-2.vue :::

## API

### Accordion Properties

| Property | Attribute | Description | Type | Default |
| --- | --- | --- | --- | --- |
| `align` | `align` | Accordion item dropdown alignment. | `"end" \| "start"` | `'end'` |
| `multiple` | `multiple` |  | `boolean` | `false` |
| `size` | `size` | The According size. | `"lg" \| "md" \| "sm"` | `'md'` |

### Accordion Item Properties

| Property | Attribute | Description | Type | Default |
| --- | --- | --- | --- | --- |
| `disabled` | `disabled` | If true, the user cannot interact with the button. Defaults to `false`. | `boolean` | `false` |
| `heading` | `heading` | The menu item value. | `string` | `undefined` |
| `open` | `open` | Menu item selection state. | `boolean` | `false` |

### Events

| Event | Description | Type |
| --- | --- | --- |
| `zane-accordion-item--click` | Emitted when the menu item is clicked. | `CustomEvent<any>` |

### Shadow Parts

| Part    | Description |
| ------- | ----------- |
| `title` |             |

### CSS Custom Properties

| Name | Description |
| --- | --- |
| `--zane-accordion-item-heading-background - Background color of the accordion item header` |  |
| `--zane-accordion-item-heading-background-hover - Background color of the accordion item header on hover` |  |
| `--zane-accordion-item-title-align - Alignment of the accordion title` |  |

### Dependencies

#### Depends on

- [icon](./icon)
