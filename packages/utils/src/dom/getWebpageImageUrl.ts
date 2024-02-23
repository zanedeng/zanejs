/**
 * 获取网页中代表性的图片URL。
 * 首先查找Open Graph元标签定义的图片，若不存在，则返回页面上的第一个img元素的src。
 *
 * @returns {string} 网页代表性图片的URL，如果没有找到合适的图片，则返回空字符串。
 */
export const getWebpageImageUrl = () => {
  // 查找og:image属性的meta标签，获取其content属性值（即图片URL）
  const metaImage = document.querySelector('meta[property="og:image"]')
  if (metaImage) {
    return metaImage.getAttribute('content')
  }
  // 如果没有找到og:image元标签，则获取页面上第一个img元素的src属性作为图片URL
  const firstImage = document.images[0]
  if (firstImage) {
    return firstImage.src
  }
  // 若既没有找到og:image元标签，也没有找到img元素，则返回空字符串
  return ''
}
