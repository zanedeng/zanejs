import { Component, h, Host, Prop, State } from '@stencil/core';

import { isDarkMode, observeThemeChange } from '../../utils';

/**
 * 自适应主题图片组件（zane-image）
 * 该组件能够根据当前系统的明暗主题自动切换显示的图片资源。
 * 当检测到处于暗色模式时，优先使用 darkSrc 指定的暗色主题图片；
 * 否则使用 src 指定的默认图片。
 * 组件内部通过监听主题变化事件实现实时切换，无需手动刷新。
 *
 * @example
 * <!-- 基础用法 -->
 * <zane-image
 *   src="assets/logo-light.svg"
 *   dark-src="assets/logo-dark.svg"
 *   image-title="公司 Logo">
 * </zane-image>
 */
@Component({
  shadow: true,
  styleUrl: 'image.scss',
  tag: 'zane-image',
})
export class Image {
  /**
   * 暗色主题下的图片地址。
   * 当系统处于暗色模式且该值存在时，将优先渲染此图片。
   *
   * @example
   * dark-src="assets/banner-dark.png"
   */
  @Prop({ reflect: true }) darkSrc: string;

  /**
   * 图片的替代文本（alt 属性）。
   * 用于无障碍访问及图片加载失败时的占位说明。
   *
   * @example
   * image-title="用户头像"
   */
  @Prop() imageTitle: string;

  /**
   * 当前系统是否处于暗色模式的状态标识。
   * 初始值由 isDarkMode() 工具函数给出，
   * 后续通过 observeThemeChange 回调实时更新。
   */
  @State() isDarkMode: boolean = isDarkMode();

  @Prop({ reflect: true }) src: string;

  /**
   * 生命周期：组件即将加载时触发。
   * 注册主题变化监听器，当系统明暗模式切换时，
   * 自动更新 isDarkMode 状态，从而触发重新渲染。
   */
  componentWillLoad() {
    observeThemeChange(() => {
      this.isDarkMode = isDarkMode();
    });
  }

  /**
   * Stencil render()。
   *
   * - 如果当前为暗色模式且 darkSrc 存在，则渲染 darkSrc；
   * - 否则渲染 src。
   *
   * Host 元素包裹 <img>，确保 Shadow DOM 样式隔离。
   */
  render() {
    return this.isDarkMode && this.darkSrc ? (
      <Host>
        <img alt={this.imageTitle} src={this.darkSrc} />
      </Host>
    ) : (
      <Host>
        <img alt={this.imageTitle} src={this.src} />
      </Host>
    );
  }
}
