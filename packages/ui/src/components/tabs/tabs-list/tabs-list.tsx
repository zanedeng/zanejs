import {
  Component,
  ComponentInterface,
  Element,
  h,
  Host,
  Listen,
  Prop,
} from '@stencil/core';

@Component({
  shadow: true,
  styleUrl: 'tabs-list.scss',
  tag: 'zane-tabs-list',
})
export class TabsList implements ComponentInterface {
  @Element() elm!: HTMLElement;

  /**
   * 是否由外部管理状态（如父组件 zane-tabs 管理）
   * 如果为 true，则点击标签页时不会自动修改选中状态，而是由外部通过事件来控制。
   * 默认情况下，组件自身管理状态。
   */
  @Prop() managed: boolean = false;

  /**
   * 标签栏的样式类型
   * - default: 默认样式
   * - contained: 包含式（通常有背景和边框）
   * - contained-bottom: 包含式，标签位于底部
   */
  @Prop({ reflect: true }) type: 'contained' | 'contained-bottom' | 'default' =
    'default';

  /**
   * 取消所有标签页的选中状态
   */
  deselectAllTabs() {
    const tabs = this.elm.querySelectorAll('zane-tab');
    tabs.forEach((tab) => {
      (tab as any).selected = false;
    });
  }

  render() {
    return (
      <Host>
        <div class={{ [`type-${this.type}`]: true, 'tabs-list': true }}>
          <div class="tabs-container">
            <slot />
          </div>
        </div>
      </Host>
    );
  }

  /**
   * 监听子标签页的点击事件
   * @param evt 自定义事件，详情见 zane-tab 组件的定义
   */

  @Listen('zane-tab-click')
  tabClick(evt: CustomEvent<any>) {
    if (!this.managed) {
      this.deselectAllTabs();
      (evt.target as any).selected = true;
      if (!evt.detail.target) {
        console.warn('zane-tabs:: No target associated');
      }
    }
  }
}
