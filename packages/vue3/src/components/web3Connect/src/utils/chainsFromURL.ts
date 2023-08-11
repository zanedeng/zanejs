import type IChain from '../interfaces/IChain'

export async function chainsFromURL(
  url = 'https://chainid.network/chains.json'
): Promise<IChain[]> {
  const response = await fetch(url)
  if (response.status >= 400) {
    throw new Error('Bad response from server')
  }
  const result = await response.json()
  return result
}
