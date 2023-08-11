import type { ethers } from 'ethers'

export type State = 'prepare' | 'connecting' | 'result' | 'closed'

export type Network = ethers.Network

export type EventType = string | symbol

export type Listener = (...args: Array<any>) => void
