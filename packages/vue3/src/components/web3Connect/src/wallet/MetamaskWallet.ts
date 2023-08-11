import detectEthereumProvider from '@metamask/detect-provider'
import MetaMaskIcon from '../assets/img/metamask.svg'
import { parseChainId } from '../utils/parseChainId'
import type IProvider from '../interfaces/IProvider'
import type IWallet from '../interfaces/IWallet'

export class MetamaskWallet implements IWallet {
  private _provider?: IProvider
  private _chainId: number | undefined
  private _account: string | undefined

  constructor() {
    this._chainId = undefined
    this._account = undefined
  }

  get name(): string {
    return 'MetaMask'
  }

  get icon(): string {
    return MetaMaskIcon
  }

  get downloadUrl(): string {
    return 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en'
  }

  get provider(): IProvider {
    return this._provider!
  }

  get chainId(): number | undefined {
    return this._chainId
  }

  get account(): string | undefined {
    return this._account
  }

  /* tslint:disable:no-unused-vars */
  async connectable(chainId: number): Promise<boolean> {
    return true
  }

  async connectTo(desiredChainId?: number): Promise<IProvider> {
    await this.isValid()

    if (this.provider) {
      const chainId = await this.provider.request({ method: 'eth_chainId' })
      const accounts = await this.provider.request({
        method: 'eth_requestAccounts',
      })
      const receivedChainId = parseChainId(chainId)
      if (!desiredChainId || receivedChainId === desiredChainId) {
        this._account = accounts[0]
        this._chainId = chainId
      } else {
        const desiredChainIdHex = `0x${desiredChainId.toString(16)}`
        await this.provider.request({
          method: 'wallet_switchEthereumChain',
          params: [
            {
              chainId: desiredChainIdHex,
            },
          ],
        })
        return this.connectTo(desiredChainId)
      }

      return this.provider
    }

    throw new Error('MetaMask wallet not found.')
  }

  async isValid(): Promise<boolean> {
    if (this._provider) {
      return true
    }

    if (!(window as any).ethereum) {
      return false
    }

    const provider: any = await detectEthereumProvider()
    if (provider?.providers?.length) {
      this._provider =
        provider.providers.find((p: any) => p.isMetaMask) ??
        provider.providers[0]
    } else if (provider?.isMetaMask) {
      this._provider = provider
    }

    if (this._provider) {
      return true
    } else {
      return false
    }
  }

  async disconnect(): Promise<void> {
    if (this._provider) {
      this._provider = undefined
      this._chainId = undefined
      this._account = undefined
    }
  }
}
