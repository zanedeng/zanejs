/**
 * 将SVG字符串转换为DOM元素
 * @param svg - SVG格式的字符串
 * @returns 返回SVG DOM元素
 * @throws 当解析失败时抛出错误
 *
 * @example
 * const svgString = '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40"/></svg>';
 * const svgElement = convertToDomSVG(svgString);
 * document.body.appendChild(svgElement);
 */
export function convertToDomSVG(svg: string): SVGSVGElement {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svg, 'image/svg+xml');

    // 检查解析错误
    const parserErrors = doc.querySelector('parsererror');
    if (parserErrors) {
      throw new Error(`SVG parsing failed: ${parserErrors.textContent}`);
    }

    // 确保返回的是SVG元素
    const svgElement = doc.documentElement;
    if (svgElement.tagName.toLowerCase() !== 'svg') {
      throw new Error('Parsed content is not an SVG element');
    }

    return svgElement as unknown as SVGSVGElement;
  } catch (error) {
    console.error('Failed to convert SVG string to DOM:', error);
    throw new Error(
      `SVG conversion failed: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * 安全地将SVG字符串转换为DOM元素
 * @param svg - SVG格式的字符串
 * @param onError - 错误处理回调
 * @returns 返回SVG DOM元素或null（解析失败时）
 */
export function safeConvertToDomSVG(
  svg: string,
  onError?: (error: Error) => void,
): null | SVGSVGElement {
  try {
    return convertToDomSVG(svg);
  } catch (error) {
    if (onError) {
      onError(error instanceof Error ? error : new Error(String(error)));
    }
    return null;
  }
}
