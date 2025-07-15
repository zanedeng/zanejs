import { Component, Element, h, Host, Prop } from '@stencil/core';

@Component({
  shadow: true,
  styleUrl: 'footer-links.scss',
  tag: 'zane-footer-links',
})
export class FooterLinks {
  @Element() elm!: HTMLElement;

  @Prop() links: { href: string; name: string }[] = [];

  getLinks() {
    if (typeof this.links === 'string') return JSON.parse(this.links);
    return this.links;
  }

  render() {
    return (
      <Host>
        <ul class={'nav-links'}>
          {this.getLinks().map((link) => {
            return (
              <li>
                <zane-link class={'no-style link'} href={link.href}>
                  {link.name}
                </zane-link>
              </li>
            );
          })}
        </ul>
      </Host>
    );
  }
}
