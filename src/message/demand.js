import Base from './base'

export default class Demand extends Base {
  constructor(data) {
    super();
    this._props = [...this._props, 'validatorFee']
    this.initProps({
      validator: '0x0000000000000000000000000000000000000000',
      validatorFee: 0,
      ...data
    })
  }
}
