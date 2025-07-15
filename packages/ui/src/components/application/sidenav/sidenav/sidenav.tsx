import { Component, ComponentInterface, Element, h, Prop } from '@stencil/core';

/**
 * @name1 Side Navigation
 * @description1 The side navigation component provides an easy way to navigate through your website / application.
 * @img1 /assets/img/sidenav.webp
 */
@Component({
  shadow: true,
  styleUrl: 'sidenav.scss',
  tag: 'zane-sidenav',
})
export class Sidenav implements ComponentInterface {
  @Element() elm!: HTMLElement;

  @Prop() showLoader: boolean = false;

  componentWillLoad() {}

  render() {
    return (
      <div class="sidenav">
        <slot />
      </div>
    );
  }
}
