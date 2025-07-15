import {
  Component,
  ComponentInterface,
  Element,
  h,
  Host,
  Prop,
} from '@stencil/core';

@Component({
  shadow: true,
  styleUrl: 'container.scss',
  tag: 'zane-container',
})
export class Container implements ComponentInterface {
  @Element() host!: HTMLElement;

  @Prop({ reflect: true })
  size: 'full' | 'lg' | 'max' | 'md' | 'sm' | 'xl' = 'full';

  render() {
    return (
      <Host>
        <div
          class={{
            [`size-${this.size}`]: true,
            'container-wrapper': true,
          }}
        >
          <div class="container">
            <div class="content">
              <slot />
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
