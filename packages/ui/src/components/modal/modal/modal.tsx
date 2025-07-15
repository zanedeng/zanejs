import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Prop,
  Watch,
} from '@stencil/core';

/**
 * @name Modal
 * @description  Modals are used to display content in a layer above the app.
 * @category Informational
 * @subcategory Modal
 * @tags controls
 * @img /assets/img/modal.webp
 * @imgDark /assets/img/modal-dark.webp
 */
@Component({
  shadow: true,
  styleUrl: 'modal.scss',
  tag: 'zane-modal',
})
export class Modal {
  @Element() elm!: HTMLElement;

  /*
   * Specify the content of the modal heading.
   */
  @Prop({ reflect: true }) heading: string;

  @Prop({ reflect: true }) hideClose: boolean = false;

  /**
   * Specify whether the Modal is managed by the parent component
   */
  @Prop() managed: boolean = false;

  /**
   * Specify whether the Modal is currently open
   */
  @Prop({ reflect: true }) open: boolean = false;

  @Prop({ reflect: true }) showLoader: boolean = false;

  @Prop({ reflect: true }) size: 'lg' | 'md' | 'sm' = 'md';

  /*
   * Specify the content of the modal subheading.
   */
  @Prop({ reflect: true }) subheading: string;

  /**
   * On click of button, a CustomEvent 'zane-modal--close' will be triggered.
   */
  @Event({ eventName: 'zane-modal--close' }) zaneModalClose: EventEmitter;

  closeModal() {
    if (!this.managed) {
      this.open = false;
    }
    this.zaneModalClose.emit();
  }

  render() {
    if (this.open)
      return (
        <Host>
          <div
            aria-labelledby="modal-heading"
            aria-modal="true"
            class="modal-container"
            role="dialog"
          >
            <div class="modal-overlay" />
            <div
              class="modal--wrapper"
              onClick={(event) => {
                if (
                  (event.target as HTMLElement).classList.contains(
                    'modal--wrapper',
                  )
                )
                  this.closeModal();
              }}
            >
              <div
                class={{
                  [`size-${this.size}`]: true,
                  modal: true,
                  'show-loader': this.showLoader,
                }}
              >
                <div class="modal-body">
                  <div class="modal-header">
                    <div class="modal-heading-section">
                      {this.subheading && (
                        <zane-text
                          class="modal-subheading"
                          color="secondary"
                          type="label"
                        >
                          {this.subheading}
                        </zane-text>
                      )}

                      {this.heading && (
                        <zane-text
                          class="modal-heading"
                          heading-size="3"
                          type="heading"
                        >
                          {this.heading}
                        </zane-text>
                      )}
                    </div>
                    <div class="action-container">
                      {!this.hideClose && (
                        <zane-button
                          class="close-icon cancel-button"
                          color="black"
                          darkModeColor="white"
                          icon="close--large"
                          onZane-button--click={() => {
                            this.closeModal();
                          }}
                          title="Close"
                          variant="ghost"
                        ></zane-button>
                      )}
                    </div>
                  </div>

                  <div class="modal__content">
                    <slot />
                  </div>

                  {this.showLoader && (
                    <div class="modal__loading">
                      <div class="modal__loading-background"></div>
                      <zane-spinner size="2rem"></zane-spinner>
                    </div>
                  )}
                </div>

                <div class="modal__footer">
                  <slot name="footer"></slot>
                </div>
              </div>
            </div>
          </div>
        </Host>
      );
  }

  @Watch('open')
  watchHandler(newValue: boolean) {
    document.body.style.overflow = newValue ? 'hidden' : 'visible';
  }
}
