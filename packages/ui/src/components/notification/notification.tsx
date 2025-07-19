import {
  Component,
  ComponentInterface,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Prop,
  State,
} from '@stencil/core';

import { isDarkMode, observeThemeChange } from '../../utils';

/**
 * 智能通知系统组件 (zane-notification)
 *
 * @component zane-notification
 * @shadow true
 *
 * @description
 * 提供多场景智能通知解决方案，支持四态反馈、操作交互和主题适配。
 * 核心功能包括：
 * - 状态图标自动匹配
 * - 暗黑模式/高对比度自适应
 * - 内联/块级布局切换
 * - 可定制的操作按钮
 * - 可控的关闭行为
 * - 无障碍访问支持
 *
 * @example
 * <!-- 基础警告通知 -->
 * <zane-notification state="warning" dismissible>
 *   <span slot="title">存储空间不足</span>
 *   <span slot="subtitle">剩余 5% 磁盘空间，建议清理缓存</span>
 * </zane-notification>
 *
 * <!-- 带操作的成功通知 -->
 * <zane-notification state="success" action="查看详情" high-contrast>
 *   <span slot="title">支付成功</span>
 *   <span slot="subtitle">订单号：20250719-2156</span>
 * </zane-notification>
 */
@Component({
  shadow: true,
  styleUrl: 'notification.scss',
  tag: 'zane-notification',
})
export class Notification implements ComponentInterface {

  /**
   * 操作按钮文本
   * @prop {string} [action] - 显示在通知右侧的操作按钮文字
   * @example
   * <zane-notification action="撤销操作">...</zane-notification>
   */
  @Prop() action: string;

  /**
   * 可关闭特性
   * @prop {boolean} [dismissible=false] - 是否显示关闭按钮
   * @example
   * <zane-notification dismissible>...</zane-notification>
   */
  @Prop() dismissible: boolean = false;

  /**
   * 组件宿主元素引用
   * @prop {HTMLElement} elm - 自动注入的组件根DOM元素
   * @private
   */
  @Element() elm!: HTMLElement;

  /**
   * 隐藏状态
   * @state {boolean} hidden - 控制通知可见性的内部状态
   * @default false
   * @private
   */
  @State() hidden: boolean = false;

  /**
   * 高对比度模式
   * @prop {boolean} [highContrast=false] - 启用高对比度视觉方案
   * - 设计规范：符合WCAG 2.1 AA标准
   * - 亮色模式：深色文字+加粗边框
   * - 暗色模式：反转配色方案
   * @example
   * <zane-notification high-contrast>...</zane-notification>
   */
  @Prop() highContrast: boolean = false;

  /**
   * 内联布局模式
   * @prop {boolean} [inline=false] - 切换为行内样式布局
   * - 特征：
   *   - 移除背景色和边框
   *   - 状态图标与文本对齐
   *   - 操作按钮变为幽灵样式
   * - 适用场景：表单内联校验提示
   * @example
   * <p>请输入验证码 <zane-notification inline state="error">验证码失效</zane-notification></p>
   */
  @Prop({ reflect: true }) inline: boolean = false;

  /**
   * 暗黑模式状态
   * @state {boolean} isDarkMode - 自动检测的系统主题状态
   * @default 当前系统主题模式
   * @private
   */
  @State() isDarkMode: boolean = isDarkMode();

  /**
   * 托管关闭模式
   * @prop {boolean} [managed=false] - 关闭行为是否由外部控制
   * - 当设为true时：
   *   - 点击关闭按钮不会隐藏组件
   *   - 必须监听 zane-notification--dismiss 事件手动处理
   * - 适用场景：通知队列管理/动画关闭
   * @example
   * <zane-notification managed dismissible>...</zane-notification>
   *
   * <script>
   *   notification.addEventListener('zane-notification--dismiss',  () => {
   *     // 执行动画后移除DOM
   *   })
   * </script>
   */
  @Prop() managed: boolean = false;

  /**
   * 通知状态类型
   * @prop {'error'|'info'|'success'|'warning'} [state='info'] - 定义通知的语义化状态
   *
   * @option error - 错误状态（红色系）
   * - 图标：❌ 错误图标
   * - 场景：系统故障/操作失败
   * - 样式特征：
   *   - 背景色：#fee2e2 (浅红)
   *   - 边框色：#dc2626 (暗红)
   *
   * @option info - 信息状态（蓝色系）
   * - 图标：ℹ️ 信息图标
   * - 场景：系统通知/进程提示
   * - 样式特征：
   *   - 背景色：#dbeafe (浅蓝)
   *   - 边框色：#2563eb (深蓝)
   *
   * @option success - 成功状态（绿色系）
   * - 图标：✅ 对勾图标
   * - 场景：操作成功/流程完成
   * - 样式特征：
   *   - 背景色：#dcfce7 (浅绿)
   *   - 边框色：#16a34a (深绿)
   *
   * @option warning - 警告状态（橙色系）
   * - 图标：⚠️ 感叹号图标
   * - 场景：风险提示/操作确认
   * - 样式特征：
   *   - 背景色：#ffedd5 (浅橙)
   *   - 边框色：#ea580c (深橙)
   */
  @Prop({ reflect: true }) state: 'error' | 'info' | 'success' | 'warning' =
    'info';

  /**
   * 操作按钮点击事件
   * @event zane-notification--action-click
   * @type {EventEmitter<void>}
   * @example
   * document.querySelector('zane-notification').addEventListener(
   *   'zane-notification--action-click',
   *   () => { console.log('Action  clicked') }
   * )
   */
  @Event({ eventName: 'zane-notification--action-click' })
  zaneActionClick: EventEmitter;

  /**
   * 通知关闭事件
   * @event zane-notification--dismiss
   * @type {EventEmitter<MouseEvent>}
   * @property {MouseEvent} detail - 原始点击事件对象
   * @example
   * notificationEl.addEventListener('zane-notification--dismiss',  (evt) => {
   *   console.log(' 关闭事件', evt.detail)
   * })
   */
  @Event({ eventName: 'zane-notification--dismiss' }) zaneDismiss: EventEmitter;

  /**
   * 组件生命周期：将要加载
   * @private
   */
  componentWillLoad() {
    observeThemeChange(() => {
      this.isDarkMode = isDarkMode();
    });
  }

  render() {
    return (
      <Host hidden={this.hidden}>
        <div
          class={{
            [`state-${this.state}`]: true,
            'high-contrast': this.highContrast,
            inline: this.inline,
            notification: true,
          }}
          role="alert"
        >
          <div class="state-icon">{this.renderStateIcon()}</div>
          <div class="content">
            <div class="content-text">
              <div class="title">
                <slot name="title" />
                <slot />
              </div>
              <div class="subtitle">
                <slot name="subtitle" />
              </div>
            </div>
            {this.#renderActions()}
          </div>

          {this.#renderCloseButtons()}
        </div>
      </Host>
    );
  }

  /**
   * 状态图标渲染器
   * @private
   * @returns {JSX.Element|null} 对应状态的图标组件
   *
   * @iconMapping
   * | 状态    | 图标名称           | 尺寸     |
   * |---------|-------------------|----------|
   * | error   | error--filled     | 1.25rem  |
   * | info    | information--filled| 1.25rem  |
   * | success | checkmark--filled | 1.25rem  |
   * | warning | warning--filled   | 1.25rem  |
   */
  renderStateIcon() {
    switch (this.state) {
      case 'error': {
        return (
          <zane-icon class="inherit" name="error--filled" size={'1.25rem'} />
        );
      }
      case 'info': {
        return (
          <zane-icon
            class="inherit"
            name="information--filled"
            size={'1.25rem'}
          />
        );
      }
      case 'success': {
        return (
          <zane-icon
            class="inherit"
            name="checkmark--filled"
            size={'1.25rem'}
          />
        );
      }
      case 'warning': {
        return (
          <zane-icon class="inherit" name="warning--filled" size={'1.25rem'} />
        );
      }
      // No default
    }
  }

  /**
   * 操作按钮渲染器
   * @private
   * @returns {JSX.Element|null} 操作按钮区域
   *
   * @buttonStyleLogic
   * 1. 高对比度模式 + 暗黑模式 → 白色按钮
   * 2. 高对比度模式 + 亮色模式 → 主色按钮
   * 3. 内联模式 → 幽灵按钮样式 (variant="ghost.simple")
   * 4. 常规模式 → 线框按钮样式 (variant="outline.simple")
   */
  #renderActions() {
    if (this.action) {
      return (
        <div class="actions">
          <zane-button
            class="action"
            color={!this.highContrast || this.isDarkMode ? 'primary' : 'white'}
            onZane-button--click={() => {
              this.zaneActionClick.emit();
            }}
            size="sm"
            variant={this.inline ? 'ghost.simple' : 'outline.simple'}
          >
            {this.action}
          </zane-button>
        </div>
      );
    }
  }

  /**
   * 关闭按钮渲染器
   * @private
   * @returns {JSX.Element|null} 关闭按钮区域
   *
   * @accessibility
   * - 按钮设置 aria-label="Close alert"
   * - 阻止事件冒泡防止误触发父元素事件
   * - 托管模式下不自动隐藏组件
   */
  #renderCloseButtons() {
    if (this.dismissible) {
      return (
        <div class="close-button-container">
          <zane-button
            aria-label="Close alert"
            class="close-button"
            color="black"
            onZane-button--click={(evt) => {
              evt.preventDefault();
              evt.stopPropagation();
              if (!this.managed) {
                this.hidden = true;
              }
              this.zaneDismiss.emit(evt);
            }}
            variant="ghost.simple"
          >
            <zane-icon class="icon" name="close" size="1.25rem" />
          </zane-button>
        </div>
      );
    }
  }
}
