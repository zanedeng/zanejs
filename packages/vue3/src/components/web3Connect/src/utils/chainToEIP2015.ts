import type IChain from '../interfaces/IChain'

export function chainToEIP2015(chain: IChain) {
  return {
    chainId: chain.chainId,
    chainName: chain.name,
    rpcUrl: chain.rpc[0],
    nativeCurrency: chain.nativeCurrency,
    blockExplorerUrl: chain.infoURL,
  }
}
