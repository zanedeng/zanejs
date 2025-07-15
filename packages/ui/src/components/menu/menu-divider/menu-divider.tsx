import { Component, ComponentInterface, h, Host } from '@stencil/core';

/**
 * @name MenuDivider
 * @description A divider to separate menu items.
 * @category Layout
 * @subcategory Menu
 * @childComponents true
 * @example <zane-divider style="width: 12rem;">or</zane-divider>
 */
@Component({
  shadow: true,
  styleUrl: 'menu-divider.scss',
  tag: 'zane-menu-divider',
})
export class MenuDivider implements ComponentInterface {
  render() {
    return (
      <Host>
        <div class="divider"></div>
      </Host>
    );
  }
}
