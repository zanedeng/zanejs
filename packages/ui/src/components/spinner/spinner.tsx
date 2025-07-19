import { Component, Element, h, Host, Prop, State } from '@stencil/core';

import { getComponentIndex, remToPx } from '../../utils';

/**
 * 定义加载指示器尺寸枚举
 *
 * 该枚举将语义化尺寸名称映射为具体的 rem 单位值，
 * 用于统一控制加载动画的视觉大小。
 */
enum SpinnerSize {
  /** 大尺寸：5.5rem (约 88px) */
  LG = 5.5,
  /** 中等尺寸：1rem (约 16px) */
  MD = 1,
  /** 小尺寸：0.75rem (约 12px) */
  SM = 0.75,
}

/**
 * 加载指示器组件 (zane-spinner)
 *
 * @component
 * @shadow true
 * @description 用于表示加载状态的动画指示器，支持自定义尺寸和样式。
 *
 * @example
 * <!-- 基本用法 -->
 * <zane-spinner></zane-spinner>
 *
 * <!-- 自定义描述文本 -->
 * <zane-spinner description="数据加载中"></zane-spinner>
 *
 * <!-- 隐藏背景圆环 -->
 * <zane-spinner hide-background></zane-spinner>
 */
@Component({
  shadow: true,
  styleUrl: 'spinner.scss',
  tag: 'zane-spinner',
})
export class Spinner {
  /**
   * 辅助文本描述
   *
   * @prop
   * @attribute description
   * @default 'Loading...'
   * @description 为屏幕阅读器提供加载状态描述，同时作为 SVG 的 title 属性提升可访问性。
   */
  @Prop() description: string = 'Loading...';

  /** 组件宿主元素引用  */
  @Element() elm!: HTMLElement;

  /**
   * 生成唯一组件标识符
   */
  gid: string = getComponentIndex();

  /**
   * 是否隐藏背景圆环
   *
   * @prop
   * @attribute hide-background
   * @default false
   * @description 当设置为 true 时，隐藏加载动画后的半透明背景圆环。
   */
  @Prop() hideBackground: boolean = false;

  /**
   * 加载指示器尺寸
   *
   * @prop
   * @attribute size
   * @reflect true
   * @default 'md'
   * @description 控制加载指示器尺寸，支持预设枚举或自定义 CSS 单位：
   * - `'lg'`: 大尺寸 (5.5rem)
   * - `'md'`: 中等尺寸 (1rem)
   * - `'sm'`: 小尺寸 (0.75rem)
   * - `string`: 自定义尺寸（支持 '2rem'/'32px' 格式）
   */
  @Prop({ reflect: true }) size: 'lg' | 'md' | 'sm' | string = 'md';

  /**
   * 插槽内容存在状态
   *
   * @state
   * @description 检测默认插槽是否包含内容，用于调整布局样式
   */
  @State() slotHasContent = false;

  componentWillLoad() {
    this.slotHasContent = this.elm.hasChildNodes();
  }

  render() {
    const radius: number = 57.3 * this.getSize();
    let strokeWidth = 5;
    if (this.getSize() >= 5.5) strokeWidth = 10;
    strokeWidth = strokeWidth / ((this.getSize() * remToPx(1)) / 100);

    let strokeDashoffset = 50 * this.getSize();
    if (this.getSize() <= 1) {
      strokeDashoffset = 180 * this.getSize();
    }

    return (
      <Host>
        <div
          class={{ 'has-content': this.slotHasContent, spinner: true }}
          title={this.description}
        >
          <div
            class="spinner__container"
            style={{
              height: `${this.getSize()}rem`,
              width: `${this.getSize()}rem`,
            }}
          >
            <svg
              class="spinner__svg"
              viewBox={`0 0 ${
                2 * (radius + strokeWidth + 5 * this.getSize())
              } ${2 * (radius + strokeWidth + 5 * this.getSize())}`}
            >
              <title>{this.description}</title>
              {!this.hideBackground && (
                <circle
                  class="spinner__background"
                  cx="50%"
                  cy="50%"
                  r={radius}
                  style={{
                    strokeWidth: `${strokeWidth * this.getSize()}`,
                  }}
                ></circle>
              )}

              <circle
                class="spinner__stroke"
                cx="50%"
                cy="50%"
                r={radius}
                style={{
                  strokeDasharray: `${360 * this.getSize()}`,
                  strokeDashoffset: `${strokeDashoffset}`,
                  strokeWidth: `${strokeWidth * this.getSize()}`,
                }}
              ></circle>
            </svg>
          </div>

          <div class="slot-container">
            <slot />
          </div>
        </div>
      </Host>
    );
  }

  /**
   * 解析尺寸配置
   *
   * @private
   * @returns 转换为 rem 单位的尺寸数值
   *
   * @description 将输入的尺寸配置转换为可用于计算的数值：
   * - 预设尺寸：'lg'|'md'|'sm' 转换为 SpinnerSize 枚举值
   * - 带单位字符串：'2rem' 直接提取数值，'32px' 转换为 rem(32/16)
   * - 其他字符串：尝试直接转换为数值
   */
  private getSize() {
    let size;
    if (!this.size || this.size === 'md') size = SpinnerSize.MD;
    else if (this.size === 'sm') size = SpinnerSize.SM;
    else if (this.size === 'lg') size = SpinnerSize.LG;
    else if (this.size.endsWith('px'))
      size = Number.parseInt(this.size.replace('px', '')) / 16;
    else if (this.size.endsWith('rem'))
      size = Number.parseInt(this.size.replace('rem', ''));
    else size = this.size;
    return size;
  }
}
