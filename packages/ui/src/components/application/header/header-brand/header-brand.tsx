import { Component, Fragment, h, Method, Prop, State } from '@stencil/core';

@Component({
  shadow: true,
  styleUrl: 'header-brand.scss',
  tag: 'zane-header-brand',
})
export class HeaderBrand {
  @State() color: any;
  @Prop() href: string = '#';
  @Prop() logo: string;
  @Prop() name: string;

  @Prop() subTitle: string;

  render() {
    const isLogoSVG = this.logo.endsWith('.svg');
    return (
      <div class="header-brand">
        <zane-button
          class="brand-link no-style"
          color={this.color}
          href={this.href}
          variant={'link'}
        >
          <div class="brand">
            {(() => {
              if (this.logo) {
                return isLogoSVG ? (
                  <zane-svg class="logo inherit" src={this.logo} />
                ) : (
                  <img alt={this.name} class="logo" src={this.logo} />
                );
              }
            })()}
            {this.name && <span class="brand-name">{this.name}</span>}
          </div>
        </zane-button>
        {(() => {
          if (this.subTitle)
            return (
              <Fragment>
                <zane-divider class="subtitle-divider" vertical={true} />
                <div class="subtitle">{this.subTitle}</div>
              </Fragment>
            );
        })()}
      </div>
    );
  }

  /*
   * @internal
   */
  @Method()
  async setColor(color: string) {
    this.color = color;
  }
}
