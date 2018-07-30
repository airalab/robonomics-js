import namehash from 'eth-ens-namehash'
import Contract from './contract'
import ABI from '../abi/EnsResolver.json'

export default class EnsResolver extends Contract {
  constructor(web3, address) {
    super(web3, ABI, address);
  }

  addr(name) {
    return this.call('addr', [ namehash.hash(name) ])
      .then((r) => this.web3.toChecksumAddress(r))
  }
}
