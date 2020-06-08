import Contract from "./contract";
import Liability from "./liability";
import Lighthouse from "./lighthouse";
import ABI from "./abi/Factory.json";

function watchTx(web3, tx, cb) {
  const interval = setInterval(() => {
    web3.eth.getTransactionReceipt(tx, function (e, r) {
      if (e) {
        clearInterval(interval);
        cb(e);
        return;
      } else if (r) {
        clearInterval(interval);
        cb(null, r);
      }
    });
  }, 500);
}

export default class Factory extends Contract {
  constructor(web3, address) {
    super(web3, ABI, address);
  }

  onLiability(cb) {
    return this.events.NewLiability({}, (error, result) => {
      if (error) {
        cb(error);
        return;
      }
      watchTx(this.web3, result.transactionHash, (e, r) => {
        if (e) {
          cb(e);
          return;
        }
        const liability = new Liability(
          this.web3,
          result.returnValues.liability,
          r.from
        );
        cb(null, liability);
      });
    });
  }

  onLighthouse(cb) {
    return this.events.NewLighthouse({}, (error, result) => {
      if (error) {
        cb(error);
        return;
      }
      watchTx(this.web3, result.transactionHash, (e) => {
        if (e) {
          cb(e);
          return;
        }
        const lighthouse = new Lighthouse(
          this.web3,
          result.returnValues.lighthouse,
          result.returnValues.name
        );
        cb(null, lighthouse);
      });
    });
  }
}
