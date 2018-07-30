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
    const event = this.contract.NewLiability()
    event.watch((error, result) => {
      if (!error) {
        this.web3.eth.getTransaction(result.transactionHash, (e, r) => {
          const liability = new Liability(this.web3, result.args.liability, r.to, r.from)
          cb(liability);
        });
      }
    });
    return event
  }

  watchLighthouse(cb) {
    const event = this.contract.NewLighthouse()
    event.watch((error, result) => {
      if (!error) {
        const lighthouse = new Lighthouse(this.web3, result.args.lighthouse, result.args.name)
        cb(lighthouse, result);
      }
    });
    return event
  }

  stop(event) {
    return event.stopWatching()
  }
}
