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

  @Prop() managed: boolean = false;

  @Prop({ reflect: true }) type: 'contained' | 'contained-bottom' | 'default' =
    'default';

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
