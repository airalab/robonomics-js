import utils from "web3-utils";
import Contract from "./contract";
import { hexToStr } from "../utils";
import ABI from "./abi/Liability.json";

export default class Liability extends Contract {
  constructor(
    web3,
    address,
    worker = "0x0000000000000000000000000000000000000000"
  ) {
    super(web3, ABI, address);
    this.worker = utils.toChecksumAddress(worker);
  }

  getInfo() {
    return Promise.all([
      this.methods.model().call(),
      this.methods.objective().call(),
      this.methods.result().call(),

      this.methods.token().call(),
      this.methods.cost().call(),
      this.methods.lighthouseFee().call(),
      this.methods.validatorFee().call(),

      this.methods.demandHash().call(),
      this.methods.offerHash().call(),

      this.methods.promisor().call(),
      this.methods.promisee().call(),
      this.methods.lighthouse().call(),
      this.methods.validator().call(),

      this.methods.isSuccess().call(),
      this.methods.isFinalized().call()
    ]).then(info => {
      return {
        model: hexToStr(info[0]),
        objective: hexToStr(info[1]),
        result: !info[2] || info[2] === "0x" ? "" : hexToStr(info[2]),

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
      };
    });
  }

  lighthouse() {
    return this.methods
      .lighthouse()
      .call()
      .then(r => utils.toChecksumAddress(r));
  }

  result() {
    return this.methods
      .result()
      .call()
      .then(r => (!r || r === "0x" ? "" : hexToStr(r)));
  }

  model() {
    return this.methods
      .model()
      .call()
      .then(r => hexToStr(r));
  }

  equalDemand(hash) {
    return this.methods
      .demandHash()
      .call()
      .then(r => {
        if (hash === r) {
          return true;
        }
        return false;
      });
  }

  equalOffer(hash) {
    return this.methods
      .offerHash()
      .call()
      .then(r => {
        if (hash === r) {
          return true;
        }
        return false;
      });
  }

  onResult() {
    return new Promise((resolve, reject) => {
      this.once("Finalized", {}, (error, event) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(
          !event.returnValues.result || event.returnValues.result === "0x"
            ? ""
            : hexToStr(event.returnValues.result)
        );
      });
    });
  }
}
