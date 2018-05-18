import Promise from 'bluebird'
import XRT from './contract/xrt'
import Factory from './contract/factory'
import Channel from './channel'
import Message from './message'

export default class Robonomics {
  constructor(options) {
    const { web3, provider } = {
      web3: null,
      provider: null,
      ...options
    }
    this.web3 = web3
    this.provider = provider
    this.address = {
      xrt: '0x0Ef7fCB816fd725819e071eFB48F7EACb85c1A6A',
      factory: '0x291cF74beAFe4A3b61F36373dbC0fEbd35C8102e'
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

  channel(name) {
    return new Channel(name, this.provider)
  }

  message(signer = null) {
    return new Message(signer)
  }
}
