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

// 将window声明为any类型以访问Prism等全局变量
const win = window as any;

/**
 * 本地化字符串配置对象
 */
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
 * 代码高亮组件
 * @Component 装饰器定义组件元数据
 * @shadow 启用Shadow DOM封装
 * @styleUrl 组件样式表路径
 * @tag 组件自定义标签名称
 */
@Component({
  shadow: true,
  styleUrl: 'code-highlighter.scss',
  tag: 'zane-code-highlighter',
})
export class CodeHighlighter implements ComponentInterface {
  /**
   * 编译后的高亮代码HTML字符串
   * @State 装饰器表示这是组件内部状态，变化会触发重新渲染
   */
  @State() compiledCode: string = null;

  /**
   * 复制按钮的状态
   * - `copied`: 表示代码已被复制
   * - `idle`: 表示默认状态，可进行复制操作
   * @State 装饰器表示这是组件内部状态
   */
  @State() copyState: 'copied' | 'idle' = 'idle';

  /**
   * 是否格式化代码
   * @Prop 装饰器表示这是组件的公开属性
   * @mutable 表示属性可变
   * @reflect 表示属性值会反映到DOM属性上
   */
  @Prop({ mutable: true, reflect: true }) format: boolean;

  /**
   * 组件唯一ID
   */
  gid: string = getComponentIndex();

  /**
   * 是否隐藏复制按钮
   * @Prop 默认值为false
   */
  @Prop() hideCopy: boolean = false;

  /**
   * 宿主元素引用
   * @Element 装饰器获取宿主元素
   */
  @Element() host!: HTMLElement;

  /**
   * 是否为内联模式（非块级显示）
   * @Prop 装饰器，reflect表示会反映到DOM属性上
   */
  @Prop({ reflect: true }) inline: boolean = false;

  /**
   * 代码语言类型
   * @Prop 装饰器，reflect表示会反映到DOM属性上
   * 默认值为'javascript'
   */
  @Prop({ reflect: true }) language: Language = 'javascript';

  /**
   * 是否显示行号
   * @Prop 装饰器，reflect表示会反映到DOM属性上
   */
  @Prop({ reflect: true }) lineNumbers: boolean = false;

  /**
   * 代码内容
   * @Prop 装饰器
   */
  @Prop() value: string = '';

  /**
   * 原始代码字符串
   */
  private codeString: string = '';

  /**
   * 处理后的代码字符串（格式化后）
   */
  private parsedCodeString: string = '';

  /**
   * 组件加载完成生命周期钩子
   * 初始化Prism高亮库
   */
  componentDidLoad() {
    this.initializePrism();
  }

  /**
   * 组件即将加载生命周期钩子
   * 初始化代码字符串
   */
  async componentWillLoad() {
    this.codeString = '';
    // 优先级：value属性 > code标签内容 > 宿主元素文本内容
    if (this.value) {
      this.codeString = this.value;
    } else if (this.host.querySelector('code')) {
      this.codeString = this.host.querySelector('code').innerHTML;
    } else if (this.host.hasChildNodes()) {
      this.codeString = this.host.innerText;
    }

    // 如果未设置format属性，则根据inline模式自动决定
    if (this.format === undefined) {
      this.format = !this.inline;
    }

    this.codeString = this.decode(this.codeString);
  }

  /**
   * HTML实体解码
   * @param str 需要解码的字符串
   * @returns 解码后的字符串
   */
  decode(str: string) {
    return str.replaceAll('&lt;', '<').replaceAll('&gt;', '>');
  }

  /**
   * 初始化Prism高亮库
   * 如果Prism未加载则先加载
   * 如果元素不在可视区域则延迟初始化
   */
  async initializePrism() {
    if (!win.Prism) {
      await loadPrism();
    }

    // 如果元素不在可视区域内，延迟初始化
    if (!isInViewport(this.host)) {
      setTimeout(() => this.initializePrism(), 300);
      return;
    }

    const Prism = win.Prism;
    const autoloader = Prism.plugins.autoloader;
    if (autoloader) {
      // 如果需要自动加载语言，则先加载指定语言
      await loadPrismLanguage(this.language);
      this.#renderPrism();
    } else {
      this.#renderPrism();
    }
  }

  /**
   * 监听language属性变化
   * 当语言变化时重新渲染高亮代码
   */
  @Watch('language')
  languageWatcher() {
    this.#renderPrism();
  }

  /**
   * 渲染组件
   * @returns 组件虚拟 DOM
   */
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

  /**
   * 监听 `lineNumbers` 属性变化
   * 当行号显示设置变化时重新渲染高亮代码
   */
  @Watch('lineNumbers')
  themeWatcher() {
    this.#renderPrism();
  }

  /**
   * 监听 `value` 属性变化
   * 当代码内容变化时重新渲染高亮代码
   */
  @Watch('value')
  valueWatcher() {
    if (this.value) {
      this.codeString = this.value;
    }
    this.#renderPrism();
  }

  /**
   * 处理复制按钮点击事件
   * 使用textarea元素和execCommand API实现复制到剪贴板
   */
  async #handleCopyClick() {
    const textToCopy = this.parsedCodeString;
    const textArea = document.createElement('textarea');
    textArea.value = textToCopy;

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

    // 更新复制状态，3秒后恢复
    setTimeout(() => {
      this.copyState = 'idle';
    }, 3000);
  }

  /**
   * 使用Prism高亮代码
   * 根据lineNumbers属性决定是否添加行号
   */
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

  /**
   * 渲染高亮代码容器
   * 根据inline属性决定使用div还是pre元素
   * @returns 高亮代码容器的虚拟DOM
   */
  #renderHighlighter() {
    return this.inline ? (
      <div class="highlighter" innerHTML={this.compiledCode} />
    ) : (
      <pre class="highlighter line-numbers" innerHTML={this.compiledCode} />
    );
  }

  /**
   * 渲染Prism高亮代码
   * 根据language属性决定是否格式化代码
   * 支持的语言: javascript, html, css
   */
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
      // 其他语言不格式化，直接高亮
      this.parsedCodeString = this.codeString;
      this.#populateCode();
    }
  }
}
