import type IProvider from './IProvider'

export default interface IWallet {
  readonly name: string
  readonly icon: string
  readonly downloadUrl: string
  readonly provider?: IProvider
  readonly chainId?: number
  readonly account?: string

  isValid(): Promise<boolean>
  connectTo(chainId?: number): Promise<IProvider>
  disconnect(): Promise<void>
  connectable(chainId: number): Promise<boolean>
}
