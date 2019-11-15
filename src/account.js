import account from "eth-lib/lib/account";
import utils from "web3-utils";
import { setPrefix } from "./utils";

export default class Account {
  constructor(address = null, privateKey = null, isSignPrefix = true) {
    this.address = null;
    this.privateKey = null;
    this.isSignPrefix = isSignPrefix;
    this._signer = () => Promise.reject("Error. Not signer");

    if (privateKey !== null) {
      this._setPrivateKey(privateKey);
      this.setSigner();
    } else if (address !== null) {
      this._setAddress(address);
    } else {
      throw new Error("Require address or privateKey");
    }
  }

  _setAddress(address) {
    if (!utils.isAddress(address)) {
      throw new Error("Bad address account");
    }
    this.address = utils.toChecksumAddress(address);
  }

  _setPrivateKey(privateKey) {
    this._setAddress(account.fromPrivate(privateKey).address);
    this.privateKey = privateKey;
  }

  setSigner(signer = null) {
    if (signer !== null) {
      this._signer = message => signer(message, this);
    } else if (this.privateKey) {
      this._signer = message =>
        Promise.resolve(account.sign(message, this.privateKey));
    } else {
      throw new Error("Require signer");
    }
  }

  sign(hash) {
    const message = this.isSignPrefix ? setPrefix(hash) : hash;
    return this._signer(message);
  }

  recovery(hash, signature) {
    const message = this.isSignPrefix ? setPrefix(hash) : hash;
    return account.recover(message, signature);
  }

  signMessage(message) {
    return this.sign(message.getHash());
  }

  recoveryMessage(message) {
    return this.recovery(message.getHash(), message.signature);
  }
}
