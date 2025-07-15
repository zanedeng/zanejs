import { Component, ComponentInterface, Element, h, Host } from '@stencil/core';

/**
 * @name Breadcrumb
 * @description A breadcrumb is a secondary navigation scheme that reveals the user's location in a website or web application.
 * @category Navigation
 * @tags navigation
 * @example <zane-breadcrumb><zane-breadcrumb-item href="#">Home</zane-breadcrumb-item><zane-breadcrumb-item href="#" active>Page</zane-breadcrumb-item></zane-breadcrumb>
 */
@Component({
  shadow: true,
  styleUrl: 'breadcrumb.scss',
  tag: 'zane-breadcrumb',
})
export class Breadcrumb implements ComponentInterface {
  @Element() elm!: HTMLElement;

  componentWillLoad() {
    this.elm.querySelectorAll('zane-breadcrumb-item').forEach((item, i) => {
      item.position = `${i + 1}`;
    });
  }

  render() {
    return (
      <Host itemscope itemtype="http://schema.org/BreadcrumbList">
        <div class="breadcrumb">
          <slot />
        </div>
      </Host>
    );
  }
}
