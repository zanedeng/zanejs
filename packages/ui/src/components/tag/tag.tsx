import {
  Component,
  ComponentInterface,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Prop,
} from '@stencil/core';

import { ElementSize } from '../../enums';

/**
 * @name Tag
 * @description Use tags to label, categorize, or organize items using keywords that describe them.
 * @category Data Display
 * @tag controls
 * @example <zane-tag class="color-red">Important</zane-tag>
 */
@Component({
  shadow: true,
  styleUrl: 'tag.scss',
  tag: 'zane-tag',
})
export class Tag implements ComponentInterface {
  /**
   * Tag color.
   * Possible values are: 'gray', 'blue', 'green', 'red', 'yellow', 'primary', 'success', 'info', 'warning', 'error'.
   */
  @Prop({ reflect: true }) color:
    | 'blue'
    | 'error'
    | 'gray'
    | 'green'
    | 'info'
    | 'primary'
    | 'red'
    | 'success'
    | 'warning'
    | 'yellow' = 'gray';

  /**
   * If true, the tag will have a close icon.
   */
  @Prop() dismissible: boolean = false;

  @Element() elm!: HTMLElement;

  /**
   * Image source.
   */
  @Prop() imageSrc?: string;

  /**
   * If true, the tag will be selected.
   */
  @Prop({ reflect: true }) selected: boolean = false;

  /**
   * Text size.
   */
  @Prop({ reflect: true }) size: 'md' | 'sm' = 'md';

  /**
   * Tag value.
   */
  @Prop({ reflect: true }) value: string = '';

  /**
   * Emitted when the tag is clicked.
   */
  @Event({ eventName: 'zane-tag--click' }) zaneClick: EventEmitter;

  /**
   * Emitted when the close icon is clicked.
   */
  @Event({ eventName: 'zane-tag--dismiss' }) zaneTagDismissClick: EventEmitter;

  render() {
    return (
      <Host>
        <div
          class={{
            [`color-${this.color}`]: true,
            [`size-${this.size}`]: true,
            dismissible: this.dismissible,
            selected: this.selected,
            tag: true,
          }}
        >
          {this.renderImage()}
          <div class="tag-content">
            <slot />
          </div>
          {this.renderCloseButton()}
        </div>
      </Host>
    );
  }

  renderCloseButton() {
    if (this.dismissible)
      return (
        <button class="close-btn" onClick={() => this.dismissClickHandler()}>
          <zane-icon
            class="close-btn-icon inherit"
            name="close"
            size={this.getIconSize()}
          ></zane-icon>
        </button>
      );
  }

  renderImage() {
    if (this.imageSrc)
      return <img alt="Tag image" class="tag-image" src={this.imageSrc} />;
  }

  private dismissClickHandler = () => {
    this.zaneTagDismissClick.emit({
      value: this.value || this.elm.textContent,
    });
  };

  private getIconSize() {
    switch (this.size) {
      case ElementSize.MEDIUM: {
        return '1.25rem';
      }
      case ElementSize.SMALL: {
        return '1rem';
      }
      default: {
        return '1rem';
      }
    }
  }
}
