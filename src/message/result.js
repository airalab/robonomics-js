import Base from './base'

export default class Result extends Base {
  constructor(data) {
    super();
    this._props = ['liability', 'result', 'signature']
    this.initProps(data)
  }
}
