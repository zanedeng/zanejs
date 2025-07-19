import {
  Component,
  ComponentInterface,
  Element,
  h,
  Host,
  Prop,
} from '@stencil/core';

/**
 * 表单控件容器组件
 * @Component 装饰器定义组件元数据
 * @shadow 启用Shadow DOM封装
 * @styleUrl 组件样式表路径
 * @tag 组件自定义标签名称
 */
@Component({
  shadow: true,
  styleUrl: 'form-control.scss',
  tag: 'zane-form-control',
})
export class FormControl implements ComponentInterface {
  /**
   * 宿主元素引用
   * @Element 装饰器获取宿主元素
   */
  @Element() elm!: HTMLElement;

  /**
   * 辅助文本
   * 显示在表单控件下方的帮助信息
   * @Prop
   */
  @Prop() helperText: string;

  /**
   * 是否为内联布局
   * @Prop 装饰器，reflect表示会反映到DOM属性上
   * 默认值为false
   */
  @Prop({ reflect: true }) inline: boolean = false;

  /**
   * 是否为无效状态
   * @Prop
   */
  @Prop() invalid: boolean = false;

  /**
   * 无效状态提示文本
   * @Prop
   */
  @Prop() invalidText: string;

  /**
   * 标签文本
   * @Prop
   */
  @Prop() label: string;

  /**
   * 是否为必填项
   * @Prop
   */
  @Prop() required: boolean = false;

  /**
   * 是否显示骨架屏
   * 用于加载状态
   * @Prop
   */
  @Prop() skeleton: boolean = false;

  /**
   * 是否为警告状态
   * @Prop
   */
  @Prop() warn: boolean = false;

  /**
   * 警告状态提示文本
   * @Prop
   */
  @Prop() warnText: string;

  /**
   * 组件加载完成生命周期钩子
   * 设置ARIA角色并传递属性到内部表单控件
   */
  componentDidLoad() {
    this.elm.setAttribute('role', 'group');
    const controlElm = this.getInputElement();
    this.passRequiredToField(controlElm, this.required);
    this.passLabelToField(controlElm, this.label);
  }

  /**
   * 组件是否应该更新的生命周期钩子
   * 用于在特定属性变化时更新内部表单控件
   */
  componentShouldUpdate(newVal: any, _oldVal, propName: string) {
    if (propName === 'required') {
      this.passRequiredToField(this.getInputElement(), newVal);
    } else if (propName === 'label') {
      this.passLabelToField(this.getInputElement(), newVal);
    }
  }

  /**
   * 获取内部表单控件元素
   * 支持多种表单控件类型
   * @returns 找到的表单控件元素或undefined
   */
  getInputElement() {
    for (const compName of [
      'zane-input',
      'zane-textarea',
      'zane-select',
      'zane-checkbox',
      'zane-radio',
      'zane-code-editor',
    ]) {
      const controlElm = this.elm.querySelector(`${compName}`);
      if (controlElm) return controlElm;
    }
  }

  /**
   * 渲染标签
   * 根据skeleton状态决定渲染真实标签还是骨架屏
   * @returns 标签的虚拟DOM
   */
  getLabel() {
    return this.skeleton ? (
      <div class="label skeleton" />
    ) : (
      <label class="label">
        {this.required && <span class="required">*</span>}
        {this.label}
      </label>
    );
  }

  /**
   * 传递label属性到内部表单控件
   * @param controlElm 表单控件元素
   * @param label 标签文本
   */
  passLabelToField(controlElm: Element, label: string) {
    if (controlElm) {
      const el = controlElm as any;
      const oldProps = el.configAria;
      el.configAria = {
        'aria-label': label,
        ...oldProps,
      };
    }
  }

  /**
   * 传递required属性到内部表单控件
   * @param controlElm 表单控件元素
   * @param required 是否必填
   */
  passRequiredToField(controlElm: Element, required: boolean) {
    if (controlElm) {
      const el = controlElm as any;
      el.required = required;
    }
  }

  /**
   * 渲染组件
   * @returns 组件虚拟DOM
   */
  render() {
    return (
      <Host invalid={this.invalid} warn={this.warn}>
        <div class={{ 'form-control': true, inline: this.inline }}>
          {this.label && this.getLabel()}
          <div class="field">
            <slot />
          </div>
          {this.renderHelper()}
        </div>
      </Host>
    );
  }

  /**
   * 渲染辅助信息
   * 根据状态显示不同的辅助文本
   * @returns 辅助信息的虚拟DOM
   */
  renderHelper() {
    if (this.invalid)
      return <div class="helper invalid">{this.invalidText}</div>;
    else if (this.warn) return <div class="helper warn">{this.warnText}</div>;
    else if (this.helperText || this.helperText === '')
      return <div class="helper text">{this.helperText}</div>;
  }
}
