/**
 * 检查目标元素是否包含指定的插槽内容
 * @param el 要检查的父级 DOM 元素
 * @param name 可选参数，指定要查找的具名插槽
 * @returns
 *   - 当指定 name 时：返回布尔值，表示是否存在对应的具名插槽元素
 *   - 当未指定 name 时：返回布尔值，表示是否存在有效的默认插槽内容
 *          (文本节点：非空白文本 / 元素节点：未指定 slot 属性的元素)
 */
export const hasSlot = (el: HTMLElement, name?: string): boolean => {
  // 情况1：查找具名插槽
  if (name) {
    // 使用 :scope 伪类限定在当前元素范围内查找
    // 检查是否存在直接子元素且具有 [slot="指定名称"] 属性的元素
    return el.querySelector(`:scope > [slot="${name}"]`) !== null;
  }

  // 情况2：查找默认插槽内容
  // 将元素的子节点列表转换为数组以便使用数组方法
  // eslint-disable-next-line unicorn/prefer-spread
  const childNodes = Array.from(el.childNodes);

  // 使用 some() 方法检查是否存在符合条件的子节点
  return childNodes.some((node) => {
    // 检查文本节点：非空文本内容
    if (node.nodeType === Node.TEXT_NODE) {
      // 去除空白字符后检查内容是否非空
      return node.textContent?.trim() !== '';
    }

    // 检查元素节点
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      // 如果元素没有 slot 属性，则视为默认插槽内容
      return !element.hasAttribute('slot');
    }

    // 其他类型节点（如注释节点）不视为有效内容
    return false;
  });
};
