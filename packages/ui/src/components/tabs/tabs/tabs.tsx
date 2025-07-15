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
 * @name Tabs
 * @description The tabs component is used to display multiple panels of content in a container.
 * @category Navigation
 * @tags navigation
 * @example <zane-tabs>
 *   <zane-tabs-list>
 *    <zane-tab selected >Tab 1</zane-tab>
 *    <zane-tab>Tab 2</zane-tab>
 *   </zane-tabs-list>
 * </zane-tabs>
 */
@Component({
  shadow: true,
  styleUrl: 'tabs.scss',
  tag: 'zane-tabs',
})
export class Tabs implements ComponentInterface {
  @Element() elm!: HTMLElement;
  gid: string = getComponentIndex();

  @Prop({ reflect: true }) layer?: '01' | '02' | 'background';

  @Prop({ reflect: true }) type: 'contained' | 'contained-bottom' | 'default' =
    'default';

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

  getTabList() {
    return this.elm.querySelector(':scope > zane-tabs-list');
  }

  getTabPanels() {
    return this.elm.querySelectorAll(':scope > zane-tab-panel');
  }

  getTabs() {
    return this.elm.querySelectorAll(':scope > zane-tabs-list zane-tab');
  }

  render() {
    return (
      <Host>
        <slot />
      </Host>
    );
  }

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

  @Listen('zane-tab--click')
  tabClick(evt: CustomEvent<any>) {
    evt.stopPropagation();
    if (evt.detail.target) {
      this.selectTab(evt.detail.target);
    }
  }

  tabsHaveTarget() {
    return this.elm.querySelector(':scope > zane-tabs-list zane-tab[target]');
  }
}
