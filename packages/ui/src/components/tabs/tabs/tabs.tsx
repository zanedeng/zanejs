import {
  Component,
  ComponentInterface,
  Element,
  h,
  Host,
  Listen,
  Prop,
} from '@stencil/core';

import { getComponentIndex } from '../../../utils';

/**
 * 标签页容器组件，用于管理和切换多个标签页
 *
 */
@Component({
  shadow: true,
  styleUrl: 'tabs.scss',
  tag: 'zane-tabs',
})
export class Tabs implements ComponentInterface {
  /**
   * 组件宿主元素引用
   *
   * @type {HTMLElement}
   * @memberof Tabs
   */
  @Element() elm!: HTMLElement;

  /**
   * 组件唯一标识符，用于区分多个实例
   *
   * @type {string}
   * @memberof Tabs
   */
  gid: string = getComponentIndex();

  /**
   * 组件层级设置，影响样式和视觉层次
   *
   * @type {'01' | '02' | 'background'}
   * @prop layer
   * @memberof Tabs
   *
   * - `'01'`: 第一层级（最高层级，用于凸出显示）
   * - `'02'`: 第二层级（中等层级，常规内容）
   * - `'background'`: 背景层级（最低层级，用于背景元素）
   */
  @Prop({ reflect: true }) layer?: '01' | '02' | 'background';

  /**
   * 标签页类型，决定标签页的视觉样式
   *
   * @type {'contained' | 'contained-bottom' | 'default'}
   * @prop type
   * @default 'default'
   * @memberof Tabs
   *
   * - `'contained'`: 包含式标签（标签与内容区域视觉统一）
   * - `'contained-bottom'`: 底部包含式标签（标签位于内容底部）
   * - `'default'`: 默认样式（标准分隔式标签）
   */
  @Prop({ reflect: true }) type: 'contained' | 'contained-bottom' | 'default' =
    'default';

  /**
   * 组件加载完成后初始化标签页
   */
  componentDidLoad() {
    if (this.tabsHaveTarget()) {
      const selectedTab = this.elm.querySelector('zane-tab[selected]');
      if (selectedTab) this.selectTab((selectedTab as any).target);
    } else {
      const tabs = this.getTabs();
      tabs.forEach((tab: HTMLZaneTabElement, index) => {
        tab.setAttribute('target', `tab-${this.gid}-${index}`);
        tab.type = this.type;
      });
      tabs[0].classList.add('first-tab');
      tabs[tabs.length - 1].classList.add('last-tab');

      const tabList: any = this.getTabList();
      tabList.type = this.type;
      this.getTabPanels().forEach((tab, index) => {
        tab.setAttribute('value', `tab-${this.gid}-${index}`);
      });
      if (tabs.length > 0) this.selectTab(`tab-${this.gid}-0`);
    }
  }

  /**
   * 获取标签列表组件实例
   *
   * @return {HTMLElement} 标签列表元素
   * @memberof Tabs
   */
  getTabList() {
    return this.elm.querySelector(':scope > zane-tabs-list');
  }

  /**
   * 获取所有标签面板元素
   *
   * @return {NodeListOf<Element>} 标签面板元素列表
   * @memberof Tabs
   */
  getTabPanels() {
    return this.elm.querySelectorAll(':scope > zane-tab-panel');
  }

  /**
   * 获取所有标签页元素
   *
   * @return {NodeListOf<HTMLZaneTabElement>} 标签页元素列表
   * @memberof Tabs
   */
  getTabs() {
    return this.elm.querySelectorAll(':scope > zane-tabs-list zane-tab');
  }

  /**
   * 渲染组件宿主容器
   *
   * @return {JSX.Element} 组件JSX结构
   * @memberof Tabs
   */
  render() {
    return (
      <Host>
        <slot />
      </Host>
    );
  }

  /**
   * 选中指定目标标签页
   *
   * @param {string} target 要选中的标签页目标标识
   * @memberof Tabs
   */
  selectTab(target) {
    const tabs = this.getTabs();
    // eslint-disable-next-line unicorn/no-for-loop
    for (let i = 0; i < tabs.length; i++) {
      const tab: any = tabs[i];
      tab.selected = false;
      tab.classList.remove('previous-tab', 'next-tab');
    }
    for (let i = 0; i < tabs.length; i++) {
      const tab: any = tabs[i];
      if (target === tab.target) {
        tab.selected = true;

        if (tabs[i - 1]) {
          tabs[i - 1].classList.add('previous-tab');
        }
        if (tabs[i + 1]) {
          tabs[i + 1].classList.add('next-tab');
        }
      }
    }
    const tabPanels = this.getTabPanels();
    // eslint-disable-next-line unicorn/no-for-loop
    for (let i = 0; i < tabPanels.length; i++) {
      const tabPanel: any = tabPanels[i];
      tabPanel.active = target === tabPanel.value;
    }
  }

  /**
   * 监听标签点击事件
   *
   * @param {CustomEvent} evt 标签点击事件对象
   * @listens zane-tab--click
   * @memberof Tabs
   */
  @Listen('zane-tab--click')
  tabClick(evt: CustomEvent<any>) {
    evt.stopPropagation();
    if (evt.detail.target) {
      this.selectTab(evt.detail.target);
    }
  }

  /**
   * 检查标签页是否已有预定义目标
   *
   * @return {boolean} 是否存在带target属性的标签页
   * @memberof Tabs
   */
  tabsHaveTarget() {
    return this.elm.querySelector(':scope > zane-tabs-list zane-tab[target]');
  }
}
