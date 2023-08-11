export default interface IRequestArguments {
  readonly method: string
  readonly params?: readonly any[] | object
}
