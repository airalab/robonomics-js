import Promise from 'bluebird'
import Contract from './contract'
import ABI from '../abi/RobotLiability.json'
import { hexToStr, hashMsg } from '../utils/recovery'

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

      this.call('token'),
      this.call('cost'),
      this.call('lighthouseFee'),
      this.call('validatorFee'),

      this.call('demandHash'),
      this.call('offerHash'),

      this.call('promisor'),
      this.call('promisee'),
      this.call('validator'),

      this.call('isSuccess'),
      this.call('isFinalized'),
      (...info) => (
        {
          model: hexToStr(info[0]),
          objective: hexToStr(info[1]),
          result: (info[2] === '0x') ? '' : hexToStr(info[2]),

          token: info[3],
          cost: Number(info[4]),
          lighthouseFee: Number(info[5]),
          validatorFee: Number(info[6]),

          demandHash: info[7],
          offerHash: info[8],

          promisor: this.web3.toChecksumAddress(info[9]),
          promisee: this.web3.toChecksumAddress(info[10]),
          validator: this.web3.toChecksumAddress(info[11]),

          isSuccess: info[12],
          isFinalized: info[13],
        }
      )
    )
  }

  model() {
    return this.call('model')
      .then((r) => hexToStr(r))
  }

  equalDemand(msg) {
    return this.call('demandHash')
      .then((r) => {
        if (hashMsg(msg) === r) {
          return true
        }
        return false
      })
  }

  equalOffer(msg) {
    return this.call('offerHash')
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
