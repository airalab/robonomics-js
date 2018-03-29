import Factory from './contract/factory'
import Provider from './provider'
import Chanel from './chanel'
import Message from './message'
import * as utils from './utils/recover'

export default class Aira {
  constructor(web3, provider) {
    this.factory = new Factory(web3)
    this.provider = provider || new Provider()
    this.utils = utils
  }

  ready() {
    return this.provider.ready()
  }

  chanel(name) {
    return new Chanel(name, this.provider)
  }

  message(signer = null) {
    return new Message(signer)
  }
}
