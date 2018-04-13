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
      this.call('token'),
      this.call('xrt'),
      this.call('promisee'),
      this.call('promisor'),
      this.call('validator'),
      this.call('validatorFee'),
      this.call('finalized'),
      this.call('result'),
      // this.call('cost'),
      (...info) => (
        {
          model: hexToStr(info[0]),
          objective: hexToStr(info[1]),
          token: info[2],
          xrt: info[3],
          promisee: info[4],
          promisor: info[5],
          validator: info[6],
          validatorFee: Number(info[7]),
          finalized: info[8],
          result: info[9],
          // cost: Number(info[6]),
        }
      )
    )
  }
}
