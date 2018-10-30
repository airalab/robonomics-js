import Base from './base'

export default class Offer extends Base {
  constructor(data) {
    super();
    this._props = [...this._props, 'lighthouseFee']
    this.initProps({
      validator: '0x0000000000000000000000000000000000000000',
      lighthouseFee: 0,
      ...data
    })
  }
}
