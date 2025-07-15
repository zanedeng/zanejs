import {
  Component,
  ComponentInterface,
  Element,
  getAssetPath,
  h,
  Host,
  Listen,
  Prop,
  State,
} from '@stencil/core';
import * as DOMPurify from 'dompurify';

/**
 * @name Empty State
 * @description A message that displays when there is no information to display.
 * @category Data Display
 * @img /assets/img/empty-state.webp
 * @imgDark /assets/img/empty-state-dark.webp
 */
@Component({
  shadow: true,
  styleUrl: 'empty-state.scss',
  tag: 'zane-empty-state',
})
export class EmptyState implements ComponentInterface {
  @Prop({ reflect: true }) action: string;

  @Prop() actionDisabled: boolean = false;

  @Prop() actionUrl: string;

  @Prop() actionVariant: 'default' | 'ghost' | 'outline' = 'default';

  @Prop({ reflect: true }) description: string;

  @Element() elm!: HTMLElement;

  @Prop({ reflect: true }) headline: string;

  @Prop({ reflect: true }) illustration: string = 'no-document';

  @State() vertical: boolean = false;

  componentDidLoad() {
    this.resizeHandler();
  }

  render() {
    return (
      <Host>
        <div class={{ 'empty-state': true, vertical: this.vertical }}>
          <div class="empty-state-container">
            <div class="illustration">
              <zane-svg
                src={getAssetPath(
                  `./assets/images/empty-state/${this.illustration}.svg`,
                )}
              />
            </div>

            <div class="content">
              {this.headline && <div class="title">{this.headline}</div>}
              {this.description && (
                <div
                  class="description"
                  innerHTML={DOMPurify.sanitize(this.description)}
                />
              )}
              <div class="actions">
                {this.action && (
                  <zane-button
                    disabled={this.actionDisabled}
                    href={this.actionUrl}
                    icon={'arrow--right'}
                    variant={this.actionVariant}
                  >
                    {this.action}
                  </zane-button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Host>
    );
  }

  @Listen('resize', { target: 'window' })
  resizeHandler() {
    // this.vertical = this.elm.clientWidth < 768;
  }
}
