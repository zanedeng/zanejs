# Button

Buttons are clickable elements that are used to trigger actions. They communicate calls to action to the user and allow users to interact with pages in a variety of ways. Button labels express what action will occur when the user interacts with it.

## Demo

### Basic Usage

:::demo src=examples/button/button-1.vue :::

### Variants

Here are several predefined button styles, each serving its own semantic purpose.

Mix and match the `variant` and `sub-variant` to create a variety of buttons.

`"simple"` is a simple button without default padding at end.

`"block"` is a full-width button that spans the full width of its container.

:::demo src=examples/button/button-2.vue :::

### Colors

Buttons come in different colors to indicate the action or the type of button. The following example shows the different colors available for the button component.

:::demo src=examples/button/button-3.vue :::

Switch your button color in dark theme using `dark-mode-color` attribute

:::demo src=examples/button/button-4.vue :::

Custom color

:::demo src=examples/button/button-5.vue :::

### Sizes

Fancy larger or smaller buttons? Add size attribute for additional sizes.

:::demo src=examples/button/button-6.vue :::

### Icon

:::demo src=examples/button/button-7.vue :::

### Loading

:::demo src=examples/button/button-8.vue :::

### Button Group

:::demo src=examples/button/button-9.vue :::

## API

### Properties

| Property | Attribute | Description | Type | Default |
| --- | --- | --- | --- | --- |
| `appendData` | `append-data` | The `appendData` property allows you to attach additional data to the button component. This data can be of any type, making it versatile for various use cases. It's particularly useful for passing extra context or information that can be accessed in event handlers or other component logic. | `any` | `undefined` |
| `color` | `color` | Defines the primary color of the button. This can be set to predefined color names to apply specific color themes. | `"black" \| "danger" \| "primary" \| "secondary" \| "success" \| "warning" \| "white"` | `'primary'` |
| `configAria` | `config-aria` |  | `any` | `{}` |
| `darkModeColor` | `dark-mode-color` | Color variant for dark mode, applicable when [data-theme="dark"] is set. | `"black" \| "danger" \| "primary" \| "secondary" \| "success" \| "warning" \| "white"` | `undefined` |
| `disabled` | `disabled` | If true, the user cannot interact with the button. Defaults to `false`. | `boolean` | `false` |
| `disabledReason` | `disabled-reason` | If button is disabled, the reason why it is disabled. | `string` | `''` |
| `href` | `href` | Hyperlink to navigate to on click. | `string` | `undefined` |
| `icon` | `icon` | Icon which will displayed on button. Possible values are icon names. | `string` | `undefined` |
| `iconAlign` | `icon-align` | Icon alignment. Possible values are `"start"`, `"end"`. Defaults to `"end"`. | `"end" \| "start"` | `'end'` |
| `selected` | `selected` | Button selection state. | `boolean` | `false` |
| `showLoader` | `show-loader` | If true, a loader will be displayed on button. | `boolean` | `false` |
| `size` | `size` | Button size. Possible values are `"sm"`, `"md"`, `"lg"`, `"xl"`, `"2xl"`, `"full"`. Defaults to `"md"`. | `"2xl" \| "lg" \| "md" \| "sm" \| "xl" \| "xs"` | `'md'` |
| `target` | `target` | Sets or retrieves the window or frame at which to target content. | `string` | `'_self'` |
| `throttleDelay` | `throttle-delay` | Sets the delay for throttle in milliseconds. Defaults to 200 milliseconds. | `number` | `200` |
| `toggle` | `toggle` | If true, the button will be in a toggled state. | `boolean` | `false` |
| `type` | `type` | Button type based on which actions are performed when the button is clicked. | `"button" \| "reset" \| "submit"` | `'button'` |
| `variant` | `variant` | The visual style of the button. Possible variant values: `"default"` is a filled button. `"outline"` is an outlined button. `"ghost"` is a transparent button. `"light"` is a light color button. Possible sub-variant values: `"simple"` is a simple button without default padding at end. `"block"` is a full-width button that spans the full width of its container. Mix and match the `variant` and `sub-variant` to create a variety of buttons. `"default.simple"`, `"outline.block"` etc. | `"default" \| "default.simple" \| "ghost" \| "ghost.simple" \| "light" \| "light.simple" \| "link" \| "link.simple" \| "neo" \| "neo.simple" \| "outline" \| "outline.simple"` | `'default'` |

### Events

| Event | Description | Type |
| --- | --- | --- |
| `zane-button--click` | Triggered when the button is clicked. | `CustomEvent<{ appendData: any; }>` |

### Methods

#### `setBlur() => Promise<void>`

Sets blur on the native `button` in `zane-button`. Use this method instead of the global `button.blur()`.

##### Returns

Type: `Promise<void>`

#### `setFocus() => Promise<void>`

Sets focus on the native `button` in `zane-button`. Use this method instead of the global `button.focus()`.

##### Returns

Type: `Promise<void>`

#### `triggerClick() => Promise<void>`

Triggers a click event on the native `button` in `zane-button`. Use this method instead of the global `button.click()`.

##### Returns

Type: `Promise<void>`

### CSS Custom Properties

| Name | Description |
| --- | --- |
| `--zane-button-border-radius` | Button border radius. |
| `--zane-button-border-style` | Button border style. |
| `--zane-button-color` | Button filling color. |
| `--zane-button-color-active` | Button filling color on active. |
| `--zane-button-color-hover` | Button filling color on hover. |
| `--zane-button-color-light` | Button filling color for light variant. |
| `--zane-button-padding` | Button padding. |
| `--zane-button-support-contrast-color` | Button support color (text or border). Should be white or black based on weight of button filling color. |
| `--zane-theme-button-border-radius` | Theme level button border radius. (applies to all buttons) |
| `--zane-theme-button-border-style` | Theme level button border style. (applies to all buttons) |

### Dependencies

#### Used by

- [code-highlighter](./code-highlighter)
- [date-picker](./date-picker)
- [empty-state](./empty-state)
- [header-action](./header-action)
- [header-brand](./header-brand)
- [html-editor](./html-editor)
- [input](./input)
- [input-url](./input-url)
- [modal](./modal)
- [notification](./notification)
- [number](./input-number)
- [select](./select)
- [table](./table)
- [textarea](./textarea)
- [time-picker](./time-picker)

#### Depends on

- [spinner](./spinner)
- [icon](./icon)
