import Base from './base'

export default class Bid extends Base {
  constructor(data) {
    super();
    this.props = [...this.props, 'lighthouseFee']
    this.initProps(data)
  }
}
