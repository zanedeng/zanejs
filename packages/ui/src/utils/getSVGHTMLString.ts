/**
 * 将SVG XML字符串转换为HTML字符串
 * @param svgXml - 输入的SVG XML字符串
 * @returns 转换后的HTML字符串
 * @throws 如果解析SVG出错，将抛出错误
 */
export function getSVGHTMLString(svgXml: string): string {
  try {
    // 创建DOMParser实例用于解析XML
    const parser = new DOMParser();

    // 将SVG XML字符串解析为DOM文档
    const doc = parser.parseFromString(svgXml, 'image/svg+xml');

    // 检查解析后的文档根元素是否为svg标签
    if (doc.documentElement.tagName === 'svg') {
      // 返回svg元素的完整HTML字符串表示
      return doc.documentElement.outerHTML;
    }

    // 如果根元素不是svg，返回undefined（隐式）
    return '';
  } catch (error) {
    // 捕获并记录解析过程中的错误
    console.error(error);

    // 抛出带有详细信息的新错误
    throw new Error(`Error parsing SVG: ${error}`);
  }
}
