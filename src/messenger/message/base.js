import _has from 'lodash/has';
import { account } from '../../web3Utils';
import { setPrefix } from '../../utils';

export default class Base {
  constructor() {
    this._props = [];
  }

  initProps(data) {
    this._props.forEach(name => {
      if (!_has(data, name)) {
        throw new Error(`Not found property: ${name}`);
      }
      if (
        name === 'cost' ||
        name === 'deadline' ||
        name === 'lighthouseFee' ||
        name === 'nonce'
      ) {
        this[name] = Number(data[name]);
      } else {
        this[name] = data[name];
      }
    });
  }

  toObject() {
    const data = {};
    this._props.forEach(name => {
      data[name] = this[name];
    });
    return data;
  }

  encode() {
    const msg = this.toObject();
    msg.signature = msg.signature.replace('0x', '');
    return Buffer.from(JSON.stringify(msg));
  }

  recovery(isSignPrefix = true) {
    const msg = isSignPrefix ? setPrefix(this.getHash()) : this.getHash();
    return account.recover(msg, this.signature);
  }
}
