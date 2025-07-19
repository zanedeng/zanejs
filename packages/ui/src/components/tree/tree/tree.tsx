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
 * 树形结构可视化组件
 *
 * @example
 * <!-- 基础用法 -->
 * <zane-tree>
 *   <zane-tree-node value="node1">一级节点</zane-tree-node>
 *   <zane-tree-node value="node2">二级节点</zane-tree-node>
 * </zane-tree>
 */
@Component({
  shadow: true,
  styleUrl: 'tree.scss',
  tag: 'zane-tree',
})
export class Tree implements ComponentInterface {
  /**
   * 宿主元素引用（自动注入）
   * @type {HTMLElement}
   */
  @Element() elm!: HTMLElement;

  /**
   * 空状态显示开关
   * @prop {boolean} [empty=false] - 是否展示空状态界面
   * @mutable
   * @example
   * <zane-tree empty></zane-tree>
   */
  @Prop({ mutable: true }) empty: boolean = false;

  /**
   * 空状态配置（JSON 字符串或对象）
   * @prop {string|Object} [emptyState] - 空状态配置参数，支持两种格式：
   * 1. JSON 字符串格式（推荐）
   * 2. 直接传入配置对象
   *
   * @default {
   *  "headline": "No items",
   *  "description": "There are no items to display"
   * }
   * @mutable
   * @example
   * <!-- JSON字符串形式 -->
   * <zane-tree empty-state='{"headline":"空数据","description":"请添加节点"}'>
   *
   * <!-- 对象形式（需通过JS绑定） -->
   * <zane-tree empty-state={myConfig}>
   */
  @Prop({ mutable: true }) emptyState: string = `{
    "headline": "No items",
    "description": "There are no items to display"
  }`;

  /**
   * 内部处理后的空状态配置
   * @state
   * @type {Object}
   */
  @State()
  internalEmptyState: any;

  /**
   * 当前选中节点标识
   * @prop {string} selectedNode - 当前选中节点的唯一标识符（对应zane-tree-node的value）
   * @mutable
   */
  @Prop({ mutable: true })
  selectedNode: string;

  /** 订阅节点选择事件的回调函数列表 */
  subscribers: any[] = [];

  /** 组件加载前解析空状态配置 */
  componentWillLoad() {
    this.parseEmptyState();
  }

  /**
   * 获取当前选中节点
   * @method
   * @returns {Promise<string>} 当前选中节点的value值
   * @example
   * const tree = document.querySelector('zane-tree');
   * const selected = await tree.getSelectedNode();
   */
  @Method()
  async getSelectedNode() {
    return this.selectedNode;
  }

  /**
   * 全局键盘事件监听（窗口级）
   * @listens window:keydown
   * @param {KeyboardEvent} evt - 键盘事件对象
   * @description
   * 实现树节点的键盘导航：
   * 1. 当检测到键盘事件发生在当前树组件内时
   * 2. 按下`ArrowDown`：聚焦下一个可用节点
   * 3. 按下`ArrowUp`：聚焦上一个可用节点
   *
   * 导航规则：
   * - 仅当事件发生在`zane-tree-node`元素内时触发
   * - 自动跳过禁用状态的节点（`disabled`）
   * - 支持循环聚焦（到达末尾后回到首节点）
   */
  @Listen('keydown', { target: 'window' })
  handleKeyDown(evt: KeyboardEvent) {
    const path = evt.composedPath();
    let menuItem = null;
    for (const elm of path) {
      if ((elm as any).tagName === 'ZANE-TREE-NODE') {
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
   * 解析空状态配置
   * @watch emptyState
   * @description
   * 自动将字符串形式的配置转换为对象格式。
   * 当`emptyState`属性变化时自动触发。
   */
  @Watch('emptyState')
  parseEmptyState() {
    this.internalEmptyState =
      typeof this.emptyState === 'string'
        ? JSON.parse(this.emptyState)
        : this.emptyState;
  }

  /**
   * 组件渲染函数
   * @returns {VNode} 虚拟节点树
   * @description
   * 动态切换两种显示状态：
   * 1. 空状态：当`empty=true`时显示空白界面
   * 2. 正常状态：渲染树节点插槽内容
   */
  render() {
    return this.empty ? (
      <div class="tree-view">{this.renderEmptyState()}</div>
    ) : (
      <div class="tree-view">
        <slot></slot>
      </div>
    );
  }

  /**
   * 设置初始焦点
   * @method
   * @description 将焦点设置到树的第一个节点（无障碍支持）
   * @example
   * const tree = document.querySelector('zane-tree');
   * await tree.setFocus();
   */
  @Method()
  async setFocus() {
    const firstMenuItem = this.getFirstItem();
    (firstMenuItem as any)?.setFocus();
  }

  /**
   * 订阅节点选择事件
   * @method
   * @param {Function} cb - 选择事件回调函数
   * @description
   * 注册回调函数，当节点被选择时触发。
   * 回调函数接收当前选中节点的value值。
   *
   * 注意：需手动管理订阅关系，组件销毁前建议取消订阅
   * @example
   * tree.subscribeToSelect((value)  => {
   *   console.log('Selected  node:', value);
   * });
   */
  @Method()
  async subscribeToSelect(cb) {
    this.subscribers.push(cb);
  }

  /**
   * 处理树节点点击事件
   * @listens zane-tree-node--click
   * @param {CustomEvent} evt - 自定义事件对象
   * @description
   * 事件规范：
   * - 事件类型：`zane-tree-node--click`
   * - 事件数据：`evt.detail.value`  (节点标识符)
   *
   * 功能流程：
   * 1. 更新内部选中状态
   * 2. 通知所有订阅者
   */
  @Listen('zane-tree-node--click')
  treeNodeClick(evt: CustomEvent<any>) {
    this.selectedNode = evt.detail.value;
    this.subscribers.forEach((cb) => cb(evt.detail.value));
  }

  /**
   * 聚焦下一个可用节点
   * @private
   * @param {HTMLElement} currentItem - 当前焦点节点
   */
  private focusNextItem(currentItem) {
    let nextItem: any = currentItem.nextElementSibling;
    do {
      if (
        nextItem &&
        nextItem.tagName === 'ZANE-TREE-NODE' &&
        !nextItem.disabled
      ) {
        nextItem.setFocus();
        return;
      }
      nextItem = nextItem
        ? nextItem.nextElementSibling
        : this.elm.querySelector('zane-tree-node:first-child');
    } while (nextItem !== currentItem);
  }

  /**
   * 聚焦上一个可用节点
   * @private
   * @param {HTMLElement} currentItem - 当前焦点节点
   */
  private focusPreviousItem(currentItem) {
    let previousItem: any = currentItem.previousElementSibling;
    do {
      if (
        previousItem &&
        previousItem.tagName === 'ZANE-TREE-NODE' &&
        !previousItem.disabled
      ) {
        previousItem.setFocus();
        return;
      }
      previousItem = previousItem
        ? previousItem.previousElementSibling
        : this.elm.querySelector('zane-tree-node:last-child');
    } while (previousItem !== currentItem);
  }

  /**
   * 获取首个树节点元素
   * @private
   * @returns {HTMLElement | null} 首个可用节点
   * @todo 注意当前实现选择器不一致问题（zane-menu-item应为zane-tree-node）
   */
  private getFirstItem() {
    return this.elm.querySelector('zane-menu-item');
  }

  /**
   * 渲染空状态组件
   * @private
   * @returns {VNode} 空状态组件
   */
  private renderEmptyState() {
    if (this.empty)
      return (
        <zane-empty-state class="empty-menu" {...this.internalEmptyState} />
      );
  }
}
