import { Component, ComponentInterface, h, Host } from '@stencil/core';

/**
 * @name Button Group
 * @description Group a series of buttons together on a single line with the button group, and super-power.
 * @category General
 * @tags controls
 * @example <zane-button-group>
 *   <zane-button block icon="home"></zane-button>
 *   <zane-button block icon="alarm"></zane-button>
 *   </zane-button-group>
 */
@Component({
  shadow: true,
  styleUrl: 'button-group.scss',
  tag: 'zane-button-group',
})
export class ButtonGroup implements ComponentInterface {
  render() {
    return (
      <Host>
        <div class="button-group">
          <slot />
        </div>
      </Host>
    );
  }
}
