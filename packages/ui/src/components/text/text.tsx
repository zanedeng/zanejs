import {
  Component,
  ComponentInterface,
  Element,
  h,
  Host,
  Prop,
} from '@stencil/core';

/**
 * 多功能文本展示组件
 *
 * 提供丰富的文本样式和语义化支持，满足不同场景的文本展示需求。支持多种文本类型、
 * 颜色主题、标题级别和响应式文本大小，集成了完善的 ARIA 可访问性支持。
 *
 * @example
 * <!-- 基础文本 -->
 * <zane-text>普通段落文本</zane-text>
 *
 * <!-- 标题文本 -->
 * <zane-text type="heading" heading-level="2">二级标题</zane-text>
 *
 * <!-- 带颜色的辅助文本 -->
 * <zane-text type="helper-text" color="helper">表单提示文本</zane-text>
 */

@Component({
  shadow: true,
  styleUrl: 'text.scss',
  tag: 'zane-text',
})
export class Text implements ComponentInterface {
  /**
   * 文本颜色主题
   *
   * 提供7种预设颜色方案，满足不同场景的视觉需求：
   * - `primary`: 主要文本颜色（默认）
   * - `secondary`: 次要文本颜色（较浅）
   * - `tertiary`: 三级文本颜色（最浅）
   * - `error`: 错误状态文本（红色系）
   * - `helper`: 辅助说明文本（灰色系）
   * - `inverse`: 反色文本（深色背景使用）
   * - `on-color`: 彩色背景上的文本
   *
   * @prop color
   * @type {'primary' | 'secondary' | 'tertiary' | 'error' | 'helper' | 'inverse' | 'on-color'}
   * @default 'primary'
   * @reflect
   */
  @Prop({ reflect: true }) color:
    | 'error'
    | 'helper'
    | 'inverse'
    | 'on-color'
    | 'primary'
    | 'secondary'
    | 'tertiary' = 'primary';

  /**
   * ARIA 属性配置
   *
   * 用于存储动态收集的 ARIA 属性，提高组件的可访问性。
   * 组件会自动收集元素上的所有 aria-* 属性并转移到内部元素。
   *
   * @prop configAria
   * @type {any}
   * @mutable
   * @reflect
   */
  @Prop({ mutable: true, reflect: true }) configAria: any = {};

  /**
   * 宿主元素引用
   *
   * 用于访问组件对应的 DOM 元素
   *
   * @prop elm
   * @type {HTMLElement}
   */
  @Element() elm!: HTMLElement;

  /**
   * 情感化文本模式
   *
   * 启用特殊的情感化排版样式，通常用于突出重要内容：
   * - 更大的字号间距
   * - 更丰富的字体变化
   * - 增强的视觉层次
   *
   * @prop expressive
   * @type {boolean}
   * @default false
   * @reflect
   */
  @Prop({ reflect: true }) expressive: boolean = false;

  /**
   * 标题语义级别
   *
   * 定义标题的 HTML 语义级别（h1-h6），影响：
   * 1. 文档大纲结构
   * 2. 屏幕阅读器识别
   * 3. SEO 权重
   *
   * 当未指定时，组件会根据标题尺寸自动推导
   *
   * @prop headingLevel
   * @type {1 | 2 | 3 | 4 | 5 | 6}
   * @reflect
   */
  @Prop({ reflect: true }) headingLevel: 1 | 2 | 3 | 4 | 5 | 6;

  /**
   * 标题视觉尺寸
   *
   * 控制标题的视觉大小（1-7级），与实际语义级别分离：
   * - 1: 最大标题尺寸
   * - 7: 最小标题尺寸
   *
   * 当未指定时，默认值为：
   * - 普通标题: 7
   * - 流式标题: 6
   *
   * @prop headingSize
   * @type {1 | 2 | 3 | 4 | 5 | 6 | 7}
   * @reflect
   */
  @Prop({ reflect: true }) headingSize: 1 | 2 | 3 | 4 | 5 | 6 | 7;

  /**
   * 行内模式
   *
   * 设置为 true 时，文本将以行内元素（span）渲染，
   * 否则以块级元素（p）渲染
   *
   * @prop inline
   * @type {boolean}
   * @default false
   * @reflect
   */
  @Prop({ reflect: true }) inline: boolean = false;

  /**
   * 文本类型
   *
   * 定义文本的语义类型和基本样式：
   * - `body`: 标准正文文本（默认）
   * - `body-compact`: 紧凑正文（较小行高）
   * - `code`: 代码样式（等宽字体）
   * - `fluid-heading`: 流式响应式标题
   * - `heading`: 标准标题
   * - `heading-compact`: 紧凑标题
   * - `helper-text`: 辅助说明文本
   * - `label`: 表单标签文本
   * - `legal`: 法律条款小字
   *
   * @prop type
   * @type {'body' | 'body-compact' | 'code' | 'fluid-heading' | 'heading' | 'heading-compact' | 'helper-text' | 'label' | 'legal'}
   * @default 'body'
   * @reflect
   */
  @Prop({ reflect: true }) type:
    | 'body'
    | 'body-compact'
    | 'code'
    | 'fluid-heading'
    | 'heading'
    | 'heading-compact'
    | 'helper-text'
    | 'label'
    | 'legal' = 'body';

  /**
   * 组件加载前生命周期
   *
   * 收集所有 ARIA 属性并转移到 configAria 对象，
   * 然后从宿主元素移除这些属性避免重复
   */
  componentWillLoad() {
    // If the zane-text has a tabindex attribute we get the value
    // and pass it down to the native input, then remove it from the
    // zane-text to avoid causing tabbing twice on the same element
    this.elm.getAttributeNames().forEach((name: string) => {
      if (name.includes('aria-')) {
        this.configAria[name] = this.elm.getAttribute(name);
        this.elm.removeAttribute(name);
      }
    });
  }

  /**
   * 渲染组件主体
   *
   * 创建文本容器，根据类型渲染不同文本元素
   */
  render() {
    return (
      <Host>
        <div
          class={{
            [`heading-size-${this.#getHeadingSize()}`]: true,
            expressive: this.expressive,
            inline: this.inline,
            text: true,
          }}
        >
          {this.renderText()}
        </div>
      </Host>
    );
  }

  /**
   * 渲染标题元素
   *
   * 根据 headingLevel 或推导出的语义级别渲染 h1-h6 元素
   *
   * @returns {JSX.Element} 标题元素
   */
  renderHeading() {
    let headingLevel = this.headingLevel;
    if (!headingLevel) {
      switch (this.#getHeadingSize()) {
        case 2: {
          headingLevel = 5;
          break;
        }
        case 3: {
          headingLevel = 4;
          break;
        }
        case 4: {
          headingLevel = 3;
          break;
        }
        case 5: {
          headingLevel = 2;
          break;
        }
        case 6:
        case 7: {
          headingLevel = 1;
          break;
        }
        default: {
          headingLevel = 6;
        }
      }
    }

    const Heading = `h${headingLevel}`;
    return (
      <Heading class="native-element" {...this.configAria}>
        <slot />
      </Heading>
    );
  }

  /**
   * 渲染简单文本元素
   *
   * 根据行内模式渲染 span 或 p 元素
   *
   * @returns {JSX.Element} 文本元素
   */
  renderSimpleText() {
    return this.inline ? (
      <span class="native-element" {...this.configAria}>
        <slot />
      </span>
    ) : (
      <p class="native-element" {...this.configAria}>
        <slot />
      </p>
    );
  }

  /**
   * 主渲染方法
   *
   * 根据文本类型选择渲染标题或普通文本
   *
   * @returns {JSX.Element} 渲染结果
   */
  renderText() {
    return this.type === 'heading'
      ? this.renderHeading()
      : this.renderSimpleText();
  }

  /**
   * 获取标题尺寸
   *
   * 私有方法，确定标题的视觉尺寸级别
   *
   * @private
   * @returns {number} 标题尺寸级别 (1-7)
   */
  #getHeadingSize() {
    let headingSize = this.headingSize;
    if (!headingSize) {
      headingSize = this.type === 'fluid-heading' ? 6 : 7;
    }
    return headingSize;
  }
}
