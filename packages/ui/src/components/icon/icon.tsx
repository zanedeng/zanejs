import { Component, h, Host, Prop, State, Watch } from '@stencil/core';

import { fetchIcon, getSVGHTMLString } from '../../utils';

/**
 * 图标组件（zane-icon）
 * 该组件基于 Stencil 构建，用于按需异步加载并渲染 SVG 图标。
 * 支持通过属性 name 指定图标名称，通过 size 控制图标尺寸。
 * 组件内部使用 Shadow DOM 实现样式隔离，并暴露 CSS 自定义属性
 * `--zane-icon-size` 供外部覆盖默认尺寸。
 *
 * @example
 * <!-- 基础用法 -->
 * <zane-icon name="home" size="md"></zane-icon>
 *
 * <!-- 自定义尺寸 -->
 * <zane-icon name="user" size="32px"></zane-icon>
 */
@Component({
  shadow: true,
  styleUrl: 'icon.scss',
  tag: 'zane-icon',
})
export class Icon {

  /**
   * 图标名称，对应图标库中的文件名。
   * 当该值发生变化时，组件会重新异步加载对应 SVG。
   *
   * @example
   * <zane-icon name="arrow-down"></zane-icon>
   */
  @Prop({ reflect: true }) name: string;

  /**
   * 图标尺寸。
   * - 可选内置枚举：'xs' | 'sm' | 'md' | 'lg' | 'xl'
   * - 也可传入任意合法的 CSS 长度值（如 "24px"、"1.5rem"）或纯数字字符串（如 "2"）。
   *
   * @example
   * <zane-icon size="lg"></zane-icon>
   * <zane-icon size="32px"></zane-icon>
   */
  @Prop() size: string;

  /**
   * SVG 字符串缓存。
   * fetchIcon() 获取到的原始 SVG XML 会经过 getSVGHTMLString()
   * 处理后存入此状态变量，用于 innerHTML 渲染。
   */
  @State() svg: string;

  /**
   * 生命周期：组件即将加载时触发。
   * 首次根据 name 属性异步拉取 SVG。
   */
  async componentWillLoad() {
    this.fetchSvg(this.name);
  }

  /**
   * 根据图标名称异步获取 SVG。
   *
   * @param name - 图标名称
   */
  async fetchSvg(name: string) {
    if (this.name) {
      const svgXml = await fetchIcon(name);
      this.svg = getSVGHTMLString(svgXml);
    } else {
      this.svg = '';
    }
  }

  /**
   * Prop name 的监听器。
   * 当外部修改 name 属性时，自动重新加载对应图标。
   *
   * @param newValue - name 的新值
   */
  @Watch('name')
  async handleNameChange(newValue: string) {
    await this.fetchSvg(newValue);
  }

  render() {
    const style = {};
    if (this.size !== undefined) {
      switch (this.size) {
        case 'lg': {
          style['--zane-icon-size'] = '1.5rem';
          break;
        }
        case 'md': {
          style['--zane-icon-size'] = '1rem';
          break;
        }
        case 'sm': {
          style['--zane-icon-size'] = '0.75rem';
          break;
        }
        case 'xl': {
          style['--zane-icon-size'] = '1.75rem';
          break;
        }
        case 'xs': {
          style['--zane-icon-size'] = '0.5rem';
          break;
        }
        default: {
          if (this.size.endsWith('px') || this.size.endsWith('rem'))
            style['--zane-icon-size'] = this.size;
          else if (!Number.isNaN(Number(this.size))) {
            style['--zane-icon-size'] = `${this.size}rem`;
          }
        }
      }
    }

    return (
      <Host>
        <div class={{ icon: true }} innerHTML={this.svg} style={style}></div>
      </Host>
    );
  }
}
