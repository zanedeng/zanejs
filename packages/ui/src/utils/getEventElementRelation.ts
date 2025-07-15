/**
 * 获取事件触发路径中的元素与目标元素的关系
 * @param event - 事件对象
 * @param element - 要检查的目标元素
 * @returns 返回关系描述对象
 *
 * @example
 * const relation = getEventElementRelation(event, myElement);
 * if (relation.isTarget) {
 *   console.log('直接点击了目标元素');
 * }
 */
export function getEventElementRelation(
  event: Event,
  element: EventTarget | null,
): {
  isInside: boolean; // 是否在目标元素内部触发
  isOutside: boolean; // 是否在目标元素外部触发
  isTarget: boolean; // 是否直接触发在目标元素上
  pathElement?: Element; // 路径中匹配的元素(如果有)
} {
  if (!element) {
    return {
      isInside: false,
      isOutside: true,
      isTarget: false,
    };
  }

  const path = event.composedPath();
  const pathElement = path.find((el) => el === element);
  const isTarget = path[0] === element;

  return {
    isInside: !!pathElement,
    isOutside: !pathElement,
    isTarget,
    pathElement: pathElement as Element | undefined,
  };
}
