import {
  Component,
  ComponentInterface,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Listen,
  Method,
  Prop,
} from '@stencil/core';

import PopoverController from '../../popover/popover/popover-controller';

/**
 * @name Dropdown
 * @description Enables native inputs to be used within a Form field.
 * @category Navigation
 * @subcategory Dropdown
 * @img /assets/img/dropdown.webp
 * @imgDark /assets/img/dropdown-dark.webp
 */
@Component({
  shadow: true,
  styleUrl: 'dropdown.scss',
  tag: 'zane-dropdown',
})
export class Dropdown implements ComponentInterface {
  /**
   * Emitted when the dropdown is closed.
   */
  @Event({ eventName: 'zane-dropdown--close' }) closeEvent: EventEmitter;

  /**
   * If true, the user cannot interact with the button. Defaults to `false`.
   */
  @Prop() disabled: boolean = false;
  @Element() host!: HTMLElement;
  @Prop({ reflect: true }) managed: boolean = false;
  menuRef: HTMLZaneDropdownMenuElement;

  @Prop({ mutable: true, reflect: true }) open: boolean = false;

  /**
   * Emitted when the dropdown is opened.
   */
  @Event({ eventName: 'zane-dropdown--open' }) openEvent: EventEmitter;

  @Prop({ reflect: true }) placements: string =
    'bottom-start,top-start,bottom-end,top-end';

  popoverController: PopoverController;

  slotRef: HTMLSlotElement;

  @Prop({ reflect: true }) trigger: 'click' | 'hover' | 'manual' = 'click';

  triggerRef: HTMLElement | HTMLZaneButtonElement;

  @Event({ eventName: 'zane-dropdown--item-click' })
  zaneDropdownItemClick: EventEmitter;

  componentDidLoad() {
    const contentRef = this.host.querySelector('zane-dropdown-menu');

    if (!contentRef) {
      throw new Error(
        'zane-dropdown: The dropdown component must have a zane-dropdown-menu child component',
      );
    }

    this.menuRef = contentRef;

    this.popoverController = new PopoverController(
      this.host,
      this.trigger,
      this.open,
      contentRef,
      0,
      0,
      this.showPopover,
      this.hidePopover,
      this.placements,
    );

    this.triggerRef = this.slotRef.assignedElements()[0] as HTMLElement;
    if (this.triggerRef.nodeName === 'SLOT') {
      const assignedElements = (
        this.triggerRef as HTMLSlotElement
      ).assignedElements();
      if (assignedElements.length > 0) {
        this.triggerRef = assignedElements[0] as HTMLSlotElement;
      }
    }

    this.popoverController.registerTarget(this.triggerRef);
    this.popoverController.setTriggerRef(this.triggerRef);

    this.host.addEventListener('zane-menu-item--click', (evt: CustomEvent) => {
      this.zaneDropdownItemClick.emit(evt.detail);
      this.setFocusOnTrigger();
      this.popoverController.hidePopover();
    });

    this.host.addEventListener('keydown', (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        this.popoverController.hidePopover();
      }
    });
  }

  componentDidUpdate() {
    this.popoverController.setOpen(this.open);
    if (this.open) {
      this.popoverController.computePositionThrottle('onUpdate');
    }
  }

  disconnectedCallback() {
    this.popoverController.destroy();
  }

  hidePopover = () => {
    this.open = false;
    this.closeEvent.emit();
  };

  render() {
    return (
      <Host>
        <div
          class={{
            dropdown: true,
            open: this.open,
          }}
        >
          <slot ref={(el) => (this.slotRef = el as HTMLSlotElement)} />
        </div>
      </Host>
    );
  }

  @Listen('resize', { target: 'window' })
  resizeHandler() {
    this.popoverController.computePositionThrottle('resize');
  }

  @Method()
  async setFocus() {
    this.setFocusOnTrigger();
  }

  setFocusOnTrigger() {
    (this.triggerRef as HTMLZaneButtonElement).setFocus
      ? (this.triggerRef as HTMLZaneButtonElement).setFocus()
      : this.triggerRef.focus();
  }

  showPopover = () => {
    this.open = true;
    setTimeout(() => {
      this.menuRef.setFocus();
      this.openEvent.emit();
    });
  };

  @Listen('click', { target: 'window' })
  windowClickHandler(evt) {
    this.popoverController.windowClickHandler(evt);
  }
}
