import { Component, h, Host, Prop } from '@stencil/core';

/**
 * @name Progress
 * @description Progress indicators express an unspecified wait time or display the length of a process.
 * @category Informational
 * @tags feedback, loading, progress, spinner
 * @example <zane-progress value="40" label="Progress" width="100%" helper-text="Optional helper text goes here..."></zane-progress>
 */
@Component({
  shadow: true,
  styleUrl: 'progress.scss',
  tag: 'zane-progress',
})
export class Progress {
  @Prop() helperText: string;

  @Prop() hideLabel: boolean = false;

  /**
   * A label describing the progress bar.
   */
  @Prop() label: string;

  /**
   *
   * Possible values are: `"sm"` and `"md"` in pixel. Defaults to `"md"`.
   */
  @Prop() size: 'md' | 'sm' = 'md';

  @Prop() status: 'active' | 'error' | 'success' = 'active';

  /*
   * The current value.
   */
  @Prop() value: number = null;

  getRenderIcon() {
    if (this.status === 'success') {
      return (
        <zane-icon
          class={'progress-icon'}
          name={'checkmark--filled'}
        ></zane-icon>
      );
    } else if (this.status === 'error') {
      return (
        <zane-icon class={'progress-icon'} name={'error--filled'}></zane-icon>
      );
    }
  }

  render() {
    return (
      <Host>
        <div
          class={{
            [`size-${this.size}`]: true,
            [`status-${this.status}`]: true,
            indeterminate: this.value === null && this.status === 'active',
            progress: true,
          }}
        >
          {!this.hideLabel && (
            <div class="progress-header">
              <label class="progress-label">{this.label}</label>
              {this.getRenderIcon()}
            </div>
          )}
          <div class="progress-track">
            <div
              aria-valuemax="100"
              aria-valuemin="0"
              aria-valuenow={this.value}
              class="progress-bar"
              role="progressbar"
              style={{ width: `${this.value}%` }}
            ></div>
          </div>
          <div class="progress-helper">{this.helperText}</div>
        </div>
      </Host>
    );
  }
}
