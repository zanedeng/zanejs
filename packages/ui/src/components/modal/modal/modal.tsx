import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Prop,
  Watch,
} from '@stencil/core';

/**
 * 模态框组件 (zane-modal)
 *
 * @component zane-modal
 * @shadow true
 *
 * @description
 * 提供企业级应用的模态对话框解决方案，支持：
 * - 多种预设尺寸响应式布局
 * - 灵活的内容插槽（头部/主体/底部）
 * - 加载状态可视化
 * - 可控关闭行为（自动关闭/受控关闭）
 * - 无障碍访问支持
 * - 滚动条自动管理
 *
 * @example
 * <!-- 基础用法 -->
 * <zane-modal
 *   heading="确认操作"
 *   open={true}>
 *   <p>确定要删除此项吗？</p>
 *   <div slot="footer">
 *     <zane-button>取消</zane-button>
 *     <zane-button variant="primary">确定</zane-button>
 *   </div>
 * </zane-modal>
 *
 * <!-- 带加载状态的模态框 -->
 * <zane-modal
 *   heading="数据处理中"
 *   open={true}
 *   showLoader={true}>
 *   <p>请稍候，正在保存您的数据...</p>
 * </zane-modal>
 */
@Component({
  shadow: true,
  styleUrl: 'modal.scss',
  tag: 'zane-modal',
})
export class Modal {
  @Element() elm!: HTMLElement;

  /**
   * 模态框主标题
   * @prop {string} heading - 显示在顶部的标题文本
   * @visualEffect 使用 heading 样式（字号1.25rem/粗体）
   */
  @Prop({ reflect: true }) heading: string;

  /**
   * 隐藏关闭按钮
   * @prop {boolean} hideClose - 是否隐藏右上角关闭按钮（默认false）
   * @default false
   */
  @Prop({ reflect: true }) hideClose: boolean = false;

  /**
   * 受控模式开关
   * @prop {boolean} managed - 是否由外部状态控制关闭行为（默认false）
   * @behavior
   * - false（默认）：组件内部管理 open 状态（点击关闭按钮自动关闭）
   * - true：需外部监听 zane-modal--close 事件并手动更新 open 状态
   * @usageNote 在复杂状态管理场景中使用（如React/Vue集成）
   */
  @Prop() managed: boolean = false;

  /**
   * 模态框开启状态
   * @prop {boolean} open - 控制模态框显示/隐藏（默认false）
   * @important 核心显示控制属性
   * @effect 开启时自动禁用页面滚动（关闭时恢复）
   */
  @Prop({ reflect: true }) open: boolean = false;

  /**
   * 加载状态显示
   * @prop {boolean} showLoader - 是否显示加载指示器（默认false）
   * @visualEffect
   * - 半透明遮罩层覆盖内容区
   * - 居中显示旋转加载图标
   * @usageNote 适合异步操作期间禁用交互
   */
  @Prop({ reflect: true }) showLoader: boolean = false;

  /**
   * 模态框尺寸方案
   * @prop {'lg' | 'md' | 'sm'} size - 预设响应式尺寸（默认'md'）
   * @options
   * - 'sm'：小尺寸
   * - 'md'：中尺寸- 默认值
   * - 'lg'：大尺寸
   * @responsive 自动适配移动端（小屏下占满宽度）
   */
  @Prop({ reflect: true }) size: 'lg' | 'md' | 'sm' = 'md';

  /**
   * 副标题文本
   * @prop {string} subheading - 显示在主标题下方的辅助文本
   * @visualEffect 次级文本样式（字号0.875rem/灰色）
   */
  @Prop({ reflect: true }) subheading: string;

  /**
   * 模态框关闭事件
   * @event zane-modal--close
   * @description 当以下情况触发：
   * - 点击关闭按钮
   * - 点击模态框外部遮罩层
   * @important 受控模式下必须监听此事件来更新 open 状态
   */
  @Event({ eventName: 'zane-modal--close' }) zaneModalClose: EventEmitter;

  /**
   * 关闭模态框方法
   * @method closeModal
   * @description
   * 1. 非受控模式下自动更新 open 状态
   * 2. 触发 zane-modal--close 事件
   * 3. 恢复页面滚动能力
   */
  closeModal() {
    if (!this.managed) {
      this.open = false;
    }
    this.zaneModalClose.emit();
  }

  /**
   * 核心渲染方法
   * @returns {JSX.Element} 模态框虚拟DOM结构
   * @renderStructure
   * 1. 遮罩层（modal-overlay）
   * 2. 模态框容器（modal--wrapper）
   * 3. 内容区域（含尺寸控制类）
   *   - 头部（header）: 标题+关闭按钮
   *   - 主体（content）: 默认插槽
   *   - 底部（footer）: footer插槽
   *   - 加载状态（loading）: 条件渲染
   */
  render() {
    if (this.open)
      return (
        <Host>
          <div
            aria-labelledby="modal-heading"
            aria-modal="true"
            class="modal-container"
            role="dialog"
          >
            <div class="modal-overlay" />
            <div
              class="modal--wrapper"
              onClick={(event) => {
                if (
                  (event.target as HTMLElement).classList.contains(
                    'modal--wrapper',
                  )
                )
                  this.closeModal();
              }}
            >
              <div
                class={{
                  [`size-${this.size}`]: true,
                  modal: true,
                  'show-loader': this.showLoader,
                }}
              >
                <div class="modal-body">
                  <div class="modal-header">
                    <div class="modal-heading-section">
                      {this.subheading && (
                        <zane-text
                          class="modal-subheading"
                          color="secondary"
                          type="label"
                        >
                          {this.subheading}
                        </zane-text>
                      )}

                      {this.heading && (
                        <zane-text
                          class="modal-heading"
                          heading-size="3"
                          type="heading"
                        >
                          {this.heading}
                        </zane-text>
                      )}
                    </div>
                    <div class="action-container">
                      {!this.hideClose && (
                        <zane-button
                          class="close-icon cancel-button"
                          color="black"
                          darkModeColor="white"
                          icon="close--large"
                          onZane-button--click={() => {
                            this.closeModal();
                          }}
                          title="Close"
                          variant="ghost"
                        ></zane-button>
                      )}
                    </div>
                  </div>

                  <div class="modal__content">
                    <slot />
                  </div>

                  {this.showLoader && (
                    <div class="modal__loading">
                      <div class="modal__loading-background"></div>
                      <zane-spinner size="2rem"></zane-spinner>
                    </div>
                  )}
                </div>

                <div class="modal__footer">
                  <slot name="footer"></slot>
                </div>
              </div>
            </div>
          </div>
        </Host>
      );
  }

  /**
   * open 属性监听器
   * @listens open
   * @description 控制页面滚动条行为
   * @effect
   * - open=true: 禁用页面滚动（body.overflow=hidden ）
   * - open=false: 恢复页面滚动（body.overflow=visible ）
   * @param {boolean} newValue - open 属性的新值
   */
  @Watch('open')
  watchHandler(newValue: boolean) {
    document.body.style.overflow = newValue ? 'hidden' : 'visible';
  }
}
