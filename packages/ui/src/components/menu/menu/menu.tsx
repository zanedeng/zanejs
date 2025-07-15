import {
  Component,
  ComponentInterface,
  Element,
  h,
  Listen,
  Method,
  Prop,
} from '@stencil/core';

/**
 * @name Menu
 * @description Menus display a list of choices on temporary surfaces.
 * @category Navigation
 * @subcategory Menu
 * @img /assets/img/menu.webp
 * @imgDark /assets/img/menu-dark.webp
 */
@Component({
  shadow: true,
  styleUrl: 'menu.scss',
  tag: 'zane-menu',
})
export class Menu implements ComponentInterface {
  @Prop({ mutable: true }) empty: boolean = false;

  @Prop({ mutable: true }) emptyStateDescription: string =
    'There are no items to display';

  @Prop({ mutable: true }) emptyStateHeadline: string = 'No items';

  @Element() host!: HTMLElement;

  @Prop({ reflect: true }) layer?: '01' | '02' | 'background';

  @Prop() showLoader: boolean = false;

  /**
   * The menu item size.
   * Possible values are: `"sm"`, `"md"`, `"lg"`. Defaults to `"md"`.
   */
  @Prop({ reflect: true }) size: 'lg' | 'md' | 'sm' = 'md';

  @Prop({ mutable: true }) value?: number | string;

  focusNextItem(currentItem: HTMLElement) {
    let nextItem: any = currentItem.nextElementSibling;
    do {
      if (
        nextItem &&
        nextItem.tagName === 'ZANE-MENU-ITEM' &&
        !nextItem.disabled
      ) {
        nextItem.setFocus();
        return;
      }
      nextItem = nextItem ? nextItem.nextElementSibling : this.getFirstItem();
    } while (nextItem !== currentItem);
  }

  getFirstItem() {
    let firstItem: any = this.host.querySelector('zane-menu-item');
    if (
      !firstItem &&
      this.host.childNodes.length > 0 &&
      this.host.childNodes[0].nodeName === 'SLOT'
    ) {
      const assignedElements = (
        this.host.childNodes[0] as HTMLSlotElement
      ).assignedElements();
      for (const assignedElement of assignedElements) {
        const item = assignedElement as HTMLElement;
        if (item.tagName === 'ZANE-MENU-ITEM') {
          firstItem = item;
          break;
        }
      }

      if (!firstItem) {
        throw new Error('zane-menu: No menu items found');
      }
    }
    return firstItem;
  }

  getLastItem() {
    let lastItem: any = this.host.querySelector('zane-menu-item:last-child');
    if (
      !lastItem &&
      this.host.childNodes.length > 0 &&
      this.host.childNodes[0].nodeName === 'SLOT'
    ) {
      const assignedElements = (
        this.host.childNodes[0] as HTMLSlotElement
      ).assignedElements();
      for (let i = assignedElements.length - 1; i >= 0; i--) {
        const item = assignedElements[i] as HTMLElement;
        if (item.tagName === 'ZANE-MENU-ITEM') {
          lastItem = item;
          break;
        }
      }

      if (!lastItem) {
        throw new Error('zane-menu: No menu items found');
      }
    }
    return lastItem;
  }

  @Listen('keydown', { target: 'window' })
  handleKeyDown(evt: KeyboardEvent) {
    const path = evt.composedPath();
    let menuItem = null;
    for (const elm of path) {
      if ((elm as any).tagName === 'ZANE-MENU-ITEM') {
        menuItem = elm;
      }
      if (elm !== this.host) continue;
      if (evt.key === 'ArrowDown') {
        evt.preventDefault();
        this.focusNextItem(menuItem);
      } else if (evt.key === 'ArrowUp') {
        evt.preventDefault();
        this.focusPreviousItem(menuItem);
      }
    }
  }

  render() {
    return (
      <div class="menu">
        <div class="slot-container">
          <slot />
        </div>

        {this.renderEmptyState()}
      </div>
    );
  }

  /**
   * Sets focus on first menu item. Use this method instead of the global
   * `element.focus()`.
   */
  @Method()
  async setFocus() {
    const firstMenuItem = this.getFirstItem();
    firstMenuItem?.setFocus();
  }

  private focusPreviousItem(currentItem: HTMLElement) {
    let previousItem: any = currentItem.previousElementSibling;
    do {
      if (
        previousItem &&
        previousItem.tagName === 'ZANE-MENU-ITEM' &&
        !previousItem.disabled
      ) {
        previousItem.setFocus();
        return;
      }
      previousItem = previousItem
        ? previousItem.previousElementSibling
        : this.getLastItem();
    } while (previousItem !== currentItem);
  }

  private renderEmptyState() {
    if (this.empty)
      return (
        <zane-empty-state
          class="empty-menu"
          description={this.emptyStateDescription}
          headline={this.emptyStateHeadline}
        />
      );
  }
}
