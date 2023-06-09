export function hackCss(attr: string, value: string) {
  const prefix: string[] = ['webkit', 'Moz', 'ms', 'OT']
  attr = attr.charAt(0).toUpperCase() + attr.slice(1)
  const styleObj: any = {}
  prefix.forEach((item) => {
    styleObj[`${item}${attr}`] = value
  })
  return {
    ...styleObj,
    [attr]: value,
  }
}
