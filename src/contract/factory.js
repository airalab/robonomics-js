import Promise from 'bluebird'
import Contract from './contract'
import Liability from './liability'
import Lighthouse from './lighthouse'
import ABI from '../abi/Factory.json'

export default class Factory extends Contract {
  constructor(web3, address) {
    super(web3, ABI, address);
  }

  watchLiability(cb) {
    const event = this.contract.BuildedLiability({}, '')
    event.watch((error, result) => {
      if (!error) {
        const liability = new Liability(this.web3, result.args.robotLiability)
        cb(liability, result);
      }
    });
    return event
  }

  watchLighthouse(cb) {
    const event = this.contract.BuildedLighthouse({}, '')
    event.watch((error, result) => {
      if (!error) {
        const lighthouse = new Lighthouse(this.web3, result.args.lighthouse)
        cb(lighthouse, result);
      }
    });
    return event
  }

  stop(event) {
    return event.stopWatching()
  }

  getLighthouses() {
    const lighthouses = [];
    const getLighthouses = (i, cb) => {
      this.contract.buildedLighthouse(i, (e, r) => {
        if (r !== '0x') {
          lighthouses.push(this.web3.toChecksumAddress(r));
          getLighthouses(i + 1, cb);
        } else {
          cb();
        }
      });
    };
    return new Promise((resolve) => {
      getLighthouses(0, () => {
        resolve(lighthouses)
      });
    })
  }
}
