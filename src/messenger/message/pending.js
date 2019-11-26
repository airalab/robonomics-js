import Base from "./base";

export default class Pending extends Base {
  constructor(data) {
    super();
    this._props = ["tx"];
    this.initProps(data);
  }
}
