import namehash from "eth-ens-namehash";
import utils from "web3-utils";
import Contract from "./contract";
import ABI from "./abi/EnsResolver.json";

export default class EnsResolver extends Contract {
  constructor(web3, address) {
    super(web3, ABI, address);
  }

  addr(name) {
    return this.methods
      .addr(namehash.hash(name))
      .call()
      .then(function(r) {
        return utils.toChecksumAddress(r);
      });
  }
}
