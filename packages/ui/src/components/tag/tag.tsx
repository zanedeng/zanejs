import {
  Component,
  ComponentInterface,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Prop,
} from '@stencil/core';

import { ElementSize } from '../../enums';

/**
 * 多功能标签/徽章组件
 *
 * 提供灵活的内容展示能力，支持多种颜色主题、尺寸规格、可关闭操作和选中状态。
 * 适用于分类标记、状态指示、可选项选择等场景，可与表单组件或列表组件配合使用。
 *
 * @example
 * <!-- 基础用法 -->
 * <zane-tag>默认标签</zane-tag>
 *
 * <!-- 带关闭按钮 -->
 * <zane-tag dismissible>可关闭标签</zane-tag>
 *
 * <!-- 带图片 -->
 * <zane-tag image-src="/path/to/avatar.jpg"> 用户标签</zane-tag>
 */
@Component({
  shadow: true,
  styleUrl: 'tag.scss',
  tag: 'zane-tag',
})
export class Tag implements ComponentInterface {

  /**
   * 标签颜色主题
   *
   * 提供10种预设颜色方案，满足不同场景的视觉需求：
   * - `blue`: 蓝色主题（中性信息）
   * - `error`: 错误红色（操作失败/危险状态）
   * - `gray`: 灰色主题（默认中性色）
   * - `green`: 绿色主题（成功/完成状态）
   * - `info`: 信息蓝（通知/提示信息）
   * - `primary`: 品牌主色（重要内容）
   * - `red`: 警示红色（紧急通知）
   * - `success`: 成功绿色（操作成功）
   * - `warning`: 警告黄色（注意/提醒）
   * - `yellow`: 强调黄色（高亮显示）
   *
   * @type {'blue' | 'error' | 'gray' | 'green' | 'info' | 'primary' | 'red' | 'success' | 'warning' | 'yellow'}
   * @prop color
   * @default 'gray'
   * @reflect
   */
  @Prop({ reflect: true }) color:
    | 'blue'
    | 'error'
    | 'gray'
    | 'green'
    | 'info'
    | 'primary'
    | 'red'
    | 'success'
    | 'warning'
    | 'yellow' = 'gray';

  /**
   * 是否显示关闭按钮
   *
   * 设置为 true 时，标签右侧显示关闭图标，点击触发 `zane-tag--dismiss` 事件
   *
   * @type {boolean}
   * @prop dismissible
   * @default false
   */
  @Prop() dismissible: boolean = false;

  /**
   * 宿主元素引用
   *
   * 用于访问组件对应的 DOM 元素
   *
   * @type {HTMLElement}
   * @prop elm
   */
  @Element() elm!: HTMLElement;

  /**
   * 标签图片地址
   *
   * 设置后，在标签左侧显示指定图片（如用户头像）
   *
   * @type {string}
   * @prop imageSrc
   */
  @Prop() imageSrc?: string;

  /**
   * 选中状态
   *
   * 表示标签是否被选中，常用于多选场景
   *
   * @type {boolean}
   * @prop selected
   * @default false
   * @reflect
   */
  @Prop({ reflect: true }) selected: boolean = false;

  /**
   * 标签尺寸
   *
   * 控制标签的整体尺寸规格：
   * - `md`: 中等尺寸（默认）
   * - `sm`: 小型尺寸（紧凑布局）
   *
   * @type {'md' | 'sm'}
   * @prop size
   * @default 'md'
   * @reflect
   */
  @Prop({ reflect: true }) size: 'md' | 'sm' = 'md';

  /**
   * 标签值
   *
   * 标签关联的业务数据值，在事件触发时作为参数传递
   *
   * @type {string}
   * @prop value
   * @default ''
   * @reflect
   */
  @Prop({ reflect: true }) value: string = '';

  /**
   * 标签点击事件
   *
   * 当标签被点击时触发（不包括关闭按钮区域）
   *
   * @event zane-tag--click
   * @type {EventEmitter}
   */
  @Event({ eventName: 'zane-tag--click' }) zaneClick: EventEmitter;

  /**
   * 标签关闭事件
   *
   * 当关闭按钮被点击时触发，传递标签的 value 或文本内容
   *
   * @event zane-tag--dismiss
   * @type {EventEmitter<{ value: string }>}
   */
  @Event({ eventName: 'zane-tag--dismiss' }) zaneTagDismissClick: EventEmitter;

  render() {
    return (
      <Host>
        <div
          class={{
            [`color-${this.color}`]: true,
            [`size-${this.size}`]: true,
            dismissible: this.dismissible,
            selected: this.selected,
            tag: true,
          }}
        >
          {this.renderImage()}
          <div class="tag-content">
            <slot />
          </div>
          {this.renderCloseButton()}
        </div>
      </Host>
    );
  }

  /**
   * 渲染关闭按钮
   *
   * 当 dismissible 为 true 时渲染关闭按钮，点击触发关闭事件
   *
   * @returns {JSX.Element | null} 关闭按钮元素或 null
   */
  renderCloseButton() {
    if (this.dismissible)
      return (
        <button class="close-btn" onClick={() => this.dismissClickHandler()}>
          <zane-icon
            class="close-btn-icon inherit"
            name="close"
            size={this.getIconSize()}
          ></zane-icon>
        </button>
      );
  }

  /**
   * 渲染标签图片
   *
   * 当 imageSrc 存在时渲染图片元素
   *
   * @returns {JSX.Element | null} 图片元素或 null
   */
  renderImage() {
    if (this.imageSrc)
      return <img alt="Tag image" class="tag-image" src={this.imageSrc} />;
  }

  /**
   * 关闭按钮点击处理器
   *
   * 触发 zane-tag--dismiss 事件，传递标签值或文本内容
   *
   * @private
   */
  private dismissClickHandler = () => {
    this.zaneTagDismissClick.emit({
      value: this.value || this.elm.textContent,
    });
  };

  /**
   * 获取关闭图标尺寸
   *
   * 根据标签尺寸返回对应的图标尺寸值
   *
   * @private
   * @returns {string} 图标尺寸值
   */
  private getIconSize() {
    switch (this.size) {
      case ElementSize.MEDIUM: {
        return '1.25rem';
      }
      case ElementSize.SMALL: {
        return '1rem';
      }
      default: {
        return '1rem';
      }
    }
  }
}
