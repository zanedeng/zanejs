import { Component, Element, h, Host, Listen, Prop } from '@stencil/core';

/**
 * 工具提示组件 (zane-tooltip)
 *
 * 该组件实现了一个灵活的工具提示系统，可通过悬停或手动触发显示上下文信息。
 * 支持四种定位方向，可动态绑定目标元素，并适配无障碍规范。
 *
 */
@Component({
  shadow: true,
  styleUrl: 'tooltip.scss',
  tag: 'zane-tooltip',
})
export class Tooltip {

  /**
   * 工具提示内容
   * @prop {string} content - 显示在提示框内的文本内容
   * @mutable 允许动态更新内容
   * @default ''
   */
  @Prop({ mutable: true }) content: string = '';

  // 获取宿主元素引用
  @Element() elm!: HTMLElement;

  /**
   * 提示框定位方向
   * @prop {string} placements - 逗号分隔的可用定位方向列表
   * @description
   *   支持的定位值：
   *   - 'top'     : 上方定位
   *   - 'bottom'  : 下方定位
   *   - 'right'   : 右侧定位
   *   - 'left'    : 左侧定位
   * @default 'top,bottom,right,left' (支持所有方向)
   */
  @Prop() placements: string = 'top,bottom,right,left';

  // 引用内部的zane-popover组件实例
  popoverElm: any;

  // 当前关联的目标元素（触发提示显示的元素）
  targetElm: HTMLElement;

  /**
   * 触发方式
   * @prop {'hover' | 'manual'} trigger - 控制提示显示触发的模式
   *   - 'hover' : 鼠标悬停在目标元素时自动触发（默认）
   *   - 'manual': 需要通过编程方式触发（如调用show()方法）
   * @default 'hover'
   * @reflect 同步到DOM属性
   */
  @Prop({ reflect: true }) trigger: 'hover' | 'manual' = 'hover';

  render() {
    return (
      <Host>
        <zane-popover
          class="popover"
          placements={this.placements}
          ref={(elm) => (this.popoverElm = elm)}
          tip="caret"
          trigger={this.trigger}
        >
          <slot />

          <zane-popover-content class="tooltip-content">
            {this.content}
            <slot name="content"></slot>
          </zane-popover-content>
        </zane-popover>
      </Host>
    );
  }

  /**
   * 全局鼠标悬停事件监听
   * @listen window:mouseover
   * @param {MouseEvent} evt - 鼠标事件对象
   * @description
   *   实现动态目标绑定机制：
   *   1. 检测事件路径中的元素
   *   2. 查找带有[tooltip-target]属性的元素
   *   3. 当匹配当前组件ID时更新目标元素
   *   4. 从目标元素获取提示内容
   *   5. 通过popover组件显示提示
   */
  @Listen('mouseover', { target: 'window' })
  windowMouseOver(evt) {
    const path = evt.path || evt.composedPath();
    for (const elm of path) {
      if (elm === this.elm) return;
    }
    let target: HTMLElement;
    for (const elm of path) {
      if (
        elm.hasAttribute &&
        elm.hasAttribute('tooltip-target') &&
        elm.getAttribute('tooltip-target') === this.elm.getAttribute('id')
      )
        target = elm;
    }

    if (target && this.targetElm !== target) {
      this.targetElm = target;
      if (target.hasAttribute('tooltip-content'))
        this.content = target.getAttribute('tooltip-content');
      this.popoverElm.show(target);
    }
  }
}
