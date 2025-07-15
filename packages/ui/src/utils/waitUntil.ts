/**
 * 等待直到条件满足或超时
 * @param condition - 条件函数，返回布尔值表示条件是否满足
 * @param timeout - 检查条件的时间间隔，默认为300毫秒
 * @returns Promise，当条件满足时解析为1
 */
export async function waitUntil(
  condition: () => boolean,
  timeout: number = 300,
): Promise<number> {
  return await new Promise<number>((resolve) => {
    // 设置定时器，定期检查条件是否满足
    const interval = setInterval(() => {
      // 调用条件函数检查是否满足
      if (condition()) {
        // 条件满足时，解析Promise并清除定时器
        resolve(1);
        clearInterval(interval);
      }
    }, timeout);
  });
}
