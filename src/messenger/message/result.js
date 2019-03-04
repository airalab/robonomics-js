import Base from './base';
import { utils } from '../../web3Utils';
import { base58 } from '../../utils';

export default class Result extends Base {
  constructor(data) {
    super();
    this._props = ['liability', 'result', 'success', 'signature'];
    this.initProps({
      signature: data.signature || null,
      ...data
    });
  }

  getHash() {
    return utils.soliditySha3(
      { type: 'address', value: this.liability },
      { type: 'bytes', value: utils.bytesToHex(base58.decode(this.result)) },
      { type: 'bool', value: this.success }
    );
  }
}
