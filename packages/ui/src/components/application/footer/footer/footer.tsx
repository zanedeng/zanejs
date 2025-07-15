import { Component, Element, h, Host, Prop } from '@stencil/core';

/**
 * @name Footer
 * @description The footer component provides a container for displaying additional navigation information about a site.
 * @overview <p>The footer is one of the most underestimated sections of a website being located at the very bottom of every page, however, it can be used as a way to try to convince users to stay on your website if they haven’t found the information they’ve been looking for inside the main content area.</p>
 * @category Navigation
 * @img /assets/img/footer.webp
 * @imgDark /assets/img/footer-dark.webp
 */
@Component({
  shadow: true,
  styleUrl: 'footer.scss',
  tag: 'zane-footer',
})
export class Footer {
  @Element() host!: HTMLElement;

  @Prop({ reflect: true }) variant: string = 'simple';

  @Prop() year = new Date().getFullYear();

  render() {
    return (
      <Host>
        <div class="footer-container">
          <footer class={{ [`variant-${this.variant}`]: true, footer: true }}>
            <div class={'slot-container start'}>
              <slot name={'start'} />
            </div>
            <div class={'slot-container end'}>
              <slot name={'end'} />
            </div>
          </footer>
        </div>
      </Host>
    );
  }
}
