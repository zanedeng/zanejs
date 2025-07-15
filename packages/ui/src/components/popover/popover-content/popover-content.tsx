import { Component, ComponentInterface, Element, h, Host } from '@stencil/core';

import { getComponentIndex } from '../../../utils';

/**
 * @name Popover Content
 * @description The PopoverContent component is used to display additional information.
 * @category Informational
 * @subcategory Popover
 * @childComponent true
 */
@Component({
  shadow: true,
  styleUrl: 'popover-content.scss',
  tag: 'zane-popover-content',
})
export class PopoverContent implements ComponentInterface {
  gid: string = getComponentIndex();

  @Element() host!: HTMLElement;

  render() {
    return (
      <Host>
        <div class="popover-content">
          <slot />

          <div class="arrow"></div>
        </div>
      </Host>
    );
  }
}
