import { noop } from '../func'
/**
 * 定义创建和管理<script>标签的选项接口。
 */
export interface CreateScriptTagOptions {
  /**
   * 使用的文档对象，默认为当前浏览器全局的document。
   */
  document?: Document
  /**
   * 是否立即加载脚本（默认为true）。
   * @default true
   */
  immediate?: boolean

  /**
   * 脚本类型，默认为'text/javascript'。
   * @default 'text/javascript'
   */
  type?: string

  /**
   * 是否在<script>标签上添加'async'属性。
   */
  async?: boolean

  /**
   * 是否在<script>标签上添加'defer'属性（默认为true）。
   * @default true
   */
  defer?: boolean

  /**
   * 设置 crossorigin 属性，可选值为 'anonymous' 或 'use-credentials'。
   */
  crossOrigin?: 'anonymous' | 'use-credentials'

  /**
   * 自定义script标签上的其他属性。
   */
  attrs?: Record<string, string>
}

/**
 * 向文档中注入一个<script>元素，并提供加载状态控制方法。
 *
 * @param src - 要加载的脚本URL。
 * @param onLoaded - 脚本加载完成后的回调函数，默认为空操作。
 * @param options - 创建和管理<script>标签的选项。
 * @returns 返回一个包含加载、卸载方法的对象以及已插入的script标签引用。
 */
export function createScriptTag(
  src: string,
  onLoaded: (el: HTMLScriptElement) => void = noop,
  options: CreateScriptTagOptions = {},
) {
  // 解构并设置默认选项值
  const {
    immediate = true,
    type = 'text/javascript',
    async,
    crossOrigin,
    defer = true,
    document = window?.document,
    attrs = {},
  } = options

  let scriptTag: HTMLScriptElement | null = null

  let _promise: Promise<HTMLScriptElement | boolean> | null = null

  // 定义私有loadScript方法，负责实际加载脚本
  const loadScript = (
    waitForScriptLoad: boolean,
  ): Promise<HTMLScriptElement | boolean> =>
    new Promise((resolve, reject) => {
      // 成功时的回调闭包
      const resolveWithElement = (el: HTMLScriptElement) => {
        scriptTag = el
        resolve(el)
        return el
      }

      // 检查文档是否存在，不存在则直接返回
      if (!document) {
        resolve(false)
        return
      }

      let shouldAppend = false

      // 查找或创建script标签
      let el = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`)
      if (!el) {
        el = document.createElement('script')
        el.type = type
        el.src = src
        el.defer = defer

        if (async) el.async = async
        if (crossOrigin) el.crossOrigin = crossOrigin

        Object.entries(attrs).forEach(([name, value]) =>
          el?.setAttribute(name, value),
        )

        shouldAppend = true
      } else if (el.hasAttribute('data-loaded')) {
        resolveWithElement(el)
      }
      // 添加事件监听器，包括错误、中断和加载事件
      el.addEventListener('error', (event) => reject(event))
      el.addEventListener('abort', (event) => reject(event))
      el.addEventListener('load', () => {
        el!.setAttribute('data-loaded', 'true')

        onLoaded(el!)
        resolveWithElement(el!)
      })

      // 将script标签添加到文档中
      if (shouldAppend) el = document.head.appendChild(el)

      // 根据waitForScriptLoad决定是否立即解决Promise
      if (!waitForScriptLoad) resolveWithElement(el)
    })

  // 提供公共的load方法，确保脚本只加载一次
  const load = (
    waitForScriptLoad = true,
  ): Promise<HTMLScriptElement | boolean> => {
    if (!_promise) _promise = loadScript(waitForScriptLoad)

    return _promise
  }

  // 卸载指定脚本的方法
  const unload = () => {
    if (!document) return

    _promise = null

    if (scriptTag) scriptTag = null

    const el = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`)
    if (el) document.head.removeChild(el)
  }
  // 如果immediate为真，则立即调用load方法加载脚本
  if (immediate) load()
  // 返回一个包含scriptTag、load和unload方法的对象
  return { scriptTag, load, unload }
}

// 定义CreateScriptTagReturn类型别名
export type CreateScriptTagReturn = ReturnType<typeof createScriptTag>

// 一个单独的函数，用于隐藏某个特定CSS类的元素
export function removeIcon() {
  const iconDiv = document.getElementsByClassName(
    'VIpgJd-ZVi9od-aZ2wEe-wOHMyf',
  )[0]
  if (iconDiv) {
    // @ts-ignores
    iconDiv.style.display = 'none'
  }
}
