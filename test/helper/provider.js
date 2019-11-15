import Web3 from "web3";
import Factory from "../../src/contract/factory";
import { base58 } from "../../src/utils";

var abi = new Web3.modules.Eth().abi;

function encodeDemand(msg) {
  return abi.encodeParameters(
    [
      "bytes",
      "bytes",
      "address",
      "uint256",
      "address",
      "address",
      "uint256",
      "uint256",
      "address",
      "bytes"
    ],
    [
      Web3.utils.bytesToHex(base58.decode(msg.model)),
      Web3.utils.bytesToHex(base58.decode(msg.objective)),
      msg.token,
      msg.cost,
      msg.lighthouse,
      msg.validator,
      msg.validatorFee,
      msg.deadline,
      msg.sender,
      msg.signature
    ]
  );
}

function encodeOffer(msg) {
  return abi.encodeParameters(
    [
      "bytes",
      "bytes",
      "address",
      "uint256",
      "address",
      "address",
      "uint256",
      "uint256",
      "address",
      "bytes"
    ],
    [
      Web3.utils.bytesToHex(base58.decode(msg.model)),
      Web3.utils.bytesToHex(base58.decode(msg.objective)),
      msg.token,
      msg.cost,
      msg.validator,
      msg.lighthouse,
      msg.lighthouseFee,
      msg.deadline,
      msg.sender,
      msg.signature
    ]
  );
}

let robonomics = null;
let d = null;
let o = null;
const provider = {
  run: (r, model) => {
    robonomics = r;
    robonomics.onDemand(model, msg => {
      provider.setDemand(msg);
    });
    robonomics.onOffer(model, msg => {
      provider.setOffer(msg);
    });
    robonomics.onResult(msg => {
      provider.finalization(msg);
    });
  },
  setDemand: msg => {
    d = msg;
    provider.match();
  },
  setOffer: msg => {
    o = msg;
    provider.match();
  },
  match: () => {
    if (d !== null && o !== null) {
      // console.log(robonomics.lighthouse.address);
      // console.log(encodeDemand(d), encodeOffer(o));
      // console.log({ from: robonomics.account.address, gas: 6000000 });
      const builder = new Factory(
        robonomics.web3,
        robonomics.lighthouse.address
      );
      builder.methods
        .createLiability(encodeDemand(d), encodeOffer(o))
        .send({ from: robonomics.account.address, gas: 6000000 });
      d = null;
      o = null;
    }
  },
  finalization: msg => {
    robonomics.lighthouse.methods
      .finalizeLiability(
        msg.liability,
        Web3.utils.bytesToHex(base58.decode(msg.result)),
        msg.success,
        msg.signature
      )
      .send({ from: robonomics.account.address, gas: 6000000 });
  }
};
export default provider;
