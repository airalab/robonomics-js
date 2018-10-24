import Base from './base'

export default class Result extends Base {
  constructor(data) {
    super();
    this._props = ['liability', 'result', 'success', 'signature']
    this.initProps(data)
  }
}
