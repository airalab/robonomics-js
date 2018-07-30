export default class Abstract {
  constructor() {
    if (this.constructor === Abstract) {
      throw new TypeError("Can not construct abstract class.")
    }
  }

  ready() {
    throw new TypeError("Do not call abstract method foo from child.")
  }

  push(channel, msg) {
    throw new TypeError("Do not call abstract method foo from child.")
  }

  watch(channel, cb) {
    throw new TypeError("Do not call abstract method foo from child.")
  }
}
