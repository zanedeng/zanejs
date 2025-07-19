import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Listen,
  Method,
  Prop,
  State,
} from '@stencil/core';

import { getComponentIndex } from '../../../utils';

/**
 * 树形结构节点组件
 *
 * @slot - 子节点插槽，用于嵌套树节点
 */
@Component({
  shadow: true,
  styleUrl: 'tree-node.scss',
  tag: 'zane-tree-node',
})
export class TreeNode {

  /**
   * 禁用节点交互
   * @prop {boolean} [disabled=false]
   * @reflect 属性值会同步到 DOM 属性
   */
  @Prop({ reflect: true }) disabled: boolean = false;

  /**
   * 组件宿主元素引用
   * @element
   */
  @Element() elm!: HTMLElement;

  /**
   * 控制子节点展开状态
   * @prop {boolean} [expanded=true]
   * @mutable 允许组件内部修改
   * @reflect 属性值会同步到 DOM 属性
   */
  @Prop({ mutable: true, reflect: true }) expanded: boolean = true;

  /**
   * 组件全局唯一标识符
   * @internal
   */
  gid: string = getComponentIndex();

  /**
   * 是否存在子节点
   * @state
   */
  @State() hasChildNodes = false;

  /**
   * 焦点状态标记
   * @state
   */
  @State() hasFocus = false;

  /**
   * 链接地址（存在时节点渲染为<a>标签）
   * @prop {string} href
   * @reflect 属性值会同步到 DOM 属性
   */
  @Prop({ reflect: true }) href: string;

  /**
   * 节点图标名称（需配合图标库使用）
   * @prop {string} icon
   */
  @Prop() icon: string;

  /**
   * 激活状态标记（鼠标/键盘按下时）
   * @state
   */
  @State() isActive = false;

  /**
   * 节点显示文本
   * @prop {string} [label='']
   * @mutable 允许组件内部修改
   */
  @Prop({ mutable: true }) label: string = '';

  /**
   * 节点层级（从父节点自动计算）
   * @prop {number} [level=0]
   * @reflect 属性值会同步到 DOM 属性
   */
  @Prop({ reflect: true }) level: number = 0;

  /**
   * 当前选中节点标识符
   * @prop {string} selectedNode
   * @mutable 允许组件内部修改
   * @reflect 属性值会同步到 DOM 属性
   */
  @Prop({ mutable: true, reflect: true }) selectedNode: string;

  /**
   * 链接打开方式（仅在设置 href 时生效）
   * @prop {('_self'|'_blank'|'_parent'|'_top')} [target='_self']
   * @defaultValue '_self'
   */
  @Prop() target: string = '_self';

  /**
   * 节点唯一标识符（优先级高于 label）
   * @prop {(null|number|string)} [value]
   * @mutable 允许组件内部修改
   */
  @Prop({ mutable: true }) value?: null | number | string;

  /**
   * 节点点击事件
   * @event zane-tree-node--click
   * @property {boolean} expand - 当前展开状态
   * @property {string} id - 组件全局 ID
   * @property {string} value - 节点标识值（优先取 value，否则使用 label）
   */
  @Event({ eventName: 'zane-tree-node--click' })
  zaneTreeNodeClick: EventEmitter;

  /**
   * 原生元素引用（动态生成 a/div 标签）
   * @private
   */
  private nativeElement?: HTMLElement;

  /**
   * 标签页导航顺序
   * @private
   * @defaultValue 1
   */
  private tabindex?: number | string = 1;

  /**
   * 组件加载前逻辑
   * @lifecycle
   */
  componentWillLoad() {
    if (this.elm.hasAttribute('tabindex')) {
      const tabindex = this.elm.getAttribute('tabindex');
      this.tabindex = tabindex === null ? undefined : tabindex;
      this.elm.removeAttribute('tabindex');
    }

    const treeView = this.elm.closest('zane-tree-view');

    (treeView as any).getSelectedNode().then((selectedNode: string) => {
      this.selectedNode = selectedNode;
    });

    (treeView as any).subscribeToSelect((selectedNode: string) => {
      this.selectedNode = selectedNode;
    });

    const childNodes = this.elm.querySelectorAll('zane-tree-node');
    this.hasChildNodes = childNodes.length > 0;
    childNodes.forEach((node: any) => {
      node.level = this.level + 1;
    });
  }

  /**
   * 触发点击事件
   * @private
   */
  handleClick = () => {
    this.zaneTreeNodeClick.emit({
      expand: this.expanded,
      id: this.gid,
      value: this.value || this.label,
    });
  };

  /**
   * 判断当前节点是否被选中
   * @returns {boolean} 选中状态
   */
  isSelected() {
    if (this.value === undefined && this.label === undefined) return false;
    else if (this.value === undefined) return this.selectedNode === this.label;
    else return this.selectedNode === this.value;
  }

  /**
   * 渲染函数
   * @returns {JSX.Element} 组件结构
   */
  render = () => {
    const NativeElementTag = this.#getNativeElementTagName();
    const styles = {
      paddingInlineStart: `calc(${this.level + 1}rem - 0.125rem)`,
    };

    return (
      <Host active={this.isActive} has-focus={this.hasFocus}>
        <div class="tree-node">
          <NativeElementTag
            aria-disabled={this.disabled}
            class={{
              active: this.isActive,
              disabled: this.disabled,
              'has-focus': this.hasFocus,
              selected: this.isSelected(),
              'tree-node-content': true,
            }}
            href={this.href}
            onBlur={this.blurHandler}
            onClick={this.clickHandler}
            onFocus={this.focusHandler}
            onKeyDown={this.keyDownHandler}
            onMouseDown={this.mouseDownHandler}
            ref={(el) => (this.nativeElement = el as HTMLElement)}
            style={styles}
            tabindex={this.tabindex}
            target={this.target}
          >
            {this.hasChildNodes && (
              <zane-icon
                class={{ 'expand-icon': true, expanded: this.expanded }}
                name="caret--right"
                size="1rem"
              />
            )}

            {!this.hasChildNodes && <div class="icon-space" />}

            {this.icon && (
              <zane-icon class={'icon'} name={this.icon} size="1rem" />
            )}

            <span class="tree-node-label">{this.label}</span>
          </NativeElementTag>

          <div
            class={{
              expanded: this.expanded,
              'node-slot': true,
            }}
          >
            <slot></slot>
          </div>
        </div>
      </Host>
    );
  };

  /**
   * 移除元素焦点
   * @method
   * @async
   */
  @Method()
  async setBlur() {
    if (this.nativeElement) {
      this.nativeElement.blur();
    }
  }

  /**
   * 设置元素焦点
   * @method
   * @async
   */
  @Method()
  async setFocus() {
    if (this.nativeElement) {
      this.nativeElement.focus();
    }
  }

  /**
   * 全局键盘释放监听
   * @listens window:keyup
   * @param {KeyboardEvent} evt - 键盘事件对象
   */
  @Listen('keyup', { target: 'window' })
  windowKeyUp(evt) {
    if (this.isActive && evt.key === ' ') this.isActive = false;
  }

  /**
   * 全局鼠标释放监听
   * @listens window:mouseup
   */
  @Listen('mouseup', { target: 'window' })
  windowMouseUp() {
    if (this.isActive) this.isActive = false;
  }

  /**
   * 动态获取元素标签类型
   * @private
   * @returns {'a'|'div'} 标签类型
   */
  #getNativeElementTagName() {
    return this.href ? 'a' : 'div';
  }

  private blurHandler = () => {
    this.hasFocus = false;
  };

  private clickHandler = (event) => {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      this.expanded = !this.expanded;
      this.handleClick();
    }
  };

  private focusHandler = () => {
    this.hasFocus = true;
  };

  private keyDownHandler = (evt) => {
    switch (evt.key) {
      case ' ':
      case 'Enter': {
        if (this.hasChildNodes) {
          evt.preventDefault();
          this.clickHandler(evt);
        } else if (this.href) {
          evt.preventDefault();
          this.isActive = true;
          this.handleClick();
          window.open(this.href, this.target);
        } else {
          evt.preventDefault();
          this.isActive = true;
          this.handleClick();
        }

        break;
      }
      case 'ArrowLeft': {
        evt.preventDefault();
        this.expanded = false;

        break;
      }
      case 'ArrowRight': {
        evt.preventDefault();
        if (this.expanded && this.hasChildNodes) {
          const childNodes = this.elm.querySelectorAll('zane-tree-node');
          if (childNodes.length > 0) {
            const firstChild = childNodes[0] as any;
            firstChild.setFocus();
          }
        } else {
          this.expanded = true;
        }

        break;
      }
      // No default
    }
  };

  private mouseDownHandler = () => {
    this.isActive = true;
  };
}
