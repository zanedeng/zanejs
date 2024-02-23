/**
 * 获取网页标题。
 * 首先尝试从HTML head标签内的title元素中获取，若失败，则查找Open Graph元标签定义的og:title作为网页标题。
 *
 * @returns {string} 网页标题。如果两者都没有找到合适的标题，则返回"No Title"。
 */
export const getWebpageTitle = () => {
  // 查找head标签内的title元素，并获取其文本内容
  const titleElement = document.querySelector('head title')
  if (titleElement && titleElement.textContent) {
    return titleElement.textContent
  }
  // 若title元素不存在或没有文本内容，则查找og:title属性的meta标签，获取其content属性值（即网页标题）
  const ogTitleMeta = document.querySelector('meta[property="og:title"]')
  if (ogTitleMeta && ogTitleMeta.getAttribute('content')) {
    return ogTitleMeta.getAttribute('content')
  }
  // 若既没有找到title元素也没有找到og:title元标签，则返回"No Title"
  return 'No Title'
}
