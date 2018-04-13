import Contract from './contract'
import ABI from '../abi/Lighthouse.json'

export default class Lighthouse extends Contract {
  constructor(web3, address) {
    super(web3, ABI, address);
  }
}
