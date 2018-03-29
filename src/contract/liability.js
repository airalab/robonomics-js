import Promise from 'bluebird'
import Contract from './contract'
import ABI from '../abi/RobotLiability.json'
import { hexToStr } from '../utils/recover'

export default class Liability extends Contract {
  constructor(web3, address) {
    super(web3, ABI, address);
  }

  getInfo() {
    return Promise.join(
      this.call('model'),
      this.call('objective'),
      this.call('promisee'),
      this.call('promisor'),
      this.call('cost'),
      this.call('count'),
      this.call('fee'),
      (...info) => (
        {
          model: hexToStr(info[0]),
          objective: hexToStr(info[1]),
          promisee: info[2],
          promisor: info[3],
          cost: Number(info[4]),
          count: Number(info[5]),
          fee: Number(info[6])
        }
      )
    )
  }
}
