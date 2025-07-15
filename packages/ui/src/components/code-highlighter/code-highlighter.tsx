import {
  Component,
  ComponentInterface,
  Element,
  Fragment,
  h,
  Host,
  Prop,
  State,
  Watch,
} from '@stencil/core';
import * as beautify from 'js-beautify/js';

import { loadPrism, loadPrismLanguage } from '../../3d-party/prism';
import { Language } from '../../constants';
import { getComponentIndex, isInViewport } from '../../utils';

const win = window as any;

const locale: {
  copied: string;
  copiedCode: string;
  copyToClipboard: string;
  loading: string;
} = {
  copied: 'Copied',
  copiedCode: 'Copied code',
  copyToClipboard: 'Copy to clipboard',
  loading: 'Loading code...',
};

/**
 * @name Code Highlighter
 * @description A browser based code highlighter.
 * @category Data Display
 * @tag display, code
 * @img /assets/img/code-highlighter.webp
 * @imgDark /assets/img/code-highlighter-dark.webp
 */
@Component({
  shadow: true,
  styleUrl: 'code-highlighter.scss',
  tag: 'zane-code-highlighter',
})
export class CodeHighlighter implements ComponentInterface {
  @State() compiledCode: string = null;

  @State() copyState: 'copied' | 'idle' = 'idle';

  /**
   * Format the code snippet.
   */
  @Prop({ mutable: true, reflect: true }) format: boolean;

  gid: string = getComponentIndex();

  /**
   * Hide the copy button.
   */
  @Prop() hideCopy: boolean = false;

  @Element() host!: HTMLElement;

  /**
   * Display the code snippet inline.
   */
  @Prop({ reflect: true }) inline: boolean = false;

  /**
   * The language of the code snippet.
   */
  @Prop({ reflect: true }) language: Language = 'javascript';

  /**
   * Display line numbers.
   */
  @Prop({ reflect: true }) lineNumbers: boolean = false;
  /**
   * The code snippet to highlight.
   */
  @Prop() value: string = '';

  private codeString: string = '';
  private parsedCodeString: string = '';

  componentDidLoad() {
    this.initializePrism();
  }

  async componentWillLoad() {
    this.codeString = '';
    if (this.value) {
      this.codeString = this.value;
    } else if (this.host.querySelector('code')) {
      this.codeString = this.host.querySelector('code').innerHTML;
    } else if (this.host.hasChildNodes()) {
      this.codeString = this.host.innerText;
    }

    if (this.format === undefined) {
      this.format = !this.inline;
    }

    this.codeString = this.decode(this.codeString);
  }

  decode(str: string) {
    return str.replaceAll('&lt;', '<').replaceAll('&gt;', '>');
  }

  async initializePrism() {
    if (!win.Prism) {
      await loadPrism();
    }

    if (!isInViewport(this.host)) {
      setTimeout(() => this.initializePrism(), 300);
      return;
    }

    const Prism = win.Prism;
    const autoloader = Prism.plugins.autoloader;
    if (autoloader) {
      await loadPrismLanguage(this.language);
      this.#renderPrism();
    } else {
      this.#renderPrism();
    }
  }

  @Watch('language')
  languageWatcher() {
    this.#renderPrism();
  }

  render() {
    return (
      <Host>
        {this.compiledCode !== null && (
          <div
            class="code-highlighter"
            on-click={async () => {
              if (this.inline) await this.#handleCopyClick();
            }}
          >
            <div class="scroll-wrapper">
              <div
                class={{
                  'line-numbers': this.lineNumbers,
                  'line-numbers-wrapper': true,
                }}
              >
                {this.#renderHighlighter()}
              </div>
            </div>
            {!this.hideCopy && this.copyState === 'idle' && !this.inline && (
              <Fragment>
                <zane-tooltip
                  class={'copy-btn'}
                  content={locale.copyToClipboard}
                >
                  <zane-button
                    aria-label="Copy to clipboard"
                    class="icon-only"
                    color={'secondary'}
                    icon={'copy'}
                    onZane-button--click={async () => {
                      await this.#handleCopyClick();
                    }}
                    size="sm"
                    variant={'ghost'}
                  ></zane-button>
                </zane-tooltip>
              </Fragment>
            )}
            {!this.hideCopy && this.copyState === 'copied' && !this.inline && (
              <div>
                <zane-button
                  aria-label={locale.copiedCode}
                  class="copy-btn icon-only test"
                  color={'success'}
                  icon={'checkmark'}
                  size="sm"
                  title={locale.copiedCode}
                  variant={'default'}
                >
                  {locale.copied}
                </zane-button>
              </div>
            )}
          </div>
        )}
        {this.compiledCode === null && (
          <div class="code-loader">
            <zane-spinner>{locale.loading}</zane-spinner>
          </div>
        )}
      </Host>
    );
  }

  @Watch('lineNumbers')
  themeWatcher() {
    this.#renderPrism();
  }

  @Watch('value')
  valueWatcher() {
    if (this.value) {
      this.codeString = this.value;
    }
    this.#renderPrism();
  }

  async #handleCopyClick() {
    const textToCopy = this.parsedCodeString;
    // Navigator clipboard api needs a secure context (https)
    // Use the 'out of viewport hidden text area' trick
    const textArea = document.createElement('textarea');
    textArea.value = textToCopy;

    // Move textarea out of the viewport so it's not visible
    textArea.style.position = 'absolute';
    textArea.style.left = '-999999px';

    document.body.prepend(textArea);
    textArea.select();

    try {
      document.execCommand('copy');
    } catch (error) {
      console.error(error);
    } finally {
      textArea.remove();
    }

    this.copyState = 'copied';

    setTimeout(() => {
      this.copyState = 'idle';
    }, 3000);
  }

  #populateCode() {
    const Prism = win.Prism;
    const formatted = Prism.highlight(
      this.parsedCodeString,
      Prism.languages[this.language],
      this.language,
    );
    let lineNumbersWrapper = '';
    if (this.lineNumbers) {
      const linesNum = formatted.split('\n').length;
      const lines = Array.from({ length: linesNum + 1 }).join('<span></span>');
      lineNumbersWrapper = `<span aria-hidden='true' class='line-numbers-rows'>${lines}</span>`;
    }
    this.compiledCode = formatted + lineNumbersWrapper;
  }

  #renderHighlighter() {
    return this.inline ? (
      <div class="highlighter" innerHTML={this.compiledCode} />
    ) : (
      <pre class="highlighter line-numbers" innerHTML={this.compiledCode} />
    );
  }

  #renderPrism() {
    if (
      (this.format && this.language === 'javascript') ||
      this.language === 'html' ||
      this.language === 'css'
    ) {
      switch (this.language) {
        case 'css': {
          this.parsedCodeString = beautify.css(this.codeString, {
            wrap_line_length: 120,
          });
          break;
        }
        case 'html': {
          this.parsedCodeString = beautify.html(this.codeString, {
            wrap_line_length: 120,
          });
          break;
        }
        case 'javascript': {
          this.parsedCodeString = beautify.js(this.codeString, {
            wrap_line_length: 120,
          });
          break;
        }
      }
      this.#populateCode();
    } else {
      this.parsedCodeString = this.codeString;
      this.#populateCode();
    }
  }
}
