export default class Base {
  constructor() {
    this._props = [];
  }

  initProps(data) {
    const hasOwnProperty = Object.prototype.hasOwnProperty;
    function _has(object, key) {
      return object != null && hasOwnProperty.call(object, key);
    }
    this._props.forEach(name => {
      if (!_has(data, name)) {
        throw new Error(`Not found property: ${name}`);
      }
      if (
        name === "cost" ||
        name === "deadline" ||
        name === "lighthouseFee" ||
        name === "nonce"
      ) {
        this[name] = Number(data[name]);
      } else {
        this[name] = data[name];
      }
    });
  }

  toObject() {
    const data = {};
    this._props.forEach(name => {
      data[name] = this[name];
    });
    return data;
  }

  encode() {
    const msg = this.toObject();
    if (msg.signature) {
      msg.signature = msg.signature.replace(/0x/i, "");
    }
    return Buffer.from(JSON.stringify(msg));
  }
}
