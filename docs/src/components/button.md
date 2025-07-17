# 按钮 Button

按钮是可点击的元素，用于触发操作。它们向用户传达操作指令，并允许用户以多种方式与页面进行交互。按钮标签表明用户与之交互时会发生什么操作。

## 演示

### 基本用法

:::demo src=examples/button/button-1.vue :::

### 变体

这里有一些预定义的按钮样式，每个都有其自身的语义用途。

混合搭配 `variant` 和 `sub-variant` 来创建各种按钮。

`"simple"` 是一个没有默认尾部填充的简单按钮。

`"block"` 是一个全宽按钮，占据其容器的全部宽度。

:::demo src=examples/button/button-2.vue :::

### 颜色

按钮有多种颜色以指示操作或按钮类型。以下示例展示了按钮组件可用的不同颜色。

:::demo src=examples/button/button-3.vue :::

在暗黑主题中通过 `dark-mode-color` 属性切换按钮颜色。

:::demo src=examples/button/button-4.vue :::

自定义颜色

:::demo src=examples/button/button-5.vue :::

### 尺寸

想要更大或更小的按钮？添加 size 属性以获得更多尺寸。

:::demo src=examples/button/button-6.vue :::

### 图标

:::demo src=examples/button/button-7.vue :::

### 加载中

:::demo src=examples/button/button-8.vue :::

## API

### 属性

| 属性名 | HTML 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- |
| `appendData` | `append-data` | `appendData` 属性允许您将附加数据附加到按钮组件。这些数据可以是任意类型，使其能够灵活应用于各种用例。它尤其适用于传递可在事件处理程序或其他组件逻辑中访问的额外上下文或信息。 | `any` | `undefined` |
| `color` | `color` | 定义按钮的主颜色。可以将其设置为预定义的颜色名称，以应用特定的颜色主题。 | `"black" \| "danger" \| "primary" \| "secondary" \| "success" \| "warning" \| "white"` | `'primary'` |
| `configAria` | `config-aria` |  | `any` | `{}` |
| `darkModeColor` | `dark-mode-color` | 暗黑模式的颜色变体，当设置了 [data-theme="dark"] 时适用。 | `"black" \| "danger" \| "primary" \| "secondary" \| "success" \| "warning" \| "white"` | `undefined` |
| `disabled` | `disabled` | 如果为 `true`，则用户无法与按钮交互。默认为 `false`。 | `boolean` | `false` |
| `disabledReason` | `disabled-reason` | 如果按钮被禁用，则说明其被禁用的原因。 | `string` | `''` |
| `href` | `href` | 点击后可导航至的超链接。 | `string` | `undefined` |
| `icon` | `icon` | 按钮上显示的图标。可能的值是图标名称。 | `string` | `undefined` |
| `iconAlign` | `icon-align` | 图标对齐方式。可能值为`start`、`end`。默认为`end`。 | `"end" \| "start"` | `'end'` |
| `selected` | `selected` | 按钮选择状态。 | `boolean` | `false` |
| `showLoader` | `show-loader` | 如果为 `true`，则按钮上将显示一个加载器。 | `boolean` | `false` |
| `size` | `size` | 按钮尺寸。可能值为`sm`、`md`、`lg`、`xl`、`2xl`和`full`。默认为`md`。 | `"2xl" \| "lg" \| "md" \| "sm" \| "xl" \| "xs"` | `'md'` |
| `target` | `target` | 设置或检索目标内容的窗口或框架。 | `string` | `'_self'` |
| `throttleDelay` | `throttle-delay` | 设置节流阀的延迟时间（以毫秒为单位）。默认为 200 毫秒。 | `number` | `200` |
| `toggle` | `toggle` | 如果为 `true`，按钮将处于切换状态。 | `boolean` | `false` |
| `type` | `type` | 按钮类型取决于单击按钮时执行的操作。 | `"button" \| "reset" \| "submit"` | `'button'` |
| `variant` | `variant` | 按钮的视觉样式。可能的变体值：`default` 表示填充按钮。`outline` 表示带轮廓按钮。`ghost` 表示透明按钮。`light` 表示浅色按钮。可能的子变体值：`simple` 表示简单按钮，末端无默认填充。`block` 表示全宽按钮，其宽度与容器宽度相同。混合搭配 `variant` 和 `sub-variant` 可创建各种按钮。例如 `default.simple`、`outline.block` 等。 | `"default" \| "default.simple" \| "ghost" \| "ghost.simple" \| "light" \| "light.simple" \| "link" \| "link.simple" \| "neo" \| "neo.simple" \| "outline" \| "outline.simple"` | `'default'` |

### 事件

| 事件名 | 说明 | 类型 |
| --- | --- | --- |
| `zane-button--click` | 单击按钮时触发。 | `CustomEvent<{ appendData: any; }>` |

### 方法

#### `setBlur() => Promise<void>`

设置 `zane-button` 中原生的 `button` 元素设置失焦。请使用此方法替代全局的 `button.blur()`。

##### 返回值

类型: `Promise<void>`

#### `setFocus() => Promise<void>`

设置 `zane-button` 中原生的 `button` 元素的聚焦。请使用此方法替代全局的 `button.focus()`。

##### 返回值

类型: `Promise<void>`

#### `triggerClick() => Promise<void>`

触发 `zane-button` 中原生的 `button` 元素的点击事件。请使用此方法替代全局的 `button.click()` 调用。

##### 返回值

类型: `Promise<void>`

### CSS 自定义属性

| 属性名 | 说明 |
| --- | --- |
| `--zane-button-border-radius` | 按钮边框半径。 |
| `--zane-button-border-style` | 按钮边框样式。 |
| `--zane-button-color` | 按钮填充颜色。 |
| `--zane-button-color-active` | 按钮激活时填充颜色。 |
| `--zane-button-color-hover` | 悬停时按钮填充颜色。 |
| `--zane-button-color-light` | 浅色变体的按钮填充颜色。 |
| `--zane-button-padding` | 按钮内边距。 |
| `--zane-button-support-contrast-color` | 按钮支持颜色（文本或边框）。应根据按钮填充颜色的粗细选择白色或黑色。 |
| `--zane-theme-button-border-radius` | 主题级别按钮边框半径。（适用于所有按钮） |
| `--zane-theme-button-border-style` | 主题级别按钮边框样式。（适用于所有按钮） |

### 依赖项

#### 使用者

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

#### 依赖于

- [spinner](./spinner)
- [icon](./icon)
