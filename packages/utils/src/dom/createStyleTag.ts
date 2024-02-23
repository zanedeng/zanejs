/**
 * @module zanejs
 * @description 创建并插入一个style标签到head中。
 */

// 定义创建style标签所需的选项接口
export interface CreateStyleTagOptions {
  /**
   * 可选的document对象，默认为当前文档
   *
   * @default window.document
   */
  document?: Document
  /**
   * 是否立即加载样式
   *
   * @default true
   */
  immediate?: boolean

  /**
   * style标签的DOM id属性
   *
   * @default 自动生成递增id（格式：zanejs_1, zanejs_2, ...）
   */
  id?: string
}

/**
 * 创建style标签后返回的对象接口
 */
export interface CreateStyleTagReturn {
  id: string
  css: string
  isLoaded: Readonly<boolean>
  load: () => void
  unload: () => void
}

// 初始化全局id计数器
let _id = 0

/**
 * 将<style>元素注入到head标签内。
 *
 * @param css - 要插入的CSS内容
 * @param options - 创建style标签时的可选配置项
 * @returns {CreateStyleTagReturn} 包含style标签信息及加载/卸载方法的对象
 */
export function createStyleTag(
  css: string,
  options: CreateStyleTagOptions = {},
): CreateStyleTagReturn {
  let isLoaded = false

  const {
    immediate = true,
    id = `zanejs_${++_id}`,
    document = window.document,
  } = options

  // 加载style标签的方法
  const load = () => {
    if (!document) return

    const el = (document.getElementById(id) ||
      document.createElement('style')) as HTMLStyleElement
    el.type = 'text/css'
    el.id = id
    el.innerText = css
    document.head.appendChild(el)
    el.onload = () => {
      isLoaded = true
    }
  }

  // 卸载style标签的方法
  const unload = () => {
    if (!document || !isLoaded) return

    document.head.removeChild(document.getElementById(id) as HTMLStyleElement)
    isLoaded = false
  }

  // 如果设置了立即加载，则执行load方法
  if (immediate) load()

  // 返回包含style标签信息及加载/卸载方法的对象
  return {
    id,
    css,
    isLoaded,
    load,
    unload,
  }
}
