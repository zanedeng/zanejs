import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Prop,
  State,
} from '@stencil/core';

import { getComponentIndex } from '../../../utils';

/**
 * @name Accordion Item
 * @description An accordion item is single item in an accordion list. It contains a header and a content section that can be expanded or collapsed by the user.
 * @overview
 *  <p>The accordion item component is a single item in an accordion list. It contains a header and a content section that can be expanded or collapsed by the user. The accordion item can be used in conjunction with the accordion component to create a list of expandable items.</p>
 * @category Data Display
 * @subcategory Accordion
 * @childComponent true
 */
@Component({
  shadow: true,
  styleUrl: 'accordion-item.scss',
  tag: 'zane-accordion-item',
})
export class AccordionItem {
  /**
   * If true, the user cannot interact with the button. Defaults to `false`.
   */
  @Prop() disabled: boolean = false;

  @Element() elm!: HTMLElement;

  @State() endSlotHasContent = false;

  gid: string = getComponentIndex();

  @State() hasFocus = false;

  /**
   * The menu item value.
   */
  @Prop() heading: string;

  /**
   * Menu item selection state.
   */
  @Prop({ mutable: true, reflect: true }) open: boolean = false;
  @State() startSlotHasContent = false;

  /**
   * Emitted when the menu item is clicked.
   */
  @Event({ eventName: 'zane-accordion-item--click' })
  zaneAccordionItemClick: EventEmitter;

  render = () => {
    return (
      <Host open={this.open}>
        <div
          class={{
            'accordion-item': true,
            disabled: this.disabled,
            open: this.open,
          }}
        >
          <button
            aria-controls={`accordion-control-${this.gid}`}
            aria-disabled={`${this.disabled}`}
            aria-expanded={`${this.open}`}
            class={{ 'accordion-heading': true, 'has-focus': this.hasFocus }}
            id={`accordion-heading-${this.gid}`}
            on-click={() => {
              if (!this.disabled) {
                this.open = !this.open;
                this.hasFocus = true;
                this.zaneAccordionItemClick.emit({
                  element: this.elm,
                  gid: this.gid,
                  open: this.open,
                });
              }
            }}
            onBlur={this.blurHandler}
            onFocus={this.focusHandler}
            type="button"
          >
            <zane-icon
              class="accordion-icon inherit"
              name="chevron--down"
              size="1rem"
            />
            <div class="accordion-title" part="title">
              <slot name="heading">{this.heading}</slot>
            </div>
          </button>
          <div
            aria-labelledby={`accordion-heading-${this.gid}`}
            class="item-section slot-main"
            id={`accordion-control-${this.gid}`}
            role="region"
          >
            <slot />
          </div>
        </div>
      </Host>
    );
  };

  private blurHandler = () => {
    this.hasFocus = false;
  };

  private focusHandler = () => {
    this.hasFocus = true;
  };
}
