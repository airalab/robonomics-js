import Base from './base';
import { utils } from '../../web3Utils';
import { base58 } from '../../utils';

export default class Demand extends Base {
  constructor(data) {
    super();
    this._props = [
      'model',
      'objective',
      'token',
      'cost',
      'lighthouse',
      'validator',
      'validatorFee',
      'deadline',
      'sender',
      'nonce',
      'signature'
    ];
    this.initProps({
      validator: '0x0000000000000000000000000000000000000000',
      validatorFee: 0,
      nonce: data.nonce || 0,
      signature: data.signature || null,
      ...data
    });
  }

  getHash() {
    return utils.soliditySha3(
      { type: 'bytes', value: utils.bytesToHex(base58.decode(this.model)) },
      { type: 'bytes', value: utils.bytesToHex(base58.decode(this.objective)) },
      { type: 'address', value: this.token },
      { type: 'uint256', value: String(Number(this.cost)) },
      { type: 'address', value: this.lighthouse },
      { type: 'address', value: this.validator },
      { type: 'uint256', value: String(Number(this.validatorFee)) },
      { type: 'uint256', value: String(Number(this.deadline)) },
      { type: 'uint256', value: this.nonce },
      { type: 'address', value: this.sender }
    );
  }
}
