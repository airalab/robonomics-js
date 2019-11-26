import utils from "web3-utils";

export default class Contract {
  constructor(web3, abi, address) {
    this.web3 = web3;
    this.address = utils.toChecksumAddress(address);
    const contract = new web3.eth.Contract(abi, address);
    return new Proxy(this, {
      get(target, key) {
        if (typeof target[key] !== "undefined") {
          return target[key];
        }
        return contract[key];
      }
    });
  }
}
