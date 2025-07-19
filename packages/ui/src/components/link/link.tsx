import {
  Component,
  ComponentInterface,
  Element,
  h,
  Host,
  Listen,
  Method,
  Prop,
  State,
} from '@stencil/core';

import { getComponentIndex } from '../../utils';

/**
 * 智能链接组件
 * @component zane-link
 * @tags navigation, link, interactive
 * @shadow true
 *
 * @description
 * 增强型可交互链接组件，支持动态状态反馈和键盘导航优化。
 * 特性包括：
 * - 视觉状态反馈（聚焦/激活）
 * - 空格键触发点击
 * - 跨浏览器兼容的焦点管理
 * - 无障碍属性支持
 *
 * @example
 * <!-- 基础链接 -->
 * <zane-link href="/about">关于我们</zane-link>
 *
 * <!-- 新窗口打开 -->
 * <zane-link href="https://external.com"  target="_blank">
 *   外部链接
 * </zane-link>
 */
@Component({
  shadow: true,
  styleUrl: 'link.scss',
  tag: 'zane-link',
})
export class Link implements ComponentInterface {
  /**
   * 宿主元素引用
   * @type {HTMLElement}
   *
   * @description
   * 自动注入的宿主 DOM 元素，用于：
   * - 属性继承处理
   * - 无障碍属性检测
   * - 原生事件监听
   */
  @Element() elm!: HTMLElement;

  /**
   * 组件全局唯一标识符
   * @type {string}
   *
   * @description
   * 自动生成的递增数字 ID，用于：
   * - 组件实例追踪
   * - 动态样式关联
   */
  gid: string = getComponentIndex();

  /**
   * 焦点状态标识
   * @type {boolean}
   * @state
   *
   * @description
   * 反映链接元素是否获得焦点：
   * - `true`: 元素处于聚焦状态
   * - `false`: 元素未聚焦
   * 此状态会触发聚焦视觉样式
   */
  @State() hasFocus = false;

  /**
   * 链接目标地址
   * @type {string}
   * @reflect
   *
   * @description
   * 对应 HTML anchor 元素的 href 属性：
   * - 支持绝对路径和相对路径
   * - 支持哈希锚点定位
   * - 空值时渲染为无跳转功能的伪链接
   */
  @Prop({ reflect: true }) href: string;

  /**
   * 激活状态标识
   * @type {boolean}
   * @state
   *
   * @description
   * 反映用户交互激活状态：
   * - `true`: 通过键盘空格/回车键或鼠标点击激活
   * - `false`: 未激活状态
   * 此状态用于实现 Material Design 风格的涟漪效果
   */
  @State() isActive = false;

  /**
   * 链接打开方式
   * @type {string}
   *
   * @description
   * 对应 HTML anchor 元素的 target 属性：
   * - `_blank`: 新窗口/标签页打开
   * - `_self`: 当前窗口打开（默认）
   * - `_parent` / `_top`: 框架控制
   */
  @Prop() target: string;

  /** @private 微数据属性继承 */
  private itemprop?: string;

  /** @private 原生锚元素引用 */
  private nativeElement?: HTMLAnchorElement;

  /** @private 动态 Tab 键序控制 */
  private tabindex?: number | string;

  /**
   * 组件预加载生命周期
   * @lifecycle
   *
   * @description
   * 执行关键属性迁移：
   * 1. 转移宿主元素的 tabindex 到原生元素
   * 2. 迁移 itemprop 微数据属性
   * 3. 清理宿主元素冗余属性
   */
  componentWillLoad() {
    // Tabindex 迁移逻辑
    if (this.elm.hasAttribute('tabindex')) {
      const tabindex = this.elm.getAttribute('tabindex');
      this.tabindex = tabindex === null ? undefined : tabindex;
      this.elm.removeAttribute('tabindex');
    }

    // 微数据属性迁移
    if (this.elm.hasAttribute('itemprop')) {
      const tabindex = this.elm.getAttribute('itemprop');
      this.itemprop = tabindex === null ? undefined : tabindex;
      this.elm.removeAttribute('itemprop');
    }
  }

  /**
   * 主渲染方法
   * @returns {JSX.Element} 组件虚拟 DOM 结构
   */
  render() {
    return (
      <Host active={this.isActive} has-focus={this.hasFocus}>
        <a
          class={{
            active: this.isActive,
            'has-focus': this.hasFocus,
            link: true,
          }}
          href={this.href}
          itemprop={this.itemprop}
          onBlur={this.blurHandler}
          onFocus={this.focusHandler}
          onKeyDown={this.keyDownHandler}
          onMouseDown={this.mouseDownHandler}
          ref={(input) => (this.nativeElement = input)}
          tabindex={this.tabindex}
          target={this.target}
        >
          <slot />
        </a>
      </Host>
    );
  }

  /**
   * 触发链接点击
   * @method
   * @async
   *
   * @description
   * 通过编程方式触发链接的点击行为：
   * - 模拟用户点击效果
   * - 保持与原生事件的一致性
   * - 适用于自动化测试场景
   */
  @Method()
  async triggerClick() {
    if (this.nativeElement) {
      this.nativeElement.click();
    }
  }

  /**
   * 全局键盘释放监听
   * @listens window:keyup
   *
   * @description
   * 处理键盘交互后的状态重置：
   * - 当激活状态为 true 时
   * - 且按键为 Enter 或 Space
   * - 重置 isActive 状态
   */
  @Listen('keyup', { target: 'window' })
  windowKeyUp(evt) {
    if (this.isActive && (evt.key === 'Enter' || evt.key === ' '))
      this.isActive = false;
  }

  /**
   * 全局鼠标释放监听
   * @listens window:mouseup
   *
   * @description
   * 处理鼠标点击后的状态重置：
   * - 无论何处释放鼠标
   * - 强制重置 isActive 状态
   * - 防止状态残留
   */
  @Listen('mouseup', { target: 'window' })
  windowMouseUp() {
    if (this.isActive) this.isActive = false;
  }

  /** @private 失焦事件处理 */
  private blurHandler = () => {
    this.hasFocus = false;
  };

  /** @private 聚焦事件处理 */
  private focusHandler = () => {
    this.hasFocus = true;
  };

  /** @private 键盘按下事件处理 */
  private keyDownHandler = (evt) => {
    if (evt.key === 'Enter' || evt.key === ' ') {
      this.isActive = true;
    }
  };

  /** @private 鼠标按下事件处理 */
  private mouseDownHandler = () => {
    this.isActive = true;
  };
}
