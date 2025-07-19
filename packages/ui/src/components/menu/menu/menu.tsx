import {
  Component,
  ComponentInterface,
  Element,
  h,
  Listen,
  Method,
  Prop,
} from '@stencil/core';

/**
 * 多功能菜单容器组件
 * @component zane-menu
 * @tags navigation, menu, container
 * @shadow true
 *
 * @description
 * 提供标准化的菜单容器实现，支持：
 * - 多种视觉尺寸层级
 * - 键盘导航支持
 * - 空状态展示
 * - 动态焦点管理
 *
 * @example
 * <!-- 基础菜单 -->
 * <zane-menu>
 *   <zane-menu-item>选项一</zane-menu-item>
 *   <zane-menu-item>选项二</zane-menu-item>
 * </zane-menu>
 *
 * <!-- 空状态菜单 -->
 * <zane-menu empty empty-state-headline="无数据" empty-state-description="请添加菜单项">
 * </zane-menu>
 */
@Component({
  shadow: true,
  styleUrl: 'menu.scss',
  tag: 'zane-menu',
})
export class Menu implements ComponentInterface {
  /**
   * 空状态标识
   * @type {boolean}
   * @mutable
   * @default false
   *
   * @description
   * 控制是否显示空状态界面：
   * - `true`: 显示空状态组件
   * - `false`: 渲染常规菜单项
   * 当设置为true时，将忽略slot内容
   */
  @Prop({ mutable: true }) empty: boolean = false;

  /**
   * 空状态描述文本
   * @type {string}
   * @mutable
   * @default 'There are no items to display'
   *
   * @description
   * 空状态界面中的辅助说明文字
   * 支持HTML转义字符和多语言配置
   */
  @Prop({ mutable: true }) emptyStateDescription: string =
    'There are no items to display';

  /**
   * 空状态标题文本
   * @type {string}
   * @mutable
   * @default 'No items'
   *
   * @description
   * 空状态界面中的主标题文字
   * 通常使用简短有力的提示语
   */
  @Prop({ mutable: true }) emptyStateHeadline: string = 'No items';

  /**
   * 宿主元素引用
   * @type {HTMLElement}
   *
   * @description
   * 自动注入的宿主DOM元素引用
   * 用于：
   * - 查询子菜单项
   * - 事件监听
   * - 无障碍属性继承
   */
  @Element() host!: HTMLElement;

  /**
   * UI层级样式
   * @type {'01' | '02' | 'background'}
   * @reflect
   *
   * @description
   * 控制菜单的视觉层级深度：
   * - `01`: 表层菜单 (默认层级，高度为1dp)
   * - `02`: 中层菜单 (高度为2dp，更明显的阴影)
   * - `background`: 背景层菜单 (无阴影，用于嵌套场景)
   * 对应不同的box-shadow和z-index值
   */
  @Prop({ reflect: true }) layer?: '01' | '02' | 'background';

  /**
   * 加载状态标识
   * @type {boolean}
   * @default false
   *
   * @description
   * 控制是否显示加载指示器：
   * - `true`: 显示加载动画
   * - `false`: 正常显示内容
   * 实际实现需在模板中添加加载器组件
   */
  @Prop() showLoader: boolean = false;

  /**
   * 菜单尺寸
   * @type {'lg' | 'md' | 'sm'}
   * @reflect
   * @default 'md'
   *
   * @description
   * 控制菜单项尺寸和间距：
   * - `sm`: 紧凑模式 (高度32px，字号12px)
   * - `md`: 标准模式 (高度40px，字号14px)
   * - `lg`: 大尺寸模式 (高度48px，字号16px)
   * 影响内边距和行高
   */
  @Prop({ reflect: true }) size: 'lg' | 'md' | 'sm' = 'md';

  /**
   * 当前选中值
   * @type {number | string}
   *
   * @description
   * 记录当前选中的菜单项值
   * 应与子组件 zane-menu-item 的 value 属性联动
   * 用于实现受控菜单组件
   */
  @Prop({ mutable: true }) value?: number | string;

  /**
   * 聚焦下一个菜单项
   * @param {HTMLElement} currentItem - 当前聚焦的菜单项元素
   *
   * @description
   * 焦点管理核心逻辑：
   * 1. 从当前项开始向后查找
   * 2. 跳过禁用项和非菜单项
   * 3. 到达末尾时循环到第一项
   * 4. 调用目标项的 setFocus() 方法
   */
  focusNextItem(currentItem: HTMLElement) {
    let nextItem: any = currentItem.nextElementSibling;
    do {
      if (
        nextItem &&
        nextItem.tagName === 'ZANE-MENU-ITEM' &&
        !nextItem.disabled
      ) {
        nextItem.setFocus();
        return;
      }
      nextItem = nextItem ? nextItem.nextElementSibling : this.getFirstItem();
    } while (nextItem !== currentItem);
  }

  /**
   * 获取首个菜单项
   * @returns {HTMLElement} 第一个有效的菜单项
   * @throws 当不存在有效菜单项时抛出错误
   *
   * @description
   * 多层查询逻辑：
   * 1. 直接查询 zane-menu-item 元素
   * 2. 检测slot内容分配
   * 3. 遍历分配元素查找有效项
   */
  getFirstItem() {
    let firstItem: any = this.host.querySelector('zane-menu-item');
    if (
      !firstItem &&
      this.host.childNodes.length > 0 &&
      this.host.childNodes[0].nodeName === 'SLOT'
    ) {
      const assignedElements = (
        this.host.childNodes[0] as HTMLSlotElement
      ).assignedElements();
      for (const assignedElement of assignedElements) {
        const item = assignedElement as HTMLElement;
        if (item.tagName === 'ZANE-MENU-ITEM') {
          firstItem = item;
          break;
        }
      }

      if (!firstItem) {
        throw new Error('zane-menu: No menu items found');
      }
    }
    return firstItem;
  }

  /**
   * 获取末个菜单项
   * @returns {HTMLElement} 最后一个有效的菜单项
   * @throws 当不存在有效菜单项时抛出错误
   *
   * @description
   * 优化查询逻辑：
   * 1. 反向遍历提高查找效率
   * 2. 优先检测slot分配元素
   */
  getLastItem() {
    let lastItem: any = this.host.querySelector('zane-menu-item:last-child');
    if (
      !lastItem &&
      this.host.childNodes.length > 0 &&
      this.host.childNodes[0].nodeName === 'SLOT'
    ) {
      const assignedElements = (
        this.host.childNodes[0] as HTMLSlotElement
      ).assignedElements();
      for (let i = assignedElements.length - 1; i >= 0; i--) {
        const item = assignedElements[i] as HTMLElement;
        if (item.tagName === 'ZANE-MENU-ITEM') {
          lastItem = item;
          break;
        }
      }

      if (!lastItem) {
        throw new Error('zane-menu: No menu items found');
      }
    }
    return lastItem;
  }

  /**
   * 全局键盘事件监听
   * @listens window:keydown
   * @param {KeyboardEvent} evt - 键盘事件对象
   *
   * @description
   * 实现键盘导航：
   * - ↓ 键: 聚焦下一项（触发 focusNextItem）
   * - ↑ 键: 聚焦上一项（触发 focusPreviousItem）
   * 事件限制在菜单容器内触发
   */
  @Listen('keydown', { target: 'window' })
  handleKeyDown(evt: KeyboardEvent) {
    const path = evt.composedPath();
    let menuItem = null;
    for (const elm of path) {
      if ((elm as any).tagName === 'ZANE-MENU-ITEM') {
        menuItem = elm;
      }
      if (elm !== this.host) continue;
      if (evt.key === 'ArrowDown') {
        evt.preventDefault();
        this.focusNextItem(menuItem);
      } else if (evt.key === 'ArrowUp') {
        evt.preventDefault();
        this.focusPreviousItem(menuItem);
      }
    }
  }

  /**
   * 主渲染方法
   * @returns {JSX.Element} 组件虚拟DOM结构
   *
   * @description
   * 动态渲染逻辑：
   * 1. 常规状态：渲染slot容器
   * 2. 空状态：显示空状态组件
   */
  render() {
    return (
      <div class="menu">
        <div class="slot-container">
          <slot />
        </div>

        {this.renderEmptyState()}
      </div>
    );
  }

  /**
   * 设置初始焦点
   * @method
   * @async
   *
   * @description
   * 公共API方法：
   * - 自动聚焦首个菜单项
   * - 用于页面加载后的自动聚焦
   * - 配合屏幕阅读器实现无障碍访问
   */
  @Method()
  async setFocus() {
    const firstMenuItem = this.getFirstItem();
    firstMenuItem?.setFocus();
  }

  /**
   * 聚焦上一个菜单项
   * @private
   * @param {HTMLElement} currentItem - 当前聚焦的菜单项元素
   *
   * @description
   * 逆向焦点管理：
   * 1. 从当前项开始向前查找
   * 2. 到达开头时循环到最后项
   * 3. 循环安全机制（while条件）
   */
  private focusPreviousItem(currentItem: HTMLElement) {
    let previousItem: any = currentItem.previousElementSibling;
    do {
      if (
        previousItem &&
        previousItem.tagName === 'ZANE-MENU-ITEM' &&
        !previousItem.disabled
      ) {
        previousItem.setFocus();
        return;
      }
      previousItem = previousItem
        ? previousItem.previousElementSibling
        : this.getLastItem();
    } while (previousItem !== currentItem);
  }

  /**
   * 渲染空状态组件
   * @private
   * @returns {JSX.Element|null} 空状态组件或null
   *
   * @description
   * 条件渲染逻辑：
   * 当empty=true时渲染zane-empty-state组件
   * 传递headline和description属性
   */
  private renderEmptyState() {
    if (this.empty)
      return (
        <zane-empty-state
          class="empty-menu"
          description={this.emptyStateDescription}
          headline={this.emptyStateHeadline}
        />
      );
  }
}
