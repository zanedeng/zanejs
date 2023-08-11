import type { EventType, Listener } from '../typing'
import type IRequestArguments from './IRequestArguments'

export default interface IProvider {
  providers: any
  request(args: IRequestArguments): Promise<any>
  on(eventName: EventType, listener: Listener): this
  removeListener(eventName: EventType, listener: Listener): this
  disconnect(): Promise<void>
}
