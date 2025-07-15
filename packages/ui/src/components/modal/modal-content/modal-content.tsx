import { Component, h, Host, Prop } from '@stencil/core';

/**
 * @name Modal Content
 * @description The Modal Content component is used to display the content within a modal.
 * @category Informational
 * @subcategory Modal
 * @childComponent true
 */
@Component({
  shadow: true,
  styleUrl: 'modal-content.scss',
  tag: 'zane-modal-content',
})
export class ModalContent {
  @Prop({ reflect: true }) type: 'borderless' | 'default' | 'text' = 'default';

  render() {
    return (
      <Host>
        <div class="modal-content">
          <slot />
        </div>
      </Host>
    );
  }
}
