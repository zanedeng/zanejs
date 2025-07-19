import {
  Component,
  ComponentInterface,
  Element,
  h,
  Listen,
  Method,
  Prop,
  State,
  Watch,
} from '@stencil/core';

/**
 * 侧边导航菜单组件
 *
 * @Component 装饰器定义组件元数据
 * @shadow 启用Shadow DOM封装
 * @styleUrl 指定组件样式文件
 * @tag 定义组件在HTML中的标签名
 */
@Component({
  shadow: true,
  styleUrl: 'sidenav-menu.scss',
  tag: 'zane-sidenav-menu',
})
export class SidenavMenu implements ComponentInterface {
  /**
   * 获取组件宿主元素引用
   * @type {HTMLElement}
   */
  @Element() elm!: HTMLElement;

  /**
   * 是否显示空状态
   * @type {boolean}
   * @default false
   * @mutable 可变的
   */
  @Prop({ mutable: true }) empty: boolean = false;

  /**
   * 空状态配置(JSON字符串格式)
   * @type {string}
   * @default '{"headline": "No items", "description": "There are no items to display"}'
   * @mutable 可变的
   */
  @Prop({ mutable: true }) emptyState: any = `{
    "headline": "No items",
    "description": "There are no items to display"
  }`;

  /**
   * 内部解析后的空状态对象
   * @type {{description: string; title: string}}
   * @State 组件内部状态
   */
  @State()
  internalEmptyState: { description: string; title: string };

  /**
   * 是否显示加载指示器
   * @type {boolean}
   * @default false
   */
  @Prop() showLoader: boolean = false;

  /**
   * 组件值，可以是数字或字符串
   * @type {number|string}
   * @mutable 可变的
   */
  @Prop({ mutable: true }) value?: number | string;

  /**
   * 组件加载前生命周期钩子
   * 用于初始化空状态
   */
  componentWillLoad() {
    this.parseEmptyState();
  }

  /**
   * 监听全局键盘事件
   * @param {KeyboardEvent} evt - 键盘事件对象
   * @Listen 装饰器监听window的keydown事件
   */
  @Listen('keydown', { target: 'window' })
  handleKeyDown(evt: KeyboardEvent) {
    const path = evt.composedPath();
    let menuItem = null;
    for (const elm of path) {
      if ((elm as any).tagName === 'ZANE-MENU-ITEM') {
        menuItem = elm;
      }
      if (elm !== this.elm) continue;
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
   * 解析空状态JSON字符串
   * @Watch 监听emptyState属性变化
   */
  @Watch('emptyState')
  parseEmptyState() {
    this.internalEmptyState = this.emptyState
      ? JSON.parse(this.emptyState)
      : this.emptyState;
  }

  /**
   * 渲染组件
   * @returns {JSX.Element} 组件JSX结构
   */
  render() {
    return (
      <div class="menu">
        <slot />
        {this.renderEmptyState()}
      </div>
    );
  }

  /**
   * 公开方法：设置焦点到第一个菜单项
   * @Method 装饰器定义公共API方法
   * @returns {Promise<void>}
   */
  @Method()
  async setFocus() {
    const firstMenuItem = this.getFirstItem();
    firstMenuItem?.setFocus();
  }

  /**
   * 聚焦下一个菜单项
   * @private 私有方法
   * @param {HTMLElement} currentItem - 当前菜单项元素
   */
  private focusNextItem(currentItem) {
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
      nextItem = nextItem
        ? nextItem.nextElementSibling
        : this.elm.querySelector('zane-menu-item');
    } while (nextItem !== currentItem);
  }

  /**
   * 聚焦上一个菜单项
   * @private 私有方法
   * @param {HTMLElement} currentItem - 当前菜单项元素
   */
  private focusPreviousItem(currentItem) {
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
        : this.elm.querySelector('zane-menu-item:last-child');
    } while (previousItem !== currentItem);
  }

  /**
   * 获取第一个菜单项
   * @private 私有方法
   * @returns {HTMLElement|null} 第一个菜单项元素或null
   */
  private getFirstItem() {
    return this.elm.querySelector('zane-menu-item');
  }

  /**
   * 渲染空状态
   * @private 私有方法
   * @returns {JSX.Element|null} 空状态JSX或null
   */
  private renderEmptyState() {
    if (this.empty)
      return (
        <zane-empty-state class="empty-menu">
          <div slot="title">{this.internalEmptyState.title}</div>
          <div slot="description">{this.internalEmptyState.description}</div>
        </zane-empty-state>
      );
  }
}
