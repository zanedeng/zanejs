export const isSupport = (callback: () => unknown) => {
  const isSupported = Boolean(callback())

  return isSupported
}
