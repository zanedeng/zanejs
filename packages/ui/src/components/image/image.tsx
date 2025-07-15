import { Component, h, Host, Prop, State } from '@stencil/core';

import { isDarkMode, observeThemeChange } from '../../utils';

@Component({
  shadow: true,
  styleUrl: 'image.scss',
  tag: 'zane-image',
})
export class Image {
  @Prop({ reflect: true }) darkSrc: string;

  @Prop() imageTitle: string;

  @State() isDarkMode: boolean = isDarkMode();

  @Prop({ reflect: true }) src: string;

  componentWillLoad() {
    observeThemeChange(() => {
      this.isDarkMode = isDarkMode();
    });
  }

  render() {
    return this.isDarkMode && this.darkSrc ? (
      <Host>
        <img alt={this.imageTitle} src={this.darkSrc} />
      </Host>
    ) : (
      <Host>
        <img alt={this.imageTitle} src={this.src} />
      </Host>
    );
  }
}
