import Contract from './contract'
import ABI from '../abi/Lighthouse.json'

export default class Lighthouse extends Contract {
  constructor(web3, address, name = '') {
    super(web3, ABI, address)
    this.name = name
  }

  async getProviders() {
    const providers = []
    const count = await this.call('providersLength')
    for (let i = 0; i < count; i++) {
      const provider = await this.call('providers', [i])
      providers.push(this.web3.toChecksumAddress(provider))
    }
    return providers
  }

  getInfo() {
    return Promise.join(
      this.call('minimalStake'),
      this.call('timeoutInBlocks'),
      this.call('keepAliveBlock'),
      this.call('marker'),
      this.call('quota'),
      (...info) => (
        {
          minimalStake: Number(info[0]),
          timeoutInBlocks: Number(info[1]),
          keepAliveBlock: Number(info[2]),
          marker: Number(info[3]),
          quota: Number(info[4]),
        }
      )
    )
  }
}
