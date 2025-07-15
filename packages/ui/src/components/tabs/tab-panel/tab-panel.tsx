import { Component, ComponentInterface, h, Host, Prop } from '@stencil/core';

@Component({
  shadow: true,
  styleUrl: 'tab-panel.scss',
  tag: 'zane-tab-panel',
})
export class TabPanel implements ComponentInterface {
  @Prop({ reflect: true }) active: boolean = false;

  @Prop({ reflect: true }) layer?: '01' | '02' | 'background';

  @Prop({ reflect: true }) value: string;

  render() {
    return (
      <Host>
        <slot />
      </Host>
    );
  }
}
