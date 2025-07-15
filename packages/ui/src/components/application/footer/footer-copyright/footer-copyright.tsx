import { Component, Element, h, Host, Prop } from '@stencil/core';

@Component({
  shadow: true,
  styleUrl: 'footer-copyright.scss',
  tag: 'zane-footer-copyright',
})
export class FooterCopyright {
  @Prop() copyright: string;

  @Prop() copyrightHref: string;

  @Element() elm!: HTMLElement;

  @Prop() year = new Date().getFullYear();

  render() {
    return (
      <Host>
        <zane-text class={'legal'} expressive={true} type="legal">
          &copy; {this.year}&nbsp;
          <zane-link href={this.copyrightHref}>{this.copyright}</zane-link>. All
          Rights Reserved.
        </zane-text>
      </Host>
    );
  }
}
