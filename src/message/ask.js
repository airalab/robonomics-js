import Base from './base'

export default class Ask extends Base {
  constructor(data) {
    super();
    this.props = [...this.props, 'objective', 'validator', 'validatorFee']
    this.initProps(data)
  }
}
