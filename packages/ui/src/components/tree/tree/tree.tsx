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

/**
 * @name Tree
 * @description A tree view is a hierarchical structure that provides nested levels of navigation.
 * @category Navigation
 * @subcategory Tree View
 * @img /assets/img/tree-view.webp
 * @imgDark /assets/img/tree-view-dark.webp
 */
@Component({
  shadow: true,
  styleUrl: 'tree.scss',
  tag: 'zane-tree',
})
export class Tree implements ComponentInterface {
  @Element() elm!: HTMLElement;

  @Prop({ mutable: true }) empty: boolean = false;

  @Prop({ mutable: true }) emptyState: string = `{
    "headline": "No items",
    "description": "There are no items to display"
  }`;

  @State()
  internalEmptyState: any;

  @Prop({ mutable: true })
  selectedNode: string;

  subscribers: any[] = [];

  componentWillLoad() {
    this.parseEmptyState();
  }

  @Method()
  async getSelectedNode() {
    return this.selectedNode;
  }

  @Listen('keydown', { target: 'window' })
  handleKeyDown(evt: KeyboardEvent) {
    const path = evt.composedPath();
    let menuItem = null;
    for (const elm of path) {
      if ((elm as any).tagName === 'ZANE-TREE-NODE') {
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
    this.internalEmptyState =
      typeof this.emptyState === 'string'
        ? JSON.parse(this.emptyState)
        : this.emptyState;
  }

  render() {
    return this.empty ? (
      <div class="tree-view">{this.renderEmptyState()}</div>
    ) : (
      <div class="tree-view">
        <slot></slot>
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
    (firstMenuItem as any)?.setFocus();
  }

  @Method()
  async subscribeToSelect(cb) {
    this.subscribers.push(cb);
  }

  @Listen('zane-tree-node--click')
  treeNodeClick(evt: CustomEvent<any>) {
    this.selectedNode = evt.detail.value;
    this.subscribers.forEach((cb) => cb(evt.detail.value));
  }

  private focusNextItem(currentItem) {
    let nextItem: any = currentItem.nextElementSibling;
    do {
      if (
        nextItem &&
        nextItem.tagName === 'ZANE-TREE-NODE' &&
        !nextItem.disabled
      ) {
        nextItem.setFocus();
        return;
      }
      nextItem = nextItem
        ? nextItem.nextElementSibling
        : this.elm.querySelector('zane-tree-node:first-child');
    } while (nextItem !== currentItem);
  }

  private focusPreviousItem(currentItem) {
    let previousItem: any = currentItem.previousElementSibling;
    do {
      if (
        previousItem &&
        previousItem.tagName === 'ZANE-TREE-NODE' &&
        !previousItem.disabled
      ) {
        previousItem.setFocus();
        return;
      }
      previousItem = previousItem
        ? previousItem.previousElementSibling
        : this.elm.querySelector('zane-tree-node:last-child');
    } while (previousItem !== currentItem);
  }

  private getFirstItem() {
    return this.elm.querySelector('zane-menu-item');
  }

  private renderEmptyState() {
    if (this.empty)
      return (
        <zane-empty-state class="empty-menu" {...this.internalEmptyState} />
      );
  }
}
