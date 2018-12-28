import namehash from 'eth-ens-namehash'
import Contract from './contract'
import EnsResolver from './ensResolver'
import ABI from '../abi/ENS.json'

export default class Ens extends Contract {
  constructor(web3, address, version, suffix = 'eth') {
    super(web3, ABI, address)
    this.version = version
    this.suffix = suffix
    this.resolver = null
  }

  async init() {
    const resolver = await this.call('resolver', [namehash.hash(this.version + '.robonomics.' + this.suffix)])
    this.resolver = new EnsResolver(this.web3, resolver)
  }

  ready() {
    return this.init()
  }

  getUrlZone(name, zone = null) {
    let url = name
    if (zone && (new RegExp('.' + zone)).test(name) === false) {
      url += '.' + zone
    }
    return url
  }

  getUrl(name, zone = null) {
    let url = this.getUrlZone(name, zone)
    if (new RegExp('.robonomics.' + this.suffix).test(name) === false) {
      url += '.' + this.version + '.robonomics.' + this.suffix
    }
    return url
  }

  addr(name) {
    return this.resolver.addr(this.getUrl(name))
  }

  addrLighthouse(name) {
    return this.addr(this.getUrlZone(name, 'lighthouse'))
  }

  addrModel(name) {
    return this.addr(this.getUrlZone(name, 'model'))
  }

  addrValidator(name) {
    return this.addr(this.getUrlZone(name, 'validator'))
  }
}
