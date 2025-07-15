import { Component, h, Host, Prop } from '@stencil/core';

@Component({
  shadow: true,
  styleUrl: 'card.scss',
  tag: 'zane-card',
})
export class Card {
  @Prop() shadowLevel: 'lg' | 'md' | 'sm' | 'xl' | 'xs' | 'xxl' | undefined;

  render() {
    return (
      <Host shadow-level={this.shadowLevel}>
        <div class="card">
          <slot />
        </div>
      </Host>
    );
  }
}
