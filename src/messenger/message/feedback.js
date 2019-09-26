import Base from './base';

export default class Feedback extends Base {
  constructor(data) {
    super();
    this._props = ['order', 'accepted', 'signature'];
    this.initProps(data);
  }
}
