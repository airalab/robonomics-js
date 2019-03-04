import Promise from 'bluebird';
import Contract from './contract';
import { utils } from '../web3Utils';
import { hexToStr } from '../utils';
import ABI from './abi/Liability.json';

export default class Liability extends Contract {
  constructor(web3, address, worker = null) {
    super(web3, ABI, address);
    this.worker = utils.toChecksumAddress(worker);
  }

  getInfo() {
    return Promise.join(
      this.call.model(),
      this.call.objective(),
      this.call.result(),

      this.call.token(),
      this.call.cost(),
      this.call.lighthouseFee(),
      this.call.validatorFee(),

      this.call.demandHash(),
      this.call.offerHash(),

      this.call.promisor(),
      this.call.promisee(),
      this.call.lighthouse(),
      this.call.validator(),

      this.call.isSuccess(),
      this.call.isFinalized(),
      (...info) => ({
        model: hexToStr(info[0]),
        objective: hexToStr(info[1]),
        result: info[2] === '0x' ? '' : hexToStr(info[2]),

        token: info[3],
        cost: Number(info[4]),
        lighthouseFee: Number(info[5]),
        validatorFee: Number(info[6]),

        demandHash: info[7],
        offerHash: info[8],

        promisor: utils.toChecksumAddress(info[9]),
        promisee: utils.toChecksumAddress(info[10]),
        lighthouse: utils.toChecksumAddress(info[11]),
        validator: utils.toChecksumAddress(info[12]),

        isSuccess: info[13],
        isFinalized: info[14]
      })
    );
  }

  lighthouse() {
    return this.call.lighthouse().then(r => utils.toChecksumAddress(r));
  }

  result() {
    return this.call.result().then(r => (r === '0x' ? '' : hexToStr(r)));
  }

  model() {
    return this.call.model().then(r => hexToStr(r));
  }

  equalDemand(hash) {
    return this.call.demandHash().then(r => {
      if (hash === r) {
        return true;
      }
      return false;
    });
  }

  equalOffer(hash) {
    return this.call.offerHash().then(r => {
      if (hash === r) {
        return true;
      }
      return false;
    });
  }

  onResult() {
    return new Promise((resolve, reject) => {
      this.once.Finalized((error /*, result*/) => {
        if (error) {
          reject(error);
          return;
        }
        // resolve(
        //   result.args.result === '0x' ? '' : hexToStr(result.args.result)
        // );
        this.result().then(r => resolve(r));
      });
    });
  }
}
