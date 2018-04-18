import Promise from 'bluebird'
import XRT from './contract/xrt'
import Factory from './contract/factory'
import Chanel from './chanel'
import Message from './message'

export default class Aira {
  constructor(options) {
    const { web3, provider } = {
      web3: null,
      provider: null,
      ...options
    }
    this.web3 = web3
    this.provider = provider
    this.address = {
      xrt: '0x2B3cE4c151f7c9662fdD12e5b9C7B39b0D61e7F2',
      factory: '0x673b9e3b800123E95B1582c97964812389E8040C'
    }
    if (web3 !== null) {
      this.xrt = new XRT(web3, this.address.xrt)
      this.factory = new Factory(web3, this.address.factory)
    } else {
      console.warn('To use contrasts required web3')
    }
  }

  ready() {
    if (this.provider === null) {
      return Promise.resolve()
    }
    return this.provider.ready()
  }

  chanel(name) {
    return new Chanel(name, this.provider)
  }

  message(signer = null) {
    return new Message(signer)
  }
}
