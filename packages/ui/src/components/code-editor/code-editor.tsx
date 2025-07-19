import type { InputComponentInterface } from '../../interfaces';

import {
  Component,
  ComponentInterface,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Method,
  Prop,
  State,
  Watch,
} from '@stencil/core';

import loadMonaco from '../../3d-party/monaco';
import {
  debounceEvent,
  getComponentIndex,
  isDarkMode,
  isInViewport,
  observeThemeChange,
} from '../../utils';

const win = window as any;

/**
 * 基于Monaco Editor的代码编辑器组件
 *
 * 提供语法高亮、智能提示等专业编辑功能，支持暗黑/亮色主题切换，
 * 内置防抖机制优化高频变更事件，适用于代码片段展示和实时编辑场景。
 *
 * @example
 * ```html
 * <zane-code-editor
 *   language="javascript"
 *   minimap
 *   debounce="500"
 *   value="console.log('Hello  World')"
 * ></zane-code-editor>
 * ```
 */
@Component({
  shadow: true,
  styleUrl: 'code-editor.scss',
  tag: 'zane-code-editor',
})
export class CodeEditor implements ComponentInterface, InputComponentInterface {

  /**
   * 变更事件防抖时间（毫秒）
   *
   * 避免高频输入时频繁触发变更事件，
   * 设置为0可禁用防抖
   *
   * @defaultValue `250`
   */
  @Prop() debounce = 250;

  /**
   * 禁用状态
   *
   * 禁用时编辑器不可编辑但可滚动查看内容
   *
   * @defaultValue `false`
   */
  @Prop({ reflect: true }) disabled: boolean = false;

  /** Monaco编辑器实例引用 */
  @State() editorMonacoInstance: any;

  /** 宿主元素实例 */
  @Element() elm!: HTMLElement;

  /** 组件唯一ID（自动生成） */
  gid: string = getComponentIndex();

  /** 焦点状态 */
  @State() hasFocus = false;

  /** 当前是否为暗黑模式 */
  @State() isDarkMode: boolean = isDarkMode();

  /**
   * 编程语言支持
   *
   * 支持的语法类型：
   * - `html`: HTML/XML标记语言
   * - `javascript`: JavaScript/TypeScript
   * - `json`: JSON数据格式
   *
   * @defaultValue `'javascript'`
   */
  @Prop() language: 'html' | 'javascript' | 'json' = 'javascript';

  /**
   * 类型声明库源码
   *
   * 用于提供智能提示的类型定义，
   * 格式应为对应语言的类型声明字符串
   */
  @Prop() libSource: any;

  /**
   * 行号显示控制
   *
   * - `on`: 显示行号
   * - `off`: 隐藏行号
   *
   * @defaultValue `'on'`
   */
  @Prop() lineNumbers: 'off' | 'on' = 'on';

  /**
   * 缩略图显示
   *
   * 在编辑器右侧显示代码导航缩略图
   *
   * @defaultValue `false`
   */
  @Prop() minimap: boolean = false;

  /** 表单字段名（自动生成） */
  @Prop() name: string = `zane-input-${this.gid}`;

  /**
   * 只读模式
   *
   * 开启后禁止编辑但保留代码高亮
   *
   * @defaultValue `false`
   */
  @Prop({ reflect: true }) readonly: boolean = false;

  /**
   * 必填状态
   *
   * @defaultValue `false`
   */
  @Prop({ reflect: true }) required: boolean = false;

  /**
   * 编辑器内容
   *
   * 双向绑定的代码文本值
   */
  @Prop({ mutable: true }) value: string;

  /** 内容变更事件（带防抖） */
  @Event({ eventName: 'zane-code-editor--change' }) zaneChange: EventEmitter;

  /** Monaco容器元素引用 */
  private editorElement?: HTMLElement;

  /** 组件加载完成生命周期 */
  componentDidLoad() {
    this.initializeMonaco(); // 初始化Monaco编辑器
  }

  /** 组件加载前生命周期 */
  componentWillLoad() {
    this.debounceChanged(); // 初始化防抖设置
    observeThemeChange(() => {
      this.isDarkMode = isDarkMode();
      this.themeWatcher();
    });
  }

  /**
   * 禁用状态监听
   * @param newValue 新的禁用状态值
   */
  @Watch('disabled')
  disabledWatcher(newValue: boolean) {
    this.editorMonacoInstance.updateOptions({
      readOnly: newValue || this.readonly,
    });
  }

  /**
   * 获取组件ID
   * @returns 组件唯一标识符
   */
  @Method()
  async getComponentId() {
    return this.gid;
  }

  /**
   * 获取当前主题
   * @returns 'vs-dark'或'vs'主题标识
   */
  getTheme() {
    return this.isDarkMode ? 'vs-dark' : 'vs';
  }

  /** 初始化Monaco编辑器 */
  async initializeMonaco() {
    // 确保Monaco加载完成
    if (!win.monaco) {
      await loadMonaco();
    }

    // 延迟初始化（组件不在可视区域时）
    if (!isInViewport(this.elm)) {
      setTimeout(() => this.initializeMonaco(), 300);
      return;
    }

    // 创建编辑器实例
    this.editorElement.innerHTML = '';

    this.editorMonacoInstance = win.monaco.editor.create(this.editorElement, {
      language: this.language,
      lineNumbers: this.lineNumbers,
      minimap: {
        enabled: this.minimap,
      },
      readOnly: this.disabled || this.readonly,
      theme: this.getTheme(),
      value: this.value,
    });

    // 加载类型声明库
    if (this.libSource) {
      win.monaco.editor.createModel(
        this.libSource,
        this.language,
        'java://zaneui.com/lib.java',
      );
    }

    // 内容变更事件监听
    this.editorMonacoInstance.onDidChangeModelContent((e) => {
      if (!e.isFlush) {
        this.value = this.editorMonacoInstance.getValue();
        this.zaneChange.emit({ value: this.value });
      }
    });

    // 焦点状态监听
    this.editorMonacoInstance.onDidFocusEditorText(() => {
      this.hasFocus = true;
    });

    this.editorMonacoInstance.onDidBlurEditorText(() => {
      this.hasFocus = false;
    });
  }

  /**
   * 编程语言切换监听
   * @param newValue 新的语言类型
   */
  @Watch('language')
  languageWatcher(newValue: string) {
    win.monaco.editor.setModelLanguage(
      this.editorMonacoInstance.getModel(),
      newValue,
    );
  }

  /**
   * 只读状态监听
   * @param newValue 新的只读状态
   */
  @Watch('readonly')
  readonlyWatcher(newValue: string) {
    this.editorMonacoInstance.updateOptions({
      readOnly: newValue || this.disabled,
    });
  }

  /** 渲染函数 */
  render() {
    return (
      <Host>
        <div
          class={{
            'code-editor-component': true,
            component: true,
            disabled: this.disabled,
            'has-focus': this.hasFocus,
            readonly: this.readonly,
            [this.getTheme()]: true,
          }}
        >
          {this.disabled || this.readonly ? (
            <zane-tag class="read-only-tag" color="red">
              Read Only
            </zane-tag>
          ) : null}

          <div class="editor" ref={(el) => (this.editorElement = el)} />
          {!this.editorMonacoInstance && (
            <div class="code-editor-loader">
              <zane-spinner />
              Loading editor...
            </div>
          )}
        </div>
      </Host>
    );
  }

  /**
   * 移除编辑器焦点
   */
  @Method()
  async setBlur() {
    if (this.editorMonacoInstance) {
      this.editorMonacoInstance.blur();
    }
  }

  /**
   * 设置编辑器焦点
   */
  @Method()
  async setFocus() {
    if (this.editorMonacoInstance) {
      this.editorMonacoInstance.focus();
    }
  }

  /** 主题切换同步 */
  themeWatcher() {
    win.monaco.editor.setTheme(this.getTheme());
  }

  /**
   * 外部值变更监听
   * @param newValue 新的代码值
   */
  @Watch('value')
  valueWatcher(newValue: string) {
    if (
      this.editorMonacoInstance &&
      this.editorMonacoInstance.getValue() !== this.value
    ) {
      this.editorMonacoInstance.setValue(newValue);
    }
  }

  /** 防抖配置变更处理 */
  @Watch('debounce')
  protected debounceChanged() {
    this.zaneChange = debounceEvent(this.zaneChange, this.debounce);
  }

  /** 类型声明库变更处理 */
  @Watch('libSource')
  protected libSourceChanged() {
    if (win.monaco) {
      // 清理旧类型声明
      const libModel = win.monaco.editor.getModel('java://zaneui.com/lib.java');
      if (libModel) {
        libModel.dispose();
      }

      // 加载新类型声明
      win.monaco.editor.createModel(
        this.libSource,
        this.language,
        'java://zaneui.com/lib.java',
      );
    }
  }
}
