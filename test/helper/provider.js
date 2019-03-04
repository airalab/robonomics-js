import * as web3Utils from '../../src/web3Utils';
import { base58 } from '../../src/utils';

function encodeDemand(msg) {
  return web3Utils.abi.encodeParameters(
    [
      'bytes',
      'bytes',
      'address',
      'uint256',
      'address',
      'address',
      'uint256',
      'uint256',
      'address',
      'bytes'
    ],
    [
      web3Utils.utils.bytesToHex(base58.decode(msg.model)),
      web3Utils.utils.bytesToHex(base58.decode(msg.objective)),
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
  return web3Utils.abi.encodeParameters(
    [
      'bytes',
      'bytes',
      'address',
      'uint256',
      'address',
      'address',
      'uint256',
      'uint256',
      'address',
      'bytes'
    ],
    [
      web3Utils.utils.bytesToHex(base58.decode(msg.model)),
      web3Utils.utils.bytesToHex(base58.decode(msg.objective)),
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
      robonomics.lighthouse.send.createLiability(
        encodeDemand(d),
        encodeOffer(o),
        { from: robonomics.account.address, gas: 6000000 }
      );
      d = null;
      o = null;
    }
  },
  finalization: msg => {
    robonomics.lighthouse.send.finalizeLiability(
      msg.liability,
      web3Utils.utils.bytesToHex(base58.decode(msg.result)),
      msg.success,
      msg.signature,
      { from: robonomics.account.address, gas: 6000000 }
    );
  }
};
export default provider;
