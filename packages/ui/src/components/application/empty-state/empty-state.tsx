import {
  Component,
  ComponentInterface,
  Element,
  getAssetPath,
  h,
  Host,
  Listen,
  Prop,
  State,
} from '@stencil/core';
import DOMPurify from 'dompurify';

/**
 * 空状态(Empty State)组件
 *
 * 用于展示无数据时的占位内容，包含插图、标题、描述和操作按钮
 *
 * @component
 * @shadowDom 使用Shadow DOM封装组件样式
 * @implements ComponentInterface 实现Stencil组件生命周期接口
 */
@Component({
  shadow: true,
  styleUrl: 'empty-state.scss',
  tag: 'zane-empty-state',
})
export class EmptyState implements ComponentInterface {
  /**
   * 操作按钮文本
   *
   * 当设置此属性时会显示操作按钮
   *
   * @type {string}
   * @reflectToAttr 同步到DOM属性
   */
  @Prop({ reflect: true }) action: string;

  /**
   * 禁用操作按钮
   *
   * - true: 禁用操作按钮
   * - false: 启用操作按钮(默认)
   *
   * @type {boolean}
   * @default false
   */
  @Prop() actionDisabled: boolean = false;

  /**
   * 操作按钮跳转链接
   *
   * 设置后会渲染为<a>标签而非<button>
   *
   * @type {string}
   */
  @Prop() actionUrl: string;

  /**
   * 操作按钮样式变体
   *
   * - 'default': 默认填充样式
   * - 'ghost': 幽灵按钮样式
   * - 'outline': 描边按钮样式(默认)
   *
   * @type {'default' | 'ghost' | 'outline'}
   * @default 'default'
   */
  @Prop() actionVariant: 'default' | 'ghost' | 'outline' = 'default';

  /**
   * 描述文本
   *
   * 支持HTML内容，会自动进行XSS过滤
   *
   * @type {string}
   * @reflectToAttr 同步到DOM属性
   */
  @Prop({ reflect: true }) description: string;

  /**
   * 组件宿主元素引用
   *
   * 用于直接访问组件DOM元素
   *
   * @type {HTMLElement}
   */
  @Element() elm!: HTMLElement;

  /**
   * 标题文本
   *
   * @type {string}
   * @reflectToAttr 同步到DOM属性
   */
  @Prop({ reflect: true }) headline: string;

  /**
   * 插图名称
   *
   * 对应assets/images/empty-state目录下的SVG文件名
   *
   * @type {string}
   * @default 'no-document'
   * @reflectToAttr 同步到DOM属性
   */
  @Prop({ reflect: true }) illustration: string = 'no-document';

  /**
   * 垂直布局状态
   *
   * - true: 垂直排列插图和内容
   * - false: 水平排列(默认)
   *
   * @type {boolean}
   * @default false
   */
  @State() vertical: boolean = false;

  /**
   * 组件加载完成生命周期
   *
   * 初始化时执行布局检测
   */
  componentDidLoad() {
    this.resizeHandler();
  }

  /**
   * 渲染组件
   *
   * 包含插图区域、标题、描述和操作按钮
   *
   * @returns {JSX.Element} 组件JSX结构
   */
  render() {
    return (
      <Host>
        <div class={{ 'empty-state': true, vertical: this.vertical }}>
          <div class="empty-state-container">
            <div class="illustration">
              <zane-svg
                src={getAssetPath(
                  `./assets/images/empty-state/${this.illustration}.svg`,
                )}
              />
            </div>

            <div class="content">
              {this.headline && <div class="title">{this.headline}</div>}
              {this.description && (
                <div
                  class="description"
                  innerHTML={DOMPurify.sanitize(this.description)}
                />
              )}
              <div class="actions">
                {this.action && (
                  <zane-button
                    disabled={this.actionDisabled}
                    href={this.actionUrl}
                    icon={'arrow--right'}
                    variant={this.actionVariant}
                  >
                    {this.action}
                  </zane-button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Host>
    );
  }

  /**
   * 窗口大小变化事件监听
   *
   * 根据宽度阈值切换垂直/水平布局
   *
   * @listens resize
   */
  @Listen('resize', { target: 'window' })
  resizeHandler() {
    // this.vertical = this.elm.clientWidth < 768;
  }
}
