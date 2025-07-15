import {
  Component,
  ComponentInterface,
  Element,
  h,
  Host,
  Method,
} from '@stencil/core';

import { getComponentIndex } from '../../../utils';

/**
 * @name Dropdown Menu
 * @description The Dropdown Menu component is used to display a list of options.
 * @category Navigation
 * @subcategory Dropdown
 * @childComponent true
 */
@Component({
  shadow: true,
  styleUrl: 'dropdown-menu.scss',
  tag: 'zane-dropdown-menu',
})
export class DropdownMenu implements ComponentInterface {
  gid: string = getComponentIndex();

  @Element() host!: HTMLElement;
  menuRef: HTMLZaneMenuElement;

  render() {
    return (
      <Host>
        <zane-menu class="dropdown-content" ref={(elm) => (this.menuRef = elm)}>
          <slot />
        </zane-menu>
      </Host>
    );
  }

  /**
   * Sets focus on first menu item. Use this method instead of the global
   * `element.focus()`.
   */
  @Method()
  async setFocus() {
    await this.menuRef.setFocus();
  }
}
