import Contract from './contract';
import Liability from './liability';
import Lighthouse from './lighthouse';
import ABI from './abi/Factory.json';

export default class Factory extends Contract {
  constructor(web3, address) {
    super(web3, ABI, address);
  }

  onLiability(cb) {
    return this.event.NewLiability((error, result) => {
      if (error) {
        cb(error);
        return;
      }
      this.web3.eth.getTransaction(result.transactionHash, (e, r) => {
        if (e) {
          cb(e);
          return;
        }
        const liability = new Liability(
          this.web3,
          result.args.liability,
          r.from
        );
        cb(null, liability);
      });
    });
  }

  onLighthouse(cb) {
    return this.event.NewLighthouse((error, result) => {
      if (error) {
        cb(error);
        return;
      }
      const lighthouse = new Lighthouse(
        this.web3,
        result.args.lighthouse,
        result.args.name
      );
      cb(null, lighthouse);
    });
  }
}
