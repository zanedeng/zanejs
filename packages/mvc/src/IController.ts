import type Controller from './Controller'

export default interface IController {
  new (command: string): Controller
}
