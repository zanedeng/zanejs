import {
  Component,
  ComponentInterface,
  Element,
  h,
  Host,
  Prop,
  State,
} from '@stencil/core';

/**
 * @name Divider
 * @description A divider can be used to segment content vertically or horizontally.
 * @category Layout
 * @example <zane-divider style="width: 12rem;">or</zane-divider>
 */
@Component({
  shadow: true,
  styleUrl: 'divider.scss',
  tag: 'zane-divider',
})
export class Divider implements ComponentInterface {
  @Element() elm!: HTMLElement;

  @State() slotHasContent = false;
  @Prop({ reflect: true }) vertical: boolean = false;

  componentWillLoad() {
    this.slotHasContent = this.elm.hasChildNodes();
  }

  render() {
    return (
      <Host>
        <div
          class={{
            divider: true,
            'has-content': this.slotHasContent,
            vertical: this.vertical,
          }}
        >
          <div class="line" />
          <div class="slot-container">
            <slot />
          </div>
          <div class="line" />
        </div>
      </Host>
    );
  }
}
