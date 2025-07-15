import {
  Component,
  ComponentInterface,
  Element,
  h,
  Listen,
  Method,
  Prop,
  State,
  Watch,
} from '@stencil/core';

@Component({
  shadow: true,
  styleUrl: 'sidenav-menu.scss',
  tag: 'zane-sidenav-menu',
})
export class SidenavMenu implements ComponentInterface {
  @Element() elm!: HTMLElement;

  @Prop({ mutable: true }) empty: boolean = false;

  @Prop({ mutable: true }) emptyState: any = `{
    "headline": "No items",
    "description": "There are no items to display"
  }`;

  @State()
  internalEmptyState: { description: string; title: string };

  @Prop() showLoader: boolean = false;

  @Prop({ mutable: true }) value?: number | string;

  componentWillLoad() {
    this.parseEmptyState();
  }

  @Listen('keydown', { target: 'window' })
  handleKeyDown(evt: KeyboardEvent) {
    const path = evt.composedPath();
    let menuItem = null;
    for (const elm of path) {
      if ((elm as any).tagName === 'ZANE-MENU-ITEM') {
        menuItem = elm;
      }
      if (elm !== this.elm) continue;
      if (evt.key === 'ArrowDown') {
        evt.preventDefault();
        this.focusNextItem(menuItem);
      } else if (evt.key === 'ArrowUp') {
        evt.preventDefault();
        this.focusPreviousItem(menuItem);
      }
    }
  }

  @Watch('emptyState')
  parseEmptyState() {
    this.internalEmptyState = this.emptyState
      ? JSON.parse(this.emptyState)
      : this.emptyState;
  }

  render() {
    return (
      <div class="menu">
        <slot />
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

  private focusNextItem(currentItem) {
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
      nextItem = nextItem
        ? nextItem.nextElementSibling
        : this.elm.querySelector('zane-menu-item');
    } while (nextItem !== currentItem);
  }

  private focusPreviousItem(currentItem) {
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
        : this.elm.querySelector('zane-menu-item:last-child');
    } while (previousItem !== currentItem);
  }

  private getFirstItem() {
    return this.elm.querySelector('zane-menu-item');
  }

  private renderEmptyState() {
    if (this.empty)
      return (
        <zane-empty-state class="empty-menu">
          <div slot="title">{this.internalEmptyState.title}</div>
          <div slot="description">{this.internalEmptyState.description}</div>
        </zane-empty-state>
      );
  }
}
