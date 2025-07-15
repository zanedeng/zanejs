import { Component, ComponentInterface, h, Host, Prop } from '@stencil/core';

@Component({
  shadow: true,
  styleUrl: 'breadcrumb-item.scss',
  tag: 'zane-breadcrumb-item',
})
export class BreadcrumbItem implements ComponentInterface {
  @Prop({ reflect: true }) active: boolean = false;

  /**
   * Hyperlink to navigate to on click.
   */
  @Prop({ reflect: true }) href: string;

  @Prop({ reflect: true }) position: string;

  /**
   * Sets or retrieves the window or frame at which to target content.
   */
  @Prop() target: string;

  render() {
    return (
      <Host
        itemprop="itemListElement"
        itemscope
        itemtype="http://schema.org/ListItem"
      >
        {this.active ? (
          <zane-text expressive={false} inline={true} type="body-compact">
            <span itemProp="name">
              <slot />
            </span>
            <meta content={this.position} itemProp="position" />
          </zane-text>
        ) : (
          <zane-text expressive={false} inline={true} type="body-compact">
            <zane-link href={this.href} itemprop="item" target={this.target}>
              <span itemProp="name">
                <slot />
              </span>
              <meta content={this.position} itemProp="position" />
            </zane-link>
          </zane-text>
        )}
      </Host>
    );
  }
}
