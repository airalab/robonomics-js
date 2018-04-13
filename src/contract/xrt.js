import Promise from 'bluebird'
import Contract from './contract'
import ABI from '../abi/TokenEmission.json'

export default class XRT extends Contract {
  constructor(web3, address) {
    super(web3, ABI, address);
  }

  getInfo() {
    return Promise.join(
      this.call('name'),
      this.call('totalSupply'),
      this.call('decimals'),
      this.call('symbol'),
      (...info) => (
        {
          name: info[0],
          totalSupply: Number(info[1]),
          decimals: Number(info[2]),
          symbol: info[3]
        }
      )
    )
  }
}
