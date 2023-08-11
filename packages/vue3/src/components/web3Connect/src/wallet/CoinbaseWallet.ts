import { Buffer } from 'buffer'
import CoinbaseIcon from '../assets/img/coinbase.svg'
import { parseChainId } from '../utils/parseChainId'
import type IProvider from '../interfaces/IProvider'
import type IWallet from '../interfaces/IWallet'

export class CoinbaseWallet implements IWallet {
  private _provider?: IProvider
  private _chainId: number | undefined
  private _account: string | undefined
  private _rpcUrl: string | undefined

  constructor(rpcUrl = '') {
    this._rpcUrl = rpcUrl
    this._chainId = undefined
    this._account = undefined
  }

  get name(): string {
    return 'Coinbase Wallet'
  }

  get icon(): string {
    return CoinbaseIcon
  }

  get downloadUrl(): string {
    return 'https://chrome.google.com/webstore/detail/coinbase-wallet-extension/hnfanknocfeofbddgcijnmhnfnkdnaad?hl=en'
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
    }
    return this.provider
  }

  async isValid(): Promise<boolean> {
    if (this._provider) {
      return true
    }

    if (!(window as any).ethereum) {
      return false
    }

    const win: any = window
    win.global = window
    win.Buffer = Buffer
    if (!win.process) {
      win.process = {
        env: {
          ENVIRONMENT: 'BROWSER',
        },
      }
    }

    await import('@coinbase/wallet-sdk')
      .then(async (m) => {
        const coinbaseWallet = new m.default({ appName: '' })
        const provider: any = coinbaseWallet.makeWeb3Provider(this._rpcUrl)
        if (!provider.qrUrl) {
          this._provider = provider
        }
      })
      .catch((e) => {
        console.log(e)
      })

    if (this._provider) {
      ;(this._provider as unknown as IProvider)
        .on('disconnect', this.disconnectListener)
        .on('chainChanged', this.chainChangedListener)
        .on('accountsChanged', this.accountsChangedListener)
      return true
    } else {
      return false
    }
  }

  async disconnect(): Promise<void> {
    if (this._provider) {
      await this._provider
        .removeListener('disconnect', this.disconnectListener)
        .removeListener('chainChanged', this.chainChangedListener)
        .removeListener('accountsChanged', this.accountsChangedListener)
        .disconnect()
      this._provider = undefined
      this._chainId = undefined
      this._account = undefined
    }
  }

  private disconnectListener() {
    this._chainId = undefined
    this._account = undefined
  }

  private chainChangedListener(chainId: number | string) {
    this._chainId = parseChainId(chainId)
  }

  private accountsChangedListener(accounts: string[]) {
    this._account = accounts[0]
  }
}
