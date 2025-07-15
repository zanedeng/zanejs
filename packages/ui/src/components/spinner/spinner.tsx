import { Component, Element, h, Host, Prop, State } from '@stencil/core';

import { getComponentIndex, remToPx } from '../../utils';

enum SpinnerSize {
  LG = 5.5,
  MD = 1,
  SM = 0.75,
}

/**
 * @name Spinner
 * @description Spinners provide a visual cue that an action is processing awaiting a course of change or a result.
 * @category Informational
 * @tags feedback, loading, progress, spinner
 * @example <zane-spinner class="rainbow" size="2rem"></zane-spinner>
 */
@Component({
  shadow: true,
  styleUrl: 'spinner.scss',
  tag: 'zane-spinner',
})
export class Spinner {
  @Prop() description: string = 'Loading...';

  @Element() elm!: HTMLElement;

  gid: string = getComponentIndex();

  @Prop() hideBackground: boolean = false;

  /**
   * The Icon size.
   * Possible values are: `"sm"`, `"md"`, `"lg"` and size in pixel. Defaults to `"md"`.
   */
  @Prop({ reflect: true }) size: 'lg' | 'md' | 'sm' | string = 'md';

  @State() slotHasContent = false;

  componentWillLoad() {
    this.slotHasContent = this.elm.hasChildNodes();
  }

  render() {
    const radius: number = 57.3 * this.getSize();
    let strokeWidth = 5;
    if (this.getSize() >= 5.5) strokeWidth = 10;
    strokeWidth = strokeWidth / ((this.getSize() * remToPx(1)) / 100);

    let strokeDashoffset = 50 * this.getSize();
    if (this.getSize() <= 1) {
      strokeDashoffset = 180 * this.getSize();
    }

    return (
      <Host>
        <div
          class={{ 'has-content': this.slotHasContent, spinner: true }}
          title={this.description}
        >
          <div
            class="spinner__container"
            style={{
              height: `${this.getSize()}rem`,
              width: `${this.getSize()}rem`,
            }}
          >
            <svg
              class="spinner__svg"
              viewBox={`0 0 ${
                2 * (radius + strokeWidth + 5 * this.getSize())
              } ${2 * (radius + strokeWidth + 5 * this.getSize())}`}
            >
              <title>{this.description}</title>
              {!this.hideBackground && (
                <circle
                  class="spinner__background"
                  cx="50%"
                  cy="50%"
                  r={radius}
                  style={{
                    strokeWidth: `${strokeWidth * this.getSize()}`,
                  }}
                ></circle>
              )}

              <circle
                class="spinner__stroke"
                cx="50%"
                cy="50%"
                r={radius}
                style={{
                  strokeDasharray: `${360 * this.getSize()}`,
                  strokeDashoffset: `${strokeDashoffset}`,
                  strokeWidth: `${strokeWidth * this.getSize()}`,
                }}
              ></circle>
            </svg>
          </div>

          <div class="slot-container">
            <slot />
          </div>
        </div>
      </Host>
    );
  }

  private getSize() {
    let size;
    if (!this.size || this.size === 'md') size = SpinnerSize.MD;
    else if (this.size === 'sm') size = SpinnerSize.SM;
    else if (this.size === 'lg') size = SpinnerSize.LG;
    else if (this.size.endsWith('px'))
      size = Number.parseInt(this.size.replace('px', '')) / 16;
    else if (this.size.endsWith('rem'))
      size = Number.parseInt(this.size.replace('rem', ''));
    else size = this.size;
    return size;
  }
}
