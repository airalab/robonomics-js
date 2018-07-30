import Base from './base'

export default class Ask extends Base {
  constructor(data) {
    super();
    this._props = [...this._props, 'validator', 'validatorFee']
    this.initProps({
      validator: '0x0000000000000000000000000000000000000000',
      validatorFee: 0,
      ...data
    })
  }
}
