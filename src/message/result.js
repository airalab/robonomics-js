import Base from './base'

export default class Result extends Base {
  constructor(data) {
    super();
    this.props = ['liability', 'result']
    this.initProps(data)
  }
}
