import Base from './base'

export default class Bid extends Base {
  constructor(data) {
    super();
    this._props = [...this._props, 'lighthouseFee']
    this.initProps({
      lighthouseFee: 0,
      ...data
    })
  }
}
