import { Component, h, Host, Prop } from '@stencil/core';

/**
 * @name Badge
 * @description The badge component is used to display a small amount of information to the user.
 * @category Informational
 * @tag content
 * @example <zane-badge content="5"> <zane-icon name="notification" size="2rem"></zane-icon></zane-badge>
 */
@Component({
  shadow: true,
  styleUrl: 'badge.scss',
  tag: 'zane-badge',
})
export class Badge {
  @Prop({ reflect: true }) color:
    | 'error'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning' = 'error';

  @Prop() content: string;

  render() {
    return (
      <Host>
        <div class={{ [`color-${this.color}`]: true, badge: true }}>
          <div
            class={{
              'badge-content': true,
              'has-content': this.content !== '',
            }}
          >
            {this.content}
          </div>
          <slot />
        </div>
      </Host>
    );
  }
}
