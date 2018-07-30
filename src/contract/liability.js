import Promise from 'bluebird'
import Contract from './contract'
import ABI from '../abi/RobotLiability.json'
import { hexToStr, hashMsg } from '../utils/recover'

export default class Liability extends Contract {
  constructor(web3, address, lighthouse = null, worker = null) {
    super(web3, ABI, address);
    this.lighthouse = this.web3.toChecksumAddress(lighthouse)
    this.worker = this.web3.toChecksumAddress(worker)
  }

  getInfo() {
    return Promise.join(
      this.call('model'),
      this.call('objective'),
      this.call('result'),

      this.call('xrt'),
      this.call('token'),

      this.call('cost'),
      this.call('lighthouseFee'),
      this.call('validatorFee'),

      this.call('askHash'),
      this.call('bidHash'),

      this.call('promisor'),
      this.call('promisee'),
      this.call('validator'),

      this.call('isConfirmed'),
      this.call('isFinalized'),
      (...info) => (
        {
          model: hexToStr(info[0]),
          objective: hexToStr(info[1]),
          result: (info[2] === '0x') ? '' : hexToStr(info[2]),

          xrt: info[3],
          token: info[4],

          cost: Number(info[5]),
          lighthouseFee: Number(info[6]),
          validatorFee: Number(info[7]),

          askHash: info[8],
          bidHash: info[9],

          promisor: this.web3.toChecksumAddress(info[10]),
          promisee: this.web3.toChecksumAddress(info[11]),
          validator: this.web3.toChecksumAddress(info[12]),

          isConfirmed: info[13],
          isFinalized: info[14],
        }
      )
    )
  }

  model() {
    return this.call('model')
      .then((r) => hexToStr(r))
  }

  equalAsk(msg) {
    return this.call('askHash')
      .then((r) => {
        if (hashMsg(msg) === r) {
          return true
        }
        return false
      })
  }

  equalBid(msg) {
    return this.call('bidHash')
      .then((r) => {
        if (hashMsg(msg) === r) {
          return true
        }
        return false
      })
  }

  watchResult(cb) {
    const watcher = setInterval(() => {
      this.getInfo()
        .then((infoUp) => {
          if (infoUp.isFinalized) {
            cb(infoUp.result);
            // ipfsBagCat(infoUp.result, (bag) => {
            //   cb(bag.data);
            // });
            clearInterval(watcher);
          }
        });
    }, 5000);
  }
}
