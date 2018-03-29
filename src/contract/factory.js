import Contract from './contract'
import Liability from './liability'
import ABI from '../abi/BuilderRobotLiability.json'

export default class Factory extends Contract {
  constructor(web3, address) {
    super(web3, ABI, address || '0x11523db0844427F08bb8464cbF48944351dEB262');
  }

  watch(cb) {
    const event = this.contract.Builded({}, '')
    event.watch((error, result) => {
      if (!error) {
        const liability = new Liability(this.web3, result.args.instance)
        cb(liability, result);
      }
    });
    return event
  }

  stop(event) {
    return event.stopWatching()
  }
}
