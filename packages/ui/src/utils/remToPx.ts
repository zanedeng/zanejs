/**
 * 将rem单位转换为像素(px)单位
 * @param rem - 需要转换的rem值，可以是数字或带有'rem'后缀的字符串
 * @returns 转换后的像素值(px)，如果输入格式不正确则返回undefined
 */
export function remToPx(rem: number | string): number | undefined {
  // 获取根元素(html)的字体大小
  const rootFontSize = Number.parseFloat(
    getComputedStyle(document.documentElement).fontSize,
  );

  // 如果输入是数字类型，直接与根字体大小相乘
  if (typeof rem === 'number') {
    return rem * rootFontSize;
  }
  // 如果输入是以'rem'结尾的字符串，先提取数值部分再与根字体大小相乘
  else if (typeof rem === 'string' && rem.endsWith('rem')) {
    return Number.parseFloat(rem) * rootFontSize;
  }

  // 如果输入格式不正确，隐式返回undefined
  return undefined;
}
